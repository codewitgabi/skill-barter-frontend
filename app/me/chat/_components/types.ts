import type { Timestamp } from "firebase/firestore";

// Firestore document types
export interface FirestoreParticipant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  initials: string;
}

export interface FirestoreLastMessage {
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

export interface FirestoreConversation {
  participantIds: string[];
  participants: Record<string, FirestoreParticipant>;
  exchangeRequestId: string;
  createdAt: Timestamp;
  lastMessage: FirestoreLastMessage | null;
  unreadCount: Record<string, number>;
}

export interface FirestoreMessage {
  senderId: string;
  text: string;
  createdAt: Timestamp;
  isRead: boolean;
}

// UI types
export interface Contact {
  id: string;
  conversationId: string;
  name: string;
  username: string;
  avatar: string;
  initials: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatState {
  selectedContactId: string | null;
  contacts: Contact[];
  messages: Message[];
}
