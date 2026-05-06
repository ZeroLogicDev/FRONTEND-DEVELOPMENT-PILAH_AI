import { useState, useRef, useCallback } from 'react';
import { Camera, Image as ImageIcon, RotateCcw, Check, Loader2, Leaf, Award, ScanLine } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import useAppStore from '../store/useAppStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Sesuaikan jika deploy di production

export default function ScanPage() {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const addScan = useAppStore(state => state.addScan);

  const startCamera = async () => {
    try {
      if (stream) return; // Sudah aktif
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      toast.error('Gagal mengakses kamera', {
        description: 'Pastikan browser memiliki izin mengakses kamera perangkat Anda.'
      });
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Clean up ketika unmount
  useState(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    try {
      // Konversi base64 ke blob untuk dikirim sebagai file
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append('image', blob, 'scan.jpg');

      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      if (data.status === 'success') {
        setResult(data.prediction);
        
        // Simpan ke state global (Zustand)
        addScan({
          label: data.prediction.label,
          category: data.prediction.category,
          confidence: data.prediction.confidence,
          points: data.prediction.points,
          fact: data.prediction.fact,
        });
        
        toast.success(`Berhasil memindai: ${data.prediction.category}`);
      } else {
        toast.error('Gagal menganalisis gambar');
      }
    } catch (error) {
      console.error(error);
      toast.error('Koneksi ke server gagal', {
        description: 'Pastikan server backend berjalan di port 5000'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setResult(null);
    startCamera();
  };

  return (
    <div className="p-4 flex flex-col min-h-screen pb-24">
      <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-6">Pemindai Sampah</h1>

      {!result && (
        <Card className="overflow-hidden mb-6 flex-1 flex flex-col border-none shadow-md bg-slate-50">
          {!capturedImage ? (
            <div className="relative flex-1 bg-black min-h-[350px] rounded-t-xl overflow-hidden flex flex-col items-center justify-center">
              {stream ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 flex flex-col items-center">
                  <Camera size={48} className="text-slate-500 mb-4" />
                  <p className="text-slate-400 text-sm mb-4">Kamera belum aktif</p>
                  <Button onClick={startCamera} variant="secondary">
                    Aktifkan Kamera
                  </Button>
                </div>
              )}
              
              {/* Camera Overlay Grid */}
              {stream && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full border-[1.5px] border-white/20 border-dashed grid grid-cols-3 grid-rows-3">
                    <div className="border-r-[1.5px] border-b-[1.5px] border-white/20 border-dashed"></div>
                    <div className="border-r-[1.5px] border-b-[1.5px] border-white/20 border-dashed"></div>
                    <div className="border-b-[1.5px] border-white/20 border-dashed"></div>
                    <div className="border-r-[1.5px] border-b-[1.5px] border-white/20 border-dashed"></div>
                    <div className="border-r-[1.5px] border-b-[1.5px] border-white/20 border-dashed flex items-center justify-center">
                      <div className="w-16 h-16 border-2 border-primary rounded-lg"></div>
                    </div>
                    <div className="border-b-[1.5px] border-white/20 border-dashed"></div>
                    <div className="border-r-[1.5px] border-white/20 border-dashed"></div>
                    <div className="border-r-[1.5px] border-white/20 border-dashed"></div>
                    <div></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative flex-1 bg-black min-h-[350px] rounded-t-xl overflow-hidden flex items-center justify-center">
              <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
            </div>
          )}

          <CardContent className="p-4 bg-white">
            {!capturedImage ? (
              <div className="flex justify-around items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-12 h-12 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon size={20} className="text-slate-600" />
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <Button 
                  size="icon" 
                  className="w-16 h-16 rounded-full shadow-lg border-4 border-white ring-2 ring-primary bg-primary hover:bg-primary/90"
                  onClick={capturePhoto}
                  disabled={!stream}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-white"></div>
                </Button>
                
                <div className="w-12 h-12"></div> {/* Spacer to balance */}
              </div>
            ) : (
              <div className="flex justify-between items-center gap-4">
                <Button variant="outline" className="flex-1" onClick={resetScan}>
                  <RotateCcw className="mr-2" size={16} /> Ulangi
                </Button>
                <Button className="flex-1" onClick={analyzeImage} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <><Loader2 className="mr-2 animate-spin" size={16} /> Analisis...</>
                  ) : (
                    <><Check className="mr-2" size={16} /> Gunakan</>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* HASIL ANALISIS */}
      {result && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <Card className="border-none shadow-lg overflow-hidden border-t-4" style={{ borderTopColor: result.color }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Terdeteksi</p>
                  <h2 className="text-2xl font-bold text-slate-900 capitalize">{result.label}</h2>
                  <p className="text-sm font-medium mt-1" style={{ color: result.color }}>{result.category}</p>
                </div>
                <div className="bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700">
                  {result.confidence}% Akurat
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Instruksi Pembuangan</h3>
                  <p className="text-slate-800 font-medium">{result.disposal}</p>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{result.tips}</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <h3 className="text-xs font-bold text-primary uppercase mb-2 flex items-center">
                    <Leaf size={14} className="mr-1" /> Fakta Edukatif
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{result.fact}</p>
                </div>
                
                <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <div className="flex items-center text-yellow-700 font-medium">
                    <Award className="mr-2" /> Poin Didapat
                  </div>
                  <div className="text-xl font-bold text-yellow-600">+{result.points}</div>
                </div>
              </div>

              <Button className="w-full mt-6" onClick={resetScan}>
                <ScanLine className="mr-2" size={16} /> Scan Gambar Lain
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
