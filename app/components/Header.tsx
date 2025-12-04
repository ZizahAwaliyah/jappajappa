// app/components/BottomNavBar.tsx
"use client";

import { Home, User, Tent, Ticket } from 'lucide-react'; 

export default function BottomNavBar() {
  const activeItem = 'home'; 

  return (
    // md:hidden --> Sembunyikan elemen ini pada layar medium (tablet/desktop) ke atas
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 pb-safe md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        
        <button className={`p-2 flex flex-col items-center justify-center ${activeItem === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Home className="h-6 w-6 mb-0.5" strokeWidth={activeItem === 'home' ? 2.5 : 2} />
          {/* Label opsional untuk aksesibilitas */}
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button className="p-2 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
          <Tent className="h-6 w-6 mb-0.5" strokeWidth={2} />
          <span className="text-[10px] font-medium">Event</span>
        </button>

        <button className="p-2 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
          <Ticket className="h-6 w-6 mb-0.5" strokeWidth={2} />
          <span className="text-[10px] font-medium">Tiket</span>
        </button>

        <button className="p-2 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
          <User className="h-6 w-6 mb-0.5" strokeWidth={2} />
          <span className="text-[10px] font-medium">Profil</span>
        </button>

      </div>
    </nav>
  );
}