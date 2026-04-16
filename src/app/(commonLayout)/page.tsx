"use client"; // 🔴 THIS MUST BE EXACTLY ON LINE 1

import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import { MovieRow } from "@/components/ui/movie-row";
import { MovieCard } from "@/components/ui/movie-card"; 
import { SplashIntro } from "@/components/ui/splash-intro"; 
import { getMedia } from "@/service/media.service";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const { data: media, isLoading } = useQuery<any>({
    queryKey: ["media", searchQuery],
    queryFn: () => getMedia(searchQuery ? `searchTerm=${searchQuery}` : "")
  });

  const moviesList = media?.data?.data?.data || media?.data?.data || media?.data || [];
  const isSearching = !!searchQuery;

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans overflow-x-hidden">
      
      {/* 🔴 2. PLACE IT HERE AT THE VERY TOP */}
      {/* We only show the intro if the user isn't actively searching for something */}
      {!isSearching && <SplashIntro />}

      <Navbar />
      
      {!isSearching && <Hero />}
      
      {/* 2. MAIN CONTENT AREA */}
      <main className={isSearching ? "pt-32 px-4 md:px-12 min-h-[75vh]" : "pb-20"}>
        
        {isLoading ? (
          /* SKELETON LOADER */
          <div className={isSearching ? "" : "pt-12 px-4 md:px-12"}>
             <div className="w-48 h-8 bg-gray-800/60 rounded-md animate-pulse mb-6" />
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="aspect-[2/3] bg-gray-800/40 rounded-md animate-pulse shadow-xl" />
               ))}
             </div>
          </div>
        ) : isSearching ? (
          
          /* 3. SEARCH RESULTS VIEW (Grid Layout) */
          <section className="animate-in fade-in duration-500">
            <h1 className="text-2xl md:text-3xl font-medium text-gray-400 mb-8 tracking-wide">
              Explore titles related to: <span className="text-white font-bold">"{searchQuery}"</span>
            </h1>
            
            {moviesList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
                {moviesList.map((movie: any) => (
                  <div key={movie.id} className="transition-transform duration-300 hover:scale-105 hover:z-10 cursor-pointer">
                    <MovieCard movie={movie} /> 
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <SearchIcon className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No matches found</h3>
                <p className="text-gray-400 max-w-md">
                  We couldn't find any movies or series matching "{searchQuery}". Try adjusting your search criteria.
                </p>
              </div>
            )}
          </section>

        ) : (
          
          /* 4. DEFAULT CATEGORY ROWS (Clean Spacing, No Overlap) */
          <div className="flex flex-col gap-8 md:gap-12 mt-8 md:mt-12 animate-in fade-in duration-700">
            
            {/* Trending Now (Keep this or replace it, up to you) */}
            <MovieRow title="Trending Now" movies={moviesList.slice(0, 10)} />
            
            {/* 🔴 NEW: Top Rated This Week */}
            <MovieRow 
              title="Top Rated This Week" 
              // Sort by avgRating highest to lowest. 
              // Note: "This Week" implies a date filter, but if you don't have a robust date system yet, sorting by rating is the core requirement!
              movies={[...moviesList].sort((a: any, b: any) => (b.avgRating || 0) - (a.avgRating || 0))} 
            />

            {/* 🔴 NEW: Newly Added */}
            <MovieRow 
              title="Newly Added" 
              // Sort by createdAt date, newest first
              movies={[...moviesList].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} 
            />
            
            {/* 🔴 NEW: Editor's Picks */}
            <MovieRow 
              title="Editor’s Picks" 
              // Filter the array to only show movies where isEditorPick is true
              movies={moviesList.filter((m: any) => m.isEditorPick === true)} 
            />
            
          </div>

        )}
      </main>
    </div>
  );
}