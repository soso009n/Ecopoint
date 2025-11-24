import { useEffect, useState } from 'react';
import { getTransactionSummary, getHistory } from '../services/transactionService'; 
import { Wallet, ArrowUpRight, Leaf, History, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import HomeChart from '../components/HomeChart';
import PageTransition from '../components/PageTransition'; // Import Animasi

export default function Home() {
  const [stats, setStats] = useState({ totalPoints: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summary = await getTransactionSummary();
        setStats(summary);
        const history = await getHistory();
        processChartData(history);
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
      <div className="min-h-screen bg-gray-50 p-6 pb-24">
        {/* Header User */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Halo, EcoWarrior 👋</h1>
            <p className="text-xs text-gray-500">Ayo selamatkan bumi hari ini!</p>
          </div>
          <Link to="/profile" className="w-10 h-10 bg-green-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://ui-avatars.com/api/?name=User&background=16a34a&color=fff" alt="Profile" />
          </Link>
        </div>

        {/* Card Saldo */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-6 text-white shadow-lg shadow-green-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Leaf size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-green-100 text-xs font-medium mb-1 flex items-center gap-2">
              <Wallet size={14}/> Total Poin Anda
            </p>
            {loading ? (
              <div className="h-10 flex items-center gap-2">
                <Loader2 className="animate-spin" size={24} /> <span className="text-sm">Menghitung...</span>
              </div>
            ) : (
              <h2 className="text-4xl font-bold mb-6">{stats.totalPoints.toLocaleString('id-ID')}</h2>
            )}
            <div className="flex gap-3">
              <Link to="/rewards" className="flex-1 bg-white/20 backdrop-blur-md py-2.5 rounded-xl text-xs font-semibold flex justify-center items-center gap-2 hover:bg-white/30 transition active:scale-95">
                <Wallet size={16} /> Tukar Poin
              </Link>
              <Link to="/catalog" className="flex-1 bg-white text-green-700 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-2 shadow-sm hover:bg-gray-100 transition active:scale-95">
                <ArrowUpRight size={16} /> Setor Sampah
              </Link>
            </div>
          </div>
        </div>

        {/* Grafik */}
        <HomeChart data={chartData} />

        {/* Menu Pintas */}
        <h3 className="font-bold text-gray-800 mb-4 text-sm">Akses Cepat</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/catalog" className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-green-200 transition group">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Leaf size={20} />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Katalog</h4>
                <p className="text-[10px] text-gray-400">Cek harga sampah</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </Link>

          <Link to="/history" className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-orange-200 transition group">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <History size={20} />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Riwayat</h4>
                <p className="text-[10px] text-gray-400">Lihat transaksimu</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}