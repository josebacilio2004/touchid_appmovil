# ESPECIFICACIÓN TÉCNICA INTEGRAL DEL SISTEMA TOUCHID
**Versión:** 2.4.0 (Build 2026-10)  
**Ecosistema:** Mobile App (Flutter) | Backend Gateway (Node.js/Express) | Web Dashboard (Vite) | Chrome Extension (MV3)  
**Propósito:** Documento de Arquitectura, Ingeniería Inversa de Flujos, Telemetría y Motores de IA para Auditoría y Optimización con Modelos de Razonamiento Profundo (Gemini 4 Argon).

---

## 1. RESUMEN EJECUTIVO Y FILOSOFÍA DE DISEÑO

**TouchID** es un ecosistema de asistencia académica y resolución automatizada de evaluaciones en tiempo real diseñado bajo el principio de **Ultra-Sigilo Operativo (Stealth-First)** e **Indetectabilidad Forense**. 

El sistema opera encapsulado dentro de una réplica visual 1:1 de **Google Chrome Mobile** (Android/iOS) y extensiones de escritorio. Ante cualquier inspección física o supervisión remota, la aplicación se comporta como un navegador web estándar con pestañas reales, modo incógnito, historial, descargas y marcadores. 

En segundo plano, un motor de extracción heurística del DOM analiza la estructura de exámenes en plataformas educativas (ej. **UDABOL / Backbone.js**, Moodle, Canvas, Google Forms, Balotarios MTC), extrae el contenido semántico de preguntas con opciones y las resuelve mediante modelos multimodales de última generación (Google Gemini), inyectando la respuesta directamente en los elementos nativos del DOM (auto-marcado) y transmitiendo retroalimentación exclusivamente por pulsos hápticos (vibración física imperceptible a la vista) sin desplegar modales, banners ni elementos visuales sospechosos en pantalla.

---

## 2. ARQUITECTURA GENERAL DEL SISTEMA

```
+-----------------------------------------------------------------------------------+
|                              DISPOSITIVO DEL USUARIO                              |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                       FLUTTER SHELL (MOBILE_APP)                          |   |
|   |  - Disfraz 1:1 Google Chrome Mobile (Pestañas, Incógnito, Historial)      |   |
|   |  - Interceptores Nativos JS: window.confirm, alert, prompt (Chrome Dark)   |   |
|   |  - Pull-to-Refresh Nativo (webview_refresher sincronizado con SPA)        |   |
|   |  - Botón Discreto / Disparador Táctil TouchID + Feedback Háptico          |   |
|   |                                                                           |   |
|   |   +-------------------------------------------------------------------+   |   |
|   |   |               WEBVIEW ENGINE (Android / iOS WebKit)               |   |   |
|   |   |   Plataforma Evaluativa (virtual.udabol.edu.bo / Moodle / etc.)   |   |   |
|   |   |                                                                   |   |   |
|   |   |   [Injected JS: QuizExtractorService.dart]                        |   |   |
|   |   |     * Detección Heurística Multi-Estrategia (Radios, Checks, Sel) |   |   |
|   |   |     * Sanitización Anti-Cabeceras & Captura de Imágenes           |   |   |
|   |   |     * Auto-Marcado Simulado con Eventos Touch / Pointer / Change  |   |   |
|   |   +---------------------------------+---------------------------------+   |   |
|   +-------------------------------------|-------------------------------------+   |
+-----------------------------------------|-----------------------------------------+
                                          |
                        HTTPS POST /solve | (Payload JSON limpio + Telemetría)
                                          v
+-----------------------------------------------------------------------------------+
|                        BACKEND GATEWAY (Node.js / Express)                        |
|                                Hosteado en Render                                 |
|                                                                                   |
|  - Control de Autenticación, Cuotas y Créditos (Usuarios Ilimitados / Licencias)  |
|  - Filtro y Normalización de Cabeceras Fantasma (Anti-Bogus Questions)            |
|  - Clasificador Heurístico de Dominio (MTC, Medicina/Anatomía/Fisiología, General)|
|  - Inyección de System Instructions & Schemas JSON Estrictos                      |
|  - Orquestador con Fallback Dinámico a Google Generative AI API                  |
|  - Ingesta Incondicional de Telemetría DOM y Registro en Base de Datos            |
+-----------------------------------------+-----------------------------------------+
                                          |
                  +-----------------------+-----------------------+
                  |                                               |
                  v                                               v
+-----------------------------------+           +-----------------------------------+
|       MONGODB CLOUD DATABASE      |           |     GOOGLE GEMINI REST API        |
|  - users (créditos y accesos)     |           |  - gemini-2.0-flash               |
|  - audit_history (resoluciones)   |           |  - gemini-1.5-pro / flash         |
|  - dom_inspections (telemetría)   |           |  - Thinking Config (Planificado)  |
|  - question_bank (caché y banco)  |           |  - Salida Estricta en JSON        |
+-----------------------------------+           +-----------------------------------+
                  ^
                  |
+-----------------+-----------------------------------------------------------------+
|                       WEB DASHBOARD & SIMULADOR (docs / GitHub Pages)             |
|  - Monitor en Vivo (Live Feed) de preguntas resueltas                             |
|  - Visor Forense de Inspecciones DOM (HTML crudo y selectores fallidos)           |
|  - Generador de Licencias y Administrador de Créditos                             |
|  - Simulador de Exámenes (quiz.html) con prueba de modales Android Dark vs iOS    |
+-----------------------------------------------------------------------------------+
```

