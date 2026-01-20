"use client";

import { Button } from "@/components/ui/button";
import { Chrome, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

interface OAuthButtonsProps {
  className?: string;
  variant?: "default" | "outline";
}

function OAuthButtons({ className, variant = "outline" }: OAuthButtonsProps) {
  const handleOAuth = (provider: "google" | "linkedin") => {
    // UI only - OAuth will be implemented later
    console.log(`OAuth login with ${provider} - UI only for now`);
    // In production, this would redirect to OAuth provider
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Button
        type="button"
        variant={variant}
        className="w-full"
        onClick={() => handleOAuth("google")}
      >
        <Chrome className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant={variant}
        className="w-full"
        onClick={() => handleOAuth("linkedin")}
      >
        <Linkedin className="w-5 h-5 mr-2" />
        Continue with LinkedIn
      </Button>
    </div>
  );
}

export default OAuthButtons;
