import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import PageTransition from '../../components/PageTransition';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
        toast.error("Password minimal 6 karakter.");
        setLoading(false);
        return;
    }

    const { error } = await register(email, password, fullName);

    if (error) {
      toast.error(error.message || "Gagal mendaftar.");
    } else {
      toast.success("Pendaftaran berhasil! Silakan login.");
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
        
        {/* Kolom Kiri: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 order-2 lg:order-1">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Buat Akun Baru</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Bergabunglah dengan komunitas EcoPoint</p>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="Budi Santoso"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Daftar</>}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-bold text-green-600 hover:text-green-500 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Gambar (Hidden di Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-50 dark:bg-blue-900/20 items-center justify-center relative overflow-hidden order-1 lg:order-2">
          <div className="absolute inset-0 bg-linear-to-bl from-blue-600/10 to-transparent"></div>
          <div className="z-10 text-center px-10">
            <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4">Mulai Langkah Hijau</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Satu langkah kecil untuk daur ulang, satu lompatan besar untuk bumi.
            </p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}