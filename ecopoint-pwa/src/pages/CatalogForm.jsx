import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createWaste, getCatalogById, updateWaste, uploadWasteImage } from '../services/wasteService';
import { ArrowLeft, Save, Camera, Loader2, Trash2 } from 'lucide-react';

export default function CatalogForm() {
  const { id } = useParams(); // Jika ada ID, berarti mode EDIT
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Plastik', // Default category
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
        // Mode Update
        await updateWaste(id, payload);
        alert("Data berhasil diperbarui!");
      } else {
        // Mode Create
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

  if (initialLoading) return <div className="p-10 text-center">Memuat Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow-sm">
          <ArrowLeft size={20}/>
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {id ? 'Edit Sampah' : 'Tambah Sampah Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* --- Upload Gambar --- */}
        <div 
          className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition h-48"
          onClick={() => fileInputRef.current.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-lg" />
          ) : (
            <div className="text-center text-gray-400">
              <Camera size={32} className="mx-auto mb-2" />
              <span className="text-xs">Ketuk untuk upload foto</span>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>

        {/* --- Form Fields --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500">Nama Sampah</label>
            <input 
              type="text" required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 mt-1 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
              placeholder="Contoh: Botol Plastik"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500">Kategori</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 mt-1 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Plastik">Plastik</option>
                <option value="Kertas">Kertas</option>
                <option value="Logam">Logam</option>
                <option value="Kaca">Kaca</option>
                <option value="Elektronik">Elektronik</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Harga (Rp/kg)</label>
              <input 
                type="number" required
                value={formData.price_per_kg}
                onChange={e => setFormData({...formData, price_per_kg: e.target.value})}
                className="w-full p-3 mt-1 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Poin (per kg)</label>
            <input 
              type="number" required
              value={formData.point_per_kg}
              onChange={e => setFormData({...formData, point_per_kg: e.target.value})}
              className="w-full p-3 mt-1 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Deskripsi</label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 mt-1 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
              placeholder="Jelaskan kondisi sampah..."
            ></textarea>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Simpan Data</>}
        </button>
      </form>
    </div>
  );
}