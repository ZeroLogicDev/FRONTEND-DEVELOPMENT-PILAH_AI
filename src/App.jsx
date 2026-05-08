import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import BerandaPage from './pages/BerandaPage';
import ScanPage from './pages/ScanPage';
import AktifitasPage from './pages/AktifitasPage';
import DompetPage from './pages/DompetPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from './components/ui/sonner';
import useAppStore from './store/useAppStore';
import { supabase } from './lib/supabase';

function ProtectedRoute({ children }) {
  const session = useAppStore(state => state.session);
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function App() {
  const setUser = useAppStore(state => state.setUser);

  useEffect(() => {
    // Periksa sesi saat pertama dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user, session);
    });

    // Dengarkan perubahan status login (sangat penting untuk OAuth Google)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user, session);
      } else {
        setUser(null, null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/beranda" element={<BerandaPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/aktifitas" element={
            <ProtectedRoute>
              <AktifitasPage />
            </ProtectedRoute>
          } />
          <Route path="/dompet" element={
            <ProtectedRoute>
              <DompetPage />
            </ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
