"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  image?: string;
  type: "event" | "wisata";
  location?: string;
  date?: any;
}

interface SearchBoxProps {
  showFilters?: boolean; // Deprecated - kept for compatibility
}

export default function SearchBox({ showFilters = false }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Search function
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setResults(data.results || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      handleSearch(value);
    }, 300); // 300ms delay
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Cari event, tempat wisata..."
          className="w-full px-4 py-3 pl-12 pr-12 rounded-full bg-white border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        
        {/* Clear button */}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Dropdown Results */}
      {isOpen && !showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 text-sm mt-2">Mencari...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {/* Events Section */}
              {results.filter(r => r.type === "event").length > 0 && (
                <>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 sticky top-0">Event</div>
                  {results
                    .filter(r => r.type === "event")
                    .slice(0, 3)
                    .map(result => (
                      <Link
                        key={result.id}
                        href={`/event/${result.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {result.image && (
                          <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={result.image}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                          {result.location && (
                            <p className="text-xs text-gray-500 truncate">{result.location}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                </>
              )}

              {/* Wisata Section */}
              {results.filter(r => r.type === "wisata").length > 0 && (
                <>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 sticky top-10">Tempat Wisata</div>
                  {results
                    .filter(r => r.type === "wisata")
                    .slice(0, 3)
                    .map(result => (
                      <Link
                        key={result.id}
                        href={`/wisata/${result.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {result.image && (
                          <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={result.image}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                          {result.location && (
                            <p className="text-xs text-gray-500 truncate">{result.location}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                </>
              )}

              {/* View All Results */}
              {results.length > 6 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-3 text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors border-t border-gray-100"
                >
                  Lihat semua hasil ({results.length})
                </Link>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">
              Tidak ada hasil untuk "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
