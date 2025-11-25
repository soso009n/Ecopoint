// components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div 
      role="status" 
      className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 animate-pulse transition-colors duration-300"
    >
      {/* Kotak Gambar */}
      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0"></div>
      
      {/* Garis-garis Teks */}
      <div className="flex-1 py-1 space-y-3">
        {/* Judul kecil (Kategori) */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        
        {/* Judul Utama */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        
        {/* Footer (Harga/Poin) */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-auto"></div>
      </div>
      
      {/* Screen Reader Only (Aksesibilitas) */}
      <span className="sr-only">Loading...</span>
    </div>
  );
}