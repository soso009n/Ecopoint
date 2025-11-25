import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function AboutApp() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      {/* UPDATE: bg-white -> dark:bg-gray-900 & text adjustment */}
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex flex-col items-center justify-center text-center relative transition-colors duration-300">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20}/>
        </button>
        
        {/* Logo Container */}
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-3xl flex items-center justify-center mb-6 transition-colors">
          <span className="text-4xl">♻️</span>
        </div>
        
        {/* Title & Version */}
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-500 transition-colors">EcoPoint</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 transition-colors">Versi 1.0.0 (Beta)</p>

        {/* Info Card Container */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl w-full text-left space-y-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm transition-colors">Tentang</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed transition-colors">
              EcoPoint adalah aplikasi Bank Sampah Digital berbasis Progressive Web Apps (PWA) yang dibuat untuk memenuhi Tugas Akhir Praktikum Pemrograman Perangkat Bergerak.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm transition-colors">Pengembang</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Mahasiswa Teknik Komputer UNDIP</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm transition-colors">Teknologi</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">React JS, Vite, Tailwind CSS, Supabase</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 text-xs text-gray-300 dark:text-gray-600 transition-colors">
          &copy; 2025 EcoPoint Team
        </div>
      </div>
    </PageTransition>
  );
}