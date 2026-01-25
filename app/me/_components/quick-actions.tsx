import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, Plus } from "lucide-react";

function QuickActions() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start rounded-2xl"
          size="sm"
          asChild
        >
          <Link href="/@me/exchange-requests">
            <Plus className="h-4 w-4 mr-2" />
            New Exchange Request
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start rounded-2xl"
          size="sm"
          asChild
        >
          <Link href="/@me/browse-skills">
            <Zap className="h-4 w-4 mr-2" />
            Find Skills to Learn
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start rounded-2xl"
          size="sm"
          disabled
        >
          <Target className="h-4 w-4 mr-2" />
          Update My Skills
        </Button>
      </CardContent>
    </Card>
  );
}

export default QuickActions;
