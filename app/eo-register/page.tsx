'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link untuk navigasi
import { User, Mail, FileText, ArrowRight, CheckCircle, Loader2, ChevronLeft } from 'lucide-react'; // Tambah ChevronLeft
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// --- KONFIGURASI FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCTxUxarVP6NsKT74FDyDFkC1irsb8Ny5Y",
  authDomain: "jappajappa-47796.firebaseapp.com",
  projectId: "jappajappa-47796",
  storageBucket: "jappajappa-47796.firebasestorage.app",
  messagingSenderId: "551636996244",
  appId: "1:551636996244:web:6d3f99a81942036e932481",
  measurementId: "G-YTXMC8DM02"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export default function EORegistrationPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk Data Teks
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ktp: '',
    portfolio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Login Anonim
      try {
        await signInAnonymously(auth);
      } catch (authError: any) {
        console.warn("Auth anonim warning:", authError.code);
      }

      // 2. Simpan data ke Firestore
      await addDoc(collection(db, "users"), {
        ...formData,
        role: "eo",            
        status: "pending",     
        createdAt: serverTimestamp()
      });

      setStep(2);
    } catch (error: any) {
      console.error("Error submitting: ", error);
      let message = "Gagal mengirim data.";
      if (error.message) {
        message = `Gagal: ${error.message}`;
      }
      alert(message);
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
          <a href="/" className="text-blue-600 font-semibold hover:underline">Kembali ke Beranda</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* --- TOMBOL BACK (BARU) --- */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Kembali
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Gabung Sebagai Partner</h1>
          <p className="mt-2 text-gray-600">Daftarkan diri/organisasi Anda sebagai Event Organizer resmi di JappaJappa.</p>
        </div>

        <div className="bg-white py-8 px-10 shadow-lg rounded-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Nama */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Nama Organisasi / EO</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <User size={18} className="text-gray-500" />
                 </div>
                 <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Contoh: Makassar Creative Hub"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            
            {/* Input Email */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Email Penanggung Jawab</label>
              <input
                type="email"
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            {/* Input Telepon */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            {/* Input KTP */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Nomor KTP / NIB</label>
              <input
                type="text"
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.ktp}
                onChange={(e) => setFormData({...formData, ktp: e.target.value})}
              />
            </div>
            
            {/* Input Portfolio */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Link Portofolio</label>
              <input
                type="url"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.portfolio}
                onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Kirim Pendaftaran <ArrowRight size={18} /></span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}