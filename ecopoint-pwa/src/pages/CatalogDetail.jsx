import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCatalogById } from '../services/wasteService';
import { createTransaction } from '../services/transactionService'; // Wajib import ini
import { ArrowLeft, CheckCircle, Calculator, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CatalogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Data
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State Input User (Fitur Interaktif)
  const [weight, setWeight] = useState(''); 
  const [submitting, setSubmitting] = useState(false);

  // Ambil data saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCatalogById(id);
        setItem(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fungsi Tombol "Konfirmasi Setoran"
  const handleSetor = async () => {
    if (!weight || weight <= 0) return alert("Masukkan berat sampah dengan benar!");
    
    setSubmitting(true);
    // Ganti bagian ini:
    try {
      await createTransaction(item, weight);
      
      // Ganti alert dengan ini:
      toast.success("Setoran berhasil! Poin bertambah.", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      
      navigate('/history');
    } catch (error) {
      // Ganti alert error:
      toast.error("Gagal: " + error.message);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Memuat...</div>;
  if (!item) return <div className="p-10 text-center text-red-500">Item tidak ditemukan.</div>;

  // Rumus Hitung Otomatis
  const estimatedPoints = weight ? Math.floor(item.point_per_kg * weight) : 0;

  return (
    <div className="min-h-screen bg-white pb-32 relative">
      {/* Header */}
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full shadow-sm backdrop-blur">
        <ArrowLeft size={24} className="text-gray-700"/>
      </button>

      <div className="h-64 w-full bg-gray-100">
        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Konten */}
      <div className="px-6 py-6 -mt-6 bg-white rounded-t-3xl relative z-0 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase">{item.category}</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{item.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Nilai Tukar</p>
            <p className="text-lg font-bold text-green-600">+{item.point_per_kg} Poin<span className="text-xs text-gray-400 font-normal">/kg</span></p>
          </div>
        </div>

        {/* --- FORM INPUT BERAT (YANG SEBELUMNYA HILANG) --- */}
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 mb-6">
          <h3 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
            <Calculator size={16}/> Hitung Setoran
          </h3>
          
          <div className="bg-white p-1 rounded-xl border border-blue-200 flex items-center shadow-sm">
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="0" 
              className="w-full p-3 rounded-lg outline-none text-lg font-semibold text-gray-800 placeholder-gray-300"
            />
            <span className="pr-4 font-bold text-gray-400">Kg</span>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-200/50">
            <span className="text-sm text-blue-600">Estimasi:</span>
            <span className="text-xl font-bold text-blue-700">+{estimatedPoints} Poin</span>
          </div>
        </div>
        {/* ------------------------------------------------- */}

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-bold text-gray-800 mb-2">Deskripsi</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
        </div>
      </div>

      {/* Tombol Konfirmasi */}
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-gray-100 p-4 pb-8 z-20">
        <button 
          onClick={handleSetor}
          disabled={submitting}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition active:scale-95 disabled:bg-gray-300 flex justify-center items-center gap-2"
        >
          {submitting ? <Loader2 className="animate-spin" /> : "Konfirmasi Setoran"}
        </button>
      </div>
    </div>
  );
}