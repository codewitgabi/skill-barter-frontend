export interface IStats {
  totalExchanges: number;
  activeSessions: number;
  rating: number;
  skillsLearned: number;
  skillsTaught: number;
}

export interface IUpcomingSession {
  id: number;
  type: "Learning" | "Teaching";
  skill: string;
  with: string;
  time: string;
  avatar: string;
}

export interface IRecentExchange {
  id: number;
  type: "Completed" | "In Progress";
  skill: string;
  partner: string;
  date: string;
  rating: number | null;
  avatar: string;
  status: "completed" | "active";
  progress?: number;
}

export interface IExchangeRequest {
  id: number;
  originalId: string;
  from: string;
  skill: string;
  wantsToLearn: string;
  message: string;
  avatar: string;
  time: string;
  website?: string;
}

export interface ISkillProgress {
  skill: string;
  level: string;
  progress: number;
  sessionsCompleted: number;
  totalSessions: number;
}

export interface IRecentActivity {
  id: number;
  type: "review" | "exchange" | "session" | "achievement";
  message: string;
  skill: string;
  time: string;
}

export interface ICommunityHighlights {
  "most-exchanged": string;
  "active-members": number;
  "top-rated": number;
}
