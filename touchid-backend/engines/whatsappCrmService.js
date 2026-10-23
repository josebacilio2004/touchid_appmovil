const { default: makeWASocket, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const { useMongoAuthState } = require('./mongoBaileysAuth');

class WhatsAppCrmService {
  constructor() {
    this.sock = null;
    this.db = null;
    this.status = 'disconnected'; // 'disconnected' | 'connecting' | 'qr_ready' | 'connected'
    this.qrCode = null; // DataURL en base64 para mostrar en el Dashboard Web
    this.qrRaw = null;
    this.connectedNumber = null;
    this.adminPhone = process.env.ADMIN_WHATSAPP_PHONE || ''; // Número de teléfono del Admin
    this.schedulerInterval = null;
    this.recentLowCreditAlerts = new Map(); // userId -> timestamp de último aviso
    this.recentExamStartAlerts = new Map(); // userId -> timestamp de último aviso
    this.isReconnecting = false;
  }

  /**
   * Inicializar el servicio con la base de datos de MongoDB
   */
  async init(database) {
    this.db = database;
    if (!this.db) {
      console.warn('⚠️ [WHATSAPP-CRM] Base de datos no disponible aún.');
      return;
    }

    // Cargar número de admin guardado en base de datos si existe
    try {
      const configDoc = await this.db.collection('admin_config').findOne({ _id: 'whatsapp_config' });
      if (configDoc && configDoc.adminPhone) {
        this.adminPhone = configDoc.adminPhone;
      }
    } catch (e) {
      console.warn('⚠️ [WHATSAPP-CRM] No se pudo leer admin_config:', e.message);
    }

    // Iniciar conexión Baileys
    await this.startSocket();

    // Iniciar planificador de alertas automáticas cada 60 segundos
    if (!this.schedulerInterval) {
      this.schedulerInterval = setInterval(() => this.runExamAlertScheduler(), 60000);
      // Ejecutar una primera pasada a los 10 segundos
      setTimeout(() => this.runExamAlertScheduler(), 10000);
    }
  }

  /**
   * Conectar o reconectar el socket de Baileys
   */
  async startSocket() {
    if (this.isReconnecting) return;
    this.isReconnecting = true;
    this.status = 'connecting';

    try {
      const authCollection = this.db.collection('whatsapp_auth');
      const { state, saveCreds, clearAuth } = await useMongoAuthState(authCollection);
      this.clearAuthFn = clearAuth;

      const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ['TouchID CRM', 'Chrome', '1.0.0'],
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 30000,
        syncFullHistory: false
      });

      this.sock = sock;

      // Escuchar actualización de credenciales para persistir en MongoDB
      sock.ev.on('creds.update', saveCreds);

      // Escuchar cambios en la conexión
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrRaw = qr;
          this.status = 'qr_ready';
          try {
            this.qrCode = await QRCode.toDataURL(qr, { scale: 8, margin: 2 });
          } catch (qrErr) {
            console.error('Error generando DataURL del QR:', qrErr);
          }
          console.log('📲 [WHATSAPP-CRM] Código QR generado. Escanéalo en el Dashboard Web o terminal.');
        }

        if (connection === 'close') {
          this.status = 'disconnected';
          this.qrCode = null;
          this.connectedNumber = null;
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          
          console.warn(`⚠️ [WHATSAPP-CRM] Conexión cerrada. Código: ${statusCode}. ¿Reconectar?: ${shouldReconnect}`);

          if (statusCode === DisconnectReason.loggedOut) {
            console.warn('🔒 [WHATSAPP-CRM] Sesión cerrada desde el celular. Limpiando credenciales...');
            if (this.clearAuthFn) await this.clearAuthFn();
          }

          this.isReconnecting = false;
          if (shouldReconnect) {
            setTimeout(() => this.startSocket(), 5000);
          }
        } else if (connection === 'open') {
          this.status = 'connected';
          this.qrCode = null;
          this.qrRaw = null;
          this.isReconnecting = false;
          this.connectedNumber = sock.user?.id?.split(':')[0] || sock.user?.id || 'Desconocido';
          console.log(`✅ [WHATSAPP-CRM] Conectado exitosamente como: ${this.connectedNumber}`);

          // Si no hay adminPhone configurado, auto-asignar el número conectado
          if (!this.adminPhone && this.connectedNumber) {
            await this.setAdminPhone(this.connectedNumber);
          }

          // Enviar mensaje de bienvenida al Admin confirmando operatividad
          this.sendAdminMessage(`🚀 *TouchID CRM Bot Conectado*\nSistema listo para monitoreo de exámenes y recargas.\nEscribe */ayuda* para ver los comandos disponibles.`);
        }
      });

      // Escuchar mensajes entrantes (comandos de WhatsApp)
      sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
          if (!msg.message) continue;
          await this.handleIncomingMessage(msg);
        }
      });

    } catch (err) {
      console.error('❌ [WHATSAPP-CRM] Error inicializando socket Baileys:', err);
      this.status = 'disconnected';
      this.isReconnecting = false;
      setTimeout(() => this.startSocket(), 15000);
    }
  }

  /**
   * Verificar si un mensaje proviene del administrador
   */
  isAdminMessage(msg) {
    if (msg.key.fromMe) return true; // Enviado desde tu propio WhatsApp
    const sender = (msg.key.participant || msg.key.remoteJid || '').replace(/@.+/, '');
    const cleanAdmin = (this.adminPhone || '').replace(/[^\d]/g, '');
    if (cleanAdmin && sender.includes(cleanAdmin)) return true;
    return false;
  }

  /**
   * Procesar mensajes de comando
   */
  async handleIncomingMessage(msg) {
    try {
      const remoteJid = msg.key.remoteJid;
      if (!remoteJid || remoteJid.endsWith('@g.us')) {
        // Ignorar grupos a menos que sea comando directo
      }

      // Extraer texto del mensaje
      const body = msg.message.conversation ||
                   msg.message.extendedTextMessage?.text ||
                   msg.message.imageMessage?.caption ||
                   '';

      const trimmed = body.trim();
      if (!trimmed.startsWith('/')) return; // Solo comandos

      // Verificar autorización (solo para ti)
      if (!this.isAdminMessage(msg)) {
        console.warn(`[WHATSAPP-CRM] Intento de comando no autorizado desde ${remoteJid}`);
        return;
      }

      const reply = async (text) => {
        await this.sock.sendMessage(remoteJid, { text });
      };

      const [commandRaw, ...argsList] = trimmed.split(/\s+/);
      const command = commandRaw.toLowerCase();
      const rawArgs = argsList.join(' ').trim();

      switch (command) {
        case '/ayuda':
        case '/help':
        case '/start':
          await reply(this.getHelpMessage());
          break;

        case '/hoy':
        case '/agenda':
          await this.handleCmdAgenda(reply);
          break;

        case '/buscar':
        case '/alumno':
          await this.handleCmdBuscar(rawArgs, reply);
          break;

        case '/recargar':
          await this.handleCmdRecargar(rawArgs, reply);
          break;

        case '/licencia':
          await this.handleCmdLicencia(rawArgs, reply);
          break;

        case '/agendar':
          await this.handleCmdAgendar(rawArgs, reply);
          break;

        case '/vivo':
        case '/live':
          await this.handleCmdVivo(reply);
          break;

        case '/saldo':
          await this.handleCmdSaldo(rawArgs, reply);
          break;

        default:
          await reply(`❓ Comando no reconocido: *${command}*\nEscribe */ayuda* para ver la lista de comandos.`);
          break;
      }
    } catch (err) {
      console.error('[WHATSAPP-CRM] Error procesando comando:', err);
    }
  }

  getHelpMessage() {
    return (
      `📋 *TouchID CRM - Panel de Control WhatsApp*\n\n` +
      `• */hoy* o */agenda* - Exámenes de hoy y estado de créditos.\n` +
      `• */buscar <nombre/id>* - Ficha del alumno, teléfono y saldo.\n` +
      `• */recargar <id/nombre> <créditos>* - Asignar créditos directo (ej: */recargar camila 50*).\n` +
      `• */licencia <créditos>* - Generar código prepago (ej: */licencia 100*).\n` +
      `• */agendar <alumno> | <curso> | <hora>* - Programar examen hoy (ej: */agendar Camila | Semiología | 16:30*).\n` +
      `• */vivo* - Alumnos respondiendo preguntas ahora.\n` +
      `• */saldo <alumno>* - Consulta rápida de saldo.\n`
    );
  }

  // --- COMANDO: /hoy /agenda ---
  async handleCmdAgenda(reply) {
    if (!this.db) return reply('⚠️ Base de datos no disponible.');
    const todayStr = new Date().toISOString().split('T')[0];

    const exams = await this.db.collection('exam_schedules')
      .find({ examDate: todayStr })
      .sort({ startTime: 1 })
      .toArray();

    if (exams.length === 0) {
      return reply(`📅 *Agenda de Hoy (${todayStr})*\n\nNo hay exámenes programados para hoy.\nPuedes registrar uno con:\n*/agendar Nombre | Curso | 16:00*`);
    }

    let msg = `📅 *Exámenes de Hoy (${todayStr})* (${exams.length})\n\n`;

    for (const ex of exams) {
      // Buscar saldo actual del alumno en users
      const user = await this.db.collection('users').findOne({
        $or: [{ _id: ex.userId }, { userId: ex.userId }]
      });

      const credits = user ? (user.isUnlimited ? '∞' : (user.credits || 0)) : 0;
      const isLow = !user?.isUnlimited && credits < (ex.estimatedCredits || 20);

      const statusIcon = isLow ? '🔴' : '🟢';
      const creditNote = isLow 
        ? `⚠️ *FALTAN CRÉDITOS* (${credits}/${ex.estimatedCredits || 20})`
        : `Saldo: *${credits}* cr ✅`;

      msg += `${statusIcon} *${ex.startTime || 'Hora N/A'}* - *${ex.studentName || ex.userId}*\n`;
      msg += `   📚 Curso: ${ex.course}\n`;
      msg += `   👤 ID: \`${ex.userId}\`\n`;
      msg += `   💰 ${creditNote}\n\n`;
    }

    msg += `💡 Para recargar rápido: */recargar <nombre> <cantidad>*`;
    await reply(msg);
  }

  // --- COMANDO: /buscar <término> ---
  async handleCmdBuscar(query, reply) {
    if (!query) return reply('⚠️ Escribe el nombre, correo o ID a buscar.\nEj: */buscar camila*');
    if (!this.db) return reply('⚠️ Base de datos no disponible.');

    const regex = new RegExp(query.trim(), 'i');
    const users = await this.db.collection('users').find({
      $or: [
        { _id: regex },
        { userId: regex },
        { studentName: regex },
        { alias: regex },
        { email: regex },
        { phone: regex }
      ]
    }).limit(6).toArray();

    if (users.length === 0) {
      return reply(`🔍 No se encontraron alumnos con: "${query}"`);
    }

    let msg = `🔍 *Resultados para:* "${query}" (${users.length})\n\n`;
    for (const u of users) {
      const name = u.studentName || u.name || u.alias || u._id;
      const credits = u.isUnlimited ? '✨ Ilimitado' : `${u.credits || 0} créditos`;
      const phone = u.phone ? `📱 ${u.phone}` : '📱 Sin teléfono';
      const uni = u.university ? `🎓 ${u.university}` : '';

      msg += `👤 *${name}*\n`;
      msg += `   • ID: \`${u._id}\`\n`;
      msg += `   • Saldo: *${credits}*\n`;
      msg += `   • ${phone} ${uni}\n`;
      if (u.notes) msg += `   • Nota: _${u.notes}_\n`;
      msg += `\n`;
    }

    msg += `💡 Recargar: */recargar ${users[0]._id} 50*`;
    await reply(msg);
  }

  // --- COMANDO: /recargar <alumno> <créditos> ---
  async handleCmdRecargar(args, reply) {
    if (!args) return reply('⚠️ Formato: */recargar <id_o_nombre> <créditos>*\nEj: */recargar camila 50*');
    if (!this.db) return reply('⚠️ Base de datos no disponible.');

    const parts = args.split(/\s+/);
    if (parts.length < 2) return reply('⚠️ Debes indicar el alumno y la cantidad.\nEj: */recargar camila 50*');

    const creditsToAdd = parseInt(parts[parts.length - 1], 10);
    if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
      return reply('⚠️ La cantidad de créditos debe ser un número mayor a 0.');
    }

    const userQuery = parts.slice(0, parts.length - 1).join(' ').trim();
    const regex = new RegExp(`^${userQuery}$`, 'i');
    const partialRegex = new RegExp(userQuery, 'i');

    let user = await this.db.collection('users').findOne({
      $or: [{ _id: regex }, { userId: regex }, { studentName: regex }, { alias: regex }]
    });

    if (!user) {
      user = await this.db.collection('users').findOne({
        $or: [{ _id: partialRegex }, { studentName: partialRegex }, { alias: partialRegex }]
      });
    }

    if (!user) {
      return reply(`❌ No se encontró ningún alumno con el nombre o ID: "${userQuery}"`);
    }

    const isUnlimited = creditsToAdd >= 999999;
    await this.db.collection('users').updateOne(
      { _id: user._id },
      {
        $inc: { credits: isUnlimited ? 0 : creditsToAdd },
        $set: {
          isUnlimited: isUnlimited ? true : (user.isUnlimited || false),
          updatedAt: new Date()
        }
      }
    );

    const updated = await this.db.collection('users').findOne({ _id: user._id });
    const name = updated.studentName || updated.name || updated._id;
    const newBal = updated.isUnlimited ? '✨ Ilimitado' : `${updated.credits} créditos`;

    await reply(
      `✅ *Recarga Exitosa*\n\n` +
      `👤 Alumno: *${name}*\n` +
      `🆔 ID: \`${updated._id}\`\n` +
      `➕ Añadidos: *+${creditsToAdd.toLocaleString()} créditos*\n` +
      `💰 Saldo actual: *${newBal}*\n` +
      `🕒 Fecha: ${new Date().toLocaleTimeString()}`
    );
  }

  // --- COMANDO: /licencia <créditos> ---
  async handleCmdLicencia(args, reply) {
    if (!this.db) return reply('⚠️ Base de datos no disponible.');
    const credits = parseInt(args.trim(), 10) || 50;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `LIC-${credits}-${rand}`;

    await this.db.collection('licenses').insertOne({
      _id: code,
      code,
      credits,
      status: 'unused',
      usedBy: '',
      usedAt: null,
      createdAt: new Date(),
      source: 'whatsapp_bot'
    });

    await reply(
      `🎫 *Licencia Prepago Generada*\n\n` +
      `Código: \`${code}\`\n` +
      `Créditos: *${credits}*\n` +
      `Estado: *Libre / Sin canjear*\n\n` +
      `_Toca el código para copiarlo y enviarlo al cliente._`
    );
  }

  // --- COMANDO: /agendar <alumno> | <curso> | <hora> ---
  async handleCmdAgendar(args, reply) {
    if (!args || !args.includes('|')) {
      return reply(
        `⚠️ Formato incorrecto. Usa separador vertical |\n` +
        `Ejemplo: */agendar Camila | Semiología | 16:30*\n` +
        `O con fecha: */agendar Camila | Microbiología | 2026-10-24 10:00*`
      );
    }
    if (!this.db) return reply('⚠️ Base de datos no disponible.');

    const parts = args.split('|').map(p => p.trim());
    const studentQuery = parts[0];
    const course = parts[1] || 'General';
    const timeRaw = parts[2] || '12:00';

    let examDate = new Date().toISOString().split('T')[0];
    let startTime = timeRaw;

    if (timeRaw.includes('-') && timeRaw.includes(' ')) {
      const dtParts = timeRaw.split(/\s+/);
      examDate = dtParts[0];
      startTime = dtParts[1] || '12:00';
    }

    // Buscar al usuario
    const regex = new RegExp(studentQuery, 'i');
    let user = await this.db.collection('users').findOne({
      $or: [{ _id: regex }, { studentName: regex }, { alias: regex }]
    });

    const userId = user ? user._id : studentQuery;
    const studentName = user ? (user.studentName || user.name || user._id) : studentQuery;
    const credits = user ? (user.isUnlimited ? '∞' : (user.credits || 0)) : 0;

    const scheduleDoc = {
      userId,
      studentName,
      course,
      examDate,
      startTime,
      estimatedCredits: 20,
      status: 'scheduled',
      notified15m: false,
      notifiedStart: false,
      createdAt: new Date(),
      createdBy: 'whatsapp_bot'
    };

    const res = await this.db.collection('exam_schedules').insertOne(scheduleDoc);

    await reply(
      `📅 *Examen Agendado Exitosamente*\n\n` +
      `👤 Alumno: *${studentName}* (\`${userId}\`)\n` +
      `📚 Curso: *${course}*\n` +
      `📆 Fecha: *${examDate}*\n` +
      `⏰ Hora: *${startTime}*\n` +
      `💰 Saldo actual del alumno: *${credits} créditos*\n` +
      `🔔 Te avisaré 15 minutos antes por aquí.`
    );
  }

  // --- COMANDO: /vivo ---
  async handleCmdVivo(reply) {
    if (!this.db) return reply('⚠️ Base de datos no disponible.');

    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentHistory = await this.db.collection('history')
      .find({ timestamp: { $gte: fifteenMinsAgo } })
      .sort({ timestamp: -1 })
      .toArray();

    if (recentHistory.length === 0) {
      return reply(`💤 *Actividad en Vivo (Últimos 15 min)*\n\nNo hay alumnos resolviendo preguntas en este momento.`);
    }

    // Agrupar por usuario
    const userGroups = {};
    for (const h of recentHistory) {
      const u = h.userId || 'anon';
      if (!userGroups[u]) {
        userGroups[u] = { count: 0, subject: h.subject || 'General', lastTime: h.timestamp };
      }
      userGroups[u].count++;
    }

    let msg = `⚡ *Alumnos en Examen Ahora* (${Object.keys(userGroups).length})\n\n`;
    for (const [uid, data] of Object.entries(userGroups)) {
      const user = await this.db.collection('users').findOne({ _id: uid });
      const name = user ? (user.studentName || user.name || uid) : uid;
      const credits = user ? (user.isUnlimited ? '∞' : user.credits) : '?';
      const timeStr = new Date(data.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      msg += `🟢 *${name}* (\`${uid}\`)\n`;
      msg += `   • Materia: *${data.subject}*\n`;
      msg += `   • Preguntas resueltas (15m): *${data.count}*\n`;
      msg += `   • Saldo restante: *${credits} créditos*\n`;
      msg += `   • Última: ${timeStr}\n\n`;
    }

    await reply(msg);
  }

  // --- COMANDO: /saldo <alumno> ---
  async handleCmdSaldo(query, reply) {
    if (!query) return reply('⚠️ Indica el alumno. Ej: */saldo camila*');
    if (!this.db) return reply('⚠️ Base de datos no disponible.');

    const regex = new RegExp(query.trim(), 'i');
    const user = await this.db.collection('users').findOne({
      $or: [{ _id: regex }, { userId: regex }, { studentName: regex }, { alias: regex }]
    });

    if (!user) return reply(`❌ Alumno no encontrado: "${query}"`);

    const name = user.studentName || user.name || user._id;
    const credits = user.isUnlimited ? '✨ Ilimitado' : `${user.credits || 0} créditos`;

    await reply(
      `💰 *Saldo de Créditos*\n\n` +
      `👤 Alumno: *${name}*\n` +
      `🆔 ID: \`${user._id}\`\n` +
      `💳 Saldo: *${credits}*`
    );
  }

  // ============================================================================
  // ALERTAS PROACTIVAS Y MONITOREO
  // ============================================================================

  /**
   * Planificador ejecutado cada 60s para alertar exámenes 15 min antes
   */
  async runExamAlertScheduler() {
    if (!this.db || this.status !== 'connected') return;

    try {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMins = currentHours * 60 + currentMinutes;

      const upcomingExams = await this.db.collection('exam_schedules').find({
        examDate: todayStr,
        notified15m: { $ne: true }
      }).toArray();

      for (const ex of upcomingExams) {
        if (!ex.startTime) continue;
        const [exH, exM] = ex.startTime.split(':').map(n => parseInt(n, 10));
        if (isNaN(exH) || isNaN(exM)) continue;

        const examTotalMins = exH * 60 + exM;
        const diffMins = examTotalMins - currentTotalMins;

        // Si faltan entre 0 y 16 minutos para el inicio
        if (diffMins >= 0 && diffMins <= 16) {
          // Obtener saldo del alumno
          const user = await this.db.collection('users').findOne({
            $or: [{ _id: ex.userId }, { userId: ex.userId }]
          });

          const credits = user ? (user.isUnlimited ? 999999 : (user.credits || 0)) : 0;
          const isLow = !user?.isUnlimited && credits < (ex.estimatedCredits || 20);

          let alertMsg = `⏰ *ALERTA PRE-EXAMEN (en ~${diffMins} min)*\n\n`;
          alertMsg += `👤 *${ex.studentName || ex.userId}*\n`;
          alertMsg += `📚 Curso: *${ex.course}*\n`;
          alertMsg += `🕒 Hora inicio: *${ex.startTime}*\n`;
          alertMsg += `🆔 ID: \`${ex.userId}\`\n`;

          if (isLow) {
            alertMsg += `\n🚨 *¡ALERTA DE SALDO BAJO!*\n`;
            alertMsg += `Solo tiene *${credits} créditos* (se estiman ${ex.estimatedCredits || 20}).\n`;
            alertMsg += `👉 Para recargarle ahora, responde:\n\`/recargar ${ex.userId} 50\``;
          } else {
            alertMsg += `\n💰 Saldo: *${user?.isUnlimited ? 'Ilimitado' : credits + ' créditos'}* ✅ Todo listo.`;
          }

          await this.sendAdminMessage(alertMsg);

          // Marcar como notificado
          await this.db.collection('exam_schedules').updateOne(
            { _id: ex._id },
            { $set: { notified15m: true, notified15mAt: new Date() } }
          );
        }
      }
    } catch (err) {
      console.warn('⚠️ [WHATSAPP-CRM] Error en scheduler de exámenes:', err.message);
    }
  }

  /**
   * Hook para alertar al Admin cuando un alumno entra a responder su primer pregunta del examen
   */
  async notifyExamStart(userId, subject, creditsLeft) {
    if (!this.db || this.status !== 'connected') return;

    // Cooldown para no avisar en cada pregunta (1 aviso cada 2 horas por alumno)
    const lastNotified = this.recentExamStartAlerts.get(userId) || 0;
    if (Date.now() - lastNotified < 2 * 60 * 60 * 1000) return;
    this.recentExamStartAlerts.set(userId, Date.now());

    try {
      const user = await this.db.collection('users').findOne({ _id: userId });
      const name = user ? (user.studentName || user.name || userId) : userId;

      const msg = 
        `🚀 *INICIO DE EXAMEN DETECTADO*\n\n` +
        `👤 *${name}* (\`${userId}\`)\n` +
        `📚 Materia: *${subject || 'General'}*\n` +
        `💰 Saldo restante: *${creditsLeft} créditos*\n` +
        `🕒 Hora: ${new Date().toLocaleTimeString()}`;

      await this.sendAdminMessage(msg);
    } catch (e) {
      console.warn('⚠️ [WHATSAPP-CRM] Error notificando inicio de examen:', e.message);
    }
  }

  /**
   * Hook para alertar al Admin cuando a un alumno le quedan 3 o menos créditos durante un examen
   */
  async notifyLowCredits(userId, subject, creditsLeft) {
    if (!this.db || this.status !== 'connected') return;

    // Cooldown de 10 minutos para no spamear
    const lastNotified = this.recentLowCreditAlerts.get(userId) || 0;
    if (Date.now() - lastNotified < 10 * 60 * 1000) return;
    this.recentLowCreditAlerts.set(userId, Date.now());

    try {
      const user = await this.db.collection('users').findOne({ _id: userId });
      const name = user ? (user.studentName || user.name || userId) : userId;

      const msg = 
        `🚨 *ALERTA: CRÉDITOS CRÍTICOS EN EXAMEN*\n\n` +
        `👤 Alumno: *${name}*\n` +
        `🆔 ID: \`${userId}\`\n` +
        `📚 Materia: *${subject || 'Examen'}*\n` +
        `⚠️ Le quedan solo: *${creditsLeft} créditos*\n\n` +
        `👉 Para recargarle al instante, responde:\n` +
        `\`/recargar ${userId} 50\``;

      await this.sendAdminMessage(msg);
    } catch (e) {
      console.warn('⚠️ [WHATSAPP-CRM] Error enviando alerta de créditos bajos:', e.message);
    }
  }

  /**
   * Enviar mensaje al número del administrador
   */
  async sendAdminMessage(text) {
    if (!this.sock || this.status !== 'connected') return false;
    try {
      let targetJid = null;
      if (this.adminPhone) {
        const cleanNumber = this.adminPhone.replace(/[^\d]/g, '');
        targetJid = `${cleanNumber}@s.whatsapp.net`;
      } else if (this.sock.user?.id) {
        targetJid = this.sock.user.id.split(':')[0] + '@s.whatsapp.net';
      }

      if (!targetJid) return false;

      await this.sock.sendMessage(targetJid, { text });
      return true;
    } catch (err) {
      console.warn('⚠️ [WHATSAPP-CRM] Error enviando mensaje al admin:', err.message);
      return false;
    }
  }

  /**
   * Obtener estado actual para la API del Dashboard
   */
  getStatus() {
    return {
      status: this.status,
      connectedNumber: this.connectedNumber,
      adminPhone: this.adminPhone,
      hasQr: !!this.qrCode,
      qrCode: this.qrCode
    };
  }

  /**
   * Configurar número de administrador
   */
  async setAdminPhone(phone) {
    this.adminPhone = phone ? phone.replace(/[^\d]/g, '') : '';
    if (this.db) {
      await this.db.collection('admin_config').updateOne(
        { _id: 'whatsapp_config' },
        { $set: { adminPhone: this.adminPhone, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    return { success: true, adminPhone: this.adminPhone };
  }

  /**
   * Forzar reconexión
   */
  async reconnect() {
    if (this.sock) {
      try { this.sock.end(); } catch (e) {}
    }
    this.isReconnecting = false;
    await this.startSocket();
    return { success: true, message: 'Reconexión iniciada' };
  }

  /**
   * Cerrar sesión y desvincular
   */
  async logout() {
    if (this.sock) {
      try {
        await this.sock.logout();
      } catch (e) {}
    }
    if (this.clearAuthFn) {
      await this.clearAuthFn();
    }
    this.status = 'disconnected';
    this.qrCode = null;
    this.connectedNumber = null;
    return { success: true, message: 'Sesión de WhatsApp cerrada exitosamente' };
  }
}

// Singleton
const whatsappCrmService = new WhatsAppCrmService();
module.exports = { whatsappCrmService };
