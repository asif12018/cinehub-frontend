export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  genre: string;
}

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykwXTkiVH0G5.jpg",
    rating: 8.3,
    genre: "Biography/Drama",
  },
  {
    id: 2,
    title: "Barbie",
    poster: "https://image.tmdb.org/t/p/w500/90Lmh8HOeak3HBGf8UgG4n4M9s.jpg",
    rating: 6.8,
    genre: "Comedy",
  },
  {
    id: 3,
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    rating: 8.8,
    genre: "Action/Sci-Fi",
  },
  {
    id: 4,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 9.0,
    genre: "Action/Crime",
  },
  {
    id: 5,
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 8.7,
    genre: "Adventure/Drama",
  },
  // Add more for rows (total 20)
  {
    id: 6,
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/8bY9j7d8P8n3n5q5q5q5q5q5.jpg", // placeholder
    rating: 8.9,
    genre: "Action/Adventure",
  },
  {
    id: 7,
    title: "Spider-Man: No Way Home",
    poster: "https://image.tmdb.org/t/p/w500/title.jpg",
    rating: 8.2,
    genre: "Action/Fantasy",
  },
  {
    id: 8,
    title: "The Godfather",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYO1a3ZokPy9fL.jpg",
    rating: 9.2,
    genre: "Crime/Drama",
  },
  {
    id: 9,
    title: "Forrest Gump",
    poster: "https://image.tmdb.org/t/p/w500/clolk7lD9fVcvF8WSVPGa6FWR7.jpg",
    rating: 8.8,
    genre: "Drama/Romance",
  },
  {
    id: 10,
    title: "Fight Club",
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4TLM1JpUx.jpg",
    rating: 8.8,
    genre: "Drama",
  },
  {
    id: 11,
    title: "The Matrix",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    rating: 8.7,
    genre: "Action/Sci-Fi",
  },
  {
    id: 12,
    title: "Goodfellas",
    poster: "https://image.tmdb.org/t/p/w500/qxFNm78MIlA4Y4oQWP9a9qY1.jpg",
    rating: 8.7,
    genre: "Biography/Crime",
  },
  {
    id: 13,
    title: "The Shawshank Redemption",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    rating: 9.3,
    genre: "Drama",
  },
  {
    id: 14,
    title: "Schindler's List",
    poster: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMG6hro10.jpg",
    rating: 9.0,
    genre: "Biography/Drama",
  },
  {
    id: 15,
    title: "Pulp Fiction",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPp8VP1P9bn.jpg",
    rating: 8.9,
    genre: "Crime/Drama",
  },
  {
    id: 16,
    title: "The Lord of the Rings: The Return of the King",
    poster: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3O4CfO41s5u8.jpg",
    rating: 9.0,
    genre: "Action/Adventure",
  },
  {
    id: 17,
    title: "The Good, the Bad and the Ugly",
    poster: "https://image.tmdb.org/t/p/w500/zNhk3EXpAyZ7G389Gl8wI6YJ5q7.jpg",
    rating: 8.8,
    genre: "Adventure/Western",
  },
  {
    id: 18,
    title: "Avengers: Infinity War",
    poster: "https://image.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    rating: 8.4,
    genre: "Action/Adventure",
  },
  {
    id: 19,
    title: "The Empire Strikes Back",
    poster: "https://image.tmdb.org/t/p/w500/8iBghQ5V31cGH19I3f0t8kK5n1.jpg",
    rating: 8.7,
    genre: "Action/Adventure",
  },
  {
    id: 20,
    title: "The Silence of the Lambs",
    poster: "https://image.tmdb.org/t/p/w500/3s0mp4sbgHaPp3Czn9zG2jP4v1.jpg",
    rating: 8.6,
    genre: "Crime/Drama",
  },
];
