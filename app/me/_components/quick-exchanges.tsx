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
import { ArrowRight, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api-client";
import { timeSince } from "@/lib/helpers";

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

function QuickExchanges() {
  const router = useRouter();
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRequests = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<ExchangeRequestsData>(
          "/exchange-requests?limit=3",
        );

        if (response.status === "success" && response.data) {
          setExchangeRequests(response.data.exchangeRequests.slice(0, 3));
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
              <CardTitle>Quick Exchanges</CardTitle>
              <CardDescription>
                People interested in exchanging skills with you
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (exchangeRequests.length === 0) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div>
              <CardTitle>Quick Exchanges</CardTitle>
              <CardDescription>
                People interested in exchanging skills with you
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No exchange requests
          </p>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = exchangeRequests.filter(
    (req) => req.status === "pending",
  ).length;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <CardTitle>Quick Exchanges</CardTitle>
            <CardDescription>
              People interested in exchanging skills with you
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge
                variant="destructive"
                className="self-start sm:self-auto"
              >
                {pendingCount} New
              </Badge>
            )}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full self-start sm:self-auto"
              onClick={() => router.push("/@me/exchange-requests")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {exchangeRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
              <AvatarImage
                src={request.requester.avatarUrl || "/placeholder-avatar.jpg"}
                alt={request.requester.name}
              />
              <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white">
                {request.requester.initials ||
                  request.requester.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold truncate">
                      {request.requester.name}
                    </span>
                    <Badge
                      variant={
                        request.status === "accepted"
                          ? "default"
                          : request.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                      className="shrink-0 text-xs"
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </Badge>
                  </div>
                  {request.message && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {request.message}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Teaching: {request.teachingSkill}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Learning: {request.learningSkill}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {timeSince(request.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default QuickExchanges;
