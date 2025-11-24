import { useEffect, useState } from 'react';
import { getProfile } from '../services/profileService';
import { getTransactionSummary } from '../services/transactionService';
import { User, Edit2, LogOut, Award, Info, Loader2, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';

export default function Profile() {
  const navigate = useNavigate(); // Variabel ini sekarang akan terpakai
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalWeight: 0, totalTransactions: 0, totalPoints: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profileData = await getProfile();
        const statsData = await getTransactionSummary();
        setProfile(profileData);
        setStats(statsData);
      } catch (e) { console.error(e) } 
      finally { setLoading(false) }
    };
    load();
  }, []);

  const getLevel = (points) => {
    if (points > 1000) return { name: 'Earth Guardian', color: 'bg-purple-100 text-purple-700' };
    if (points > 500) return { name: 'Eco Warrior', color: 'bg-green-100 text-green-700' };
    return { name: 'Pemula', color: 'bg-gray-100 text-gray-600' };
  };

  const level = getLevel(stats.totalPoints);

  // --- PERBAIKAN DI SINI ---
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      toast.success('Berhasil keluar akun');
      navigate('/'); // Menggunakan navigate, jadi error hilang
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat Profil...</div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-24 relative">
        {/* Header Background */}
        <div className="bg-green-600 h-40 rounded-b-[40px] relative">
          <div className="absolute top-6 left-0 right-0 text-center text-white font-bold text-lg">
            Profil Saya
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-6 -mt-20 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100">
            <div className="relative inline-block">
              <img src={profile?.avatar_url || "https://ui-avatars.com/api/?name=User"} className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto bg-gray-200 object-cover" />
              <Link to="/profile/edit" className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-sm hover:bg-blue-700">
                <Edit2 size={14} />
              </Link>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mt-3">{profile?.full_name || "Nama User"}</h2>
            <p className="text-xs text-gray-400 mb-3">{profile?.nim} • {profile?.jurusan}</p>
            
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${level.color}`}>
              Rank: {level.name}
            </span>

            {/* Statistik */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Total Sampah</p>
                <h4 className="text-lg font-bold text-gray-800 flex justify-center items-center gap-1">
                  {stats.totalWeight} <span className="text-xs font-normal text-gray-400">kg</span>
                </h4>
              </div>
              <div className="border-x border-gray-100">
                <p className="text-[10px] text-gray-400 mb-1">Transaksi</p>
                <h4 className="text-lg font-bold text-gray-800">{stats.totalTransactions}</h4>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Poin Aktif</p>
                <h4 className="text-lg font-bold text-green-600">{stats.totalPoints}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Settings */}
        <div className="px-6 mt-6 space-y-3">
          <h3 className="font-bold text-gray-800 text-sm ml-1">Pengaturan</h3>
          
          <Link to="/profile/edit" className="block">
            <MenuButton icon={<User size={18} />} title="Edit Profil" subtitle="Ubah data diri" />
          </Link>
          
          <Link to="/achievements" className="block">
            <MenuButton icon={<Award size={18} />} title="Pencapaian" subtitle="Lihat lencana anda" />
          </Link>
          
          <Link to="/about-app" className="block">
            <MenuButton icon={<Info size={18} />} title="Tentang Aplikasi" subtitle="EcoPoint v1.0" />
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:bg-red-50 transition group mt-4"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100">
              <LogOut size={18} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-sm font-bold text-red-500">Keluar Akun</h4>
            </div>
          </button>
        </div>
      </div>
    </PageTransition>
  );
}

function MenuButton({ icon, title, subtitle }) {
  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:bg-gray-50 transition group cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-green-50 group-hover:text-green-600 transition">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <p className="text-[10px] text-gray-400">{subtitle}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </div>
  );
}