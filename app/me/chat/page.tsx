"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ContactsList from "./_components/contacts-list";
import ChatArea from "./_components/chat-area";
import EmptyState from "./_components/empty-state";
import type { Contact, Message } from "./_components/types";

// Mock data for demonstration
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    username: "sarahj",
    avatar: "",
    initials: "SJ",
    lastMessage: "Sure, let's schedule our next session!",
    lastMessageTime: "2m ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    username: "mchen",
    avatar: "",
    initials: "MC",
    lastMessage: "Thanks for the Python tips yesterday",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Emily Davis",
    username: "emilyd",
    avatar: "",
    initials: "ED",
    lastMessage: "I'll send you the resources soon",
    lastMessageTime: "3h ago",
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: "4",
    name: "James Wilson",
    username: "jwilson",
    avatar: "",
    initials: "JW",
    lastMessage: "Great session! Looking forward to more",
    lastMessageTime: "1d ago",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "5",
    name: "Lisa Martinez",
    username: "lisam",
    avatar: "",
    initials: "LM",
    lastMessage: "Can we reschedule to tomorrow?",
    lastMessageTime: "2d ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "6",
    name: "James Wilson",
    username: "jwilson",
    avatar: "",
    initials: "JW",
    lastMessage: "Great session! Looking forward to more",
    lastMessageTime: "1d ago",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "7",
    name: "Lisa Martinez",
    username: "lisam",
    avatar: "",
    initials: "LM",
    lastMessage: "Can we reschedule to tomorrow?",
    lastMessageTime: "2d ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "8",
    name: "James Wilson",
    username: "jwilson",
    avatar: "",
    initials: "JW",
    lastMessage: "Great session! Looking forward to more",
    lastMessageTime: "1d ago",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "9",
    name: "Lisa Martinez",
    username: "lisam",
    avatar: "",
    initials: "LM",
    lastMessage: "Can we reschedule to tomorrow?",
    lastMessageTime: "2d ago",
    unreadCount: 0,
    isOnline: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      content: "Hey! How did you find our last session?",
      timestamp: "10:30 AM",
      isRead: true,
    },
    {
      id: "m2",
      senderId: "current",
      content: "It was great! I learned a lot about React hooks.",
      timestamp: "10:32 AM",
      isRead: true,
    },
    {
      id: "m3",
      senderId: "1",
      content: "Glad to hear that! Ready for the next topic?",
      timestamp: "10:35 AM",
      isRead: true,
    },
    {
      id: "m4",
      senderId: "current",
      content: "Yes! Can we cover state management next?",
      timestamp: "10:40 AM",
      isRead: true,
    },
    {
      id: "m5",
      senderId: "1",
      content: "Sure, let's schedule our next session!",
      timestamp: "10:42 AM",
      isRead: false,
    },
  ],
  "2": [
    {
      id: "m1",
      senderId: "current",
      content: "Thanks for helping me with the Python project!",
      timestamp: "Yesterday",
      isRead: true,
    },
    {
      id: "m2",
      senderId: "2",
      content: "Thanks for the Python tips yesterday",
      timestamp: "Yesterday",
      isRead: true,
    },
  ],
  "3": [
    {
      id: "m1",
      senderId: "3",
      content: "I'll send you the resources soon",
      timestamp: "3h ago",
      isRead: false,
    },
  ],
};

function Page() {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);

  const selectedContact = mockContacts.find((c) => c.id === selectedContactId) || null;
  const currentMessages = selectedContactId ? messages[selectedContactId] || [] : [];

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  const handleBack = () => {
    setSelectedContactId(null);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedContactId) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "current",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage],
    }));
  };

  // If no contacts, show empty state
  if (mockContacts.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem-5rem)] md:h-[calc(100vh-4rem)] flex items-center justify-center">
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block h-[calc(100vh-4rem)] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full py-6">
          <div className="max-w-5xl mx-auto h-full">
            <div className="border rounded-lg overflow-hidden h-full bg-background flex">
              {/* Contacts Sidebar */}
              <div className="w-80 lg:w-96 border-r shrink-0 h-full flex flex-col">
                <ContactsList
                  contacts={mockContacts}
                  selectedContactId={selectedContactId}
                  onSelectContact={handleSelectContact}
                />
              </div>

              {/* Chat Area */}
              <div className="flex-1 h-full flex flex-col">
                <ChatArea
                  contact={selectedContact}
                  messages={currentMessages}
                  currentUserId="current"
                  onSendMessage={handleSendMessage}
                  onBack={handleBack}
                  showBackButton={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-[calc(100vh-4rem-5rem)] overflow-hidden">
        {/* Contacts List - Always rendered but hidden when chat is open */}
        <div
          className={cn(
            "h-full bg-background",
            selectedContactId && "hidden"
          )}
        >
          <ContactsList
            contacts={mockContacts}
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
          />
        </div>

        {/* Full Screen Chat - Overlays everything including navbar and bottom bar */}
        {selectedContactId && (
          <div className="fixed inset-0 z-100 bg-background flex flex-col">
            <ChatArea
              contact={selectedContact}
              messages={currentMessages}
              currentUserId="current"
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              showBackButton={true}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
