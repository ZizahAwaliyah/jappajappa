// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link untuk navigasi
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  Edit,
  ChevronRight,
  LogOut,
  Save,
  X,
  ChevronLeft // Import ChevronLeft untuk tombol Back
} from "lucide-react";
import BottomNavBar from "../components/Header"; // Pastikan path import benar
import { useAuth } from "../context/AuthContext";

// --- Data Awal ---
const initialUser = {
  profilePicture:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
  name: "Nama Anda",
  displayName: "aaaaaaa",
  phoneNumber: "+111111111",
  email: "dudu@dugu.dodo",
};

// Komponen Input Field
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
        <p className="text-lg font-medium">{value}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [formData, setFormData] = useState(initialUser);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Redirect ke login jika belum login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user) {
      // Update currentUser dengan data dari auth
      setCurrentUser({
        profilePicture: user.profilePicture,
        name: user.name,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      });
      setFormData({
        profilePicture: user.profilePicture,
        name: user.name,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      });
    }
  }, [isAuthenticated, user, router]);

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
    console.log("Menyimpan data:", { [fieldName]: (formData as any)[fieldName] });
    setCurrentUser(formData);
    setEditingField(null);
  };

  return (
    <>
      <main className="bg-gray-100 min-h-screen pb-24 md:pb-10">
        <div className="max-w-screen-lg mx-auto">
          
          {/* === HEADER PROFIL (DIPERBARUI) === */}
          <header className="flex items-center justify-between p-4 bg-white md:bg-gray-100 border-b md:border-none sticky top-0 z-50">
            
            {/* Bagian Kiri: Tombol Back & Judul */}
            <div className="flex items-center gap-2">
              <Link 
                href="/" 
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-800"
              >
                <ChevronLeft className="w-7 h-7" />
              </Link>
              <h1 className="text-2xl font-bold text-blue-900">Profil</h1>
            </div>

            {/* Bagian Kanan: Tombol Logout */}
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-300 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </button>
          </header>

          {/* === Banner Profil & Informasi Dasar === */}
          <section className="relative mx-4 mt-4 bg-white rounded-2xl shadow-lg p-5 overflow-hidden md:mx-0">
            <div className="absolute inset-0 z-0">
              <Image
                src={currentUser.profilePicture}
                alt="Profile Background"
                fill
                className="object-cover rounded-2xl opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-48 text-white">
              <div className="relative mb-3">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <Camera className="w-10 h-10 text-gray-600" />
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-md hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
            </div>
          </section>

          {/* === Detail Informasi Pengguna === */}
          <section className="mx-4 mt-6 bg-white rounded-2xl shadow-lg md:mx-0 divide-y divide-gray-200">
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

            <EditableField
              label="E-Mail"
              fieldName="email"
              value={formData.email}
              isEditing={editingField === "email"}
              onEditClick={() => handleEditClick("email")}
              onSaveClick={() => handleSaveClick("email")}
              onCancelClick={handleCancelClick}
              onChange={handleChange}
              type="email"
            />
          </section>

          {/* === Menu Lainnya === */}
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