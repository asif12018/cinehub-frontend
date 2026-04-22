"use client";

import { Play, Info } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden -mt-24 md:-mt-28">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, 
            rgba(0, 0, 0, 0.4) 0%, 
            rgba(0, 0, 0, 0.7) 50%, 
            rgba(0, 0, 0, 0.9) 100%),
            url('/banner.png')`, // Oppenheimer-like hero bg
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-end h-full max-w-7xl mx-auto px-4 md:px-8 pb-20 md:pb-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            CineHub
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-lg leading-relaxed">
            Watch movies and TV shows online. Stream anywhere, anytime.
          </p>

          {/* Play Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/watch/1"
              className="group flex items-center gap-4 px-8 py-4 bg-white text-black rounded-md font-semibold max-w-max hover:bg-gray-200 transition-all duration-300 shadow-2xl hover:shadow-red-500/25 hover:-translate-y-1"
            >
              <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Play
            </Link>
            <button className="group flex items-center gap-4 px-8 py-4 border border-white/50 text-white rounded-md font-semibold max-w-max hover:bg-white/20 hover:border-white transition-all duration-300">
              <Info className="w-6 h-6" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
