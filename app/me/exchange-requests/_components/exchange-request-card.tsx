import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Clock, ExternalLink } from "lucide-react";
import type { IExchangeRequest } from "@/types/dashboard";
import ExchangeRequestActions from "./exchange-request-actions";

interface ExchangeRequestCardProps {
  request: IExchangeRequest;
  isProcessing: boolean;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

function ExchangeRequestCard({
  request,
  isProcessing,
  onAccept,
  onDecline,
}: ExchangeRequestCardProps) {
  return (
    <Card className="shadow-none border hover:bg-accent/50 transition-colors">
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-3 sm:gap-4">
          {/* Avatar Section */}
          <div className="shrink-0">
            <Link href={`/users/${request.requesterId}`}>
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={request.avatar} alt={request.from} />
                <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white text-sm sm:text-base">
                  {request.from
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header with name and time */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Link href={`/users/${request.requesterId}`}>
                  <h3 className="text-base sm:text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                    {request.from}
                  </h3>
                </Link>
                {request.website && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={request.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{request.website}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{request.time}</span>
              </div>
            </div>

            {/* Message */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-3">
              {request.message}
            </p>

            {/* Skills Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
              <Badge variant="default" className="text-xs font-medium">
                Teaching: {request.skill}
              </Badge>
              <Badge variant="outline" className="text-xs font-medium">
                Learning: {request.wantsToLearn}
              </Badge>
            </div>

            {/* Action Buttons */}
            <ExchangeRequestActions
              requestId={request.id}
              isProcessing={isProcessing}
              onAccept={onAccept}
              onDecline={onDecline}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ExchangeRequestCard;
