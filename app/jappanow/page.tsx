"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, MapPin, Calendar, Eye } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

interface Article {
  id: string;
  title: string;
  content: string;
  image?: string;
  category: "wisata" | "event";
  createdAt: any;
}

export default function JappaNowPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "wisata" | "event">("all");
  const [loading, setLoading] = useState(true);

  // Fetch articles real-time dari Firestore
  useEffect(() => {
    const q = query(
      collection(db, "jappa_posts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData: Article[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Article[];

      setArticles(articlesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter articles berdasarkan kategori
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter((a) => a.category === selectedCategory));
    }
  }, [articles, selectedCategory]);

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "Baru saja";
    try {
      const date = timestamp.toDate?.() || new Date(timestamp);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Baru saja";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-linear-to-br from-blue-600 to-blue-800 text-white pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Jappa Now</h1>
          <p className="text-blue-100 text-lg">
            Temukan artikel menarik tentang wisata dan event terkini di sekitar Anda
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 -mx-4 px-4 md:mx-0 md:px-0">
            {["all", "wisata", "event"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category === "all" ? "Semua" : category === "wisata" ? "🏖️ Wisata" : "🎭 Event"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Memuat artikel...</p>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-gray-600 text-lg font-medium mb-2">Belum ada artikel</p>
            <p className="text-gray-500">
              {selectedCategory === "all"
                ? "Artikel akan muncul di sini"
                : `Belum ada artikel untuk kategori ${selectedCategory}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/jappanow/${article.id}`}>
                <div className="group h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105">
                  {/* Image */}
                  <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-300 to-gray-400">
                        <span className="text-gray-600 text-sm">Tanpa gambar</span>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          article.category === "wisata"
                            ? "bg-green-600"
                            : "bg-purple-600"
                        }`}
                      >
                        {article.category === "wisata" ? "🏖️ Wisata" : "🎭 Event"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {article.content}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>

                    {/* Read More Link */}
                    <div className="mt-4 inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                      Baca selengkapnya
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
