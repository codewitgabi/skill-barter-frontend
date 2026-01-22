import { Loader2 } from "lucide-react";

interface ExchangeRequestLoadingProps {
  isLoadingMore: boolean;
  hasMore: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
  initialLoad: number;
  displayedCount: number;
}

function ExchangeRequestLoading({
  isLoadingMore,
  hasMore,
  observerRef,
  initialLoad,
  displayedCount,
}: ExchangeRequestLoadingProps) {
  if (hasMore) {
    return (
      <div ref={observerRef} className="py-4 flex justify-center">
        {isLoadingMore && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading more requests...</span>
          </div>
        )}
      </div>
    );
  }

  if (!hasMore && displayedCount > initialLoad) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No more requests to load
      </div>
    );
  }

  return null;
}

export default ExchangeRequestLoading;
