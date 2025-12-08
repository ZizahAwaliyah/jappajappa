"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, LogOut, Ticket, LayoutDashboard, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const status = localStorage.getItem("isLoggedIn");
      const role = localStorage.getItem("userRole");
      const name = localStorage.getItem("userName");
      setIsLoggedIn(status === "true");
      setUserRole(role);
      if (name) setUserName(name);

      // Also listen to Firebase Auth for displayName updates
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          if (user.displayName) setUserName(user.displayName);
        } else {
          setUserName(null);
        }
      });

      return () => unsub();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
    } catch (err) {
      console.error('Firebase sign out error:', err);
    }
    
    // Clear localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    setIsOpen(false);
    
    // Redirect and reload
    router.push("/");
    window.location.reload();
  };

  const getIconColor = () => {
    if (userRole === "admin") return "bg-red-100 text-red-600";
    if (userRole === "eo") return "bg-orange-100 text-orange-600";
    return "bg-blue-100 text-blue-600";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BUTTON PROFILE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all focus:outline-none ring-2 ring-transparent focus:ring-gray-200 ${
          isLoggedIn ? getIconColor() : "bg-gray-100 hover:bg-gray-200 text-gray-600"
        }`}
      >
        <User className="w-5 h-5" />
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-9999 animate-in fade-in zoom-in-95 duration-100 origin-top-right">

          {/* ===================== */}
          {/*      SUDAH LOGIN      */}
          {/* ===================== */}
          {isLoggedIn ? (
            <>
              {/* HEADER USER */}
              <div className="px-5 py-3 border-b border-gray-50 mb-1 bg-gray-50/50 rounded-t-xl">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Halo,</p>
                <p className="text-sm font-bold text-gray-900 capitalize truncate">
                  {userRole === "admin"
                    ? "Admin Jappa"
                    : userRole === "eo"
                    ? "Event Organizer"
                    : (userName ? userName : "Pengunjung")}
                </p>
              </div>

              {/* ADMIN MENU */}
              {userRole === "admin" && (
                <div className="py-1">
                  <Link href="/admin/profile" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4 mr-3 opacity-70" /> Account
                  </Link>
                  <Link href="/admin/dashboard" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 mr-3 opacity-70" /> Dashboard
                  </Link>
                  <Link href="/admin/sold-tickets" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                    <FileText className="w-4 h-4 mr-3 opacity-70" /> Tiket Terjual
                  </Link>
                </div>
              )}

              {/* EO MENU */}
              {userRole === "eo" && (
                <div className="py-1">
                  <Link href="/event-organizer/profile" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4 mr-3 opacity-70" /> Account
                  </Link>
                  <Link href="/event-organizer/dashboard" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 mr-3 opacity-70" /> Dashboard
                  </Link>
                  <Link href="/event-organizer/sold-tickets" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors" onClick={() => setIsOpen(false)}>
                    <Ticket className="w-4 h-4 mr-3 opacity-70" /> Tiket Terjual
                  </Link>
                </div>
              )}

              {/* USER BIASA */}
              {(userRole === "user" || !userRole) && (
                <div className="py-1">
                  <Link href="/profile" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4 mr-3 opacity-70" /> Account
                  </Link>
                  <Link href="/myticket" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                    <Ticket className="w-4 h-4 mr-3 opacity-70" /> Tiket Saya
                  </Link>
                </div>
              )}

              {/* LOGOUT BUTTON */}
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" /> Logout
              </button>
            </>
          ) : (
            <>
              {/* ===================== */}
              {/*      BELUM LOGIN      */}
              {/* ===================== */}
              <div className="py-1">

                <div className="px-5 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs text-gray-500 font-medium">Akun Saya</p>
                </div>

                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Sign Up
                </Link>

                <div className="border-t border-gray-100 my-1"></div>

                <Link
                  href="/eo-register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-5 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                  Event Organizer
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
