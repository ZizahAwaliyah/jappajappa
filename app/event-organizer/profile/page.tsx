"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Edit } from "lucide-react";

export default function EOProfilePage() {
  const [user] = useState({
    name: "Partner Event Organizer",
    email: "partner@jappa.id", // Read Only
    phone: "08123456789",
    orgName: "Creative Hub Makassar"
  });

  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-screen-md mx-auto">
        <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-50 shadow-sm">
           <div className="flex items-center gap-2">
              <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100"><ChevronLeft className="w-6 h-6" /></Link>
              <h1 className="text-lg font-bold text-gray-900">Profile Partner</h1>
           </div>
        </header>

        <section className="bg-white m-4 rounded-2xl shadow-sm overflow-hidden p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold border-4 border-white shadow-md">EO</div>
                <button className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full text-white shadow-md hover:bg-blue-700 transition-colors">
                  <Edit className="w-3 h-3" />
                </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.orgName}</h2>
            <p className="text-sm text-gray-500">Event Organizer</p>
        </section>

        <section className="bg-white m-4 rounded-2xl shadow-sm divide-y divide-gray-100">
            <div className="p-5">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Nama Penanggung Jawab</p>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </div>
            <div className="p-5">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Email (Tidak dapat diubah)</p>
                <p className="text-sm font-medium text-gray-500">{user.email}</p>
            </div>
            <div className="p-5 flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Nomor WhatsApp</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                </div>
                <button className="text-blue-600 text-sm font-bold hover:underline">Ubah</button>
            </div>
        </section>
      </div>
    </main>
  );
}