"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, query, where, onSnapshot, getDocs, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface WishlistButtonDetailProps {
  itemId: string;
  itemType: "event" | "wisata";
  itemData?: any; // Data tambahan seperti title, image, price, dll
}

export default function WishlistButtonDetail({ itemId, itemType, itemData }: WishlistButtonDetailProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // CEK AUTH
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  // CEK WISHLIST STATUS
  useEffect(() => {
    if (!currentUser || !itemId) {
      setIsWishlisted(false);
      return;
    }

    console.log(`Checking wishlist for user: ${currentUser.uid}, ${itemType}: ${itemId}`);

    // Query berdasarkan itemType
    const fieldName = itemType === "event" ? "eventId" : "wisataId";
    const q = query(
      collection(db, "wishlists"),
      where("userId", "==", currentUser.uid),
      where(fieldName, "==", itemId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const exists = !snapshot.empty;
      console.log("Wishlist status:", exists);
      setIsWishlisted(exists);
    }, (error) => {
      console.error("Error checking wishlist:", error);
    });

    return () => unsubscribe();
  }, [currentUser, itemId, itemType]);

  const toggleWishlist = async () => {
    console.log("Toggle wishlist - Current user:", currentUser);

    // 1. Cek Login
    if (!currentUser) {
      console.log("User not logged in, redirecting to login");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const fieldName = itemType === "event" ? "eventId" : "wisataId";

      if (isWishlisted) {
        console.log("Removing from wishlist...");
        // Hapus dari wishlist
        const q = query(
          collection(db, "wishlists"),
          where("userId", "==", currentUser.uid),
          where(fieldName, "==", itemId)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
        console.log("Removed from wishlist");
      } else {
        console.log("Adding to wishlist...");
        // Tambah ke wishlist dengan data lengkap
        const wishlistData: any = {
          userId: currentUser.uid,
          type: itemType,
          createdAt: serverTimestamp()
        };

        // Tambahkan field berdasarkan tipe
        if (itemType === "event") {
          wishlistData.eventId = itemId;
          if (itemData) {
            wishlistData.eventTitle = itemData.title;
            wishlistData.eventImage = itemData.image;
            wishlistData.eventCategory = itemData.category;
            wishlistData.eventLocation = itemData.location;
            wishlistData.eventDate = itemData.date;
            wishlistData.eventTime = itemData.time;
            wishlistData.eventPrice = itemData.price;
          }
        } else {
          wishlistData.wisataId = itemId;
          if (itemData) {
            wishlistData.wisataTitle = itemData.title;
            wishlistData.wisataImage = itemData.image;
            wishlistData.wisataLocation = itemData.location;
            wishlistData.wisataPrice = itemData.price;
          }
        }

        await addDoc(collection(db, "wishlists"), wishlistData);
        console.log("Added to wishlist");
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
