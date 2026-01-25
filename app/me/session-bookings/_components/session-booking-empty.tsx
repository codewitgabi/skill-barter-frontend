import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Calendar } from "lucide-react";

function SessionBookingEmpty() {
  return (
    <Card className="shadow-none">
      <CardContent className="p-6 sm:p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Calendar className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No session bookings</EmptyTitle>
            <EmptyDescription>
              You don&apos;t have any session bookings yet. Once you accept an
              exchange request, session bookings will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  );
}

export default SessionBookingEmpty;
