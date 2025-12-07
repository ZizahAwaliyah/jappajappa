'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ArrowRight, CheckCircle, Loader2, ChevronLeft } from 'lucide-react'; 
// IMPORT DARI LIB
import { db, auth } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

export default function EORegistrationPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', ktp: '', portfolio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInAnonymously(auth).catch((err) => console.warn("Auth anonim:", err.code));
      await addDoc(collection(db, "users"), {
        ...formData,
        role: "eo",            
        status: "pending",     
        createdAt: serverTimestamp()
      });
      setStep(2);
    } catch (error: any) {
      console.error("Error:", error);
      alert("Gagal mengirim data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Terkirim!</h2>
          <p className="text-gray-600 mb-6">
            Data Anda telah tersimpan. Admin akan segera memverifikasi akun Anda.
          </p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" /> Kembali
          </Link>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Gabung Sebagai Partner</h1>
          <p className="mt-2 text-gray-600">Daftarkan diri/organisasi Anda sebagai Event Organizer resmi di JappaJappa.</p>
        </div>
        
        <div className="bg-white py-8 px-10 shadow-lg rounded-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Nama Organisasi / EO</label>
              <div className="relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-gray-500" /></div>
                 <input type="text" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Contoh: Makassar Creative Hub" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div><label className="block text-sm font-bold text-gray-900 mb-1">Email Penanggung Jawab</label><input type="email" required className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-gray-900 mb-1">Nomor WhatsApp</label><input type="tel" required className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-gray-900 mb-1">Nomor KTP / NIB</label><input type="text" required className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" value={formData.ktp} onChange={(e) => setFormData({...formData, ktp: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-gray-900 mb-1">Link Portofolio</label><input type="url" className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" value={formData.portfolio} onChange={(e) => setFormData({...formData, portfolio: e.target.value})} /></div>

            <div className="pt-4 space-y-4">
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-70">
                {isLoading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Kirim Pendaftaran <ArrowRight size={18} /></span>}
              </button>

              {/* --- TOMBOL LOGIN UNTUK EO YANG SUDAH TERDAFTAR --- */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Sudah terdaftar sebagai Partner?{' '}
                  {/* UPDATE: Tambahkan query param ?role=admin agar otomatis masuk mode Admin/EO */}
                  <Link href="/login?role=admin" className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}