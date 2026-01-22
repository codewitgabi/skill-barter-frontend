"use client";

import { useState } from "react";
import { toast } from "sonner";
import { generateMockSessions } from "./_components/generate-mock-sessions";
import { useSessions } from "./_components/use-sessions";
import SessionHeader from "./_components/session-header";
import SessionList from "./_components/session-list";
import SessionEmpty from "./_components/session-empty";
import SessionDetailsDialog from "./_components/session-details-dialog";
import type { ISession } from "./_components/types";

function Page() {
  const [sessions, setSessions] = useState<Array<ISession>>(
    generateMockSessions(),
  );
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { filteredSessions, stats, activeFilter, setActiveFilter } =
    useSessions({ sessions });

  const handleJoin = (id: number) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;

    if (session.meetingLink) {
      // Open the meeting link in a new tab
      window.open(session.meetingLink, "_blank", "noopener,noreferrer");
      toast.success("Opening session...", {
        description: `Connecting to ${session.partner.name}'s session`,
      });
    } else {
      // Show details if no meeting link
      setSelectedSession(session);
      setIsDetailsOpen(true);
    }
  };

  const handleViewDetails = (id: number) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setSelectedSession(session);
      setIsDetailsOpen(true);
    }
  };

  const handleCancel = async (id: number) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;

    // In a real app, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Update the session status to cancelled
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "cancelled" as const } : s,
      ),
    );

    toast.success("Session cancelled", {
      description: `Cancelled ${session.skill} session with ${session.partner.name}`,
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <SessionHeader
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
            stats={stats}
          />

          {filteredSessions.length === 0 ? (
            <SessionEmpty filter={activeFilter} />
          ) : (
            <SessionList
              sessions={filteredSessions}
              onJoin={handleJoin}
              onViewDetails={handleViewDetails}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>

      <SessionDetailsDialog
        session={selectedSession}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onJoin={handleJoin}
      />
    </>
  );
}

export default Page;
