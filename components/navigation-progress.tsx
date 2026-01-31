"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationProgressContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  endNavigation: () => void;
}

const NavigationProgressContext = createContext<NavigationProgressContextType>({
  isNavigating: false,
  startNavigation: () => {},
  endNavigation: () => {},
});

export function useNavigationProgress() {
  return useContext(NavigationProgressContext);
}

export function NavigationProgressProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousRouteRef = useRef<string>("");
  const isNavigatingRef = useRef(false);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);
    isNavigatingRef.current = true;
  }, []);

  const endNavigation = useCallback(() => {
    setProgress(100);
    // Small delay before hiding to show completion
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
      isNavigatingRef.current = false;
    }, 200);
  }, []);

  // End navigation when route changes (only if we were navigating)
  useEffect(() => {
    const currentRoute = pathname + (searchParams?.toString() || "");
    
    // Only end navigation if route actually changed and we were navigating
    if (previousRouteRef.current !== currentRoute && isNavigatingRef.current) {
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsNavigating(false);
          setProgress(0);
          isNavigatingRef.current = false;
        }, 200);
      }, 0);
      
      previousRouteRef.current = currentRoute;
      return () => clearTimeout(timer);
    }
    
    previousRouteRef.current = currentRoute;
  }, [pathname, searchParams]);

  // Animate progress while navigating
  useEffect(() => {
    if (!isNavigating) return;

    // Quick initial progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(50), 300);
    const timer3 = setTimeout(() => setProgress(70), 600);
    const timer4 = setTimeout(() => setProgress(85), 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isNavigating]);

  return (
    <NavigationProgressContext.Provider value={{ isNavigating, startNavigation, endNavigation }}>
      {/* Progress Bar */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-9999 h-1 pointer-events-none transition-opacity duration-200",
          isNavigating ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          className="h-full bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Glow effect */}
        <div
          className="absolute right-0 top-0 h-full w-24 bg-linear-to-r from-transparent to-white/30 blur-sm transition-all duration-300"
          style={{ 
            transform: `translateX(${progress < 100 ? '0' : '100%'})`,
            opacity: isNavigating && progress < 100 ? 1 : 0
          }}
        />
      </div>
      {children}
    </NavigationProgressContext.Provider>
  );
}
