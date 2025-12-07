'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Clock, X, PlusCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import ProfileDropdown from "../../components/ProfileDropdown";

// FIREBASE IMPORTS
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// --- TIPE DATA ---
type TabType = 'Actual' | 'Waiting For Approval';
type CategoryType = 'Semua' | 'Konser' | 'Festival' | 'Pameran';

interface EventData {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  category: string;
  image?: string;
  date?: string;
  time?: string;
  createdBy?: string;
  organizerName?: string;
}

export default function EventOrganizerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Actual');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Semua');

  // State untuk data real-time dari Firebase
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Cek autentikasi dan ambil user
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/login?role=eo');
      }
    });

    return () => unsubAuth();
  }, [router]);

  // Proteksi: Redirect jika bukan EO atau belum login
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (!isLoggedIn || userRole !== 'eo') {
        router.push('/login?role=eo');
      }
    }
  }, [router]);

  // Fetch data event real-time dari Firestore (hanya event milik EO yang login)
  useEffect(() => {
    if (!currentUser) return;

    // Query event yang dibuat oleh EO yang sedang login
    // Tidak menggunakan orderBy untuk menghindari composite index requirement
    const q = query(
      collection(db, "events"),
      where("createdBy", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EventData));

      // Sort manual di client-side berdasarkan createdAt
      const sortedData = data.sort((a: any, b: any) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime; // Descending (terbaru dulu)
      });

      setEventsData(sortedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Filter Logic
  const filteredEvents = eventsData.filter(event => {
    const matchTab = event.status === activeTab;
    const matchSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || event.category === selectedCategory;
    return matchTab && matchSearch && matchCategory;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-orange-600 mx-auto mb-4" size={40} />
          <p className="text-gray-500 text-sm">Memuat event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans" onClick={() => setIsFilterOpen(false)}>

      {/* === NAVBAR EO === */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 px-8 py-5 flex items-center justify-between border-b border-gray-100">

        {/* Kiri: Logo & Tab Menu */}
        <div className="flex items-center gap-10">
            <Link href="/" className="text-2xl font-bold text-orange-600">Jappa.</Link>

            {/* Tab Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {['Actual', 'Waiting For Approval'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabType)}
                  className={`text-sm font-bold transition-colors whitespace-nowrap pb-1 border-b-2 ${
                    activeTab === tab
                      ? 'text-orange-600 border-orange-600'
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
        </div>

        {/* Kanan: Search, Filter, Buat Event, Profile */}
        <div className="flex items-center gap-4">

            {/* Search Bar */}
            <div className="relative hidden md:block w-48 lg:w-64">
                <input
                    type="text"
                    placeholder="Cari event..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 text-xs focus:outline-none focus:border-orange-500 transition-colors bg-gray-50"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div>

            {/* Filter Button */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 rounded-full transition-colors ${isFilterOpen || selectedCategory !== 'Semua' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <Filter size={20} />
                </button>
                {/* Filter Dropdown */}
                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-30 py-2 animate-in fade-in zoom-in-95">
                        <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase">Kategori</span>
                            {selectedCategory !== 'Semua' && <button onClick={() => setSelectedCategory('Semua')} className="text-xs text-orange-600 hover:underline">Reset</button>}
                        </div>
                        {(['Konser', 'Festival', 'Pameran'] as CategoryType[]).map((category) => (
                            <button key={category} onClick={() => { setSelectedCategory(selectedCategory === category ? 'Semua' : category); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedCategory === category ? 'text-orange-600 bg-orange-50' : 'text-gray-700'}`}>
                                {category}
                                {selectedCategory === category && <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Tombol Buat Event */}
            <Link href="/event-organizer/create" className="hidden sm:flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm">
                <PlusCircle className="w-4 h-4" /> Buat Event
            </Link>

            {/* Dropdown Profile */}
            <ProfileDropdown />
        </div>
      </nav>

      {/* === CONTENT GRID === */}
      <main className="px-8 py-8 bg-gray-50 min-h-[calc(100vh-80px)]">
        {/* Header Dashboard */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Event Organizer</h1>
          <p className="text-sm text-gray-500">Kelola semua event Anda di sini</p>
        </div>

        {selectedCategory !== 'Semua' && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm text-orange-600">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('Semua')} className="hover:text-red-500"><X size={14} /></button>
            </span>
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="text-center py-32 text-gray-400 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-200/50 rounded-full flex items-center justify-center mb-4"><Search className="text-gray-400 w-8 h-8" /></div>
            <p className="font-medium text-gray-500">Tidak ada event ditemukan di tab ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-komponen Event Card
const EventCard = ({ event }: { event: EventData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col h-full group">
      {/* Gambar Event */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/checkered-light-emboss.png')]"></div>
        )}

        {/* Badge Kategori */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wider shadow-sm border border-gray-100">
          {event.category}
        </div>
      </div>

      {/* Konten Card */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-base group-hover:text-orange-600 transition-colors">
          {event.title}
        </h3>

        {event.status === 'Waiting For Approval' && (
          <p className="text-xs text-orange-600 font-medium mb-2 flex items-center gap-1.5 bg-orange-50 w-fit px-2 py-1 rounded-md">
            <Clock size={12}/> Menunggu Persetujuan
          </p>
        )}

        <div className="flex-grow"></div>

        {/* Footer Info */}
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-500">
            <span className="truncate">{event.location}</span>
          </div>

          {event.date && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>{event.date} {event.time && `• ${event.time}`}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
            <span className="text-xs font-bold text-orange-600">
              {event.price === 0 ? 'Gratis' : `Rp ${event.price.toLocaleString('id-ID')}`}
            </span>
            <span className="text-xs text-gray-400">
              {event.status === 'Actual' ? '✓ Published' : '⏳ Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};