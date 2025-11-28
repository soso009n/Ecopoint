import { supabase } from '../config/supabaseClient';

// ---------------------------------------------------------
// 1. READ (Ambil Data)
// ---------------------------------------------------------

// Ambil Semua Katalog Sampah
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

// Ambil Satu Item berdasarkan ID
export const getCatalogById = async (id) => {
  if (!id) throw new Error("ID Sampah diperlukan");

  const { data, error } = await supabase
    .from('waste_catalog')
    .select('*')
    .eq('id', id)
    .single(); // Disini .single() aman karena kita fetch by ID unik
  
  if (error) throw error;
  return data;
};

// ---------------------------------------------------------
// 2. STORAGE (Upload Gambar)
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// 3. WRITE (Create, Update, Delete)
// ---------------------------------------------------------

// CREATE (Tambah Baru) - FIXED
// Menghapus .single() untuk menghindari error jika return berupa array
export const createWaste = async (wasteData) => {
  if (!wasteData.name || !wasteData.price_per_kg || !wasteData.point_per_kg) {
    throw new Error("Nama, Harga, dan Poin sampah wajib diisi");
  }

  const { data, error } = await supabase
    .from('waste_catalog')
    .insert([wasteData])
    .select(); // HAPUS .single() DI SINI

  if (error) throw error;
  
  // Ambil item pertama secara manual dari array
  return data?.[0]; 
};

// UPDATE (Edit Data) - FIXED
// Menghapus .single() dan menambahkan validasi hasil update
export const updateWaste = async (id, wasteData) => {
  if (!id) throw new Error("ID Sampah diperlukan untuk update");

  const { data, error } = await supabase
    .from('waste_catalog')
    .update(wasteData)
    .eq('id', id)
    .select(); // HAPUS .single() DI SINI

  if (error) throw error;
  
  // Validasi tambahan: Cek apakah ada data yang terupdate
  // Ini berguna untuk mendeteksi jika RLS memblokir update meski tidak error SQL
  if (!data || data.length === 0) {
     throw new Error("Gagal update. Data tidak ditemukan atau Anda tidak memiliki izin.");
  }

  // Ambil item pertama secara manual
  return data?.[0]; 
};

// DELETE (Hapus Data)
export const deleteWaste = async (id) => {
  if (!id) throw new Error("ID Sampah diperlukan untuk hapus");

  const { error } = await supabase
    .from('waste_catalog')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};