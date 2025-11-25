// src/pages/CatalogDetail.jsx
// (Menggantikan konten file asli)

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCatalogById } from '../services/wasteService';
import { createTransaction } from '../services/transactionService'; 
import { ArrowLeft, Calculator, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';

export default function CatalogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState(''); 
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCatalogById(id);
        setItem(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Gagal memuat data");
        navigate('/catalog'); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSetor = async () => {
    if (!weight || parseFloat(weight) <= 0) return toast.error("Masukkan berat valid!");
    setSubmitting(true);
    try {
      await createTransaction(item, weight);
      toast.success("Setoran berhasil!");
      navigate('/history');
    } catch (error) {
      toast.error("Gagal: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin"/></div>;
  if (!item) return null; 

  const rate = item.point_per_kg || item.price_per_kg || 0;
  const estimatedPoints = weight ? Math.floor(rate * parseFloat(weight)) : 0;
  const isButtonDisabled = submitting || !weight || parseFloat(weight) <= 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-32 md:pb-10 relative transition-colors">
        
        {/* Header Nav */}
        <div className="p-4 md:pt-8">
            <button onClick={() => navigate(-1)} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200"/>
            </button>
        </div>

        {/* --- LAYOUT GRID: Mobile (Stack) vs Desktop (2 Kolom) --- */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
            
            {/* KOLOM KIRI: GAMBAR */}
            <div className="h-64 md:h-[500px] w-full bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm relative group">
                <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                />
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold text-green-700 dark:text-green-400 shadow-lg">
                    {item.category}
                </div>
            </div>

            {/* KOLOM KANAN: DETAIL & FORM */}
            <div className="flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h1>
                
                <div className="flex items-end gap-2 mb-6">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">+{rate} Poin</span>
                    <span className="text-sm text-gray-400 pb-1">/ kg</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 mb-8">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-lg">Deskripsi</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                        {item.description || "Tidak ada deskripsi."}
                    </p>
                </div>

                {/* Card Kalkulator */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                        <Calculator size={20}/> Masukkan Berat Sampah
                    </h3>
                    
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 relative">
                            <input 
                                type="number" 
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)} 
                                placeholder="0.0" 
                                className="w-full p-4 text-2xl font-bold bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white text-center"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Kg</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-3 border-t border-blue-200/50 dark:border-blue-700/30">
                        <span className="text-sm text-blue-600 dark:text-blue-400">Estimasi Perolehan:</span>
                        <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">+{estimatedPoints} Poin</span>
                    </div>

                    {/* Tombol Aksi (Responsive: Full Width di dalam Card pada Desktop) */}
                    <button 
                        onClick={handleSetor}
                        disabled={isButtonDisabled}
                        className={`
                            w-full py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 mt-4 text-lg shadow-lg
                            ${isButtonDisabled
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600 shadow-none'
                            : 'bg-green-600 text-white hover:bg-green-700 hover:-translate-y-1 shadow-green-600/30'
                            }
                        `}
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : "Konfirmasi Setoran"}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </PageTransition>
  );
}