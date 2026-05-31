// Firebase Firestore & Cloud Storage Configurator
const admin = require('firebase-admin');

// In production, configure through secure environment variables
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  : null;

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      storageBucket: `${serviceAccount.project_id}.appspot.com`
    });
    console.log('[FIREBASE] Admin SDK initialized successfully with credentials.');
  } catch (error) {
    console.error('[FIREBASE] Connection error during credentials parser:', error);
  }
} else {
  console.log('[FIREBASE] Service account key not detected. Activating fallback local Storage mock engine.');
}

// Export database references
const db = serviceAccount ? admin.firestore() : {
  collection: (name) => ({
    doc: (id) => ({
      set: async (data) => console.log(`[MOCK FIRESTORE] Set ${name}/${id}`, data),
      get: async () => ({ exists: true, data: () => ({}) }),
      update: async (data) => console.log(`[MOCK FIRESTORE] Update ${name}/${id}`, data)
    }),
    add: async (data) => {
      console.log(`[MOCK FIRESTORE] Add doc to ${name}`, data);
      return { id: 'mock_doc_' + Date.now() };
    },
    get: async () => ({ docs: [] })
  })
};

const bucket = serviceAccount ? admin.storage().bucket() : {
  file: (path) => ({
    save: async (buffer) => console.log(`[MOCK STORAGE] Saved file to ${path}`),
    getSignedUrl: async () => ['https://images.unsplash.com/photo-1546182990-dffeafbe841d']
  })
};

module.exports = { db, bucket, admin };
