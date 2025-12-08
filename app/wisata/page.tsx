"use client";

import { useState, useEffect, Suspense } from "react"; // 1. Import Suspense
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, ChevronDown, Star, Loader2 } from "lucide-react"; 
import BottomNavBar from "../components/Header";
import ProfileDropdown from "../components/ProfileDropdown"; 

// IMPORT FIREBASE
import { db } from "@/lib/firebase"; 
import { collection, query, onSnapshot } from "firebase/firestore";

// Opsi Filter Statis
const cities = [
  "Semua Kota", 
  "Bantaeng", "Barru", "Bone", "Bulukumba", "Enrekang", "Gowa", 
  "Jeneponto", "Kepulauan Selayar", "Luwu", "Luwu Timur", "Luwu Utara", 
  "Maros", "Pangkajene dan Kepulauan", "Pinrang", "Sidenreng Rappang", 
  "Sinjai", "Soppeng", "Takalar", "Tana Toraja", "Toraja Utara", 
  "Wajo", "Makassar", "Palopo", "Parepare"
];

const categories = [
  "Semua Kategori", 
  "Wisata Alam", 
  "Wisata Kuliner", 
  "Wisata Sejarah", 
  "Wisata Kota"
];

// --- 2. KOMPONEN ISI (LOGIKA UTAMA PINDAH KE SINI) ---
function WisataContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // State untuk Data dari Firebase
  const [wisataList, setWisataList] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // State Filter
  const [selectedCity, setSelectedCity] = useState("Semua Kota");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // FETCH DATA REAL-TIME DARI FIREBASE
  useEffect(() => {
    const q = query(collection(db, "wisata"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setWisataList(data);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // LOGIKA FILTER
  const filteredData = wisataList.filter((item) => {
    // Filter Kategori
    const matchCategory = selectedCategory === "Semua Kategori" || item.category === selectedCategory;
    
    // Filter Kota
    const matchCity = selectedCity === "Semua Kota" || (item.location && item.location.toLowerCase().includes(selectedCity.toLowerCase()));
    
    // Filter Pencarian
    const matchSearch = !searchQuery || 
                       item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.location?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchCity && matchSearch;
  });

  return (
    <>
      <main className="bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 min-h-screen pb-24 md:pb-10">

        {/* Navbar Desktop */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50">
          <div className="text-2xl font-bold text-white">Jappa.</div>
          <div className="flex space-x-8 font-medium text-white/90">
            <Link href="/" className="hover:text-white hover:font-bold transition-all">Home</Link>
            <Link href="/event" className="hover:text-white hover:font-bold transition-all">Event</Link>
            <Link href="/wisata" className="text-white font-bold">Wisata</Link>
          </div>
          <div className="flex items-center space-x-4">
             <ProfileDropdown />
          </div>
        </nav>

        {/* Hero Header */}
        <div className="relative h-64 md:h-80 w-full bg-linear-to-br from-amber-900 to-orange-900">
           <Image
             src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
             alt="Wisata Background"
             fill
             className="object-cover opacity-90"
             priority
           />
           <div className="absolute inset-0 bg-linear-to-b from-amber-900/60 via-transparent to-orange-900/40"></div>

           <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto w-full">
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-6">
                Destinasi Wisata
              </h1>

              {/* Filter Container */}
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">

                 {/* Input Cari */}
                 <div className="relative w-full md:flex-1 h-12">
                    <input
                      type="text"
                      placeholder="Cari Wisata..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-full pl-5 pr-10 rounded-full bg-white/95 backdrop-blur-sm border-2 border-amber-200 text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                 </div>

                 {/* Dropdown Kota */}
                 <div className="relative w-full md:flex-1 h-12">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full h-full pl-5 pr-10 rounded-full bg-white/95 backdrop-blur-sm border-2 border-amber-200 text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
                 </div>

                 {/* Dropdown Kategori */}
                 <div className="relative w-full md:flex-1 h-12">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full h-full pl-5 pr-10 rounded-full bg-white/95 backdrop-blur-sm border-2 border-amber-200 text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
                 </div>

              </div>
           </div>
        </div>

        {/* List Wisata */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

           {/* Loading State */}
           {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="animate-spin text-amber-600 w-12 h-12" />
             </div>
           ) : filteredData.length === 0 ? (
             /* Empty State */
             <div className="text-center text-gray-600 py-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-amber-100">
               <p className="text-lg font-bold text-gray-800">Tidak ada wisata ditemukan.</p>
               <p className="text-sm mt-2">Coba ganti filter Kota atau Kategori, atau Admin belum menambahkan data.</p>
             </div>
           ) : (
             /* Grid Data */
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredData.map((item) => (
                   <Link href={`/wisata/${item.id}`} key={item.id}>
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:border-amber-300 transition-all duration-300 cursor-pointer border-2 border-amber-100 h-full flex flex-col group">

                         {/* Gambar Card */}
                         <div className="relative h-48 w-full bg-linear-to-br from-amber-100 to-orange-100">
                            {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-linear-to-br from-amber-200 to-orange-200 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                            )}

                            {/* Rating Badge */}
                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-xs font-bold text-amber-600 shadow-md flex items-center border border-amber-200">
                               <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" /> {item.rating || 4.5}
                            </div>

                            {/* Kategori Badge */}
                            <div className="absolute bottom-3 left-3 bg-linear-to-r from-amber-500 to-orange-500 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-md border border-white/30">
                               {item.category}
                            </div>
                         </div>

                         {/* Detail Info */}
                         <div className="p-5 flex-1 flex flex-col justify-between bg-linear-to-b from-white to-amber-50/30">
                            <div>
                               <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 mb-1 line-clamp-1 transition-colors">{item.title}</h3>
                               <p className="text-sm text-gray-600 mb-4 flex items-center line-clamp-1">
                                 <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500" />
                                 {item.location}
                               </p>
                            </div>
                            <div className="flex justify-between items-end border-t-2 border-amber-100 pt-3">
                               <div className="flex items-center text-amber-600 text-xs font-medium hover:text-amber-700 transition-colors">
                                 <MapPin className="w-3 h-3 mr-1" />
                                 Lihat Peta
                               </div>
                               <div className={`text-sm font-bold px-2.5 py-1 rounded-full ${item.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                 {item.isOpen ? 'Buka' : 'Tutup'}
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

// --- 3. KOMPONEN UTAMA (WRAPPER SUSPENSE) ---
// Ini yang diexport agar build Next.js sukses
export default function WisataPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50">
           <Loader2 className="animate-spin text-amber-600 w-12 h-12" />
        </div>
      }
    >
      <WisataContent />
    </Suspense>
  );
}