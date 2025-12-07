"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, ShieldCheck, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [step, setStep] = useState<'role-selection' | 'login-form'>('role-selection');
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // LOGIKA UTAMA: Cek URL jika ada ?role=admin (dari link di halaman EO Register)
  useEffect(() => {
    const roleParam = searchParams.get('role');
    
    // Jika ada parameter role='admin', langsung set role dan skip ke form login
    if (roleParam === 'admin') {
      setRole('admin');
      setStep('login-form');
    }
  }, [searchParams]);

  const handleRoleSelect = (selectedRole: 'user' | 'admin') => {
    setRole(selectedRole);
    setStep('login-form');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi Login
    setTimeout(() => {
      // Simpan status login & role ke LocalStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role || "user");
      
      setIsLoading(false);
      
      // Redirect ke Home
      window.location.href = "/"; 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Masuk ke Jappa.
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 'role-selection' ? 'Pilih peran Anda untuk melanjutkan' : `Login sebagai ${role === 'admin' ? 'Admin / EO' : 'Pengunjung'}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">

          {/* Tombol Kembali disembunyikan jika user datang dari redirect otomatis (?role=admin) */}
          {step === 'login-form' && !searchParams.get('role') && (
            <button 
              onClick={() => setStep('role-selection')}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* === TAMPILAN 1: PILIH PERAN (Dilewati jika ada ?role=admin) === */}
          {step === 'role-selection' && (
            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect('user')}
                className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-lg font-bold text-gray-900">Pengunjung</h3>
                  <p className="text-xs text-gray-500">Beli tiket & cari wisata</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all group"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-lg font-bold text-gray-900">Admin / EO</h3>
                  <p className="text-xs text-gray-500">Kelola event & data</p>
                </div>
              </button>
            </div>
          )}

          {/* === TAMPILAN 2: FORM LOGIN (Langsung muncul jika ada ?role=admin) === */}
          {step === 'login-form' && (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    role === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all`}
                >
                  {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Masuk'}
                </button>
              </div>

              {/* Tampilkan link daftar User Biasa hanya jika yang login adalah User */}
              {role === 'user' && (
                <div className="text-center text-sm mt-4">
                  <span className="text-gray-600">Belum punya akun? </span>
                  <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Daftar di sini
                  </Link>
                </div>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// Wrap dengan Suspense agar aman di Next.js saat menggunakan useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}