"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useAuth } from "./use-auth";

export interface FirebaseNotification {
  id: string;
  actionUrl: string;
  createdAt: Timestamp;
  data: {
    sessionId?: string;
    message: string;
    [key: string]: unknown;
  };
  readAt: Timestamp | null;
  status: "unread" | "read";
  title: string;
  type: string;
  updatedAt: Timestamp;
  userId: string;
}

interface UseNotificationsReturn {
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  permission: NotificationPermission | "default";
  isSupported: boolean;
  requestPermission: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSupported = typeof window !== "undefined" && "Notification" in window;

  const [permission, setPermission] = useState<NotificationPermission | "default">(() => {
    if (isSupported) {
      return Notification.permission;
    }
    return "default";
  });

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  const hasReceivedSnapshot = useRef(false);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    hasReceivedSnapshot.current = false;

    // Query for unread notifications for the current user
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", user._id),
      where("status", "==", "unread"),
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!hasReceivedSnapshot.current) {
          hasReceivedSnapshot.current = true;
          setIsLoading(false);
        }
        setUnreadCount(snapshot.size);
      },
      (err) => {
        console.error("Error fetching notifications:", err);
        setError(err.message);
        setIsLoading(false);
      },
    );

    // Cleanup subscription on unmount or when user changes
    return () => unsubscribe();
  }, [user?._id]);

  return { unreadCount, isLoading, error, permission, isSupported, requestPermission };
}
