import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Home, List, Gift, History, User, LogOut, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate(); // Inisialisasi Hook
  const location = useLocation();

  // --- FUNGSI LOGOUT YANG DIPERBAIKI ---
  const handleLogout = async () => {
    if (window.confirm('Keluar dari aplikasi?')) {
      await logout();
      
      // Redirect Paksa ke Login
      navigate('/login', { replace: true });
      
      toast.success('Sampai jumpa!');
    }
  };

  const navItems = [
    { name: 'Beranda', icon: <Home size={20} />, path: '/' },
    { name: 'Katalog Sampah', icon: <List size={20} />, path: '/catalog' },
    { name: 'Tukar Poin', icon: <Gift size={20} />, path: '/rewards' },
    { name: 'Riwayat', icon: <History size={20} />, path: '/history' },
    { name: 'Profil Saya', icon: <User size={20} />, path: '/profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 z-50 transition-colors duration-300">
      
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg shadow-green-200 dark:shadow-none">
          <Leaf size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          Eco<span className="text-green-600">Point</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img
            src={userProfile?.avatar_url || "https://ui-avatars.com/api/?name=User&background=random"}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border-2 border-green-100 dark:border-gray-600"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white truncate">
              {userProfile?.full_name || 'Pengguna'}
            </h4>
            <p className="text-xs text-gray-400 truncate">
              {userProfile?.nim || 'Eco Warrior'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2.5 rounded-xl transition text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}