"use client";

import Link from "next/link";
import { Twitter, Facebook, Linkedin, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F9FAFB] pt-16 pb-8 border-t border-gray-200 text-gray-600 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* === BAGIAN ATAS: GRID 5 KOLOM === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* KOLOM 1: BRAND & SOCIALS */}
          <div className="lg:col-span-1">
            <h2 className="text-lg md:text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">Jappa.</h2>
            <p className="text-sm leading-relaxed mb-6 text-gray-500">
              Kami menyediakan informasi event dan wisata terbaik di Sulawesi Selatan untuk pengalaman liburan tak terlupakan.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors text-gray-500 hover:text-blue-600">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors text-gray-500 hover:text-blue-600">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors text-gray-500 hover:text-blue-600">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors text-gray-500 hover:text-blue-600">
                <Instagram className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* KOLOM 2: COMPANY */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5">PERUSAHAAN</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Fitur</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Karya Kami</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Karir</Link></li>
            </ul>
          </div>

          {/* KOLOM 3: HELP */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5">BANTUAN</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Dukungan Pelanggan</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Detail Pengiriman</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* KOLOM 4: FAQ */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5">FAQ</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Akun</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Kelola Pesanan</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Pembayaran</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Pengembalian</Link></li>
            </ul>
          </div>

          {/* KOLOM 5: CONTACTS */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5">KONTAK</h3>
            <ul className="space-y-3 text-sm">
              <li>Jl. Faisal No. 13, Rappocini, Makassar</li>
              <li>+62 813 3466 7890</li>
              <li>name@jappa.id</li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                   Youtube Channel
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* === BAGIAN BAWAH: COPYRIGHT === */}
        <div className="border-t border-gray-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>Jappa © 2025, All Rights Reserved</p>
          <div className="mt-2 md:mt-0 flex space-x-6">
             {/* Opsional: Tambahan link kecil di bawah */}
          </div>
        </div>

      </div>
    </footer>
  );
}