---

## 3. DESGLOSE DE COMPONENTES DEL ECOSISTEMA

### 3.1. Aplicación Móvil (`mobile_app` - Flutter / Dart)
* **Disfraz Chrome:** Clona minuciosamente toda la interfaz de Google Chrome Mobile:
  * `browser_screen.dart` (3,350+ líneas): Núcleo del navegador, gestión de pestañas (`ChromeTabSwitcherScreen`), modo incógnito real con icono temático (`incognito_icon.dart`), descargas (`ChromeDownloadsScreen`), marcadores (`ChromeBookmarksScreen`), historial (`ChromeHistoryScreen`), configuración (`ChromeSettingsScreen`) y diálogo para añadir accesos directos.
* **Interfaz de Confirmación Interceptada (Chrome Dark Material 3):**
  * Solución a la ausencia de diálogos en iOS y el diseño arcaico en Android.
  * Interceptores nativos: `setOnJavaScriptConfirmDialog`, `setOnJavaScriptAlertDialog`, `setOnJavaScriptTextInputDialog`.
  * Renderiza un modal réplica exacta con fondo `#2B2D30`, bordes redondeados a 28px, título dinámico `[host] dice` y botones en azul Google `#A8C7FA`.
* **Mecanismo de Deslizamiento (Pull-to-Refresh):**
  * Integración de `webview_refresher: ^0.2.0` con `RefreshIndicator` adaptativo (`#8AB4F8`), eliminando botones estáticos sospechosos en la barra superior.
* **Disparador Sigiloso y Feedback Háptico:**
  * Botón TouchID circular semi-transparente, reubicable o completamente invisible.
  * Al pulsar: emite `HapticFeedback.lightImpact()` instantáneo.
  * En éxito de auto-marcado: emite un pulso háptico ligero (confirmación en la mano del usuario).
  * En fallo: emite doble vibración de error silenciosa (`_hapticErrorFeedback()`).
  * **Cero avisos visuales:** No existen SnackBars, banners ni cuadros de diálogo durante el examen.

### 3.2. Motor de Extracción y Auto-Marcado DOM (`QuizExtractorService.dart`)
Inyecta un script JavaScript autónomo y tolerante a aplicaciones de página única (SPA / Backbone.js) con hasta 4 reintentos a intervalos de 300 ms:
1. **Estrategia A (Radios):** Agrupa inputs de tipo `radio` por su atributo `name` o por cercanía en contenedores semánticos (`form`, `fieldset`, `[class*="pregunta"]`, `.col-sm-6`, `tr`).
2. **Estrategia B (Checkboxes):** Extrae preguntas de selección múltiple con opciones compuestas.
3. **Estrategia C (Selects):** Mapea elementos `<select>` con `<option>`.
4. **Estrategia D (Abiertas):** Identifica `<textarea>` y campos de desarrollo.
5. **Sanitización Heurística:** Filtra cabeceras institucionales accidentales (`CARPETA PEDAGÓGICA`, `UDABOL`, nombres de usuario) para evitar falsos positivos en el enunciado.
6. **Extracción de Medios:** Localiza y codifica imágenes (`<img>`, fondos CSS) asociadas al bloque de la pregunta para enviarlas al modelo multimodal.
7. **Motor de Auto-Marcado (`autoMarkOption`):**
   * *Nivel 1 (Semántico):* Localiza la opción coincidente por texto exacto o normalizado.
   * *Nivel 2 (Posicional):* Selecciona por índice relativo (A=0, B=1, C=2, etc.).
   * *Nivel 3 (Simulación de Usuario):* Para engañar listeners anti-trampa que detectan cambios programáticos (`elem.checked = true`), despacha una secuencia completa de eventos de hardware: `focus`, `pointerdown`, `mousedown`, `click`, `change`, `input` y `blur`, tanto sobre el input como sobre su `<label>`.

