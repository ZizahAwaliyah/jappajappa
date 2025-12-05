import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTxUxarVP6NsKT74FDyDFkC1irsb8Ny5Y",
  authDomain: "jappajappa-47796.firebaseapp.com",
  projectId: "jappajappa-47796", // Typo 'y' di awal saya koreksi agar sesuai authDomain
  storageBucket: "jappajappa-47796.firebasestorage.app",
  messagingSenderId: "551636996244",
  appId: "1:551636996244:web:6d3f99a81942036e932481",
  measurementId: "G-YTXMC8DM02"
};

// Initialize Firebase (Cek agar tidak init double di Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };