// app/login/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// Pastikan Eye dan EyeOff diimpor
import { User, ShieldCheck, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"; 
import { auth, db } from "@/lib/firebase";
import { 
    signInWithEmailAndPassword, 
} from "firebase/auth"; 
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [step, setStep] = useState<'role-selection' | 'login-form'>('role-selection');
    const [role, setRole] = useState<'user' | 'admin' | 'eo' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // State showPassword sudah ada dan dipertahankan
    const [showPassword, setShowPassword] = useState(false); 
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'admin') {
            setRole('admin');
            setStep('login-form');
        } else if (roleParam === 'eo') {
            setRole('eo');
            setStep('login-form');
        }
    }, [searchParams]);

    const handleRoleSelect = (selectedRole: 'user' | 'admin') => {
        setRole(selectedRole);
        setStep('login-form');
    };
    
    const handleRoleSelectEO = () => {
        setRole('eo');
        setStep('login-form');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        (async () => {
            try {
                const cred = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
                const user = cred.user;

                let userRole = 'user';
                
                if (role === 'admin' || role === 'eo') { 
                    userRole = role;
                    
                    try {
                        const userDocRef = doc(db, 'users', user.uid);
                        const userDoc = await getDoc(userDocRef);
                        
                        if (!userDoc.exists() || userDoc.data()?.role !== userRole) {
                            await setDoc(userDocRef, {
                                role: userRole,
                                email: user.email || emailInput,
                                createdAt: serverTimestamp()
                            }, { merge: true });
                            console.log(`✅ Ensured ${userRole} user doc for ${user.uid}`);
                        } 
                    } catch (err) {
                        console.warn('Error ensuring partner user doc:', err);
                    }
                } else {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        if (userDoc.exists()) {
                            const data = userDoc.data();
                            if (data?.role) userRole = data.role;
                        }
                    } catch (err) {
                        console.warn('Could not read user role from Firestore', err);
                    }
                }

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', userRole);

                console.log('✅ Login berhasil! Role:', userRole);

                if (userRole === 'admin') {
                    window.location.href = '/admin/dashboard';
                } else if (userRole === 'eo') {
                    window.location.href = '/event-organizer/dashboard';
                } else {
                    window.location.href = '/';
                }
            } catch (err: any) {
                console.error('Login error:', err);
                const code = err?.code || 'unknown';
                if (code === 'auth/user-not-found') {
                    setError('Akun tidak ditemukan. Pastikan Anda sudah mendaftar terlebih dahulu.');
                } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                    setError('Email atau password salah. Coba lagi.');
                } else if (code === 'auth/invalid-email') {
                    setError('Format email tidak valid.');
                } else {
                    setError(`Login gagal: ${err?.message || 'Gagal login'}`);
                }
            } finally {
                setIsLoading(false);
            }
        })();
    };
    
    const getRoleLabel = () => {
        if (role === 'admin') return 'Admin';
        if (role === 'eo') return 'Event Organizer';
        return 'Pengunjung';
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Masuk ke Jappa.
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {step === 'role-selection' ? 'Pilih peran Anda untuk melanjutkan' : `Login sebagai ${getRoleLabel()}`}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">

                    {step === 'login-form' && !searchParams.get('role') && (
                        <button 
                            onClick={() => setStep('role-selection')}
                            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}

                    {step === 'role-selection' && (
                        <div className="space-y-4">
                            <button onClick={() => handleRoleSelect('user')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors"><User className="w-6 h-6 text-blue-600" /></div>
                                <div className="ml-4 text-left"><h3 className="text-lg font-bold text-gray-900">Pengunjung</h3><p className="text-xs text-gray-500">Beli tiket & cari wisata</p></div>
                            </button>

                            <button onClick={() => handleRoleSelect('admin')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all group">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors"><ShieldCheck className="w-6 h-6 text-red-600" /></div>
                                <div className="ml-4 text-left"><h3 className="text-lg font-bold text-gray-900">Admin Platform</h3><p className="text-xs text-gray-500">Kelola sistem & data utama</p></div>
                            </button>
                            
                            <button onClick={handleRoleSelectEO} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors"><ShieldCheck className="w-6 h-6 text-green-600" /></div>
                                <div className="ml-4 text-left"><h3 className="text-lg font-bold text-gray-900">Event Organizer (EO)</h3><p className="text-xs text-gray-500">Kelola event dan penjualan tiket</p></div>
                            </button>
                        </div>
                    )}

                    {step === 'login-form' && (
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email address</label>
                                <div className="mt-1">
                                    <input 
                                        value={emailInput} 
                                        onChange={(e) => setEmailInput(e.target.value)} 
                                        type="email" 
                                        required 
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 relative"> 
                                    <input 
                                        value={passwordInput} 
                                        onChange={(e) => setPasswordInput(e.target.value)} 
                                        type={showPassword ? "text" : "password"} 
                                        required 
                                        // Pr-10 memastikan ruang untuk tombol mata
                                        className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" 
                                    />
                                    {/* Tombol Toggle Eye */}
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <div>
                                <button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all 
                                        ${role === 'user' ? 'bg-blue-600 hover:bg-blue-700' : (role === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700')}`
                                    }
                                >
                                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Masuk'}
                                </button>
                            </div>

                            {role === 'user' && (
                                <div className="text-center text-sm mt-4"><span className="text-gray-600">Belum punya akun? </span><Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">Daftar di sini</Link></div>
                            )}
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <LoginContent />
        </Suspense>
    );
}