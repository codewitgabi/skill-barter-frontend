"use client";

import { useState } from "react";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Star, MessageSquare, Calendar, Award, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type NotificationType =
  | "review"
  | "exchange"
  | "session"
  | "achievement";

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  skill?: string;
  time: string;
  isRead: boolean;
  href: string; // URL to navigate to when clicked
}

// Mock notifications data
const generateMockNotifications = (): Array<INotification> => [
  {
    id: "1",
    type: "review",
    title: "New Review",
    message: "Sarah Johnson left you a 5-star review",
    skill: "Web Development",
    time: "1 hour ago",
    isRead: false,
    href: "/@me",
  },
  {
    id: "2",
    type: "exchange",
    title: "Exchange Request",
    message: "New exchange request from John Smith",
    skill: "Graphic Design",
    time: "3 hours ago",
    isRead: false,
    href: "/@me/exchange-requests",
  },
  {
    id: "3",
    type: "session",
    title: "Session Scheduled",
    message: "Session scheduled with Mike Chen",
    skill: "Web Development",
    time: "1 day ago",
    isRead: true,
    href: "/@me/sessions",
  },
  {
    id: "4",
    type: "achievement",
    title: "Achievement Unlocked",
    message: "You completed 10 sessions!",
    skill: "Photography",
    time: "2 days ago",
    isRead: true,
    href: "/@me",
  },
  {
    id: "5",
    type: "exchange",
    title: "Exchange Request",
    message: "New exchange request from Emma Wilson",
    skill: "Data Science",
    time: "5 hours ago",
    isRead: false,
    href: "/@me/exchange-requests",
  },
  {
    id: "6",
    type: "review",
    title: "New Review",
    message: "Alex Thompson left you a 4-star review",
    skill: "UI/UX Design",
    time: "6 hours ago",
    isRead: false,
    href: "/@me",
  },
  {
    id: "7",
    type: "session",
    title: "Session Reminder",
    message: "Your session with Lisa Park starts in 2 hours",
    skill: "Photography",
    time: "30 minutes ago",
    isRead: false,
    href: "/@me/sessions",
  },
  {
    id: "8",
    type: "achievement",
    title: "Achievement Unlocked",
    message: "You've completed 5 exchange requests!",
    skill: "All Skills",
    time: "3 days ago",
    isRead: true,
    href: "/@me",
  },
];

interface NotificationsProps {
  notifications?: Array<INotification>;
  trigger?: React.ReactNode;
  variant?: "default" | "mobile";
  onUnreadCountChange?: (count: number) => void;
  onNotificationClick?: () => void; // Callback when notification is clicked (e.g., to close mobile menu)
}

export function Notifications({
  notifications,
  trigger,
  variant = "default",
  onUnreadCountChange,
  onNotificationClick,
}: NotificationsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<
    Array<INotification>
  >(notifications || generateMockNotifications());

  const unreadCount = localNotifications.filter((n) => !n.isRead).length;

  // Notify parent of unread count changes
  React.useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  const handleNotificationClick = (notification: INotification) => {
    // Mark as read
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    );
    // Close the popover
    setIsOpen(false);
    // Call the callback (e.g., to close mobile menu)
    onNotificationClick?.();
    // Navigate to the page
    router.push(notification.href);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "review":
        return <Star className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "exchange":
        return (
          <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        );
      case "session":
        return (
          <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        );
      case "achievement":
        return (
          <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        );
    }
  };

  const getNotificationBgColor = (type: NotificationType) => {
    switch (type) {
      case "review":
        return "bg-green-100 dark:bg-green-900/20";
      case "exchange":
        return "bg-blue-100 dark:bg-blue-900/20";
      case "session":
        return "bg-purple-100 dark:bg-purple-900/20";
      case "achievement":
        return "bg-yellow-100 dark:bg-yellow-900/20";
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white px-1.5">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0" align="end" sideOffset={8}>
        <div className="flex flex-col h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scrollable notifications list */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {localNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No notifications
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You're all caught up!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {localNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left",
                          "hover:bg-accent hover:border-accent-foreground/20",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          !notification.isRead &&
                            "bg-accent/50 border-primary/20",
                        )}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                            getNotificationBgColor(notification.type),
                          )}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-tight">
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              {notification.skill && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {notification.skill}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1.5">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
