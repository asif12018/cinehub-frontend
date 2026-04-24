"use client";

import Link from "next/link";
import { Check, Play, ChevronRight, Crown } from "lucide-react";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

export default function PaymentSuccess() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["subscription"] });
    queryClient.invalidateQueries({ queryKey: ["user"] });
  }, [queryClient]);

  const randomPosters = useMemo(() => {
    const totalPosters = 16;
    const distinctColors = ["220,38,38", "234,179,8", "37,99,235", "124,58,237", "16,185,129"];
    return Array.from({ length: totalPosters }).map((_, i) => ({
      id: i,
      color: distinctColors[i % distinctColors.length],
      url: `https://via.placeholder.com/200x300/${distinctColors[i % distinctColors.length].replace(/,/g, "")}/141414.png?text=Media+${i + 1}`,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden selection:bg-red-600/30">
      
      {/* 🟢 CUSTOM CSS FOR THE NETFLIX ZOOM ANIMATION */}
      <style>{`
        .perspective-container {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        @keyframes netflix-zoom {
          0% { transform: translateZ(-1000px) scale(0.5); opacity: 0; filter: blur(2px); }
          20% { opacity: 0.8; filter: blur(0px); }
          60% { opacity: 0.8; filter: blur(0px); }
          100% { transform: translateZ(600px) scale(5); opacity: 0; filter: blur(4px); }
        }
        .netflix-pillar {
          animation: netflix-zoom 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* LAYER 1: TILE POSTER BACKGROUND */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2 opacity-20 blur-[8px] scale-110 pointer-events-none z-0">
        {randomPosters.map((poster) => (
          <div key={poster.id} className="relative aspect-[2/3] w-full h-full bg-gray-900 rounded-md overflow-hidden shadow-2xl">
             <Image src={poster.url} alt="Movie Background" fill className="object-cover" sizes="(max-w-7xl) 10vw, 5vw" />
          </div>
        ))}
      </div>

      {/* LAYER 2: DARK GRADIENT OVERLAYS */}
      <div className="absolute inset-0 bg-[#141414]/85 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-10" />

      {/* 🟢 LAYER 3: THE PURE CSS NETFLIX ANIMATION */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center perspective-container overflow-hidden mix-blend-screen opacity-60">
        <div className="flex gap-[2px] md:gap-1 netflix-pillar h-[200%] items-center justify-center origin-center">
          {/* These divs perfectly match the colors from your cinehub-intro video screenshot! */}
          <div className="w-1 h-full bg-red-600 shadow-[0_0_20px_#dc2626]" />
          <div className="w-1.5 h-full bg-orange-500 shadow-[0_0_20px_#f97316]" />
          <div className="w-0.5 h-full bg-yellow-400 shadow-[0_0_15px_#facc15]" />
          <div className="w-2 h-full bg-blue-500 shadow-[0_0_30px_#3b82f6]" />
          
          <div className="w-4 h-full bg-white shadow-[0_0_40px_#ffffff] z-10" /> {/* The bright center core */}
          
          <div className="w-2 h-full bg-blue-600 shadow-[0_0_30px_#2563eb]" />
          <div className="w-1.5 h-full bg-red-500 shadow-[0_0_20px_#ef4444]" />
          <div className="w-1 h-full bg-red-700 shadow-[0_0_20px_#b91c1c]" />
        </div>
      </div>

      {/* Center Static Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000 z-10" />

      {/* LAYER 4: SUCCESS CONTENT CARD */}
      <div className="z-20 flex flex-col items-center text-center max-w-xl w-full p-8 md:p-12 rounded-3xl backdrop-blur-lg bg-black/50 border border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Checkmark Circle */}
        <div className="relative mb-8 animate-[bounce_1s_ease-in-out]">
          <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl animate-pulse" />
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.5)] border border-red-500/30 relative z-10">
            <Check className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-lg" strokeWidth={3} />
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
            Payment Successful
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full text-sm font-bold border border-yellow-500/20 w-fit mx-auto shadow-[0_0_10px_rgba(234,179,8,0.1)]">
             <Crown className="w-4 h-4" />
             CineTube PRO
          </div>

          <p className="text-gray-300 text-lg md:text-xl font-light !mt-6">
            Welcome to the ultimate movie experience. Your <span className="text-white font-medium">CineTube PRO</span> subscription is now active.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black px-8 py-3.5 rounded-md font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl">
              <Play className="w-5 h-5 fill-current" />
              Start Watching
            </button>
          </Link>
          
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 bg-[#2b2b2b] hover:bg-[#3d3d3d] text-white border border-gray-700 hover:border-gray-500 px-8 py-3.5 rounded-md font-semibold text-lg transition-all active:scale-95">
              Manage Account
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}