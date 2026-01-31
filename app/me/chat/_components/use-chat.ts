"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { db, rtdb } from "@/lib/firebase.config";
import { useAuth } from "@/hooks/use-auth";
import type { Contact, FirestoreConversation } from "./types";

function formatTimestamp(timestamp: { toDate: () => Date } | null): string {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

interface PresenceData {
  isOnline: boolean;
  lastSeen: number | object;
}

export function useChat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [presenceMap, setPresenceMap] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const hasReceivedFirstSnapshot = useRef(false);
  const presenceListenersRef = useRef<Map<string, () => void>>(new Map());

  // Derive loading state: loading until we get first snapshot, or immediately false if no user
  const effectiveIsLoading = user?._id ? isLoading : false;

  // Fetch conversations from Firestore
  useEffect(() => {
    if (!user?._id) {
      hasReceivedFirstSnapshot.current = false;
      return;
    }

    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participantIds", "array-contains", user._id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const contactsList: Contact[] = snapshot.docs.map((doc) => {
          const data = doc.data() as FirestoreConversation;

          // Find the other participant (not the current user)
          const otherUserId = data.participantIds.find((id) => id !== user._id);
          const otherParticipant = otherUserId
            ? data.participants[otherUserId]
            : null;

          return {
            id: otherParticipant?.id || otherUserId || "",
            conversationId: doc.id,
            name: otherParticipant?.name || "Unknown User",
            username: otherParticipant?.username || "",
            avatar: otherParticipant?.avatar || "",
            initials: otherParticipant?.initials || "?",
            lastMessage: data.lastMessage?.text || "",
            lastMessageTime: formatTimestamp(data.lastMessage?.timestamp || data.createdAt),
            unreadCount: data.unreadCount?.[user._id] || 0,
            isOnline: false, // Will be updated by presence subscription
          };
        });

        setContacts(contactsList);
        hasReceivedFirstSnapshot.current = true;
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching conversations:", error);
        hasReceivedFirstSnapshot.current = true;
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?._id]);

  // Subscribe to presence for all contact user IDs
  useEffect(() => {
    const contactIds = contacts.map((c) => c.id).filter(Boolean);

    // Clean up listeners for contacts no longer in the list
    presenceListenersRef.current.forEach((unsubscribe, odlUserId) => {
      if (!contactIds.includes(odlUserId)) {
        unsubscribe();
        presenceListenersRef.current.delete(odlUserId);
        setPresenceMap((prev) => {
          const next = new Map(prev);
          next.delete(odlUserId);
          return next;
        });
      }
    });

    // Set up listeners for new contacts
    contactIds.forEach((userId) => {
      if (presenceListenersRef.current.has(userId)) return;

      const userPresenceRef = ref(rtdb, `presence/${userId}`);

      // onValue returns the unsubscribe function directly
      const unsubscribe = onValue(userPresenceRef, (snapshot) => {
        const data = snapshot.val() as PresenceData | null;

        let isOnline = false;
        if (data) {
          // If isOnline is true, user is online
          // lastSeen check is for extra validation but we trust isOnline primarily
          // serverTimestamp() might be an object before resolving, so handle both cases
          const lastSeenTime = typeof data.lastSeen === "number" ? data.lastSeen : Date.now();
          const isRecentlyActive = Date.now() - lastSeenTime < 180000; // 3 minutes
          isOnline = data.isOnline === true && isRecentlyActive;
        }

        setPresenceMap((prev) => {
          const next = new Map(prev);
          next.set(userId, isOnline);
          return next;
        });
      });

      // Store the actual unsubscribe function returned by onValue
      presenceListenersRef.current.set(userId, unsubscribe);
    });

    // Don't clean up all listeners here - only clean up removed contacts above
    // Full cleanup happens when component unmounts
  }, [contacts]);

  // Cleanup all presence listeners on unmount
  useEffect(() => {
    const listeners = presenceListenersRef.current;
    return () => {
      listeners.forEach((unsubscribe) => unsubscribe());
      listeners.clear();
    };
  }, []);

  // Merge contacts with presence data
  const contactsWithPresence = useMemo(() => {
    return contacts.map((contact) => ({
      ...contact,
      isOnline: presenceMap.get(contact.id) || false,
    }));
  }, [contacts, presenceMap]);

  return {
    contacts: contactsWithPresence,
    isLoading: effectiveIsLoading,
    currentUserId: user?._id || "",
  };
}
