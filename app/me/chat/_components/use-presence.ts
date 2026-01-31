"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  ref,
  set,
  onValue,
  onDisconnect,
  serverTimestamp,
  off,
} from "firebase/database";
import { rtdb } from "@/lib/firebase.config";
import { useAuth } from "@/hooks/use-auth";

interface PresenceData {
  isOnline: boolean;
  lastSeen: number | object;
}

// Debounce delay for offline status (5 seconds)
const OFFLINE_DEBOUNCE_MS = 5000;

// Heartbeat interval to keep presence updated (every 60 seconds)
const HEARTBEAT_INTERVAL_MS = 60000;

export function usePresence() {
  const { user } = useAuth();
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Set user as online
  const setOnline = useCallback(async (userId: string) => {
    const userPresenceRef = ref(rtdb, `presence/${userId}`);
    
    const presenceData: PresenceData = {
      isOnline: true,
      lastSeen: serverTimestamp(),
    };

    // Set up onDisconnect to update presence when connection is lost
    // This will set isOnline to false and update lastSeen
    await onDisconnect(userPresenceRef).set({
      isOnline: false,
      lastSeen: serverTimestamp(),
    });

    // Set the user as online
    await set(userPresenceRef, presenceData);
  }, []);

  // Update heartbeat (lastSeen timestamp)
  const updateHeartbeat = useCallback(async (userId: string) => {
    const userPresenceRef = ref(rtdb, `presence/${userId}`);
    
    await set(userPresenceRef, {
      isOnline: true,
      lastSeen: serverTimestamp(),
    });
  }, []);

  // Set user as offline (called on unmount with debounce)
  const setOffline = useCallback(async (userId: string) => {
    const userPresenceRef = ref(rtdb, `presence/${userId}`);
    
    await set(userPresenceRef, {
      isOnline: false,
      lastSeen: serverTimestamp(),
    });
  }, []);

  // Initialize presence tracking
  useEffect(() => {
    if (!user?._id || isInitializedRef.current) return;

    const userId = user._id;
    isInitializedRef.current = true;

    // Set online immediately
    setOnline(userId);

    // Set up heartbeat to keep presence fresh
    heartbeatRef.current = setInterval(() => {
      updateHeartbeat(userId);
    }, HEARTBEAT_INTERVAL_MS);

    // Handle visibility change (tab focus/blur)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setOnline(userId);
      }
      // Don't set offline on blur - let onDisconnect handle actual disconnects
    };

    // Handle before unload (page close/refresh)
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable delivery on page close
      // Note: This is a fallback, onDisconnect should handle most cases
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }

      // Debounce the offline status to prevent flickering on page refresh/navigation
      setTimeout(() => {
        setOffline(userId);
      }, OFFLINE_DEBOUNCE_MS);

      isInitializedRef.current = false;
    };
  }, [user?._id, setOnline, setOffline, updateHeartbeat]);

  return null;
}

// Hook to subscribe to a specific user's presence
export function useUserPresence(userId: string | null) {
  const presenceRef = useRef<ReturnType<typeof ref> | null>(null);
  const callbackRef = useRef<((isOnline: boolean) => void) | null>(null);

  const subscribe = useCallback((callback: (isOnline: boolean) => void) => {
    if (!userId) {
      callback(false);
      return () => {};
    }

    callbackRef.current = callback;
    presenceRef.current = ref(rtdb, `presence/${userId}`);

    const unsubscribe = onValue(presenceRef.current, (snapshot) => {
      const data = snapshot.val() as PresenceData | null;
      
      if (!data) {
        callback(false);
        return;
      }

      // Consider user online if isOnline is true AND lastSeen is within 2 minutes
      const lastSeenTime = typeof data.lastSeen === "number" ? data.lastSeen : 0;
      const isRecentlyActive = Date.now() - lastSeenTime < 120000; // 2 minutes
      
      callback(data.isOnline && isRecentlyActive);
    });

    return () => {
      if (presenceRef.current) {
        off(presenceRef.current);
      }
    };
  }, [userId]);

  return { subscribe };
}

// Hook to subscribe to multiple users' presence at once
export function useContactsPresence(userIds: string[]) {
  const presenceMapRef = useRef<Map<string, boolean>>(new Map());
  const listenersRef = useRef<Map<string, () => void>>(new Map());
  const callbackRef = useRef<((presenceMap: Map<string, boolean>) => void) | null>(null);

  const subscribe = useCallback((callback: (presenceMap: Map<string, boolean>) => void) => {
    callbackRef.current = callback;

    // Clean up old listeners for users no longer in the list
    listenersRef.current.forEach((unsubscribe, odlUserId) => {
      if (!userIds.includes(odlUserId)) {
        unsubscribe();
        listenersRef.current.delete(odlUserId);
        presenceMapRef.current.delete(odlUserId);
      }
    });

    // Set up listeners for each user
    userIds.forEach((userId) => {
      if (listenersRef.current.has(userId)) return; // Already listening

      const userPresenceRef = ref(rtdb, `presence/${userId}`);

      const unsubscribe = onValue(userPresenceRef, (snapshot) => {
        const data = snapshot.val() as PresenceData | null;

        if (!data) {
          presenceMapRef.current.set(userId, false);
        } else {
          const lastSeenTime = typeof data.lastSeen === "number" ? data.lastSeen : 0;
          const isRecentlyActive = Date.now() - lastSeenTime < 120000;
          presenceMapRef.current.set(userId, data.isOnline && isRecentlyActive);
        }

        // Notify callback with updated map
        if (callbackRef.current) {
          callbackRef.current(new Map(presenceMapRef.current));
        }
      });

      listenersRef.current.set(userId, () => off(userPresenceRef));
    });

    // Return cleanup function
    return () => {
      listenersRef.current.forEach((unsubscribe) => unsubscribe());
      listenersRef.current.clear();
      presenceMapRef.current.clear();
    };
  }, [userIds]);

  return { subscribe };
}
