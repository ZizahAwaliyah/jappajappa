"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Import penting untuk cek asal halaman
import { ChevronLeft, ThumbsUp, Link as LinkIcon, MessageCircle, Instagram } from "lucide-react";
import BottomNavBar from "../../components/Header"; // Sesuaikan path jika folder components ada di app/components
import WishlistButton from "../../components/WishlistButton"; // Sesuaikan path

export default function WisataDetailPage() {
  const [likes, setLikes] = useState(12);
  const [hasLiked, setHasLiked] = useState(false);
  
  // --- LOGIKA TOMBOL BACK ---
  const searchParams = useSearchParams();
  // Cek apakah ada query param ?from=search di URL
  const fromSearch = searchParams.get('from') === 'search';
  // Jika ya, back ke /search. Jika tidak, back ke /wisata (default)
  const backLink = fromSearch ? "/search" : "/wisata";

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  // Data Dummy Wisata (Bisa diganti dengan fetch data berdasarkan ID nanti)
  const wisata = {
    title: "Pantai Tanjung Bira",
    location: "Bulukumba, Sulawesi Selatan",
    mainImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
    description1: `Pantai Bira, atau lebih dikenal sebagai Tanjung Bira, adalah salah satu destinasi wisata terkenal di Sulawesi Selatan, Indonesia. Terletak di Kabupaten Bulukumba, sekitar 200 km sebelah selatan dari Kota Makassar, pantai ini dikenal dengan pasir putihnya yang sangat halus seperti tepung, laut yang jernih dengan gradasi warna biru memukau, serta budaya bahari masyarakat setempat yang unik.`,
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510484732158-9418a0a97b23?q=80&w=1000&auto=format&fit=crop"
    ],
    description2: `Selain keindahan pantainya, Tanjung Bira juga terkenal sebagai tempat pembuatan perahu Phinisi yang legendaris. Pengunjung dapat melihat langsung proses pembuatan perahu tradisional ini di tanah Beru yang tidak jauh dari lokasi pantai. Kawasan ini juga sangat cocok untuk snorkeling dan diving karena kekayaan biota lautnya yang masih terjaga.`,
  };

  return (
    <>
      <main className="bg-white min-h-screen pb-24 md:pb-10">
        
        {/* === HEADER (Sticky Top) === */}
        <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
          
          {/* Tombol Back Dinamis */}
          <Link href={backLink} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          
          {/* Judul */}
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center truncate mx-2">
            {wisata.title}
          </h1>

          {/* Tombol Wishlist */}
          <WishlistButton />

        </header>

        {/* === KONTEN UTAMA === */}
        <div className="max-w-2xl mx-auto px-6 py-6">
          
          {/* Gambar Utama */}
          <div className="relative w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-6 shadow-md">
            <Image
              src={wisata.mainImage}
              alt={wisata.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Deskripsi 1 */}
          <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify mb-6">
            {wisata.description1}
          </p>

          {/* Galeri Kecil */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {wisata.gallery.map((img, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                <Image 
                  src={img} 
                  alt={`Gallery ${index + 1}`} 
                  fill 
                  className="object-cover hover:scale-110 transition-transform duration-500" 
                />
              </div>
            ))}
          </div>

          {/* Deskripsi 2 */}
          <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify mb-10">
            {wisata.description2}
          </p>

          {/* === INTERAKSI (Like & Share) === */}
          <div className="flex flex-col items-center space-y-8">
            
            {/* Tombol Like */}
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full border transition-all shadow-sm ${
                hasLiked 
                  ? "bg-blue-50 border-blue-500 text-blue-600" 
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${hasLiked ? "fill-blue-600" : ""}`} />
              <span className="font-bold">{likes}</span>
            </button>

            {/* Kotak Bagikan */}
            <div className="w-full border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Bagikan
              </h3>
              <div className="flex justify-around items-center px-4">
                
                {/* WhatsApp */}
                <button className="flex flex-col items-center group">
                  <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-7 h-7" /> 
                  </div>
                </button>

                {/* Instagram */}
                <button className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                    <Instagram className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2">Instagram</span>
                </button>

                {/* Copy Link */}
                <button className="flex flex-col items-center group">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 shadow-md group-hover:bg-gray-50 transition-colors">
                    <LinkIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2">Copy Link</span>
                </button>

              </div>
            </div>

          </div>

        </div>
      </main>

      <BottomNavBar />
    </>
  );
}