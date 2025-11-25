// src/pages/Rewards.jsx
import { useEffect, useState } from 'react';
import { getRewards, deleteReward } from '../services/rewardService';
import { Link } from 'react-router-dom';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    getRewards().then(setRewards).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (e, id, name) => {
    e.preventDefault();
    if (confirm(`Hapus hadiah "${name}"?`)) {
      await deleteReward(id);
      loadData();
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8 pb-24 relative transition-colors duration-300">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 md:mb-8 transition-colors">
          Tukar Poin
        </h1>
        
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin text-gray-400"/>
          </div>
        ) : (
          /* PERBAIKAN GRID: Responsif untuk tablet (3 kolom) dan desktop (4 kolom) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {rewards.map((item) => (
              <Link 
                to={`/rewards/${item.id}`} 
                key={item.id} 
                className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group w-full"
              >
                
                {/* Tombol Edit & Delete (Muncul di pojok kanan atas) */}
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <Link 
                    to={`/rewards/edit/${item.id}`} 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    <Edit size={14} />
                  </Link>
                  <button 
                    onClick={(e) => handleDelete(e, item.id, item.name)} 
                    className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Konten Card */}
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain mb-3 mt-2" 
                />
                
                <h3 className="font-bold text-gray-800 dark:text-white text-xs md:text-sm line-clamp-2 h-8 md:h-10 transition-colors">
                  {item.name}
                </h3>
                
                <span className="mt-2 text-orange-500 dark:text-orange-400 font-bold text-sm md:text-base">
                  {item.points_required} Poin
                </span>
                
                <div className="mt-3 w-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 py-2 rounded-lg text-xs font-bold transition-colors group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30">
                  Tukar
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        <Link 
          to="/rewards/new" 
          className="fixed bottom-24 right-6 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-110 z-50"
        >
          <Plus size={24} />
        </Link>
      </div>
    </PageTransition>
  );
}