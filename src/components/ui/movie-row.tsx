import { MovieCard } from "./movie-card";

interface MovieRowProps {
  title: string;
  movies: any[]; // Accepting the actual array of movie objects now!
}

export function MovieRow({ title, movies }: MovieRowProps) {

  
  // Safety check: if no movies were passed, don't render the section
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-8 md:py-12 px-4 md:px-8 container">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 px-2">
        {title}
      </h2>
      <div className="flex  gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -ml-2 md:-ml-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}