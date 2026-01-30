"use client";

import { useNotificationsPage } from "./_components/use-notifications-page";
import NotificationHeader from "./_components/notification-header";
import NotificationList from "./_components/notification-list";
import NotificationLoading from "./_components/notification-loading";

function Page() {
  const {
    notifications,
    isLoading,
    isLoadingMore,
    hasMore,
    unreadCount,
    loadMoreRef,
    handleNotificationClick,
    markAllAsRead,
  } = useNotificationsPage();

  if (isLoading) {
    return <NotificationLoading />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-2xl mx-auto">
        <NotificationHeader
          unreadCount={unreadCount}
          onMarkAllAsRead={markAllAsRead}
        />
        <NotificationList
          ref={loadMoreRef}
          notifications={notifications}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onNotificationClick={handleNotificationClick}
        />
      </div>
    </div>
  );
}

export default Page;
