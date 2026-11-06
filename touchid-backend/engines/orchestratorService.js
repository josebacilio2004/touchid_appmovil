/**
 * orchestratorService.js - Caché Semántico Invariante al Orden y Coalescencia de Peticiones
 * Garantiza respuestas en < 15ms para exámenes grupales simultáneos o preguntas repetidas,
 * re-mapeando automáticamente la letra correcta aunque las opciones aparezcan en orden distinto.
 */

const crypto = require('crypto');
const { LRUCache } = require('lru-cache');
const { isKTypeQuestion, resolveKTypeDeterministically } = require('./kTypeSolver');

// L1 Cache en memoria (hasta 10,000 preguntas, TTL 24 horas)
const l1Cache = new LRUCache({
  max: 10000,
  ttl: 1000 * 60 * 60 * 24
});

// Mapa de promesas activas para agrupar consultas en vuelo idénticas
const inFlightRequests = new Map();

/**
 * Normaliza una cadena de texto para hacer comparaciones canónicas
 */
function normalizeText(str = '') {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(?:pregunta\s*\d+[\s:.-]*|\d+[\s.)-]+)/i, '')
    .replace(/^[a-e][.)-]\s*/i, '') // Solo quitar prefijos con signo explícito ("a) ", "b. ", "c- ")
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Genera una firma SHA-256 única para la pregunta y sus alternativas (invariante al orden de las opciones)
 */
function buildCanonicalSignature(questionText = '', optionsArray = []) {
  const normQ = normalizeText(questionText);
  const normOpts = (optionsArray || []).map(opt => normalizeText(opt)).sort().join('|');
  const rawPayload = `${normQ}::${normOpts}`;
  return crypto.createHash('sha256').update(rawPayload).digest('hex');
}

/**
 * Re-mapea la respuesta de caché al orden específico de alternativas del alumno actual
 */
function mapCachedAnswerToStudentOptions(cachedEntry, studentOptions = [], questionText = '') {
  if (!cachedEntry || !studentOptions || studentOptions.length === 0) {
    return null;
  }

  // 1. Si es pregunta K-Type y tiene vector booleano guardado
  if (cachedEntry.is_k_type && Array.isArray(cachedEntry.true_indices)) {
    const trueSet = new Set(cachedEntry.true_indices);
    const mockLlm = {
      propositions: [1, 2, 3, 4].map(idx => ({
        index: idx,
        is_true: trueSet.has(idx),
        fact_check: ''
      })),
      suggested_letter: cachedEntry.correct_option_letter,
      explanation: cachedEntry.explanation,
      subject: cachedEntry.subject
    };
    const resolved = resolveKTypeDeterministically(mockLlm, studentOptions, questionText || cachedEntry.question || '');
    if (resolved) {
      return {
        ...resolved,
        from_cache: true,
        cache_level: cachedEntry._cacheLevel || 'L1_RAM'
      };
    }
  }

  // 2. Coincidencia por texto normalizado de la respuesta en pasadas estrictas
  const rawTarget = String(cachedEntry.canonical_answer_text || cachedEntry.correct_option_text || '').trim();
  const targetNorm = normalizeText(rawTarget);
  if (!targetNorm) {
    return null;
  }

  let bestIndex = -1;

  // Pasada 1 (Prioridad Absoluta): Coincidencia exacta
  for (let i = 0; i < studentOptions.length; i++) {
    const optNorm = normalizeText(studentOptions[i]);
    if (optNorm === targetNorm) {
      bestIndex = i;
      break;
    }
  }

  // Pasada 1.2: Si es K-Type (ej. "B 2,3 y 4" vs "2,3, 4"), comparar sin la letra inicial impresa
  if (bestIndex === -1 && isKTypeQuestion(questionText, studentOptions)) {
    const stripKLetter = (s) => normalizeText(String(s || '').replace(/^\s*[a-e]\s+(?=\d|todos)/i, ''));
    const targetK = stripKLetter(rawTarget);
    if (targetK) {
      for (let i = 0; i < studentOptions.length; i++) {
        if (stripKLetter(studentOptions[i]) === targetK) {
          bestIndex = i;
          break;
        }
      }
    }
  }

  // Pasada 1.5: Equivalencia Canónica de "Todas" y "Ninguna"
  const isAllVariants = /^(todas|todas las anteriores|todas son correctas|todas son verdaderas|todos|todos son correctos)$/i.test(targetNorm);
  const isNoneVariants = /^(ninguna|ninguna de las anteriores|ninguna es correcta|ninguna es verdadera|ninguno)$/i.test(targetNorm);

  if (bestIndex === -1 && (isAllVariants || isNoneVariants)) {
    for (let i = 0; i < studentOptions.length; i++) {
      const optNorm = normalizeText(studentOptions[i]);
      if (isAllVariants && /^(todas|todas las anteriores|todas son correctas|todas son verdaderas|todos|todos son correctos)$/i.test(optNorm)) {
        bestIndex = i;
        break;
      }
      if (isNoneVariants && /^(ninguna|ninguna de las anteriores|ninguna es correcta|ninguna es verdadera|ninguno)$/i.test(optNorm)) {
        bestIndex = i;
        break;
      }
    }
  }

  // Pasada 2 (Fallback Subcadena Seguro): Solo si ninguna coincidió exactamente
  if (bestIndex === -1 && !isAllVariants && !isNoneVariants) {
    let minLenDiff = Infinity;
    for (let i = 0; i < studentOptions.length; i++) {
      const optNorm = normalizeText(studentOptions[i]);
      if (!optNorm) continue;

      let isMatch = false;
      // Prohibir coincidencia por subcadena si hay números romanos distintos (ej. "Clase II" en "Clase III")
      const hasRoman = /\b(i|ii|iii|iv|v|vi)\b/i.test(targetNorm) || /\b(i|ii|iii|iv|v|vi)\b/i.test(optNorm);
      if (targetNorm.length <= 4 || hasRoman) {
        const escaped = targetNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordRegex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'i');
        if (wordRegex.test(optNorm) && !hasRoman) {
          isMatch = true;
        }
      } else {
        if (optNorm.includes(targetNorm) || targetNorm.includes(optNorm)) {
          isMatch = true;
        }
      }

      if (isMatch) {
        const lenDiff = Math.abs(optNorm.length - targetNorm.length);
        if (lenDiff < minLenDiff) {
          minLenDiff = lenDiff;
          bestIndex = i;
        }
      }
    }
  }

  // ⚠️ CRÍTICO: Si no se encontró ninguna opción del alumno que coincida con la respuesta guardada,
  // NO asumir la opción 'A'. Retornar null para que el backend active la IA con los prompts médicos.
  if (bestIndex === -1) {
    return null;
  }

  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
  const resolvedLetter = alphabet[bestIndex] || 'A';
  const resolvedText = studentOptions[bestIndex];

  return {
    correct_option_index: bestIndex,
    correct_option_letter: resolvedLetter,
    correct_option_text: resolvedText,
    explanation: cachedEntry.explanation || '',
    subject: cachedEntry.subject || 'General',
    thought: cachedEntry.thought || 'Resuelto desde Caché Semántico Ultrarrápido.',
    is_k_type: cachedEntry.is_k_type || false,
    confidence: 0.99,
    from_cache: true,
    cache_level: cachedEntry._cacheLevel || 'L1_RAM'
  };
}

module.exports = {
  l1Cache,
  inFlightRequests,
  normalizeText,
  buildCanonicalSignature,
  mapCachedAnswerToStudentOptions
};
