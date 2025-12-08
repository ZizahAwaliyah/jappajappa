"use client";

import { useState, useEffect } from "react"; 
import Image from "next/image";
import Link from "next/link";
import { MapPin, Loader2 } from "lucide-react";

// --- IMPORT KOMPONEN ---
import BottomNavBar from "./components/Header";
import EventCountdown from "./components/Countdown";
import ProfileDropdown from "./components/ProfileDropdown";
import SearchBox from "./components/SearchBox";

// --- IMPORT SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/pagination';

// --- FIREBASE ---
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [topPicks, setTopPicks] = useState<any[]>([]);
  const [jappaNowItems, setJappaNowItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Array gambar alam Sulawesi Selatan
  const heroImages = [
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop", // Pantai Sulawesi
    "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=2062&auto=format&fit=crop", // Gunung dan alam tropis
    "https://images.unsplash.com/photo-1589519160732-57fc498494f8?q=80&w=2070&auto=format&fit=crop", // Sawah dan pegunungan
  ];

  // Auto-slide hero images setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    // 1. Fetch Events
    const qEvents = query(
      collection(db, "events"),
      where("status", "==", "Actual"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    // 2. Fetch Wisata
    const qWisata = query(
      collection(db, "wisata"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    // 3. Fetch Jappa Now
    const qJappa = query(
      collection(db, "jappa_posts"),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    // Listeners
    const unsubEvents = onSnapshot(qEvents, (snap) => {
      setUpcomingEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubWisata = onSnapshot(qWisata, (snap) => {
      setTopPicks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubJappa = onSnapshot(qJappa, (snap) => {
      setJappaNowItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubEvents();
      unsubWisata();
      unsubJappa();
    };
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50"><Loader2 className="animate-spin text-emerald-600 w-12 h-12" /></div>;

  return (
    <>
      <main className="bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 min-h-screen pb-24 md:pb-10">

        {/* === DESKTOP NAVBAR === */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50">
          <div className="text-2xl font-bold text-white">Jappa.</div>
          <div className="flex space-x-8 font-medium text-white/90">
            <Link href="/" className="text-white font-bold">Home</Link>
            <Link href="/event" className="hover:text-white hover:font-bold transition-all">Event</Link>
            <Link href="/wisata" className="hover:text-white hover:font-bold transition-all">Wisata</Link>
          </div>
          <div className="flex items-center space-x-4">
            <ProfileDropdown />
          </div>
        </nav>

        {/* === HERO SECTION (UPDATED) === */}
        <div className="relative h-[500px] md:h-[600px] w-full bg-emerald-900 overflow-hidden">
             {/* Background Images */}
             {heroImages.map((image, index) => (
               <div
                 key={index}
                 className={`absolute inset-0 transition-opacity duration-1000 ${
                   index === currentHeroImage ? 'opacity-100' : 'opacity-0'
                 }`}
               >
                 <Image
                   src={image}
                   alt={`Hero Background ${index + 1}`}
                   fill
                   className="object-cover"
                   priority={index === 0}
                 />
               </div>
             ))}

             {/* Darker Overlay untuk Teks lebih terbaca */}
             <div className="absolute inset-0 bg-black/40 z-10"></div>

             {/* === CONTENT CENTERED (Search & Text) === */}
             <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-20 text-center space-y-6">
               
               {/* Teks Pembuka */}
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                 <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight">
                   Eksplorasi Pesona Sulawesi Selatan
                 </h1>
                 <p className="text-white/90 text-sm md:text-lg font-medium max-w-2xl mx-auto drop-shadow-md">
                   Temukan event seru, wisata alam menakjubkan, dan kuliner legendaris hanya di Jappa.
                 </p>
               </div>

               {/* Search Box dengan Background Transparan (Glass Effect) */}
               <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                 <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 shadow-2xl">
                   <SearchBox />
                 </div>
               </div>

             </div>

             {/* Indikator dots */}
             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
               {heroImages.map((_, index) => (
                 <button
                   key={index}
                   onClick={() => setCurrentHeroImage(index)}
                   className={`h-2 rounded-full transition-all duration-300 ${
                     index === currentHeroImage
                       ? 'bg-white w-8'
                       : 'bg-white/40 hover:bg-white/60 w-2'
                   }`}
                   aria-label={`Go to slide ${index + 1}`}
                 />
               ))}
             </div>
        </div>

        {/* === KONTEN UTAMA === */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative z-30">
          
          {/* === CARD EVENT === */}
          <div className="-mt-16 md:-mt-20 mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-emerald-200 p-5 md:p-8 relative">
              <div className="flex justify-between items-center mb-4">
                <Link href="/event" className="hover:underline">
                  <h2 className="text-lg md:text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Event akan Datang</h2>
                </Link>
                <Link href="/event" className="text-xs md:text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors">
                  Lihat Semua
                </Link>
              </div>

              {upcomingEvents.length === 0 ? (
                 <p className="text-center text-gray-400 py-10">Belum ada event yang tersedia.</p>
              ) : (
                <Swiper
                  modules={[Pagination, Mousewheel]}
                  spaceBetween={16}
                  slidesPerView={2.2}
                  grabCursor={true}
                  mousewheel={true}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    640: { slidesPerView: 2.5 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 3.5 },
                  }}
                  className="pb-12"
                >
                  {upcomingEvents.map((event) => (
                    <SwiperSlide key={event.id}>
                      <Link href={`/event/${event.id}`} className="group cursor-pointer block h-full">
                        <div className="aspect-square bg-gray-100 rounded-xl md:rounded-2xl relative overflow-hidden shadow-md border border-gray-100 mb-3 group-hover:shadow-lg transition-all">
                          <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-500">
                            {event.image ? (
                               <Image src={event.image} alt={event.title} fill className="object-cover" />
                            ) : (
                               <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>
                          <div className="absolute top-2 right-2 z-10">
                            <EventCountdown targetDate={`${event.date}T${event.time || '00:00:00'}`} />
                          </div>
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-gray-800 group-hover:text-emerald-600 truncate px-1 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 px-1 truncate">{event.location}</p>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

          {/* === TOP PICKS (WISATA) === */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg md:text-2xl font-bold text-gray-800">Top Picks of the Month</h2>
               <Link href="/wisata" className="text-xs md:text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
                 Lihat Semua Wisata
               </Link>
            </div>

            {topPicks.length === 0 ? (
               <p className="text-gray-400 text-sm">Belum ada data wisata.</p>
            ) : (
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 md:gap-6 md:space-x-0 md:pb-0">
                {topPicks.map((pick) => (
                  <Link href={`/wisata/${pick.id}`} key={pick.id} className="shrink-0 w-36 md:w-full flex flex-col group cursor-pointer">
                    <div className="h-44 md:h-52 w-full bg-gray-100 rounded-xl shadow-sm mb-3 relative overflow-hidden group-hover:shadow-md transition-all">
                      <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-500">
                          {pick.image && <Image src={pick.image} alt={pick.title} fill className="object-cover" />}
                      </div>
                    </div>
                    <h3 className="text-sm md:text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                      {pick.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-500 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1 text-red-500" /> {pick.location}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* === JAPPA NOW === */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">Jappa Now</h2>
            </div>

            {jappaNowItems.length === 0 ? (
               <p className="text-gray-400 text-sm">Belum ada artikel terbaru.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {jappaNowItems.map((item) => (
                  <Link href={`/jappanow/${item.id}`} key={item.id} className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
                    <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                      {item.image && <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                        {item.description}
                      </p>
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Baca Selengkapnya</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      <BottomNavBar />
    </>
  );
}