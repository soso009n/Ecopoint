import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null); // State untuk menyimpan Role (user/admin)
  const [loading, setLoading] = useState(true);

  // Helper untuk ambil role dari tabel profiles
  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data?.role || 'user';
    } catch (error) {
      console.error("Gagal ambil role:", error);
      return 'user'; // Default fallback
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // 1. Cek sesi aktif
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        // Ambil role dari database
        const userRole = await fetchRole(session.user.id);
        setRole(userRole);
      }

      setLoading(false);

      // 2. Listener perubahan auth
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userRole = await fetchRole(session.user.id);
          setRole(userRole);
        } else {
          setRole(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  // --- REGISTER ---
  // Parameter eksplisit: email, password, fullName, role (default 'user')
  const register = async (email, password, fullName, role = 'user') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName,
            role: role // Kirim role ke metadata agar ditangkap Trigger SQL
          }, 
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // --- LOGIN ---
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

  // --- LOGOUT ---
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else {
        setRole(null);
        setUser(null);
    }
  };
  
  // --- UPDATE PASSWORD ---
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
  };

  // Variable helper
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{ user, session, role, isAdmin, loading, login, register, logout, updatePassword }}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};