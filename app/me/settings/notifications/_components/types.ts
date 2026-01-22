export interface NotificationSettings {
  email: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviews: boolean;
    achievements: boolean;
    security: boolean;
  };
  push: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviews: boolean;
    achievements: boolean;
  };
  inApp: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviews: boolean;
    achievements: boolean;
  };
}
