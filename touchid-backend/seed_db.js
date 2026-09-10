const { MongoClient } = require('mongodb');

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://admin:touchid_secure_2026@localhost:27017/touchid?authSource=admin&directConnection=true';
  const client = new MongoClient(uri, { directConnection: true });
  await client.connect();
  const db = client.db('touchid');

  const unlimitedDoc = {
    _id: 'unlimited_user_touchid',
    userId: 'unlimited_user_touchid',
    name: 'Jose Bacilio (TouchID Admin)',
    email: '74934503@continental.edu.pe',
    credits: 999999,
    isUnlimited: true,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await db.collection('users').updateOne(
    { _id: 'unlimited_user_touchid' },
    { $set: unlimitedDoc },
    { upsert: true }
  );

  console.log('✅ Usuario ilimitado insertado/actualizado con éxito:');
  const user = await db.collection('users').findOne({ _id: 'unlimited_user_touchid' });
  console.log(user);

  // También crear índices útiles
  await db.collection('history').createIndex({ timestamp: -1 });
  await db.collection('history').createIndex({ userId: 1 });
  await db.collection('licenses').createIndex({ code: 1 }, { unique: true });
  await db.collection('licenses').createIndex({ status: 1 });

  console.log('✅ Índices creados.');
  await client.close();
}

seed().catch(err => {
  console.error('Error seeding DB:', err);
  process.exit(1);
});
