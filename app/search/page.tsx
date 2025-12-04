"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
// BottomNavBar tidak diperlukan karena halaman ini menutup penuh layar (overlay)

// --- Data Dummy ---
const mustVisitData = [
  { id: 1, title: "Pantai Tanjung Bira", price: "Rp 15.000", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "Malino Highlands", price: "Rp 50.000", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "Rammang-Rammang", price: "Rp 100.000", image: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, title: "Pulau Samalona", price: "Rp 350.000", image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop" },
];

const popularPicksData = [
  { id: 1, title: "Coto Nusantara", price: "Rp 25.000", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "Pallubasa Serigala", price: "Rp 30.000", image: "https://images.unsplash.com/photo-1540575467063-178a5093df60?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "Pisang Epe Mandar", price: "Rp 15.000", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, title: "Mie Titi Panakkukang", price: "Rp 40.000", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop" },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false); // State untuk animasi
  const router = useRouter();

  // Efek Slide Up saat halaman dimuat
  useEffect(() => {
    // Sedikit delay agar animasi terlihat halus saat mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Fungsi Slide Down saat tombol Batal ditekan
  const handleBack = () => {
    setIsVisible(false); // Memicu animasi turun
    setTimeout(() => {
      router.back(); // Kembali ke halaman sebelumnya setelah animasi selesai
    }, 300); // Sesuaikan dengan durasi transition (300ms)
  };

  return (
    // Container Utama: Fixed Fullscreen dengan Transisi Transform
    <div 
      className={`fixed inset-0 z-50 bg-white overflow-y-auto transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <main className="min-h-screen pb-10">
        
        {/* === HEADER SEARCH BERSIH (Tanpa Latar Biru) === */}
        <div className="bg-white px-4 pt-6 pb-4 sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            
            {/* Input Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari event, tempat wisata..."
                // Menggunakan bg-gray-100 agar kontras dengan header putih
                className="w-full py-2.5 pl-10 pr-4 rounded-full bg-gray-100 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Tombol Batal */}
            <button 
              onClick={handleBack} 
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              Batal
            </button>

          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-6">

          {/* === PENCARIAN SEBELUMNYA === */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Pencarian Sebelumnya</h2>
            <p className="text-xs md:text-sm text-gray-400">
              Kamu tidak memiliki pencarian sebelumnya
            </p>
          </div>

          {/* === MUST VISIT SECTION === */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Must Visit</h2>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 md:space-x-0 md:gap-6">
              {mustVisitData.map((item) => (
                <Link href={`/wisata/${item.id}?from=search`} key={item.id} className="flex-shrink-0 w-40 md:w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative h-32 w-full bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-auto line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-[10px] text-gray-400">Harga</span>
                    <span className="text-xs font-bold text-gray-900">{item.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* === POPULAR PICKS SECTION === */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Picks</h2>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 md:space-x-0 md:gap-6">
              {popularPicksData.map((item) => (
                <Link href={`/jappa/${item.id}?from=search`} key={item.id} className="flex-shrink-0 w-40 md:w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative h-32 w-full bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-auto line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-[10px] text-gray-400">Harga</span>
                    <span className="text-xs font-bold text-gray-900">{item.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}