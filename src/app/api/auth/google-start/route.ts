import { NextRequest, NextResponse } from "next/server";

// 1. Prevent Next.js from caching this GET route
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const callbackURL = `${appUrl}/api/auth/callback/google`;

    try {
        const response = await fetch(`${backendUrl}/api/v1/auth/sign-in/social`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            redirect: "manual",
            body: JSON.stringify({ provider: "google", callbackURL }),
        });

        // Extract redirect URL
        const locationHeader = response.headers.get("location");
        let redirectUrl = locationHeader;

        if (!redirectUrl) {
            try {
                const data = await response.json();
                if (data?.url && typeof data.url === "string") {
                    redirectUrl = data.url;
                }
            } catch {
                // body may not be JSON
            }
        }

        if (redirectUrl) {
            const nextResponse = NextResponse.redirect(redirectUrl);

            // 2. CRITICAL FIX: Forward cookies from the backend to the browser
            const cookies = response.headers.getSetCookie();
            cookies.forEach((cookie) => {
                nextResponse.headers.append("Set-Cookie", cookie);
            });

            return nextResponse;
        }

        console.error("Google start: no redirect URL from backend. Status:", response.status);
        return NextResponse.redirect(new URL("/login?error=google-init-failed", req.url));
    } catch (error) {
        console.error("Google start error:", error);
        return NextResponse.redirect(new URL("/login?error=google-init-failed", req.url));
    }
}