'use client';

import React, { useState, useEffect } from 'react';
// IMPORT DARI LIB (AMAN)
import { db, storage } from "@/lib/firebase"; 
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import Link from 'next/link';
import ProfileDropdown from "../components/ProfileDropdown";

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
interface JappaData { id: string; title: string; description: string; image?: string; author?: string; }

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'Wisata' | 'Jappa Now' | 'Waiting For Approve' | 'EO'>('Waiting For Approve');
  
  const [pendingUsers, setPendingUsers] = useState<EOUser[]>([]);
  const [pendingEvents, setPendingEvents] = useState<EventData[]>([]);
  const [wisataList, setWisataList] = useState<WisataData[]>([]);
  const [jappaList, setJappaList] = useState<JappaData[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State Modal & Loading
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddJappaModalOpen, setIsAddJappaModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form State Wisata
  const [newWisata, setNewWisata] = useState({
    title: '', location: '', category: 'Wisata Alam', gmapsLink: '', openHours: '', description1: '', description2: '',
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  // Form State Jappa
  const [newJappa, setNewJappa] = useState({
    title: '', description: '', content: ''
  });
  const [jappaImageFile, setJappaImageFile] = useState<File | null>(null);

  // 1. LISTEN DATA (SEMUA TAB)
  useEffect(() => {
    // Fetch EO
    const unsubEO = onSnapshot(query(collection(db, "users"), where("role", "==", "eo"), where("status", "==", "pending")), (snap) => {
      setPendingUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as EOUser)));
    });
    // Fetch Events
    const unsubEvents = onSnapshot(query(collection(db, "events"), where("status", "==", "waiting")), (snap) => {
      setPendingEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData)));
      setLoading(false);
    });
    // Fetch Wisata
    const unsubWisata = onSnapshot(query(collection(db, "wisata")), (snap) => {
      setWisataList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as WisataData)));
    });
    // Fetch Jappa Now
    const unsubJappa = onSnapshot(query(collection(db, "jappa_posts")), (snap) => {
      setJappaList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as JappaData)));
    });

    return () => { unsubEO(); unsubEvents(); unsubWisata(); unsubJappa(); };
  }, []);

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

  // --- HANDLER WISATA ---
  const handleAddWisata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImageFile) return alert("Gambar utama wajib diupload!");
    setIsSubmitting(true);
    setUploadProgress(10);

    try {
        const compressedMain = await compressImage(mainImageFile);
        const mainImgRef = ref(storage, `wisata/${Date.now()}_main_${mainImageFile.name}`);
        await uploadBytes(mainImgRef, compressedMain);
        const mainImageUrl = await getDownloadURL(mainImgRef);
        setUploadProgress(40);

        const galleryUrls = [];
        if (galleryFiles) {
            for (let i = 0; i < galleryFiles.length; i++) {
                const file = galleryFiles[i];
                const compressedFile = await compressImage(file);
                const galleryRef = ref(storage, `wisata/${Date.now()}_gallery_${i}_${file.name}`);
                await uploadBytes(galleryRef, compressedFile);
                galleryUrls.push(await getDownloadURL(galleryRef));
            }
        }
        setUploadProgress(80);

        await addDoc(collection(db, "wisata"), { 
            ...newWisata, 
            image: mainImageUrl, 
            mainImage: mainImageUrl, 
            gallery: galleryUrls, 
            isOpen: true, 
            rating: 4.8, 
            createdAt: serverTimestamp() 
        });

        setUploadProgress(100);
        alert("Wisata berhasil ditambahkan!");
        setIsAddModalOpen(false);
        setNewWisata({ title: '', location: '', category: 'Wisata Alam', gmapsLink: '', openHours: '', description1: '', description2: '' });
        setMainImageFile(null); setGalleryFiles(null);
    } catch (error: any) { 
        alert(`Gagal: ${error.message}`); 
    } finally { 
        setIsSubmitting(false); 
        setUploadProgress(0);
    }
  };

  // --- HANDLER JAPPA NOW ---
  const handleAddJappa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jappaImageFile) return alert("Gambar artikel wajib diupload!");
    setIsSubmitting(true);
    setUploadProgress(10);

    try {
        const compressed = await compressImage(jappaImageFile);
        const imgRef = ref(storage, `jappa/${Date.now()}_${jappaImageFile.name}`);
        await uploadBytes(imgRef, compressed);
        const imageUrl = await getDownloadURL(imgRef);
        setUploadProgress(50);

        const contentArray = newJappa.content.split('\n').filter(line => line.trim() !== '');

        await addDoc(collection(db, "jappa_posts"), {
            title: newJappa.title,
            description: newJappa.description,
            content: contentArray, 
            image: imageUrl,
            author: "Admin Jappa",
            createdAt: serverTimestamp()
        });

        setUploadProgress(100);
        alert("Artikel Jappa Now berhasil dipublish!");
        setIsAddJappaModalOpen(false);
        setNewJappa({ title: '', description: '', content: '' });
        setJappaImageFile(null);
    } catch (error: any) {
        alert(`Gagal: ${error.message}`);
    } finally {
        setIsSubmitting(false);
        setUploadProgress(0);
    }
  };

  // Actions
  const handleApproveUser = async (id: string) => { if (confirm("Setujui EO?")) await updateDoc(doc(db, "users", id), { status: "approved" }); };
  const handleDeclineUser = async (id: string) => { if (confirm("Tolak EO?")) await deleteDoc(doc(db, "users", id)); };
  const handleApproveEvent = async (id: string) => { if (confirm("Publish Event?")) await updateDoc(doc(db, "events", id), { status: "actual" }); };
  const handleDeclineEvent = async (id: string) => { if (confirm("Reject Event?")) await updateDoc(doc(db, "events", id), { status: "rejected" }); };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-gray-400" /></div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-bold text-red-600 tracking-tight">Jappa.</h1>
          <div className="hidden md:flex gap-8 text-sm font-bold">
            {['Wisata', 'Jappa Now', 'Waiting For Approve', 'EO'].map((menu) => (
              <button key={menu} onClick={() => setActiveTab(menu as any)} className={`transition-colors relative ${activeTab === menu ? "text-black" : "text-gray-400 hover:text-gray-600"}`}>
                {menu}
                {menu === 'Waiting For Approve' && pendingEvents.length > 0 && <span className="absolute -top-1 -right-2 h-2 w-2 bg-red-500 rounded-full"></span>}
                {menu === 'EO' && pendingUsers.length > 0 && <span className="absolute -top-1 -right-2 h-2 w-2 bg-red-500 rounded-full"></span>}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative w-64 hidden lg:block">
            <input type="text" placeholder="Cari..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 text-xs focus:outline-none focus:border-gray-400 text-gray-600"/>
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"><FilterIcon className="w-5 h-5" /></button>
          <ProfileDropdown />
        </div>
      </nav>

      {/* UTAMA */}
      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-blue-500">{activeTab === 'Waiting For Approve' ? 'Event Approval' : activeTab} List</h2>
            
            {/* Tombol Action Sesuai Tab */}
            {activeTab === 'Wisata' && (
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg">
                    <PlusIcon className="w-4 h-4" /> Tambah Wisata
                </button>
            )}
            {activeTab === 'Jappa Now' && (
                <button onClick={() => setIsAddJappaModalOpen(true)} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg">
                    <PlusIcon className="w-4 h-4" /> Tambah Artikel
                </button>
            )}
        </div>

        {/* 1. CONTENT WISATA */}
        {activeTab === 'Wisata' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {wisataList.map((item) => (
                <div key={item.id} className="group bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                    <div className="relative h-48 w-full bg-gray-50 rounded-lg overflow-hidden mb-4 border border-gray-100">
                        {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="bg-gray-200 h-full w-full"></div>}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-6 px-1 line-clamp-2 flex-grow">{item.title}</h3>
                    <div className="flex justify-between items-end px-1 mt-auto">
                        <span className="text-[10px] text-gray-500 font-medium truncate max-w-[50%]">{item.location}</span>
                        <span className="text-[10px] text-black font-bold">{item.category}</span>
                    </div>
                </div>
             ))}
          </div>
        )}

        {/* 2. CONTENT JAPPA NOW */}
        {activeTab === 'Jappa Now' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {jappaList.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-300">Belum ada artikel Jappa Now.</div>
             ) : jappaList.map((item) => (
                <div key={item.id} className="group bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                    <div className="relative h-48 w-full bg-gray-50 rounded-lg overflow-hidden mb-4 border border-gray-100">
                        {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="bg-gray-200 h-full w-full"></div>}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 px-1 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 px-1 line-clamp-3 mb-4 flex-grow">{item.description}</p>
                    <div className="flex justify-between items-end px-1 mt-auto pt-2 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400 font-medium">By {item.author || 'Admin'}</span>
                    </div>
                </div>
             ))}
          </div>
        )}

        {/* 3. CONTENT EVENTS */}
        {activeTab === 'Waiting For Approve' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pendingEvents.map((item) => (
                    <div key={item.id} className="group bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                        <div className="relative h-48 w-full bg-gray-50 rounded-lg overflow-hidden mb-4 border border-gray-100">
                             {item.image && <img src={item.image} className="w-full h-full object-cover relative z-10"/>}
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20 backdrop-blur-[2px]">
                                <button onClick={(e) => {e.stopPropagation(); handleApproveEvent(item.id)}} className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full">Approve</button>
                                <button onClick={(e) => {e.stopPropagation(); handleDeclineEvent(item.id)}} className="bg-white/20 border border-white text-white text-xs font-bold px-4 py-2 rounded-full">Reject</button>
                             </div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-6 px-1">{item.title}</h3>
                         <div className="flex justify-between items-end px-1 mt-auto">
                            <span className="text-[10px] text-gray-500 font-medium truncate max-w-[50%]">{item.location || "Makassar"}</span>
                             <span className="text-[10px] font-bold text-gray-900">Harga mulai {item.price}</span>
                        </div>
                    </div>
                ))}
             </div>
        )}
        
        {/* 4. CONTENT EO */}
        {activeTab === 'EO' && (
             <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100"><tr><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nama EO</th><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email / Kontak</th><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Info Legalitas</th><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                        {pendingUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-200">{user.imageUrl ? (<img src={user.imageUrl} alt="" className="h-full w-full object-cover" />) : (<UserIcon className="m-auto mt-2 text-gray-400" />)}</div><span className="text-sm font-bold text-gray-900">{user.name}</span></div></td>
                                <td className="px-6 py-4"><div className="flex flex-col"><span className="text-sm text-gray-600">{user.email}</span>{user.phone && <span className="text-xs text-gray-400 mt-0.5">{user.phone}</span>}</div></td>
                                <td className="px-6 py-4"><div className="flex flex-col gap-1"><span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">KTP: {user.ktp}</span>{user.portfolio && (<a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"><ExternalLink className="w-3 h-3" />Lihat Portofolio</a>)}</div></td>
                                <td className="px-6 py-4 text-right"><div className="flex justify-end gap-3 items-center"><button onClick={() => handleDeclineUser(user.id)} className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline">Tolak</button><button onClick={() => handleApproveUser(user.id)} className="text-xs bg-black text-white px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition-shadow shadow-sm">Setujui</button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        )}

      </div>

      {/* === MODAL TAMBAH WISATA === */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-gray-900">Tambah Wisata Baru</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XIcon /></button>
                </div>
                <form onSubmit={handleAddWisata} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-700 mb-1">Nama Wisata</label><input type="text" required className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={newWisata.title} onChange={e => setNewWisata({...newWisata, title: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-700 mb-1">Lokasi (Kota)</label><input type="text" required placeholder="Cth: Bulukumba, Sulsel" className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={newWisata.location} onChange={e => setNewWisata({...newWisata, location: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label><select className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={newWisata.category} onChange={e => setNewWisata({...newWisata, category: e.target.value})}><option>Wisata Alam</option><option>Wisata Sejarah</option><option>Wisata Kuliner</option><option>Wisata Kota</option></select></div>
                        <div><label className="block text-xs font-bold text-gray-700 mb-1">Jam Operasional</label><input type="text" placeholder="Cth: 08:00 - 17:00 WITA" className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={newWisata.openHours} onChange={e => setNewWisata({...newWisata, openHours: e.target.value})} /></div>
                    </div>
                    <div><label className="block text-xs font-bold text-gray-700 mb-1">Link Google Maps</label><input type="url" placeholder="https://maps.app.goo.gl/..." className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={newWisata.gmapsLink} onChange={e => setNewWisata({...newWisata, gmapsLink: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat (Paragraf 1)</label><textarea required className="w-full p-2 border border-gray-300 rounded-lg text-sm h-20" value={newWisata.description1} onChange={e => setNewWisata({...newWisata, description1: e.target.value})}></textarea></div>
                    <div><label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Lengkap (Paragraf 2)</label><textarea required className="w-full p-2 border border-gray-300 rounded-lg text-sm h-24" value={newWisata.description2} onChange={e => setNewWisata({...newWisata, description2: e.target.value})}></textarea></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-700 mb-1">Foto Utama (Thumbnail)</label><input type="file" required accept="image/*" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => setMainImageFile(e.target.files ? e.target.files[0] : null)} /></div>
                        <div><label className="block text-xs font-bold text-gray-700 mb-1">Galeri Foto (Pilih Banyak)</label><input type="file" multiple accept="image/*" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => setGalleryFiles(e.target.files)} /></div>
                    </div>
                    {/* Progress Bar */}
                    {isSubmitting && uploadProgress > 0 && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600"><span>Upload Progress</span><span className="font-bold">{uploadProgress}%</span></div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"><div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div></div>
                        </div>
                    )}
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-black hover:bg-gray-800 disabled:opacity-50">{isSubmitting ? 'Menyimpan...' : 'Simpan Wisata'}</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* === MODAL TAMBAH JAPPA NOW === */}
      {isAddJappaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
                    <h3 className="text-xl font-bold text-gray-900">Tambah Artikel Jappa Now</h3>
                    <button onClick={() => setIsAddJappaModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XIcon /></button>
                </div>
                <form onSubmit={handleAddJappa} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Judul Artikel / Tempat</label>
                        <input type="text" required placeholder="Cth: Nongkrong Asik di Kopi Teori" className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none" value={newJappa.title} onChange={e => setNewJappa({...newJappa, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat (Card)</label>
                        <input type="text" required placeholder="Muncul di halaman depan..." className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none" value={newJappa.description} onChange={e => setNewJappa({...newJappa, description: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Isi Artikel Lengkap</label>
                        <textarea required placeholder="Tulis artikel di sini. Gunakan Enter untuk paragraf baru..." className="w-full p-3 border border-gray-300 rounded-xl text-sm h-32 resize-none focus:ring-2 focus:ring-black outline-none" value={newJappa.content} onChange={e => setNewJappa({...newJappa, content: e.target.value})}></textarea>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Foto Utama</label>
                        <input type="file" required accept="image/*" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" onChange={e => setJappaImageFile(e.target.files ? e.target.files[0] : null)} />
                    </div>
                     {isSubmitting && uploadProgress > 0 && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600"><span>Upload Progress</span><span className="font-bold">{uploadProgress}%</span></div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"><div className="bg-black h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div></div>
                        </div>
                    )}
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddJappaModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-black hover:bg-gray-800 disabled:opacity-50">
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