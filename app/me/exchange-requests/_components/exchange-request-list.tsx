import type { IExchangeRequest } from "@/types/dashboard";
import ExchangeRequestCard from "./exchange-request-card";
import ExchangeRequestLoading from "./exchange-request-loading";

interface ExchangeRequestListProps {
  requests: Array<IExchangeRequest>;
  processing: Set<number>;
  isLoadingMore: boolean;
  hasMore: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
  initialLoad: number;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

function ExchangeRequestList({
  requests,
  processing,
  isLoadingMore,
  hasMore,
  observerRef,
  initialLoad,
  onAccept,
  onDecline,
}: ExchangeRequestListProps) {
  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {requests.map((request) => {
          const isProcessing = processing.has(request.id);

          return (
            <ExchangeRequestCard
              key={request.id}
              request={request}
              isProcessing={isProcessing}
              onAccept={onAccept}
              onDecline={onDecline}
            />
          );
        })}
      </div>

      <ExchangeRequestLoading
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        observerRef={observerRef}
        initialLoad={initialLoad}
        displayedCount={requests.length}
      />
    </>
  );
}

export default ExchangeRequestList;
