"use client";

import { useState } from "react";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
// import type { ReactPlayerProps } from "react-player";

const ReactPlayer = dynamic(() => import("react-player"), { 
  ssr: false 
}) as any;

interface HeroProps {
  movies?: any[];
}

export function Hero({ movies = [] }: HeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);

  // Filter movies that have a trailer
  const moviesWithTrailers = movies.filter(
    (movie) => movie.trailerUrl && typeof movie.trailerUrl === "string" && movie.trailerUrl.length > 5
  );

  const hasTrailers = moviesWithTrailers.length > 0;
  const currentMovie = hasTrailers ? moviesWithTrailers[currentTrailerIndex] : null;

  const handleNextTrailer = () => {
    if (moviesWithTrailers.length > 0) {
      setCurrentTrailerIndex((prev) => (prev + 1) % moviesWithTrailers.length);
    }
  };

  return (
    <section className="relative h-screen overflow-hidden -mt-24 md:-mt-28 bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {currentMovie ? (
          <div className="relative w-full h-full scale-[1.35] pointer-events-none md:scale-[1.5]">
             <ReactPlayer
              url={currentMovie.trailerUrl}
              width="100%"
              height="100%"
              playing={true}
              muted={isMuted}
              controls={false}
              onEnded={handleNextTrailer}
              onError={handleNextTrailer}
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    fs: 0,
                    disablekb: 1
                  }
                } as any
              }}
            />
          </div>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/banner.png')`,
            }}
          />
        )}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
      
      {/* Volume Control */}
      {hasTrailers && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-32 right-8 md:right-12 z-20 p-3 rounded-full border border-white/30 text-white hover:bg-white/20 hover:border-white transition backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 flex items-end h-full max-w-7xl mx-auto px-4 md:px-12 pb-32">
        <div className="max-w-3xl">
          {currentMovie ? (
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
              {currentMovie.title}
             </h1>
          ) : (
             <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
              CineTube
             </h1>
          )}
          
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed drop-shadow-lg line-clamp-3">
            {currentMovie ? currentMovie.synopsis : "Watch movies and TV shows online. Stream anywhere, anytime."}
          </p>

          {/* Play Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={currentMovie ? `/movie/${currentMovie.id}` : "/movie"}
              className="group flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-black rounded-md font-bold text-lg md:max-w-max hover:bg-gray-200 transition-all duration-300 shadow-2xl"
            >
              <Play className="w-6 h-6 fill-black" />
              Play
            </Link>
            <Link
              href={currentMovie ? `/movie/${currentMovie.id}` : "#pricing"}
              className="group flex items-center justify-center gap-3 px-8 py-3.5 bg-gray-500/40 backdrop-blur-md border border-gray-500/50 text-white rounded-md font-bold text-lg md:max-w-max hover:bg-gray-500/60 transition-all duration-300"
            >
              <Info className="w-6 h-6" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
