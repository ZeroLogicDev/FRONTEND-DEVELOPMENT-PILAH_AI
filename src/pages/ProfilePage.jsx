import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, LogOut, Settings, Award, History } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const logout = useAppStore(state => state.logout);
  const getStats = useAppStore(state => state.getStats);
  
  // Subscribe to state changes so ProfilePage re-renders when they change
  useAppStore(state => state.scans);
  useAppStore(state => state.points);
  useAppStore(state => state.redemptions);
  
  const stats = getStats();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (!user) return null; // Akan ditangani oleh ProtectedRoute

  const fullName = user.user_metadata?.full_name || 'Pengguna EcoScan';
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-[calc(100vh-4rem)] pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-slate-900 mt-4 md:mt-0 mb-6">Profil Saya</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Info Profil */}
        <Card className="col-span-1 md:col-span-1 border-none shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-lg">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-primary" />
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
            <p className="text-slate-500 text-sm mb-6">{user.email}</p>
            
            <div className="w-full space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-3" size={18} /> Pengaturan Akun
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <History className="mr-3" size={18} /> Riwayat Lengkap
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 border-none"
                onClick={handleLogout}
              >
                <LogOut className="mr-3" size={18} /> Keluar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Kartu Statistik */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-primary to-green-600 text-white overflow-hidden relative">
            <div className="absolute right-0 top-0 opacity-10">
              <Award size={160} className="transform translate-x-8 -translate-y-8" />
            </div>
            <CardContent className="p-6 relative z-10">
              <p className="text-primary-foreground/80 font-medium mb-1">Total Poin EcoScan</p>
              <h3 className="text-4xl font-bold mb-4">{stats.totalPoints} <span className="text-lg font-normal">pts</span></h3>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-primary-foreground/70 text-xs uppercase tracking-wider mb-1">Total Scan</p>
                  <p className="text-xl font-bold">{stats.totalScans} <span className="text-sm font-normal">item</span></p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-primary-foreground/70 text-xs uppercase tracking-wider mb-1">Poin Ditukar</p>
                  <p className="text-xl font-bold">{stats.totalRedeemed} <span className="text-sm font-normal">pts</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-800 mb-4">Pencapaian</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-600">
                    🏆
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-slate-800">Pemula Daur Ulang</p>
                      <p className="text-sm text-slate-500">10 / 50 Scan</p>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((stats.totalScans / 50) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
