"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Untuk navigasi kembali
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Armchair, 
  ThumbsUp, 
  Link as LinkIcon, 
  Instagram, 
  MessageCircle 
} from "lucide-react";
import BottomNavBar from "../../components/Header"; // Sesuaikan path import

export default function EventDetailPage() {
  // State untuk "Read More"
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);

  // Data Dummy Event (Sesuai Wireframe)
  const event = {
    title: "Lorem Ipsum – Judul Event",
    category: "Pameran", // Sub-judul
    headerTitle: "Konser", // Judul di Header Atas
    description: "Lorem ipsum awenhwhfhfquhfuqbfiuuqwbfpqwufpqh...", // Deskripsi pendek
    longDescription: `Makassar Prime Expo adalah pameran skala nasional yang diselenggarakan untuk mempromosikan dan memperluas pasar produk-produk unggulan daerah di berbagai daerah di Indonesia, serta untuk mendorong inisiatif kreatif anak muda dalam berkarya.`,
    terms: [
      "Wajib membawa kartu identitas.",
      "Dilarang membawa makanan dan minuman dari luar.",
      "Tiket yang sudah dibeli tidak dapat dikembalikan.",
      "Penyelenggara berhak menolak pengunjung yang tidak mematuhi aturan.",
    ],
    date: "Sabtu, 25 Oktober 2025",
    time: "10:00 - 22:00 WITA",
    location: "Celebes Convention Center, Makassar",
    tickets: [
      { id: 1, name: "Flames | 21:30 | Studio 4", price: "Rp 40.000", available: true },
      { id: 2, name: "The Tiger | 20:00 | Studio 5", price: "Rp 40.000", available: true },
    ]
  };

  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        
        {/* === HEADER (Sticky Top) === */}
        <header className="bg-white shadow-sm sticky top-0 z-50 px-4 py-4 flex items-center justify-between md:justify-start md:space-x-4">
          <Link href="/event" className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center md:text-left md:flex-none">
            {event.headerTitle}
          </h1>
          {/* Spacer kosong agar judul di tengah pada mobile */}
          <div className="w-8 md:hidden"></div>
        </header>

        {/* === KONTEN UTAMA === */}
        <div className="max-w-screen-xl mx-auto md:px-8 md:py-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* --- KOLOM KIRI (Gambar, Info Dasar, Tiket) --- */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Hero Image */}
              <div className="relative w-full h-64 md:h-[400px] bg-gray-200 md:rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
                  alt="Event Cover"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info Dasar & Tiket Container */}
              <div className="px-4 md:px-0 bg-white md:bg-transparent p-4 md:p-0">
                
                {/* Judul & Deskripsi Singkat */}
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {event.title}
                  </h1>
                  <p className="text-lg font-bold text-gray-400 mb-2">
                    {event.category}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Date, Time, Location Grid */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Date</h3>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Time</h3>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </div>

                {/* Section TICKETS */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">TICKETS</h2>
                  <div className="space-y-4">
                    {event.tickets.map((ticket) => (
                      <div key={ticket.id} className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm bg-white">
                        <div className="mb-3 md:mb-0">
                          <h4 className="font-bold text-gray-900 text-sm">{ticket.name}</h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Armchair className="w-3 h-3 mr-1" />
                            Seat Selection Available
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end md:gap-4">
                          <span className="font-bold text-gray-900 text-sm">{ticket.price}</span>
                          <button className="bg-[#A05398] hover:bg-[#8e4586] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-md">
                            Select Ticket
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* --- KOLOM KANAN (About, Terms, Share) --- */}
            <div className="md:col-span-5 space-y-6 px-4 md:px-0">
              
              {/* Card Container untuk Desktop */}
              <div className="bg-white md:rounded-2xl md:shadow-sm md:p-6 md:border md:border-gray-100">
                
                {/* ABOUT THIS EVENT */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">ABOUT THIS EVENT</h2>
                  <p className={`text-gray-600 text-sm leading-relaxed ${!isAboutExpanded ? 'line-clamp-3' : ''}`}>
                    {event.longDescription}
                  </p>
                  <button 
                    onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                    className="text-gray-400 font-bold text-xs mt-2 hover:text-gray-600"
                  >
                    {isAboutExpanded ? "Read less" : "Read more"}
                  </button>
                </div>

                {/* TERMS & CONDITIONS */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">TERMS & CONDITIONS</h2>
                  <p className="text-sm text-gray-600 mb-2">Syarat dan Ketentuan</p>
                  <ul className={`list-disc list-inside text-sm text-gray-600 space-y-1 ${!isTermsExpanded ? 'h-20 overflow-hidden' : ''}`}>
                    {event.terms.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setIsTermsExpanded(!isTermsExpanded)}
                    className="text-gray-400 font-bold text-xs mt-2 hover:text-gray-600"
                  >
                    {isTermsExpanded ? "Read less" : "Read more"}
                  </button>
                </div>

                {/* LIKE BUTTON */}
                <div className="flex justify-center mb-8">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ThumbsUp className="w-4 h-4 mr-2 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">12</span>
                  </button>
                </div>

                {/* BAGIKAN SECTION */}
                <div className="border border-gray-200 rounded-2xl p-4 text-center bg-white shadow-sm">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Bagikan</h3>
                  <div className="flex justify-center items-center gap-8">
                    
                    {/* WhatsApp */}
                    <button className="flex flex-col items-center group">
                      <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-6 h-6" /> 
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">Whatsapp</span>
                      {/* Note: Icon Lucide MessageCircle mirip WA. Untuk persis WA butuh SVG custom */}
                    </button>

                    {/* Instagram */}
                    <button className="flex flex-col items-center group">
                       {/* Gradient Instagram */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                        <Instagram className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">Instagram</span>
                    </button>

                    {/* Copy Link */}
                    <button className="flex flex-col items-center group">
                      <div className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-700 shadow-sm group-hover:bg-gray-50 transition-colors">
                        <LinkIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">Copy Link</span>
                    </button>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Bottom Nav tetap muncul di Mobile */}
      <BottomNavBar />
    </>
  );
}