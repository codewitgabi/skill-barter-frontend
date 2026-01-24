"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api-client";
import { timeSince } from "@/lib/helpers";
import type { IExchangeRequest } from "@/types/dashboard";

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

function ExchangeRequests() {
  const router = useRouter();
  const [exchangeRequests, setExchangeRequests] = useState<IExchangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRequests = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<ExchangeRequestsData>(
          "/exchange-requests?status=pending&limit=2",
        );

        if (response.status === "success" && response.data) {
          const mappedRequests: IExchangeRequest[] = response.data.exchangeRequests
            .slice(0, 2)
            .map((req, index) => {
              const id = parseInt(req.id, 10);
              const numericId = isNaN(id) ? index + 1 : id;

              return {
                id: numericId,
                originalId: req.id,
                from: req.requester.name || req.requester.username,
                skill: req.teachingSkill,
                wantsToLearn: req.learningSkill,
                message: req.message || "",
                avatar: req.requester.avatarUrl || "/placeholder-avatar.jpg",
                time: timeSince(req.createdAt),
                website: req.requester.website || undefined,
              };
            });
          setExchangeRequests(mappedRequests);
        }
      } catch {
        // Silently fail for dashboard component
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRequests();
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div>
              <CardTitle>Exchange Requests</CardTitle>
              <CardDescription>
                People interested in exchanging skills with you
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (exchangeRequests.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <CardTitle>Exchange Requests</CardTitle>
            <CardDescription>
              People interested in exchanging skills with you
            </CardDescription>
          </div>
          <Badge
            variant="destructive"
            className="self-start sm:self-auto sm:ml-2"
          >
            {exchangeRequests.length} New
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {exchangeRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
              <AvatarImage src={request.avatar} alt={request.from} />
              <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white">
                {request.from
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <span className="font-semibold block">{request.from}</span>
                  <p className="text-sm text-muted-foreground mt-1 wrap-break-word">
                    {request.message}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 sm:ml-2">
                  {request.time}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs">
                  Teaching: {request.skill}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Learning: {request.wantsToLearn}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  className="rounded-full w-max"
                  onClick={() => router.push("/me/exchange-requests")}
                >
                  View All
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full"
            onClick={() => router.push("/me/exchange-requests")}
          >
            View All Exchange Requests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ExchangeRequests;
