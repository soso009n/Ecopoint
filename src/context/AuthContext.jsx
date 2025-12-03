import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { getProfile } from '../services/profileService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState('admin'); 
  const [loading, setLoading] = useState(true);
  
  // GLOBAL STATE PROFILE
  const [userProfile, setUserProfile] = useState(null);

  const refreshUserProfile = async () => {
    if (!user) return;
    try {
      const data = await getProfile(user.id);
      setUserProfile(data);
    } catch (error) {
      console.error("Gagal refresh profile:", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // 1. Ambil session dulu (Cepat)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          if (mounted) {
            setSession(session);
            setUser(session.user);
          }

          // 2. Ambil profile secara paralel (jangan memblokir state user/session)
          // Kita fetch profile, tapi loading diset false segera setelah session ada
          // agar UX terasa lebih cepat (Optimistic UI)
          getProfile(session.user.id)
            .then(data => {
              if (mounted) setUserProfile(data);
            })
            .catch(() => {
              // Silent fail jika profile belum ada (user baru)
              if (mounted) setUserProfile(null);
            });
        }
      } catch (error) {
        console.error("Auth Init Error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setRole('admin'); 
        
        if (session?.user) {
           // Fetch ulang profile saat auth state berubah
           getProfile(session.user.id)
             .then(data => setUserProfile(data))
             .catch(() => setUserProfile(null));
        } else {
           setUserProfile(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role: 'admin' } },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        toast.error(error.message);
    } else {
        setRole(null);
        setUser(null);
        setUserProfile(null);
        setSession(null);
    }
  };
  
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
  };

  const isAdmin = true; 

  return (
    <AuthContext.Provider value={{ 
        user, session, role, isAdmin, loading, 
        userProfile, refreshUserProfile, 
        login, register, logout, updatePassword 
    }}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="flex flex-col items-center gap-3">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
             <span className="text-xs text-gray-500 animate-pulse">Memuat EcoPoint...</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};