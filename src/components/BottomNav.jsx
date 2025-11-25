import { Home, List, History, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path 
    ? "text-green-600 dark:text-green-400 scale-110" 
    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300";

  return (
    // PERBAIKAN: Ditambahkan 'md:hidden' agar hilang di desktop
    // Dihapus 'max-w-md' agar full width di mobile
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-3 px-6 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <Link to="/" className={`flex flex-col items-center transition-all duration-200 ${isActive('/')}`}>
        <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">Beranda</span>
      </Link>
      
      <Link to="/catalog" className={`flex flex-col items-center transition-all duration-200 ${isActive('/catalog')}`}>
        <List size={24} strokeWidth={isActive('/catalog') ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">Katalog</span>
      </Link>
      
      <Link to="/history" className={`flex flex-col items-center transition-all duration-200 ${isActive('/history')}`}>
        <History size={24} strokeWidth={isActive('/history') ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">Riwayat</span>
      </Link>
      
      <Link to="/profile" className={`flex flex-col items-center transition-all duration-200 ${isActive('/profile')}`}>
        <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">Profil</span>
      </Link>
    </div>
  );
}