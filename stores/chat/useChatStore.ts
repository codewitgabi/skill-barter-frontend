import { create } from "zustand";
import type { ChatStore } from "./chat.types";

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.message,
              lastMessageTime: message.timestamp,
              unreadCount:
                conv.id === state.activeConversationId
                  ? 0
                  : conv.unreadCount + 1,
            }
          : conv,
      ),
    })),
  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    })),
  clearChat: () => set({ conversations: [], activeConversationId: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
