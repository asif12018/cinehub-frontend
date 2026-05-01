"use client";

import { useState } from "react";
import { Sparkles, Loader2, Info } from "lucide-react";

export function AiFunFact({ movieTitle }: { movieTitle: string }) {
  const [fact, setFact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateFact = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key is missing.");

      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const prompt = `Give me one very short, interesting, and true behind-the-scenes fun fact about the movie or show "${movieTitle}". Keep it under 2 sentences. Do not use formatting.`;

      const result = await model.generateContent(prompt);
      setFact(result.response.text());
    } catch (err: any) {
      setError("Failed to fetch fact.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 max-w-2xl backdrop-blur-md">
      {!fact && !isLoading && (
        <button 
          onClick={generateFact}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium text-sm"
        >
          <Sparkles className="w-4 h-4" /> Generate AI Fun Fact for {movieTitle}
        </button>
      )}
      
      {isLoading && (
        <div className="flex items-center gap-2 text-purple-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Mining the internet for a fun fact...
        </div>
      )}

      {fact && (
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-purple-300 font-bold text-sm mb-1 block">AI Fun Fact</span>
            <p className="text-foreground text-sm leading-relaxed">{fact}</p>
          </div>
        </div>
      )}

      {error && <span className="text-red-400 text-sm">{error}</span>}
    </div>
  );
}
