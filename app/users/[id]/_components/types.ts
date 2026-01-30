export interface UserSkill {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface UserReview {
  id: string;
  reviewer: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    initials: string;
  };
  rating: number;
  comment: string;
  skill: string;
  createdAt: string;
}

export interface UserStats {
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  totalReviews: number;
  skillsTaught: number;
  skillsLearned: number;
}

export type ConnectionStatus = "connected" | "none" | null;

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  initials: string;
  bio: string;
  location: {
    city: string;
    country: string;
  };
  website: string | null;
  weeklyAvailability: number;
  skillsToTeach: UserSkill[];
  skillsToLearn: UserSkill[];
  stats: UserStats;
  reviews: UserReview[];
  memberSince: string;
  connectionStatus: ConnectionStatus;
}

// Mock data for development
export const mockProfile: UserProfile = {
  id: "usr_123456",
  firstName: "Alexandra",
  lastName: "Chen",
  username: "alexchen",
  avatar: "",
  initials: "AC",
  bio: `Passionate software engineer with 8+ years of experience in full-stack development. I love sharing knowledge and helping others grow in their tech journey.

Currently working as a Senior Developer at a fintech startup, specializing in React, Node.js, and cloud architecture. In my free time, I enjoy photography, learning new languages, and contributing to open-source projects.

I believe in the power of skill exchange - teaching helps me understand concepts deeper, and learning from others keeps me humble and curious. Let's grow together! 🚀`,
  location: {
    city: "San Francisco",
    country: "United States",
  },
  website: "https://alexchen.dev",
  weeklyAvailability: 10,
  memberSince: "2024-03-15",
  skillsToTeach: [
    { name: "React", level: "advanced" },
    { name: "TypeScript", level: "advanced" },
    { name: "Node.js", level: "intermediate" },
    { name: "System Design", level: "intermediate" },
    { name: "Photography", level: "beginner" },
  ],
  skillsToLearn: [
    { name: "Spanish", level: "beginner" },
    { name: "UI/UX Design", level: "intermediate" },
    { name: "Piano", level: "beginner" },
    { name: "Data Science", level: "beginner" },
  ],
  stats: {
    totalSessions: 47,
    completedSessions: 42,
    averageRating: 4.9,
    totalReviews: 38,
    skillsTaught: 5,
    skillsLearned: 3,
  },
  reviews: [
    {
      id: "rev_1",
      reviewer: {
        id: "usr_789",
        name: "Marcus Johnson",
        username: "marcusj",
        avatar: "",
        initials: "MJ",
      },
      rating: 5,
      comment:
        "Alexandra is an exceptional teacher! She explained React hooks in a way that finally made them click for me. Very patient and knowledgeable. Highly recommend for anyone looking to level up their React skills.",
      skill: "React",
      createdAt: "2025-01-28T14:30:00Z",
    },
    {
      id: "rev_2",
      reviewer: {
        id: "usr_456",
        name: "Sarah Kim",
        username: "sarahk",
        avatar: "",
        initials: "SK",
      },
      rating: 5,
      comment:
        "Had an amazing session on TypeScript generics. Alex has a talent for breaking down complex concepts into digestible pieces. The session was well-structured and she provided great resources for further learning.",
      skill: "TypeScript",
      createdAt: "2025-01-25T10:00:00Z",
    },
    {
      id: "rev_3",
      reviewer: {
        id: "usr_321",
        name: "David Park",
        username: "davidp",
        avatar: "",
        initials: "DP",
      },
      rating: 5,
      comment:
        "Great introduction to system design! Alexandra shared real-world examples from her experience which made the concepts much more relatable. Looking forward to more sessions.",
      skill: "System Design",
      createdAt: "2025-01-20T16:45:00Z",
    },
    {
      id: "rev_4",
      reviewer: {
        id: "usr_654",
        name: "Emily Rodriguez",
        username: "emilyr",
        avatar: "",
        initials: "ER",
      },
      rating: 4,
      comment:
        "Solid Node.js session covering Express and middleware. Alex is very approachable and encouraging. Would have loved a bit more time on error handling but overall excellent.",
      skill: "Node.js",
      createdAt: "2025-01-15T09:00:00Z",
    },
    {
      id: "rev_5",
      reviewer: {
        id: "usr_987",
        name: "James Wilson",
        username: "jamesw",
        avatar: "",
        initials: "JW",
      },
      rating: 5,
      comment:
        "I was struggling with React state management for weeks. After just one session with Alexandra, everything became clear. She's not just knowledgeable but also genuinely cares about your learning progress.",
      skill: "React",
      createdAt: "2025-01-10T11:30:00Z",
    },
  ],
  connectionStatus: "none",
};
