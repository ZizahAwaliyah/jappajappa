"use client";

import { useState } from "react";
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
  Copy
} from "lucide-react";

// --- DATA DUMMY TIKET ---
const ticketsDatabase = [
  {
    id: 1,
    eventId: 1,
    title: "Konser Senja",
    category: "Konser",
    date: "25 Nov 2025",
    time: "17:00 WITA",
    location: "Pantai Losari, Makassar",
    gate: "Gate A",
    seat: "VIP - Row 1",
    bookingCode: "JAPPA-K8829",
    status: "active",
    userName: "Ahmad Jappa",
    image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    eventId: 5,
    title: "Pameran UMKM Sulsel",
    category: "Pameran",
    date: "20 Des 2025",
    time: "10:00 WITA",
    location: "Trans Studio Mall",
    gate: "Main Hall",
    seat: "Free Seating",
    bookingCode: "JAPPA-U9921",
    status: "active",
    userName: "Ahmad Jappa",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    eventId: 3,
    title: "Festival Coto (Tahun Lalu)",
    category: "Festival",
    date: "10 Jan 2024",
    time: "08:00 WITA",
    location: "Fort Rotterdam",
    gate: "Gate 2",
    seat: "-",
    bookingCode: "JAPPA-C1102",
    status: "completed",
    userName: "Ahmad Jappa",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = Number(params.id);
  const [isCopied, setIsCopied] = useState(false);

  // Cari tiket
  const ticket = ticketsDatabase.find((t) => t.id === ticketId);

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

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <Ticket className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Tiket Tidak Ditemukan</h2>
        <Link href="/myticket" className="mt-4 text-blue-600 font-bold hover:underline">Kembali</Link>
      </div>
    );
  }

  // QR Code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.bookingCode}`;

  return (
    <main className="min-h-screen bg-[#F4F7FE] pb-10">
      
      {/* === HEADER BERSIH (PUTIH) === */}
      <header className="bg-white px-4 py-4 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <Link href="/myticket" className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">E-Ticket</h1>
        <button className="p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      {/* === TICKET CARD === */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          
          {/* Bagian Atas: Gambar */}
          <div className="relative h-48 w-full">
            <Image
              src={ticket.image}
              alt={ticket.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider border border-white/30">
                {ticket.category}
              </span>
              <h2 className="text-2xl font-bold mt-2 leading-tight shadow-sm">{ticket.title}</h2>
            </div>
          </div>

          {/* Bagian Tengah: Info Detail */}
          <div className="p-6 space-y-6">
            
            {/* Status & Nama */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Nama Pemesan</p>
                <p className="font-bold text-gray-900 text-base">{ticket.userName}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                ticket.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {ticket.status === 'active' ? 'E-Ticket Aktif' : 'Sudah Digunakan'}
              </div>
            </div>

            {/* Waktu & Tempat */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                   <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Tanggal & Waktu</p>
                  <p className="font-medium text-gray-900 text-sm">{ticket.date} • {ticket.time}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                   <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Lokasi</p>
                  <p className="font-medium text-gray-900 text-sm">{ticket.location}</p>
                </div>
              </div>
            </div>

            {/* Gate & Seat */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold">Gate</p>
                <p className="text-lg font-bold text-gray-900">{ticket.gate}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold">Seat</p>
                <p className="text-lg font-bold text-gray-900">{ticket.seat}</p>
              </div>
            </div>

          </div>

          {/* --- Garis Putus (Tear Line) --- */}
          <div className="relative flex items-center justify-between bg-white">
             <div className="w-6 h-6 bg-[#F4F7FE] rounded-full -ml-3"></div>
             <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2"></div>
             <div className="w-6 h-6 bg-[#F4F7FE] rounded-full -mr-3"></div>
          </div>

          {/* Bagian Bawah: QR & Code */}
          <div className="p-8 flex flex-col items-center bg-white">
            <div className="p-3 border-2 border-gray-100 rounded-2xl mb-5">
              <Image 
                src={qrCodeUrl}
                alt="QR Code"
                width={160}
                height={160}
                className={ticket.status === 'completed' ? 'opacity-30 grayscale' : ''}
              />
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Kode Booking</p>
              <button 
                onClick={handleCopyCode}
                className="flex items-center gap-2 text-xl font-mono font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
              >
                {ticket.bookingCode}
                <Copy className="w-4 h-4" />
              </button>
              {isCopied && <p className="text-[10px] text-green-600 font-medium mt-1">Berhasil disalin!</p>}
            </div>
          </div>

        </div>

        {/* Tombol Download */}
        <button className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-transform active:scale-95 flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Download E-Ticket
        </button>

      </div>

    </main>
  );
}