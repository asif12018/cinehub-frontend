import { setTokenInCookies } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";

/**
 * This route handles the redirect from the backend after Google OAuth completes.
 * The backend (Better Auth) redirects here with tokens as query params.
 * We store them as cookies and redirect the user to the intended destination.
 */
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const token = searchParams.get("token");          // better-auth session token (optional)
    const role = searchParams.get("role") || "USER";
    const redirect = searchParams.get("redirect") || "/dashboard";
    const error = searchParams.get("error");

    // If the OAuth flow failed, redirect to login with an error message
    if (error) {
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
    }

    // Guard: if no accessToken, something went wrong
    if (!accessToken) {
        return NextResponse.redirect(new URL("/login?error=google_no_token", req.url));
    }

    await setTokenInCookies("accessToken", accessToken);

    if (refreshToken) {
        await setTokenInCookies("refreshToken", refreshToken);
    }

    if (token) {
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day
    }

    if (role) {
        await setTokenInCookies("userRole", role);
    }

    // Redirect to the intended destination sent by the backend
    const safePath = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard";
    return NextResponse.redirect(new URL(safePath, req.url));
}
