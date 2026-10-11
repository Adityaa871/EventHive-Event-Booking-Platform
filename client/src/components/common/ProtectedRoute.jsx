import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

/**
 * Wraps admin routes — redirects to /admin/login if not authenticated.
 * Shows a loader while the auth state is being verified on mount.
 */
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen />;
  if (!admin) return <Navigate to="/admin/login" state={{ from: location }} replace />;

  return children;
};

export default ProtectedRoute;

