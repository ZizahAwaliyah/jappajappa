// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Bell, User } from "lucide-react";

// --- IMPORT KOMPONEN ---
import BottomNavBar from "./components/Header";
import EventCountdown from "./components/Countdown";

// --- IMPORT SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/pagination';

// --- DATA DUMMY ---
const upcomingEvents = [
  { id: 1, title: 'Konser Senja', location: 'Pantai Losari', date: '2025-11-25T17:00:00' },
  { id: 2, title: 'RITECH 2025', location: 'CPI Makassar', date: '2025-12-01T09:00:00' },
  { id: 3, title: 'Festival Coto', location: 'Fort Rotterdam', date: '2025-11-21T08:00:00' },
  { id: 4, title: 'Jazz Pantai Bira', location: 'Tanjung Bira', date: '2025-12-15T16:00:00' },
  { id: 5, title: 'Pameran UMKM', location: 'Trans Studio', date: '2025-12-20T10:00:00' },
];

const topPicks = [
  { id: 1, title: 'Pantai Bira', location: 'Bulukumba' },
  { id: 2, title: 'Malino Highland', location: 'Gowa' },
  { id: 3, title: 'Rammang-Rammang', location: 'Maros' },
  { id: 4, title: 'Pulau Samalona', location: 'Makassar' },
];

const jappaNowItems = [
  {
    id: 1,
    title: 'Nongkrong Asik di Senja',
    description: 'Nikmati suasana sore yang tenang dengan kopi khas Makassar. Tempat ini sangat cocok untuk melepas penat setelah bekerja seharian.',
    image: 'https://images.unsplash.com/photo-1563805042-60734c98602a?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Kuliner Malam Legendaris',
    description: 'Jelajahi rasa otentik kuliner malam yang tak pernah tidur. Dari Coto hingga Pisang Epe, semuanya ada di sini.',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Museum Sejarah Kota',
    description: 'Belajar sejarah kota Makassar di museum yang estetik dan penuh informasi. Cocok untuk wisata edukasi keluarga.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop'
  }
];

export default function HomePage() {
  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        
        {/* === DESKTOP NAVBAR === */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
          <div className="text-2xl font-bold text-blue-600">Jappa.</div>
          <div className="flex space-x-8 font-medium text-gray-600">
            <Link href="/" className="text-blue-600">Home</Link>
            <Link href="/event" className="hover:text-blue-600 transition-colors">Event</Link>
            <Link href="/wisata" className="hover:text-blue-600 transition-colors">Wisata</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
            <Link href="/profile">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </Link>
          </div>
        </nav>

        {/* === HERO SECTION === */}
        <div className="relative h-[400px] md:h-[500px] w-full bg-gray-900">
             <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
                alt="Hero Background"
                fill
                className="object-cover opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10"></div>
              
              {/* Search Bar Container */}
               <div className="absolute top-0 left-0 right-0 flex justify-center pt-12 md:pt-32 px-4 z-20">
                <div className="relative w-full max-w-2xl">
                  <Link href="/search" className="block w-full">
                    <div className="w-full rounded-full bg-white/95 backdrop-blur-sm py-4 px-6 pl-14 text-sm md:text-base shadow-2xl text-gray-500 cursor-pointer hover:bg-white transition-colors">
                      Cari pantai, coto, atau event musik...
                    </div>
                  </Link>
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                </div>
              </div>
        </div>

        {/* === KONTEN UTAMA === */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative z-30">
          
          {/* === CARD EVENT DENGAN SWIPER === */}
          <div className="-mt-32 md:-mt-24 mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 relative">
              
              <div className="flex justify-between items-center mb-4">
                <Link href="/event" className="hover:underline">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900">Event akan Datang</h2>
                </Link>
                <Link href="/event" className="text-sm md:text-base font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                  Lihat Semua
                </Link>
              </div>

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
                className="pb-20" 
              >
                {upcomingEvents.map((event) => (
                  <SwiperSlide key={event.id}>
                    <Link href={`/event/${event.id}`} className="group cursor-pointer block h-full">
                      <div className="aspect-square bg-gray-100 rounded-xl md:rounded-2xl relative overflow-hidden shadow-inner border border-gray-100 mb-3">
                        <div className="absolute inset-0 bg-gray-300 group-hover:scale-105 transition-transform duration-500">
                           <Image 
                               src={`https://source.unsplash.com/random/500x500?concert&sig=${event.id}`} 
                               alt={event.title} 
                               fill 
                               className="object-cover" 
                             />
                        </div>
                        <div className="absolute top-2 right-2 z-10">
                          <EventCountdown targetDate={event.date} />
                        </div>
                      </div>
                      <h3 className="text-sm md:text-lg font-bold text-gray-800 truncate px-1">
                        {event.title}
                      </h3>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

            </div>
          </div>

          {/* === TOP PICKS (Wisata) === */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg md:text-2xl font-bold text-gray-900">Top Picks of the Month</h2>
               <Link href="/wisata" className="text-blue-600 text-sm font-semibold hover:underline">
                 Lihat Semua
               </Link>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 md:gap-6 md:space-x-0 md:pb-0">
              {topPicks.map((pick) => (
                <Link href={`/wisata/${pick.id}`} key={pick.id} className="flex-shrink-0 w-32 md:w-full flex flex-col group cursor-pointer">
                  <div className="h-40 md:h-52 w-full bg-gray-200 rounded-2xl shadow-sm mb-3 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gray-300 group-hover:bg-gray-400 transition-colors duration-300">
                        <Image 
                          src={`https://source.unsplash.com/random/300x400?nature&sig=${pick.id}`} 
                          alt={pick.title} 
                          fill 
                          className="object-cover" 
                        />
                     </div>
                  </div>
                  <h3 className="text-sm md:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {pick.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" /> {pick.location}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* === JAPPA NOW (LINK UPDATE KE /JAPPA) === */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">Jappa Now</h2>
            </div>
            
            <div className="flex flex-col space-y-6">
              {jappaNowItems.map((item) => (
                
                // PERHATIKAN: Link ini sekarang mengarah ke /jappa/...
                <Link href={`/jappanow/${item.id}`} key={item.id} className="flex items-start gap-4 group cursor-pointer bg-white p-3 rounded-2xl hover:shadow-md transition-shadow md:bg-transparent md:p-0 md:hover:shadow-none">
                  
                  {/* Gambar */}
                  <div className="relative w-32 h-24 md:w-52 md:h-36 bg-gray-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                     <Image
                       src={item.image}
                       alt={item.title}
                       fill
                       className="object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                  </div>

                  {/* Teks */}
                  <div className="flex-1 py-1">
                    <h3 className="font-bold text-gray-900 text-base md:text-xl mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-none">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      <BottomNavBar />
    </>
  );
}