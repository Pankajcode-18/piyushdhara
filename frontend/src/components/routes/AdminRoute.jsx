import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { userProfile, loading } = useAuth();
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const role = userProfile?.role || savedUser?.role;

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (role !== 'admin' && role !== 'teacher') {
    return <Navigate to="/teacher-login" replace />;
  }

  return children;
};

export default AdminRoute;
