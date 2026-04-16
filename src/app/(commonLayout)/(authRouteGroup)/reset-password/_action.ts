
"use server"
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/app/zod/auth.validation";
import { httpClient } from "@/lib/axios/httpClient";

export const passwordResetAction = async (payload: IResetPasswordPayload) => {
    const parsedPayload = resetPasswordZodSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "invalid input";
        return {
            success: false,
            message: firstError
        }
    }

    try {
       // Map "password" to "newPassword" for the backend
        const requestBody = {
            email: parsedPayload.data.email,
            otp: parsedPayload.data.otp,
            newPassword: parsedPayload.data.password, // 🚨 The magic translation happens here
        };

        const response: any = await httpClient.post("/auth/reset-password", requestBody);

        // 🚨 FIX: Axios stores your backend's JSON inside `response.data`
        const responseData = response.data;

        if (responseData && responseData.success === false) {
            return {
                success: false,
                message: responseData.message || "Invalid OTP or password"
            }
        }

        return {
            success: true,
            message: "Password reset successful!",
            redirectUrl: "/login"
        }

    } catch (error: any) {
        console.log('Error from reset password', error);
        
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

        console.error("Reset Error:", error?.response?.data || error.message);

        return {
            success: false,
            // Axios errors also store the backend message inside error.response.data
            message: error?.response?.data?.message || "Invalid OTP or password.",
        };
    }
}