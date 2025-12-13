// app/signup/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Tambahkan Eye dan EyeOff
import { User, Lock, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react'; 
import { auth, db } from '../../lib/firebase';
import {
	createUserWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
	// State untuk mengontrol visibilitas password
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
		if (password.length < 6) {
			setError('Password minimal 6 karakter');
			return;
		}
		setLoading(true);
		try {
			console.log('Starting sign up with email:', email);
			const cred = await createUserWithEmailAndPassword(auth, email, password);
			const user = cred.user;
			console.log('User created:', user.uid);

			// update display name
			if (username) {
				await updateProfile(user, { displayName: username });
				console.log('Display name updated');
			}

			// save extra profile data to Firestore
			await setDoc(doc(db, 'users', user.uid), {
				displayName: username || null,
				email: user.email || null,
				phone: phone || null,
				role: 'user',
				createdAt: serverTimestamp(),
			});
			console.log('User data saved to Firestore');

			// Set isLoggedIn flag untuk ProfileDropdown
			localStorage.setItem('isLoggedIn', 'true');
			localStorage.setItem('userRole', 'user');

			router.push('/');
		} catch (err: any) {
			console.error('Sign up error:', err);
			setError(err?.message || 'Gagal membuat akun');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="relative w-full max-w-md p-8 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200">

				<h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
					Buat Akun Jappa
				</h1>

				{/* --- Form Sign Up --- */}
				<form onSubmit={handleSignUp} className="space-y-4">
					<div className="relative">
						<User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input 
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							type="text" 
							placeholder="Username"
							className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
						/>
					</div>
					
					<div className="relative">
						<User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input 
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email" 
							placeholder="Email"
							className="w-full py-3 px-5 pl-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
						/>
					</div>

					{/* Input Password dengan Toggle */}
					<div className="relative">
						<Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input 
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type={showPassword ? "text" : "password"} 
							placeholder="Password"
							className="w-full py-3 px-5 pl-12 pr-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
						/>
						<button 
							type="button" 
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
						>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>

					{/* Input Konfirmasi Password dengan Toggle */}
					<div className="relative">
						<Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input 
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							type={showConfirmPassword ? "text" : "password"} 
							placeholder="Konfirmasi Password"
							className="w-full py-3 px-5 pl-12 pr-12 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
						/>
						<button 
							type="button" 
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
						>
							{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
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