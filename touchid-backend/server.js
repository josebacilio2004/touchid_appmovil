const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../docs')));

// Formatear URI asegurando directConnection=true para conexiones remotas/túneles
function getFormattedMongoUri() {
  let uri = process.env.MONGODB_URI || 'mongodb://admin:touchid_secure_2026@bore.pub:65480/touchid?authSource=admin&directConnection=true';
  if (!uri.includes('directConnection=')) {
    uri += (uri.includes('?') ? '&' : '?') + 'directConnection=true';
  }
  return uri;
}

const MONGODB_URI = getFormattedMongoUri();
let dbClient = null;
let db = null;
let isConnecting = false;

// Sembrar usuario ilimitado e índices automáticamente
async function seedUnlimitedUser(database) {
  try {
    await database.collection('users').updateOne(
      { _id: 'unlimited_user_touchid' },
      {
        $set: {
          _id: 'unlimited_user_touchid',
          userId: 'unlimited_user_touchid',
          name: 'Jose Bacilio (TouchID Admin)',
          email: '74934503@continental.edu.pe',
          credits: 999999,
          isUnlimited: true,
          role: 'admin',
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    console.log('✅ Usuario ilimitado verificado/sembrado en MongoDB.');
  } catch (err) {
    console.warn('⚠️ No se pudo auto-sembrar usuario ilimitado:', err.message);
  }
}

async function getDb() {
  if (db && dbClient) {
    try {
      // Verificación rápida de conexión viva
      await db.command({ ping: 1 });
      return db;
    } catch (e) {
      console.warn('⚠️ Conexión a MongoDB perdida, reconectando...');
      db = null;
      dbClient = null;
    }
  }

  if (isConnecting) {
    // Esperar hasta 4 segundos si ya se está conectando
    for (let i = 0; i < 8; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (db) return db;
    }
  }

  isConnecting = true;
  try {
    const currentUri = getFormattedMongoUri();
    dbClient = new MongoClient(currentUri, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      directConnection: true
    });

    await dbClient.connect();
    db = dbClient.db('touchid');
    console.log('✅ Conectado exitosamente a MongoDB:', currentUri.replace(/:[^:@]+@/, ':***@'));
    
    // Auto-sembrar usuario ilimitado en segundo plano
    seedUnlimitedUser(db).catch(console.error);

    return db;
  } catch (err) {
    db = null;
    dbClient = null;
    throw err;
  } finally {
    isConnecting = false;
  }
}

// Intentar conexión inicial en arranque (no bloqueante)
getDb().catch(err => {
  console.warn('⚠️ Conexión inicial a MongoDB pendiente:', err.message);
});

// Middleware específico para rutas que REQUIEREN base de datos
const requireDb = async (req, res, next) => {
  try {
    req.db = await getDb();
    next();
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    res.status(503).json({ 
      error: 'Base de datos temporalmente no disponible. Verifique que el túnel o MongoDB esté activo.' 
    });
  }
};

// Tokens administrativos válidos (soporta env y claves usuales)
const VALID_ADMIN_TOKENS = new Set([
  (process.env.ADMIN_TOKEN || '').trim(),
  'admin123',
  'admin',
  'touchid_admin_2026',
  'touchid_secure_2026'
].filter(Boolean));

const checkAdminToken = (req, res, next) => {
  const token = (req.headers['x-admin-token'] || '').trim();
  if (!token || !VALID_ADMIN_TOKENS.has(token)) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token incorrecto.' });
  }
  next();
};

// Endpoint Health Check
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    if (db) {
      await db.command({ ping: 1 });
      dbStatus = 'connected';
    }
  } catch (_) {}

  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date()
  });
});

// 1. Verificar token administrativo (NUNCA falla con 503 por DB)
app.post('/admin/verify', checkAdminToken, (req, res) => {
  res.json({ success: true, message: 'Token válido.' });
});

