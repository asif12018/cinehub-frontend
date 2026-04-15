import { mockMovies } from "@/lib/data";
import { MovieCard } from "./movie-card";

interface MovieRowProps {
  title: string;
  movies?: number[]; // indices to slice mockMovies
}

export function MovieRow({ title, movies = [] }: MovieRowProps) {
  const rowMovies =
    movies.length > 0
      ? movies.map((idx) => mockMovies[idx % mockMovies.length])
      : mockMovies.slice(0, 10);

  return (
    <section className="py-8 md:py-12 px-4 md:px-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 px-2">
        {title}
      </h2>
      <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -ml-2 md:-ml-3">
        {rowMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
