"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api-client";
import { timeSince } from "@/lib/helpers";
import type { IExchangeRequest } from "@/types/dashboard";
import ExchangeRequestHeader from "./_components/exchange-request-header";
import ExchangeRequestEmpty from "./_components/exchange-request-empty";
import ExchangeRequestList from "./_components/exchange-request-list";

interface ExchangeRequestResponse {
  id: string;
  requester: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    website: string;
    initials: string;
  };
  receiver: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    website: string;
    initials: string;
  };
  message: string | null;
  teachingSkill: string;
  learningSkill: string;
  status: string;
  createdAt: string;
}

interface ExchangeRequestsData {
  exchangeRequests: ExchangeRequestResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function Page() {
  const [requests, setRequests] = useState<IExchangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchExchangeRequests = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<ExchangeRequestsData>("/exchange-requests?status=pending");

        if (response.status === "success" && response.data) {
          const mappedRequests: IExchangeRequest[] = response.data.exchangeRequests.map(
            (req, index) => {
              // Convert string ID to number, fallback to index if invalid
              const id = parseInt(req.id, 10);
              const numericId = isNaN(id) ? index + 1 : id;

              return {
                id: numericId,
                from: req.requester.name || req.requester.username,
                skill: req.teachingSkill,
                wantsToLearn: req.learningSkill,
                message: req.message || "",
                avatar: req.requester.avatarUrl || "/placeholder-avatar.jpg",
                time: timeSince(req.createdAt),
                website: req.requester.website || undefined,
              };
            },
          );
          setRequests(mappedRequests);
        } else {
          toast.error("Failed to load exchange requests", {
            description: "Please try again later.",
          });
        }
      } catch (error) {
        toast.error("Failed to load exchange requests", {
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRequests();
  }, []);

  const handleAccept = async (id: number) => {
    setProcessing((prev) => new Set(prev).add(id));
    try {
      // TODO: Call accept API endpoint
      toast.success("Exchange request accepted!", {
        description: "You've started a session. Check your sessions page.",
      });
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch {
      toast.error("Failed to accept request", {
        description: "Please try again later.",
      });
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDecline = async (id: number) => {
    setProcessing((prev) => new Set(prev).add(id));
    try {
      // TODO: Call decline API endpoint
      toast.info("Exchange request declined", {
        description: "The request has been declined.",
      });
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch {
      toast.error("Failed to decline request", {
        description: "Please try again later.",
      });
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading exchange requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-2xl mx-auto">
        <ExchangeRequestHeader
          displayedCount={requests.length}
          totalCount={requests.length}
        />

        {requests.length === 0 ? (
          <ExchangeRequestEmpty />
        ) : (
          <ExchangeRequestList
            requests={requests}
            processing={processing}
            isLoadingMore={false}
            hasMore={false}
            observerRef={{ current: null }}
            initialLoad={10}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        )}
      </div>
    </div>
  );
}

export default Page;
