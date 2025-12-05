'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Link from 'next/link';

// --- KOMPONEN IKON ---
const SearchIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const FilterIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const UserIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
);
const Loader2 = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
// Ikon Link External untuk Portofolio
const ExternalLink = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
);

// --- KONFIGURASI FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCTxUxarVP6NsKT74FDyDFkC1irsb8Ny5Y",
  authDomain: "jappajappa-47796.firebaseapp.com",
  projectId: "jappajappa-47796",
  storageBucket: "jappajappa-47796.firebasestorage.app",
  messagingSenderId: "551636996244",
  appId: "1:551636996244:web:6d3f99a81942036e932481",
  measurementId: "G-YTXMC8DM02"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Tipe Data EO diperbarui dengan field phone & portfolio
interface EOUser {
  id: string;
  name: string;
  email: string;
  ktp: string;
  phone: string;      // Tambahan
  portfolio: string;  // Tambahan
  status: string;
  imageUrl?: string; 
}

interface EventData {
  id: string;
  title: string;
  eoName: string;
  location: string;
  price: number;
  category: string;
  status: string;
  image?: string;
}

interface WisataData {
  id: string;
  title: string;
  location: string;
  category: string;
  image?: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'Wisata' | 'Jappa Now' | 'Waiting For Approve' | 'EO'>('Waiting For Approve');
  