### 3.3. Pasarela de Backend (`touchid-backend` - Node.js / Express / Render)
* **Gestión de Sesión y Monetización:** Verificación de `userId`, saldo de créditos, planes ilimitados y activación de licencias criptográficas de uso.
* **Control de Enunciados Fantasma:** Segunda barrera regex en servidor para rescate de preguntas mal segmentadas por el frontend.
* **Clasificador Heurístico de Dominio:**
  * *MTC:* Aplica reglamento oficial de tránsito peruano y balotario del MTC.
  * *Médico de Élite:* Activa perito en Fisiología, Anatomía, Embriología, Farmacología, ENAM y MIR.
  * *General:* Evaluador académico universitario.
* **Auditoría Forense y Telemetría:** Registra en MongoDB el HTML crudo, ruta del DOM, selectores coincidentes y detalles de fallo cuando la extracción no logra el 100% de confianza.

### 3.4. Tablero de Control y Simulador Web (`web_dashboard`)
* Desarrollado en Vite + Vanilla JS / CSS Glassmorphism.
* Incluye monitor en tiempo real de preguntas resueltas por los alumnos, gestión granular de créditos, visor de árboles DOM con fallas y el simulador `quiz.html` para validar la extracción sobre plataformas tipo UDABOL en vivo.

---

## 4. FLUJO DE DATOS EXTREMO A EXTREMO (END-TO-END)

```
[Usuario presiona TouchID invisible]
                  │
                  ▼
[Dart: QuizExtractorService.extractQuiz()]
                  │ (Ejecuta JS inyectado en WebView)
                  ▼
[JS DOM Engine: Identifica pregunta, opciones, imágenes y limpia cabeceras]
                  │
                  ▼
[Dart: QuizAiService.solveQuestion()]
                  │ (HTTP POST con timeout de 40s)
                  ▼
[Backend: server.js -> /solve]
                  │
  ┌───────────────┴───────────────┐
  ▼                               ▼
[Verificación de Créditos]      [Clasificación Heurística de Materia]
  │                               │
  └───────────────┬───────────────┘
                  ▼
[Construcción de Prompt Estructurado + System Instruction + JSON Schema]
                  │
                  ▼
[Google Gemini API: generateContent (Fallback en cascada)]
                  │
                  ▼
[Parseo y Validación Estricta de Respuesta JSON]
                  │
                  ▼
[Backend: Deducción de créditos + Auditoría en MongoDB]
                  │
                  ▼
[Retorno a Mobile App: { answer: 'C', answerText: '...', explanation: '...' }]
                  │
                  ▼
[Dart: QuizExtractorService.autoMarkOption()]
                  │ (Despacha Pointer/Mouse/Click/Change events al DOM)
                  ▼
[Elemento queda marcado en el examen web]
                  │
                  ▼
[Feedback Háptico: 1 pulso ligero en la mano del usuario]
                  │
                  ▼
[Telemetría asíncrona enviada al Dashboard para auditoría forense]
```

---

## 5. DIAGNÓSTICO DE PUNTOS CRÍTICOS Y LIMITACIONES ACTUALES

A pesar de la alta estabilidad en la extracción del DOM y el éxito del camuflaje visual, se han identificado las siguientes oportunidades de mejora técnica:

