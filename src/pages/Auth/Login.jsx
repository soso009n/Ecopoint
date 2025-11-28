import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import PageTransition from '../../components/PageTransition';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Eksekusi Login
    const { error } = await login(email, password);

    if (error) {
      toast.error("Gagal login. Periksa email atau password Anda.");
    } else {
      toast.success("Selamat datang kembali!");
      navigate('/'); 
    }
    setLoading(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="hidden lg:flex lg:w-1/2 bg-green-50 dark:bg-green-900/20 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-green-600/10 to-transparent"></div>
          <div className="z-10 text-center px-10">
            <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 mb-4">EcoPoint</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Ubah sampah menjadi berkah. Bergabunglah dengan ribuan pahlawan lingkungan lainnya.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto lg:mx-0 mb-4 text-2xl">
                ♻️
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Masuk Akun</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Silakan masuk untuk melanjutkan</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
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
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> Masuk</>}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Belum punya akun?{' '}
              <Link to="/register" className="font-bold text-green-600 hover:text-green-500 hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}