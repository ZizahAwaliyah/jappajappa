"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { Search, MapPin, Calendar, User, ChevronDown } from "lucide-react"; 
import BottomNavBar from "../components/Header"; 
import ProfileDropdown from "../components/ProfileDropdown"; // Import Dropdown

// --- 1. DATA DUMMY (LISTING) ---
const eventsData = [
  {
    id: 1,
    title: "Konser Senja",
    date: "25 Nov 2025",
    location: "Pantai Losari",
    price: "Rp 75.000",
    image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop",
    category: "Konser"
  },
  {
    id: 2,
    title: "RITECH 2025",
    date: "01 Des 2025",
    location: "CPI Makassar",
    price: "Gratis",
    image: "https://images.unsplash.com/photo-1540575467063-178a5093df60?q=80&w=1000&auto=format&fit=crop",
    category: "Pameran"
  },
  {
    id: 3,
    title: "Festival Coto",
    date: "21 Nov 2025",
    location: "Fort Rotterdam",
    price: "Rp 50.000",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
    category: "Festival"
  },
  {
    id: 4,
    title: "Jazz Pantai Bira",
    date: "15 Des 2025",
    location: "Tanjung Bira",
    price: "Rp 100.000",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop",
    category: "Konser"
  },
  {
    id: 5,
    title: "Pameran UMKM Sulsel",
    date: "20 Des 2025",
    location: "Trans Studio Mall",
    price: "Rp 10.000",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1000&auto=format&fit=crop",
    category: "Pameran"
  }
];

// --- 2. LIST KATEGORI & BULAN ---
const categories = ["Semua Event", "Konser", "Festival", "Pameran"];

const months = [
  { label: "Semua Bulan", value: "All" },
  { label: "Januari", value: "Jan" },
  { label: "Februari", value: "Feb" },
  { label: "Maret", value: "Mar" },
  { label: "April", value: "Apr" },
  { label: "Mei", value: "Mei" },
  { label: "Juni", value: "Jun" },
  { label: "Juli", value: "Jul" },
  { label: "Agustus", value: "Agu" },
  { label: "September", value: "Sep" },
  { label: "Oktober", value: "Okt" },
  { label: "November", value: "Nov" },
  { label: "Desember", value: "Des" },
];

export default function EventPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua Event");
  const [selectedMonth, setSelectedMonth] = useState("All"); 
  const [searchQuery, setSearchQuery] = useState("");

  // --- 3. LOGIKA FILTER UTAMA ---
  const filteredData = eventsData.filter((event) => {
    // A. Filter Kategori
    const matchCategory = selectedCategory === "Semua Event" || event.category === selectedCategory;
    
    // B. Filter Pencarian (Nama Event atau Lokasi)
    const matchSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        event.location.toLowerCase().includes(searchQuery.toLowerCase());

    // C. Filter Bulan (Mencocokkan string tanggal dengan value bulan)
    const matchMonth = selectedMonth === "All" || event.date.includes(selectedMonth);

    return matchCategory && matchSearch && matchMonth;
  });

  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        
        {/* Navbar Desktop - TANPA LONCENG, ADA DROPDOWN */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
          <div className="text-2xl font-bold text-blue-600">Jappa.</div>
          <div className="flex space-x-8 font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/event" className="text-blue-600">Event</Link>
            <Link href="/wisata" className="hover:text-blue-600">Wisata</Link>
          </div>
          <div className="flex items-center space-x-4">
            
            {/* PROFILE DROPDOWN */}
            <ProfileDropdown />

          </div>
        </nav>

        {/* Hero Header */}
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
            alt="Event Background"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-screen-xl mx-auto w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-6">Event</h1>
            
            {/* CONTAINER FILTER & SEARCH */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
              
              {/* 1. Input Pencarian */}
              <div className="relative w-full md:w-[400px] h-12">
                <input 
                  type="text" 
                  placeholder="Cari event (misal: Konser, Festival)..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-5 pr-10 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* 2. Dropdown Bulan */}
              <div className="relative w-full md:w-48 h-12">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-full pl-5 pr-10 rounded-full bg-white text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

            </div>
          </div>
        </div>

        {/* === CATEGORY TABS (Sticky) === */}
        <div className="bg-white shadow-sm sticky top-0 md:top-[72px] z-40">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap text-sm md:text-base font-bold pb-1 transition-colors ${
                    selectedCategory === category
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List Event */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
          
          {/* Tampilkan pesan jika kosong */}
          {filteredData.length === 0 ? (
             <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm">
               <p className="text-lg font-medium">Tidak ada event ditemukan.</p>
               <p className="text-sm">Coba ganti bulan, kategori, atau kata kunci pencarian.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredData.map((event) => (
                <Link href={`/event/${event.id}`} key={event.id}> 
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100 h-full flex flex-col">
                    
                    {/* Gambar Card */}
                    <div className="relative h-48 w-full bg-gray-200">
                      <Image src={event.image} alt={event.title} fill className="object-cover" />
                      {/* Badge Kategori */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-blue-600 shadow-sm">
                        {event.category}
                      </div>
                    </div>

                    {/* Detail Card */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mb-4 whitespace-nowrap">
                          <Calendar className="w-3 h-3 mr-1.5" />{event.date}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-auto">
                        <div className="flex items-center text-gray-500 text-sm truncate pr-4">
                          <MapPin className="w-4 h-4 mr-1.5" /><span className="truncate">{event.location}</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900 whitespace-nowrap">{event.price}</div>
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