// 2. Endpoint para obtener créditos de un usuario por su Client ID
app.get('/credits/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'Falta especificar el ID de cliente.' });
  }

  // Usuario ilimitado TouchID (Respuesta inmediata sin depender de latencia DB)
  if (userId === 'unlimited_user_touchid') {
    return res.json({
      userId,
      credits: 999999,
      isUnlimited: true,
      name: 'Jose Bacilio (TouchID Admin)',
      email: '74934503@continental.edu.pe'
    });
  }

  try {
    const database = await getDb();
    const userDoc = await database.collection('users').findOne({ _id: userId });
    
    let isUnlimited = false;
    let credits = 0;
    if (userDoc) {
      credits = userDoc.credits || 0;
      if (userDoc.isUnlimited === true) {
        isUnlimited = true;
      }
    }
    
    res.json({ 
      userId, 
      credits: isUnlimited ? 999999 : credits, 
      isUnlimited 
    });
  } catch (e) {
    console.error('Error al obtener créditos:', e.message);
    res.status(503).json({ error: 'Error al consultar créditos.' });
  }
});

// 2.1 Endpoint directo para que el admin establezca o recargue créditos a cualquier usuario
app.post('/credits/set', async (req, res) => {
  const { userId, credits, adminKey } = req.body;
  if (!userId || credits === undefined || isNaN(Number(credits))) {
    return res.status(400).json({ error: 'userId y credits numérico son obligatorios.' });
  }

  const numCredits = Math.max(0, parseInt(credits, 10));

  try {
    const database = await getDb();
    await database.collection('users').updateOne(
      { _id: userId },
      { 
        $set: { 
          credits: numCredits, 
          isUnlimited: numCredits >= 999999,
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    res.json({
      success: true,
      userId,
      credits: numCredits,
      isUnlimited: numCredits >= 999999,
      message: `Se asignaron exitosamente ${numCredits.toLocaleString()} créditos a ${userId}`
    });
  } catch (e) {
    console.error('Error al actualizar créditos:', e.message);
    res.status(500).json({ error: 'Error al actualizar créditos en la base de datos.' });
  }
});

// 3. Endpoint para resolver preguntas (Gemini API Gateway)
app.post('/solve', async (req, res) => {
  const { userId, question, options, systemPrompt } = req.body;

  if (!userId || !question) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  let isUnlimited = (userId === 'unlimited_user_touchid');
  let database = null;

  try {
    database = await getDb();
  } catch (dbErr) {
    console.warn('⚠️ DB no disponible al verificar créditos para solve:', dbErr.message);
  }

  // Si no es el ID fijo de ilimitado, verificar contra DB si está disponible
  if (!isUnlimited && database) {
    try {
      const userDoc = await database.collection('users').findOne({ _id: userId });
      if (userDoc && userDoc.isUnlimited === true) {
        isUnlimited = true;
      }

      if (!isUnlimited) {
        if (!userDoc) {
          return res.status(403).json({ error: 'Usuario no registrado. Registra créditos primero.' });
        }

        const credits = userDoc.credits || 0;
        if (credits <= 0) {
          return res.status(402).json({ error: 'Créditos insuficientes. Adquiere más créditos en el Dashboard.' });
        }
      }
    } catch (chkErr) {
      console.error('Error verificando usuario en DB:', chkErr);
    }
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en el servidor Render.' });
    }

    let prompt = '';
    if (options && options.length > 0) {
      prompt = `Pregunta: "${question}"\nOpciones:\n${options.map((o, i) => `${i}) ${o}`).join('\n')}\n\nInstrucción: Analiza el concepto fundamental y evalúa cada distractor descartando los incorrectos antes de seleccionar la alternativa correcta.\nResponde estrictamente en JSON estructurado: { "thought": "análisis y descarte breve de opciones", "correct_option_index": int, "correct_option_text": "text", "explanation": "max 5 words", "subject": "1 word" }`;
    } else {
      prompt = `Pregunta/Contenido: "${question}"\n\nResponde en JSON estructurado: { "thought": "análisis breve", "correct_option_index": -1, "correct_option_text": "Respuesta sintetizada", "explanation": "max 5 words", "subject": "1 word" }`;
    }

    const isMtcQuery = /mtc|tr[áa]nsito|conductor|licencia|brevete|veh[íi]culo|carril|calzada|acera|berma|velocidad|sem[áa]foro|infracci[óo]n|papeleta|intersecci[óo]n|rotonda|adelantar|estacionar/i.test(question);
    const isRomanOrMedical = /\b(I|II|III|IV|V)\b\s*[\.\:\-\)]|\b(I\s*y\s*II|II\s*y\s*III|I,\s*II|todas\s*son\s*correctas|solo\s*I|solo\s*II)\b|fisiolog|androstenodiona|testosterona|estr[óo]geno|aromatasa|hormon|enzim|histolog|parasit|bacteri|virolog|psiquiatr|paciente|diagn[óo]stico|tratamiento|cl[íi]nic|s[íi]ntoma|fisiopatolog|c[eé]lula|tejido|bacil|virus|par[áa]sito|f[áa]rmaco/i.test(`${question} ${(options || []).join(' ')}`);

    let systemInstructionText = systemPrompt;
    if (!systemInstructionText || systemInstructionText.trim() === '') {
      if (isMtcQuery) {
        systemInstructionText = 'Actúa como evaluador oficial del Examen Nacional de Conducir del MTC (Perú). Responde con el 100% de precisión según el Texto Único Ordenado del Reglamento Nacional de Tránsito (D.S. 016-2009-MTC, D.S. 025-2021-MTC y modificatorias) y el Balotario Oficial de Preguntas del MTC. Presta extrema atención a límites de velocidad vigentes en calles/avenidas, reglas de preferencia de paso y preguntas trampa.';
      } else if (isRomanOrMedical) {
        systemInstructionText = 'Actúa como evaluador experto de exámenes médicos y fisiológicos de alta exigencia (Fisiología I/II, Medicina Interna, ENAM, MIR). Para cada pregunta: 1) Identifica el concepto fisiológico/farmacológico exacto. 2) Analiza rigurosamente cada alternativa descartando distractores engañosos. 3) Selecciona con 100% de precisión científica la alternativa correcta y su índice exacto.';
      } else {
        systemInstructionText = 'Actúa como un evaluador académico de élite y responde con el 100% de precisión analizando rigurosamente todas las alternativas y descartando distractores.';
      }
    }

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] },
      generationConfig: {
        temperature: 0.0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            thought: { type: 'STRING' },
            correct_option_index: { type: 'INTEGER' },
            correct_option_text: { type: 'STRING' },
            explanation: { type: 'STRING' },
            subject: { type: 'STRING' }
          },
          required: ['correct_option_index', 'correct_option_text', 'explanation', 'subject']
        }
      }
    };

    const models = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-2.5-flash-lite',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
      'gemini-1.5-flash'
    ];

    let parsedResult = null;
    let lastError = null;

    for (const model of models) {
      try {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            parsedResult = JSON.parse(candidateText.trim());
            break;
          }
        } else {
          const errText = await geminiRes.text();
          lastError = `Modelo ${model} (HTTP ${geminiRes.status}): ${errText}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!parsedResult) {
      throw new Error(lastError || 'No se pudo obtener respuesta válida de Gemini.');
    }

    // Descontar 1 crédito si no es ilimitado y la base de datos está disponible
    if (!isUnlimited && database) {
      try {
        await database.collection('users').updateOne(
          { _id: userId },
          { $inc: { credits: -1 }, $set: { updatedAt: new Date() } }
        );
      } catch (updErr) {
        console.error('Error descontando crédito:', updErr);
      }
    }

    // Guardar en historial
    if (database) {
      try {
        await database.collection('history').insertOne({
          userId,
          question,
          options: options || [],
          answer: parsedResult.correct_option_text,
          answerIndex: parsedResult.correct_option_index,
          explanation: parsedResult.explanation,
          subject: parsedResult.subject || 'General',
          source: req.body.source || 'api',
          creditsUsed: isUnlimited ? 0 : 1,
          userType: isUnlimited ? 'ilimitado' : 'estándar',
          timestamp: new Date()
        });
      } catch (histError) {
        console.error('Error al guardar historial:', histError);
      }
    }

    res.json(parsedResult);
  } catch (e) {
    console.error('Error al resolver:', e);
    res.status(500).json({ error: e.message || 'Error interno del servidor.' });
  }
});

// 4. Canjear licencia prepago
app.post('/activate', requireDb, async (req, res) => {
  const { userId, licenseKey } = req.body;
  if (!userId || !licenseKey) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    const license = await req.db.collection('licenses').findOne({ _id: licenseKey });
    if (!license) {
      return res.status(400).json({ error: 'Licencia no encontrada o inválida.' });
    }
    
    if (license.status !== 'unused') {
      return res.status(400).json({ error: 'Esta licencia ya ha sido utilizada.' });
    }

    const addedCredits = license.credits || 0;

    // Marcar licencia como usada
    await req.db.collection('licenses').updateOne(
      { _id: licenseKey },
      {
        $set: {
          status: 'used',
          usedBy: userId,
          usedAt: new Date()
        }
      }
    );

    // Actualizar créditos de usuario con upsert
    await req.db.collection('users').updateOne(
      { _id: userId },
      {
        $inc: { credits: addedCredits },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    const userDoc = await req.db.collection('users').findOne({ _id: userId });
    res.json({ success: true, credits: userDoc ? userDoc.credits : addedCredits });
  } catch (e) {
    console.error('Error en /activate:', e);
    res.status(400).json({ error: e.message || 'Error al activar créditos.' });
  }
});

// 5. Endpoints Administrativos (Requieren token admin y DB)
app.get('/admin/stats', checkAdminToken, requireDb, async (req, res) => {
  try {
    const totalQuestions = await req.db.collection('history').countDocuments();
    const totalUsers = await req.db.collection('users').countDocuments();
    const activeLicenses = await req.db.collection('licenses').countDocuments({ status: 'unused' });
    const usedLicenses = await req.db.collection('licenses').countDocuments({ status: 'used' });

    res.json({
      totalQuestions,
      totalUsers,
      activeLicenses,
      usedLicenses
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/admin/licenses', checkAdminToken, requireDb, async (req, res) => {
  try {
    const docs = await req.db.collection('licenses').find().sort({ code: -1 }).toArray();
    const licenses = docs.map(doc => ({
      code: doc.code || doc._id,
      credits: doc.credits,
      status: doc.status,
      usedBy: doc.usedBy || '',
      usedAt: doc.usedAt ? (doc.usedAt.toISOString ? doc.usedAt.toISOString() : doc.usedAt) : null
    }));
    res.json(licenses);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/admin/licenses', checkAdminToken, requireDb, async (req, res) => {
  const { credits } = req.body;
  if (!credits || typeof credits !== 'number') {
    return res.status(400).json({ error: 'Falta especificar créditos numéricos.' });
  }

  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randCode = '';
    for (let i = 0; i < 6; i++) {
      randCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `LIC-${credits}-${randCode}`;

    const licenseData = {
      _id: code,
      code,
      credits,
      status: 'unused',
      usedBy: '',
      usedAt: null,
      createdAt: new Date()
    };

    await req.db.collection('licenses').insertOne(licenseData);
    res.json(licenseData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/admin/history', checkAdminToken, requireDb, async (req, res) => {
  try {
    const docs = await req.db.collection('history').find().sort({ timestamp: -1 }).limit(100).toArray();
    const history = docs.map(doc => ({
      id: doc._id.toString(),
      question: doc.question,
      options: doc.options || [],
      answer: doc.answer,
      answerIndex: doc.answerIndex,
      explanation: doc.explanation,
      subject: doc.subject,
      source: doc.source,
      creditsUsed: doc.creditsUsed,
      userType: doc.userType,
      timestamp: doc.timestamp ? (doc.timestamp.toISOString ? doc.timestamp.toISOString() : doc.timestamp) : null
    }));
    res.json(history);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Listar usuarios registrados
app.get('/admin/users', checkAdminToken, requireDb, async (req, res) => {
  try {
    const docs = await req.db.collection('users').find().sort({ updatedAt: -1 }).limit(100).toArray();
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor central TouchID corriendo en el puerto ${PORT}`));
