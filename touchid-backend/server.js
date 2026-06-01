const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { GoogleGenAI } = require('@google/generative-ai');
require('dotenv').config();

// 1. Inicializar Firebase Admin SDK usando la variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// 2. Endpoint para resolver preguntas (Gemini API Gateway)
app.post('/solve', async (req, res) => {
  const { userId, question, options, systemPrompt } = req.body;

  if (!userId || !question) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    // Verificar si el usuario tiene créditos en Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(403).json({ error: 'Usuario no registrado. Registra créditos primero.' });
    }

    const credits = userDoc.data().credits || 0;
    if (credits <= 0) {
      return res.status(402).json({ error: 'Créditos insuficientes. Adquiere más créditos en el Dashboard.' });
    }

    // Llamar a la API de Gemini usando tu API Key maestra del servidor
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let prompt = '';
    if (options && options.length > 0) {
      prompt = `Pregunta: "${question}"\nOpciones:\n${options.map((o, i) => `${i}) ${o}`).join('\n')}\n\nResponde en JSON estructurado: { "correct_option_index": int, "correct_option_text": "text", "explanation": "max 5 words", "subject": "1 word" }`;
    } else {
      prompt = `Pregunta/Contenido: "${question}"\n\nResponde en JSON estructurado: { "correct_option_index": -1, "correct_option_text": "Respuesta sintetizada", "explanation": "max 5 words", "subject": "1 word" }`;
    }

    const systemInstructionText = systemPrompt || 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.';

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] },
      generationConfig: {
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

    // Petición nativa a Gemini REST
    const response = await model.generateContent(requestBody);
    const resultText = response.response.text();

    // Descontar 1 crédito
    await userRef.update({
      credits: admin.firestore.FieldValue.increment(-1)
    });

    // Guardar en historial de forma segura
    const parsedResult = JSON.parse(resultText.trim());
    try {
      await db.collection('history').add({
        question,
        options: options || [],
        answer: parsedResult.correct_option_text,
        answerIndex: parsedResult.correct_option_index,
        explanation: parsedResult.explanation,
        subject: parsedResult.subject || 'General',
        source: req.body.source || 'api',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
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

// 3. Endpoint para canjear licencia prepago
app.post('/activate', async (req, res) => {
  const { userId, licenseKey } = req.body;
  if (!userId || !licenseKey) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    const licenseRef = db.collection('licenses').doc(licenseKey);
    
    // Transacción atómica de Firestore
    const newCredits = await db.runTransaction(async (transaction) => {
      const licenseDoc = await transaction.get(licenseRef);
      if (!licenseDoc.exists) {
        throw new Error('Licencia no encontrada o inválida.');
      }
      
      const licenseData = licenseDoc.data();
      if (licenseData.status !== 'unused') {
        throw new Error('Esta licencia ya ha sido utilizada.');
      }

      const userRef = db.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);
      
      let currentCredits = 0;
      if (userDoc.exists) {
        currentCredits = userDoc.data().credits || 0;
      }

      const addedCredits = licenseData.credits || 0;
      const updatedCredits = currentCredits + addedCredits;

      // Marcar licencia como usada
      transaction.update(licenseRef, {
        status: 'used',
        usedBy: userId,
        usedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Actualizar créditos de usuario
      transaction.set(userRef, {
        credits: updatedCredits,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      return updatedCredits;
    });

    res.json({ success: true, credits: newCredits });
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

// Estadísticas del Dashboard
app.get('/admin/stats', checkAdminToken, async (req, res) => {
  try {
    const usersSnap = await db.collection('users').get();
    const historySnap = await db.collection('history').get();
    const licensesSnap = await db.collection('licenses').get();

    let totalQuestions = historySnap.size;
    let totalUsers = usersSnap.size;

    let activeLicenses = 0;
    let usedLicenses = 0;
    licensesSnap.forEach(doc => {
      if (doc.data().status === 'unused') {
        activeLicenses++;
      } else {
        usedLicenses++;
      }
    });

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
    const snap = await db.collection('licenses').get();
    const licenses = [];
    snap.forEach(doc => {
      const data = doc.data();
      let usedAt = data.usedAt;
      if (usedAt && usedAt.toDate) {
        usedAt = usedAt.toDate().toISOString();
      }
      licenses.push({
        ...data,
        usedAt
      });
    });
    // Ordenar de más reciente a más antiguo en código
    licenses.sort((a, b) => b.code.localeCompare(a.code));
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
      code,
      credits,
      status: 'unused',
      usedBy: '',
      usedAt: null
    };

    await db.collection('licenses').doc(code).set(licenseData);
    res.json(licenseData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Listar historial
app.get('/admin/history', checkAdminToken, async (req, res) => {
  try {
    const snap = await db.collection('history').orderBy('timestamp', 'desc').limit(100).get();
    const history = [];
    snap.forEach(doc => {
      const data = doc.data();
      let timestamp = data.timestamp;
      if (timestamp && timestamp.toDate) {
        timestamp = timestamp.toDate().toISOString();
      }
      history.push({
        id: doc.id,
        ...data,
        timestamp
      });
    });
    res.json(history);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor central TouchID corriendo en el puerto ${PORT}`));