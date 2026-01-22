import { create } from "zustand";
import type { UserStore } from "./user.types";

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isLoading: false,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
  clearProfile: () => set({ profile: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
