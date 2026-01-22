export interface UIState {
  isMobileMenuOpen: boolean;
  isNotificationsOpen: boolean;
  isChatOpen: boolean;
  activeModal: string | null;
}

export interface UIActions {
  setMobileMenuOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  closeAllModals: () => void;
}

export type UIStore = UIState & UIActions;
