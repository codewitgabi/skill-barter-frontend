import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-linear-to-br from-[#10b981] via-[#3b82f6] to-[#8b5cf6] rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-size[24px_24px]" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                Ready to Start Your Skill Exchange Journey?
              </h2>
              <p
                className="text-lg text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                Join thousands of members who are learning new skills and
                building their networks through skill bartering.
              </p>

              {/* Trust Indicators */}
              <div
                className="flex flex-wrap items-center justify-center gap-6 mb-8 animate-fade-in-up"
                style={{ animationDelay: "400ms" }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">
                    10K+ Active Members
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">
                    2K+ Successful Exchanges
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">
                    100% Free Forever
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
                style={{ animationDelay: "600ms" }}
              >
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-base px-8 py-6 h-auto"
                  asChild
                >
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 text-base px-8 py-6 h-auto backdrop-blur-sm"
                  asChild
                >
                  <Link href="/explore">Explore Skills</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
