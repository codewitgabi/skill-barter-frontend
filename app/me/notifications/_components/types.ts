import { Timestamp } from "firebase/firestore";

export interface Notification {
  id: string;
  actionUrl: string;
  createdAt: Timestamp;
  data: {
    sessionId?: string;
    message: string;
    [key: string]: unknown;
  };
  message?: string;
  readAt: Timestamp | null;
  status: "unread" | "read";
  title: string;
  type: string;
  updatedAt: Timestamp;
  userId: string;
}

export const NOTIFICATIONS_PER_PAGE = 20;
