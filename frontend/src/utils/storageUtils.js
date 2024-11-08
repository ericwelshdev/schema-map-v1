// frontend\src\utils\storageUtils.js
import { openDB } from 'idb';

const DB_NAME = 'resourceWizardDB';
const DB_STORE_NAME = 'dataStore';

export const STORES = {
  RESOURCE_PREVIEW: 'resourcePreviewRows',
  DD_PREVIEW: 'ddResourcePreviewRows',
  RESOURCE_CONFIG: 'resourceGeneralConfig',
  DD_CONFIG: 'ddResourceGeneralConfig',
  RESOURCE_TO_DD_MAP: 'ddResourceMappingRows'
};


export const initDB = () => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(DB_STORE_NAME);
    };
  };

// export const initDB = async () => {
//   if (dbInstance) return dbInstance;
  
//   dbInstance = await openDB(DB_NAME, DB_VERSION, {
//     upgrade(db, oldVersion, newVersion) {
//       // Delete old stores if they exist
//       Object.values(STORES).forEach(storeName => {
//         if (db.objectStoreNames.contains(storeName)) {
//           db.deleteObjectStore(storeName);
//         }
//       });
      
//       // Create new stores
//       Object.values(STORES).forEach(storeName => {
//         db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true }); // Use keyPath for easier data management
//       });
//     },
//   });
  
//   return dbInstance;
// };

  // Store data
  export const setData = async (key, data) => {
    const db = await openDB(DB_NAME, 1);
    const tx = db.transaction(DB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(DB_STORE_NAME);
    await store.put(data, key);
  };

  // Retrieve data
  export const getData = async (key) => {
    const db = await openDB(DB_NAME, 1);
    const tx = db.transaction(DB_STORE_NAME, 'readonly');
    const store = tx.objectStore(DB_STORE_NAME);
    return store.get(key);
  };

// // Optionally, you can add a function to delete data
// export const deleteData = async (storeName, key) => {
//   const db = await initDB();
//   const tx = db.transaction(storeName, 'readwrite');
//   const store = tx.objectStore(storeName);
  
//   await store.delete(key);
//   await tx.done;
// };

// Example usage
// (async () => {
//   await setData(STORES.RESOURCE_PREVIEW, { name: 'Example Resource' });
//   const data = await getData(STORES.RESOURCE_PREVIEW);
//   console.log(data);
// })();

export const clearData = async (keys) => {
  const db = await openDB(DB_NAME, 1);
  const tx = db.transaction(DB_STORE_NAME, 'readwrite');
  const store = tx.objectStore(DB_STORE_NAME);
  
  for (const key of keys) {
    await store.delete(key);
  }
};
