export interface IMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: "text" | "system";
}

export interface IConversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: Array<IMessage>;
}

export interface ChatState {
  conversations: Array<IConversation>;
  activeConversationId: string | null;
  isLoading: boolean;
}

export interface ChatActions {
  setConversations: (conversations: Array<IConversation>) => void;
  addConversation: (conversation: IConversation) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: IMessage) => void;
  markAsRead: (conversationId: string) => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
}

export type ChatStore = ChatState & ChatActions;
