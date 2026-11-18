import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

/**
 * Route protection with role-based authorization:
 * @param {boolean} adminOnly - If true, restricts access strictly to admin role
 * @param {React.ReactNode} children - Component to render if authorized
 */
const ProtectedRoute = ({ children, adminOnly = true }) => {
  const { user, isAdmin, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && adminOnly && !isAdmin) {
      toast.error('Administrator privileges required to access this section.');
    }
  }, [loading, isAuthenticated, adminOnly, isAdmin]);

  if (loading) {
    return <Loader fullScreen />;
  }

  // Not logged in -> redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin but user is not admin -> redirect to client reservations
  if (adminOnly && !isAdmin) {
    return <Navigate to="/my-bookings" replace />;
  }

  return children;
};

export default ProtectedRoute;
