// JS Lógica Principal - TouchID Web Dashboard (Opción B Backend)

// Estado global de la aplicación
let backendUrl = localStorage.getItem('touchid_backend_url') || 'https://touchid-backend.onrender.com';
let adminToken = localStorage.getItem('touchid_admin_token') || '';
let refreshInterval = null;

// Elementos de la UI
const lockScreen = document.getElementById('lock-screen');
const lockForm = document.getElementById('lock-form');
const lockPassword = document.getElementById('lock-password');
const lockErrorMsg = document.getElementById('lock-error-msg');
const mainLayout = document.getElementById('main-layout');

const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const tabTitle = document.getElementById('current-tab-title');
const dbStatusText = document.getElementById('db-status-text');
const dbStatusBadge = document.getElementById('db-status-badge');
const serverStatusBadge = document.getElementById('server-status-badge');

// Elementos de Estadísticas
const statTotal = document.getElementById('stat-total');
const statUsers = document.getElementById('stat-users');
const statLicActive = document.getElementById('stat-lic-active');
const statLicUsed = document.getElementById('stat-lic-used');

// Contenedores de Listas
const liveFeed = document.getElementById('live-question-feed');
const historyTableBody = document.getElementById('history-table-body');
const historySearch = document.getElementById('history-search');
const licensesTableBody = document.getElementById('licenses-table-body');

// Formulario de Configuración
const configForm = document.getElementById('config-form');
const cfgBackendUrl = document.getElementById('cfg-backend-url');
const cfgAdminToken = document.getElementById('cfg-admin-token');
const logoutBtn = document.getElementById('logout-btn');

// Formulario de Licencias
const licenseForm = document.getElementById('license-form');
const licCreditsSelect = document.getElementById('lic-credits');
const newLicenseDisplay = document.getElementById('new-license-display');
const newLicenseCode = document.getElementById('new-license-code');
const copyNewLicBtn = document.getElementById('copy-new-lic-btn');

