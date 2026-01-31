"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, MouseEvent } from "react";
import { useNavigationProgress } from "./navigation-progress";

interface ProgressLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

export const ProgressLink = forwardRef<HTMLAnchorElement, ProgressLinkProps>(
  ({ children, className, onClick, href, target, ...props }, ref) => {
    const { startNavigation } = useNavigationProgress();
    const pathname = usePathname();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      // Call original onClick if provided
      onClick?.(e);

      // Don't trigger progress for:
      // - External links (target="_blank")
      // - Hash links on the same page
      // - If navigation was prevented
      if (e.defaultPrevented || target === "_blank") {
        return;
      }

      const hrefString = typeof href === "string" ? href : href.pathname || "";
      
      // Check if it's a hash link on the same page
      if (hrefString.startsWith("#")) {
        return;
      }

      // Check if it's the same page (no navigation needed)
      const targetPath = hrefString.split("?")[0].split("#")[0];
      if (targetPath === pathname) {
        return;
      }

      // Start the navigation progress
      startNavigation();
    };

    return (
      <Link
        ref={ref}
        href={href}
        className={className}
        onClick={handleClick}
        target={target}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

ProgressLink.displayName = "ProgressLink";
