"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, MapPin, Heart, Calendar } from "lucide-react";

// --- DATA DUMMY WISHLIST ---
const wishlistItems = [
  {
    id: 1,
    type: "wisata",
    title: "Pantai Tanjung Bira",
    subtitle: "Bulukumba, Sulsel",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    price: "Rp 15.000",
  },
  {
    id: 2,
    type: "event",
    title: "Konser Senja",
    subtitle: "25 Nov 2025",
    image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop",
    price: "Rp 75.000",
  },
  {
    id: 3,
    type: "jappa",
    title: "Kopi Teori",
    subtitle: "Jl. Beruang, Makassar",
    image: "https://images.unsplash.com/photo-1563805042-60734c98602a?q=80&w=1000&auto=format&fit=crop",
    price: "Rp 25.000",
  },
];

export default function WishlistPage() {
  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      
      {/* === HEADER === */}
      <header className="bg-white shadow-sm sticky top-0 z-50 px-4 py-4 flex items-center">
        <Link href="/profile" className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900 ml-2">Wishlist</h1>
      </header>

      {/* === LIST KONTEN === */}
      <div className="max-w-screen-md mx-auto px-4 py-6">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Heart className="w-12 h-12 mb-2 stroke-1" />
            <p>Belum ada item di wishlist.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <Link 
                key={item.id} 
                // Arahkan link sesuai tipe item
                href={
                  item.type === 'wisata' ? `/wisata/${item.id}` : 
                  item.type === 'event' ? `/event/${item.id}` : 
                  `/jappa/${item.id}`
                }
                className="flex bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                {/* Gambar */}
                <div className="relative w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="ml-4 flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                      {/* Icon Love Merah (Indikator Wishlist) */}
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      {item.type === 'event' ? (
                        <Calendar className="w-3 h-3 mr-1" />
                      ) : (
                        <MapPin className="w-3 h-3 mr-1" />
                      )}
                      {item.subtitle}
                    </div>
                  </div>

                  <div className="text-sm font-bold text-blue-600 mt-2">
                    {item.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}