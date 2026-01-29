"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api-client";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../_lib/validation";

function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await apiPost("/auth/forgot-password", {
        email: data.email,
      });

      if (response.status === "success") {
        // Store email in localStorage for security (avoid URL exposure)
        localStorage.setItem("password-reset-email", data.email);
        toast.success("Verification code sent!", {
          description: "Please check your email for the 5-digit code.",
        });
        // Navigate to OTP verification page
        router.push("/auth/forgot-password/verify");
      } else {
        form.setError("root", {
          type: "manual",
          message:
            response.error?.message || "Failed to send verification code",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background border-2 border-border rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
        <p className="text-muted-foreground">
          No worries! Enter your email and we&apos;ll send you a verification
          code.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {form.formState.errors.root && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the email address associated with your account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link
          href="/auth/signin"
          className="text-sm text-primary hover:underline"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
