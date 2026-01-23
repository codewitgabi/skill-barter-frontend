import { create } from "zustand";
import type { AuthStore } from "./auth.types";

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  token: null,
  userId: null,
  login: (token, userId) => set({ isAuthenticated: true, token, userId }),
  logout: () => set({ isAuthenticated: false, token: null, userId: null }),
  setToken: (token) => set({ token }),
}));
