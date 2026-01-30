"use client";

import { ReactNode } from "react";
import { AppNavbar } from "@/components/navbar";
import { ForegroundNotificationHandler } from "@/components/foreground-notification-handler";
import { useAuth } from "@/hooks/use-auth";

export function AuthLayout({ children }: { children: ReactNode }) {
  useAuth();

  return (
    <>
      <AppNavbar />
      <ForegroundNotificationHandler />
      {/* Add bottom padding on mobile to account for bottom navigation */}
      <div className="pb-20 md:pb-0">{children}</div>
    </>
  );
}
