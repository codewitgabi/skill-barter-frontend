import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { UserPlus } from "lucide-react";

function ExchangeRequestEmpty() {
  return (
    <Card className="shadow-none">
      <CardContent className="p-6 sm:p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserPlus className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No exchange requests</EmptyTitle>
            <EmptyDescription>
              When someone sends you an exchange request, it will appear here.
              You can accept or decline each request.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  );
}

export default ExchangeRequestEmpty;
