import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createWaste, getCatalogById, updateWaste, uploadWasteImage } from '../services/wasteService';
import { ArrowLeft, Save, Camera, Loader2 } from 'lucide-react';

export default function CatalogForm() {
  const { id } = useParams(); // Jika ada ID, berarti mode EDIT
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Plastik', 
    price_per_kg: '',
    point_per_kg: '',
    description: '',
    image_url: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  // Load data jika mode Edit
  useEffect(() => {
    if (id) {
      getCatalogById(id).then((data) => {
        setFormData(data);
        setPreviewUrl(data.image_url);
        setInitialLoading(false);
      });
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      // 1. Upload Gambar jika ada file baru
      if (selectedFile) {
        finalImageUrl = await uploadWasteImage(selectedFile);
      }

      const payload = { ...formData, image_url: finalImageUrl };

      if (id) {
        await updateWaste(id, payload);
        alert("Data berhasil diperbarui!");
      } else {
        await createWaste(payload);
        alert("Data baru berhasil ditambahkan!");
      }
      navigate('/catalog');
    } catch (error) {
      alert("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-10 text-center dark:text-white">Memuat Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-24 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="bg-white dark:bg-gray-800 dark:text-white p-2 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft size={20}/>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white transition-colors">
          {id ? 'Edit Sampah' : 'Tambah Sampah Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* --- Upload Gambar --- */}
        <div 
          className="bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors h-48"
          onClick={() => fileInputRef.current.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-lg" />
          ) : (
            <div className="text-center text-gray-400 dark:text-gray-500">
              <Camera size={32} className="mx-auto mb-2" />
              <span className="text-xs">Ketuk untuk upload foto</span>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>

        {/* --- Form Fields --- */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 transition-colors duration-300">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">Nama Sampah</label>
            <input 
              type="text" required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-colors placeholder-gray-400"
              placeholder="Contoh: Botol Plastik"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">Kategori</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                <option value="Plastik">Plastik</option>
                <option value="Kertas">Kertas</option>
                <option value="Logam">Logam</option>
                <option value="Kaca">Kaca</option>
                <option value="Elektronik">Elektronik</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">Harga (Rp/kg)</label>
              <input 
                type="number" required
                value={formData.price_per_kg}
                onChange={e => setFormData({...formData, price_per_kg: e.target.value})}
                className="w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">Poin (per kg)</label>
            <input 
              type="number" required
              value={formData.point_per_kg}
              onChange={e => setFormData({...formData, point_per_kg: e.target.value})}
              className="w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">Deskripsi</label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-colors placeholder-gray-400"
              placeholder="Jelaskan kondisi sampah..."
            ></textarea>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 transition flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Simpan Data</>}
        </button>
      </form>
    </div>
  );
}