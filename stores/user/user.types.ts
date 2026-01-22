export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  rating?: number;
  skillsToTeach?: Array<{
    name: string;
    category: string;
    level: string;
  }>;
  skillsToLearn?: Array<{
    name: string;
    category: string;
    level: string;
  }>;
}

export interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
}

export interface UserActions {
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
}

export type UserStore = UserState & UserActions;
