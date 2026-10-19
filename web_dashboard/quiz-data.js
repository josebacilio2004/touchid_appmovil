// Banco de Preguntas Multidisciplinario para el Simulador Web TouchID
export const QUIZ_CATEGORIES = [
  {
    "id": "udabol_anatomia_ktype",
    "isUdabol": true,
    "title": "🧠 UDABOL: Anatomía Humana II (Patrón K-Type Oficial)",
    "subtitle": "Examen Oficial Completo • Carpeta Pedagógica Digital",
    "badge": "UDABOL Oficial",
    "badgeColor": "#7cb305",
    "subjectCode": "MED-102: Anatomía Humana II - Neuroanatomía",
    "sessionName": "Examen 2-2025",
    "description": "Simulador 1:1 de 20 preguntas con Patrón de Respuestas combinadas (A si 1,2,3; B si 2,3,4; C si 2,3; D si 1,4; E si todos son verdaderos o falsos). Diseñado para validar el motor proposicional determinista.",
    "questions": [
      {
        "id": "udabol_anat_k1",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS, Con respecto a los siguientes enunciados identifica cuales son verdaderos:\n1. El encéfalo va a pertenecer al sistema nervioso periférico\n2. La vascularización arterial de la médula oblonga se da por la espinal anterior, espinal posterior y cerebelosa anteroinferior\n3. El tracto de burdach o cuneiforme se va a localizar en el cordón posterior (porción lateral) y finaliza en el núcleo cuneiforme del bulbo\n4. La cara posterior del bulbo raquídeo se va a dividir en tres mitades: superior medio inferior",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS",
          "C 2 y 3"
        ],
        "correctIndex": 4,
        "explanation": "Enunciados 2 y 3 son VERDADEROS. 1 es FALSO (el encéfalo pertenece al SNC) y 4 es FALSO (la cara posterior se divide en porciones extraventricular e intraventricular, no en tres mitades)."
      },
      {
        "id": "udabol_anat_k2",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a la fosa pterigopalatina y sus relaciones topográficas:\n1. Se comunica anteriormente con la órbita a través de la hendidura esfenomaxilar (fisura orbitaria inferior)\n2. Su contenido principal incluye el nervio maxilar (V2) y la arteria maxilar interna en su porción terminal\n3. El ganglio pterigopalatino de Meckel se ubica suspendido del nervio maxilar en esta fosa\n4. La pared anterior está formada por la apófisis pterigoides del hueso esfenoides",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 0,
        "explanation": "1, 2 y 3 son VERDADEROS. La pared anterior está formada por la tuberosidad del maxilar (no por la apófisis pterigoides, que forma la pared posterior)."
      },
      {
        "id": "udabol_anat_k3",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a la estructura y relaciones del mesencéfalo:\n1. El origen aparente del III par craneal (oculomotor) emerge en la cara posterior del mesencéfalo\n2. La sustancia negra de Soemmering separa el pie peduncular del tegmento mesencefálico\n3. El núcleo rojo se localiza a nivel de los colículos superiores en la calota mesencefálica\n4. El acueducto cerebral de Silvio comunica el tercer ventrículo con el cuarto ventrículo",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 1,
        "explanation": "2, 3 y 4 son VERDADEROS. El enunciado 1 es FALSO (el III par emerge en la cara anterior, en la fosa interpeduncular; el IV es el único posterior)."
      },
      {
        "id": "udabol_anat_k4",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En cuanto a la protuberancia anular (puente de Varolio):\n1. Su cara anterior presenta el surco basilar por donde discurre la arteria basilar\n2. El nervio abducens (VI par) tiene su origen aparente en la cara anterolateral del puente junto con el trigémino\n3. La porción basilar del puente contiene únicamente fibras sensitivas ascendentes del lemnisco medial\n4. El núcleo motor del nervio facial rodea al núcleo abducens produciendo el colículo facial (eminencia teres) en el piso del 4to ventrículo",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 3,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (el VI par emerge en el surco bulboprotuberancial) y 3 es FALSO (contiene fibras corticoespinales descendentes y corticopontinas)."
      },
      {
        "id": "udabol_anat_k5",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a la circulación del líquido cefalorraquídeo (LCR):\n1. La mayor parte del LCR se reabsorbe activamente a nivel de los plexos coroideos de los ventrículos laterales\n2. El agujero de Magendie es un orificio par lateral que comunica con el espacio epidural\n3. La presión normal del LCR en decúbito lateral en el adulto supera los 400 mm de agua\n4. Los agujeros de Luschka se ubican en el techo del tercer ventrículo comunicando con la cisterna magna",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 4,
        "explanation": "TODOS SON FALSOS. El LCR se reabsorbe en vellosidades aracnoideas (Pacchioni); Magendie es orificio medial único; presión normal es 70-180 mmH2O; Luschka están en los recesos laterales del 4to ventrículo."
      },
      {
        "id": "udabol_anat_k6",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a la anatomía y conexiones del cerebelo:\n1. El arquicerebelo (lóbulo floculonodular) se encarga primordialmente del control del tono muscular antigravitatorio\n2. El núcleo dentado es el núcleo intracerebeloso más grande y filogenéticamente más moderno (neocerebelo)\n3. Las fibras aferentes trepadoras del cerebelo proceden exclusivamente del complejo olivar inferior bulbar\n4. El pedúnculo cerebeloso medio conecta el cerebelo con el mesencéfalo y conduce las fibras eferentes dentotalámicas",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 2,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (arquicerebelo controla equilibrio y coordinación vestibular) y 4 es FALSO (el pedúnculo medio conecta con la protuberancia)."
      },
      {
        "id": "udabol_anat_k7",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación al polígono arterial de Willis en la base cerebral:\n1. La arteria comunicante anterior une las dos arterias cerebrales anteriores\n2. La arteria comunicante posterior comunica la arteria carótida interna con la arteria cerebral posterior\n3. La arteria basilar termina bifurcándose en las dos arterias cerebrales posteriores\n4. La arteria cerebral media forma parte intrínseca del polígono de Willis cerrando su sector lateral",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 0,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO (la arteria cerebral media es rama terminal de la carótida interna, pero NO integra el heptágono/polígono de Willis)."
      },
      {
        "id": "udabol_anat_k8",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a los orificios de la base del cráneo y los elementos que los atraviesan:\n1. El agujero redondo mayor (foramen rotundum) da paso a la arteria meníngea media\n2. El agujero oval permite el paso del nervio mandibular (V3) y la arteria meníngea accesoria\n3. Por la hendidura esfenoidal (fisura orbitaria superior) transcurren los pares III, IV, VI y las ramas del nervio oftálmico (V1)\n4. El foramen yugular (agujero rasgado posterior) da paso a la vena yugular interna y los pares craneales IX, X y XI",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 1,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO (el redondo mayor da paso al nervio maxilar V2; la meníngea media atraviesa el redondo menor o espinoso)."
      },
      {
        "id": "udabol_anat_k9",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a la vía motora voluntaria (haz corticoespinal o piramidal):\n1. Se origina principalmente en las células piramidales gigantes de Betz del área motora primaria (área 4 de Brodmann)\n2. A nivel del brazo anterior de la cápsula interna se sitúa el haz corticoespinal destinado a miembros inferiores\n3. En el mesencéfalo ocupa el tegmento posterior inmediatamente por detrás del acueducto de Silvio\n4. Aproximadamente el 85-90% de las fibras decusan en la decusación piramidal bulbar inferior formando el haz corticoespinal lateral",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 3,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (ocupa los dos tercios anteriores del brazo POSTERIOR) y 3 es FALSO (ocupa los 3/5 medios del PIE peduncular anterior)."
      },
      {
        "id": "udabol_anat_k10",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a los núcleos talámicos y sus relevos funcionales:\n1. El núcleo ventral posterolateral (VPL) recibe la sensibilidad somatosensorial del tronco y extremidades\n2. El núcleo ventral posteromedial (VPM) recibe la sensibilidad trigeminal y gustativa de la cabeza\n3. El cuerpo geniculado lateral actúa como estación de relevo de la vía visual hacia la corteza calcarina\n4. El cuerpo geniculado medial actúa como estación de relevo de la vía auditiva procedente del colículo inferior",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 4,
        "explanation": "TODOS SON VERDADEROS. VPL (cuerpo/extremidades), VPM (cara/gusto), CGL (visión) y CGM (audición)."
      },
      {
        "id": "udabol_anat_k11",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En cuanto a las vías de la sensibilidad propioceptiva y tacto discriminativo epicrítico:\n1. El fascículo de Goll (grácil) conduce información del miembro superior y hemitórax superior\n2. Las neuronas de segundo orden de esta vía se sitúan en los núcleos grácil y cuneiforme en el bulbo raquídeo\n3. Las fibras arciformes internas decusan en el bulbo para formar el lemnisco medial (cinta de Reil media)\n4. El lemnisco medial asciende y termina directamente en la corteza sensitiva sin hacer relevo en el tálamo",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 2,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (Goll conduce de miembros inferiores y tronco T6 hacia abajo) y 4 es FALSO (hace relevo obligatorio en el VPL del tálamo)."
      },
      {
        "id": "udabol_anat_k12",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Sobre el nervio trigémino (V par craneal):\n1. Es un nervio mixto, sensitivo para la cara y motor para los músculos de la masticación\n2. El ganglio sensitivo semilunar de Gasser se aloja en el cavum de Meckel en la fosa craneal media\n3. La división mandibular (V3) es la única que contiene tanto fibras sensitivas como fibras motoras somáticas\n4. La rama oftálmica (V1) inerva la piel de la mejilla y las piezas dentarias del maxilar superior",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 0,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO (esa es función de la rama maxilar V2; V1 inerva frente, párpado superior y dorso nasal)."
      },
      {
        "id": "udabol_anat_k13",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto al trayecto y ramas del nervio facial (VII par):\n1. Emerge del cráneo a través del foramen oval junto a la arteria carótida interna\n2. En su trayecto intrapetroso discurre por el acueducto de Falopio (conducto facial)\n3. El nervio cuerda del tímpano proporciona sensibilidad gustativa a los dos tercios anteriores de la lengua\n4. Emerge de la base del cráneo a través del agujero estilomastoideo antes de penetrar en la glándula parótida",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 1,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO (entra por el conducto auditivo interno y sale por el agujero estilomastoideo)."
      },
      {
        "id": "udabol_anat_k14",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación al seno cavernoso y sus relaciones neurovasculares:\n1. La arteria carótida interna y el nervio abducens (VI par) atraviesan el interior de la luz venosa del seno cavernoso\n2. Por su pared lateral transcurren el nervio facial y el nervio hipogloso mayor\n3. Drena directamente hacia la vena subclavia a través del seno longitudinal inferior\n4. En la pared lateral del seno cavernoso se disponen de arriba abajo: III par, IV par, nervio oftálmico (V1) y nervio maxilar (V2)",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 3,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (VII y XII no se relacionan con el seno cavernoso) y 3 es FALSO (drena por senos petrosos hacia la vena yugular interna)."
      },
      {
        "id": "udabol_anat_k15",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a las áreas de Brodmann en la corteza cerebral:\n1. El área motora primaria corresponde a las áreas 1, 2 y 3 ubicadas en la circunvolución parietal ascendente\n2. El área auditiva primaria se localiza en el lóbulo occipital alrededor de la cisura calcarina (área 17)\n3. El área motora del lenguaje articulado de Broca se sitúa en el polo temporal izquierdo (área 22)\n4. El área visual primaria se sitúa en la circunvolución frontal superior ocupando el área 4",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 4,
        "explanation": "TODOS SON FALSOS. Área 4 es motora primaria; 41-42 temporal es auditiva; Broca es 44-45 frontal; área 17 occipital es visual primaria."
      },
      {
        "id": "udabol_anat_k16",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Sobre la vía óptica y el reflejo fotomotor:\n1. En el quiasma óptico decusan únicamente las fibras procedentes de las hemirretinas temporales\n2. En el quiasma óptico decusan las fibras procedentes de las hemirretinas nasales\n3. La cintilla óptica contiene fibras de la hemirretina temporal ipsilateral y hemirretina nasal contralateral\n4. La lesión completa del quiasma óptico produce amaurosis monocular derecha",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 2,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (decusan las nasales) y 4 es FALSO (la lesión quiasmática produce hemianopsia bitemporal heterónima clásica)."
      },
      {
        "id": "udabol_anat_k17",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a los ganglios basales y núcleos del telencéfalo:\n1. El cuerpo estriado está compuesto anatómicamente por el núcleo caudado y el núcleo lenticular\n2. El núcleo lenticular se divide en putamen lateral y globo pálido medial\n3. El núcleo caudado acompaña la curvatura del ventrículo lateral presentando cabeza, cuerpo y cola\n4. El claustro o antemuro es una masa nuclear que se localiza medial al globo pálido",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 0,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO (el claustro se localiza lateral al putamen, entre la cápsula externa y la cápsula extrema)."
      },
      {
        "id": "udabol_anat_k18",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto al nervio vago (X par craneal) e inervación laríngea:\n1. Emerge del bulbo raquídeo a través del surco preolivar junto con el nervio hipogloso\n2. El nervio laríngeo recurrente izquierdo rodea el cayado aórtico por detrás del ligamento arterioso\n3. El nervio laríngeo recurrente derecho rodea la arteria subclavia derecha\n4. Todos los músculos intrínsecos de la laringe son inervados por el nervio laríngeo recurrente, excepto el músculo cricotiroideo (inervado por el laríngeo superior)",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 1,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO (el X par emerge del surco retroolivar; el XII emerge del preolivar)."
      },
      {
        "id": "udabol_anat_k19",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En cuanto a la anatomía macroscópica de la médula espinal y sus envolturas:\n1. En el adulto promedio la médula espinal finaliza a nivel del borde inferior de L1 o borde superior de L2 (cono medular)\n2. La punción lumbar para extracción de LCR se realiza rutinariamente a nivel del espacio L1-L2 para evitar el fondo de saco dural\n3. El espacio epidural espinal es virtual y no contiene tejido adiposo ni plexos venosos\n4. Los ligamentos dentados son prolongaciones laterales de la piamadre que fijan la médula a la duramadre entre las raíces anteriores y posteriores",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 3,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (la punción lumbar se realiza en L3-L4 o L4-L5 para evitar dañar la médula) y 3 es FALSO (el espacio epidural espinal es un espacio REAL con grasa y plexos de Batson)."
      },
      {
        "id": "udabol_anat_k20",
        "question": "PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a la cadena simpática y sistema autónomo cervical:\n1. El ganglio estrellado (cervicotorácico) resulta frecuentemente de la fusión del ganglio cervical inferior con el primer ganglio torácico\n2. Se localiza por delante de la apófisis transversa de C7 y el cuello de la primera costilla\n3. La lesión de la vía simpática cervical produce el síndrome de Claude Bernard-Horner (ptosis, miosis y anhidrosis facial ipsilateral)\n4. Los ramos comunicantes blancos contienen fibras preganglionares mielinizadas procedentes de la médula espinal T1 a L2",
        "options": [
          "A 1,2 y 3",
          "B 2,3 y 4",
          "C 2 y 3",
          "D 1 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 4,
        "explanation": "TODOS SON VERDADEROS. Fusión de C8-T1, situación C7/1ra costilla, síndrome de Horner por desaferentación simpática, y ramos blancos mielinizados T1-L2."
      }
    ]
  },
  {
    "id": "udabol_embrio",
    "isUdabol": true,
    "title": "🏥 UDABOL: Embriología II (MED-202-11390)",
    "subtitle": "Examen 2-2025 • Carpeta Pedagógica Digital",
    "badge": "UDABOL Oficial",
    "badgeColor": "#7cb305",
    "subjectCode": "MED-202-11390: Embriología II - NM - A",
    "sessionName": "Examen 2-2025",
    "description": "Simulador 1:1 de evaluación oficial en la Carpeta Pedagógica Digital de la Universidad de Aquino Bolivia (UDABOL). Banco oficial de 20 preguntas con el formato exacto del portal.",
    "questions": [
      {
        "id": "udabol_embrio_1",
        "question": "ANTES DEL NACIMIENTO LOS PULMONES ESTAN LLENOS DE",
        "options": [
          "PROTEINAS ESCASAS",
          "TODOS",
          "LIQUIDO CON ALTO CONTENIDO DE CLORO",
          "NINGUNO",
          "CIERTA CANTIDAD DE MOCO"
        ],
        "correctIndex": 2,
        "explanation": "Antes del nacimiento, los pulmones fetales están distendidos y llenos de un líquido rico en cloro, con escasas proteínas, algo de moco y surfactante sintetizado por los neumocitos tipo II."
      },
      {
        "id": "udabol_embrio_2",
        "question": "¿EN QUE SEMANA DEL DESARROLLO EMBRIONARIO COMIENZA A PRODUCIRSE SURFACTANTE PULMONAR EN CANTIDAD SIGNIFICATIVA POR LOS NEUMOCITOS TIPO II?",
        "options": [
          "SEMANA 12 A 16",
          "SEMANA 24 A 28",
          "SEMANA 34 A 36",
          "SEMANA 18 A 20",
          "SEMANA 8 A 10"
        ],
        "correctIndex": 1,
        "explanation": "Hacia la semana 24-28 (periodo canalicular/sacular), los neumocitos tipo II inician la secreción de surfactante pulmonar, alcanzando niveles óptimos hacia la semana 34."
      },
      {
        "id": "udabol_embrio_3",
        "question": "EL TABIQUE INTERAURICULAR PRIMARIO (SEPTUM PRIMUM) PRESENTA UNA PERFORACION ANTES DE CERRARSE POR COMPLETO DENOMINADA:",
        "options": [
          "FORAMEN OVAL",
          "OSTIUM SECUNDUM",
          "CONDUCTO ARTERIOSO",
          "OSTIUM PRIMUM",
          "SENO VENOSO"
        ],
        "correctIndex": 1,
        "explanation": "Antes de que el septum primum se una a las almohadillas endocárdicas, se producen perforaciones apoptóticas en su porción superior que confluyen formando el ostium secundum."
      },
      {
        "id": "udabol_embrio_4",
        "question": "¿CUAL DE LAS SIGUIENTES ESTRUCTURAS EMBRIONARIAS DA ORIGEN AL LIGAMENTO REDONDO DEL HIGADO EN EL ADULTO TRAS EL NACIMIENTO?",
        "options": [
          "CONDUCTO VENOSO DE ARANCIO",
          "VENA UMBILICAL IZQUIERDA",
          "ARTERIA UMBILICAL DERECHA",
          "ALANTOIDES",
          "CONDUCTO ARTERIOSO"
        ],
        "correctIndex": 1,
        "explanation": "La vena umbilical izquierda se oblitera tras el nacimiento para formar el ligamento redondo del hígado (ligamentum teres hepatis)."
      },
      {
        "id": "udabol_embrio_5",
        "question": "LA HERNIACION FISIOLOGICA DEL ASA INTESTINAL MEDIA HACIA EL CORDON UMBILICAL OCURRE NORMALMENTE DURANTE:",
        "options": [
          "LA 4TA A 6TA SEMANA",
          "LA 6TA A 10MA SEMANA",
          "LA 12VA A 16TA SEMANA",
          "LA 2DA A 4TA SEMANA",
          "EL TERCER TRIMESTRE"
        ],
        "correctIndex": 1,
        "explanation": "El asa intestinal primitiva se hernia hacia el celoma del cordón umbilical en la 6ta semana debido al gran volumen hepático y mesonéfrico, retornando al abdomen en la 10ma semana."
      },
      {
        "id": "udabol_embrio_6",
        "question": "EL PRIMER ARCO FARINGEO (MANDIBULAR) RECIBE SU INERVACION MOTORA Y SENSITIVA PRINCIPAL A TRAVES DEL PAR CRANEAL:",
        "options": [
          "VII (FACIAL)",
          "V (TRIGEMINO - RAMA V3)",
          "IX (GLOSOFARINGEO)",
          "X (VAGO)",
          "XII (HIPOGLOSO)"
        ],
        "correctIndex": 1,
        "explanation": "El primer arco faríngeo origina los músculos de la masticación (temporal, masetero, pterigoideos) inervados por el nervio mandibular (V3 del trigémino)."
      },
      {
        "id": "udabol_embrio_7",
        "question": "¿CUAL DE LOS SIGUIENTES COMPONENTES DEL SISTEMA RENAL METANEFRICO PROVIENE DIRECTAMENTE DE LA YEMA URETERAL?",
        "options": [
          "CAPSULA DE BOWMAN",
          "TUBULO CONTORNEADO PROXIMAL",
          "ASA DE HENLE",
          "TUBULOS COLECTORES Y CALICES RENALES",
          "GLOMERULO RENAL"
        ],
        "correctIndex": 3,
        "explanation": "La yema ureteral origina el uréter, pelvis renal, cálices mayores, cálices menores y túbulos colectores. El blastema metanéfrico origina las nefronas secretoras."
      },
      {
        "id": "udabol_embrio_8",
        "question": "EL DIVERTICULO DE MECKEL ES UNA ANOMALIA CONGENITA QUE CORRESPONDE A LA PERSISTENCIA DE:",
        "options": [
          "CONDUCTO ONFALOMESENTERICO (VITELINO)",
          "URACO",
          "CONDUCTO PARAMESONEFRICO DE MULLER",
          "CONDUCTO MESONEFRICO DE WOLFF",
          "SACO VITELINO SECUNDARIO"
        ],
        "correctIndex": 0,
        "explanation": "El divertículo de Meckel se produce por la falta de obliteración de la porción ileal proximal del conducto onfalomesentérico (vitelino)."
      },
      {
        "id": "udabol_embrio_9",
        "question": "LAS CELULAS DE LA CRESTA NEURAL CONTRIBUYEN AL DESARROLLO DE LAS SIGUIENTES ESTRUCTURAS, EXCEPTO:",
        "options": [
          "GANGLIOS DE LA RAIZ DORSAL",
          "MEDULA SUPRARRENAL",
          "MELANOCITOS DE LA PIEL",
          "CELULAS DE SCHWANN",
          "CORTEZA SUPRARRENAL"
        ],
        "correctIndex": 4,
        "explanation": "La corteza suprarrenal deriva del mesodermo intermedio celómico, mientras que la médula suprarrenal deriva de las células de la cresta neural."
      },
      {
        "id": "udabol_embrio_10",
        "question": "EL TIMO Y LAS GLANDULAS PARATIROIDES INFERIORES SE DESARROLLAN EMBRIOLOGICAMENTE A PARTIR DE:",
        "options": [
          "PRIMERA BOLSA FARINGEA",
          "SEGUNDA BOLSA FARINGEA",
          "TERCERA BOLSA FARINGEA",
          "CUARTA BOLSA FARINGEA",
          "SEXTO ARCO AORTICO"
        ],
        "correctIndex": 2,
        "explanation": "La tercera bolsa faríngea origina en su porción dorsal las paratiroides inferiores y en su porción ventral el timo."
      },
      {
        "id": "udabol_embrio_11",
        "question": "EL ESBOZO LARINGOTRAQUEAL RESPIRATORIO APARECE INICIALMENTE EN LA CUARTA SEMANA COMO UNA EVAGINACION DE:",
        "options": [
          "ECTODERMO NEURAL",
          "PARED VENTRAL DEL INTESTINO ANTERIOR",
          "MESODERMO SOMATICO LATERAL",
          "INTESTINO MEDIO",
          "ENDODERMO DEL ALANTOIDES"
        ],
        "correctIndex": 1,
        "explanation": "El primordio respiratorio o divertículo laringotraqueal surge como una excrecencia en la pared ventral del intestino anterior."
      },
      {
        "id": "udabol_embrio_12",
        "question": "EL CUARTO ARCO AORTICO IZQUIERDO PERSISTE EN EL ADULTO DANDO ORIGEN A:",
        "options": [
          "ARTERIA SUBCLAVIA DERECHA",
          "SEGMENTO DEL CAYADO DE LA AORTA",
          "ARTERIAS CAROTIDAS COMUNES",
          "CONDUCTO ARTERIOSO",
          "ARTERIA PULMONAR IZQUIERDA"
        ],
        "correctIndex": 1,
        "explanation": "El cuarto arco aórtico izquierdo contribuye al segmento proximal del cayado aórtico definitivo."
      },
      {
        "id": "udabol_embrio_13",
        "question": "EL CONDUCTO ARTERIOSO DE BOTAL DERIVA EMBRIOLOGICAMENTE DEL:",
        "options": [
          "SEXTO ARCO AORTICO IZQUIERDO (PORCION DISTAL)",
          "CUARTO ARCO AORTICO DERECHO",
          "TERCER ARCO AORTICO IZQUIERDO",
          "QUINTO ARCO AORTICO",
          "TRONCO BRAQUIOCEFALICO"
        ],
        "correctIndex": 0,
        "explanation": "La porción distal del sexto arco aórtico izquierdo conecta la arteria pulmonar con la aorta formando el conducto arterioso fetal."
      },
      {
        "id": "udabol_embrio_14",
        "question": "LA AUSENCIA CONGENITA DE MIGRACION DE CELULAS DE LA CRESTA NEURAL AL PLEXO MIENTERICO DEL COLON OCASIONA:",
        "options": [
          "ATRESIA DUODENAL",
          "MEGACOLON AGANGLIONICO CONGENITO (HIRSCHSPRUNG)",
          "ESTENOSIS PILORICA",
          "VOLVULO INTESTINAL",
          "INTUSUSCEPCION"
        ],
        "correctIndex": 1,
        "explanation": "La falla de migración cráneo-caudal de las células ganglionares parasimpáticas entéricas origina aganglionosis colónica (enfermedad de Hirschsprung)."
      },
      {
        "id": "udabol_embrio_15",
        "question": "LOS CONDUCTOS PARAMESONEFRICOS DE MULLER EN EL EMBRION FEMENINO SE FUSIONAN PARA ORIGINAR:",
        "options": [
          "URETERES Y TRIGONO VESICAL",
          "TROMPAS UTERINAS, UTERO Y CUPULA VAGINAL",
          "OVARIOS Y FOLICULOS PRIMORDIALES",
          "LABIOS MAYORES Y CLITORIS",
          "URETRA FEMENINA"
        ],
        "correctIndex": 1,
        "explanation": "En ausencia de hormona antimülleriana (AMH), los conductos de Müller dan lugar a las trompas de Falopio, el cuerpo y cuello uterino y el tercio superior de la vagina."
      },
      {
        "id": "udabol_embrio_16",
        "question": "LA HERNIA DIAFRAGMATICA CONGENITA POSTEROLATERAL MAS COMUN (DE BOCHDALEK) SE DEBE A UNA FALLA EN EL CIERRE DE:",
        "options": [
          "MEMBRANA PLEUROPERITONEAL",
          "TABIQUE TRANSVERSO ANTERIOR",
          "MESENTERIO DORSAL DEL ESOFAGO",
          "PAREDES CORPORALES LATERALES",
          "FORAMEN DE MORGAGNI"
        ],
        "correctIndex": 0,
        "explanation": "La hernia de Bochdalek se produce por el cierre incompleto de las membranas pleuroperitoneales (predominantemente izquierda, 85-90%)."
      },
      {
        "id": "udabol_embrio_17",
        "question": "EL LIGAMENTO REDONDO DEL UTERO Y EL LIGAMENTO PROPIO DEL OVARIO DERIVAN DEL:",
        "options": [
          "GUBERNACULUM",
          "MESONEFROS",
          "CONDUCTO DE GARTNER",
          "EPIOOFORO",
          "ALANTOIDES"
        ],
        "correctIndex": 0,
        "explanation": "El gubernaculum en el feto femenino persiste como el ligamento útero-ovárico y el ligamento redondo del útero."
      },
      {
        "id": "udabol_embrio_18",
        "question": "LAS CELULAS GERMINALES PRIMORDIALES SE OBSERVAN INICIALMENTE EN LA CUARTA SEMANA EN:",
        "options": [
          "PARED DEL SACO VITELINO CERCA DEL ALANTOIDES",
          "MESODERMO SOMITICO",
          "PLACA NEURAL ECTODERMICA",
          "INTESTINO MEDIO",
          "CAVIDAD AMNIOTICA"
        ],
        "correctIndex": 0,
        "explanation": "Las células germinales primordiales se observan en el endodermo de la pared posterior del saco vitelino antes de migrar a las crestas gonadales."
      },
      {
        "id": "udabol_embrio_19",
        "question": "EL LIGAMENTO UMBILICAL MEDIO DEL ADULTO ES EL REMANENTE OBLITERADO DE LA SIGUIENTE ESTRUCTURA EMBRIONARIA:",
        "options": [
          "URACO (DERIVADO DEL ALANTOIDES)",
          "CONDUCTO VITELINO",
          "ARTERIA UMBILICAL",
          "VENA VITELINA",
          "MEMBRANA CLOACAL"
        ],
        "correctIndex": 0,
        "explanation": "El uraco conecta la cúpula de la vejiga con el ombligo y se fibrosa tras el nacimiento para formar el ligamento umbilical medio."
      },
      {
        "id": "udabol_embrio_20",
        "question": "EL PERIODO DEL DESARROLLO PRENATAL CON MAYOR SENSIBILIDAD A MALFORMACIONES ANATOMICAS MAYORES POR TERATOGENOS ES:",
        "options": [
          "SEMANAS 1 Y 2 (PREIMPLANTACION)",
          "SEMANAS 3 A 8 (PERIODO EMBRIONARIO DE ORGANOGENESIS)",
          "SEMANAS 9 A 12 (FETAL TEMPRANO)",
          "SEMANAS 20 A 24",
          "TERCER TRIMESTRE"
        ],
        "correctIndex": 1,
        "explanation": "El periodo de organogénesis embrionaria (semanas 3 a 8) es la fase crítica donde la exposición a teratógenos induce anomalías congénitas mayores."
      }
    ]
  },
  {
    "id": "udabol_cardio",
    "isUdabol": true,
    "title": "🏥 UDABOL: Cardiología & Cardiopatías Congénitas (MED-301-14210)",
    "subtitle": "Examen 2-2025 • Carpeta Pedagógica Digital",
    "badge": "UDABOL Oficial",
    "badgeColor": "#ef4444",
    "subjectCode": "MED-301-14210: Cardiología Pediátrica & Adultos - NM - B",
    "sessionName": "Examen 2-2025",
    "description": "Evaluación oficial con casos clínicos de cardiopatías congénitas y cardiología clínica. Reproducción exacta del examen de la plataforma UDABOL.",
    "questions": [
      {
        "id": "udabol_cardio_1",
        "question": "LACTANTE DE 3 MESES CON TAQUIPNEA, DIFICULTAD PARA LA ALIMENTACION Y SOPLO CONTINUO EN MAQUINARIA DE GIBSON EN 2DO ESPACIO INTERCOSTAL IZQUIERDO. EL DIAGNOSTICO MAS PROBABLE ES:",
        "options": [
          "TETRALOGIA DE FALLOT",
          "COARTACION DE AORTA",
          "COMUNICACION INTERAURICULAR (CIA)",
          "PERSISTENCIA DEL CONDUCTO ARTERIOSO (PCA)",
          "TRANSPOSICION DE GRANDES VASOS"
        ],
        "correctIndex": 3,
        "explanation": "El soplo continuo sistodiastólico \"en maquinaria\" de Gibson en foco pulmonar con pulsos saltones es patognomónico de PCA."
      },
      {
        "id": "udabol_cardio_2",
        "question": "EN UN PREMATURO CON PERSISTENCIA DEL CONDUCTO ARTERIOSO (PCA) HEMODINAMICAMENTE SIGNIFICATIVO, EL FARMACO DE ELECCION PARA EL CIERRE FARMACOLOGICO ES:",
        "options": [
          "PROSTAGLANDINA E1 (ALPROSTADIL)",
          "IBUPROFENO O INDOMETACINA IV",
          "FUROSEMIDA EN BOLOS",
          "DIGOXINA ORAL",
          "EPINEFRINA"
        ],
        "correctIndex": 1,
        "explanation": "Los inhibidores de la ciclooxigenasa (ibuprofeno o indometacina) suprimen las prostaglandinas vasodilatadoras, favoreciendo la constricción del ductus."
      },
      {
        "id": "udabol_cardio_3",
        "question": "LA CARDIOPATIA CONGENITA CIANOGENA MAS FRECUENTE AL NACIMIENTO EN EL RECIEN NACIDO INMEDIATO ES:",
        "options": [
          "TETRALOGIA DE FALLOT",
          "TRANSPOSICION DE GRANDES ARTERIAS (TGA)",
          "ATRESIA TRICUSPIDEA",
          "TRONCO ARTERIOSO COMUN",
          "ANOMALIA TOTAL DEL RETORNO VENOSO PULMONAR"
        ],
        "correctIndex": 1,
        "explanation": "La TGA es la cardiopatía cianógena más común en el recién nacido (<1 año). La Tetralogía de Fallot es la más frecuente después del año de edad."
      },
      {
        "id": "udabol_cardio_4",
        "question": "LA TETRALOGIA DE FALLOT CLASICA SE CARACTERIZA ANATOMICAMENTE POR LA ASOCIACION DE:",
        "options": [
          "CIV, ESTENOSIS PULMONAR, CABALGAMIENTO AORTICO E HIPERTROFIA VENTRICULAR DERECHA",
          "CIA, ESTENOSIS AORTICA, DEXTROCARDIA E HIPERTROFIA AURICULAR",
          "CIV, PCA, ATRESIA TRICUSPIDEA E HIPERTENSION PULMONAR",
          "ESTENOSIS MITRAL, CIA, COARTACION AORTICA E HIPERTROFIA IZQUIERDA",
          "TGA, CIV, HIPOPLASIA VENTRICULAR E INSUFICIENCIA AORTICA"
        ],
        "correctIndex": 0,
        "explanation": "La tétrada incluye: CIV subaórtica, estenosis infundibular/valvular pulmonar, cabalgamiento de la aorta sobre el tabique e hipertrofia del ventrículo derecho."
      },
      {
        "id": "udabol_cardio_5",
        "question": "ADOLESCENTE CON HIPERTENSION EN BRAZOS, PULSOS FEMORALES DEBILES O RETARDADOS Y EROSIONES COSTALES RADIOLOGICAS (SIGNO DE ROESLER). EL DIAGNOSTICO ES:",
        "options": [
          "ESTENOSIS MITRAL",
          "COARTACION DE AORTA",
          "TETRALOGIA DE FALLOT",
          "COMUNICACION INTERAURICULAR TIPO OSTIUM PRIMUM",
          "ANEURISMA DISECANTE"
        ],
        "correctIndex": 1,
        "explanation": "La coartación aórtica provoca hipertensión en extremidades superiores e hipotensión en miembros inferiores, con circulación colateral intercostal que erosiona las costillas (signo de Roesler)."
      },
      {
        "id": "udabol_cardio_6",
        "question": "EL TIPO DE COMUNICACION INTERAURICULAR (CIA) MAS FRECUENTE, QUE SUPERA EL 70% DE LOS CASOS, CORRESPONDE A:",
        "options": [
          "OSTIUM PRIMUM",
          "OSTIUM SECUNDUM (FOSA OVAL)",
          "SENO VENOSO SUPERIOR",
          "SENO CORONARIO",
          "CANAL AURICULOVENTRICULAR"
        ],
        "correctIndex": 1,
        "explanation": "La CIA tipo ostium secundum en la región de la fosa oval representa el 70-75% de las comunicaciones interauriculares."
      },
      {
        "id": "udabol_cardio_7",
        "question": "A LA AUSCULTACION CARDIACA EN UN PACIENTE CON COMUNICACION INTERAURICULAR (CIA) NO COMPLICADA, EL HALLAZGO PATOGNOMONICO EN EL R2 ES:",
        "options": [
          "R2 UNICO E INTENSO",
          "DESDOBLAMIENTO AMPLIO Y FIJO DEL SEGUNDO RUIDO (R2)",
          "DESDOBLAMIENTO PARADOJICO DEL R2",
          "AUSENCIA DEL COMPONENTE PULMONAR",
          "TERCER RUIDO OBLIGATORIO"
        ],
        "correctIndex": 1,
        "explanation": "El desdoblamiento amplio y fijo de R2 no varía con los ciclos respiratorios debido a la sobrecarga constante de volumen en las cavidades derechas."
      },
      {
        "id": "udabol_cardio_8",
        "question": "EN UN RECIEN NACIDO CIANOTICO CON CARDIOPATIA CONGENITA DUCTUS-DEPENDIENTE, LA MEDIDA TERAPEUTICA URGENTE PARA MANTENER ABIERTO EL DUCTUS ES:",
        "options": [
          "INFUSION CONTINUA DE PROSTAGLANDINA E1 (ALPROSTADIL)",
          "OXIGENOTERAPIA AL 100% EN MASCARILLA",
          "INDOMETACINA EN BOLO INTRAVENOSO",
          "CARDIOVERSION ELECTRICA",
          "DIGOXINA INTRAVENOSA"
        ],
        "correctIndex": 0,
        "explanation": "La prostaglandina E1 (alprostadil) endovenosa dilata y mantiene permeable el conducto arterioso, asegurando la sobrevida inmediata."
      },
      {
        "id": "udabol_cardio_9",
        "question": "LA ANOMALIA DE EBSTEIN (DESPLAZAMIENTO APICAL DE LA VALVULA TRICUSPIDE) SE ASOCIA EN LA GESTACION AL CONSUMO MATERNO DE:",
        "options": [
          "ACIDO VALPROICO",
          "CARBONATO DE LITIO",
          "WARFARINA",
          "TALIDOMIDA",
          "FENITOINA"
        ],
        "correctIndex": 1,
        "explanation": "La exposición intrauterina al litio en el primer trimestre se asocia clásicamente con anomalía de Ebstein y atrialización ventricular."
      },
      {
        "id": "udabol_cardio_10",
        "question": "EN LA RADIOGRAFIA DE TORAX, EL SIGNO DE SILUETA CARDIACA EN \"ZAPATO SUECO\" O \"BOTA\" CON HIPOCAPTACION PULMONAR ES CARACTERISTICO DE:",
        "options": [
          "TETRALOGIA DE FALLOT",
          "TRANSPOSICION DE GRANDES ARTERIAS",
          "PERICARDITIS CONSTRICTIVA",
          "COARTACION AORTICA",
          "DRENAJE VENOSO ANOMALO"
        ],
        "correctIndex": 0,
        "explanation": "La silueta en \"bota\" o \"zueco\" refleja la hipertrofia ventricular derecha con concavidad del tronco de la arteria pulmonar e hipoflujo pulmonar."
      },
      {
        "id": "udabol_cardio_11",
        "question": "EN UNA CRISIS DE HIPOXIA POR TETRALOGIA DE FALLOT, LA MANIOBRA INICIAL QUE AUMENTA LA RESISTENCIA VASCULAR SISTEMICA ES:",
        "options": [
          "COLOCAR AL NINO EN POSICION GENUPECTORAL (RODILLAS AL PECHO)",
          "POSICION DE TRENDELENBURG INVERTIDO",
          "MANIOBRA DE VALSALVA",
          "MASAJE DEL SENO CAROTIDEO",
          "DECUBITO PRONO"
        ],
        "correctIndex": 0,
        "explanation": "La posición genupectoral incrementa las resistencias vasculares periféricas al acodar las femorales, reduciendo el cortocircuito derecha-izquierda."
      },
      {
        "id": "udabol_cardio_12",
        "question": "EL SINDROME DE EISENMENGER EN UNA CARDIOPATIA CON SHUNT IZQUIERDA-DERECHA APARECE TRAS EL DESARROLLO DE:",
        "options": [
          "HIPERTENSION PULMONAR GRAVE CON INVERSION DEL FLUJO A DERECHA-IZQUIERDA Y CIANOSIS",
          "INSUFICIENCIA MITRAL AGUDA CON CHOQUE CARDIOGENICO",
          "FIBRILACION VENTRICULAR",
          "HIPOTENSION SISTEMICA SOSTENIDA",
          "ESTENOSIS SUBVALVULAR AORTICA"
        ],
        "correctIndex": 0,
        "explanation": "El síndrome de Eisenmenger implica cambios vasculares obstructivos pulmonares que elevan las presiones derechas e invierten el shunt, produciendo cianosis."
      },
      {
        "id": "udabol_cardio_13",
        "question": "EL DEFECTO DEL TABIQUE INTERVENTRICULAR (CIV) MAS FRECUENTE CORRESPONDE A LA VARIEDAD:",
        "options": [
          "PERIMEMBRANOSA (MEMBRANOSA)",
          "MUSCULAR (TRABECULAR)",
          "INFUNDIBULAR (SUBCRISTAL)",
          "DE ENTRADA",
          "APICAL"
        ],
        "correctIndex": 0,
        "explanation": "La CIV perimembranosa es la más habitual, constituyendo el 75-80% de todas las comunicaciones interventriculares."
      },
      {
        "id": "udabol_cardio_14",
        "question": "EL SIGNO AUSCULTATORIO TIPICO DE UNA COMUNICACION INTERVENTRICULAR (CIV) RESTRICTIVA (ENFERMEDAD DE ROGER) ES:",
        "options": [
          "SOPLO HOLOSISTOLICO REGURGITANTE RUDO EN MESOCARDIO CON FREMITO",
          "SOPLO DIASTOLICO EN FOCO AORTICO",
          "SOPLO CONTINUO EN MAQUINARIA",
          "CHASQUIDO DE APERTURA MITRAL",
          "SOPLO MESOSISTOLICO SUAVE EN FOCO PULMONAR"
        ],
        "correctIndex": 0,
        "explanation": "La CIV pequeña o enfermedad de Roger genera un soplo holosistólico áspero y rudo en mesocardio con frémito palpable."
      },
      {
        "id": "udabol_cardio_15",
        "question": "LA CARDIOPATIA CONGENITA MAS FRECUENTEMENTE ASOCIADA AL SINDROME DE TURNER (45, X0) ES:",
        "options": [
          "COARTACION DE AORTA Y VALVULA AORTICA BICUSPIDE",
          "TETRALOGIA DE FALLOT",
          "TRANSPOSICION DE GRANDES ARTERIAS",
          "TRONCO ARTERIOSO",
          "CANAL AURICULOVENTRICULAR COMPLETO"
        ],
        "correctIndex": 0,
        "explanation": "El síndrome de Turner se asocia de forma cardinal con válvula aórtica bicúspide (hasta 50%) y coartación aórtica (15-20%)."
      },
      {
        "id": "udabol_cardio_16",
        "question": "LA MALFORMACION CARDIACA CONGENITA MAS HABITUAL EN PACIENTES CON SINDROME DE DOWN (TRISOMIA 21) ES:",
        "options": [
          "DEFECTO DEL CANAL AURICULOVENTRICULAR COMUN (ALMOHADILLAS ENDOCARDICAS)",
          "ESTENOSIS PULMONAR VALVULAR PURA",
          "COARTACION AORTICA SEVERA",
          "ANOMALIA DE EBSTEIN",
          "CORAZON UNIVENTRICULAR"
        ],
        "correctIndex": 0,
        "explanation": "El defecto del tabique auriculoventricular común (canal AV) representa más del 40-50% de las cardiopatías congénitas en la trisomía 21."
      },
      {
        "id": "udabol_cardio_17",
        "question": "EN LA TRANSPOSICION DE GRANDES ARTERIAS (TGA), LA IMAGEN RADIOLOGICA CARACTERISTICA DEL MEDIASTINO Y SILUETA CARDIACA SE DEFINE COMO:",
        "options": [
          "CORAZON EN FORMA DE \"HUEVO ACOSTADO SOBRE UN HILO\"",
          "SILUETA EN BOTA SUIZA",
          "CORAZON EN MATRAZ O CANTIMPLORA",
          "DEXTROCARDIA CON SITUS INVERSUS",
          "SIGNO DEL TRES INVERTIDO"
        ],
        "correctIndex": 0,
        "explanation": "En la TGA la disposición anteroposterior de los grandes vasos estrecha el pedículo superior, proyectando la clásica silueta en huevo colgado de un hilo."
      },
      {
        "id": "udabol_cardio_18",
        "question": "PROCEDIMIENTO PERCUTANEO PALIATIVO DE URGENCIA EN EL NEONATO CON TGA PARA FAVORECER LA MEZCLA SANGUINEA A NIVEL AURICULAR:",
        "options": [
          "SEPTOSTOMIA AURICULAR CON BALON DE RASHKIND",
          "CIRUGIA DE JATENE (SWITCH ARTERIAL)",
          "PROCEDIMIENTO DE NORWOOD",
          "FISTULA DE BLALOCK-TAUSSIG",
          "CERCLAJE DE LA ARTERIA PULMONAR"
        ],
        "correctIndex": 0,
        "explanation": "La septostomía con balón de Rashkind rasga el tabique interauricular aumentando el flujo bidireccional oxigenado."
      },
      {
        "id": "udabol_cardio_19",
        "question": "EL SIGNO RADIOLOGICO DE LA \"FIGURA EN 8\" O \"MUNECO DE NIEVE\" EN LA PLACA DE TORAX CORRESPONDE A:",
        "options": [
          "DRENAJE VENOSO PULMONAR ANOMALO TOTAL SUPRACARDIACO",
          "TETRALOGIA DE FALLOT",
          "COARTACION DE AORTA",
          "ESTENOSIS AORTICA CRITICA",
          "PERSISTENCIA DE VENA CAVA IZQUIERDA"
        ],
        "correctIndex": 0,
        "explanation": "La vena vertical anómala y la vena cava superior forman la sombra superior redondeada (\"cabeza\"), y el corazón agrandado la base (\"cuerpo\") del muñeco de nieve."
      },
      {
        "id": "udabol_cardio_20",
        "question": "EL SOPLO INOCENTE MAS COMUN EN PREESCOLARES Y ESCOLARES SANOS, VIBRATORIO Y MUSICAL EN MESOCARDIO QUE DISMINUYE DE PIE, SE DENOMINA:",
        "options": [
          "SOPLO DE STILL",
          "SOPLO DE AUSTIN FLINT",
          "SOPLO DE CAREY COOMBS",
          "SOPLO DE GRAHAM STEELL",
          "SOPLO DE GIBSON"
        ],
        "correctIndex": 0,
        "explanation": "El soplo de Still es un soplo inocente vibratorio o musical protosistólico que no indica patología orgánica y se atenúa al disminuir el retorno venoso."
      }
    ]
  },
  {
    "id": "udabol_pediatria",
    "isUdabol": true,
    "title": "🏥 UDABOL: Pediatría & Neonatología Clínica (MED-402-16850)",
    "subtitle": "Examen 2-2025 • Carpeta Pedagógica Digital",
    "badge": "UDABOL Oficial",
    "badgeColor": "#0284c7",
    "subjectCode": "MED-402-16850: Pediatría & Neonatología - NM - C",
    "sessionName": "Examen 2-2025",
    "description": "Casos clínicos pediátricos y neonatales: hidratación OMS, test de Apgar, dosis farmacológicas e infecciones frecuentes. Formato oficial de la Carpeta Pedagógica.",
    "questions": [
      {
        "id": "udabol_ped_1",
        "question": "LACTANTE DE 8 MESES CON DIARREA ACUOSA ABUNDANTE SIN MOCO NI SANGRE DE 48 HORAS, OJOS MUY HUNDIDOS, SIGNO DEL PLIEGUE >2 SEGUNDOS Y LETARGIA. EL DIAGNOSTICO Y PLAN ES:",
        "options": [
          "EDA CON DESHIDRATACION GRAVE - PLAN C INTRAVENOSO",
          "DISENTERIA BACTERIANA AGUDA - ANTIBIOTICO ORAL",
          "EDA CON DESHIDRATACION LEVE - PLAN A EN EL HOGAR",
          "TRAUMATISMO CRANEOENCEFALICO OCULTO - TOMOGRAFIA",
          "NEUROINFECCION BACTERIANA PRIMARIA - PUNCION LUMBAR"
        ],
        "correctIndex": 0,
        "explanation": "La letargia, ojos muy hundidos y pliegue cutáneo que desaparece muy lentamente (>2 seg) definen deshidratación grave que requiere Plan C intravenoso inmediato."
      },
      {
        "id": "udabol_ped_2",
        "question": "EVALUACION DE APGAR AL MINUTO 1: FC 120 LPM, ESFUERZO RESPIRATORIO VIGOROSO CON LLANTO, LEVE FLEXION DE MIEMBROS, MUECAS AL ESTIMULO Y ACROCIANOSIS. EL APGAR ES:",
        "options": [
          "APGAR 7",
          "APGAR 8",
          "APGAR 9",
          "APGAR 6",
          "APGAR 10"
        ],
        "correctIndex": 0,
        "explanation": "FC >100 (+2), respiración/llanto (+2), tono flexión (+1), reflejo mueca (+1), color acrocianosis (+1) = Total: 7 puntos."
      },
      {
        "id": "udabol_ped_3",
        "question": "EL AGENTE BACTERIANO MAS FRECUENTE DE MENINGITIS Y SEPSIS NEONATAL DE TRANSMISION VERTICAL EN LAS PRIMERAS 72 HORAS DE VIDA ES:",
        "options": [
          "STREPTOCOCCUS AGALACTIAE (ESTREPTOCOCO GRUPO B)",
          "STREPTOCOCCUS PNEUMONIAE",
          "NEISSERIA MENINGITIDIS",
          "HAEMOPHILUS INFLUENZAE TIPO B",
          "STAPHYLOCOCCUS AUREUS"
        ],
        "correctIndex": 0,
        "explanation": "Streptococcus agalactiae (EGB) y Escherichia coli son los principales agentes de sepsis y meningitis de inicio temprano vertical."
      },
      {
        "id": "udabol_ped_4",
        "question": "LACTANTE DE 5 MESES CON RINORREA, FEBRICULA, TAQUIPNEA, TIRAJE SUBCOSTAL Y SIBILANCIAS ESPIRATORIAS GENERALIZADAS. EL DIAGNOSTICO CLINICO ES:",
        "options": [
          "BRONQUIOLITIS AGUDA POR VIRUS SINCITIAL RESPIRATORIO (VSR)",
          "CRISIS ASMATICA SEVERA",
          "CUERPO EXTRAÑO INTRABRONQUIAL",
          "NEUMONIA LOBAR TIPICA",
          "CRUP LARINGEO"
        ],
        "correctIndex": 0,
        "explanation": "El primer episodio de dificultad espiratoria con sibilancias en un lactante menor de 1 año precedido por coriza viral define bronquiolitis aguda."
      },
      {
        "id": "udabol_ped_5",
        "question": "EN UN NINO DE 2 ANOS CON OTITIS MEDIA AGUDA (OMA) NO COMPLICADA Y SIN ALERGIA A PENICILINAS, LA DOSIS OPTIMA DE AMOXICILINA ORAL ES:",
        "options": [
          "80 A 90 MG/KG/DIA DIVIDIDA CADA 8 O 12 HORAS",
          "20 A 30 MG/KG/DIA EN TOMA UNICA",
          "50 MG/KG/DIA UNA VEZ AL DIA",
          "10 MG/KG/DIA POR VIA INTRAMUSCULAR",
          "150 MG/KG/DIA POR VIA RECTAL"
        ],
        "correctIndex": 0,
        "explanation": "La dosis recomendada por la AAP es de 80-90 mg/kg/día para superar los mecanismos de resistencia intermedia de Streptococcus pneumoniae."
      },
      {
        "id": "udabol_ped_6",
        "question": "LA ESCALA DE SILVERMAN-ANDERSON EVALUA EN EL RECIEN NACIDO EL GRADO DE:",
        "options": [
          "DIFICULTAD RESPIRATORIA NEONATAL",
          "ENCEFALOPATIA HIPOXICO-ISQUEMICA",
          "HIPERBILIRRUBINEMIA",
          "EDAD GESTACIONAL SOMATICA",
          "DESHIDRATACION AGUDA"
        ],
        "correctIndex": 0,
        "explanation": "Silverman-Anderson valora distrés respiratorio a través de quejido, aleteo nasal, tiraje intercostal, retracción esternal y disociación toracoabdominal."
      },
      {
        "id": "udabol_ped_7",
        "question": "UNA CARACTERISTICA DISTINTIVA DE LA ICTERICIA NEONATAL FISIOLOGICA FRENTE A LA PATOLOGICA ES QUE LA FISIOLOGICA:",
        "options": [
          "APARECE DESPUES DE LAS 24 HORAS DE VIDA Y ES A PREDOMINIO INDIRECTO",
          "SE INICIA DENTRO DE LAS PRIMERAS 6 HORAS DE VIDA",
          "PRESENTA ELEVACION DE BILIRRUBINA DIRECTA MAYOR AL 20%",
          "CURSA CON COLURIA Y HECES ACOLICAS",
          "SUBE MAS DE 5 MG/DL AL DIA"
        ],
        "correctIndex": 0,
        "explanation": "La ictericia fisiológica nunca aparece en el primer día de vida, es indirecta y remite espontáneamente hacia la primera o segunda semana."
      },
      {
        "id": "udabol_ped_8",
        "question": "LA TRIADA CLASICA DE LA ESTENOSIS HIPERTROFICA CONGENITA DE PILORO EN UN LACTANTE DE 4 SEMANAS INCLUYE:",
        "options": [
          "VOMITOS NO BILIARES EN PROYECTIL, OLIVA PILORICA PALPABLE Y ALCALOSIS METABOLICA HIPOCLOREMICA",
          "VOMITOS BILIARES VERDOSOS, DISTENSION ABDOMINAL Y ACIDOSIS METABOLICA",
          "DIARREA CON SANGRE, FIEBRE Y DESHIDRATACION",
          "ICTERICIA OBSTRUCTIVA, ACOLIA Y HEPATOMEGALIA",
          "TOS NOCTURNA, REFLUJO Y ANEMIA FERROPENICA"
        ],
        "correctIndex": 0,
        "explanation": "La pérdida de ácido clorhídrico por vómitos no biliares en proyectil produce alcalosis hipoclorémica con palpación de la masa en oliva pilórica."
      },
      {
        "id": "udabol_ped_9",
        "question": "EL SIGNO RADIOLOGICO DE LA \"DOBLE BURBUJA\" EN LA PLACA DE ABDOMEN SIMPLE DE UN NEONATO ES PATOGNOMONICO DE:",
        "options": [
          "ATRESIA DUODENAL",
          "ESTENOSIS PILORICA",
          "INVAGINACION ILEOCECAL",
          "ATRESIA ESOFAGICA SIN FISTULA",
          "ANO IMPERFORADO"
        ],
        "correctIndex": 0,
        "explanation": "Las dos burbujas corresponden a la cámara gástrica y al bulbo duodenal dilatados proximales al defecto atrésico duodenal."
      },
      {
        "id": "udabol_ped_10",
        "question": "VACUNA QUE SE ADMINISTRA POR VIA ESTRICTAMENTE INTRADERMICA EN EL RECIEN NACIDO PARA LA PREVENCION DE FORMAS GRAVES DE TUBERCULOSIS:",
        "options": [
          "BCG (BACILO DE CALMETTE-GUERIN)",
          "HEPATITIS B RECOMBINANTE",
          "PENTAVALENTE CELULAR",
          "ANTIPOLIOMIELITICA IPV",
          "NEUMOCOCO CONJUGADA"
        ],
        "correctIndex": 0,
        "explanation": "La vacuna BCG se inocula en el deltoides derecho a dosis de 0.1 mL por vía intradérmica para prevenir tuberculosis meníngea y diseminada."
      },
      {
        "id": "udabol_ped_11",
        "question": "LACTANTE DE 10 MESES CON DOLOR PAROXISTICO INTENSO, LLANTO VIGOROSO INTERMITENTE Y EVACUACION DE HECES EN \"JALEA DE GROSELLA\". EL DIAGNOSTICO ES:",
        "options": [
          "INVAGINACION INTESTINAL (INTUSUSCEPCION)",
          "GASTROENTERITIS AGUDA POR ROTAVIRUS",
          "APENDICITIS AGUDA SUPURADA",
          "MEGACOLON TOXICO",
          "DIVERTICULITIS AGUDA"
        ],
        "correctIndex": 0,
        "explanation": "Las heces mucosanguinolentas en jalea de grosella y el llanto cólico episódico son típicos de invaginación ileocecal o ileocólica."
      },
      {
        "id": "udabol_ped_12",
        "question": "LA PROFILAXIS UNIVERSAL CON 1 MG INTRAMUSCULAR DE FITOMENADIONA (VITAMINA K) AL NACER PREVIENE:",
        "options": [
          "LA ENFERMEDAD HEMORRAGICA DEL RECIEN NACIDO",
          "EL RAQUITISMO CARENCIAL",
          "LA ICTERICIA POR INCOMPATIBILIDAD ABO",
          "LA RETINOPATIA DE LA PREMATURIDAD",
          "EL QUERATOCONO CONGENITO"
        ],
        "correctIndex": 0,
        "explanation": "La administración de vitamina K al nacer asegura la síntesis de factores II, VII, IX y X previniendo sangrados neonatales graves."
      },
      {
        "id": "udabol_ped_13",
        "question": "NINO DE 3 ANOS CON FIEBRE DE 6 DIAS, INYECCION CONJUNTIVAL NO EXUDATIVA, LENGUA EN FRAMBUESA Y ERITEMA CON DESCAMACION PERIUNGUEAL. SOSPECHA DIAGNOSTICA:",
        "options": [
          "ENFERMEDAD DE KAWASAKI",
          "ESCARLATINA ESTREPTOCOCICA",
          "SARAMPION COMPLICADO",
          "MONONUCLEOSIS INFECCIOSA",
          "SINDROME DE ERITEMA MULTIFORME"
        ],
        "correctIndex": 0,
        "explanation": "La vasculitis de Kawasaki cursa con fiebre >5 días, conjuntivitis bilateral, lengua aframbuesada y riesgo de aneurismas de arterias coronarias."
      },
      {
        "id": "udabol_ped_14",
        "question": "EL VIRUS MAS FRECUENTEMENTE RESPONSABLE DE LARINGOTRAQUEITIS AGUDA (CRUP VIRAL) EN PEDIATRIA ES:",
        "options": [
          "VIRUS PARAINFLUENZA TIPO 1",
          "ADENOVIRUS SEROTIPO 7",
          "INFLUENZA A H1N1",
          "RINOVIRUS",
          "CORONAVIRUS NL63"
        ],
        "correctIndex": 0,
        "explanation": "El virus parainfluenza tipo 1 causa la mayoría de los casos de crup con tos perruna, afonía y estridor inspiratorio."
      },
      {
        "id": "udabol_ped_15",
        "question": "FARMACO CORTICOIDE DE PRIMERA LINEA RECOMENDADO EN DOSIS UNICA (0.15 A 0.6 MG/KG) PARA EL TRATAMIENTO DEL CRUP VIRAL:",
        "options": [
          "DEXAMETASONA ORAL O PARENTERAL",
          "HIDROCORTISONA EN PERFUSION",
          "PREDNISONA TOPICA",
          "BUDESONIDA SISTEMICA",
          "METILPREDNISOLONA INTRATECAL"
        ],
        "correctIndex": 0,
        "explanation": "La dexametasona en dosis única oral o IM reduce el edema subglótico de forma sostenida gracias a su prolongada vida media biológica."
      },
      {
        "id": "udabol_ped_16",
        "question": "CALCULO DE LIQUIDOS BASALES POR LA REGLA DE HOLLIDAY-SEGAR PARA UN NINO DE 14 KG DE PESO:",
        "options": [
          "1200 ML/DIA (1000 ML POR PRIMEROS 10 KG + 200 ML POR LOS 4 KG RESTANTES)",
          "1400 ML/DIA",
          "1000 ML/DIA",
          "800 ML/DIA",
          "1600 ML/DIA"
        ],
        "correctIndex": 0,
        "explanation": "Primeros 10 kg = 100 mL/kg (1000 mL); de 11 a 20 kg = 50 mL/kg (4 x 50 = 200 mL). Total: 1200 mL/día."
      },
      {
        "id": "udabol_ped_17",
        "question": "EL CIERRE FISIOLOGICO COMPLETO DE LA FONTANELA ANTERIOR O BREGMATICA EN EL LACTANTE SANO TIENE LUGAR HABITUALMENTE ENTRE:",
        "options": [
          "LOS 9 Y 18 MESES DE EDAD",
          "EL 1ER Y 2DO MES DE EDAD",
          "LOS 24 Y 36 MESES DE EDAD",
          "LOS 4 Y 6 MESES DE EDAD",
          "LAS PRIMERAS 72 HORAS DE VIDA"
        ],
        "correctIndex": 0,
        "explanation": "La fontanela anterior cierra típicamente entre los 9 y 18 meses, mientras que la posterior cierra a los 2-3 meses."
      },
      {
        "id": "udabol_ped_18",
        "question": "EL REFLEJO ARCAICO EN EL QUE LA EXTENSION REPENTINA DE LA CABEZA DESENCADENA ABDUCCION Y EXTENSION DE BRAZOS SE DENOMINA:",
        "options": [
          "REFLEJO DE MORO",
          "REFLEJO DE GALANT",
          "REFLEJO DE MARCHA AUTOMATICA",
          "REFLEJO TONICO ASIMETRICO DEL CUELLO",
          "REFLEJO DE SUCCION"
        ],
        "correctIndex": 0,
        "explanation": "El reflejo de Moro es un reflejo del desarrollo que desaparece fisiológicamente entre el 4to y 6to mes."
      },
      {
        "id": "udabol_ped_19",
        "question": "EL MECANISMO FISIOPATOLOGICO PRINCIPAL DE LA ENFERMEDAD DE MEMBRANA HIALINA EN EL PREMATURO ES:",
        "options": [
          "DEFICIENCIA CUANTITATIVA Y CUALITATIVA DE SURFACTANTE PULMONAR",
          "ASPIRACION DE LIQUIDO MECONIAL EN EL CANAL DEL PARTO",
          "REABSORCION TARDIA DEL LIQUIDO PULMONAR",
          "INFECCION POR LISTERIA MONOCYTOGENES",
          "HIPOPLASIA VENTRICULAR IZQUIERDA"
        ],
        "correctIndex": 0,
        "explanation": "La inmadurez alveolar con déficit de surfactante pulmonar causa colapso espiratorio y atelectasias difusas."
      },
      {
        "id": "udabol_ped_20",
        "question": "LA CAUSA MAS FRECUENTE DE HIPOTIROIDISMO CONGENITO PRIMARIO DETECTABLE MEDIANTE TAMIZAJE NEONATAL ES:",
        "options": [
          "DISGENESIA TIROIDEA (ECTOPIA, HIPOPLASIA O AGENESIA)",
          "DISHORMONOGENESIS HEREDITARIA",
          "DEFICIT HIPOFISIARIO DE TSH",
          "CARENCIA NUTRICIONAL SEVERA DE YODO",
          "TIROIDITIS AUTOINMUNE MATERNA"
        ],
        "correctIndex": 0,
        "explanation": "La disgenesia tiroidea (especialmente la tiroides ectópica lingual) origina más del 80-85% de los hipotiroidismos congénitos primarios."
      }
    ]
  },
  {
    "id": "udabol_infectologia",
    "isUdabol": true,
    "title": "🔬 UDABOL: Infectología & Medicina Tropical (Patrón K-Type)",
    "subtitle": "Examen Oficial Completo • Carpeta Pedagógica Digital",
    "badge": "UDABOL Oficial",
    "badgeColor": "#7cb305",
    "subjectCode": "MED-305: Infectología & Medicina Tropical - NM - A",
    "sessionName": "Examen 2-2025",
    "description": "Simulador 1:1 de 20 preguntas con Patrón de Respuestas K-Type oficial de la Universidad de Aquino Bolivia (UDABOL). Mapeo proposicional determinista.",
    "questions": [
      {
        "id": "udabol_inf_1",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a la Enfermedad de Chagas (Tripanosomiasis Americana) y Trypanosoma cruzi:\n1. El vector biológico transmisor en el cono sur es Triatoma infestans (vinchuca)\n2. La forma infectante metacíclica para el ser humano es el tripomastigote metacíclico eliminado en las heces del insecto\n3. En la fase crónica, la multiplicación tisular intracelular ocurre exclusivamente como amastigotes\n4. El diagnóstico parasitológico en la fase crónica tardía se establece mediante frotis sanguíneo directo por su abundante parasitemia",
        "options": [
          "B 2,3 y 4",
          "D 1 y 4",
          "A 1,2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "C 2 y 3"
        ],
        "correctIndex": 2,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO: en fase crónica la parasitemia es escasa e indetectable por frotis directo; se diagnostica por serología IgG (ELISA/IFI)."
      },
      {
        "id": "udabol_inf_2",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a la Leishmaniasis mucocutánea y visceral en regiones endémicas:\n1. El mosquito hembra del género Anopheles actúa como el vector transmisor biológico primario\n2. La forma inoculada al huésped vertebrado mamífero durante la picadura es el promastigote metacíclico móvil\n3. Dentro de los macrófagos y células del sistema fagocítico mononuclear se replican en forma de amastigotes\n4. En la leishmaniasis visceral (Kala-Azar), la hepatoesplenomegalia masiva, fiebre remitente y pancitopenia son hallazgos cardinales",
        "options": [
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "A 1,2 y 3",
          "D 1 y 4"
        ],
        "correctIndex": 2,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO: el vector es el flebótomo del género Lutzomyia en América (titira), no Anopheles."
      },
      {
        "id": "udabol_inf_3",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación al Paludismo / Malaria y su ciclo evolutivo:\n1. Plasmodium falciparum es la especie responsable de las formas más benignas sin compromiso microvascular encefálico\n2. Los hipnozoítos son formas hepáticas durmientes responsables de las recidivas o recaídas tardías en P. vivax y P. ovale\n3. La primaquina actúa como esquizontocida tisular erradicando selectivamente los hipnozoítos hepáticos para evitar recidivas\n4. La anemia hemolítica intravascular en la malaria se desencadena durante la fase esquizogónica hepática previa a la invasión eritrocitaria",
        "options": [
          "D 1 y 4",
          "A 1,2 y 3",
          "C 2 y 3",
          "B 2,3 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 2,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (falciparum produce malaria grave/cerebral por secuestro capilar) y 4 es FALSO (la hemólisis ocurre al romperse los glóbulos rojos en la esquizogonia eritrocitaria)."
      },
      {
        "id": "udabol_inf_4",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a las características clínicas del Dengue y la Fiebre Amarilla:\n1. Ambos son arbovirus con genoma de ARN monocatenario pertenecientes a la familia Flaviviridae transmitidos por Aedes aegypti\n2. En el dengue grave con extravasación de plasma, el hematocrito sufre una caída precipitada inmediata\n3. El antígeno no estructural viral NS1 en suero es detectable únicamente después de dos semanas de convalecencia\n4. En la fiebre amarilla, la disociación esfigmotérmica consistente en bradicardia paradójica con temperatura elevada se conoce como Signo de Faget",
        "options": [
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "D 1 y 4",
          "C 2 y 3",
          "A 1,2 y 3"
        ],
        "correctIndex": 2,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (el hematocrito se eleva por hemoconcentración) y 3 es FALSO (NS1 se detecta en los primeros 1 a 5 días)."
      },
      {
        "id": "udabol_inf_5",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En cuanto a la epidemiología y patología de la Toxoplasmosis por Toxoplasma gondii:\n1. Los félidos domésticos y silvestres son los únicos hospedadores definitivos donde se lleva a cabo el ciclo sexuado\n2. Los taquizoítos son las formas proliferativas rápidas responsables de la destrucción celular aguda\n3. Los bradizoítos son las formas de replicación lenta enquistadas en cerebro y músculo durante la fase crónica latente\n4. La tétrada congénita de Sabin se caracteriza por coriorretinitis, hidrocefalia, calcificaciones cerebrales y crisis convulsivas",
        "options": [
          "A 1,2 y 3",
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "D 1 y 4",
          "B 2,3 y 4"
        ],
        "correctIndex": 2,
        "explanation": "TODOS SON VERDADEROS (E). Felinos son hospedadores definitivos; taquizoítos causan daño agudo; bradizoítos forman quistes tisulares latentes; y la tétrada clásica de Sabin engloba los 4 signos cardinales."
      },
      {
        "id": "udabol_inf_6",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En cuanto a la microbiología y farmacología de Mycobacterium tuberculosis:\n1. Es un bacilo aerobio estricto, ácido-alcohol resistente debido a la elevada concentración lipídica y ácidos micólicos de su pared\n2. La Isoniazida inhibe la síntesis de ácidos micólicos y su neuropatía periférica se previene con piridoxina (vitamina B6)\n3. La Rifampicina inhibe la subunidad beta de la ARN polimerasa bacteriana dependiente de ADN y es un potente inductor de CYP450\n4. La Pirazinamida posee actividad bactericida óptima en medio fuertemente alcalino y carece de toxicidad hepática o articular",
        "options": [
          "B 2,3 y 4",
          "D 1 y 4",
          "A 1,2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "C 2 y 3"
        ],
        "correctIndex": 2,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO: la pirazinamida actúa selectivamente en medio ácido intracelular y con frecuencia produce hiperuricemia y hepatotoxicidad."
      },
      {
        "id": "udabol_inf_7",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Sobre los fármacos antituberculosos de primera línea según la norma clínica:\n1. El Etambutol es un bactericida de acción rápida que erradica por sí solo las colonias bacilares cavitarias\n2. El efecto adverso más característico y limitante del Etambutol es la neuritis óptica retrobulbar con escotomas y discromatopsia rojo-verde\n3. La hiperuricemia asintomática y las crisis de artralgia gotosa son reacciones adversas metabólicas asociadas a Pirazinamida\n4. La Rifampicina produce una coloración naranja-rojiza inocua en la orina, sudor, lágrimas y saliva del paciente",
        "options": [
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "A 1,2 y 3",
          "D 1 y 4"
        ],
        "correctIndex": 2,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO (el etambutol es fundamentalmente un agente bacteriostático)."
      },
      {
        "id": "udabol_inf_8",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a la patogenia y complicaciones viscerales del Mal de Chagas:\n1. El signo de Romaña se manifiesta como un edema bipalpebral bilateral con abundante exudado purulento conjuntival\n2. El bloqueo completo de rama derecha del haz de His asociado a hemibloqueo anterior izquierdo es el hallazgo electrocardiográfico más frecuente\n3. La denervación parasimpática y destrucción de neuronas del plexo de Auerbach origina dilatación patológica del colon y esófago\n4. El tratamiento con benznidazol o nifurtimox logra curación parasitológica demostrada en el 100% de los pacientes con cardiopatía avanzada",
        "options": [
          "D 1 y 4",
          "A 1,2 y 3",
          "C 2 y 3",
          "B 2,3 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 2,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (Romaña es unilateral no purulento) y 4 es FALSO (la eficacia del benznidazol en fase crónica avanzada con daño orgánico es muy limitada)."
      },
      {
        "id": "udabol_inf_9",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a la Fiebre Hemorrágica Boliviana (Virus Machupo):\n1. El agente etiológico es el virus Machupo, perteneciente a la familia Arenaviridae con ARN bisegmentado\n2. El vector intermediario biológico demostrado en los brotes del departamento de Beni es la garrapata Rhipicephalus sanguineus\n3. La transmisión interpersonal nosocomial no se ha documentado nunca en la historia epidemiológica de la enfermedad\n4. El uso oportuno de plasma hiperinmune de pacientes convalecientes en los primeros 8 días reduce la letalidad de manera drástica",
        "options": [
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "D 1 y 4",
          "C 2 y 3",
          "A 1,2 y 3"
        ],
        "correctIndex": 2,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (el reservorio es el roedor Calomys callosus, no garrapatas) y 3 es FALSO (sí existe transmisión secundaria persona a persona por contacto con fluidos biológicos)."
      },
      {
        "id": "udabol_inf_10",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a los marcadores serológicos del Virus de la Hepatitis B (VHB):\n1. El VHB es un virus con genoma de ADN circular bicatenario parcial perteneciente a la familia Hepadnaviridae\n2. La detección persistente del antígeno de superficie HBsAg por más de 6 meses define formalmente el estado de portador crónico\n3. El antígeno 'e' (HBeAg) soluble en suero se correlaciona directamente con alta replicación viral e infectividad\n4. El anticuerpo anti-HBs aislado con anti-HBc total negativo refleja infección natural curada con inmunidad de por vida",
        "options": [
          "A 1,2 y 3",
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "D 1 y 4",
          "B 2,3 y 4"
        ],
        "correctIndex": 0,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO: anti-HBs aislado indica vacunación; la infección natural pasada siempre deja anti-HBc IgG positivo permanente."
      },
      {
        "id": "udabol_inf_11",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En cuanto al diagnóstico y manejo del Cólera por Vibrio cholerae:\n1. Vibrio cholerae es un bacilo grampositivo formador de endosporas resistentes a la desecación y al calor\n2. La toxina colérica se une al receptor gangliósido GM1 y causa activación irreversible de la adenilato ciclasa mediada por proteína Gs\n3. La diarrea secretora profusa en 'agua de arroz' con pérdida de electrólitos puede provocar choque hipovolémico severo en horas\n4. La hidratación precoz y enérgica mediante Sales de Rehidratación Oral o Ringer Lactato es el pilar terapéutico determinante",
        "options": [
          "B 2,3 y 4",
          "D 1 y 4",
          "A 1,2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "C 2 y 3"
        ],
        "correctIndex": 0,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO (es un bacilo gramnegativo curvado móvil por un flagelo polar, anaerobio facultativo no esporulado)."
      },
      {
        "id": "udabol_inf_12",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a las características clínicas y serológicas de la Fiebre Tifoidea (Salmonella Typhi):\n1. La leucocitosis marcada (>25,000/mm3) con eosinofilia absoluta es el patrón hematológico habitual durante la primera semana\n2. El hemocultivo tiene su rendimiento y sensibilidad más alta (>85-90%) durante la primera semana de evolución febril\n3. La necrosis e hiperplasia de las placas de Peyer ileales predispone a hemorragia digestiva y perforación ileal en la tercera semana\n4. Las cefalosporinas de primera generación como cefalexina oral son los fármacos bactericidas de primera línea recomendados",
        "options": [
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "A 1,2 y 3",
          "D 1 y 4"
        ],
        "correctIndex": 0,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (la fiebre tifoidea produce típicamente leucopenia con desviación izquierda y aneosinofilia) y 4 es FALSO (se usan ceftriaxona, ciprofloxacino o azitromicina; las cefalosporinas de 1ª gen son ineficaces)."
      },
      {
        "id": "udabol_inf_13",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a la patogenia y cuadro clínico del Tétanos (Clostridium tetani):\n1. Clostridium tetani es un bacilo grampositivo anaerobio estricto que forma esporas terminales en 'palillo de tambor'\n2. La tetanoespasmina actúa a nivel de la hendidura sináptica neuromuscular bloqueando la hidrólisis de acetilcolinesterasa\n3. El cuadro clínico cursa típicamente con marcada pérdida de la conciencia y coma profundo desde el inicio de los síntomas\n4. El bloqueo de la liberación de neurotransmisores inhibitorios (GABA y glicina) en las células de Renshaw desencadena espasmos musculares y trismo",
        "options": [
          "D 1 y 4",
          "A 1,2 y 3",
          "C 2 y 3",
          "B 2,3 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 0,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (bloquea la liberación de GABA/glicina en médula, no actúa sobre acetilcolinesterasa) y 3 es FALSO (la conciencia permanece lúcida durante todo el cuadro, incrementando el sufrimiento del paciente)."
      },
      {
        "id": "udabol_inf_14",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a las etapas clínicas y pruebas de la Sífilis (Treponema pallidum):\n1. El chancro sifilítico primario es una lesión ulcerada intensamente dolorosa con bordes friables que sangran con facilidad\n2. Las pruebas no treponémicas (VDRL, RPR) permiten monitorizar la respuesta terapéutica mediante la caída de títulos de anticuerpos\n3. Las pruebas treponémicas (FTA-ABS, TPHA) confirman el diagnóstico y suelen permanecer positivas durante toda la vida\n4. La penicilina G benzatínica es el antibiótico de elección indiscutible para la sífilis precoz (primaria, secundaria y latente temprana)",
        "options": [
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "D 1 y 4",
          "C 2 y 3",
          "A 1,2 y 3"
        ],
        "correctIndex": 1,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO (el chancro primario es indoloro, de base limpia indurada y bordes netos)."
      },
      {
        "id": "udabol_inf_15",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación al análisis citoquímico del LCR en la Meningitis Bacteriana Aguda:\n1. La presión de apertura en la punción lumbar se encuentra marcadamente disminuida por debajo de lo fisiológico\n2. La celularidad se eleva significativamente con pleocitosis a predominio de polimorfonucleares neutrófilos (>80-90%)\n3. La concentración de glucosa en LCR se halla francamente disminuida (hipoglucorraquia con relación LCR/suero < 0.4)\n4. Los niveles de proteínas totales se encuentran notablemente elevados (hiperproteinorraquia habitualmente >100-200 mg/dL)",
        "options": [
          "A 1,2 y 3",
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "D 1 y 4",
          "B 2,3 y 4"
        ],
        "correctIndex": 4,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO (la presión de apertura está francamente elevada debido al edema y la hipertensión endocraneana)."
      },
      {
        "id": "udabol_inf_16",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a la intoxicación botulínica por toxina de Clostridium botulinum:\n1. La neurotoxina botulínica inhibe la liberación de acetilcolina en las terminaciones colinérgicas motoras mediante proteólisis de proteínas SNARE\n2. El cuadro clásico se presenta como una parálisis flácida ascendente que se inicia distalmente en las extremidades inferiores\n3. La presencia de dolor neuropático quemante y pérdida de la propiocepción precede al déficit motor en todos los casos\n4. En el botulismo del lactante, la colonización intestinal y producción in vivo de toxina tras ingerir esporas presentes en miel es la vía habitual",
        "options": [
          "B 2,3 y 4",
          "D 1 y 4",
          "A 1,2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "C 2 y 3"
        ],
        "correctIndex": 1,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (la parálisis es descendente y simétrica comprometiendo primero pares craneales) y 3 es FALSO (el botulismo no compromete la sensibilidad)."
      },
      {
        "id": "udabol_inf_17",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a la Rabia Humana y su prevención posexposición:\n1. El virus rábico es un virus con envoltura de la familia Rhabdoviridae con genoma de ARN monocatenario de polaridad negativa\n2. Los corpúsculos de Negri son inclusiones intracitoplasmáticas eosinofílicas patognomónicas en el asta de Ammón y neuronas de Purkinje\n3. El cuadro clínico de la rabia furiosa cursa con agitación psicomotriz, hidrofobia por espasmos faríngeos dolorosos y disautonomía\n4. Ante una mordedura canina de riesgo tipo III en el rostro, el lavado con agua y jabón está contraindicado para no diseminar el virus",
        "options": [
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "A 1,2 y 3",
          "D 1 y 4"
        ],
        "correctIndex": 3,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO (el lavado profuso inmediato con abundante agua y jabón durante 15 minutos es la medida más crítica y obligatoria para reducir la carga viral)."
      },
      {
        "id": "udabol_inf_18",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a la Bartonelosis humana o Enfermedad de Carrión:\n1. Es causada por Bartonella bacilliformis, una bacteria gramnegativa aerobia pleomórfica de localización intraeritrocítica y endotelial\n2. El vector biológico transmisor es el mosquito flebótomo Lutzomyia verrucarum en valles interandinos\n3. La fase hemática aguda (Fiebre de la Oroya) se caracteriza por fiebre alta y anemia hemolítica intravascular grave e inmunodepresión\n4. La fase tisular eruptiva (Verruga Peruana) está producida por una toxina termoestable de origen micótico",
        "options": [
          "D 1 y 4",
          "A 1,2 y 3",
          "C 2 y 3",
          "B 2,3 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 1,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO (la verruga peruana es la proliferación de células endoteliales inducida directamente por la bacteria Bartonella, no un hongo)."
      },
      {
        "id": "udabol_inf_19",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a los protozoarios intestinales Giardia duodenalis y Entamoeba histolytica:\n1. Giardia duodenalis se fija a la mucosa del duodeno y yeyuno mediante su disco suctor ventral sin penetrar la submucosa\n2. La giardiasis causa diarrea acuosa o esteatorreica con malabsorción de grasas y distensión abdominal postprandial\n3. Entamoeba histolytica invade el epitelio colónico produciendo úlceras en 'botón de camisa' con riesgo de absceso hepático amebiano\n4. Los derivados nitroimidazólicos como metronidazol y tinidazol representan el tratamiento farmacológico de elección",
        "options": [
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "D 1 y 4",
          "C 2 y 3",
          "A 1,2 y 3"
        ],
        "correctIndex": 0,
        "explanation": "TODOS SON VERDADEROS (E). Giardia se adhiere mediante disco ventral produciendo esteatorrea; E. histolytica causa úlceras en botón de camisa y abscesos hepáticos; y los 5-nitroimidazoles son el pilar terapéutico."
      },
      {
        "id": "udabol_inf_20",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a la hidatidosis quística causada por Echinococcus granulosus:\n1. El ganado ovino actúa como el único hospedador definitivo donde se desarrolla la forma adulta estrobilar del parásito\n2. El ser humano se infecta accidentalmente como hospedador intermediario por ingestión de agua o vegetales contaminados con heces de cánidos\n3. El lóbulo hepático derecho es la localización anatómica más frecuente de los quistes hidatídicos primarios\n4. La rotura accidental o punción inadvertida del quiste puede liberar líquido antigénico hidatídico y desencadenar shock anafiláctico",
        "options": [
          "A 1,2 y 3",
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "D 1 y 4",
          "B 2,3 y 4"
        ],
        "correctIndex": 4,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO: el hospedador definitivo del parásito adulto es el perro (cánidos); el ganado ovino/bovino es el hospedador intermediario."
      }
    ]
  },
  {
    "id": "udabol_farmacologia",
    "isUdabol": true,
    "title": "💊 UDABOL: Farmacología & Terapéutica Clínica (Patrón K-Type)",
    "subtitle": "Examen Oficial Completo • Carpeta Pedagógica Digital",
    "badge": "UDABOL Oficial",
    "badgeColor": "#7cb305",
    "subjectCode": "MED-302: Farmacología Médica y Terapéutica - NM - A",
    "sessionName": "Examen 2-2025",
    "description": "Simulador 1:1 de 20 preguntas con Patrón de Respuestas K-Type oficial de la Universidad de Aquino Bolivia (UDABOL). Mapeo proposicional determinista.",
    "questions": [
      {
        "id": "udabol_farm_1",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a los Antibióticos Betalactámicos y sus mecanismos de acción:\n1. Inhiben la última etapa de la síntesis del peptidoglucano uniéndose covalentemente a las proteínas fijadoras de penicilina (PBPs)\n2. La adición de un inhibidor de betalactamasas como ácido clavulánico o tazobactam restaura la actividad frente a bacterias productoras de betalactamasas\n3. Las cefalosporinas de tercera generación como ceftriaxona atraviesan la barrera hematoencefálica con concentraciones terapéuticas en LCR\n4. Los carbapenémicos (meropenem, imipenem) carecen de anillo betalactámico por lo que no inducen resistencia cruzada",
        "options": [
          "B 2,3 y 4",
          "D 1 y 4",
          "A 1,2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "C 2 y 3"
        ],
        "correctIndex": 2,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO: los carbapenémicos sí poseen anillo betalactámico condensado a un anillo carbapénico."
      },
      {
        "id": "udabol_farm_2",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En cuanto a las propiedades farmacológicas y toxicidad de los Aminoglucósidos (Gentamicina, Amikacina):\n1. Se absorben de manera casi completa y rápida tras la administración por vía oral\n2. Se unen de forma irreversible a la subunidad ribosomal 30S bacteriana alterando la lectura del código genético\n3. Presentan un estrecho margen terapéutico con riesgo de necrosis tubular aguda proximal dependiente de la dosis\n4. La ototoxicidad por lesión irreversible de las células ciliadas cocleares y vestibulares es una reacción adversa mayor",
        "options": [
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "A 1,2 y 3",
          "D 1 y 4"
        ],
        "correctIndex": 2,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO: los aminoglucósidos son moléculas polares policationes con absorción digestiva prácticamente nula (<1%)."
      },
      {
        "id": "udabol_farm_3",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a los Macrólidos (Azitromicina, Claritromicina) y su perfil clínico:\n1. Inhiben la síntesis de ácidos micólicos en la pared celular bacteriana de enterobacterias gramnegativas\n2. Se unen a la subunidad ribosomal 50S inhibiendo la translocación del péptido en elongación\n3. Pueden prolongar el intervalo QT en el electrocardiograma con riesgo potencial de arritmias ventriculares tipo Torsades de Pointes\n4. La azitromicina es el fármaco de elección indiscutible para el tratamiento parenteral de la endocarditis por Enterococcus faecalis",
        "options": [
          "D 1 y 4",
          "A 1,2 y 3",
          "C 2 y 3",
          "B 2,3 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 2,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (inhiben la síntesis proteica ribosomal en la subunidad 50S) y 4 es FALSO (la azitromicina es ineficaz contra Enterococcus en endocarditis)."
      },
      {
        "id": "udabol_farm_4",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a las Fluorquinolonas (Ciprofloxacino, Levofloxacino) y sus advertencias:\n1. Inhiben a la ADN girasa (topoisomerasa II) bacteriana y la topoisomerasa IV impidiendo la replicación del ADN cromosómico\n2. Carecen de interacción con cationes polivalentes por lo que pueden tomarse libremente junto con antiácidos a base de aluminio y magnesio\n3. El ciprofloxacino oral carece de biodisponibilidad y solo se utiliza para descontaminación luminal intestinal\n4. Se asocian a riesgo de tendinitis y rotura del tendón de Aquiles, así como prolongación del intervalo QT y disección aórtica",
        "options": [
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "D 1 y 4",
          "C 2 y 3",
          "A 1,2 y 3"
        ],
        "correctIndex": 2,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (quelan fuertemente con cationes bivalentes/trivalentes reduciendo drásticamente su absorción) y 3 es FALSO (ciprofloxacino tiene excelente biodisponibilidad oral >70-80%)."
      },
      {
        "id": "udabol_farm_5",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a los Fármacos que actúan sobre el Sistema Renina-Angiotensina-Aldosterona (IECA y ARA-II):\n1. Los IECA (enalapril, ramipril) inhiben la enzima de conversión impidiendo la transformación de angiotensina I en angiotensina II\n2. El acumulo tisular de bradicinina y sustancia P explica la tos seca irritativa persistente y el angioedema por IECA\n3. Los ARA-II (losartán, valsartán) bloquean selectivamente los receptores AT1 de angiotensina II sin elevar la bradicinina\n4. Tanto IECA como ARA-II están formalmente contraindicados en el embarazo debido a toxicidad y teratogénesis renal fetal",
        "options": [
          "A 1,2 y 3",
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "D 1 y 4",
          "B 2,3 y 4"
        ],
        "correctIndex": 2,
        "explanation": "TODOS SON VERDADEROS (E). Los IECA inhiben ECA; bradicinina genera tos/angioedema; ARA-II bloquean receptor AT1 sin causar tos por bradicinina; y ambos son estrictamente teratogénicos (categoría X en 2º/3º trimestre)."
      },
      {
        "id": "udabol_farm_6",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a los Antagonistas de los Receptores Beta-adrenérgicos (Betabloqueantes):\n1. El bisoprolol, metoprolol y atenolol son betabloqueantes cardioselectivos que antagonizan preferentemente receptores beta-1\n2. El carvedilol y labetalol bloquean tanto receptores beta como receptores alfa-1 adrenérgicos produciendo vasodilatación adicional\n3. Los betabloqueantes sin actividad simpaticomimética intrínseca mejoran la sobrevida en insuficiencia cardíaca con fracción de eyección reducida\n4. Los betabloqueantes no selectivos como propranolol están formalmente recomendados en crisis de asma bronquial por su efecto broncodilatador",
        "options": [
          "B 2,3 y 4",
          "D 1 y 4",
          "A 1,2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "C 2 y 3"
        ],
        "correctIndex": 2,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO: los betabloqueantes no selectivos están contraindicados en asma porque el bloqueo beta-2 provoca broncoespasmo severo potencialmente mortal."
      },
      {
        "id": "udabol_farm_7",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a los Fármacos Calcioantagonistas (Bloqueadores de los Canales de Calcio tipo L):\n1. El verapamilo y diltiazem no ejercen ningún efecto sobre el nodo sinusal ni auriculoventricular\n2. Las dihidropiridinas (amlodipino, nifedipino) poseen selectividad vascular periférica y producen vasodilatación arteriolar\n3. El edema maleolar o pretibial dependiente de vasodilatación precapilar es un efecto adverso típico y dosis-dependiente de amlodipino\n4. El verapamilo presenta efecto inotrópico, cronotrópico y dromotrópico negativo, estando contraindicado en insuficiencia cardíaca sistólica grave",
        "options": [
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "A 1,2 y 3",
          "D 1 y 4"
        ],
        "correctIndex": 2,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO: verapamilo y diltiazem son no-dihidropiridinas con potente efecto depresor sobre la conducción del nodo AV y nodo SA."
      },
      {
        "id": "udabol_farm_8",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a los Diuréticos de Asa (Furosemida) y Tiazídicos (Hidroclorotiazida):\n1. La furosemida estimula selectivamente la bomba Na+/K+ ATPasa en el túbulo colector cortical\n2. La furosemida inhibe el cotransportador Na+/K+/2Cl- en la porción gruesa del asa ascendente de Henle generando intensa natriuresis\n3. Las tiazidas inhiben el cotransportador Na+/Cl- en el túbulo contorneado distal y pueden causar hiperuricemia e hipercalcemia\n4. La espironolactona y eplerenona promueven una excreción masiva y descontrolada de potasio originando hipopotasemia grave",
        "options": [
          "D 1 y 4",
          "A 1,2 y 3",
          "C 2 y 3",
          "B 2,3 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 2,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (furosemida inhibe el cotransportador Na+/K+/2Cl- de Henle) y 4 es FALSO (la espironolactona es ahorradora de potasio, pudiendo causar hiperpotasemia)."
      },
      {
        "id": "udabol_farm_9",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a los Anticoagulantes Parenterales y Orales clásicos:\n1. La heparina no fraccionada se une a la antitrombina III potenciando de forma inmediata la inactivación de la trombina (factor IIa) y factor Xa\n2. El control de la anticoagulación con heparina de bajo peso molecular (enoxaparina) requiere monitorización rutinaria mediante TTPA\n3. La warfarina y el acenocumarol estimulan la síntesis hepática directa de los factores de coagulación vitamina K dependientes\n4. El sulfato de protamina es el antídoto específico capaz de neutralizar rápidamente el efecto anticoagulante de la heparina no fraccionada",
        "options": [
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "D 1 y 4",
          "C 2 y 3",
          "A 1,2 y 3"
        ],
        "correctIndex": 2,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (las HBPM no requieren TTPA rutinario; en casos especiales se monitoriza anti-factor Xa) y 3 es FALSO (los dicumarínicos inhiben a la epóxido reductasa de vitamina K impidiendo la gamma-carboxilación)."
      },
      {
        "id": "udabol_farm_10",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Con respecto a los Anticoagulantes Orales de Acción Directa (ACOD):\n1. El dabigatrán es un inhibidor directo reversible y competitivo de la trombina (factor IIa)\n2. El rivaroxabán, apixabán y edoxabán actúan inhibiendo directamente y de forma selectiva al factor Xa activado\n3. El idarucizumab es un fragmento de anticuerpo monoclonal humanizado que actúa como agente reversor específico del dabigatrán\n4. Los ACOD son los fármacos anticoagulantes de primera elección recomendados en pacientes con prótesis valvulares cardíacas mecánicas",
        "options": [
          "A 1,2 y 3",
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "D 1 y 4",
          "B 2,3 y 4"
        ],
        "correctIndex": 0,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO: los ACOD están formalmente contraindicados en portadores de prótesis valvulares mecánicas (ensayo RE-ALIGN demostró exceso de trombosis y sangrado)."
      },
      {
        "id": "udabol_farm_11",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a las Nuevas Terapias Farmacológicas en Insuficiencia Cardíaca y Diabetes:\n1. Los inhibidores del cotransportador SGLT2 (dapagliflozina, empagliflozina) incrementan la reabsorción tubular renal de glucosa\n2. Los inhibidores de SGLT2 reducen la mortalidad cardiovascular y hospitalizaciones en insuficiencia cardíaca independientemente de la presencia de diabetes\n3. El sacubitrilo es un inhibidor de la neprilisina que previene la degradación de péptidos natriuréticos endógenos cardioprotectores\n4. El sacubitrilo debe asociarse obligatoriamente a un ARA-II (valsartán) y nunca simultáneamente con un IECA por el riesgo masivo de angioedema",
        "options": [
          "B 2,3 y 4",
          "D 1 y 4",
          "A 1,2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "C 2 y 3"
        ],
        "correctIndex": 0,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO: los iSGLT2 bloquean la reabsorción e inducen glucosuria y natriuresis en el túbulo contorneado proximal."
      },
      {
        "id": "udabol_farm_12",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a los Antidiabéticos Orales Biguanidas (Metformina) y Sulfonilureas (Glibenclamida):\n1. La metformina estimula la secreción de insulina por exocitosis de los gránulos de las células beta pancreáticas\n2. La metformina activa la proteína quinasa activada por AMP (AMPK) reduciendo la gluconeogénesis hepática y mejorando la sensibilidad a la insulina\n3. Las sulfonilureas cierran los canales de K+ sensibles a ATP en las células beta pancreáticas provocando despolarización y secreción de insulina\n4. La hipoglucemia severa prolongada es un efecto adverso muy frecuente de la monoterapia con metformina",
        "options": [
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "A 1,2 y 3",
          "D 1 y 4"
        ],
        "correctIndex": 0,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (la metformina es un normoglucemiante que no estimula la secreción de insulina) y 4 es FALSO (la metformina no causa hipoglucemia en monoterapia)."
      },
      {
        "id": "udabol_farm_13",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a los Corticoides Sistémicos y sus propiedades farmacodinámicas:\n1. Se unen a receptores citosólicos específicos que translocan al núcleo regulando la transcripción génica de mediadores inflamatorios\n2. La hidrocortisona carece totalmente de actividad mineralocorticoide sobre la retención renal de sodio y agua\n3. La dexametasona y betametasona poseen la menor potencia antiinflamatoria en comparación con la hidrocortisona\n4. La suspensión brusca de tratamientos prolongados con corticoides sistémicos puede desencadenar una crisis de insuficiencia suprarrenal aguda",
        "options": [
          "D 1 y 4",
          "A 1,2 y 3",
          "C 2 y 3",
          "B 2,3 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 0,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (hidrocortisona posee importante actividad mineralocorticoide) y 3 es FALSO (dexametasona tiene potencia antiinflamatoria 25-30 veces superior a hidrocortisona)."
      },
      {
        "id": "udabol_farm_14",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a los Antiinflamatorios No Esteroideos (AINEs) y toxicidad orgánica:\n1. Inhiben la enzima ciclooxigenasa (COX) impidiendo la conversión del ácido araquidónico en prostaglandinas y tromboxanos\n2. La inhibición de la COX-1 gástrica reduce la síntesis de prostaglandina E2 y prostaciclina citoprotectoras aumentando el riesgo de úlcera péptica\n3. Los inhibidores selectivos de la COX-2 (coxibs) reducen el riesgo lesivo gastroduodenal pero incrementan el riesgo protrombótico cardiovascular\n4. El ácido acetilsalicílico a dosis bajas (100 mg/día) inhibe de manera reversible la agregación plaquetaria durante 10 a 15 minutos",
        "options": [
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "D 1 y 4",
          "C 2 y 3",
          "A 1,2 y 3"
        ],
        "correctIndex": 4,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO: la aspirina acetila irreversiblemente a la COX-1 plaquetaria inhibiendo la síntesis de tromboxano A2 durante toda la vida media de la plaqueta (7 a 10 días)."
      },
      {
        "id": "udabol_farm_15",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En cuanto a los Analgésicos Opioides (Morfina, Fentanilo, Tramadol):\n1. Actúan primariamente como antagonistas competitivos de los receptores dopaminérgicos D2 estriatales\n2. Son agonistas de los receptores opioides acoplados a proteína Gi (mu, kappa y delta) reduciendo el AMPc y la liberación de neurotransmisores del dolor\n3. La depresión del centro respiratorio bulbar dependiente de la dosis es la principal causa de muerte por sobredosis aguda\n4. La naloxona es un antagonista opioide puro competitivo utilizado como antídoto de emergencia por vía intravenosa o intranasal",
        "options": [
          "A 1,2 y 3",
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "D 1 y 4",
          "B 2,3 y 4"
        ],
        "correctIndex": 4,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO: los opioides son agonistas de receptores opioides acoplados a proteína G inhibidora, no antagonistas dopaminérgicos."
      },
      {
        "id": "udabol_farm_16",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a las Benzodiacepinas y Moduladores del Receptor GABA-A:\n1. Las benzodiacepinas abren directamente el canal de cloro en ausencia completa de ácido gamma-aminobutírico (GABA)\n2. Actúan como moduladores alostéricos positivos incrementando la frecuencia de apertura del canal de cloro activado por GABA\n3. El flumazenil es un antagonista competitivo que se une al mismo sitio alostérico revirtiendo la sedación inducida por benzodiacepinas\n4. Los barbitúricos carecen de efecto tóxico respiratorio y poseen un índice terapéutico infinitamente más seguro que las benzodiacepinas",
        "options": [
          "B 2,3 y 4",
          "D 1 y 4",
          "A 1,2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "C 2 y 3"
        ],
        "correctIndex": 4,
        "explanation": "2 y 3 son VERDADEROS. 1 es FALSO (requieren presencia de GABA) y 4 es FALSO (los barbitúricos tienen estrecho margen terapéutico y alta letalidad por depresión cardiorrespiratoria)."
      },
      {
        "id": "udabol_farm_17",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a los Fármacos Antidepresivos (ISRS, Tricíclicos, IMAO):\n1. Los inhibidores selectivos de la recaptación de serotonina (sertralina, fluoxetina, escitalopram) son fármacos de primera línea en depresión mayor y trastorno de pánico\n2. Los antidepresivos tricíclicos (amitriptilina) carecen totalmente de efectos anticolinérgicos y de toxicidad cardíaca por bloqueo de canales de sodio\n3. La combinación de un ISRS con un inhibidor de la monoaminooxidasa (IMAO) es segura y recomendada como potenciación de inicio\n4. El síndrome serotoninérgico se caracteriza por hipertermia, hiperreflexia mioclónica, temblor, rigidez y diaforesis profusa",
        "options": [
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "A 1,2 y 3",
          "D 1 y 4"
        ],
        "correctIndex": 4,
        "explanation": "1 y 4 son VERDADEROS. 2 es FALSO (los tricíclicos tienen intensos efectos anticolinérgicos y arritmias por bloqueo Na+) y 3 es FALSO (la combinación de ISRS con IMAO está estrictamente prohibida por provocar síndrome serotoninérgico mortal)."
      },
      {
        "id": "udabol_farm_18",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a los Antipsicóticos Típicos y Atípicos en Psiquiatría Médica:\n1. El haloperidol es un antipsicótico típico de alta potencia que bloquea receptores dopaminérgicos D2 mesolímbicos y nigroestriados\n2. El bloqueo D2 en la vía nigroestriada explica los síntomas extrapiramidales agudos (distonías, parkinsonismo) y tardíos\n3. Los antipsicóticos atípicos (olanzapina, quetiapina) presentan menor riesgo extrapiramidal pero mayor incidencia de síndrome metabólico y ganancia de peso\n4. La clozapina es el antipsicótico más inocuo y carece de riesgo de agranulocitosis o miocarditis requiriendo ningún control hematológico",
        "options": [
          "D 1 y 4",
          "A 1,2 y 3",
          "C 2 y 3",
          "B 2,3 y 4",
          "E TODOS VERDADEROS O FALSOS"
        ],
        "correctIndex": 1,
        "explanation": "1, 2 y 3 son VERDADEROS. 4 es FALSO: la clozapina produce agranulocitosis potencialmente letal en 1-2% de pacientes, exigiendo monitorización obligatoria de hemograma."
      },
      {
        "id": "udabol_farm_19",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. En relación a los Fármacos Anticonvulsivantes y Manejo de Crisis Epilépticas:\n1. El ácido valproico es un antiepiléptico de amplio espectro eficaz en crisis focales, crisis tonicoclónicas generalizadas y crisis de ausencia\n2. El ácido valproico posee marcado potencial teratogénico provocando defectos del tubo neural (espina bífida) en hijos de madres expuestas\n3. La carbamazepina bloquea canales de sodio voltaje-dependientes en estado inactivo y es inductor potente de enzimas hepáticas CYP450\n4. Las benzodiacepinas intravenosas (diazepam, lorazepam, midazolam) constituyen la primera línea farmacológica en el estado epiléptico convulsivo",
        "options": [
          "E TODOS VERDADEROS O FALSOS",
          "B 2,3 y 4",
          "D 1 y 4",
          "C 2 y 3",
          "A 1,2 y 3"
        ],
        "correctIndex": 0,
        "explanation": "TODOS SON VERDADEROS (E). Valproato es de amplio espectro; altamente teratogénico (espina bífida); carbamazepina bloquea canales de Na+ e induce CYP450; y benzodiacepinas IV son la primera línea en estatus epiléptico."
      },
      {
        "id": "udabol_farm_20",
        "question": "LEA DETENIDAMENTE Y RESPONDA SEGÚN CORRESPONDA PATRON DE RESPUESTAS: A si 1,2 y 3 son VERDADEROS B si 2,3y4 son VERDADEROS C si 2y3 son VERDADEROS D si 1y4 es VERDADERO E si todos son FALSOS o VERDADEROS. Respecto a la Toxicología Clínica y los Antídotos Específicos:\n1. El jarabe de ipecacuana y el lavado gástrico rutinario tras 6 horas de ingesta de cáusticos salvan la mucosa esofágica\n2. La N-acetilcisteína es el antídoto específico en la intoxicación por paracetamol restaurando las reservas de glutatión hepático\n3. La atropina y las oximas (pralidoxima) están formalmente indicadas en la intoxicación colinérgica por insecticidas organofosforados\n4. El glucagón por vía intravenosa actúa como antídoto en la intoxicación grave por betabloqueantes incrementando el AMPc miocárdico independiente del receptor beta",
        "options": [
          "A 1,2 y 3",
          "C 2 y 3",
          "E TODOS VERDADEROS O FALSOS",
          "D 1 y 4",
          "B 2,3 y 4"
        ],
        "correctIndex": 4,
        "explanation": "2, 3 y 4 son VERDADEROS. 1 es FALSO: los eméticos y lavado gástrico están formalmente contraindicados en ingestión de cáusticos (ácidos/álcalis fuertes) por riesgo inminente de perforación y quemadura de la vía aérea."
      }
    ]
  },
  {
    "id": "mtc",
    "title": "🚗 Examen MTC - Reglas de Tránsito (Perú)",
    "subtitle": "Balotario Oficial de Conocimientos - Brevete Clase A",
    "badge": "Oficial MTC",
    "badgeColor": "#10b981",
    "description": "Preguntas oficiales del Ministerio de Transportes y Comunicaciones del Perú según el TUO del Reglamento Nacional de Tránsito y modificatorias (D.S. 025-2021-MTC).",
    "questions": [
      {
        "id": "mtc_1",
        "question": "De acuerdo con el D.S. N° 025-2021-MTC, ¿cuál es el límite máximo de velocidad permitido para vehículos en calles y jirones de zonas urbanas?",
        "options": [
          "40 km/h",
          "30 km/h",
          "50 km/h",
          "20 km/h"
        ],
        "correctIndex": 1,
        "explanation": "El D.S. N° 025-2021-MTC modificó el Art. 162 del Reglamento de Tránsito, estableciendo que la velocidad máxima en calles y jirones es de 30 km/h."
      },
      {
        "id": "mtc_2",
        "question": "En avenidas urbanas, ¿cuál es la velocidad máxima permitida para automóviles particulares si no hay señales que indiquen otro límite?",
        "options": [
          "60 km/h",
          "50 km/h",
          "40 km/h",
          "70 km/h"
        ],
        "correctIndex": 1,
        "explanation": "Bajo el D.S. N° 025-2021-MTC, el límite de velocidad en avenidas urbanas se redujo de 60 km/h a 50 km/h."
      },
      {
        "id": "mtc_3",
        "question": "En una intersección o calzada rotatoria (óvalo o rotonda), ¿quién tiene prioridad de paso?",
        "options": [
          "El vehículo que intenta ingresar a la rotonda desde una avenida más ancha",
          "El vehículo que circula dentro de la rotonda respecto al que intenta ingresar",
          "El vehículo que circula a mayor velocidad",
          "El vehículo que viene por la derecha aunque intente ingresar"
        ],
        "correctIndex": 1,
        "explanation": "En las rotondas u óvalos, tiene prioridad de paso indiscutible el vehículo que ya circula dentro de la calzada rotatoria."
      },
      {
        "id": "mtc_4",
        "question": "¿Por qué lado de la calzada se debe efectuar por regla general el adelantamiento a otro vehículo en movimiento?",
        "options": [
          "Por la derecha si la berma está libre y asfaltada",
          "Por la izquierda únicamente",
          "Por cualquier lado siempre que se toquen las bocinas",
          "Por la berma lateral si el vehículo precedente no avanza rápido"
        ],
        "correctIndex": 1,
        "explanation": "El Art. 169 del Reglamento Nacional de Tránsito establece que el adelantamiento se realiza obligatoriamente por la izquierda."
      },
      {
        "id": "mtc_5",
        "question": "En carreteras del Perú, ¿en qué horario es obligatorio circular con las luces bajas (luces de circulación diurna)?",
        "options": [
          "Únicamente desde las 18:00 horas hasta las 06:00 horas",
          "Las 24 horas del día, independientemente de las condiciones climáticas o de luminosidad",
          "Solo en túneles y cuando haya lluvia intensa",
          "Solo durante la noche y al atardecer"
        ],
        "correctIndex": 1,
        "explanation": "En la red vial nacional y departamental, es obligatorio el uso de luces bajas las 24 horas del día (D.S. 025-2021-MTC / RNT)."
      },
      {
        "id": "mtc_6",
        "question": "¿Cuál es el límite máximo de velocidad en zonas escolares y zonas de hospitales en el Perú?",
        "options": [
          "30 km/h",
          "20 km/h",
          "15 km/h",
          "35 km/h"
        ],
        "correctIndex": 0,
        "explanation": "La velocidad máxima en zonas escolares y de hospitales es de 30 km/h (y 20 km/h en proximidad inmediata a salidas/entradas escolares en horario escolar)."
      },
      {
        "id": "mtc_7",
        "question": "Conducir con presencia de alcohol en la sangre en proporción mayor a lo previsto en el Código Penal y bajo la influencia de drogas es una falta tipificada como:",
        "options": [
          "Grave (Código G01)",
          "Muy Grave (Código M01) que conlleva la cancelación definitiva o suspensión de la licencia",
          "Leve (Código L01)",
          "Solo retención momentánea del vehículo"
        ],
        "correctIndex": 1,
        "explanation": "La infracción M01 es Muy Grave y sanciona con multa del 100% de la UIT, cancelación de la licencia de conducir e inhabilitación definitiva."
      },
      {
        "id": "mtc_8",
        "question": "¿Qué documento garantiza la cobertura integral de gastos médicos y sepelio para víctimas de accidentes de tránsito de forma incondicional e inmediata?",
        "options": [
          "La Tarjeta de Identificación Vehicular (TIV)",
          "El Certificado de Inspección Técnica Vehicular (CITV)",
          "El Seguro Obligatorio de Accidentes de Tránsito (SOAT) o CAT",
          "El contrato de compraventa del vehículo"
        ],
        "correctIndex": 2,
        "explanation": "El SOAT cubre incondicional e inmediatamente a todos los ocupantes y terceros no ocupantes afectados por un accidente de tránsito."
      },
      {
        "id": "mtc_9",
        "question": "En una intersección que carece de semáforos y señales reguladoras, si dos vehículos convergen simultáneamente, ¿cuál tiene la preferencia de paso?",
        "options": [
          "El vehículo que viene por la izquierda",
          "El que se aproxime por la derecha del conductor",
          "El vehículo de mayor tonelaje o tamaño",
          "El que toque la bocina primero"
        ],
        "correctIndex": 1,
        "explanation": "En intersecciones no señalizadas ni semaforizadas, la prioridad de paso le asiste siempre al vehículo que proviene por la derecha."
      },
      {
        "id": "mtc_10",
        "question": "¿Qué significado tiene una señal vertical con fondo amarillo, forma de rombo y símbolos negros en las vías peruanas?",
        "options": [
          "Señal Reguladora o Reglamentaria (obligación o prohibición)",
          "Señal Preventiva (advierte sobre peligro o condición de la vía)",
          "Señal Informativa de servicios",
          "Señal de restricción temporal de velocidad"
        ],
        "correctIndex": 1,
        "explanation": "Las señales amarillas con forma de rombo son Señales Preventivas, cuyo propósito es advertir a los usuarios sobre peligros potenciales en la vía."
      }
    ]
  },
  {
    "id": "neumologia",
    "title": "🫁 Medicina & Neumología Clínica",
    "subtitle": "Evaluación de Especialidad Médica y Casos Clínicos",
    "badge": "Ciencias Médicas",
    "badgeColor": "#3b82f6",
    "description": "Preguntas clínicas y fisiopatológicas de neumología: EPOC, espirometría, asma bronquial, neumonía comunitaria (CURB-65), tuberculosis y gasometría.",
    "questions": [
      {
        "id": "neu_1",
        "question": "Para confirmar el diagnóstico espirométrico de Enfermedad Pulmonar Obstructiva Crónica (EPOC), ¿qué criterio post-broncodilatador debe cumplirse según las guías GOLD?",
        "options": [
          "FEV1/FVC < 0.70",
          "FEV1 > 80% del valor predicho",
          "FVC < 70% con respuesta broncodilatadora > 12%",
          "Capacidad pulmonar total (TLC) < 80%"
        ],
        "correctIndex": 0,
        "explanation": "Según la guía internacional GOLD, un cociente FEV1/FVC post-broncodilatador menor de 0.70 confirma la presencia de limitación persistente al flujo aéreo (patrón obstructivo)."
      },
      {
        "id": "neu_2",
        "question": "En la escala de estratificación de gravedad CURB-65 para Neumonía Adquirida en la Comunidad (NAC), ¿qué parámetro representa la letra \"U\"?",
        "options": [
          "Uricemia > 7 mg/dL",
          "Urea sérica > 19 mg/dL (o Nitrógeno Ureico en Sangre BUN > 20 mg/dL / Urea > 7 mmol/L)",
          "Urocultivo positivo a gérmenes patógenos",
          "Urgencia respiratoria con saturación < 90%"
        ],
        "correctIndex": 1,
        "explanation": "CURB-65 evalúa: Confusión, Urea (>7 mmol/L o BUN >20 mg/dL), Frecuencia respiratoria (>=30 rpm), Presión sanguínea (PAS<90 o PAD<=60 mmHg) y Edad (>=65 años)."
      },
      {
        "id": "neu_3",
        "question": "¿Cuál es el tratamiento de primera línea de elección para un paciente con diagnóstico de Asma Leve Persistente según las recomendaciones GINA actuales?",
        "options": [
          "Salbutamol oral en comprimidos cada 8 horas",
          "Corticosteroide inhalado (ICS) en dosis bajas asociado a formoterol a demanda (o corticoide inhalado diario)",
          "Bromuro de ipratropio como monoterapia exclusiva",
          "Teofilina de liberación prolongada"
        ],
        "correctIndex": 1,
        "explanation": "Las guías GINA no recomiendan el uso de SABA en monoterapia; el pilar actual es el corticoide inhalado (ICS) asociado a formoterol para prevenir crisis inflamatorias."
      },
      {
        "id": "neu_4",
        "question": "En la interpretación de la gasometría arterial: pH 7.28, PaCO2 58 mmHg, HCO3- 26 mEq/L, PaO2 62 mmHg. ¿Cuál es el trastorno ácido-base primario?",
        "options": [
          "Alcalosis respiratoria descompensada",
          "Acidosis metabólica con brecha aniónica elevada",
          "Acidosis respiratoria aguda con hipoxemia moderada",
          "Acidosis mixta hiperclorémica"
        ],
        "correctIndex": 2,
        "explanation": "pH < 7.35 indica acidosis, PaCO2 > 45 mmHg indica causa respiratoria, y el HCO3 normal (26) refleja ausencia de compensación renal crónica (aguda)."
      },
      {
        "id": "neu_5",
        "question": "¿Cuál es el esquema farmacológico estándar de primera línea para Tuberculosis pulmonar sensible en el Perú según la Norma Técnica de Salud del MINSA (Fase 1)?",
        "options": [
          "Isoniazida, Rifampicina, Pirazinamida y Etambutol (2HREZ) diario por 2 meses (50 dosis)",
          "Levofloxacino, Amikacina y Cicloserina por 6 meses",
          "Isoniazida y Rifampicina exclusivamente por 9 meses",
          "Rifampicina y Estreptomicina por 3 meses"
        ],
        "correctIndex": 0,
        "explanation": "En el Perú, el esquema para TB pulmonar sensible comprende la primera fase intensiva con 2 meses de HREZ diario (50 dosis de Lunes a Sábado)."
      },
      {
        "id": "neu_6",
        "question": "Ante la sospecha clínica de un Neumotórax a Tensión con compromiso hemodinámico e hipotensión, ¿cuál es la conducta terapéutica inmediata?",
        "options": [
          "Esperar el informe de la Tomografía Computarizada de alta resolución",
          "Descompresión inmediata con catéter de grueso calibre en el 2° espacio intercostal línea medioclavicular (o 5° espacio línea axilar anterior)",
          "Iniciar ventilación mecánica con presión positiva inmediata sin descompresión previa",
          "Nebulización con agonistas beta-2 de acción corta"
        ],
        "correctIndex": 1,
        "explanation": "El neumotórax a tensión es una emergencia médica de diagnóstico clínico que requiere descompresión inmediata con aguja antes de cualquier estudio de imagen."
      },
      {
        "id": "neu_7",
        "question": "¿Cuál es el patrón característico en el lavado broncoalveolar (LBA) o biopsia de un paciente con Proteinosis Alveolar Pulmonar?",
        "options": [
          "Predominio de eosinófilos > 25%",
          "Material PAS-positivo acelular rico en surfactante fosfolipídico lipoproteináceo",
          "Bacilos ácido-alcohol resistentes abundantes",
          "Presencia de cuerpos de asbesto ferruginosos"
        ],
        "correctIndex": 1,
        "explanation": "La proteinosis alveolar se caracteriza por acumulación intraalveolar de material proteináceo rico en lípidos que tiñe intensamente positivo para el ácido periódico de Schiff (PAS)."
      },
      {
        "id": "neu_8",
        "question": "En un paciente con sospecha clínica de Tromboembolismo Pulmonar (TEP) y probabilidad baja según la escala de Wells modificada, ¿cuál es el examen inicial de descarte?",
        "options": [
          "Angiotomografía pulmonar multidetector",
          "Determinación cuantitativa de Dímero D por técnica ELISA de alta sensibilidad",
          "Gammagrafía ventilación/perfusión (V/Q)",
          "Arteriografía pulmonar invasiva"
        ],
        "correctIndex": 1,
        "explanation": "En pacientes con probabilidad clínica baja o intermedia, un Dímero D cuantitativo negativo tiene un alto valor predictivo negativo (>98%) para descartar TEP."
      },
      {
        "id": "neu_9",
        "question": "¿Cuál de los siguientes fármacos antituberculosos se asocia típicamente a toxicidad ocular en forma de neuritis óptica retrobulbar?",
        "options": [
          "Rifampicina",
          "Isoniazida",
          "Etambutol",
          "Pirazinamida"
        ],
        "correctIndex": 2,
        "explanation": "El etambutol produce neuropatía óptica dosis-dependiente con disminución de agudeza visual y alteración en la visión de colores (discromatopsia rojo-verde)."
      },
      {
        "id": "neu_10",
        "question": "En el síndrome de dificultad respiratoria aguda (SDRA), ¿cómo se define el grado moderado según los criterios de Berlín (PaO2/FiO2 con PEEP >= 5 cmH2O)?",
        "options": [
          "PaO2/FiO2 > 300 mmHg",
          "200 mmHg < PaO2/FiO2 <= 300 mmHg",
          "100 mmHg < PaO2/FiO2 <= 200 mmHg",
          "PaO2/FiO2 <= 100 mmHg"
        ],
        "correctIndex": 2,
        "explanation": "Criterios de Berlín para SDRA: Leve (200 < PaO2/FiO2 <= 300), Moderado (100 < PaO2/FiO2 <= 200) y Severo (PaO2/FiO2 <= 100 mmHg)."
      }
    ]
  },
  {
    "id": "academico",
    "title": "🎓 Razonamiento Académico & Cultura General",
    "subtitle": "Evaluación Universitaria y Razonamiento Lógico-Verbal",
    "badge": "Admisión Universitaria",
    "badgeColor": "#8b5cf6",
    "description": "Preguntas de razonamiento verbal, lógica deductiva, historia contemporánea, constitución del Perú y ciencias generales.",
    "questions": [
      {
        "id": "aca_1",
        "question": "Analogía verbal: EFÍMERO : PERDURABLE ::",
        "options": [
          "Fugaz : Transitorio",
          "Incipiente : Primigenio",
          "Lóbrego : Luminoso",
          "Preclaro : Célebre"
        ],
        "correctIndex": 2,
        "explanation": "La relación entre Efímero y Perdurable es de antonimia absoluta. La única pareja que guarda exactamente dicha relación de contrarios es Lóbrego (oscuro) y Luminoso (claro)."
      },
      {
        "id": "aca_2",
        "question": "Según la Constitución Política del Perú de 1993, ¿cuál es el órgano constitucional autónomo encargado de preservar la estabilidad monetaria y regular el crédito del sistema financiero?",
        "options": [
          "Superintendencia de Banca, Seguros y AFP (SBS)",
          "Banco Central de Reserva del Perú (BCRP)",
          "Ministerio de Economía y Finanzas (MEF)",
          "Contraloría General de la República"
        ],
        "correctIndex": 1,
        "explanation": "El Art. 84 de la Constitución establece que la finalidad primordial del Banco Central de Reserva del Perú (BCRP) es preservar la estabilidad monetaria."
      },
      {
        "id": "aca_3",
        "question": "Premisa lógica: \"Si todos los mamíferos son vertebrados y todos los cetáceos son mamíferos\", se concluye necesariamente que:",
        "options": [
          "Algunos vertebrados no son mamíferos",
          "Todos los cetáceos son vertebrados",
          "Ningún cetáceo es vertebrado",
          "Todos los vertebrados son cetáceos"
        ],
        "correctIndex": 1,
        "explanation": "Por silogismo categórico clásico de forma Bárbara (AAA-1): Todo C es M, y todo M es V, por lo tanto, Todo C es V (Todos los cetáceos son vertebrados)."
      },
      {
        "id": "aca_4",
        "question": "¿Qué tratado internacional de 1929 puso fin a la controversia limítrofe entre Perú y Chile tras la Guerra del Pacífico, reincorporando Tacna al Perú?",
        "options": [
          "Tratado de Ancón",
          "Tratado de Lima (Tratado Rada y Gamio - Figueroa Larraín)",
          "Tratado Salomón-Lozano",
          "Tratado Polo-Bustamante"
        ],
        "correctIndex": 1,
        "explanation": "El Tratado de Lima, firmado el 3 de junio de 1929, determinó que Tacna se reincorporaba al suelo patrio peruano y Arica permanecía bajo soberanía chilena."
      },
      {
        "id": "aca_5",
        "question": "Precisión léxica: \"El diplomático presentó un discurso muy extenso y lleno de adornos innecesarios que desvió la atención del tema principal\". El adjetivo idóneo para calificar el discurso es:",
        "options": [
          "Lacónico",
          "Grandilocuente",
          "Farragoso",
          "Sentencioso"
        ],
        "correctIndex": 2,
        "explanation": "\"Farragoso\" se aplica a lo desordenado, confuso, prolijo o lleno de palabrería superflua que entorpece la comprensión del contenido medular."
      },
      {
        "id": "aca_6",
        "question": "¿Cuál es la capa de la atmósfera terrestre donde se desarrollan los fenómenos meteorológicos como nubes, lluvias y tormentas?",
        "options": [
          "Estratosfera",
          "Troposfera",
          "Mesosfera",
          "Termosfera"
        ],
        "correctIndex": 1,
        "explanation": "La troposfera es la capa más baja de la atmósfera (hasta ~12 km) que contiene más del 75% de la masa de aire y casi todo el vapor de agua, donde ocurre el clima."
      },
      {
        "id": "aca_7",
        "question": "En física, ¿cuál es la unidad del Sistema Internacional (SI) empleada para medir la potencia mecánica o eléctrica?",
        "options": [
          "Joule (J)",
          "Newton (N)",
          "Vatio o Watt (W)",
          "Pascal (Pa)"
        ],
        "correctIndex": 2,
        "explanation": "La unidad del Sistema Internacional para potencia es el Vatio o Watt (W), definido como la transferencia de energía de un julio por segundo (1 W = 1 J/s)."
      },
      {
        "id": "aca_8",
        "question": "En la obra literaria \"La ciudad y los perros\" del Nobel Mario Vargas Llosa, ¿en qué colegio militar se ambienta la trama principal?",
        "options": [
          "Colegio Militar Francisco Bolognesi",
          "Colegio Militar Leoncio Prado",
          "Colegio Militar Ramón Castilla",
          "Escuela Militar de Chorrillos"
        ],
        "correctIndex": 1,
        "explanation": "La célebre novela de Vargas Llosa transcurre en las aulas, patios y dormitorios del Colegio Militar Leoncio Prado en La Perla, Callao."
      },
      {
        "id": "aca_9",
        "question": "Matemática: En una baraja estándar de 52 cartas, ¿cuál es la probabilidad de extraer al azar una carta que sea un As o un Rey?",
        "options": [
          "1/13",
          "2/13",
          "4/13",
          "1/26"
        ],
        "correctIndex": 1,
        "explanation": "Hay 4 ases y 4 reyes en la baraja (total 8 cartas favorables). Probabilidad = 8 / 52 = 2 / 13 (aproximadamente 15.38%)."
      },
      {
        "id": "aca_10",
        "question": "¿Qué organelo celular es conocido como la central energética eucariota responsable de la respiración celular y síntesis aeróbica de ATP?",
        "options": [
          "Ribosoma",
          "Aparato de Golgi",
          "Mitocondria",
          "Retículo endoplasmático liso"
        ],
        "correctIndex": 2,
        "explanation": "Las mitocondrias son los orgánulos encargados de generar la mayor parte del ATP mediante la fosforilación oxidativa y el ciclo de Krebs."
      }
    ]
  },
  {
    "id": "tecnologia",
    "title": "💻 Computación, Programación & Sistemas",
    "subtitle": "Arquitectura de Software, Redes y Bases de Datos",
    "badge": "Ingeniería TI",
    "badgeColor": "#06b6d4",
    "description": "Preguntas avanzadas de algoritmos (Big-O), arquitecturas frontend/backend, bases de datos SQL/NoSQL, seguridad web y protocolos.",
    "questions": [
      {
        "id": "tec_1",
        "question": "¿Cuál es la complejidad temporal en el peor caso para buscar un elemento en un arreglo ya ordenado de n elementos mediante Búsqueda Binaria (Binary Search)?",
        "options": [
          "O(n)",
          "O(log n)",
          "O(n log n)",
          "O(1)"
        ],
        "correctIndex": 1,
        "explanation": "La búsqueda binaria divide el espacio de búsqueda a la mitad en cada paso iterativo, logrando una complejidad temporal óptima de O(log n)."
      },
      {
        "id": "tec_2",
        "question": "En bases de datos relacionales, ¿qué garantiza el principio de \"Atomicidad\" dentro de las propiedades ACID?",
        "options": [
          "Que las transacciones no interfieran entre sí en ejecuciones simultáneas",
          "Que todas las operaciones de una transacción se completen con éxito o ninguna se aplique (todo o nada)",
          "Que los datos persistirán incluso ante una falla de energía catastrófica",
          "Que los datos cumplan estrictamente todas las reglas de integridad de dominio"
        ],
        "correctIndex": 1,
        "explanation": "La atomicidad asegura que una transacción se trate como una unidad indivisible: o se ejecutan todas sus sentencias o se realiza un rollback integral."
      },
      {
        "id": "tec_3",
        "question": "A diferencia de HTTP/1.1 y HTTP/2 que se basan en TCP, ¿cuál es el protocolo de capa de transporte que subyace a HTTP/3?",
        "options": [
          "SCTP",
          "QUIC sobre UDP",
          "WebSocket raw",
          "TLS directo sin transporte"
        ],
        "correctIndex": 1,
        "explanation": "HTTP/3 utiliza el protocolo QUIC, el cual corre sobre UDP para eliminar el bloqueo de cabeza de línea (head-of-line blocking) de TCP y permitir conexiones 0-RTT."
      },
      {
        "id": "tec_4",
        "question": "En desarrollo frontend moderno, ¿qué es el \"Virtual DOM\" y cuál es su principal ventaja de rendimiento?",
        "options": [
          "Un motor de renderizado 3D por GPU en WebGL",
          "Una representación ligera en memoria del DOM real que permite calcular diferencias (diffing) y aplicar únicamente los cambios mínimos necesarios",
          "Un plugin del navegador para compilar código C++ a bytecode",
          "Un iframe oculto que descarga assets en segundo plano"
        ],
        "correctIndex": 1,
        "explanation": "El Virtual DOM mantiene un árbol de nodos en JavaScript; al ocurrir cambios, compara la versión anterior con la nueva (diffing) y aplica solo los parches exactos al DOM real."
      },
      {
        "id": "tec_5",
        "question": "¿Qué vulnerabilidad de seguridad web ocurre cuando un atacante inyecta scripts maliciosos del lado del cliente en páginas web vistas por otros usuarios?",
        "options": [
          "SQL Injection (SQLi)",
          "Cross-Site Scripting (XSS)",
          "Cross-Site Request Forgery (CSRF)",
          "Server-Side Request Forgery (SSRF)"
        ],
        "correctIndex": 1,
        "explanation": "XSS (Cross-Site Scripting) permite la inyección y ejecución de scripts arbitrarios en el contexto del navegador de la víctima para robar cookies de sesión o secuestrar cuentas."
      },
      {
        "id": "tec_6",
        "question": "¿Cuál es la estructura estándar de un JSON Web Token (JWT)?",
        "options": [
          "Public Key, Private Key, Signature",
          "Header, Payload, Signature separados por puntos (.)",
          "Key, Value, Checksum codificados en base32",
          "Nonce, Body, Hash en formato XML"
        ],
        "correctIndex": 1,
        "explanation": "Un JWT se compone de tres partes codificadas en Base64URL separadas por puntos: Header (algoritmo), Payload (claims/datos) y Signature (firma criptográfica de verificación)."
      },
      {
        "id": "tec_7",
        "question": "En Git, ¿cuál es la diferencia fundamental entre los comandos \"git merge\" y \"git rebase\"?",
        "options": [
          "git merge borra el historial previo, mientras que git rebase lo sube a la nube",
          "git merge crea un commit de fusión combinando los historiales, mientras que git rebase reescribe el historial aplicando los commits uno a uno sobre la base destino",
          "git rebase solo funciona en repositorios locales y nunca altera hashes SHA-1",
          "Son comandos idénticos que solo varían por la versión de Git"
        ],
        "correctIndex": 1,
        "explanation": "git merge preserva el grafo histórico exacto creando un commit de merge de dos ramas; git rebase trasplanta los commits de la rama actual sobre la punta de otra, creando un historial lineal."
      },
      {
        "id": "tec_8",
        "question": "¿Qué algoritmo de ordenamiento tiene un tiempo de ejecución garantizado en el peor de los casos de O(n log n)?",
        "options": [
          "Bubble Sort",
          "Merge Sort",
          "Quick Sort",
          "Insertion Sort"
        ],
        "correctIndex": 1,
        "explanation": "Merge Sort garantiza O(n log n) en todos los casos (peor, mejor y promedio) gracias a su estrategia divide-y-vencerás, a diferencia de Quick Sort cuyo peor caso es O(n²)."
      },
      {
        "id": "tec_9",
        "question": "¿Qué mecanismo de seguridad del navegador restringe cómo los recursos de un origen pueden ser solicitados por otro dominio?",
        "options": [
          "CORS (Cross-Origin Resource Sharing)",
          "DNSSEC",
          "DHCP Snooping",
          "SNI (Server Name Indication)"
        ],
        "correctIndex": 0,
        "explanation": "CORS es un mecanismo basado en cabeceras HTTP que permite o bloquea solicitudes que un navegador realiza a un dominio distinto al del origen de la página web."
      },
      {
        "id": "tec_10",
        "question": "En Docker, ¿cuál es la diferencia principal entre un \"Container\" y una \"Image\"?",
        "options": [
          "La imagen es la instancia en ejecución con memoria asignada y el contenedor es un archivo estático",
          "Una imagen es una plantilla inmutable de solo lectura; un contenedor es una instancia ejecutable y aislada de dicha imagen con una capa de escritura",
          "Los contenedores solo corren en Linux y las imágenes solo en Windows",
          "Una imagen es un volumen de almacenamiento y un contenedor es un socket de red"
        ],
        "correctIndex": 1,
        "explanation": "La imagen de Docker contiene el código, dependencias y librerías en capas inmutables; un contenedor es la instancia en ejecución con su propio filesystem y ciclo de vida."
      }
    ]
  },
  {
    "id": "histologia",
    "title": "🔬 Histología Médica & Biología Tisular",
    "subtitle": "Técnicas de Tinción, Ultraestructura y Tejidos Fundamentales",
    "badge": "Histología",
    "badgeColor": "#ec4899",
    "description": "Evaluación especializada en epitelios, tejido conectivo, muscular, nervioso, tinciones histoquímicas e inmunohistoquímica con casos histopatológicos e ítems I-IV.",
    "questions": [
      {
        "id": "histo_1",
        "question": "Mujer de 34 años sometida a biopsia renal por síndrome nefrótico. En el estudio histopatológico del glomérulo se requiere evaluar con precisión la integridad de la membrana basal glomerular (MBG), la presencia de colágeno intersticial y los depósitos inmunes.\n\nRespecto a las técnicas de tinción histoquímica renal, analice los siguientes enunciados:\nI. La tinción de PAS (Ácido Periódico de Schiff) tiñe de color magenta/púrpura la lámina basal debido a su alta concentración de carbohidratos y glucoproteínas.\nII. La impregnación argéntica de Jones (metenamina de plata) evidencia la membrana basal tiñéndola de color negro, permitiendo detectar espículas (\"spikes\") subepiteliales.\nIII. El tricrómico de Masson tiñe las fibras de colágeno de color azul o verde, permitiendo cuantificar la fibrosis intersticial y esclerosis glomerular.\nIV. La tinción de Hematoxilina y Eosina (H&E) es el método de elección definitivo para la identificación directa de la subpoblación de podocitos y sus pedicelos.\n\n¿Cuáles de los enunciados son VERDADEROS?",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son VERDADEROS: PAS resalta carbohidratos y glucoproteínas de la MBG en magenta; la plata de Jones colorea de negro las membranas basales permitiendo visualizar spikes de la nefropatía membranosa; el tricrómico de Masson tiñe colágeno en azul/verde delimitando fibrosis. El enunciado IV es FALSO porque la resolución de los pedicelos podocitarios requiere Microscopía Electrónica de Transmisión (MET), siendo imposible individualizarlos con precisión únicamente con H&E."
      },
      {
        "id": "histo_2",
        "question": "En la práctica histológica e histopatológica de rutina, las técnicas de coloración especial permiten diferenciar componentes bioquímicos específicos en los tejidos.\n\nRelacione ambas columnas según la técnica de coloración y su estructura/biomolécula diana afín:\n1. Tinción de Sudán III / Oil Red O\n2. Tricrómico de Masson\n3. Ácido Periódico de Schiff (PAS)\n4. Impregnación argéntica de Fontana-Masson\n\na. Gránulos de melanina y células neuroendocrinas argentafines\nb. Fibras colágenas y tejido conectivo fibroso\nc. Lípidos neutros y triglicéridos en cortes por congelación\nd. Glucógeno, mucinas neutras y membranas basales",
        "options": [
          "1-c, 2-b, 3-d, 4-a",
          "1-d, 2-a, 3-b, 4-c",
          "1-c, 2-d, 3-b, 4-a",
          "1-a, 2-b, 3-c, 4-d",
          "1-b, 2-c, 3-a, 4-d"
        ],
        "correctIndex": 0,
        "explanation": "La correspondencia exacta es: 1-c (Sudán/Oil Red O tiñen lípidos neutros en criocortes sin desparafinar en xilol); 2-b (Masson tiñe colágeno en azul/verde y músculo en rojo); 3-d (PAS oxida grupos glicol adyacentes formando aldehídos que reaccionan con reactivo de Schiff tiñendo glucógeno y glucoproteínas); 4-a (Fontana-Masson reduce nitrato de plata por acción de la melanina o serotonina tiñéndolas de negro)."
      },
      {
        "id": "histo_3",
        "question": "Varón de 28 años con sinusitis crónica, bronquiectasias bilaterales e infertilidad primaria. El estudio de microscopía electrónica de la mucosa nasal revela alteración ultraestructural de los cilios de las células del epitelio respiratorio (Disquinesia Ciliar Primaria / Síndrome de Kartagener).\n\nEn relación a la ultraestructura celular del epitelio respiratorio y los cilios móviles:\nI. El axonema ciliar posee una disposición clásica de microtúbulos consistente en 9 dobletes periféricos y 1 par central (organización 9+2).\nII. Los brazos de dineína ciliar interna y externa proporcionan la actividad ATPasa indispensable para el movimiento y batido ciliar coordinado.\nIII. El cuerpo basal (cinetosoma) situado en la base del cilio presenta una disposición de microtúbulos en 9 tripletes periféricos sin singlete central (organización 9+0).\nIV. Las células caliciformes son glándulas unicelulares exocrinas intraepiteliales que producen mucinas ricas en carbohidratos, las cuales se tiñen intensamente con la reacción de Feulgen.\n\n¿Cuáles de los enunciados son CORRECTOS?",
        "options": [
          "Solo I y II",
          "II y IV",
          "I, II y III",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 2,
        "explanation": "Enunciados I, II y III son CORRECTOS: El axonema móvil tiene estructura 9+2, los brazos de dineína catalizan ATP para el batido (mutados en Kartagener), y los cuerpos basales se originan de centriolos con arquitectura 9+0 en tripletes. El enunciado IV es FALSO porque la tinción de Feulgen es específica para el ADN nuclear (no para mucinas; las mucinas se tiñen con PAS o Azul Alcian)."
      },
      {
        "id": "histo_4",
        "question": "El tejido óseo es un tejido conectivo mineralizado en constante recambio mediante el acoplamiento de osteoblastos y osteoclastos.\n\nSobre la histogénesis ósea y la biología celular de sus componentes:\nI. Los osteoclastos son células gigantes multinucleadas originadas de la fusión de precursores monocito-macrofágicos de la médula ósea y se alojan en las lagunas de Howship.\nII. El osteoide es la matriz orgánica no mineralizada sintetizada por los osteoblastos, compuesta predominantemente por colágeno tipo I y proteoglucanos.\nIII. Los osteocitos conservan prolongaciones citoplasmáticas comunicadas a través de canalículos óseos mediante uniones tipo gap (hendidura o nexo).\nIV. La fosfatasa ácida resistente al tartrato (TRAP) es un marcador enzimático e histoquímico distintivo de la actividad funcional osteoblástica.\n\nSon premisas VERDADERAS:",
        "options": [
          "I, II y III",
          "I y II",
          "II y IV",
          "Solo I y III",
          "Todas son correctas"
        ],
        "correctIndex": 0,
        "explanation": "Enunciados I, II y III son VERDADEROS: Los osteoclastos derivan de la línea hematopoyética mieloide/monocítica y reabsorben hueso en las lagunas de Howship; el osteoide es matriz pre-mineralizada con colágeno I elaborada por osteoblastos; los osteocitos coordinan el mecanoestrés mediante canalículos y conexinas (gap junctions). El enunciado IV es FALSO porque la TRAP es el marcador patognomónico del OSTEOCLASTO; el marcador de los osteoblastos es la fosfatasa ALCALINA (ALP)."
      },
      {
        "id": "histo_5",
        "question": "En el análisis comparativo histológico entre los tres tipos de tejido muscular (esquelético, cardíaco y liso):\n\nI. En el músculo esquelético, la tríada sarcomérica se localiza a nivel de la unión banda A-banda I y está formada por un túbulo T central y dos cisternas terminales del retículo sarcoplásmico.\nII. El músculo cardíaco presenta discos intercalares con desmosomas, fascias adherentes y uniones comunicantes (gap junctions), además de díadas situadas a nivel de la línea Z.\nIII. Las fibras musculares lisas carecen de sarcómeros y túbulos T organizados, utilizando calmodulina en lugar de troponina C para la regulación mediada por calcio.\nIV. Los cuerpos densos en el citoplasma y membrana del músculo liso son homólogos funcionales a las líneas Z del músculo estriado y anclan filamentos de actina y filamentos intermedios.\n\n¿Cuáles de las afirmaciones son CORRECTAS?",
        "options": [
          "I y II",
          "Solo I, II y III",
          "II y III",
          "I, III y IV",
          "I, II, III y IV"
        ],
        "correctIndex": 4,
        "explanation": "Las 4 afirmaciones (I, II, III y IV) son CORRECTAS: En músculo esquelético humano hay tríadas en las uniones A-I; en el miocardio hay díadas en las líneas Z con discos intercalares; el músculo liso no tiene troponina C (usa calmodulina y cinasa de cadenas ligeras de miosina MLCK) y contiene cuerpos densos con alfa-actinina que equivalen a los discos Z."
      },
      {
        "id": "histo_6",
        "question": "La clasificación morfológica de los epitelios de revestimiento responde a adaptaciones biomecánicas y funcionales específicas.\n\nRelacione el tipo de epitelio con su localización anatómica característica:\n1. Epitelio plano simple (endotelio/mesotelio)\n2. Epitelio cilíndrico pseudoestratificado ciliado con células caliciformes\n3. Epitelio de transición (urotelio)\n4. Epitelio cilíndrico simple con microvellosidades en chapa estriada\n\na. Mucosa traqueal y bronquios principales\nb. Cápsula de Bowman (hoja parietal) y revestimiento vascular\nc. Mucosa del yeyuno e íleon\nd. Cálices renales, uréteres y vejiga urinaria",
        "options": [
          "1-b, 2-a, 3-d, 4-c",
          "1-a, 2-b, 3-c, 4-d",
          "1-c, 2-d, 3-a, 4-b",
          "1-b, 2-c, 3-d, 4-a",
          "1-d, 2-a, 3-b, 4-c"
        ],
        "correctIndex": 0,
        "explanation": "La relación precisa es: 1-b (plano simple en hoja parietal de la cápsula de Bowman y endotelio vascular); 2-a (epitelio respiratorio clásico pseudoestratificado en tráquea); 3-d (urotelio estratificado polimorfo distensible en vías urinarias bajas); 4-c (epitelio entérico de absorción con enterocitos y chapa estriada)."
      },
      {
        "id": "histo_7",
        "question": "En el tejido nervioso del sistema nervioso central (SNC) y periférico (SNP), las células de la glía cumplen funciones esenciales de soporte, mielinización y defensa.\n\nAnalice las siguientes proposiciones:\nI. Los astrocitos expresan fuertemente la proteína glial fibrilar ácida (GFAP) y sus pedicelos vasculares (pies perivasculares) inducen y mantienen la integridad de la barrera hematoencefálica.\nII. Un único oligodendrocito en el SNC es capaz de mielinizar segmentos internodales de múltiples axones simultáneamente, a diferencia de la célula de Schwann en el SNP.\nIII. La microglía deriva embriológicamente del neuroectodermo del tubo neural al igual que las neuronas y astrocitos.\nIV. Las células ependimarias revisten los ventrículos cerebrales y el conducto central de la médula espinal, presentando microvellosidades y cilios que favorecen la circulación del líquido cefalorraquídeo.\n\n¿Cuáles de las afirmaciones son CORRECTAS?",
        "options": [
          "I y II",
          "I, II y IV",
          "II, III y IV",
          "Solo I y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y IV son CORRECTOS: Los astrocitos expresan GFAP y forman la BHE con sus pedicelos; los oligodendrocitos mielinizan hasta 50 axones adyacentes; las células ependimarias cúbico-cilíndricas movilizan LCR. El enunciado III es FALSO porque la microglía es el macrófago residente del SNC y deriva del MESODERMO (saco vitelino/mieloblastos embrionarios), no del neuroectodermo."
      },
      {
        "id": "histo_8",
        "question": "Respecto a las variedades histológicas de cartílago (hialino, elástico y fibrocartílago):\n\nI. El cartílago hialino posee una matriz cartilaginosa con colágeno tipo II y agregados de agrecano ricos en condroitín sulfato.\nII. El fibrocartílago (cartílago fibroso) contiene abundantes haces de colágeno tipo I y carece de pericondrio en todas sus localizaciones anatómicas (como sínfisis púbica y discos intervertebrales).\nIII. El cartílago elástico contiene fibras elásticas abundantes que se evidencian mediante tinciones de orceína o resorcina-fucsina y nunca experimenta calcificación fisiológica por envejecimiento.\nIV. Los condrocitos del cartílago articular reciben su nutrición y oxígeno principalmente a través del pericondrio denso que reviste la superficie libre de la articulación sinovial.\n\nSon enunciados VERDADEROS:",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son VERDADEROS: El cartílago hialino se caracteriza por colágeno II; el fibrocartílago tiene colágeno I y carece de pericondrio; el elástico posee orceína-positividad y no se calcifica con la edad. El enunciado IV es FALSO porque el cartílago articular CARECE de pericondrio en su superficie articular para evitar fricción; su nutrición proviene exclusivamente por difusión desde el líquido sinovial y vasos subcondrales."
      }
    ]
  },
  {
    "id": "parasitologia",
    "title": "🪱 Parasitología Médica & Enfermedades Tropicales",
    "subtitle": "Ciclos Biológicos, Protozoarios, Helmintos y Diagnóstico Parasitológico",
    "badge": "Parasitología",
    "badgeColor": "#f59e0b",
    "description": "Casos clínicos de enfermedades parasitarias endémicas, protozoarios luminales y tisulares, helmintiasis, fases infectantes diagnósticas e ítems I-IV.",
    "questions": [
      {
        "id": "para_1",
        "question": "Niño de 6 años procedente de zona rural de la selva es llevado al puesto de salud por dolor abdominal cólico difuso, vómitos con expulsión de gusanos cilíndricos de 20 cm, distensión abdominal y marcada eosinofilia periférica (18%).\n\nRespecto a la biología, patogénesis y ciclo de Ascaris lumbricoides:\nI. El estadio infectante para el ser humano es el huevo larvado que contiene la larva de segundo estadio (L2) o tercer estadio (L3), adquirido por vía fecal-oral.\nII. La migración larvaria por la circulación pulmonar puede desencadenar el Síndrome de Löffler (neumonitis eosinofílica con infiltrados radiográficos fugaces).\nIII. El hábitat definitivo donde los parásitos adultos copulan y habitan habitualmente es el intestino grueso a nivel del ciego y colon ascendente.\nIV. La oclusión o vólvulo intestinal mecánico es la complicación quirúrgica aguda más frecuente en niños con altas cargas de infestación.\n\n¿Cuáles de los enunciados son VERDADEROS?",
        "options": [
          "Solo I y II",
          "I, II y IV",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y IV son VERDADEROS: La infección ocurre por ingesta de huevos larvados fértiles; la fase de paso pulmonar alveolar produce neumonitis de Löffler con tos y eosinofilia; y la masa de adultos puede provocar suboclusión mecánica en íleon. El enunciado III es FALSO porque el hábitat definitivo del adulto de Ascaris es la luz del INTESTINO DELGADO (especialmente yeyuno e íleon), no el colon."
      },
      {
        "id": "para_2",
        "question": "El conocimiento de los estadios infectantes es crucial para comprender la vía de transmisión y el control epidemiológico de las parasitosis humanas.\n\nRelacione cada parásito con su forma infectante específica para el hospedero humano definitivo:\n1. Entamoeba histolytica\n2. Taenia solium (desarrollo de Teniasis intestinal)\n3. Strongyloides stercoralis\n4. Fasciola hepatica\n\na. Cisticerco (Cysticercus cellulosae) en carne de cerdo cruda o mal cocida\nb. Larva filariforme (L3) por penetración transcutánea activa\nc. Quiste tetranucleado maduro por ingesta de agua o alimentos contaminados\nd. Metacercaria enquistada en plantas acuáticas (ej. berros)",
        "options": [
          "1-c, 2-a, 3-b, 4-d",
          "1-a, 2-c, 3-d, 4-b",
          "1-c, 2-d, 3-b, 4-a",
          "1-d, 2-a, 3-b, 4-c",
          "1-b, 2-a, 3-c, 4-d"
        ],
        "correctIndex": 0,
        "explanation": "La relación correcta es: 1-c (E. histolytica se transmite por quiste maduro tetranucleado); 2-a (la Teniasis humana se adquiere al comer carne con cisticercos; la cisticercosis humana se adquiere por huevos de T. solium); 3-b (S. stercoralis penetra piel como larva filariforme L3); 4-d (Fasciola enquista metacercarias en plantas como berros)."
      },
      {
        "id": "para_3",
        "question": "Mujer de 25 años acude por cuadro de 3 semanas de evolución caracterizado por diarrea esteatorreica, flatulencia fétida, náuseas, anorexia y pérdida de peso de 3 kg tras campamento de montaña. El examen seriado de heces confirma la presencia de quistes de Giardia lamblia (duodenalis).\n\nRespecto a la fisiopatología y diagnóstico de Giardia lamblia:\nI. El trofozoíto se fija al ribete en cepillo del epitelio del duodeno y yeyuno proximal mediante su disco succionador o adhesivo ventral.\nII. Giardia lamblia produce invasión transmural profunda y úlceras \"en cuello de botella\" con hemorragia digestiva masiva en la mucosa colónica.\nIII. La infección causa aplanamiento de microvellosidades, deficiencia secundaria de disacaridasas (como lactasa) y malabsorción de grasas y vitaminas liposolubles.\nIV. Los pacientes con hipogammaglobulinemia común variable o deficiencia selectiva de IgA presentan cuadros más severos, refractarios y crónicos.\n\nSon proposiciones CORRECTAS:",
        "options": [
          "Solo I y III",
          "I, II y IV",
          "I, III y IV",
          "II, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 2,
        "explanation": "Enunciados I, III y IV son CORRECTOS: Giardia se adhiere mediante su disco suctorio ventral en duodeno/yeyuno sin invadir la pared, lesiona el borde en cepillo causando malabsorción y deficiencia de lactasa, y la IgA secretora es el pilar defensivo principal. El enunciado II es FALSO porque Giardia NO invade transmuralmente ni hace úlceras en cuello de botella; ese es el mecanismo lesional patognomónico de Entamoeba histolytica en el colon."
      },
      {
        "id": "para_4",
        "question": "Varón de 32 años sin antecedentes de epilepsia presenta crisis convulsivas tónico-clónico generalizadas. La tomografía cerebral computarizada muestra múltiples lesiones quísticas calcificadas y un quiste vesicular con nódulo mural hiperdenso (\"scolex\") en el parénquima frontal (Neurocisticercosis).\n\nEn relación a la neurocisticercosis y Taenia solium:\nI. El ser humano desarrolla neurocisticercosis al actuar como hospedero intermediario accidental mediante la ingestión de huevos de Taenia solium eliminados en heces humanas.\nII. El consumo de carne de cerdo infectada con cisticercos (\"triquina/cisticerco\") produce teniasis intestinal adulta en el humano, no cisticercosis directa.\nIII. La presencia de auto-infección interna o externa (fecal-oral) en un portador de teniasis adulta es un factor de riesgo mayor para contraer cisticercosis tisular.\nIV. La respuesta inflamatoria del hospedero y el edema perilesional alcanzan su máxima intensidad en la fase vesicular viable inicial del cisticerco.\n\n¿Cuáles afirmaciones son CORRECTAS?",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son CORRECTOS: La cisticercosis tisular humana requiere ingerir HUEVOS de T. solium (por alimentos contaminados o autoinfección ano-mano-boca en portadores de tenia intestinal), mientras que comer cisticercos en cerdo produce teniasis intestinal. El enunciado IV es FALSO porque en la fase vesicular el parásito evade la inmunidad y apenas genera inflamación; la reacción inmune y el edema cerebral máximo ocurren en la fase COLOIDAL degenerativa al morir la larva."
      },
      {
        "id": "para_5",
        "question": "En áreas endémicas de malaria en la Amazonía peruana, la diferenciación biológica y clínica entre Plasmodium falciparum y Plasmodium vivax es determinante para el esquema terapéutico.\n\nAnalice las premisas siguientes:\nI. Plasmodium vivax y Plasmodium ovale producen formas intrahepáticas latentes denominadas hipnozoítos, responsables de recaídas tardías a distancia.\nII. Plasmodium falciparum parasita eritrocitos de todas las edades, induciendo la expresión de la proteína PfEMP-1 que causa citoadherencia endotelial, secuestro microvascular y malaria cerebral.\nIII. La gota gruesa y el frotis sanguíneo teñidos con Giemsa o Wright continúan siendo el estándar de oro laboratorial para la identificación de especie y densidad parasitaria.\nIV. El tratamiento radical de Plasmodium vivax requiere únicamente Cloroquina, no siendo necesaria la administración de Primaquina debido a la ausencia de estadios tisulares.\n\nSon enunciados VERDADEROS:",
        "options": [
          "I, II y III",
          "Solo I y II",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 0,
        "explanation": "Enunciados I, II y III son VERDADEROS: P. vivax forma hipnozoítos en hepatocitos que reactivan la infección; P. falciparum invade hematíes sin límite de edad causando hiperparasitemia y secuestro capilar vía PfEMP-1; la gota gruesa/frotis es el gold standard diagnóstico. El enunciado IV es FALSO porque la curación radical de P. vivax OBLIGA a utilizar Primaquina (actividad esquizonticida tisular contra hipnozoítos) para evitar recaídas."
      },
      {
        "id": "para_6",
        "question": "Para un óptimo rendimiento diagnóstico en parasitología clínica, cada agente requiere una técnica de toma de muestra y procesamiento adecuada.\n\nRelacione el parásito con la técnica diagnóstica de primera línea:\n1. Enterobius vermicularis (oxiuro)\n2. Strongyloides stercoralis\n3. Cryptosporidium parvum\n4. Trichomonas vaginalis\n\na. Examen microscópico en fresco de secreción vaginal o sedimento urinario\nb. Test de Graham (cinta adhesiva perianal seriada por la mañana)\nc. Tinción de Ziehl-Neelsen modificada (Kinyoun) en frotis fecal\nd. Método de concentración de Baermann o cultivo en placa de agar",
        "options": [
          "1-b, 2-d, 3-c, 4-a",
          "1-a, 2-c, 3-b, 4-d",
          "1-b, 2-a, 3-c, 4-d",
          "1-c, 2-d, 3-a, 4-b",
          "1-d, 2-b, 3-c, 4-a"
        ],
        "correctIndex": 0,
        "explanation": "La relación precisa es: 1-b (Graham captura huevos asimétricos de oxiuros depositados por la hembra en la noche); 2-d (Baermann o cultivo en agar concentra larvas rabditoides vivas de Strongyloides aprovechando hidro/termotropismo positivo); 3-c (ooquistes ácido-alcohol resistentes de Cryptosporidium se evidencian con Kinyoun); 4-a (examen en fresco móvil para trofozoítos de T. vaginalis)."
      },
      {
        "id": "para_7",
        "question": "Varón de 45 años, ganadero de la sierra central, acude por dolor sordo en hipocondrio derecho y sensación de masa. La ecografía abdominal muestra una lesión quística unilocular de 12 cm en lóbulo hepático derecho con pared doble y calcificación periférica parcial (Quiste Hidatídico Hepático).\n\nSobre la hidatidosis y Echinococcus granulosus:\nI. El perro doméstico u otros cánidos actúan como hospedero definitivo al albergar los gusanos adultos en su intestino.\nII. El ser humano y los ovinos son hospederos intermediarios que contraen la infección al ingerir huevos embrionados eliminados en las heces del perro.\nIII. La pared del quiste hidatídico se compone de una adventicia fibrosa del hospedero (periquística), una membrana cuticular acelular laminar y una membrana germinativa interna proliferativa.\nIV. La aspiración diagnóstica con aguja fina percutánea no guiada es el procedimiento inocuo de primera elección previo al uso de albendazol.\n\n¿Cuáles afirmaciones son VERDADERAS?",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son VERDADEROS: El ciclo tiene al perro como hospedero definitivo y al ganado ovino/humano como intermediarios donde crece el quiste de triple capa. El enunciado IV es FALSO y sumamente peligroso: la punción a ciegas está CONTRAINDICADA por el altísimo riesgo de fuga de líquido hidatídico, shock anafiláctico mortal y siembra peritoneal secundaria."
      },
      {
        "id": "para_8",
        "question": "En relación a la leishmaniasis tegumentaria (Uta y Espundia) y visceral (Kala-azar):\n\nI. Los vectores biológicos involucrados en la transmisión son dípteros flebótomos hembra de los géneros Lutzomyia (en el Nuevo Mundo) y Phlebotomus (en el Viejo Mundo).\nII. La forma infectante inoculada por el vector en la piel humana durante la picadura es el promastigote flagelado metacíclico.\nIII. Dentro de los macrófagos y células del sistema fagocítico mononuclear humano, el parásito se multiplica activamente en forma de amastigote intracelular aflagelado.\nIV. La intradermorreacción de Montenegro (leishmanina) resulta típicamente muy positiva con induración franca en los pacientes con leishmaniasis visceral avanzada por anergia celular selectiva.\n\nSon proposiciones CORRECTAS:",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son CORRECTOS: Los flebótomos (Lutzomyia) transmiten promastigotes metacíclicos que en los fagolisosomas de los macrófagos se diferencian a amastigotes. El enunciado IV es FALSO porque en la leishmaniasis visceral (Kala-azar) existe supresión masiva de la inmunidad celular mediada por linfocitos T Th1, siendo la prueba de Montenegro TÍPICAMENTE NEGATIVA (se negativiza durante la enfermedad activa y solo positiviza tras curación)."
      }
    ]
  },
  {
    "id": "bacteriologia",
    "title": "🧫 Bacteriología Clínica & Resistencia Antimicrobiana",
    "subtitle": "Patógenos Gram (+)/(-), Factores de Virulencia y Mecanismos Moleculares",
    "badge": "Bacteriología",
    "badgeColor": "#10b981",
    "description": "Identificación fenotípica y molecular de bacterias de relevancia médica, cocos y bacilos, perfiles de susceptibilidad BLEE/Carbapenemasas y casos clínicos.",
    "questions": [
      {
        "id": "bact_1",
        "question": "Paciente en UCI conectado a ventilación mecánica hace 9 días presenta fiebre de 39°C, aumento de secreciones traqueobronquiales purulentas verdosas y nuevos infiltrados pulmonares. El cultivo cuantitativo del aspirado traqueal aísla un bacilo Gram negativo no fermentador de glucosa, oxidasa positivo, productor de piocianina y piovirdina (Pseudomonas aeruginosa).\n\nEn cuanto a los determinantes de patogenicidad y resistencia de este microorganismo:\nI. La Exotoxina A es su principal factor de virulencia y posee el mismo mecanismo molecular que la toxina diftérica (inactivación del factor de elongación EF-2 mediante ADP-ribosilación).\nII. La producción de un polisacárido mucoide capsular rico en alginato confiere formación de biopelículas (biofilms) que obstaculizan la fagocitosis y penetración de antibióticos.\nIII. Posee resistencia intrínseca a múltiples antibióticos mediada por baja permeabilidad de su membrana externa (porinas OprD) y bombas de eflujo activo (MexAB-OprM).\nIV. La Ceftriaxona y Ertapenem representan las cefalosporinas y carbapenémicos de máxima potencia y primera línea con actividad antipseudomónica comprobada.\n\n¿Cuáles enunciados son VERDADEROS?",
        "options": [
          "I y II",
          "Solo I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son VERDADEROS: La exotoxina A inhibe la síntesis proteica vía EF-2; el alginato genera biofilms en vías aéreas; y las bombas Mex junto a porinas confieren alta resistencia intrínseca. El enunciado IV es FALSO porque Ceftriaxona y Ertapenem CARECEN de actividad frente a P. aeruginosa (los betalactámicos antipseudomonas son Ceftazidima, Cefepima, Piperacilina/Tazobactam, Meropenem e Imipenem)."
      },
      {
        "id": "bact_2",
        "question": "La emergencia global de mecanismos de resistencia bacteriana amenaza la eficacia de la terapia antimicrobiana.\n\nRelacione el mecanismo molecular / gen de resistencia con la familia de antibióticos inactivados:\n1. Gen mecA (síntesis de PBP2a)\n2. Betalactamasas de espectro extendido (BLEE tipo CTX-M)\n3. Carbapenemasas tipo KPC (Klebsiella pneumoniae carbapenemase)\n4. Operón vanA (sustitución D-Ala-D-Ala por D-Ala-D-Lac)\n\na. Penicilinas, cefalosporinas de todas las generaciones y carbapenémicos\nb. Glucopéptidos (vancomicina y teicoplanina)\nc. Todos los betalactámicos (penicilinas, cefalosporinas y monobactámicos), respetando carbapenémicos\nd. Todas las penicilinas isoxazólicas (oxacilina, meticilina) y casi todas las cefalosporinas",
        "options": [
          "1-d, 2-c, 3-a, 4-b",
          "1-c, 2-d, 3-a, 4-b",
          "1-d, 2-a, 3-c, 4-b",
          "1-b, 2-c, 3-d, 4-a",
          "1-a, 2-b, 3-c, 4-d"
        ],
        "correctIndex": 0,
        "explanation": "La relación correcta es: 1-d (mecA genera PBP2a con baja afinidad a betalactámicos en MRSA); 2-c (las BLEE degradan cefalosporinas de 1.ª a 4.ª generación y aztreonam, pero son sensibles a carbapenémicos); 3-a (las carbapenemasas KPC son clase A de Ambler e hidrolizan carbapenémicos y todos los betalactámicos); 4-b (vanA modifica el extremo del peptidoglucano tornando ineficaces a los glucopéptidos)."
      },
      {
        "id": "bact_3",
        "question": "Mujer de 68 años hospitalizada por neumonía que recibió Ceftriaxona y Clindamicina durante 10 días. Al 3.er día posalta presenta diarrea acuosa abundante (8 deposiciones/día), fiebre y leucocitosis de 22,000/uL. La sigmoidoscopía revela placas blanco-amarillentas elevadas adheridas a la mucosa cólica (Colitis Pseudomembranosa por Clostridioides difficile).\n\nEn relación a la fisiopatología y manejo de Clostridioides difficile:\nI. Es un bacilo Gram positivo formador de esporas, anaerobio estricto, productor de toxina A (enterotoxina) y toxina B (citotoxina potente).\nII. Ambas toxinas glucosilan e inactivan proteínas de la familia Rho GTPasas, causando despolimerización de filamentos de actina y muerte de los colonocitos.\nIII. La cepa epidémica hipervirulenta BI/NAP1/027 presenta una mutación por deleción en el gen tcdC (regulador negativo), provocando una producción sobrexpresada de toxinas A y B, además de sintetizar la toxina binaria.\nIV. La loperamida y otros opioides antimotilidad están formalmente indicados para reducir la deshidratación en las primeras 48 horas de tratamiento.\n\n¿Cuáles enunciados son VERDADEROS?",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son VERDADEROS: C. difficile produce toxinas A y B que inactivan Rho GTPasas destruyendo el citoesqueleto celular, y el ribotipo 027 carece del freno tcdC produciendo toxinas en exceso. El enunciado IV es FALSO y contraproducente: los fármacos antidiarreicos antimotilidad como la loperamida están CONTRAINDICADOS porque favorecen la retención luminal de toxinas y precipitan megacolon tóxico y perforación."
      },
      {
        "id": "bact_4",
        "question": "En el laboratorio de microbiología, la diferenciación fenotípica entre especies del género Staphylococcus es fundamental para la toma de decisiones clínicas.\n\nAnalice las siguientes afirmaciones:\nI. Staphylococcus aureus se diferencia de las especies de estafilococos coagulasa negativos (como S. epidermidis y S. saprophyticus) por la producción de coagulasa y fermentación de manitol en agar salado manitol.\nII. La Proteína A de la pared celular de S. aureus se une a la fracción Fc de la IgG, impidiendo la opsonización mediada por anticuerpos y la posterior fagocitosis.\nIII. La Toxina del Síndrome de Shock Tóxico 1 (TSST-1) actúa como un superantígeno capaz de unirse simultáneamente a la región V-beta del receptor de células T (TCR) y a moléculas del CMH clase II sin procesamiento antigénico previo.\nIV. Staphylococcus saprophyticus es uniformemente susceptible a la novobiocina, a diferencia de S. epidermidis que es intrínsecamente resistente.\n\nSon proposiciones CORRECTAS:",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son CORRECTOS: S. aureus es coagulasa (+), fermenta manitol virando el agar a amarillo, expresa Proteína A unida al Fc de IgG y libera TSST-1 que genera tormenta masiva de citocinas (IL-1, IL-2, TNF-alfa). El enunciado IV es FALSO porque S. saprophyticus es RESISTENTE a novobiocina (clave diagnóstica diferencial en infecciones urinarias en mujeres jóvenes), mientras que S. epidermidis es sensible."
      },
      {
        "id": "bact_5",
        "question": "Varón de 55 años con antecedente de esplenectomía postraumática ingresa a urgencias con neumonía adquirida en la comunidad, shock séptico y hemocultivos positivos para diplococos Gram positivos lanceolados (Streptococcus pneumoniae).\n\nRespecto a los determinantes de virulencia y prevención de Streptococcus pneumoniae:\nI. La cápsula polisacárida es su principal factor de virulencia antifagocítico, existiendo más de 100 serotipos antigénicos identificados mediante la reacción de Quellung (neufeld).\nII. La neumolisina es una citotoxina formadora de poros que destruye las células epiteliales ciliadas y fagocitos del hospedero.\nIII. En el laboratorio, se identifica por ser alfa-hemolítico en agar sangre, soluble en bilis y sensible al disco de optoquina (clorhidrato de etilhidrocupreína).\nIV. Los pacientes asplénicos tienen un riesgo similar de sepsis fulminante que la población general debido a que la opsonización por IgM ocurre indistintamente en médula ósea.\n\n¿Cuáles premisas son VERDADERAS?",
        "options": [
          "I, II y III",
          "Solo I y II",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 0,
        "explanation": "Enunciados I, II y III son VERDADEROS: La cápsula polisacárida es la diana de las vacunas conjugadas (PCV13, PCV20), la neumolisina lesiona epitelios y el germen es bilis-soluble y sensible a optoquina. El enunciado IV es FALSO: los asplénicos sufren un riesgo exponencialmente mayor (50-100 veces) de sepsis bacteriana fulminante por bacterias capsuladas (S. pneumoniae, N. meningitidis, H. influenzae) al carecer de macrófagos de la pulpa roja esplénica y properdina."
      },
      {
        "id": "bact_6",
        "question": "Los medios de cultivo selectivos y las pruebas bioquímicas diferenciales permiten aislar patógenos entéricos y respiratorios específicos.\n\nRelacione el microorganismo con su medio de cultivo selectivo o característica bioquímica clave:\n1. Corynebacterium diphtheriae\n2. Vibrio cholerae\n3. Salmonella enterica serotipo Typhi\n4. Neisseria meningitidis\n\na. Agar TCBS (Tiosulfato-Citrato-Bilis-Sacarosa) donde forma colonias amarillas fermentadoras de sacarosa\nb. Medio de Löffler o agar telurito de potasio (medio de Tinsdale) formando colonias grisáceas/negras con halo pardo\nc. Agar Thayer-Martin modificado (agar chocolate suplementado con vancomicina, colistina y nistatina)\nd. Agar MacConkey (lactosa negativa) y producción de ácido sulfhídrico (H2S positivo) en agar TSI",
        "options": [
          "1-b, 2-a, 3-d, 4-c",
          "1-a, 2-b, 3-c, 4-d",
          "1-c, 2-a, 3-d, 4-b",
          "1-b, 2-d, 3-a, 4-c",
          "1-d, 2-a, 3-b, 4-c"
        ],
        "correctIndex": 0,
        "explanation": "La relación precisa es: 1-b (C. diphtheriae reduce el telurito de potasio dando colonias negras en Tinsdale); 2-a (V. cholerae tolera el pH alcalino y fermenta sacarosa en TCBS originando colonias amarillas); 3-d (Salmonella no fermenta lactosa y produce sulfuro de hidrógeno negro en TSI); 4-c (Thayer-Martin inhibe flora saprofita con antibióticos aislando Neisserias patógenas)."
      },
      {
        "id": "bact_7",
        "question": "Recién nacido de 4 días presenta letargia, dificultad respiratoria, inestabilidad térmica y signos meníngeos. La punción lumbar revela pleocitosis con predominio mononuclear/polimorfonuclear, hiperproteinorraquia e hipoglucorraquia. La tinción de Gram muestra bacilos Gram positivos cortos no esporulados (Listeria monocytogenes).\n\nEn relación a Listeria monocytogenes:\nI. Es un patógeno intracelular facultativo capaz de multiplicarse a temperaturas de refrigeración (psicrótrofo, 4°C).\nII. Posee movilidad en \"voltereta\" (tumbling motility) a 22-25°C, mediada por flagelos dependientes de temperatura.\nIII. Utiliza la listeriolisina O (LLO) y fosfolipasas para lisar la membrana del fagosoma y escapar al citosol del macrófago, movilizándose de célula a célula polimerizando filamentos de actina del hospedero (proteína ActA).\nIV. Las cefalosporinas de tercera generación como Cefotaxima o Ceftriaxona constituyen la terapia empírica de primera línea obligatoria por su excelente cobertura.\n\n¿Cuáles son CORRECTAS?",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son CORRECTOS: Crece en frío, tiene movilidad típica en voltereta a temperatura ambiente, y usa listeriolisina O junto con ActA (\"colas de cometa\" de actina) para propagarse entre células sin contacto extracelular. El enunciado IV es FALSO y una trampa clásica de examen: Listeria posee RESISTENCIA INTRÍNSECA natural a TODAS las cefalosporinas (incluidas de 3.ª y 4.ª generación); el tratamiento de elección es AMPICILINA (asociada o no a gentamicina)."
      },
      {
        "id": "bact_8",
        "question": "Niño de 4 años acude a urgencias por presentar diarrea sanguinolenta, oliguria marcada, palidez extrema y petequias 6 días después de ingerir hamburguesa de carne vacuna mal cocida. Los exámenes de laboratorio revelan anemia hemolítica microangiopática con esquistocitos, trombocitopenia severa y falla renal aguda (Síndrome Urémico Hemolítico - SUH).\n\nRespecto a Escherichia coli enterotoxigénica y enterohemorrágica:\nI. El cuadro es provocado por Escherichia coli enterohemorrágica (EHEC / STEC), cuyo serotipo más prevalente es O157:H7.\nII. La toxina Shiga 1 y 2 (Stx1/Stx2) se une al receptor globotriaosilceramida (Gb3) en las células endoteliales de las microvasculatura glomerular causando daño endotelial y microtrombos.\nIII. El uso de antibióticos bactericidas (como fluoroquinolonas o betalactámicos) durante la fase de diarrea está plenamente recomendado porque disminuye la incidencia de SUH en un 80%.\nIV. En agar MacConkey-Sorbitol (SMAC), la cepa E. coli O157:H7 se distingue porque no fermenta el sorbitol a las 24 horas (colonias incoloras).\n\n¿Cuáles enunciados son VERDADEROS?",
        "options": [
          "Solo I y II",
          "I, II y IV",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y IV son VERDADEROS: EHEC O157:H7 produce toxinas Shiga que dianan el receptor Gb3 renal generando microangiopatía trombótica con esquistocitos, y en agar SMAC no fermenta sorbitol. El enunciado III es FALSO: el tratamiento con antibióticos está CONTRAINDICADO formalmente porque induce la respuesta SOS bacteriana, incrementando la lisis celular, la liberación masiva de toxina Stx y el riesgo de desencadenar o agravar el SUH."
      }
    ]
  },
  {
    "id": "virologia",
    "title": "🦠 Virología Médica & Agentes Infecciosos Emergentes",
    "subtitle": "Hepatitis Viral, Retrovirus (VIH), Arbovirus y Patogénesis Molecular",
    "badge": "Virología",
    "badgeColor": "#6366f1",
    "description": "Interpretación exhaustiva de perfiles serológicos (VHB/VHC), ciclo replicativo del VIH-1, arbovirosis (Dengue, Zika), virus respiratorios y casos clínicos con ítems I-IV.",
    "questions": [
      {
        "id": "viro_1",
        "question": "Un médico residente de primer año se realiza el control serológico ocupacional para Hepatitis B, con el siguiente resultado de laboratorio:\n- HBsAg (Antígeno de superficie): NEGATIVO\n- Anti-HBs (Anticuerpo contra el antígeno de superficie): POSITIVO (título 350 mUI/mL)\n- Anti-HBc Total (Anticuerpo contra el core): NEGATIVO\n- HBeAg: NEGATIVO\n\nRespecto a la interpretación serológica y virológica del virus de la Hepatitis B (VHB):\nI. El patrón serológico presentado corresponde indudablemente a un estado de inmunidad conferida por vacunación previa exitosa contra el VHB.\nII. La presencia de Anti-HBc positivo (tipo IgG) es el marcador biológico que distingue una infección pasada resuelta curada de la inmunidad por vacunación.\nIII. El genoma del VHB es un ADN circular parcialmente bicatenario y utiliza una transcriptasa inversa para su replicación a través de un intermediario de ARN pregenómico.\nIV. La positividad aislada de HBeAg es indicativa de baja infectividad y supresión de la replicación viral activa.\n\n¿Cuáles afirmaciones son VERDADERAS?",
        "options": [
          "I, II y III",
          "Solo I y II",
          "II y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 0,
        "explanation": "Enunciados I, II y III son VERDADEROS: La vacuna recombinante contiene únicamente HBsAg, por lo que el vacunado desarrolla solo Anti-HBs sin generar Anti-HBc (el cual exige replicación de viriones completos); el VHB es un Hepadnavirus con retrotranscripción. El enunciado IV es FALSO porque HBeAg es el marcador clásico de ALTA replicación viral e hiperinfectividad (su desaparición y seroconversión a Anti-HBe marca baja replicación)."
      },
      {
        "id": "viro_2",
        "question": "Los virus hepatotropos primarios pertenecen a familias virales diversas con características biológicas y mecanismos patogénicos distintos.\n\nRelacione el virus de la hepatitis con su estructura genómica y vía de transmisión predominante:\n1. Virus de la Hepatitis A (VHA)\n2. Virus de la Hepatitis B (VHB)\n3. Virus de la Hepatitis C (VHC)\n4. Virus de la Hepatitis D (VHD o delta)\n\na. Virus ARN monocatenario sentido positivo (Flaviviridae), transmisión parenteral/sanguínea principal, alto índice de cronicidad\nb. Virus ARN circular monocatenario defectivo con envoltura prestada de HBsAg, transmisión parenteral/sexual\nc. Virus ARN monocatenario sin envoltura (Picornaviridae), transmisión fecal-oral por agua o alimentos contaminados\nd. Virus ADN parcialmente bicatenario con transcriptasa inversa (Hepadnaviridae), transmisión parenteral, sexual y vertical",
        "options": [
          "1-c, 2-d, 3-a, 4-b",
          "1-a, 2-b, 3-c, 4-d",
          "1-c, 2-a, 3-d, 4-b",
          "1-b, 2-d, 3-a, 4-c",
          "1-d, 2-c, 3-b, 4-a"
        ],
        "correctIndex": 0,
        "explanation": "La relación precisa es: 1-c (VHA es Picornavirus ARN desnudo fecal-oral); 2-d (VHB es Hepadnavirus ADN circular con RT y envoltura); 3-a (VHC es Flavivirus ARN que cronifica en >75% de casos); 4-b (VHD es virión defectuoso que requiere obligatoriamente HBsAg del VHB para su ensamblaje y cubierta)."
      },
      {
        "id": "viro_3",
        "question": "Mujer de 24 años procedente de Piura acude al centro de salud con 4 días de fiebre alta continua, dolor retroocular intenso, mialgias y artralgias. En el examen físico presenta petequias en extremidades, prueba del torniquete positiva y hepatomegalia dolorosa a 2 cm del reborde costal. El hemograma muestra hematocrito en 48% (previo basal 36%), plaquetas en 42,000/uL y leucopenia.\n\nEn relación a la infección por el virus del Dengue (DENV):\nI. Es un arbovirus de la familia Flaviviridae con cuatro serotipos antigénicos (DENV-1, DENV-2, DENV-3, DENV-4) transmitido por mosquitos hembra del género Aedes.\nII. El antígeno de la proteína no estructural 1 (NS1) en suero es detectable durante los primeros 5 días de la fase febril aguda mediante ELISA o pruebas rápidas.\nIII. La presencia de hemoconcentración (aumento del hematocrito >= 20%), trombocitopenia y dolor abdominal continuo son signos de alarma que indican extravasación plasmática inminente.\nIV. El fenómeno de potenciación mediada por anticuerpos (ADE) explica por qué una segunda infección por un serotipo diferente al primario confiere protección cruzada vitalicia sin riesgo de dengue grave.\n\n¿Cuáles afirmaciones son CORRECTAS?",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son CORRECTOS: Transmitido por Aedes aegypti, diagnosticable precozmente por NS1, y sus signos de alarma cardinales son la fuga plasmática con aumento de hematocrito y trombocitopenia. El enunciado IV es FALSO: el fenómeno ADE (Antibody-Dependent Enhancement) provoca exactamente lo OPUESTO: los anticuerpos heterólogos no neutralizantes de la primera infección facilitan la entrada masiva del nuevo serotipo en monocitos, desencadenando Dengue Grave y shock por dengue."
      },
      {
        "id": "viro_4",
        "question": "En el ciclo de replicación del Virus de la Inmunodeficiencia Humana tipo 1 (VIH-1) y la terapia antirretroviral (TARV):\n\nI. La glucoproteína gp120 de la envoltura viral se une al receptor CD4 del linfocito T y a correceptores de quimiocinas (CCR5 en cepas macrófago-trópicas R5 o CXCR4 en cepas linfotrópicas X4).\nII. La transcriptasa inversa del VIH carece de actividad correctora de lectura (proofreading 3'-5' exonucleasa), generando una tasa mutagénica elevada y cuasiespecies virales.\nIII. Los inhibidores de la integrasa (como Dolutegravir y Raltegravir) bloquean la inserción covalentemente unida del ADN proviral en el genoma del núcleo celular hospedero.\nIV. El uso de monoterapia con Zidovudina o Efavirenz es el esquema estándar de máxima eficacia internacional recomendado por la OMS para el control virológico sostenido.\n\nSon proposiciones VERDADERAS:",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son VERDADEROS: gp120 media la unión a CD4/CCR5/CXCR4; la RT carece de exonucleasa correctora provocando alta mutabilidad; y los inhibidores de transferencia de cadenas de la integrasa (INSTI como Dolutegravir) impiden integrar el ADN proviral. El enunciado IV es FALSO y anacrónico: la monoterapia genera rápida selección de mutaciones de resistencia; el estándar obligatorio es la TERAPIA COMBINADA (mínimo dos ITIAN más un INSTI)."
      },
      {
        "id": "viro_5",
        "question": "La familia Herpesviridae se caracteriza por su capacidad para establecer infecciones latentes de por vida en distintos tipos celulares.\n\nRespecto a los sitios anatómicos de latencia y cuadros clínicos característicos:\nI. El Virus Herpes Simple tipo 1 (VHS-1) establece latencia en los cuerpos neuronales del ganglio sensitivo del nervio trigémino.\nII. El Virus Varicela-Zóster (VVZ) permanece latente en los ganglios de las raíces dorsales sensoriales de la médula espinal y ganglios craneales, reactivándose como herpes zóster metamérico.\nIII. El Virus de Epstein-Barr (VEB) establece latencia episomal en los linfocitos B de memoria y se asocia a linfoma de Burkitt y carcinoma nasofaríngeo.\nIV. El Citomegalovirus (CMV) establece latencia exclusivamente en los eritrocitos maduros circulantes sin afectar células de linaje mieloide ni monocitos.\n\n¿Cuáles enunciados son CORRECTOS?",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son CORRECTOS: VHS-1 latente en ganglio trigeminal; VVZ en ganglios espinales dorsales reactivando en dermatomas; VEB en linfocitos B expresando LMP-1 y EBNA. El enunciado IV es FALSO porque los eritrocitos carecen de núcleo y síntesis proteica; el CMV establece latencia en precursores mieloides de la médula ósea, MONOCITOS y células endoteliales."
      },
      {
        "id": "viro_6",
        "question": "Los antivirales de acción directa (AAD) han revolucionado la terapéutica de las infecciones por virus ADN y ARN.\n\nRelacione el principio activo antiviral con su mecanismo de acción diana:\n1. Aciclovir\n2. Oseltamivir\n3. Sofosbuvir\n4. Maraviroc\n\na. Inhibidor análogo de nucleótido de la ARN polimerasa dependiente de ARN (NS5B) del VHC\nb. Antagonista alostérico del correceptor de quimiocinas CCR5 del hospedero humano\nc. Inhibidor competitivo de la neuraminidasa de los virus Influenza A y B que bloquea la liberación viral\nd. Análogo de desoxiguanosina monofosforilado por la timidina cinasa viral e inhibidor de la ADN polimerasa de herpesvirus",
        "options": [
          "1-d, 2-c, 3-a, 4-b",
          "1-c, 2-d, 3-a, 4-b",
          "1-d, 2-a, 3-c, 4-b",
          "1-b, 2-c, 3-d, 4-a",
          "1-a, 2-b, 3-c, 4-d"
        ],
        "correctIndex": 0,
        "explanation": "La relación exacta es: 1-d (Aciclovir requiere activación selectiva por timidina cinasa del VHS/VVZ); 2-c (Oseltamivir bloquea neuraminidasa evitando que los viriones salientes se desprendan del ácido siálico); 3-a (Sofosbuvir inhibe NS5B del virus de la hepatitis C provocando terminación de cadena); 4-b (Maraviroc bloquea CCR5 celular impidiendo la entrada del VIH trópico R5)."
      },
      {
        "id": "viro_7",
        "question": "Lactante de 4 meses ingresa con taquipnea, tiraje subcostal, sibilancias espiratorias y retracción intercostal en pleno periodo invernal. La prueba rápida de antígenos en aspirado nasofaríngeo resulta positiva para Virus Sincitial Respiratorio (VSR).\n\nEn cuanto a la virología del VSR y la bronquiolitis aguda:\nI. Es un virus de ARN monocatenario de sentido negativo envuelto perteneciente a la familia Pneumoviridae.\nII. La glucoproteína F (fusión) media tanto la entrada viral a la célula hospedera como la fusión de membranas adyacentes formando células gigantes multinucleadas (sincitios).\nIII. El Palivizumab es un anticuerpo monoclonal humanizado dirigido contra la glucoproteína F indicado como inmunoprofilaxis pasiva en prematuros y cardiopatías congénitas de alto riesgo.\nIV. El uso de glucocorticoides sistémicos y broncodilatadores beta-2 adrenérgicos en nebulización continua rutinaria mejora comprobadamente la sobrevida en todos los lactantes.\n\n¿Cuáles son proposiciones VERDADERAS?",
        "options": [
          "I, II y III",
          "Solo I y II",
          "II y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 0,
        "explanation": "Enunciados I, II y III son VERDADEROS: VSR es un Pneumoviridae con proteína F que forma sincitios sinciciales histológicos y es la diana del anticuerpo profiláctico Palivizumab. El enunciado IV es FALSO según guías clínicas de la Academia Americana de Pediatría (AAP): los corticoides y broncodilatadores NO se recomiendan de rutina porque no modifican la evolución natural ni reducen hospitalizaciones; el manejo es soporte hídrico y oxigenoterapia."
      },
      {
        "id": "viro_8",
        "question": "En relación al virus de la Rabia (género Lyssavirus, familia Rhabdoviridae):\n\nI. Posee una morfología distintiva en \"forma de bala\", cubierta membranosa y genoma de ARN monocatenario sentido negativo.\nII. Tras la inoculación percutánea por mordedura, se une al receptor nicotínico de acetilcolina en la unión neuromuscular y viaja al SNC mediante transporte retrógrado axonal rápido.\nIII. La presencia histopatológica de corpúsculos de Negri (inclusiones citoplasmáticas eosinófilas) en las neuronas piramidales del hipocampo y células de Purkinje del cerebelo es patognomónica.\nIV. Una vez que el paciente manifiesta síntomas neurológicos clínicos de rabia furiosa o paralítica, la letalidad es cercana al 100%.\n\nSon afirmaciones CORRECTAS:",
        "options": [
          "Solo I y II",
          "I, II y IV",
          "II y III",
          "I, III y IV",
          "I, II, III y IV"
        ],
        "correctIndex": 4,
        "explanation": "Las 4 afirmaciones (I, II, III y IV) son CORRECTAS: El virus rábico tiene forma de proyectil de bala, viaja por transporte retrógrado (dineína) a 50-100 mm/día hasta el cerebro, genera corpúsculos de Negri y, una vez iniciados los síntomas neurológicos, la letalidad es prácticamente del 100% (haciendo vital la profilaxis posexposición inmediata antes del debut clínico)."
      }
    ]
  },
  {
    "id": "psiquiatria",
    "title": "🧠 Psiquiatría Clínica & Salud Mental",
    "subtitle": "Trastornos Afectivos, Psicosis, Urgencias Psiquiátricas y Psicofarmacología",
    "badge": "Psiquiatría",
    "badgeColor": "#8b5cf6",
    "description": "Diagnóstico diferencial según criterios DSM-5 / CIE-11, manejo de psicosis, trastorno bipolar, trastornos de ansiedad, farmacocinética y toxicidad psicotrópica con casos e ítems I-IV.",
    "questions": [
      {
        "id": "psiq_1",
        "question": "Varón de 23 años es llevado a emergencias por sus familiares debido a un cambio drástico de conducta durante los últimos 6 días. Duerme solo 2 horas por noche sin experimentar fatiga, habla de forma acelerada e ininterrumpida (verborrea/presión del habla), ha solicitado préstamos bancarios para fundar una multinacional intergaláctica y afirma tener poderes telepáticos. Examen toxicológico de orina: negativo.\n\nDe acuerdo con los criterios del DSM-5 y la evidencia terapéutica en psiquiatría:\nI. El cuadro clínico cumple criterios de un Episodio Maníaco con características psicóticas congruentes con el estado de ánimo.\nII. La presencia de un único episodio maníaco completo en la vida del paciente es suficiente para establecer el diagnóstico definitivo de Trastorno Bipolar tipo I.\nIII. El tratamiento farmacológico agudo de primera línea incluye estabilizadores del ánimo (como litio o valproato) y/o antipsicóticos atípicos (antagonistas 5HT2A/D2).\nIV. La prescripción inmediata de monoterapia con antidepresivos inhibidores selectivos de la recaptación de serotonina (ISRS) es la conducta de elección para prevenir el viraje depresivo.\n\n¿Cuáles enunciados son VERDADEROS?",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son VERDADEROS: Cumple episodio maníaco (>= 1 semana o con hospitalización/psicosis), un solo episodio maníaco diagnostica Bipolar I, y se medica con litio/valproato o antipsicóticos. El enunciado IV es FALSO y un grave error clínico: la monoterapia con antidepresivos está formalmente CONTRAINDICADA en manía bipolar porque incrementa el riesgo de viraje maníaco, ciclación rápida y agitación psicomotriz."
      },
      {
        "id": "psiq_2",
        "question": "Los psicofármacos modulan distintos sistemas de neurotransmisión cerebral (monoaminérgicos, gabaérgicos y glutamatérgicos).\n\nRelacione el principio activo psicotrópico con su mecanismo de acción farmacológico diana principal:\n1. Fluoxetina\n2. Venlafaxina\n3. Haloperidol\n4. Clozapina\n\na. Antagonista potente y selectivo de los receptores dopaminérgicos D2 en la vía mesolímbica\nb. Inhibidor selectivo de la recaptación de serotonina (ISRS) mediante bloqueo de la proteína transportadora SERT\nc. Antagonista multirreceptorial con afinidad predominante por 5-HT2A / D4 y bajo bloqueo D2 estriatal\nd. Inhibidor dual de la recaptación de serotonina y noradrenalina (IRSN) a dosis terapéuticas medias-altas",
        "options": [
          "1-b, 2-d, 3-a, 4-c",
          "1-a, 2-b, 3-c, 4-d",
          "1-b, 2-a, 3-d, 4-c",
          "1-c, 2-d, 3-a, 4-b",
          "1-d, 2-c, 3-a, 4-b"
        ],
        "correctIndex": 0,
        "explanation": "La relación precisa es: 1-b (Fluoxetina bloquea SERT); 2-d (Venlafaxina es recaptador dual SERT y NET); 3-a (Haloperidol es antipsicótico de 1.ª generación con bloqueo D2 potente que causa síntomas extrapiramidales); 4-c (Clozapina es atípico de alta eficacia en esquizofrenia refractaria con bajo bloqueo D2 extrapiramidal pero riesgo de agranulocitosis)."
      },
      {
        "id": "psiq_3",
        "question": "En el diagnóstico diferencial de las urgencias neuropsiquiátricas potencialmente mortales (Síndrome Neuroléptico Maligno vs. Síndrome Serotoninérgico):\n\nI. El Síndrome Neuroléptico Maligno (SNM) se asocia típicamente al uso de antagonistas dopaminérgicos y cursa con rigidez muscular extrapiramidal severa \"en tubo de plomo\" e hiporreflexia.\nII. El Síndrome Serotoninérgico se caracteriza por hiperactividad neuromuscular con hiperreflexia marcada, mioclonías y clonus inducible u ocular espontáneo.\nIII. En ambos síndromes puede presentarse hipertermia autonómica, diaforesis, inestabilidad hemodinámica y elevación de la creatina cinasa (CK).\nIV. El fármaco de elección específico para el tratamiento del síndrome serotoninérgico severo es el Dantroleno sódico en infusión intravenosa continua.\n\n¿Cuáles enunciados son CORRECTOS?",
        "options": [
          "I, II y III",
          "Solo I y II",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 0,
        "explanation": "Enunciados I, II y III son CORRECTOS: SNM cursa con bloqueo D2, rigidez cérea/tubo de plomo e hiporreflexia; el serotoninérgico se distingue por clonus e hiperreflexia por exceso de 5-HT; ambos presentan disautonomía. El enunciado IV es FALSO: el antagonista serotoninérgico específico de elección es la CIPROHEPTADINA; el Dantroleno y la Bromocriptina se utilizan clásicamente en el Síndrome Neuroléptico Maligno y la Hipertermia Maligna."
      },
      {
        "id": "psiq_4",
        "question": "Respecto a los fundamentos neurobiológicos y criterios diagnósticos de la Esquizofrenia según el DSM-5:\n\nI. Los síntomas positivos (delirios, alucinaciones y pensamiento desorganizado) se correlacionan fisiopatológicamente con hiperactividad dopaminérgica en la vía mesolímbica.\nII. Los síntomas negativos (abulia, aplanamiento afectivo, alogia, anhedonia) se asocian a hipofunción dopaminérgica en la corteza prefrontal (vía mesocortical).\nIII. El criterio temporal exige una duración continua de los signos de alteración durante al menos 6 meses, incluyendo al menos 1 mes de síntomas de fase activa.\nIV. Las alucinaciones visuales y táctiles lilliputienses son el síntoma patognomónico y más frecuente de la esquizofrenia de inicio juvenil.\n\nSon proposiciones VERDADERAS:",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son VERDADEROS: La hipótesis dopaminérgica dual postula exceso D2 mesolímbico para síntomas positivos y déficit mesocortical para síntomas negativos; el criterio DSM-5 exige al menos 6 meses de disfunción global con 1 mes de síntomas activos. El enunciado IV es FALSO porque las alucinaciones más frecuentes y típicas son las AUDITIVAS en tercera persona (voces comentadoras/peyorativas); las visuales sugieren etiología orgánica/tóxica/delirium."
      },
      {
        "id": "psiq_5",
        "question": "Mujer de 42 años presenta desde hace 5 semanas tristeza profunda la mayor parte del día, incapacidad para disfrutar de actividades placenteras (anhedonia), insomnio terminal con despertar precoz, pérdida del 7% del peso corporal, fatiga matutina extrema y sentimientos recurrentes de inutilidad y culpa excesiva.\n\nEn relación al Trastorno Depresivo Mayor (TDM) y su manejo:\nI. El diagnóstico de Episodio Depresivo Mayor exige la presencia de al menos 5 de los 9 criterios DSM-5 (regla mnemotécnica SIGECAPS) durante un periodo mínimo de 2 semanas, incluyendo obligatoriamente ánimo deprimido o anhedonia.\nII. La presencia de ideación suicida activa con plan estructurado o síntomas psicóticos delirantes en el contexto de catatonía refractaria constituye una indicación de primera línea para Terapia Electroconvulsiva (TEC).\nIII. Los inhibidores selectivos de la recaptación de serotonina (ISRS) alcanzan su pleno efecto antidepresivo terapéutico a las 2 a 4 horas de la primera dosis oral.\nIV. El mantenimiento de la terapia farmacológica antidepresiva se recomienda durante al menos 6 a 9 meses tras lograr la remisión sintomática del primer episodio.\n\n¿Cuáles afirmaciones son VERDADERAS?",
        "options": [
          "Solo I y II",
          "I, II y IV",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y IV son VERDADEROS: Se requieren >= 5 criterios por 2 semanas con desánimo o anhedonia cardinal; la TEC es segura y muy eficaz en alto riesgo suicida/catatonía/depresión psicótica; y el tratamiento debe mantenerse 6-9 meses para evitar recaídas precoces. El enunciado III es FALSO porque los ISRS tienen una latencia de respuesta de 2 a 4 SEMANAS (requiere desensibilización de autorreceptores somatodendríticos 5-HT1A e inducción de BDNF)."
      },
      {
        "id": "psiq_6",
        "question": "En toxicología psiquiátrica y manejo de abstinencia, la intervención oportuna previene secuelas irreversibles.\n\nRelacione el cuadro clínico o toxicidad con su antídoto o intervención farmacológica específica:\n1. Intoxicación aguda por Benzodiacepinas con depresión respiratoria\n2. Sobredosis aguda por Opioides (coma y miosis puntiforme)\n3. Distonía aguda inducida por neurolépticos (crisis oculógiras o tortícolis)\n4. Delirium Tremens por síndrome de abstinencia alcohólica grave\n\na. Naloxona parenteral (antagonista competitivo puro de receptores opioides mu)\nb. Biperideno o difenhidramina (anticolinérgico antimuscarínico central)\nc. Benzodiacepinas de vida media larga (Diazepam o Lorazepam) en titulación intravenosa\nd. Flumazenilo (antagonista competitivo del receptor GABA-A)",
        "options": [
          "1-d, 2-a, 3-b, 4-c",
          "1-a, 2-d, 3-c, 4-b",
          "1-d, 2-c, 3-b, 4-a",
          "1-c, 2-a, 3-d, 4-b",
          "1-b, 2-a, 3-d, 4-c"
        ],
        "correctIndex": 0,
        "explanation": "La relación precisa es: 1-d (Flumazenilo revierte benzodiacepinas); 2-a (Naloxona revierte intoxicación por opioides); 3-b (Biperideno o Difenhidramina restablece el balance dopamina/acetilcolina estriatal resolviendo la distonía aguda); 4-c (Benzodiacepinas son el estándar para prevenir convulsiones y controlar el Delirium Tremens)."
      },
      {
        "id": "psiq_7",
        "question": "Mujer de 29 años sin antecedentes médicos acude a emergencias por tercera vez en el mes manifestando sensación súbita de muerte inminente, palpitaciones, opresión torácica, parestesias peribucales, temblor y sensación de asfixia que alcanzan su máxima intensidad en 8 minutos y remiten a la media hora. El electrocardiograma, enzimas cardíacas y perfil tiroideo son estrictamente normales. Refiere miedo persistente a sufrir otro ataque (ansiedad anticipatoria).\n\nEn relación al Trastorno de Pánico (Trastorno de Angustia):\nI. Se diagnostica ante la presencia de crisis de angustia imprevistas y recurrentes seguidas de al menos 1 mes de inquietud constante por nuevos ataques o cambios desadaptativos de conducta.\nII. El tratamiento farmacológico de mantenimiento y primera línea de elección son los antidepresivos ISRS (ej. Sertralina, Escitalopram) o IRSN.\nIII. Durante el periodo de latencia inicial de los ISRS, se puede asociar temporalmente una benzodiacepina a dosis bajas para control de síntomas agudos durante 2 a 4 semanas.\nIV. La Terapia Cognitivo-Conductual (TCC) con reestructuración cognitiva y exposición interoceptiva carece de respaldo científico en comparación con el placebo.\n\n¿Cuáles enunciados son VERDADEROS?",
        "options": [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I y III",
          "Todas son correctas"
        ],
        "correctIndex": 1,
        "explanation": "Enunciados I, II y III son VERDADEROS: Se define por ataques inesperados con >= 1 mes de ansiedad anticipatoria o evitación fóbica; el tratamiento base son los ISRS/IRSN; y se pueden pautar benzodiacepinas en puente breve inicial. El enunciado IV es FALSO: la Terapia Cognitivo-Conductual es la psicoterapia con el más alto nivel de evidencia (nivel 1A) para el trastorno de pánico, con eficacia comparable a la farmacoterapia."
      },
      {
        "id": "psiq_8",
        "question": "El Carbonato de Litio continúa siendo el estabilizador del estado de ánimo con mayor evidencia para la prevención de recurrencias afectivas y reducción del riesgo suicida en el Trastorno Bipolar.\n\nEn relación a la farmacocinética, monitorización y toxicidad del Litio:\nI. Su estrecho margen terapéutico requiere la monitorización estricta de la litemia plasmática en ayunas (habitualmente entre 0.6 y 1.2 mEq/L en fase de mantenimiento).\nII. Los antiinflamatorios no esteroideos (AINEs como ibuprofeno), los diuréticos tiazídicos y los inhibidores de la ECA reducen el aclaramiento renal del litio, incrementando drásticamente el riesgo de intoxicación grave.\nIII. La administración prolongada de litio se asocia a efectos adversos endocrinos y renales, destacando el hipotiroidismo primario y la diabetes insípida nefrogénica.\nIV. El temblor intencional grosero, la ataxia cerebelosa, la disartria y la confusión mental progresiva son signos característicos de intoxicación aguda por litio (litemia > 2.0 mEq/L).\n\n¿Cuáles afirmaciones son CORRECTAS?",
        "options": [
          "Solo I y II",
          "I, II y IV",
          "II y III",
          "I, III y IV",
          "I, II, III y IV"
        ],
        "correctIndex": 4,
        "explanation": "Las 4 afirmaciones (I, II, III y IV) son CORRECTAS: El litio tiene rango terapéutico estrecho (0.6 - 1.2 mEq/L); los fármacos que disminuyen la volemia o filtración renal (AINEs, tiazidas, IECA) retienen litio en túbulo proximal elevando su toxicidad; produce hipotiroidismo y diabetes insípida nefrogénica (bloqueo de acuaporina-2 mediada por ADH); y los signos neurológicos cerebelosos alertan sobre toxicidad grave (>2.0 mEq/L) que puede requerir hemodiálisis."
      }
    ]
  }
];
