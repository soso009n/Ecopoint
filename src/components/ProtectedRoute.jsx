import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-green-600 h-8 w-8" />
      </div>
    );
  }

  // Jika tidak ada user, redirect ke login
  // `state={{ from: location }}` berguna untuk redirect balik setelah login (UX yang bagus)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}