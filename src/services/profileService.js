import { supabase } from '../config/supabaseClient';

// Ambil data profil (Updated: Bisa terima parameter ID specific)
export const getProfile = async (id = null) => {
  let query = supabase.from('profiles').select('*');

  // Jika ID diberikan, ambil spesifik ID tersebut
  // Jika tidak, Supabase akan mengandalkan RLS (Row Level Security) atau mengambil baris pertama
  if (id) {
    query = query.eq('id', id);
  }

  const { data, error } = await query.limit(1).single();
  
  if (error) {
    console.warn("Profile fetch error:", error.message);
    return null; // Return null agar UI bisa handle graceful degradation
  }
  
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
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  // 3. Dapatkan URL Publik agar bisa ditampilkan
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return data.publicUrl;
};