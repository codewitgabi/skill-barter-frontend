import { UserPlus, Search, Handshake, Network } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Sign up and list the skills you can teach. Add your experience, portfolio, and availability.",
    color: "from-[#10b981] to-[#3b82f6]",
  },
  {
    icon: Search,
    title: "Browse & Discover",
    description:
      "Explore skills you want to learn. Use filters to find the perfect match for your learning goals.",
    color: "from-[#3b82f6] to-[#8b5cf6]",
  },
  {
    icon: Handshake,
    title: "Connect & Exchange",
    description:
      "Message skill providers, discuss your goals, and schedule sessions. Start your skill exchange journey.",
    color: "from-[#8b5cf6] to-[#10b981]",
  },
  {
    icon: Network,
    title: "Build Your Network",
    description:
      "Grow your skill network, earn reviews, and unlock new opportunities for continuous learning.",
    color: "from-[#10b981] via-[#3b82f6] to-[#8b5cf6]",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 overflow-hidden scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in four simple steps and begin your skill exchange
              journey today
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] opacity-20" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="relative group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 lg:hidden">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="relative bg-background border-2 border-border rounded-2xl p-6 lg:p-8 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg group-hover:scale-105">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl bg-linear-to-br mb-6 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                          step.color,
                        )}
                      >
                        <Icon className="w-8 h-8" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>

                      {/* Step Number (Desktop) */}
                      <div className="hidden lg:block absolute -top-4 -left-4">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center text-white font-bold text-lg border-4 border-background">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div
            className="text-center mt-16 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <p className="text-muted-foreground mb-6">
              Ready to start exchanging skills?
            </p>
            <a
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
