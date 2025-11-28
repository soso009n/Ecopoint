import { supabase } from '../config/supabaseClient';

// 1. READ (Ambil Semua)
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

// 2. READ (Ambil Satu)
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

// 3. UPLOAD IMAGE
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

// 4. CREATE (Tambah Hadiah)
export const createReward = async (rewardData) => {
  // Validasi data dasar
  if (!rewardData.name || !rewardData.points_required) {
    throw new Error("Nama dan Poin Hadiah wajib diisi");
  }

  const { data, error } = await supabase
    .from('rewards_catalog')
    .insert([rewardData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// 5. UPDATE (Edit Hadiah)
export const updateReward = async (id, rewardData) => {
  if (!id) throw new Error("ID Hadiah diperlukan untuk update");

  const { data, error } = await supabase
    .from('rewards_catalog')
    .update(rewardData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// 6. DELETE (Hapus Hadiah)
export const deleteReward = async (id) => {
  if (!id) throw new Error("ID Hadiah diperlukan untuk hapus");

  const { error } = await supabase
    .from('rewards_catalog')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// 7. REDEEM (Tukar Poin - Transactional Logic)
export const redeemReward = async (rewardItem, userId) => {
  if (!userId) throw new Error("User ID tidak ditemukan");
  
  // Mencatat transaksi penukaran
  // Pastikan user_id disertakan agar policy RLS bekerja dengan benar
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
        user_id: userId, // PENTING: Kaitkan transaksi dengan user
        waste_name: "Tukar: " + rewardItem.name,
        weight_kg: 0,
        total_points: -Math.abs(rewardItem.points_required), // Pastikan negatif untuk mengurangi poin
        status: 'Proses',
        date: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};