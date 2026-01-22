"use client";

import { toast } from "sonner";
import { generateMockRequests } from "./_components/generate-mock-requests";
import { useExchangeRequests } from "./_components/use-exchange-requests";
import ExchangeRequestHeader from "./_components/exchange-request-header";
import ExchangeRequestEmpty from "./_components/exchange-request-empty";
import ExchangeRequestList from "./_components/exchange-request-list";

const ITEMS_PER_PAGE = 10;
const INITIAL_LOAD = 10;

function Page() {
  // Generate all mock requests (simulating a large dataset)
  const allRequests = generateMockRequests(100);

  const {
    displayedRequests,
    processing,
    isLoadingMore,
    hasMore,
    observerTarget,
    handleAccept: handleAcceptRequest,
    handleDecline: handleDeclineRequest,
  } = useExchangeRequests({
    allRequests,
    itemsPerPage: ITEMS_PER_PAGE,
    initialLoad: INITIAL_LOAD,
  });

  const handleAccept = async (id: number) => {
    try {
      await handleAcceptRequest(id);
      const request = displayedRequests.find((req) => req.id === id);
      if (request) {
        toast.success("Exchange request accepted!", {
          description: `You've started a session with ${request.from}. Check your sessions page.`,
        });
      }
    } catch (error) {
      toast.error("Failed to accept request", {
        description: "Please try again later.",
      });
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await handleDeclineRequest(id);
      const request = displayedRequests.find((req) => req.id === id);
      if (request) {
        toast.info("Exchange request declined", {
          description: `You've declined the request from ${request.from}.`,
        });
      }
    } catch (error) {
      toast.error("Failed to decline request", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-2xl mx-auto">
        <ExchangeRequestHeader
          displayedCount={displayedRequests.length}
          totalCount={allRequests.length}
        />

        {displayedRequests.length === 0 ? (
          <ExchangeRequestEmpty />
        ) : (
          <ExchangeRequestList
            requests={displayedRequests}
            processing={processing}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            observerRef={observerTarget}
            initialLoad={INITIAL_LOAD}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        )}
      </div>
    </div>
  );
}

export default Page;
