'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ArrowRight, CheckCircle, Loader2, ChevronLeft, Upload, X } from 'lucide-react'; 
// IMPORT DARI LIB
import { db, auth } from "@/lib/firebase"; 
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function EORegistrationPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', ktp: '', portfolio: '', portfolioImage: '', password: ''
  });

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setUploadingPortfolio(true);
    try {
      const imageUrl = await uploadToCloudinary(file, "jappajappa/portfolio");
      setFormData({ ...formData, portfolioImage: imageUrl });
      alert("Gambar berhasil diunggah!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal mengunggah gambar");
    } finally {
      setUploadingPortfolio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create Firebase Auth user for EO
      if (!formData.email || !formData.password) {
        alert('Email dan password wajib diisi untuk mendaftar sebagai Partner.');
        setIsLoading(false);
        return;
      }

      console.log('Membuat akun Firebase Auth untuk:', formData.email);
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = cred.user;
      console.log('✅ Akun Firebase Auth berhasil dibuat dengan UID:', user.uid);

      // set display name if provided
      if (formData.name) {
        await updateProfile(user, { displayName: formData.name }).catch(() => {});
      }

      // Save user data to Firestore using UID
      console.log('Menyimpan data ke Firestore...');
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ktp: formData.ktp,
        portfolio: formData.portfolio,
        portfolioImage: formData.portfolioImage,
        role: "eo",
        status: "pending",
        createdAt: serverTimestamp()
      });
      console.log('✅ Data berhasil disimpan ke Firestore dengan role: eo');

      alert(`Pendaftaran berhasil!\n\nEmail: ${formData.email}\nRole: Event Organizer\n\nSilakan login menggunakan email dan password yang sama.`);
      setStep(2);
    } catch (error: any) {
      console.error("❌ Error registrasi:", error);
      const code = error?.code || 'unknown';
      const message = error?.message || 'Gagal mengirim data';

      if (code === 'auth/email-already-in-use') {
        alert('Email sudah terdaftar. Silakan login atau gunakan email lain.');
      } else if (code === 'auth/invalid-email') {
        alert('Format email tidak valid.');
      } else if (code === 'auth/weak-password') {
        alert('Password terlalu lemah. Gunakan minimal 6 karakter.');
      } else {
        alert(`Gagal mendaftar: ${message}`);
      }
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
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Email Penanggung Jawab</label>
              <input type="email" required className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Password (untuk akun EO)</label>
              <input type="password" required minLength={6} className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Nomor WhatsApp</label>
              <input type="tel" required className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div><label className="block text-sm font-bold text-gray-900 mb-1">Nomor KTP / NIB</label><input type="text" required className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" value={formData.ktp} onChange={(e) => setFormData({...formData, ktp: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-gray-900 mb-1">Link Portofolio EO</label><input type="url" className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none" value={formData.portfolio} onChange={(e) => setFormData({...formData, portfolio: e.target.value})} /></div>

            {/* Upload Gambar Portofolio (Cloudinary) */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Surat Perizinan Usaha</label>
              {formData.portfolioImage ? (
                <div className="relative">
                  <img src={formData.portfolioImage} alt="Portfolio preview" className="w-full h-40 object-cover rounded-lg border border-gray-300" />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, portfolioImage: ''})}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePortfolioUpload}
                    disabled={uploadingPortfolio}
                    className="hidden"
                  />
                </label>
              )}
              {uploadingPortfolio && (
                <div className="mt-2 flex items-center gap-2 text-blue-600">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-sm">Mengupload gambar...</span>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-4">
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-70">
                {isLoading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Kirim Pendaftaran <ArrowRight size={18} /></span>}
              </button>

              {/* LINK LOGIN KHUSUS EO */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Sudah terdaftar sebagai Partner?{' '}
                  <Link href="/login?role=eo" className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
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