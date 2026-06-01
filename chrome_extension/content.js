// Content Script - TouchID Questionnaire Solver

(function () {
  // Evitar doble inyección
  if (window.hasOwnProperty('__touchIdLoaded')) return;
  window.__touchIdLoaded = true;

  // Variables globales de configuración
  let GEMINI_API_KEY = '';
  let FIREBASE_PROJECT_ID = 'touchid-forms-jose-2026'; // Valor por defecto
  let SYSTEM_PROMPT = 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.';

  // Cargar configuración desde el almacenamiento de Chrome
  function loadConfig() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['geminiApiKey', 'firebaseProjectId', 'systemPrompt'], function (items) {
        if (items.geminiApiKey) GEMINI_API_KEY = items.geminiApiKey;
        if (items.firebaseProjectId) FIREBASE_PROJECT_ID = items.firebaseProjectId;
        if (items.systemPrompt) SYSTEM_PROMPT = items.systemPrompt;
      });
    }
  }
  loadConfig();

  // Escuchar cambios de configuración
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.action === 'configUpdated') {
        loadConfig();
        sendResponse({ status: 'updated' });
      }
    });
  }

  // UI Elements
  let floatBtn = null;
  let responseCard = null;

  // Crear e inyectar el botón circular flotante
  function createUI() {
    // Botón circular flotante
    floatBtn = document.createElement('div');
    floatBtn.className = 'touchid-float-btn';
    floatBtn.title = 'Resolver cuestionario (TouchID)';
    document.body.appendChild(floatBtn);

    // Tarjeta de respuestas
    responseCard = document.createElement('div');
    responseCard.className = 'touchid-response-card';
    responseCard.innerHTML = `
      <div class="touchid-card-header">
        <div class="touchid-card-title">
          <span class="touchid-card-subject">Cargando...</span>
        </div>
        <button class="touchid-card-close">&times;</button>
      </div>
      <div class="touchid-card-question" id="touchid-q-text"></div>
      <div class="touchid-card-answer-box">
        <div class="touchid-card-answer-label">Respuesta sugerida</div>
        <div class="touchid-card-answer-val" id="touchid-a-text"></div>
      </div>
      <div class="touchid-card-explanation-label">Explicación</div>
      <div class="touchid-card-explanation-val" id="touchid-exp-text"></div>
      <div class="touchid-card-footer">
        <div class="touchid-sync-indicator" id="touchid-sync-status">
          <span class="touchid-sync-dot"></span>
          <span id="touchid-sync-text">Sincronizado</span>
        </div>
        <span>TouchID v1.0</span>
      </div>
    `;
    document.body.appendChild(responseCard);

    // Eventos
    floatBtn.addEventListener('click', handleTouchClick);
    responseCard.querySelector('.touchid-card-close').addEventListener('click', hideCard);

    // Hacer el botón arrastrable con eventos de mouse y touch (discreto)
    setupDraggable(floatBtn);
  }

  function setupDraggable(element) {
    let isDragging = false;
    let startX, startY, initialLeft, initialRight, initialBottom;
    let dragThreshold = 5;
    let hasDragged = false;

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: true });

    function dragStart(e) {
      hasDragged = false;
      const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

      startX = clientX;
      startY = clientY;

      const rect = element.getBoundingClientRect();
      initialRight = window.innerWidth - rect.right;
      initialBottom = window.innerHeight - rect.bottom;

      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchmove', dragMove, { passive: false });
      document.addEventListener('touchend', dragEnd);
    }

    function dragMove(e) {
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

      const deltaX = startX - clientX;
      const deltaY = startY - clientY;

      if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
        isDragging = true;
        hasDragged = true;
        
        if (e.type === 'touchmove') e.preventDefault(); // Evitar scroll
        
        const newRight = initialRight + deltaX;
        const newBottom = initialBottom + deltaY;

        element.style.right = `${Math.max(10, Math.min(window.innerWidth - 50, newRight))}px`;
        element.style.bottom = `${Math.max(10, Math.min(window.innerHeight - 50, newBottom))}px`;
      }
    }

    function dragEnd() {
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('touchend', dragEnd);
      
      setTimeout(() => { isDragging = false; }, 50);
    }

    // Interceptar el clic si se arrastró
    element.addEventListener('click', function(e) {
      if (hasDragged) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);
  }

  function showCard(questionText, answerText, explanationText, subject, syncState = 'synced') {
    responseCard.querySelector('#touchid-q-text').textContent = questionText;
    responseCard.querySelector('#touchid-a-text').textContent = answerText;
    responseCard.querySelector('#touchid-exp-text').textContent = explanationText;
    
    const subjectEl = responseCard.querySelector('.touchid-card-subject');
    subjectEl.textContent = subject || 'General';

    const syncIndicator = responseCard.querySelector('#touchid-sync-status');
    const syncText = responseCard.querySelector('#touchid-sync-text');
    
    if (syncState === 'syncing') {
      syncIndicator.className = 'touchid-sync-indicator syncing';
      syncText.textContent = 'Guardando en la nube...';
    } else if (syncState === 'synced') {
      syncIndicator.className = 'touchid-sync-indicator';
      syncText.textContent = 'Sincronizado';
    } else {
      syncIndicator.className = 'touchid-sync-indicator syncing';
      syncIndicator.style.color = '#ef4444';
      syncText.textContent = 'Error de Sinc.';
    }

    responseCard.classList.add('visible');
  }

  function hideCard() {
    responseCard.classList.remove('visible');
  }

  // Algoritmo de raspado inteligente del DOM
  function scrapeQuestionnaire() {
    const questions = [];
    
    // Remover resaltados previos
    document.querySelectorAll('.touchid-highlight-option').forEach(el => {
      el.classList.remove('touchid-highlight-option');
    });

    // Enfoque 1: Agrupar inputs de tipo radio o checkbox por nombre
    const radioInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    const groups = {};

    radioInputs.forEach(input => {
      const name = input.name || input.id || 'unnamed-group';
      // Buscar el contenedor común más cercano (por ejemplo, div o fieldset)
      let container = input.closest('fieldset, .question, .question-card, [class*="question"], [class*="cuestion"], [id*="question"]');
      if (!container) {
        container = input.parentElement?.parentElement || input.parentElement;
      }
      
      const containerId = container.getAttribute('data-touch-qid') || 'q_' + Math.random().toString(36).substring(2, 9);
      if (!container.hasAttribute('data-touch-qid')) {
        container.setAttribute('data-touch-qid', containerId);
      }

      if (!groups[containerId]) {
        groups[containerId] = {
          container: container,
          inputs: [],
          name: name
        };
      }
      groups[containerId].inputs.push(input);
    });

    // Procesar cada grupo como una pregunta
    Object.keys(groups).forEach(containerId => {
      const group = groups[containerId];
      const container = group.container;
      const inputs = group.inputs;

      // Obtener el texto del contenedor (excluyendo el texto de las opciones para no mezclar)
      let fullText = container.innerText || container.textContent || '';
      
      // Intentar obtener el texto de cada opción
      const options = [];
      const optionElements = [];

      inputs.forEach((input, index) => {
        // Encontrar la etiqueta (label) asociada con este input
        let labelEl = null;
        if (input.id) {
          labelEl = document.querySelector(`label[for="${input.id}"]`);
        }
        if (!labelEl) {
          labelEl = input.closest('label'); // A veces el input está dentro del label
        }
        if (!labelEl) {
          // Si no hay label, buscar el texto hermano inmediato
          let sibling = input.nextSibling;
          let text = '';
          while (sibling) {
            if (sibling.nodeType === 3) { // Text node
              text += sibling.nodeValue.trim();
            } else if (sibling.nodeType === 1 && !['input', 'br'].includes(sibling.tagName.toLowerCase())) {
              break;
            }
            sibling = sibling.nextSibling;
          }
          if (text) {
            // Crear un envoltorio temporal para poder resaltar
            const wrapper = document.createElement('span');
            input.parentNode.insertBefore(wrapper, input.nextSibling);
            wrapper.appendChild(document.createTextNode(text));
            labelEl = wrapper;
          }
        }

        if (labelEl) {
          const optionText = labelEl.innerText || labelEl.textContent || '';
          const cleanedText = optionText.trim();
          if (cleanedText) {
            options.push(cleanedText);
            const optId = `${containerId}_o_${index}`;
            labelEl.setAttribute('data-touch-oid', optId);
            optionElements.push(labelEl);
          }
        }
      });

      // Limpiar el texto de la pregunta quitando el texto de las opciones
      let questionText = fullText;
      options.forEach(opt => {
        questionText = questionText.replace(opt, '');
      });

      // Si el texto de la pregunta queda muy corto o vacío, intentar buscar un elemento de cabecera antes o dentro
      questionText = questionText.trim()
        .replace(/^[A-Za-z0-9]+\.\s+/, '') // Quitar números de pregunta como "1. "
        .replace(/\s+/g, ' ');

      if (questionText.length < 5) {
        // Intentar buscar un h1, h2, h3, h4, h5, h6 o elemento en negrita antes de los inputs
        const header = container.querySelector('h1, h2, h3, h4, h5, h6, p, .title, .question-title, strong');
        if (header) {
          questionText = header.innerText || header.textContent || '';
        }
      }

      if (questionText.length >= 5 && options.length >= 2) {
        questions.push({
          id: containerId,
          question: questionText,
          options: options,
          optionElements: optionElements,
          viewportCenterDistance: getViewportDistance(container)
        });
      }
    });

    // Enfoque 2: Si no hay inputs de opción múltiple, buscar elementos tipo A), B), C), D) en la página y sus contenedores
    if (questions.length === 0) {
      const allElements = document.querySelectorAll('div, button, span, li, p, label');
      const letterPatterns = [
        /^\s*A[\.\)]\s+/i,
        /^\s*B[\.\)]\s+/i,
        /^\s*C[\.\)]\s+/i,
        /^\s*D[\.\)]\s+/i,
        /^\s*E[\.\)]\s+/i,
        /^\s*F[\.\)]\s+/i
      ];
      
      const matchesByLetter = {A: [], B: [], C: [], D: [], E: [], F: []};
      
      allElements.forEach(el => {
        if (el.children.length > 2) return;
        const text = (el.innerText || el.textContent || '').trim();
        if (!text) return;
        
        if (letterPatterns[0].test(text)) matchesByLetter.A.push({el: el, text: text});
        else if (letterPatterns[1].test(text)) matchesByLetter.B.push({el: el, text: text});
        else if (letterPatterns[2].test(text)) matchesByLetter.C.push({el: el, text: text});
        else if (letterPatterns[3].test(text)) matchesByLetter.D.push({el: el, text: text});
        else if (letterPatterns[4].test(text)) matchesByLetter.E.push({el: el, text: text});
        else if (letterPatterns[5].test(text)) matchesByLetter.F.push({el: el, text: text});
      });
      
      if (matchesByLetter.A.length > 0 && matchesByLetter.B.length > 0) {
        const candidateA = matchesByLetter.A[0];
        const candidateB = matchesByLetter.B[0];
        const candidateC = matchesByLetter.C.length > 0 ? matchesByLetter.C[0] : null;
        const candidateD = matchesByLetter.D.length > 0 ? matchesByLetter.D[0] : null;
        const candidateE = matchesByLetter.E.length > 0 ? matchesByLetter.E[0] : null;
        const candidateF = matchesByLetter.F.length > 0 ? matchesByLetter.F[0] : null;
        
        const options = [candidateA.text, candidateB.text];
        const optionElements = [candidateA.el, candidateB.el];
        
        if (candidateC) { options.push(candidateC.text); optionElements.push(candidateC.el); }
        if (candidateD) { options.push(candidateD.text); optionElements.push(candidateD.el); }
        if (candidateE) { options.push(candidateE.text); optionElements.push(candidateE.el); }
        if (candidateF) { options.push(candidateF.text); optionElements.push(candidateF.el); }
        
        // Encontrar el contenedor común para extraer la pregunta
        let parent = candidateA.el.parentElement;
        while (parent && parent !== document.body) {
          if (parent.contains(candidateB.el)) {
            break;
          }
          parent = parent.parentElement;
        }
        
        if (parent) {
          let parentText = parent.innerText || parent.textContent || '';
          options.forEach(opt => {
            parentText = parentText.replace(opt, '');
          });
          
          let questionText = parentText.trim().replace(/\s+/g, ' ');
          
          const containerId = 'q_' + Math.random().toString(36).substring(2, 9);
          parent.setAttribute('data-touch-qid', containerId);
          
          optionElements.forEach((el, index) => {
            const optId = `${containerId}_o_${index}`;
            el.setAttribute('data-touch-oid', optId);
          });
          
          questions.push({
            id: containerId,
            question: questionText,
            options: options,
            optionElements: optionElements,
            viewportCenterDistance: getViewportDistance(parent)
          });
        }
      }
    }

    // Enfoque 3: Si todo lo anterior falla, usar el texto visible del viewport como pregunta libre
    if (questions.length === 0) {
      const visibleText = getVisibleTextFromViewport();
      if (visibleText && visibleText.length > 20) {
        questions.push({
          id: 'viewport_text',
          question: 'Pregunta en pantalla',
          options: [],
          rawText: visibleText,
          viewportCenterDistance: 0
        });
      }
    }

    return questions;
  }

  // Obtener distancia al centro del viewport para priorizar la pregunta activa
  function getViewportDistance(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    return Math.abs(viewportCenter - elementCenter);
  }

  // Obtener texto visible en el viewport
  function getVisibleTextFromViewport() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          const rect = node.parentElement.getBoundingClientRect();
          const isVisible = rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
          if (isVisible && node.nodeValue.trim().length > 0) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    let text = '';
    while(walker.nextNode()) {
      text += walker.currentNode.nodeValue.trim() + ' ';
    }
    return text.trim();
  }

  // Manejar el clic del botón
  async function handleTouchClick() {
    if (floatBtn.classList.contains('loading')) return;

    // Verificar si la API Key está configurada
    if (!GEMINI_API_KEY) {
      alert('Por favor, configura tu API Key de Gemini en las Opciones de la Extensión (clic derecho sobre el icono de la extensión -> Opciones).');
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      }
      return;
    }

    floatBtn.classList.add('loading');
    hideCard();

    try {
      const detectedQuestions = scrapeQuestionnaire();
      if (detectedQuestions.length === 0) {
        alert('No se detectaron preguntas de opción múltiple en la pantalla.');
        floatBtn.classList.remove('loading');
        return;
      }

      // Ordenar por cercanía al centro de la pantalla
      detectedQuestions.sort((a, b) => a.viewportCenterDistance - b.viewportCenterDistance);
      const activeQuestion = detectedQuestions[0];

      // Resolver usando Gemini
      const response = await queryGemini(activeQuestion);

      if (response && response.correct_option_index !== undefined) {
        // Mostrar en la tarjeta flotante
        showCard(
          activeQuestion.question || 'Pregunta Analizada',
          response.correct_option_text,
          response.explanation,
          response.subject,
          'syncing'
        );

        // Resaltar la opción correcta en el DOM si es posible
        if (activeQuestion.optionElements && activeQuestion.optionElements[response.correct_option_index]) {
          const elementToHighlight = activeQuestion.optionElements[response.correct_option_index];
          elementToHighlight.classList.add('touchid-highlight-option');
          // Scroll suave hacia el elemento resaltado
          elementToHighlight.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Sincronizar con Firestore en segundo plano
        syncToFirestore(activeQuestion, response);
      } else {
        alert('No se pudo determinar una respuesta confiable.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al resolver la pregunta: ' + err.message);
    } finally {
      floatBtn.classList.remove('loading');
    }
  }

  // Consultar la API de Gemini
  async function queryGemini(qData) {
    let prompt = '';
    if (qData.options && qData.options.length > 0) {
      prompt = `
Analiza la siguiente pregunta de opción múltiple y selecciona la opción correcta basándote en conocimientos científicos y académicos.

Pregunta:
"${qData.question}"

Opciones disponibles:
${qData.options.map((opt, i) => `${i}) ${opt}`).join('\n')}

Debes responder estrictamente en formato JSON utilizando el siguiente esquema:
{
  "correct_option_index": numero_entero_del_indice_de_la_opcion_correcta_comenzando_en_0,
  "correct_option_text": "texto exacto de la opción seleccionada",
  "explanation": "explicación concisa en español (máximo 2 líneas) de por qué es la respuesta correcta",
  "subject": "materia/disciplina del cuestionario (ej. Matemática, Historia, Programación, etc.)"
}
`;
    } else {
      prompt = `
Analiza el siguiente texto extraído de un cuestionario. Identifica la pregunta principal y la mejor respuesta basándote en conocimientos académicos.

Contenido del cuestionario:
"${qData.rawText}"

Debes responder estrictamente en formato JSON utilizando el siguiente esquema:
{
  "correct_option_index": -1,
  "correct_option_text": "Respuesta recomendada sintetizada",
  "explanation": "explicación concisa en español (máximo 2 líneas)",
  "subject": "materia/disciplina del cuestionario"
}
`;
    }

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT || 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.' }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            correct_option_index: { type: "INTEGER" },
            correct_option_text: { type: "STRING" },
            explanation: { type: "STRING" },
            subject: { type: "STRING" }
          },
          required: ["correct_option_index", "correct_option_text", "explanation", "subject"]
        }
      }
    };

    const models = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-2.0-flash-lite',
      'gemini-flash-latest'
    ];

    let lastError = null;

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (resultText) {
            return JSON.parse(resultText.trim());
          }
        } else {
          const errorText = await response.text();
          lastError = `API Gemini (${model}) falló con código ${response.status}: ${errorText}`;
        }
      } catch (e) {
        lastError = `Error con modelo ${model}: ${e.message || e}`;
      }
    }

    throw new Error(lastError || 'No se pudo conectar a la API de Gemini.');
  }

  // Sincronizar datos con Firestore REST API
  async function syncToFirestore(qData, responseData) {
    if (!FIREBASE_PROJECT_ID) return;

    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/history`;
    
    const payload = {
      fields: {
        question: { stringValue: qData.question || 'Pregunta sin título' },
        options: {
          arrayValue: {
            values: (qData.options || []).map(opt => ({ stringValue: opt }))
          }
        },
        answer: { stringValue: responseData.correct_option_text },
        answerIndex: { integerValue: responseData.correct_option_index },
        explanation: { stringValue: responseData.explanation },
        subject: { stringValue: responseData.subject || 'General' },
        timestamp: { timestampValue: new Date().toISOString() },
        source: { stringValue: 'chrome_extension' }
      }
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const syncTextEl = responseCard.querySelector('#touchid-sync-text');
      const syncIndicator = responseCard.querySelector('#touchid-sync-status');
      
      if (res.ok) {
        syncIndicator.className = 'touchid-sync-indicator';
        syncTextEl.textContent = 'Sincronizado con la nube';
      } else {
        console.error('Error al sincronizar con Firestore:', await res.text());
        syncIndicator.className = 'touchid-sync-indicator syncing';
        syncIndicator.style.color = '#ef4444';
        syncTextEl.textContent = 'Error al sincronizar';
      }
    } catch (err) {
      console.error('Error de red al sincronizar con Firestore:', err);
      const syncTextEl = responseCard.querySelector('#touchid-sync-text');
      const syncIndicator = responseCard.querySelector('#touchid-sync-status');
      syncIndicator.className = 'touchid-sync-indicator syncing';
      syncIndicator.style.color = '#ef4444';
      syncTextEl.textContent = 'Sin conexión';
    }
  }

  // Inicializar UI al cargar la página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUI);
  } else {
    createUI();
  }
})();
