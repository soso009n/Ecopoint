import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createReward, getRewardById, updateReward, uploadRewardImage } from '../services/rewardService';
import { ArrowLeft, Save, Camera, Loader2 } from 'lucide-react';

export default function RewardForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    points_required: '',
    category: 'Voucher', // Default
    description: '',
    image_url: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load data jika Edit Mode
  useEffect(() => {
    if (id) {
      getRewardById(id).then((data) => {
        setFormData(data);
        setPreviewUrl(data.image_url);
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
      if (selectedFile) {
        finalImageUrl = await uploadRewardImage(selectedFile);
      }

      const payload = { ...formData, image_url: finalImageUrl };

      if (id) {
        await updateReward(id, payload);
        alert("Hadiah berhasil diperbarui!");
      } else {
        await createReward(payload);
        alert("Hadiah baru ditambahkan!");
      }
      navigate('/rewards');
    } catch (error) {
      alert("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow-sm"><ArrowLeft size={20}/></button>
        <h1 className="text-xl font-bold text-gray-800">{id ? 'Edit Hadiah' : 'Tambah Hadiah'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload Gambar */}
        <div 
          className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer h-40"
          onClick={() => fileInputRef.current.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} className="h-full object-contain" alt="Preview" />
          ) : (
            <div className="text-center text-gray-400">
              <Camera size={32} className="mx-auto mb-2" />
              <span className="text-xs">Upload Foto Hadiah</span>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500">Nama Hadiah</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 mt-1 bg-gray-50 rounded-xl" placeholder="Contoh: Voucher Pulsa 10rb" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500">Harga Poin</label>
              <input required type="number" value={formData.points_required} onChange={e => setFormData({...formData, points_required: e.target.value})} className="w-full p-3 mt-1 bg-gray-50 rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Kategori</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 mt-1 bg-gray-50 rounded-xl">
                <option value="Voucher">Voucher</option>
                <option value="E-Wallet">E-Wallet</option>
                <option value="Pulsa">Pulsa</option>
                <option value="PLN">Token PLN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Deskripsi</label>
            <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 mt-1 bg-gray-50 rounded-xl" placeholder="Keterangan hadiah..."></textarea>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition flex justify-center items-center gap-2">
          {loading ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Simpan Hadiah</>}
        </button>
      </form>
    </div>
  );
}