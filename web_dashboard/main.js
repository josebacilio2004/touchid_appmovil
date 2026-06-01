// JS Lógica Principal - TouchID Web Dashboard
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

// Estado global de la aplicación
let app = null;
let db = null;
let unsubscribeHistory = null;
let isFirstLoad = true;

// Elementos de la UI
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const tabTitle = document.getElementById('current-tab-title');
const dbStatusText = document.getElementById('db-status-text');
const dbStatusBadge = document.getElementById('db-status-badge');
const apiStatusBadge = document.getElementById('api-status-badge');

// Elementos de Estadísticas
const statTotal = document.getElementById('stat-total');
const statSubjects = document.getElementById('stat-subjects');
const statLastTime = document.getElementById('stat-last-time');
const statLastSource = document.getElementById('stat-last-source');

// Contenedores de Listas
const liveFeed = document.getElementById('live-question-feed');
const historyTableBody = document.getElementById('history-table-body');
const historySearch = document.getElementById('history-search');

// Formulario de Configuración
const configForm = document.getElementById('config-form');
const cfgGeminiKey = document.getElementById('cfg-gemini-key');
const cfgFirebaseProject = document.getElementById('cfg-firebase-project');
const cfgFirebaseSdk = document.getElementById('cfg-firebase-sdk');

// --- 1. Navegación por Pestañas ---
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

// --- 2. Cargar y Guardar Configuración ---
function loadLocalConfig() {
  const geminiKey = localStorage.getItem('touchid_gemini_key') || '';
  const firebaseProject = localStorage.getItem('touchid_firebase_project') || 'touchid-forms-jose-2026';
  const firebaseSdkRaw = localStorage.getItem('touchid_firebase_sdk') || '';

  cfgGeminiKey.value = geminiKey;
  cfgFirebaseProject.value = firebaseProject;
  cfgFirebaseSdk.value = firebaseSdkRaw;

  // Actualizar indicador de API Gemini
  if (geminiKey) {
    apiStatusBadge.className = 'api-status active';
    apiStatusBadge.textContent = 'API Gemini Activa';
  } else {
    apiStatusBadge.className = 'api-status inactive';
    apiStatusBadge.textContent = 'Configurar API Gemini';
  }

  // Intentar inicializar Firebase si hay credenciales
  tryInitFirebase(firebaseProject, firebaseSdkRaw);
}

function saveLocalConfig(e) {
  e.preventDefault();
  
  const geminiKey = cfgGeminiKey.value.trim();
  const firebaseProject = cfgFirebaseProject.value.trim();
  const firebaseSdkRaw = cfgFirebaseSdk.value.trim();

  localStorage.setItem('touchid_gemini_key', geminiKey);
  localStorage.setItem('touchid_firebase_project', firebaseProject);
  localStorage.setItem('touchid_firebase_sdk', firebaseSdkRaw);

  alert('Configuración guardada en almacenamiento local.');
  window.location.reload();
}

configForm.addEventListener('submit', saveLocalConfig);

// --- 3. Inicializar Firebase SDK ---
function tryInitFirebase(projectId, sdkRaw) {
  let firebaseConfig = null;

  if (sdkRaw) {
    try {
      firebaseConfig = JSON.parse(sdkRaw);
    } catch (e) {
      console.error('Error al parsear el JSON del Firebase SDK:', e);
    }
  }

  // Si no se proporcionó JSON completo, construir una config básica utilizando el Project ID
  if (!firebaseConfig && projectId) {
    // Nota: Para operaciones en tiempo real en la web, el Firebase Web SDK
    // necesita la apiKey. Si no está en el JSON, se asume que se usa Firestore REST API
    // o que el usuario ingresará el JSON completo en producción.
    // Creamos una config aproximada para que no falle el SDK si se omite.
    firebaseConfig = {
      apiKey: "REST_DEFAULT_KEY", 
      authDomain: `${projectId}.firebaseapp.com`,
      projectId: projectId,
      storageBucket: `${projectId}.appspot.com`,
    };
  }

  if (firebaseConfig && firebaseConfig.projectId) {
    try {
      // Evitar re-inicializar
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      
      dbStatusBadge.className = 'connection-status online';
      dbStatusText.textContent = 'Conectado';
      
      // Conectar el listener en tiempo real de Firestore
      setupFirestoreListener();
    } catch (err) {
      console.error('Fallo en la inicialización de Firebase:', err);
      dbStatusBadge.className = 'connection-status offline';
      dbStatusText.textContent = 'Error Config';
    }
  } else {
    dbStatusBadge.className = 'connection-status offline';
    dbStatusText.textContent = 'Sin Config';
  }
}

