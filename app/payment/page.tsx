"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, CreditCard, CheckCircle, Loader2, Wallet, Building2, X } from "lucide-react";
import { db, auth } from "@/lib/firebase"; // IMPORT DARI LIB
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
      <main className="bg-[#F4F7FE] min-h-screen pb-32">
        <header className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-50">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="w-6 h-6 text-gray-700" /></button>
          <h1 className="text-lg font-bold ml-2 text-gray-900">Rincian Pembayaran</h1>
        </header>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
           <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4 text-base">Item yang Dibeli</h2>
              <div className="flex gap-4 mb-4">
                  <div className="relative w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                     {ticketData.eventImage ? <Image src={ticketData.eventImage} alt="Event" fill className="object-cover" /> : <div className="w-full h-full bg-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">{ticketData.eventTitle}</h3>
                     <p className="text-xs text-gray-500 mt-1.5 flex items-center truncate">{ticketData.eventDate} • {ticketData.eventTime}</p>
                     <p className="text-xs text-gray-500 mt-0.5 truncate">{ticketData.eventLocation}</p>
                  </div>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">{ticketData.ticketName} (x{ticketData.quantity})</span><span className="font-medium text-gray-900">Rp {subTotal.toLocaleString('id-ID')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Biaya Layanan</span><span className="font-medium text-gray-900">Rp {serviceFee.toLocaleString('id-ID')}</span></div>
                  <div className="flex justify-between text-base font-bold pt-2 text-blue-600 border-t border-gray-100 mt-2"><span>Total Pembayaran</span><span>Rp {totalAmount.toLocaleString('id-ID')}</span></div>
              </div>
           </section>

           <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4 text-base">Pilih Metode Pembayaran</h2>
              <div className="space-y-3">
                  <div onClick={() => setPaymentMethod('qris')} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                      <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100"><Wallet className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm font-bold text-gray-900">QRIS</p><p className="text-xs text-gray-500">Gopay, OVO, Dana, ShopeePay</p></div></div>
                      {paymentMethod === 'qris' && <CheckCircle className="w-5 h-5 text-blue-600 fill-blue-100" />}
                  </div>
                  <div onClick={() => setPaymentMethod('bank')} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                      <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100"><Building2 className="w-5 h-5 text-gray-600" /></div><div><p className="text-sm font-bold text-gray-900">Transfer Virtual Account</p><p className="text-xs text-gray-500">BCA, Mandiri, BNI, BRI</p></div></div>
                      {paymentMethod === 'bank' && <CheckCircle className="w-5 h-5 text-blue-600 fill-blue-100" />}
                  </div>
              </div>
           </section>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
           <div className="max-w-md mx-auto flex justify-between items-center gap-4">
              <div className="flex-1"><p className="text-xs text-gray-500 mb-0.5">Total Tagihan</p><p className="text-xl font-bold text-blue-700">Rp {totalAmount.toLocaleString('id-ID')}</p></div>
              <button onClick={handlePayment} disabled={isLoading} className="bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95">
                  {isLoading ? (<><Loader2 className="animate-spin w-5 h-5" /> Memproses...</>) : "Bayar Sekarang"}
              </button>
           </div>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center transform transition-all scale-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h3>
                <p className="text-sm text-gray-500 mb-6">Terima kasih, tiket Anda telah berhasil diterbitkan. Silakan cek halaman tiket saya.</p>
                <div className="border-t border-gray-100 pt-4"><button onClick={handleCloseSuccess} className="w-full text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">Tutup</button></div>
            </div>
        </div>
      )}
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}