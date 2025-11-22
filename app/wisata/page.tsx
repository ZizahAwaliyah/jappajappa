"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MapPin, ChevronDown, Bell, User, Star } from "lucide-react";
import BottomNavBar from "../components/BottomNavBar";

// --- DATA DUMMY WISATA ---
const wisataData = [
  {
    id: 1,
    title: "Pantai Tanjung Bira",
    location: "Bulukumba, Sulsel",
    isOpen: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Taman Nasional Bantimurung",
    location: "Maros, Sulsel",
    isOpen: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Benteng Rotterdam",
    location: "Makassar, Sulsel",
    isOpen: false, // Contoh status Tutup
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Malino Highlands",
    location: "Gowa, Sulsel",
    isOpen: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Pulau Samalona",
    location: "Makassar, Sulsel",
    isOpen: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function WisataPage() {
  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        
        {/* === DESKTOP NAVBAR (Hidden on Mobile) === */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
          <div className="text-2xl font-bold text-blue-600">Jappa.</div>
          <div className="flex space-x-8 font-medium text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/event" className="hover:text-blue-600">Event</a>
            <a href="/wisata" className="text-blue-600">Wisata</a>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-600" />
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </nav>

        {/* === HERO HEADER === */}
        <div className="relative h-64 md:h-80 w-full">
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop"
            alt="Wisata Background"
            fill
            className="object-cover brightness-75"
            priority
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-screen-xl mx-auto w-full">
            
            {/* Judul */}
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-6">
              Destinasi Wisata
            </h1>

            {/* === SEARCH & FILTER BAR (Sesuai Wireframe) === */}
            {/* Layout: 
                Mobile: Flex row (kecil) atau stack? Di wireframe terlihat row.
                Desktop: Flex row lebih lebar.
            */}
            <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
              
              {/* Input: Pilih Kota */}
              <div className="relative flex-1 h-12">
                <input
                  type="text"
                  placeholder="Pilih Kota"
                  className="w-full h-full pl-4 pr-8 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Input: Pilih Kategori */}
              <div className="relative flex-1 h-12">
                <input
                  type="text"
                  placeholder="Pilih Kategori"
                  className="w-full h-full pl-4 pr-8 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Tombol Search Bulat */}
              <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors text-blue-600 flex-shrink-0">
                <Search className="w-5 h-5" strokeWidth={3} />
              </button>

            </div>
          </div>
        </div>

        {/* === LIST WISATA (Grid System) === */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wisataData.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer border border-gray-100">
                
                {/* Gambar Card */}
                <div className="relative h-48 w-full bg-gray-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Rating Badge (Tambahan untuk mempercantik) */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-500 shadow-sm flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-orange-500" /> {item.rating}
                  </div>
                </div>

                {/* Detail Card */}
                <div className="p-5">
                  
                  {/* Judul */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>

                  {/* Lokasi */}
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                     {/* Placeholder location, bisa diganti icon MapPin jika mau */}
                     {item.location}
                  </p>

                  {/* Footer Card: Lokasi Kiri, Status Kanan */}
                  <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                    
                    {/* Label 'lokasikyu' dari wireframe, saya ganti jadi icon lokasi real */}
                    <div className="flex items-center text-gray-400 text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      Lihat Peta
                    </div>

                    {/* Status Buka/Tutup */}
                    <div className={`text-sm font-bold ${item.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                      {item.isOpen ? 'Buka' : 'Tutup'}
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </main>

      {/* === BOTTOM NAVBAR (Mobile) === */}
      <BottomNavBar />
    </>
  );
}