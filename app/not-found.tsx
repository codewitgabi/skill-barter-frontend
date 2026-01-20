import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, Compass } from "lucide-react";
import { LandingNavbar } from "@/components/navbar";
import Footer from "./_components/footer";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      
      <main className="flex-1 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#10b981] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3b82f6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#8b5cf6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              {/* 404 Number */}
              <div className="animate-fade-in-up">
                <h1 className="text-9xl sm:text-[12rem] font-bold bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent animate-gradient">
                  404
                </h1>
              </div>

              {/* Main Message */}
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  Oops! Page Not Found
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  The page you&apos;re looking for seems to have wandered off into the skill exchange void. 
                  Don&apos;t worry, let&apos;s get you back on track!
                </p>
              </div>

              {/* Illustration/Icon */}
              <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-linear-to-br from-[#10b981] via-[#3b82f6] to-[#8b5cf6] flex items-center justify-center opacity-20 blur-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Compass className="w-16 h-16 sm:w-20 sm:h-20 text-[#10b981] animate-spin-slow" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                <Button
                  asChild
                  className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90 w-full sm:w-auto"
                >
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Link href="/">
                    <Search className="w-4 h-4 mr-2" />
                    Explore Skills
                  </Link>
                </Button>
              </div>

              {/* Helpful Links */}
              <div className="pt-12 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
                <p className="text-sm text-muted-foreground mb-4">You might be looking for:</p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <Link
                    href="/"
                    className="text-primary hover:underline transition-colors"
                  >
                    Home
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link
                    href="/auth/register"
                    className="text-primary hover:underline transition-colors"
                  >
                    Sign Up
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link
                    href="/auth/signin"
                    className="text-primary hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link
                    href="/"
                    className="text-primary hover:underline transition-colors"
                  >
                    How It Works
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;
