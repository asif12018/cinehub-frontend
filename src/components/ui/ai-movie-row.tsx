"use client";

import { useState } from "react";
import { Sparkles, Loader2, Bot } from "lucide-react";
import { MovieRow } from "./movie-row";

export function AiMovieRow({ movies }: { movies: any[] }) {
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [aiTheme, setAiTheme] = useState("");

  const generateAIPicks = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key is missing.");

      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const themes = [
        "a cozy weekend binge", 
        "high-octane adrenaline junkies", 
        "mind-bending plot twists", 
        "a good laugh with friends"
      ];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      setAiTheme(randomTheme);

      const availableTitles = movies.map(m => {
        const genres = m.genres ? m.genres.map((g: any) => g.genre?.name || "").join(", ") : "";
        return `- Title: "${m.title}", Genres: [${genres}], Synopsis: ${m.synopsis?.substring(0, 100)}...`;
      }).join("\n");

      const prompt = `You are a movie curator. I need you to curate exactly 4 or 5 movies from the following database list that are perfect for: ${randomTheme}.
      
Available Database Movies:
${availableTitles}

CRITICAL INSTRUCTION: You MUST ONLY return the exact titles of the movies you choose from the list, separated by commas. Do not include quotes, bullet points, or any other text. JUST the comma-separated titles.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Split the comma-separated string and map back to actual movie objects
      const pickedTitles = text.split(",").map(t => t.trim().toLowerCase());
      
      const filteredMovies = movies.filter(m => pickedTitles.includes(m.title.toLowerCase()));
      
      // Fallback in case AI messes up the exact names
      if (filteredMovies.length === 0) {
        setRecommendedMovies(movies.slice(0, 5));
      } else {
        setRecommendedMovies(filteredMovies);
      }
      
      setHasGenerated(true);
    } catch (err: any) {
      setError("Failed to generate AI picks. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasGenerated && !isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10 bg-background my-4">
        <button 
          onClick={generateAIPicks}
          className="group relative flex items-center gap-3 bg-black dark:bg-zinc-900 border border-gray-800 dark:border-zinc-800 hover:border-red-600 hover:bg-gray-800 dark:bg-zinc-800 text-white px-8 py-4 rounded-md font-bold text-lg transition-all shadow-xl"
        >
          <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
          <Sparkles className="w-6 h-6 text-red-500" />
          <span className="relative z-10 tracking-wide">Generate "AI Top Picks For You"</span>
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 bg-background my-4">
        <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
        <p className="text-muted-foreground font-medium tracking-wide">AI is analyzing your database for the best matches...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-background py-4 my-4 group">
      <div className="absolute top-2 right-4 flex items-center gap-2 text-red-500/80 text-sm font-medium tracking-wide">
        <Bot className="w-4 h-4" /> Curated for: <span className="text-foreground">{aiTheme}</span>
      </div>
      <MovieRow 
        title="AI Recommended For You" 
        movies={recommendedMovies} 
      />
    </div>
  );
}
