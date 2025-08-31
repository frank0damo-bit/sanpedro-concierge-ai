import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, isAdmin, isStaff } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check for it
  if (requiredRole) {
    const hasRequiredRole = (() => {
      switch (requiredRole) {
        case 'admin':
          return isAdmin;
        case 'staff':
          return isStaff;
        case 'owner':
          return role === 'owner';
        default:
          return role === requiredRole;
      }
    })();

    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;