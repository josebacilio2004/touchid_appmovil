const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../docs')));

// Conexión a MongoDB (Usa variable de entorno MONGODB_URI o localhost por defecto)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:touchid_secure_2026@localhost:27017/touchid?authSource=admin';
let dbClient = null;
let db = null;

async function getDb() {
  if (db) return db;
  dbClient = new MongoClient(MONGODB_URI, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
  });
  await dbClient.connect();
  db = dbClient.db('touchid');
  console.log('✅ Conectado exitosamente a MongoDB');
  return db;
}

// Middleware para asegurar conexión a la base de datos
app.use(async (req, res, next) => {
  try {
    req.db = await getDb();
    next();
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    res.status(503).json({ error: 'Base de datos temporalmente no disponible.' });
  }
});

// 2. Endpoint para resolver preguntas (Gemini API Gateway)
app.post('/solve', async (req, res) => {
  const { userId, question, options, systemPrompt } = req.body;

  if (!userId || !question) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    // Verificar si el usuario tiene créditos en MongoDB
    const userDoc = await req.db.collection('users').findOne({ _id: userId });

    let isUnlimited = (userId === 'unlimited_user_touchid');
    if (!isUnlimited && userDoc && userDoc.isUnlimited === true) {
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

    // Llamar a la API de Gemini usando la API Key maestra del servidor
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en el servidor Render.' });
    }

    let prompt = '';
    if (options && options.length > 0) {
      prompt = `Pregunta: "${question}"\nOpciones:\n${options.map((o, i) => `${i}) ${o}`).join('\n')}\n\nResponde en JSON estructurado: { "correct_option_index": int, "correct_option_text": "text", "explanation": "max 5 words", "subject": "1 word" }`;
    } else {
      prompt = `Pregunta/Contenido: "${question}"\n\nResponde en JSON estructurado: { "correct_option_index": -1, "correct_option_text": "Respuesta sintetizada", "explanation": "max 5 words", "subject": "1 word" }`;
    }

    const isMtcQuery = /mtc|tr[áa]nsito|conductor|licencia|brevete|veh[íi]culo|carril|calzada|acera|berma|velocidad|sem[áa]foro|infracci[óo]n|papeleta|intersecci[óo]n|rotonda|adelantar|estacionar/i.test(question);

    let systemInstructionText = systemPrompt;
    if (!systemInstructionText || systemInstructionText.trim() === '') {
      if (isMtcQuery) {
        systemInstructionText = 'Actúa como evaluador oficial del Examen Nacional de Conducir del MTC (Perú). Responde con el 100% de precisión según el Texto Único Ordenado del Reglamento Nacional de Tránsito (D.S. 016-2009-MTC, D.S. 025-2021-MTC y modificatorias) y el Balotario Oficial de Preguntas del MTC. Presta extrema atención a límites de velocidad vigentes en calles/avenidas, reglas de preferencia de paso y preguntas trampa.';
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
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-2.0-flash',
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

    // Descontar 1 crédito si no es ilimitado
    if (!isUnlimited) {
      await req.db.collection('users').updateOne(
        { _id: userId },
        { $inc: { credits: -1 }, $set: { updatedAt: new Date() } }
      );
    }

    // Guardar en historial
    try {
      await req.db.collection('history').insertOne({
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

    res.json(parsedResult);
  } catch (e) {
    console.error('Error al resolver:', e);
    res.status(500).json({ error: e.message || 'Error interno del servidor.' });
  }
});

// Endpoint para obtener créditos de un usuario por su Client ID
app.get('/credits/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'Falta especificar el ID de cliente.' });
  }

  try {
    const userDoc = await req.db.collection('users').findOne({ _id: userId });
    
    let isUnlimited = (userId === 'unlimited_user_touchid');
    let credits = 0;
    if (userDoc) {
      credits = userDoc.credits || 0;
      if (userDoc.isUnlimited === true) {
        isUnlimited = true;
      }
    }
    
    if (isUnlimited) {
      res.json({ userId, credits: 999999, isUnlimited: true });
    } else {
      res.json({ userId, credits, isUnlimited: false });
    }
  } catch (e) {
    console.error('Error al obtener créditos:', e);
    res.status(500).json({ error: e.message || 'Error al obtener créditos.' });
  }
});

// 3. Endpoint para canjear licencia prepago
app.post('/activate', async (req, res) => {
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

// 4. Middlewares y Endpoints de Administración (Protegidos por Token)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123';

const checkAdminToken = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token incorrecto.' });
  }
  next();
};

// Verificar token
app.post('/admin/verify', checkAdminToken, (req, res) => {
  res.json({ success: true, message: 'Token válido.' });
});

// Estadísticas del Dashboard (Cero costo de lectura)
app.get('/admin/stats', checkAdminToken, async (req, res) => {
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

// Listar licencias
app.get('/admin/licenses', checkAdminToken, async (req, res) => {
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

// Generar licencia
app.post('/admin/licenses', checkAdminToken, async (req, res) => {
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

// Listar historial
app.get('/admin/history', checkAdminToken, async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor central TouchID corriendo en el puerto ${PORT}`));
