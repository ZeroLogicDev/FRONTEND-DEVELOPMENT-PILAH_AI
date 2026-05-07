import { Leaf, ArrowRight, ShieldCheck, Recycle, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden flex flex-col">
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          {/* Gambar background (Ganti src dengan gambar dari user nanti) */}
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop" 
            alt="Eco Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Gradient & Blur Overlay di sisi kiri (Diperhalus dengan mask-image) */}
        <div 
          className="absolute inset-y-0 left-0 z-10 w-full lg:w-3/4 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/0 backdrop-blur-md pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 100%)'
          }}
        ></div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-green-400 border border-primary/30 mb-6 backdrop-blur-md">
              <Leaf size={16} />
              <span className="text-sm font-medium tracking-wide">Asisten Daur Ulang Cerdas</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Ubah Sampah Jadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Berkah</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">
              Mulai langkah kecil untuk menyelamatkan bumi. Pindai sampah Anda, ketahui cara daur ulangnya, dan kumpulkan poin hadiah setiap hari!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-transform duration-300">
                <Link to="/beranda">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                <Link to="/auth">
                  Masuk Akun
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Element Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
      </section>

      {/* Section 2: Features (Persiapan untuk konten berikutnya) */}
      <section className="py-24 bg-slate-900 relative z-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mengapa Memilih EcoScan?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Kami menggunakan teknologi AI canggih untuk mempermudah gaya hidup ramah lingkungan Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Cerdas & Akurat</h3>
              <p className="text-slate-400 leading-relaxed">Kamera kami didukung oleh model AI cerdas yang mampu mengenali berbagai jenis sampah hanya dalam hitungan detik.</p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-6">
                <Recycle size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Panduan Daur Ulang</h3>
              <p className="text-slate-400 leading-relaxed">Dapatkan informasi langsung tentang apakah sampah tersebut bisa didaur ulang dan bagaimana cara membuangnya dengan benar.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-yellow-500/20 text-yellow-400 rounded-xl flex items-center justify-center mb-6">
                <Coins size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Kumpulkan Poin</h3>
              <p className="text-slate-400 leading-relaxed">Semakin sering Anda memindai sampah dengan benar, semakin banyak poin (EcoPoints) yang bisa Anda tukarkan dengan hadiah.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
