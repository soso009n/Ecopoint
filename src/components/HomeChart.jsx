import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HomeChart({ data }) {
  // Logic Data: Gunakan dummy jika data kosong
  const chartData = data && data.length > 0 ? data : [
    { name: 'Plastik', value: 40 },
    { name: 'Kertas', value: 30 },
    { name: 'Logam', value: 20 },
    { name: 'Kaca', value: 10 },
  ];

  const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#9333ea'];

  return (
    <div className="mb-6">
      {/* Judul dengan dukungan Dark Mode */}
      <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-sm ml-1 transition-colors duration-300">
        Statistik Setoran
      </h3>
      
      {/* Container Grafik: 
          - Support Dark Mode (dark:bg-gray-800)
          - Shadow halus dan Border yang sesuai
          - Height diset ke h-56 agar proporsional
      */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 h-56 transition-colors duration-300">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="name" 
              tick={{fontSize: 10, fill: '#9ca3af'}} 
              axisLine={false} 
              tickLine={false} 
              interval={0}
            />
            
            {/* Tooltip Custom Style */}
            <Tooltip 
              cursor={{fill: 'rgba(0,0,0,0.05)'}}
              contentStyle={{
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff', // Putih tetap bersih untuk tooltip
                color: '#1f2937',
                padding: '8px 12px'
              }}
            />
            
            {/* Bar dengan radius rounded penuh (capsule look) */}
            <Bar dataKey="value" radius={[6, 6, 6, 6]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}