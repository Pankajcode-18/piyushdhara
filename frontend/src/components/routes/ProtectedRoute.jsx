import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, userProfile, loading, isEmailVerified } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const token = localStorage.getItem('token') || localStorage.getItem('firebaseToken');
  const activeUser = currentUser || userProfile || token;

  if (!activeUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If email verification is pending (for Firebase users who haven't verified)
  if (currentUser && !currentUser.emailVerified && userProfile?.provider === 'password' && !isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectedRoute;
