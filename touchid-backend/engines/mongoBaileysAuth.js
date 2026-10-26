const { BufferJSON, initAuthCreds, proto } = require('@whiskeysockets/baileys');

/**
 * Adaptador de almacenamiento de autenticación para Baileys respaldado en MongoDB
 * con Buffer en memoria y escrituras diferidas por debounce (bulkWrite).
 * Evita la saturación del Event Loop y de la conexión MongoDB durante sincronizaciones
 * masivas de claves criptográficas Signal.
 *
 * @param {import('mongodb').Collection} collection Colección de MongoDB (ej. db.collection('whatsapp_auth'))
 */
async function useMongoAuthState(collection) {
  const pendingWrites = new Map();
  const pendingDeletes = new Set();
  let flushTimeout = null;

  const flush = async () => {
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }
    const writes = Array.from(pendingWrites.entries());
    const deletes = Array.from(pendingDeletes);
    pendingWrites.clear();
    pendingDeletes.clear();

    if (writes.length === 0 && deletes.length === 0) return;

    try {
      const ops = [];
      for (const [id, value] of writes) {
        ops.push({
          updateOne: {
            filter: { _id: id },
            update: { $set: { value, updatedAt: new Date() } },
            upsert: true
          }
        });
      }
      for (const id of deletes) {
        ops.push({
          deleteOne: {
            filter: { _id: id }
          }
        });
      }
      if (ops.length > 0) {
        await collection.bulkWrite(ops, { ordered: false });
      }
    } catch (err) {
      console.warn('[BAILEYS-AUTH] Error en bulkWrite diferido:', err.message);
    }
  };

  const scheduleFlush = () => {
    if (!flushTimeout) {
      flushTimeout = setTimeout(flush, 1500);
    }
  };

  const writeData = async (data, id) => {
    try {
      const serialized = JSON.parse(JSON.stringify(data, BufferJSON.replacer));
      pendingDeletes.delete(id);
      pendingWrites.set(id, serialized);
      if (id === 'creds') {
        await flush();
      } else {
        scheduleFlush();
      }
    } catch (err) {
      console.warn(`[BAILEYS-AUTH] Error preparando clave ${id}:`, err.message);
    }
  };

  const readData = async (id) => {
    try {
      if (pendingWrites.has(id)) {
        return JSON.parse(JSON.stringify(pendingWrites.get(id)), BufferJSON.reviver);
      }
      if (pendingDeletes.has(id)) {
        return null;
      }
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
      pendingWrites.delete(id);
      pendingDeletes.add(id);
      scheduleFlush();
    } catch (err) {
      console.warn(`[BAILEYS-AUTH] Error programando eliminación ${id}:`, err.message);
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
        if (flushTimeout) clearTimeout(flushTimeout);
        pendingWrites.clear();
        pendingDeletes.clear();
        await collection.deleteMany({});
        console.log('✅ [BAILEYS-AUTH] Sesión de WhatsApp eliminada de MongoDB.');
      } catch (err) {
        console.warn('⚠️ [BAILEYS-AUTH] Error al limpiar sesión:', err.message);
      }
    },
    flush
  };
}

module.exports = { useMongoAuthState };
