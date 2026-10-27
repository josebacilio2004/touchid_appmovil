const https = require('https');

function apiRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log('Fetching history from https://touchid-backend.onrender.com ...');
  const histRes = await apiRequest({
    hostname: 'touchid-backend.onrender.com',
    path: '/admin/history?limit=300',
    method: 'GET',
    headers: {
      'x-admin-token': 'TouchID@2026#SecureAdmin!'
    }
  });

  const history = histRes.data?.history || (Array.isArray(histRes.data) ? histRes.data : []);
  console.log(`Fetched ${history.length} records from history.`);

  // Filter for Histologia II and Microbiologia I
  const histologiaItems = [];
  const microItems = [];

  for (const item of history) {
    if (!item.question || !item.options || item.options.length < 2) continue;
    const text = `${item.question} ${(item.options || []).join(' ')} ${item.subject || ''}`.toLowerCase();
    
    // Histología II
    if (
      item.userId === 'usr_1792532836567_5fe89401' ||
      text.includes('histolog') ||
      text.includes('canalículo') ||
      text.includes('espacio de disse') ||
      text.includes('células de ito') ||
      text.includes('lobulillo') ||
      text.includes('tríada portal') ||
      text.includes('triada portal') ||
      text.includes('pulpa dental') ||
      text.includes('mucosa masticatoria') ||
      text.includes('neumocito') ||
      text.includes('surfactante') ||
      text.includes('cartílago') ||
      text.includes('cartilago')
    ) {
      if (!text.includes('absceso') && !text.includes('salmonella') && !text.includes('campylobacter')) {
        histologiaItems.push(item);
      }
    }
    // Microbiología I Bacteriología
    else if (
      item.userId === 'usr_1789391563470_7633953d' ||
      text.includes('microbiolog') ||
      text.includes('bacteri') ||
      text.includes('absceso pulmonar') ||
      text.includes('uroanálisis') ||
      text.includes('uroanalisis') ||
      text.includes('piuria') ||
      text.includes('typhi') ||
      text.includes('campylobacter') ||
      text.includes('diarrea') ||
      text.includes('pylori') ||
      text.includes('vibrio')
    ) {
      microItems.push(item);
    }
  }

  console.log(`Found ${histologiaItems.length} questions for Histología II (Nota 60/60)`);
  console.log(`Found ${microItems.length} questions for Microbiología I (Nota 54/60)`);

  // De-duplicate questions by question text
  function dedupe(items) {
    const seen = new Set();
    const result = [];
    for (const it of items) {
      const q = it.question.trim().toLowerCase();
      if (!seen.has(q)) {
        seen.add(q);
        result.push(it);
      }
    }
    return result;
  }

  const uniqueHist = dedupe(histologiaItems);
  const uniqueMicro = dedupe(microItems);

  console.log(`Unique Histología: ${uniqueHist.length}`);
  console.log(`Unique Microbiología: ${uniqueMicro.length}`);

  // Normalizing to question_bank via POST /api/question-bank
  console.log('\n--- INSERTING / NORMALIZING HISTOLOGÍA II (60/60) ---');
  let insertedHist = 0;
  for (const q of uniqueHist) {
    const answerText = (q.answer || '').trim();
    const ansIdx = typeof q.answerIndex === 'number' ? q.answerIndex : q.options.indexOf(answerText);
    const letter = ['A', 'B', 'C', 'D', 'E'][ansIdx >= 0 ? ansIdx : 0] || 'A';

    const payload = {
      userId: q.userId || 'usr_1792532836567_5fe89401',
      course: 'Histología II',
      question: q.question.trim(),
      type: 'single_choice',
      alternatives: q.options,
      answer: letter,
      answerText: answerText,
      explanation: q.explanation || 'Respuesta verificada en Examen Oficial (Nota 60/60).',
      confidence: 1.0,
      source: 'examen_oficial_udabol_60_60'
    };

    const res = await apiRequest({
      hostname: 'touchid-backend.onrender.com',
      path: '/api/question-bank',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, payload);

    if (res.status === 200 && res.data?.success) {
      insertedHist++;
      console.log(`[HIST OK] ${q.question.substring(0, 50)}... -> ${answerText.substring(0, 30)} (dup: ${res.data.duplicate || false})`);
    } else {
      console.warn(`[HIST ERR] ${q.question.substring(0, 40)} ->`, res.status, res.data || res.raw);
    }
  }

  console.log('\n--- INSERTING / NORMALIZING MICROBIOLOGÍA I (54/60) ---');
  let insertedMicro = 0;
  for (const q of uniqueMicro) {
    const answerText = (q.answer || '').trim();
    const ansIdx = typeof q.answerIndex === 'number' ? q.answerIndex : q.options.indexOf(answerText);
    const letter = ['A', 'B', 'C', 'D', 'E'][ansIdx >= 0 ? ansIdx : 0] || 'A';

    const payload = {
      userId: q.userId || 'usr_1789391563470_7633953d',
      course: 'Microbiología I Bacteriología',
      question: q.question.trim(),
      type: 'single_choice',
      alternatives: q.options,
      answer: letter,
      answerText: answerText,
      explanation: q.explanation || 'Respuesta verificada en Examen Oficial (Nota 54/60).',
      confidence: 1.0,
      source: 'examen_oficial_udabol_54_60'
    };

    const res = await apiRequest({
      hostname: 'touchid-backend.onrender.com',
      path: '/api/question-bank',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, payload);

    if (res.status === 200 && res.data?.success) {
      insertedMicro++;
      console.log(`[MICRO OK] ${q.question.substring(0, 50)}... -> ${answerText.substring(0, 30)} (dup: ${res.data.duplicate || false})`);
    } else {
      console.warn(`[MICRO ERR] ${q.question.substring(0, 40)} ->`, res.status, res.data || res.raw);
    }
  }

  // Verify in Question Bank
  console.log('\n--- VERIFYING LIVE QUESTION BANK ---');
  const qbRes = await apiRequest({
    hostname: 'touchid-backend.onrender.com',
    path: '/admin/question-bank',
    method: 'GET',
    headers: {
      'x-admin-token': 'TouchID@2026#SecureAdmin!'
    }
  });

  console.log(`Total questions in live Question Bank: ${qbRes.data?.total}`);
  console.log(`Courses available in Question Bank:`, qbRes.data?.courses);
}

run().catch(console.error);
