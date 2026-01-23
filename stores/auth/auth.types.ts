export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  about: string;
  city: string;
  country: string;
  profile_picture: string;
  weekly_availability: number;
  skills: unknown[];
  interests: unknown[];
  language: string;
  timezone: string;
  website: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  user: User | null;
}

export interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
}

export type AuthStore = AuthState & AuthActions;
