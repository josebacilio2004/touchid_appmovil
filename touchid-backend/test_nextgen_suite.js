/**
 * test_nextgen_suite.js - Suite de Pruebas Unitarias y de Integración Local
 * Valida el Motor K-Type, Caché Semántico, Clasificador Médico y Deduplicación
 */

const { isKTypeQuestion, resolveKTypeDeterministically } = require('./engines/kTypeSolver');
const { getSmartSystemPrompt } = require('./engines/medicalPrompts');
const {
  l1Cache,
  buildCanonicalSignature,
  mapCachedAnswerToStudentOptions,
  normalizeText
} = require('./engines/orchestratorService');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
  }
}

console.log('====================================================');
console.log('🧪 INICIANDO TEST SUITE NEXT-GEN v3.0 (LOCAL SANDBOX)');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST 1: Detección Heurística de Preguntas K-Type
// ----------------------------------------------------
console.log('📌 Módulo 1: Detección de Preguntas K-Type');
const sampleKQuestion = `LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS, Con respecto a los siguientes enunciados identifica cuales son verdaderos: 1. El encéfalo va a pertenecer al sistema nervioso periférico 2. La vascularización arterial de la médula oblonga se da por la espinal anterior, espinal posterior y cerebelosa anteroinferior 3. El tracto de burdach o cuneiforme se va a localizar en el cordón posterior (porción lateral) y finaliza en el núcleo cuneiforme del bulbo 4. La cara posterior del bulbo raquídeo se va a dividir en tres mitades: superior medio inferior`;
const sampleKOptions = [
  'A 1,2 y 3',
  'B 2,3 y 4',
  'D 1 y 4',
  'E TODOS VERDADEROS O FALSOS',
  'C 2 y 3'
];

assert(isKTypeQuestion(sampleKQuestion, sampleKOptions) === true, 'Detecta correctamente formato PATRON DE RESPUESTAS');

const normalQuestion = '¿Cuál es la arteria principal del brazo?';
const normalOptions = ['Arteria humeral', 'Arteria radial', 'Arteria cubital'];
assert(isKTypeQuestion(normalQuestion, normalOptions) === false, 'Descarta correctamente pregunta estándar');

// ----------------------------------------------------
// TEST 2: Resolución Determinista K-Type (Caso Real Anatomía 24/60)
// ----------------------------------------------------
console.log('\n📌 Módulo 2: Resolución Matemática Unívoca (Caso Anatomía UDABOL)');

// Simulación de la salida estructurada de Gemini con CoT atómico:
// P1 = Falso (Encéfalo pertenece al SNC, no al SNP)
// P2 = Verdadero (Espinal anterior, posterior y cerebelosa anteroinferior / PICA)
// P3 = Verdadero (Burdach o cuneiforme en cordón posterior lateral hacia núcleo cuneiforme)
// P4 = Falso (La cara posterior se divide en dos porciones: extraventricular e intraventricular, no tres mitades)
const mockGeminiKTypeOutput = {
  propositions: [
    { index: 1, is_true: false, fact_check: 'El encéfalo pertenece al Sistema Nervioso Central (SNC).' },
    { index: 2, is_true: true, fact_check: 'La vascularización bulbar proviene de espinal anterior, posterior y ramas cerebelosas.' },
    { index: 3, is_true: true, fact_check: 'El tracto cuneiforme se sitúa lateralmente en cordón posterior y termina en núcleo cuneatus.' },
    { index: 4, is_true: false, fact_check: 'La cara posterior se divide en porción inferior (extraventricular) y superior (ventricular), no en tres mitades.' }
  ],
  true_indices: [2, 3],
  suggested_letter: 'C',
  explanation: 'Son verdaderos únicamente los enunciados 2 y 3.',
  subject: 'Anatomía Humana'
};

const resolvedKType = resolveKTypeDeterministically(mockGeminiKTypeOutput, sampleKOptions);

assert(resolvedKType !== null, 'El resolvedor retorna un objeto válido');
assert(resolvedKType.correct_option_letter === 'C', `Letra resuelta correcta: Esperado 'C', obtenido '${resolvedKType.correct_option_letter}'`);
assert(resolvedKType.correct_option_index === 4, `Índice de opción correcto con orden permutado: Esperado 4, obtenido ${resolvedKType.correct_option_index}`);
assert(resolvedKType.correct_option_text === 'C 2 y 3', `Texto de opción correcto: Esperado 'C 2 y 3', obtenido '${resolvedKType.correct_option_text}'`);
assert(resolvedKType.true_indices.length === 2 && resolvedKType.true_indices[0] === 2 && resolvedKType.true_indices[1] === 3, 'Vector de proposiciones extraído correctamente [2, 3]');

// ----------------------------------------------------
// TEST 3: Clasificador Léxico de Dominios Médicos
// ----------------------------------------------------
console.log('\n📌 Módulo 3: Clasificador Léxico de Dominio Médico Ultra-Denso');

const promptAnatomy = getSmartSystemPrompt('bulbo raquídeo médula oblonga tracto de burdach', []);
assert(promptAnatomy.includes('Latarjet-Ruiz Liard'), 'Selecciona prompt de Anatomía Humana y Neuroanatomía');

const promptEmbryology = getSmartSystemPrompt('derivados de la tercera bolsa faríngea y crestas neurales en el tabicamiento cardíaco', []);
assert(promptEmbryology.includes('Langman'), 'Selecciona prompt de Embriología Humana y Teratología');

const promptInfectology = getSmartSystemPrompt('estadío infectante de Triatoma infestans en la enfermedad de Chagas y signos de alarma de Dengue', []);
assert(promptInfectology.includes('Mandell, Douglas & Bennett'), 'Selecciona prompt de Infectología y Medicina Tropical');

const promptMTC = getSmartSystemPrompt('límite máximo de velocidad en calles y avenidas según el MTC', []);
assert(promptMTC.includes('Reglamento Nacional de Tránsito'), 'Selecciona prompt del MTC Perú');

// ----------------------------------------------------
// TEST 4: Caché Semántico Invariante al Orden y Coalescencia
// ----------------------------------------------------
console.log('\n📌 Módulo 4: Caché Semántico L1 (Order-Invariant Hashing)');

// Estudiante 1 tiene opciones en orden A, B, C, D, E
const qText = '¿Cuál es la función principal del nódulo auriculoventricular de Aschoff-Tawara?';
const student1Opts = ['Acelerador cardíaco', 'Retrasar el impulso cardíaco', 'Generador ectópico'];
const sig1 = buildCanonicalSignature(qText, student1Opts);

// Estudiante 2 tiene las MISMAS opciones pero barajadas por la plataforma
const student2Opts = ['Retrasar el impulso cardíaco', 'Generador ectópico', 'Acelerador cardíaco'];
const sig2 = buildCanonicalSignature(qText, student2Opts);

assert(sig1 === sig2, 'Las firmas SHA-256 son idénticas independientemente del orden de las alternativas');

// Guardar en L1 Cache
const cachedResult = {
  canonical_answer_text: 'retrasar el impulso cardiaco',
  correct_option_letter: 'B',
  correct_option_text: 'Retrasar el impulso cardíaco',
  correct_option_index: 1,
  explanation: 'El nodo AV retrasa la conducción para el llenado ventricular.',
  subject: 'Fisiología Cardíaca'
};
l1Cache.set(sig1, cachedResult);

// Re-mapear para Estudiante 2 (en su examen está en el índice 0)
const student2Resolved = mapCachedAnswerToStudentOptions(cachedResult, student2Opts);
assert(student2Resolved.correct_option_index === 0, `Estudiante 2 recibe índice re-mapeado 0 (obtenido ${student2Resolved.correct_option_index})`);
assert(student2Resolved.correct_option_letter === 'A', `Estudiante 2 recibe letra re-mapeada 'A' (obtenido '${student2Resolved.correct_option_letter}')`);
assert(student2Resolved.from_cache === true, 'Se resuelve directamente desde L1 RAM');

console.log('\n====================================================');
console.log(`📊 RESULTADOS: ${passedTests} de ${totalTests} pruebas superadas con éxito (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