// --- 4. Stream en tiempo real de Firestore ---
function setupFirestoreListener() {
  if (!db) return;

  // Cancelar listener previo si existe
  if (unsubscribeHistory) unsubscribeHistory();

  const historyRef = collection(db, 'history');
  // Consulta ordenada por fecha descendente
  const q = query(historyRef, orderBy('timestamp', 'desc'), limit(50));

  isFirstLoad = true;

  unsubscribeHistory = onSnapshot(q, (snapshot) => {
    const docs = [];
    snapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    
    updateDashboardUI(docs);
    isFirstLoad = false;
  }, (error) => {
    console.error('Error en el stream de Firestore:', error);
    dbStatusBadge.className = 'connection-status offline';
    dbStatusText.textContent = 'Error Stream';
  });
}

// --- 5. Actualizar la Interfaz con los datos ---
function updateDashboardUI(docs) {
  // 1. Actualizar Estadísticas
  const totalQuestions = docs.length;
  statTotal.textContent = totalQuestions;

  const subjects = new Set();
  let lastDoc = null;

  docs.forEach((doc, idx) => {
    if (doc.subject) subjects.add(doc.subject);
    if (idx === 0) lastDoc = doc;
  });

  statSubjects.textContent = subjects.size;

  if (lastDoc) {
    const date = lastDoc.timestamp?.seconds 
      ? new Date(lastDoc.timestamp.seconds * 1000) 
      : new Date(lastDoc.timestamp || Date.now());
    
    statLastTime.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    statLastSource.textContent = `Vía ${lastDoc.source === 'chrome_extension' ? 'Extensión' : 'Móvil'}`;
  } else {
    statLastTime.textContent = '--:--';
    statLastSource.textContent = 'Sin datos';
  }

  // 2. Renderizar Live Feed (Panel General)
  renderLiveFeed(docs);

  // 3. Renderizar Tabla Historial
  renderHistoryTable(docs);
}

function renderLiveFeed(docs) {
  if (docs.length === 0) {
    liveFeed.innerHTML = `
      <div class="feed-placeholder">
        <p>Esperando interacciones del botón circular (Chrome / Móvil)...</p>
      </div>
    `;
    return;
  }

  // Tomamos solo las últimas 5 preguntas para el Live Feed
  const recentDocs = docs.slice(0, 5);
  
  liveFeed.innerHTML = '';
  recentDocs.forEach((doc) => {
    const feedItem = document.createElement('div');
    
    // Si no es la carga inicial y el elemento acaba de agregarse, aplicar efecto de pulso
    feedItem.className = 'feed-item';
    
    const date = doc.timestamp?.seconds 
      ? new Date(doc.timestamp.seconds * 1000) 
      : new Date(doc.timestamp || Date.now());
    
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

function renderHistoryTable(docs) {
  if (docs.length === 0) {
    historyTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="table-placeholder">No hay preguntas resueltas aún.</td>
      </tr>
    `;
    return;
  }

  historyTableBody.innerHTML = '';
  docs.forEach((doc) => {
    const row = document.createElement('tr');
    
    const date = doc.timestamp?.seconds 
      ? new Date(doc.timestamp.seconds * 1000) 
      : new Date(doc.timestamp || Date.now());
    
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

// --- 6. Buscador del Historial ---
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

// Inicializar configuración al cargar la página
loadLocalConfig();
