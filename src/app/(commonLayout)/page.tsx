"use client";

import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import { MovieRow } from "@/components/ui/movie-row";

export default function Home() {
  const rows = [
    { title: "Trending Now", movies: [] }, // All recent
    { title: "Action Movies", movies: [2, 5, 10, 16, 17] },
    { title: "Comedies", movies: [1, 8] },
    { title: "Epic Movies", movies: [3, 12, 14, 15] },
    { title: "Dramas", movies: [6, 9, 11, 13] },
    { title: "Top Rated", movies: [] }, // Filter high rating
  ];

  return (
    <div className="min-h-screen bg-netflix-bg text-white font-sans overflow-x-hidden">
      <Navbar />
      <Hero />
      <main className="pt-4">
        {rows.map((row, index) => (
          <MovieRow key={index} {...row} />
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2024 CineHub. All rights reserved.</p>
        <p className="mt-2">Privacy | Terms | Contact Us</p>
      </footer>
    </div>
  );
}
