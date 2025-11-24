import { supabase } from '../config/supabaseClient';

// 1. Simpan Transaksi (Create)
export const createTransaction = async (wasteItem, weight) => {
  const totalPoints = Math.floor(wasteItem.point_per_kg * weight);
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
        waste_id: wasteItem.id,
        waste_name: wasteItem.name,
        weight_kg: weight,
        total_points: totalPoints,
        status: 'Selesai'
    }])
    .select();

  if (error) throw error;
  return data;
};

// 2. Ambil Riwayat (Read)
export const getHistory = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

// 3. Hapus Riwayat (Delete)
export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id); 

  if (error) throw error;
};

// 4. [BARU] Hitung Ringkasan (Total Poin & Berat) untuk Home/Profile
export const getTransactionSummary = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('total_points, weight_kg');

  if (error) throw error;

  // Hitung total menggunakan reduce
  const totalPoints = data.reduce((acc, curr) => acc + curr.total_points, 0);
  const totalWeight = data.reduce((acc, curr) => acc + curr.weight_kg, 0);
  const totalTransactions = data.length;

  return { totalPoints, totalWeight, totalTransactions };
};