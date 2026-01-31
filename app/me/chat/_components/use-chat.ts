"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
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

export function useChat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasReceivedFirstSnapshot = useRef(false);

  // Derive loading state: loading until we get first snapshot, or immediately false if no user
  const effectiveIsLoading = user?._id ? isLoading : false;

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
            isOnline: false, // TODO: Implement presence system
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

  return {
    contacts,
    isLoading: effectiveIsLoading,
    currentUserId: user?._id || "",
  };
}
