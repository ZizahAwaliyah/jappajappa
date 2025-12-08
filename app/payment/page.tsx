"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, CreditCard, CheckCircle, Loader2, Wallet, Building2, X } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [user, setUser] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const ticketData = {
    eventId: searchParams.get('eventId'),
    eventTitle: searchParams.get('eventTitle'),
    eventImage: searchParams.get('eventImage'),
    eventDate: searchParams.get('eventDate'),
    eventTime: searchParams.get('eventTime'),
    eventLocation: searchParams.get('eventLocation'),
    ticketName: searchParams.get('ticketName'),
    ticketPrice: Number(searchParams.get('ticketPrice')),
    quantity: Number(searchParams.get('quantity')),
  };

  const subTotal = ticketData.ticketPrice * ticketData.quantity;
  const serviceFee = 2000;
  const totalAmount = subTotal + serviceFee;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
       if (currentUser) setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    const bookingCode = "JAPPA-" + Math.random().toString(36).substr(2, 6).toUpperCase();

    try {
        await addDoc(collection(db, "tickets"), {
            ...ticketData,
            totalAmount: totalAmount,
            bookingCode: bookingCode,
            status: "active",
            userId: user ? user.uid : "guest_user",
            userName: user ? (user.displayName || user.email) : "Pengunjung",
            paymentMethod: paymentMethod,
            purchasedAt: serverTimestamp(),
            title: ticketData.eventTitle,
            date: ticketData.eventDate,
            time: ticketData.eventTime,
            location: ticketData.eventLocation,
            image: ticketData.eventImage,
            gate: "Gate A",
            seat: "Free Seating"
        });

        setTimeout(() => {
            setIsLoading(false);
            setShowSuccessModal(true);
        }, 2000);

    } catch (error) {
        console.error("Error transaction:", error);
        alert("Transaksi Gagal, silakan coba lagi.");
        setIsLoading(false);
    }
  };

  const handleCloseSuccess = () => {
      setShowSuccessModal(false);
      router.push("/myticket");
  };

  return (
    <>
      <main className="bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 min-h-screen pb-32">
        <header className="bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-4 flex items-center shadow-lg sticky top-0 z-50">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft className="w-6 h-6 text-white" /></button>
          <h1 className="text-lg font-bold ml-2 text-white">Rincian Pembayaran</h1>
        </header>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
           <section className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-md border-2 border-emerald-100">
              <h2 className="font-bold text-gray-900 mb-4 text-base">Item yang Dibeli</h2>
              <div className="flex gap-4 mb-4">
                  <div className="relative w-20 h-20 bg-linear-to-br from-emerald-100 to-teal-100 rounded-xl overflow-hidden shrink-0 shadow-md border-2 border-emerald-200">
                     {ticketData.eventImage ? <Image src={ticketData.eventImage} alt="Event" fill className="object-cover" /> : <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">{ticketData.eventTitle}</h3>
                     <p className="text-xs text-gray-600 mt-1.5 flex items-center truncate">{ticketData.eventDate} • {ticketData.eventTime}</p>
                     <p className="text-xs text-gray-600 mt-0.5 truncate">{ticketData.eventLocation}</p>
                  </div>
              </div>
              <div className="border-t-2 border-dashed border-emerald-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-700">{ticketData.ticketName} (x{ticketData.quantity})</span><span className="font-bold text-gray-900">Rp {subTotal.toLocaleString('id-ID')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-700">Biaya Layanan</span><span className="font-bold text-gray-900">Rp {serviceFee.toLocaleString('id-ID')}</span></div>
                  <div className="flex justify-between text-base font-bold pt-2 text-emerald-700 border-t-2 border-emerald-100 mt-2"><span>Total Pembayaran</span><span>Rp {totalAmount.toLocaleString('id-ID')}</span></div>
              </div>
           </section>

           <section className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-md border-2 border-emerald-100">
              <h2 className="font-bold text-gray-900 mb-4 text-base">Pilih Metode Pembayaran</h2>
              <div className="space-y-3">
                  <div onClick={() => setPaymentMethod('qris')} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-emerald-500 bg-linear-to-r from-emerald-50 to-teal-50 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300 bg-white'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">QRIS</p>
                          <p className="text-xs text-gray-600">Gopay, OVO, Dana, ShopeePay</p>
                        </div>
                      </div>
                      {paymentMethod === 'qris' && <CheckCircle className="w-6 h-6 text-emerald-600 fill-emerald-100" />}
                  </div>
                  <div onClick={() => setPaymentMethod('bank')} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-emerald-500 bg-linear-to-r from-emerald-50 to-teal-50 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300 bg-white'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Transfer Virtual Account</p>
                          <p className="text-xs text-gray-600">BCA, Mandiri, BNI, BRI</p>
                        </div>
                      </div>
                      {paymentMethod === 'bank' && <CheckCircle className="w-6 h-6 text-emerald-600 fill-emerald-100" />}
                  </div>
              </div>
           </section>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-4 border-t-2 border-emerald-200 shadow-[0_-8px_32px_rgba(16,185,129,0.15)] z-40">
           <div className="max-w-md mx-auto flex justify-between items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-0.5 font-medium">Total Tagihan</p>
                <p className="text-xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Rp {totalAmount.toLocaleString('id-ID')}</p>
              </div>
              <button onClick={handlePayment} disabled={isLoading} className="bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-200 active:scale-95">
                  {isLoading ? (<><Loader2 className="animate-spin w-5 h-5" /> Memproses...</>) : "Bayar Sekarang"}
              </button>
           </div>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center transform transition-all scale-100 border-2 border-emerald-200">
                <div className="w-20 h-20 bg-linear-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h3>
                <p className="text-sm text-gray-600 mb-6">Terima kasih, tiket Anda telah berhasil diterbitkan. Silakan cek halaman tiket saya.</p>
                <div className="border-t-2 border-emerald-100 pt-4">
                  <button onClick={handleCloseSuccess} className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md">
                    Lihat Tiket Saya
                  </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50"><Loader2 className="animate-spin w-12 h-12 text-emerald-600" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
