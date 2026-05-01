"use client";

import { useState, useEffect, useRef } from "react";

export function SplashIntro() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check if the user has already seen the intro during this browser session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setShowSplash(false);
      return;
    }

    // Safety fallback: if video takes more than 8s to start, skip the intro
    // This prevents users on slow connections from being stuck forever
    timeoutRef.current = setTimeout(() => {
      handleDone();
    }, 8000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDone = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsFading(true);
    setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("hasSeenIntro", "true");
    }, 500);
  };

  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Loading spinner shown while video is buffering */}
      {!isVideoReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
          <div
            style={{
              width: 56,
              height: 56,
              border: "4px solid rgba(255,255,255,0.15)",
              borderTop: "4px solid #e50914",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Loading…
          </p>
        </div>
      )}

      <video
        src="/cinehub-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setIsVideoReady(true)}
        onEnded={handleDone}
        className="w-full h-full object-cover"
        style={{ opacity: isVideoReady ? 1 : 0, transition: "opacity 0.3s" }}
      />
    </div>
  );
}
