"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, ChevronDown, Star } from "lucide-react";
import BottomNavBar from "../components/Header";
import ProfileDropdown from "../components/ProfileDropdown";

const cities = ["Semua Kota", "Makassar", "Gowa", "Maros", "Bulukumba", "Toraja Utara", "Parepare"];
const categories = ["Semua Kategori", "Wisata Alam", "Wisata Kuliner", "Wisata Sejarah", "Wisata Kota"];

// DATA DUMMY WISATA (untuk preview UI/UX)
const dummyWisataList = [
  {
    id: "1",
    title: "Pantai Losari",
    location: "Makassar, Sulawesi Selatan",
    category: "Wisata Alam",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
    rating: 4.8,
    isOpen: true
  },
  {
    id: "2",
    title: "Malino Highlands",
    location: "Gowa, Sulawesi Selatan",
    category: "Wisata Alam",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    rating: 4.7,
    isOpen: true
  },
  {
    id: "3",
    title: "Bantimurung Waterfall",
    location: "Maros, Sulawesi Selatan",
    category: "Wisata Alam",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop",
    rating: 4.9,
    isOpen: true
  },
  {
    id: "4",
    title: "Fort Rotterdam",
    location: "Makassar, Sulawesi Selatan",
    category: "Wisata Sejarah",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop",
    rating: 4.6,
    isOpen: true
  },
  {
    id: "5",
    title: "Trans Studio Makassar",
    location: "Makassar, Sulawesi Selatan",
    category: "Wisata Kota",
    image: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=800&auto=format&fit=crop",
    rating: 4.8,
    isOpen: true
  },
  {
    id: "6",
    title: "Coto Makassar Paraikatte",
    location: "Makassar, Sulawesi Selatan",
    category: "Wisata Kuliner",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
    rating: 4.7,
    isOpen: true
  }
];

export default function WisataPage() {
  const [wisataList] = useState<any[]>(dummyWisataList); // Gunakan dummy data
  const [selectedCity, setSelectedCity] = useState("Semua Kota");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = wisataList.filter((item) => {
    const matchCategory = selectedCategory === "Semua Kategori" || item.category === selectedCategory;
    const matchCity = selectedCity === "Semua Kota" || item.location.toLowerCase().includes(selectedCity.toLowerCase());
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchCity && matchSearch;
  });

  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        
        {/* Navbar */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
          <div className="text-2xl font-bold text-blue-600">Jappa.</div>
          <div className="flex space-x-8 font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/event" className="hover:text-blue-600">Event</Link>
            <Link href="/wisata" className="text-blue-600">Wisata</Link>
          </div>
          <div className="flex items-center space-x-4">
             <ProfileDropdown />
          </div>
        </nav>

        {/* Hero Header */}
        <div className="relative h-64 md:h-80 w-full">
           <Image src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop" alt="Wisata Background" fill className="object-cover brightness-75" />
           <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-screen-xl mx-auto w-full">
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-6">Destinasi Wisata</h1>
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
                 <div className="relative w-full md:flex-1 h-12">
                    <input type="text" placeholder="Cari Wisata..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-full pl-5 pr-10 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 </div>
                 <div className="relative w-full md:flex-1 h-12">
                    <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full h-full pl-5 pr-10 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                      {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>
                 <div className="relative w-full md:flex-1 h-12">
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full h-full pl-5 pr-10 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>
              </div>
           </div>
        </div>

        {/* List Wisata */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
           {filteredData.length === 0 ? (
             <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm"><p className="text-lg font-medium">Tidak ada wisata ditemukan.</p></div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredData.map((item) => (
                   <Link href={`/wisata/${item.id}`} key={item.id}>
                      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100 h-full flex flex-col">
                         <div className="relative h-48 w-full bg-gray-200">
                            {item.image ? <Image src={item.image} alt={item.title} fill className="object-cover" /> : <div className="absolute inset-0 bg-gray-200" />}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-500 shadow-sm flex items-center"><Star className="w-3 h-3 mr-1 fill-orange-500" /> {item.rating || 4.5}</div>
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-medium text-white shadow-sm">{item.category}</div>
                         </div>
                         <div className="p-5 flex-1 flex flex-col justify-between">
                            <div><h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3><p className="text-sm text-gray-500 mb-4 flex items-center">{item.location}</p></div>
                            <div className="flex justify-between items-end border-t border-gray-100 pt-3"><div className="flex items-center text-gray-400 text-xs"><MapPin className="w-3 h-3 mr-1" />Lihat Peta</div><div className={`text-sm font-bold ${item.isOpen ? 'text-green-600' : 'text-red-500'}`}>{item.isOpen ? 'Buka' : 'Tutup'}</div></div>
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