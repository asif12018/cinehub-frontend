/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ILoginPayload, loginZodSchema } from "@/app/zod/auth.validation";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { redirect } from "next/navigation";

export const loginAction = async (
    payload: ILoginPayload,
    redirectPath?: string
): Promise<ILoginResponse | ApiErrorResponse> => {
    
    const parsedPayload = loginZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        const response: any = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);
        // console.log("response from login", response)

        if (response && response.success === false) {
            return {
                success: false,
                message: response.message || "Invalid email or password.",
            };
        }

        const { accessToken, refreshToken, token, user } = response.data;
        const { role, email } = user;

        // Set cookies
        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        
        if (token) {
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); 
        }
        await setTokenInCookies("userRole", role); 

        // 🟢 SIMPLIFIED REDIRECT LOGIC 🟢
        let targetPath = redirectPath;

        // If no specific redirect path was provided, decide based on role
        if (!targetPath) {
            if (role === "ADMIN" || role === "SUPER_ADMIN") {
                targetPath = "/dashboard";
            } 
        }

        // DO NOT Trigger the redirect immediately here so the client can show a success msg
        // redirect(targetPath);
        return {
            success: true,
            message: "Login successful!",
            redirectUrl: targetPath
        } as any;

    } catch (error: any) {
        console.log('error from login', error)
        // Required for Next.js redirects to work inside try/catch blocks
        if (
            error &&
            typeof error === "object" &&
            "digest" in error &&
            typeof error.digest === "string" &&
            error.digest.startsWith("NEXT_REDIRECT")
        ) {
            throw error;
        }

        console.error("Login Error:", error?.response?.data || error.message);

        // Do not redirect on login errors, let the user see the exact error message
        // if (error?.response?.data?.message === "Email not verified") {
        //     redirect(`/verify-email?email=${payload.email}`);
        // }

        return {
            success: false,
            message: error?.response?.data?.message || "Invalid email or password.",
        };
    }
};
