import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Providers & Context
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';

// Pages - Auth
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Pages - App
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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Pisahkan komponen konten agar bisa menggunakan useAuth/useLocation di dalamnya jika perlu
function AppContent() {
  const location = useLocation();

  // Daftar path di mana Navbar/Sidebar harus DISEMBUYIKAN (Auth pages + detail pages tertentu)
  const hideNav = ['/login', '/register'];
  
  // Sembunyikan jika di halaman Auth
  const isAuthPage = hideNav.includes(location.pathname);

  // Logic BottomNav (sama seperti sebelumnya + auth pages)
  const hideBottomNavPaths = [
    '/catalog/new', '/catalog/edit', 
    '/rewards/new', '/rewards/edit', 
    '/profile/edit', '/achievements', '/about-app',
    '/login', '/register'
  ];
  const isDetailPage = location.pathname.includes('/catalog/') && location.pathname.split('/').length > 2;
  const shouldShowBottomNav = !hideBottomNavPaths.some(path => location.pathname.startsWith(path)) && !isDetailPage;

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col md:flex-row transition-colors duration-300 font-sans">
      
      <Toaster position="top-center" reverseOrder={false} />

      {/* Sidebar Desktop (Hanya jika bukan halaman auth) */}
      {!isAuthPage && <Sidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen relative w-full overflow-x-hidden ${!isAuthPage ? 'md:ml-64' : ''}`}>
        <div className={`w-full ${!isAuthPage ? 'max-w-5xl mx-auto md:px-8' : ''}`}> 
          
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              
              {/* --- PUBLIC ROUTES --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* --- PROTECTED ROUTES --- */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/catalog" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><Riwayat /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              <Route path="/catalog/new" element={<ProtectedRoute><CatalogForm /></ProtectedRoute>} />
              <Route path="/catalog/edit/:id" element={<ProtectedRoute><CatalogForm /></ProtectedRoute>} />
              <Route path="/catalog/:id" element={<ProtectedRoute><CatalogDetail /></ProtectedRoute>} />

              <Route path="/rewards/new" element={<ProtectedRoute><RewardForm /></ProtectedRoute>} />
              <Route path="/rewards/edit/:id" element={<ProtectedRoute><RewardForm /></ProtectedRoute>} />
              <Route path="/rewards/:id" element={<ProtectedRoute><RewardDetail /></ProtectedRoute>} />

              <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
              <Route path="/about-app" element={<ProtectedRoute><AboutApp /></ProtectedRoute>} />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />

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