"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Search, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Search & Browse Skills",
    description: "Explore thousands of skills available in your area. Use filters to find exactly what you need.",
    mockup: "search",
    annotation: "Search for any skill you want to learn",
  },
  {
    id: 2,
    title: "Filter & Find Matches",
    description: "Refine your search by location, skill level, and availability. Find the perfect match for your needs.",
    mockup: "filter",
    annotation: "Filter by location, category, and availability",
  },
  {
    id: 3,
    title: "View Provider Profile",
    description: "Check out detailed profiles with ratings, reviews, and skill portfolios. See what others have learned.",
    mockup: "profile",
    annotation: "View ratings, reviews, and skill portfolio",
  },
  {
    id: 4,
    title: "Connect & Message",
    description: "Send a message to start the conversation. Discuss your learning goals and exchange details.",
    mockup: "message",
    annotation: "Start a conversation about skill exchange",
  },
  {
    id: 5,
    title: "Begin Skill Exchange",
    description: "Schedule your sessions and start learning. Track your progress and build your skill network.",
    mockup: "exchange",
    annotation: "Schedule sessions and track your progress",
  },
];

function MockupFrame({ step, isActive }: { step: typeof steps[0]; isActive: boolean }) {
  const getMockupContent = () => {
    switch (step.mockup) {
      case "search":
        return (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 h-4 bg-muted rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  <div className="h-2 bg-muted rounded w-1/2 animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                </div>
              ))}
            </div>
          </div>
        );
      case "filter":
        return (
          <div className="p-6 space-y-4">
            <div className="flex gap-2">
              {["All", "Design", "Tech", "Music"].map((cat, i) => (
                <div
                  key={cat}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    i === 1 ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {cat}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted/30 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    <div className="h-2 bg-muted rounded w-1/2 animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-[#10b981] to-[#3b82f6] rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted/50 rounded w-full animate-pulse" />
              <div className="h-3 bg-muted/50 rounded w-5/6 animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {["Web Dev", "Design", "Photo"].map((skill) => (
                <div key={skill} className="bg-muted/30 rounded px-2 py-1 text-xs text-center">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        );
      case "message":
        return (
          <div className="p-6 space-y-4 flex flex-col h-full">
            <div className="flex-1 space-y-3">
              <div className="flex gap-2 justify-end">
                <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 max-w-[70%]">
                  <div className="text-sm">Hi! I&apos;d love to learn web development</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-muted/50 rounded-lg px-3 py-2 max-w-[70%]">
                  <div className="text-sm text-muted-foreground">Sure! I can teach you React and Next.js</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 border-t pt-3">
              <div className="flex-1 h-10 bg-muted/50 rounded-lg" />
              <MessageCircle className="w-10 h-10 text-primary p-2" />
            </div>
          </div>
        );
      case "exchange":
        return (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse" />
                <div className="h-3 bg-muted/50 rounded w-32 animate-pulse" />
              </div>
              <CheckCircle2 className="w-8 h-8 text-[#10b981]" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                <div className="h-3 bg-muted/50 rounded flex-1 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                <div className="h-3 bg-muted/50 rounded flex-1 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted rounded-full" />
                <div className="h-3 bg-muted/30 rounded flex-1" />
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="h-10 bg-linear-to-r from-[#10b981] to-[#3b82f6] rounded-lg flex items-center justify-center text-white font-medium">
                Start Learning
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-[400px] bg-background border-2 rounded-2xl overflow-hidden transition-all duration-500",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute inset-0"
      )}
    >
      <div className="absolute top-3 left-3 right-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 h-6 bg-muted/50 rounded mx-4" />
      </div>
      <div className="pt-12 h-full">{getMockupContent()}</div>
    </div>
  );
}

function DemoSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isInView) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, isInView]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setIsPlaying(false);
  };

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              See How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how easy it is to find and exchange skills on our platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup Display */}
            <div className="relative">
              <div className="relative h-[400px]">
                {steps.map((step, index) => (
                  <MockupFrame
                    key={step.id}
                    step={step}
                    isActive={index === currentStep}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleStepClick(index)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        index === currentStep
                          ? "w-8 bg-primary"
                          : "w-2 bg-muted hover:bg-muted-foreground/50"
                      )}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              <div className="relative h-[400px]">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "absolute inset-0 transition-all duration-500",
                      index === currentStep
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    )}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-[#10b981] via-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-lg">
                        {step.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
                          <ArrowRight className="w-4 h-4 text-[#10b981]" />
                          <span className="text-sm font-medium">{step.annotation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step Indicators */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
                    setIsPlaying(false);
                  }}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentStep((prev) => (prev + 1) % steps.length);
                    setIsPlaying(false);
                  }}
                  disabled={currentStep === steps.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default DemoSection;
