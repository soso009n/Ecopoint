import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Komponen Navigasi
import BottomNav from './components/BottomNav';

// Halaman Utama
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Riwayat from './pages/Riwayat';
import Profile from './pages/Profile';

// Halaman Detail & Form
import CatalogDetail from './pages/CatalogDetail';
import CatalogForm from './pages/CatalogForm';
import Rewards from './pages/Rewards';
import RewardDetail from './pages/RewardDetail';
import RewardForm from './pages/RewardForm';
import EditProfile from './pages/EditProfile';

// Halaman Tambahan
import Achievements from './pages/Achievements';
import AboutApp from './pages/AboutApp';

function App() {
  const location = useLocation();

  // Daftar path di mana BottomNav HARUS disembunyikan
  const hideNavbarPaths = [
    '/catalog/new',
    '/catalog/edit', // Mencakup /catalog/edit/:id
    '/catalog/',     // Mencakup /catalog/:id (Detail)
    '/rewards/new',
    '/rewards/edit',
    '/rewards/',     // Mencakup /rewards/:id (Detail)
    '/profile/edit',
    '/achievements',
    '/about-app'
  ];

  // Cek apakah path saat ini ada di daftar hideNavbarPaths
  // Kita pakai logic: Tampilkan Navbar KECUALI path saat ini cocok dengan salah satu rules di atas
  // Pengecualian: '/catalog' dan '/rewards' (halaman list utama) harus TETAP MENAMPILKAN navbar.
  const shouldShowNavbar = !hideNavbarPaths.some(path => {
    // Logika khusus: Jangan sembunyikan jika path-nya persis '/catalog' atau '/rewards'
    if (location.pathname === '/catalog' || location.pathname === '/rewards') return false;
    
    // Sembunyikan jika path dimulai dengan daftar di atas (misal /catalog/123)
    return location.pathname.startsWith(path);
  });

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
      
      {/* Notifikasi Toast Global */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Area Konten Halaman dengan Animasi */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* === HALAMAN UTAMA === */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/history" element={<Riwayat />} />
          <Route path="/profile" element={<Profile />} />

          {/* === KATALOG: Form & Detail === */}
          <Route path="/catalog/new" element={<CatalogForm />} />
          <Route path="/catalog/edit/:id" element={<CatalogForm />} />
          <Route path="/catalog/:id" element={<CatalogDetail />} />

          {/* === REWARDS: Form & Detail === */}
          <Route path="/rewards/new" element={<RewardForm />} />
          <Route path="/rewards/edit/:id" element={<RewardForm />} />
          <Route path="/rewards/:id" element={<RewardDetail />} />

          {/* === PROFIL: Edit & Sub-menu === */}
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about-app" element={<AboutApp />} />

        </Routes>
      </AnimatePresence>

      {/* Navigasi Bawah (Hanya muncul di halaman tertentu) */}
      {shouldShowNavbar && <BottomNav />}

    </div>
  );
}

export default App;