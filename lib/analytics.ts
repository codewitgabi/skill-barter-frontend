import {
  logEvent,
  setUserId,
  setUserProperties,
  type Analytics,
} from "firebase/analytics";
import { initializeFirebaseServices } from "./firebase.config";

let analyticsInstance: Analytics | null = null;

// Initialize analytics instance
export const initializeAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;

  if (!analyticsInstance) {
    const { analytics } = await initializeFirebaseServices();
    analyticsInstance = analytics;
  }

  return analyticsInstance;
};

// Get analytics instance
export const getAnalyticsInstance = (): Analytics | null => analyticsInstance;

// Track page views
export const trackPageView = async (
  pagePath: string,
  pageTitle?: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "page_view", {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  });
};

// Set user ID for tracking
export const setAnalyticsUserId = async (userId: string): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  setUserId(analytics, userId);
};

// Set user properties
export const setAnalyticsUserProperties = async (
  properties: Record<string, string>
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  setUserProperties(analytics, properties);
};

// Clear user ID (on logout)
export const clearAnalyticsUser = async (): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  setUserId(analytics, "");
};

// ============================================================
// Authentication Events
// ============================================================

export const trackSignIn = async (method: string): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "login", { method });
};

export const trackSignUp = async (method: string): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "sign_up", { method });
};

export const trackSignOut = async (): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "logout");
};

// ============================================================
// User Profile Events
// ============================================================

export const trackProfileView = async (
  userId: string,
  username: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "view_profile", {
    viewed_user_id: userId,
    viewed_username: username,
  });
};

export const trackProfileUpdate = async (
  updatedFields: string[]
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "profile_update", {
    updated_fields: updatedFields.join(","),
    fields_count: updatedFields.length,
  });
};

export const trackAvatarUpload = async (): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "avatar_upload");
};

// ============================================================
// Skills Events
// ============================================================

export const trackSkillAdd = async (
  skillName: string,
  skillType: "teach" | "learn",
  level: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "skill_add", {
    skill_name: skillName,
    skill_type: skillType,
    skill_level: level,
  });
};

export const trackSkillRemove = async (
  skillName: string,
  skillType: "teach" | "learn"
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "skill_remove", {
    skill_name: skillName,
    skill_type: skillType,
  });
};

export const trackSkillSearch = async (
  searchTerm: string,
  resultsCount: number
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "search", {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackSkillFilter = async (
  filters: Record<string, string>
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "skill_filter", filters);
};

// ============================================================
// Connection/Exchange Request Events
// ============================================================

export const trackConnectionRequest = async (
  receiverId: string,
  teachingSkill: string,
  learningSkill: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "connection_request", {
    receiver_id: receiverId,
    teaching_skill: teachingSkill,
    learning_skill: learningSkill,
  });
};

export const trackConnectionAccept = async (
  requestId: string,
  requesterId: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "connection_accept", {
    request_id: requestId,
    requester_id: requesterId,
  });
};

export const trackConnectionReject = async (
  requestId: string,
  requesterId: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "connection_reject", {
    request_id: requestId,
    requester_id: requesterId,
  });
};

// ============================================================
// Session Events
// ============================================================

export const trackSessionCreate = async (
  skill: string,
  sessionType: string,
  duration: number
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "session_create", {
    skill,
    session_type: sessionType,
    duration_minutes: duration,
  });
};

export const trackSessionBook = async (
  sessionId: string,
  skill: string,
  instructorId: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "session_book", {
    session_id: sessionId,
    skill,
    instructor_id: instructorId,
  });
};

export const trackSessionAccept = async (
  sessionId: string,
  skill: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "session_accept", {
    session_id: sessionId,
    skill,
  });
};

export const trackSessionReject = async (
  sessionId: string,
  skill: string,
  reason?: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "session_reject", {
    session_id: sessionId,
    skill,
    reason: reason || "not_specified",
  });
};

export const trackSessionComplete = async (
  sessionId: string,
  skill: string,
  duration: number
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "session_complete", {
    session_id: sessionId,
    skill,
    duration_minutes: duration,
  });
};

export const trackSessionCancel = async (
  sessionId: string,
  skill: string,
  reason?: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "session_cancel", {
    session_id: sessionId,
    skill,
    reason: reason || "not_specified",
  });
};

// ============================================================
// Review Events
// ============================================================

export const trackReviewSubmit = async (
  sessionId: string,
  rating: number,
  hasComment: boolean
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "review_submit", {
    session_id: sessionId,
    rating,
    has_comment: hasComment,
  });
};

export const trackUserReviewSubmit = async (
  userId: string,
  rating: number,
  skill: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "user_review_submit", {
    reviewed_user_id: userId,
    rating,
    skill,
  });
};

// ============================================================
// Notification Events
// ============================================================

export const trackNotificationPermission = async (
  status: "granted" | "denied" | "default"
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "notification_permission", { status });
};

export const trackNotificationClick = async (
  notificationType: string,
  actionUrl?: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "notification_click", {
    notification_type: notificationType,
    action_url: actionUrl || "none",
  });
};

// ============================================================
// Navigation Events
// ============================================================

export const trackNavigationClick = async (
  destination: string,
  source: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "navigation_click", {
    destination,
    source,
  });
};

export const trackTabChange = async (
  tabName: string,
  section: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "tab_change", {
    tab_name: tabName,
    section,
  });
};

// ============================================================
// Error Events
// ============================================================

export const trackError = async (
  errorType: string,
  errorMessage: string,
  errorLocation?: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "app_error", {
    error_type: errorType,
    error_message: errorMessage.slice(0, 100),
    error_location: errorLocation || "unknown",
  });
};

// ============================================================
// Feature Usage Events
// ============================================================

export const trackFeatureUse = async (
  featureName: string,
  action: string,
  details?: Record<string, string | number | boolean>
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "feature_use", {
    feature_name: featureName,
    action,
    ...details,
  });
};

export const trackButtonClick = async (
  buttonName: string,
  location: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "button_click", {
    button_name: buttonName,
    location,
  });
};

export const trackFormSubmit = async (
  formName: string,
  success: boolean
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "form_submit", {
    form_name: formName,
    success,
  });
};

export const trackModalOpen = async (modalName: string): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "modal_open", { modal_name: modalName });
};

export const trackModalClose = async (modalName: string): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "modal_close", { modal_name: modalName });
};

// ============================================================
// Browse/Discovery Events
// ============================================================

export const trackBrowsePeople = async (
  filtersApplied: number,
  resultsCount: number
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "browse_people", {
    filters_applied: filtersApplied,
    results_count: resultsCount,
  });
};

export const trackUserCardClick = async (
  userId: string,
  source: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "user_card_click", {
    clicked_user_id: userId,
    source,
  });
};

// ============================================================
// Share Events
// ============================================================

export const trackShare = async (
  contentType: string,
  contentId: string,
  method: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "share", {
    content_type: contentType,
    content_id: contentId,
    method,
  });
};

// ============================================================
// Timing Events
// ============================================================

export const trackTiming = async (
  category: string,
  variable: string,
  value: number,
  label?: string
): Promise<void> => {
  const analytics = await initializeAnalytics();
  if (!analytics) return;

  logEvent(analytics, "timing_complete", {
    name: variable,
    value,
    event_category: category,
    event_label: label || "",
  });
};
