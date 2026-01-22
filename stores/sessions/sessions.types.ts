export interface ISessionPartner {
  id: string;
  name: string;
  avatar: string;
}

export type SessionType = "Learning" | "Teaching";
export type SessionStatus = "active" | "scheduled" | "completed" | "cancelled";

export interface ISession {
  id: number;
  type: SessionType;
  skill: string;
  partner: ISessionPartner;
  status: SessionStatus;
  scheduledTime: string;
  duration: number;
  location: "online" | "in-person";
  meetingLink?: string;
  progress?: number;
  description: string;
  objectives: Array<string>;
  completedAt?: string;
  cancelledAt?: string;
  rating?: number;
}

export interface SessionsState {
  sessions: Array<ISession>;
  selectedSession: ISession | null;
  isLoading: boolean;
}

export interface SessionsActions {
  setSessions: (sessions: Array<ISession>) => void;
  addSession: (session: ISession) => void;
  updateSession: (id: number, updates: Partial<ISession>) => void;
  removeSession: (id: number) => void;
  setSelectedSession: (session: ISession | null) => void;
  setLoading: (loading: boolean) => void;
}

export type SessionsStore = SessionsState & SessionsActions;
