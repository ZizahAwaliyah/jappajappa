"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminJappaNowPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("wisata");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle image URL input
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    // Validate URL format
    if (url && !url.startsWith("http")) {
      setErrorMessage("URL harus dimulai dengan http:// atau https://");
    } else {
      setErrorMessage("");
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Judul dan konten tidak boleh kosong");
      return;
    }

    if (imageUrl && !imageUrl.startsWith("http")) {
      setErrorMessage("URL gambar tidak valid");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          image: imageUrl || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      const data = await response.json();
      setSuccessMessage(`✅ Artikel "${title}" berhasil dipublikasikan!`);
      
      // Reset form
      setTitle("");
      setContent("");
      setCategory("wisata");
      setImageUrl("");
      setImagePreview("");
      setShowImagePreview(false);

      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("❌ Gagal membuat artikel. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              ← Kembali
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Buat Artikel Jappa Now</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Alert Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Judul */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Judul Artikel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul artikel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Kategori */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {["wisata", "event"].map((cat) => (
                <label key={cat} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                    className="mr-2"
                  />
                  <span className="text-gray-700 capitalize font-medium">
                    {cat === "wisata" ? "🏖️ Wisata" : "🎭 Event"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* URL Gambar */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              URL Gambar
            </label>
            <div className="space-y-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              
              {imageUrl && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImagePreview(!showImagePreview)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {showImagePreview ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Sembunyikan Preview
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Lihat Preview
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Image Preview */}
              {showImagePreview && imageUrl && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3 font-medium">Preview Gambar:</p>
                  <div className="relative w-full h-64 bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23999'%3EGambar tidak dapat dimuat%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Jika gambar tidak tampil, cek URL yang Anda masukkan
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Gunakan URL dari Cloudinary, Imgur, atau layanan hosting gambar lainnya
            </p>
          </div>

          {/* Konten */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Konten Artikel <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Masukkan konten artikel Anda di sini..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-2">
              {content.length} karakter
            </p>
          </div>

          {/* Tombol Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Sedang mempublikasikan..." : "Publikasikan Artikel"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
                setCategory("wisata");
                setImageUrl("");
                setImagePreview("");
                setShowImagePreview(false);
                setErrorMessage("");
              }}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Bersihkan
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Tips Membuat Artikel</h3>
          <ul className="text-sm text-blue-800 space-y-1.5">
            <li>✓ Gunakan judul yang menarik dan deskriptif</li>
            <li>✓ Masukkan URL gambar dari hosting yang reliable</li>
            <li>✓ Tulis konten yang informatif dan engaging</li>
            <li>✓ Pilih kategori yang sesuai (Wisata atau Event)</li>
            <li>✓ Artikel akan langsung tampil di halaman Jappa Now</li>
          </ul>
          <hr className="my-4 border-blue-200" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">📷 Sumber URL Gambar yang Disarankan:</p>
            <ul className="space-y-1 ml-4">
              <li>• Cloudinary (cloudinary.com)</li>
              <li>• Imgur (imgur.com)</li>
              <li>• Unsplash (unsplash.com)</li>
              <li>• Pexels (pexels.com)</li>
              <li>• Atau host gambar di platform lain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
