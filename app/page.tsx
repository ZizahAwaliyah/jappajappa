// app/page.tsx
"use client";

import Image from "next/image";
import { Search, MapPin, ChevronRight, Bell, User } from "lucide-react";
import BottomNavBar from "./components/BottomNavBar";
import EventCountdown from "./components/Countdown"; // <--- IMPORT INI

// --- Data Dummy dengan TANGGAL TARGET ---
// Pastikan tanggalnya di masa depan agar countdown berjalan
const upcomingEvents = [
  { 
    id: 1, 
    title: 'Konser Senja', 
    location: 'Pantai Losari', 
    date: '2025-11-25T17:00:00' // Format: YYYY-MM-DDTHH:mm:ss
  },
  { 
    id: 2, 
    title: 'RITECH 2025', 
    location: 'CPI Makassar', 
    date: '2025-12-01T09:00:00' 
  },
  { 
    id: 3, 
    title: 'Festival Coto', 
    location: 'Fort Rotterdam', 
    date: '2025-11-21T08:00:00' 
  },
];

const topPicks = [
  { id: 1, title: 'Pantai Bira', location: 'Bulukumba' },
  { id: 2, title: 'Malino Highland', location: 'Gowa' },
  { id: 3, title: 'Rammang-Rammang', location: 'Maros' },
  { id: 4, title: 'Pulau Samalona', location: 'Makassar' },
];

const jappaNowItems = [
  { id: 1, title: 'Coto Nusantara', description: 'Kuliner Legendaris' },
  { id: 2, title: 'Pallubasa Serigala', description: 'Makanan Berat' },
  { id: 3, title: 'Pisang Epe Mandar', description: 'Cemilan Malam' },
  { id: 4, title: 'Mie Titi Panakkukang', description: 'Kuliner Khas' },
];

export default function HomePage() {
  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        
        {/* === DESKTOP NAVBAR (Hanya muncul di md ke atas) === */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
          <div className="text-2xl font-bold text-blue-600">Jappa.</div>
          <div className="flex space-x-8 font-medium text-gray-600">
            <a href="#" className="text-blue-600">Home</a>
            <a href="#" className="hover:text-blue-600">Event</a>
            <a href="#" className="hover:text-blue-600">Wisata</a>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-600" />
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </nav>

        {/* === HERO SECTION (Full Width) === */}
        <div className="relative h-[400px] md:h-[500px] w-full bg-gray-900">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10"></div>

          <div className="absolute top-0 left-0 right-0 flex justify-center pt-12 md:pt-32 px-4 z-20">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Cari pantai, coto, atau event musik..."
                className="w-full rounded-full bg-white/95 backdrop-blur-sm py-4 px-6 pl-14 text-sm md:text-base shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all text-gray-800 placeholder-gray-500"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>

          <div className="absolute bottom-40 left-0 right-0 text-center text-white hidden md:block z-10">
            <h1 className="text-4xl font-bold mb-2">Jelajahi Sulawesi Selatan</h1>
            <p className="text-lg text-gray-200">Temukan event dan wisata terbaik hari ini</p>
          </div>
        </div>

        {/* === CONTAINER KONTEN UTAMA === */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative z-30">
          
          {/* === CARD "EVENT AKAN DATANG" === */}
          <div className="-mt-32 md:-mt-24 mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">Event akan Datang</h2>
                <span className="text-sm md:text-base font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Oktober
                </span>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="group cursor-pointer">
                    <div className="aspect-square bg-gray-100 rounded-xl md:rounded-2xl relative overflow-hidden shadow-inner border border-gray-100 mb-2">
                      {/* Placeholder Gambar */}
                      <div className="absolute inset-0 bg-gray-300 group-hover:scale-105 transition-transform duration-500"></div>
                      
                      {/* === COUNTDOWN TIMER (Ditambahkan di sini) === */}
                      {/* Posisikan di pojok kanan atas atau tengah bawah */}
                      <div className="absolute top-2 right-2 z-10">
                        <EventCountdown targetDate={event.date} />
                      </div>

                      {/* Overlay Lokasi (Desktop) */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 hidden md:block">
                         <p className="text-white text-xs font-medium flex items-center">
                           <MapPin className="w-3 h-3 mr-1"/> {event.location}
                         </p>
                      </div>
                    </div>
                    
                    <h3 className="text-xs md:text-lg font-bold text-gray-800 truncate md:whitespace-normal">
                      {event.title}
                    </h3>
                    
                    {/* Info Lokasi (Mobile Only - karena space sempit di dalam gambar) */}
                    <p className="text-[10px] text-gray-500 md:hidden truncate">
                      {event.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === TOP PICKS OF THE MONTH === */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg md:text-2xl font-bold text-gray-900">Top Picks of the Month</h2>
               <a href="#" className="text-blue-600 text-sm font-semibold hidden md:block hover:underline">Lihat Semua</a>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 md:gap-6 md:space-x-0 md:pb-0">
              {topPicks.map((pick) => (
                <div key={pick.id} className="flex-shrink-0 w-32 md:w-full flex flex-col group cursor-pointer">
                  <div className="h-40 md:h-52 w-full bg-gray-200 rounded-2xl shadow-sm mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-300 group-hover:bg-gray-400 transition-colors duration-300"></div>
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">
                      4.8 ★
                    </div>
                  </div>
                  <h3 className="text-sm md:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {pick.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" /> {pick.location}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* === JAPPA NOW === */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">Jappa Now</h2>
              <button className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 text-xs md:text-sm px-3 py-1 rounded-full font-medium flex items-center">
                Semua <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jappaNowItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-20 w-20 bg-gray-200 rounded-xl shadow-inner flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-gray-800 md:text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500 md:text-base">{item.description}</p>
                    <p className="text-xs text-blue-600 mt-1 font-medium">Buka Sekarang</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <BottomNavBar />
    </>
  );
}