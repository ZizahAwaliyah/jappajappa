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
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-green-100">
          <div className="w-24 h-24 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle size={50} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Pendaftaran Terkirim!</h2>
          <p className="text-gray-600 mb-2 text-lg font-medium">Selamat! 🎉</p>
          <p className="text-gray-500 mb-8">
            Data Anda telah tersimpan dengan aman. Tim admin kami akan segera memverifikasi akun Anda dalam waktu 1-2 hari kerja.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm text-blue-900"><span className="font-bold">💡 Tips:</span> Cek email Anda secara berkala untuk update status verifikasi.</p>
          </div>
          <Link href="/" className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all">
            <ArrowRight className="w-5 h-5" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradient elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-purple-300 hover:text-purple-100 transition-colors font-semibold gap-2 px-4 py-2 rounded-lg hover:bg-white/5">
            <ChevronLeft className="w-5 h-5" /> Kembali
          </Link>
        </div>

        {/* Header dengan Gradient */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6 px-6 py-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full">
            <p className="text-white text-sm font-bold">✨ Jadilah Event Organizer Resmi</p>
          </div>
          <h1 className="text-5xl font-black bg-linear-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-4">
            Gabung Sebagai Partner
          </h1>
          <p className="text-purple-200 text-lg max-w-xl mx-auto">
            Daftarkan diri/organisasi Anda sebagai Event Organizer resmi dan mulai menjual event bersama JappaJappa
          </p>
        </div>
        
        {/* Form Card dengan gradient border */}
        <div className="relative">
          {/* Border gradient effect */}
          <div className="absolute inset-0 bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl blur opacity-50"></div>
          <div className="relative bg-linear-to-b from-slate-800 to-slate-900 py-10 px-10 rounded-3xl border border-purple-500/30 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Field 1: Nama */}
              <div className="group">
                <label className="flex text-sm font-bold text-purple-200 mb-3 items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">1</div>
                  Nama Organisasi / EO
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User size={20} className="text-purple-400" /></div>
                  <input type="text" required className="block w-full pl-14 pr-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all hover:border-purple-500/60" placeholder="Contoh: Makassar Creative Hub" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              {/* Field 2: Email */}
              <div className="group">
                <label className="flex text-sm font-bold text-purple-200 mb-3 items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">2</div>
                  Email Penanggung Jawab
                </label>
                <input type="email" required className="block w-full px-4 py-3 bg-slate-700/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="nama@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              {/* Field 3: Password */}
              <div className="group">
                <label className="flex text-sm font-bold text-purple-200 mb-3 items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">3</div>
                  Password (untuk akun EO)
                </label>
                <input type="password" required minLength={6} className="block w-full px-4 py-3 bg-slate-700/50 border border-red-500/30 rounded-xl text-white placeholder-red-300/60 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" placeholder="Minimal 6 karakter" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>

              {/* Field 4: WhatsApp */}
              <div className="group">
                <label className="flex text-sm font-bold text-purple-200 mb-3 items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">4</div>
                  Nomor WhatsApp
                </label>
                <input type="tel" required className="block w-full px-4 py-3 bg-slate-700/50 border border-green-500/30 rounded-xl text-white placeholder-green-300/60 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" placeholder="+62 812 3456 7890" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>

              {/* Field 5: KTP/NIB */}
              <div className="group">
                <label className="flex text-sm font-bold text-purple-200 mb-3 items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">5</div>
                  Nomor KTP / NIB
                </label>
                <input type="text" required className="block w-full px-4 py-3 bg-slate-700/50 border border-orange-500/30 rounded-xl text-white placeholder-orange-300/60 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" placeholder="Contoh: 73250xxxxx1234xx" value={formData.ktp} onChange={(e) => setFormData({...formData, ktp: e.target.value})} />
              </div>

              {/* Field 6: Portfolio Link */}
              <div className="group">
                <label className="flex text-sm font-bold text-purple-200 mb-3 items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">6</div>
                  Link Portofolio EO
                </label>
                <input type="url" className="block w-full px-4 py-3 bg-slate-700/50 border border-indigo-500/30 rounded-xl text-white placeholder-indigo-300/60 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="https://portofolio.com" value={formData.portfolio} onChange={(e) => setFormData({...formData, portfolio: e.target.value})} />
              </div>

              {/* Field 7: Upload Surat Perizinan */}
              <div className="group">
                <label className="flex text-sm font-bold text-purple-200 mb-3 items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">7</div>
                  Surat Perizinan Usaha
                </label>
                {formData.portfolioImage ? (
                  <div className="relative group/img">
                    <img src={formData.portfolioImage} alt="Portfolio preview" className="w-full h-48 object-cover rounded-xl border-2 border-cyan-500/50 shadow-lg group-hover/img:border-cyan-500 transition-all" />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, portfolioImage: ''})}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg transition-all"
                    >
                      <X size={18} />
                    </button>
                    <p className="text-sm text-cyan-300 mt-2 font-medium">✅ Gambar berhasil diunggah</p>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-purple-500/40 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-300 group">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition-colors">
                        <Upload className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-sm text-purple-300 font-semibold">
                        Klik untuk upload
                      </p>
                      <p className="text-xs text-purple-400 mt-1">atau drag & drop</p>
                      <p className="text-xs text-purple-500/60 mt-2">PNG, JPG, WebP (Max 5MB)</p>
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
                  <div className="mt-3 flex items-center gap-2 text-purple-300 bg-purple-500/20 px-4 py-2 rounded-lg">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm font-medium">Mengupload gambar...</span>
                  </div>
                )}
              </div>

              <div className="pt-6 space-y-4 border-t border-purple-500/30">
                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-4 px-4 text-sm font-bold rounded-xl text-white bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <span>Kirim Pendaftaran</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-purple-300">
                    Sudah terdaftar sebagai Partner?{' '}
                    <Link href="/login?role=eo" className="font-bold text-transparent bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text hover:underline transition-colors">
                      Masuk di sini
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}