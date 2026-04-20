"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";

export const registerAction = async (
  formData: FormData,
  redirectPath?: string,
) => {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: formData,
      // Native fetch will automatically set the correct Content-Type (multipart/form-data)
      // with the boundary string when passing FormData!
    });

    const response = await res.json();


    if (!response.success || !res.ok) {
      throw new Error(response.message || "Registration failed");
    }

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, email } = user;

    // Set cookies
   
    // await setTokenInCookies("accessToken", accessToken);
    // await setTokenInCookies("refreshToken", refreshToken);

    // if (token) {
    //   await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
    // }

    await setTokenInCookies("userRole", role);

    // 🟢 SIMPLIFIED REDIRECT LOGIC 🟢
    let targetPath = redirectPath;

    // If no specific redirect path was provided, decide based on role
    // if (!targetPath) {
    //     if (role === "ADMIN" || role === "SUPER_ADMIN") {
    //         targetPath = "/admin/dashboard";
    //     } else {
    //         targetPath = "/"; // Standard users go to home menu
    //     }
    // }

    targetPath = "/verify-email?email=" + email;

    return {
      success: true,
      message: response.message || "Registration successful!",
      redirectUrl: targetPath,
    } as any;
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An error occurred during registration.",
    };
  }
};
