"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ContactsList from "./_components/contacts-list";
import ChatArea from "./_components/chat-area";
import EmptyState from "./_components/empty-state";
import { useChat } from "./_components/use-chat";
import { useMessages } from "./_components/use-messages";
import { usePresence } from "./_components/use-presence";

function Page() {
  // Track current user's presence
  usePresence();

  const { contacts, isLoading: isLoadingContacts, currentUserId } = useChat();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || null;

  const {
    messages,
    isLoading: isLoadingMessages,
    sendMessage,
  } = useMessages({
    conversationId: selectedContact?.conversationId || null,
    currentUserId,
    otherUserId: selectedContact?.id || "",
  });

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  const handleBack = () => {
    setSelectedContactId(null);
  };

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Loading state
  if (isLoadingContacts) {
    return (
      <div className="h-[calc(100vh-4rem-5rem)] md:h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  // If no contacts, show empty state
  if (contacts.length === 0) {
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
                  contacts={contacts}
                  selectedContactId={selectedContactId}
                  onSelectContact={handleSelectContact}
                />
              </div>

              {/* Chat Area */}
              <div className="flex-1 h-full flex flex-col">
                <ChatArea
                  contact={selectedContact}
                  messages={messages}
                  currentUserId={currentUserId}
                  onSendMessage={handleSendMessage}
                  onBack={handleBack}
                  showBackButton={false}
                  isLoadingMessages={isLoadingMessages}
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
            contacts={contacts}
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
          />
        </div>

        {/* Full Screen Chat - Overlays everything including navbar and bottom bar */}
        {selectedContactId && (
          <div className="fixed inset-0 z-100 bg-background flex flex-col">
            <ChatArea
              contact={selectedContact}
              messages={messages}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              showBackButton={true}
              isLoadingMessages={isLoadingMessages}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
