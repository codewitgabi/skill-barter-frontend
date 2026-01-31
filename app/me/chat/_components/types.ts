export interface Contact {
  id: string;
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
