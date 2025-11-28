import { supabase } from '../config/supabaseClient';

// 1. Simpan Transaksi (Create) - Setor Sampah
export const createTransaction = async (wasteItem, weight, userId) => {
  if (!userId) throw new Error("User ID diperlukan untuk mencatat transaksi");
  if (weight <= 0) throw new Error("Berat sampah harus lebih dari 0");

  const totalPoints = Math.floor(wasteItem.point_per_kg * weight);
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
        user_id: userId, // PENTING: Kaitkan dengan user
        waste_id: wasteItem.id,
        waste_name: wasteItem.name,
        weight_kg: parseFloat(weight),
        total_points: totalPoints,
        status: 'Selesai',
        date: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 2. Ambil Riwayat (Read) - Hanya milik user yang login (di-handle RLS di backend, tapi kita bisa filter juga di sini)
export const getHistory = async () => {
  // Ambil user saat ini untuk keamanan layer aplikasi
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id) // Pastikan hanya data user sendiri
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// 3. Hapus Riwayat (Delete)
export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id); 

  if (error) throw error;
};

// 4. Hitung Ringkasan (Total Poin & Berat) untuk Home/Profile
export const getTransactionSummary = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { totalPoints: 0, totalWeight: 0, totalTransactions: 0 };

  const { data, error } = await supabase
    .from('transactions')
    .select('total_points, weight_kg')
    .eq('user_id', user.id); // Filter by user

  if (error) throw error;

  // Hitung total menggunakan reduce dengan handling nilai null/undefined
  const totalPoints = data.reduce((acc, curr) => acc + (curr.total_points || 0), 0);
  const totalWeight = data.reduce((acc, curr) => acc + (curr.weight_kg || 0), 0);
  const totalTransactions = data.length;

  return { totalPoints, totalWeight, totalTransactions };
};