const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Motores Next-Gen v3.0 (K-Type, Caché L1 y Prompts Médicos Ultra-Densos)
const { isKTypeQuestion, K_TYPE_RESPONSE_SCHEMA, resolveKTypeDeterministically } = require('./engines/kTypeSolver');
const { getSmartSystemPrompt } = require('./engines/medicalPrompts');
const { l1Cache, inFlightRequests, buildCanonicalSignature, mapCachedAnswerToStudentOptions } = require('./engines/orchestratorService');
const { whatsappCrmService } = require('./engines/whatsappCrmService');

const app = express();
app.use(cors());
// Límite de 50MB para soportar HTML crudo completo de contingencia de plataformas como UDABOL
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../docs')));

// Formatear URI asegurando directConnection=true para conexiones remotas/túneles
function getFormattedMongoUri() {
  let uri = process.env.MONGODB_URI || 'mongodb://admin:touchid_secure_2026@bore.pub:52133/touchid?authSource=admin&directConnection=true';
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
          password: process.env.ADMIN_PASSWORD || 'TouchID@2026#SecureAdmin!',
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    console.log('✅ Usuario ilimitado verificado/sembrado en MongoDB con contraseña segura.');
  } catch (err) {
    console.warn('⚠️ No se pudo auto-sembrar usuario ilimitado:', err.message);
  }
}

// ============================================================================
// ESTADO GLOBAL DE SALUD DE MODELOS (CIRCUIT BREAKER LIGERO EN RAM)
// ============================================================================
const modelPenaltyUntil = new Map(); // modelName -> timestamp hasta cuando está castigado

function isModelHealthy(modelName) {
  const penaltyExp = modelPenaltyUntil.get(modelName);
  if (!penaltyExp) return true;
  if (Date.now() > penaltyExp) {
    modelPenaltyUntil.delete(modelName);
    return true;
  }
  return false;
}

function penalizeModel(modelName, durationMs = 120000) {
  modelPenaltyUntil.set(modelName, Date.now() + durationMs);
  console.warn(`[CIRCUIT-BREAKER] Modelo ${modelName} penalizado por ${durationMs / 1000}s debido a alta latencia/timeout/503.`);
}
const keyPenaltyUntil = new Map(); // apiKey -> timestamp hasta cuando está en cooldown

function isKeyHealthy(apiKey) {
  const exp = keyPenaltyUntil.get(apiKey);
  if (!exp) return true;
  if (Date.now() > exp) {
    keyPenaltyUntil.delete(apiKey);
    return true;
  }
  return false;
}

function penalizeKey(apiKey, durationMs = 20000) {
  keyPenaltyUntil.set(apiKey, Date.now() + durationMs);
  const masked = apiKey ? apiKey.substring(0, 6) + '...' + apiKey.substring(apiKey.length - 4) : 'key';
  console.warn(`[CIRCUIT-BREAKER] Clave ${masked} en cooldown por ${durationMs / 1000}s debido a 429 quota.`);
}


let lastConnectionFailure = 0;
const FAILURE_COOLDOWN_MS = 30000;

// Almacén de contingencia en memoria (últimas 100 capturas) y en disco
const contingencyCaptures = [];
const CONTINGENCY_DIR = path.join(__dirname, 'contingency_dumps');
try {
  if (!fs.existsSync(CONTINGENCY_DIR)) {
    fs.mkdirSync(CONTINGENCY_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('No se pudo crear directorio de contingencia en disco:', e.message);
}

function saveContingencyCapture(data) {
  const id = 'dump_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const capture = {
    id,
    timestamp: new Date().toISOString(),
    userId: data.userId || 'anonymous',
    url: data.url || (data.telemetry && data.telemetry.url) || 'N/A',
    title: (data.telemetry && data.telemetry.title) || '',
    strategy: (data.telemetry && data.telemetry.strategy) || 'unknown',
    matchedSelector: (data.telemetry && data.telemetry.matchedSelector) || '',
    domPath: (data.telemetry && data.telemetry.domPath) || '',
    question: data.question || '',
    options: data.options || [],
    optionsCount: data.options ? data.options.length : 0,
    rawQuestionHtml: (data.telemetry && (data.telemetry.rawQuestionHtml || data.telemetry.fullHtml)) || data.rawQuestionHtml || '',
    fullHtml: (data.telemetry && data.telemetry.fullHtml) || data.fullHtml || '',
    error: data.error || null,
    hasAnswer: !!data.answer,
    answer: data.answer || null
  };

  contingencyCaptures.unshift(capture);
  if (contingencyCaptures.length > 100) contingencyCaptures.pop();

  try {
    const filePath = path.join(CONTINGENCY_DIR, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(capture, null, 2), 'utf8');
  } catch (fsErr) {
    console.warn('⚠️ Error escribiendo dump a disco:', fsErr.message);
  }

  if (db) {
    db.collection('dom_inspections').insertOne(capture).catch(() => {});
  }

  return capture;
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

  // Si falló recientemente (ej. túnel bore.pub cerrado), no congelar la petición con timeouts
  if (Date.now() - lastConnectionFailure < FAILURE_COOLDOWN_MS) {
    return null;
  }

  if (isConnecting) {
    for (let i = 0; i < 4; i++) {
      await new Promise(r => setTimeout(r, 250));
      if (db) return db;
    }
    return null;
  }

  isConnecting = true;
  try {
    const currentUri = getFormattedMongoUri();
    dbClient = new MongoClient(currentUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 2500, // 2.5s máximo en vez de 15s para no demorar la respuesta
      connectTimeoutMS: 2500,
      socketTimeoutMS: 10000,
      directConnection: true
    });

    await dbClient.connect();
    db = dbClient.db('touchid');
    console.log('✅ Conectado exitosamente a MongoDB:', currentUri.replace(/:[^:@]+@/, ':***@'));
    
    // Auto-sembrar usuario ilimitado en segundo plano
    seedUnlimitedUser(db).catch(console.error);
    whatsappCrmService.init(db).catch(err => console.warn('⚠️ Error al iniciar WhatsApp CRM:', err.message));

    return db;
  } catch (err) {
    lastConnectionFailure = Date.now();
    db = null;
    dbClient = null;
    console.warn('⚠️ MongoDB no disponible (entrando en cooldown 30s):', err.message);
    return null;
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
    if (!req.db) {
      return res.status(503).json({ 
        error: 'Base de datos no disponible. Verifique que MongoDB y el túnel bore estén activos.' 
      });
    }
    next();
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    res.status(503).json({ 
      error: 'Base de datos temporalmente no disponible. Verifique que el túnel o MongoDB esté activo.' 
    });
  }
};