  const [pendingUsers, setPendingUsers] = useState<EOUser[]>([]);
  const [pendingEvents, setPendingEvents] = useState<EventData[]>([]);
  const [wisataList, setWisataList] = useState<WisataData[]>([]); 
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 1. LISTEN DATA EO (PENDING)
  useEffect(() => {
    // Query ini akan otomatis mendeteksi data baru dari eo-register
    const q = query(collection(db, "users"), where("role", "==", "eo"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EOUser)));
    });
    return () => unsubscribe();
  }, []);

  // 2. LISTEN DATA EVENT (WAITING)
  useEffect(() => {
    const q = query(collection(db, "events"), where("status", "==", "waiting"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData)));
      setLoading(false);
    }, (error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. LISTEN DATA WISATA
  useEffect(() => {
    const q = query(collection(db, "wisata"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWisataList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WisataData)));
    }, (error) => {
        console.error("Error fetching wisata:", error);
    });
    return () => unsubscribe();
  }, []);

  // Actions
  const handleApproveUser = async (id: string) => {
    if (confirm("Setujui EO ini agar bisa login?")) {
        await updateDoc(doc(db, "users", id), { status: "approved" });
    }
  };
  const handleDeclineUser = async (id: string) => {
    if (confirm("Tolak pendaftaran EO ini?")) {
        await deleteDoc(doc(db, "users", id));
    }
  };
  const handleApproveEvent = async (id: string) => {
    if (confirm("Publish Event ini?")) {
        await updateDoc(doc(db, "events", id), { status: "actual" });
    }
  };
  const handleDeclineEvent = async (id: string) => {
    if (confirm("Reject Event ini?")) {
        await updateDoc(doc(db, "events", id), { status: "rejected" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-gray-400" /></div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900" onClick={() => setIsProfileOpen(false)}>
      
      {/* === HEADER NAVBAR === */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white sticky top-0 z-50">
        
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-bold text-red-600 tracking-tight">Jappa.</h1>
          
          <div className="hidden md:flex gap-8 text-sm font-bold">
            {['Wisata', 'Jappa Now', 'Waiting For Approve', 'EO'].map((menu) => (
              <button
                key={menu}
                onClick={() => setActiveTab(menu as any)}
                className={`transition-colors relative ${
                  activeTab === menu ? "text-black" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {menu}
                {menu === 'Waiting For Approve' && pendingEvents.length > 0 && (
                   <span className="absolute -top-1 -right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
                {menu === 'EO' && pendingUsers.length > 0 && (
                   <span className="absolute -top-1 -right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-64 hidden lg:block">
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-5 pr-10 rounded-full border border-gray-200 text-xs text-gray-600 focus:outline-none focus:border-gray-400 placeholder-gray-300 transition-all"
            />
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
          </div>

          <button className="text-black hover:bg-gray-100 p-2 rounded-full transition-colors">
            <FilterIcon className="w-5 h-5" />
          </button>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 focus:outline-none"
            >
              <span className="font-bold text-sm text-black">Admin</span>
              <div className="w-9 h-9 rounded-full border-[1.5px] border-black flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-black" />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Account</Link>
                <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* === KONTEN UTAMA === */}
      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        
        <h2 className="text-lg font-medium text-blue-500 mb-6">
          {activeTab === 'Waiting For Approve' ? 'Frame 1180' : activeTab}
        </h2>

        {/* 1. KONTEN TAB: WISATA */}
        {activeTab === 'Wisata' && (
          <div className="w-full">
             {wisataList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                    <p className="text-xl">Belum ada data wisata</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {wisataList.map((item) => (
                    <div key={item.id} className="group bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                        <div className="relative h-48 w-full bg-gray-50 rounded-lg overflow-hidden mb-4 border border-gray-100">
                            <div className="absolute inset-0 opacity-10" 
                                style={{
                                    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                    backgroundSize: '20px 20px',
                                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                }}>
                            </div>
                            {item.image && (
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover relative z-10" />
                            )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-6 px-1 line-clamp-2 flex-grow">
                            {item.title}
                        </h3>
                        <div className="flex justify-between items-end px-1 mt-auto">
                            <span className="text-[10px] text-gray-500 font-medium truncate max-w-[50%]">
                            {item.location}
                            </span>
                            <span className="text-[10px] text-black font-bold">
                                {item.category}
                            </span>
                        </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        )}

        {/* 2. KONTEN TAB: Waiting For Approve */}
        {activeTab === 'Waiting For Approve' && (
          <>
            {pendingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                    <p className="text-xl">No events waiting for approval</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pendingEvents.map((item) => (
                    <div key={item.id} className="group bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                    
                    <div className="relative h-48 w-full bg-gray-50 rounded-lg overflow-hidden mb-4 border border-gray-100">
                        <div className="absolute inset-0 opacity-10" 
                            style={{
                                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                            }}>
                        </div>
                        
                        {item.image && (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover relative z-10" />
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20 backdrop-blur-[2px]">
                            <button onClick={(e) => {e.stopPropagation(); handleApproveEvent(item.id)}} className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-green-500 hover:text-white transition-colors w-24">
                                Approve
                            </button>
                            <button onClick={(e) => {e.stopPropagation(); handleDeclineEvent(item.id)}} className="bg-white/20 border border-white text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-red-600 hover:border-red-600 transition-colors w-24">
                                Reject
                            </button>
                        </div>
                    </div>

                    <h3 className="text-sm font-medium text-gray-900 mb-6 px-1 line-clamp-2 flex-grow">
                        {item.title}
                    </h3>

                    <div className="flex justify-between items-end px-1 mt-auto">
                        <span className="text-[10px] text-gray-500 font-medium truncate max-w-[50%]">
                        {item.location || "Makassar"}
                        </span>
                        <span className="text-[10px] font-bold text-gray-900">
                        Harga mulai {item.price ? item.price.toLocaleString('id-ID') : '0'}
                        </span>
                    </div>

                    </div>
                ))}
                </div>
            )}
          </>
        )}

        {/* 3. KONTEN TAB: EO (Users) - DIPERBARUI */}
        {activeTab === 'EO' && (
           <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
             {pendingUsers.length === 0 ? (
                <div className="text-center py-16 text-gray-400">Belum ada pendaftar EO baru.</div>
             ) : (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nama EO</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email / Kontak</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Info Legalitas</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {pendingUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50">
                                {/* Kolom Nama & Gambar Profil/Logo */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-200">
                                            {user.imageUrl ? (
                                                <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <UserIcon className="m-auto mt-2 text-gray-400" />
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                
                                {/* Kolom Email & Telepon */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-600">{user.email}</span>
                                        {user.phone && <span className="text-xs text-gray-400 mt-0.5">{user.phone}</span>}
                                    </div>
                                </td>

                                {/* Kolom KTP & Portfolio */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">
                                            KTP: {user.ktp}
                                        </span>
                                        {user.portfolio && (
                                            <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                                                <ExternalLink className="w-3 h-3" />
                                                Lihat Portofolio
                                            </a>
                                        )}
                                    </div>
                                </td>

                                {/* Kolom Aksi */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3 items-center">
                                        <button onClick={() => handleDeclineUser(user.id)} className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline">Tolak</button>
                                        <button onClick={() => handleApproveUser(user.id)} className="text-xs bg-black text-white px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition-shadow shadow-sm">Setujui</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             )}
           </div>
        )}

      </div>
    </div>
  );
}