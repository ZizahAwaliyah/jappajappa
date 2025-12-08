"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, MapPin, QrCode, Ticket, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface TicketData {
  id: string;
  eventId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  quantity: number;
  status: string;
  image: string;
  bookingCode: string;
  purchasedAt: string;
}

export default function MyTicketPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTickets(currentUser.uid);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch tickets from API
  const fetchTickets = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tickets?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setTickets(data.tickets || []);
      } else {
        console.error("Error fetching tickets:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tiket berdasarkan tab yang dipilih
  const filteredTickets = tickets.filter(ticket =>
    activeTab === 'active'
      ? ticket.status === 'active'
      : ticket.status === 'completed' || ticket.status === 'expired'
  );

  return (
    <main className="bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 min-h-screen pb-10">

      {/* === HEADER === */}
      <header className="bg-linear-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50 px-4 py-4 flex items-center">
        <Link href="/" className="p-2 -ml-2 text-white hover:bg-white/20 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-white ml-2">Tiket Saya</h1>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-6">

        {/* === TABS (Aktif / Riwayat) === */}
        <div className="flex p-1 bg-white/60 backdrop-blur-sm rounded-2xl mb-6 shadow-md">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'active'
                ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200"
                : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'completed'
                ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200"
                : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            Riwayat
          </button>
        </div>

        {/* === LOADING STATE === */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-sm text-emerald-700">Memuat tiket...</p>
          </div>
        ) : !user ? (
          // User belum login
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8">
            <div className="bg-linear-to-br from-emerald-100 to-teal-100 p-4 rounded-full mb-4">
              <Ticket className="w-12 h-12 text-emerald-600" />
            </div>
            <p className="text-sm mb-2 text-gray-700">Silakan login terlebih dahulu</p>
            <Link href="/login" className="bg-linear-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all">
              Login Sekarang
            </Link>
          </div>
        ) : filteredTickets.length === 0 ? (
          // Tampilan Kosong
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8">
            <div className="bg-linear-to-br from-amber-100 to-orange-100 p-4 rounded-full mb-4">
              <Ticket className="w-12 h-12 text-amber-600" />
            </div>
            <p className="text-sm text-gray-700 mb-4">Tidak ada tiket di sini.</p>
            {activeTab === 'active' && (
              <Link href="/event" className="bg-linear-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all">
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
                className="block bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border-2 border-emerald-100 overflow-hidden flex flex-col sm:flex-row hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group"
              >

                {/* Bagian Gambar */}
                <div className="relative h-32 sm:h-auto sm:w-32 bg-linear-to-br from-emerald-100 to-teal-100">
                  <Image
                    src={ticket.image}
                    alt={ticket.title}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay Status untuk Tiket Selesai */}
                  {ticket.status === 'completed' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold border-2 border-white px-3 py-1 rounded-full bg-gray-800/50">SELESAI</span>
                    </div>
                  )}
                </div>

                {/* Bagian Detail Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {ticket.title}
                    </h3>

                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="w-3 h-3 mr-1.5 text-sky-500" />
                        {ticket.date} • {ticket.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-1.5 text-rose-500" />
                        {ticket.location}
                      </div>
                    </div>
                  </div>

                  {/* Footer Card: Info Qty & Tombol */}
                  <div className="mt-4 pt-3 border-t-2 border-emerald-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
                      {ticket.quantity} Tiket
                    </span>

                    {activeTab === 'active' && (
                      // Menggunakan div agar valid HTML (karena sudah di dalam Link <a>)
                      <div className="flex items-center gap-1 bg-linear-to-r from-emerald-500 to-teal-500 group-hover:from-emerald-600 group-hover:to-teal-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-md">
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
