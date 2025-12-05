// app/signup/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Phone, ArrowRight } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// --- Komponen Ikon (Anda bisa letakkan di file terpisah) ---
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="m6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="m24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="m43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,34.426,44,28.099,44,20C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);


// -----------------------------------------------------------

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Save minimal profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName || username || null,
        email: user.email || null,
        phone: user.phoneNumber || phone || null,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Gagal daftar dengan Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName || username || null,
        email: user.email || null,
        phone: user.phoneNumber || phone || null,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Gagal daftar dengan Apple');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi tidak sama');
      return;
    }
    if (!email) {
      setError('Email wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      // update display name
      if (username) {
        await updateProfile(user, { displayName: username });
      }
      // save extra profile data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: username || null,
        email: user.email || null,
        phone: phone || null,
        createdAt: serverTimestamp(),
      });
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Gagal membuat akun');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-full max-w-md p-8 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Buat Akun Jappa
        </h1>

        {/* --- Social Login --- */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-5 bg-white rounded-full border border-gray-300 shadow-sm hover:bg-gray-50 transition-all duration-200"
          >
            <GoogleIcon className="mr-3" />
            <span className="font-medium text-gray-700">Daftar dengan Google</span>
          </button>
          <button
            type="button"
            onClick={handleAppleSignUp}
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

        {/* --- Form Sign Up --- */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text" 
              placeholder="Username"
              className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email" 
              placeholder="Email"
              className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password" 
              placeholder="Password"
              className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password" 
              placeholder="Konfirmasi Password"
              className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-5 bg-black text-white rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {loading ? 'Memproses...' : 'Daftar'}
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </form>

        {/* --- Link ke Login --- */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Login di sini
          </Link>
        </p>

      </div>
    </main>
  );
}