### 5.1. Cuello de Botella en Preguntas de Patrón Compuesto (K-Type)
* **El Problema:** En exámenes médicos de alta exigencia (ej. Anatomía Humana), las preguntas utilizan patrones de respuesta como:
  > *"A si 1, 2 y 3 son verdaderas; B si 2, 3 y 4 son verdaderas; C si 2 y 3 son verdaderas; D si 1 y 4 son verdaderas; E si todos son falsos o verdaderos"*.
* **Causa Raíz:** El modelo de IA recibe la pregunta y todas las alternativas en un solo bloque con `temperature: 0.0`. Al no contar con una cadena de pensamiento explícita forzada, evalúa simultáneamente las 4 proposiciones microanatómicas. Si el modelo tiene un 80% de certeza en cada proposición individual, la probabilidad compuesta de acertar la combinación completa cae a:
  $$P_{éxito} = (0.80)^4 \approx 0.4096 \quad (40.9\%)$$
  Esto explica resultados como **24 puntos sobre 60**. Ante la duda en una sola proposición, el modelo tiende a colapsar en la opción comodín ("E: Todos son falsos o verdaderos").

### 5.2. Desfase en Modelos del Backend (Fallback Inexistente)
* En `touchid-backend/server.js`, la lista de modelos configurada contiene:
  ```javascript
  const models = [
    'gemini-2.5-flash',       // Inexistente / Mock
    'gemini-2.0-flash',       // Oficial activo
    'gemini-2.5-flash-lite',  // Inexistente
    'gemini-flash-latest',    // Alias legacy
    'gemini-3.1-flash-lite',  // Inexistente
    'gemini-1.5-flash'        // Fallback estable
  ];
  ```
  Esto genera llamadas HTTP fallidas (códigos 404/400) que consumen entre 400 ms y 1200 ms de latencia innecesaria antes de llegar a un modelo válido.

### 5.3. Ausencia de Caché Semántico y Banco de Preguntas Local
* Si dos o más estudiantes realizan el mismo examen simultáneamente o si un estudiante navega entre preguntas hacia adelante y atrás, el sistema realiza llamadas redundantes a la API de Gemini, consumiendo créditos y aumentando la latencia en lugar de resolver en < 50 ms mediante un hash semántico del enunciado.

### 5.4. Dependencia de Marcado Unidireccional
* Si la plataforma educativa bloquea la selección programática mediante scripts de seguridad específicos o capas superpuestas transparentes (`z-index`), el sistema actualmente reporta éxito o falla por telemetría, pero no dispone de un mecanismo de asistencia secundaria como feedback háptico codificado en código Morse (ej. 1 pulso = A, 2 pulsos = B, 3 pulsos = C, 4 pulsos = D) para que el estudiante pueda marcar manualmente sin mirar la pantalla.

---

## 6. PROMPT MAESTRO PARA GEMINI 4 ARGON (GOOGLE WEB GEMINI)

Copia y pega el siguiente bloque completo directamente en la interfaz web de Gemini para que **Argon** asuma el rol de Arquitecto Jefe de Sistemas e IA y genere el plan maestro de optimización:

