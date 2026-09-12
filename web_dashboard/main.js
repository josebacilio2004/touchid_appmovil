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

const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');

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
const histStatTotal = document.getElementById('hist-stat-total');
const histStatCredits = document.getElementById('hist-stat-credits');
const histStatRate = document.getElementById('hist-stat-rate');

// Elementos del Inspector DOM
const domStatTotal = document.getElementById('dom-stat-total');
const domStatPortals = document.getElementById('dom-stat-portals');
const domStatStrategy = document.getElementById('dom-stat-strategy');
const domInspectionsFeed = document.getElementById('dom-inspections-feed');
const domSearchInput = document.getElementById('dom-search-input');
const domRefreshBtn = document.getElementById('dom-refresh-btn');
const domClearBtn = document.getElementById('dom-clear-btn');

// Elementos del Sandbox DOM
const sandboxHtmlInput = document.getElementById('sandbox-html-input');
const sandboxParseBtn = document.getElementById('sandbox-parse-btn');
const sandboxLoadUdabolBtn = document.getElementById('sandbox-load-udabol-btn');
const sandboxLoadMoodleBtn = document.getElementById('sandbox-load-moodle-btn');
const sandboxResultBox = document.getElementById('sandbox-result-box');
const sbxStrategy = document.getElementById('sbx-strategy');
const sbxDompath = document.getElementById('sbx-dompath');
const sbxQuestion = document.getElementById('sbx-question');
const sbxOptions = document.getElementById('sbx-options');

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
const licCreditsInput = document.getElementById('lic-credits');
const newLicenseDisplay = document.getElementById('new-license-display');
const newLicenseCode = document.getElementById('new-license-code');
const copyNewLicBtn = document.getElementById('copy-new-lic-btn');

