import { useCallback } from "react";
import {
  trackPageView,
  trackSignIn,
  trackSignUp,
  trackSignOut,
  trackProfileView,
  trackProfileUpdate,
  trackAvatarUpload,
  trackSkillAdd,
  trackSkillRemove,
  trackSkillSearch,
  trackSkillFilter,
  trackConnectionRequest,
  trackConnectionAccept,
  trackConnectionReject,
  trackSessionCreate,
  trackSessionBook,
  trackSessionAccept,
  trackSessionReject,
  trackSessionComplete,
  trackSessionCancel,
  trackReviewSubmit,
  trackNotificationPermission,
  trackNotificationClick,
  trackNavigationClick,
  trackTabChange,
  trackError,
  trackFeatureUse,
  trackButtonClick,
  trackFormSubmit,
  trackModalOpen,
  trackModalClose,
  trackBrowsePeople,
  trackUserCardClick,
  trackShare,
  trackTiming,
} from "@/lib/analytics";

export function useAnalytics() {
  // Memoize functions to prevent unnecessary re-renders
  const logPageView = useCallback((path: string, title?: string) => {
    trackPageView(path, title);
  }, []);

  const logSignIn = useCallback((method: string) => {
    trackSignIn(method);
  }, []);

  const logSignUp = useCallback((method: string) => {
    trackSignUp(method);
  }, []);

  const logSignOut = useCallback(() => {
    trackSignOut();
  }, []);

  const logProfileView = useCallback((userId: string, username: string) => {
    trackProfileView(userId, username);
  }, []);

  const logProfileUpdate = useCallback((updatedFields: string[]) => {
    trackProfileUpdate(updatedFields);
  }, []);

  const logAvatarUpload = useCallback(() => {
    trackAvatarUpload();
  }, []);

  const logSkillAdd = useCallback(
    (skillName: string, skillType: "teach" | "learn", level: string) => {
      trackSkillAdd(skillName, skillType, level);
    },
    []
  );

  const logSkillRemove = useCallback(
    (skillName: string, skillType: "teach" | "learn") => {
      trackSkillRemove(skillName, skillType);
    },
    []
  );

  const logSkillSearch = useCallback(
    (searchTerm: string, resultsCount: number) => {
      trackSkillSearch(searchTerm, resultsCount);
    },
    []
  );

  const logSkillFilter = useCallback((filters: Record<string, string>) => {
    trackSkillFilter(filters);
  }, []);

  const logConnectionRequest = useCallback(
    (receiverId: string, teachingSkill: string, learningSkill: string) => {
      trackConnectionRequest(receiverId, teachingSkill, learningSkill);
    },
    []
  );

  const logConnectionAccept = useCallback(
    (requestId: string, requesterId: string) => {
      trackConnectionAccept(requestId, requesterId);
    },
    []
  );

  const logConnectionReject = useCallback(
    (requestId: string, requesterId: string) => {
      trackConnectionReject(requestId, requesterId);
    },
    []
  );

  const logSessionCreate = useCallback(
    (skill: string, sessionType: string, duration: number) => {
      trackSessionCreate(skill, sessionType, duration);
    },
    []
  );

  const logSessionBook = useCallback(
    (sessionId: string, skill: string, instructorId: string) => {
      trackSessionBook(sessionId, skill, instructorId);
    },
    []
  );

  const logSessionAccept = useCallback((sessionId: string, skill: string) => {
    trackSessionAccept(sessionId, skill);
  }, []);

  const logSessionReject = useCallback(
    (sessionId: string, skill: string, reason?: string) => {
      trackSessionReject(sessionId, skill, reason);
    },
    []
  );

  const logSessionComplete = useCallback(
    (sessionId: string, skill: string, duration: number) => {
      trackSessionComplete(sessionId, skill, duration);
    },
    []
  );

  const logSessionCancel = useCallback(
    (sessionId: string, skill: string, reason?: string) => {
      trackSessionCancel(sessionId, skill, reason);
    },
    []
  );

  const logReviewSubmit = useCallback(
    (sessionId: string, rating: number, hasComment: boolean) => {
      trackReviewSubmit(sessionId, rating, hasComment);
    },
    []
  );

  const logNotificationPermission = useCallback(
    (status: "granted" | "denied" | "default") => {
      trackNotificationPermission(status);
    },
    []
  );

  const logNotificationClick = useCallback(
    (notificationType: string, actionUrl?: string) => {
      trackNotificationClick(notificationType, actionUrl);
    },
    []
  );

  const logNavigationClick = useCallback(
    (destination: string, source: string) => {
      trackNavigationClick(destination, source);
    },
    []
  );

  const logTabChange = useCallback((tabName: string, section: string) => {
    trackTabChange(tabName, section);
  }, []);

  const logError = useCallback(
    (errorType: string, errorMessage: string, errorLocation?: string) => {
      trackError(errorType, errorMessage, errorLocation);
    },
    []
  );

  const logFeatureUse = useCallback(
    (
      featureName: string,
      action: string,
      details?: Record<string, string | number | boolean>
    ) => {
      trackFeatureUse(featureName, action, details);
    },
    []
  );

  const logButtonClick = useCallback((buttonName: string, location: string) => {
    trackButtonClick(buttonName, location);
  }, []);

  const logFormSubmit = useCallback((formName: string, success: boolean) => {
    trackFormSubmit(formName, success);
  }, []);

  const logModalOpen = useCallback((modalName: string) => {
    trackModalOpen(modalName);
  }, []);

  const logModalClose = useCallback((modalName: string) => {
    trackModalClose(modalName);
  }, []);

  const logBrowsePeople = useCallback(
    (filtersApplied: number, resultsCount: number) => {
      trackBrowsePeople(filtersApplied, resultsCount);
    },
    []
  );

  const logUserCardClick = useCallback((userId: string, source: string) => {
    trackUserCardClick(userId, source);
  }, []);

  const logShare = useCallback(
    (contentType: string, contentId: string, method: string) => {
      trackShare(contentType, contentId, method);
    },
    []
  );

  const logTiming = useCallback(
    (category: string, variable: string, value: number, label?: string) => {
      trackTiming(category, variable, value, label);
    },
    []
  );

  return {
    logPageView,
    logSignIn,
    logSignUp,
    logSignOut,
    logProfileView,
    logProfileUpdate,
    logAvatarUpload,
    logSkillAdd,
    logSkillRemove,
    logSkillSearch,
    logSkillFilter,
    logConnectionRequest,
    logConnectionAccept,
    logConnectionReject,
    logSessionCreate,
    logSessionBook,
    logSessionAccept,
    logSessionReject,
    logSessionComplete,
    logSessionCancel,
    logReviewSubmit,
    logNotificationPermission,
    logNotificationClick,
    logNavigationClick,
    logTabChange,
    logError,
    logFeatureUse,
    logButtonClick,
    logFormSubmit,
    logModalOpen,
    logModalClose,
    logBrowsePeople,
    logUserCardClick,
    logShare,
    logTiming,
  };
}
