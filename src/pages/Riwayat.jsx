import { useEffect, useState } from 'react';
import { getHistory, deleteTransaction } from '../services/transactionService';
import { Calendar, ArrowUpRight, Loader2, Trash2, Printer, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageTransition from '../components/PageTransition';

export default function Riwayat() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getHistory();
      setTransactions(data);
    } catch (error) {
      console.error("Gagal ambil riwayat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus riwayat "${name}"?`)) {
      try {
        await deleteTransaction(id);
        setTransactions(transactions.filter(item => item.id !== id));
      } catch (error) {
        alert("Gagal menghapus: " + error.message);
      }
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false
    });
  };

  const handlePrint = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Laporan Riwayat EcoPoint", 14, 22);
      doc.setFontSize(10);
      doc.text("Dicetak pada: " + new Date().toLocaleString('id-ID'), 14, 30);
      doc.text("Total Transaksi: " + transactions.length, 14, 35);

      const tableColumn = ["No", "Waktu", "Aktivitas", "Berat", "Poin", "Status"];
      const tableRows = [];

      transactions.forEach((item, index) => {
        const transactionData = [
          index + 1,
          formatDateTime(item.date),
          item.waste_name,
          item.weight_kg ? `${item.weight_kg} kg` : '-',
          item.total_points,
          item.status
        ];
        tableRows.push(transactionData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] },
        styles: { fontSize: 8 },
        columnStyles: { 1: { cellWidth: 30 } }
      });

      doc.save(`EcoPoint_Laporan_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Gagal mencetak:", error);
      alert("Gagal mencetak PDF.");
    }
  };

  return (
    <PageTransition>
      {/* Container: Background Dark Mode */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-24 transition-colors duration-300">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Riwayat</h1>
          
          {/* Tombol Print (Dark Mode Ready) */}
          {transactions.length > 0 && (
            <button 
              onClick={handlePrint} 
              className="bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-200 transition-all active:scale-95"
            >
              <Printer size={20} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center mt-10 text-gray-400 dark:text-gray-500 flex flex-col items-center">
            <Loader2 className="animate-spin mb-2" /> Memuat riwayat...
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center mt-20 text-gray-400 dark:text-gray-500">
            <p>Belum ada transaksi.</p>
            <p className="text-xs mt-2">Ayo setor sampah pertamamu!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center hover:shadow-md transition group"
              >
                <div className="flex gap-4 items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.total_points > 0 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  }`}>
                    <ArrowUpRight size={20} className={item.total_points < 0 ? "rotate-180" : ""} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm transition-colors">
                      {item.waste_name} <span className="font-normal text-gray-500 dark:text-gray-400">({item.weight_kg} kg)</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <Clock size={12} /> {formatDateTime(item.date)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-2">
                  <span className={`font-bold ${
                    item.total_points > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {item.total_points > 0 ? '+' : ''}{item.total_points} Poin
                  </span>
                  
                  <button 
                    onClick={() => handleDelete(item.id, item.waste_name)} 
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-md transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}