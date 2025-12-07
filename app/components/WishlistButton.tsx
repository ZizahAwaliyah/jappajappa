// app/components/WishlistButton.tsx
"use client";

import { Heart } from "lucide-react";
import { useWishlist, WishlistItem } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

interface WishlistButtonProps {
  item?: WishlistItem;
}

export default function WishlistButton({ item }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { requireAuth } = useAuth();
  const isWishlisted = item ? isInWishlist(item.id) : false;

  const toggleWishlist = () => {
    if (!item) return;

    // Cek auth dulu sebelum add/remove wishlist
    requireAuth(() => {
      if (isWishlisted) {
        removeFromWishlist(item.id);
      } else {
        addToWishlist(item);
      }
    });
    // Jika tidak authenticated, requireAuth akan redirect ke login
  };

  return (
    <button
      onClick={toggleWishlist}
      className="p-2 rounded-full hover:bg-gray-50 transition-colors focus:outline-none group"
      aria-label="Tambah ke Wishlist"
    >
      <Heart
        className={`w-6 h-6 transition-all duration-300 ${
          isWishlisted
            ? "text-red-500 fill-red-500 scale-110" // Merah & Penuh jika aktif
            : "text-gray-600 fill-transparent group-hover:text-gray-900" // Outline abu jika tidak aktif
        }`}
      />
    </button>
  );
}