import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsPlusSquareFill, BsShieldLockFill, BsInfoCircleFill } from "react-icons/bs";

export default function AuthLayout() {
  const images = [
    "/fk1.png",
    "/fk3.png",
    "/fk4.png",
    "/fk5.png"
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // Fungsi untuk menjalankan slider otomatis setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans bg-white">
      
      {/* Main Card Container */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-[1250px] overflow-hidden min-h-[720px] animate-fadeIn border border-gray-100">
        
        {/* SISI KIRI: Sidebar dengan Slider */}
        <div className="md:w-[35%] p-10 text-white flex flex-col justify-between relative overflow-hidden group">
          
          {/* Layer Gambar Slider dengan Efek Fade */}
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
              style={{ 
                backgroundImage: `url(${img})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}

          {/* OVERLAY BIRU: Mengatur Opacity Warna Biru di atas Gambar */}
          {/* Ubah /85 menjadi /70 jika ingin gambar lebih terlihat terang */}
          <div className="absolute inset-0 bg-[#172554]/65 backdrop-blur-[1px] transition-colors duration-500"></div>

          {/* Konten Atas */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <BsPlusSquareFill className="text-4xl text-blue-300/90 drop-shadow-lg" />
              <h1 className="text-2xl font-black tracking-tight text-white">Logbook Sistem</h1>
            </div>

            <section className="animate-slideLeft">
              <h2 className="text-xl font-black mb-3 border-l-4 border-blue-400 pl-3 uppercase tracking-wider italic text-blue-100">
                Selamat Datang
              </h2>
              <div className="bg-white/10 border border-white/10 p-6 rounded-2xl shadow-inner backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-blue-50 font-light">
                  Sistem informasi logbook digital untuk <b>Program Studi Anestesiologi dan Terapi Intensif</b>.
                </p>
              </div>
            </section>
          </div>

          {/* Konten Bawah */}
          <div className="relative z-10 space-y-4">
            {/* Indikator Slider (Dots) */}
            <div className="flex gap-1.5 mb-4 ml-1">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === currentImage ? "w-6 bg-blue-400" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Keamanan Terjamin */}
            <div className="flex items-start gap-4 bg-white/10 border border-white/10 p-5 rounded-2xl animate-slideLeft shadow-inner backdrop-blur-sm">
              <BsShieldLockFill className="text-3xl shrink-0 text-blue-300" />
              <div>
                <h3 className="font-bold text-sm text-white uppercase tracking-tight">Keamanan Terjamin</h3>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest mt-1">Encrypted Data Management</p>
              </div>
            </div>

            {/* Info Sistem */}
            <div className="bg-blue-950/60 backdrop-blur-md p-5 rounded-xl flex items-start gap-3 border border-white/10 shadow-lg">
              <BsInfoCircleFill className="text-xl shrink-0 text-blue-300" />
              <div className="text-[11px]">
                <p className="font-bold mb-1 text-white uppercase tracking-wide">Bantuan Akses</p>
                <p className="text-blue-100/80 leading-tight">Hubungi Admin FK UNRI jika anda mengalami kendala login.</p>
              </div>
            </div>
          </div>

        </div>

        {/* SISI KANAN: Form */}
        <div className="md:w-[65%] bg-white p-8 md:p-16 lg:p-24 flex flex-col justify-center items-center">
          <div className="w-full max-w-xl">
             <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-8 text-gray-400 text-xs font-medium text-center italic uppercase tracking-widest">
        © 2026 Fakultas Kedokteran - Universitas Riau
      </footer>
    </div>
  );
}