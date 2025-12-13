import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTxUxarVP6NsKT74FDyDFkC1irsb8Ny5Y",
  authDomain: "jappajappa-47796.firebaseapp.com",
  projectId: "jappajappa-47796",
  storageBucket: "jappajappa-47796.appspot.com", // Fixed: gunakan .appspot.com
  messagingSenderId: "551636996244",
  appId: "1:551636996244:web:6d3f99a81942036e932481",
  measurementId: "G-YTXMC8DM02"
};

// Initialize Firebase (Cek agar tidak init double di Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };