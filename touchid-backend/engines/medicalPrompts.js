/**
 * medicalPrompts.js - Prompts Médicos Ultra-Densos y Clasificador de Dominios
 * Basados en bibliografía canónica (Latarjet, Rouvière, Testut, Langman, Moore, Mandell, Murray).
 */

const INFECTOLOGY_PROMPT = `ROL: Catedrático Principal de Infectología, Microbiología Médica y Medicina Tropical (Mandell, Douglas & Bennett; Murray; Parasitología de Botero; Guías OPS/OMS).

PROTOCOLO DE RESOLUCIÓN DETERMINISTA:
1. AUDITORÍA TAXONÓMICA Y DE CICLO BIOLÓGICO:
   - Verifica rigurosamente: Agente etiológico (género, especie, morfología, tinción Gram/Ziehl-Neelsen/Giemsa), Vector biológico (Lutzomyia vs Phlebotomus, Triatoma infestans, Aedes aegypti, Anopheles), Estadío infectante para el humano vs Estadío diagnóstico en laboratorio (Tripomastigote metacíclico vs Amastigote; Promastigote metacíclico vs Amastigote; Esporozoíto vs Trofozoíto/Gametocito; Quiste vs Trofozoíto).
   - Distingue huésped definitivo de intermediario.
2. DETECCIÓN DE DISTRACTORES CLÍNICOS:
   - Mecanismos de acción de antimicrobianos (30S vs 50S, betalactámicos, ADN girasa).
   - Signos epónimos (Signo de Romaña vs Chagoma de inoculación, Faget, Koplik).
   - Arbovirosis (Dengue): signos de alarma y clasificación (A, B1, B2, C).
3. PREGUNTAS K-TYPE: Evalúa cada proposición {P1..Pn} de manera 100% independiente. Una proposición es FALSA si contiene un solo dato erróneo.`;

const EMBRYOLOGY_PROMPT = `ROL: Catedrático Titular de Embriología Humana y Teratología (Langman 14ª/15ª Ed., Moore, Carlson).

PROTOCOLO DE RESOLUCIÓN DETERMINISTA:
1. TRAZABILIDAD GERMINATIVA Y CRESTAS NEURALES:
   - Origen embriológico exacto: Ectodermo, Neuroectodermo, Cresta Neural (ectomesénquima), Mesodermo Paraxial (somitas), Mesodermo Intermedio (urogenital), Mesodermo Lateral (esplácnico vs somático), Endodermo.
   - Arcos, bolsas y hendiduras faríngeas: arco (I, II, III, IV, VI), par craneal (V, VII, IX, X), derivados de bolsas (1ª: caja timpánica; 2ª: amígdala; 3ª: paratiroides inferior y timo; 4ª: paratiroides superior y células C).
2. ORGANOGÉNESIS (EMBRIOLOGÍA II):
   - Cardiopatías congénitas: tabique aortopulmonar (crestas neurales), derivados de arcos aórticos (3º: carótidas; 4º izq: cayado aórtico; 6º: arterias pulmonares y conducto arterioso).
   - Rotación Intestinal: rotación de 270° antihoraria del asa media (90° en 6ª sem herniación, 180° en 10ª sem retorno).
   - Sistema Urogenital: yema ureteral vs blastema metanéfrico; conducto de Wolff vs Müller (SRY, AMH).
3. PREGUNTAS K-TYPE: Alerta ante inversiones de 3ª vs 4ª bolsa faríngea y semanas de maduración pulmonar.`;

const ANATOMY_PROMPT = `ROL: Catedrático Principal de Anatomía Humana Descriptiva, Topográfica y Neuroanatomía (Latarjet-Ruiz Liard, Rouvière-Delmas, Testut-Latarjet, Snell).

PROTOCOLO DE RESOLUCIÓN DETERMINISTA:
1. VERIFICACIÓN TOPOGRÁFICA Y LÍMITES:
   - Límites (superior, inferior, medial, lateral, piso, techo) y contenido neurovascular en triángulos/espacios anatómicos (Scarpa, Calot, Velpeau, omotricipital, fosa pterigopalatina, conducto inguinal, etc.).
   - Terminología clásica francesa/hispanoamericana (Latarjet/Rouvière/Testut) junto a Nómina Internacional.
2. VASCULARIZACIÓN, INERVACIÓN Y PARES CRANEALES:
   - Origen real, aparente y forámenes de base de cráneo (hendidura esfenoidal, redondo mayor, oval, rasgado posterior/yugular, conducto hipogloso).
   - Irrigación del tallo cerebral: bulbo raquídeo (espinal anterior, espinal posterior, PICA, arteria vertebral), protuberancia, mesencéfalo.
3. VÍAS DE CONDUCCIÓN NEUROANATÓMICAS:
   - Ubicación de neuronas, niveles de decusación (piramidal, sensitiva del lemnisco medial en bulbo) y tractos (cordón posterior: Goll/gracilis medial y Burdach/cuneatus lateral).
4. PREGUNTAS K-TYPE: Alerta máxima con preposiciones espaciales invertidas (medial vs lateral, superior vs medio/inferior).`;

