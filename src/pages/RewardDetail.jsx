// src/pages/RewardDetail.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRewardById, redeemReward } from '../services/rewardService';
import { getTransactionSummary } from '../services/transactionService'; 
import { ArrowLeft, Loader2, Coins, Tag } from 'lucide-react'; 
import toast from 'react-hot-toast';
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
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-32 md:pb-10 relative transition-colors duration-300">
        
        {/* Header Navigation */}
        <div className="p-4 md:pt-8">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm"
            >
              <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
            </button>
        </div>
        
        {/* --- LAYOUT GRID: Mobile (Stack) vs Desktop (2 Kolom) --- */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
            
            {/* KOLOM KIRI: GAMBAR */}
            <div className="h-72 md:h-[500px] w-full bg-orange-50 dark:bg-orange-900/20 rounded-3xl flex items-center justify-center p-10 relative overflow-hidden shadow-sm group">
                <img 
                    src={item.image_url} 
                    className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" 
                    alt={item.name}
                    onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} 
                />
                {/* Decorative Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-gray-900/40 to-transparent pointer-events-none"></div>
            </div>

            {/* KOLOM KANAN: DETAIL INFO */}
            <div className="flex flex-col justify-center">
                {/* Kategori & Harga */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Tag size={12} /> {item.category}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {item.name}
                </h1>

                <p className="text-2xl font-bold text-orange-600 dark:text-orange-500 mb-6">
                    {item.points_required} <span className="text-base text-gray-400 font-medium">Poin</span>
                </p>

                {/* Deskripsi Card */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">Detail Hadiah</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                        {item.description || "Tidak ada keterangan tambahan untuk hadiah ini."}
                    </p>
                </div>
                
                {/* Info Saldo User & Status */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white dark:bg-blue-800/30 rounded-full text-blue-600 dark:text-blue-400 shadow-sm">
                            <Coins size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">Saldo Anda</p>
                            <p className="font-bold text-lg text-gray-800 dark:text-white">{currentPoints} Poin</p>
                        </div>
                    </div>
                    {/* Badge Status Kecukupan */}
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                        isAffordable 
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                        : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                    }`}>
                        {isAffordable ? 'Cukup' : 'Kurang'}
                    </div>
                </div>

                {/* Tombol Aksi (Versi Desktop - Muncul di dalam flow konten) */}
                <button 
                    onClick={handleRedeem}
                    disabled={processing || !isAffordable}
                    className={`
                        hidden md:flex w-full py-4 rounded-xl font-bold transition-all justify-center items-center gap-2 shadow-lg hover:-translate-y-1
                        ${(!isAffordable)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none dark:bg-gray-800 dark:text-gray-600' 
                            : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/30'
                        }
                    `}
                >
                    {processing ? <Loader2 className="animate-spin" /> : (isAffordable ? "Tukar Sekarang" : "Poin Tidak Cukup")}
                </button>
            </div>
        </div>

        {/* --- FIXED BOTTOM BAR (MOBILE ONLY) --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 z-[999] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors">
          <div className="flex items-center justify-between gap-4">
            
            {/* Info Harga Singkat */}
            <div className="flex flex-col">
               <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Harga</p>
               <p className="text-xl font-bold text-orange-600 dark:text-orange-500 leading-none">
                 {item.points_required} <span className="text-sm text-gray-400 font-medium">Pts</span>
               </p>
            </div>

            {/* Tombol Aksi Mobile */}
            <button 
              onClick={handleRedeem}
              disabled={processing || !isAffordable}
              className={`
                 flex-1 py-3.5 px-6 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-md
                 ${(!isAffordable)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none dark:bg-gray-800 dark:text-gray-600' 
                    : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
                 }
              `}
            >
              {processing ? <Loader2 className="animate-spin" /> : "Tukar Sekarang"}
            </button>
            
          </div>
        </div>

      </div>
    </PageTransition>
  );
}