/**
 * orchestratorService.js - Caché Semántico Invariante al Orden y Coalescencia de Peticiones
 * Garantiza respuestas en < 15ms para exámenes grupales simultáneos o preguntas repetidas,
 * re-mapeando automáticamente la letra correcta aunque las opciones aparezcan en orden distinto.
 */

const crypto = require('crypto');
const { LRUCache } = require('lru-cache');

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
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(?:pregunta\s*\d+[\s:.-]*|\d+[\s.)-]+)/i, '')
    .replace(/^[a-e][\s.)-]+/i, '')
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
function mapCachedAnswerToStudentOptions(cachedEntry, studentOptions = []) {
  if (!cachedEntry || !studentOptions || studentOptions.length === 0) {
    return null;
  }

  // 1. Si es pregunta K-Type y tiene vector booleano guardado
  if (cachedEntry.is_k_type && cachedEntry.true_indices) {
    const { resolveKTypeDeterministically } = require('./kTypeSolver');
    const mockLlm = {
      propositions: cachedEntry.true_indices.map(idx => ({ index: idx, is_true: true, fact_check: '' })),
      suggested_letter: cachedEntry.correct_option_letter,
      explanation: cachedEntry.explanation,
      subject: cachedEntry.subject
    };
    const resolved = resolveKTypeDeterministically(mockLlm, studentOptions);
    if (resolved) {
      return {
        ...resolved,
        from_cache: true,
        cache_level: cachedEntry._cacheLevel || 'L1_RAM'
      };
    }
  }

  // 2. Coincidencia por texto normalizado de la respuesta
  const targetNorm = normalizeText(cachedEntry.canonical_answer_text || cachedEntry.correct_option_text || '');
  let bestIndex = -1;

  for (let i = 0; i < studentOptions.length; i++) {
    const optNorm = normalizeText(studentOptions[i]);
    if (optNorm === targetNorm || (targetNorm.length > 3 && (optNorm.includes(targetNorm) || targetNorm.includes(optNorm)))) {
      bestIndex = i;
      break;
    }
  }

  const alphabet = ['A', 'B', 'C', 'D', 'E'];
  const resolvedLetter = bestIndex !== -1 ? alphabet[bestIndex] : (cachedEntry.correct_option_letter || 'A');
  const resolvedText = bestIndex !== -1 ? studentOptions[bestIndex] : cachedEntry.correct_option_text;

  return {
    correct_option_index: bestIndex !== -1 ? bestIndex : (cachedEntry.correct_option_index ?? 0),
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
