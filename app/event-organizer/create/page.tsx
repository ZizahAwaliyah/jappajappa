"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, UploadCloud, Loader2, Image as ImageIcon, Calendar, MapPin, DollarSign, Ticket, AlignLeft, Layers } from "lucide-react";

// FIREBASE IMPORTS
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

import ProfileDropdown from "../../components/ProfileDropdown"; 

export default function CreateEventPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Konser",
    date: "",
    time: "",
    location: "",
    gmapsLink: "",
    price: "",
    stock: "",
    description: "",
    terms: "",
  });

  // Cek Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); 
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processFile(e.dataTransfer.files[0]);
      }
  };

  const processFile = (file: File) => {
      if (!file.type.startsWith("image/")) return alert("Mohon upload file gambar.");
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Wajib upload poster event!");

    setIsLoading(true);

    try {
        // 1. Upload Gambar ke Cloudinary
        console.log("Mengupload gambar ke Cloudinary...");
        const imageUrl = await uploadToCloudinary(imageFile, "jappajappa/events");
        console.log("✅ Gambar berhasil diupload:", imageUrl);

        // 2. Simpan ke Firestore
        console.log("Menyimpan event ke Firestore...");
        await addDoc(collection(db, "events"), {
            title: formData.title,
            category: formData.category,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            gmapsLink: formData.gmapsLink,
            price: Number(formData.price),
            stock: Number(formData.stock),
            description: formData.description,
            terms: formData.terms,
            image: imageUrl,
            status: "Waiting For Approval", // Status menunggu persetujuan admin
            createdBy: user.uid,
            organizerName: user.displayName || "EO Partner",
            createdAt: serverTimestamp()
        });

        console.log("✅ Event berhasil disimpan ke Firestore");
        alert("Event berhasil diajukan! Menunggu persetujuan admin.");

        // Arahkan ke dashboard yang benar
        router.push("/event-organizer/dashboard");

    } catch (error: any) {
        console.error("❌ Error creating event:", error);
        alert(`Gagal membuat event: ${error?.message || 'Unknown error'}`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      
      {/* === NAVBAR === */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-orange-600">Jappa.</Link>
            <div className="hidden md:flex items-center gap-2 text-sm">
                <Link href="/event-organizer/dashboard" className="text-gray-500 hover:text-orange-600 font-medium">Dashboard</Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-bold">Buat Event</span>
            </div>
        </div>
        <ProfileDropdown />
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Tombol Kembali dengan Router Back */}
        <div className="mb-8">
            <button
                onClick={() => router.back()}
                className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors font-medium group"
            >
                <div className="p-1.5 rounded-full bg-white border border-gray-200 group-hover:border-orange-200 group-hover:bg-orange-50 mr-2 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                </div>
                Kembali
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* === KOLOM KIRI: FORM DATA UTAMA === */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Card 1: Detail Dasar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Detail Event</h2>
                            <p className="text-xs text-gray-500">Informasi dasar mengenai acara Anda</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {/* Judul */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nama Event</label>
                            <input 
                                type="text" 
                                name="title" 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 font-medium" 
                                placeholder="Contoh: Konser Senja Makassar 2025" 
                                onChange={handleChange} 
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Kategori</label>
                            <div className="relative">
                                <select name="category" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none font-medium text-gray-700" onChange={handleChange}>
                                    <option value="Konser">Konser</option>
                                    <option value="Festival">Festival</option>
                                    <option value="Pameran">Pameran</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronLeft className="w-4 h-4 text-gray-400 -rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* Lokasi & Google Maps Link */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Lokasi Venue</label>
                            <div className="relative mb-3">
                                <MapPin className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                                <input type="text" name="location" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder="Cth: Pantai Losari, Makassar" onChange={handleChange} />
                            </div>
                            <input
                                type="url"
                                name="gmapsLink"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm"
                                placeholder="🔗 Paste Google Maps Link (opsional)"
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500 mt-2">💡 Cara: Buka Google Maps → Klik lokasi → Share → Copy link</p>
                        </div>

                        {/* Waktu */}
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Tanggal</label>
                                <div className="relative">
                                    <input type="date" name="date" required className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-600" onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Jam Mulai</label>
                                <div className="relative">
                                    <input type="time" name="time" required className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-600" onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Deskripsi */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                            <AlignLeft className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Deskripsi</h2>
                            <p className="text-xs text-gray-500">Jelaskan detail acara agar pengunjung tertarik</p>
                        </div>
                    </div>

                    <textarea
                        name="description"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none h-40 resize-none text-gray-700 leading-relaxed"
                        placeholder="Tulis deskripsi lengkap event, line-up artis, peraturan, dan info penting lainnya..."
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Card 3: Syarat & Ketentuan */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                            📋
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Syarat & Ketentuan</h2>
                            <p className="text-xs text-gray-500">Aturan penting untuk pengunjung event</p>
                        </div>
                    </div>

                    <textarea
                        name="terms"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none h-48 resize-none text-gray-700 leading-relaxed text-sm"
                        placeholder="Contoh:&#10;• Tiket yang sudah dibeli tidak dapat direfund&#10;• Wajib membawa identitas diri saat masuk venue&#10;• Dilarang membawa makanan & minuman dari luar&#10;• Penyelenggara berhak menolak masuk jika melanggar ketentuan&#10;&#10;Tulis minimal 3 poin syarat & ketentuan..."
                        onChange={handleChange}
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-2">💡 Pisahkan setiap poin dengan enter/baris baru</p>
                </div>

            </div>

            {/* === KOLOM KANAN: MEDIA & TIKET === */}
            <div className="space-y-6">

                {/* Card 3: Upload Poster */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">Poster Event</h3>
                    </div>

                    <div 
                        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative h-64 bg-gray-50 overflow-hidden ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                    >
                        {previewUrl ? (
                            <Image src={previewUrl} alt="Preview" fill className="object-contain p-2" />
                        ) : (
                            <div className="flex flex-col items-center pointer-events-none">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 mb-3">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-gray-700">Upload Poster</p>
                                <p className="text-xs text-gray-400 mt-1 px-4">Drag & drop atau klik untuk memilih file (Max 5MB)</p>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                </div>

                {/* Card 4: Harga & Stok */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Ticket className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">Tiket</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Harga Tiket (Rp)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />
                                <input type="number" name="price" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-900" placeholder="0" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Stok Tersedia</label>
                            <input type="number" name="stock" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none font-medium" placeholder="Contoh: 500" onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Tombol Submit */}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Ajukan Event Sekarang"}
                </button>

            </div>

        </div>

      </main>
    </div>
  );
}