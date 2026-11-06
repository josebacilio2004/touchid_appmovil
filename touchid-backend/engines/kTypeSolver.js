/**
 * kTypeSolver.js - Motor de Razonamiento Proposicional Determinista para Preguntas K-Type
 * Diseñado para resolver evaluaciones médicas y universitarias complejas (UDABOL, Moodle, ENAM)
 * donde las alternativas representan combinaciones booleanas de enunciados (1,2,3; 2,3,4; etc.).
 */

const K_TYPE_REGEX = /(?:patr[oó]n\s*de\s*respuestas|con\s*respecto\s*a\s*los\s*siguientes\s*enunciados|\b1\s*,\s*2\s*y\s*3\b|\b2\s*,\s*3\s*y\s*4\b|\b2\s*y\s*3\s*son\s*verdaderos\b|\b1\s*y\s*4\s*es\s*verdadero\b|identifica\s*cu[aá]les\s*son\s*(?:verdader[oa]s?|fals[oa]s?)|\b1\s*\.\s*.+\b2\s*\.\s*.+\b3\s*\.\s*)/i;

/**
 * Detecta si una pregunta corresponde al formato K-Type
 */
function isKTypeQuestion(questionText = '', options = []) {
  const fullText = `${questionText} ${(options || []).join(' ')}`;
  return K_TYPE_REGEX.test(fullText);
}

/**
 * Detecta la polaridad lógica que solicita la pregunta K-Type:
 * - true  => busca proposiciones VERDADERAS ("identifica cuáles son verdaderos" o doble negación "falsos, excepto")
 * - false => busca proposiciones FALSAS ("identifica cuáles son falsos" sin "excepto", o "verdaderos, excepto")
 */
