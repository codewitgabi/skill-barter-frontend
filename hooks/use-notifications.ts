"use client";

import { useState, useEffect, useCallback } from "react";
import {
  requestNotificationPermission,
  getMessagingInstance,
  onForegroundMessage,
} from "@/lib/firebase.config";
import { apiPatch } from "@/lib/api-client";
import { toast } from "sonner";

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
  data?: Record<string, string>;
}

type NotificationPermissionState =
  | "default"
  | "granted"
  | "denied"
  | "unsupported";

interface UseNotificationsReturn {
  permission: NotificationPermissionState;
  isLoading: boolean;
  fcmToken: string | null;
  requestPermission: () => Promise<void>;
  isSupported: boolean;
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] =
    useState<NotificationPermissionState>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Check initial permission state and setup foreground listener
  useEffect(() => {
    const checkSupport = async () => {
      if (typeof window === "undefined") {
        setIsSupported(false);
        return;
      }

      // Check if notifications are supported
      if (!("Notification" in window)) {
        setIsSupported(false);
        setPermission("unsupported");
        return;
      }

      // Check if service workers are supported
      if (!("serviceWorker" in navigator)) {
        setIsSupported(false);
        setPermission("unsupported");
        return;
      }

      // Set initial permission state
      setPermission(Notification.permission as NotificationPermissionState);

      // If already granted, setup messaging
      if (Notification.permission === "granted") {
        const messagingInstance = await getMessagingInstance();
        if (messagingInstance) {
          // Setup foreground message listener
          const unsubscribe = onForegroundMessage((payload: unknown) => {
            const typedPayload = payload as NotificationPayload;
            const title =
              typedPayload.notification?.title || "New Notification";
            const body = typedPayload.notification?.body || "";

            // Show toast for foreground notifications
            toast(title, {
              description: body,
              action: typedPayload.data?.url
                ? {
                    label: "View",
                    onClick: () => {
                      window.location.href = typedPayload.data?.url || "/@me";
                    },
                  }
                : undefined,
            });
          });

          return () => unsubscribe();
        }
      }
    };

    checkSupport();
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error("Notifications are not supported in this browser");
      return;
    }

    setIsLoading(true);

    try {
      const token = await requestNotificationPermission();

      if (token) {
        setFcmToken(token);
        setPermission("granted");

        // Send token to backend
        try {
          await apiPatch("/users/me", { fcmToken: token });
          toast.success("Notifications enabled successfully");
        } catch (error) {
          console.error("Failed to save FCM token to backend:", error);
          // Still show success since notifications will work locally
          toast.success("Notifications enabled");
        }

        // Setup foreground message listener
        const messagingInstance = await getMessagingInstance();
        if (messagingInstance) {
          onForegroundMessage((payload: unknown) => {
            const typedPayload = payload as NotificationPayload;
            const title =
              typedPayload.notification?.title || "New Notification";
            const body = typedPayload.notification?.body || "";

            toast(title, {
              description: body,
              action: typedPayload.data?.url
                ? {
                    label: "View",
                    onClick: () => {
                      window.location.href = typedPayload.data?.url || "/@me";
                    },
                  }
                : undefined,
            });
          });
        }
      } else {
        // Check what the current permission state is
        if (Notification.permission === "denied") {
          setPermission("denied");
          toast.error(
            "Notifications blocked. Please enable them in your browser settings.",
          );
        } else {
          toast.error("Failed to enable notifications. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to enable notifications");
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    permission,
    isLoading,
    fcmToken,
    requestPermission,
    isSupported,
  };
}
