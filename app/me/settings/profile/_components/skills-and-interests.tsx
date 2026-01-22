"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function SkillsAndInterests() {
  const handleAddSkill = () => {
    // Handle add skill logic
    console.log("Adding new skill...");
  };

  const handleAddInterest = () => {
    // Handle add interest logic
    console.log("Adding new interest...");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Interests</CardTitle>
        <CardDescription>
          Manage your skills and areas of interest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Your Skills</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Skills you can teach to others
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-accent rounded-full text-sm">
                JavaScript
              </span>
              <span className="px-3 py-1 bg-accent rounded-full text-sm">
                React
              </span>
              <span className="px-3 py-1 bg-accent rounded-full text-sm">
                TypeScript
              </span>
              <Button variant="outline" size="sm" onClick={handleAddSkill}>
                + Add Skill
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Learning Interests</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Skills you want to learn
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-accent rounded-full text-sm">
                Python
              </span>
              <span className="px-3 py-1 bg-accent rounded-full text-sm">
                Machine Learning
              </span>
              <Button variant="outline" size="sm" onClick={handleAddInterest}>
                + Add Interest
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SkillsAndInterests;
