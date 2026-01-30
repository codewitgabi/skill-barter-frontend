import type { ISession } from "./types";
import SessionCard from "./session-card";

interface SessionListProps {
  sessions: Array<ISession>;
  onJoin?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onMarkComplete?: (id: number) => void;
  completingId?: number | null;
}

function SessionList({
  sessions,
  onJoin,
  onViewDetails,
  onMarkComplete,
  completingId,
}: SessionListProps) {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onJoin={onJoin}
          onViewDetails={onViewDetails}
          onMarkComplete={onMarkComplete}
          isCompleting={completingId === session.id}
        />
      ))}
    </div>
  );
}

export default SessionList;
