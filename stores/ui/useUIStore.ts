import { create } from "zustand";
import type { UIStore } from "./ui.types";

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isNotificationsOpen: false,
  isChatOpen: false,
  activeModal: null,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
  setChatOpen: (open) => set({ isChatOpen: open }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  closeAllModals: () =>
    set({
      isMobileMenuOpen: false,
      isNotificationsOpen: false,
      isChatOpen: false,
      activeModal: null,
    }),
}));
