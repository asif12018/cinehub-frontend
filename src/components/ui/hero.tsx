"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

interface HeroProps { movies?: any[] }

const CARD_W = 184;
const CARD_GAP = 12;
const VISIBLE = 5;
const ADVANCE_MS = 30000;

export function Hero({ movies = [] }: HeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [idx, setIdx] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [sliding, setSliding] = useState(false);

  const trailers = movies.filter(
    (m) => m.trailerUrl && typeof m.trailerUrl === "string" && m.trailerUrl.length > 5
  );
  const has = trailers.length > 0;
  const cur = has ? trailers[idx] : null;
  const videoId = cur ? getYoutubeId(cur.trailerUrl) : null;

  // Build VISIBLE+1 cards so the +1 slides in from the right
  const cardList = Array.from({ length: VISIBLE + 1 }, (_, i) =>
    trailers[(idx + i) % trailers.length]
  ).filter(Boolean);

  const advance = useCallback(() => {
    if (sliding || trailers.length < 2) return;
    setContentVisible(false);
    setSliding(true); // triggers translateX transition
    setTimeout(() => {
      setIdx((p) => (p + 1) % trailers.length);
      setProgressKey((k) => k + 1);
      setSliding(false); // instant reset after index update
      setContentVisible(true);
    }, 520);
  }, [sliding, trailers.length]);

  const goTo = useCallback((target: number) => {
    if (sliding || target === idx) return;
    setContentVisible(false);
    setTimeout(() => {
      setIdx(target);
      setProgressKey((k) => k + 1);
      setContentVisible(true);
    }, 300);
  }, [sliding, idx]);

  useEffect(() => {
    if (!has || trailers.length < 2) return;
    const t = setTimeout(advance, ADVANCE_MS);
    return () => clearTimeout(t);
  }, [idx, has, trailers.length, advance]);

  const iframeSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1`
    : null;

  return (
    <section className="relative h-screen overflow-hidden -mt-24 md:-mt-28 bg-black select-none">

      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {iframeSrc ? (
          <iframe
            key={`${videoId}-${isMuted}`}
            src={iframeSrc}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            title="trailer"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
            style={{ width: "max(100vw, 177.78vh)", height: "max(100vh, 56.25vw)" }}
          />
        ) : (
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('/banner.png')` }} />
        )}
      </div>

      {/* ── GRADIENTS ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/85 via-black/35 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

      {/* ── VOLUME ── */}
      {has && (
        <button
          onClick={() => setIsMuted((m) => !m)}
          className="absolute bottom-40 right-6 md:right-12 z-30 p-3 rounded-full border border-white/25 bg-black/30 text-white hover:bg-white/15 hover:border-white/60 transition-all backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* ── MAIN CONTENT ── */}
      <div
        className="relative z-10 flex items-end h-full max-w-7xl mx-auto px-4 md:px-12 pb-36"
        style={{ transition: "opacity 0.4s, transform 0.4s", opacity: contentVisible ? 1 : 0, transform: contentVisible ? "translateY(0)" : "translateY(12px)" }}
      >
        <div className="max-w-2xl">
          {cur && (
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-bold tracking-widest text-red-400 uppercase">Now Playing</span>
            </div>
          )}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl leading-[1.05] tracking-tight">
            {cur ? cur.title : "CineTube"}
          </h1>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed line-clamp-2">
            {cur ? cur.synopsis : "Watch movies and TV shows online. Stream anywhere, anytime."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={cur ? `/movie/${cur.id}` : "/movie"} className="flex items-center gap-2 px-7 py-3 bg-white text-black rounded-md font-bold hover:bg-gray-100 transition-all shadow-2xl">
              <Play className="w-5 h-5 fill-black" /> Play
            </Link>
            <Link href={cur ? `/movie/${cur.id}` : "/"} className="flex items-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-md font-bold hover:bg-white/20 transition-all">
              <Info className="w-5 h-5" /> More Info
            </Link>
          </div>
        </div>
      </div>

      {/* ── SLIDING INDICATOR CARDS ── */}
      {has && trailers.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 px-4 md:px-12 overflow-hidden">
          <div
            style={{
              display: "flex",
              gap: `${CARD_GAP}px`,
              transform: sliding ? `translateX(-${CARD_W + CARD_GAP}px)` : "translateX(0px)",
              transition: sliding ? "transform 0.5s cubic-bezier(0.4,0,0.2,1)" : "none",
            }}
          >
            {cardList.map((movie, pos) => {
              const isActive = pos === 0;
              const isNew = pos === VISIBLE; // the extra card entering from right
              const thumbId = getYoutubeId(movie.trailerUrl);
              const thumb = thumbId
                ? `https://img.youtube.com/vi/${thumbId}/mqdefault.jpg`
                : movie.posterUrl || null;
              const targetIdx = (idx + pos) % trailers.length;

              return (
                <div
                  key={`${movie.id}-${pos}`}
                  onClick={() => goTo(targetIdx)}
                  style={{
                    width: `${CARD_W}px`,
                    flexShrink: 0,
                    opacity: isNew ? (sliding ? 1 : 0) : 1,
                    transform: isNew ? (sliding ? "translateX(0)" : "translateX(24px)") : "none",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer backdrop-blur-xl ${
                    isActive
                      ? "bg-white/15 border-white/40 shadow-lg"
                      : "bg-black/30 border-white/10 hover:bg-white/10 hover:border-white/25"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-9 rounded-md overflow-hidden flex-shrink-0 bg-gray-800/60 ring-1 ring-white/10">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={movie.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white/40" />
                      </div>
                    )}
                  </div>
                  {/* Title + progress */}
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <p className={`text-[11px] font-semibold truncate ${isActive ? "text-white" : "text-gray-400"}`}>
                      {movie.title}
                    </p>
                    <div className="w-full h-[2px] rounded-full bg-white/10 overflow-hidden">
                      {isActive && (
                        <div key={progressKey} className="h-full bg-red-500 rounded-full animate-trailer-progress" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
