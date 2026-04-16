"use client";

import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import { MovieRow } from "@/components/ui/movie-row";

import { getMedia } from "@/service/media.service";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: media, isLoading } = useQuery<any>({
    queryKey: ["media"],
    queryFn: () => getMedia()
  });

  console.log('this is media', media)

  const moviesList = Array.isArray(media?.data) ? media.data : (media?.data?.data || []);

  const rows = [
    { title: "Trending Now", movies: moviesList.slice(0, 10) },
    { title: "Adventure Movies", movies: moviesList.filter((m: any) => m.genres.some((g: any) => g.genre.name === "Adventure")) },
    { title: "Animation", movies: moviesList.filter((m: any) => m.genres.some((g: any) => g.genre.name === "Animation")) },
    { title: "Mystery", movies: moviesList.filter((m: any) => m.genres.some((g: any) => g.genre.name === "Mystery")) },
    { title: "Top Rated", movies: moviesList.filter((m: any) => m.avgRating && m.avgRating >= 4) },
  ];

  return (
    <div className="min-h-screen bg-netflix-bg text-white font-sans overflow-x-hidden">
      <Navbar />
      <Hero />
      <main className="pt-4">
        {isLoading ? (
          // SKELETON LOADER UI
          <div className="flex flex-col gap-8 py-8 md:py-12 px-4 md:px-8">
            {[1, 2, 3].map((rowIndicator) => (
              <div key={rowIndicator} className="animate-pulse">
                {/* Skeleton Title */}
                <div className="h-6 w-48 bg-gray-800/60 rounded mb-6 px-2"></div>
                {/* Skeleton Movie Cards */}
                <div className="flex gap-4 md:gap-6 overflow-hidden -ml-2 md:-ml-3">
                  {[1, 2, 3, 4, 5, 6].map((cardIndicator) => (
                    <div 
                      key={cardIndicator} 
                      // Adjust these dimensions if your MovieCard uses different sizes!
                      className="min-w-[150px] md:min-w-[200px] h-[225px] md:h-[300px] bg-gray-800/60 rounded-md shrink-0"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // ACTUAL MOVIE ROWS
          rows.map((row, index) => (
            row.movies.length > 0 && (
              <MovieRow key={index} title={row.title} movies={row.movies} />
            )
          ))
        )}
      </main>

      <footer className="border-t border-gray-800 mt-20 py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2026 CineHub. All rights reserved.</p>
        <p className="mt-2">Privacy | Terms | Contact Us</p>
      </footer>
    </div>
  );
}