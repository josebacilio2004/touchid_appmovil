const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const https = require('https');
const { MongoClient } = require('./node_modules/mongodb');

const SOURCE_URI = 'mongodb://admin:touchid_secure_2026@127.0.0.1:27017/touchid?authSource=admin';
const TARGET_URI = 'mongodb+srv://74934503_db_user:jE4Kw1JusXWLWm41@cluster0.xukbtfb.mongodb.net/touchid?retryWrites=true&w=majority';

const RENDER_SERVICE_ID = 'srv-d8er8bjeo5us73cpq91g';
const RENDER_API_KEY = 'rnd_U9FZdJQtlC6W8xmqt05dCl4YUMHO';

const COLLECTIONS_TO_MIGRATE = [
  'users',
  'licenses',
  'question_bank',
  'history',
  'exam_schedules',
  'system_config',
  'admin_config',
  'remote_marks_log'
];

async function updateRenderEnvVar(serviceId, apiKey, key, value) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify([
      { key, value }
    ]);
    const req = https.request(`https://api.render.com/v1/services/${serviceId}/env-vars`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 INICIANDO MIGRACIÓN A MONGODB ATLAS CLUSTER0');
  console.log('====================================================');

  console.log('\n[1/4] Conectando a base de datos de origen (127.0.0.1:27017)...');
  const sourceClient = new MongoClient(SOURCE_URI);
  await sourceClient.connect();
  const sourceDb = sourceClient.db('touchid');
  console.log('  -> Conectado a origen exitosamente.');

  console.log('\n[2/4] Conectando a base de datos de destino (cluster0.xukbtfb.mongodb.net)...');
  const targetClient = new MongoClient(TARGET_URI);
  await targetClient.connect();
  const targetDb = targetClient.db('touchid');
  console.log('  -> Conectado a destino MongoDB Atlas exitosamente.');

  console.log('\n[3/4] Migrando colecciones completas...');
  let totalDocsMigrated = 0;

  for (const colName of COLLECTIONS_TO_MIGRATE) {
    const srcCol = sourceDb.collection(colName);
    const tgtCol = targetDb.collection(colName);
    const count = await srcCol.countDocuments();
    console.log(`  * Migrando '${colName}' (${count} documentos)...`);

    if (count === 0) continue;

    await tgtCol.deleteMany({});

    const cursor = srcCol.find({});
    let batch = [];
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      batch.push(doc);
      if (batch.length >= 500) {
        await tgtCol.insertMany(batch);
        batch = [];
      }
    }
    if (batch.length > 0) {
      await tgtCol.insertMany(batch);
    }

    const verifiedCount = await tgtCol.countDocuments();
    totalDocsMigrated += verifiedCount;
    console.log(`    ✅ '${colName}': ${verifiedCount}/${count} documentos migrados y verificados.`);
  }

  console.log('\n  * Migrando \'dom_inspections\' (últimos 3,000 registros)...');
  const domSrc = sourceDb.collection('dom_inspections');
  const domTgt = targetDb.collection('dom_inspections');
  await domTgt.deleteMany({});
  const recentDoms = await domSrc.find({}).sort({ timestamp: -1 }).limit(3000).toArray();
  if (recentDoms.length > 0) {
    await domTgt.insertMany(recentDoms);
    const domCount = await domTgt.countDocuments();
    totalDocsMigrated += domCount;
    console.log(`    ✅ 'dom_inspections': ${domCount} documentos migrados.`);
  }

  console.log('\n[4/4] Creando índices canónicos optimizados en Atlas...');
  await targetDb.collection('question_bank').createIndex({ canonicalSignature: 1 });
  await targetDb.collection('question_bank').createIndex({ question: 1 });
  await targetDb.collection('question_bank').createIndex({ course: 1 });
  await targetDb.collection('users').createIndex({ userId: 1 }, { unique: true });
  await targetDb.collection('licenses').createIndex({ licenseKey: 1 }, { unique: true });
  await targetDb.collection('history').createIndex({ timestamp: -1 });
  await targetDb.collection('history').createIndex({ userId: 1 });
  console.log('  -> Índices creados exitosamente.');

  const stats = await targetDb.stats();
  console.log('\n====================================================');
  console.log('📊 ESTADÍSTICAS DEL NUEVO CLUSTER EN ATLAS:');
  console.log(` - Documentos totales migrados: ${totalDocsMigrated}`);
  console.log(` - Tamaño de datos: ${(stats.dataSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(` - Tamaño en disco: ${(stats.storageSize / (1024 * 1024)).toFixed(2)} MB (de 512 MB disponibles)`);
  console.log(` - Cuota consumida: ${((stats.storageSize / (512 * 1024 * 1024)) * 100).toFixed(2)}% del plan gratuito`);
  console.log('====================================================');

  await sourceClient.close();
  await targetClient.close();

  console.log('\n🔄 Actualizando variable MONGODB_URI en el servicio de Render...');
  try {
    const renderRes = await updateRenderEnvVar(RENDER_SERVICE_ID, RENDER_API_KEY, 'MONGODB_URI', TARGET_URI);
    console.log('Render API Status:', renderRes.status);
    console.log('✅ Render actualizado con éxito hacia la nueva nube de MongoDB Atlas!');
  } catch (rErr) {
    console.warn('Advertencia al actualizar Render:', rErr.message);
  }

  const envPath = require('path').join(__dirname, '.env');
  if (require('fs').existsSync(envPath)) {
    let envContent = require('fs').readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${TARGET_URI}`);
    require('fs').writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Local .env actualizado con la nueva URI de Atlas.');
  }
}

runMigration().catch(console.error);
