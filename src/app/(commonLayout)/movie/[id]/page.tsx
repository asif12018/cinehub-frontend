"use client";

import { useState, use } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Play, Info, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMediaById } from "@/service/media.service"; 
import dynamic from "next/dynamic";
import type ReactPlayerType from "react-player";

// 🔴 TypeScript fix for ReactPlayer props
const ReactPlayer = dynamic(() => import("react-player"), { 
  ssr: false 
}) as typeof ReactPlayerType;

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) { 
  
  // Unwrap the params Promise to safely get the ID
  const { id } = use(params); 

  // State to hold the URL of whichever video the user wants to watch
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  // Fetch the movie data
  const { data: mediaResponse, isLoading, isError } = useQuery<any>({
    queryKey: ["media-details", id],
    queryFn: () => getMediaById(id),
  });

  // Extract the movie object safely
  const movie = mediaResponse?.data || mediaResponse;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-800 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center">
        <Navbar />
        <h1 className="text-3xl font-bold mb-2 text-gray-300">Movie Not Found</h1>
        <p className="text-gray-500">We couldn't locate this title. It may have been removed.</p>
      </div>
    );
  }

  // Format arrays into strings safely
  const castList = movie.cast?.map((c: any) => c.actor?.name).filter(Boolean).join(", ") || "Unknown";
  const genreList = movie.genres?.map((g: any) => g.genre?.name).filter(Boolean).join(", ") || "Unknown";

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      {/* HERO BACKDROP SECTION */}
      <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-60" 
          style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }} 
        />


        {/* Netflix Gradients */}
        <div className="absolute inset-0 bg-linear-to-r from-[#141414] via-[#141414]/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/40 to-transparent" />

        {/* OVERLAY CONTENT */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-16 pt-32 max-w-4xl z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
            {movie.title}
          </h1>

          {/* Meta Info Row */}
          <div className="flex items-center gap-4 text-sm md:text-base font-semibold text-gray-300 mb-6 drop-shadow-md">
            {movie.avgRating && (
               <span className="text-green-500">{Math.round(movie.avgRating * 20)}% Match</span>
            )}
            <span>{movie.releaseYear}</span>
            <span className="border border-gray-500 px-1.5 rounded-sm text-xs text-gray-400">
              {movie.pricingTier}
            </span>
            <span>HD</span>
          </div>

          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-lg leading-snug">
            {movie.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-10">
            {/* Play Button - Routes to streaming URL in the modal */}
            <button 
              onClick={() => setPlayingUrl(movie.streamingUrl)} 
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 md:px-8 md:py-3 rounded-md font-bold text-lg hover:bg-white/80 transition-colors"
            >
              <Play className="w-6 h-6 fill-current" /> Play
            </button>
            
            {/* Trailer Button - Routes to trailer URL in the modal */}
            {movie.trailerUrl && (
              <button 
                onClick={() => setPlayingUrl(movie.trailerUrl)}
                className="flex items-center gap-2 bg-gray-500/40 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-md font-bold text-lg hover:bg-gray-500/60 transition-colors backdrop-blur-sm border border-gray-500/50"
              >
                <Info className="w-6 h-6" /> Trailer
              </button>
            )}
          </div>

          {/* Details Grid */}
          <div className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">
            <p className="mb-2">
              <span className="text-gray-500">Cast:</span> <span className="text-gray-300">{castList}</span>
            </p>
            <p className="mb-2">
              <span className="text-gray-500">Director:</span> <span className="text-gray-300">{movie.director}</span>
            </p>
            <p>
              <span className="text-gray-500">Genres:</span> <span className="text-gray-300">{genreList}</span>
            </p>
          </div>
        </div>
      </div>

      {/* UNIVERSAL VIDEO MODAL */}
      {playingUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            
            {/* Close Button */}
            <button 
              onClick={() => setPlayingUrl(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-red-600 rounded-full text-white transition-colors backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Player */}
            <ReactPlayer 
              src={playingUrl}
              width="100%"
              height="100%"
              controls={true}
              playing={true}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}