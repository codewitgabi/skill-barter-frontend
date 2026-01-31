"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  initializeAnalytics,
  trackPageView,
  setAnalyticsUserId,
  setAnalyticsUserProperties,
} from "@/lib/analytics";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);
  const { user } = useAuthStore();

  // Initialize analytics on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    initializeAnalytics();
  }, []);

  // Track page views when route changes
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  // Set user properties when user is authenticated
  useEffect(() => {
    if (user?._id) {
      setAnalyticsUserId(user._id);
      setAnalyticsUserProperties({
        user_type: "authenticated",
        city: user.city || "unknown",
        country: user.country || "unknown",
        has_teaching_skills: (user.skillsToTeach?.length > 0).toString(),
        has_learning_skills: (user.skillsToLearn?.length > 0).toString(),
        teaching_skills_count: (user.skillsToTeach?.length || 0).toString(),
        learning_skills_count: (user.skillsToLearn?.length || 0).toString(),
      });
    }
  }, [user]);

  return <>{children}</>;
}
