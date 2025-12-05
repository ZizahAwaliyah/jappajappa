// app/components/WishlistButton.tsx
"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function WishlistButton() {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Di sini nanti bisa tambah logika simpan ke database
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