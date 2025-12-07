"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ChevronLeft, Share2, Heart, Calendar, User as UserIcon, Loader2 } from "lucide-react";
import BottomNavBar from "../../components/Header";
// IMPORT FIREBASE
import { db } from "@/lib/firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default function JappaDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fromSearch = searchParams.get('from') === 'search';
  // Jika dari search, back ke /search. Jika tidak, back ke / (Home) karena Jappa Now ada di Home.
  const backLink = fromSearch ? "/search" : "/";

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  // FETCH DATA DARI FIREBASE
  useEffect(() => {
    const fetchJappa = async () => {
        if (!params.id) return;
        try {
            const docSnap = await getDoc(doc(db, "jappa_posts", params.id as string));
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Konversi Timestamp ke Date jika ada
                let formattedDate = "Baru saja";
                if (data.createdAt) {
                    formattedDate = data.createdAt.toDate().toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    });
                }
                setItem({ id: docSnap.id, ...data, formattedDate });
            } else {
                console.log("Artikel tidak ditemukan!");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchJappa();
  }, [params.id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  
  if (!item) return (
    <div className="h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
        <p>Artikel tidak ditemukan.</p>
        <Link href="/" className="text-blue-600 hover:underline font-bold">Kembali ke Home</Link>
    </div>
  );

  return (
    <>
      <main className="bg-white min-h-screen pb-24 md:pb-10">
        
        {/* === HEADER === */}
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm border-b border-gray-100">
          <Link href={backLink} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Jappa News</h1>
          <button className="p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </header>

        {/* === KONTEN ARTIKEL === */}
        <div className="max-w-2xl mx-auto bg-white">
          
          {/* Gambar Utama */}
          <div className="relative w-full aspect-video bg-gray-100 md:rounded-b-2xl overflow-hidden shadow-sm">
            {item.image ? (
                <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover" 
                    priority 
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>

          <div className="px-6 py-6">
            {/* Judul */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {item.title}
            </h1>
            
            {/* Category Badge */}
            {item.category && (
              <div className="mb-3">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white ${
                  item.category === "wisata" ? "bg-green-600" : "bg-purple-600"
                }`}>
                  {item.category === "wisata" ? "🏖️ Wisata" : "🎭 Event"}
                </span>
              </div>
            )}
            
            {/* Metadata (Author & Date) */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1.5 text-blue-600" />
                <span className="font-medium text-gray-700">{item.author || "Admin Jappa"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>{item.formattedDate}</span>
              </div>
            </div>

            {/* Isi Artikel */}
            <article className="prose prose-gray max-w-none text-gray-700 leading-7 text-justify text-[15px] md:text-base whitespace-pre-wrap">
              {/* Jika konten berupa array (paragraf), map. Jika string panjang, tampilkan langsung */}
              {Array.isArray(item.content) ? (
                 item.content.map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                 ))
              ) : (
                 <p>{item.content || "Belum ada konten."}</p>
              )}
            </article>

            {/* Footer Artikel */}
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
      
      {/* Bottom Nav tetap ada untuk akses cepat ke menu lain */}
      <BottomNavBar />
    </>
  );
}