import { supabase } from '../config/supabaseClient';

// 1. READ (Ambil Semua)
export const getRewards = async () => {
  const { data, error } = await supabase
    .from('rewards_catalog')
    .select('*')
    .order('points_required', { ascending: true }); // Urutkan dari poin termurah
  if (error) throw error;
  return data;
};

// 2. READ (Ambil Satu)
export const getRewardById = async (id) => {
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
  const fileExt = file.name.split('.').pop();
  const fileName = `reward_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('reward-images') // Pastikan nama bucket benar
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('reward-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

// 4. CREATE (Tambah Hadiah)
export const createReward = async (rewardData) => {
  const { data, error } = await supabase
    .from('rewards_catalog')
    .insert([rewardData])
    .select();
  if (error) throw error;
  return data;
};

// 5. UPDATE (Edit Hadiah)
export const updateReward = async (id, rewardData) => {
  const { data, error } = await supabase
    .from('rewards_catalog')
    .update(rewardData)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

// 6. DELETE (Hapus Hadiah)
export const deleteReward = async (id) => {
  const { error } = await supabase
    .from('rewards_catalog')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// 7. REDEEM (Fungsi Tukar Poin - Jangan dihapus!)
export const redeemReward = async (rewardItem) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
        waste_name: "Tukar: " + rewardItem.name,
        weight_kg: 0,
        total_points: -rewardItem.points_required, // Kurangi poin
        status: 'Proses'
    }])
    .select();

  if (error) throw error;
  return data;
};