"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, Ticket, LayoutDashboard, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const status = localStorage.getItem("isLoggedIn");
      const role = localStorage.getItem("userRole");
      setIsLoggedIn(status === "true");
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    setIsOpen(false);
    router.push("/");
    window.location.reload(); 
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors focus:outline-none ${
          isLoggedIn 
            ? (userRole === 'admin' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600") 
            : "bg-gray-200 hover:bg-gray-300 text-gray-600"
        }`}
      >
        <User className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          
          {/* === KONDISI SUDAH LOGIN === */}
          {isLoggedIn ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-gray-50/50">
                <p className="text-xs text-gray-500">Halo,</p>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {userRole === 'admin' ? 'Admin Jappa' : 'Pengunjung Jappa'}
                </p>
              </div>

              {/* --- MENU KHUSUS ADMIN --- */}
              {userRole === 'admin' ? (
                <>
                  <Link
                    href="/profile" 
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Account
                  </Link>

                  <Link
                    href="/admin/dashboard"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-3" />
                    Dashboard
                  </Link>

                  {/* PERBAIKAN LINK: Menjadi /admin/sold-ticket (tanpa s) */}
                  <Link
                    href="/admin/sold-tickets" 
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Tiket Terjual
                  </Link>
                </>
              ) : (
                /* --- MENU KHUSUS USER BIASA --- */
                <>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Account
                  </Link>

                  <Link
                    href="/myticket" 
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Ticket className="w-4 h-4 mr-3" />
                    Tiket Saya
                  </Link>
                </>
              )}

              <div className="border-t border-gray-100 my-1"></div>

              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </>
          ) : (
            /* === KONDISI BELUM LOGIN (GUEST) === */
            <>
              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="text-xs text-gray-500 font-medium">Akun Saya</p>
              </div>

              <Link
                href="/profile" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>

              <Link
                href="/eo-register"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Event Organizer
              </Link>

              <div className="border-t border-gray-100 my-1"></div>

              <Link
                href="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}