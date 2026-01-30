import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
}: NotificationHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {unreadCount > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </p>
        )}
      </div>
      {unreadCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllAsRead}
          className="gap-2"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      )}
    </div>
  );
}

export default NotificationHeader;
