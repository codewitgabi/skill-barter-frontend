"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAInstallButtonProps {
  variant?: "default" | "outline" | "ghost" | "cta";
  size?: "default" | "sm" | "lg";
  className?: string;
  showWhenInstalled?: boolean;
}

export function PWAInstallButton({
  variant = "default",
  size = "default",
  className,
  showWhenInstalled = false,
}: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if PWA is already installed
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - Safari specific
      window.navigator.standalone === true;

    setIsInstalled(isStandalone);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsSupported(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if already has a deferred prompt (for browsers that fire it early)
    // Also check for iOS Safari which doesn't support beforeinstallprompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isIOS && isSafari) {
      // iOS Safari doesn't support beforeinstallprompt but can still install
      setIsSupported(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // Listen for successful installation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      // For iOS Safari, show instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert(
          'To install this app on your iOS device, tap the Share button and then "Add to Home Screen".',
        );
        return;
      }
      return;
    }

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error("Error installing PWA:", error);
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  // Don't render if not supported and not on iOS
  if (!isSupported && !isInstalled) {
    return null;
  }

  // Don't render if installed and showWhenInstalled is false
  if (isInstalled && !showWhenInstalled) {
    return null;
  }

  // CTA variant for landing page
  if (variant === "cta") {
    return (
      <Button
        size="lg"
        onClick={handleInstallClick}
        disabled={isInstalled || isInstalling}
        className={cn(
          "border-white/30 bg-white/10 text-white hover:bg-white/20 text-base px-8 py-6 h-auto backdrop-blur-sm",
          className,
        )}
      >
        {isInstalled ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            App Installed
          </>
        ) : isInstalling ? (
          <>
            <Download className="mr-2 h-5 w-5 animate-bounce" />
            Installing...
          </>
        ) : (
          <>
            <Smartphone className="mr-2 h-5 w-5" />
            Install App
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant === "default" ? "default" : variant}
      size={size}
      onClick={handleInstallClick}
      disabled={isInstalled || isInstalling}
      className={cn(
        isInstalled && "bg-green-600 hover:bg-green-600 cursor-default",
        className,
      )}
    >
      {isInstalled ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Installed
        </>
      ) : isInstalling ? (
        <>
          <Download className="mr-2 h-4 w-4 animate-bounce" />
          Installing...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Install App
        </>
      )}
    </Button>
  );
}

// Card component for settings page
export function PWAInstallCard() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if running in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - Safari specific
      window.navigator.standalone === true;

    setIsInstalled(isStandalone);

    // Check if iOS
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iosCheck);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsSupported(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // iOS Safari support
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (iosCheck && isSafari) {
      setIsSupported(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error("Error installing PWA:", error);
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-primary/10">
          <Smartphone className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-medium">Install Skill Barter App</h3>
          <p className="text-sm text-muted-foreground">
            {isInstalled
              ? "The app is installed on your device. You can access it from your home screen."
              : isIOS
                ? "Add Skill Barter to your home screen for quick access and a better experience."
                : "Install Skill Barter on your device for quick access and offline features."}
          </p>

          {isIOS && !isInstalled && (
            <div className="mt-3 p-3 rounded-md bg-muted/50 text-sm">
              <p className="font-medium mb-1">How to install on iOS:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>
                  Tap the Share button{" "}
                  <span className="inline-block px-1 bg-muted rounded">⎋</span>{" "}
                  in Safari
                </li>
                <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                <li>Tap &quot;Add&quot; to confirm</li>
              </ol>
            </div>
          )}

          {!isIOS && (
            <div className="mt-3">
              {isSupported || isInstalled ? (
                <Button
                  size="sm"
                  onClick={handleInstallClick}
                  disabled={isInstalled || isInstalling || !deferredPrompt}
                  className={cn(
                    isInstalled &&
                      "bg-green-600 hover:bg-green-600 cursor-default",
                  )}
                >
                  {isInstalled ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Installed
                    </>
                  ) : isInstalling ? (
                    <>
                      <Download className="mr-2 h-4 w-4 animate-bounce" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Install App
                    </>
                  )}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  App installation is not available in this browser.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
