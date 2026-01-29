"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  BellRing,
  Settings as SettingsIcon,
  ChevronRight,
  KeyRound,
} from "lucide-react";

const settingsNavItems = [
  { href: "/me/settings", label: "General", icon: SettingsIcon },
  { href: "/me/settings/profile", label: "Profile", icon: User },
  { href: "/me/settings/password", label: "Password", icon: KeyRound },
  {
    href: "/me/settings/notifications",
    label: "Notifications",
    icon: BellRing,
  },
];

function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 shrink-0">
            <nav className="space-y-1">
              {settingsNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/me/settings" && pathname === "/me/settings");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default SettingsLayout;
