import { MovieCard } from "./movie-card";

interface MovieRowProps {
  title: string;
  movies: any[]; // Accepting the actual array of movie objects now!
}

export function MovieRow({ title, movies }: MovieRowProps) {

  // Safety check: if no movies were passed, don't render the section
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-6 md:py-8 pl-4 md:pl-12 overflow-hidden">
      <div className="flex items-center gap-3 mb-6 md:ml-3 ml-2">
        {/* Red vertical bar from the screenshot */}
        <div className="w-[3px] md:w-1 h-6 md:h-7 bg-red-600 rounded-full"></div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
          {title}
        </h2>
      </div>
      <div className="flex overflow-x-auto scrollbar-hide pb-8 pr-4 md:pr-12 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="w-[160px] sm:w-[180px] md:w-[220px] flex-shrink-0 transition-transform duration-300 hover:scale-105 hover:z-10">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
