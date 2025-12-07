"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  profilePicture: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requireAuth: (callback?: () => void) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Load user dari localStorage saat komponen mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Simpan user ke localStorage setiap kali berubah
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user, isLoaded]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulasi login - nanti bisa diganti dengan API call
    // Untuk demo, accept any email/password
    const dummyUser: User = {
      id: "user-123",
      name: "Nama Anda",
      email: email,
      displayName: "aaaaaaa",
      phoneNumber: "+111111111",
      profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    };

    setUser(dummyUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  // Function untuk cek auth dan redirect jika belum login
  const requireAuth = (callback?: () => void): boolean => {
    if (!user) {
      // Simpan halaman tujuan setelah login
      const currentPath = window.location.pathname;
      localStorage.setItem("redirectAfterLogin", currentPath);

      router.push("/login");
      return false;
    }

    // Jika sudah login, jalankan callback jika ada
    if (callback) {
      callback();
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
