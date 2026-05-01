"use client";

import { useState } from "react";
import { Sparkles, Loader2, ShieldAlert } from "lucide-react";

export function AiContentWarning({ movieTitle, synopsis }: { movieTitle: string, synopsis: string }) {
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateWarning = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key is missing.");

      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const prompt = `Based on the following synopsis for the movie "${movieTitle}", guess what its likely age rating would be (PG, PG-13, R, etc.) and give a brief 1-sentence explanation of what content warnings might apply.
Synopsis: ${synopsis}
Keep the response extremely short and directly state the rating and warning. No bold formatting.`;

      const result = await model.generateContent(prompt);
      setWarning(result.response.text());
    } catch (err: any) {
      setError("Failed to generate rating.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-red-900/10 border border-red-500/20 rounded-xl p-4 max-w-2xl backdrop-blur-md">
      {!warning && !isLoading && (
        <button 
          onClick={generateWarning}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium text-sm"
        >
          <ShieldAlert className="w-4 h-4" /> Generate AI Content Warning
        </button>
      )}
      
      {isLoading && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Analyzing content for warnings...
        </div>
      )}

      {warning && (
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-red-300 font-bold text-sm mb-1 block">AI Predicted Rating & Warnings</span>
            <p className="text-foreground text-sm leading-relaxed">{warning}</p>
          </div>
        </div>
      )}

      {error && <span className="text-red-400 text-sm">{error}</span>}
    </div>
  );
}
