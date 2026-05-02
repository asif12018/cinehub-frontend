import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

interface MovieCardProps {
  movie: any;
  className?: string;
}

export function MovieCard({ movie, className = "" }: MovieCardProps) {
  const imageSource = movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Poster";

  // Extract year from releaseDate or createdAt if available
  let year = "2026";
  if (movie.releaseDate) {
    year = new Date(movie.releaseDate).getFullYear().toString();
  } else if (movie.createdAt) {
    year = new Date(movie.createdAt).getFullYear().toString();
  }

  // Get primary genre
  let genre = "ACTION";
  if (movie.genre && typeof movie.genre === 'string') {
    genre = movie.genre.split(',')[0].trim().toUpperCase();
  } else if (movie.genres && movie.genres.length > 0) {
    if (typeof movie.genres[0] === 'string') {
        genre = movie.genres[0].toUpperCase();
    } else if (movie.genres[0].name) {
        genre = movie.genres[0].name.toUpperCase();
    }
  }

  return (
    <Link
      href={`/movie/${movie.id}`}
      className={`group flex flex-col w-full h-full bg-[#111111] rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="relative w-full aspect-[2/3]">
        <Image
          src={imageSource}
          alt={movie.title || "Movie Title"}
          fill
          sizes="(max-width: 768px) 160px, 240px"
          className="object-cover transition-transform duration-500"
        />
        {/* Overlay gradient at bottom of image to blend with card body smoothly */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#111111] to-transparent pointer-events-none" />

        {/* Type Badge Top-Left */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-bold tracking-wider">
          MOVIE
        </div>
        
        {/* Rating Top-Right */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          {movie.avgRating ? movie.avgRating.toFixed(1) : "N/A"}
        </div>
      </div>

      <div className="p-3 md:p-4 flex flex-col gap-2 md:gap-3 flex-grow z-10 bg-[#111111]">
        <h3 className="text-white text-sm md:text-base font-bold truncate group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-gray-400 text-xs font-medium">
            {year}
          </span>
          <span className="text-gray-400 text-[9px] md:text-[10px] font-semibold uppercase tracking-widest border border-gray-700 rounded-full px-2 py-0.5 md:py-1 bg-black/30">
            {genre}
          </span>
        </div>
      </div>
    </Link>
  );
}
