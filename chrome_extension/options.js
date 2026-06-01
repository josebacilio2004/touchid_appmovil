// Options Script - TouchID Questionnaire Solver

document.addEventListener('DOMContentLoaded', function () {
  const apiKeyInput = document.getElementById('apiKey');
  const projectIdInput = document.getElementById('projectId');
  const systemPromptInput = document.getElementById('systemPrompt');
  const backendUrlInput = document.getElementById('backendUrl');
  const userIdInput = document.getElementById('userId');
  const copyUserIdBtn = document.getElementById('copyUserIdBtn');
  const saveBtn = document.getElementById('saveBtn');
  const statusMsg = document.getElementById('statusMsg');

  // Generar un ID aleatorio seguro para el cliente si no tiene uno
  function generateRandomHex(length) {
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Cargar configuración guardada
  chrome.storage.local.get([
    'geminiApiKey', 
    'firebaseProjectId', 
    'systemPrompt', 
    'backendUrl', 
    'userId'
  ], function (items) {
    let userId = items.userId;
    if (!userId) {
      userId = 'usr_' + Date.now() + '_' + generateRandomHex(4);
      chrome.storage.local.set({ userId: userId });
    }
    userIdInput.value = userId;

    if (items.geminiApiKey) {
      apiKeyInput.value = items.geminiApiKey;
    } else {
      apiKeyInput.value = '';
    }
    if (items.firebaseProjectId) {
      projectIdInput.value = items.firebaseProjectId;
    } else {
      projectIdInput.value = 'touchid-forms-jose-2026';
    }
    if (items.systemPrompt) {
      systemPromptInput.value = items.systemPrompt;
    } else {
      systemPromptInput.value = 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.';
    }
    if (items.backendUrl) {
      backendUrlInput.value = items.backendUrl;
    } else {
      backendUrlInput.value = 'https://touchid-backend.onrender.com';
    }
  });

  // Copiar ID de cliente al portapapeles
  copyUserIdBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(userIdInput.value).then(function() {
      const oldText = copyUserIdBtn.innerText;
      copyUserIdBtn.innerText = 'Copiado!';
      copyUserIdBtn.style.background = 'var(--success-color)';
      setTimeout(() => {
        copyUserIdBtn.innerText = oldText;
        copyUserIdBtn.style.background = 'var(--primary-color)';
      }, 2000);
    });
  });

  // Guardar configuración
  saveBtn.addEventListener('click', function () {
    const apiKey = apiKeyInput.value.trim();
    const projectId = projectIdInput.value.trim() || 'touchid-forms-jose-2026';
    const systemPrompt = systemPromptInput.value.trim();
    const backendUrl = backendUrlInput.value.trim();

    if (!apiKey && !backendUrl) {
      alert('Por favor, ingresa una Gemini API Key local o la URL del Servidor Backend.');
      return;
    }

    chrome.storage.local.set({
      geminiApiKey: apiKey,
      firebaseProjectId: projectId,
      systemPrompt: systemPrompt,
      backendUrl: backendUrl
    }, function () {
      // Mostrar mensaje de éxito
      statusMsg.style.display = 'block';
      setTimeout(function () {
        statusMsg.style.display = 'none';
      }, 3000);

      // Notificar a las pestañas activas para recargar configuración en tiempo real
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
          try {
            chrome.tabs.sendMessage(tab.id, { action: 'configUpdated' }, function(response) {
              if (chrome.runtime.lastError) {
                // Silenciar error
              }
            });
          } catch (e) {
            // Silenciar error
          }
        });
      });
    });
  });
});
