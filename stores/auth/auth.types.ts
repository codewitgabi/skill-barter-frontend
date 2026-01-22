export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
}

export interface AuthActions {
  login: (token: string, userId: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export type AuthStore = AuthState & AuthActions;
