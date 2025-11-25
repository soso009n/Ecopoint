import { useEffect, useState, useCallback } from 'react';
import { getCatalog, deleteWaste } from '../services/wasteService';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, PackageX, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import SkeletonCard from '../components/SkeletonCard'; 
import PageTransition from '../components/PageTransition'; 

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch data dengan opsi background refresh (tanpa loading skeleton penuh)
  const fetchData = useCallback(async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) setLoading(true);
    try {
      const data = await getCatalog();
      setItems(data);
    } catch (error) {
      console.error("Gagal memuat katalog:", error);
      toast.error("Gagal memuat data katalog.");
    } finally {
      if (!isBackgroundRefresh) setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(true);
  };

  const handleDelete = async (e, id, name) => {
    e.preventDefault(); // Mencegah navigasi Link saat tombol hapus diklik
    e.stopPropagation();
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
      const loadingToast = toast.loading('Menghapus data...');
      try {
        await deleteWaste(id);
        toast.dismiss(loadingToast);
        toast.success(`"${name}" berhasil dihapus`);
        fetchData(true); // Refresh data
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Gagal menghapus item.");
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-28 md:pb-10 relative transition-colors duration-300">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Katalog Sampah</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Kelola jenis dan harga sampah</p>
          </div>
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing || loading}
            className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-green-600 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh Data"
          >
            <RefreshCw size={20} />
          </button>
        </div>
        
        {/* SEARCH BAR */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-green-500 transition-colors" size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Cari nama sampah..." 
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 shadow-sm text-gray-800 dark:text-white placeholder-gray-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400 dark:text-gray-500">
                <PackageX className="mx-auto mb-3 opacity-50" size={56} />
                <p className="font-medium">Data tidak ditemukan</p>
                <p className="text-sm">Coba kata kunci lain atau tambahkan item baru.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Link 
                  to={`/catalog/${item.id}`} 
                  key={item.id} 
                  className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 hover:shadow-md hover:border-green-200 dark:hover:border-green-900 transition-all group relative items-center"
                >
                  {/* Image Thumbnail */}
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/150?text=No+Image'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=No+Img'; }} 
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 py-1 min-w-0">
                    <div className="flex items-start justify-between">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                         {item.category}
                       </span>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mt-1.5 truncate text-base group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {item.name}
                    </h3>
                    
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                      <span className="text-green-600 dark:text-green-500 mr-0.5">Rp</span> 
                      {formatCurrency(item.price_per_kg)} 
                      <span className="text-gray-400 dark:text-gray-500 font-normal text-xs ml-1">/kg</span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 pl-2 border-l border-gray-100 dark:border-gray-700 ml-1">
                    <Link 
                      to={`/catalog/edit/${item.id}`}
                      onClick={(e) => e.stopPropagation()} 
                      className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={(e) => handleDelete(e, item.id, item.name)}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        <Link 
          to="/catalog/new" 
          className="fixed bottom-24 md:bottom-10 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl shadow-lg shadow-green-600/30 transition-transform hover:scale-105 active:scale-95 z-40 flex items-center justify-center"
          aria-label="Tambah Sampah Baru"
        >
          <Plus size={24} strokeWidth={2.5} />
        </Link>
      </div>
    </PageTransition>
  );
}