import { useState, useEffect, useRef, useCallback } from "react";
import type { IExchangeRequest } from "@/types/dashboard";

interface UseExchangeRequestsOptions {
  allRequests: Array<IExchangeRequest>;
  itemsPerPage: number;
  initialLoad: number;
}

interface UseExchangeRequestsReturn {
  displayedRequests: Array<IExchangeRequest>;
  processing: Set<number>;
  isLoadingMore: boolean;
  hasMore: boolean;
  observerTarget: React.RefObject<HTMLDivElement | null>;
  handleAccept: (id: number) => Promise<void>;
  handleDecline: (id: number) => Promise<void>;
}

export function useExchangeRequests({
  allRequests,
  itemsPerPage,
  initialLoad,
}: UseExchangeRequestsOptions): UseExchangeRequestsReturn {
  const [displayedRequests, setDisplayedRequests] = useState<
    Array<IExchangeRequest>
  >(allRequests.slice(0, initialLoad));
  const [processing, setProcessing] = useState<Set<number>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextIndex, setNextIndex] = useState(initialLoad);
  const [hasMore, setHasMore] = useState(allRequests.length > initialLoad);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const nextBatch = allRequests.slice(nextIndex, nextIndex + itemsPerPage);

    if (nextBatch.length > 0) {
      setDisplayedRequests((prev) => [...prev, ...nextBatch]);
      const newNextIndex = nextIndex + nextBatch.length;
      setNextIndex(newNextIndex);
      setHasMore(newNextIndex < allRequests.length);
    } else {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [nextIndex, isLoadingMore, hasMore, allRequests, itemsPerPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const handleAccept = async (id: number) => {
    const request = displayedRequests.find((req) => req.id === id);
    if (!request) return;

    setProcessing((prev) => new Set(prev).add(id));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove the request and add to sessions (in a real app, this would be an API call)
      setDisplayedRequests((prev) => prev.filter((req) => req.id !== id));

      // In a real app, you would:
      // 1. Call API to accept the request
      // 2. Create a session for both users
      // 3. Redirect or update the UI
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDecline = async (id: number) => {
    const request = displayedRequests.find((req) => req.id === id);
    if (!request) return;

    setProcessing((prev) => new Set(prev).add(id));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Remove the request (in a real app, this would be an API call)
      setDisplayedRequests((prev) => prev.filter((req) => req.id !== id));

      // In a real app, you would:
      // 1. Call API to decline the request
      // 2. Update the UI
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return {
    displayedRequests,
    processing,
    isLoadingMore,
    hasMore,
    observerTarget,
    handleAccept,
    handleDecline,
  };
}
