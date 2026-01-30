"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useAuth } from "@/hooks/use-auth";
import type { Notification } from "./types";
import { NOTIFICATIONS_PER_PAGE } from "./types";

export function useNotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = useCallback(
    async (isInitial = false) => {
      if (!user?._id) return;

      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const notificationsRef = collection(db, "notifications");
        let q = query(
          notificationsRef,
          where("userId", "==", user._id),
          orderBy("createdAt", "desc"),
          limit(NOTIFICATIONS_PER_PAGE),
        );

        if (!isInitial && lastDoc) {
          q = query(
            notificationsRef,
            where("userId", "==", user._id),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(NOTIFICATIONS_PER_PAGE),
          );
        }

        const snapshot = await getDocs(q);
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];

        if (isInitial) {
          setNotifications(newNotifications);
        } else {
          setNotifications((prev) => [...prev, ...newNotifications]);
        }

        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === NOTIFICATIONS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [user?._id, lastDoc],
  );

  // Initial fetch
  useEffect(() => {
    if (user?._id) {
      fetchNotifications(true);
    }
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          fetchNotifications(false);
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, fetchNotifications]);

  const markAsRead = async (notification: Notification) => {
    if (notification.status === "read") return;

    try {
      const notificationRef = doc(db, "notifications", notification.id);
      await updateDoc(notificationRef, {
        status: "read",
        readAt: Timestamp.now(),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, status: "read", readAt: Timestamp.now() }
            : n,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (n) => n.status === "unread",
    );
    if (unreadNotifications.length === 0) return;

    try {
      const updatePromises = unreadNotifications.map((notification) => {
        const notificationRef = doc(db, "notifications", notification.id);
        return updateDoc(notificationRef, {
          status: "read",
          readAt: Timestamp.now(),
        });
      });

      await Promise.all(updatePromises);

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          status: "read" as const,
          readAt: n.readAt || Timestamp.now(),
        })),
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return {
    notifications,
    isLoading,
    isLoadingMore,
    hasMore,
    unreadCount,
    loadMoreRef,
    handleNotificationClick,
    markAllAsRead,
  };
}
