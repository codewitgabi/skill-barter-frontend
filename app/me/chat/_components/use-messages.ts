"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  increment,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import type { Message, FirestoreMessage } from "./types";

function formatMessageTimestamp(timestamp: { toDate: () => Date } | null): string {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString();
}

interface UseMessagesProps {
  conversationId: string | null;
  currentUserId: string;
  otherUserId: string;
}

export function useMessages({
  conversationId,
  currentUserId,
  otherUserId,
}: UseMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Subscribe to messages
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);

    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesList: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data() as FirestoreMessage;
          return {
            id: doc.id,
            senderId: data.senderId,
            content: data.text,
            timestamp: formatMessageTimestamp(data.createdAt),
            isRead: data.isRead,
          };
        });

        setMessages(messagesList);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  // Mark conversation and messages as read when opened
  useEffect(() => {
    if (!conversationId || !currentUserId || !otherUserId) return;

    const markAsRead = async () => {
      try {
        // Reset unread count for current user
        await updateDoc(doc(db, "conversations", conversationId), {
          [`unreadCount.${currentUserId}`]: 0,
        });

        // Mark all unread messages from the other user as read
        const messagesRef = collection(db, "conversations", conversationId, "messages");
        const unreadQuery = query(
          messagesRef,
          where("senderId", "==", otherUserId),
          where("isRead", "==", false)
        );

        const unreadSnapshot = await getDocs(unreadQuery);

        if (!unreadSnapshot.empty) {
          const batch = writeBatch(db);
          unreadSnapshot.docs.forEach((docSnapshot) => {
            batch.update(docSnapshot.ref, { isRead: true });
          });
          await batch.commit();
        }
      } catch (error) {
        console.error("Error marking conversation as read:", error);
      }
    };

    markAsRead();
  }, [conversationId, currentUserId, otherUserId]);

  // Send message function
  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !currentUserId || !content.trim()) return;

      setIsSending(true);

      try {
        // Add message to subcollection
        await addDoc(collection(db, "conversations", conversationId, "messages"), {
          senderId: currentUserId,
          text: content.trim(),
          createdAt: serverTimestamp(),
          isRead: false,
        });

        // Update conversation metadata
        await updateDoc(doc(db, "conversations", conversationId), {
          lastMessage: {
            text: content.trim(),
            senderId: currentUserId,
            timestamp: serverTimestamp(),
          },
          [`unreadCount.${otherUserId}`]: increment(1),
        });
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, currentUserId, otherUserId]
  );

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
  };
}
