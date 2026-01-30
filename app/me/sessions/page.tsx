"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api-client";
import { formatSessionDate } from "@/lib/helpers";
import { useAuth } from "@/hooks/use-auth";
import { useSessions } from "./_components/use-sessions";
import SessionHeader from "./_components/session-header";
import SessionList from "./_components/session-list";
import SessionEmpty from "./_components/session-empty";
import SessionDetailsDialog from "./_components/session-details-dialog";
import type { ISession } from "./_components/types";
import { Loader2 } from "lucide-react";

interface SessionResponse {
  id: string;
  userRole: string;
  instructor: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    initials: string;
  };
  learner: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    initials: string;
  };
  skill: string;
  type: string;
  status: string;
  scheduledDate: string;
  duration: number;
  description: string | null;
  location: string;
  meetingLink: string | null;
  address: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SessionsData {
  sessions: SessionResponse[];
  dashboard: {
    total: number;
    active: number;
    scheduled: number;
    completed: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function mapSessionResponseToISession(
  session: SessionResponse,
  currentUserId: string,
): ISession {
  // Determine if current user is the instructor
  const isInstructor = session.instructor.id === currentUserId;
  const partner = isInstructor ? session.learner : session.instructor;

  // If user is instructor, it's Teaching; otherwise Learning
  const type: "Learning" | "Teaching" = isInstructor ? "Teaching" : "Learning";

  // Map status - API returns "scheduled", "active", "completed", etc.
  let status: "active" | "scheduled" | "completed" | "cancelled" = "scheduled";
  if (session.status === "active") {
    status = "active";
  } else if (session.status === "completed") {
    status = "completed";
  } else if (session.status === "cancelled") {
    status = "cancelled";
  } else {
    status = "scheduled";
  }

  // Convert hex string ID to number (use last 8 chars to avoid overflow)
  const idNumber = parseInt(session.id.slice(-8), 16) || 0;
  
  return {
    id: idNumber,
    type,
    skill: session.skill,
    partner: {
      id: partner.id,
      name: partner.name,
      avatar: partner.avatarUrl || "/placeholder-avatar.jpg",
    },
    status,
    scheduledTime: formatSessionDate(session.scheduledDate),
    scheduledDate: session.scheduledDate,
    duration: session.duration,
    location: session.location === "online" ? "online" : "in-person",
    meetingLink: session.meetingLink || undefined,
    description: session.description || "",
    objectives: [], // API doesn't provide objectives
    completedAt: session.completedAt
      ? formatSessionDate(session.completedAt)
      : undefined,
    rating: undefined, // API doesn't provide rating
  };
}

function Page() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Array<ISession>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    active: 0,
    scheduled: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?._id) return;

      try {
        setIsLoading(true);
        const response = await apiGet<SessionsData>("/sessions");

        if (response.status === "success" && response.data) {
          const mappedSessions = response.data.sessions.map((session) =>
            mapSessionResponseToISession(session, user!._id),
          );
          setSessions(mappedSessions);
          setDashboardStats(response.data.dashboard);
        } else {
          toast.error("Failed to load sessions", {
            description: "Please try again later.",
          });
        }
      } catch (error) {
        toast.error("Failed to load sessions", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const { filteredSessions, stats: calculatedStats, activeFilter, setActiveFilter } =
    useSessions({ sessions });
  
  // Use dashboard stats from API if available, otherwise use calculated stats
  const stats = dashboardStats.total > 0 ? dashboardStats : calculatedStats;

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


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading sessions...</span>
          </div>
        </div>
      </div>
    );
  }

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
