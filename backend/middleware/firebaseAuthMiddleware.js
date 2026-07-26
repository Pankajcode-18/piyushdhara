const admin = require('../config/firebaseAdmin');

/**
 * Middleware to verify Firebase ID Token from request headers
 */
const verifyFirebaseToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-firebase-token']) {
    token = req.headers['x-firebase-token'];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No Firebase token provided.' });
  }

  try {
    // Attempt verification with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email.split('@')[0],
      picture: decodedToken.picture || '',
      email_verified: decodedToken.email_verified || false,
      firebase: decodedToken.firebase || {}
    };
    return next();
  } catch (error) {
    console.warn('Firebase Admin Token verification warning:', error.message);
    
    // In local dev mode without active Firebase service account, handle decoding gracefully
    if (process.env.NODE_ENV === 'development' || !process.env.FIREBASE_PRIVATE_KEY) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decodedJson = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
          if (decodedJson && decodedJson.user_id) {
            req.firebaseUser = {
              uid: decodedJson.user_id || decodedJson.sub,
              email: decodedJson.email,
              name: decodedJson.name || decodedJson.email?.split('@')[0],
              picture: decodedJson.picture || '',
              email_verified: decodedJson.email_verified || false,
            };
            return next();
          }
        }
      } catch (fallbackErr) {
        console.error('Fallback token decode error:', fallbackErr.message);
      }
    }

    return res.status(401).json({ message: 'Invalid or expired Firebase ID token.' });
  }
};

module.exports = {
  verifyFirebaseToken,
};