let lastVerifyError = '';
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
    if (response.ok) {
      lastVerifyError = '';
      return true;
    }
    if (response.status === 503) {
      lastVerifyError = 'Base de datos o túnel no disponible (Error 503). Verifica que el túnel esté levantado.';
    } else if (response.status === 401) {
      lastVerifyError = 'Clave incorrecta. Inténtalo de nuevo.';
    } else {
      lastVerifyError = `Error de respuesta del servidor (HTTP ${response.status}).`;
    }
    return false;
  } catch (e) {
    console.error('Error verificando token:', e);
    lastVerifyError = `No se pudo conectar con el servidor backend (${backendUrl}).`;
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
    lockErrorMsg.textContent = lastVerifyError || 'Clave incorrecta. Inténtalo de nuevo.';
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
let allDomInspections = [];

async function loadAllData() {
  loadStats();
  loadLicenses();
  loadHistory();
  loadDomInspections();
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

async function loadDomInspections() {
  if (!domInspectionsFeed) return;
  try {
    const response = await fetch(`${backendUrl}/admin/dom-inspections`, {
      headers: { 'x-admin-token': adminToken }
    });
    if (response.ok) {
      allDomInspections = await response.json();
      renderDomInspections(allDomInspections);
    }
  } catch (e) {
    console.error('Error al cargar inspecciones DOM:', e);
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
      <td data-label="Código" style="font-family: monospace; font-weight: 700; color: #fff;">
        <span>${lic.code}</span>
        <button class="copy-cell-btn" data-code="${lic.code}" title="Copiar código">Copiar</button>
      </td>
      <td data-label="Créditos" style="font-weight: 600; color: #60a5fa;">${lic.credits}</td>
      <td data-label="Estado">${statusBadge}</td>
      <td data-label="Canjeado Por" style="font-family: monospace; font-size: 13px;">${usedBy}</td>
      <td data-label="Fecha Canje" style="font-size: 12.5px; color: var(--text-secondary);">${dateStr}</td>
    `;
    licensesTableBody.appendChild(row);
  });
}

function renderHistoryTable(history) {
  let totalCredits = 0;
  history.forEach(doc => {
    const cost = doc.creditsUsed !== undefined ? doc.creditsUsed : 1;
    totalCredits += cost;
  });

  if (histStatTotal) histStatTotal.textContent = history.length;
  if (histStatCredits) histStatCredits.textContent = totalCredits;
  if (histStatRate) {
    const avg = history.length > 0 ? (totalCredits / history.length).toFixed(1) : '1.0';
    histStatRate.textContent = `${avg} cr / rpta`;
  }

  if (history.length === 0) {
    historyTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="table-placeholder">No hay preguntas resueltas aún.</td>
      </tr>
    `;
    return;
  }

  historyTableBody.innerHTML = '';
  history.forEach(doc => {
    const row = document.createElement('tr');
    
    const date = new Date(doc.timestamp || Date.now());
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cost = doc.creditsUsed !== undefined ? doc.creditsUsed : 1;
    const isUnlimited = doc.userType === 'ilimitado' || cost === 0;

    const creditBadge = isUnlimited
      ? `<span class="badge-credits unlimited">0 cr (Ilimitado)</span>`
      : `<span class="badge-credits standard">${cost} crédito</span>`;

    row.innerHTML = `
      <td data-label="Fecha" class="row-date">${dateStr}</td>
      <td data-label="Materia" class="row-subject"><span class="row-subject">${doc.subject || 'General'}</span></td>
      <td data-label="Pregunta" class="row-question" title="${doc.question}">${doc.question}</td>
      <td data-label="Respuesta" class="row-answer">${doc.answer}</td>
      <td data-label="Créditos" class="row-credits">${creditBadge}</td>
      <td data-label="Origen" class="row-source">${doc.source === 'chrome_extension' ? 'PC' : 'Móvil'}</td>
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
  const credits = Math.max(1, parseInt(licCreditsInput.value, 10));

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

    // En móviles, cerrar automáticamente el sidebar al seleccionar una pestaña
    if (sidebar && sidebarBackdrop) {
      sidebar.classList.remove('open');
      sidebarBackdrop.classList.remove('active');
    }
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

// Enrutamiento por Hash directo (ej. #quizzes)
function checkHashRoute() {
  const hash = window.location.hash;
  if (hash) {
    const targetItem = document.querySelector(`.nav-item[href="${hash}"]`);
    if (targetItem) {
      targetItem.click();
    }
  }
}

// Inicializar el dashboard al cargar
initDashboard().then(() => {
  checkHashRoute();
});
window.addEventListener('hashchange', checkHashRoute);

// --- Manejador de Chips de Créditos Rápidos ---
document.querySelectorAll('.btn-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const targetId = chip.getAttribute('data-target');
    const val = chip.getAttribute('data-val');
    const input = document.getElementById(targetId);
    if (input) {
      input.value = val;
    }
  });
});

// --- Formulario de Recarga Directa a Usuario ---
const directCreditForm = document.getElementById('direct-credit-form');
const directUserIdInput = document.getElementById('direct-user-id');
const directCreditsInput = document.getElementById('direct-credits');
const directCreditMsg = document.getElementById('direct-credit-msg');

if (directCreditForm) {
  directCreditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = directUserIdInput.value.trim();
    const credits = Math.max(0, parseInt(directCreditsInput.value, 10));
    if (!userId) return;

    directCreditMsg.style.display = 'block';
    directCreditMsg.style.background = 'rgba(59, 130, 246, 0.15)';
    directCreditMsg.style.border = '1px solid rgba(59, 130, 246, 0.3)';
    directCreditMsg.style.color = '#93c5fd';
    directCreditMsg.textContent = 'Asignando créditos a ' + userId + '...';

    try {
      const response = await fetch(`${backendUrl}/credits/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ userId, credits, adminKey: adminToken })
      });

      const data = await response.json();
      if (response.ok) {
        directCreditMsg.style.background = 'rgba(16, 185, 129, 0.15)';
        directCreditMsg.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        directCreditMsg.style.color = '#6ee7b7';
        directCreditMsg.textContent = `✅ Éxito: Se asignaron ${credits.toLocaleString()} créditos a ${userId}`;
        loadStats();
      } else {
        directCreditMsg.style.background = 'rgba(239, 68, 68, 0.15)';
        directCreditMsg.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        directCreditMsg.style.color = '#fca5a5';
        directCreditMsg.textContent = `❌ Error: ${data.error || 'No se pudo actualizar los créditos'}`;
      }
    } catch (err) {
      directCreditMsg.style.background = 'rgba(239, 68, 68, 0.15)';
      directCreditMsg.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      directCreditMsg.style.color = '#fca5a5';
      directCreditMsg.textContent = `❌ Error de red: ${err.message}`;
    }
  });
}

