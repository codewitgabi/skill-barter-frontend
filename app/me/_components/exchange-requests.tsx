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

const exchangeRequests = [
  {
    id: 1,
    from: "John Smith",
    skill: "Graphic Design",
    wantsToLearn: "React Development",
    message:
      "I'd love to exchange graphic design skills for React development!",
    avatar: "/placeholder-avatar.jpg",
    time: "2 hours ago",
  },
  {
    id: 2,
    from: "Lisa Park",
    skill: "Korean Language",
    wantsToLearn: "Cooking",
    message: "Looking to teach Korean in exchange for cooking lessons.",
    avatar: "/placeholder-avatar.jpg",
    time: "5 hours ago",
  },
];

function ExchangeRequests() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Exchange Requests</CardTitle>
            <CardDescription>
              People interested in exchanging skills with you
            </CardDescription>
          </div>
          <Badge variant="destructive" className="ml-2">
            {exchangeRequests.length} New
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {exchangeRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.avatar} alt={request.from} />
              <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white">
                {request.from
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-semibold">{request.from}</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {request.message}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {request.time}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs">
                  Teaching: {request.skill}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Learning: {request.wantsToLearn}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" className="rounded-full w-max">
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full w-max"
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default ExchangeRequests;
