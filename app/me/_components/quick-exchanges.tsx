import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight } from "lucide-react";

const recentExchanges = [
  {
    id: 1,
    type: "Completed",
    skill: "UI/UX Design",
    partner: "Alex Thompson",
    date: "2 days ago",
    rating: 5,
    avatar: "/placeholder-avatar.jpg",
    status: "completed",
  },
  {
    id: 2,
    type: "Completed",
    skill: "Guitar Lessons",
    partner: "David Lee",
    date: "5 days ago",
    rating: 5,
    avatar: "/placeholder-avatar.jpg",
    status: "completed",
  },
  {
    id: 3,
    type: "In Progress",
    skill: "Data Science",
    partner: "Emma Wilson",
    date: "Started 1 week ago",
    rating: null,
    avatar: "/placeholder-avatar.jpg",
    status: "active",
    progress: 65,
  },
];

function QuickExchanges() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Exchanges</CardTitle>
            <CardDescription>
              Your latest skill exchange activities
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentExchanges.map((exchange) => (
          <div
            key={exchange.id}
            className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={exchange.avatar} alt={exchange.partner} />
              <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white">
                {exchange.partner
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{exchange.partner}</span>
                    <Badge
                      variant={
                        exchange.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {exchange.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {exchange.skill}
                  </p>
                </div>
                {exchange.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {exchange.rating}
                    </span>
                  </div>
                )}
              </div>
              {exchange.progress && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{exchange.progress}%</span>
                  </div>
                  <Progress value={exchange.progress} className="h-2" />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {exchange.date}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default QuickExchanges;
