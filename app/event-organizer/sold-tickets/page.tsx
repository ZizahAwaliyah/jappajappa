"use client";

import React, { useState, useEffect } from 'react';
import { db } from "@/lib/firebase"; 
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"; // Nanti tambahkan 'where' jika sudah ada auth
import Link from 'next/link';
import { ArrowLeft, Ticket, DollarSign, Calendar, User, Search, Download, Loader2 } from 'lucide-react';
import ProfileDropdown from "../../components/ProfileDropdown";

export default function EOSoldTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [summary, setSummary] = useState({ totalRevenue: 0, totalTicketsSold: 0, totalTransactions: 0 });

  useEffect(() => {
    // Di aplikasi nyata, tambahkan: where("eoId", "==", currentUser.uid)
    const q = query(collection(db, "tickets"), orderBy("purchasedAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        let formattedDate = "-";
        if (d.purchasedAt) {
             formattedDate = d.purchasedAt.toDate().toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
             });
        }
        return { id: doc.id, ...d, formattedDate };
      });

      setTickets(data);
      
      const totalRev = data.reduce((acc, curr: any) => acc + (curr.totalAmount || 0), 0);
      const totalQty = data.reduce((acc, curr: any) => acc + (curr.quantity || 0), 0);
      
      setSummary({
        totalRevenue: totalRev,
        totalTicketsSold: totalQty,
        totalTransactions: data.length
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTickets = tickets.filter(ticket => 
    (ticket.bookingCode?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (ticket.eventTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (ticket.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      <nav className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/event-organizer/dashboard" className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
             <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Laporan Penjualan (EO)</h1>
        </div>
        <ProfileDropdown />
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600"><DollarSign className="w-6 h-6" /></div>
                <div><p className="text-sm text-gray-500 font-medium">Total Pendapatan</p><p className="text-2xl font-bold text-gray-900">Rp {summary.totalRevenue.toLocaleString('id-ID')}</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Ticket className="w-6 h-6" /></div>
                <div><p className="text-sm text-gray-500 font-medium">Tiket Terjual</p><p className="text-2xl font-bold text-gray-900">{summary.totalTicketsSold} <span className="text-sm font-normal text-gray-400">lembar</span></p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><User className="w-6 h-6" /></div>
                <div><p className="text-sm text-gray-500 font-medium">Total Transaksi</p><p className="text-2xl font-bold text-gray-900">{summary.totalTransactions} <span className="text-sm font-normal text-gray-400">orang</span></p></div>
            </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
                <input type="text" placeholder="Cari Kode Booking, Event..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"><Download className="w-4 h-4" /> Export CSV</button>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kode Booking</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Event</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Pembeli</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tanggal</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Qty</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTickets.length === 0 ? (
                             <tr><td colSpan={7} className="text-center py-10 text-gray-500">Belum ada penjualan tiket.</td></tr>
                        ) : (
                            filteredTickets.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4"><span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs">{t.bookingCode}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900 block">{t.eventTitle}</span></td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{t.userName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500"><div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {t.formattedDate}</div></td>
                                    <td className="px-6 py-4 text-center text-sm font-bold text-gray-900">{t.quantity}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-green-600">Rp {t.totalAmount?.toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 text-center"><span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">PAID</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}