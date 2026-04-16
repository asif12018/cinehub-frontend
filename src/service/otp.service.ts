// actions/resend-otp_action.ts
"use server";

export const resendOtpAction = async (email: string) => {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


    // 🚨 Point this to your NEW custom Express route!
    // No more long Better-Auth paths. Just your clean /auth/resend-otp
    const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Now you ONLY need to send the email! Your Express service handles the rest.
      body: JSON.stringify({ email }),
    });

    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "Failed to resend OTP");
    }

    return {
      success: true,
      message: "OTP sent successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to resend OTP",
    };
  }
};



export const resendOtpForForgotPassword = async (email: string) => {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


    // 🚨 Point this to your NEW custom Express route!
    // No more long Better-Auth paths. Just your clean /auth/resend-otp
    const res = await fetch(`${API_BASE_URL}/auth/otp-forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Now you ONLY need to send the email! Your Express service handles the rest.
      body: JSON.stringify({ email }),
    });

    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "Failed to resend OTP");
    }

    return {
      success: true,
      message: "OTP sent successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to resend OTP",
    };
  }
};