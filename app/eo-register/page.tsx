// app/eo-registration/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// Tambahkan Eye dan EyeOff
import { User, ArrowRight, CheckCircle, Loader2, ChevronLeft, Upload, X, Mail, Lock, Phone, CreditCard, Link as LinkIcon, Eye, EyeOff } from 'lucide-react'; 
// IMPORT DARI LIB
import { db, auth } from "@/lib/firebase"; 
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function EORegistrationPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
    // State untuk toggle password
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', ktp: '', portfolio: '', portfolioImage: '', password: ''
    });

    const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran file maksimal 5MB");
            return;
        }

        setUploadingPortfolio(true);
        try {
            const imageUrl = await uploadToCloudinary(file, "jappajappa/eo_permits");
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
            // Validasi di sisi klien
            if (!formData.email || !formData.password || !formData.name || !formData.phone || !formData.ktp) {
                alert('Semua kolom wajib diisi, kecuali link Portofolio.');
                setIsLoading(false);
                return;
            }
             if (formData.password.length < 6) {
                alert('Password minimal 6 karakter.');
                setIsLoading(false);
                return;
            }

            console.log('Membuat akun Firebase Auth untuk:', formData.email);
            const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = cred.user;
            console.log('✅ Akun Firebase Auth berhasil dibuat dengan UID:', user.uid);

            if (formData.name) {
                await updateProfile(user, { displayName: formData.name }).catch(() => {});
            }

            // Save user data to Firestore using UID
            console.log('Menyimpan data ke Firestore...');
            await setDoc(doc(db, "users", user.uid), {
                name: formData.name,
                email: user.email, 
                phone: formData.phone,
                ktp: formData.ktp,
                portfolio: formData.portfolio || null,
                portfolioImage: formData.portfolioImage || null,
                role: "eo",
                status: "pending", 
                createdAt: serverTimestamp()
            });
            console.log('✅ Data berhasil disimpan ke Firestore dengan role: eo');

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

    // --- Tampilan Sukses (Step 2) ---
    if (step === 2) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-200">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                        <CheckCircle size={50} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Pendaftaran Terkirim!</h2>
                    <p className="text-gray-600 mb-2 text-lg font-medium">Selamat! 🎉</p>
                    <p className="text-gray-500 mb-8">
                        Data Anda telah tersimpan dengan aman. Tim admin kami akan segera memverifikasi akun Anda dalam waktu 1-2 hari kerja.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
                        <p className="text-sm text-blue-900"><span className="font-bold">💡 Tips:</span> Setelah diverifikasi, Anda dapat login menggunakan email dan password yang didaftarkan.</p>
                    </div>
                    <Link href="/" className="inline-flex items-center justify-center gap-2 bg-black text-white font-bold px-8 py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all">
                        <ArrowRight className="w-5 h-5" /> Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    // --- Tampilan Form Pendaftaran (Step 1) ---
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">

            <div className="max-w-xl mx-auto relative z-10 w-full">
                
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors font-semibold gap-2 mb-4">
                        <ChevronLeft className="w-5 h-5" /> Kembali
                    </Link>
                    
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">
                        Daftar sebagai Partner EO
                    </h1>
                    <p className="text-gray-500 text-sm max-w-lg mx-auto">
                        Lengkapi detail organisasi Anda untuk diverifikasi.
                    </p>
                </div>
                
                <div className="relative w-full p-8 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input 
                                type="text" 
                                required 
                                className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
                                placeholder="Nama Organisasi / EO" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input 
                                type="email" 
                                required 
                                className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
                                placeholder="Email Penanggung Jawab" 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>

                        {/* Field 3: Password dengan Toggle */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                type={showPassword ? "text" : "password"} 
                                required 
                                minLength={6} 
                                className="w-full py-3 px-5 pl-12 pr-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
                                placeholder="Password (Minimal 6 karakter)" 
                            />
                            {/* Tombol Toggle Eye */}
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input 
                                type="tel" 
                                required 
                                className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
                                placeholder="Nomor WhatsApp" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                            />
                        </div>

                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input 
                                type="text" 
                                required 
                                className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
                                placeholder="Nomor KTP / NIB" 
                                value={formData.ktp} 
                                onChange={(e) => setFormData({...formData, ktp: e.target.value})} 
                            />
                        </div>

                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input 
                                type="url" 
                                className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
                                placeholder="Link Portofolio EO (Opsional)" 
                                value={formData.portfolio} 
                                onChange={(e) => setFormData({...formData, portfolio: e.target.value})} 
                            />
                        </div>

                        <div className="group pt-4 space-y-3 border-t border-gray-200">
                            <label className="block text-sm font-semibold text-gray-700">Upload Surat Perizinan Usaha</label>
                            
                            {formData.portfolioImage ? (
                                <div className="relative group/img">
                                    <img src={formData.portfolioImage} alt="Portfolio preview" className="w-full h-48 object-cover rounded-xl border border-gray-300 shadow-md" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, portfolioImage: ''})}
                                        className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                    <p className="text-sm text-green-600 mt-2 font-medium">✅ Gambar berhasil diunggah</p>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                                            <Upload className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <p className="text-sm text-gray-600 font-semibold">Klik untuk upload</p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP (Max 5MB)</p>
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
                                <div className="mt-3 flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                                    <Loader2 className="animate-spin" size={16} />
                                    <span className="text-sm font-medium">Mengupload gambar...</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 space-y-4">
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full flex justify-center items-center py-3 px-5 text-lg font-bold rounded-full text-white bg-black hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed gap-2 shadow-lg"
                            >
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

                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-600">
                                    Sudah terdaftar sebagai Partner?{' '}
                                    <Link href="/login?role=eo" className="font-semibold text-blue-600 hover:underline transition-colors">
                                        Masuk di sini
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}