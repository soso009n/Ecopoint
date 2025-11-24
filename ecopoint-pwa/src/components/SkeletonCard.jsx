export default function SkeletonCard() {
  return (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4 animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 py-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
      </div>
    </div>
  );
}