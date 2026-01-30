import { Loader2 } from "lucide-react";

interface NotificationLoadingProps {
  message?: string;
}

function NotificationLoading({
  message = "Loading notifications...",
}: NotificationLoadingProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">{message}</span>
        </div>
      </div>
    </div>
  );
}

export function NotificationLoadingMore() {
  return (
    <div className="flex items-center justify-center py-4">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
    </div>
  );
}

export default NotificationLoading;
