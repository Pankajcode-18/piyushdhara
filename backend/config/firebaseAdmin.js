const firebaseAdmin = require('firebase-admin');
const admin = firebaseAdmin.default || firebaseAdmin;

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (admin.apps && admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('✅ Firebase Admin SDK initialized successfully with service account credentials');
      return admin.app();
    } catch (err) {
      console.warn('⚠️ Firebase Admin SDK initialization error:', err.message);
    }
  }

  // Fallback initialization for local development
  try {
    admin.initializeApp({
      projectId: projectId || 'piyushdhara',
    });
    console.log('ℹ️ Firebase Admin SDK initialized in dev mode with default project ID');
  } catch (err) {
    console.warn('⚠️ Firebase Admin SDK fallback init note:', err.message);
  }

  return admin;
};

initializeFirebaseAdmin();

module.exports = admin;
