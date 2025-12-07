"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { ChevronLeft, Calendar, MapPin, QrCode, Ticket } from "lucide-react";

// --- DATA DUMMY TIKET ---
const myTickets = [
  {
    id: 1,
    eventId: 1,
    title: "Konser Senja",
    date: "25 Nov 2025",
    time: "17:00 WITA",
    location: "Pantai Losari",
    quantity: 2,
    status: "active", // active, used, expired
    image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    eventId: 5,
    title: "Pameran UMKM Sulsel",
    date: "20 Des 2025",
    time: "10:00 WITA",
    location: "Trans Studio Mall",
    quantity: 1,
    status: "active",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    eventId: 3,
    title: "Festival Coto (Tahun Lalu)",
    date: "10 Jan 2024",
    time: "08:00 WITA",
    location: "Fort Rotterdam",
    quantity: 1,
    status: "completed",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function MyTicketPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Filter tiket berdasarkan tab yang dipilih
  const filteredTickets = myTickets.filter(ticket => 
    activeTab === 'active' 
      ? ticket.status === 'active' 
      : ticket.status === 'completed' || ticket.status === 'expired'
  );

  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      
      {/* === HEADER === */}
      <header className="bg-white shadow-sm sticky top-0 z-50 px-4 py-4 flex items-center">
        <Link href="/" className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900 ml-2">Tiket Saya</h1>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-6">
        
        {/* === TABS (Aktif / Riwayat) === */}
        <div className="flex p-1 bg-gray-200 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'active' 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'completed' 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Riwayat
          </button>
        </div>

        {/* === LIST TIKET === */}
        {filteredTickets.length === 0 ? (
          // Tampilan Kosong
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center">
            <Ticket className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
            <p className="text-sm">Tidak ada tiket di sini.</p>
            {activeTab === 'active' && (
              <Link href="/event" className="text-blue-600 text-xs font-bold mt-2 hover:underline">
                Cari Event Sekarang
              </Link>
            )}
          </div>
        ) : (
          // Tampilan Daftar Tiket
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              
              // --- LINK PEMBUNGKUS ---
              // Ini yang membuat seluruh kartu bisa diklik dan pindah halaman
              <Link 
                href={`/myticket/${ticket.id}`} 
                key={ticket.id}
                className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow cursor-pointer group"
              >
                
                {/* Bagian Gambar */}
                <div className="relative h-32 sm:h-auto sm:w-32 bg-gray-200">
                  <Image
                    src={ticket.image}
                    alt={ticket.title}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay Status untuk Tiket Selesai */}
                  {ticket.status === 'completed' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold border border-white px-2 py-1 rounded">SELESAI</span>
                    </div>
                  )}
                </div>

                {/* Bagian Detail Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {ticket.title}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1.5 text-blue-500" />
                        {ticket.date} • {ticket.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1.5 text-red-500" />
                        {ticket.location}
                      </div>
                    </div>
                  </div>

                  {/* Footer Card: Info Qty & Tombol */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {ticket.quantity} Tiket
                    </span>

                    {activeTab === 'active' && (
                      // Menggunakan div agar valid HTML (karena sudah di dalam Link <a>)
                      <div className="flex items-center gap-1 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
                        <QrCode className="w-3 h-3" />
                        Lihat E-Ticket
                      </div>
                    )}
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}