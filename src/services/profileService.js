import { supabase } from '../config/supabaseClient';

// Ambil data profil
export const getProfile = async () => {
  const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
  if (error) throw error;
  return data;
};

// Update data profil (Text)
export const updateProfile = async (id, newData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(newData)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

// --- FITUR BARU: UPLOAD FOTO ---
export const uploadAvatar = async (file) => {
  // 1. Buat nama file unik (misal: avatar_170658392.png)
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar_${Date.now()}.${fileExt}`;

  // 2. Upload ke Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars') // Nama bucket yang tadi dibuat
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // 3. Dapatkan URL Publik agar bisa ditampilkan
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return data.publicUrl;
};