// --- 8. Lógica del Menú Móvil (Drawer & Backdrop) ---
if (mobileMenuBtn && sidebar && sidebarBackdrop) {
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
    sidebarBackdrop.classList.toggle('active');
  });

  sidebarBackdrop.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('active');
  });
}

// --- 9. Copia Rápida de Licencias desde las Tarjetas Móviles ---
if (licensesTableBody) {
  licensesTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-cell-btn');
    if (btn) {
      const code = btn.getAttribute('data-code');
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          const prevText = btn.textContent;
          btn.textContent = '¡Copiado!';
          btn.style.background = 'var(--color-green)';
          btn.style.color = '#fff';
          setTimeout(() => {
            btn.textContent = prevText;
            btn.style.background = '';
            btn.style.color = '';
          }, 1800);
        });
      }
    }
  });
}

// --- 10. Módulo Inspector DOM: Renderizado y Filtros ---
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderDomInspections(inspections) {
  if (!domInspectionsFeed) return;

  // Actualizar métricas del Inspector
  if (domStatTotal) domStatTotal.textContent = inspections.length;

  const uniquePortals = new Set();
  const strategyCounts = {};

  inspections.forEach(doc => {
    if (doc.url && doc.url !== 'N/A') {
      try {
        const u = new URL(doc.url.startsWith('http') ? doc.url : `https://${doc.url}`);
        uniquePortals.add(u.hostname.replace('www.', ''));
      } catch (_) {
        uniquePortals.add(doc.url);
      }
    }
    const strat = doc.strategy || 'desconocida';
    strategyCounts[strat] = (strategyCounts[strat] || 0) + 1;
  });

  if (domStatPortals) domStatPortals.textContent = uniquePortals.size || (inspections.length > 0 ? 1 : 0);

  if (domStatStrategy) {
    let bestStrat = '—';
    let maxCount = 0;
    for (const [k, v] of Object.entries(strategyCounts)) {
      if (v > maxCount) {
        maxCount = v;
        bestStrat = k;
      }
    }
    domStatStrategy.textContent = bestStrat.replace(/_/g, ' ');
    domStatStrategy.title = bestStrat;
  }

  if (inspections.length === 0) {
    domInspectionsFeed.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
        <p style="font-size: 15px; margin-bottom: 8px; color: #fff;">No hay capturas DOM registradas aún.</p>
        <p style="font-size: 13px;">Al resolver cuestionarios desde la aplicación móvil o simulador, los detalles del DOM analizado (enunciados, alternativas, breadcrumbs) aparecerán automáticamente aquí.</p>
      </div>
    `;
    return;
  }

  domInspectionsFeed.innerHTML = '';
  inspections.forEach((doc, idx) => {
    const card = document.createElement('div');
    card.className = 'dom-card';
    card.setAttribute('data-id', doc.id || idx);

    const urlLower = (doc.url || '').toLowerCase();
    let portalBadge = '<span class="dom-portal-badge badge-generic">Web Exam</span>';
    let portalName = 'Plataforma Web';

    if (urlLower.includes('udabol')) {
      portalBadge = '<span class="dom-portal-badge badge-udabol">UDABOL Oficial</span>';
      portalName = 'UDABOL (Carpeta Verde)';
    } else if (urlLower.includes('moodle') || urlLower.includes('continental')) {
      portalBadge = '<span class="dom-portal-badge badge-moodle">Moodle / Univ</span>';
      portalName = 'Campus Virtual Moodle';
    } else if (urlLower.includes('quiz') || urlLower.includes('touchid') || urlLower.includes('github.io')) {
      portalBadge = '<span class="dom-portal-badge badge-simulator">Simulador TouchID</span>';
      portalName = 'Banco de Preguntas';
    }

    const date = new Date(doc.timestamp || Date.now());
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const strategyClean = (doc.strategy || 'Heurística Estándar').replace(/_/g, ' ');
    const domPathClean = doc.domPath || 'body > form > div.pregunta';

    const optionsPills = (doc.options || []).map((opt, i) => {
      const isAnswer = (opt === doc.answer || i === doc.answerIndex);
      return `<span class="dom-opt-pill ${isAnswer ? 'is-answer' : ''}">${isAnswer ? '✓ ' : ''}${escapeHtml(opt)}</span>`;
    }).join('');

    const rawHtmlContent = doc.rawQuestionHtml ? escapeHtml(doc.rawQuestionHtml) : '';
    const hasRawHtml = rawHtmlContent.trim().length > 0;

    card.innerHTML = `
      <div class="dom-card-header">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          ${portalBadge}
          <span style="font-weight: 700; color: #fff; font-size: 14px;">${portalName}</span>
          <span class="dom-strategy-tag">⚙ ${escapeHtml(strategyClean)}</span>
        </div>
        <div class="dom-meta-info">
          <span>${doc.userId || 'anon'} • ${dateStr}</span>
        </div>
      </div>

      <div style="font-size: 12px; color: #94a3b8; word-break: break-all; margin-bottom: 6px;">
        <strong>URL:</strong> <a href="${escapeHtml(doc.url)}" target="_blank" style="color: #38bdf8; text-decoration: none;">${escapeHtml(doc.url)}</a>
      </div>

      <div class="dom-breadcrumb-path">
        📍 <strong>Ruta Jerárquica DOM:</strong> ${escapeHtml(domPathClean)}
      </div>

      <div class="dom-question-box">
        ${escapeHtml(doc.question)}
      </div>

      <div style="margin: 8px 0;">
        <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Alternativas Extraídas (${doc.options ? doc.options.length : 0}):</span>
        <div class="dom-options-pills">
          ${optionsPills || '<span style="color: var(--text-secondary); font-size: 12px;">No se detectaron alternativas estructuradas.</span>'}
        </div>
      </div>

      ${doc.answer ? `
      <div style="margin-top: 6px; font-size: 13px; color: #34d399; font-weight: 600;">
        ✨ Respuesta IA: <span style="color: #fff;">${escapeHtml(doc.answer)}</span>
      </div>
      ` : ''}

      ${hasRawHtml ? `
      <div style="margin-top: 14px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
        <button type="button" class="accordion-toggle" data-target="raw-${idx}">
          <span>▶ Ver Estructura HTML Cruda (DOM Snippet)</span>
        </button>
        <div class="accordion-content" id="raw-${idx}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; color: #94a3b8;">Fragmento HTML extraído del portal de examen:</span>
            <button class="copy-cell-btn btn-copy-html" style="margin: 0;">Copiar HTML</button>
          </div>
          <pre class="dom-code-box"><code>${rawHtmlContent}</code></pre>
        </div>
      </div>
      ` : ''}
    `;

    domInspectionsFeed.appendChild(card);
  });
}

// Delegación de eventos para acordeón de código HTML en feed DOM
if (domInspectionsFeed) {
  domInspectionsFeed.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.accordion-toggle');
    if (toggleBtn) {
      const targetId = toggleBtn.getAttribute('data-target');
      const content = document.getElementById(targetId);
      if (content) {
        content.classList.toggle('open');
        const span = toggleBtn.querySelector('span');
        if (span) {
          span.textContent = content.classList.contains('open')
            ? '▼ Ocultar Estructura HTML Cruda'
            : '▶ Ver Estructura HTML Cruda (DOM Snippet)';
        }
      }
      return;
    }

    const copyBtn = e.target.closest('.btn-copy-html');
    if (copyBtn) {
      const codeBlock = copyBtn.closest('.accordion-content').querySelector('code');
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.textContent).then(() => {
          const old = copyBtn.textContent;
          copyBtn.textContent = '¡Copiado!';
          copyBtn.style.background = 'var(--color-green)';
          setTimeout(() => {
            copyBtn.textContent = old;
            copyBtn.style.background = '';
          }, 1800);
        });
      }
    }
  });
}

// Filtro de búsqueda del Inspector DOM
if (domSearchInput) {
  domSearchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!allDomInspections) return;
    const filtered = allDomInspections.filter(doc => {
      const q = (doc.question || '').toLowerCase();
      const u = (doc.url || '').toLowerCase();
      const s = (doc.strategy || '').toLowerCase();
      const p = (doc.domPath || '').toLowerCase();
      return q.includes(term) || u.includes(term) || s.includes(term) || p.includes(term);
    });
    renderDomInspections(filtered);
  });
}

// Botón refrescar Inspector DOM
if (domRefreshBtn) {
  domRefreshBtn.addEventListener('click', () => {
    loadDomInspections();
  });
}

// Botón vaciar historial Inspector DOM
if (domClearBtn) {
  domClearBtn.addEventListener('click', async () => {
    if (!confirm('¿Deseas vaciar todos los registros de inspección DOM guardados?')) return;
    try {
      const res = await fetch(`${backendUrl}/admin/dom-inspections`, {
        method: 'DELETE',
        headers: { 'x-admin-token': adminToken }
      });
      if (res.ok) {
        allDomInspections = [];
        renderDomInspections([]);
        alert('Registros de inspección DOM eliminados con éxito.');
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  });
}

// --- 11. Laboratorio / Sandbox DOM (Parser Interactivo de Prueba) ---
function simulateMobileAlgorithm(htmlSnippet) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlSnippet, 'text/html');

  function clean(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').trim();
  }

  var noisePatterns = [
    /\b(TouchID|Quiz\s+Simulator|Banco\s+de\s+Preguntas|Simulador\s+de\s+Ex[áa]menes)[^\n\r]*/gi,
    /\b(Modo:\s*[^\n\r]*|Ir\s+al\s+Dashboard[^\n\r]*)/gi,
    /\b(CARPETA\s+PEDAG[OÓ]GICA\s+DIGITAL|CARPETA\s+PEDAG[OÓ]GICA|UDABOL|UNIVERSIDAD\s+DE\s+AQUINO)[^\n\r]*/gi,
    /\b(1P|2P|3P|FINAL|EXAMEN\s*\d*|PARCIAL|MED-\d+)[^\n\r]*/gi,
    /\b(Respondidas|Sin responder|Respondida)\b/gi,
    /\bPregunta\s+nro\.?\s*\d+\b/gi,
    /\bPregunta\s+\d+\s+de\s+\d+\b/gi,
    /\bTIEMPO\s+RESTANTE\b[\s\S]*?(?=(?:Pregunta|Siguiente|$))/gi,
    /\b(Minutos|Segundos)\b/gi,
    /\b(Punt[uú]a\s+como|Puntaje|Sobre\s+\d+|Se[ñn]alar\s+con\s+bandera|Marcar\s+con\s+bandera)\b[^\n\r]*/gi,
    /\b(Enunciado\s+de\s+la\s+pregunta)\b/gi,
    /\b(Resolver\s+con\s+IA|Siguiente|Anterior|Finalizar|Terminar\s+intento)\b/gi,
    /[✔✓]\s*[^\n\r]*/gi
  ];

  function stripNoise(text) {
    var t = text || '';
    noisePatterns.forEach(p => { t = t.replace(p, ' '); });
    t = t.replace(/\b\d{1,2}:\d{2}\b/g, ' ');
    t = t.replace(/(?:^|\s)\d{1,2}(?=\s|$)/g, ' ');
    return clean(t);
  }

  function getDomPath(el) {
    if (!el || !el.parentNode) return '';
    var stack = [];
    var curr = el;
    while (curr && curr.nodeType === 1 && curr.tagName.toLowerCase() !== 'html' && stack.length < 6) {
      var name = curr.tagName.toLowerCase();
      if (curr.id) {
        name += '#' + curr.id;
      } else if (curr.className && typeof curr.className === 'string') {
        var cls = curr.className.trim().split(/\s+/).filter(c => c && !c.includes(':')).slice(0, 2).join('.');
        if (cls) name += '.' + cls;
      }
      stack.unshift(name);
      curr = curr.parentNode;
    }
    return stack.join(' > ');
  }

  var questionText = '';
  var options = [];
  var strategyUsed = 'ninguna';
  var targetEl = null;

  // 1. SELECTORES DEDICADOS
  var qSelectors = [
    '#question-text', '.question-box', '.qtext', '.formulation .qtext',
    '[class*="question-text"]', '[class*="enunciado"]', '[class*="pregunta-texto"]',
    '.que .content .qtext', '.question_content', '.freebirdFormviewerViewNumberedItemHeader'
  ];
  for (var qs = 0; qs < qSelectors.length; qs++) {
    var qEl = doc.querySelector(qSelectors[qs]);
    if (qEl) {
      var qCandidate = clean(qEl.innerText || qEl.textContent);
      if (qCandidate.length > 5) {
        var stripped = stripNoise(qCandidate);
        if (stripped.length > 5 && !/CARPETA\s+PEDAG/i.test(stripped)) {
          questionText = stripped;
          strategyUsed = `Selector Dedicado (${qSelectors[qs]})`;
          targetEl = qEl;
          break;
        }
      }
    }
  }

  // 2. SELECTORES DE TARJETAS
  var optCardSelectors = [
    '#options-container .option-item', '.options-list .option-item',
    '.option-item', '.option-card', '[class*="option-item"]', '[class*="option-card"]', '[role="radio"]'
  ];
  for (var os = 0; os < optCardSelectors.length; os++) {
    var optNodes = doc.querySelectorAll(optCardSelectors[os]);
    if (optNodes && optNodes.length >= 2) {
      var list = [];
      optNodes.forEach(node => {
        var clone = node.cloneNode(true);
        var idx = clone.querySelector('.option-index, [class*="index"], [class*="letter"]');
        if (idx) idx.remove();
        var t = clean(clone.innerText || clone.textContent).replace(/^[A-Za-z0-9][\.\)\-]\s*/, '').trim();
        if (t && list.indexOf(t) === -1) list.push(t);
      });
      if (list.length >= 2) {
        options = list;
        if (strategyUsed === 'ninguna') strategyUsed = `Tarjetas de Opción (${optCardSelectors[os]})`;
        break;
      }
    }
  }

  // 3. RADIO BUTTONS & HERMANO PREVIO (UDABOL/Moodle)
  var radioInputs = Array.from(doc.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
  function getOptionTextFromInput(input) {
    if (input.id) {
      var lbl = doc.querySelector('label[for="' + input.id + '"]');
      if (lbl) {
        var lt = clean(lbl.innerText || lbl.textContent);
        if (lt) return lt;
      }
    }
    var parentLbl = input.closest('label');
    if (parentLbl) {
      var pt = clean(parentLbl.innerText || parentLbl.textContent);
      if (pt) return pt;
    }
    var sib = input.nextElementSibling;
    if (sib) {
      var st = clean(sib.innerText || sib.textContent);
      if (st) return st;
    }
    var parentBox = input.closest('.answer, .r0, .r1, .opcion, .option, li, div, p');
    if (parentBox) {
      var clone = parentBox.cloneNode(true);
      var inputs = clone.querySelectorAll('input, button');
      inputs.forEach(i => i.remove());
      var cText = clean(clone.innerText || clone.textContent);
      if (cText) return cText;
    }
    return '';
  }

  if (options.length < 2 && radioInputs.length > 0) {
    var visibleRadios = radioInputs;
    var targetName = visibleRadios[0].name;
    var currentGroup = visibleRadios.filter(r => !targetName || r.name === targetName);
    if (currentGroup.length < 2) currentGroup = visibleRadios;

    currentGroup.forEach(input => {
      var txt = getOptionTextFromInput(input).replace(/^[A-Za-z0-9][\.\)\-]\s*/, '').trim();
      if (txt && options.indexOf(txt) === -1) options.push(txt);
    });

    if (questionText.length < 5) {
      var firstRadio = currentGroup[0];
      var parentBlock = firstRadio.closest('.form-group, .opcion, .option, li, tr, div, p');
      if (parentBlock && parentBlock.parentElement) {
        var prevSib = parentBlock.previousElementSibling;
        while (prevSib) {
          var pCand = stripNoise(clean(prevSib.innerText || prevSib.textContent));
          if (pCand.length > 5 && options.indexOf(pCand) === -1 && !/CARPETA\s+PEDAG/i.test(pCand)) {
            questionText = pCand;
            strategyUsed = 'Hermano Previo al Input (Algoritmo UDABOL)';
            targetEl = prevSib;
            break;
          }
          prevSib = prevSib.previousElementSibling;
        }
      }

      if (questionText.length < 5) {
        var qContainer = currentGroup[0].closest('.que, .multichoice, fieldset, .question, form, .card') || currentGroup[0].parentElement;
        if (qContainer) {
          var raw = qContainer.innerText || qContainer.textContent || '';
          options.forEach(opt => { raw = raw.split(opt).join(''); });
          questionText = stripNoise(raw);
          strategyUsed = 'Contenedor Padre Strip';
          targetEl = qContainer;
        }
      }
    }
  }

  // 4. RESPALDO SEMÁNTICO
  if (options.length < 2 || questionText.length < 5) {
    var bodyText = doc.body.innerText || doc.body.textContent || '';
    var lines = bodyText.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 0);
    var cleanLines = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (/^\d{1,2}$/.test(line) || /^\d{1,2}:\d{2}$/.test(line)) continue;
      if (/^(CARPETA\s+PEDAG[OÓ]GICA|UDABOL|UNIVERSIDAD)/i.test(line)) continue;
      cleanLines.push(line);
    }
    if (cleanLines.length >= 2) {
      if (questionText.length < 5) {
        questionText = cleanLines[0];
        strategyUsed = 'Respaldo Semántico de Líneas';
      }
      if (options.length < 2) {
        for (var j = 1; j < cleanLines.length; j++) {
          options.push(cleanLines[j]);
        }
      }
    }
  }

  return {
    question: questionText || 'No se pudo extraer el enunciado',
    options: options,
    strategy: strategyUsed,
    domPath: targetEl ? getDomPath(targetEl) : 'root > body'
  };
}

if (sandboxParseBtn) {
  sandboxParseBtn.addEventListener('click', () => {
    const htmlVal = (sandboxHtmlInput?.value || '').trim();
    if (!htmlVal) {
      alert('Por favor pega un fragmento HTML para analizar.');
      return;
    }

    const result = simulateMobileAlgorithm(htmlVal);
    sbxStrategy.textContent = result.strategy;
    sbxDompath.textContent = result.domPath;
    sbxQuestion.textContent = result.question;

    sbxOptions.innerHTML = '';
    if (result.options.length > 0) {
      result.options.forEach((opt, idx) => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 8px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: #e2e8f0; font-size: 13px;';
        item.textContent = `${String.fromCharCode(65 + idx)}) ${opt}`;
        sbxOptions.appendChild(item);
      });
    } else {
      sbxOptions.innerHTML = '<span style="color: #f87171; font-size: 13px;">No se detectaron alternativas en este fragmento.</span>';
    }

    sandboxResultBox.style.display = 'block';
  });
}

if (sandboxLoadUdabolBtn) {
  sandboxLoadUdabolBtn.addEventListener('click', () => {
    sandboxHtmlInput.value = `<div class="header-portal">CARPETA PEDAGOGICA DIGITAL - UNIVERSIDAD DE AQUINO BOLIVIA</div>
<div class="exam-title">MED-202-11390: Embriología II - Examen 2-2025</div>
<div class="question-container">
  <div class="enunciado-pregunta">ANTES DEL NACIMIENTO LOS PULMONES ESTAN LLENOS DE:</div>
  <div class="form-group"><label><input type="radio" name="resp_1" value="1"> AIRE RESIDUAL</label></div>
  <div class="form-group"><label><input type="radio" name="resp_1" value="2"> LIQUIDO PULMONAR CON ALTO CONTENIDO DE CLORO</label></div>
  <div class="form-group"><label><input type="radio" name="resp_1" value="3"> SANGRE OXIGENADA</label></div>
  <div class="form-group"><label><input type="radio" name="resp_1" value="4"> MECONIO FETAL</label></div>
</div>`;
    sandboxParseBtn.click();
  });
}

if (sandboxLoadMoodleBtn) {
  sandboxLoadMoodleBtn.addEventListener('click', () => {
    sandboxHtmlInput.value = `<div class="que multichoice deferredfeedback notyetanswered">
  <div class="content">
    <div class="formulation clearfix">
      <div class="qtext">¿Cuál es el valor normal de la presión arterial sistólica según la AHA?</div>
      <div class="ablock">
        <div class="answer">
          <div class="r0"><label><input type="radio" name="q1" value="0"> Menor a 120 mmHg</label></div>
          <div class="r1"><label><input type="radio" name="q1" value="1"> 140 a 159 mmHg</label></div>
          <div class="r0"><label><input type="radio" name="q1" value="2"> Mayor a 160 mmHg</label></div>
          <div class="r1"><label><input type="radio" name="q1" value="3"> 130 a 139 mmHg</label></div>
        </div>
      </div>
    </div>
  </div>
</div>`;
    sandboxParseBtn.click();
  });
}

