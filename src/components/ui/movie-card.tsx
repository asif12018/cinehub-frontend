import Image from "next/image";
import { Star } from "lucide-react";
import { Movie } from "@/lib/data";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className = "" }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative block w-36 md:w-48 h-56 md:h-72 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:z-10 mx-2 md:mx-3"
    >
      <div className="relative h-full w-full">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover group-hover:opacity-90 transition-opacity"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Rating Top-Right */}
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {movie.rating}
          </div>
        </div>

        {/* Title Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent text-white text-sm font-semibold truncate opacity-0 group-hover:opacity-100 transition-all duration-300">
          {movie.title}
        </div>
      </div>
    </Link>
  );
}
