"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, MapPin, Calendar, Clock, Armchair, X, Minus, Plus, Loader2 } from "lucide-react";
import BottomNavBar from "../../components/Header";
import WishlistButton from "../../components/WishlistButton";
import { useAuth } from "../../context/AuthContext";
// IMPORT DARI LIB
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Data Dummy Fallback
const dummyEvent = {
    id: 1,
    headerTitle: "Konser",
    title: "Konser Senja",
    category: "Musik",
    description: "Nikmati alunan musik indie di kala senja.",
    longDescription: "Konser Senja menghadirkan musisi-musisi indie terbaik.",
    date: "Sabtu, 25 Nov 2025",
    time: "17:00 - 22:00 WITA",
    location: "Pantai Losari, Makassar",
    terms: ["Wajib vaksin booster.", "Tiket non-refundable."],
    tickets: [{ id: 101, name: "Regular", price: 75000 }, { id: 102, name: "VIP", price: 150000 }],
    image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop"
};

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { requireAuth } = useAuth();
  const [event, setEvent] = useState<any>(dummyEvent);
  const [loading, setLoading] = useState(true);

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
      // Fetch data dari Firebase berdasarkan ID
      const fetchEvent = async () => {
          if (!params.id) {
              setLoading(false);
              return;
          }
          try {
              const docSnap = await getDoc(doc(db, "events", params.id as string));
              if (docSnap.exists()) {
                  setEvent({ id: docSnap.id, ...docSnap.data() });
              }
          } catch (error) {
              console.error("Error fetching event:", error);
          }
          setLoading(false);
      };
      fetchEvent();
  }, [params.id]);

  const handleSelectTicket = (ticket: any) => {
      // Cek auth dulu sebelum buka modal pembelian
      requireAuth(() => {
          setSelectedTicket(ticket);
          setQuantity(1);
          setIsBuyModalOpen(true);
      });
  };
  
  const handleCheckout = () => {
      if (!selectedTicket) return;
      const query = new URLSearchParams({
          eventId: event.id.toString(),
          eventTitle: event.title,
          eventImage: event.image,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          ticketName: selectedTicket.name,
          ticketPrice: selectedTicket.price.toString(),
          quantity: quantity.toString()
      }).toString();
      router.push(`/payment?${query}`);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        <header className="bg-white shadow-sm sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
          <Link href="/event" className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center truncate mx-2">{event.headerTitle || event.title}</h1>
          <WishlistButton
            item={{
              id: event.id.toString(),
              title: event.title,
              location: event.location,
              image: event.image,
              addedAt: Date.now(),
              type: "event",
              date: event.date,
              price: event.tickets && event.tickets[0] ? `Rp ${event.tickets[0].price.toLocaleString('id-ID')}` : undefined
            }}
          />
        </header>

        <div className="max-w-screen-xl mx-auto md:px-8 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-6">
              <div className="relative w-full h-64 md:h-[400px] bg-gray-200 md:rounded-2xl overflow-hidden">
                <Image src={event.image} alt={event.title} fill className="object-cover" />
              </div>
              <div className="px-4 md:px-0 bg-white md:bg-transparent p-4 md:p-0">
                 <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{event.title}</h1>
                    <p className="text-lg font-bold text-gray-400 mb-2">{event.category}</p>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                 </div>
                 <div className="grid grid-cols-1 gap-4 mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center text-gray-700"><Calendar className="w-5 h-5 mr-3 text-blue-600" />{event.date}</div>
                    <div className="flex items-center text-gray-700"><Clock className="w-5 h-5 mr-3 text-blue-600" />{event.time}</div>
                    <div className="flex items-center text-gray-700"><MapPin className="w-5 h-5 mr-3 text-red-600" />{event.location}</div>
                 </div>
                 <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Pilih Tiket</h2>
                    <div className="space-y-4">
                       {event.tickets.map((ticket: any) => (
                          <div key={ticket.id} className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm bg-white hover:border-blue-300 transition-colors">
                             <div className="mb-3 md:mb-0">
                                <h4 className="font-bold text-gray-900 text-base">{ticket.name}</h4>
                                <div className="flex items-center text-xs text-gray-500 mt-1"><Armchair className="w-3 h-3 mr-1" /> Stok Tersedia</div>
                             </div>
                             <div className="flex items-center justify-between md:justify-end md:gap-4 w-full md:w-auto">
                                <span className="font-bold text-blue-600 text-base mr-4">Rp {ticket.price.toLocaleString('id-ID')}</span>
                                <button onClick={() => handleSelectTicket(ticket)} className="bg-[#A05398] hover:bg-[#8e4586] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-transform active:scale-95 shadow-md">Pilih</button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNavBar />

      {isBuyModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg">Atur Jumlah Tiket</h3><button onClick={() => setIsBuyModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button></div>
                <div className="p-6">
                    <div className="mb-6"><p className="text-sm text-gray-500 mb-1">Jenis Tiket</p><p className="font-bold text-lg text-gray-900">{selectedTicket.name}</p><p className="text-blue-600 font-bold">Rp {selectedTicket.price.toLocaleString('id-ID')}</p></div>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6"><span className="text-sm font-medium text-gray-700">Jumlah</span><div className="flex items-center gap-4"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50" disabled={quantity <= 1}><Minus className="w-4 h-4" /></button><span className="font-bold w-6 text-center">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"><Plus className="w-4 h-4" /></button></div></div>
                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100"><span className="text-gray-600">Total Bayar</span><span className="text-xl font-bold text-blue-700">Rp {(selectedTicket.price * quantity).toLocaleString('id-ID')}</span></div>
                    <button onClick={handleCheckout} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">Lanjut ke Pembayaran</button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}