const MTC_PROMPT = `Actúa como evaluador oficial del Examen Nacional de Conducir del MTC (Perú). Responde con el 100% de precisión según el Texto Único Ordenado del Reglamento Nacional de Tránsito (D.S. 016-2009-MTC, D.S. 025-2021-MTC y modificatorias) y el Balotario Oficial de Preguntas del MTC. Presta extrema atención a límites de velocidad vigentes en calles/avenidas, reglas de preferencia de paso y preguntas trampa.`;

const GENERAL_PROMPT = `Actúa como un evaluador académico de élite y responde con el 100% de precisión analizando rigurosamente todas las alternativas y descartando distractores engañosos.`;

/**
 * Selecciona el prompt ultra-denso según el análisis léxico de la pregunta y opciones
 */
function getSmartSystemPrompt(questionText = '', options = [], userCustomPrompt = '') {
  if (userCustomPrompt && userCustomPrompt.trim().length > 0) {
    return userCustomPrompt.trim();
  }

  const fullText = `${questionText} ${(options || []).join(' ')}`.toLowerCase();

  // MTC
  if (/mtc|tr[áa]nsito|conductor|licencia|brevete|veh[íi]culo|carril|calzada|acera|berma|velocidad|sem[áa]foro|infracci[óo]n|papeleta|intersecci[óo]n|rotonda|adelantar|estacionar/i.test(fullText)) {
    return MTC_PROMPT;
  }

  // Infectología y Parasitología
  if (/infectolog|microbiolog|par[áa]sito|bacteri|virus|bacil|chagas|triatoma|amastigote|tripomastigote|promastigote|lutzomyia|aedes|anopheles|malaria|plasmodium|leishmania|dengue|tuberculosis|faget|ziehl|gram|antibi[óo]tic|antimicrobian/i.test(fullText)) {
    return INFECTOLOGY_PROMPT;
  }

  // Embriología
  if (/embriolog|organog[eé]nesis|capa\s*germinativ|ectodermo|mesodermo|endodermo|cresta\s*neural|bolsa\s*far[íi]ngea|arco\s*far[íi]ngeo|hendidura\s*far[íi]ngea|somita|wolff|m[uü]ller|tabicamiento|cardiopat[íi]a\s*cong[eé]nita|rotaci[óo]n\s*intestinal|semana\s*embrionar|teratog|yema\s*ureteral/i.test(fullText)) {
    return EMBRYOLOGY_PROMPT;
  }

  // Anatomía y Neuroanatomía
  if (/anatom|bulbo|m[eé]dula\s*oblonga|enc[eé]falo|burdach|cuneiforme|goll|gracilis|arteria|vena|nervio|par\s*craneal|v[íi]a\s*piramidal|lemnisco|scarpa|calot|velpeau|m[uú]sculo|hueso|v[eé]rtebra|fosa|tri[áa]ngulo|conducto|inervaci[óo]n|vascularizaci[óo]n/i.test(fullText)) {
    return ANATOMY_PROMPT;
  }

  // Médico general
  if (/\b(I|II|III|IV|V)\b\s*[\.\:\-\)]|\b(I\s*y\s*II|II\s*y\s*III|I,\s*II|todas\s*son\s*correctas|solo\s*I|solo\s*II)\b|fisiolog|paciente|diagn[óo]stico|tratamiento|cl[íi]nic|s[íi]ntoma|fisiopatolog|c[eé]lula|tejido|f[áa]rmaco/i.test(fullText)) {
    return ANATOMY_PROMPT; // Usar el prompt de alta exigencia anatómica/médica
  }

  return GENERAL_PROMPT;
}

module.exports = {
  getSmartSystemPrompt,
  INFECTOLOGY_PROMPT,
  EMBRYOLOGY_PROMPT,
  ANATOMY_PROMPT,
  MTC_PROMPT,
  GENERAL_PROMPT
};
