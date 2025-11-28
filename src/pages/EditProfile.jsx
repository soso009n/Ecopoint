import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, uploadAvatar } from '../services/profileService'; 
import { useAuth } from '../context/AuthContext'; 
import { ArrowLeft, Save, Loader2, Camera, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  
  // Ambil object 'user' dari context
  const { updatePassword, user } = useAuth(); 
  
  const [formData, setFormData] = useState({ full_name: '', nim: '', jurusan: '', avatar_url: '' });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [id, setId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Pastikan user ada sebelum fetch
    if (!user) return;

    // Gunakan user.id yang pasti valid dari sesi Auth
    getProfile(user.id).then(data => {
      if (data) {
        setFormData(data);
        setId(data.id);
        setPreviewUrl(data.avatar_url);
      }
      setLoading(false);
    }).catch(err => {
        console.error("Gagal memuat profil:", err);
        setLoading(false);
    });
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Ukuran foto maksimal 2MB");
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // ID Target: Prioritas ID dari DB, fallback ke user.id dari sesi
      const targetId = id || user?.id;

      if (!targetId) {
        throw new Error("ID Pengguna tidak valid.");
      }

      // 1. Update Password (jika diisi)
      if (passwords.newPassword) {
        if (passwords.newPassword.length < 6) throw new Error("Password minimal 6 karakter");
        if (passwords.newPassword !== passwords.confirmPassword) throw new Error("Konfirmasi password tidak cocok");
        
        const { error } = await updatePassword(passwords.newPassword);
        if (error) throw error;
        toast.success("Password diperbarui!");
      }

      // 2. Upload Foto (jika ada)
      let finalAvatarUrl = formData.avatar_url;
      if (selectedFile) {
        finalAvatarUrl = await uploadAvatar(selectedFile);
      }

      // 3. Update Profil
      await updateProfile(targetId, { 
        id: targetId,
        ...formData, 
        avatar_url: finalAvatarUrl 
      });

      toast.success("Data profil berhasil disimpan!");
      navigate('/profile');
      
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-green-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-20 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="bg-white dark:bg-gray-800 dark:text-white p-2 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft size={20}/>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Edit Profil</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-sm border-b border-gray-100 dark:border-gray-700 pb-2">INFORMASI PRIBADI</h3>
            
            <div className="flex flex-col items-center mb-6">
                <div className="relative cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                    <img 
                    src={previewUrl || `https://ui-avatars.com/api/?name=${formData.full_name || 'User'}&background=random`} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-50 dark:border-gray-700 shadow-md"
                    alt="Preview"
                    />
                    <div className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full text-white shadow-lg group-hover:bg-green-700 transition">
                    <Camera size={16} />
                    </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Nama Lengkap</label>
                    <input 
                        type="text" required value={formData.full_name || ''}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">NIM</label>
                        <input 
                            type="text" value={formData.nim || ''}
                            onChange={(e) => setFormData({...formData, nim: e.target.value})}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Jurusan</label>
                        <input 
                            type="text" value={formData.jurusan || ''}
                            onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-sm border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                <Lock size={16}/> KEAMANAN AKUN
            </h3>
            
            <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300 mb-2">
                    Kosongkan jika tidak ingin mengganti password.
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Password Baru</label>
                    <input 
                        type="password" value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Minimal 6 karakter"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Konfirmasi Password</label>
                    <input 
                        type="password" value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ulangi password baru"
                    />
                </div>
            </div>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex justify-center items-center gap-2">
          {saving ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  );
}