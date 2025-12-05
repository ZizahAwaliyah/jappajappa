"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Star, MapPin, Calendar } from "lucide-react";

// --- DATA DUMMY RIWAYAT ---
const historyItems = [
  {
    id: 1,
    title: "Coto Nusantara",
    location: "Makassar",
    date: "12 Okt 2025",
    userRating: 5,
    userReview: "Kuahnya kental dan dagingnya empuk banget! Wajib coba ketupatnya juga.",
    image: "https://images.unsplash.com/photo-1540575467063-178a5093df60?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Pantai Losari",
    location: "Makassar",
    date: "10 Okt 2025",
    userRating: 4,
    userReview: "Pemandangan sunset yang ikonik. Sayangnya agak ramai saat akhir pekan.",
    image: "https://images.unsplash.com/photo-1510484732158-9418a0a97b23?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Malino Highlands",
    location: "Gowa",
    date: "01 Sep 2025",
    userRating: 5,
    userReview: "Suasana sejuk, teh hijaunya segar. Tempat healing terbaik dekat Makassar.",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function HistoryPage() {
  // Fungsi Helper untuk render bintang kuning
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < rating ? "text-orange-400 fill-orange-400" : "text-gray-300"}`} 
      />
    ));
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      
      {/* === HEADER === */}
      <header className="bg-white shadow-sm sticky top-0 z-50 px-4 py-4 flex items-center">
        <Link href="/profile" className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900 ml-2">Riwayat Rating</h1>
      </header>

      {/* === LIST KONTEN === */}
      <div className="max-w-screen-md mx-auto px-4 py-6">
        
        {/* State Kosong (Jika tidak ada data) */}
        {historyItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center">
            <Star className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
            <p className="text-sm">Belum ada riwayat rating.</p>
            <p className="text-xs mt-1">Ayo kunjungi tempat wisata dan berikan ulasanmu!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historyItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                
                {/* Bagian Atas: Gambar & Info Dasar */}
                <div className="flex gap-4 mb-4">
                  {/* Gambar Thumbnail */}
                  <div className="relative w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Judul & Tanggal */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location}
                    </div>

                    <div className="flex items-center text-xs text-gray-400 mt-2 bg-gray-50 px-2 py-1 rounded-md w-fit">
                      <Calendar className="w-3 h-3 mr-1.5" />
                      {item.date}
                    </div>
                  </div>
                </div>

                {/* Garis Pemisah Tipis */}
                <hr className="border-gray-100 mb-3" />

                {/* Bagian Bawah: Rating & Review */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-700">Rating Kamu:</span>
                    <div className="flex gap-0.5">
                      {renderStars(item.userRating)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 italic leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    "{item.userReview}"
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}