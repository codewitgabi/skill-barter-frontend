"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api-client";
import {
  passwordResetOtpSchema,
  type PasswordResetOtpFormData,
} from "../../../_lib/validation";

function VerifyOtpForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const form = useForm<PasswordResetOtpFormData>({
    resolver: zodResolver(passwordResetOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  // Get email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("password-reset-email");
    if (storedEmail) {
      setEmail(storedEmail);
      form.setValue("email", storedEmail);
    } else {
      router.push("/auth/forgot-password");
    }
  }, [router, form]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = async (value: string) => {
    form.setValue("otp", value);
    form.clearErrors("otp");

    // Auto-submit when 5 digits are entered
    if (value.length === 5) {
      await handleSubmit({ email, otp: value });
    }
  };

  const handleSubmit = async (data: PasswordResetOtpFormData) => {
    setIsLoading(true);

    try {
      const response = await apiPost("/auth/verify-password-reset-otp", {
        email: data.email,
        otp: data.otp,
      });

      if (response.status === "success") {
        toast.success("Code verified!", {
          description: "You can now reset your password.",
        });
        // Navigate to reset password page (email already in localStorage)
        router.push("/auth/forgot-password/reset");
      } else {
        form.setError("otp", {
          type: "manual",
          message: response.error?.message || "Invalid verification code",
        });
      }
    } catch {
      form.setError("otp", {
        type: "manual",
        message: "Failed to verify code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      const response = await apiPost("/auth/forgot-password", { email });

      if (response.status === "success") {
        toast.success("Code resent!", {
          description: "Please check your email for the new code.",
        });
        setCountdown(60);
        form.setValue("otp", "");
      } else {
        toast.error("Failed to resend code", {
          description: response.error?.message || "Please try again.",
        });
      }
    } catch {
      toast.error("Failed to resend code", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="bg-background border-2 border-border rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Enter Verification Code</h1>
        <p className="text-muted-foreground">
          We&apos;ve sent a 5-digit code to
        </p>
        <p className="font-medium text-foreground">{email}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center gap-2">
                    <InputOTP
                      maxLength={5}
                      value={field.value}
                      onChange={handleOtpChange}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                      </InputOTPGroup>
                    </InputOTP>
                    {isLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="text-center">
                  Enter the 5-digit code sent to your email
                </FormDescription>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendCode}
              disabled={countdown > 0 || isResending}
              className="text-sm"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Use a different email
        </Link>
      </div>
    </div>
  );
}

export default VerifyOtpForm;
