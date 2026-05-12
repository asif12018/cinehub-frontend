"use client"; // 🔴 THIS MUST BE EXACTLY ON LINE 1

import { Suspense } from "react"; // 🟢 1. Imported Suspense
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import { MovieRow } from "@/components/ui/movie-row";
import { MovieCard } from "@/components/ui/movie-card"; 
import { SplashIntro } from "@/components/ui/splash-intro"; 
import { Pricing } from "@/components/ui/pricing"; 
import { getMedia } from "@/service/media.service";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { AiMovieRecommendation } from "@/components/ui/ai-movie-recommendation";
import { AiMovieRow } from "@/components/ui/ai-movie-row";

// 🟢 2. Renamed your original Home component to HomeContent
function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const { data: media, isLoading } = useQuery<any>({
    queryKey: ["media", searchQuery],
    queryFn: () => getMedia(searchQuery ? `searchTerm=${searchQuery}` : "")
  });

  const moviesList = media?.data?.data?.data || media?.data?.data || media?.data || [];
  const isSearching = !!searchQuery;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      
      {/* We only show the intro if the user isn't actively searching for something */}
      {!isSearching && <SplashIntro />}

      
      
      {!isSearching && <Hero movies={moviesList} />}
      
      {/* MAIN CONTENT AREA */}
      <main className={isSearching ? "pt-32 px-4 md:px-12 min-h-[75vh]" : "pb-20"}>
        
        {/* 🔥 AI RECOMMENDATION WIDGET ADDED HERE SO IT'S VISIBLE ON HOME PAGE 🔥 */}
        <div className="pt-8 px-4 md:px-12">
          <AiMovieRecommendation />
        </div>

        {isLoading ? (
          /* SKELETON LOADER */
          <div className={isSearching ? "" : "pt-12 px-4 md:px-12"}>
             <div className="w-48 h-8 bg-muted/60 rounded-md animate-pulse mb-6" />
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="aspect-[2/3] bg-muted/40 rounded-md animate-pulse shadow-xl" />
               ))}
             </div>
          </div>
        ) : isSearching ? (
          
          /* SEARCH RESULTS VIEW (Grid Layout) */
          <section className="animate-in fade-in duration-500">
            <h1 className="text-2xl md:text-3xl font-medium text-muted-foreground mb-8 tracking-wide">
              Explore titles related to: <span className="text-foreground font-bold">"{searchQuery}"</span>
            </h1>
            
            {moviesList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
                {moviesList.map((movie: any) => (
                  <div key={movie.id} className="transition-transform duration-300 hover:scale-105 hover:z-10 cursor-pointer">
                    <MovieCard movie={movie} /> 
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <SearchIcon className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn't find any movies or series matching "{searchQuery}". Try adjusting your search criteria.
                </p>
              </div>
            )}
          </section>

        ) : (
          
          /* DEFAULT CATEGORY ROWS (Clean Spacing, No Overlap) */
          <div className="flex flex-col gap-8 md:gap-12 mt-8 md:mt-12 animate-in fade-in duration-700">
            
            <AiMovieRow movies={moviesList} />

            <MovieRow 
              title="Trending Now" 
              movies={[...moviesList].sort((a: any, b: any) => (b.views || b.likes || 0) - (a.views || a.likes || 0)).slice(0, 5)} 
            />
            
            <MovieRow 
              title="Top Rated This Week" 
              movies={[...moviesList].filter(m => m.avgRating > 0).sort((a: any, b: any) => (b.avgRating || 0) - (a.avgRating || 0)).slice(0, 5)} 
            />

            <MovieRow 
              title="Newly Added" 
              movies={[...moviesList].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)} 
            />
            
            <MovieRow 
              title="Editor’s Picks" 
              movies={moviesList.filter((m: any) => m.isEditorPick === true).slice(0, 5)} 
            />

            {/* FEATURES SECTION */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose CineTube?</h2>
                <p className="text-muted-foreground text-lg">Experience entertainment like never before.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-muted/20 p-8 rounded-2xl border border-border text-center hover:bg-muted/30 transition-colors">
                  <div className="w-16 h-16 mx-auto bg-red-600/20 text-red-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Unlimited Streaming</h3>
                  <p className="text-muted-foreground">Watch as much as you want, ad-free. Discover new titles added every week.</p>
                </div>
                <div className="bg-muted/20 p-8 rounded-2xl border border-border text-center hover:bg-muted/30 transition-colors">
                  <div className="w-16 h-16 mx-auto bg-red-600/20 text-red-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Watch Everywhere</h3>
                  <p className="text-muted-foreground">Stream on your smart TV, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
                </div>
                <div className="bg-muted/20 p-8 rounded-2xl border border-border text-center hover:bg-muted/30 transition-colors">
                  <div className="w-16 h-16 mx-auto bg-red-600/20 text-red-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Download & Go</h3>
                  <p className="text-muted-foreground">Coming Soon....</p>
                </div>
              </div>
            </div>

            {/* STATISTICS SECTION */}
            <div className="w-full bg-primary/10 py-16 border-y border-border">
              <div className="max-w-7xl mx-auto px-4 md:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">10K+</h3>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Movies & Shows</p>
                  </div>
                  <div>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">50M+</h3>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Active Users</p>
                  </div>
                  <div>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">120+</h3>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Countries Supported</p>
                  </div>
                  <div>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">4K</h3>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Ultra HD Quality</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DEVICES SECTION */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Available on your favorite devices</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">Stream on your phone, tablet, laptop, and TV without paying more. CineTube is fully optimized for all major platforms so you can take your entertainment anywhere.</p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-foreground font-medium">Smart TVs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-foreground font-medium">Smartphones</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-foreground font-medium">Tablets & iPads</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-foreground font-medium">Gaming Consoles</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative w-full">
                  <div className="aspect-video bg-muted/20 rounded-2xl border border-border flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
                     {/* Abstract shape to simulate a device showcase */}
                     <div className="w-3/4 h-3/4 bg-background border border-border rounded-lg shadow-inner flex items-center justify-center">
                        <span className="text-muted-foreground font-bold uppercase tracking-widest text-sm">Cross-Platform Sync</span>
                     </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-full blur-3xl z-0"></div>
                </div>
              </div>
            </div>
            
            {/* PRICING SECTION */}
            <Pricing />
            
            {/* FAQ SECTION */}
            <div className="w-full max-w-5xl mx-auto px-4 md:px-12 py-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                <p className="text-muted-foreground text-lg">Everything you need to know about CineTube.</p>
              </div>
              <div className="space-y-4">
                {[
                  { q: "What is CineTube?", a: "CineTube is a premium movie streaming platform offering the latest blockbusters and timeless classics." },
                  { q: "How much does it cost?", a: "You can watch movies for free, rent them for 48 hours, or subscribe for unlimited access." },
                  { q: "Can I watch on multiple devices?", a: "Yes, you can stream on your TV, laptop, tablet, or smartphone." },
                  { q: "How do I cancel my subscription?", a: "You can cancel your subscription at any time from your account settings." }
                ].map((faq, index) => (
                  <div key={index} className="bg-muted/30 border border-border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        )}
      </main>
    </div>
  );
}

// 🟢 3. The new default export wraps everything in Suspense!
export default function Home() {
  return (
    // Shows a cool red spinner matching your theme while Next.js figures out the URL parameters
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
