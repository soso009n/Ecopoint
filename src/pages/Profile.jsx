import { useEffect, useState } from 'react';
import { getTransactionSummary } from '../services/transactionService';
import { useAuth } from '../context/AuthContext'; 
import { User, Edit2, LogOut, Award, Info, ChevronRight, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const navigate = useNavigate(); // Inisialisasi Hook
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, userProfile } = useAuth(); 
  
  const [stats, setStats] = useState({ totalWeight: 0, totalTransactions: 0, totalPoints: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return; 
      try {
        setLoading(true);
        const statsData = await getTransactionSummary();
        if (statsData) setStats(statsData);
      } catch (e) {
        console.error("Gagal memuat stats:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const getLevel = (points) => {
    const p = points || 0;
    if (p >= 5000) return { name: 'Legendary', color: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800' };
    if (p >= 2000) return { name: 'Earth Guardian', color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800' };
    if (p >= 1000) return { name: 'Sultan Sampah', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800' };
    if (p >= 500) return { name: 'Eco Warrior', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800' };
    if (p >= 200) return { name: 'Rajin Setor', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800' };
    return { name: 'Pendatang Baru', color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' };
  };

  const level = getLevel(stats.totalPoints);

  // --- FUNGSI LOGOUT YANG DIPERBAIKI ---
  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      try {
        await logout();
        toast.success('Berhasil keluar akun');
        // Redirect Paksa ke Login
        navigate('/login', { replace: true });
      } catch (error) {
        toast.error('Gagal keluar akun');
      }
    }
  };

  if (loading && !userProfile) { 
    return (
        <div className="flex h-[80vh] items-center justify-center bg-gray-50 dark:bg-gray-900">
           <div className="flex flex-col items-center gap-2">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
           </div>
        </div>
    );
  }

  return (
    <PageTransition>
      <div className="pb-24 md:pb-10 relative bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        
        {/* Header Background */}
        <div className="bg-green-600 dark:bg-green-800 h-48 md:h-56 rounded-b-[40px] md:rounded-b-[60px] relative transition-colors duration-300 shadow-lg shadow-green-600/20">
          <div className="absolute top-8 left-0 right-0 text-center text-white font-bold text-lg md:text-2xl">
            Profil Saya
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-6 -mt-24 relative z-10 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8 text-center border border-gray-100 dark:border-gray-700 transition-colors duration-300 backdrop-blur-sm">
            
            <div className="relative inline-block mb-4">
              <img 
                src={userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${userProfile?.full_name || 'User'}&background=random`} 
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[6px] border-white dark:border-gray-700 shadow-lg mx-auto bg-gray-200 object-cover transition-colors" 
              />
              <Link to="/profile/edit" className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition hover:scale-110">
                <Edit2 size={16} />
              </Link>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white transition-colors">
                {userProfile?.full_name || "Pengguna EcoPoint"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 flex items-center justify-center gap-2">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                  {userProfile?.nim || "NIM Kosong"}
                </span>
                • 
                <span>{userProfile?.jurusan || "Jurusan Kosong"}</span>
            </p>
            
            <div className={`inline-block px-5 py-2 rounded-full text-xs md:text-sm font-bold shadow-sm border ${level.color} transition-colors`}>
              Rank: {level.name}
            </div>

            {/* Statistik Grid */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 transition-colors">
              <div className="flex flex-col items-center">
                <p className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400 mb-1">Total Sampah</p>
                <h4 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 flex items-baseline gap-1">
                  {stats.totalWeight} <span className="text-xs font-normal text-gray-400">kg</span>
                </h4>
              </div>
              <div className="border-x border-gray-100 dark:border-gray-700 px-2 flex flex-col items-center">
                <p className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400 mb-1">Transaksi</p>
                <h4 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">{stats.totalTransactions}</h4>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400 mb-1">Poin Aktif</p>
                <h4 className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">{stats.totalPoints}</h4>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="mt-8 space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm ml-2 transition-colors">PENGATURAN</h3>
            
            <button onClick={toggleTheme} className="w-full bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-colors">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-sm font-bold text-gray-800 dark:text-white transition-colors">Mode Gelap</h4>
                <p className="text-[10px] text-gray-400">{isDark ? "Aktif (Hemat Baterai)" : "Nonaktif (Tampilan Terang)"}</p>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${isDark ? 'bg-green-500' : 'bg-gray-300'}`}>
                 <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform duration-300 ${isDark ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`}></div>
              </div>
            </button>

            <div className="grid grid-cols-1 gap-3">
                <Link to="/profile/edit" className="block">
                    <MenuButton icon={<User size={20} />} title="Edit Profil" subtitle="Ubah data diri & password" />
                </Link>
                <Link to="/achievements" className="block">
                    <MenuButton icon={<Award size={20} />} title="Pencapaian" subtitle="Lihat lencana & progres rank" />
                </Link>
                <Link to="/about-app" className="block">
                    <MenuButton icon={<Info size={20} />} title="Tentang Aplikasi" subtitle="Versi Aplikasi & Developer" />
                </Link>
            </div>
            
            <button onClick={handleLogout} className="w-full mt-4 bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition group cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition">
                <LogOut size={20} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-sm font-bold text-red-500 dark:text-red-400 group-hover:text-red-600 transition">Keluar Akun</h4>
              </div>
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function MenuButton({ icon, title, subtitle }) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition group cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center group-hover:bg-green-50 dark:group-hover:bg-green-900/30 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className="text-sm font-bold text-gray-800 dark:text-white transition-colors">{title}</h4>
        <p className="text-[10px] text-gray-400">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-green-500 transition-colors" />
    </div>
  );
}