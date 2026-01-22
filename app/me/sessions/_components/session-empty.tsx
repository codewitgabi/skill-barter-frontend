import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Calendar } from "lucide-react";

interface SessionEmptyProps {
  filter: string;
}

function SessionEmpty({ filter }: SessionEmptyProps) {
  const getMessage = () => {
    switch (filter) {
      case "active":
        return {
          title: "No active sessions",
          description:
            "You don't have any active sessions right now. Check your scheduled sessions to get started.",
        };
      case "scheduled":
        return {
          title: "No scheduled sessions",
          description:
            "You don't have any upcoming sessions scheduled. Accept exchange requests to start new sessions.",
        };
      case "completed":
        return {
          title: "No completed sessions",
          description:
            "You haven't completed any sessions yet. Complete your active sessions to see them here.",
        };
      default:
        return {
          title: "No sessions",
          description:
            "You don't have any sessions yet. Accept exchange requests to start learning and teaching.",
        };
    }
  };

  const message = getMessage();

  return (
    <Card className="shadow-none">
      <CardContent className="p-6 sm:p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Calendar className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>{message.title}</EmptyTitle>
            <EmptyDescription>{message.description}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  );
}

export default SessionEmpty;
