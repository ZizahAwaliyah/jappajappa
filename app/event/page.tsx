"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MapPin, Calendar, ChevronDown, Bell, User } from "lucide-react";
import BottomNavBar from "../components/BottomNavBar"; // Pastikan path ini sesuai dengan struktur folder kamu

// --- 1. DATA DUMMY (Pastikan bagian ini ada) ---
const categories = ["Konser", "Festival", "Pameran"];

const eventsData = [
  {
    id: 1,
    title: "Konser Langit Senja",
    date: "25 Okt 2025",
    location: "Pantai Losari, Makassar",
    price: "Rp 150.000",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop",
    category: "Konser"
  },
  {
    id: 2,
    title: "Makassar Food Fest",
    date: "28 Okt 2025",
    location: "Fort Rotterdam",
    price: "Gratis",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
    category: "Festival"
  },
  {
    id: 3,
    title: "Pameran IT RITECH",
    date: "01 Nov 2025",
    location: "Unilife Hall",
    price: "Rp 50.000",
    image: "https://images.unsplash.com/photo-1540575467063-178a5093df60?q=80&w=1000&auto=format&fit=crop",
    category: "Pameran"
  },
  {
    id: 4,
    title: "Jazz Pantai Bira",
    date: "10 Nov 2025",
    location: "Tanjung Bira",
    price: "Rp 200.000",
    image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop",
    category: "Konser"
  },
];

// --- 2. KOMPONEN UTAMA ---
export default function EventPage() {
  const [activeCategory, setActiveCategory] = useState("Konser");

  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        
        {/* === DESKTOP NAVBAR (Hidden on Mobile) === */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
          <div className="text-2xl font-bold text-blue-600">Jappa.</div>
          <div className="flex space-x-8 font-medium text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/event" className="text-blue-600">Event</a>
            <a href="#" className="hover:text-blue-600">Wisata</a>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-600" />
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </nav>

        {/* === HERO HEADER === */}
        <div className="relative h-56 md:h-72 w-full">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
            alt="Event Background"
            fill
            className="object-cover brightness-75"
            priority
          />

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-screen-xl mx-auto w-full">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                Event
              </h1>
              <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center hover:bg-white/30 transition-colors">
                Bulan <ChevronDown className="ml-1 w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full md:max-w-2xl">
              <input
                type="text"
                placeholder="Cari pantai, coto, atau event musik..."
                className="w-full py-3.5 px-5 pl-12 rounded-full bg-white text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* === CATEGORY TABS === */}
        <div className="bg-white shadow-sm sticky top-0 md:top-[72px] z-40">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap text-sm md:text-base font-bold pb-1 transition-colors ${
                    activeCategory === category
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* === LIST EVENT (Bagian yang Diperbaiki) === */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventsData.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer border border-gray-100">
                
                {/* Gambar Card (Tanpa Harga di atasnya) */}
                <div className="relative h-48 w-full bg-gray-200">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Detail Card */}
                <div className="p-5">
                  {/* Judul & Tanggal */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1 whitespace-nowrap">
                      <Calendar className="w-3 h-3 mr-1.5" />
                      {event.date}
                    </div>
                  </div>

                  {/* Garis Pemisah */}
                  <hr className="border-gray-100 mb-3" />

                  {/* Lokasi & Harga (Di bawah) */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500 text-sm truncate pr-4 max-w-[70%]">
                      <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      {event.price}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </main>

      {/* === BOTTOM NAVBAR === */}
      <BottomNavBar />
    </>
  );
}