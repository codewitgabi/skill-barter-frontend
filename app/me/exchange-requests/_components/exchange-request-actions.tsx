import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ExchangeRequestActionsProps {
  requestId: number;
  isProcessing: boolean;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

function ExchangeRequestActions({
  requestId,
  isProcessing,
  onAccept,
  onDecline,
}: ExchangeRequestActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <Button
        onClick={() => onAccept(requestId)}
        disabled={isProcessing}
        className="flex-1 sm:flex-initial rounded-full font-medium text-sm py-3 sm:py-0"
        size="sm"
      >
        {isProcessing ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Processing...
          </>
        ) : (
          <>
            <Check className="h-3.5 w-3.5 mr-1.5" />
            Accept
          </>
        )}
      </Button>
      <Button
        onClick={() => onDecline(requestId)}
        disabled={isProcessing}
        variant="outline"
        className="flex-1 sm:flex-initial rounded-full font-medium text-sm py-3 sm:py-0"
        size="sm"
      >
        {isProcessing ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Processing...
          </>
        ) : (
          <>
            <X className="h-3.5 w-3.5 mr-1.5" />
            Decline
          </>
        )}
      </Button>
    </div>
  );
}

export default ExchangeRequestActions;
