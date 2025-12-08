'use client';

import React, { useState, useEffect } from 'react';
// IMPORT DARI LIB PUSAT
import { db, auth } from "@/lib/firebase"; 
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Link from 'next/link';
import ProfileDropdown from "../../components/ProfileDropdown";
import { useRouter } from 'next/navigation';

// --- KOMPONEN IKON ---
const SearchIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const UserIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
);
const Loader2 = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
const PlusIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const XIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const FilterIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const ExternalLink = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
);

// Tipe Data
interface EOUser { id: string; name: string; email: string; ktp: string; status: string; imageUrl?: string; phone?: string; portfolio?: string; }
interface EventData { id: string; title: string; location: string; price: number; status: string; image?: string; }
interface WisataData { id: string; title: string; location: string; category: string; image?: string; }
interface JappaData { id: string; title: string; description: string; image?: string; author?: string; } // Interface Baru

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Wisata' | 'Jappa Now' | 'Waiting For Approve' | 'EO'>('Waiting For Approve');
  
  const [pendingUsers, setPendingUsers] = useState<EOUser[]>([]);
  const [pendingEvents, setPendingEvents] = useState<EventData[]>([]);
  const [wisataList, setWisataList] = useState<WisataData[]>([]);
  const [jappaList, setJappaList] = useState<JappaData[]>([]); // State Jappa
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // State Modal & Loading
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddJappaModalOpen, setIsAddJappaModalOpen] = useState(false); // Modal Jappa
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form State Wisata
  const [newWisata, setNewWisata] = useState({
    title: '', location: '', category: 'Wisata Alam', gmapsLink: '', openHours: '', description1: '', description2: '',
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  // Form State Jappa Now
  const [newJappa, setNewJappa] = useState({
    title: '', description: '', content: '', imageUrl: ''
  });
  const [jappaImageFile, setJappaImageFile] = useState<File | null>(null);

  // 1. AUTH CHECK + LISTEN DATA
  useEffect(() => {
    // Check auth and user role
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('Not logged in, redirecting to login');
        router.push('/login?role=admin');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
          console.log('Not an admin, redirecting');
          router.push('/');
          return;
        }
        setIsAuthorized(true);
      } catch (err) {
        console.error('Error checking admin role:', err);
        router.push('/');
      }
    });

    return () => unsubAuth();
  }, [router]);

  // 2. LISTEN DATA (SEMUA TAB) - tapi hanya kalau authorized
  useEffect(() => {
    if (!isAuthorized) return;

    const unsubEO = onSnapshot(query(collection(db, "users"), where("role", "==", "eo"), where("status", "==", "pending")), (snap) => {
      setPendingUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as EOUser)));
    });
    const unsubEvents = onSnapshot(query(collection(db, "events"), where("status", "==", "Waiting For Approval")), (snap) => {
      setPendingEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData)));
      setLoading(false);
    });
    const unsubWisata = onSnapshot(query(collection(db, "wisata")), (snap) => {
      setWisataList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as WisataData)));
    });
    // Listener Jappa Now
    const unsubJappa = onSnapshot(query(collection(db, "jappa_posts")), (snap) => {
      setJappaList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as JappaData)));
    });

    return () => { unsubEO(); unsubEvents(); unsubWisata(); unsubJappa(); };
  }, [isAuthorized]);

  // --- FUNGSI KOMPRES GAMBAR ---
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDimension = 1920;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) { height = (height / width) * maxDimension; width = maxDimension; } 
            else { width = (width / height) * maxDimension; height = maxDimension; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
              if (blob) resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
              else reject(new Error('Compression failed'));
            }, 'image/jpeg', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // --- HANDLER WISATA (MENGGUNAKAN CLOUDINARY) ---
  const handleAddWisata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImageFile) return alert("Gambar utama wajib diupload!");
    if (!newWisata.title || !newWisata.location) return alert("Judul dan Lokasi wajib diisi!");
    
    setIsSubmitting(true);
    try {
        console.log("Starting wisata upload to Cloudinary...", { fileName: mainImageFile.name, title: newWisata.title });
        
        const compressedMain = await compressImage(mainImageFile);
        const mainImageUrl = await uploadToCloudinary(compressedMain, "jappajappa/wisata");
        console.log("Main image uploaded to Cloudinary:", mainImageUrl);

        const galleryUrls = [];
        if (galleryFiles) {
            for (let i = 0; i < galleryFiles.length; i++) {
                const file = galleryFiles[i];
                const compressedFile = await compressImage(file);
                const galleryUrl = await uploadToCloudinary(compressedFile, "jappajappa/wisata/gallery");
                galleryUrls.push(galleryUrl);
                console.log(`Gallery ${i} uploaded to Cloudinary:`, galleryUrl);
            }
        }

        console.log("Saving wisata to Firestore...");
        await addDoc(collection(db, "wisata"), { 
            ...newWisata, 
            image: mainImageUrl, 
            mainImage: mainImageUrl, 
            gallery: galleryUrls, 
            isOpen: true, 
            rating: 4.8, 
            createdAt: serverTimestamp() 
        });
        
        alert("✅ Wisata berhasil ditambahkan!");
        setIsAddModalOpen(false);
        setNewWisata({ title: '', location: '', category: 'Wisata Alam', gmapsLink: '', openHours: '', description1: '', description2: '' });
        setMainImageFile(null); 
        setGalleryFiles(null);
    } catch (error: any) { 
        console.error("Wisata upload error:", error);
        alert(`❌ Gagal: ${error.message}`); 
    } finally { 
        setIsSubmitting(false); 
    }
  };

  // --- HANDLER JAPPA NOW (BARU) ---
  const handleAddJappa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJappa.title.trim() || !newJappa.content.trim()) return alert("Judul dan konten artikel harus diisi!");
    
    if (newJappa.imageUrl && !newJappa.imageUrl.startsWith("http")) {
      return alert("URL gambar tidak valid. Harus dimulai dengan http:// atau https://");
    }
    
    setIsSubmitting(true);
    setUploadProgress(10);

    try {
        console.log("Saving jappa article to Firestore...", { title: newJappa.title });
        
        // Simpan ke Firestore
        await addDoc(collection(db, "jappa_posts"), {
            title: newJappa.title,
            description: newJappa.description,
            content: newJappa.content, 
            image: newJappa.imageUrl || null,
            category: "event",
            author: "Admin Jappa",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log("Jappa article saved successfully!");
        alert("Artikel Jappa Now berhasil dipublish!");
        setIsAddJappaModalOpen(false);
        setNewJappa({ title: '', description: '', content: '', imageUrl: '' });
        setJappaImageFile(null);
        setUploadProgress(100);
    } catch (error: any) {
        console.error("Jappa upload error:", error);
        alert(`Gagal menambahkan artikel: ${error.message || "Cek console untuk detail error"}`);
    } finally {
        setIsSubmitting(false);
        setUploadProgress(0);
    }
  };

  // Actions
  const handleApproveUser = async (id: string) => { if (confirm("Setujui EO?")) await updateDoc(doc(db, "users", id), { status: "approved" }); };
  const handleDeclineUser = async (id: string) => { if (confirm("Tolak EO?")) await deleteDoc(doc(db, "users", id)); };
  const handleApproveEvent = async (id: string) => {
    if (confirm("Publish Event? Event akan muncul di halaman Event dan Dashboard EO.")) {
      await updateDoc(doc(db, "events", id), { status: "Actual" });
      alert("Event berhasil di-approve! Event sekarang berstatus 'Actual' dan akan muncul di Event Page.");
    }
  };
  const handleDeclineEvent = async (id: string) => {
    if (confirm("Reject Event? Event akan ditolak dan tidak akan dipublikasi.")) {
      await updateDoc(doc(db, "events", id), { status: "Declined" });
      alert("Event ditolak.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50"><Loader2 className="animate-spin text-emerald-600 w-12 h-12" /></div>;

  if (!isAuthorized) return <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50"><Loader2 className="animate-spin text-emerald-600 w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-sky-50 to-amber-50 font-sans text-gray-900">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 bg-linear-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-bold text-white tracking-tight">Jappa.</h1>
          <div className="hidden md:flex gap-8 text-sm font-bold">
            {['Wisata', 'Jappa Now', 'Waiting For Approve', 'EO'].map((menu) => (
              <button key={menu} onClick={() => setActiveTab(menu as any)} className={`transition-all relative ${activeTab === menu ? "text-white border-b-2 border-white pb-1" : "text-white/70 hover:text-white"}`}>
                {menu}
                {menu === 'Waiting For Approve' && pendingEvents.length > 0 && <span className="absolute -top-1 -right-2 h-2 w-2 bg-rose-500 rounded-full animate-pulse"></span>}
                {menu === 'EO' && pendingUsers.length > 0 && <span className="absolute -top-1 -right-2 h-2 w-2 bg-rose-500 rounded-full animate-pulse"></span>}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-64 hidden lg:block">
            <input type="text" placeholder="Cari..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-2 px-4 pr-10 rounded-full border-2 border-white/30 bg-white/95 backdrop-blur-sm text-xs focus:outline-none focus:border-white text-gray-800 shadow-md"/>
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4" />
          </div>
          <button className="text-white/90 hover:bg-white/20 p-2 rounded-full transition-colors"><FilterIcon className="w-5 h-5" /></button>
          <ProfileDropdown />
        </div>
      </nav>

      {/* UTAMA */}
      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{activeTab === 'Waiting For Approve' ? 'Event Approval' : activeTab} List</h2>

            {/* Tombol Action Sesuai Tab */}
            {activeTab === 'Wisata' && (
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-linear-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-200">
                    <PlusIcon className="w-4 h-4" /> Tambah Wisata
                </button>
            )}
            {activeTab === 'Jappa Now' && (
                <button onClick={() => setIsAddJappaModalOpen(true)} className="flex items-center gap-2 bg-linear-to-r from-sky-500 to-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg shadow-sky-200">
                    <PlusIcon className="w-4 h-4" /> Tambah Artikel
                </button>
            )}
        </div>

        {/* 1. CONTENT WISATA */}
        {activeTab === 'Wisata' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {wisataList.map((item) => (
                <div key={item.id} className="group bg-white/95 backdrop-blur-sm border-2 border-amber-100 rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:border-amber-300 transition-all h-full flex flex-col">
                    <div className="relative h-48 w-full bg-linear-to-br from-amber-100 to-orange-100 rounded-xl overflow-hidden mb-4 border-2 border-amber-200 group-hover:border-amber-300 transition-all">
                        {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="bg-linear-to-br from-amber-200 to-orange-200 h-full w-full"></div>}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-600 mb-6 px-1 line-clamp-2 grow transition-colors">{item.title}</h3>
                    <div className="flex justify-between items-end px-1 mt-auto border-t-2 border-amber-100 pt-3">
                        <span className="text-[10px] text-gray-600 font-medium truncate max-w-[50%]">{item.location}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-full">{item.category}</span>
                    </div>
                </div>
             ))}
          </div>
        )}

        {/* 2. CONTENT JAPPA NOW (BARU) */}
        {activeTab === 'Jappa Now' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {jappaList.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-400 bg-white/50 rounded-2xl">Belum ada artikel Jappa Now.</div>
             ) : jappaList.map((item) => (
                <div key={item.id} className="group bg-white/95 backdrop-blur-sm border-2 border-sky-100 rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:border-sky-300 transition-all h-full flex flex-col">
                    <div className="relative h-48 w-full bg-linear-to-br from-sky-100 to-blue-100 rounded-xl overflow-hidden mb-4 border-2 border-sky-200 group-hover:border-sky-300 transition-all">
                        {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="bg-linear-to-br from-sky-200 to-blue-200 h-full w-full"></div>}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-sky-600 mb-2 px-1 line-clamp-2 transition-colors">{item.title}</h3>
                    <p className="text-xs text-gray-600 px-1 line-clamp-3 mb-4 grow">{item.description}</p>
                    <div className="flex justify-between items-end px-1 mt-auto pt-2 border-t-2 border-sky-100">
                        <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-bold">By {item.author || 'Admin'}</span>
                    </div>
                </div>
             ))}
          </div>
        )}

        {/* 3. CONTENT EVENTS (Waiting) */}
        {activeTab === 'Waiting For Approve' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pendingEvents.map((item) => (
                    <div key={item.id} className="group bg-white/95 backdrop-blur-sm border-2 border-emerald-100 rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:border-emerald-300 transition-all cursor-pointer h-full flex flex-col">
                        <div className="relative h-48 w-full bg-linear-to-br from-emerald-100 to-teal-100 rounded-xl overflow-hidden mb-4 border-2 border-emerald-200">
                             {item.image && <img src={item.image} className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"/>}
                             <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-20 backdrop-blur-sm">
                                <button onClick={(e) => {e.stopPropagation(); handleApproveEvent(item.id)}} className="bg-linear-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all">Approve</button>
                                <button onClick={(e) => {e.stopPropagation(); handleDeclineEvent(item.id)}} className="bg-white/20 border-2 border-white text-white text-xs font-bold px-5 py-2.5 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all">Reject</button>
                             </div>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 mb-6 px-1 transition-colors line-clamp-2">{item.title}</h3>
                         <div className="flex justify-between items-end px-1 mt-auto border-t-2 border-emerald-100 pt-3">
                            <span className="text-[10px] text-gray-600 font-medium truncate max-w-[50%]">{item.location || "Makassar"}</span>
                             <span className="text-[10px] font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Rp {item.price.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                ))}
             </div>
        )}
        
        {/* 4. CONTENT EO */}
        {activeTab === 'EO' && (
             <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-violet-100 overflow-hidden shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-linear-to-r from-violet-50 to-purple-50 border-b-2 border-violet-100"><tr><th className="px-6 py-4 text-xs font-bold text-violet-700 uppercase">Nama EO</th><th className="px-6 py-4 text-xs font-bold text-violet-700 uppercase">Email / Kontak</th><th className="px-6 py-4 text-xs font-bold text-violet-700 uppercase">Info Legalitas</th><th className="px-6 py-4 text-xs font-bold text-violet-700 uppercase text-right">Aksi</th></tr></thead>
                    <tbody className="divide-y divide-violet-50">
                        {pendingUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-violet-50/50 transition-colors">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-linear-to-br from-violet-100 to-purple-100 overflow-hidden shrink-0 border-2 border-violet-200">{user.imageUrl ? (<img src={user.imageUrl} alt="" className="h-full w-full object-cover" />) : (<UserIcon className="m-auto mt-2 text-violet-400" />)}</div><span className="text-sm font-bold text-gray-900">{user.name}</span></div></td>
                                <td className="px-6 py-4"><div className="flex flex-col"><span className="text-sm text-gray-700">{user.email}</span>{user.phone && <span className="text-xs text-gray-500 mt-0.5">{user.phone}</span>}</div></td>
                                <td className="px-6 py-4"><div className="flex flex-col gap-1"><span className="text-xs font-mono text-violet-700 bg-violet-100 px-2.5 py-1.5 rounded-lg w-fit font-bold">KTP: {user.ktp}</span>{user.portfolio && (<a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 hover:underline mt-1 font-medium"><ExternalLink className="w-3 h-3" />Lihat Portofolio</a>)}</div></td>
                                <td className="px-6 py-4 text-right"><div className="flex justify-end gap-3 items-center"><button onClick={() => handleDeclineUser(user.id)} className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full transition-all">Tolak</button><button onClick={() => handleApproveUser(user.id)} className="text-xs bg-linear-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-200">Setujui</button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        )}
      </div>

      {/* === MODAL TAMBAH WISATA === */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-amber-200">
                <div className="flex justify-between items-center p-6 border-b-2 border-amber-100 sticky top-0 bg-linear-to-r from-amber-50 to-orange-50 z-10">
                    <h3 className="text-xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Tambah Wisata Baru</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-amber-400 hover:text-amber-600 transition-colors"><XIcon /></button>
                </div>
                <form onSubmit={handleAddWisata} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-amber-700 mb-1">Nama Wisata</label><input type="text" required className="w-full p-2 border-2 border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" value={newWisata.title} onChange={e => setNewWisata({...newWisata, title: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-amber-700 mb-1">Lokasi (Kota)</label><input type="text" required placeholder="Cth: Bulukumba, Sulsel" className="w-full p-2 border-2 border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" value={newWisata.location} onChange={e => setNewWisata({...newWisata, location: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-amber-700 mb-1">Kategori</label><select className="w-full p-2 border-2 border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" value={newWisata.category} onChange={e => setNewWisata({...newWisata, category: e.target.value})}><option>Wisata Alam</option><option>Wisata Sejarah</option><option>Wisata Kuliner</option><option>Wisata Kota</option></select></div>
                        <div><label className="block text-xs font-bold text-amber-700 mb-1">Jam Operasional</label><input type="text" placeholder="Cth: 08:00 - 17:00 WITA" className="w-full p-2 border-2 border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" value={newWisata.openHours} onChange={e => setNewWisata({...newWisata, openHours: e.target.value})} /></div>
                    </div>
                    <div><label className="block text-xs font-bold text-amber-700 mb-1">Link Google Maps</label><input type="url" placeholder="https://maps.app.goo.gl/..." className="w-full p-2 border-2 border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" value={newWisata.gmapsLink} onChange={e => setNewWisata({...newWisata, gmapsLink: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-amber-700 mb-1">Deskripsi Singkat (Paragraf 1)</label><textarea required className="w-full p-2 border-2 border-amber-200 rounded-lg text-sm h-20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" value={newWisata.description1} onChange={e => setNewWisata({...newWisata, description1: e.target.value})}></textarea></div>
                    <div><label className="block text-xs font-bold text-amber-700 mb-1">Deskripsi Lengkap (Paragraf 2)</label><textarea required className="w-full p-2 border-2 border-amber-200 rounded-lg text-sm h-24 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" value={newWisata.description2} onChange={e => setNewWisata({...newWisata, description2: e.target.value})}></textarea></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-amber-700 mb-1">Foto Utama (Thumbnail)</label><input type="file" required accept="image/*" className="block w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-linear-to-r file:from-amber-500 file:to-orange-500 file:text-white hover:file:from-amber-600 hover:file:to-orange-600 file:shadow-md file:transition-all" onChange={e => setMainImageFile(e.target.files ? e.target.files[0] : null)} /></div>
                        <div><label className="block text-xs font-bold text-amber-700 mb-1">Galeri Foto (Pilih Banyak)</label><input type="file" multiple accept="image/*" className="block w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-linear-to-r file:from-amber-500 file:to-orange-500 file:text-white hover:file:from-amber-600 hover:file:to-orange-600 file:shadow-md file:transition-all" onChange={e => setGalleryFiles(e.target.files)} /></div>
                    </div>
                    <div className="pt-4 border-t-2 border-amber-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 transition-all">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 shadow-lg shadow-amber-200 transition-all">{isSubmitting ? 'Menyimpan...' : 'Simpan Wisata'}</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* === MODAL TAMBAH JAPPA NOW (BARU) === */}
      {isAddJappaModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 border-2 border-sky-200">
                <div className="flex justify-between items-center p-6 border-b-2 border-sky-100 bg-linear-to-r from-sky-50 to-blue-50">
                    <h3 className="text-xl font-bold bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Tambah Artikel Jappa Now</h3>
                    <button onClick={() => setIsAddJappaModalOpen(false)} className="text-sky-400 hover:text-sky-600 transition-colors"><XIcon /></button>
                </div>
                <form onSubmit={handleAddJappa} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-sky-700 mb-1">Judul Artikel / Tempat</label>
                        <input type="text" required placeholder="Cth: Nongkrong Asik di Kopi Teori" className="w-full p-3 border-2 border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" value={newJappa.title} onChange={e => setNewJappa({...newJappa, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-sky-700 mb-1">Deskripsi Singkat (Card)</label>
                        <input type="text" required placeholder="Muncul di halaman depan..." className="w-full p-3 border-2 border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" value={newJappa.description} onChange={e => setNewJappa({...newJappa, description: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-sky-700 mb-1">Isi Artikel Lengkap</label>
                        <textarea required placeholder="Tulis artikel di sini. Gunakan Enter untuk paragraf baru..." className="w-full p-3 border-2 border-sky-200 rounded-xl text-sm h-32 resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" value={newJappa.content} onChange={e => setNewJappa({...newJappa, content: e.target.value})}></textarea>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-sky-700 mb-1">URL Foto Utama</label>
                        <input type="url" placeholder="https://example.com/image.jpg" className="w-full p-3 border-2 border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" value={newJappa.imageUrl} onChange={e => setNewJappa({...newJappa, imageUrl: e.target.value})} />
                        <p className="text-xs text-sky-600 mt-1">💡 Gunakan URL dari Cloudinary, Imgur, atau hosting lainnya</p>
                    </div>

                    <div className="pt-4 border-t-2 border-sky-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddJappaModalOpen(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 transition-all">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 disabled:opacity-50 shadow-lg shadow-sky-200 transition-all">
                            {isSubmitting ? 'Publishing...' : 'Publish Artikel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}