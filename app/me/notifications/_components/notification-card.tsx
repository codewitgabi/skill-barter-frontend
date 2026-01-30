import { Bell, Star, MessageSquare, Calendar, Award } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import type { Notification } from "./types";

interface NotificationCardProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

function getNotificationIcon(type: string) {
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
    default:
      return <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
  }
}

function getNotificationBgColor(type: string) {
  switch (type) {
    case "review":
      return "bg-green-100 dark:bg-green-900/20";
    case "exchange":
      return "bg-blue-100 dark:bg-blue-900/20";
    case "session":
      return "bg-purple-100 dark:bg-purple-900/20";
    case "achievement":
      return "bg-yellow-100 dark:bg-yellow-900/20";
    default:
      return "bg-gray-100 dark:bg-gray-900/20";
  }
}

function formatTime(timestamp: Timestamp) {
  const date = timestamp.toDate();
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const message = notification.message || notification.data?.message;

  return (
    <button
      onClick={() => onClick(notification)}
      className={cn(
        "w-full flex items-start gap-3 p-4 rounded-lg border transition-colors text-left",
        "hover:bg-accent hover:border-accent-foreground/20",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        notification.status === "unread" && "bg-accent/50 border-primary/20",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
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
            {message && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {formatTime(notification.createdAt)}
            </p>
          </div>
          {notification.status === "unread" && (
            <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
          )}
        </div>
      </div>
    </button>
  );
}

export default NotificationCard;