function detectKTypeTargetPolarity(questionText = '') {
  const clean = String(questionText || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Doble negación: "identifica cuales son falsos, excepto" -> busca los VERDADEROS
  if (/identifica\s*cuales\s*son\s*(?:los\s*)?(?:enunciados\s*)?(?:fals[oa]s?|incorrect[oa]s?)\s*,?\s*excepto/i.test(clean)) {
    return true;
  }

  // 2. "identifica cuales son verdaderos, excepto" -> busca los FALSOS
  if (/identifica\s*cuales\s*son\s*(?:los\s*)?(?:enunciados\s*)?(?:verdader[oa]s?|correct[oa]s?)\s*,?\s*excepto/i.test(clean)) {
    return false;
  }

  // 3. Polaridad negativa directa: "identifica cuales son falsos" / "identifica cuales son incorrectos"
  // Nota: Se evalúa después del encabezado "E si todos son FALSOS o VERDADEROS" buscando la cláusula de instrucción
  if (/(?:identifica|senale|indique|marque)\s*cuales\s*son\s*(?:los\s*)?(?:enunciados\s*)?(?:fals[oa]s?|incorrect[oa]s?)\b/i.test(clean)) {
    return false;
  }

  if (/cuales\s*(?:de\s*los\s*siguientes\s*)?(?:enunciados\s*)?son\s*(?:fals[oa]s?|incorrect[oa]s?)(?!\s*,?\s*excepto)/i.test(clean)) {
    return false;
  }

  return true;
}

/**
 * Esquema estricto para forzar a Gemini/Claude a razonar proposición por proposición
 */
const K_TYPE_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    target_polarity: {
      type: 'STRING',
      description: 'Qué pide identificar la pregunta final: "VERDADEROS" (si pide verdaderos o "falsos, excepto") o "FALSOS" (si pide falsos o "verdaderos, excepto").'
    },
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
            description: 'Valor de verdad científico intrínseco del enunciado (true si el enunciado es anatómicamente verdadero, false si contiene algún error).'
          }
        },
        required: ['index', 'fact_check', 'is_true']
      }
    },
    true_indices: {
      type: 'ARRAY',
      items: { type: 'INTEGER' },
      description: 'Lista ordenada de números de proposición que cumplen lo solicitado (ej: [2, 3]).'
    },
    suggested_letter: {
      type: 'STRING',
      description: 'Letra del patrón canónico (A=1,2,3; B=2,3,4; C=2,3; D=1,4; E=todos verdaderos o todos falsos).'
    },
    explanation: {
      type: 'STRING',
      description: 'Justificación concisa en máximo 15 palabras.'
    },
    subject: {
      type: 'STRING',
      description: 'Materia temática (ej: Anatomía, Embriología, Imagenología).'
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
  const clean = String(optionText || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
 * Si el vector booleano dio una combinación huérfana (ej. [2], [3], [1,2], [3,4]) que no existe
 * en las alternativas del DOM, encuentra la opción numérica más cercana sin caer erróneamente en E.
 */
function findClosestOptionIndex(targetIndices = [], options = []) {
  if (!targetIndices || targetIndices.length === 0 || !options || options.length === 0) {
    return -1;
  }
  const targetSet = new Set(targetIndices);
  let bestIdx = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < options.length; i++) {
    const sig = normalizeOptionSignature(options[i]);
    if (!sig || sig === 'all_or_none') continue;
    const nums = sig.split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
    if (nums.length === 0) continue;

    // Calcular intersección menos diferencia simétrica
    let intersection = 0;
    for (const n of nums) {
      if (targetSet.has(n)) intersection++;
    }
    const symDiff = (nums.length - intersection) + (targetSet.size - intersection);
    const score = (intersection * 2) - symDiff;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestScore > 0 ? bestIdx : -1;
}

/**
 * Resuelve deterministamente la opción correcta a partir del vector booleano evaluado
 * y la polaridad de la pregunta ("identifica cuáles son verdaderos" vs "identifica cuáles son falsos").
 */
function resolveKTypeDeterministically(llmResult, options = [], questionText = '') {
  if (!llmResult || !Array.isArray(llmResult.propositions) || llmResult.propositions.length === 0) {
    return null;
  }

  const targetTruth = detectKTypeTargetPolarity(questionText);

  // 1. Extraer los índices que cumplen con la polaridad solicitada por la pregunta
  const evaluatedTrue = llmResult.propositions
    .filter(p => Boolean(p.is_true) === true)
    .map(p => p.index)
    .sort((a, b) => a - b);

  const evaluatedFalse = llmResult.propositions
    .filter(p => Boolean(p.is_true) === false)
    .map(p => p.index)
    .sort((a, b) => a - b);

  const targetIndices = targetTruth ? evaluatedTrue : evaluatedFalse;
  const signature = targetIndices.join(',');

  // 2. Determinar si TODOS son verdaderos o TODOS son falsos
  const totalProps = llmResult.propositions.length;
  const isAllTrue = evaluatedTrue.length === totalProps && totalProps >= 3;
  const isAllFalse = evaluatedTrue.length === 0 && totalProps >= 3;

  let bestIndex = -1;
  let bestText = '';

  // 3. Buscar coincidencia exacta en las opciones reales provistas por el DOM
  if (options && options.length > 0) {
    // 3a. Si todas las proposiciones son verdaderas o todas son falsas -> buscar "TODOS VERDADEROS O FALSOS"
    if (isAllTrue || isAllFalse) {
      for (let i = 0; i < options.length; i++) {
        const optSig = normalizeOptionSignature(options[i]);
        if (optSig === 'all_or_none' || /todos?\s*(son\s*)?(falsos?|verdaderos?)|ningun[ao]/i.test(options[i])) {
          bestIndex = i;
          bestText = options[i];
          break;
        }
      }
    }

    // 3b. Buscar por firma numérica exacta (ej: "2,3,4" -> opción "B 2,3 y 4" o "2,3, 4")
    if (bestIndex === -1 && signature.length > 0) {
      for (let i = 0; i < options.length; i++) {
        const optSig = normalizeOptionSignature(options[i]);
        if (optSig === signature) {
          bestIndex = i;
          bestText = options[i];
          break;
        }
      }
    }

    // 4. Si la combinación dio un subconjunto parcial (ej: [2] o [1,2]) que no está en las opciones,
    // buscar primero si la letra sugerida por el LLM (cuando no es 'E') coincide con alguna opción,
    // o usar la opción numérica con mayor solapamiento (evitando caer falsamente en E).
    if (bestIndex === -1 && !isAllTrue && !isAllFalse) {
      const closestIdx = findClosestOptionIndex(targetIndices, options);
      if (closestIdx !== -1) {
        bestIndex = closestIdx;
        bestText = options[closestIdx];
      }
    }

    // 5. Si aún no coincidió, buscar por la letra impresa al inicio del texto de la opción
    if (bestIndex === -1) {
      const canonicalMatch = CANONICAL_PATTERNS[signature];
      const targetLetter = canonicalMatch ? canonicalMatch.defaultLetter : (llmResult.suggested_letter || 'C');

      for (let i = 0; i < options.length; i++) {
        const firstCharMatch = String(options[i] || '').trim().match(/^([A-E])[\s\.\:\)\-]/i);
        if (firstCharMatch && firstCharMatch[1].toUpperCase() === targetLetter.toUpperCase()) {
          bestIndex = i;
          bestText = options[i];
          break;
        }
      }
    }

    // 6. Fallback seguro al primer índice disponible si no se resolvió
    if (bestIndex === -1) {
      bestIndex = 0;
      bestText = options[0];
    }
  }

  // ⚠️ CRÍTICO: correct_option_letter SIEMPRE debe representar la posición física del radio button
  // en la pantalla del alumno (A=0, B=1, C=2, D=3, E=4) para que la vibración háptica y el selector
  // por índice apunten al botón correcto aunque UDABOL baraje los textos ("B 2,3 y 4" en el índice 0).
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
  const positionalLetter = (bestIndex >= 0 && bestIndex < alphabet.length)
    ? alphabet[bestIndex]
    : (llmResult.suggested_letter || 'A');

  const polarityLabel = targetTruth ? 'VERDADEROS' : 'FALSOS';
  const defaultExplanation = targetTruth
    ? `Enunciados verdaderos: [${evaluatedTrue.join(', ')}].`
    : `Pide FALSOS: [${evaluatedFalse.join(', ')}] son falsos (verdaderos: [${evaluatedTrue.join(', ')}]).`;

  return {
    correct_option_index: bestIndex,
    correct_option_letter: positionalLetter,
    correct_option_text: bestText || `Opción ${positionalLetter}`,
    explanation: llmResult.explanation || defaultExplanation,
    subject: llmResult.subject || 'Medicina / Anatomía',
    thought: `[Busca: ${polarityLabel}] ` + llmResult.propositions.map(p => `P${p.index}: ${p.is_true ? 'V' : 'F'} (${p.fact_check})`).join(' | '),
    true_indices: evaluatedTrue,
    false_indices: evaluatedFalse,
    target_indices: targetIndices,
    target_polarity: polarityLabel,
    is_k_type: true
  };
}

module.exports = {
  isKTypeQuestion,
  detectKTypeTargetPolarity,
  K_TYPE_RESPONSE_SCHEMA,
  resolveKTypeDeterministically
};
