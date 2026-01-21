"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { SkillsFormData } from "../../_lib/validation";

const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

function StepSkills() {
  const form = useFormContext<SkillsFormData>();
  const [newSkillToTeach, setNewSkillToTeach] = useState("");
  const [newSkillToLearn, setNewSkillToLearn] = useState("");

  const skillsToTeach = form.watch("skillsToTeach") || [];
  const skillsToLearn = form.watch("skillsToLearn") || [];

  const addSkillToTeach = () => {
    if (newSkillToTeach.trim()) {
      const current = form.getValues("skillsToTeach") || [];
      form.setValue("skillsToTeach", [
        ...current,
        { skill: newSkillToTeach.trim(), level: "beginner" },
      ]);
      setNewSkillToTeach("");
    }
  };

  const removeSkillToTeach = (index: number) => {
    const current = form.getValues("skillsToTeach") || [];
    form.setValue(
      "skillsToTeach",
      current.filter((_, i) => i !== index),
    );
  };

  const updateSkillToTeachLevel = (index: number, level: string) => {
    const current = form.getValues("skillsToTeach") || [];
    const updated = [...current];
    updated[index] = {
      ...updated[index],
      level: level as "beginner" | "intermediate" | "advanced",
    };
    form.setValue("skillsToTeach", updated);
  };

  const addSkillToLearn = () => {
    if (newSkillToLearn.trim()) {
      const current = form.getValues("skillsToLearn") || [];
      form.setValue("skillsToLearn", [
        ...current,
        { skill: newSkillToLearn.trim(), level: "beginner" },
      ]);
      setNewSkillToLearn("");
    }
  };

  const removeSkillToLearn = (index: number) => {
    const current = form.getValues("skillsToLearn") || [];
    form.setValue(
      "skillsToLearn",
      current.filter((_, i) => i !== index),
    );
  };

  const updateSkillToLearnLevel = (index: number, level: string) => {
    const current = form.getValues("skillsToLearn") || [];
    const updated = [...current];
    updated[index] = {
      ...updated[index],
      level: level as "beginner" | "intermediate" | "advanced",
    };
    form.setValue("skillsToLearn", updated);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Skills</h2>
        <p className="text-muted-foreground">
          Tell us what you can teach and what you want to learn
        </p>
      </div>

      <FormField
        control={form.control}
        name="skillsToTeach"
        render={() => (
          <FormItem>
            <FormLabel>Skills You Can Teach</FormLabel>
            <div className="space-y-3">
              {skillsToTeach.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex-1">
                    <p className="font-medium">{skill.skill}</p>
                  </div>
                  <Select
                    value={skill.level}
                    onValueChange={(value) =>
                      updateSkillToTeachLevel(index, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkillToTeach(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Web Development, Photography"
                  value={newSkillToTeach}
                  onChange={(e) => setNewSkillToTeach(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillToTeach();
                    }
                  }}
                />
                <Button type="button" onClick={addSkillToTeach}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="skillsToLearn"
        render={() => (
          <FormItem>
            <FormLabel>Skills You Want to Learn</FormLabel>
            <div className="space-y-3">
              {skillsToLearn.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex-1">
                    <p className="font-medium">{skill.skill}</p>
                  </div>
                  <Select
                    value={skill.level}
                    onValueChange={(value) =>
                      updateSkillToLearnLevel(index, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkillToLearn(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Cooking, Spanish Language"
                  value={newSkillToLearn}
                  onChange={(e) => setNewSkillToLearn(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillToLearn();
                    }
                  }}
                />
                <Button type="button" onClick={addSkillToLearn}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default StepSkills;
