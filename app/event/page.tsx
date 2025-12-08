"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar, ChevronDown, Loader2 } from "lucide-react"; 
import BottomNavBar from "../components/Header"; 
import ProfileDropdown from "../components/ProfileDropdown"; 

// IMPORT FIREBASE
import { db } from "@/lib/firebase"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";

// --- KONFIGURASI FILTER ---
const categories = ["Semua Event", "Konser", "Festival", "Pameran"];

const months = [
  { label: "Semua Bulan", value: "All" },
  { label: "Januari", value: "01" },
  { label: "Februari", value: "02" },
  { label: "Maret", value: "03" },
  { label: "April", value: "04" },
  { label: "Mei", value: "05" },
  { label: "Juni", value: "06" },
  { label: "Juli", value: "07" },
  { label: "Agustus", value: "08" },
  { label: "September", value: "09" },
  { label: "Oktober", value: "10" },
  { label: "November", value: "11" },
  { label: "Desember", value: "12" },
];

export default function EventPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter
  const [selectedCategory, setSelectedCategory] = useState("Semua Event");
  const [selectedMonth, setSelectedMonth] = useState("All"); 
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // 1. FETCH DATA FIREBASE
  useEffect(() => {
    // Hanya ambil event yang statusnya 'Actual' (approved oleh admin)
    const q = query(collection(db, "events"), where("status", "==", "Actual"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEventsData(data);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. LOGIKA FILTER
  const filteredData = eventsData.filter((event) => {
    // A. Filter Kategori
    const matchCategory = selectedCategory === "Semua Event" || event.category === selectedCategory;
    
    // B. Filter Pencarian (Nama Event atau Lokasi) - gunakan field 'title' yang sebenarnya
    const matchSearch = !searchQuery || event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // C. Filter Bulan 
    // Field date di database adalah format YYYY-MM-DD (misal: 2026-02-14)
    // Bukan startDate, tapi 'date'
    let eventMonth = "";
    if (event.date) {
        const dateStr = typeof event.date === 'string' ? event.date : event.date;
        const parts = dateStr.split("-");
        if (parts.length > 1) {
            eventMonth = parts[1]; // "02"
        }
    }
    const matchMonth = selectedMonth === "All" || eventMonth === selectedMonth;

    return matchCategory && matchSearch && matchMonth;
  });

  return (
    <>
      <main className="bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 min-h-screen pb-24 md:pb-10">

        {/* === NAVBAR DESKTOP === */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50">
          <div className="text-2xl font-bold text-white">Jappa.</div>
          <div className="flex space-x-8 font-medium text-white/90">
            <Link href="/" className="hover:text-white hover:font-bold transition-all">Home</Link>
            <Link href="/event" className="text-white font-bold">Event</Link>
            <Link href="/wisata" className="hover:text-white hover:font-bold transition-all">Wisata</Link>
          </div>
          <div className="flex items-center space-x-4">
            <ProfileDropdown />
          </div>
        </nav>

        {/* === HERO HEADER === */}
        <div className="relative h-64 md:h-80 w-full bg-linear-to-br from-emerald-900 to-teal-900">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            alt="Event Background"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-emerald-900/60 via-transparent to-teal-900/40"></div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-screen-xl mx-auto w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-6">Event</h1>

            {/* CONTAINER FILTER & SEARCH */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">

              {/* 1. Input Pencarian */}
              <div className="relative w-full md:w-[400px] h-12">
                <input
                  type="text"
                  placeholder="Cari event (misal: Konser, Festival)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-5 pr-10 rounded-full bg-white/95 backdrop-blur-sm border-2 border-emerald-200 text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              </div>

              {/* 2. Dropdown Bulan */}
              <div className="relative w-full md:w-48 h-12">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-full pl-5 pr-10 rounded-full bg-white/95 backdrop-blur-sm border-2 border-emerald-200 text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
              </div>

            </div>
          </div>
        </div>

        {/* === CATEGORY TABS (Sticky) === */}
        <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-emerald-100 sticky top-0 md:top-[72px] z-40">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap text-sm md:text-base font-bold pb-1 transition-all ${
                    selectedCategory === category
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-400 hover:text-emerald-500"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* === LIST EVENT === */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">

          {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="animate-spin text-emerald-600 w-12 h-12" />
             </div>
          ) : filteredData.length === 0 ? (
             <div className="text-center text-gray-600 py-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100">
               <p className="text-lg font-bold text-gray-800">Tidak ada event ditemukan.</p>
               <p className="text-sm mt-2">Coba ganti bulan, kategori, atau kata kunci pencarian.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredData.map((event) => (
                <Link href={`/event/${event.id}`} key={event.id}>
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 cursor-pointer border-2 border-emerald-100 h-full flex flex-col group">

                    {/* Gambar Card */}
                    <div className="relative h-48 w-full bg-linear-to-br from-emerald-100 to-teal-100">
                      {event.image ? (
                          <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                          <div className="absolute inset-0 bg-linear-to-br from-emerald-200 to-teal-200" />
                      )}

                      {/* Badge Kategori */}
                      <div className="absolute top-3 right-3 bg-linear-to-r from-emerald-500 to-teal-500 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-md border border-white/30">
                        {event.category}
                      </div>
                    </div>

                    {/* Detail Card */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-linear-to-b from-white to-emerald-50/30">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 line-clamp-2 transition-colors">{event.title}</h3>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 mb-4 whitespace-nowrap">
                          <Calendar className="w-3 h-3 mr-1.5 text-sky-500" />{event.date}
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t-2 border-emerald-100 pt-3 mt-auto">
                        <div className="flex items-center text-gray-600 text-sm truncate pr-4">
                          <MapPin className="w-4 h-4 mr-1.5 text-rose-500" /><span className="truncate">{event.location}</span>
                        </div>
                        <div className="text-sm font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent whitespace-nowrap">
                            Rp {Number(event.price).toLocaleString('id-ID')}
                        </div>
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