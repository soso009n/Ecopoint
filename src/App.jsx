// src/App.jsx
// (Referensi file asli)

import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';

// Pages (Import tetap sama...)
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

  const hideNavbarPaths = [
    '/catalog/new', '/catalog/edit', 
    '/rewards/new', '/rewards/edit', 
    '/profile/edit', '/achievements', '/about-app'
  ];

  // Sembunyikan BottomNav jika path detail (agar tidak menumpuk dengan tombol aksi)
  // Tambahan logic: Sembunyikan juga jika path mengandung '/catalog/' dan ada ID (detail page)
  const isDetailPage = location.pathname.includes('/catalog/') && location.pathname.split('/').length > 2;
  
  const shouldShowBottomNav = !hideNavbarPaths.some(path => location.pathname.startsWith(path)) && !isDetailPage;

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col md:flex-row transition-colors duration-300 font-sans">
      
      <Toaster position="top-center" reverseOrder={false} />

      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      {/* Perbaikan: Tambahkan 'max-w-screen-2xl' agar tidak terlalu lebar di layar besar */}
      <main className="flex-1 md:ml-64 min-h-screen relative w-full overflow-x-hidden">
        <div className="w-full max-w-5xl mx-auto md:px-8"> 
          
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
               {/* Route definitions tetap sama */}
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

          {/* Spacer Mobile */}
          {shouldShowBottomNav && <div className="h-24 md:hidden" />}
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      {shouldShowBottomNav && <BottomNav />}

    </div>
  );
}

export default App;