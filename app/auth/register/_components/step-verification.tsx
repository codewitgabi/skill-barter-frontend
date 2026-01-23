"use client";

import { useFormContext } from "react-hook-form";
import {
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
import { CheckCircle2, Mail, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiPost } from "@/lib/api-client";
import type { VerificationFormData } from "../../_lib/validation";
import type { RegistrationFormData } from "../../_lib/validation";

interface StepVerificationProps {
  onVerified?: () => void;
}

function StepVerification({ onVerified }: StepVerificationProps) {
  const form = useFormContext<RegistrationFormData>();
  const [codeSent, setCodeSent] = useState(true); // Code is sent in step 1
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    const formData = form.getValues();
    try {
      const response = await apiPost("/auth/email-verification", {
        email: formData.email,
      });
      if (response.status === "success") {
        setCodeSent(true);
        setCountdown(60);
        toast.success("Verification code sent!", {
          description: "Please check your email for the code.",
        });
      } else {
        toast.error("Failed to send code", {
          description: response.error?.message || "Please try again.",
        });
      }
    } catch {
      toast.error("Failed to send code", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleCodeChange = async (value: string) => {
    form.setValue("code", value);
    if (value.length === 6) {
      setIsVerifying(true);
      const formData = form.getValues();
      try {
        const response = await apiPost("/auth/verify-otp", {
          email: formData.email,
          otp: value,
        });
        if (response.status === "success") {
          setIsVerified(true);
          onVerified?.();
          toast.success("Email verified!", {
            description: "Your email has been successfully verified.",
          });
        } else {
          form.setError("code", {
            type: "manual",
            message: response.error?.message || "Invalid verification code",
          });
          setIsVerified(false);
        }
      } catch {
        form.setError("code", {
          type: "manual",
          message: "Failed to verify code. Please try again.",
        });
        setIsVerified(false);
      } finally {
        setIsVerifying(false);
      }
    } else {
      setIsVerified(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-muted-foreground">
          We&apos;ve sent a verification code to your email address
        </p>
      </div>

      {!codeSent ? (
        <div className="space-y-4">
          <div className="p-6 border-2 border-dashed rounded-lg text-center bg-muted/30">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              A verification code was sent to your email when you completed step 1.
              <br />
              If you didn&apos;t receive it, click the button below to resend.
            </p>
            <Button type="button" onClick={handleSendCode} className="w-full">
              Resend Verification Code
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {isVerified ? (
            <div className="p-6 border-2 border-[#10b981] rounded-lg text-center bg-[#10b981]/10">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-[#10b981]" />
              <p className="font-semibold text-lg mb-2">Email Verified!</p>
              <p className="text-sm text-muted-foreground">
                Your email has been successfully verified
              </p>
            </div>
          ) : (
            <>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center gap-2">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={handleCodeChange}
                          disabled={isVerifying || isVerified}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        {isVerifying && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying...
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the 6-digit code sent to your email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn&apos;t receive the code?
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="text-sm"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default StepVerification;
