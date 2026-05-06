import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Leaf, Award, ScanLine, Recycle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function BerandaPage() {
  const scans = useAppStore((state) => state.scans);
  const points = useAppStore((state) => state.points);
  
  const stats = useMemo(() => {
    const totalScans = scans.length;
    const co2Saved = (totalScans * 0.5).toFixed(1);
    const recycledItems = scans.filter(s => s.label !== 'trash').length;
    return {
      totalPoints: points,
      totalScans,
      co2Saved,
      recycledItems
    };
  }, [scans, points]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-6 mt-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Halo, Sobat Eco!</h1>
          <p className="text-slate-500 text-sm">Mari mulai daur ulang hari ini</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Leaf className="text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-500 to-primary text-primary-foreground">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Award size={16} /> Total Poin
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{stats.totalPoints}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-slate-50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <ScanLine size={16} /> Total Scan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-slate-900">{stats.totalScans}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Dampak Lingkungan</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm border-slate-100">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Leaf size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stats.co2Saved} kg</p>
                <p className="text-xs text-slate-500">CO2 Dihemat</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <Recycle size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stats.recycledItems}</p>
                <p className="text-xs text-slate-500">Item Didaur Ulang</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start space-x-4">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Leaf className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Tips Hari Ini</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tahukah kamu? Botol plastik sebaiknya diremukkan terlebih dahulu sebelum dibuang agar menghemat ruang di tempat sampah.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
