// ============================================================================
// TOUCHID CRM & AGENDA DE EXÁMENES + BOT DE WHATSAPP (BAILEYS)
// ============================================================================

function getBackendUrl() {
  return localStorage.getItem('touchid_backend_url') || 'https://touchid-backend.onrender.com';
}

function getAdminToken() {
  return localStorage.getItem('touchid_admin_token') || '';
}

// Elementos de la UI de WhatsApp
const crmWaStatusText = document.getElementById('crm-wa-status-text');
const crmWaStatusSub = document.getElementById('crm-wa-status-sub');
const crmWaBadge = document.getElementById('crm-wa-badge');
const crmWaQrContainer = document.getElementById('crm-wa-qr-container');
const crmWaQrImg = document.getElementById('crm-wa-qr-img');
const crmWaConnectedBox = document.getElementById('crm-wa-connected-box');
const crmWaConnectedNumber = document.getElementById('crm-wa-connected-number');
const crmWaRefreshBtn = document.getElementById('crm-wa-refresh-btn');
const crmWaTestBtn = document.getElementById('crm-wa-test-btn');
const crmWaLogoutBtn = document.getElementById('crm-wa-logout-btn');

// Elementos de Configuración de Teléfono Admin
const crmAdminPhoneForm = document.getElementById('crm-admin-phone-form');
const crmAdminPhoneInput = document.getElementById('crm-admin-phone-input');
const crmAdminPhoneSaveBtn = document.getElementById('crm-admin-phone-save-btn');

// Elementos de Métricas y Contadores
const crmStatTodayExams = document.getElementById('crm-stat-today-exams');
const crmStatTodayStudents = document.getElementById('crm-stat-today-students');
const crmStatLowCredits = document.getElementById('crm-stat-low-credits');
const crmSchedulesBadge = document.getElementById('crm-schedules-badge');

// Elementos de Agenda de Exámenes
const crmScheduleDateFilter = document.getElementById('crm-schedule-date-filter');
const crmScheduleTodayBtn = document.getElementById('crm-schedule-today-btn');
const crmScheduleNewBtn = document.getElementById('crm-schedule-new-btn');
const crmSchedulesTableBody = document.getElementById('crm-schedules-table-body');

// Elementos de Directorio CRM de Estudiantes
const crmClientsSearch = document.getElementById('crm-clients-search');
const crmClientNewBtn = document.getElementById('crm-client-new-btn');
const crmClientsTableBody = document.getElementById('crm-clients-table-body');

// Elementos de Modales
const modalSchedule = document.getElementById('modal-schedule');
const modalScheduleForm = document.getElementById('modal-schedule-form');
const modalScheduleCancel = document.getElementById('modal-schedule-cancel');
const schIdInput = document.getElementById('sch-id');
const schUserId = document.getElementById('sch-user-id');
const schStudentName = document.getElementById('sch-student-name');
const schCourse = document.getElementById('sch-course');
const schDate = document.getElementById('sch-date');
const schTime = document.getElementById('sch-time');
const schCredits = document.getElementById('sch-credits');
const schNotes = document.getElementById('sch-notes');

const modalClient = document.getElementById('modal-client');
const modalClientForm = document.getElementById('modal-client-form');
const modalClientCancel = document.getElementById('modal-client-cancel');
const cliUserId = document.getElementById('cli-user-id');
const cliStudentName = document.getElementById('cli-student-name');
const cliPhone = document.getElementById('cli-phone');
const cliUniversity = document.getElementById('cli-university');
const cliCredits = document.getElementById('cli-credits');
const cliNotes = document.getElementById('cli-notes');

let allClientsCache = [];
let allSchedulesCache = [];

