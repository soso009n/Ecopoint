import { useEffect, useState } from 'react';
import { getTransactionSummary } from '../services/transactionService';
import { ArrowLeft, Award, Lock } from 'lucide-react';
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
    getTransactionSummary().then(data => setPoints(data.totalPoints));
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow-sm"><ArrowLeft size={20}/></button>
          <h1 className="text-xl font-bold text-gray-800">Pencapaian Saya</h1>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg mb-6 text-center">
          <p className="text-sm opacity-90 mb-1">Poin Saat Ini</p>
          <h2 className="text-4xl font-bold">{points}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => {
            const isUnlocked = points >= badge.min;
            return (
              <div key={badge.id} className={`p-4 rounded-xl border ${isUnlocked ? 'bg-white border-green-200 shadow-sm' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl">{badge.icon}</span>
                  {!isUnlocked && <Lock size={16} className="text-gray-400"/>}
                </div>
                <h3 className={`font-bold text-sm ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>{badge.name}</h3>
                <p className="text-[10px] text-gray-400 mt-1">{badge.desc}</p>
                <div className="mt-3 text-[10px] font-semibold text-green-600">
                  {isUnlocked ? 'TERBUKA' : `Butuh ${badge.min} Poin`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}