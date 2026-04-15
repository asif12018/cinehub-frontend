"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { resendOtpAction } from "@/service/otp.service";

export const verifyEmail = async (data: { email: string; otp: string }) => {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Assuming your httpClient returns the data directly.
    // If it returns an Axios response, you might need res.data.message
    const res = await httpClient.post(
      `${API_BASE_URL}/auth/verify-email-otp`,
      data,
    );

    // console.log("res", res);

    return {
      success: true,
      message: res.message || "Email verification successful",
      data: res.data,
      redirectUrl: "/", // Tell the client component to go to the home page
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "An error occurred during verification.",
    };
  }
};


