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
  const code = err.code || err.message || '';
  if (code.includes('auth/api-key-not-valid') || code.includes('api-key')) {
    return 'Invalid Firebase API Key. Please paste your valid VITE_FIREBASE_API_KEY from Firebase Console into frontend/.env';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please log in instead.';
  }
  if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password') || code.includes('auth/user-not-found')) {
    return 'Invalid email or password. Please check your credentials.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Access temporarily disabled due to too many failed login attempts. Please try again later.';
  }
  if (code.includes('auth/popup-closed-by-user')) {
    return 'Google login popup was closed before completing authentication.';
  }
  return err.message || 'Authentication error. Please try again.';
};

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
