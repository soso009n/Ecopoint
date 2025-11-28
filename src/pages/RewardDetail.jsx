import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRewardById, redeemReward } from '../services/rewardService';
import { getTransactionSummary } from '../services/transactionService'; 
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2, Coins, Tag, AlertCircle } from 'lucide-react'; 
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';

export default function RewardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const [item, setItem] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Fungsi load digabung agar lebih rapi
    const loadData = async () => {
      try {
        setLoading(true);
        // Promise.all agar fetch berjalan paralel (lebih cepat)
        const [rewardData, statsData] = await Promise.all([
          getRewardById(id),
          getTransactionSummary()
        ]);

        if (!rewardData) throw new Error("Hadiah tidak ditemukan");
        
        setItem(rewardData);
        setCurrentPoints(statsData?.totalPoints || 0);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data.");
        navigate('/rewards');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleRedeem = async () => {
    if (!user) {
        toast.error("Silakan login terlebih dahulu");
        navigate('/login');
        return;
    }
    
    // Validasi Poin di sisi Client
    if (currentPoints < item.points_required) {
      toast.error("Poin Anda tidak mencukupi!", { icon: '🚫' });
      return;
    }
    
    // Konfirmasi User
    if (!window.confirm(`Yakin ingin menukar ${item.points_required} poin untuk ${item.name}?`)) {
        return;
    }

    setProcessing(true);
    const loadingToast = toast.loading("Memproses transaksi...");

    try {
      await redeemReward(item, user.id); 
      
      toast.dismiss(loadingToast);
      toast.success("Penukaran Berhasil! Cek Riwayat Anda.", {
          duration: 5000,
          icon: '🎁'
      });
      
      navigate('/history');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-orange-600" size={32} />
    </div>
  );

  if (!item) return null;

  const isAffordable = currentPoints >= item.points_required;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-32 md:pb-10 relative transition-colors duration-300">
        
        {/* Header Navigation */}
        <div className="p-4 md:pt-8 flex items-center justify-between px-6 max-w-6xl mx-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm"
            >
              <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
            </button>
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Detail Hadiah</span>
        </div>
        
        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 mt-4">
            
            {/* Image Section */}
            <div className="h-72 md:h-[500px] w-full bg-orange-50 dark:bg-orange-900/10 rounded-3xl flex items-center justify-center p-10 relative overflow-hidden shadow-inner">
                <img 
                    src={item.image_url} 
                    className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105" 
                    alt={item.name}
                    onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} 
                />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center space-y-6">
                
                {/* Title & Badge */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                            <Tag size={12} /> {item.category}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                        {item.name}
                    </h1>
                </div>

                {/* Price Point */}
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-orange-600 dark:text-orange-500">
                        {item.points_required}
                    </span>
                    <span className="text-lg text-gray-500 font-medium">Poin</span>
                </div>

                {/* Saldo Check */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    isAffordable 
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' 
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                }`}>
                    <div className="flex items-center gap-3">
                        <Coins size={20} />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase opacity-70">Saldo Anda</span>
                            <span className="font-bold text-lg">{currentPoints} Poin</span>
                        </div>
                    </div>
                    {isAffordable ? (
                        <span className="text-xs font-bold bg-white dark:bg-green-800 px-2 py-1 rounded">Cukup</span>
                    ) : (
                        <span className="text-xs font-bold bg-white dark:bg-red-800 px-2 py-1 rounded flex items-center gap-1">
                            <AlertCircle size={12}/> Kurang
                        </span>
                    )}
                </div>

                {/* Description */}
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Deskripsi</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                        {item.description || "Tidak ada deskripsi."}
                    </p>
                </div>

                {/* Desktop Button */}
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

        {/* Mobile Fixed Button */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <button 
              onClick={handleRedeem}
              disabled={processing || !isAffordable}
              className={`
                 w-full py-3.5 px-6 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-md
                 ${(!isAffordable)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none dark:bg-gray-800 dark:text-gray-600' 
                    : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
                 }
              `}
            >
              {processing ? <Loader2 className="animate-spin" /> : (isAffordable ? "Tukar Sekarang" : "Poin Tidak Cukup")}
            </button>
        </div>

      </div>
    </PageTransition>
  );
}