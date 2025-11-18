// app/components/BottomNavBar.tsx
"use client"; // Komponen ini perlu state/interaksi, jadi gunakan "use client"

import { Home, MapPin, Activity, User } from 'lucide-react';

export default function BottomNavBar() {
  // Ganti ikon sesuai wireframe Anda. Saya gunakan Activity & User.
  const icons = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: MapPin, label: 'Discover' },
    { id: 'activity', icon: Activity, label: 'Activity' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  // Anda bisa menggunakan state untuk melacak item yang aktif
  const activeItem = 'home'; 

  return (
    /* - Navigasi ini fix di bawah
      - Memiliki bayangan (shadow) di atasnya
      - Melengkung di sudut kiri-atas dan kanan-atas
      - md:hidden: Akan hilang di tampilan desktop
    */
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-2xl md:hidden">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
        
        {icons.map((item) => (
          <button
            key={item.id}
            className={`p-2 rounded-full transition-colors duration-200 ${
              activeItem === item.id
                ? 'text-blue-600 bg-blue-50' // Style untuk item aktif
                : 'text-gray-400 hover:text-gray-700' // Style untuk item non-aktif
            }`}
          >
            {/* Menggunakan strokeWidth tebal agar mirip wireframe */}
            <item.icon className="h-7 w-7" strokeWidth={activeItem === item.id ? 2.5 : 2} />
          </button>
        ))}

      </div>
    </nav>
  );
}