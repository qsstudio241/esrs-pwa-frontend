// src/utils/directoryStorage.js

const DB_NAME = "esrs-dir-db";
const STORE = "handles";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    const res = fn(store);
    tx.oncomplete = () => resolve(res);
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Salva l'handle con chiave auditId
 * @param {string} auditId
 * @param {FileSystemDirectoryHandle} handle
 */
export async function saveDirectoryHandle(auditId, handle) {
  await handle.requestPermission({ mode: "readwrite" });
  return withStore("readwrite", (store) =>
    store.put(handle, `audit:${auditId}`)
  );
}

/**
 * Recupera l'handle salvato, o null
 * @param {string} auditId
 * @returns {Promise<FileSystemDirectoryHandle|null>}
 */
export async function getDirectoryHandle(auditId) {
  return withStore("readonly", (store) => store.get(`audit:${auditId}`));
}

/**
 * Cancella l'handle salvato
 * @param {string} auditId
 */
export async function forgetDirectoryHandle(auditId) {
  return withStore("readwrite", (store) => store.delete(`audit:${auditId}`));
}
