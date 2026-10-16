/**
 * kTypeSolver.js - Motor de Razonamiento Proposicional Determinista para Preguntas K-Type
 * Diseñado para resolver evaluaciones médicas y universitarias complejas (UDABOL, Moodle, ENAM)
 * donde las alternativas representan combinaciones booleanas de enunciados (1,2,3; 2,3,4; etc.).
 */

const K_TYPE_REGEX = /(?:patr[oó]n\s*de\s*respuestas|con\s*respecto\s*a\s*los\s*siguientes\s*enunciados|\b1\s*,\s*2\s*y\s*3\b|\b2\s*,\s*3\s*y\s*4\b|\b2\s*y\s*3\s*son\s*verdaderos\b|\b1\s*y\s*4\s*es\s*verdadero\b|identifica\s*cu[aá]les\s*son\s*verdaderos|\b1\s*\.\s*.+\b2\s*\.\s*.+\b3\s*\.\s*)/i;

/**
 * Detecta si una pregunta corresponde al formato K-Type
 */
function isKTypeQuestion(questionText = '', options = []) {
  const fullText = `${questionText} ${(options || []).join(' ')}`;
  return K_TYPE_REGEX.test(fullText);
}

/**
 * Esquema estricto para forzar a Gemini a razonar proposición por proposición
 */
const K_TYPE_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    propositions: {
      type: 'ARRAY',
      description: 'Evaluación atómica independiente de cada proposición numerada (1, 2, 3, 4).',
      items: {
        type: 'OBJECT',
        properties: {
          index: { type: 'INTEGER', description: 'Número de la proposición (1, 2, 3, 4, etc.)' },
          fact_check: {
            type: 'STRING',
            description: 'Verificación anatómica/científica rigurosa citando estructuras o conceptos exactos.'
          },
          is_true: {
            type: 'BOOLEAN',
            description: 'Valor de verdad definitivo (true si es 100% correcta, false si contiene algún error).'
          }
        },
        required: ['index', 'fact_check', 'is_true']
      }
    },
    true_indices: {
      type: 'ARRAY',
      items: { type: 'INTEGER' },
      description: 'Lista ordenada de números de proposición que resultaron verdaderas (ej: [2, 3]).'
    },
    suggested_letter: {
      type: 'STRING',
      description: 'Letra sugerida de la opción.'
    },
    explanation: {
      type: 'STRING',
      description: 'Justificación concisa en máximo 15 palabras.'
    },
    subject: {
      type: 'STRING',
      description: 'Materia temática (ej: Anatomía, Embriología, Infectología).'
    }
  },
  required: ['propositions', 'true_indices', 'suggested_letter', 'explanation', 'subject']
};

/**
 * Mapeo Canónico Estándar de Estados K-Type
 */
const CANONICAL_PATTERNS = {
  '1,2,3': { targetKey: '1,2,3', defaultLetter: 'A' },
  '2,3,4': { targetKey: '2,3,4', defaultLetter: 'B' },
  '2,3':   { targetKey: '2,3',   defaultLetter: 'C' },
  '1,4':   { targetKey: '1,4',   defaultLetter: 'D' },
  '1,2,3,4': { targetKey: 'all', defaultLetter: 'E' },
  '':        { targetKey: 'none', defaultLetter: 'E' }
};

/**
 * Normaliza texto de opción para buscar coincidencias booleanas
 */
function normalizeOptionSignature(optionText = '') {
  const clean = optionText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/todos?\s*(son\s*)?(falsos?|verdaderos?)|ningun[ao]/i.test(clean)) {
    return 'all_or_none';
  }

  const numbers = [];
  const matches = clean.match(/\b([1-4])\b/g);
  if (matches) {
    matches.forEach(m => {
      const n = parseInt(m, 10);
      if (!numbers.includes(n)) numbers.push(n);
    });
  }
  return numbers.sort((a, b) => a - b).join(',');
}

/**
 * Resuelve deterministamente la opción correcta a partir del vector booleano evaluado
 */
function resolveKTypeDeterministically(llmResult, options = []) {
  if (!llmResult || !Array.isArray(llmResult.propositions)) {
    return null;
  }

  // 1. Extraer los índices verdaderos directos de la evaluación atómica
  const evaluatedTrue = llmResult.propositions
    .filter(p => p.is_true === true)
    .map(p => p.index)
    .sort((a, b) => a - b);

  const signature = evaluatedTrue.join(',');

  // 2. Determinar si coincide con "todos verdaderos" o "todos falsos"
  const totalProps = llmResult.propositions.length;
  const isAllTrue = evaluatedTrue.length === totalProps && totalProps >= 3;
  const isAllFalse = evaluatedTrue.length === 0;

  let bestIndex = -1;
  let bestLetter = llmResult.suggested_letter || 'C';
  let bestText = '';

  // 3. Buscar coincidencia exacta en las opciones reales provistas por el DOM
  if (options && options.length > 0) {
    for (let i = 0; i < options.length; i++) {
      const optSig = normalizeOptionSignature(options[i]);

      if (isAllTrue || isAllFalse) {
        if (optSig === 'all_or_none' || /todos?\s*(son\s*)?(falsos?|verdaderos?)|ningun[ao]/i.test(options[i])) {
          bestIndex = i;
          bestText = options[i];
          break;
        }
      }

      if (optSig === signature && signature.length > 0) {
        bestIndex = i;
        bestText = options[i];
        break;
      }
    }

    // 4. Si no coincidió por firma exacta, buscar por la letra que aparece en el texto de la opción
    if (bestIndex === -1) {
      const canonicalMatch = CANONICAL_PATTERNS[signature];
      const targetLetter = canonicalMatch ? canonicalMatch.defaultLetter : (llmResult.suggested_letter || 'C');

      for (let i = 0; i < options.length; i++) {
        const firstCharMatch = options[i].trim().match(/^([A-E])[\s\.\:\)\-]/i);
        if (firstCharMatch && firstCharMatch[1].toUpperCase() === targetLetter.toUpperCase()) {
          bestIndex = i;
          bestText = options[i];
          bestLetter = targetLetter;
          break;
        }
      }
    }

    // 5. Fallback seguro al primer índice disponible si no se resolvió
    if (bestIndex === -1) {
      bestIndex = 0;
      bestText = options[0];
    }

    // Extraer letra limpia de la opción (ej: de "C 2 y 3" -> "C", o del índice A=0, B=1, etc.)
    const letterMatch = bestText.trim().match(/^([A-E])\b/i);
    if (letterMatch) {
      bestLetter = letterMatch[1].toUpperCase();
    } else {
      const alphabet = ['A', 'B', 'C', 'D', 'E'];
      bestLetter = alphabet[bestIndex] || 'C';
    }
  }

  return {
    correct_option_index: bestIndex,
    correct_option_letter: bestLetter,
    correct_option_text: bestText || `Opción ${bestLetter}`,
    explanation: llmResult.explanation || `Verificados enunciados verdaderos: [${evaluatedTrue.join(', ')}]`,
    subject: llmResult.subject || 'Medicina / Anatomía',
    thought: llmResult.propositions.map(p => `P${p.index}: ${p.is_true ? 'V' : 'F'} (${p.fact_check})`).join(' | '),
    true_indices: evaluatedTrue,
    is_k_type: true
  };
}

module.exports = {
  isKTypeQuestion,
  K_TYPE_RESPONSE_SCHEMA,
  resolveKTypeDeterministically
};
