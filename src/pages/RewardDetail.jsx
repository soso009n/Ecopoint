import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRewardById, redeemReward } from '../services/rewardService';
import { getTransactionSummary } from '../services/transactionService'; // Cek saldo dulu
import { ArrowLeft, Gift, Loader2 } from 'lucide-react';

export default function RewardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const reward = await getRewardById(id);
      const stats = await getTransactionSummary();
      setItem(reward);
      setCurrentPoints(stats.totalPoints);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleRedeem = async () => {
    if (currentPoints < item.points_required) return alert("Poin Anda tidak cukup!");
    
    if (confirm(`Tukar ${item.points_required} poin untuk ${item.name}?`)) {
      setProcessing(true);
      try {
        await redeemReward(item);
        alert("Penukaran Berhasil! Cek halaman riwayat.");
        navigate('/history');
      } catch (error) {
        alert("Gagal: " + error.message);
      } finally {
        setProcessing(false);
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 bg-gray-100 p-2 rounded-full"><ArrowLeft size={24} /></button>
      
      <div className="h-64 bg-orange-50 flex items-center justify-center p-10">
        <img src={item.image_url} className="w-40 h-40 object-contain drop-shadow-xl" />
      </div>

      <div className="p-6">
        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">{item.category}</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">{item.name}</h1>
        <p className="text-gray-500 mt-4 text-sm leading-relaxed">{item.description}</p>
        
        <div className="mt-8 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">Saldo Anda:</span>
            <span className="font-bold text-gray-800">{currentPoints} Poin</span>
          </div>
          <div className="flex justify-between items-center text-orange-600">
            <span className="text-sm">Harga:</span>
            <span className="font-bold text-xl">-{item.points_required} Poin</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md bg-white border-t p-4 z-20">
        <button 
          onClick={handleRedeem}
          disabled={processing || currentPoints < item.points_required}
          className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition disabled:bg-gray-300 flex justify-center items-center gap-2"
        >
          {processing ? <Loader2 className="animate-spin"/> : "Tukar Sekarang"}
        </button>
      </div>
    </div>
  );
}