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
  scheduledDate: string; // ISO date string for comparisons
  duration: number; // in minutes
  location: "online" | "in-person";
  meetingLink?: string;
  progress?: number; // 0-100 for active sessions
  description: string;
  objectives: Array<string>;
  completedAt?: string;
  cancelledAt?: string;
  rating?: number; // 1-5 for completed sessions
}
