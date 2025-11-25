// components/Sidebar.js
import { Home, List, History, User, Gift, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  // Helper function untuk styling active state
  const getLinkClass = (path) => {
    // Cek apakah path sama persis ATAU path dimulai dengan path menu (untuk sub-menu)
    // Kecuali home ('/') yang harus exact match
    const isActive = path === '/' 
      ? location.pathname === '/' 
      : location.pathname.startsWith(path);

    const baseClass = "flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-200 rounded-r-full mr-4";
    const activeClass = "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-l-4 border-green-600 dark:border-green-500 shadow-sm";
    const inactiveClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 border-l-4 border-transparent";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    // Hidden di mobile, Flex di desktop (md)
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-800 z-50 transition-colors duration-300">
      
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 h-20">
        <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-600/20">
          E
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight leading-none">EcoPoint</h1>
          <span className="text-[10px] text-green-600 font-medium tracking-wider">BANK SAMPAH</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <Link to="/" className={getLinkClass('/')}>
          <Home size={20} /> Beranda
        </Link>
        <Link to="/catalog" className={getLinkClass('/catalog')}>
          <List size={20} /> Katalog Sampah
        </Link>
        <Link to="/rewards" className={getLinkClass('/rewards')}>
          <Gift size={20} /> Tukar Poin
        </Link>
        <Link to="/history" className={getLinkClass('/history')}>
          <History size={20} /> Riwayat
        </Link>
        <Link to="/profile" className={getLinkClass('/profile')}>
          <User size={20} /> Profil Saya
        </Link>
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400 font-bold mb-1">EcoPoint Web v1.0</p>
          <p className="text-[10px] text-green-600/70 dark:text-green-500/60">© 2025 Tugas Akhir PPB</p>
        </div>
      </div>
    </aside>
  );
}