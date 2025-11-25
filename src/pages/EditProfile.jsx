import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, uploadAvatar } from '../services/profileService'; 
import { ArrowLeft, Save, Loader2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  
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
      setPreviewUrl(data.avatar_url); 
      setLoading(false);
    });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let finalAvatarUrl = formData.avatar_url;

      if (selectedFile) {
        finalAvatarUrl = await uploadAvatar(selectedFile);
      }

      await updateProfile(id, { 
        ...formData, 
        avatar_url: finalAvatarUrl 
      });

      toast.success("Profil berhasil diperbarui!");
      navigate('/profile');
    } catch (error) {
      toast.error("Gagal: " + error.message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="bg-white dark:bg-gray-800 dark:text-white p-2 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft size={20}/>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white transition-colors">Edit Profil</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-5 transition-colors duration-300">
        
        {/* --- AREA UPLOAD FOTO --- */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative cursor-pointer group" onClick={() => fileInputRef.current.click()}>
            <img 
              src={previewUrl || "https://ui-avatars.com/api/?name=User"} 
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-md transition-colors"
              alt="Preview"
            />
            <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg border-2 border-white dark:border-gray-800 group-hover:bg-blue-700 transition">
              <Camera size={18} />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 transition-colors">Ketuk foto untuk mengganti</p>
          
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
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 transition-colors">Nama Lengkap</label>
          <input 
            type="text" 
            value={formData.full_name || ''}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 transition-colors">NIM</label>
          <input 
            type="text" 
            value={formData.nim || ''}
            onChange={(e) => setFormData({...formData, nim: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 transition-colors">Jurusan</label>
          <input 
            type="text" 
            value={formData.jurusan || ''}
            onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition mt-6 flex justify-center items-center gap-2 disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          {saving ? <Loader2 className="animate-spin"/> : <><Save size={18}/> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  );
}