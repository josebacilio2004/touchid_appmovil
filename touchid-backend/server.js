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

    res.json(JSON.parse(resultText.trim()));
  } catch (e) {
    console.error('Error al resolver:', e);
    res.status(500).json({ error: e.message || 'Error interno del servidor.' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor central TouchID corriendo en el puerto ${PORT}`));