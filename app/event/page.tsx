// app/event/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { Search, MapPin, Calendar, ChevronDown, Bell, User } from "lucide-react";
import BottomNavBar from "../components/Header"; 

// --- DATA DUMMY (LISTING) ---
const eventsData = [
  {
    id: 1,
    title: "Konser Senja",
    date: "25 Nov 2025",
    location: "Pantai Losari",
    price: "Rp 75.000",
    image: "https://images.unsplash.com/photo-1459749411177-0473ef716176?q=80&w=1000&auto=format&fit=crop",
    category: "Konser"
  },
  {
    id: 2,
    title: "RITECH 2025",
    date: "01 Des 2025",
    location: "CPI Makassar",
    price: "Gratis",
    image: "https://images.unsplash.com/photo-1540575467063-178a5093df60?q=80&w=1000&auto=format&fit=crop",
    category: "Pameran"
  },
  {
    id: 3,
    title: "Festival Coto",
    date: "21 Nov 2025",
    location: "Fort Rotterdam",
    price: "Rp 50.000",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
    category: "Festival"
  },
  {
    id: 4,
    title: "Jazz Pantai Bira",
    date: "15 Des 2025",
    location: "Tanjung Bira",
    price: "Rp 100.000",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop",
    category: "Konser"
  },
];

export default function EventPage() {
  return (
    <>
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-10">
        
        {/* Navbar Desktop */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
          <div className="text-2xl font-bold text-blue-600">Jappa.</div>
          <div className="flex space-x-8 font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/event" className="text-blue-600">Event</Link>
            <Link href="/wisata" className="hover:text-blue-600">Wisata</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
            
            {/* PERBAIKAN DI SINI: Link ke Profile */}
            <Link href="/profile">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </Link>
          </div>
        </nav>

        {/* Hero Header */}
        <div className="relative h-56 md:h-72 w-full">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
            alt="Event Background"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-screen-xl mx-auto w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-4">Event</h1>
            <div className="relative w-full md:max-w-2xl">
              <input type="text" placeholder="Cari event..." className="w-full py-3.5 px-5 pl-12 rounded-full bg-white text-gray-800 shadow-lg focus:outline-none" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* List Event */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventsData.map((event) => (
              <Link href={`/event/${event.id}`} key={event.id}> 
                <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-48 w-full bg-gray-200">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1 whitespace-nowrap">
                        <Calendar className="w-3 h-3 mr-1.5" />{event.date}
                      </div>
                    </div>
                    <hr className="border-gray-100 mb-3" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-500 text-sm truncate pr-4">
                        <MapPin className="w-4 h-4 mr-1.5" /><span className="truncate">{event.location}</span>
                      </div>
                      <div className="text-sm font-bold text-gray-900 whitespace-nowrap">{event.price}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}