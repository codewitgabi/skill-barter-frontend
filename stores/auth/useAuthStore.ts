import { create } from "zustand";
import type { AuthStore } from "./auth.types";

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  token: null,
  userId: null,
  user: null,
  login: (token, user) =>
    set({ isAuthenticated: true, token, userId: user._id, user }),
  logout: () =>
    set({ isAuthenticated: false, token: null, userId: null, user: null }),
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user, userId: user._id }),
}));