// Helper para fecha local del navegador (evita saltos al día siguiente por UTC)
export function getLocalDateStr(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================================================
// 1. GESTIÓN DEL BOT DE WHATSAPP (BAILEYS)
// ============================================================================

export async function loadWhatsAppStatus() {
  const token = getAdminToken();
  if (!token) return;

  try {
    const res = await fetch(`${getBackendUrl()}/admin/whatsapp/status`, {
      headers: { 'x-admin-token': token }
    });

    if (res.ok) {
      const data = await res.json();

      if (crmAdminPhoneInput && data.adminPhone && !crmAdminPhoneInput.value) {
        crmAdminPhoneInput.value = data.adminPhone;
      }

      if (data.status === 'connected') {
        if (crmWaStatusText) {
          crmWaStatusText.textContent = '🟢 Conectado';
          crmWaStatusText.style.color = '#34d399';
        }
        if (crmWaStatusSub) crmWaStatusSub.textContent = `ID: +${data.connectedNumber || 'OK'}`;
        if (crmWaBadge) {
          crmWaBadge.textContent = 'En Línea';
          crmWaBadge.className = 'pulse-indicator';
        }
        if (crmWaConnectedBox) crmWaConnectedBox.style.display = 'block';
        if (crmWaConnectedNumber) crmWaConnectedNumber.textContent = `Número: +${data.connectedNumber || 'Conectado'}`;
        if (crmWaQrContainer) crmWaQrContainer.style.display = 'none';
      } else if (data.status === 'qr_ready') {
        if (crmWaStatusText) {
          crmWaStatusText.textContent = '🟡 Escanear QR';
          crmWaStatusText.style.color = '#fbbf24';
        }
        if (crmWaStatusSub) crmWaStatusSub.textContent = 'Esperando vinculación';
        if (crmWaBadge) {
          crmWaBadge.textContent = 'QR Listo';
          crmWaBadge.className = 'badge-credits standard';
        }
        if (crmWaConnectedBox) crmWaConnectedBox.style.display = 'none';
        if (crmWaQrContainer) {
          crmWaQrContainer.style.display = 'block';
          if (crmWaQrImg && data.qrCode) {
            crmWaQrImg.src = data.qrCode;
          }
        }
      } else if (data.status === 'connecting') {
        if (crmWaStatusText) {
          crmWaStatusText.textContent = '🔵 Conectando...';
          crmWaStatusText.style.color = '#60a5fa';
        }
        if (crmWaStatusSub) crmWaStatusSub.textContent = 'Iniciando WebSocket';
        if (crmWaBadge) {
          crmWaBadge.textContent = 'Conectando';
          crmWaBadge.className = 'badge-credits standard';
        }
      } else {
        if (crmWaStatusText) {
          crmWaStatusText.textContent = '🔴 Desconectado';
          crmWaStatusText.style.color = '#f87171';
        }
        if (crmWaStatusSub) crmWaStatusSub.textContent = 'Sin conexión';
        if (crmWaBadge) {
          crmWaBadge.textContent = 'Offline';
          crmWaBadge.className = 'badge-credits standard';
        }
        if (crmWaConnectedBox) crmWaConnectedBox.style.display = 'none';
        if (crmWaQrContainer) crmWaQrContainer.style.display = 'none';
      }
    }
  } catch (err) {
    console.warn('Error consultando estado de WhatsApp:', err.message);
  }
}

// Botón Reconectar / Forzar QR
if (crmWaRefreshBtn) {
  crmWaRefreshBtn.addEventListener('click', async () => {
    const token = getAdminToken();
    crmWaRefreshBtn.textContent = 'Reconectando...';
    try {
      const res = await fetch(`${getBackendUrl()}/admin/whatsapp/reconnect`, {
        method: 'POST',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      setTimeout(loadWhatsAppStatus, 2000);
    } catch (e) {
      alert('Error al reconectar: ' + e.message);
    } finally {
      setTimeout(() => { crmWaRefreshBtn.textContent = 'Reconectar / QR'; }, 2000);
    }
  });
}

// Botón Enviar Mensaje de Prueba
if (crmWaTestBtn) {
  crmWaTestBtn.addEventListener('click', async () => {
    const token = getAdminToken();
    crmWaTestBtn.textContent = 'Enviando...';
    try {
      const res = await fetch(`${getBackendUrl()}/admin/whatsapp/test-message`, {
        method: 'POST',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      alert(data.message || (data.success ? '¡Mensaje de prueba enviado!' : 'Fallo al enviar.'));
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      crmWaTestBtn.textContent = 'Probar Mensaje';
    }
  });
}

// Botón Desvincular / Logout
if (crmWaLogoutBtn) {
  crmWaLogoutBtn.addEventListener('click', async () => {
    if (!confirm('¿Seguro que deseas desvincular la sesión de WhatsApp? Tendrás que escanear el QR de nuevo.')) return;
    const token = getAdminToken();
    try {
      await fetch(`${getBackendUrl()}/admin/whatsapp/logout`, {
        method: 'POST',
        headers: { 'x-admin-token': token }
      });
      loadWhatsAppStatus();
    } catch (e) {
      alert('Error: ' + e.message);
    }
  });
}

// Formulario Guardar Teléfono Admin
if (crmAdminPhoneForm) {
  crmAdminPhoneForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAdminToken();
    const phone = crmAdminPhoneInput.value.trim();
    if (!phone) return;

    crmAdminPhoneSaveBtn.textContent = 'Guardando...';
    try {
      const res = await fetch(`${getBackendUrl()}/admin/whatsapp/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ adminPhone: phone })
      });
      if (res.ok) {
        alert('✅ Número de teléfono del Administrador guardado correctamente.');
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (e) {
      alert('Error al guardar: ' + e.message);
    } finally {
      crmAdminPhoneSaveBtn.textContent = 'Guardar Teléfono Admin';
    }
  });
}

// ============================================================================
// 2. GESTIÓN DE HORARIOS DE EXÁMENES (AGENDA)
// ============================================================================

export async function loadCrmSchedules() {
  const token = getAdminToken();
  if (!token || !crmSchedulesTableBody) return;

  const dateFilter = crmScheduleDateFilter ? crmScheduleDateFilter.value : '';
  const url = dateFilter 
    ? `${getBackendUrl()}/admin/crm/schedules?date=${encodeURIComponent(dateFilter)}`
    : `${getBackendUrl()}/admin/crm/schedules`;

  try {
    const res = await fetch(url, {
      headers: { 'x-admin-token': token }
    });

    if (res.ok) {
      allSchedulesCache = await res.json();
      renderSchedulesTable(allSchedulesCache);
      updateCrmCounters(allSchedulesCache, allClientsCache);
    }
  } catch (err) {
    console.error('Error cargando agenda de exámenes:', err);
  }
}

function renderSchedulesTable(schedules) {
  if (!crmSchedulesTableBody) return;

  if (crmSchedulesBadge) {
    crmSchedulesBadge.textContent = `${schedules.length} Programados`;
  }

  if (schedules.length === 0) {
    crmSchedulesTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="table-placeholder">No hay exámenes programados para esta fecha.</td>
      </tr>
    `;
    return;
  }

  crmSchedulesTableBody.innerHTML = '';
  schedules.forEach(sch => {
    const tr = document.createElement('tr');

    const isLow = sch.isLowCredits === true;
    const isUnlimited = sch.isUnlimited === true;
    const creditsAvail = isUnlimited ? '✨ Ilimitado' : `${sch.creditsAvailable} créditos`;

    const creditBadge = isUnlimited
      ? `<span class="badge-credits unlimited">Ilimitado</span>`
      : isLow
        ? `<span class="badge-credits standard" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700;">⚠️ ${sch.creditsAvailable} cr (FALTAN)</span>`
        : `<span class="badge-credits standard" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">✅ ${sch.creditsAvailable} cr (OK)</span>`;

    let statusBadge = '';
    if (sch.status === 'completed') {
      statusBadge = `<span style="font-size: 11px; padding: 3px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.2); color: #34d399; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.4);">✅ Realizado</span>`;
    } else if (sch.status === 'in_progress') {
      statusBadge = `<span style="font-size: 11px; padding: 3px 8px; border-radius: 4px; background: rgba(245, 158, 11, 0.25); color: #fbbf24; font-weight: 700; border: 1px solid rgba(245, 158, 11, 0.5);">⚡ En curso</span>`;
    } else if (sch.status === 'cancelled') {
      statusBadge = `<span style="font-size: 11px; padding: 3px 8px; border-radius: 4px; background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);">❌ Cancelado</span>`;
    } else if (sch.notified15m) {
      statusBadge = `<span style="font-size: 11px; padding: 3px 8px; border-radius: 4px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4);">🔔 Avisado 15m</span>`;
    } else {
      statusBadge = `<span style="font-size: 11px; padding: 3px 8px; border-radius: 4px; background: rgba(255, 255, 255, 0.08); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.15);">🕒 Pendiente</span>`;
    }

    const toggleStatusBtn = sch.status === 'completed'
      ? `<button class="btn btn-sm btn-change-status" data-id="${sch.id}" data-status="scheduled" title="Reabrir examen a pendiente" style="padding: 4px 8px; font-size: 11px; background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 4px; cursor: pointer; margin-right: 4px;">Reabrir</button>`
      : `<button class="btn btn-sm btn-change-status" data-id="${sch.id}" data-status="completed" title="Marcar examen como realizado" style="padding: 4px 8px; font-size: 11px; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 4px; cursor: pointer; margin-right: 4px;">Completar</button>`;

    const studentDisplay = sch.phone
      ? `<a href="https://wa.me/${sch.phone.replace(/[^\d]/g, '')}" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 600;">${sch.studentName} ↗</a>`
      : `<span style="font-weight: 600; color: #f8fafc;">${sch.studentName}</span>`;

    tr.innerHTML = `
      <td data-label="Fecha & Hora" style="font-family: monospace; font-size: 13px; color: #e2e8f0;">
        <strong>${sch.examDate}</strong> <span style="color: #60a5fa; font-weight: 700; margin-left: 4px;">${sch.startTime}</span>
      </td>
      <td data-label="Estudiante">
        ${studentDisplay}
        <div style="font-size: 11px; color: #64748b; font-family: monospace;">ID: ${sch.userId}</div>
      </td>
      <td data-label="Curso / Materia" style="font-weight: 600; color: #cbd5e1;">${sch.course}</td>
      <td data-label="Créditos Req." style="color: #94a3b8; font-size: 13px;">${sch.estimatedCredits} preguntas</td>
      <td data-label="Saldo Actual en DB">${creditBadge}</td>
      <td data-label="Estado">${statusBadge}</td>
      <td data-label="Acciones">
        <button class="btn btn-sm btn-delete-schedule" data-id="${sch.id}" style="padding: 4px 10px; font-size: 11px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 4px; cursor: pointer;">Eliminar</button>
      </td>
    `;

    crmSchedulesTableBody.appendChild(tr);
  });
}

// Botones de filtro de fecha
if (crmScheduleTodayBtn && crmScheduleDateFilter) {
  const todayStr = getLocalDateStr();
  crmScheduleDateFilter.value = todayStr;

  crmScheduleTodayBtn.addEventListener('click', () => {
    crmScheduleDateFilter.value = todayStr;
    loadCrmSchedules();
  });

  crmScheduleDateFilter.addEventListener('change', () => {
    loadCrmSchedules();
  });
}

// Botón Nuevo Examen
if (crmScheduleNewBtn) {
  crmScheduleNewBtn.addEventListener('click', () => {
    if (modalSchedule) {
      modalScheduleForm.reset();
      schIdInput.value = '';
      schDate.value = crmScheduleDateFilter ? crmScheduleDateFilter.value : getLocalDateStr();
      modalSchedule.style.display = 'flex';
    }
  });
}

if (modalScheduleCancel) {
  modalScheduleCancel.addEventListener('click', () => {
    if (modalSchedule) modalSchedule.style.display = 'none';
  });
}

// Guardar Examen en Agenda
if (modalScheduleForm) {
  modalScheduleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAdminToken();

    const payload = {
      id: schIdInput.value || undefined,
      userId: schUserId.value.trim(),
      studentName: schStudentName.value.trim(),
      course: schCourse.value.trim(),
      examDate: schDate.value,
      startTime: schTime.value,
      estimatedCredits: parseInt(schCredits.value, 10) || 20,
      notes: schNotes.value.trim()
    };

    try {
      const res = await fetch(`${getBackendUrl()}/admin/crm/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        modalSchedule.style.display = 'none';
        loadCrmSchedules();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Error al guardar horario: ' + err.message);
    }
  });
}

// Eliminar Examen Agendado
if (crmSchedulesTableBody) {
  crmSchedulesTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete-schedule');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (!id || !confirm('¿Deseas eliminar este examen de la agenda?')) return;

    const token = getAdminToken();
    try {
      const res = await fetch(`${getBackendUrl()}/admin/crm/schedules/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) {
        loadCrmSchedules();
      }
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  });
}

// ============================================================================
// 3. DIRECTORIO CRM DE ESTUDIANTES
// ============================================================================

export async function loadCrmClients() {
  const token = getAdminToken();
  if (!token || !crmClientsTableBody) return;

  try {
    const res = await fetch(`${getBackendUrl()}/admin/crm/clients`, {
      headers: { 'x-admin-token': token }
    });

    if (res.ok) {
      allClientsCache = await res.json();
      renderClientsTable(allClientsCache);
      updateCrmCounters(allSchedulesCache, allClientsCache);
    }
  } catch (err) {
    console.error('Error cargando clientes CRM:', err);
  }
}

function renderClientsTable(clients) {
  if (!crmClientsTableBody) return;

  const term = crmClientsSearch ? crmClientsSearch.value.toLowerCase().trim() : '';
  let filtered = clients;
  if (term) {
    filtered = clients.filter(c => {
      const id = (c.userId || c._id || '').toLowerCase();
      const name = (c.studentName || '').toLowerCase();
      const phone = (c.phone || '').toLowerCase();
      const uni = (c.university || '').toLowerCase();
      return id.includes(term) || name.includes(term) || phone.includes(term) || uni.includes(term);
    });
  }

  if (filtered.length === 0) {
    crmClientsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="table-placeholder">No hay alumnos registrados con ese criterio.</td>
      </tr>
    `;
    return;
  }

  crmClientsTableBody.innerHTML = '';
  filtered.forEach(c => {
    const tr = document.createElement('tr');
    const isUnlimited = c.isUnlimited === true;
    const credits = typeof c.credits === 'number' ? c.credits : 0;

    const creditBadge = isUnlimited
      ? `<span class="badge-credits unlimited">✨ Ilimitado</span>`
      : credits <= 5
        ? `<span class="badge-credits standard" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);">${credits} cr (Bajo)</span>`
        : `<span class="badge-credits standard">${credits} créditos</span>`;

    const phoneDisplay = c.phone
      ? `<a href="https://wa.me/${c.phone.replace(/[^\d]/g, '')}" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 500;">📱 ${c.phone} ↗</a>`
      : `<span style="color: #64748b; font-size: 12px;">Sin registrar</span>`;

    tr.innerHTML = `
      <td data-label="Estudiante" style="font-weight: 700; color: #f8fafc;">
        ${c.studentName || c.userId}
        ${c.alias ? `<span style="font-size: 11px; color: #94a3b8; font-weight: 400; display: block;">(${c.alias})</span>` : ''}
      </td>
      <td data-label="ID de Cuenta" style="font-family: monospace; font-size: 12.5px; color: #93c5fd;">${c.userId}</td>
      <td data-label="WhatsApp">${phoneDisplay}</td>
      <td data-label="Universidad / Carrera" style="font-size: 12.5px; color: #cbd5e1;">${c.university || 'N/A'}</td>
      <td data-label="Saldo">${creditBadge}</td>
      <td data-label="Notas" style="font-size: 12px; color: #94a3b8; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${c.notes || ''}">${c.notes || '-'}</td>
      <td data-label="Acciones">
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          <button class="btn btn-sm btn-recharge-quick" data-user="${c.userId}" data-amount="50" style="padding: 3px 7px; font-size: 10.5px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3);">+50</button>
          <button class="btn btn-sm btn-recharge-quick" data-user="${c.userId}" data-amount="100" style="padding: 3px 7px; font-size: 10.5px; background: rgba(16, 185, 129, 0.2); color: #34d399; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3);">+100</button>
          <button class="btn btn-sm btn-schedule-for-user" data-user="${c.userId}" data-name="${c.studentName || c.userId}" style="padding: 3px 7px; font-size: 10.5px; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.3);">+ Examen</button>
          <button class="btn btn-sm btn-edit-client" data-user="${c.userId}" style="padding: 3px 7px; font-size: 10.5px; background: rgba(255, 255, 255, 0.08); color: #cbd5e1; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.15);">Editar</button>
        </div>
      </td>
    `;

    crmClientsTableBody.appendChild(tr);
  });
}

if (crmClientsSearch) {
  crmClientsSearch.addEventListener('input', () => {
    renderClientsTable(allClientsCache);
  });
}

// Botón Nuevo Alumno
if (crmClientNewBtn) {
  crmClientNewBtn.addEventListener('click', () => {
    if (modalClient) {
      modalClientForm.reset();
      cliUserId.removeAttribute('readonly');
      modalClient.style.display = 'flex';
    }
  });
}

if (modalClientCancel) {
  modalClientCancel.addEventListener('click', () => {
    if (modalClient) modalClient.style.display = 'none';
  });
}

// Guardar Ficha CRM
if (modalClientForm) {
  modalClientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getAdminToken();

    const payload = {
      userId: cliUserId.value.trim(),
      studentName: cliStudentName.value.trim(),
      phone: cliPhone.value.trim(),
      university: cliUniversity.value.trim(),
      credits: cliCredits.value !== '' ? parseInt(cliCredits.value, 10) : undefined,
      notes: cliNotes.value.trim()
    };

    try {
      const res = await fetch(`${getBackendUrl()}/admin/crm/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        modalClient.style.display = 'none';
        loadCrmClients();
        loadCrmSchedules();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Error al guardar cliente: ' + err.message);
    }
  });
}

// Delegación de eventos en tabla de clientes (Recarga rápida, Programar, Editar)
if (crmClientsTableBody) {
  crmClientsTableBody.addEventListener('click', async (e) => {
    const rechargeBtn = e.target.closest('.btn-recharge-quick');
    if (rechargeBtn) {
      const userId = rechargeBtn.getAttribute('data-user');
      const amount = parseInt(rechargeBtn.getAttribute('data-amount'), 10) || 50;
      if (!userId) return;

      const client = allClientsCache.find(c => c.userId === userId || c._id === userId);
      const current = client ? (client.credits || 0) : 0;
      const target = current + amount;

      try {
        const res = await fetch(`${getBackendUrl()}/credits/set`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, credits: target })
        });
        if (res.ok) {
          loadCrmClients();
          loadCrmSchedules();
        }
      } catch (err) {
        alert('Error en recarga rápida: ' + err.message);
      }
      return;
    }

    const scheduleBtn = e.target.closest('.btn-schedule-for-user');
    if (scheduleBtn) {
      const userId = scheduleBtn.getAttribute('data-user');
      const studentName = scheduleBtn.getAttribute('data-name');
      if (modalSchedule) {
        modalScheduleForm.reset();
        schIdInput.value = '';
        schUserId.value = userId;
        schStudentName.value = studentName || userId;
        schDate.value = getLocalDateStr();
        modalSchedule.style.display = 'flex';
      }
      return;
    }

    const editBtn = e.target.closest('.btn-edit-client');
    if (editBtn) {
      const userId = editBtn.getAttribute('data-user');
      const client = allClientsCache.find(c => c.userId === userId || c._id === userId);
      if (client && modalClient) {
        cliUserId.value = client.userId || client._id;
        cliUserId.setAttribute('readonly', 'true');
        cliStudentName.value = client.studentName || '';
        cliPhone.value = client.phone || '';
        cliUniversity.value = client.university || '';
        cliCredits.value = client.credits !== undefined ? client.credits : 0;
        cliNotes.value = client.notes || '';
        modalClient.style.display = 'flex';
      }
    }
  });
}

// ============================================================================
// 4. CONTADORES Y ACTUALIZACIÓN GENERAL
// ============================================================================

function updateCrmCounters(schedules, clients) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayExams = schedules.filter(s => s.examDate === todayStr);

  if (crmStatTodayExams) crmStatTodayExams.textContent = todayExams.length;

  const uniqueStudents = new Set(todayExams.map(s => s.userId));
  if (crmStatTodayStudents) crmStatTodayStudents.textContent = uniqueStudents.size;

  let lowCreditsCount = 0;
  todayExams.forEach(ex => {
    if (ex.isLowCredits === true) lowCreditsCount++;
  });

  if (crmStatLowCredits) {
    crmStatLowCredits.textContent = lowCreditsCount;
    crmStatLowCredits.style.color = lowCreditsCount > 0 ? '#f87171' : '#34d399';
  }
}

export function loadCrmData() {
  loadWhatsAppStatus();
  loadCrmSchedules();
  loadCrmClients();
}

// Carga inicial y timer de sondeo
window.addEventListener('DOMContentLoaded', () => {
  loadCrmData();
  setInterval(loadCrmData, 10000);
});

// Refrescar al hacer clic en la pestaña CRM
const navCrm = document.getElementById('nav-crm');
if (navCrm) {
  navCrm.addEventListener('click', () => {
    setTimeout(loadCrmData, 100);
  });
}
