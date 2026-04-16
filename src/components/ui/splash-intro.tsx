"use client";

import { useState, useEffect } from "react";

export function SplashIntro() {
  // We start by assuming we should show it, but we'll check session storage immediately
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the intro during this browser session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setShowSplash(false);
    }
  }, []);

  const handleVideoEnd = () => {
    // Start the fade out animation
    setIsFading(true);
    
    // Wait for the CSS fade transition to finish (500ms) before removing from DOM
    setTimeout(() => {
      setShowSplash(false);
      // Save to session storage so it doesn't play again until they close the browser tab
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
      <video
        src="/cinehub-intro.mp4" 
        autoPlay
        muted // Note: Browsers block unmuted autoplay. Muted guarantees it plays instantly.
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
      />
    </div>
  );
}