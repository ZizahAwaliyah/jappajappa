import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Gunakan Google Font
import "./globals.css";
import Footer from "./components/Footer";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";

// Menggunakan font Inter dari Google (Otomatis download, tidak butuh file lokal)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jappa - Event & Wisata Makassar",
  description: "Aplikasi informasi event dan wisata di Sulawesi Selatan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <WishlistProvider>
            {/* Konten Halaman */}
            <div className="flex-1">
              {children}
            </div>

            {/* Footer (Akan otomatis sembunyi di Admin/Login berkat logika di Footer.tsx) */}
            <Footer />
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
