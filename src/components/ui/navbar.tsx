"use client";

import { useState, useEffect } from "react";
import { Search, User, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/service/auth.service";
import { getMedia } from "@/service/media.service";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 1. Fetch User Info
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUserInfo,
  });

  // 2. Fetch Search Results
  // We only enable this query if searchTerm has at least 2 characters
  const { data: searchResults, isLoading: isSearching } = useQuery<any>({
    queryKey: ["search-media", searchTerm],
    queryFn: () => getMedia(`searchTerm=${searchTerm}`),
    enabled: searchTerm.length > 1,
  });

  const suggestions = searchResults?.data?.data || searchResults?.data || [];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-b from-black/90 to-transparent p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent shrink-0"
        >
          CineHub
        </Link>

        {/* Search Section */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative" onClick={(e) => e.stopPropagation()}>
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search movies..."
              className="w-full pl-12 pr-10 py-2 bg-black/60 border border-gray-700 rounded-full text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-red-600" />
            )}
          </div>

          {/* Suggestion Dropdown */}
          {showSuggestions && searchTerm.length > 1 && (
            <div className="absolute top-full mt-2 w-full bg-[#141414] border border-gray-800 rounded-lg shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((movie: any) => (
                  <Link
                    key={movie.id}
                    href={`/media/${movie.id}`}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors border-b border-gray-800 last:border-0"
                  >
                    <div className="relative w-12 h-16 shrink-0">
                      <Image
                        src={movie.posterUrl || "/placeholder.jpg"}
                        alt={movie.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm line-clamp-1">{movie.title}</span>
                      <span className="text-gray-400 text-xs">{movie.releaseYear} • {movie.type}</span>
                    </div>
                  </Link>
                ))
              ) : (
                !isSearching && <div className="p-4 text-gray-400 text-sm text-center">No movies found.</div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 shrink-0">
          <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search className="w-6 h-6 text-white" />
          </button>
          
          {user?.role === "USER" && <Link href="/media" className="text-sm font-medium hover:text-red-500">Media</Link>}
          
          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
            <Link href="/dashboard" className="text-sm font-medium hover:text-red-500">Dashboard</Link>
          )}

          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
}