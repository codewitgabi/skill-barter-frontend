import { useState, useMemo } from "react";
import type { ISession } from "./types";

interface UseSessionsOptions {
  sessions: Array<ISession>;
}

interface UseSessionsReturn {
  filteredSessions: Array<ISession>;
  stats: {
    total: number;
    active: number;
    scheduled: number;
    completed: number;
  };
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function useSessions({
  sessions,
}: UseSessionsOptions): UseSessionsReturn {
  const [activeFilter, setActiveFilter] = useState("all");

  const stats = useMemo(() => {
    return {
      total: sessions.filter((s) => s.status !== "cancelled").length,
      active: sessions.filter((s) => s.status === "active").length,
      scheduled: sessions.filter((s) => s.status === "scheduled").length,
      completed: sessions.filter((s) => s.status === "completed").length,
    };
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    // Filter out cancelled sessions unless specifically viewing cancelled
    const activeSessions = sessions.filter((s) => s.status !== "cancelled");

    if (activeFilter === "all") {
      return activeSessions;
    }
    return activeSessions.filter((session) => session.status === activeFilter);
  }, [sessions, activeFilter]);

  return {
    filteredSessions,
    stats,
    activeFilter,
    setActiveFilter,
  };
}
