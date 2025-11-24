import { Home, List, History, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "text-green-600" : "text-gray-400";

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-3 px-6 flex justify-between z-50 max-w-md">
      <Link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
        <Home size={24} />
        <span className="text-[10px] mt-1">Beranda</span>
      </Link>
      <Link to="/catalog" className={`flex flex-col items-center ${isActive('/catalog')}`}>
        <List size={24} />
        <span className="text-[10px] mt-1">Katalog</span>
      </Link>
      <Link to="/history" className={`flex flex-col items-center ${isActive('/history')}`}>
        <History size={24} />
        <span className="text-[10px] mt-1">Riwayat</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile')}`}>
        <User size={24} />
        <span className="text-[10px] mt-1">Profil</span>
      </Link>
    </div>
  );
}