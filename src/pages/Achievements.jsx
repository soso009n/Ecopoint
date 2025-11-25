import { useEffect, useState } from 'react';
import { getTransactionSummary } from '../services/transactionService';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function Achievements() {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);

  // Daftar Lencana & Syarat Poin
  const badges = [
    { id: 1, name: 'Pendatang Baru', min: 0, icon: '🌱', desc: 'Mulai perjalanan hijau.' },
    { id: 2, name: 'Rajin Setor', min: 200, icon: '♻️', desc: 'Total poin mencapai 200.' },
    { id: 3, name: 'Eco Warrior', min: 500, icon: '🛡️', desc: 'Pahlawan lingkungan sejati!' },
    { id: 4, name: 'Sultan Sampah', min: 1000, icon: '👑', desc: 'Poin tembus 1000++' },
    { id: 5, name: 'Earth Guardian', min: 2000, icon: '🌍', desc: 'Pelindung bumi level max.' },
    { id: 6, name: 'Legendary', min: 5000, icon: '💎', desc: 'Level tertinggi di EcoPoint.' },
  ];

  useEffect(() => {
    // Pastikan service menangani error/empty state jika perlu
    getTransactionSummary().then(data => setPoints(data?.totalPoints || 0));
  }, []);

  return (
    <PageTransition>
      {/* Main Container Dark Mode */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-24 transition-colors duration-300">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-white dark:bg-gray-800 dark:text-gray-200 p-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <ArrowLeft size={20}/>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white transition-colors">Pencapaian Saya</h1>
        </div>

        {/* Current Points Card */}
        <div className="bg-green-600 dark:bg-green-700 text-white p-6 rounded-2xl shadow-lg shadow-green-900/20 mb-6 text-center transition-colors duration-300">
          <p className="text-sm opacity-90 mb-1">Poin Saat Ini</p>
          <h2 className="text-4xl font-bold">{points}</h2>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => {
            const isUnlocked = points >= badge.min;
            
            return (
              <div 
                key={badge.id} 
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isUnlocked 
                    ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800 shadow-sm' // Style Terbuka
                    : 'bg-gray-100 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 opacity-70 grayscale' // Style Terkunci
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl filter drop-shadow-sm">{badge.icon}</span>
                  {!isUnlocked && <Lock size={16} className="text-gray-400 dark:text-gray-600"/>}
                </div>
                
                <h3 className={`font-bold text-sm mb-1 transition-colors ${
                  isUnlocked ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {badge.name}
                </h3>
                
                <p className="text-[10px] text-gray-400 dark:text-gray-400 leading-tight">
                  {badge.desc}
                </p>
                
                <div className={`mt-3 text-[10px] font-bold tracking-wide uppercase ${
                    isUnlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'
                }`}>
                  {isUnlocked ? 'Terbuka' : `Butuh ${badge.min} Poin`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}