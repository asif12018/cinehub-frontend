"use client";

import React from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/ui/navbar";
import { GetUserWatchList } from "@/service/watchlist.service";
import { MovieCard } from "@/components/ui/movie-card";
import { Bookmark, Loader2, Play } from "lucide-react";
import Link from 'next/link';

export default function WatchListPage() {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: GetUserWatchList,
  });

  // Accessing the data based on your service's return structure
  const watchlistItems = response?.data || response || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card text-foreground font-sans">
      <Navbar />

      <main className="pt-28 px-4 md:px-12 pb-16 max-w-[1800px] mx-auto w-full">
        <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl md:text-foregroundxl font-bold flex items-center gap-3">
              <Bookmark className="text-red-600 fill-red-600" /> My Watchlist
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Titles you've saved to watch later.
            </p>
          </div>
          
          <div className="hidden md:block bg-gray-900 px-4 py-2 rounded-full border border-border">
             <span className="text-red-500 font-bold">{watchlistItems.length}</span>
             <span className="text-muted-foreground ml-2 text-sm uppercase font-semibold">Titles</span>
          </div>
        </div>

        {watchlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
            {watchlistItems.map((item: any) => (
              <div key={item.id} className="relative group w-fit">
                {/* We reuse your MovieCard here for consistency */}
                <MovieCard movie={item.media} />
                
                {/* Optional: Overlay "Play" button for quick access */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <Link 
                        href={`/movie/${item.media?.id}`}
                        className="bg-red-600 p-2 rounded-full shadow-xl hover:bg-red-700 block"
                    >
                        <Play className="w-4 h-4 fill-white" />
                    </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-border">
               <Bookmark className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Your watchlist is empty</h3>
            <p className="text-gray-500 max-w-sm mb-8">
              Looks like you haven't added anything yet. Start exploring our library to find your next favorite movie.
            </p>
            <Link 
                href="/movie" 
                className="bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-gray-200 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
