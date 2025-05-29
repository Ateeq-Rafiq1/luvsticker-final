
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login',
  requireAdmin = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-istickers-purple"></div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to login with return path for admin routes
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  if (!requireAdmin && !isAuthenticated) {
    // For non-admin routes that still need auth
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
