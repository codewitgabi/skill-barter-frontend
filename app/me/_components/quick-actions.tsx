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
        >
          <Plus className="h-4 w-4 mr-2" />
          New Exchange Request
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start rounded-2xl"
          size="sm"
        >
          <Zap className="h-4 w-4 mr-2" />
          Find Skills to Learn
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start rounded-2xl"
          size="sm"
        >
          <Target className="h-4 w-4 mr-2" />
          Update My Skills
        </Button>
      </CardContent>
    </Card>
  );
}

export default QuickActions;
