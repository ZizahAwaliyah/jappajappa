// app/profile/page.tsx
import Link from "next/link";
import Image from "next/image"; // Menggunakan komponen Image dari Next.js
import { Camera, Edit, ChevronRight, LogOut } from "lucide-react";
import BottomNavBar from "../components/BottomNavBar"; // Asumsikan BottomNavBar ada di app/components

export default function ProfilePage() {
  const user = {
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    name: "Nama Anda",
    displayName: "dudududu",
    phoneNumber: "+111111111",
    email: "dudu@dugu.dodo",
  };

  return (
    <>
      <main className="bg-gray-100 min-h-screen pb-24 md:pb-8">
        {/* Wrapper untuk membatasi lebar di desktop */}
        <div className="max-w-screen-lg mx-auto">
          {/* === Header Profil === */}
          <header className="flex items-center justify-between p-4 bg-white md:bg-gray-100 border-b md:border-none">
            <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
            <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors">
              <LogOut className="w-4 h-4 mr-1" />
              Log out
            </button>
          </header>

          {/* === Banner Profil & Informasi Dasar === */}
          <section className="relative mx-4 mt-4 bg-white rounded-2xl shadow-lg p-5 overflow-hidden md:mx-0">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={user.profilePicture}
                alt="Profile Background"
                fill
                className="object-cover rounded-2xl opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>{" "}
              {/* Overlay gradien */}
            </div>

            {/* Konten di atas background */}
            <div className="relative z-10 flex flex-col items-center justify-center h-48 text-white">
              <div className="relative mb-3">
                {/* Placeholder/Icon untuk foto profil utama */}
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <Camera className="w-10 h-10 text-gray-600" />
                </div>
                {/* Tombol edit foto */}
                <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-md hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
            </div>
          </section>

          {/* === Detail Informasi Pengguna === */}
          <section className="mx-4 mt-6 bg-white rounded-2xl shadow-lg md:mx-0">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center text-gray-800 mb-2">
                <span className="font-semibold text-gray-600 text-sm">
                  Nama Tampilan
                </span>
                <button className="text-blue-600 text-sm font-medium flex items-center hover:underline">
                  Edit <Edit className="w-3 h-3 ml-1" />
                </button>
              </div>
              <p className="text-lg font-medium">{user.displayName}</p>
            </div>

            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center text-gray-800 mb-2">
                <span className="font-semibold text-gray-600 text-sm">
                  No Handphone
                </span>
                <button className="text-blue-600 text-sm font-medium flex items-center hover:underline">
                  Edit <Edit className="w-3 h-3 ml-1" />
                </button>
              </div>
              <p className="text-lg font-medium">{user.phoneNumber}</p>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center text-gray-800 mb-2">
                <span className="font-semibold text-gray-600 text-sm">
                  E-Mail
                </span>
                <button className="text-blue-600 text-sm font-medium flex items-center hover:underline">
                  Edit <Edit className="w-3 h-3 ml-1" />
                </button>
              </div>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
          </section>

          {/* === Bagian Wishlist & Riwayat Rating === */}
          <section className="mx-4 mt-6 bg-white rounded-2xl shadow-lg md:mx-0">
            <Link
              href="/wishlist"
              className="flex justify-between items-center p-5 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-800">Wishlist</span>
              <div className="flex items-center text-gray-500 text-sm">
                Detail <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link
              href="/history"
              className="flex justify-between items-center p-5 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-800">
                Riwayat Rating
              </span>
              <div className="flex items-center text-gray-500 text-sm">
                Detail <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </section>
        </div>
      </main>

      {/* === NAVIGASI BAWAH (Hanya muncul di HP) === */}
      {/* Pastikan komponen BottomNavBar Anda berada di app/components/BottomNavBar.tsx */}
      <BottomNavBar />
    </>
  );
}
