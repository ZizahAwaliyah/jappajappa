"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, MapPin, Heart, Trash2, Calendar } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import BottomNavBar from "../components/Header";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromWishlist(id);
      setRemovingId(null);
    }, 300);
  };

  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        {/* === HEADER === */}
        <header className="bg-white sticky top-0 z-50 px-4 py-4 flex items-center shadow-sm">
          <Link
            href="/profile"
            className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center mr-10">
            Wishlist Saya
          </h1>
        </header>

        {/* === KONTEN === */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          {wishlist.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Wishlist Kosong
              </h2>
              <p className="text-gray-500 mb-6 max-w-sm">
                Anda belum menambahkan destinasi atau event ke wishlist. Mulai jelajahi dan simpan favorit Anda!
              </p>
              <div className="flex gap-3">
                <Link
                  href="/wisata"
                  className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  Jelajahi Wisata
                </Link>
                <Link
                  href="/event"
                  className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
                >
                  Jelajahi Event
                </Link>
              </div>
            </div>
          ) : (
            // Wishlist Grid
            <div className="grid grid-cols-1 gap-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${
                    removingId === item.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <Link
                    href={item.type === "wisata" ? `/wisata/${item.id}` : `/event/${item.id}`}
                    className="flex gap-4 p-4"
                  >
                    {/* Gambar */}
                    <div className="relative w-28 h-28 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      {/* Badge Type */}
                      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        item.type === "event" ? "bg-purple-600" : "bg-blue-600"
                      }`}>
                        {item.type === "event" ? "EVENT" : "WISATA"}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        {item.type === "event" ? (
                          <>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              <p className="line-clamp-1">{item.date}</p>
                            </div>
                            {item.price && (
                              <p className="text-sm font-bold text-purple-600">{item.price}</p>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            <p className="line-clamp-1">{item.location}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Ditambahkan {new Date(item.addedAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </Link>

                  {/* Tombol Hapus */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus dari Wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Footer */}
          {wishlist.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-900 text-center">
                <span className="font-bold">{wishlist.length}</span> item tersimpan di wishlist Anda
              </p>
              <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600">
                <span>
                  {wishlist.filter(item => item.type === "wisata").length} Wisata
                </span>
                <span>•</span>
                <span>
                  {wishlist.filter(item => item.type === "event").length} Event
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNavBar />
    </>
  );
}