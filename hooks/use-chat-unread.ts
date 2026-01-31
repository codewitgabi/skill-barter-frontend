"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useAuth } from "@/hooks/use-auth";

interface ConversationData {
  unreadCount: Record<string, number>;
}

export function useChatUnread() {
  const { user } = useAuth();
  const [totalUnread, setTotalUnread] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasReceivedFirstSnapshot = useRef(false);

  // Derive loading state: loading until we get first snapshot, or immediately false if no user
  const effectiveIsLoading = user?._id ? isLoading : false;

  useEffect(() => {
    if (!user?._id) {
      hasReceivedFirstSnapshot.current = false;
      setTotalUnread(0);
      return;
    }

    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participantIds", "array-contains", user._id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let total = 0;
        snapshot.docs.forEach((doc) => {
          const data = doc.data() as ConversationData;
          const unreadForUser = data.unreadCount?.[user._id] || 0;
          total += unreadForUser;
        });

        setTotalUnread(total);
        hasReceivedFirstSnapshot.current = true;
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching chat unread count:", error);
        hasReceivedFirstSnapshot.current = true;
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?._id]);

  return {
    totalUnread,
    isLoading: effectiveIsLoading,
  };
}
