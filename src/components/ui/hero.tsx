"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

// Extract YouTube video ID from various URL formats
function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

interface HeroProps {
  movies?: any[];
}

const AUTO_ADVANCE_MS = 30000;

export function Hero({ movies = [] }: HeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [progressKey, setProgressKey] = useState(0); // re-triggers CSS animation

  const moviesWithTrailers = movies.filter(
    (m) => m.trailerUrl && typeof m.trailerUrl === "string" && m.trailerUrl.length > 5
  );

  const hasTrailers = moviesWithTrailers.length > 0;
  const currentMovie = hasTrailers ? moviesWithTrailers[currentIndex] : null;
  const videoId = currentMovie ? getYoutubeId(currentMovie.trailerUrl) : null;

  const goTo = useCallback(
    (index: number) => {
      setIsContentVisible(false);
      setTimeout(() => {
        setCurrentIndex(index % moviesWithTrailers.length);
        setProgressKey((k) => k + 1);
        setIsContentVisible(true);
      }, 400);
    },
    [moviesWithTrailers.length]
  );

  // Auto-advance
  useEffect(() => {
    if (!hasTrailers || moviesWithTrailers.length < 2) return;
    const timer = setTimeout(() => {
      goTo((currentIndex + 1) % moviesWithTrailers.length);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [currentIndex, hasTrailers, moviesWithTrailers.length, goTo]);

  // Build iframe src — key on videoId + isMuted so mute toggle reloads iframe
  const iframeSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&cc_load_policy=0`
    : null;

  return (
    <section className="relative h-screen overflow-hidden -mt-24 md:-mt-28 bg-black select-none">
      {/* ── BACKGROUND VIDEO / IMAGE ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {iframeSrc ? (
          <iframe
            key={`${videoId}-${isMuted}`}
            src={iframeSrc}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            title="trailer"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
            style={{
              width: "max(100vw, 177.78vh)",
              height: "max(100vh, 56.25vw)",
            }}
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/banner.png')` }}
          />
        )}
      </div>

      {/* ── GRADIENT OVERLAYS ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

      {/* ── VOLUME BUTTON ── */}
      {hasTrailers && (
        <button
          onClick={() => setIsMuted((m) => !m)}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="absolute bottom-44 right-6 md:right-12 z-30 p-3 rounded-full border border-white/25 bg-black/30 text-white hover:bg-white/15 hover:border-white/60 transition-all backdrop-blur-md shadow-lg"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* ── MAIN CONTENT ── */}
      <div
        className={`relative z-10 flex items-end h-full max-w-7xl mx-auto px-4 md:px-12 pb-44 transition-all duration-500 ${
          isContentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="max-w-2xl">
          {/* "Now Playing" badge */}
          {currentMovie && (
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-bold tracking-widest text-red-400 uppercase">
                Now Playing
              </span>
            </div>
          )}

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl leading-[1.05] tracking-tight">
            {currentMovie ? currentMovie.title : "CineTube"}
          </h1>

          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed drop-shadow-lg line-clamp-2">
            {currentMovie
              ? currentMovie.synopsis
              : "Watch movies and TV shows online. Stream anywhere, anytime."}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={currentMovie ? `/movie/${currentMovie.id}` : "/movie"}
              className="flex items-center gap-2 px-7 py-3 bg-white text-black rounded-md font-bold text-sm md:text-base hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/20"
            >
              <Play className="w-5 h-5 fill-black" />
              Play
            </Link>
            <Link
              href={currentMovie ? `/movie/${currentMovie.id}` : "/"}
              className="flex items-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-md font-bold text-sm md:text-base hover:bg-white/20 hover:border-white/40 transition-all"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      {/* ── GLASSMORPHISM INDICATOR CARDS ── */}
      {hasTrailers && moviesWithTrailers.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 md:px-12 pb-4">
          <div className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide">
            {moviesWithTrailers.slice(0, 7).map((movie, index) => {
              const isActive = index === currentIndex;
              const thumbId = getYoutubeId(movie.trailerUrl);
              const thumbSrc = thumbId
                ? `https://img.youtube.com/vi/${thumbId}/mqdefault.jpg`
                : movie.posterUrl || null;

              return (
                <button
                  key={movie.id}
                  onClick={() => goTo(index)}
                  className={`group flex-shrink-0 flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300 backdrop-blur-xl ${
                    isActive
                      ? "bg-white/15 border-white/40 shadow-lg shadow-black/30 scale-[1.03]"
                      : "bg-black/30 border-white/8 hover:bg-white/10 hover:border-white/25"
                  }`}
                  style={{ minWidth: "170px", maxWidth: "200px" }}
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-9 rounded-md overflow-hidden flex-shrink-0 bg-gray-800/60 ring-1 ring-white/10">
                    {thumbSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbSrc}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700/50 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <p
                      className={`text-[11px] font-semibold truncate leading-tight ${
                        isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                      }`}
                    >
                      {movie.title}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-[2px] rounded-full bg-white/10 overflow-hidden">
                      {isActive && (
                        <div
                          key={progressKey}
                          className="h-full bg-red-500 rounded-full animate-trailer-progress"
                        />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
