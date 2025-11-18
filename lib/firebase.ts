// File: lib/firebase.ts

import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase dari environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inisialisasi Firebase
// Cek jika aplikasi sudah diinisialisasi untuk menghindari error di Next.js HMR (Hot Module Replacement)
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi service yang Anda butuhkan
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Inisialisasi Analytics hanya di sisi client (browser)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Ekspor service yang akan digunakan di komponen lain
export { app, db, auth, storage, analytics };