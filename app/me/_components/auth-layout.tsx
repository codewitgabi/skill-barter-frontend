"use client";

import { ReactNode } from "react";
import { AppNavbar } from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";

export function AuthLayout({ children }: { children: ReactNode }) {
  useAuth();

  return (
    <>
      <AppNavbar />
      {children}
    </>
  );
}
