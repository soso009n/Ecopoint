import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, uploadAvatar } from '../services/profileService'; // Import uploadAvatar
import { ArrowLeft, Save, Loader2, Camera } from 'lucide-react';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Referensi untuk input file tersembunyi
  
  const [formData, setFormData] = useState({ full_name: '', nim: '', jurusan: '', avatar_url: '' });
  const [id, setId] = useState(null);
  
  // State untuk manajemen file
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then(data => {
      setFormData(data);
      setId(data.id);
      setPreviewUrl(data.avatar_url); // Tampilkan avatar lama dulu
      setLoading(false);
    });
  }, []);

  // Saat user memilih file gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Buat preview lokal agar terlihat cepat (UX bagus)
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let finalAvatarUrl = formData.avatar_url;

      // 1. Jika ada file baru dipilih, upload dulu
      if (selectedFile) {
        finalAvatarUrl = await uploadAvatar(selectedFile);
      }

      // 2. Update data profil di database termasuk URL foto baru
      await updateProfile(id, { 
        ...formData, 
        avatar_url: finalAvatarUrl 
      });

      alert("Profil berhasil diperbarui!");
      navigate('/profile');
    } catch (error) {
      alert("Gagal: " + error.message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow-sm"><ArrowLeft size={20}/></button>
        <h1 className="text-xl font-bold text-gray-800">Edit Profil</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
        
        {/* --- AREA UPLOAD FOTO --- */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative cursor-pointer group" onClick={() => fileInputRef.current.click()}>
            <img 
              src={previewUrl || "https://ui-avatars.com/api/?name=User"} 
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow-md"
              alt="Preview"
            />
            <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg border-2 border-white group-hover:bg-blue-700 transition">
              <Camera size={18} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Ketuk foto untuk mengganti</p>
          
          {/* Input File Tersembunyi */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        {/* ------------------------ */}

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
          <input 
            type="text" 
            value={formData.full_name || ''}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">NIM</label>
          <input 
            type="text" 
            value={formData.nim || ''}
            onChange={(e) => setFormData({...formData, nim: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Jurusan</label>
          <input 
            type="text" 
            value={formData.jurusan || ''}
            onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition mt-6 flex justify-center items-center gap-2 disabled:bg-gray-400"
        >
          {saving ? <Loader2 className="animate-spin"/> : <><Save size={18}/> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  );
}