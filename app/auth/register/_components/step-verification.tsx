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
import { CheckCircle2, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { VerificationFormData } from "../../_lib/validation";

function StepVerification() {
  const form = useFormContext<VerificationFormData>();
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    // In a real app, this would call an API to send the verification code
    setCodeSent(true);
    setCountdown(60);
  };

  const handleCodeChange = (value: string) => {
    form.setValue("code", value);
    if (value.length === 6) {
      // In a real app, this would verify the code with the backend
      // For now, we'll just mark it as verified
      setIsVerified(true);
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
              Click the button below to receive your verification code
            </p>
            <Button type="button" onClick={handleSendCode} className="w-full">
              Send Verification Code
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
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={handleCodeChange}
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
