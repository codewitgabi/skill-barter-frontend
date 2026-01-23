export interface NotificationSettings {
  email: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviewsAndRatings: boolean;
    achievements: boolean;
    securityAlerts: boolean;
  };
  push: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviewsAndRatings: boolean;
    achievements: boolean;
  };
  inApp: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviewsAndRatings: boolean;
    achievements: boolean;
  };
}
