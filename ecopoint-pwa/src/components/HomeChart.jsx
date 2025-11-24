import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HomeChart({ data }) {
  // Data dummy jika kosong, agar grafik tetap muncul saat demo
  const chartData = data.length > 0 ? data : [
    { name: 'Plastik', value: 40 },
    { name: 'Kertas', value: 30 },
    { name: 'Logam', value: 20 },
    { name: 'Kaca', value: 10 },
  ];

  const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#9333ea'];

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <h3 className="font-bold text-gray-800 mb-4 text-sm">Statistik Setoran</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
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