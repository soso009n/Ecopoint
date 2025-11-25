// App.js
import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Riwayat from './pages/Riwayat';
import Profile from './pages/Profile';
import CatalogDetail from './pages/CatalogDetail';
import CatalogForm from './pages/CatalogForm';
import Rewards from './pages/Rewards';
import RewardDetail from './pages/RewardDetail';
import RewardForm from './pages/RewardForm';
import EditProfile from './pages/EditProfile';
import Achievements from './pages/Achievements';
import AboutApp from './pages/AboutApp';

function App() {
  const location = useLocation();

  // Daftar path di mana Bottom Nav (Mobile) harus DISEMBUYIKAN
  const hideNavbarPaths = [
    '/catalog/new', '/catalog/edit', 
    '/rewards/new', '/rewards/edit', 
    '/profile/edit', '/achievements', '/about-app'
  ];

  // Logic: Tampilkan nav jika path saat ini TIDAK ada di daftar hideNavbarPaths
  // (Kecuali jika path induknya 'catalog' atau 'rewards', kita harus cek lebih detail)
  const shouldShowBottomNav = !hideNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
    // Wrapper Utama: Full Screen, Flex Column (Mobile), Row (Desktop), Support Dark Mode
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col md:flex-row transition-colors duration-300">
      
      <Toaster position="top-center" reverseOrder={false} />

      {/* --- SIDEBAR (Desktop Only) --- */}
      {/* Sidebar komponen sudah menghandle hidden/flex, jadi tinggal panggil */}
      <Sidebar />

      {/* --- AREA KONTEN UTAMA --- */}
      {/* md:ml-64: Memberi margin kiri selebar sidebar (16rem/256px) hanya di desktop */}
      <main className="flex-1 md:ml-64 min-h-screen relative w-full overflow-x-hidden">
        
        {/* Container Global (Opsional: Membatasi lebar konten agar nyaman dibaca di layar ultra-wide) */}
        <div className="w-full max-w-7xl mx-auto"> 
          
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/history" element={<Riwayat />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/catalog/new" element={<CatalogForm />} />
              <Route path="/catalog/edit/:id" element={<CatalogForm />} />
              <Route path="/catalog/:id" element={<CatalogDetail />} />

              <Route path="/rewards/new" element={<RewardForm />} />
              <Route path="/rewards/edit/:id" element={<RewardForm />} />
              <Route path="/rewards/:id" element={<RewardDetail />} />

              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/about-app" element={<AboutApp />} />
            </Routes>
          </AnimatePresence>

          {/* Spacer untuk Mobile agar konten terbawah tidak tertutup BottomNav */}
          {shouldShowBottomNav && <div className="h-24 md:hidden" />}
        </div>
      </main>

      {/* --- BOTTOM NAV (Mobile Only) --- */}
      {shouldShowBottomNav && <BottomNav />}

    </div>
  );
}

export default App;