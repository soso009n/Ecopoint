import { useEffect, useState } from 'react';
import { getRewards, deleteReward } from '../services/rewardService';
import { Link } from 'react-router-dom';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import PageTransition from '../components/PageTransition'; // Import Animasi

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
      <div className="min-h-screen bg-gray-50 p-6 pb-24 relative">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tukar Poin</h1>
        
        {loading ? (
          <div className="flex justify-center mt-10"><Loader2 className="animate-spin"/></div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {rewards.map((item) => (
              <Link to={`/rewards/${item.id}`} key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition relative group">
                
                <div className="absolute top-2 right-2 flex gap-1">
                  <Link to={`/rewards/edit/${item.id}`} onClick={(e) => e.stopPropagation()} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Edit size={14} />
                  </Link>
                  <button onClick={(e) => handleDelete(e, item.id, item.name)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                    <Trash2 size={14} />
                  </button>
                </div>

                <img src={item.image_url} alt={item.name} className="w-16 h-16 object-contain mb-3 mt-2" />
                <h3 className="font-bold text-gray-800 text-xs line-clamp-2 h-8">{item.name}</h3>
                <span className="mt-2 text-orange-500 font-bold text-sm">{item.points_required} Poin</span>
                
                <div className="mt-3 w-full bg-orange-50 text-orange-600 py-1.5 rounded-lg text-xs font-bold">
                  Tukar
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link to="/rewards/new" className="fixed bottom-24 right-6 bg-orange-600 text-white p-4 rounded-full shadow-xl hover:bg-orange-700 transition-transform hover:scale-110 z-50">
          <Plus size={24} />
        </Link>
      </div>
    </PageTransition>
  );
}