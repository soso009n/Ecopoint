import { supabase } from '../config/supabaseClient';

// 1. READ (Ambil Semua)
export const getCatalog = async () => {
  const { data, error } = await supabase
    .from('waste_catalog')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error("Error fetching waste catalog:", error);
    throw error;
  }
  return data || [];
};

// 2. READ (Ambil Satu by ID)
export const getCatalogById = async (id) => {
  if (!id) throw new Error("ID Sampah diperlukan");

  const { data, error } = await supabase
    .from('waste_catalog')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// 3. UPLOAD IMAGE
export const uploadWasteImage = async (file) => {
  if (!file) throw new Error("File gambar diperlukan");

  const fileExt = file.name.split('.').pop();
  const fileName = `waste_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('waste-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('waste-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

// 4. CREATE (Tambah Baru)
export const createWaste = async (wasteData) => {
  // Validasi sederhana
  if (!wasteData.name || !wasteData.price_per_kg || !wasteData.point_per_kg) {
    throw new Error("Nama, Harga, dan Poin sampah wajib diisi");
  }

  const { data, error } = await supabase
    .from('waste_catalog')
    .insert([wasteData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// 5. UPDATE (Edit Data)
export const updateWaste = async (id, wasteData) => {
  if (!id) throw new Error("ID Sampah diperlukan untuk update");

  const { data, error } = await supabase
    .from('waste_catalog')
    .update(wasteData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// 6. DELETE (Hapus Data)
export const deleteWaste = async (id) => {
  if (!id) throw new Error("ID Sampah diperlukan untuk hapus");

  const { error } = await supabase
    .from('waste_catalog')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};