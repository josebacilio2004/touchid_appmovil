import"./web_dashboard-Dtp3Omdk.js";var e=localStorage.getItem(`touchid_backend_url`)||`https://touchid-backend.onrender.com`,t=localStorage.getItem(`touchid_admin_token`)||``,n=null,r=document.getElementById(`lock-screen`),i=document.getElementById(`lock-form`),a=document.getElementById(`lock-password`),o=document.getElementById(`lock-error-msg`),s=document.getElementById(`main-layout`),c=document.getElementById(`sidebar`),l=document.getElementById(`sidebar-backdrop`),u=document.getElementById(`mobile-menu-btn`),d=document.querySelectorAll(`.nav-item`),f=document.querySelectorAll(`.tab-content`),p=document.getElementById(`current-tab-title`),m=document.getElementById(`db-status-text`),h=document.getElementById(`db-status-badge`),g=document.getElementById(`server-status-badge`);document.getElementById(`stat-total`),document.getElementById(`stat-users`),document.getElementById(`stat-lic-active`),document.getElementById(`stat-lic-used`);var _=document.getElementById(`hist-stat-total`),v=document.getElementById(`hist-stat-credits`),y=document.getElementById(`hist-stat-rate`),b=document.getElementById(`dom-stat-total`),x=document.getElementById(`dom-stat-portals`),S=document.getElementById(`dom-stat-strategy`),C=document.getElementById(`dom-inspections-feed`),w=document.getElementById(`dom-search-input`),T=document.getElementById(`dom-refresh-btn`),E=document.getElementById(`dom-clear-btn`),D=document.getElementById(`bank-stat-total`),O=document.getElementById(`bank-stat-courses`),k=document.getElementById(`bank-stat-active-course`),A=document.getElementById(`bank-course-list`),j=document.getElementById(`bank-subject-label`),M=document.getElementById(`bank-subject-count`),N=document.getElementById(`bank-search-input`),ee=document.getElementById(`bank-refresh-btn`),P=document.getElementById(`bank-copy-all-btn`),te=document.getElementById(`bank-export-excel-btn`),ne=document.getElementById(`bank-export-btn`),F=document.getElementById(`bank-questions-feed`),I=document.getElementById(`users-credit-table-body`),L=document.getElementById(`users-credit-search`),R=document.getElementById(`sandbox-html-input`),z=document.getElementById(`sandbox-parse-btn`),re=document.getElementById(`sandbox-load-udabol-btn`),ie=document.getElementById(`sandbox-load-moodle-btn`),ae=document.getElementById(`sandbox-result-box`),oe=document.getElementById(`sbx-strategy`),se=document.getElementById(`sbx-dompath`),ce=document.getElementById(`sbx-question`),le=document.getElementById(`sbx-options`),B=document.getElementById(`live-question-feed`),V=document.getElementById(`history-table-body`),ue=document.getElementById(`history-search`),H=document.getElementById(`licenses-table-body`),de=document.getElementById(`config-form`),fe=document.getElementById(`cfg-backend-url`),pe=document.getElementById(`cfg-admin-token`),me=document.getElementById(`logout-btn`),he=document.getElementById(`license-form`),ge=document.getElementById(`lic-credits`),_e=document.getElementById(`new-license-display`),ve=document.getElementById(`new-license-code`),U=document.getElementById(`copy-new-lic-btn`),W=``;async function ye(t){if(!t)return!1;try{let n=await fetch(`${e}/admin/verify`,{method:`POST`,headers:{"Content-Type":`application/json`,"x-admin-token":t}});return n.ok?(W=``,!0):(W=n.status===503?`Base de datos o túnel no disponible (Error 503). Verifica que el túnel esté levantado.`:n.status===401?`Clave incorrecta. Inténtalo de nuevo.`:`Error de respuesta del servidor (HTTP ${n.status}).`,!1)}catch(t){return console.error(`Error verificando token:`,t),W=`No se pudo conectar con el servidor backend (${e}).`,!1}}async function G(){fe.value=e,pe.value=t,await ye(t)?(r.style.display=`none`,s.style.display=`flex`,h.className=`connection-status online`,m.textContent=`Conectado`,g.className=`api-status`,g.textContent=`Servidor Conectado`,be(),n&&clearInterval(n),n=setInterval(be,8e3)):(r.style.display=`flex`,s.style.display=`none`,h.className=`connection-status offline`,m.textContent=`Bloqueado`,g.className=`api-status inactive`,g.textContent=`Servidor Desconectado`)}i.addEventListener(`submit`,async e=>{e.preventDefault();let n=a.value.trim();o.style.display=`none`,await ye(n)?(t=n,localStorage.setItem(`touchid_admin_token`,n),a.value=``,G()):(o.textContent=W||`Clave incorrecta. Inténtalo de nuevo.`,o.style.display=`block`)}),me.addEventListener(`click`,()=>{localStorage.removeItem(`touchid_admin_token`),t=``,n&&clearInterval(n),window.location.reload()});var K=[];async function be(){loadStats(),Ce(),xe(),we(),Te(),Ne()}var q=[];async function xe(){if(I)try{let n=await fetch(`${e}/admin/users`,{headers:{"x-admin-token":t}});n.ok&&(q=await n.json(),Se(q))}catch(e){console.error(`Error al cargar usuarios y créditos:`,e)}}function Se(e){if(!I)return;let t=L?L.value.toLowerCase().trim():``,n=e;if(t&&(n=e.filter(e=>{let n=(e._id||e.userId||``).toLowerCase(),r=(e.email||``).toLowerCase(),i=(e.name||``).toLowerCase();return n.includes(t)||r.includes(t)||i.includes(t)})),n.length===0){I.innerHTML=`
      <tr>
        <td colspan="5" class="table-placeholder">No hay usuarios registrados con ese filtro.</td>
      </tr>
    `;return}I.innerHTML=``,n.forEach(e=>{let t=document.createElement(`tr`),n=e._id||e.userId||`Desconocido`,r=e.isUnlimited===!0||e.credits!==void 0&&e.credits>=999999,i=typeof e.credits==`number`?e.credits:0,a=n===`unlimited_user_touchid`||n.includes(`74934503`),o=``;o=r?`<span class="badge chip-gold" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700; padding: 4px 10px; border-radius: 12px;">✨ Ilimitado</span>`:i>0?`<span style="font-weight: 700; color: #34d399; font-size: 15px; display: inline-flex; align-items: center; gap: 4px;">
        <span>${i.toLocaleString()}</span>
        <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">cr</span>
      </span>`:`<span style="font-weight: 700; color: #f87171; font-size: 14px;">0 cr (Agotado)</span>`;let s=``;s=r?`<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24;">VIP Ilimitado</span>`:i>0?`<span class="badge badge-active">Activo</span>`:`<span class="badge badge-used" style="background: rgba(239, 68, 68, 0.15); color: #f87171;">Sin Créditos</span>`;let c=e.updatedAt?new Date(e.updatedAt).toLocaleString([],{dateStyle:`short`,timeStyle:`short`}):`—`;t.innerHTML=`
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-family: monospace; font-size: 13px; font-weight: 600; color: #f8fafc;">${Y(n)}</span>
          ${a?`<span class="badge" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; font-size: 10px; padding: 1px 6px;">ADMIN</span>`:``}
        </div>
      </td>
      <td>${o}</td>
      <td>${s}</td>
      <td style="color: #94a3b8; font-size: 12.5px;">${c}</td>
      <td>
        <button class="btn btn-quick-recharge" data-user="${Y(n)}" style="padding: 4px 10px; font-size: 11.5px; height: auto; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 6px;">
          + Recargar
        </button>
      </td>
    `,I.appendChild(t)})}I&&I.addEventListener(`click`,e=>{let t=e.target.closest(`.btn-quick-recharge`);if(t){let e=t.getAttribute(`data-user`),n=document.getElementById(`direct-user-id`),r=document.getElementById(`direct-credits`);e&&n&&(n.value=e,r&&r.focus(),n.scrollIntoView({behavior:`smooth`,block:`center`}),n.style.borderColor=`#38bdf8`,setTimeout(()=>{n.style.borderColor=``},2e3))}}),L&&L.addEventListener(`input`,()=>{Se(q)});async function Ce(){try{let n=await fetch(`${e}/admin/licenses`,{headers:{"x-admin-token":t}});n.ok&&Ee(await n.json())}catch(e){console.error(`Error al cargar licencias:`,e)}}async function we(){try{let n=await fetch(`${e}/admin/history`,{headers:{"x-admin-token":t}});if(n.ok){let e=await n.json();De(e),Oe(e)}}catch(e){console.error(`Error al cargar historial:`,e)}}async function Te(){if(C)try{let n=await fetch(`${e}/admin/dom-inspections`,{headers:{"x-admin-token":t}});n.ok&&(K=await n.json(),X(K))}catch(e){console.error(`Error al cargar inspecciones DOM:`,e)}}function Ee(e){if(e.length===0){H.innerHTML=`
      <tr>
        <td colspan="5" class="table-placeholder">No hay licencias registradas aún.</td>
      </tr>
    `;return}H.innerHTML=``,e.forEach(e=>{let t=document.createElement(`tr`),n=e.status===`used`?`<span style="background: rgba(239, 68, 68, 0.12); color: var(--color-red); padding: 4px 10px; border-radius: 6px; font-weight:600; font-size:12px;">Canjeado</span>`:`<span style="background: rgba(16, 185, 129, 0.12); color: var(--color-green); padding: 4px 10px; border-radius: 6px; font-weight:600; font-size:12px;">Disponible</span>`,r=e.usedBy||`<span style="color: var(--text-secondary);">—</span>`,i=`—`;if(e.usedAt){let t=new Date(e.usedAt);i=t.toLocaleDateString()+` `+t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})}t.innerHTML=`
      <td data-label="Código" style="font-family: monospace; font-weight: 700; color: #fff;">
        <span>${e.code}</span>
        <button class="copy-cell-btn" data-code="${e.code}" title="Copiar código">Copiar</button>
      </td>
      <td data-label="Créditos" style="font-weight: 600; color: #60a5fa;">${e.credits}</td>
      <td data-label="Estado">${n}</td>
      <td data-label="Canjeado Por" style="font-family: monospace; font-size: 13px;">${r}</td>
      <td data-label="Fecha Canje" style="font-size: 12.5px; color: var(--text-secondary);">${i}</td>
    `,H.appendChild(t)})}function De(e){let t=0;if(e.forEach(e=>{let n=e.creditsUsed===void 0?1:e.creditsUsed;t+=n}),_&&(_.textContent=e.length),v&&(v.textContent=t),y&&(y.textContent=`${e.length>0?(t/e.length).toFixed(1):`1.0`} cr / rpta`),e.length===0){V.innerHTML=`
      <tr>
        <td colspan="6" class="table-placeholder">No hay preguntas resueltas aún.</td>
      </tr>
    `;return}V.innerHTML=``,e.forEach(e=>{let t=document.createElement(`tr`),n=new Date(e.timestamp||Date.now()),r=n.toLocaleDateString()+` `+n.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),i=e.creditsUsed===void 0?1:e.creditsUsed,a=e.userType===`ilimitado`||i===0?`<span class="badge-credits unlimited">0 cr (Ilimitado)</span>`:`<span class="badge-credits standard">${i} crédito</span>`;t.innerHTML=`
      <td data-label="Fecha" class="row-date">${r}</td>
      <td data-label="Materia" class="row-subject"><span class="row-subject">${e.subject||`General`}</span></td>
      <td data-label="Pregunta" class="row-question" title="${e.question}">${e.question}</td>
      <td data-label="Respuesta" class="row-answer">${e.answer}</td>
      <td data-label="Créditos" class="row-credits">${a}</td>
      <td data-label="Origen" class="row-source">${e.source===`chrome_extension`?`PC`:`Móvil`}</td>
    `,V.appendChild(t)})}function Oe(e){if(e.length===0){B.innerHTML=`
      <div class="feed-placeholder">
        <p>Esperando interacciones de los clientes...</p>
      </div>
    `;return}let t=e.slice(0,5);B.innerHTML=``,t.forEach(e=>{let t=document.createElement(`div`);t.className=`feed-item`;let n=new Date(e.timestamp||Date.now()).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),r=(e.options||[]).map((t,n)=>`<div class="feed-option ${t===e.answer||n===e.answerIndex?`correct`:``}">${t}</div>`).join(``);t.innerHTML=`
      <div class="feed-meta">
        <span class="feed-subject">${e.subject||`General`}</span>
        <span class="feed-source">${e.source===`chrome_extension`?`Chrome PC`:`App Móvil`} • ${n}</span>
      </div>
      <div class="feed-question">${e.question}</div>
      <div class="feed-options">
        ${r}
      </div>
      <div class="feed-explanation">
        <strong>Explicación:</strong> ${e.explanation||`Respuesta sugerida por IA.`}
      </div>
    `,B.appendChild(t)})}he.addEventListener(`submit`,async n=>{n.preventDefault();let r=Math.max(1,parseInt(ge.value,10));try{let n=await fetch(`${e}/admin/licenses`,{method:`POST`,headers:{"Content-Type":`application/json`,"x-admin-token":t},body:JSON.stringify({credits:r})});if(n.ok)ve.textContent=(await n.json()).code,_e.style.display=`block`,Ce(),loadStats();else{let e=await n.json();alert(`Error: `+e.error)}}catch(e){alert(`Error al conectar con el servidor: `+e.message)}}),U.addEventListener(`click`,()=>{navigator.clipboard.writeText(ve.textContent).then(()=>{let e=U.textContent;U.textContent=`¡Copiado!`,U.style.background=`var(--color-green)`,setTimeout(()=>{U.textContent=e,U.style.background=`var(--color-blue)`},2e3)})}),d.forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=e.getAttribute(`href`).substring(1);d.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),f.forEach(e=>{e.id===`tab-${n}`?e.classList.add(`active`):e.classList.remove(`active`)}),p.textContent=e.textContent.trim(),c&&l&&(c.classList.remove(`open`),l.classList.remove(`active`))})}),de.addEventListener(`submit`,n=>{n.preventDefault();let r=fe.value.trim(),i=pe.value.trim();localStorage.setItem(`touchid_backend_url`,r),localStorage.setItem(`touchid_admin_token`,i),e=r,t=i,alert(`Ajustes de conexión guardados correctamente.`),G()}),ue.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim();V.querySelectorAll(`tr`).forEach(e=>{let n=e.querySelector(`.row-question`)?.textContent.toLowerCase()||``,r=e.querySelector(`.row-subject`)?.textContent.toLowerCase()||``,i=e.querySelector(`.row-answer`)?.textContent.toLowerCase()||``;n.includes(t)||r.includes(t)||i.includes(t)?e.style.display=``:e.style.display=`none`})});function ke(){let e=window.location.hash;if(e){let t=document.querySelector(`.nav-item[href="${e}"]`);t&&t.click()}}G().then(()=>{ke()}),window.addEventListener(`hashchange`,ke),document.querySelectorAll(`.btn-chip`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-target`),n=e.getAttribute(`data-val`),r=document.getElementById(t);r&&(r.value=n)})});var Ae=document.getElementById(`direct-credit-form`),je=document.getElementById(`direct-user-id`),Me=document.getElementById(`direct-credits`),J=document.getElementById(`direct-credit-msg`);Ae&&Ae.addEventListener(`submit`,async n=>{n.preventDefault();let r=je.value.trim(),i=Math.max(0,parseInt(Me.value,10));if(r){J.style.display=`block`,J.style.background=`rgba(59, 130, 246, 0.15)`,J.style.border=`1px solid rgba(59, 130, 246, 0.3)`,J.style.color=`#93c5fd`,J.textContent=`Asignando créditos a `+r+`...`;try{let n=await fetch(`${e}/credits/set`,{method:`POST`,headers:{"Content-Type":`application/json`,"x-admin-token":t},body:JSON.stringify({userId:r,credits:i,adminKey:t})}),a=await n.json();n.ok?(J.style.background=`rgba(16, 185, 129, 0.15)`,J.style.border=`1px solid rgba(16, 185, 129, 0.3)`,J.style.color=`#6ee7b7`,J.textContent=`✅ Éxito: Se asignaron ${i.toLocaleString()} créditos a ${r}`,loadStats()):(J.style.background=`rgba(239, 68, 68, 0.15)`,J.style.border=`1px solid rgba(239, 68, 68, 0.3)`,J.style.color=`#fca5a5`,J.textContent=`❌ Error: ${a.error||`No se pudo actualizar los créditos`}`)}catch(e){J.style.background=`rgba(239, 68, 68, 0.15)`,J.style.border=`1px solid rgba(239, 68, 68, 0.3)`,J.style.color=`#fca5a5`,J.textContent=`❌ Error de red: ${e.message}`}}}),u&&c&&l&&(u.addEventListener(`click`,e=>{e.stopPropagation(),c.classList.toggle(`open`),l.classList.toggle(`active`)}),l.addEventListener(`click`,()=>{c.classList.remove(`open`),l.classList.remove(`active`)})),H&&H.addEventListener(`click`,e=>{let t=e.target.closest(`.copy-cell-btn`);if(t){let e=t.getAttribute(`data-code`);e&&navigator.clipboard.writeText(e).then(()=>{let e=t.textContent;t.textContent=`¡Copiado!`,t.style.background=`var(--color-green)`,t.style.color=`#fff`,setTimeout(()=>{t.textContent=e,t.style.background=``,t.style.color=``},1800)})}});function Y(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function X(e){if(!C)return;b&&(b.textContent=e.length);let t=new Set,n={};if(e.forEach(e=>{if(e.url&&e.url!==`N/A`)try{let n=new URL(e.url.startsWith(`http`)?e.url:`https://${e.url}`);t.add(n.hostname.replace(`www.`,``))}catch{t.add(e.url)}let r=e.strategy||`desconocida`;n[r]=(n[r]||0)+1}),x&&(x.textContent=t.size||+(e.length>0)),S){let e=`—`,t=0;for(let[r,i]of Object.entries(n))i>t&&(t=i,e=r);S.textContent=e.replace(/_/g,` `),S.title=e}if(e.length===0){C.innerHTML=`
      <div class="card" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
        <p style="font-size: 15px; margin-bottom: 8px; color: #fff;">No hay capturas DOM registradas aún.</p>
        <p style="font-size: 13px;">Al resolver cuestionarios desde la aplicación móvil o simulador, los detalles del DOM analizado (enunciados, alternativas, breadcrumbs) aparecerán automáticamente aquí.</p>
      </div>
    `;return}C.innerHTML=``,e.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`dom-card`,n.setAttribute(`data-id`,e.id||t);let r=e.isSuccess!==!1&&!e.errorReason;r||(n.style.borderLeft=`4px solid #ef4444`);let i=(e.url||``).toLowerCase(),a=`<span class="dom-portal-badge badge-generic">Web Exam</span>`,o=`Plataforma Web`;i.includes(`udabol`)?(a=`<span class="dom-portal-badge badge-udabol">UDABOL Oficial</span>`,o=`UDABOL (Carpeta Verde)`):i.includes(`moodle`)||i.includes(`continental`)?(a=`<span class="dom-portal-badge badge-moodle">Moodle / Univ</span>`,o=`Campus Virtual Moodle`):(i.includes(`quiz`)||i.includes(`touchid`)||i.includes(`github.io`))&&(a=`<span class="dom-portal-badge badge-simulator">Simulador TouchID</span>`,o=`Banco de Preguntas`);let s=r?`<span class="dom-portal-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3);">✓ Resuelto con Éxito</span>`:`<span class="dom-portal-badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: rgba(239, 68, 68, 0.3);">⚠️ Sin Respuesta / Error</span>`,c=e.course?`<span class="dom-portal-badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; border-color: rgba(168, 85, 247, 0.3);">📖 ${Y(e.course)}</span>`:``,l=new Date(e.timestamp||Date.now()),u=l.toLocaleDateString()+` `+l.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),d=(e.strategy||`Heurística Estándar`).replace(/_/g,` `),f=e.domPath||`body > form > div.pregunta`,p=(e.options||[]).map((t,n)=>{let r=t===e.answer||n===e.answerIndex||e.answerLetter&&String.fromCharCode(65+n)===e.answerLetter;return`<span class="dom-opt-pill ${r?`is-answer`:``}">${r?`✓ `:``}${Y(t)}</span>`}).join(``),m=e.rawQuestionHtml?Y(e.rawQuestionHtml):``,h=m.trim().length>0;n.innerHTML=`
      <div class="dom-card-header">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          ${a}
          ${c}
          ${s}
          <span style="font-weight: 700; color: #fff; font-size: 14px;">${o}</span>
          <span class="dom-strategy-tag">⚙ ${Y(d)}</span>
        </div>
        <div class="dom-meta-info">
          <span>${e.userId||`anon`} • ${u}</span>
        </div>
      </div>

      <div style="font-size: 12px; color: #94a3b8; word-break: break-all; margin-bottom: 6px;">
        <strong>URL:</strong> <a href="${Y(e.url)}" target="_blank" style="color: #38bdf8; text-decoration: none;">${Y(e.url)}</a>
      </div>

      ${!r&&e.errorReason?`
      <div style="margin: 8px 0; padding: 10px 14px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; border-radius: 6px; font-size: 12.5px; color: #fca5a5;">
        <strong>Diagnóstico de Extracción:</strong> ${Y(e.errorReason)}
      </div>
      `:``}

      <div class="dom-breadcrumb-path">
        📍 <strong>Ruta Jerárquica DOM:</strong> ${Y(f)}
      </div>

      <div class="dom-question-box">
        ${Y(e.question)}
      </div>

      <div style="margin: 8px 0;">
        <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Alternativas Extraídas (${e.options?e.options.length:0}):</span>
        <div class="dom-options-pills">
          ${p||`<span style="color: var(--text-secondary); font-size: 12px;">No se detectaron alternativas estructuradas.</span>`}
        </div>
      </div>

      ${e.answer?`
      <div style="margin-top: 6px; font-size: 13px; color: #34d399; font-weight: 600;">
        ✨ Respuesta IA: <span style="color: #fff;">${e.answerLetter?`[`+Y(e.answerLetter)+`] `:``}${Y(e.answer)}</span>
        ${e.explanation?`<div style="font-size: 12px; color: #94a3b8; font-weight: normal; margin-top: 2px;">${Y(e.explanation)}</div>`:``}
      </div>
      `:``}

      ${h?`
      <div style="margin-top: 14px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
        <button type="button" class="accordion-toggle" data-target="raw-${t}">
          <span>▶ Ver Estructura HTML Cruda (DOM Snippet para Auditoría)</span>
        </button>
        <div class="accordion-content" id="raw-${t}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; color: #94a3b8;">Fragmento HTML extraído del portal de examen (${e.radiosCount||0} radios, ${e.formsCount||0} forms):</span>
            <button class="copy-cell-btn btn-copy-html" style="margin: 0;">Copiar HTML</button>
          </div>
          <pre class="dom-code-box"><code>${m}</code></pre>
        </div>
      </div>
      `:``}
    `,C.appendChild(n)})}C&&C.addEventListener(`click`,e=>{let t=e.target.closest(`.accordion-toggle`);if(t){let e=t.getAttribute(`data-target`),n=document.getElementById(e);if(n){n.classList.toggle(`open`);let e=t.querySelector(`span`);e&&(e.textContent=n.classList.contains(`open`)?`▼ Ocultar Estructura HTML Cruda`:`▶ Ver Estructura HTML Cruda (DOM Snippet)`)}return}let n=e.target.closest(`.btn-copy-html`);if(n){let e=n.closest(`.accordion-content`).querySelector(`code`);e&&navigator.clipboard.writeText(e.textContent).then(()=>{let e=n.textContent;n.textContent=`¡Copiado!`,n.style.background=`var(--color-green)`,setTimeout(()=>{n.textContent=e,n.style.background=``},1800)})}}),w&&w.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim();K&&X(K.filter(e=>{let n=(e.question||``).toLowerCase(),r=(e.url||``).toLowerCase(),i=(e.strategy||``).toLowerCase(),a=(e.domPath||``).toLowerCase();return n.includes(t)||r.includes(t)||i.includes(t)||a.includes(t)}))}),T&&T.addEventListener(`click`,()=>{Te()}),E&&E.addEventListener(`click`,async()=>{if(confirm(`¿Deseas vaciar todos los registros de inspección DOM guardados?`))try{(await fetch(`${e}/admin/dom-inspections`,{method:`DELETE`,headers:{"x-admin-token":t}})).ok&&(K=[],X([]),alert(`Registros de inspección DOM eliminados con éxito.`))}catch(e){alert(`Error: `+e.message)}});var Z=[],Q=`all`;async function Ne(){if(F)try{let n=await fetch(`${e}/admin/question-bank`,{headers:{"x-admin-token":t}}),r=[],i=[];if(n.ok){let e=await n.json();r=e.questions||[],i=e.courses||[]}else{let n=await fetch(`${e}/admin/history`,{headers:{"x-admin-token":t}});if(n.ok){let e=await n.json(),t=new Set;r=e.map(e=>{let n=e.subject||`General`;t.add(n);let r=(e.options||[]).map((e,t)=>({id:String.fromCharCode(65+t),text:e}));return{id:e.id,question:e.question,alternatives:r,answer:e.answerIndex!==void 0&&e.answerIndex>=0?String.fromCharCode(65+e.answerIndex):e.answer||`A`,answerText:e.answer||``,explanation:e.explanation||``,course:n,timestamp:e.timestamp}}),i=Array.from(t)}}Z=r;let a={};Z.forEach(e=>{let t=e.course||`General`;a[t]=(a[t]||0)+1,i.includes(t)||i.push(t)}),i.sort((e,t)=>(a[t]||0)-(a[e]||0)),D&&(D.textContent=Z.length),O&&(O.textContent=i.length),Pe(i,a),$()}catch(e){console.error(`Error al cargar Banco de Preguntas:`,e)}}function Pe(e,t){if(!A)return;let n=Z.length,r=`
    <div class="bank-course-item ${Q===`all`?`active`:``}" data-course="all" style="padding: 10px 14px; border-radius: 8px; cursor: pointer; background: ${Q===`all`?`rgba(56, 189, 248, 0.2)`:`rgba(255, 255, 255, 0.03)`}; border: 1px solid ${Q===`all`?`rgba(56, 189, 248, 0.4)`:`transparent`}; color: ${Q===`all`?`#38bdf8`:`#cbd5e1`}; font-weight: 600; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span>Todas las materias</span>
      <span class="badge" style="background: rgba(56, 189, 248, 0.25); color: #38bdf8; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${n}</span>
    </div>
  `;e.forEach(e=>{let n=Q===e,i=t[e]||0;r+=`
      <div class="bank-course-item ${n?`active`:``}" data-course="${Y(e)}" style="padding: 9px 14px; border-radius: 8px; cursor: pointer; background: ${n?`rgba(56, 189, 248, 0.2)`:`rgba(255, 255, 255, 0.03)`}; border: 1px solid ${n?`rgba(56, 189, 248, 0.4)`:`transparent`}; color: ${n?`#38bdf8`:`#cbd5e1`}; font-weight: 500; font-size: 13px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px;" title="${Y(e)}">📁 ${Y(e)}</span>
        <span class="badge" style="background: rgba(255, 255, 255, 0.08); color: #94a3b8; padding: 2px 7px; border-radius: 12px; font-size: 11px;">${i}</span>
      </div>
    `}),A.innerHTML=r,A.querySelectorAll(`.bank-course-item`).forEach(e=>{e.addEventListener(`click`,()=>{Q=e.getAttribute(`data-course`),A.querySelectorAll(`.bank-course-item`).forEach(e=>{let t=e.getAttribute(`data-course`)===Q;e.style.background=t?`rgba(56, 189, 248, 0.2)`:`rgba(255, 255, 255, 0.03)`,e.style.border=t?`1px solid rgba(56, 189, 248, 0.4)`:`1px solid transparent`,e.style.color=t?`#38bdf8`:`#cbd5e1`}),$()})})}function $(){let e=N?N.value.toLowerCase().trim():``,t=Z;Q&&Q!==`all`&&(t=t.filter(e=>e.course===Q)),e&&(t=t.filter(t=>{let n=(t.question||``).toLowerCase(),r=(t.alternatives||[]).map(e=>(e.text||``).toLowerCase()).join(` `);return n.includes(e)||r.includes(e)}));let n=Q===`all`?`Todas las materias`:Q;k&&(k.textContent=n),j&&(j.textContent=`Registros: ${n}`),M&&(M.textContent=`${t.length} preguntas registradas`),Fe(t)}function Fe(e){if(F){if(e.length===0){F.innerHTML=`
      <div class="card" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
        <p style="font-size: 15px; margin-bottom: 8px; color: #fff;">No hay registros para este filtro.</p>
        <p style="font-size: 13px;">A medida que los estudiantes rindan cuestionarios con la aplicación móvil, los enunciados y alternativas aparecerán catalogados aquí automáticamente.</p>
      </div>
    `;return}F.innerHTML=``,e.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`dom-card`,n.style.borderLeft=`4px solid #38bdf8`;let r=new Date(e.timestamp||Date.now()),i=r.toLocaleDateString()+` `+r.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),a=(e.alternatives||[]).map((t,n)=>{let r=t.id===e.answer||t.text===e.answerText||e.answer&&e.answer.toUpperCase()===String.fromCharCode(65+n);return`
        <div style="display: flex; align-items: flex-start; gap: 8px; padding: 6px 10px; margin-bottom: 4px; border-radius: 6px; background: ${r?`rgba(16, 185, 129, 0.12)`:`rgba(255, 255, 255, 0.03)`}; border: 1px solid ${r?`rgba(16, 185, 129, 0.35)`:`transparent`};">
          <span style="font-weight: 700; color: ${r?`#34d399`:`#94a3b8`}; min-width: 24px;">[${Y(t.id||String.fromCharCode(65+n))}]</span>
          <span style="color: ${r?`#f0fdf4`:`#cbd5e1`}; font-size: 13px; font-weight: ${r?`600`:`400`}; flex: 1;">${Y(t.text)}</span>
          ${r?`<span style="color: #34d399; font-size: 12px; font-weight: 700;">✓ Correcta</span>`:``}
        </div>
      `}).join(``);n.innerHTML=`
      <div class="dom-card-header">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="dom-portal-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border-color: rgba(56, 189, 248, 0.3);">
            📁 Materia: ${Y(e.course||`General`)}
          </span>
          <span style="font-weight: 700; color: #fff; font-size: 14px;">Registro #${t+1}</span>
        </div>
        <div class="dom-meta-info">
          <span>${Y(e.userId||`móvil`)} • ${i}</span>
        </div>
      </div>

      <div style="font-size: 14.5px; font-weight: 700; color: #f8fafc; line-height: 1.4; margin: 10px 0 12px;">
        ${Y(e.question)}
      </div>

      ${e.images&&e.images.length>0?`
        <div style="margin-bottom: 12px;">
          ${e.images.map(e=>`<img src="${Y(e.src)}" alt="${Y(e.alt)}" style="max-height: 200px; max-width: 100%; border-radius: 8px; border: 1px solid var(--card-border);">`).join(``)}
        </div>
      `:``}

      <div style="margin-bottom: 10px;">
        <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Alternativas Registradas (${e.alternatives?e.alternatives.length:0}):</span>
        <div style="margin-top: 6px;">
          ${a||`<p style="color: #94a3b8; font-size: 13px;">Sin alternativas estructuradas.</p>`}
        </div>
      </div>

      ${e.explanation?`
        <div style="padding: 8px 12px; background: rgba(59, 130, 246, 0.08); border-left: 3px solid #3b82f6; border-radius: 4px; font-size: 12px; color: #93c5fd; margin-top: 6px;">
          💡 <strong>Respuesta IA:</strong> ${Y(e.explanation)}
        </div>
      `:``}

      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
        <button class="btn btn-copy-single-record" data-idx="${t}" style="height: 30px; font-size: 11.5px; padding: 0 12px; background: rgba(255,255,255,0.08); color: #cbd5e1;">Copiar Registro</button>
        <button class="btn btn-delete-question" data-id="${e.id}" style="height: 30px; font-size: 11.5px; padding: 0 12px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);">Eliminar</button>
      </div>
    `,F.appendChild(n)})}}N&&N.addEventListener(`input`,()=>{$()}),ee&&ee.addEventListener(`click`,()=>{Ne()}),P&&P.addEventListener(`click`,()=>{let e=Z;if(Q&&Q!==`all`&&(e=e.filter(e=>e.course===Q)),e.length===0){alert(`No hay registros para copiar en esta materia.`);return}let t=Q===`all`?`Todas las materias`:Q,n=`==================================================
`;n+=`BANCO DE REGISTROS DE PREGUNTAS Y ALTERNATIVAS
`,n+=`Materia: ${t}\n`,n+=`Total Registros: ${e.length}\n`,n+=`Fecha de exportación: ${new Date().toLocaleString()}\n`,n+=`==================================================

`,e.forEach((e,t)=>{n+=`[REGISTRO #${t+1}] - Materia: ${e.course||`General`}\n`,n+=`ENUNCIADO: ${e.question}\n`,n+=`ALTERNATIVAS:
`,(e.alternatives||[]).forEach((t,r)=>{let i=t.id||String.fromCharCode(65+r),a=t.id===e.answer||t.text===e.answerText||e.answer&&e.answer.toUpperCase()===String.fromCharCode(65+r);n+=`  ${i}) ${t.text} ${a?` [CORRECTA]`:``}\n`}),n+=`RESPUESTA: ${e.answer||``} - ${e.answerText||``}\n`,e.explanation&&(n+=`EXPLICACIÓN: ${e.explanation}\n`),n+=`--------------------------------------------------

`}),navigator.clipboard.writeText(n).then(()=>{let t=P.textContent;P.textContent=`¡${e.length} Registros Copiados!`,P.style.background=`rgba(16, 185, 129, 0.25)`,P.style.color=`#34d399`,setTimeout(()=>{P.textContent=t,P.style.background=``,P.style.color=``},2500)})}),te&&te.addEventListener(`click`,()=>{let e=Z;if(Q&&Q!==`all`&&(e=e.filter(e=>e.course===Q)),e.length===0){alert(`No hay registros disponibles para exportar a Excel.`);return}let t=[`N°`,`Materia`,`Enunciado de la Pregunta`,`Alternativa A`,`Alternativa B`,`Alternativa C`,`Alternativa D`,`Alternativa E`,`Clave Correcta`,`Texto Respuesta Correcta`,`Justificación IA`,`Fecha de Captura`];function n(e){return e==null?`""`:`"${String(e).replace(/"/g,`""`).replace(/\r?\n/g,` `)}"`}let r=[t.map(n).join(`,`)];e.forEach((e,t)=>{let i=e.alternatives||[],a=e=>i[e]?i[e].text:``,o=[t+1,e.course||`General`,e.question||``,a(0),a(1),a(2),a(3),a(4),e.answer||``,e.answerText||``,e.explanation||``,e.timestamp?new Date(e.timestamp).toLocaleString():``];r.push(o.map(n).join(`,`))});let i=new Blob([`﻿`+r.join(`\r
`)],{type:`text/csv;charset=utf-8;`}),a=URL.createObjectURL(i),o=document.createElement(`a`);o.setAttribute(`href`,a);let s=(Q||`todas`).toLowerCase().replace(/[^a-z0-9]/g,`_`);o.setAttribute(`download`,`Banco_Preguntas_${s}_${Date.now()}.csv`),document.body.appendChild(o),o.click(),o.remove(),URL.revokeObjectURL(a)}),ne&&ne.addEventListener(`click`,()=>{let e=Z;if(Q&&Q!==`all`&&(e=e.filter(e=>e.course===Q)),e.length===0){alert(`No hay registros disponibles para exportar.`);return}let t=`data:text/json;charset=utf-8,`+encodeURIComponent(JSON.stringify(e,null,2)),n=document.createElement(`a`);n.setAttribute(`href`,t);let r=(Q||`todas`).toLowerCase().replace(/[^a-z0-9]/g,`_`);n.setAttribute(`download`,`banco_${r}_${Date.now()}.json`),document.body.appendChild(n),n.click(),n.remove()}),F&&F.addEventListener(`click`,async n=>{let r=n.target.closest(`.btn-copy-single-record`);if(r){let e=parseInt(r.getAttribute(`data-idx`),10),t=Z;Q&&Q!==`all`&&(t=t.filter(e=>e.course===Q));let n=t[e];if(n){let e=`Materia: ${n.course||`General`}\nPregunta: ${n.question}\nAlternativas:\n`;(n.alternatives||[]).forEach((t,r)=>{let i=t.id||String.fromCharCode(65+r),a=t.id===n.answer||t.text===n.answerText||n.answer&&n.answer.toUpperCase()===String.fromCharCode(65+r);e+=`${i}) ${t.text} ${a?` [CORRECTA]`:``}\n`}),e+=`Respuesta: ${n.answer||``} - ${n.answerText||``}\n`,navigator.clipboard.writeText(e).then(()=>{let e=r.textContent;r.textContent=`¡Copiado!`,setTimeout(()=>{r.textContent=e},1800)})}return}let i=n.target.closest(`.btn-delete-question`);if(i){let n=i.getAttribute(`data-id`);if(!n||!confirm(`¿Deseas eliminar este registro del banco de preguntas?`))return;try{(await fetch(`${e}/admin/question-bank/${n}`,{method:`DELETE`,headers:{"x-admin-token":t}})).ok&&(Z=Z.filter(e=>e.id!==n),$())}catch(e){console.error(`Error al eliminar registro:`,e)}}});function Ie(e){let t=new DOMParser().parseFromString(e,`text/html`);function n(e){return e?e.replace(/\s+/g,` `).trim():``}var r=[/\b(TouchID|Quiz\s+Simulator|Banco\s+de\s+Preguntas|Simulador\s+de\s+Ex[áa]menes)[^\n\r]*/gi,/\b(Modo:\s*[^\n\r]*|Ir\s+al\s+Dashboard[^\n\r]*)/gi,/\b(CARPETA\s+PEDAG[OÓ]GICA\s+DIGITAL|CARPETA\s+PEDAG[OÓ]GICA|UDABOL|UNIVERSIDAD\s+DE\s+AQUINO)[^\n\r]*/gi,/\b(1P|2P|3P|FINAL|EXAMEN\s*\d*|PARCIAL|MED-\d+)[^\n\r]*/gi,/\b(Respondidas|Sin responder|Respondida)\b/gi,/\bPregunta\s+nro\.?\s*\d+\b/gi,/\bPregunta\s+\d+\s+de\s+\d+\b/gi,/\bTIEMPO\s+RESTANTE\b[\s\S]*?(?=(?:Pregunta|Siguiente|$))/gi,/\b(Minutos|Segundos)\b/gi,/\b(Punt[uú]a\s+como|Puntaje|Sobre\s+\d+|Se[ñn]alar\s+con\s+bandera|Marcar\s+con\s+bandera)\b[^\n\r]*/gi,/\b(Enunciado\s+de\s+la\s+pregunta)\b/gi,/\b(Resolver\s+con\s+IA|Siguiente|Anterior|Finalizar|Terminar\s+intento)\b/gi,/[✔✓]\s*[^\n\r]*/gi];function i(e){var t=e||``;return r.forEach(e=>{t=t.replace(e,` `)}),t=t.replace(/\b\d{1,2}:\d{2}\b/g,` `),t=t.replace(/(?:^|\s)\d{1,2}(?=\s|$)/g,` `),n(t)}function a(e){if(!e||!e.parentNode)return``;for(var t=[],n=e;n&&n.nodeType===1&&n.tagName.toLowerCase()!==`html`&&t.length<6;){var r=n.tagName.toLowerCase();if(n.id)r+=`#`+n.id;else if(n.className&&typeof n.className==`string`){var i=n.className.trim().split(/\s+/).filter(e=>e&&!e.includes(`:`)).slice(0,2).join(`.`);i&&(r+=`.`+i)}t.unshift(r),n=n.parentNode}return t.join(` > `)}for(var o=``,s=[],c=`ninguna`,l=null,u=[`#question-text`,`.question-box`,`.qtext`,`.formulation .qtext`,`[class*="question-text"]`,`[class*="enunciado"]`,`[class*="pregunta-texto"]`,`.que .content .qtext`,`.question_content`,`.freebirdFormviewerViewNumberedItemHeader`],d=0;d<u.length;d++){var f=t.querySelector(u[d]);if(f){var p=n(f.innerText||f.textContent);if(p.length>5){var m=i(p);if(m.length>5&&!/CARPETA\s+PEDAG/i.test(m)){o=m,c=`Selector Dedicado (${u[d]})`,l=f;break}}}}for(var h=[`#options-container .option-item`,`.options-list .option-item`,`.option-item`,`.option-card`,`[class*="option-item"]`,`[class*="option-card"]`,`[role="radio"]`],g=0;g<h.length;g++){var _=t.querySelectorAll(h[g]);if(_&&_.length>=2){var v=[];if(_.forEach(e=>{var t=e.cloneNode(!0),r=t.querySelector(`.option-index, [class*="index"], [class*="letter"]`);r&&r.remove();var i=n(t.innerText||t.textContent).replace(/^[A-Za-z0-9][\.\)\-]\s*/,``).trim();i&&v.indexOf(i)===-1&&v.push(i)}),v.length>=2){s=v,c===`ninguna`&&(c=`Tarjetas de Opción (${h[g]})`);break}}}var y=Array.from(t.querySelectorAll(`input[type="radio"], input[type="checkbox"]`));function b(e){if(e.id){var r=t.querySelector(`label[for="`+e.id+`"]`);if(r){var i=n(r.innerText||r.textContent);if(i)return i}}var a=e.closest(`label`);if(a){var o=n(a.innerText||a.textContent);if(o)return o}var s=e.nextElementSibling;if(s){var c=n(s.innerText||s.textContent);if(c)return c}var l=e.closest(`.answer, .r0, .r1, .opcion, .option, li, div, p`);if(l){var u=l.cloneNode(!0);u.querySelectorAll(`input, button`).forEach(e=>e.remove());var d=n(u.innerText||u.textContent);if(d)return d}return``}if(s.length<2&&y.length>0){var x=y,S=x[0].name,C=x.filter(e=>!S||e.name===S);if(C.length<2&&(C=x),C.forEach(e=>{var t=b(e).replace(/^[A-Za-z0-9][\.\)\-]\s*/,``).trim();t&&s.indexOf(t)===-1&&s.push(t)}),o.length<5){var w=C[0].closest(`.form-group, .opcion, .option, li, tr, div, p`);if(w&&w.parentElement)for(var T=w.previousElementSibling;T;){var E=i(n(T.innerText||T.textContent));if(E.length>5&&s.indexOf(E)===-1&&!/CARPETA\s+PEDAG/i.test(E)){o=E,c=`Hermano Previo al Input (Algoritmo UDABOL)`,l=T;break}T=T.previousElementSibling}if(o.length<5){var D=C[0].closest(`.que, .multichoice, fieldset, .question, form, .card`)||C[0].parentElement;if(D){var O=D.innerText||D.textContent||``;s.forEach(e=>{O=O.split(e).join(``)}),o=i(O),c=`Contenedor Padre Strip`,l=D}}}}if(s.length<2||o.length<5){for(var k=(t.body.innerText||t.body.textContent||``).split(/[\r\n]+/).map(e=>e.trim()).filter(e=>e.length>0),A=[],j=0;j<k.length;j++){var M=k[j];/^\d{1,2}$/.test(M)||/^\d{1,2}:\d{2}$/.test(M)||/^(CARPETA\s+PEDAG[OÓ]GICA|UDABOL|UNIVERSIDAD)/i.test(M)||A.push(M)}if(A.length>=2&&(o.length<5&&(o=A[0],c=`Respaldo Semántico de Líneas`),s.length<2))for(var N=1;N<A.length;N++)s.push(A[N])}return{question:o||`No se pudo extraer el enunciado`,options:s,strategy:c,domPath:l?a(l):`root > body`}}z&&z.addEventListener(`click`,()=>{let e=(R?.value||``).trim();if(!e){alert(`Por favor pega un fragmento HTML para analizar.`);return}let t=Ie(e);oe.textContent=t.strategy,se.textContent=t.domPath,ce.textContent=t.question,le.innerHTML=``,t.options.length>0?t.options.forEach((e,t)=>{let n=document.createElement(`div`);n.style.cssText=`padding: 8px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: #e2e8f0; font-size: 13px;`,n.textContent=`${String.fromCharCode(65+t)}) ${e}`,le.appendChild(n)}):le.innerHTML=`<span style="color: #f87171; font-size: 13px;">No se detectaron alternativas en este fragmento.</span>`,ae.style.display=`block`}),re&&re.addEventListener(`click`,()=>{R.value=`<div class="header-portal">CARPETA PEDAGOGICA DIGITAL - UNIVERSIDAD DE AQUINO BOLIVIA</div>
<div class="exam-title">MED-202-11390: Embriología II - Examen 2-2025</div>
<div class="question-container">
  <div class="enunciado-pregunta">ANTES DEL NACIMIENTO LOS PULMONES ESTAN LLENOS DE:</div>
  <div class="form-group"><label><input type="radio" name="resp_1" value="1"> AIRE RESIDUAL</label></div>
  <div class="form-group"><label><input type="radio" name="resp_1" value="2"> LIQUIDO PULMONAR CON ALTO CONTENIDO DE CLORO</label></div>
  <div class="form-group"><label><input type="radio" name="resp_1" value="3"> SANGRE OXIGENADA</label></div>
  <div class="form-group"><label><input type="radio" name="resp_1" value="4"> MECONIO FETAL</label></div>
</div>`,z.click()}),ie&&ie.addEventListener(`click`,()=>{R.value=`<div class="que multichoice deferredfeedback notyetanswered">
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
</div>`,z.click()});