import { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut
} from '../firebase/firebase';
import { 
  registerStudentApi, 
  loginStudentApi, 
  googleStudentLoginApi, 
  registerTeacherApi, 
  loginTeacherApi, 
  getStudentProfileApi, 
  getTeacherProfileApi,
  logoutAuthApi 
} from '../utils/api';

const AuthContext = createContext(null);

// Friendly Error Formatter
const formatAuthError = (err) => {
  console.error('Firebase Auth Error Raw:', err);
  if (!err) return 'An error occurred during authentication.';
  
  const code = err.code || '';
  const message = err.message || '';

  if (code === 'auth/unauthorized-domain') {
    return 'Domain Not Authorized: Please add your domain (localhost or Vercel URL) in Firebase Console -> Authentication -> Settings -> Authorized domains.';
  }

  if (code === 'auth/api-key-not-valid' || code === 'auth/invalid-api-key') {
    return `Firebase API Key Error (${code}): The key "${firebaseConfigKey()}" was rejected by Firebase. Please ensure Google Identity Toolkit API is enabled in Google Cloud Console.`;
  }

  return message ? `[${code || 'auth-error'}]: ${message}` : 'Authentication error. Please try again.';
};

const firebaseConfigKey = () => import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDN3rq6Wdy9qT-_v3CbgrRqkLP5ALBl6AE';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const idToken = await user.getIdToken();
          localStorage.setItem('firebaseToken', idToken);
          
          let profileRes;
          if (userProfile?.role === 'teacher') {
            profileRes = await getTeacherProfileApi();
          } else {
            profileRes = await getStudentProfileApi();
          }
          if (profileRes && profileRes.user) {
            setUserProfile(profileRes.user);
            localStorage.setItem('user', JSON.stringify(profileRes.user));
          }
        } catch (err) {
          console.warn('Profile fetch warning on auth state change:', err.message);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Register Student
  const signupStudent = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await sendEmailVerification(user);

      const idToken = await user.getIdToken();
      const mongoRes = await registerStudentApi(idToken, { name, email });
      
      if (mongoRes && mongoRes.user) {
        setUserProfile(mongoRes.user);
        localStorage.setItem('user', JSON.stringify(mongoRes.user));
        if (mongoRes.token) localStorage.setItem('token', mongoRes.token);
      }
      return userCredential;
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  };

  // 2. Login Student (Email/Password)
  const signinStudent = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      const mongoRes = await loginStudentApi(idToken);
      
      if (mongoRes && mongoRes.user) {
        setUserProfile(mongoRes.user);
        localStorage.setItem('user', JSON.stringify(mongoRes.user));
        if (mongoRes.token) localStorage.setItem('token', mongoRes.token);
      }
      return userCredential;
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  };

  // 3. Google Login Student
  const signinWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      const mongoRes = await googleStudentLoginApi(idToken);

      if (mongoRes && mongoRes.user) {
        setUserProfile(mongoRes.user);
        localStorage.setItem('user', JSON.stringify(mongoRes.user));
        if (mongoRes.token) localStorage.setItem('token', mongoRes.token);
      }
      return userCredential;
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  };

  // 4. Register Teacher
  const signupTeacher = async (formData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const idToken = await user.getIdToken();
      const mongoRes = await registerTeacherApi(idToken, formData);

      if (mongoRes && mongoRes.user) {
        setUserProfile(mongoRes.user);
        localStorage.setItem('user', JSON.stringify(mongoRes.user));
        if (mongoRes.token) localStorage.setItem('token', mongoRes.token);
      }
      return userCredential;
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  };

  // 5. Login Teacher
  const signinTeacher = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      const mongoRes = await loginTeacherApi(idToken);

      if (mongoRes && mongoRes.user) {
        setUserProfile(mongoRes.user);
        localStorage.setItem('user', JSON.stringify(mongoRes.user));
        if (mongoRes.token) localStorage.setItem('token', mongoRes.token);
      }
      return userCredential;
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  };

  // 6. Resend Email Verification
  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  };

  // 7. Password Reset
  const triggerPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  };

  // 8. Logout
  const logout = async () => {
    try {
      await signOut(auth);
      await logoutAuthApi();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('firebaseToken');
    }
  };

  const value = {
    currentUser,
    userProfile,
    setUserProfile,
    loading,
    isEmailVerified: currentUser?.emailVerified || userProfile?.emailVerified || false,
    signupStudent,
    signinStudent,
    signinWithGoogle,
    signupTeacher,
    signinTeacher,
    resendVerificationEmail,
    triggerPasswordReset,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
