"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  Edit,
  ChevronRight,
  LogOut,
  Save,
  X,
  ChevronLeft,
} from "lucide-react";
import BottomNavBar from "../components/Header";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";

// --- KOMPONEN EDITABLE FIELD (Ini yang sebelumnya hilang) ---
function EditableField({
  label,
  fieldName,
  value,
  isEditing,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onChange,
  type = "text",
}: {
  label: string;
  fieldName: string;
  value: string;
  isEditing: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center text-gray-800 mb-2">
        <span className="font-semibold text-gray-600 text-sm">{label}</span>
        {!isEditing && (
          <button
            onClick={onEditClick}
            className="text-blue-600 text-sm font-medium flex items-center hover:underline"
          >
            Edit <Edit className="w-3 h-3 ml-1" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
          <input
            type={type}
            name={fieldName}
            value={value}
            onChange={onChange}
            className="grow w-full py-2 px-3 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={onSaveClick}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-1" />
              Simpan
            </button>
            <button
              onClick={onCancelClick}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Batal
            </button>
          </div>
        </div>
      ) : (
        <p className="text-lg font-medium text-gray-900">{value}</p>
      )}
    </div>
  );
}

// --- DATA AWAL ---
const initialUser = {
  profilePicture:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
  name: "Nama Anda",
  displayName: "Pengunjung Jappa",
  phoneNumber: "+6281234567890",
  email: "user@example.com",
};

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [formData, setFormData] = useState(initialUser);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. CEK LOGIN SAAT HALAMAN DIMUAT
  useEffect(() => {
    // Use Firebase auth to determine user and load profile
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        // Fetch user doc from Firestore if available
        const uref = doc(db, 'users', user.uid);
        const snap = await getDoc(uref);
        const base = {
          profilePicture: user.photoURL || initialUser.profilePicture,
          name: snap.exists() ? snap.data()?.name || user.displayName || initialUser.name : user.displayName || initialUser.name,
          displayName: snap.exists() ? snap.data()?.displayName || user.displayName || initialUser.displayName : user.displayName || initialUser.displayName,
          phoneNumber: snap.exists() ? snap.data()?.phone || initialUser.phoneNumber : initialUser.phoneNumber,
          email: user.email || initialUser.email,
        };
        setCurrentUser(base);
        setFormData(base);
      } catch (err) {
        console.error('Error loading user profile:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    });

    return () => unsub();
  }, [router]);

  // Handler Form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (fieldName: string) => {
    setEditingField(fieldName);
    setFormData(currentUser); 
  };

  const handleCancelClick = () => {
    setEditingField(null);
    setFormData(currentUser);
  };

  const handleSaveClick = (fieldName: string) => {
    // Simulasi simpan ke DB
    setCurrentUser(formData);
    setEditingField(null);
  };

  // Handler Logout
  const handleLogout = () => {
    // sign out firebase and clear local flags
    try { auth.signOut?.(); } catch (e) { /* ignore */ }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUploadProfile = async () => {
    if (!selectedFile) return alert('Pilih gambar terlebih dahulu');
    setUploading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(selectedFile, 'jappajappa/profile');
      // update firebase auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: uploadedUrl }).catch(() => {});
        // update users doc (use setDoc merge as fallback)
        const uid = auth.currentUser.uid;
        try {
          await updateDoc(doc(db, 'users', uid), { profilePicture: uploadedUrl, updatedAt: serverTimestamp() });
        } catch (err) {
          // if updateDoc fails (doc may not exist), create or merge the doc
          await setDoc(doc(db, 'users', uid), { profilePicture: uploadedUrl, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
        }
      }

      // update UI
      setCurrentUser((prev) => ({ ...prev, profilePicture: uploadedUrl }));
      setFormData((prev) => ({ ...prev, profilePicture: uploadedUrl }));
      setSelectedFile(null);
      setPreviewUrl(null);
      alert('Foto profil berhasil diunggah');
    } catch (err: any) {
      console.error('Upload error:', err);
      const message = err?.message || String(err);
      alert(`Gagal mengunggah foto profil: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  // Tampilkan loading kosong sampai cek auth selesai agar tidak berkedip
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-gray-100"></div>; 
  }

  return (
    <>
      <main className="bg-gray-100 min-h-screen pb-24 md:pb-10">
        <div className="max-w-screen-lg mx-auto">
          
          {/* === HEADER PROFIL === */}
          <header className="flex items-center justify-between p-4 bg-white md:bg-gray-100 border-b md:border-none sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <Link 
                href="/" 
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-800"
              >
                <ChevronLeft className="w-7 h-7" />
              </Link>
              <h1 className="text-2xl font-bold text-blue-900">Profil</h1>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-300 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </button>
          </header>

          {/* === BANNER PROFIL === */}
          <section className="relative mx-4 mt-4 bg-white rounded-2xl shadow-lg p-5 overflow-hidden md:mx-0">
            <div className="absolute inset-0 z-0">
              <Image
                src={currentUser.profilePicture}
                alt="Profile Background"
                fill
                className="object-cover rounded-2xl opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-48 text-white">
              <div className="relative mb-3">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                   {/* Placeholder user image if needed */}
                   <Image src={currentUser.profilePicture} alt="Avatar" width={96} height={96} className="object-cover" />
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-md hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <input ref={fileInputRef} onChange={handleFileSelect} type="file" accept="image/*" className="hidden" />
              </div>
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              {/* Preview + upload controls */}
              {previewUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
                    <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleUploadProfile} disabled={uploading} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700">
                      {uploading ? 'Mengunggah...' : 'Unggah Foto'}
                    </button>
                    <button onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm">Batal</button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* === FORM DATA PENGGUNA === */}
          <section className="mx-4 mt-6 bg-white rounded-2xl shadow-lg md:mx-0 divide-y divide-gray-200">
            
            {/* Nama Tampilan (Bisa Edit) */}
            <EditableField
              label="Nama Tampilan"
              fieldName="displayName"
              value={formData.displayName}
              isEditing={editingField === "displayName"}
              onEditClick={() => handleEditClick("displayName")}
              onSaveClick={() => handleSaveClick("displayName")}
              onCancelClick={handleCancelClick}
              onChange={handleChange}
            />

            {/* No HP (Bisa Edit) */}
            <EditableField
              label="No Handphone"
              fieldName="phoneNumber"
              value={formData.phoneNumber}
              isEditing={editingField === "phoneNumber"}
              onEditClick={() => handleEditClick("phoneNumber")}
              onSaveClick={() => handleSaveClick("phoneNumber")}
              onCancelClick={handleCancelClick}
              onChange={handleChange}
              type="tel"
            />

            {/* Email (READ ONLY / TIDAK BISA DIEDIT) */}
            <div className="p-5">
              <div className="flex justify-between items-center text-gray-800 mb-2">
                <span className="font-semibold text-gray-600 text-sm">E-Mail</span>
                {/* Tombol Edit Dihilangkan */}
              </div>
              <p className="text-lg font-medium text-gray-500">{formData.email}</p>
              <p className="text-xs text-red-400 mt-1 italic">*Email tidak dapat diubah</p>
            </div>
          </section>

          {/* === MENU NAVIGASI LAIN === */}
          <section className="mx-4 mt-6 bg-white rounded-2xl shadow-lg md:mx-0">
            <Link
              href="/wishlist"
              className="flex justify-between items-center p-5 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-800">Wishlist</span>
              <div className="flex items-center text-gray-500 text-sm">
                Detail <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link
              href="/history"
              className="flex justify-between items-center p-5 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-800">
                Riwayat Rating
              </span>
              <div className="flex items-center text-gray-500 text-sm">
                Detail <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </section>
        </div>
      </main>

      <BottomNavBar />
    </>
  );
}