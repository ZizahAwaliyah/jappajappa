// app/profile/page.tsx
"use client"; // Tambahkan ini untuk menggunakan state

import { useState } from "react"; // Impor useState
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Edit,
  ChevronRight,
  LogOut,
  Save, // Ikon baru
  X, // Ikon baru
} from "lucide-react";
import BottomNavBar from "../components/BottomNavBar";

// --- Data Awal (bisa dari props atau fetch) ---
const initialUser = {
  profilePicture:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
  name: "Nama Anda",
  displayName: "aaaaaaa",
  phoneNumber: "+111111111",
  email: "dudu@dugu.dodo",
};

/**
 * Komponen Reusable untuk Bidang yang Dapat Diedit
 * Ini membantu menghindari pengulangan kode
 */
function EditableField({
  label,
  fieldName,
  value,
  isEditing,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onChange,
  type = "text", // Tipe input (text, email, tel)
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
        {/* Tampilkan tombol "Edit" HANYA jika tidak sedang diedit */}
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
        // --- Tampilan saat Mode Edit ---
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
          <input
            type={type}
            name={fieldName}
            value={value}
            onChange={onChange}
            className="flex-grow w-full py-2 px-3 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        // --- Tampilan Statis (Default) ---
        <p className="text-lg font-medium">{value}</p>
      )}
    </div>
  );
}

// --- Komponen Halaman Profil Utama ---
export default function ProfilePage() {
  // State untuk melacak data user yang "tersimpan"
  const [currentUser, setCurrentUser] = useState(initialUser);
  
  // State untuk melacak data di form (saat diedit)
  const [formData, setFormData] = useState(initialUser);

  // State untuk melacak bidang mana yang sedang diedit
  // (null, 'displayName', 'phoneNumber', 'email')
  const [editingField, setEditingField] = useState<string | null>(null);

  // --- Handlers untuk Aksi Edit ---

  // Dipanggil saat input berubah
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Dipanggil saat tombol "Edit" diklik
  const handleEditClick = (fieldName: string) => {
    setEditingField(fieldName);
    // Pastikan form di-reset ke data terbaru jika ada pembatalan sebelumnya
    setFormData(currentUser); 
  };

  // Dipanggil saat tombol "Batal" diklik
  const handleCancelClick = () => {
    setEditingField(null);
    setFormData(currentUser); // Kembalikan data form ke data yang tersimpan
  };

  // Dipanggil saat tombol "Simpan" diklik
  const handleSaveClick = (fieldName: string) => {
    // Di aplikasi nyata, di sinilah Anda akan memanggil API untuk menyimpan data
    console.log("Menyimpan data:", { [fieldName]: formData[fieldName] });

    // Simulasikan penyimpanan berhasil dengan memperbarui state currentUser
    setCurrentUser(formData);
    
    // Tutup mode edit
    setEditingField(null);
  };

  return (
    <>
      <main className="bg-gray-100 min-h-screen pb-24 md:pb-8">
        {/* Wrapper untuk membatasi lebar di desktop */}
        <div className="max-w-screen-lg mx-auto">
          {/* === Header Profil === */}
          <header className="flex items-center justify-between p-4 bg-white md:bg-gray-100 border-b md:border-none">
            <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
            <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors">
              <LogOut className="w-4 h-4 mr-1" />
              Log out
            </button>
          </header>

          {/* === Banner Profil & Informasi Dasar === */}
          <section className="relative mx-4 mt-4 bg-white rounded-2xl shadow-lg p-5 overflow-hidden md:mx-0">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={currentUser.profilePicture}
                alt="Profile Background"
                fill
                className="object-cover rounded-2xl opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>{" "}
              {/* Overlay gradien */}
            </div>

            {/* Konten di atas background */}
            <div className="relative z-10 flex flex-col items-center justify-center h-48 text-white">
              <div className="relative mb-3">
                {/* Placeholder/Icon untuk foto profil utama */}
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <Camera className="w-10 h-10 text-gray-600" />
                </div>
                {/* Tombol edit foto */}
                <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-md hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
            </div>
          </section>

          {/* === Detail Informasi Pengguna === */}
          {/* Menggunakan 'divide-y' untuk memberi garis pemisah antar anak 
            Ini lebih rapi daripada memberi 'border-b' di dalam komponen
          */}
          <section className="mx-4 mt-6 bg-white rounded-2xl shadow-lg md:mx-0 divide-y divide-gray-200">
            <EditableField
              label="Nama Tampilan"
              fieldName="displayName"
              value={formData.displayName} // Gunakan data dari form
              isEditing={editingField === "displayName"}
              onEditClick={() => handleEditClick("displayName")}
              onSaveClick={() => handleSaveClick("displayName")}
              onCancelClick={handleCancelClick}
              onChange={handleChange}
            />

            <EditableField
              label="No Handphone"
              fieldName="phoneNumber"
              value={formData.phoneNumber} // Gunakan data dari form
              isEditing={editingField === "phoneNumber"}
              onEditClick={() => handleEditClick("phoneNumber")}
              onSaveClick={() => handleSaveClick("phoneNumber")}
              onCancelClick={handleCancelClick}
              onChange={handleChange}
              type="tel"
            />

            <EditableField
              label="E-Mail"
              fieldName="email"
              value={formData.email} // Gunakan data dari form
              isEditing={editingField === "email"}
              onEditClick={() => handleEditClick("email")}
              onSaveClick={() => handleSaveClick("email")}
              onCancelClick={handleCancelClick}
              onChange={handleChange}
              type="email"
            />
          </section>

          {/* === Bagian Wishlist & Riwayat Rating === */}
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

      {/* === NAVIGASI BAWAH (Hanya muncul di HP) === */}
      <BottomNavBar />
    </>
  );
}