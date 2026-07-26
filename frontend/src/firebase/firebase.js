import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDN3rq6Wdy9qT-_v3CbgrRqkLP5ALBl6AE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "piyushdhara-5addf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "piyushdhara-5addf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "piyushdhara-5addf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "970130144995",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:970130144995:web:a55436f26151a26b550fd6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LR4HXY4F8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { 
  app, 
  auth, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut
};
