import { forwardRef } from "react";
import type { Notification } from "./types";
import NotificationCard from "./notification-card";
import NotificationEmpty from "./notification-empty";
import { NotificationLoadingMore } from "./notification-loading";

interface NotificationListProps {
  notifications: Notification[];
  isLoadingMore: boolean;
  hasMore: boolean;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationList = forwardRef<HTMLDivElement, NotificationListProps>(
  function NotificationList(
    { notifications, isLoadingMore, hasMore, onNotificationClick },
    ref,
  ) {
    if (notifications.length === 0) {
      return <NotificationEmpty />;
    }

    return (
      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
          />
        ))}

        {/* Load more trigger */}
        <div ref={ref} className="py-4">
          {isLoadingMore && <NotificationLoadingMore />}
          {!hasMore && notifications.length > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No more notifications
            </p>
          )}
        </div>
      </div>
    );
  },
);

export default NotificationList;
