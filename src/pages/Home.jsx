import { useEffect, useState } from 'react';
import { getTransactionSummary, getHistory } from '../services/transactionService'; 
import { useAuth } from '../context/AuthContext'; // IMPORT CONTEXT
import { Wallet, ArrowUpRight, Leaf, History, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import HomeChart from '../components/HomeChart';
import PageTransition from '../components/PageTransition';

export default function Home() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({ totalPoints: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // PERBAIKAN: Gunakan Promise.all untuk fetch paralel
        const [summaryData, historyData] = await Promise.all([
          getTransactionSummary(),
          getHistory()
        ]);

        setStats(summaryData);
        processChartData(historyData);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processChartData = (transactions) => {
    const categoryMap = {};
    transactions.forEach((t) => {
      if (t.total_points > 0) {
        const key = t.waste_name.split(' ')[0]; 
        categoryMap[key] = (categoryMap[key] || 0) + Number(t.weight_kg);
      }
    });
    const formattedData = Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    })).slice(0, 5);
    setChartData(formattedData);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 md:pb-10 transition-colors duration-300">
        
        {/* HEADER */}
        <div className="bg-green-600 dark:bg-green-800 h-48 md:h-56 rounded-b-[40px] md:rounded-b-[60px] relative transition-colors duration-300 shadow-lg shadow-green-600/20">
          <div className="absolute top-8 left-0 right-0 text-center text-white font-bold text-lg md:text-2xl">
            EcoPoint Beranda
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-6 -mt-24 relative z-10 max-w-2xl mx-auto space-y-6">
          
          {/* KARTU USER */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 text-center border border-gray-100 dark:border-gray-700 transition-colors duration-300 backdrop-blur-sm">
            <div className="relative inline-block -mt-12 mb-3">
              <Link to="/profile">
                <img 
                  // GUNAKAN USERPROFILE CONTEXT
                  src={userProfile?.avatar_url || "https://ui-avatars.com/api/?name=User&background=16a34a&color=fff"} 
                  alt="Profile" 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[6px] border-white dark:border-gray-700 shadow-lg bg-gray-200 object-cover transition-colors hover:scale-105"
                />
              </Link>
            </div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors">
              Halo, {userProfile?.full_name ? userProfile.full_name.split(' ')[0] : 'EcoWarrior'} 👋
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Ayo selamatkan bumi hari ini!</p>

            {/* SISA KODE KARTU SALDO & MENU... (TIDAK PERLU DIUBAH) */}
            <div className="bg-linear-to-br from-green-600 to-emerald-500 dark:from-green-700 dark:to-emerald-800 rounded-2xl p-5 text-white shadow-lg shadow-green-200 dark:shadow-none relative overflow-hidden transition-colors text-left">
               <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                 <Leaf size={100} />
               </div>
               <div className="relative z-10">
                 <p className="text-green-100 text-xs font-medium mb-1 flex items-center gap-2">
                   <Wallet size={14}/> Total Poin Anda
                 </p>
                 {loading ? (
                   <div className="h-10 flex items-center gap-2">
                     <Loader2 className="animate-spin" size={20} /> <span className="text-sm">...</span>
                   </div>
                 ) : (
                   <h2 className="text-3xl md:text-4xl font-bold mb-5">{stats.totalPoints.toLocaleString('id-ID')}</h2>
                 )}
                 <div className="flex gap-3">
                   <Link to="/rewards" className="flex-1 bg-white/20 backdrop-blur-md py-2.5 rounded-xl text-xs font-semibold flex justify-center items-center gap-2 hover:bg-white/30 transition active:scale-95">
                     <Wallet size={16} /> Tukar Poin
                   </Link>
                   <Link to="/catalog" className="flex-1 bg-white text-green-700 dark:text-green-800 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-2 shadow-sm hover:bg-gray-100 transition active:scale-95">
                     <ArrowUpRight size={16} /> Setor Sampah
                   </Link>
                 </div>
               </div>
            </div>
          </div>

          {/* MENU PINTAS & CHART (TETAP SAMA) */}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-sm ml-2 transition-colors">Akses Cepat</h3>
            <div className="grid grid-cols-2 gap-4">
               <Link to="/catalog" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600 hover:shadow-md transition group cursor-pointer flex flex-col justify-between h-28">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                     <Leaf size={20} />
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm transition-colors">Katalog</h4>
                        <p className="text-[10px] text-gray-400">Cek harga</p>
                     </div>
                     <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                  </div>
               </Link>
               <Link to="/history" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600 hover:shadow-md transition group cursor-pointer flex flex-col justify-between h-28">
                  <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                     <History size={20} />
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm transition-colors">Riwayat</h4>
                        <p className="text-[10px] text-gray-400">Transaksi</p>
                     </div>
                     <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                  </div>
               </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 transition-colors">
             <HomeChart data={chartData} />
          </div>

        </div>
      </div>
    </PageTransition>
  );
}