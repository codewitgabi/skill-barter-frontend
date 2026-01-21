"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isUpcoming = step > currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                    isCompleted &&
                      "bg-linear-to-br from-[#10b981] to-[#3b82f6] text-white",
                    isCurrent &&
                      "bg-linear-to-br from-[#10b981] to-[#3b82f6] text-white ring-4 ring-primary/20",
                    isUpcoming &&
                      "bg-muted text-muted-foreground border-2 border-border",
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Step {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors",
                    isCompleted
                      ? "bg-linear-to-r from-[#10b981] to-[#3b82f6]"
                      : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressIndicator;
