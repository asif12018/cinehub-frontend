"use client";

import { useState } from "react";
import { Sparkles, Loader2, Send, X, Bot } from "lucide-react";
import { getMedia } from "@/service/media.service";

export function AiMovieRecommendation() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setError("");
      setResponse("");
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key is missing. Please make sure NEXT_PUBLIC_GEMINI_API_KEY is in your .env file and you restarted the server.");
      }

      // We use dynamic import so it doesn't break SSR
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      // Fetch available titles from the database to give AI context
      let availableTitles = "No titles available";
      try {
        const mediaData = await getMedia("limit=100");
        if (mediaData?.data && Array.isArray(mediaData.data)) {
          // Format as JSON-like string so the AI understands title, genres, and synopsis
          availableTitles = mediaData.data.map((m: any) => {
            const genres = m.genres ? m.genres.map((g: any) => g.genre?.name || "").join(", ") : "";
            return `- Title: "${m.title}", Type: ${m.type}, Release Year: ${m.releaseYear}, Genres: [${genres}], Synopsis: ${m.synopsis?.substring(0, 100)}...`;
          }).join("\n");
        }
      } catch (err) {
        console.error("Failed to fetch media for AI context", err);
      }

      const prompt = `You are 'CineBot', the official AI assistant for the CineTube streaming platform. You have two main jobs:
1. Recommending movies from our database.
2. Providing friendly customer support and answering questions about using the platform.

A user has asked: "${query}".

CRITICAL INSTRUCTIONS FOR SUPPORT QUERIES:
If the user asks a support question (e.g., payments, pricing, subscriptions, login issues, resetting passwords), answer it politely as a helpful customer support agent for CineTube using these exact rules:
- **Subscriptions**: Users can buy a Monthly Subscription to unlock all 'PREMIUM' movies across the platform.
- **Pay-per-movie**: Users can also 'PURCHASE' a single premium movie without needing a full subscription.
- **Payments**: All payments and checkouts are securely handled via Aamarpay.
- **Login/Accounts**: Users must create an account to leave reviews, save watchlists, and buy subscriptions. 
- Keep answers very short, friendly, and to the point.

CRITICAL INSTRUCTIONS FOR MOVIE RECOMMENDATIONS:
If the user asks for movie recommendations, you MUST ONLY recommend movies or TV shows from the following list of available titles on our platform:
${availableTitles}

If recommending movies, recommend up to 3 titles from the list. For each, provide the title and a very short 1-sentence reason why it matches their query. Do not recommend titles not on the list.
Format the output cleanly. Keep the overall response short, friendly, and directly address the user. Avoid using markdown formatting like bold text (**), just use plain text with line breaks for readability.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      setResponse(text);
    } catch (err: any) {
      console.error("AI Error:", err);
      setError(err.message || "Failed to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* AI Chat Widget Popup */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[400px] bg-background border border-border rounded-xl shadow-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 origin-bottom-right">
          
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/20 rounded-md">
                <Bot className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">CineBot Assistant</h3>
                <p className="text-xs text-muted-foreground">Support & Movie Recommendations</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAskAI} className="flex flex-col gap-3 mb-4">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask for a movie or a support question..."
              className="w-full bg-muted border border-border focus:border-red-500 rounded-md px-4 py-3 text-foreground focus:outline-none transition-colors"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-md font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ask CineBot"}
            </button>
          </form>

          {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-md text-sm">
              {error}
            </div>
          )}

          {response && !error && (
            <div className="bg-muted/50 border border-border/50 rounded-md p-5 mt-4 max-h-[40vh] overflow-y-auto custom-scrollbar">
              <h4 className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> CineBot Response
              </h4>
              <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sticky Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white p-4 sm:px-6 rounded-full font-bold shadow-2xl transition-all transform hover:scale-105 border border-red-500/50"
        >
          <Bot className="w-6 h-6" />
          <span className="hidden sm:block">Ask CineBot</span>
        </button>
      )}
    </div>
  );
}