// Tokens administrativos válidos (soporta env, clave en BD y token seguro)
const DEFAULT_SECURE_TOKEN = 'TouchID@2026#SecureAdmin!';

const VALID_ADMIN_TOKENS = new Set([
  (process.env.ADMIN_TOKEN || '').trim(),
  (process.env.ADMIN_PASSWORD || '').trim(),
  DEFAULT_SECURE_TOKEN,
  'touchid_secure_2026'
].filter(Boolean));

const checkAdminToken = async (req, res, next) => {
  const token = (req.headers['x-admin-token'] || req.headers['authorization'] || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
  }

  // 1. Verificación rápida en memoria / env
  if (VALID_ADMIN_TOKENS.has(token)) {
    return next();
  }

  // 2. Verificación dinámica contra el usuario admin en la base de datos
  try {
    const database = await getDb();
    if (database) {
      const adminDoc = await database.collection('users').findOne({
        role: 'admin',
        password: token
      });
      if (adminDoc) {
        VALID_ADMIN_TOKENS.add(token); // Cachear token validado
        return next();
      }
    }
  } catch (err) {
    console.warn('⚠️ Error al consultar token de admin en DB:', err.message);
  }

  return res.status(401).json({ error: 'Acceso no autorizado. Token incorrecto.' });
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
    const rawApiKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
    if (rawApiKeys.length === 0) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en el servidor Render.' });
    }

    // Rescate inteligente de contingencia en backend si la pregunta enviada por la app es una cabecera
    let effectiveQuestion = question;
    const isBogusQuestion = /^(CARPETA\s+PEDAG|JOSE\s+BERNARDO|ESTUDIANTE|UDABOL|CERRAR\s+SESION)/i.test(effectiveQuestion) || 
                            effectiveQuestion.length < 6 ||
                            (effectiveQuestion === effectiveQuestion.toUpperCase() && effectiveQuestion.split(' ').length >= 3 && /CALLE|JOSE|BERNARDO|SUVIA/i.test(effectiveQuestion));

    if (isBogusQuestion && req.body.telemetry && req.body.telemetry.rawQuestionHtml) {
      try {
        const rawHtml = req.body.telemetry.rawQuestionHtml;
        const cleanedHtml = rawHtml
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<header[\s\S]*?<\/header>/gi, '')
          .replace(/<nav[\s\S]*?<\/nav>/gi, '')
          .replace(/<footer[\s\S]*?<\/footer>/gi, '')
          .replace(/<div[^>]*class=["'][^"']*(header|user_header|logo|exit_button)[^"']*["'][\s\S]*?<\/div>/gi, '')
          .replace(/<table[^>]*class=["'][^"']*(header|user_header)[^"']*["'][\s\S]*?<\/table>/gi, '')
          .replace(/<[^>]+>/g, '\n');

        const rawLines = cleanedHtml.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 0);
        const filteredLines = [];
        for (let i = 0; i < rawLines.length; i++) {
          const line = rawLines[i];
          if (/^\d{1,2}$/.test(line)) continue;
          if (/^\d{1,2}:\d{2}$/.test(line)) continue;
          if (/^(CARPETA\s+PEDAG[OÓ]GICA|UDABOL|UNIVERSIDAD|CERRAR\s+SESION)/i.test(line)) continue;
          if (/^(TouchID|Quiz\s+Simulator|Banco|Modo:|Ir\s+al|Categoría|Pregunta\s+\d+|Respondidas|Sin responder|Respondida)/i.test(line)) continue;
          if (/^(1P|2P|3P|FINAL|EXAMEN|PARCIAL|MED-)/i.test(line)) continue;
          if (/^(TIEMPO\s+RESTANTE|Minutos|Segundos|Pregunta\s+nro|Terminar\s+intento)/i.test(line)) continue;
          if (/^(Resolver\s+con\s+IA|Siguiente|Anterior|Finalizar)$/i.test(line)) continue;
          if (/^[A-ZÁÉÍÓÚÑ\s]{10,}$/.test(line) && line.split(' ').length >= 3 && /CALLE|JOSE|BERNARDO|SUVIA|ESTUDIANTE/i.test(line)) continue;
          filteredLines.push(line);
        }

        if (options && options.length >= 2) {
          let firstOptIdx = -1;
          for (let li = 0; li < filteredLines.length; li++) {
            const cLine = filteredLines[li].toLowerCase();
            for (let oi = 0; oi < options.length; oi++) {
              const opt = options[oi].toLowerCase();
              if (cLine === opt || (opt.length > 3 && cLine.indexOf(opt) !== -1) || (cLine.length > 3 && opt.indexOf(cLine) !== -1)) {
                firstOptIdx = li;
                break;
              }
            }
            if (firstOptIdx !== -1) break;
          }

          if (firstOptIdx > 0) {
            const qParts = [];
            for (let bi = firstOptIdx - 1; bi >= 0; bi--) {
              const cand = filteredLines[bi];
              if (/^(CARPETA|UDABOL|MED-|1P|2P|3P|FINAL|PARCIAL|EXAMEN|TIEMPO|MINUTOS|SEGUNDOS|CERRAR)/i.test(cand)) break;
              if (/^[A-ZÁÉÍÓÚÑ\s]{10,}$/.test(cand) && cand.split(' ').length >= 3) break;
              if (cand.length >= 4) {
                qParts.unshift(cand);
                if (qParts.length >= 2 || cand.endsWith('?') || cand.endsWith(':')) break;
              }
            }
            if (qParts.length > 0) {
              effectiveQuestion = qParts.join(' ');
              console.log(`[BACKEND-RESCUE] Enunciado rescatado exitosamente: "${effectiveQuestion}"`);
            }
          }
        }
      } catch (rescErr) {
        console.warn('Error en rescate de enunciado en backend:', rescErr.message);
      }
    }

    let parsedResult = null;
    const canonicalSig = buildCanonicalSignature(effectiveQuestion, options);

    // 0. VERIFIED DB BANK: Si la pregunta fue corregida/verificada en question_bank, usar la respuesta oficial verificada
    if (database && options && options.length > 0) {
      try {
        const verifiedDoc = await database.collection('question_bank').findOne({
          question: effectiveQuestion.trim(),
          verified: true
        });
        if (verifiedDoc && verifiedDoc.answerText) {
          const mappedVerified = mapCachedAnswerToStudentOptions({
            canonical_answer_text: verifiedDoc.answerText,
            correct_option_text: verifiedDoc.answerText,
            explanation: verifiedDoc.explanation || 'Respuesta verificada en banco oficial.',
            subject: verifiedDoc.course || 'Fisiología II'
          }, options);
          if (mappedVerified) {
            console.log(`[DB-VERIFIED-HIT] Resuelto con banco corregido: "${mappedVerified.correct_option_letter}" -> "${mappedVerified.correct_option_text}"`);
            l1Cache.set(canonicalSig, {
              ...mappedVerified,
              canonical_answer_text: verifiedDoc.answerText,
              is_k_type: false
            });
            parsedResult = mappedVerified;
          }
        }
      } catch (vErr) {
        console.warn('Error consultando question_bank verificado:', vErr.message);
      }
    }

    // 1. FAST-PATH: Verificar en Caché Semántico L1 (Memoria RAM < 1ms)
    if (!parsedResult) {
      const cachedHit = l1Cache.get(canonicalSig);
      if (cachedHit) {
        const mapped = mapCachedAnswerToStudentOptions(cachedHit, options);
        if (mapped) {
          console.log(`[CACHE-L1-HIT] Resuelto en <1ms: "${mapped.correct_option_letter}" (descontando crédito al usuario)`);
          parsedResult = mapped;
        }
      }
    }

    // 1.1 COALESCENCIA: Si ya hay una consulta idéntica resolviéndose en paralelo, unirse a su promesa
    if (!parsedResult && inFlightRequests.has(canonicalSig)) {
      console.log(`[IN-FLIGHT-COALESCE] Reutilizando solicitud en vuelo para: "${effectiveQuestion.substring(0, 35)}..."`);
      try {
        const sharedResult = await inFlightRequests.get(canonicalSig);
        const mapped = mapCachedAnswerToStudentOptions(sharedResult, options);
        if (mapped) {
          parsedResult = mapped;
        }
      } catch (_) {
        // Fallback a ejecución independiente si la compartida falló
      }
    }

    // 2. Detección Inteligente K-Type y Prompt Médico Especializado
    const isKType = isKTypeQuestion(effectiveQuestion, options);
    const systemInstructionText = getSmartSystemPrompt(effectiveQuestion, options, systemPrompt);

    let prompt = '';
    let responseSchema = {
      type: 'OBJECT',
      properties: {
        thought: { type: 'STRING' },
        correct_option_index: { type: 'INTEGER' },
        correct_option_text: { type: 'STRING' },
        explanation: { type: 'STRING' },
        subject: { type: 'STRING' }
      },
      required: ['correct_option_index', 'correct_option_text', 'explanation', 'subject']
    };

    if (isKType) {
      prompt = `Pregunta K-Type (Patrón de Respuestas Combinadas):\n"${effectiveQuestion}"\n\nAlternativas Disponibles:\n${(options || []).map((o, i) => `${i}) ${o}`).join('\n')}\n\nInstrucción K-Type Obligatoria:\n1) Extrae y evalúa cada proposición numerada (1, 2, 3, 4, etc.) de forma 100% aislada e independiente.\n2) En 'fact_check', cita la estructura anatómica o concepto exacto que valida o invalida la proposición. Determina si es verdadera (true) o falsa (false).\n3) En 'true_indices', lista únicamente los números de las proposiciones verdaderas.\n4) Sugiere la letra y explica brevemente en máximo 15 palabras.`;
      responseSchema = K_TYPE_RESPONSE_SCHEMA;
    } else if (options && options.length > 0) {
      const isNegative = /\b(excepto|incorrect[oa]|no\s+es|no\s+corresponde|se[ñn]ale\s+la\s+falsa|fals[oa]|no\s+deber[ií]a|no\s+tiene)\b/i.test(effectiveQuestion);
      const hasAllOption = options.some(o => /^\s*([a-e][\)\.\-]\s*)?(todas|todas\s+las\s+anteriores|todas\s+son\s+correctas)\s*\.?\s*$/i.test(o));
      const allWarning = hasAllOption ? `\n⚠️ REGLA DE OPCIÓN "TODAS": Si 2 o más alternativas individuales son fisiológica o clínicamente verdaderas según la literatura oficial (ej. Guyton/Robbins), DEBES seleccionar obligatoriamente la opción "Todas". No elijas solo una si las demás también son verdaderas.` : "";
      const negWarning = isNegative
        ? `\n\n⚠️ ¡ATENCIÓN CRÍTICA: PREGUNTA EN NEGATIVO (EXCEPTO / INCORRECTA / FALSA / NO CORRESPONDE)!:\nTu objetivo obligatorio es identificar la opción que sea CLÍNICAMENTE FALSA o ERRÓNEA.\nEn 'thought', evalúa metódicamente cada alternativa con [VERDADERO] o [FALSO].\nMarca en 'correct_option_index' y 'correct_option_text' la opción que resultó [FALSA].`
        : '';
      prompt = `Pregunta: "${effectiveQuestion}"\nOpciones:\n${options.map((o, i) => `${i}) ${o}`).join('\n')}\n\nInstrucción: Analiza el concepto fundamental y evalúa cada distractor descartando los incorrectos antes de seleccionar la alternativa correcta.${allWarning}${negWarning}\nResponde estrictamente en JSON estructurado: { "thought": "análisis y descarte breve de opciones", "correct_option_index": int, "correct_option_text": "text", "explanation": "max 5 words", "subject": "1 word" }`;
    } else {
      prompt = `Pregunta/Contenido: "${effectiveQuestion}"\n\nResponde en JSON estructurado: { "thought": "análisis breve", "correct_option_index": -1, "correct_option_text": "Respuesta sintetizada", "explanation": "max 5 words", "subject": "1 word" }`;
    }

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] },
      generationConfig: {
        temperature: 0.0,
        responseMimeType: 'application/json',
        responseSchema: responseSchema
      }
    };

    // 3. Matriz de Modelos Ordenada por Benchmark Empírico + SLA Timeout
    const baseModels = isKType
      ? [
          { name: 'gemini-2.5-flash-lite',    timeoutMs: 3200 },
          { name: 'gemini-2.5-flash',         timeoutMs: 4500 },
          { name: 'gemini-flash-lite-latest',  timeoutMs: 5000 },
          { name: 'gemini-3.5-flash',         timeoutMs: 5500 }
        ]
      : [
          { name: 'gemini-2.5-flash-lite',    timeoutMs: 2800 },
          { name: 'gemini-2.5-flash',         timeoutMs: 4000 },
          { name: 'gemini-flash-lite-latest',  timeoutMs: 4500 },
          { name: 'gemini-3.5-flash',         timeoutMs: 5000 }
        ];

    // Modelos sanos primero, penalizados al final como último recurso
    const activeModels = [
      ...baseModels.filter(m => isModelHealthy(m.name)),
      ...baseModels.filter(m => !isModelHealthy(m.name))
    ];

    if (!parsedResult) {
    // Ejecutor asíncrono registrado en inFlightRequests para soportar coalescencia
    const solveExecutionPromise = (async () => {
      let candidateResult = null;
      let lastError = null;

      // Pases de recuperación ante saturación 429
      const maxPasses = rawApiKeys.length > 1 ? 1 : 3;

      for (let pass = 0; pass < maxPasses; pass++) {
        if (pass > 0) {
          const backoffWait = pass * 2000;
          console.warn(`⏳ [RATE-LIMIT-BACKOFF] Esperando ${backoffWait}ms para pase de reintento #${pass}...`);
          await new Promise(r => setTimeout(r, backoffWait));
        }

        modelLoop: for (const modelCfg of activeModels) {
          const { name: model, timeoutMs } = modelCfg;

          // Filtrar claves disponibles (saludables primero)
          const healthyKeys = rawApiKeys.filter(k => isKeyHealthy(k));
          const targetKeys = (healthyKeys.length > 0 || pass > 0)
            ? (healthyKeys.length > 0 ? healthyKeys : rawApiKeys)
            : rawApiKeys;

          const startKeyIdx = Math.floor(Math.random() * targetKeys.length);

          keyLoop: for (let k = 0; k < targetKeys.length; k++) {
            const activeKey = targetKeys[(startKeyIdx + k) % targetKeys.length];
            const keyNum = rawApiKeys.indexOf(activeKey) + 1;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            const startTime = Date.now();

            try {
              const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                signal: controller.signal
              });

              clearTimeout(timeoutId);
              const elapsed = Date.now() - startTime;

              // HTTP 429: Cuota agotada (RPM por minuto o límite diario RPD del modelo)
              if (geminiRes.status === 429) {
                const errText = await geminiRes.text();
                lastError = `Google API Quota (HTTP 429 en Clave ${keyNum} / ${model}): ${errText}`;

                const isModelDailyLimit = errText.includes('PerModel') || errText.includes('limit: 20');
                if (isModelDailyLimit) {
                  console.warn(`⚠️ [MODEL-DAILY-LIMIT] Modelo ${model} agotó su cuota diaria gratuita (limit: 20) en Google. Penalizando modelo por 1h...`);
                  penalizeModel(model, 3600000); // Saltear este modelo por 1 hora
                  break keyLoop; // Saltar de inmediato al siguiente modelo
                }

                console.warn(`⚠️ [KEY-QUOTA-429] Clave ${keyNum} agotó cuota RPM en Google. Cooldown 25s. Modelo ${model} sigue activo.`);
                penalizeKey(activeKey, 25000);

                if (targetKeys.length > 1) {
                  continue keyLoop; // Probar siguiente clave con el MISMO modelo rápido
                } else {
                  break keyLoop; // Romper para no quemar otros modelos en este pase con la misma clave saturada
                }
              }

              // HTTP 503: Demanda/saturación del MODELO en Google. Penalizar el modelo.
              if (geminiRes.status === 503) {
                lastError = `Modelo ${model} (HTTP 503): sobrecargado en Google.`;
                console.warn(`⚠️ [MODEL-503] Modelo ${model} saturado en Google. Penalizando modelo por 2 min...`);
                penalizeModel(model, 120000);
                break keyLoop; // Salta al siguiente modelo
              }

              if (!geminiRes.ok) {
                const errText = await geminiRes.text();
                lastError = `Clave ${keyNum} - Modelo ${model} (HTTP ${geminiRes.status}): ${errText}`;
                continue keyLoop;
              }

              if (elapsed > 3500) {
                penalizeModel(model, 90000);
              }

              const geminiData = await geminiRes.json();
              const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (candidateText) {
                candidateResult = JSON.parse(candidateText.trim());
                console.log(`[RESOLVED-SPEED] Modelo ${model} resolvió en ${elapsed}ms (Clave ${keyNum})`);
                break modelLoop;
              }
            } catch (err) {
              clearTimeout(timeoutId);
              if (err.name === 'AbortError') {
                console.warn(`⏱️ [SLA-TIMEOUT] Modelo ${model} superó ${timeoutMs}ms sin responder. Penalizando modelo...`);
                lastError = `Modelo ${model} abortado por SLA timeout (${timeoutMs}ms)`;
                penalizeModel(model, 180000);
                break keyLoop; // Modelo congelado -> salta de inmediato al siguiente modelo
              }
              lastError = err.message;
            }
          }

          if (candidateResult) break;
        }

        if (candidateResult) break;
      }

      if (!candidateResult) {
        throw new Error(lastError || 'No se pudo obtener respuesta válida de Gemini tras agotar reintentos.');
      }

      // 4. Mapeo Determinista Post-LLM para Preguntas K-Type
      let finalResult = candidateResult;
      if (isKType && finalResult.propositions) {
        finalResult = resolveKTypeDeterministically(finalResult, options);
      } else {
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
        if (!finalResult.correct_option_letter && finalResult.correct_option_index !== undefined && finalResult.correct_option_index >= 0) {
          finalResult.correct_option_letter = alphabet[finalResult.correct_option_index] || 'A';
        }
      }

      // 5. Almacenar en Caché Semántico L1 en RAM
      l1Cache.set(canonicalSig, {
        ...finalResult,
        canonical_answer_text: finalResult.correct_option_text,
        is_k_type: isKType,
        true_indices: finalResult.true_indices || []
      });

      return finalResult;
    })();

    inFlightRequests.set(canonicalSig, solveExecutionPromise);
    try {
      parsedResult = await solveExecutionPromise;
    } finally {
      inFlightRequests.delete(canonicalSig);
    }
    }

    // Descontar 1 crédito si no es ilimitado y la base de datos está disponible
    if (!isUnlimited && database) {
      try {
        const updRes = await database.collection('users').findOneAndUpdate(
          { _id: userId },
          { $inc: { credits: -1 }, $set: { updatedAt: new Date() } }, { returnDocument: 'after' }
        );
        const remCr = (updRes && (updRes.value?.credits ?? updRes.credits)) ?? 0;
        whatsappCrmService.notifyExamStart(userId, parsedResult.subject || 'Examen', remCr).catch(() => {});
        if (remCr <= 3) {
          whatsappCrmService.notifyLowCredits(userId, parsedResult.subject || 'Examen', remCr).catch(() => {});
        }
      } catch (updErr) {
        console.error('Error descontando crédito:', updErr);
      }
    }

    // Guardar en historial
    if (database) {
      try {
        await database.collection('history').insertOne({
          userId,
          question: effectiveQuestion,
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

      // Guardar en dom_inspections (telemetría de análisis DOM para auditoría en el Dashboard)
      try {
        const telemetry = req.body.telemetry || null;
        const inspectionDoc = {
          userId,
          url: (telemetry && telemetry.url) || req.headers['referer'] || 'N/A',
          title: (telemetry && telemetry.title) || '',
          strategy: (telemetry && telemetry.strategy) || 'heuristic_standard',
          matchedSelector: (telemetry && telemetry.matchedSelector) || 'auto_detected',
          question: effectiveQuestion,
          options: options || [],
          domPath: (telemetry && telemetry.domPath) || '',
          rawQuestionHtml: (telemetry && (telemetry.fullHtml || telemetry.rawQuestionHtml)) || '',
          radiosCount: (telemetry && typeof telemetry.radiosCount === 'number') ? telemetry.radiosCount : (options ? options.length : 0),
          answer: parsedResult.correct_option_text,
          answerIndex: parsedResult.correct_option_index,
          explanation: parsedResult.explanation,
          subject: parsedResult.subject || 'General',
          autoMarked: (telemetry && telemetry.autoMarked === true) || req.body.autoMarked === true,
          autoMarkStatus: (telemetry && telemetry.autoMarkStatus) || req.body.autoMarkStatus || 'not_attempted',
          autoMarkDetails: (telemetry && telemetry.autoMarkDetails) || req.body.autoMarkDetails || '',
          autoMarkedOption: (telemetry && telemetry.autoMarkedOption) || req.body.autoMarkedOption || '',
          source: req.body.source || 'mobile_app',
          timestamp: new Date()
        };
        await database.collection('dom_inspections').insertOne(inspectionDoc);
      } catch (domErr) {
        console.warn('⚠️ Error al guardar telemetría DOM:', domErr.message);
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
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;
    const search = req.query.search;
    let query = {};
    if (search) {
      query = {
        $or: [
          { question: { $regex: search, $options: 'i' } },
          { explanation: { $regex: search, $options: 'i' } },
          { answerText: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const docs = await req.db.collection('history').find(query).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray();
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
      autoMarked: doc.autoMarked === true,
      autoMarkStatus: doc.autoMarkStatus || 'not_attempted',
      autoMarkDetails: doc.autoMarkDetails || '',
      autoMarkedOption: doc.autoMarkedOption || '',
      timestamp: doc.timestamp ? (doc.timestamp.toISOString ? doc.timestamp.toISOString() : doc.timestamp) : null
    }));
    res.json(history);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint administrativo para extraer todas las preguntas de Microbiología / Bacteriología de history y question_bank
app.get('/admin/export-microbiology', checkAdminToken, requireDb, async (req, res) => {
  try {
    const microRegex = /microbio|bacteri|gram|coco|bacil|espiroqueta|peptidoglican|teicoico|endotoxina|lipopolisac|staphylococcus|streptococcus|pneumoniae|enterococcus|neisseria|bacillus|clostridium|tetani|botulinum|perfringens|listeria|corynebacterium|escherichia|klebsiella|proteus|salmonella|shigella|yersinia|pseudomonas|vibrio|helicobacter|campylobacter|haemophilus|mycobacterium|tuberculosis|chlamydia|mycoplasma|treponema|cultivo|antibiograma|agar|cefalosporina|penicilina|vancomicina|carbapenem/i;

    const historyDocs = await req.db.collection('history').find({
      $or: [
        { question: { $regex: microRegex } },
        { explanation: { $regex: microRegex } },
        { subject: { $regex: microRegex } }
      ]
    }).sort({ timestamp: -1 }).toArray();

    const qbDocs = await req.db.collection('question_bank').find({
      $or: [
        { question: { $regex: microRegex } },
        { explanation: { $regex: microRegex } },
        { course: { $regex: microRegex } }
      ]
    }).sort({ timestamp: -1 }).toArray();

    res.json({
      historyCount: historyDocs.length,
      qbCount: qbDocs.length,
      history: historyDocs,
      questionBank: qbDocs
    });
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

// 6. Endpoints de Telemetría DOM e Inspección Estructural de Exámenes
// Endpoint para recibir telemetría incondicional (éxito o fallo) desde la app móvil o simuladores
app.post('/api/telemetry', requireDb, async (req, res) => {
  try {
    const p = req.body || {};
    const inspectionDoc = {
      userId: p.userId || 'anon_client',
      url: p.url || 'N/A',
      title: p.title || '',
      course: p.course || '',
      strategy: p.strategy || 'direct_telemetry',
      matchedSelector: p.matchedSelector || p.strategy || 'N/A',
      question: p.question || '',
      options: p.options || [],
      domPath: p.domPath || '',
      rawQuestionHtml: p.rawQuestionHtml || '',
      radiosCount: typeof p.radiosCount === 'number' ? p.radiosCount : 0,
      inputsCount: typeof p.inputsCount === 'number' ? p.inputsCount : 0,
      formsCount: typeof p.formsCount === 'number' ? p.formsCount : 0,
      labelsCount: typeof p.labelsCount === 'number' ? p.labelsCount : 0,
      candidatesCount: typeof p.candidatesCount === 'number' ? p.candidatesCount : 0,
      answer: p.answer || '',
      answerLetter: p.answerLetter || '',
      explanation: p.explanation || '',
      autoMarked: p.autoMarked === true,
      autoMarkStatus: p.autoMarkStatus || (p.autoMarked ? 'success' : 'not_attempted'),
      autoMarkDetails: p.autoMarkDetails || '',
      autoMarkedOption: p.autoMarkedOption || p.answerLetter || '',
      isSuccess: p.isSuccess !== undefined ? p.isSuccess : (p.answer ? true : false),
      errorReason: p.errorReason || null,
      source: p.source || 'mobile_app',
      timestamp: new Date()
    };

    await req.db.collection('dom_inspections').insertOne(inspectionDoc);
    res.json({ success: true, id: inspectionDoc._id });
  } catch (err) {
    console.error('Error guardando telemetría DOM:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint administrativo para consultar el feed de inspecciones DOM
app.get('/admin/dom-inspections', checkAdminToken, requireDb, async (req, res) => {
  try {
    const docs = await req.db.collection('dom_inspections').find().sort({ timestamp: -1 }).limit(150).toArray();
    const inspections = docs.map(doc => ({
      id: doc._id.toString(),
      userId: doc.userId,
      url: doc.url,
      title: doc.title,
      course: doc.course || '',
      strategy: doc.strategy,
      matchedSelector: doc.matchedSelector,
      question: doc.question,
      options: doc.options || [],
      domPath: doc.domPath,
      rawQuestionHtml: doc.rawQuestionHtml,
      radiosCount: doc.radiosCount || 0,
      inputsCount: doc.inputsCount || 0,
      formsCount: doc.formsCount || 0,
      labelsCount: doc.labelsCount || 0,
      candidatesCount: doc.candidatesCount || 0,
      answer: doc.answer,
      answerLetter: doc.answerLetter || '',
      explanation: doc.explanation,
      autoMarked: doc.autoMarked === true,
      autoMarkStatus: doc.autoMarkStatus || 'not_attempted',
      autoMarkDetails: doc.autoMarkDetails || '',
      autoMarkedOption: doc.autoMarkedOption || '',
      isSuccess: doc.isSuccess !== undefined ? doc.isSuccess : true,
      errorReason: doc.errorReason || null,
      source: doc.source,
      timestamp: doc.timestamp ? (doc.timestamp.toISOString ? doc.timestamp.toISOString() : doc.timestamp) : null
    }));
    res.json(inspections);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint administrativo para vaciar registros de telemetría de prueba
app.delete('/admin/dom-inspections', checkAdminToken, requireDb, async (req, res) => {
  try {
    const result = await req.db.collection('dom_inspections').deleteMany({});
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 7. Endpoints de Banco de Preguntas por Cursos / Materias
// Endpoint para guardar preguntas extraídas en el banco de datos
app.post('/api/question-bank', requireDb, async (req, res) => {
  try {
    const q = req.body || {};
    const questionDoc = {
      userId: q.userId || 'anon_mobile',
      course: q.course || 'General',
      question: q.question || '',
      type: q.type || 'single_choice',
      alternatives: q.alternatives || [],
      answer: q.answer || '',
      answerText: q.answerText || '',
      explanation: q.explanation || '',
      images: q.images || [],
      confidence: q.confidence || 0.95,
      source: q.source || 'mobile_app',
      timestamp: new Date()
    };

    if (!questionDoc.question || questionDoc.question.length < 4) {
      return res.status(400).json({ error: 'Pregunta inválida o vacía.' });
    }

    // Evitar duplicados exactos en el mismo curso
    const existing = await req.db.collection('question_bank').findOne({
      course: questionDoc.course,
      question: questionDoc.question
    });

    if (existing) {
      return res.json({ success: true, id: existing._id, duplicate: true });
    }

    const result = await req.db.collection('question_bank').insertOne(questionDoc);
    res.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error('Error guardando en Banco de Preguntas:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint administrativo para consultar preguntas clasificadas por curso
app.get('/admin/question-bank', checkAdminToken, requireDb, async (req, res) => {
  try {
    const courseFilter = req.query.course;
    const query = (courseFilter && courseFilter !== 'all') ? { course: courseFilter } : {};
    const docs = await req.db.collection('question_bank').find(query).sort({ timestamp: -1 }).limit(500).toArray();

    // Obtener cursos únicos disponibles
    const courses = await req.db.collection('question_bank').distinct('course');

    res.json({
      total: docs.length,
      courses: courses.filter(Boolean),
      questions: docs.map(d => ({
        id: d._id.toString(),
        userId: d.userId,
        course: d.course || 'General',
        question: d.question,
        type: d.type || 'single_choice',
        alternatives: d.alternatives || [],
        answer: d.answer,
        answerText: d.answerText,
        explanation: d.explanation,
        images: d.images || [],
        confidence: d.confidence,
        timestamp: d.timestamp ? (d.timestamp.toISOString ? d.timestamp.toISOString() : d.timestamp) : null
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint administrativo para eliminar una pregunta del banco
app.delete('/admin/question-bank/:id', checkAdminToken, requireDb, async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const result = await req.db.collection('question_bank').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint administrativo para actualizar la respuesta de una pregunta en el banco
app.post('/admin/update-question-bank', checkAdminToken, requireDb, async (req, res) => {
  try {
    const { course, question, answer, answerText, explanation } = req.body;
    const query = course ? { course, question } : { question };
    const result = await req.db.collection('question_bank').updateMany(
      query,
      { $set: { answer, answerText, explanation, updatedAt: new Date() } }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 8. ENDPOINTS DE CRM, HORARIOS DE EXÁMENES Y WHATSAPP (BAILEYS)
// ============================================================================

// Estado del Bot de WhatsApp y QR
app.get('/admin/whatsapp/status', checkAdminToken, (req, res) => {
  res.json(whatsappCrmService.getStatus());
});

// Configurar teléfono del Administrador
app.post('/admin/whatsapp/config', checkAdminToken, async (req, res) => {
  try {
    const { adminPhone } = req.body;
    const result = await whatsappCrmService.setAdminPhone(adminPhone);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reconectar Bot de WhatsApp
app.post('/admin/whatsapp/reconnect', checkAdminToken, async (req, res) => {
  try {
    const result = await whatsappCrmService.reconnect();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Desvincular / Cerrar Sesión de WhatsApp
app.post('/admin/whatsapp/logout', checkAdminToken, async (req, res) => {
  try {
    const result = await whatsappCrmService.logout();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enviar mensaje de prueba al Administrador
app.post('/admin/whatsapp/test-message', checkAdminToken, async (req, res) => {
  try {
    const success = await whatsappCrmService.sendAdminMessage('🔔 *Prueba TouchID CRM*: La conexión con tu WhatsApp está funcionando correctamente.');
    res.json({ success, message: success ? 'Mensaje enviado a tu WhatsApp' : 'No se pudo enviar. Verifica que el bot esté conectado.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar clientes del CRM (con información de perfil enriquecida)
app.get('/admin/crm/clients', checkAdminToken, requireDb, async (req, res) => {
  try {
    const docs = await req.db.collection('users').find().sort({ updatedAt: -1 }).toArray();
    const clients = docs.map(d => ({
      _id: d._id,
      userId: d.userId || d._id,
      studentName: d.studentName || d.name || d.alias || d._id,
      alias: d.alias || '',
      email: d.email || '',
      phone: d.phone || '',
      university: d.university || '',
      notes: d.notes || '',
      paymentStatus: d.paymentStatus || 'pagado',
      credits: d.isUnlimited ? 999999 : (d.credits || 0),
      isUnlimited: d.isUnlimited === true,
      createdAt: d.createdAt || null,
      updatedAt: d.updatedAt || null
    }));
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guardar o actualizar perfil CRM de un alumno
app.post('/admin/crm/clients', checkAdminToken, requireDb, async (req, res) => {
  try {
    const { userId, studentName, alias, phone, university, notes, paymentStatus, credits, isUnlimited } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId es obligatorio.' });
    }

    const updateFields = {
      studentName: studentName || '',
      alias: alias || '',
      phone: phone || '',
      university: university || '',
      notes: notes || '',
      paymentStatus: paymentStatus || 'pagado',
      updatedAt: new Date()
    };

    if (credits !== undefined && !isNaN(Number(credits))) {
      updateFields.credits = Math.max(0, parseInt(credits, 10));
    }
    if (isUnlimited !== undefined) {
      updateFields.isUnlimited = !!isUnlimited;
      if (isUnlimited) updateFields.credits = 999999;
    }

    await req.db.collection('users').updateOne(
      { _id: userId },
      {
        $set: updateFields,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    const updated = await req.db.collection('users').findOne({ _id: userId });
    res.json({ success: true, client: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar horarios de exámenes agendados
app.get('/admin/crm/schedules', checkAdminToken, requireDb, async (req, res) => {
  try {
    const dateFilter = req.query.date;
    const query = dateFilter ? { examDate: dateFilter } : {};
    const schedules = await req.db.collection('exam_schedules').find(query).sort({ examDate: 1, startTime: 1 }).toArray();

    // Cruzar con saldo real de créditos en tiempo real
    const enriched = await Promise.all(schedules.map(async (sch) => {
      const user = await req.db.collection('users').findOne({
        $or: [{ _id: sch.userId }, { userId: sch.userId }]
      });
      const credits = user ? (user.isUnlimited ? 999999 : (user.credits || 0)) : 0;
      const isUnlimited = user?.isUnlimited === true;
      const isLow = !isUnlimited && credits < (sch.estimatedCredits || 20);

      return {
        id: sch._id.toString(),
        userId: sch.userId,
        studentName: sch.studentName || user?.studentName || sch.userId,
        phone: sch.phone || user?.phone || '',
        course: sch.course || 'General',
        examDate: sch.examDate,
        startTime: sch.startTime,
        estimatedCredits: sch.estimatedCredits || 20,
        status: sch.status || 'scheduled',
        notified15m: sch.notified15m === true,
        creditsAvailable: credits,
        isUnlimited,
        isLowCredits: isLow,
        notes: sch.notes || ''
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear o actualizar un horario de examen
app.post('/admin/crm/schedules', checkAdminToken, requireDb, async (req, res) => {
  try {
    const { id, userId, studentName, phone, course, examDate, startTime, estimatedCredits, notes } = req.body;
    if (!userId || !course || !examDate || !startTime) {
      return res.status(400).json({ error: 'userId, course, examDate y startTime son obligatorios.' });
    }

    const { ObjectId } = require('mongodb');
    const scheduleData = {
      userId,
      studentName: studentName || userId,
      phone: phone || '',
      course,
      examDate,
      startTime,
      estimatedCredits: parseInt(estimatedCredits, 10) || 20,
      notes: notes || '',
      status: 'scheduled',
      notified15m: false,
      updatedAt: new Date()
    };

    if (id) {
      await req.db.collection('exam_schedules').updateOne(
        { _id: new ObjectId(id) },
        { $set: scheduleData }
      );
      res.json({ success: true, id });
    } else {
      scheduleData.createdAt = new Date();
      const insertResult = await req.db.collection('exam_schedules').insertOne(scheduleData);
      res.json({ success: true, id: insertResult.insertedId });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un examen agendado
app.delete('/admin/crm/schedules/:id', checkAdminToken, requireDb, async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const result = await req.db.collection('exam_schedules').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor central TouchID corriendo en el puerto ${PORT}`));
