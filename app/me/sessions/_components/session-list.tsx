import type { ISession } from "./types";
import SessionCard from "./session-card";

interface SessionListProps {
  sessions: Array<ISession>;
  onJoin?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onCancel?: (id: number) => void;
}

function SessionList({
  sessions,
  onJoin,
  onViewDetails,
  onCancel,
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
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}

export default SessionList;
