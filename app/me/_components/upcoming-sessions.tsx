"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api-client";
import { formatSessionDate } from "@/lib/helpers";
import { useAuth } from "@/hooks/use-auth";
import type { IUpcomingSession } from "@/types/dashboard";

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

function UpcomingSessions() {
  const router = useRouter();
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState<IUpcomingSession[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      if (!user?._id) return;

      try {
        setIsLoading(true);
        const response = await apiGet<SessionsData>(
          "/sessions?limit=3&status=scheduled",
        );

        if (response.status === "success" && response.data) {
          // Filter for scheduled/active sessions and map to IUpcomingSession
          const mappedSessions: IUpcomingSession[] = response.data.sessions
            .filter(
              (session) =>
                session.status === "scheduled" || session.status === "active",
            )
            .slice(0, 3)
            .map((session, index) => {
              // Determine if current user is the instructor
              const isInstructor = session.instructor.id === user._id;
              const partner = isInstructor
                ? session.learner
                : session.instructor;

              // If user is instructor, it's Teaching; otherwise Learning
              const type: "Learning" | "Teaching" = isInstructor
                ? "Teaching"
                : "Learning";

              // Convert hex string ID to number
              const idNumber = parseInt(session.id.slice(-8), 16) || index + 1;

              return {
                id: idNumber,
                partnerId: partner.id,
                type,
                skill: session.skill,
                with: partner.name,
                time: formatSessionDate(session.scheduledDate),
                avatar: partner.avatarUrl || "/placeholder-avatar.jpg",
              };
            });

          setUpcomingSessions(mappedSessions);
        }
      } catch {
        // Silently fail for dashboard component
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingSessions();
  }, [user?._id]);

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
          <CardDescription>Your scheduled exchanges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (upcomingSessions.length === 0) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
          <CardDescription>Your scheduled exchanges</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming sessions
          </p>
          <Button
            variant="outline"
            className="w-full rounded-full cursor-pointer"
            size="sm"
            onClick={() => router.push("/@me/sessions")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View All Sessions
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
        <CardDescription>Your scheduled exchanges</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingSessions.map((session) => (
          <div
            key={session.id}
            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Link href={`/users/${session.partnerId}`} onClick={(e) => e.stopPropagation()}>
              <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={session.avatar} alt={session.with} />
                <AvatarFallback>
                  {session.with
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    session.type === "Learning"
                      ? "bg-purple-500/10 text-purple-700 dark:text-purple-400"
                      : "bg-orange-500/10 text-orange-700 dark:text-orange-400"
                  }`}
                >
                  {session.type}
                </Badge>
                <span className="text-sm font-medium truncate">
                  {session.skill}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {session.with}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {session.time}
                </span>
              </div>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          className="w-full rounded-full cursor-pointer"
          size="sm"
          onClick={() => router.push("/@me/sessions")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          View All Sessions
        </Button>
      </CardContent>
    </Card>
  );
}

export default UpcomingSessions;
