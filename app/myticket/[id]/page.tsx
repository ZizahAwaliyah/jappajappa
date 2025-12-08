"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  Share2,
  Download,
  Ticket,
  Copy,
  Loader2
} from "lucide-react";

interface TicketData {
  id: string;
  eventId: string;
  title: string;
  category?: string;
  date: string;
  time: string;
  location: string;
  gate: string;
  seat: string;
  bookingCode: string;
  status: string;
  userName: string;
  image: string;
  quantity: number;
  ticketName?: string;
  totalAmount?: number;
  purchasedAt: string;
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [isCopied, setIsCopied] = useState(false);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ticket data
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tickets/${ticketId}`);
        const data = await response.json();

        if (response.ok) {
          setTicket(data.ticket);
        } else {
          setError(data.error || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Failed to fetch ticket");
      } finally {
        setIsLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  // Fungsi Copy Code yang aman
  const handleCopyCode = () => {
    if (ticket) {
      const textArea = document.createElement("textarea");
      textArea.value = ticket.bookingCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Gagal menyalin', err);
      }
      document.body.removeChild(textArea);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 p-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
        <p className="text-sm text-emerald-700">Memuat tiket...</p>
      </div>
    );
  }

  // Error or not found
  if (error || !ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 p-4 text-center">
        <div className="bg-linear-to-br from-rose-100 to-orange-100 p-4 rounded-full mb-4">
          <Ticket className="w-16 h-16 text-rose-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Tiket Tidak Ditemukan</h2>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
        <Link href="/myticket" className="mt-4 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all">Kembali</Link>
      </div>
    );
  }

  // QR Code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.bookingCode}`;

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 pb-10">

      {/* === HEADER === */}
      <header className="bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-4 sticky top-0 z-50 shadow-lg flex items-center justify-between">
        <Link href="/myticket" className="p-2 -ml-2 text-white hover:bg-white/20 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-white">E-Ticket</h1>
        <button className="p-2 -mr-2 text-white hover:bg-white/20 rounded-full transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      {/* === TICKET CARD === */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-200">

          {/* Bagian Atas: Gambar */}
          <div className="relative h-48 w-full">
            <Image
              src={ticket.image}
              alt={ticket.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              {ticket.category && (
                <span className="bg-emerald-500/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/50">
                  {ticket.category}
                </span>
              )}
              <h2 className="text-2xl font-bold mt-2 leading-tight drop-shadow-lg">{ticket.title}</h2>
            </div>
          </div>

          {/* Bagian Tengah: Info Detail */}
          <div className="p-6 space-y-6 bg-linear-to-b from-white to-emerald-50/30">

            {/* Status & Nama */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Nama Pemesan</p>
                <p className="font-bold text-gray-900 text-base">{ticket.userName}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${
                ticket.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}>
                {ticket.status === 'active' ? 'E-Ticket Aktif' : 'Sudah Digunakan'}
              </div>
            </div>

            {/* Waktu & Tempat */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-sky-50/50 p-3 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-sky-400 to-blue-500 flex items-center justify-center shrink-0 shadow-md">
                   <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5 font-medium">Tanggal & Waktu</p>
                  <p className="font-bold text-gray-900 text-sm">{ticket.date} • {ticket.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-rose-50/50 p-3 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-rose-400 to-pink-500 flex items-center justify-center shrink-0 shadow-md">
                   <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5 font-medium">Lokasi</p>
                  <p className="font-bold text-gray-900 text-sm">{ticket.location}</p>
                </div>
              </div>
            </div>

            {/* Gate & Seat */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center border-2 border-amber-200 shadow-sm">
                <p className="text-xs text-amber-700 uppercase font-bold mb-1">Gate</p>
                <p className="text-xl font-bold text-amber-900">{ticket.gate}</p>
              </div>
              <div className="bg-linear-to-br from-violet-50 to-purple-50 rounded-xl p-4 text-center border-2 border-violet-200 shadow-sm">
                <p className="text-xs text-violet-700 uppercase font-bold mb-1">Seat</p>
                <p className="text-xl font-bold text-violet-900">{ticket.seat}</p>
              </div>
            </div>

            {/* Ticket Type & Quantity */}
            {ticket.ticketName && (
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200">
                <p className="text-xs text-emerald-700 mb-1 font-bold">Tipe Tiket</p>
                <p className="font-bold text-gray-900">{ticket.ticketName} × {ticket.quantity}</p>
              </div>
            )}

          </div>

          {/* --- Garis Putus (Tear Line) --- */}
          <div className="relative flex items-center justify-between bg-white">
             <div className="w-6 h-6 bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 rounded-full -ml-3"></div>
             <div className="flex-1 border-t-2 border-dashed border-emerald-200 mx-2"></div>
             <div className="w-6 h-6 bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 rounded-full -mr-3"></div>
          </div>

          {/* Bagian Bawah: QR & Code */}
          <div className="p-8 flex flex-col items-center bg-linear-to-b from-white to-emerald-50/30">
            <div className="p-4 border-2 border-emerald-200 rounded-2xl mb-5 bg-white shadow-lg">
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                width={160}
                height={160}
                className={ticket.status === 'completed' ? 'opacity-30 grayscale' : ''}
              />
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2 font-medium">Kode Booking</p>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 text-xl font-mono font-bold text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all border-2 border-emerald-200 bg-white"
              >
                {ticket.bookingCode}
                <Copy className="w-4 h-4" />
              </button>
              {isCopied && <p className="text-xs text-emerald-600 font-bold mt-2 bg-emerald-100 px-3 py-1 rounded-full inline-block">Berhasil disalin!</p>}
            </div>
          </div>

        </div>

        {/* Tombol Download */}
        <button className="w-full mt-8 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-600 transition-all active:scale-95 flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Download E-Ticket
        </button>

      </div>

    </main>
  );
}