// --- 1. Autenticación y Verificación de Token ---
async function verifyAdminAccess(tokenToVerify) {
  if (!tokenToVerify) return false;
  try {
    const response = await fetch(`${backendUrl}/admin/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': tokenToVerify
      }
    });
    return response.ok;
  } catch (e) {
    console.error('Error verificando token:', e);
    return false;
  }
}

async function initDashboard() {
  cfgBackendUrl.value = backendUrl;
  cfgAdminToken.value = adminToken;

  const isAccessGranted = await verifyAdminAccess(adminToken);
  
  if (isAccessGranted) {
    // Esconder lock screen y mostrar dashboard
    lockScreen.style.display = 'none';
    mainLayout.style.display = 'flex';
    
    dbStatusBadge.className = 'connection-status online';
    dbStatusText.textContent = 'Conectado';
    serverStatusBadge.className = 'api-status';
    serverStatusBadge.textContent = 'Servidor Conectado';

    // Cargar información inicial
    loadAllData();

    // Actualización automática cada 8 segundos
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(loadAllData, 8000);
  } else {
    // Mostrar lock screen
    lockScreen.style.display = 'flex';
    mainLayout.style.display = 'none';
    
    dbStatusBadge.className = 'connection-status offline';
    dbStatusText.textContent = 'Bloqueado';
    serverStatusBadge.className = 'api-status inactive';
    serverStatusBadge.textContent = 'Servidor Desconectado';
  }
}

// Evento de Login en Lock Screen
lockForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = lockPassword.value.trim();
  lockErrorMsg.style.display = 'none';

  const isValid = await verifyAdminAccess(password);
  if (isValid) {
    adminToken = password;
    localStorage.setItem('touchid_admin_token', password);
    lockPassword.value = '';
    initDashboard();
  } else {
    lockErrorMsg.style.display = 'block';
  }
});

// Cerrar sesión
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('touchid_admin_token');
  adminToken = '';
  if (refreshInterval) clearInterval(refreshInterval);
  window.location.reload();
});

// --- 2. Carga de Datos desde API de Render ---
async function loadAllData() {
  loadStats();
  loadLicenses();
  loadHistory();
}

async function loadStats() {
  try {
    const response = await fetch(`${backendUrl}/admin/stats`, {
      headers: { 'x-admin-token': adminToken }
    });
    if (response.ok) {
      const data = await response.json();
      statTotal.textContent = data.totalQuestions || 0;
      statUsers.textContent = data.totalUsers || 0;
      statLicActive.textContent = data.activeLicenses || 0;
      statLicUsed.textContent = data.usedLicenses || 0;
    }
  } catch (e) {
    console.error('Error al cargar estadísticas:', e);
  }
}

async function loadLicenses() {
  try {
    const response = await fetch(`${backendUrl}/admin/licenses`, {
      headers: { 'x-admin-token': adminToken }
    });
    if (response.ok) {
      const licenses = await response.json();
      renderLicensesTable(licenses);
    }
  } catch (e) {
    console.error('Error al cargar licencias:', e);
  }
}

async function loadHistory() {
  try {
    const response = await fetch(`${backendUrl}/admin/history`, {
      headers: { 'x-admin-token': adminToken }
    });
    if (response.ok) {
      const history = await response.json();
      renderHistoryTable(history);
      renderLiveFeed(history);
    }
  } catch (e) {
    console.error('Error al cargar historial:', e);
  }
}

// --- 3. Renderizadores de UI ---
function renderLicensesTable(licenses) {
  if (licenses.length === 0) {
    licensesTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="table-placeholder">No hay licencias registradas aún.</td>
      </tr>
    `;
    return;
  }

  licensesTableBody.innerHTML = '';
  licenses.forEach(lic => {
    const row = document.createElement('tr');
    
    const isUsed = lic.status === 'used';
    const statusBadge = isUsed 
      ? `<span style="background: rgba(239, 68, 68, 0.12); color: var(--color-red); padding: 4px 10px; border-radius: 6px; font-weight:600; font-size:12px;">Canjeado</span>`
      : `<span style="background: rgba(16, 185, 129, 0.12); color: var(--color-green); padding: 4px 10px; border-radius: 6px; font-weight:600; font-size:12px;">Disponible</span>`;

    const usedBy = lic.usedBy || '<span style="color: var(--text-secondary);">—</span>';
    
    let dateStr = '—';
    if (lic.usedAt) {
      const date = new Date(lic.usedAt);
      dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    row.innerHTML = `
      <td style="font-family: monospace; font-weight: 700; color: #fff;">${lic.code}</td>
      <td style="font-weight: 600; color: #60a5fa;">${lic.credits}</td>
      <td>${statusBadge}</td>
      <td style="font-family: monospace; font-size: 13px;">${usedBy}</td>
      <td style="font-size: 12.5px; color: var(--text-secondary);">${dateStr}</td>
    `;
    licensesTableBody.appendChild(row);
  });
}

function renderHistoryTable(history) {
  if (history.length === 0) {
    historyTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="table-placeholder">No hay preguntas resueltas aún.</td>
      </tr>
    `;
    return;
  }

  historyTableBody.innerHTML = '';
  history.forEach(doc => {
    const row = document.createElement('tr');
    
    const date = new Date(doc.timestamp || Date.now());
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.innerHTML = `
      <td class="row-date">${dateStr}</td>
      <td class="row-subject"><span class="row-subject">${doc.subject || 'General'}</span></td>
      <td class="row-question" title="${doc.question}">${doc.question}</td>
      <td class="row-answer">${doc.answer}</td>
      <td class="row-source">${doc.source === 'chrome_extension' ? 'PC' : 'Móvil'}</td>
    `;
    historyTableBody.appendChild(row);
  });
}

function renderLiveFeed(history) {
  if (history.length === 0) {
    liveFeed.innerHTML = `
      <div class="feed-placeholder">
        <p>Esperando interacciones de los clientes...</p>
      </div>
    `;
    return;
  }

  // Tomamos solo las últimas 5 preguntas para el Live Feed
  const recentDocs = history.slice(0, 5);
  
  liveFeed.innerHTML = '';
  recentDocs.forEach((doc) => {
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    
    const date = new Date(doc.timestamp || Date.now());
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const optionsHtml = (doc.options || []).map((opt, i) => {
      const isCorrect = opt === doc.answer || i === doc.answerIndex;
      return `<div class="feed-option ${isCorrect ? 'correct' : ''}">${opt}</div>`;
    }).join('');

    feedItem.innerHTML = `
      <div class="feed-meta">
        <span class="feed-subject">${doc.subject || 'General'}</span>
        <span class="feed-source">${doc.source === 'chrome_extension' ? 'Chrome PC' : 'App Móvil'} • ${timeStr}</span>
      </div>
      <div class="feed-question">${doc.question}</div>
      <div class="feed-options">
        ${optionsHtml}
      </div>
      <div class="feed-explanation">
        <strong>Explicación:</strong> ${doc.explanation || 'Respuesta sugerida por IA.'}
      </div>
    `;
    liveFeed.appendChild(feedItem);
  });
}

// --- 4. Generación de Nuevas Licencias ---
licenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const credits = Number(licCreditsSelect.value);

  try {
    const response = await fetch(`${backendUrl}/admin/licenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({ credits })
    });

    if (response.ok) {
      const newLic = await response.json();
      newLicenseCode.textContent = newLic.code;
      newLicenseDisplay.style.display = 'block';
      
      // Recargar datos
      loadLicenses();
      loadStats();
    } else {
      const err = await response.json();
      alert('Error: ' + err.error);
    }
  } catch (err) {
    alert('Error al conectar con el servidor: ' + err.message);
  }
});

// Botón Copiar Licencia Generada
copyNewLicBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(newLicenseCode.textContent).then(() => {
    const oldText = copyNewLicBtn.textContent;
    copyNewLicBtn.textContent = '¡Copiado!';
    copyNewLicBtn.style.background = 'var(--color-green)';
    setTimeout(() => {
      copyNewLicBtn.textContent = oldText;
      copyNewLicBtn.style.background = 'var(--color-blue)';
    }, 2000);
  });
});

// --- 5. Navegación por Pestañas ---
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetTab = item.getAttribute('href').substring(1);
    
    // Cambiar clase activa en navegación
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    // Cambiar clase activa en secciones
    tabContents.forEach(tab => {
      if (tab.id === `tab-${targetTab}`) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Actualizar título de cabecera
    tabTitle.textContent = item.textContent.trim();
  });
});

// --- 6. Guardar Configuración de Conexión ---
configForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const urlVal = cfgBackendUrl.value.trim();
  const tokenVal = cfgAdminToken.value.trim();

  localStorage.setItem('touchid_backend_url', urlVal);
  localStorage.setItem('touchid_admin_token', tokenVal);

  backendUrl = urlVal;
  adminToken = tokenVal;

  alert('Ajustes de conexión guardados correctamente.');
  initDashboard();
});

// --- 7. Buscador del Historial ---
historySearch.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  const rows = historyTableBody.querySelectorAll('tr');

  rows.forEach(row => {
    const questionText = row.querySelector('.row-question')?.textContent.toLowerCase() || '';
    const subjectText = row.querySelector('.row-subject')?.textContent.toLowerCase() || '';
    const answerText = row.querySelector('.row-answer')?.textContent.toLowerCase() || '';

    if (questionText.includes(searchTerm) || subjectText.includes(searchTerm) || answerText.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// Inicializar el dashboard al cargar
initDashboard();
