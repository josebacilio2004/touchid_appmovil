// Options Script - TouchID Questionnaire Solver

document.addEventListener('DOMContentLoaded', function () {
  const apiKeyInput = document.getElementById('apiKey');
  const projectIdInput = document.getElementById('projectId');
  const saveBtn = document.getElementById('saveBtn');
  const statusMsg = document.getElementById('statusMsg');

  // Cargar configuración guardada
  chrome.storage.local.get(['geminiApiKey', 'firebaseProjectId'], function (items) {
    if (items.geminiApiKey) {
      apiKeyInput.value = items.geminiApiKey;
    } else {
      apiKeyInput.value = 'AIzaSyD65ld_fUcoSIVAM6rU2aItHAITZa0lPdM';
    }
    if (items.firebaseProjectId) {
      projectIdInput.value = items.firebaseProjectId;
    } else {
      projectIdInput.value = 'jbac-examen-parcial-2026'; // Valor por defecto
    }
  });

  // Guardar configuración
  saveBtn.addEventListener('click', function () {
    const apiKey = apiKeyInput.value.trim();
    const projectId = projectIdInput.value.trim() || 'jbac-examen-parcial-2026';

    if (!apiKey) {
      alert('Por favor, ingresa una Gemini API Key válida.');
      return;
    }

    chrome.storage.local.set({
      geminiApiKey: apiKey,
      firebaseProjectId: projectId
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
              // Ignorar errores de pestañas que no tienen el content script cargado
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
