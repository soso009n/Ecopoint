import { supabase } from '../config/supabaseClient';

/**
 * 1. Simpan Transaksi (Create) - Setor Sampah
 * Menggunakan pendekatan yang lebih robust tanpa .single() untuk menghindari error
 * jika Supabase mengembalikan array.
 */
export const createTransaction = async (wasteItem, weight, userId) => {
  // Validasi Data
  if (!userId) throw new Error("User ID diperlukan untuk mencatat transaksi");
  if (weight <= 0) throw new Error("Berat sampah harus lebih dari 0");

  // Kalkulasi Poin
  const totalPoints = Math.floor(wasteItem.point_per_kg * weight);
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
        user_id: userId, // Relasi ke user
        waste_id: wasteItem.id,
        waste_name: wasteItem.name,
        weight_kg: parseFloat(weight),
        total_points: totalPoints,
        status: 'Selesai',
        date: new Date().toISOString()
    }])
    .select(); // HAPUS .single() di sini agar lebih aman terhadap respon array

  if (error) throw error;
  
  // Kembalikan item pertama dari array data (jika ada)
  return data?.[0]; 
};

/**
 * 2. Ambil Riwayat (Read)
 * Mengambil data transaksi spesifik milik user yang sedang login.
 */
export const getHistory = async () => {
  // Ambil user saat ini untuk keamanan layer aplikasi
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id) // Filter data user sendiri
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * 3. Hapus Riwayat (Delete)
 * Menghapus transaksi berdasarkan ID.
 * Catatan: Pastikan RLS di Supabase dikonfigurasi agar user hanya bisa hapus miliknya sendiri.
 */
export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id); 

  if (error) throw error;
};

/**
 * 4. Hitung Ringkasan (Total Poin & Berat)
 * Digunakan untuk menampilkan statistik di Home/Profile.
 */
export const getTransactionSummary = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { totalPoints: 0, totalWeight: 0, totalTransactions: 0 };

  const { data, error } = await supabase
    .from('transactions')
    .select('total_points, weight_kg')
    .eq('user_id', user.id);

  if (error) throw error;

  // Akurasi Data: Menggunakan reduce dengan fallback nilai 0
  const totalPoints = data.reduce((acc, curr) => acc + (curr.total_points || 0), 0);
  const totalWeight = data.reduce((acc, curr) => acc + (curr.weight_kg || 0), 0);
  const totalTransactions = data.length;

  return { totalPoints, totalWeight, totalTransactions };
};