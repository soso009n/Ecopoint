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
  
  // State Management
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState(''); 
  const [submitting, setSubmitting] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCatalogById(id);
        setItem(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Gagal memuat data katalog");
        navigate('/catalog'); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // Handle Submit
  const handleSetor = async () => {
    if (!weight || parseFloat(weight) <= 0) {
        return toast.error("Masukkan berat sampah yang valid!");
    }
    
    setSubmitting(true);
    try {
      await createTransaction(item, weight);
      toast.success("Setoran berhasil! Poin bertambah.", {
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      navigate('/history');
    } catch (error) {
      toast.error("Gagal: " + (error.message || "Terjadi kesalahan server"));
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-green-600" size={32} />
    </div>
  );

  if (!item) return null; 

  // Kalkulasi
  const rate = item.point_per_kg || item.price_per_kg || 0;
  const estimatedPoints = weight ? Math.floor(rate * parseFloat(weight)) : 0;
  const isButtonDisabled = submitting || !weight || parseFloat(weight) <= 0;

  return (
    <PageTransition>
      {/* Container utama diberi padding bawah besar (pb-32) agar konten tidak tertutup tombol sticky */}
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-32 relative transition-colors duration-300">
        
        {/* Header Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 z-20 bg-white/80 dark:bg-gray-800/80 dark:text-white p-2 rounded-full shadow-sm backdrop-blur transition-all hover:bg-white dark:hover:bg-gray-700"
        >
          <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200"/>
        </button>

        {/* Image Banner */}
        <div className="h-72 w-full bg-gray-100 dark:bg-gray-800 relative">
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Konten Utama */}
        <div className="px-6 py-8 -mt-8 bg-white dark:bg-gray-900 rounded-t-[2rem] relative z-10 min-h-[60vh] transition-colors duration-300 shadow-sm">
          
          {/* Title Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 pr-4">
              <span className="inline-block text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-md uppercase tracking-wide mb-2">
                  {item.category}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h1>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Nilai Tukar</p>
              <div className="flex flex-col items-end">
                 <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    +{rate} <span className="text-sm">Pts</span>
                 </p>
                 <span className="text-xs text-gray-400 dark:text-gray-500">per kg</span>
              </div>
            </div>
          </div>

          {/* FORM INPUT BERAT */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-8 transition-colors duration-300">
            <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-3 flex items-center gap-2">
              <Calculator size={16}/> Hitung Setoran
            </h3>
            
            <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-blue-200 dark:border-blue-700/50 flex items-center shadow-sm focus-within:ring-2 ring-blue-400 transition-all">
              <input 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)} 
                placeholder="0" 
                min="0"
                step="0.1"
                className="w-full p-2 bg-transparent outline-none text-2xl font-bold text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 text-center"
              />
              <span className="pr-4 font-bold text-gray-400 dark:text-gray-500 text-sm">Kg</span>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-700/30">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Estimasi Perolehan:</span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">+{estimatedPoints} Poin</span>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">Deskripsi</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {item.description || "Tidak ada deskripsi tersedia untuk jenis sampah ini."}
            </p>
          </div>
        </div>

        {/* --- FIXED BOTTOM BAR (MOBILE & DESKTOP FIXED) --- */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-[999] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] dark:shadow-none transition-colors">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
             
             {/* Info Total (Muncul di Mobile & Desktop) */}
             <div className="flex flex-col">
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Total Berat</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white leading-none">
                  {weight || "0"} <span className="text-sm font-normal text-gray-500">Kg</span>
                </p>
             </div>

             {/* Tombol Aksi */}
             <button 
              onClick={handleSetor}
              disabled={isButtonDisabled}
              className={`
                flex-1 md:flex-none md:w-64 py-3.5 px-6 rounded-xl font-bold transition-all flex justify-center items-center gap-2
                ${isButtonDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' // Style saat Disabled
                  : 'bg-green-600 text-white shadow-lg shadow-green-600/30 hover:bg-green-700 active:scale-95' // Style saat Aktif
                }
              `}
            >
              {submitting ? <Loader2 className="animate-spin" /> : "Konfirmasi Setoran"}
            </button>
          </div>
        </div>
        
      </div>
    </PageTransition>
  );
}