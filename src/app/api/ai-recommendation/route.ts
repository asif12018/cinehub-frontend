import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI API Key is missing. Please add GEMINI_API_KEY=your_key to your .env file." }, 
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful AI movie recommendation assistant on a streaming platform called 'CineTube'. 
A user has asked for recommendations based on this query: "${query}". 
Recommend 3 movies or TV shows. For each, provide the title, release year, and a very short 1-sentence reason why it matches their query.
Format the output cleanly. Keep the overall response short, friendly, and directly address the user. Avoid using markdown formatting like bold text (**), just use plain text with line breaks for readability.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    return NextResponse.json({ 
      error: `Failed to generate: ${error.message || "Unknown error occurred"}` 
    }, { status: 500 });
  }
}
