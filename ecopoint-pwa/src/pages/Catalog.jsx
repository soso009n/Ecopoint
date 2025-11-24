import { useEffect, useState } from 'react';
import { getCatalog, deleteWaste } from '../services/wasteService';
import { Link } from 'react-router-dom';
import { Search, Loader2, Plus, Edit, Trash2, PackageX } from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard'; // Import Skeleton
import PageTransition from '../components/PageTransition'; // Import Animasi

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const data = await getCatalog();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading nyala
        
        const data = await getCatalog();
        setItems(data);

        // KITA PAKSA TUNGGU 2 DETIK AGAR SKELETON TERLIHAT
        setTimeout(() => {
          setLoading(false); // Baru matikan loading setelah 2 detik
        }, 2000);

      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (e, id, name) => {
    e.preventDefault();
    if (window.confirm(`Hapus "${name}" dari katalog?`)) {
      await deleteWaste(id);
      fetchData();
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 p-6 pb-24 relative">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Katalog Sampah</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari jenis sampah..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {/* Tampilkan 5 Skeleton palsu saat loading */}
            {[1, 2, 3, 4, 5].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <PackageX className="mx-auto mb-2 opacity-50" size={48} />
                <p>Sampah "{searchTerm}" tidak ditemukan.</p>
              </div>
            )}

            {filteredItems.map((item) => (
              <Link to={`/catalog/${item.id}`} key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-all group relative">
                <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                
                <div className="flex-1 py-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{item.category}</span>
                  <h3 className="font-bold text-gray-800 mt-1">{item.name}</h3>
                  <p className="text-sm font-bold text-green-600 mt-2">Rp {item.price_per_kg} <span className="text-gray-400 font-normal">/kg</span></p>
                </div>

                <div className="flex flex-col gap-2 justify-center">
                  <Link 
                    to={`/catalog/edit/${item.id}`}
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Edit size={16} />
                  </Link>
                  <button 
                    onClick={(e) => handleDelete(e, item.id, item.name)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link to="/catalog/new" className="fixed bottom-24 right-6 bg-green-600 text-white p-4 rounded-full shadow-xl hover:bg-green-700 transition-transform hover:scale-110 z-50">
          <Plus size={24} />
        </Link>
      </div>
    </PageTransition>
  );
}