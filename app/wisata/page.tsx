// app/wisata/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, ChevronDown, Bell, User, Star } from "lucide-react";
import BottomNavBar from "../components/Header";

// --- DATA DUMMY WISATA ---
const wisataData = [
  { 
    id: 1, 
    title: "Pantai Tanjung Bira", 
    location: "Bulukumba, Sulsel", 
    isOpen: true, 
    rating: 4.8, 
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    category: "Wisata Alam"
  },
  { 
    id: 2, 
    title: "Malino Highlands", 
    location: "Gowa, Sulsel", 
    isOpen: true, 
    rating: 4.9, 
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop",
    category: "Wisata Alam"
  },
  { 
    id: 3, 
    title: "Benteng Rotterdam", 
    location: "Makassar, Sulsel", 
    isOpen: true, 
    rating: 4.7, 
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
    category: "Wisata Sejarah"
  },
  { 
    id: 4, 
    title: "Pulau Samalona", 
    location: "Makassar, Sulsel", 
    isOpen: true, 
    rating: 4.8, 
    image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop",
    category: "Wisata Alam"
  },
  { 
    id: 5, 
    title: "Coto Nusantara", 
    location: "Makassar, Sulsel", 
    isOpen: true, 
    rating: 4.9, 
    image: "https://images.unsplash.com/photo-1540575467063-178a5093df60?q=80&w=1000&auto=format&fit=crop",
    category: "Wisata Kuliner"
  },
  { 
    id: 6, 
    title: "Anjungan Pantai Losari", 
    location: "Makassar, Sulsel", 
    isOpen: true, 
    rating: 4.6, 
    image: "https://images.unsplash.com/photo-1510484732158-9418a0a97b23?q=80&w=1000&auto=format&fit=crop",
    category: "Wisata Kota"
  },
  { 
    id: 7, 
    title: "Lolai (Negeri di Atas Awan)", 
    location: "Toraja Utara, Sulsel", 
    isOpen: true, 
    rating: 4.9, 
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
    category: "Wisata Alam"
  },
];

// --- LIST KOTA/KABUPATEN ---
const cities = [
  "Semua Kota", 
  "Bantaeng", "Barru", "Bone", "Bulukumba", "Enrekang", "Gowa", 
  "Jeneponto", "Kepulauan Selayar", "Luwu", "Luwu Timur", "Luwu Utara", 
  "Maros", "Pangkajene dan Kepulauan", "Pinrang", "Sidenreng Rappang", 
  "Sinjai", "Soppeng", "Takalar", "Tana Toraja", "Toraja Utara", 
  "Wajo", "Makassar", "Palopo", "Parepare"
];

// --- LIST KATEGORI ---
const categories = [
  "Semua Kategori", 
  "Wisata Alam", 
  "Wisata Kuliner", 
  "Wisata Sejarah", 
  "Wisata Kota"
];

export default function WisataPage() {
  const [selectedCity, setSelectedCity] = useState("Semua Kota");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = wisataData.filter((item) => {
    const matchCategory = selectedCategory === "Semua Kategori" || item.category === selectedCategory;
    const matchCity = selectedCity === "Semua Kota" || item.location.toLowerCase().includes(selectedCity.toLowerCase());
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchCity && matchSearch;
  });

  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        
        {/* Navbar Desktop */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
          <div className="text-2xl font-bold text-blue-600">Jappa.</div>
          <div className="flex space-x-8 font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/event" className="hover:text-blue-600">Event</Link>
            <Link href="/wisata" className="text-blue-600">Wisata</Link>
          </div>
          <div className="flex items-center space-x-4">
             <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
             
             {/* PERBAIKAN DI SINI: Link ke Profile */}
             <Link href="/profile">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                    <User className="w-5 h-5 text-gray-600" />
                </div>
             </Link>
          </div>
        </nav>

        {/* Hero Header */}
        <div className="relative h-64 md:h-80 w-full">
           <Image 
             src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop" 
             alt="Wisata Background" 
             fill 
             className="object-cover brightness-75" 
           />
           <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-screen-xl mx-auto w-full">
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-6">
                Destinasi Wisata
              </h1>
              
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
                 
                 {/* Input Cari */}
                 <div className="relative w-full md:flex-1 h-12">
                    <input 
                      type="text" 
                      placeholder="Cari Wisata..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-full pl-5 pr-10 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 </div>

                 {/* Dropdown Kota */}
                 <div className="relative w-full md:flex-1 h-12">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full h-full pl-5 pr-10 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>

                 {/* Dropdown Kategori */}
                 <div className="relative w-full md:flex-1 h-12">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full h-full pl-5 pr-10 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>

                 <button className="hidden md:flex w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg text-blue-600 hover:bg-gray-100 transition-colors">
                    <Search className="w-5 h-5" strokeWidth={3} />
                 </button>

              </div>
           </div>
        </div>

        {/* List Wisata */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
           {filteredData.length === 0 ? (
             <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm">
               <p className="text-lg font-medium">Tidak ada wisata ditemukan.</p>
               <p className="text-sm">Coba ganti filter Kota atau Kategori.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredData.map((item) => (
                   <Link href={`/wisata/${item.id}`} key={item.id}>
                      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100 h-full flex flex-col">
                         <div className="relative h-48 w-full bg-gray-200">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-500 shadow-sm flex items-center">
                               <Star className="w-3 h-3 mr-1 fill-orange-500" /> {item.rating}
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-medium text-white shadow-sm">
                               {item.category}
                            </div>
                         </div>
                         <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                               <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                               <p className="text-sm text-gray-500 mb-4 flex items-center">{item.location}</p>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                               <div className="flex items-center text-gray-400 text-xs"><MapPin className="w-3 h-3 mr-1" />Lihat Peta</div>
                               <div className={`text-sm font-bold ${item.isOpen ? 'text-green-600' : 'text-red-500'}`}>{item.isOpen ? 'Buka' : 'Tutup'}</div>
                            </div>
                         </div>
                      </div>
                   </Link>
                ))}
             </div>
           )}
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}