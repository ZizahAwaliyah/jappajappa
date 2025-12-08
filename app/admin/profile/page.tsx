"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AdminProfilePage() {
  const [user] = useState({
    name: "Super Admin",
    email: "admin@jappa.id", // Read Only
    role: "Administrator"
  });

  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-50 shadow-sm">
           <div className="flex items-center gap-2">
              <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100"><ChevronLeft className="w-6 h-6" /></Link>
              <h1 className="text-lg font-bold text-gray-900">Profile Admin</h1>
           </div>
        </header>

        <section className="bg-white m-4 rounded-2xl shadow-sm overflow-hidden p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold border-4 border-white shadow-md">AD</div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.role}</p>
        </section>

        <section className="bg-white m-4 rounded-2xl shadow-sm divide-y divide-gray-100">
            <div className="p-5">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Email (Read Only)</p>
                <p className="text-sm font-medium text-gray-500">{user.email}</p>
            </div>
        </section>
      </div>
    </main>
  );
}