"use client";

import { useSearchParams } from "next/navigation"; // Import this
import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import { MovieRow } from "@/components/ui/movie-row";
import { getMedia } from "@/service/media.service";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search"); // Get ?search=... from URL

  // Fetch media - if searchQuery exists, we add it to the queryFn
  const { data: media, isLoading } = useQuery<any>({
    queryKey: ["media", searchQuery], // Add searchQuery to key so it refetches on search
    queryFn: () => getMedia(searchQuery ? `searchTerm=${searchQuery}` : "")
  });

  const moviesList = Array.isArray(media?.data) ? media.data : (media?.data?.data || []);

  // Determine if we are showing search results or the default categories
  const isSearching = !!searchQuery;

  return (
    <div className="min-h-screen bg-netflix-bg text-white font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Hide Hero if searching to make results clearer */}
      {!isSearching && <Hero />}
      
      <main className={isSearching ? "pt-24 px-8" : "pt-4"}>
        {isLoading ? (
          <div className="...">Loading...</div> // Your existing skeleton
        ) : isSearching ? (
          // SEARCH RESULTS VIEW
          <section>
            <h1 className="text-3xl font-bold mb-8">Results for "{searchQuery}"</h1>
            {moviesList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {moviesList.map((movie: any) => (
                   <MovieRow key={movie.id} title="" movies={[movie]} /> 
                   /* Note: You might want a MovieCard grid here instead of rows */
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-xl">No movies found matching your search.</p>
            )}
          </section>
        ) : (
          // DEFAULT CATEGORY ROWS (Your existing logic)
          <>
            <MovieRow title="Trending Now" movies={moviesList.slice(0, 10)} />
            <MovieRow 
              title="Adventure Movies" 
              movies={moviesList.filter((m: any) => m.genres.some((g: any) => g.genre.name === "Adventure"))} 
            />
            {/* ... other rows ... */}
          </>
        )}
      </main>

      {/* Footer */}
    </div>
  );
}