"use client";

import { useState, useEffect } from "react"; // 🚨 Imported useEffect
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import AppField from "../form/AppField";
import AppSubmitButton from "../form/AppSubmitButton";

import { passwordResetAction } from "@/app/(commonLayout)/(authRouteGroup)/reset-password/_action";
import { IResetPasswordPayload } from "@/app/zod/auth.validation";
import { resendOtpForForgotPassword } from "@/service/otp.service"; 

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const emailFromUrl = searchParams.get("email") || "";

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0); // 🚨 New countdown state

  // 🚨 Effect to handle the countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [countdown]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { email: string; otp: string; password: string }) => 
        passwordResetAction(payload as IResetPasswordPayload)
  });

  const handleResendOtp = async () => {
    if (!emailFromUrl) {
      setServerError("Missing email address. Please go back and try again.");
      return;
    }

    setIsResending(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      const result = await resendOtpForForgotPassword(emailFromUrl);
      
      if (!result.success) {
        setServerError(result.message || "Failed to resend OTP.");
      } else {
        setSuccessMessage("A new OTP has been sent to your email!");
        setCountdown(60); // 🚨 Start the 60-second cooldown on success
      }
    } catch (error: any) {
      setServerError(`Failed to resend: ${error.message}`);
    } finally {
      setIsResending(false);
    }
  };

  const form = useForm({
    defaultValues: {
      otp: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);

      if (!emailFromUrl) {
        setServerError("Missing email address. Please request a new OTP.");
        return;
      }

      try {
        const payload = {
          email: emailFromUrl,
          otp: value.otp,
          password: value.password,
        };

        const result = (await mutateAsync(payload)) as any;

        if (!result.success) {
          setServerError(result.message || "Failed to reset password. Check your OTP.");
          return;
        }

        setSuccessMessage("Password reset successfully! Redirecting to login...");
        
        setTimeout(() => {
          router.push(result.redirectUrl || "/login");
        }, 1500);

      } catch (error: any) {
        if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) {
          throw error;
        }
        setServerError(`Reset failed: ${error.message}`);
      }
    },
  });

  return (
    <Card className="font-sans w-full max-w-[450px] mx-auto bg-black/75 sm:bg-black/80 text-foreground border-0 shadow-none px-4 py-8 sm:p-12 sm:pb-16 rounded-md">
      <CardHeader className="text-left px-0 pt-0">
        <CardTitle className="text-[32px] font-semibold mb-2">Create New Password</CardTitle>
        <p className="text-[16px] text-[#737373] mb-6">
          Enter the 6-digit code sent to <span className="text-foreground font-medium">{emailFromUrl || "your email"}</span> and choose a new password.
        </p>
      </CardHeader>

      <CardContent className="px-0">
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 [&_label]:sr-only [&_input]:bg-[#333] [&_input]:text-foreground [&_input]:border-none [&_input]:h-[48px] [&_input]:rounded-[4px] [&_input]:px-5 focus-visible:[&_input]:ring-0 focus:[&_input]:border-b-2 focus:[&_input]:border-[#e87c03]"
        >
          <form.Field name="otp">
            {(field) => (
              <AppField
                field={field}
                label="OTP"
                type="text"
                placeholder="Enter 6-digit OTP"
             
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="mt-4"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" aria-hidden="true" />
                    ) : (
                      <Eye className="size-5" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive" className="bg-[#e87c03] border-none text-foreground font-medium p-4 mt-4">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="bg-[#2b9049] border-none text-foreground font-medium p-4 mt-4">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="pt-4">
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  className="w-full bg-[#E50914] hover:bg-[#C11119] text-foreground h-[48px] font-bold text-[16px] rounded-[4px]"
                  isPending={isSubmitting || isPending}
                  pendingLabel="Resetting..."
                  disabled={!canSubmit || isResending}
                >
                  Reset Password
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-start bg-transparent px-0 border-t-0 pt-6 space-y-4">
        <p className="text-[16px] text-[#737373]">
          Didn't receive the email?{" "}
          <button 
            type="button"
            onClick={handleResendOtp}
            // 🚨 Disable button if currently sending OR if timer > 0
            disabled={isResending || countdown > 0} 
            className="text-foreground font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center disabled:hover:no-underline"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              // 🚨 Show timer text when disabled
              `Resend in ${countdown}s` 
            ) : (
              "Request new OTP"
            )}
          </button>
        </p>

        <p className="text-[16px] text-[#737373]">
          Remember your password?{" "}
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
