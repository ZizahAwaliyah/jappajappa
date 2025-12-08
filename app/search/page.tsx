"use client";

import { useState, useEffect, Suspense } from "react"; // 1. Import Suspense
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import SearchBox from "../components/SearchBox";

interface SearchResult {
  id: string;
  title: string;
  location?: string;
  image?: string;
  type: "event" | "wisata";
  date?: any;
  price?: string;
  category?: string;
}

// --- 2. KOMPONEN ISI (LOGIKA SEARCH PINDAH KE SINI) ---
function SearchContent() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams(); // Ini penyebab error, jadi harus di dalam komponen child
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query || query.length < 2) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const eventResults = results.filter(r => r.type === "event");
  const wisataResults = results.filter(r => r.type === "wisata");

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header dengan Search */}
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <SearchBox />
            </div>
          </div>

          {/* Search Results Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Search results for "{query}"
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4 text-lg">
              No results found for "{query}"
            </p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Events Section */}
            {eventResults.length > 0 && (
              <section className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Events ({eventResults.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/event/${result.id}`}
                      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                        {result.image ? (
                          <Image
                            src={result.image}
                            alt={result.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-200 to-gray-300">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                        {result.category && (
                          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {result.category}
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-gray-900 line-clamp-2 mb-3">
                          {result.title}
                        </h4>
                        {result.location && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                            {result.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Wisata Section */}
            {wisataResults.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Places ({wisataResults.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wisataResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/wisata/${result.id}`}
                      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                        {result.image ? (
                          <Image
                            src={result.image}
                            alt={result.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-200 to-gray-300">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                        {result.category && (
                          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {result.category}
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-gray-900 line-clamp-2 mb-3">
                          {result.title}
                        </h4>
                        {result.location && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                            {result.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// --- 3. KOMPONEN UTAMA (WRAPPER SUSPENSE) ---
// Ini yang diexport agar Next.js Build sukses
export default function SearchPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Initializing Search...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}