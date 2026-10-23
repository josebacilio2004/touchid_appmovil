const { BufferJSON, initAuthCreds, proto } = require('@whiskeysockets/baileys');

/**
 * Adaptador de almacenamiento de autenticación para Baileys respaldado en MongoDB.
 * Permite que la sesión de WhatsApp persista de forma indestructible
 * a través de reinicios o redespliegues de Render o servidores locales.
 *
 * @param {import('mongodb').Collection} collection Colección de MongoDB (ej. db.collection('whatsapp_auth'))
 */
async function useMongoAuthState(collection) {
  const writeData = async (data, id) => {
    try {
      const serialized = JSON.parse(JSON.stringify(data, BufferJSON.replacer));
      await collection.updateOne(
        { _id: id },
        { $set: { value: serialized, updatedAt: new Date() } },
        { upsert: true }
      );
    } catch (err) {
      console.warn(`[BAILEYS-AUTH] Error guardando clave ${id}:`, err.message);
    }
  };

  const readData = async (id) => {
    try {
      const doc = await collection.findOne({ _id: id });
      if (!doc || !doc.value) return null;
      return JSON.parse(JSON.stringify(doc.value), BufferJSON.reviver);
    } catch (err) {
      console.warn(`[BAILEYS-AUTH] Error leyendo clave ${id}:`, err.message);
      return null;
    }
  };

  const removeData = async (id) => {
    try {
      await collection.deleteOne({ _id: id });
    } catch (err) {
      console.warn(`[BAILEYS-AUTH] Error eliminando clave ${id}:`, err.message);
    }
  };

  const creds = (await readData('creds')) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`);
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            })
          );
          return data;
        },
        set: async (data) => {
          const tasks = [];
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const key = `${category}-${id}`;
              if (value) {
                tasks.push(writeData(value, key));
              } else {
                tasks.push(removeData(key));
              }
            }
          }
          await Promise.all(tasks);
        }
      }
    },
    saveCreds: () => {
      return writeData(creds, 'creds');
    },
    clearAuth: async () => {
      try {
        await collection.deleteMany({});
        console.log('✅ [BAILEYS-AUTH] Sesión de WhatsApp eliminada de MongoDB.');
      } catch (err) {
        console.warn('⚠️ [BAILEYS-AUTH] Error al limpiar sesión:', err.message);
      }
    }
  };
}

module.exports = { useMongoAuthState };
