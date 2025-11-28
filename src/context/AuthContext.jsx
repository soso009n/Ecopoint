import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek sesi saat ini ketika aplikasi dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Dengarkan perubahan sesi secara real-time (Login, Logout, Auto-refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fungsi Register
  const register = async (email, password, fullName) => {
    try {
      // 1. Daftar ke Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }, // Simpan nama di metadata auth
        },
      });

      if (error) throw error;

      // 2. Simpan data tambahan ke tabel 'profiles'
      // Catatan: Pastikan tabel 'profiles' memiliki kolom 'id', 'full_name', 'email'
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, // ID harus sama dengan Auth UID
              full_name: fullName,
              email: email 
            }
          ]);
        
        if (profileError) {
          // Opsional: Rollback/Hapus user auth jika gagal simpan profile (untuk konsistensi)
          console.error("Gagal simpan profil:", profileError);
          toast.error("Gagal menyimpan data profil.");
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Fungsi Login
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Fungsi Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success("Berhasil keluar.");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout }}>
      {!loading ? children : (
        // Loading Screen Sederhana saat inisialisasi
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// Hook Custom untuk mempermudah akses Context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};