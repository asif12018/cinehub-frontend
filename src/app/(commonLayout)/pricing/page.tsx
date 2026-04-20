"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, X, Crown, Sparkles, Loader2, AlertCircle, Film, MonitorPlay } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/service/auth.service";
import { getSubscriptionInfo, purchaseAMovie } from "@/service/payment.service";
import { toast } from "sonner";

export default function PricingPage() {
  const router = useRouter();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // 1. Fetch User Info
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: getUserInfo,
  });

  // 2. Fetch Subscription Status
  const { data: subResponse, isLoading: isLoadingSub } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: getSubscriptionInfo,
    enabled: !!user,
  });

  const isSubscribed =
    subResponse === true || subResponse?.data === true || subResponse?.success === true;
  const isLoading = isLoadingUser || (user && isLoadingSub);

  // 🟢 HANDLE CHECKOUT BUTTON CLICK
 // 🟢 HANDLE CHECKOUT BUTTON CLICK
  const handleSubscribeClick = async () => {
    // 1. Ensure the user is logged in first
    if (!user) {
      toast.error("Please log in to subscribe!");
      router.push("/login");
      return;
    }

    // 2. Trigger your existing checkout logic
    try {
      setIsCheckoutLoading(true);
      
      // Call your API with "SUBSCRIPTION". No movie ID is needed for a global sub!
      const checkoutUrl = await purchaseAMovie("SUBSCRIPTION"); 
      
      if (checkoutUrl) {
        // Redirect the user to the payment gateway
        window.location.href = checkoutUrl; 
      } else {
        toast.error("Failed to create checkout session. Please try again.");
        setIsCheckoutLoading(false);
      }
    } catch (error) {
      console.error("Checkout failed", error);
      toast.error("Something went wrong during checkout.");
      setIsCheckoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* 🟢 STATE 1: USER IS ALREADY SUBSCRIBED */}
        {isSubscribed ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Welcome to PRO</h1>
              <p className="text-gray-400 text-lg">Thank you for being a premium member of CineHub.</p>
            </div>

            <div className="bg-[#141414] border border-yellow-500/30 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(234,179,8,0.1)] max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-8 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                    CineHub <span className="text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded text-sm uppercase tracking-wider border border-yellow-500/20">Pro Plan</span>
                  </h2>
                  <p className="text-gray-400">Unlimited streaming. No ads. 4K HDR.</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" /> Active Status
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-gray-200 transition-colors">
                  Browse Movies
                </button>
                <button className="w-full bg-transparent border border-gray-700 text-gray-300 font-medium py-3.5 rounded-lg hover:text-white hover:border-gray-500 transition-colors">
                  Manage Subscription Options
                </button>
              </div>
            </div>
          </div>
        ) : (
          
          /* 🟢 STATE 2: USER IS NOT SUBSCRIBED (SALES PAGE) */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif tracking-tight">
                Choose the plan that's <br className="hidden md:block"/> right for you
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                Unlock endless entertainment. Watch all you want, ad-free. Recommendations just for you. Change or cancel your plan anytime.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
              
              {/* Basic Plan (Free/Guest) */}
              <div className="flex-1 bg-[#141414] border border-gray-800 rounded-2xl p-8 opacity-70 hover:opacity-100 transition-opacity flex flex-col">
                <h3 className="text-xl font-medium text-gray-300 mb-2">Guest Pass</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">Free</span>
                </div>
                
                <div className="space-y-4 mb-8 flex-1">
                  <FeatureItem text="Browse the movie catalog" included={true} />
                  <FeatureItem text="Read and write reviews" included={true} />
                  <FeatureItem text="Watch trailers" included={true} />
                  <FeatureItem text="Watch full HD movies" included={false} />
                  <FeatureItem text="Ad-free experience" included={false} />
                </div>

                <button 
                  disabled
                  className="w-full bg-gray-800 text-gray-400 font-medium py-3.5 rounded-lg cursor-not-allowed"
                >
                  Current Plan
                </button>
              </div>

              {/* Pro Plan (Highlighted) */}
              <div className="flex-1 bg-gradient-to-b from-[#1f1012] to-[#141414] border-2 border-red-600 rounded-2xl p-8 relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(229,9,20,0.15)] flex flex-col">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
                
                <h3 className="text-xl font-medium text-red-500 mb-2">CineHub Pro</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">$75</span>
                  <span className="text-gray-400 font-medium">/month</span>
                </div>
                <p className="text-sm text-gray-400 mb-6 border-b border-gray-800 pb-6">Cancel anytime. No hidden fees.</p>
                
                <div className="space-y-4 mb-8 flex-1">
                  <FeatureItem text="Everything in Guest" included={true} highlight={false} />
                  <FeatureItem text="Unlimited Movies & Shows" included={true} highlight={true} />
                  <FeatureItem text="Ultra HD 4K & HDR Quality" included={true} highlight={true} />
                  <FeatureItem text="Zero Advertisements" included={true} highlight={true} />
                  <FeatureItem text="Watch on 4 devices at once" included={true} highlight={false} />
                </div>

                <button 
                  onClick={handleSubscribeClick}
                  disabled={isCheckoutLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isCheckoutLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MonitorPlay className="w-5 h-5" />}
                  Subscribe Now
                </button>
              </div>

            </div>

            {/* Bottom Trust Banner */}
            <div className="mt-16 text-center flex flex-col items-center justify-center gap-2 text-gray-500 text-sm">
              <AlertCircle className="w-5 h-5 mb-1" />
              <p>Secure payment processing.</p>
              <p>Your subscription will automatically renew unless canceled.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🟢 Helper Component for the checklist
function FeatureItem({ text, included, highlight = false }: { text: string; included: boolean; highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${!included ? "opacity-50" : ""}`}>
      {included ? (
        <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${highlight ? "bg-red-600" : "bg-gray-700"}`}>
          <Check className="w-3 h-3 text-white stroke-[3]" />
        </div>
      ) : (
        <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gray-800">
          <X className="w-3 h-3 text-gray-500 stroke-[3]" />
        </div>
      )}
      <span className={`text-sm md:text-base ${highlight ? "text-white font-medium" : "text-gray-300"}`}>
        {text}
      </span>
    </div>
  );
}