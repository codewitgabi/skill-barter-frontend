"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Code,
  Paintbrush,
  Music,
  Camera,
  Languages,
  ChefHat,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const skills = [
  { icon: Code, label: "Web Development", color: "from-blue-500 to-cyan-500" },
  { icon: Paintbrush, label: "Design", color: "from-purple-500 to-pink-500" },
  {
    icon: Music,
    label: "Music Production",
    color: "from-green-500 to-emerald-500",
  },
  { icon: Camera, label: "Photography", color: "from-orange-500 to-red-500" },
  {
    icon: Languages,
    label: "Language Tutoring",
    color: "from-indigo-500 to-blue-500",
  },
  { icon: ChefHat, label: "Cooking", color: "from-amber-500 to-orange-500" },
];

function AnimatedSkillCard({
  skill,
  delay,
}: {
  skill: (typeof skills)[0];
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = skill.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-all duration-500 shrink-0",
        "bg-muted/30 backdrop-blur-sm border border-border/50",
        "hover:border-border hover:bg-muted/50 hover:scale-105",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Animated gradient border on hover */}
      <div
        className={cn(
          "absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
          "bg-linear-to-br blur-sm",
          skill.color,
        )}
      />

      {/* Subtle inner glow */}
      <div
        className={cn(
          "absolute inset-px rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500",
          "bg-linear-to-br",
          skill.color,
        )}
      />

      <div className="relative p-6 flex flex-col items-center text-center space-y-4 z-10 w-[140px]">
        {/* Icon container with glow effect */}
        <div className="relative">
          {/* Glow behind icon */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300",
              "bg-linear-to-br",
              skill.color,
            )}
          />

          {/* Icon */}
          <div
            className={cn(
              "relative p-3.5 rounded-xl bg-linear-to-br transition-all duration-300",
              "group-hover:scale-110 group-hover:rotate-3",
              skill.color,
            )}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        <p className="font-medium text-xs text-foreground/60 group-hover:text-foreground transition-colors">
          {skill.label}
        </p>
      </div>
    </div>
  );
}

// Seeded random function for deterministic values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function FloatingParticle({ delay, index }: { delay: number; index: number }) {
  // Use lazy initializer with seeded random for deterministic, consistent values
  // Round to fixed precision to ensure server/client match
  const position = useState(() => {
    const seed1 = index * 0.1;
    const seed2 = index * 0.1 + 1;
    const seed3 = index * 0.1 + 2;
    return {
      left: Math.round(seededRandom(seed1) * 10000) / 100,
      top: Math.round(seededRandom(seed2) * 10000) / 100,
      duration: Math.round((3 + seededRandom(seed3) * 2) * 100) / 100,
    };
  })[0];

  return (
    <div
      className="absolute w-2 h-2 rounded-full bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] opacity-20 animate-float"
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${position.duration}s`,
      }}
    />
  );
}

function HeroSection() {
  // No mounted state needed - use CSS animations that trigger automatically

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#10b981] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3b82f6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#8b5cf6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} index={i} />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="text-center space-y-8 mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/80 backdrop-blur-sm text-sm font-medium animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-[#10b981]" />
              <span className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                Exchange Skills, Build Community
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <span className="block">Trade Your</span>
              <span className="block mt-2 bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent animate-gradient">
                Skills for Skills
              </span>
            </h1>

            {/* Description */}
            <p
              className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              Connect with talented individuals and exchange your expertise.
              Teach web development, learn photography, share design skills, or
              master a new language—all through skill bartering.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "600ms" }}
            >
              <Button
                size="lg"
                className="group bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                asChild
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:scale-105 transition-all"
                asChild
              >
                <Link href="/explore">Explore Skills</Link>
              </Button>
            </div>
          </div>

          {/* Skill Cards Horizontal Scroll */}
          <div className="relative mt-20 overflow-hidden">
            {/* Gradient fade on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-background to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-background to-transparent z-20 pointer-events-none" />

            <div className="flex gap-4 animate-scroll">
              {/* First set of cards */}
              {skills.map((skill, index) => (
                <AnimatedSkillCard
                  key={`first-${skill.label}`}
                  skill={skill}
                  delay={800 + index * 100}
                />
              ))}
              {/* Duplicate set for seamless loop */}
              {skills.map((skill, index) => (
                <AnimatedSkillCard
                  key={`second-${skill.label}`}
                  skill={skill}
                  delay={800 + (skills.length + index) * 100}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center animate-fade-in-up"
            style={{ animationDelay: "1000ms" }}
          >
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-[#10b981] to-[#3b82f6] bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm text-muted-foreground">
                Skills Available
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-[#8b5cf6] to-[#10b981] bg-clip-text text-transparent">
                2K+
              </div>
              <div className="text-sm text-muted-foreground">
                Successful Exchanges
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-140px * 6 - 1rem * 5));
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
          width: fit-content;
          display: flex;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

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
          opacity: 0;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
