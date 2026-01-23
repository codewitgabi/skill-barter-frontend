"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

function SkillsAndInterests() {
  const { user } = useAuth();

  const handleAddSkill = () => {
    // Handle add skill logic
    console.log("Adding new skill...");
  };

  const handleAddInterest = () => {
    // Handle add interest logic
    console.log("Adding new interest...");
  };

  const skills = (user?.skills as Array<{ name?: string; skill?: string }>) || [];
  const interests = (user?.interests as Array<{ name?: string; skill?: string }>) || [];

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
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent rounded-full text-sm"
                  >
                    {skill.name || skill.skill || "Unknown"}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet</p>
              )}
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
              {interests.length > 0 ? (
                interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent rounded-full text-sm"
                  >
                    {interest.name || interest.skill || "Unknown"}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No interests added yet</p>
              )}
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
