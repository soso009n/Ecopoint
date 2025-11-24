import { ArrowLeft, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function AboutApp() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 bg-gray-100 p-2 rounded-full"><ArrowLeft size={20}/></button>
        
        <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-4xl">♻️</span>
        </div>
        
        <h1 className="text-2xl font-bold text-green-700">EcoPoint</h1>
        <p className="text-gray-500 text-sm mb-8">Versi 1.0.0 (Beta)</p>

        <div className="bg-gray-50 p-6 rounded-2xl w-full text-left space-y-4">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Tentang</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              EcoPoint adalah aplikasi Bank Sampah Digital berbasis Progressive Web Apps (PWA) yang dibuat untuk memenuhi Tugas Akhir Praktikum Pemrograman Perangkat Bergerak.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Pengembang</h3>
            <p className="text-xs text-gray-500 mt-1">Mahasiswa Teknik Komputer UNDIP</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Teknologi</h3>
            <p className="text-xs text-gray-500 mt-1">React JS, Vite, Tailwind CSS, Supabase</p>
          </div>
        </div>

        <div className="mt-auto pt-10 text-xs text-gray-300">
          &copy; 2025 EcoPoint Team
        </div>
      </div>
    </PageTransition>
  );
}