"use client";

import Link from "next/link";
import { Flashlight } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#020005] flex flex-col items-center justify-center p-4 relative overflow-hidden font-serif selection:bg-red-900/50">
      
      {/* 🟢 CUSTOM CSS FOR STRANGER THINGS EFFECTS */}
      <style>{`
        .stranger-text {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          color: transparent;
          -webkit-text-stroke: 2px #dc2626;
          text-shadow: 0 0 15px rgba(220, 38, 38, 0.4), 0 0 40px rgba(220, 38, 38, 0.2);
          letter-spacing: 0.15em;
        }

        /* 🟢 1. VIOLENT THUNDER STROBE (The ambient sky flashing) */
        @keyframes thunder-strobe {
          0%, 88%, 91%, 93%, 96%, 100% { opacity: 0; background-color: transparent; }
          89% { opacity: 0.8; background-color: rgba(185, 28, 28, 0.4); } /* Warning flash */
          92% { opacity: 1; background-color: rgba(220, 38, 38, 0.6); }   /* Big flash */
          92.5% { opacity: 0.2; }                                         /* Micro drop */
          94% { opacity: 1; background-color: rgba(255, 255, 255, 0.1); } /* White-hot crack */
          95% { opacity: 0.8; background-color: rgba(220, 38, 38, 0.5); } /* Red fade out */
        }
        .thunder-sky {
          animation: thunder-strobe 9s infinite;
          mix-blend-screen;
        }

        /* 🟢 2. DIRECTIONAL LIGHTNING STRIKES (The actual bolts hitting) */
        @keyframes strike-left {
          0%, 91.9%, 92.6%, 100% { opacity: 0; transform: scale(1); }
          92% { opacity: 1; transform: scale(1.1); }
          92.5% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes strike-right {
          0%, 93.9%, 94.6%, 100% { opacity: 0; }
          94% { opacity: 1; }
          94.5% { opacity: 0.3; }
        }
        .lightning-strike-left {
          background: radial-gradient(circle at 20% -10%, rgba(255,20,20,0.8) 0%, rgba(220,38,38,0.3) 30%, transparent 70%);
          animation: strike-left 9s infinite;
        }
        .lightning-strike-right {
          background: radial-gradient(circle at 80% -20%, rgba(255,255,255,0.8) 0%, rgba(255,0,0,0.6) 20%, transparent 60%);
          animation: strike-right 9s infinite;
        }

        /* Dense Ash Drifting */
        @keyframes float-up-drift {
          0% { transform: translate(0, 100vh) scale(0.5) rotate(0deg); opacity: 0; }
          15% { opacity: var(--max-opacity); }
          85% { opacity: var(--max-opacity); }
          100% { transform: translate(var(--drift-x), -10vh) scale(var(--end-scale)) rotate(360deg); opacity: 0; }
        }
        .spore {
          position: absolute;
          background: rgba(220, 220, 230, 1);
          border-radius: 50%;
          filter: blur(1.5px);
          animation: float-up-drift linear infinite;
        }

        /* Christmas Light Flicker */
        @keyframes bad-bulb {
          0%, 100% { opacity: 1; text-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
          50% { opacity: 0.3; text-shadow: none; }
          55% { opacity: 1; text-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
          60% { opacity: 0.2; text-shadow: none; }
        }
        .flicker-bulb {
          animation: bad-bulb 4s infinite;
        }
      `}</style>

      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020005] via-[#0a0514] to-[#120000] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)] pointer-events-none z-10" />

      {/* 🟢 THE THUNDER & LIGHTNING SYSTEM */}
      {/* General sky flashing */}
      <div className="absolute inset-0 thunder-sky pointer-events-none z-10" />
      {/* Massive Red Strike from the Top Left */}
      <div className="absolute inset-0 lightning-strike-left pointer-events-none z-20 mix-blend-screen" />
      {/* Blinding White/Red Strike from the Top Right */}
      <div className="absolute inset-0 lightning-strike-right pointer-events-none z-20 mix-blend-screen" />

      {/* FLOATING SPORES / DENSE ASH */}
      {mounted && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {[...Array(80)].map((_, i) => {
            const size = Math.random() * 5 + 1.5;
            const left = Math.random() * 100;
            const duration = Math.random() * 12 + 6;
            const delay = Math.random() * 15;
            const driftX = `${(Math.random() * 200) - 100}px`;
            const endScale = Math.random() * 2 + 1;
            const maxOpacity = Math.random() * 0.6 + 0.2;

            return (
              <div
                key={i}
                className="spore"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  animationDuration: `${duration}s`,
                  animationDelay: `-${delay}s`,
                  '--drift-x': driftX,
                  '--end-scale': endScale,
                  '--max-opacity': maxOpacity,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      {/* CONTENT CONTAINER */}
      <div className="z-30 flex flex-col items-center text-center max-w-3xl w-full px-6 relative">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[150px] bg-red-700/20 blur-[100px] pointer-events-none z-0" />

        <h1 className="text-8xl md:text-[13rem] font-black stranger-text mb-2 relative z-10 select-none drop-shadow-2xl">
          404
        </h1>

        <h2 className="text-xl md:text-3xl font-bold text-gray-200 tracking-[0.3em] uppercase mb-10 flicker-bulb select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-10">
          You're in the Upside Down
        </h2>

        <div className="space-y-3 mb-14 max-w-lg mx-auto opacity-80 font-sans relative z-10">
          <p className="text-gray-300 text-lg md:text-xl font-medium">
            The page you are looking for has been taken.
          </p>
          <p className="text-red-400/80 text-sm italic tracking-wide">
            Friends don't lie, but this link definitely did. Keep quiet and don't attract the Demogorgon.
          </p>
        </div>

        <Link href="/" className="group relative z-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <button className="relative flex items-center gap-3 bg-[#0a0a0a]/80 backdrop-blur-md border border-gray-700 hover:border-gray-300 text-gray-400 hover:text-white px-8 py-4 font-sans text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.9)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Flashlight className="w-5 h-5 text-yellow-500/50 group-hover:text-yellow-200 transition-colors" />
            Return to Hawkins
          </button>
        </Link>

      </div>
    </div>
  );
}