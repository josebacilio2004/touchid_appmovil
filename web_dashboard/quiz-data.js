// Banco de Preguntas Multidisciplinario para el Simulador Web TouchID
export const QUIZ_CATEGORIES = [
  {
    id: 'mtc',
    title: '🚗 Examen MTC - Reglas de Tránsito (Perú)',
    subtitle: 'Balotario Oficial de Conocimientos - Brevete Clase A',
    badge: 'Oficial MTC',
    badgeColor: '#10b981',
    description: 'Preguntas oficiales del Ministerio de Transportes y Comunicaciones del Perú según el TUO del Reglamento Nacional de Tránsito y modificatorias (D.S. 025-2021-MTC).',
    questions: [
      {
        id: 'mtc_1',
        question: 'De acuerdo con el D.S. N° 025-2021-MTC, ¿cuál es el límite máximo de velocidad permitido para vehículos en calles y jirones de zonas urbanas?',
        options: [
          '40 km/h',
          '30 km/h',
          '50 km/h',
          '20 km/h'
        ],
        correctIndex: 1,
        explanation: 'El D.S. N° 025-2021-MTC modificó el Art. 162 del Reglamento de Tránsito, estableciendo que la velocidad máxima en calles y jirones es de 30 km/h.'
      },
      {
        id: 'mtc_2',
        question: 'En avenidas urbanas, ¿cuál es la velocidad máxima permitida para automóviles particulares si no hay señales que indiquen otro límite?',
        options: [
          '60 km/h',
          '50 km/h',
          '40 km/h',
          '70 km/h'
        ],
        correctIndex: 1,
        explanation: 'Bajo el D.S. N° 025-2021-MTC, el límite de velocidad en avenidas urbanas se redujo de 60 km/h a 50 km/h.'
      },
      {
        id: 'mtc_3',
        question: 'En una intersección o calzada rotatoria (óvalo o rotonda), ¿quién tiene prioridad de paso?',
        options: [
          'El vehículo que intenta ingresar a la rotonda desde una avenida más ancha',
          'El vehículo que circula dentro de la rotonda respecto al que intenta ingresar',
          'El vehículo que circula a mayor velocidad',
          'El vehículo que viene por la derecha aunque intente ingresar'
        ],
        correctIndex: 1,
        explanation: 'En las rotondas u óvalos, tiene prioridad de paso indiscutible el vehículo que ya circula dentro de la calzada rotatoria.'
      },
      {
        id: 'mtc_4',
        question: '¿Por qué lado de la calzada se debe efectuar por regla general el adelantamiento a otro vehículo en movimiento?',
        options: [
          'Por la derecha si la berma está libre y asfaltada',
          'Por la izquierda únicamente',
          'Por cualquier lado siempre que se toquen las bocinas',
          'Por la berma lateral si el vehículo precedente no avanza rápido'
        ],
        correctIndex: 1,
        explanation: 'El Art. 169 del Reglamento Nacional de Tránsito establece que el adelantamiento se realiza obligatoriamente por la izquierda.'
      },
      {
        id: 'mtc_5',
        question: 'En carreteras del Perú, ¿en qué horario es obligatorio circular con las luces bajas (luces de circulación diurna)?',
        options: [
          'Únicamente desde las 18:00 horas hasta las 06:00 horas',
          'Las 24 horas del día, independientemente de las condiciones climáticas o de luminosidad',
          'Solo en túneles y cuando haya lluvia intensa',
          'Solo durante la noche y al atardecer'
        ],
        correctIndex: 1,
        explanation: 'En la red vial nacional y departamental, es obligatorio el uso de luces bajas las 24 horas del día (D.S. 025-2021-MTC / RNT).'
      },
      {
        id: 'mtc_6',
        question: '¿Cuál es el límite máximo de velocidad en zonas escolares y zonas de hospitales en el Perú?',
        options: [
          '30 km/h',
          '20 km/h',
          '15 km/h',
          '35 km/h'
        ],
        correctIndex: 0,
        explanation: 'La velocidad máxima en zonas escolares y de hospitales es de 30 km/h (y 20 km/h en proximidad inmediata a salidas/entradas escolares en horario escolar).'
      },
      {
        id: 'mtc_7',
        question: 'Conducir con presencia de alcohol en la sangre en proporción mayor a lo previsto en el Código Penal y bajo la influencia de drogas es una falta tipificada como:',
        options: [
          'Grave (Código G01)',
          'Muy Grave (Código M01) que conlleva la cancelación definitiva o suspensión de la licencia',
          'Leve (Código L01)',
          'Solo retención momentánea del vehículo'
        ],
        correctIndex: 1,
        explanation: 'La infracción M01 es Muy Grave y sanciona con multa del 100% de la UIT, cancelación de la licencia de conducir e inhabilitación definitiva.'
      },
      {
        id: 'mtc_8',
        question: '¿Qué documento garantiza la cobertura integral de gastos médicos y sepelio para víctimas de accidentes de tránsito de forma incondicional e inmediata?',
        options: [
          'La Tarjeta de Identificación Vehicular (TIV)',
          'El Certificado de Inspección Técnica Vehicular (CITV)',
          'El Seguro Obligatorio de Accidentes de Tránsito (SOAT) o CAT',
          'El contrato de compraventa del vehículo'
        ],
        correctIndex: 2,
        explanation: 'El SOAT cubre incondicional e inmediatamente a todos los ocupantes y terceros no ocupantes afectados por un accidente de tránsito.'
      },
      {
        id: 'mtc_9',
        question: 'En una intersección que carece de semáforos y señales reguladoras, si dos vehículos convergen simultáneamente, ¿cuál tiene la preferencia de paso?',
        options: [
          'El vehículo que viene por la izquierda',
          'El que se aproxime por la derecha del conductor',
          'El vehículo de mayor tonelaje o tamaño',
          'El que toque la bocina primero'
        ],
        correctIndex: 1,
        explanation: 'En intersecciones no señalizadas ni semaforizadas, la prioridad de paso le asiste siempre al vehículo que proviene por la derecha.'
      },
      {
        id: 'mtc_10',
        question: '¿Qué significado tiene una señal vertical con fondo amarillo, forma de rombo y símbolos negros en las vías peruanas?',
        options: [
          'Señal Reguladora o Reglamentaria (obligación o prohibición)',
          'Señal Preventiva (advierte sobre peligro o condición de la vía)',
          'Señal Informativa de servicios',
          'Señal de restricción temporal de velocidad'
        ],
        correctIndex: 1,
        explanation: 'Las señales amarillas con forma de rombo son Señales Preventivas, cuyo propósito es advertir a los usuarios sobre peligros potenciales en la vía.'
      }
    ]
  },
  {
    id: 'neumologia',
    title: '🫁 Medicina & Neumología Clínica',
    subtitle: 'Evaluación de Especialidad Médica y Casos Clínicos',
    badge: 'Ciencias Médicas',
    badgeColor: '#3b82f6',
    description: 'Preguntas clínicas y fisiopatológicas de neumología: EPOC, espirometría, asma bronquial, neumonía comunitaria (CURB-65), tuberculosis y gasometría.',
    questions: [
      {
        id: 'neu_1',
        question: 'Para confirmar el diagnóstico espirométrico de Enfermedad Pulmonar Obstructiva Crónica (EPOC), ¿qué criterio post-broncodilatador debe cumplirse según las guías GOLD?',
        options: [
          'FEV1/FVC < 0.70',
          'FEV1 > 80% del valor predicho',
          'FVC < 70% con respuesta broncodilatadora > 12%',
          'Capacidad pulmonar total (TLC) < 80%'
        ],
        correctIndex: 0,
        explanation: 'Según la guía internacional GOLD, un cociente FEV1/FVC post-broncodilatador menor de 0.70 confirma la presencia de limitación persistente al flujo aéreo (patrón obstructivo).'
      },
      {
        id: 'neu_2',
        question: 'En la escala de estratificación de gravedad CURB-65 para Neumonía Adquirida en la Comunidad (NAC), ¿qué parámetro representa la letra "U"?',
        options: [
          'Uricemia > 7 mg/dL',
          'Urea sérica > 19 mg/dL (o Nitrógeno Ureico en Sangre BUN > 20 mg/dL / Urea > 7 mmol/L)',
          'Urocultivo positivo a gérmenes patógenos',
          'Urgencia respiratoria con saturación < 90%'
        ],
        correctIndex: 1,
        explanation: 'CURB-65 evalúa: Confusión, Urea (>7 mmol/L o BUN >20 mg/dL), Frecuencia respiratoria (>=30 rpm), Presión sanguínea (PAS<90 o PAD<=60 mmHg) y Edad (>=65 años).'
      },
      {
        id: 'neu_3',
        question: '¿Cuál es el tratamiento de primera línea de elección para un paciente con diagnóstico de Asma Leve Persistente según las recomendaciones GINA actuales?',
        options: [
          'Salbutamol oral en comprimidos cada 8 horas',
          'Corticosteroide inhalado (ICS) en dosis bajas asociado a formoterol a demanda (o corticoide inhalado diario)',
          'Bromuro de ipratropio como monoterapia exclusiva',
          'Teofilina de liberación prolongada'
        ],
        correctIndex: 1,
        explanation: 'Las guías GINA no recomiendan el uso de SABA en monoterapia; el pilar actual es el corticoide inhalado (ICS) asociado a formoterol para prevenir crisis inflamatorias.'
      },
      {
        id: 'neu_4',
        question: 'En la interpretación de la gasometría arterial: pH 7.28, PaCO2 58 mmHg, HCO3- 26 mEq/L, PaO2 62 mmHg. ¿Cuál es el trastorno ácido-base primario?',
        options: [
          'Alcalosis respiratoria descompensada',
          'Acidosis metabólica con brecha aniónica elevada',
          'Acidosis respiratoria aguda con hipoxemia moderada',
          'Acidosis mixta hiperclorémica'
        ],
        correctIndex: 2,
        explanation: 'pH < 7.35 indica acidosis, PaCO2 > 45 mmHg indica causa respiratoria, y el HCO3 normal (26) refleja ausencia de compensación renal crónica (aguda).'
      },
      {
        id: 'neu_5',
        question: '¿Cuál es el esquema farmacológico estándar de primera línea para Tuberculosis pulmonar sensible en el Perú según la Norma Técnica de Salud del MINSA (Fase 1)?',
        options: [
          'Isoniazida, Rifampicina, Pirazinamida y Etambutol (2HREZ) diario por 2 meses (50 dosis)',
          'Levofloxacino, Amikacina y Cicloserina por 6 meses',
          'Isoniazida y Rifampicina exclusivamente por 9 meses',
          'Rifampicina y Estreptomicina por 3 meses'
        ],
        correctIndex: 0,
        explanation: 'En el Perú, el esquema para TB pulmonar sensible comprende la primera fase intensiva con 2 meses de HREZ diario (50 dosis de Lunes a Sábado).'
      },
      {
        id: 'neu_6',
        question: 'Ante la sospecha clínica de un Neumotórax a Tensión con compromiso hemodinámico e hipotensión, ¿cuál es la conducta terapéutica inmediata?',
        options: [
          'Esperar el informe de la Tomografía Computarizada de alta resolución',
          'Descompresión inmediata con catéter de grueso calibre en el 2° espacio intercostal línea medioclavicular (o 5° espacio línea axilar anterior)',
          'Iniciar ventilación mecánica con presión positiva inmediata sin descompresión previa',
          'Nebulización con agonistas beta-2 de acción corta'
        ],
        correctIndex: 1,
        explanation: 'El neumotórax a tensión es una emergencia médica de diagnóstico clínico que requiere descompresión inmediata con aguja antes de cualquier estudio de imagen.'
      },
      {
        id: 'neu_7',
        question: '¿Cuál es el patrón característico en el lavado broncoalveolar (LBA) o biopsia de un paciente con Proteinosis Alveolar Pulmonar?',
        options: [
          'Predominio de eosinófilos > 25%',
          'Material PAS-positivo acelular rico en surfactante fosfolipídico lipoproteináceo',
          'Bacilos ácido-alcohol resistentes abundantes',
          'Presencia de cuerpos de asbesto ferruginosos'
        ],
        correctIndex: 1,
        explanation: 'La proteinosis alveolar se caracteriza por acumulación intraalveolar de material proteináceo rico en lípidos que tiñe intensamente positivo para el ácido periódico de Schiff (PAS).'
      },
      {
        id: 'neu_8',
        question: 'En un paciente con sospecha clínica de Tromboembolismo Pulmonar (TEP) y probabilidad baja según la escala de Wells modificada, ¿cuál es el examen inicial de descarte?',
        options: [
          'Angiotomografía pulmonar multidetector',
          'Determinación cuantitativa de Dímero D por técnica ELISA de alta sensibilidad',
          'Gammagrafía ventilación/perfusión (V/Q)',
          'Arteriografía pulmonar invasiva'
        ],
        correctIndex: 1,
        explanation: 'En pacientes con probabilidad clínica baja o intermedia, un Dímero D cuantitativo negativo tiene un alto valor predictivo negativo (>98%) para descartar TEP.'
      },
      {
        id: 'neu_9',
        question: '¿Cuál de los siguientes fármacos antituberculosos se asocia típicamente a toxicidad ocular en forma de neuritis óptica retrobulbar?',
        options: [
          'Rifampicina',
          'Isoniazida',
          'Etambutol',
          'Pirazinamida'
        ],
        correctIndex: 2,
        explanation: 'El etambutol produce neuropatía óptica dosis-dependiente con disminución de agudeza visual y alteración en la visión de colores (discromatopsia rojo-verde).'
      },
      {
        id: 'neu_10',
        question: 'En el síndrome de dificultad respiratoria aguda (SDRA), ¿cómo se define el grado moderado según los criterios de Berlín (PaO2/FiO2 con PEEP >= 5 cmH2O)?',
        options: [
          'PaO2/FiO2 > 300 mmHg',
          '200 mmHg < PaO2/FiO2 <= 300 mmHg',
          '100 mmHg < PaO2/FiO2 <= 200 mmHg',
          'PaO2/FiO2 <= 100 mmHg'
        ],
        correctIndex: 2,
        explanation: 'Criterios de Berlín para SDRA: Leve (200 < PaO2/FiO2 <= 300), Moderado (100 < PaO2/FiO2 <= 200) y Severo (PaO2/FiO2 <= 100 mmHg).'
      }
    ]
  },
  {
    id: 'academico',
    title: '🎓 Razonamiento Académico & Cultura General',
    subtitle: 'Evaluación Universitaria y Razonamiento Lógico-Verbal',
    badge: 'Admisión Universitaria',
    badgeColor: '#8b5cf6',
    description: 'Preguntas de razonamiento verbal, lógica deductiva, historia contemporánea, constitución del Perú y ciencias generales.',
    questions: [
      {
        id: 'aca_1',
        question: 'Analogía verbal: EFÍMERO : PERDURABLE ::',
        options: [
          'Fugaz : Transitorio',
          'Incipiente : Primigenio',
          'Lóbrego : Luminoso',
          'Preclaro : Célebre'
        ],
        correctIndex: 2,
        explanation: 'La relación entre Efímero y Perdurable es de antonimia absoluta. La única pareja que guarda exactamente dicha relación de contrarios es Lóbrego (oscuro) y Luminoso (claro).'
      },
      {
        id: 'aca_2',
        question: 'Según la Constitución Política del Perú de 1993, ¿cuál es el órgano constitucional autónomo encargado de preservar la estabilidad monetaria y regular el crédito del sistema financiero?',
        options: [
          'Superintendencia de Banca, Seguros y AFP (SBS)',
          'Banco Central de Reserva del Perú (BCRP)',
          'Ministerio de Economía y Finanzas (MEF)',
          'Contraloría General de la República'
        ],
        correctIndex: 1,
        explanation: 'El Art. 84 de la Constitución establece que la finalidad primordial del Banco Central de Reserva del Perú (BCRP) es preservar la estabilidad monetaria.'
      },
      {
        id: 'aca_3',
        question: 'Premisa lógica: "Si todos los mamíferos son vertebrados y todos los cetáceos son mamíferos", se concluye necesariamente que:',
        options: [
          'Algunos vertebrados no son mamíferos',
          'Todos los cetáceos son vertebrados',
          'Ningún cetáceo es vertebrado',
          'Todos los vertebrados son cetáceos'
        ],
        correctIndex: 1,
        explanation: 'Por silogismo categórico clásico de forma Bárbara (AAA-1): Todo C es M, y todo M es V, por lo tanto, Todo C es V (Todos los cetáceos son vertebrados).'
      },
      {
        id: 'aca_4',
        question: '¿Qué tratado internacional de 1929 puso fin a la controversia limítrofe entre Perú y Chile tras la Guerra del Pacífico, reincorporando Tacna al Perú?',
        options: [
          'Tratado de Ancón',
          'Tratado de Lima (Tratado Rada y Gamio - Figueroa Larraín)',
          'Tratado Salomón-Lozano',
          'Tratado Polo-Bustamante'
        ],
        correctIndex: 1,
        explanation: 'El Tratado de Lima, firmado el 3 de junio de 1929, determinó que Tacna se reincorporaba al suelo patrio peruano y Arica permanecía bajo soberanía chilena.'
      },
      {
        id: 'aca_5',
        question: 'Precisión léxica: "El diplomático presentó un discurso muy extenso y lleno de adornos innecesarios que desvió la atención del tema principal". El adjetivo idóneo para calificar el discurso es:',
        options: [
          'Lacónico',
          'Grandilocuente',
          'Farragoso',
          'Sentencioso'
        ],
        correctIndex: 2,
        explanation: '"Farragoso" se aplica a lo desordenado, confuso, prolijo o lleno de palabrería superflua que entorpece la comprensión del contenido medular.'
      },
      {
        id: 'aca_6',
        question: '¿Cuál es la capa de la atmósfera terrestre donde se desarrollan los fenómenos meteorológicos como nubes, lluvias y tormentas?',
        options: [
          'Estratosfera',
          'Troposfera',
          'Mesosfera',
          'Termosfera'
        ],
        correctIndex: 1,
        explanation: 'La troposfera es la capa más baja de la atmósfera (hasta ~12 km) que contiene más del 75% de la masa de aire y casi todo el vapor de agua, donde ocurre el clima.'
      },
      {
        id: 'aca_7',
        question: 'En física, ¿cuál es la unidad del Sistema Internacional (SI) empleada para medir la potencia mecánica o eléctrica?',
        options: [
          'Joule (J)',
          'Newton (N)',
          'Vatio o Watt (W)',
          'Pascal (Pa)'
        ],
        correctIndex: 2,
        explanation: 'La unidad del Sistema Internacional para potencia es el Vatio o Watt (W), definido como la transferencia de energía de un julio por segundo (1 W = 1 J/s).'
      },
      {
        id: 'aca_8',
        question: 'En la obra literaria "La ciudad y los perros" del Nobel Mario Vargas Llosa, ¿en qué colegio militar se ambienta la trama principal?',
        options: [
          'Colegio Militar Francisco Bolognesi',
          'Colegio Militar Leoncio Prado',
          'Colegio Militar Ramón Castilla',
          'Escuela Militar de Chorrillos'
        ],
        correctIndex: 1,
        explanation: 'La célebre novela de Vargas Llosa transcurre en las aulas, patios y dormitorios del Colegio Militar Leoncio Prado en La Perla, Callao.'
      },
      {
        id: 'aca_9',
        question: 'Matemática: En una baraja estándar de 52 cartas, ¿cuál es la probabilidad de extraer al azar una carta que sea un As o un Rey?',
        options: [
          '1/13',
          '2/13',
          '4/13',
          '1/26'
        ],
        correctIndex: 1,
        explanation: 'Hay 4 ases y 4 reyes en la baraja (total 8 cartas favorables). Probabilidad = 8 / 52 = 2 / 13 (aproximadamente 15.38%).'
      },
      {
        id: 'aca_10',
        question: '¿Qué organelo celular es conocido como la central energética eucariota responsable de la respiración celular y síntesis aeróbica de ATP?',
        options: [
          'Ribosoma',
          'Aparato de Golgi',
          'Mitocondria',
          'Retículo endoplasmático liso'
        ],
        correctIndex: 2,
        explanation: 'Las mitocondrias son los orgánulos encargados de generar la mayor parte del ATP mediante la fosforilación oxidativa y el ciclo de Krebs.'
      }
    ]
  },
  {
    id: 'tecnologia',
    title: '💻 Computación, Programación & Sistemas',
    subtitle: 'Arquitectura de Software, Redes y Bases de Datos',
    badge: 'Ingeniería TI',
    badgeColor: '#06b6d4',
    description: 'Preguntas avanzadas de algoritmos (Big-O), arquitecturas frontend/backend, bases de datos SQL/NoSQL, seguridad web y protocolos.',
    questions: [
      {
        id: 'tec_1',
        question: '¿Cuál es la complejidad temporal en el peor caso para buscar un elemento en un arreglo ya ordenado de n elementos mediante Búsqueda Binaria (Binary Search)?',
        options: [
          'O(n)',
          'O(log n)',
          'O(n log n)',
          'O(1)'
        ],
        correctIndex: 1,
        explanation: 'La búsqueda binaria divide el espacio de búsqueda a la mitad en cada paso iterativo, logrando una complejidad temporal óptima de O(log n).'
      },
      {
        id: 'tec_2',
        question: 'En bases de datos relacionales, ¿qué garantiza el principio de "Atomicidad" dentro de las propiedades ACID?',
        options: [
          'Que las transacciones no interfieran entre sí en ejecuciones simultáneas',
          'Que todas las operaciones de una transacción se completen con éxito o ninguna se aplique (todo o nada)',
          'Que los datos persistirán incluso ante una falla de energía catastrófica',
          'Que los datos cumplan estrictamente todas las reglas de integridad de dominio'
        ],
        correctIndex: 1,
        explanation: 'La atomicidad asegura que una transacción se trate como una unidad indivisible: o se ejecutan todas sus sentencias o se realiza un rollback integral.'
      },
      {
        id: 'tec_3',
        question: 'A diferencia de HTTP/1.1 y HTTP/2 que se basan en TCP, ¿cuál es el protocolo de capa de transporte que subyace a HTTP/3?',
        options: [
          'SCTP',
          'QUIC sobre UDP',
          'WebSocket raw',
          'TLS directo sin transporte'
        ],
        correctIndex: 1,
        explanation: 'HTTP/3 utiliza el protocolo QUIC, el cual corre sobre UDP para eliminar el bloqueo de cabeza de línea (head-of-line blocking) de TCP y permitir conexiones 0-RTT.'
      },
      {
        id: 'tec_4',
        question: 'En desarrollo frontend moderno, ¿qué es el "Virtual DOM" y cuál es su principal ventaja de rendimiento?',
        options: [
          'Un motor de renderizado 3D por GPU en WebGL',
          'Una representación ligera en memoria del DOM real que permite calcular diferencias (diffing) y aplicar únicamente los cambios mínimos necesarios',
          'Un plugin del navegador para compilar código C++ a bytecode',
          'Un iframe oculto que descarga assets en segundo plano'
        ],
        correctIndex: 1,
        explanation: 'El Virtual DOM mantiene un árbol de nodos en JavaScript; al ocurrir cambios, compara la versión anterior con la nueva (diffing) y aplica solo los parches exactos al DOM real.'
      },
      {
        id: 'tec_5',
        question: '¿Qué vulnerabilidad de seguridad web ocurre cuando un atacante inyecta scripts maliciosos del lado del cliente en páginas web vistas por otros usuarios?',
        options: [
          'SQL Injection (SQLi)',
          'Cross-Site Scripting (XSS)',
          'Cross-Site Request Forgery (CSRF)',
          'Server-Side Request Forgery (SSRF)'
        ],
        correctIndex: 1,
        explanation: 'XSS (Cross-Site Scripting) permite la inyección y ejecución de scripts arbitrarios en el contexto del navegador de la víctima para robar cookies de sesión o secuestrar cuentas.'
      },
      {
        id: 'tec_6',
        question: '¿Cuál es la estructura estándar de un JSON Web Token (JWT)?',
        options: [
          'Public Key, Private Key, Signature',
          'Header, Payload, Signature separados por puntos (.)',
          'Key, Value, Checksum codificados en base32',
          'Nonce, Body, Hash en formato XML'
        ],
        correctIndex: 1,
        explanation: 'Un JWT se compone de tres partes codificadas en Base64URL separadas por puntos: Header (algoritmo), Payload (claims/datos) y Signature (firma criptográfica de verificación).'
      },
      {
        id: 'tec_7',
        question: 'En Git, ¿cuál es la diferencia fundamental entre los comandos "git merge" y "git rebase"?',
        options: [
          'git merge borra el historial previo, mientras que git rebase lo sube a la nube',
          'git merge crea un commit de fusión combinando los historiales, mientras que git rebase reescribe el historial aplicando los commits uno a uno sobre la base destino',
          'git rebase solo funciona en repositorios locales y nunca altera hashes SHA-1',
          'Son comandos idénticos que solo varían por la versión de Git'
        ],
        correctIndex: 1,
        explanation: 'git merge preserva el grafo histórico exacto creando un commit de merge de dos ramas; git rebase trasplanta los commits de la rama actual sobre la punta de otra, creando un historial lineal.'
      },
      {
        id: 'tec_8',
        question: '¿Qué algoritmo de ordenamiento tiene un tiempo de ejecución garantizado en el peor de los casos de O(n log n)?',
        options: [
          'Bubble Sort',
          'Merge Sort',
          'Quick Sort',
          'Insertion Sort'
        ],
        correctIndex: 1,
        explanation: 'Merge Sort garantiza O(n log n) en todos los casos (peor, mejor y promedio) gracias a su estrategia divide-y-vencerás, a diferencia de Quick Sort cuyo peor caso es O(n²).'
      },
      {
        id: 'tec_9',
        question: '¿Qué mecanismo de seguridad del navegador restringe cómo los recursos de un origen pueden ser solicitados por otro dominio?',
        options: [
          'CORS (Cross-Origin Resource Sharing)',
          'DNSSEC',
          'DHCP Snooping',
          'SNI (Server Name Indication)'
        ],
        correctIndex: 0,
        explanation: 'CORS es un mecanismo basado en cabeceras HTTP que permite o bloquea solicitudes que un navegador realiza a un dominio distinto al del origen de la página web.'
      },
      {
        id: 'tec_10',
        question: 'En Docker, ¿cuál es la diferencia principal entre un "Container" y una "Image"?',
        options: [
          'La imagen es la instancia en ejecución con memoria asignada y el contenedor es un archivo estático',
          'Una imagen es una plantilla inmutable de solo lectura; un contenedor es una instancia ejecutable y aislada de dicha imagen con una capa de escritura',
          'Los contenedores solo corren en Linux y las imágenes solo en Windows',
          'Una imagen es un volumen de almacenamiento y un contenedor es un socket de red'
        ],
        correctIndex: 1,
        explanation: 'La imagen de Docker contiene el código, dependencias y librerías en capas inmutables; un contenedor es la instancia en ejecución con su propio filesystem y ciclo de vida.'
      }
    ]
  },
  {
    id: 'histologia',
    title: "🔬 Histología Médica & Biología Tisular",
    subtitle: "Técnicas de Tinción, Ultraestructura y Tejidos Fundamentales",
    badge: "Histología",
    badgeColor: '#ec4899',
    description: "Evaluación especializada en epitelios, tejido conectivo, muscular, nervioso, tinciones histoquímicas e inmunohistoquímica con casos histopatológicos e ítems I-IV.",
    questions: [
      {
        id: 'histo_1',
        question: "Mujer de 34 años sometida a biopsia renal por síndrome nefrótico. En el estudio histopatológico del glomérulo se requiere evaluar con precisión la integridad de la membrana basal glomerular (MBG), la presencia de colágeno intersticial y los depósitos inmunes.\n\nRespecto a las técnicas de tinción histoquímica renal, analice los siguientes enunciados:\nI. La tinción de PAS (Ácido Periódico de Schiff) tiñe de color magenta/púrpura la lámina basal debido a su alta concentración de carbohidratos y glucoproteínas.\nII. La impregnación argéntica de Jones (metenamina de plata) evidencia la membrana basal tiñéndola de color negro, permitiendo detectar espículas (\"spikes\") subepiteliales.\nIII. El tricrómico de Masson tiñe las fibras de colágeno de color azul o verde, permitiendo cuantificar la fibrosis intersticial y esclerosis glomerular.\nIV. La tinción de Hematoxilina y Eosina (H&E) es el método de elección definitivo para la identificación directa de la subpoblación de podocitos y sus pedicelos.\n\n¿Cuáles de los enunciados son VERDADEROS?",
        options: [
          "Solo I y II",
          "I, II y III",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son VERDADEROS: PAS resalta carbohidratos y glucoproteínas de la MBG en magenta; la plata de Jones colorea de negro las membranas basales permitiendo visualizar spikes de la nefropatía membranosa; el tricrómico de Masson tiñe colágeno en azul/verde delimitando fibrosis. El enunciado IV es FALSO porque la resolución de los pedicelos podocitarios requiere Microscopía Electrónica de Transmisión (MET), siendo imposible individualizarlos con precisión únicamente con H&E."
      },
      {
        id: 'histo_2',
        question: "En la práctica histológica e histopatológica de rutina, las técnicas de coloración especial permiten diferenciar componentes bioquímicos específicos en los tejidos.\n\nRelacione ambas columnas según la técnica de coloración y su estructura/biomolécula diana afín:\n1. Tinción de Sudán III / Oil Red O\n2. Tricrómico de Masson\n3. Ácido Periódico de Schiff (PAS)\n4. Impregnación argéntica de Fontana-Masson\n\na. Gránulos de melanina y células neuroendocrinas argentafines\nb. Fibras colágenas y tejido conectivo fibroso\nc. Lípidos neutros y triglicéridos en cortes por congelación\nd. Glucógeno, mucinas neutras y membranas basales",
        options: [
          "1-c, 2-b, 3-d, 4-a",
          "1-d, 2-a, 3-b, 4-c",
          "1-c, 2-d, 3-b, 4-a",
          "1-a, 2-b, 3-c, 4-d",
          "1-b, 2-c, 3-a, 4-d"
        ],
        correctIndex: 0,
        explanation: "La correspondencia exacta es: 1-c (Sudán/Oil Red O tiñen lípidos neutros en criocortes sin desparafinar en xilol); 2-b (Masson tiñe colágeno en azul/verde y músculo en rojo); 3-d (PAS oxida grupos glicol adyacentes formando aldehídos que reaccionan con reactivo de Schiff tiñendo glucógeno y glucoproteínas); 4-a (Fontana-Masson reduce nitrato de plata por acción de la melanina o serotonina tiñéndolas de negro)."
      },
      {
        id: 'histo_3',
        question: "Varón de 28 años con sinusitis crónica, bronquiectasias bilaterales e infertilidad primaria. El estudio de microscopía electrónica de la mucosa nasal revela alteración ultraestructural de los cilios de las células del epitelio respiratorio (Disquinesia Ciliar Primaria / Síndrome de Kartagener).\n\nEn relación a la ultraestructura celular del epitelio respiratorio y los cilios móviles:\nI. El axonema ciliar posee una disposición clásica de microtúbulos consistente en 9 dobletes periféricos y 1 par central (organización 9+2).\nII. Los brazos de dineína ciliar interna y externa proporcionan la actividad ATPasa indispensable para el movimiento y batido ciliar coordinado.\nIII. El cuerpo basal (cinetosoma) situado en la base del cilio presenta una disposición de microtúbulos en 9 tripletes periféricos sin singlete central (organización 9+0).\nIV. Las células caliciformes son glándulas unicelulares exocrinas intraepiteliales que producen mucinas ricas en carbohidratos, las cuales se tiñen intensamente con la reacción de Feulgen.\n\n¿Cuáles de los enunciados son CORRECTOS?",
        options: [
          "Solo I y II",
          "II y IV",
          "I, II y III",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 2,
        explanation: "Enunciados I, II y III son CORRECTOS: El axonema móvil tiene estructura 9+2, los brazos de dineína catalizan ATP para el batido (mutados en Kartagener), y los cuerpos basales se originan de centriolos con arquitectura 9+0 en tripletes. El enunciado IV es FALSO porque la tinción de Feulgen es específica para el ADN nuclear (no para mucinas; las mucinas se tiñen con PAS o Azul Alcian)."
      },
      {
        id: 'histo_4',
        question: "El tejido óseo es un tejido conectivo mineralizado en constante recambio mediante el acoplamiento de osteoblastos y osteoclastos.\n\nSobre la histogénesis ósea y la biología celular de sus componentes:\nI. Los osteoclastos son células gigantes multinucleadas originadas de la fusión de precursores monocito-macrofágicos de la médula ósea y se alojan en las lagunas de Howship.\nII. El osteoide es la matriz orgánica no mineralizada sintetizada por los osteoblastos, compuesta predominantemente por colágeno tipo I y proteoglucanos.\nIII. Los osteocitos conservan prolongaciones citoplasmáticas comunicadas a través de canalículos óseos mediante uniones tipo gap (hendidura o nexo).\nIV. La fosfatasa ácida resistente al tartrato (TRAP) es un marcador enzimático e histoquímico distintivo de la actividad funcional osteoblástica.\n\nSon premisas VERDADERAS:",
        options: [
          "I, II y III",
          "I y II",
          "II y IV",
          "Solo I y III",
          "Todas son correctas"
        ],
        correctIndex: 0,
        explanation: "Enunciados I, II y III son VERDADEROS: Los osteoclastos derivan de la línea hematopoyética mieloide/monocítica y reabsorben hueso en las lagunas de Howship; el osteoide es matriz pre-mineralizada con colágeno I elaborada por osteoblastos; los osteocitos coordinan el mecanoestrés mediante canalículos y conexinas (gap junctions). El enunciado IV es FALSO porque la TRAP es el marcador patognomónico del OSTEOCLASTO; el marcador de los osteoblastos es la fosfatasa ALCALINA (ALP)."
      },
      {
        id: 'histo_5',
        question: "En el análisis comparativo histológico entre los tres tipos de tejido muscular (esquelético, cardíaco y liso):\n\nI. En el músculo esquelético, la tríada sarcomérica se localiza a nivel de la unión banda A-banda I y está formada por un túbulo T central y dos cisternas terminales del retículo sarcoplásmico.\nII. El músculo cardíaco presenta discos intercalares con desmosomas, fascias adherentes y uniones comunicantes (gap junctions), además de díadas situadas a nivel de la línea Z.\nIII. Las fibras musculares lisas carecen de sarcómeros y túbulos T organizados, utilizando calmodulina en lugar de troponina C para la regulación mediada por calcio.\nIV. Los cuerpos densos en el citoplasma y membrana del músculo liso son homólogos funcionales a las líneas Z del músculo estriado y anclan filamentos de actina y filamentos intermedios.\n\n¿Cuáles de las afirmaciones son CORRECTAS?",
        options: [
          "I y II",
          "Solo I, II y III",
          "II y III",
          "I, III y IV",
          "I, II, III y IV"
        ],
        correctIndex: 4,
        explanation: "Las 4 afirmaciones (I, II, III y IV) son CORRECTAS: En músculo esquelético humano hay tríadas en las uniones A-I; en el miocardio hay díadas en las líneas Z con discos intercalares; el músculo liso no tiene troponina C (usa calmodulina y cinasa de cadenas ligeras de miosina MLCK) y contiene cuerpos densos con alfa-actinina que equivalen a los discos Z."
      },
      {
        id: 'histo_6',
        question: "La clasificación morfológica de los epitelios de revestimiento responde a adaptaciones biomecánicas y funcionales específicas.\n\nRelacione el tipo de epitelio con su localización anatómica característica:\n1. Epitelio plano simple (endotelio/mesotelio)\n2. Epitelio cilíndrico pseudoestratificado ciliado con células caliciformes\n3. Epitelio de transición (urotelio)\n4. Epitelio cilíndrico simple con microvellosidades en chapa estriada\n\na. Mucosa traqueal y bronquios principales\nb. Cápsula de Bowman (hoja parietal) y revestimiento vascular\nc. Mucosa del yeyuno e íleon\nd. Cálices renales, uréteres y vejiga urinaria",
        options: [
          "1-b, 2-a, 3-d, 4-c",
          "1-a, 2-b, 3-c, 4-d",
          "1-c, 2-d, 3-a, 4-b",
          "1-b, 2-c, 3-d, 4-a",
          "1-d, 2-a, 3-b, 4-c"
        ],
        correctIndex: 0,
        explanation: "La relación precisa es: 1-b (plano simple en hoja parietal de la cápsula de Bowman y endotelio vascular); 2-a (epitelio respiratorio clásico pseudoestratificado en tráquea); 3-d (urotelio estratificado polimorfo distensible en vías urinarias bajas); 4-c (epitelio entérico de absorción con enterocitos y chapa estriada)."
      },
      {
        id: 'histo_7',
        question: "En el tejido nervioso del sistema nervioso central (SNC) y periférico (SNP), las células de la glía cumplen funciones esenciales de soporte, mielinización y defensa.\n\nAnalice las siguientes proposiciones:\nI. Los astrocitos expresan fuertemente la proteína glial fibrilar ácida (GFAP) y sus pedicelos vasculares (pies perivasculares) inducen y mantienen la integridad de la barrera hematoencefálica.\nII. Un único oligodendrocito en el SNC es capaz de mielinizar segmentos internodales de múltiples axones simultáneamente, a diferencia de la célula de Schwann en el SNP.\nIII. La microglía deriva embriológicamente del neuroectodermo del tubo neural al igual que las neuronas y astrocitos.\nIV. Las células ependimarias revisten los ventrículos cerebrales y el conducto central de la médula espinal, presentando microvellosidades y cilios que favorecen la circulación del líquido cefalorraquídeo.\n\n¿Cuáles de las afirmaciones son CORRECTAS?",
        options: [
          "I y II",
          "I, II y IV",
          "II, III y IV",
          "Solo I y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y IV son CORRECTOS: Los astrocitos expresan GFAP y forman la BHE con sus pedicelos; los oligodendrocitos mielinizan hasta 50 axones adyacentes; las células ependimarias cúbico-cilíndricas movilizan LCR. El enunciado III es FALSO porque la microglía es el macrófago residente del SNC y deriva del MESODERMO (saco vitelino/mieloblastos embrionarios), no del neuroectodermo."
      },
      {
        id: 'histo_8',
        question: "Respecto a las variedades histológicas de cartílago (hialino, elástico y fibrocartílago):\n\nI. El cartílago hialino posee una matriz cartilaginosa con colágeno tipo II y agregados de agrecano ricos en condroitín sulfato.\nII. El fibrocartílago (cartílago fibroso) contiene abundantes haces de colágeno tipo I y carece de pericondrio en todas sus localizaciones anatómicas (como sínfisis púbica y discos intervertebrales).\nIII. El cartílago elástico contiene fibras elásticas abundantes que se evidencian mediante tinciones de orceína o resorcina-fucsina y nunca experimenta calcificación fisiológica por envejecimiento.\nIV. Los condrocitos del cartílago articular reciben su nutrición y oxígeno principalmente a través del pericondrio denso que reviste la superficie libre de la articulación sinovial.\n\nSon enunciados VERDADEROS:",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son VERDADEROS: El cartílago hialino se caracteriza por colágeno II; el fibrocartílago tiene colágeno I y carece de pericondrio; el elástico posee orceína-positividad y no se calcifica con la edad. El enunciado IV es FALSO porque el cartílago articular CARECE de pericondrio en su superficie articular para evitar fricción; su nutrición proviene exclusivamente por difusión desde el líquido sinovial y vasos subcondrales."
      }
    ]
  },
  {
    id: 'parasitologia',
    title: "🪱 Parasitología Médica & Enfermedades Tropicales",
    subtitle: "Ciclos Biológicos, Protozoarios, Helmintos y Diagnóstico Parasitológico",
    badge: "Parasitología",
    badgeColor: '#f59e0b',
    description: "Casos clínicos de enfermedades parasitarias endémicas, protozoarios luminales y tisulares, helmintiasis, fases infectantes diagnósticas e ítems I-IV.",
    questions: [
      {
        id: 'para_1',
        question: "Niño de 6 años procedente de zona rural de la selva es llevado al puesto de salud por dolor abdominal cólico difuso, vómitos con expulsión de gusanos cilíndricos de 20 cm, distensión abdominal y marcada eosinofilia periférica (18%).\n\nRespecto a la biología, patogénesis y ciclo de Ascaris lumbricoides:\nI. El estadio infectante para el ser humano es el huevo larvado que contiene la larva de segundo estadio (L2) o tercer estadio (L3), adquirido por vía fecal-oral.\nII. La migración larvaria por la circulación pulmonar puede desencadenar el Síndrome de Löffler (neumonitis eosinofílica con infiltrados radiográficos fugaces).\nIII. El hábitat definitivo donde los parásitos adultos copulan y habitan habitualmente es el intestino grueso a nivel del ciego y colon ascendente.\nIV. La oclusión o vólvulo intestinal mecánico es la complicación quirúrgica aguda más frecuente en niños con altas cargas de infestación.\n\n¿Cuáles de los enunciados son VERDADEROS?",
        options: [
          "Solo I y II",
          "I, II y IV",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y IV son VERDADEROS: La infección ocurre por ingesta de huevos larvados fértiles; la fase de paso pulmonar alveolar produce neumonitis de Löffler con tos y eosinofilia; y la masa de adultos puede provocar suboclusión mecánica en íleon. El enunciado III es FALSO porque el hábitat definitivo del adulto de Ascaris es la luz del INTESTINO DELGADO (especialmente yeyuno e íleon), no el colon."
      },
      {
        id: 'para_2',
        question: "El conocimiento de los estadios infectantes es crucial para comprender la vía de transmisión y el control epidemiológico de las parasitosis humanas.\n\nRelacione cada parásito con su forma infectante específica para el hospedero humano definitivo:\n1. Entamoeba histolytica\n2. Taenia solium (desarrollo de Teniasis intestinal)\n3. Strongyloides stercoralis\n4. Fasciola hepatica\n\na. Cisticerco (Cysticercus cellulosae) en carne de cerdo cruda o mal cocida\nb. Larva filariforme (L3) por penetración transcutánea activa\nc. Quiste tetranucleado maduro por ingesta de agua o alimentos contaminados\nd. Metacercaria enquistada en plantas acuáticas (ej. berros)",
        options: [
          "1-c, 2-a, 3-b, 4-d",
          "1-a, 2-c, 3-d, 4-b",
          "1-c, 2-d, 3-b, 4-a",
          "1-d, 2-a, 3-b, 4-c",
          "1-b, 2-a, 3-c, 4-d"
        ],
        correctIndex: 0,
        explanation: "La relación correcta es: 1-c (E. histolytica se transmite por quiste maduro tetranucleado); 2-a (la Teniasis humana se adquiere al comer carne con cisticercos; la cisticercosis humana se adquiere por huevos de T. solium); 3-b (S. stercoralis penetra piel como larva filariforme L3); 4-d (Fasciola enquista metacercarias en plantas como berros)."
      },
      {
        id: 'para_3',
        question: "Mujer de 25 años acude por cuadro de 3 semanas de evolución caracterizado por diarrea esteatorreica, flatulencia fétida, náuseas, anorexia y pérdida de peso de 3 kg tras campamento de montaña. El examen seriado de heces confirma la presencia de quistes de Giardia lamblia (duodenalis).\n\nRespecto a la fisiopatología y diagnóstico de Giardia lamblia:\nI. El trofozoíto se fija al ribete en cepillo del epitelio del duodeno y yeyuno proximal mediante su disco succionador o adhesivo ventral.\nII. Giardia lamblia produce invasión transmural profunda y úlceras \"en cuello de botella\" con hemorragia digestiva masiva en la mucosa colónica.\nIII. La infección causa aplanamiento de microvellosidades, deficiencia secundaria de disacaridasas (como lactasa) y malabsorción de grasas y vitaminas liposolubles.\nIV. Los pacientes con hipogammaglobulinemia común variable o deficiencia selectiva de IgA presentan cuadros más severos, refractarios y crónicos.\n\nSon proposiciones CORRECTAS:",
        options: [
          "Solo I y III",
          "I, II y IV",
          "I, III y IV",
          "II, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 2,
        explanation: "Enunciados I, III y IV son CORRECTOS: Giardia se adhiere mediante su disco suctorio ventral en duodeno/yeyuno sin invadir la pared, lesiona el borde en cepillo causando malabsorción y deficiencia de lactasa, y la IgA secretora es el pilar defensivo principal. El enunciado II es FALSO porque Giardia NO invade transmuralmente ni hace úlceras en cuello de botella; ese es el mecanismo lesional patognomónico de Entamoeba histolytica en el colon."
      },
      {
        id: 'para_4',
        question: "Varón de 32 años sin antecedentes de epilepsia presenta crisis convulsivas tónico-clónico generalizadas. La tomografía cerebral computarizada muestra múltiples lesiones quísticas calcificadas y un quiste vesicular con nódulo mural hiperdenso (\"scolex\") en el parénquima frontal (Neurocisticercosis).\n\nEn relación a la neurocisticercosis y Taenia solium:\nI. El ser humano desarrolla neurocisticercosis al actuar como hospedero intermediario accidental mediante la ingestión de huevos de Taenia solium eliminados en heces humanas.\nII. El consumo de carne de cerdo infectada con cisticercos (\"triquina/cisticerco\") produce teniasis intestinal adulta en el humano, no cisticercosis directa.\nIII. La presencia de auto-infección interna o externa (fecal-oral) en un portador de teniasis adulta es un factor de riesgo mayor para contraer cisticercosis tisular.\nIV. La respuesta inflamatoria del hospedero y el edema perilesional alcanzan su máxima intensidad en la fase vesicular viable inicial del cisticerco.\n\n¿Cuáles afirmaciones son CORRECTAS?",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son CORRECTOS: La cisticercosis tisular humana requiere ingerir HUEVOS de T. solium (por alimentos contaminados o autoinfección ano-mano-boca en portadores de tenia intestinal), mientras que comer cisticercos en cerdo produce teniasis intestinal. El enunciado IV es FALSO porque en la fase vesicular el parásito evade la inmunidad y apenas genera inflamación; la reacción inmune y el edema cerebral máximo ocurren en la fase COLOIDAL degenerativa al morir la larva."
      },
      {
        id: 'para_5',
        question: "En áreas endémicas de malaria en la Amazonía peruana, la diferenciación biológica y clínica entre Plasmodium falciparum y Plasmodium vivax es determinante para el esquema terapéutico.\n\nAnalice las premisas siguientes:\nI. Plasmodium vivax y Plasmodium ovale producen formas intrahepáticas latentes denominadas hipnozoítos, responsables de recaídas tardías a distancia.\nII. Plasmodium falciparum parasita eritrocitos de todas las edades, induciendo la expresión de la proteína PfEMP-1 que causa citoadherencia endotelial, secuestro microvascular y malaria cerebral.\nIII. La gota gruesa y el frotis sanguíneo teñidos con Giemsa o Wright continúan siendo el estándar de oro laboratorial para la identificación de especie y densidad parasitaria.\nIV. El tratamiento radical de Plasmodium vivax requiere únicamente Cloroquina, no siendo necesaria la administración de Primaquina debido a la ausencia de estadios tisulares.\n\nSon enunciados VERDADEROS:",
        options: [
          "I, II y III",
          "Solo I y II",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 0,
        explanation: "Enunciados I, II y III son VERDADEROS: P. vivax forma hipnozoítos en hepatocitos que reactivan la infección; P. falciparum invade hematíes sin límite de edad causando hiperparasitemia y secuestro capilar vía PfEMP-1; la gota gruesa/frotis es el gold standard diagnóstico. El enunciado IV es FALSO porque la curación radical de P. vivax OBLIGA a utilizar Primaquina (actividad esquizonticida tisular contra hipnozoítos) para evitar recaídas."
      },
      {
        id: 'para_6',
        question: "Para un óptimo rendimiento diagnóstico en parasitología clínica, cada agente requiere una técnica de toma de muestra y procesamiento adecuada.\n\nRelacione el parásito con la técnica diagnóstica de primera línea:\n1. Enterobius vermicularis (oxiuro)\n2. Strongyloides stercoralis\n3. Cryptosporidium parvum\n4. Trichomonas vaginalis\n\na. Examen microscópico en fresco de secreción vaginal o sedimento urinario\nb. Test de Graham (cinta adhesiva perianal seriada por la mañana)\nc. Tinción de Ziehl-Neelsen modificada (Kinyoun) en frotis fecal\nd. Método de concentración de Baermann o cultivo en placa de agar",
        options: [
          "1-b, 2-d, 3-c, 4-a",
          "1-a, 2-c, 3-b, 4-d",
          "1-b, 2-a, 3-c, 4-d",
          "1-c, 2-d, 3-a, 4-b",
          "1-d, 2-b, 3-c, 4-a"
        ],
        correctIndex: 0,
        explanation: "La relación precisa es: 1-b (Graham captura huevos asimétricos de oxiuros depositados por la hembra en la noche); 2-d (Baermann o cultivo en agar concentra larvas rabditoides vivas de Strongyloides aprovechando hidro/termotropismo positivo); 3-c (ooquistes ácido-alcohol resistentes de Cryptosporidium se evidencian con Kinyoun); 4-a (examen en fresco móvil para trofozoítos de T. vaginalis)."
      },
      {
        id: 'para_7',
        question: "Varón de 45 años, ganadero de la sierra central, acude por dolor sordo en hipocondrio derecho y sensación de masa. La ecografía abdominal muestra una lesión quística unilocular de 12 cm en lóbulo hepático derecho con pared doble y calcificación periférica parcial (Quiste Hidatídico Hepático).\n\nSobre la hidatidosis y Echinococcus granulosus:\nI. El perro doméstico u otros cánidos actúan como hospedero definitivo al albergar los gusanos adultos en su intestino.\nII. El ser humano y los ovinos son hospederos intermediarios que contraen la infección al ingerir huevos embrionados eliminados en las heces del perro.\nIII. La pared del quiste hidatídico se compone de una adventicia fibrosa del hospedero (periquística), una membrana cuticular acelular laminar y una membrana germinativa interna proliferativa.\nIV. La aspiración diagnóstica con aguja fina percutánea no guiada es el procedimiento inocuo de primera elección previo al uso de albendazol.\n\n¿Cuáles afirmaciones son VERDADERAS?",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son VERDADEROS: El ciclo tiene al perro como hospedero definitivo y al ganado ovino/humano como intermediarios donde crece el quiste de triple capa. El enunciado IV es FALSO y sumamente peligroso: la punción a ciegas está CONTRAINDICADA por el altísimo riesgo de fuga de líquido hidatídico, shock anafiláctico mortal y siembra peritoneal secundaria."
      },
      {
        id: 'para_8',
        question: "En relación a la leishmaniasis tegumentaria (Uta y Espundia) y visceral (Kala-azar):\n\nI. Los vectores biológicos involucrados en la transmisión son dípteros flebótomos hembra de los géneros Lutzomyia (en el Nuevo Mundo) y Phlebotomus (en el Viejo Mundo).\nII. La forma infectante inoculada por el vector en la piel humana durante la picadura es el promastigote flagelado metacíclico.\nIII. Dentro de los macrófagos y células del sistema fagocítico mononuclear humano, el parásito se multiplica activamente en forma de amastigote intracelular aflagelado.\nIV. La intradermorreacción de Montenegro (leishmanina) resulta típicamente muy positiva con induración franca en los pacientes con leishmaniasis visceral avanzada por anergia celular selectiva.\n\nSon proposiciones CORRECTAS:",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son CORRECTOS: Los flebótomos (Lutzomyia) transmiten promastigotes metacíclicos que en los fagolisosomas de los macrófagos se diferencian a amastigotes. El enunciado IV es FALSO porque en la leishmaniasis visceral (Kala-azar) existe supresión masiva de la inmunidad celular mediada por linfocitos T Th1, siendo la prueba de Montenegro TÍPICAMENTE NEGATIVA (se negativiza durante la enfermedad activa y solo positiviza tras curación)."
      }
    ]
  },
  {
    id: 'bacteriologia',
    title: "🧫 Bacteriología Clínica & Resistencia Antimicrobiana",
    subtitle: "Patógenos Gram (+)/(-), Factores de Virulencia y Mecanismos Moleculares",
    badge: "Bacteriología",
    badgeColor: '#10b981',
    description: "Identificación fenotípica y molecular de bacterias de relevancia médica, cocos y bacilos, perfiles de susceptibilidad BLEE/Carbapenemasas y casos clínicos.",
    questions: [
      {
        id: 'bact_1',
        question: "Paciente en UCI conectado a ventilación mecánica hace 9 días presenta fiebre de 39°C, aumento de secreciones traqueobronquiales purulentas verdosas y nuevos infiltrados pulmonares. El cultivo cuantitativo del aspirado traqueal aísla un bacilo Gram negativo no fermentador de glucosa, oxidasa positivo, productor de piocianina y piovirdina (Pseudomonas aeruginosa).\n\nEn cuanto a los determinantes de patogenicidad y resistencia de este microorganismo:\nI. La Exotoxina A es su principal factor de virulencia y posee el mismo mecanismo molecular que la toxina diftérica (inactivación del factor de elongación EF-2 mediante ADP-ribosilación).\nII. La producción de un polisacárido mucoide capsular rico en alginato confiere formación de biopelículas (biofilms) que obstaculizan la fagocitosis y penetración de antibióticos.\nIII. Posee resistencia intrínseca a múltiples antibióticos mediada por baja permeabilidad de su membrana externa (porinas OprD) y bombas de eflujo activo (MexAB-OprM).\nIV. La Ceftriaxona y Ertapenem representan las cefalosporinas y carbapenémicos de máxima potencia y primera línea con actividad antipseudomónica comprobada.\n\n¿Cuáles enunciados son VERDADEROS?",
        options: [
          "I y II",
          "Solo I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son VERDADEROS: La exotoxina A inhibe la síntesis proteica vía EF-2; el alginato genera biofilms en vías aéreas; y las bombas Mex junto a porinas confieren alta resistencia intrínseca. El enunciado IV es FALSO porque Ceftriaxona y Ertapenem CARECEN de actividad frente a P. aeruginosa (los betalactámicos antipseudomonas son Ceftazidima, Cefepima, Piperacilina/Tazobactam, Meropenem e Imipenem)."
      },
      {
        id: 'bact_2',
        question: "La emergencia global de mecanismos de resistencia bacteriana amenaza la eficacia de la terapia antimicrobiana.\n\nRelacione el mecanismo molecular / gen de resistencia con la familia de antibióticos inactivados:\n1. Gen mecA (síntesis de PBP2a)\n2. Betalactamasas de espectro extendido (BLEE tipo CTX-M)\n3. Carbapenemasas tipo KPC (Klebsiella pneumoniae carbapenemase)\n4. Operón vanA (sustitución D-Ala-D-Ala por D-Ala-D-Lac)\n\na. Penicilinas, cefalosporinas de todas las generaciones y carbapenémicos\nb. Glucopéptidos (vancomicina y teicoplanina)\nc. Todos los betalactámicos (penicilinas, cefalosporinas y monobactámicos), respetando carbapenémicos\nd. Todas las penicilinas isoxazólicas (oxacilina, meticilina) y casi todas las cefalosporinas",
        options: [
          "1-d, 2-c, 3-a, 4-b",
          "1-c, 2-d, 3-a, 4-b",
          "1-d, 2-a, 3-c, 4-b",
          "1-b, 2-c, 3-d, 4-a",
          "1-a, 2-b, 3-c, 4-d"
        ],
        correctIndex: 0,
        explanation: "La relación correcta es: 1-d (mecA genera PBP2a con baja afinidad a betalactámicos en MRSA); 2-c (las BLEE degradan cefalosporinas de 1.ª a 4.ª generación y aztreonam, pero son sensibles a carbapenémicos); 3-a (las carbapenemasas KPC son clase A de Ambler e hidrolizan carbapenémicos y todos los betalactámicos); 4-b (vanA modifica el extremo del peptidoglucano tornando ineficaces a los glucopéptidos)."
      },
      {
        id: 'bact_3',
        question: "Mujer de 68 años hospitalizada por neumonía que recibió Ceftriaxona y Clindamicina durante 10 días. Al 3.er día posalta presenta diarrea acuosa abundante (8 deposiciones/día), fiebre y leucocitosis de 22,000/uL. La sigmoidoscopía revela placas blanco-amarillentas elevadas adheridas a la mucosa cólica (Colitis Pseudomembranosa por Clostridioides difficile).\n\nEn relación a la fisiopatología y manejo de Clostridioides difficile:\nI. Es un bacilo Gram positivo formador de esporas, anaerobio estricto, productor de toxina A (enterotoxina) y toxina B (citotoxina potente).\nII. Ambas toxinas glucosilan e inactivan proteínas de la familia Rho GTPasas, causando despolimerización de filamentos de actina y muerte de los colonocitos.\nIII. La cepa epidémica hipervirulenta BI/NAP1/027 presenta una mutación por deleción en el gen tcdC (regulador negativo), provocando una producción sobrexpresada de toxinas A y B, además de sintetizar la toxina binaria.\nIV. La loperamida y otros opioides antimotilidad están formalmente indicados para reducir la deshidratación en las primeras 48 horas de tratamiento.\n\n¿Cuáles enunciados son VERDADEROS?",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son VERDADEROS: C. difficile produce toxinas A y B que inactivan Rho GTPasas destruyendo el citoesqueleto celular, y el ribotipo 027 carece del freno tcdC produciendo toxinas en exceso. El enunciado IV es FALSO y contraproducente: los fármacos antidiarreicos antimotilidad como la loperamida están CONTRAINDICADOS porque favorecen la retención luminal de toxinas y precipitan megacolon tóxico y perforación."
      },
      {
        id: 'bact_4',
        question: "En el laboratorio de microbiología, la diferenciación fenotípica entre especies del género Staphylococcus es fundamental para la toma de decisiones clínicas.\n\nAnalice las siguientes afirmaciones:\nI. Staphylococcus aureus se diferencia de las especies de estafilococos coagulasa negativos (como S. epidermidis y S. saprophyticus) por la producción de coagulasa y fermentación de manitol en agar salado manitol.\nII. La Proteína A de la pared celular de S. aureus se une a la fracción Fc de la IgG, impidiendo la opsonización mediada por anticuerpos y la posterior fagocitosis.\nIII. La Toxina del Síndrome de Shock Tóxico 1 (TSST-1) actúa como un superantígeno capaz de unirse simultáneamente a la región V-beta del receptor de células T (TCR) y a moléculas del CMH clase II sin procesamiento antigénico previo.\nIV. Staphylococcus saprophyticus es uniformemente susceptible a la novobiocina, a diferencia de S. epidermidis que es intrínsecamente resistente.\n\nSon proposiciones CORRECTAS:",
        options: [
          "Solo I y II",
          "I, II y III",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son CORRECTOS: S. aureus es coagulasa (+), fermenta manitol virando el agar a amarillo, expresa Proteína A unida al Fc de IgG y libera TSST-1 que genera tormenta masiva de citocinas (IL-1, IL-2, TNF-alfa). El enunciado IV es FALSO porque S. saprophyticus es RESISTENTE a novobiocina (clave diagnóstica diferencial en infecciones urinarias en mujeres jóvenes), mientras que S. epidermidis es sensible."
      },
      {
        id: 'bact_5',
        question: "Varón de 55 años con antecedente de esplenectomía postraumática ingresa a urgencias con neumonía adquirida en la comunidad, shock séptico y hemocultivos positivos para diplococos Gram positivos lanceolados (Streptococcus pneumoniae).\n\nRespecto a los determinantes de virulencia y prevención de Streptococcus pneumoniae:\nI. La cápsula polisacárida es su principal factor de virulencia antifagocítico, existiendo más de 100 serotipos antigénicos identificados mediante la reacción de Quellung (neufeld).\nII. La neumolisina es una citotoxina formadora de poros que destruye las células epiteliales ciliadas y fagocitos del hospedero.\nIII. En el laboratorio, se identifica por ser alfa-hemolítico en agar sangre, soluble en bilis y sensible al disco de optoquina (clorhidrato de etilhidrocupreína).\nIV. Los pacientes asplénicos tienen un riesgo similar de sepsis fulminante que la población general debido a que la opsonización por IgM ocurre indistintamente en médula ósea.\n\n¿Cuáles premisas son VERDADERAS?",
        options: [
          "I, II y III",
          "Solo I y II",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 0,
        explanation: "Enunciados I, II y III son VERDADEROS: La cápsula polisacárida es la diana de las vacunas conjugadas (PCV13, PCV20), la neumolisina lesiona epitelios y el germen es bilis-soluble y sensible a optoquina. El enunciado IV es FALSO: los asplénicos sufren un riesgo exponencialmente mayor (50-100 veces) de sepsis bacteriana fulminante por bacterias capsuladas (S. pneumoniae, N. meningitidis, H. influenzae) al carecer de macrófagos de la pulpa roja esplénica y properdina."
      },
      {
        id: 'bact_6',
        question: "Los medios de cultivo selectivos y las pruebas bioquímicas diferenciales permiten aislar patógenos entéricos y respiratorios específicos.\n\nRelacione el microorganismo con su medio de cultivo selectivo o característica bioquímica clave:\n1. Corynebacterium diphtheriae\n2. Vibrio cholerae\n3. Salmonella enterica serotipo Typhi\n4. Neisseria meningitidis\n\na. Agar TCBS (Tiosulfato-Citrato-Bilis-Sacarosa) donde forma colonias amarillas fermentadoras de sacarosa\nb. Medio de Löffler o agar telurito de potasio (medio de Tinsdale) formando colonias grisáceas/negras con halo pardo\nc. Agar Thayer-Martin modificado (agar chocolate suplementado con vancomicina, colistina y nistatina)\nd. Agar MacConkey (lactosa negativa) y producción de ácido sulfhídrico (H2S positivo) en agar TSI",
        options: [
          "1-b, 2-a, 3-d, 4-c",
          "1-a, 2-b, 3-c, 4-d",
          "1-c, 2-a, 3-d, 4-b",
          "1-b, 2-d, 3-a, 4-c",
          "1-d, 2-a, 3-b, 4-c"
        ],
        correctIndex: 0,
        explanation: "La relación precisa es: 1-b (C. diphtheriae reduce el telurito de potasio dando colonias negras en Tinsdale); 2-a (V. cholerae tolera el pH alcalino y fermenta sacarosa en TCBS originando colonias amarillas); 3-d (Salmonella no fermenta lactosa y produce sulfuro de hidrógeno negro en TSI); 4-c (Thayer-Martin inhibe flora saprofita con antibióticos aislando Neisserias patógenas)."
      },
      {
        id: 'bact_7',
        question: "Recién nacido de 4 días presenta letargia, dificultad respiratoria, inestabilidad térmica y signos meníngeos. La punción lumbar revela pleocitosis con predominio mononuclear/polimorfonuclear, hiperproteinorraquia e hipoglucorraquia. La tinción de Gram muestra bacilos Gram positivos cortos no esporulados (Listeria monocytogenes).\n\nEn relación a Listeria monocytogenes:\nI. Es un patógeno intracelular facultativo capaz de multiplicarse a temperaturas de refrigeración (psicrótrofo, 4°C).\nII. Posee movilidad en \"voltereta\" (tumbling motility) a 22-25°C, mediada por flagelos dependientes de temperatura.\nIII. Utiliza la listeriolisina O (LLO) y fosfolipasas para lisar la membrana del fagosoma y escapar al citosol del macrófago, movilizándose de célula a célula polimerizando filamentos de actina del hospedero (proteína ActA).\nIV. Las cefalosporinas de tercera generación como Cefotaxima o Ceftriaxona constituyen la terapia empírica de primera línea obligatoria por su excelente cobertura.\n\n¿Cuáles son CORRECTAS?",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son CORRECTOS: Crece en frío, tiene movilidad típica en voltereta a temperatura ambiente, y usa listeriolisina O junto con ActA (\"colas de cometa\" de actina) para propagarse entre células sin contacto extracelular. El enunciado IV es FALSO y una trampa clásica de examen: Listeria posee RESISTENCIA INTRÍNSECA natural a TODAS las cefalosporinas (incluidas de 3.ª y 4.ª generación); el tratamiento de elección es AMPICILINA (asociada o no a gentamicina)."
      },
      {
        id: 'bact_8',
        question: "Niño de 4 años acude a urgencias por presentar diarrea sanguinolenta, oliguria marcada, palidez extrema y petequias 6 días después de ingerir hamburguesa de carne vacuna mal cocida. Los exámenes de laboratorio revelan anemia hemolítica microangiopática con esquistocitos, trombocitopenia severa y falla renal aguda (Síndrome Urémico Hemolítico - SUH).\n\nRespecto a Escherichia coli enterotoxigénica y enterohemorrágica:\nI. El cuadro es provocado por Escherichia coli enterohemorrágica (EHEC / STEC), cuyo serotipo más prevalente es O157:H7.\nII. La toxina Shiga 1 y 2 (Stx1/Stx2) se une al receptor globotriaosilceramida (Gb3) en las células endoteliales de las microvasculatura glomerular causando daño endotelial y microtrombos.\nIII. El uso de antibióticos bactericidas (como fluoroquinolonas o betalactámicos) durante la fase de diarrea está plenamente recomendado porque disminuye la incidencia de SUH en un 80%.\nIV. En agar MacConkey-Sorbitol (SMAC), la cepa E. coli O157:H7 se distingue porque no fermenta el sorbitol a las 24 horas (colonias incoloras).\n\n¿Cuáles enunciados son VERDADEROS?",
        options: [
          "Solo I y II",
          "I, II y IV",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y IV son VERDADEROS: EHEC O157:H7 produce toxinas Shiga que dianan el receptor Gb3 renal generando microangiopatía trombótica con esquistocitos, y en agar SMAC no fermenta sorbitol. El enunciado III es FALSO: el tratamiento con antibióticos está CONTRAINDICADO formalmente porque induce la respuesta SOS bacteriana, incrementando la lisis celular, la liberación masiva de toxina Stx y el riesgo de desencadenar o agravar el SUH."
      }
    ]
  },
  {
    id: 'virologia',
    title: "🦠 Virología Médica & Agentes Infecciosos Emergentes",
    subtitle: "Hepatitis Viral, Retrovirus (VIH), Arbovirus y Patogénesis Molecular",
    badge: "Virología",
    badgeColor: '#6366f1',
    description: "Interpretación exhaustiva de perfiles serológicos (VHB/VHC), ciclo replicativo del VIH-1, arbovirosis (Dengue, Zika), virus respiratorios y casos clínicos con ítems I-IV.",
    questions: [
      {
        id: 'viro_1',
        question: "Un médico residente de primer año se realiza el control serológico ocupacional para Hepatitis B, con el siguiente resultado de laboratorio:\n- HBsAg (Antígeno de superficie): NEGATIVO\n- Anti-HBs (Anticuerpo contra el antígeno de superficie): POSITIVO (título 350 mUI/mL)\n- Anti-HBc Total (Anticuerpo contra el core): NEGATIVO\n- HBeAg: NEGATIVO\n\nRespecto a la interpretación serológica y virológica del virus de la Hepatitis B (VHB):\nI. El patrón serológico presentado corresponde indudablemente a un estado de inmunidad conferida por vacunación previa exitosa contra el VHB.\nII. La presencia de Anti-HBc positivo (tipo IgG) es el marcador biológico que distingue una infección pasada resuelta curada de la inmunidad por vacunación.\nIII. El genoma del VHB es un ADN circular parcialmente bicatenario y utiliza una transcriptasa inversa para su replicación a través de un intermediario de ARN pregenómico.\nIV. La positividad aislada de HBeAg es indicativa de baja infectividad y supresión de la replicación viral activa.\n\n¿Cuáles afirmaciones son VERDADERAS?",
        options: [
          "I, II y III",
          "Solo I y II",
          "II y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 0,
        explanation: "Enunciados I, II y III son VERDADEROS: La vacuna recombinante contiene únicamente HBsAg, por lo que el vacunado desarrolla solo Anti-HBs sin generar Anti-HBc (el cual exige replicación de viriones completos); el VHB es un Hepadnavirus con retrotranscripción. El enunciado IV es FALSO porque HBeAg es el marcador clásico de ALTA replicación viral e hiperinfectividad (su desaparición y seroconversión a Anti-HBe marca baja replicación)."
      },
      {
        id: 'viro_2',
        question: "Los virus hepatotropos primarios pertenecen a familias virales diversas con características biológicas y mecanismos patogénicos distintos.\n\nRelacione el virus de la hepatitis con su estructura genómica y vía de transmisión predominante:\n1. Virus de la Hepatitis A (VHA)\n2. Virus de la Hepatitis B (VHB)\n3. Virus de la Hepatitis C (VHC)\n4. Virus de la Hepatitis D (VHD o delta)\n\na. Virus ARN monocatenario sentido positivo (Flaviviridae), transmisión parenteral/sanguínea principal, alto índice de cronicidad\nb. Virus ARN circular monocatenario defectivo con envoltura prestada de HBsAg, transmisión parenteral/sexual\nc. Virus ARN monocatenario sin envoltura (Picornaviridae), transmisión fecal-oral por agua o alimentos contaminados\nd. Virus ADN parcialmente bicatenario con transcriptasa inversa (Hepadnaviridae), transmisión parenteral, sexual y vertical",
        options: [
          "1-c, 2-d, 3-a, 4-b",
          "1-a, 2-b, 3-c, 4-d",
          "1-c, 2-a, 3-d, 4-b",
          "1-b, 2-d, 3-a, 4-c",
          "1-d, 2-c, 3-b, 4-a"
        ],
        correctIndex: 0,
        explanation: "La relación precisa es: 1-c (VHA es Picornavirus ARN desnudo fecal-oral); 2-d (VHB es Hepadnavirus ADN circular con RT y envoltura); 3-a (VHC es Flavivirus ARN que cronifica en >75% de casos); 4-b (VHD es virión defectuoso que requiere obligatoriamente HBsAg del VHB para su ensamblaje y cubierta)."
      },
      {
        id: 'viro_3',
        question: "Mujer de 24 años procedente de Piura acude al centro de salud con 4 días de fiebre alta continua, dolor retroocular intenso, mialgias y artralgias. En el examen físico presenta petequias en extremidades, prueba del torniquete positiva y hepatomegalia dolorosa a 2 cm del reborde costal. El hemograma muestra hematocrito en 48% (previo basal 36%), plaquetas en 42,000/uL y leucopenia.\n\nEn relación a la infección por el virus del Dengue (DENV):\nI. Es un arbovirus de la familia Flaviviridae con cuatro serotipos antigénicos (DENV-1, DENV-2, DENV-3, DENV-4) transmitido por mosquitos hembra del género Aedes.\nII. El antígeno de la proteína no estructural 1 (NS1) en suero es detectable durante los primeros 5 días de la fase febril aguda mediante ELISA o pruebas rápidas.\nIII. La presencia de hemoconcentración (aumento del hematocrito >= 20%), trombocitopenia y dolor abdominal continuo son signos de alarma que indican extravasación plasmática inminente.\nIV. El fenómeno de potenciación mediada por anticuerpos (ADE) explica por qué una segunda infección por un serotipo diferente al primario confiere protección cruzada vitalicia sin riesgo de dengue grave.\n\n¿Cuáles afirmaciones son CORRECTAS?",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son CORRECTOS: Transmitido por Aedes aegypti, diagnosticable precozmente por NS1, y sus signos de alarma cardinales son la fuga plasmática con aumento de hematocrito y trombocitopenia. El enunciado IV es FALSO: el fenómeno ADE (Antibody-Dependent Enhancement) provoca exactamente lo OPUESTO: los anticuerpos heterólogos no neutralizantes de la primera infección facilitan la entrada masiva del nuevo serotipo en monocitos, desencadenando Dengue Grave y shock por dengue."
      },
      {
        id: 'viro_4',
        question: "En el ciclo de replicación del Virus de la Inmunodeficiencia Humana tipo 1 (VIH-1) y la terapia antirretroviral (TARV):\n\nI. La glucoproteína gp120 de la envoltura viral se une al receptor CD4 del linfocito T y a correceptores de quimiocinas (CCR5 en cepas macrófago-trópicas R5 o CXCR4 en cepas linfotrópicas X4).\nII. La transcriptasa inversa del VIH carece de actividad correctora de lectura (proofreading 3'-5' exonucleasa), generando una tasa mutagénica elevada y cuasiespecies virales.\nIII. Los inhibidores de la integrasa (como Dolutegravir y Raltegravir) bloquean la inserción covalentemente unida del ADN proviral en el genoma del núcleo celular hospedero.\nIV. El uso de monoterapia con Zidovudina o Efavirenz es el esquema estándar de máxima eficacia internacional recomendado por la OMS para el control virológico sostenido.\n\nSon proposiciones VERDADERAS:",
        options: [
          "Solo I y II",
          "I, II y III",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son VERDADEROS: gp120 media la unión a CD4/CCR5/CXCR4; la RT carece de exonucleasa correctora provocando alta mutabilidad; y los inhibidores de transferencia de cadenas de la integrasa (INSTI como Dolutegravir) impiden integrar el ADN proviral. El enunciado IV es FALSO y anacrónico: la monoterapia genera rápida selección de mutaciones de resistencia; el estándar obligatorio es la TERAPIA COMBINADA (mínimo dos ITIAN más un INSTI)."
      },
      {
        id: 'viro_5',
        question: "La familia Herpesviridae se caracteriza por su capacidad para establecer infecciones latentes de por vida en distintos tipos celulares.\n\nRespecto a los sitios anatómicos de latencia y cuadros clínicos característicos:\nI. El Virus Herpes Simple tipo 1 (VHS-1) establece latencia en los cuerpos neuronales del ganglio sensitivo del nervio trigémino.\nII. El Virus Varicela-Zóster (VVZ) permanece latente en los ganglios de las raíces dorsales sensoriales de la médula espinal y ganglios craneales, reactivándose como herpes zóster metamérico.\nIII. El Virus de Epstein-Barr (VEB) establece latencia episomal en los linfocitos B de memoria y se asocia a linfoma de Burkitt y carcinoma nasofaríngeo.\nIV. El Citomegalovirus (CMV) establece latencia exclusivamente en los eritrocitos maduros circulantes sin afectar células de linaje mieloide ni monocitos.\n\n¿Cuáles enunciados son CORRECTOS?",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son CORRECTOS: VHS-1 latente en ganglio trigeminal; VVZ en ganglios espinales dorsales reactivando en dermatomas; VEB en linfocitos B expresando LMP-1 y EBNA. El enunciado IV es FALSO porque los eritrocitos carecen de núcleo y síntesis proteica; el CMV establece latencia en precursores mieloides de la médula ósea, MONOCITOS y células endoteliales."
      },
      {
        id: 'viro_6',
        question: "Los antivirales de acción directa (AAD) han revolucionado la terapéutica de las infecciones por virus ADN y ARN.\n\nRelacione el principio activo antiviral con su mecanismo de acción diana:\n1. Aciclovir\n2. Oseltamivir\n3. Sofosbuvir\n4. Maraviroc\n\na. Inhibidor análogo de nucleótido de la ARN polimerasa dependiente de ARN (NS5B) del VHC\nb. Antagonista alostérico del correceptor de quimiocinas CCR5 del hospedero humano\nc. Inhibidor competitivo de la neuraminidasa de los virus Influenza A y B que bloquea la liberación viral\nd. Análogo de desoxiguanosina monofosforilado por la timidina cinasa viral e inhibidor de la ADN polimerasa de herpesvirus",
        options: [
          "1-d, 2-c, 3-a, 4-b",
          "1-c, 2-d, 3-a, 4-b",
          "1-d, 2-a, 3-c, 4-b",
          "1-b, 2-c, 3-d, 4-a",
          "1-a, 2-b, 3-c, 4-d"
        ],
        correctIndex: 0,
        explanation: "La relación exacta es: 1-d (Aciclovir requiere activación selectiva por timidina cinasa del VHS/VVZ); 2-c (Oseltamivir bloquea neuraminidasa evitando que los viriones salientes se desprendan del ácido siálico); 3-a (Sofosbuvir inhibe NS5B del virus de la hepatitis C provocando terminación de cadena); 4-b (Maraviroc bloquea CCR5 celular impidiendo la entrada del VIH trópico R5)."
      },
      {
        id: 'viro_7',
        question: "Lactante de 4 meses ingresa con taquipnea, tiraje subcostal, sibilancias espiratorias y retracción intercostal en pleno periodo invernal. La prueba rápida de antígenos en aspirado nasofaríngeo resulta positiva para Virus Sincitial Respiratorio (VSR).\n\nEn cuanto a la virología del VSR y la bronquiolitis aguda:\nI. Es un virus de ARN monocatenario de sentido negativo envuelto perteneciente a la familia Pneumoviridae.\nII. La glucoproteína F (fusión) media tanto la entrada viral a la célula hospedera como la fusión de membranas adyacentes formando células gigantes multinucleadas (sincitios).\nIII. El Palivizumab es un anticuerpo monoclonal humanizado dirigido contra la glucoproteína F indicado como inmunoprofilaxis pasiva en prematuros y cardiopatías congénitas de alto riesgo.\nIV. El uso de glucocorticoides sistémicos y broncodilatadores beta-2 adrenérgicos en nebulización continua rutinaria mejora comprobadamente la sobrevida en todos los lactantes.\n\n¿Cuáles son proposiciones VERDADERAS?",
        options: [
          "I, II y III",
          "Solo I y II",
          "II y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 0,
        explanation: "Enunciados I, II y III son VERDADEROS: VSR es un Pneumoviridae con proteína F que forma sincitios sinciciales histológicos y es la diana del anticuerpo profiláctico Palivizumab. El enunciado IV es FALSO según guías clínicas de la Academia Americana de Pediatría (AAP): los corticoides y broncodilatadores NO se recomiendan de rutina porque no modifican la evolución natural ni reducen hospitalizaciones; el manejo es soporte hídrico y oxigenoterapia."
      },
      {
        id: 'viro_8',
        question: "En relación al virus de la Rabia (género Lyssavirus, familia Rhabdoviridae):\n\nI. Posee una morfología distintiva en \"forma de bala\", cubierta membranosa y genoma de ARN monocatenario sentido negativo.\nII. Tras la inoculación percutánea por mordedura, se une al receptor nicotínico de acetilcolina en la unión neuromuscular y viaja al SNC mediante transporte retrógrado axonal rápido.\nIII. La presencia histopatológica de corpúsculos de Negri (inclusiones citoplasmáticas eosinófilas) en las neuronas piramidales del hipocampo y células de Purkinje del cerebelo es patognomónica.\nIV. Una vez que el paciente manifiesta síntomas neurológicos clínicos de rabia furiosa o paralítica, la letalidad es cercana al 100%.\n\nSon afirmaciones CORRECTAS:",
        options: [
          "Solo I y II",
          "I, II y IV",
          "II y III",
          "I, III y IV",
          "I, II, III y IV"
        ],
        correctIndex: 4,
        explanation: "Las 4 afirmaciones (I, II, III y IV) son CORRECTAS: El virus rábico tiene forma de proyectil de bala, viaja por transporte retrógrado (dineína) a 50-100 mm/día hasta el cerebro, genera corpúsculos de Negri y, una vez iniciados los síntomas neurológicos, la letalidad es prácticamente del 100% (haciendo vital la profilaxis posexposición inmediata antes del debut clínico)."
      }
    ]
  },
  {
    id: 'psiquiatria',
    title: "🧠 Psiquiatría Clínica & Salud Mental",
    subtitle: "Trastornos Afectivos, Psicosis, Urgencias Psiquiátricas y Psicofarmacología",
    badge: "Psiquiatría",
    badgeColor: '#8b5cf6',
    description: "Diagnóstico diferencial según criterios DSM-5 / CIE-11, manejo de psicosis, trastorno bipolar, trastornos de ansiedad, farmacocinética y toxicidad psicotrópica con casos e ítems I-IV.",
    questions: [
      {
        id: 'psiq_1',
        question: "Varón de 23 años es llevado a emergencias por sus familiares debido a un cambio drástico de conducta durante los últimos 6 días. Duerme solo 2 horas por noche sin experimentar fatiga, habla de forma acelerada e ininterrumpida (verborrea/presión del habla), ha solicitado préstamos bancarios para fundar una multinacional intergaláctica y afirma tener poderes telepáticos. Examen toxicológico de orina: negativo.\n\nDe acuerdo con los criterios del DSM-5 y la evidencia terapéutica en psiquiatría:\nI. El cuadro clínico cumple criterios de un Episodio Maníaco con características psicóticas congruentes con el estado de ánimo.\nII. La presencia de un único episodio maníaco completo en la vida del paciente es suficiente para establecer el diagnóstico definitivo de Trastorno Bipolar tipo I.\nIII. El tratamiento farmacológico agudo de primera línea incluye estabilizadores del ánimo (como litio o valproato) y/o antipsicóticos atípicos (antagonistas 5HT2A/D2).\nIV. La prescripción inmediata de monoterapia con antidepresivos inhibidores selectivos de la recaptación de serotonina (ISRS) es la conducta de elección para prevenir el viraje depresivo.\n\n¿Cuáles enunciados son VERDADEROS?",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son VERDADEROS: Cumple episodio maníaco (>= 1 semana o con hospitalización/psicosis), un solo episodio maníaco diagnostica Bipolar I, y se medica con litio/valproato o antipsicóticos. El enunciado IV es FALSO y un grave error clínico: la monoterapia con antidepresivos está formalmente CONTRAINDICADA en manía bipolar porque incrementa el riesgo de viraje maníaco, ciclación rápida y agitación psicomotriz."
      },
      {
        id: 'psiq_2',
        question: "Los psicofármacos modulan distintos sistemas de neurotransmisión cerebral (monoaminérgicos, gabaérgicos y glutamatérgicos).\n\nRelacione el principio activo psicotrópico con su mecanismo de acción farmacológico diana principal:\n1. Fluoxetina\n2. Venlafaxina\n3. Haloperidol\n4. Clozapina\n\na. Antagonista potente y selectivo de los receptores dopaminérgicos D2 en la vía mesolímbica\nb. Inhibidor selectivo de la recaptación de serotonina (ISRS) mediante bloqueo de la proteína transportadora SERT\nc. Antagonista multirreceptorial con afinidad predominante por 5-HT2A / D4 y bajo bloqueo D2 estriatal\nd. Inhibidor dual de la recaptación de serotonina y noradrenalina (IRSN) a dosis terapéuticas medias-altas",
        options: [
          "1-b, 2-d, 3-a, 4-c",
          "1-a, 2-b, 3-c, 4-d",
          "1-b, 2-a, 3-d, 4-c",
          "1-c, 2-d, 3-a, 4-b",
          "1-d, 2-c, 3-a, 4-b"
        ],
        correctIndex: 0,
        explanation: "La relación precisa es: 1-b (Fluoxetina bloquea SERT); 2-d (Venlafaxina es recaptador dual SERT y NET); 3-a (Haloperidol es antipsicótico de 1.ª generación con bloqueo D2 potente que causa síntomas extrapiramidales); 4-c (Clozapina es atípico de alta eficacia en esquizofrenia refractaria con bajo bloqueo D2 extrapiramidal pero riesgo de agranulocitosis)."
      },
      {
        id: 'psiq_3',
        question: "En el diagnóstico diferencial de las urgencias neuropsiquiátricas potencialmente mortales (Síndrome Neuroléptico Maligno vs. Síndrome Serotoninérgico):\n\nI. El Síndrome Neuroléptico Maligno (SNM) se asocia típicamente al uso de antagonistas dopaminérgicos y cursa con rigidez muscular extrapiramidal severa \"en tubo de plomo\" e hiporreflexia.\nII. El Síndrome Serotoninérgico se caracteriza por hiperactividad neuromuscular con hiperreflexia marcada, mioclonías y clonus inducible u ocular espontáneo.\nIII. En ambos síndromes puede presentarse hipertermia autonómica, diaforesis, inestabilidad hemodinámica y elevación de la creatina cinasa (CK).\nIV. El fármaco de elección específico para el tratamiento del síndrome serotoninérgico severo es el Dantroleno sódico en infusión intravenosa continua.\n\n¿Cuáles enunciados son CORRECTOS?",
        options: [
          "I, II y III",
          "Solo I y II",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 0,
        explanation: "Enunciados I, II y III son CORRECTOS: SNM cursa con bloqueo D2, rigidez cérea/tubo de plomo e hiporreflexia; el serotoninérgico se distingue por clonus e hiperreflexia por exceso de 5-HT; ambos presentan disautonomía. El enunciado IV es FALSO: el antagonista serotoninérgico específico de elección es la CIPROHEPTADINA; el Dantroleno y la Bromocriptina se utilizan clásicamente en el Síndrome Neuroléptico Maligno y la Hipertermia Maligna."
      },
      {
        id: 'psiq_4',
        question: "Respecto a los fundamentos neurobiológicos y criterios diagnósticos de la Esquizofrenia según el DSM-5:\n\nI. Los síntomas positivos (delirios, alucinaciones y pensamiento desorganizado) se correlacionan fisiopatológicamente con hiperactividad dopaminérgica en la vía mesolímbica.\nII. Los síntomas negativos (abulia, aplanamiento afectivo, alogia, anhedonia) se asocian a hipofunción dopaminérgica en la corteza prefrontal (vía mesocortical).\nIII. El criterio temporal exige una duración continua de los signos de alteración durante al menos 6 meses, incluyendo al menos 1 mes de síntomas de fase activa.\nIV. Las alucinaciones visuales y táctiles lilliputienses son el síntoma patognomónico y más frecuente de la esquizofrenia de inicio juvenil.\n\nSon proposiciones VERDADERAS:",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I, III y IV",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son VERDADEROS: La hipótesis dopaminérgica dual postula exceso D2 mesolímbico para síntomas positivos y déficit mesocortical para síntomas negativos; el criterio DSM-5 exige al menos 6 meses de disfunción global con 1 mes de síntomas activos. El enunciado IV es FALSO porque las alucinaciones más frecuentes y típicas son las AUDITIVAS en tercera persona (voces comentadoras/peyorativas); las visuales sugieren etiología orgánica/tóxica/delirium."
      },
      {
        id: 'psiq_5',
        question: "Mujer de 42 años presenta desde hace 5 semanas tristeza profunda la mayor parte del día, incapacidad para disfrutar de actividades placenteras (anhedonia), insomnio terminal con despertar precoz, pérdida del 7% del peso corporal, fatiga matutina extrema y sentimientos recurrentes de inutilidad y culpa excesiva.\n\nEn relación al Trastorno Depresivo Mayor (TDM) y su manejo:\nI. El diagnóstico de Episodio Depresivo Mayor exige la presencia de al menos 5 de los 9 criterios DSM-5 (regla mnemotécnica SIGECAPS) durante un periodo mínimo de 2 semanas, incluyendo obligatoriamente ánimo deprimido o anhedonia.\nII. La presencia de ideación suicida activa con plan estructurado o síntomas psicóticos delirantes en el contexto de catatonía refractaria constituye una indicación de primera línea para Terapia Electroconvulsiva (TEC).\nIII. Los inhibidores selectivos de la recaptación de serotonina (ISRS) alcanzan su pleno efecto antidepresivo terapéutico a las 2 a 4 horas de la primera dosis oral.\nIV. El mantenimiento de la terapia farmacológica antidepresiva se recomienda durante al menos 6 a 9 meses tras lograr la remisión sintomática del primer episodio.\n\n¿Cuáles afirmaciones son VERDADERAS?",
        options: [
          "Solo I y II",
          "I, II y IV",
          "II, III y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y IV son VERDADEROS: Se requieren >= 5 criterios por 2 semanas con desánimo o anhedonia cardinal; la TEC es segura y muy eficaz en alto riesgo suicida/catatonía/depresión psicótica; y el tratamiento debe mantenerse 6-9 meses para evitar recaídas precoces. El enunciado III es FALSO porque los ISRS tienen una latencia de respuesta de 2 a 4 SEMANAS (requiere desensibilización de autorreceptores somatodendríticos 5-HT1A e inducción de BDNF)."
      },
      {
        id: 'psiq_6',
        question: "En toxicología psiquiátrica y manejo de abstinencia, la intervención oportuna previene secuelas irreversibles.\n\nRelacione el cuadro clínico o toxicidad con su antídoto o intervención farmacológica específica:\n1. Intoxicación aguda por Benzodiacepinas con depresión respiratoria\n2. Sobredosis aguda por Opioides (coma y miosis puntiforme)\n3. Distonía aguda inducida por neurolépticos (crisis oculógiras o tortícolis)\n4. Delirium Tremens por síndrome de abstinencia alcohólica grave\n\na. Naloxona parenteral (antagonista competitivo puro de receptores opioides mu)\nb. Biperideno o difenhidramina (anticolinérgico antimuscarínico central)\nc. Benzodiacepinas de vida media larga (Diazepam o Lorazepam) en titulación intravenosa\nd. Flumazenilo (antagonista competitivo del receptor GABA-A)",
        options: [
          "1-d, 2-a, 3-b, 4-c",
          "1-a, 2-d, 3-c, 4-b",
          "1-d, 2-c, 3-b, 4-a",
          "1-c, 2-a, 3-d, 4-b",
          "1-b, 2-a, 3-d, 4-c"
        ],
        correctIndex: 0,
        explanation: "La relación precisa es: 1-d (Flumazenilo revierte benzodiacepinas); 2-a (Naloxona revierte intoxicación por opioides); 3-b (Biperideno o Difenhidramina restablece el balance dopamina/acetilcolina estriatal resolviendo la distonía aguda); 4-c (Benzodiacepinas son el estándar para prevenir convulsiones y controlar el Delirium Tremens)."
      },
      {
        id: 'psiq_7',
        question: "Mujer de 29 años sin antecedentes médicos acude a emergencias por tercera vez en el mes manifestando sensación súbita de muerte inminente, palpitaciones, opresión torácica, parestesias peribucales, temblor y sensación de asfixia que alcanzan su máxima intensidad en 8 minutos y remiten a la media hora. El electrocardiograma, enzimas cardíacas y perfil tiroideo son estrictamente normales. Refiere miedo persistente a sufrir otro ataque (ansiedad anticipatoria).\n\nEn relación al Trastorno de Pánico (Trastorno de Angustia):\nI. Se diagnostica ante la presencia de crisis de angustia imprevistas y recurrentes seguidas de al menos 1 mes de inquietud constante por nuevos ataques o cambios desadaptativos de conducta.\nII. El tratamiento farmacológico de mantenimiento y primera línea de elección son los antidepresivos ISRS (ej. Sertralina, Escitalopram) o IRSN.\nIII. Durante el periodo de latencia inicial de los ISRS, se puede asociar temporalmente una benzodiacepina a dosis bajas para control de síntomas agudos durante 2 a 4 semanas.\nIV. La Terapia Cognitivo-Conductual (TCC) con reestructuración cognitiva y exposición interoceptiva carece de respaldo científico en comparación con el placebo.\n\n¿Cuáles enunciados son VERDADEROS?",
        options: [
          "Solo I y II",
          "I, II y III",
          "II y IV",
          "I y III",
          "Todas son correctas"
        ],
        correctIndex: 1,
        explanation: "Enunciados I, II y III son VERDADEROS: Se define por ataques inesperados con >= 1 mes de ansiedad anticipatoria o evitación fóbica; el tratamiento base son los ISRS/IRSN; y se pueden pautar benzodiacepinas en puente breve inicial. El enunciado IV es FALSO: la Terapia Cognitivo-Conductual es la psicoterapia con el más alto nivel de evidencia (nivel 1A) para el trastorno de pánico, con eficacia comparable a la farmacoterapia."
      },
      {
        id: 'psiq_8',
        question: "El Carbonato de Litio continúa siendo el estabilizador del estado de ánimo con mayor evidencia para la prevención de recurrencias afectivas y reducción del riesgo suicida en el Trastorno Bipolar.\n\nEn relación a la farmacocinética, monitorización y toxicidad del Litio:\nI. Su estrecho margen terapéutico requiere la monitorización estricta de la litemia plasmática en ayunas (habitualmente entre 0.6 y 1.2 mEq/L en fase de mantenimiento).\nII. Los antiinflamatorios no esteroideos (AINEs como ibuprofeno), los diuréticos tiazídicos y los inhibidores de la ECA reducen el aclaramiento renal del litio, incrementando drásticamente el riesgo de intoxicación grave.\nIII. La administración prolongada de litio se asocia a efectos adversos endocrinos y renales, destacando el hipotiroidismo primario y la diabetes insípida nefrogénica.\nIV. El temblor intencional grosero, la ataxia cerebelosa, la disartria y la confusión mental progresiva son signos característicos de intoxicación aguda por litio (litemia > 2.0 mEq/L).\n\n¿Cuáles afirmaciones son CORRECTAS?",
        options: [
          "Solo I y II",
          "I, II y IV",
          "II y III",
          "I, III y IV",
          "I, II, III y IV"
        ],
        correctIndex: 4,
        explanation: "Las 4 afirmaciones (I, II, III y IV) son CORRECTAS: El litio tiene rango terapéutico estrecho (0.6 - 1.2 mEq/L); los fármacos que disminuyen la volemia o filtración renal (AINEs, tiazidas, IECA) retienen litio en túbulo proximal elevando su toxicidad; produce hipotiroidismo y diabetes insípida nefrogénica (bloqueo de acuaporina-2 mediada por ADH); y los signos neurológicos cerebelosos alertan sobre toxicidad grave (>2.0 mEq/L) que puede requerir hemodiálisis."
      }
    ]
  }
];
