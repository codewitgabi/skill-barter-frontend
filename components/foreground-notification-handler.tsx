"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { onForegroundMessage, getMessagingInstance } from "@/lib/firebase.config";
import { trackNotificationClick } from "@/lib/analytics";
import { Bell } from "lucide-react";

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    actionUrl?: string;
    [key: string]: unknown;
  };
}

export function ForegroundNotificationHandler() {
  const router = useRouter();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in strict mode
    if (isInitialized.current) return;
    isInitialized.current = true;

    let unsubscribe: (() => void) | undefined;

    const setupForegroundNotifications = async () => {
      // Ensure messaging is initialized
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      // Subscribe to foreground messages
      unsubscribe = onForegroundMessage((payload: unknown) => {
        const notificationPayload = payload as NotificationPayload;
        const title = notificationPayload.notification?.title || "New Notification";
        const body = notificationPayload.notification?.body;
        const actionUrl = notificationPayload.data?.actionUrl;

        console.log(notificationPayload);

        toast(title, {
          description: body,
          icon: <Bell className="h-4 w-4" />,
          action: actionUrl
            ? {
                label: "View",
                onClick: () => {
                  trackNotificationClick("foreground", actionUrl);
                  router.push(actionUrl);
                },
              }
            : undefined,
          duration: 5000,
        });
      });
    };

    setupForegroundNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);

  // This component doesn't render anything
  return null;
}
