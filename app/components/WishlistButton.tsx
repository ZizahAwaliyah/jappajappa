"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, deleteDoc, query, where, onSnapshot, getDocs } from "firebase/firestore";

export default function WishlistButton() {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const wisataId = params?.id as string;

  // 1. CEK USER LOGIN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. CEK WISHLIST STATUS
  useEffect(() => {
    if (!currentUser || !wisataId) return;

    const q = query(
      collection(db, "wishlists"),
      where("userId", "==", currentUser.uid),
      where("wisataId", "==", wisataId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIsWishlisted(!snapshot.empty);
    });

    return () => unsubscribe();
  }, [currentUser, wisataId]);

  const toggleWishlist = async () => {
    // 1. Cek Login
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        // Hapus dari wishlist
        const q = query(
          collection(db, "wishlists"),
          where("userId", "==", currentUser.uid),
          where("wisataId", "==", wisataId)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      } else {
        // Tambah ke wishlist
        await addDoc(collection(db, "wishlists"), {
          userId: currentUser.uid,
          wisataId: wisataId,
          createdAt: new Date()
        });
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      alert(`❌ Gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className="p-2 rounded-full hover:bg-gray-50 transition-colors focus:outline-none group disabled:opacity-50"
      aria-label="Tambah ke Wishlist"
    >
      <Heart
        className={`w-6 h-6 transition-all duration-300 ${
          isWishlisted
            ? "text-red-500 fill-red-500 scale-110"
            : "text-gray-600 fill-transparent group-hover:text-gray-900"
        }`}
      />
    </button>
  );
}