import { supabase } from '../config/supabaseClient';

// ---------------------------------------------------------
// 1. READ (Ambil Data Hadiah)
// ---------------------------------------------------------

// Ambil Semua Hadiah untuk Katalog
export const getRewards = async () => {
  const { data, error } = await supabase
    .from('rewards_catalog')
    .select('*')
    .order('points_required', { ascending: true });
  
  if (error) {
    console.error("Error fetching rewards:", error);
    throw error;
  }
  return data || [];
};

// Ambil Satu Hadiah berdasarkan ID
export const getRewardById = async (id) => {
  if (!id) throw new Error("ID Hadiah diperlukan");

  const { data, error } = await supabase
    .from('rewards_catalog')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// ---------------------------------------------------------
// 2. WRITE (Kelola Hadiah - Admin)
// ---------------------------------------------------------

// Upload Gambar Hadiah ke Storage
export const uploadRewardImage = async (file) => {
  if (!file) throw new Error("File gambar diperlukan");

  const fileExt = file.name.split('.').pop();
  const fileName = `reward_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('reward-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('reward-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

// CREATE (Tambah Hadiah Baru)
export const createReward = async (rewardData) => {
  // Validasi data dasar
  if (!rewardData.name || !rewardData.points_required) {
    throw new Error("Nama dan Poin Hadiah wajib diisi");
  }

  const { data, error } = await supabase
    .from('rewards_catalog')
    .insert([rewardData])
    .select(); // Menggunakan .select() tanpa .single() agar konsisten aman
  
  if (error) throw error;
  return data?.[0];
};

// UPDATE (Edit Hadiah)
export const updateReward = async (id, rewardData) => {
  if (!id) throw new Error("ID Hadiah diperlukan untuk update");

  const { data, error } = await supabase
    .from('rewards_catalog')
    .update(rewardData)
    .eq('id', id)
    .select(); // Menggunakan .select() tanpa .single()
  
  if (error) throw error;
  return data?.[0];
};

// DELETE (Hapus Hadiah)
export const deleteReward = async (id) => {
  if (!id) throw new Error("ID Hadiah diperlukan untuk hapus");

  const { error } = await supabase
    .from('rewards_catalog')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ---------------------------------------------------------
// 3. TRANSACTION (Penukaran Poin)
// ---------------------------------------------------------

// REDEEM (Tukar Poin)
// Mencatat transaksi pengurangan poin di tabel 'transactions'
export const redeemReward = async (rewardItem, userId) => {
  if (!userId) throw new Error("User ID tidak ditemukan. Silakan login ulang.");
  if (!rewardItem || !rewardItem.points_required) throw new Error("Data hadiah tidak valid.");

  // Pastikan poin bernilai negatif untuk pengurangan
  const pointsDeduction = -Math.abs(Number(rewardItem.points_required));

  const { data, error } = await supabase
    .from('transactions')
    .insert([{
        user_id: userId,
        waste_name: `Penukaran: ${rewardItem.name}`, // Format nama jelas
        waste_id: null, // Null karena ini bukan setor sampah
        weight_kg: 0,   // Berat 0
        total_points: pointsDeduction, // Poin negatif
        status: 'Selesai', // Status transaksi (bisa diubah ke 'Proses' jika butuh approval admin)
        image_url: rewardItem.image_url, // Menyimpan gambar hadiah di history transaksi
        date: new Date().toISOString()
    }])
    .select(); // HAPUS .single() DI SINI AGAR LEBIH AMAN (Sesuai request)

  if (error) {
    console.error("Redeem Error:", error);
    throw new Error("Gagal memproses penukaran. Coba lagi nanti.");
  }
  
  // Kembalikan item pertama dari array data
  return data?.[0];
};