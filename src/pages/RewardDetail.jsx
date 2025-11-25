import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRewardById, redeemReward } from '../services/rewardService';
import { getTransactionSummary } from '../services/transactionService'; 
import { ArrowLeft, Loader2, Coins } from 'lucide-react'; // Tambah icon Coins
import toast from 'react-hot-toast'; // Ganti alert dengan toast
import PageTransition from '../components/PageTransition';

export default function RewardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [item, setItem] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Fetch Data
  useEffect(() => {
    const load = async () => {
      try {
        const reward = await getRewardById(id);
        const stats = await getTransactionSummary();
        setItem(reward);
        setCurrentPoints(stats.totalPoints || 0);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data reward.");
        navigate('/rewards');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  // Handle Penukaran
  const handleRedeem = async () => {
    if (currentPoints < item.points_required) {
      return toast.error("Poin Anda tidak mencukupi!");
    }
    
    // Konfirmasi via Toast/Browser logic (bisa dipercantik dengan Modal, tapi confirm cukup untuk sekarang)
    if (window.confirm(`Tukar ${item.points_required} poin untuk ${item.name}?`)) {
      setProcessing(true);
      const loadingToast = toast.loading("Memproses penukaran...");

      try {
        await redeemReward(item);
        toast.dismiss(loadingToast);
        
        toast.success("Penukaran Berhasil! Cek halaman riwayat.", {
            duration: 4000,
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
        });
        
        navigate('/history');
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Gagal: " + (error.message || "Terjadi kesalahan server"));
      } finally {
        setProcessing(false);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-orange-500" size={32} />
    </div>
  );

  if (!item) return null;

  // Cek apakah poin cukup
  const isAffordable = currentPoints >= item.points_required;

  return (
    <PageTransition>
      {/* Container Utama: Padding bottom besar agar konten tidak tertutup tombol sticky */}
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-32 relative transition-colors duration-300">
        
        {/* Tombol Back */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 z-20 bg-white/80 dark:bg-gray-800/80 dark:text-white p-2 rounded-full shadow-sm backdrop-blur transition hover:bg-white dark:hover:bg-gray-700"
        >
          <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
        
        {/* Gambar Header */}
        <div className="h-72 w-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center p-10 transition-colors relative">
          <img 
            src={item.image_url} 
            className="w-48 h-48 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
            alt={item.name}
            onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} 
          />
          {/* Radial Gradient overlay untuk estetika */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-gray-900/40 to-transparent pointer-events-none"></div>
        </div>

        <div className="px-6 py-6">
          {/* Kategori Badge */}
          <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold transition-colors uppercase tracking-wider">
            {item.category}
          </span>

          {/* Judul & Deskripsi */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 transition-colors leading-tight">{item.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm leading-relaxed transition-colors whitespace-pre-line">
            {item.description}
          </p>
          
          {/* Info Saldo User */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-500">
                    <Coins size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Saldo Poin Anda</p>
                    <p className="font-bold text-gray-800 dark:text-white">{currentPoints} Poin</p>
                </div>
            </div>
            {/* Status Cukup/Kurang */}
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${isAffordable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {isAffordable ? 'Cukup' : 'Kurang'}
            </span>
          </div>
        </div>

        {/* --- FIXED BOTTOM BAR (PERBAIKAN LAYOUT) --- */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 z-[999] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            
            {/* Info Harga di Kiri */}
            <div className="flex flex-col">
               <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Harga Reward</p>
               <p className="text-xl font-bold text-orange-600 dark:text-orange-500 leading-none">
                 {item.points_required} <span className="text-sm text-gray-400 font-medium">Pts</span>
               </p>
            </div>

            {/* Tombol Aksi */}
            <button 
              onClick={handleRedeem}
              disabled={processing || !isAffordable}
              className={`
                 flex-1 md:flex-none md:w-64 py-3.5 px-6 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg
                 ${(!isAffordable)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none dark:bg-gray-800 dark:text-gray-600' 
                    : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-orange-600/30'
                 }
              `}
            >
              {processing ? <Loader2 className="animate-spin" /> : (isAffordable ? "Tukar Sekarang" : "Poin Kurang")}
            </button>
            
          </div>
        </div>
      </div>
    </PageTransition>
  );
}