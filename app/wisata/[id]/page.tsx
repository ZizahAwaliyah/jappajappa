"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ChevronLeft, ThumbsUp, Link as LinkIcon, MessageCircle, Instagram, Clock, Map, Loader2, Star, Send } from "lucide-react";
import BottomNavBar from "../../components/Header";
import WishlistButtonDetail from "../../components/WishlistButtonDetail";
// IMPORT FIREBASE
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, query, where, onSnapshot } from "firebase/firestore";
import { addDoc, serverTimestamp } from "firebase/firestore";

export default function WisataDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fromSearch = searchParams.get('from') === 'search';
  const backLink = fromSearch ? "/search" : "/wisata";

  const [wisata, setWisata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(12);
  const [hasLiked, setHasLiked] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. CEK USER LOGIN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.email);
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. FETCH DETAIL WISATA
  useEffect(() => {
    const fetchWisata = async () => {
      try {
        if (!params.id) return;
        const docRef = doc(db, "wisata", params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWisata(docSnap.data());
        } else {
          console.log("No such document!");
          setWisata(null);
        }
      } catch (error) {
        console.error("Error fetching wisata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWisata();
  }, [params.id]);

  // 3. FETCH REVIEWS
  useEffect(() => {
    if (!params.id) return;
    try {
      const q = query(collection(db, "reviews"), where("wisataId", "==", params.id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        reviewsData.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setReviews(reviewsData);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [params.id]);

  // 4. HANDLE SUBMIT REVIEW
  const handleSubmitReview = async () => {
    if (!currentUser) {
      alert("Silakan login untuk memberikan ulasan.");
      return;
    }
    if (userRating === 0) {
      alert("Mohon berikan rating bintang (1-5).");
      return;
    }
    if (!reviewText.trim()) {
      alert("Mohon tulis pengalaman Anda.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "reviews"), {
        wisataId: params.id,
        userName: currentUser.displayName || currentUser.email || "Pengguna Jappa",
        userId: currentUser.uid,
        rating: userRating,
        comment: reviewText,
        createdAt: serverTimestamp()
      });

      setReviewText("");
      setUserRating(0);
      alert("✅ Ulasan berhasil ditambahkan!");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      alert(`❌ Gagal: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = () => {
    if (hasLiked) { setLikes(likes - 1); setHasLiked(false); } 
    else { setLikes(likes + 1); setHasLiked(true); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (!wisata) return <div className="h-screen flex items-center justify-center text-gray-500">Data wisata tidak ditemukan.</div>;

  return (
    <>
      <main className="bg-white min-h-screen pb-24 md:pb-10">
        
        {/* HEADER */}
        <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
          <Link href={backLink} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center truncate mx-2">
            {wisata.title}
          </h1>
          <WishlistButtonDetail
            itemId={params.id as string}
            itemType="wisata"
            itemData={{
              title: wisata.title,
              image: wisata.mainImage,
              location: wisata.location || wisata.address,
              price: wisata.ticketPrice || 0
            }}
          />
        </header>

        {/* KONTEN UTAMA */}
        <div className="max-w-2xl mx-auto px-6 py-6">
          
          <div className="relative w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-6 shadow-md">
            {wisata.mainImage && (
                <Image src={wisata.mainImage} alt={wisata.title} fill className="object-cover" priority />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex flex-col items-center justify-center text-center">
                <div className="flex items-center text-orange-600 mb-1">
                   <Clock className="w-4 h-4 mr-1.5" /> <span className="text-xs font-bold uppercase">Jam Buka</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{wisata.openHours || "-"}</span>
             </div>
             <a href={wisata.gmapsLink || "#"} target="_blank" rel="noopener noreferrer" className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center hover:bg-blue-100 transition-colors group cursor-pointer">
                <div className="flex items-center text-blue-600 mb-1">
                   <Map className="w-4 h-4 mr-1.5" /> <span className="text-xs font-bold uppercase">Lokasi</span>
                </div>
                <span className="text-sm font-medium text-blue-700 underline decoration-blue-300 group-hover:decoration-blue-600">Lihat di Google Maps</span>
             </a>
          </div>

          <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify mb-6 whitespace-pre-wrap">
            {wisata.description1}
          </p>

          {wisata.gallery && wisata.gallery.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
                {wisata.gallery.map((img: string, index: number) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                ))}
            </div>
          )}

          <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify mb-10 whitespace-pre-wrap">
            {wisata.description2}
          </p>

          {/* === INTERAKSI LIKE & SHARE === */}
          <div className="flex flex-col items-center space-y-8 mb-12">
            <button onClick={handleLike} className={`flex items-center space-x-2 px-6 py-2 rounded-full border transition-all shadow-sm ${hasLiked ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
              <ThumbsUp className={`w-5 h-5 ${hasLiked ? "fill-blue-600" : ""}`} />
              <span className="font-bold">{likes}</span>
            </button>
            <div className="w-full border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-6 border-b border-gray-100 pb-4">Bagikan</h3>
              <div className="flex justify-around items-center px-4">
                <button className="flex flex-col items-center group"><div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"><MessageCircle className="w-7 h-7" /></div><span className="text-[10px] text-gray-600 mt-2 font-medium">WhatsApp</span></button>
                <button className="flex flex-col items-center group"><div className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"><Instagram className="w-7 h-7" /></div><span className="text-[10px] text-gray-600 mt-2 font-medium">Instagram</span></button>
                <button className="flex flex-col items-center group"><div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 shadow-md group-hover:bg-gray-50 transition-colors"><LinkIcon className="w-6 h-6" /></div><span className="text-[10px] text-gray-600 mt-2 font-medium">Copy Link</span></button>
              </div>
            </div>
          </div>

          {/* === SECTION ULASAN (REVIEW) === */}
          <section className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Ulasan Pengunjung ({reviews.length})</h3>

            {/* Form Input Review */}
            <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Bagikan Pengalamanmu</h4>
                
                {/* Star Rating Input */}
                <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star} 
                            type="button" 
                            onClick={() => setUserRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star className={`w-8 h-8 ${star <= userRating ? "text-orange-400 fill-orange-400" : "text-gray-300"}`} />
                        </button>
                    ))}
                </div>

                {/* Text Area */}
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Ceritakan pengalaman serumu di sini..."
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 h-24 resize-none bg-white"
                ></textarea>

                <button 
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <><Send className="w-4 h-4" /> Kirim Ulasan</>}
                </button>
            </div>

            {/* List Ulasan */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-4">Belum ada ulasan. Jadilah yang pertama!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-50 pb-6 last:border-none">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {review.userName?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{review.userName}</p>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-orange-400 fill-orange-400" : "text-gray-200"}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {review.createdAt instanceof Date
                                        ? review.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                        : review.createdAt?.toDate?.().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                    }
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mt-2 pl-[52px]">
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
          </section>

        </div>
      </main>
      <BottomNavBar />
    </>
  );
}