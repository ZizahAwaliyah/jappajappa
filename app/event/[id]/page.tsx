"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, MapPin, Calendar, Clock, Armchair, X, Minus, Plus, Loader2, ExternalLink, Heart, Share2 } from "lucide-react";
import BottomNavBar from "../../components/Header";
import WishlistButtonDetail from "../../components/WishlistButtonDetail";
// IMPORT FIREBASE
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  // FETCH DATA DARI FIREBASE
  useEffect(() => {
      const fetchEvent = async () => {
          if (!params.id) return;
          try {
             const docSnap = await getDoc(doc(db, "events", params.id as string));
             if (docSnap.exists()) {
                 setEvent({ id: docSnap.id, ...docSnap.data() });
             }
          } catch (err) {
             console.error("Error fetching event:", err);
          } finally {
             setLoading(false);
          }
      };
      fetchEvent();
  }, [params.id]);

  const handleSelectTicket = (ticket: any) => {
    const role = localStorage.getItem("userRole");
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (!loggedIn) {
        router.push("/login"); 
        return;
    }

    if (role === 'eo' || role === 'admin') {
        alert("Partner/Admin tidak dapat membeli tiket.");
        return;
    }

    setSelectedTicket(ticket);
    setQuantity(1); 
    setIsBuyModalOpen(true);
  };
  
  const handleCheckout = () => {
      if (!selectedTicket || !event) return;
      
      const query = new URLSearchParams({
          eventId: event.id,
          eventTitle: event.title,
          eventImage: event.image,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          ticketName: selectedTicket.name || "General Admission", // Default jika nama tiket tidak ada
          ticketPrice: event.price.toString(), // Menggunakan harga dari event utama jika tiket spesifik tidak punya harga
          quantity: quantity.toString()
      }).toString();
      
      router.push(`/payment?${query}`);
  };

  const handleShareEvent = () => {
    const eventUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${event.id}`;
    const shareText = `Lihat event "${event.title}" di Jappa! ${eventUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: eventUrl,
      }).catch(err => console.log('Share error:', err));
    } else {
      // Fallback: copy ke clipboard
      navigator.clipboard.writeText(shareText);
      alert('Link event disalin ke clipboard!');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (!event) return <div className="h-screen flex items-center justify-center text-gray-500">Event tidak ditemukan.</div>;

  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        <header className="bg-white shadow-sm sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
          <Link href="/event" className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center truncate mx-2">{event.category}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareEvent}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Bagikan event"
            >
              <Share2 className="w-6 h-6" />
            </button>
            <WishlistButtonDetail
              itemId={event.id}
              itemType="event"
              itemData={{
                title: event.title,
                image: event.image,
                category: event.category,
                location: event.location,
                date: event.date,
                time: event.time,
                price: event.price
              }}
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto md:px-8 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-6">
              <div className="relative w-full h-64 md:h-[400px] bg-gray-200 md:rounded-2xl overflow-hidden">
                {event.image && <Image src={event.image} alt={event.title} fill className="object-cover" priority />}
              </div>
              <div className="px-4 md:px-0 bg-white md:bg-transparent p-4 md:p-0">
                 <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{event.title}</h1>
                    <p className="text-lg font-bold text-gray-400 mb-2">{event.category}</p>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-4 mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-blue-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700 group">
                      <div className="flex items-center flex-1">
                        <MapPin className="w-5 h-5 mr-3 text-red-600" />
                        <span className="flex-1">{event.location}</span>
                      </div>
                      {event.gmapsLink && (
                        <a
                          href={event.gmapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="hidden md:inline">Buka Maps</span>
                        </a>
                      )}
                    </div>
                 </div>

                 <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tiket</h2>
                    {/* Jika event punya sub-tiket (tickets array), map di sini. Jika tidak, tampilkan satu opsi umum */}
                    <div className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm bg-white hover:border-blue-300 transition-colors">
                        <div className="mb-3 md:mb-0">
                            <h4 className="font-bold text-gray-900 text-base">General Admission</h4>
                            <div className="flex items-center text-xs text-gray-500 mt-1"><Armchair className="w-3 h-3 mr-1" /> Stok: {event.stock}</div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end md:gap-4 w-full md:w-auto">
                            <span className="font-bold text-blue-600 text-base mr-4">Rp {Number(event.price).toLocaleString('id-ID')}</span>
                            <button 
                                onClick={() => handleSelectTicket({ name: "General Admission", price: event.price })} 
                                className="bg-[#A05398] hover:bg-[#8e4586] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-transform active:scale-95 shadow-md"
                            >
                                Beli Tiket
                            </button>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Kolom Kanan: Info Tambahan */}
             <div className="md:col-span-5 space-y-6 px-4 md:px-0">
               {/* Tentang Penyelenggara */}
               <div className="bg-white md:rounded-2xl md:shadow-sm md:p-6 md:border md:border-gray-100">
                  <h3 className="font-bold text-lg mb-3">Tentang Penyelenggara</h3>
                  <p className="text-sm text-gray-600 mb-4">Event ini diselenggarakan oleh <strong>{event.organizerName || "Partner Jappa"}</strong>.</p>
                  <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
                     ⚠️ Pastikan Anda membaca syarat dan ketentuan sebelum membeli tiket.
                  </div>
               </div>

               {/* Syarat dan Ketentuan */}
               {event.terms && (
                 <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <span className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">📋</span>
                      Syarat dan Ketentuan
                    </h3>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {event.terms}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Informasi Kontak:</strong> Untuk pertanyaan lebih lanjut, hubungi penyelenggara melalui email atau WhatsApp.
                      </p>
                    </div>
                 </div>
               )}
            </div>

          </div>
        </div>
      </main>
      <BottomNavBar />

      {/* MODAL BELI */}
      {isBuyModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg">Atur Jumlah Tiket</h3><button onClick={() => setIsBuyModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button></div>
                <div className="p-6">
                    <div className="mb-6"><p className="text-sm text-gray-500 mb-1">Tiket</p><p className="font-bold text-lg text-gray-900">{selectedTicket.name}</p><p className="text-blue-600 font-bold">Rp {Number(selectedTicket.price).toLocaleString('id-ID')}</p></div>
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