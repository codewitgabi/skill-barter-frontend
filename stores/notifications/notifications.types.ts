export type NotificationType = "review" | "exchange" | "session" | "achievement";

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  skill?: string;
  time: string;
  isRead: boolean;
  href: string;
}

export interface NotificationsState {
  notifications: Array<INotification>;
  unreadCount: number;
}

export interface NotificationsActions {
  setNotifications: (notifications: Array<INotification>) => void;
  addNotification: (notification: INotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export type NotificationsStore = NotificationsState & NotificationsActions;
