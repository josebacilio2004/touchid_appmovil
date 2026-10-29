const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const https = require('https');
const { MongoClient } = require('./node_modules/mongodb');

const TARGET_URI = 'mongodb+srv://74934503_db_user:jE4Kw1JusXWLWm41@cluster0.xukbtfb.mongodb.net/touchid?retryWrites=true&w=majority';
const RENDER_SERVICE_ID = 'srv-d8er8bjeo5us73cpq91g';
const RENDER_API_KEY = 'rnd_U9FZdJQtlC6W8xmqt05dCl4YUMHO';

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

async function finalize() {
  console.log('Connecting to Atlas to finalize indexes...');
  const client = new MongoClient(TARGET_URI);
  await client.connect();
  const db = client.db('touchid');

  console.log('Creating indexes...');
  await db.collection('question_bank').createIndex({ canonicalSignature: 1 }).catch(() => {});
  await db.collection('question_bank').createIndex({ question: 1 }).catch(() => {});
  await db.collection('question_bank').createIndex({ course: 1 }).catch(() => {});
  await db.collection('users').createIndex({ userId: 1 }, { unique: true, sparse: true }).catch(() => {});
  await db.collection('licenses').createIndex({ licenseKey: 1 }, { unique: true, sparse: true }).catch(() => {});
  await db.collection('history').createIndex({ timestamp: -1 }).catch(() => {});
  await db.collection('history').createIndex({ userId: 1 }).catch(() => {});
  console.log('Indexes created successfully.');

  const stats = await db.stats();
  console.log('\n=== ATLAS STORAGE METRICS ===');
  console.log('Data Size:', (stats.dataSize / (1024 * 1024)).toFixed(2), 'MB');
  console.log('Storage Size on Disk:', (stats.storageSize / (1024 * 1024)).toFixed(2), 'MB');
  console.log('Free space remaining:', (512 - (stats.storageSize / (1024 * 1024))).toFixed(2), 'MB (out of 512 MB)');

  await client.close();

  // Update Render env var
  console.log('\nUpdating MONGODB_URI on Render service...');
  const renderRes = await updateRenderEnvVar(RENDER_SERVICE_ID, RENDER_API_KEY, 'MONGODB_URI', TARGET_URI);
  console.log('Render status:', renderRes.status);
  console.log('Render updated response:', renderRes.data);

  // Update local touchid-backend/.env
  const envPath = require('path').join(__dirname, '.env');
  if (require('fs').existsSync(envPath)) {
    let envContent = require('fs').readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${TARGET_URI}`);
    require('fs').writeFileSync(envPath, envContent, 'utf8');
    console.log('Local touchid-backend/.env updated with Atlas URI.');
  }
}

finalize().catch(console.error);
