"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation"; // Import useParams & useSearchParams
import { ChevronLeft, Share2, Heart, Calendar, User as UserIcon } from "lucide-react";
import BottomNavBar from "../../components/Header"; // Sesuaikan path

// --- DATABASE DUMMY JAPPA NEWS ---
const jappaDatabase = [
  {
    id: 1,
    title: "Nongkrong Asik di Senja: Kopi Teori",
    author: "Admin Jappa",
    date: "20 Oktober 2025",
    image: "https://images.unsplash.com/photo-1563805042-60734c98602a?q=80&w=1000&auto=format&fit=crop",
    content: [
      "Makassar tidak hanya dikenal dengan Coto dan Pisang Epe, tetapi juga budaya ngopi yang sangat kental. Salah satu tempat yang wajib dikunjungi bagi pecinta senja dan kopi adalah Kopi Teori.",
      "Terletak di sudut kota yang strategis, tempat ini menawarkan suasana industrial semi-outdoor yang sangat nyaman. Angin sore sepoi-sepoi akan menemani Anda menyeruput kopi arabika lokal terbaik yang diseduh oleh barista berpengalaman.",
      "Tidak hanya kopi, tempat ini juga menyediakan berbagai camilan ringan hingga makanan berat yang cocok untuk menemani obrolan santai bersama teman-teman. Live music akustik yang hadir setiap akhir pekan menambah syahdu suasana malam di sini."
    ]
  },
  {
    id: 2,
    title: "Kuliner Malam Legendaris: Coto Nusantara",
    author: "Food Hunter",
    date: "18 Oktober 2025",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop",
    content: [
      "Belum sah ke Makassar kalau belum mencicipi Coto Nusantara. Warung coto yang satu ini sudah melegenda dan menjadi destinasi wajib bagi wisatawan maupun warga lokal.",
      "Kuah kentalnya yang khas, diracik dengan rempah-rempah rahasia turun-temurun, menghasilkan cita rasa yang gurih dan nendang di lidah. Daging sapinya yang empuk dipotong tebal-tebal, memberikan kepuasan tersendiri di setiap gigitan.",
      "Warung ini buka dari pagi hingga malam, namun waktu terbaik untuk berkunjung adalah saat makan malam untuk merasakan keramaian dan kehangatan suasana kuliner malam kota Daeng."
    ]
  },
  {
    id: 3,
    title: "Menelusuri Jejak Sejarah di Museum Kota",
    author: "Sejarahwan Muda",
    date: "15 Oktober 2025",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
    content: [
      "Di tengah hiruk pikuk modernisasi kota Makassar, terdapat sebuah bangunan tua yang menyimpan ribuan cerita masa lalu. Museum Kota Makassar adalah saksi bisu perjalanan panjang kota ini.",
      "Gedung yang dulunya merupakan kantor pemerintahan kolonial ini kini disulap menjadi museum modern yang estetik. Pengunjung akan diajak lorong waktu melihat foto-foto Makassar tempo dulu, peta kuno, hingga artefak peninggalan kerajaan Gowa-Tallo.",
      "Tempat ini sangat cocok untuk wisata edukasi keluarga atau sekadar mencari ketenangan sambil belajar sejarah. Jangan lupa untuk berfoto di arsitektur bangunan yang sangat instagramable ini."
    ]
  }
];

export default function JappaDetailPage() {
  const params = useParams();
  const itemId = Number(params.id);
  const [isLiked, setIsLiked] = useState(false);

  // --- LOGIKA TOMBOL BACK ---
  const searchParams = useSearchParams();
  const fromSearch = searchParams.get('from') === 'search';
  // Jika dari search -> /search. Jika tidak -> / (Home) karena Jappa News ada di Home.
  const backLink = fromSearch ? "/search" : "/";

  // Cari data berdasarkan ID dari URL
  const item = jappaDatabase.find((data) => data.id === itemId);

  // Error Handling jika ID tidak ketemu
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-gray-500 font-medium">Artikel tidak ditemukan</p>
        <Link href="/" className="text-blue-600 hover:underline">Kembali ke Home</Link>
      </div>
    );
  }

  return (
    <>
      <main className="bg-white min-h-screen pb-24 md:pb-10">
        
        {/* === HEADER === */}
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm border-b border-gray-100">
          
          {/* Tombol Back Dinamis */}
          <Link href={backLink} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          
          <h1 className="text-lg font-bold text-gray-900">Jappa News</h1>
          
          {/* Tombol Share */}
          <button className="p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </header>

        {/* === KONTEN ARTIKEL === */}
        <div className="max-w-2xl mx-auto bg-white">
          
          {/* Gambar Utama */}
          <div className="relative w-full aspect-video bg-gray-100 md:rounded-b-2xl overflow-hidden shadow-sm">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="px-6 py-6">
            {/* Judul Artikel */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {item.title}
            </h1>

            {/* Metadata (Author & Date) */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1.5 text-blue-600" />
                <span className="font-medium text-gray-700">{item.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>{item.date}</span>
              </div>
            </div>

            {/* Isi Konten (Paragraf) */}
            <article className="prose prose-gray max-w-none">
              {item.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-7 mb-5 text-justify text-[15px] md:text-base">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Footer Artikel (Like Button) */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-400">Apakah artikel ini membantu?</span>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                  isLiked 
                    ? "bg-red-50 border-red-200 text-red-500" 
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
                <span className="text-sm font-medium">{isLiked ? "Disukai" : "Suka"}</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      <BottomNavBar />
    </>
  );
}