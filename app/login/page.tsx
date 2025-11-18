// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight } from 'lucide-react';
import { auth } from '../../lib/firebase';
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// --- Komponen Ikon (Anda bisa letakkan di file terpisah) ---
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="m6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="m24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="m43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,34.426,44,28.099,44,20C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.01,1.76c-2.34,0-4.57,1.04-6.13,2.71c-1.63,1.73-2.61,4.04-2.61,6.46c0,2.6,0.92,4.8,2.44,6.45c0.75,0.81,1.6,1.26,2.6,1.3c1.01,0.04,2.02-0.34,3.01-0.34c0.91,0,1.82,0.34,2.83,0.34c1.04,0,1.92-0.45,2.65-1.29c1.55-1.68,2.4-3.89,2.4-6.49c0-2.43-1-4.78-2.66-6.52C16.59,2.79,14.36,1.76,12.01,1.76z M15.4,7.57c0.16,1.21-0.47,2.47-1.36,3.31c-0.89,0.84-2.11,1.4-3.3,1.34c-0.12-1.21,0.48-2.47,1.36-3.31C12.98,8.08,14.18,7.5,15.4,7.57z"/>
  </svg>
);
// -----------------------------------------------------------

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // redirect after successful login
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Gagal masuk dengan Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new OAuthProvider('apple.com');
      // Jika butuh scope, uncomment misal: provider.addScope('email');
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Gagal masuk dengan Apple');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Gagal login dengan email/password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Container Form dengan efek glassmorphism
        - bg-white/70: Latar belakang putih dengan 70% opacity
        - backdrop-blur-lg: Efek blur pada elemen di belakangnya
        - rounded-3xl: Sesuai wireframe
      */}
      <div className="relative w-full max-w-md p-8 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to Jappa
        </h1>

        {/* --- Social Login --- */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-5 bg-white rounded-full border border-gray-300 shadow-sm hover:bg-gray-50 transition-all duration-200"
          >
            <GoogleIcon className="mr-3" />
            <span className="font-medium text-gray-700">Lanjutkan dengan Google</span>
          </button>

          <button
            type="button"
            onClick={handleAppleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-5 bg-black text-white rounded-full border border-gray-800 shadow-sm hover:bg-gray-800 transition-all duration-200"
          >
            {/* Ganti 'apple.svg' dengan nama file di folder public/logo Anda, mis. '/logo/apple.png' */}
            <img src="/logo/apple.svg" alt="Apple" className="h-7 w-7 mr-3 object-contain" />
            <span className="font-medium">Lanjutkan dengan Apple</span>
          </button>
        </div>

        {/* --- Separator --- */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-sm font-medium text-gray-500">atau</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* --- Form Login --- */}
        <form className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Username"
              className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center py-3 px-5 bg-black text-white rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Login
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </form>

        {/* --- Link ke Sign Up --- */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Belum punya akun?{' '}
          <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>

      </div>
    </main>
  );
}