```text
ROL Y CONTEXTO DE MISIÓN:
Actúa como Arquitecto de Software Principal e Investigador de Inteligencia Artificial de Élite especializado en sistemas embebidos de alta concurrencia, evasión de telemetría forense, ingeniería inversa de DOM y arquitecturas LLM/SLM de razonamiento avanzado (Reasoning & Chain-of-Thought).

OBJETIVO:
Vas a analizar minuciosamente el documento de arquitectura técnica adjunto correspondiente al ecosistema "TouchID" (un sistema ultra-sigiloso en Flutter, Node.js y Google Gemini para extracción y resolución en tiempo real de cuestionarios universitarios complejos tipo UDABOL/Moodle).

Tu misión es realizar una auditoría integral, identificar debilidades críticas en la arquitectura actual y diseñar un documento Markdown exhaustivo ("TOUCHID_NEXTGEN_SPEC.md") que proponga mejoras arquitectónicas, algorítmicas y de ingeniería de prompts para llevar la tasa de acierto en materias de alta complejidad médica (Anatomía, Embriología, Infectología) al 98-100%, reducir la latencia de resolución a menos de 800 ms y blindar el sistema contra cualquier mecanismo de detección web.

EJES OBLIGATORIOS DE ANÁLISIS Y PROPUESTA:

1. MOTOR DE RAZONAMIENTO PROPOSICIONAL (K-TYPE SOLVER ENGINE):
   - Diseña el protocolo algorítmico y de prompt exacto para resolver preguntas con patrón de respuestas combinadas (A si 1,2,3; B si 2,3,4; etc.).
   - Modela la descomposición de la pregunta en proposiciones atómicas {P1, P2, P3, P4}, la evaluación booleana aislada con matriz de verdad y la correspondencia matemática unívoca contra las alternativas.
   - Especifica la integración con `thinkingConfig` (presupuesto de tokens de razonamiento) en la suite oficial de Gemini 2.0 (ej. gemini-2.0-flash-thinking-exp-01-21 y gemini-2.0-flash).

2. ORQUESTACIÓN Y LATENCIA EN BACKEND:
   - Corrige la lista de modelos de fallback eliminando modelos ficticios y ordenando por latencia/calidad real.
   - Propón una arquitectura de Caché Semántico en Memoria/Redis/MongoDB para respuestas idénticas en exámenes grupales concurrentes.
   - Diseña un mecanismo de "Early Exit / Speculative Execution" para responder en milisegundos.

3. MOTOR DE EXTRACCIÓN DOM Y AUTO-MARCADO A PRUEBA DE CHEAT-DETECTION:
   - Analiza el script de extracción actual. ¿Qué vectores de detección por eventos de navegador (trusted vs synthetic events, isTrusted=false) podrían implementar plataformas como Moodle o Respondus?
   - Propón mejoras en la simulación de eventos humanos para que el auto-marcado sea indistinguible del dedo humano.
   - Diseña un mecanismo de contingencia: si el auto-marcado falla, cómo transmitir la respuesta al usuario mediante vibración háptica codificada (ej. pulsos táctiles discretos para A, B, C, D, E).

4. PROMPTS DE DOMINIO ULTRA-DENSOS:
   - Formula los prompts definitivos del sistema para:
     a) Infectología y Medicina Tropical (Microbiología, vectores, ciclos biológicos, esquemas terapéuticos).
     b) Embriología II (Capas germinativas, derivados de crestas neurales, organogénesis, cronología embrionaria, anomalías congénitas).
     c) Anatomía Humana y Neuroanatomía (Vascularización, vías de conducción, relaciones topográficas, pares craneales).

5. FORMATO DE ENTREGA REQUERIDO:
Entrega tu respuesta estructurada como un documento técnico Markdown profesional, listo para producción, con bloques de código, diagramas Mermaid, tablas comparativas y la justificación matemática/técnica de cada mejora sugerida.
```

---

## 7. MATRIZ DE CONFIGURACIÓN Y MODELOS RECOMENDADOS (REFERENCIA INICIAL)

| Componente | Configuración Actual | Configuración Propuesta para Gemini 4 Argon |
| :--- | :--- | :--- |
| **Modelo Primario** | `gemini-2.5-flash` (Ficticio / Error 404) | `gemini-2.0-flash` (Producción oficial, baja latencia) |
| **Modelo de Razonamiento** | Ninguno (Single-pass directo) | `gemini-2.0-flash-thinking-exp-01-21` (`thinkingBudget: 2048`) |
| **Modelo Fallback 1** | `gemini-flash-latest` (Genérico) | `gemini-1.5-pro` (Para preguntas con imágenes complejas) |
| **Modelo Fallback 2** | `gemini-1.5-flash` | `gemini-1.5-flash-8b` (Máxima velocidad de respaldo) |
| **Temperatura** | 0.0 - 0.1 | 0.0 (Determinismo puro en exámenes) |
| **Esquema de Salida** | JSON Object no tipado | JSON Schema estructurado con `responseSchema` estricto |
| **Manejo K-Type** | No estructurado (acumulación de error) | Pipeline de Descomposición Proposicional Booleana ($P_1..P_n$) |
| **Feedback de Fallo** | Silencio en UI (Log en telemetría) | Silencio en UI + Código Háptico Morse de respaldo |

---
*Fin de la Especificación Técnica. Archivo listo para ser analizado por Gemini 4 Argon.*
