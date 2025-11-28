import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, uploadAvatar } from '../services/profileService'; 
import { useAuth } from '../context/AuthContext'; // Import Auth Context
import { ArrowLeft, Save, Loader2, Camera, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  
  // PERBAIKAN 1: Ambil object 'user' dari useAuth untuk mendapatkan ID yang pasti valid
  const { updatePassword, user } = useAuth(); 
  
  const [formData, setFormData] = useState({ full_name: '', nim: '', jurusan: '', avatar_url: '' });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [id, setId] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load data profil saat halaman dibuka
    getProfile().then(data => {
      if (data) {
        setFormData(data);
        setId(data.id);
        setPreviewUrl(data.avatar_url);
      }
      setLoading(false);
    }).catch(err => {
        console.error(err);
        // Jangan tampilkan toast error di sini agar UX tidak mengganggu jika profil memang kosong (pengguna baru)
        setLoading(false);
    });
  }, []);

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
      // PERBAIKAN 2: Tentukan target ID. 
      // Prioritaskan 'id' dari database, jika null (profil belum dibuat), gunakan 'user.id' dari sesi login.
      const targetId = id || user?.id;

      if (!targetId) {
        throw new Error("ID Pengguna tidak ditemukan. Silakan refresh atau login ulang.");
      }

      // 1. Update Password (Jika diisi)
      if (passwords.newPassword) {
        if (passwords.newPassword.length < 6) {
            throw new Error("Password baru minimal 6 karakter");
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            throw new Error("Konfirmasi password tidak cocok");
        }
        
        const { error: passError } = await updatePassword(passwords.newPassword);
        if (passError) throw passError;
        toast.success("Password berhasil diubah!");
      }

      // 2. Upload Foto (Jika ada file baru)
      let finalAvatarUrl = formData.avatar_url;
      if (selectedFile) {
        finalAvatarUrl = await uploadAvatar(selectedFile);
      }

      // 3. Update Data Profil (Gunakan targetId yang sudah dipastikan valid)
      // Kita tambahkan id ke dalam object data juga untuk berjaga-jaga jika menggunakan UPSERT di masa depan
      await updateProfile(targetId, { 
        id: targetId, // Pastikan ID ikut dikirim jika row belum ada
        ...formData, 
        avatar_url: finalAvatarUrl 
      });

      toast.success("Profil berhasil diperbarui!");
      
      setPasswords({ newPassword: '', confirmPassword: '' });
      navigate('/profile');
      
    } catch (error) {
      // Error handling yang lebih rapi
      console.error("Save Error:", error);
      toast.error(error.message || "Gagal menyimpan perubahan.");
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
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="bg-white dark:bg-gray-800 dark:text-white p-2 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft size={20}/>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white transition-colors">Edit Profil</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- SECTION 1: DATA DIRI --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-sm border-b border-gray-100 dark:border-gray-700 pb-2">INFORMASI PRIBADI</h3>
            
            {/* Upload Foto */}
            <div className="flex flex-col items-center mb-6">
            <div className="relative cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                <img 
                src={previewUrl || `https://ui-avatars.com/api/?name=${formData.full_name || 'User'}&background=random`} 
                className="w-24 h-24 rounded-full object-cover border-4 border-green-50 dark:border-gray-700 shadow-md transition-colors"
                alt="Preview"
                onError={(e) => {e.target.src = "https://via.placeholder.com/150"}}
                />
                <div className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full text-white shadow-lg border-2 border-white dark:border-gray-800 group-hover:bg-green-700 transition">
                <Camera size={16} />
                </div>
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Nama Lengkap</label>
                    <input 
                        type="text" 
                        required
                        value={formData.full_name || ''}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">NIM</label>
                        <input 
                            type="text" 
                            value={formData.nim || ''}
                            onChange={(e) => setFormData({...formData, nim: e.target.value})}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Jurusan</label>
                        <input 
                            type="text" 
                            value={formData.jurusan || ''}
                            onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* --- SECTION 2: KEAMANAN (GANTI PASSWORD) --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
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
                        type="password" 
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400"
                        placeholder="Minimal 6 karakter"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Konfirmasi Password</label>
                    <input 
                        type="password" 
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Ulangi password baru"
                    />
                </div>
            </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 hover:-translate-y-1 transition-all mt-6 flex justify-center items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {saving ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  );
}