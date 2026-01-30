import { Bell } from "lucide-react";

function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-muted-foreground">No notifications</p>
      <p className="text-sm text-muted-foreground mt-1">
        You&apos;re all caught up!
      </p>
    </div>
  );
}

export default NotificationEmpty;
