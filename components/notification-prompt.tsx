"use client";

import { useState, useSyncExternalStore } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";

// Hydration-safe hook to detect client-side mounting
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // Client: mounted
    () => false, // Server: not mounted
  );
}

interface NotificationPromptProps {
  variant?: "banner" | "card" | "minimal";
  onDismiss?: () => void;
}

export function NotificationPrompt({
  variant = "card",
  onDismiss,
}: NotificationPromptProps) {
  const isMounted = useIsMounted();
  const { permission, isLoading, requestPermission, isSupported } =
    useNotifications();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage after mount
  const isActuallyDismissed =
    isDismissed ||
    (isMounted &&
      localStorage.getItem("notification-prompt-dismissed") === "true");

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("notification-prompt-dismissed", "true");
    onDismiss?.();
  };

  const handleEnable = async () => {
    await requestPermission();
  };

  // Don't render during SSR or if not supported/already granted/denied/dismissed
  if (
    !isMounted ||
    !isSupported ||
    permission === "granted" ||
    permission === "denied" ||
    isActuallyDismissed
  ) {
    return null;
  }

  if (variant === "banner") {
    return (
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <p className="text-sm">
              Enable notifications to stay updated on new messages and exchange
              requests.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              Not now
            </Button>
            <Button size="sm" onClick={handleEnable} disabled={isLoading}>
              {isLoading ? "Enabling..." : "Enable"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
        <Bell className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Enable notifications</p>
          <p className="text-xs text-muted-foreground">
            Get notified about new messages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleEnable} disabled={isLoading}>
            {isLoading ? "..." : "Enable"}
          </Button>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Enable Notifications</CardTitle>
              <CardDescription className="text-sm">
                Stay updated on your skill exchanges
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 -mr-2 -mt-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">
          Get instant notifications when someone wants to exchange skills with
          you, sends you a message, or when your sessions are about to start.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="flex-1"
          >
            Maybe later
          </Button>
          <Button
            size="sm"
            onClick={handleEnable}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Enabling..." : "Enable notifications"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
