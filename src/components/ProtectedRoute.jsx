import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Loader2 className="animate-spin text-green-600 h-10 w-10 mb-2" />
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">
          Memuat akses...
        </span>
      </div>
    );
  }

  // Jika tidak ada user, redirect ke login
  // `state={{ from: location }}` berguna agar setelah login user dikembalikan ke halaman yang tadi dia coba buka
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}