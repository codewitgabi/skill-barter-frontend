import {
  DollarSign,
  Shield,
  Star,
  Calendar,
  Users,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: DollarSign,
    title: "100% Free",
    description:
      "No money needed. Exchange skills directly with other members. Learn and teach without any financial barriers.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description:
      "All members go through verification to ensure authenticity. Build trust in a safe and secure community.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description:
      "Rate your learning experience and help others find quality skill providers. Build your reputation over time.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description:
      "Schedule sessions that work for both parties. Learn at your own pace with flexible time arrangements.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Community Building",
    description:
      "Connect with like-minded learners. Join skill groups, attend workshops, and expand your network.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Layers,
    title: "Multiple Categories",
    description:
      "From tech to arts, languages to cooking. Explore diverse skill categories and discover new passions.",
    color: "from-rose-500 to-red-500",
  },
];

function Features() {
  return (
    <section className="relative py-20 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Why Choose Skill Barter?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to exchange skills and grow your knowledge
              network
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-background border-2 border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl bg-linear-to-br mb-4 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      feature.color,
                    )}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10 bg-linear-to-br",
                      feature.color,
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div
            className="mt-16 grid sm:grid-cols-3 gap-8 text-center animate-fade-in-up"
            style={{ animationDelay: "600ms" }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
                <span className="text-2xl font-bold">10K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#3b82f6]" />
                <span className="text-2xl font-bold">500+</span>
              </div>
              <p className="text-sm text-muted-foreground">Skills Available</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#8b5cf6]" />
                <span className="text-2xl font-bold">2K+</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Successful Exchanges
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
