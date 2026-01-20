"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { TextAlignEnd, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 inset-x-0 z-50 w-full border-b border-border shadow-none bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              size="sm"
              className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90"
              asChild
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button
                className="relative flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Toggle menu"
              >
                <TextAlignEnd className="h-7 w-7" strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              hideClose
              title="Navigation menu"
              className="w-[85vw] sm:w-[400px] border-l-0 p-0 overflow-hidden"
            >
              {/* Unique drawer background with gradient */}
              <div className="relative h-full w-full bg-linear-to-br from-background via-background to-accent/5">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.3),transparent_50%)] animate-pulse" />
                  <div 
                    className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.3),transparent_50%)] animate-pulse" 
                    style={{ animationDelay: '1s' }}
                  />
                  <div 
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.3),transparent_50%)] animate-pulse" 
                    style={{ animationDelay: '2s' }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header with logo and close */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <Logo size={60} />
                    <SheetClose
                      className="flex size-10 shrink-0 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Close menu"
                    >
                      <X className="size-5" />
                    </SheetClose>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 px-6 py-8 space-y-2">
                    {navLinks.map((link, index) => (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            "group block px-4 py-3 text-base font-medium rounded-lg transition-all",
                            "hover:bg-accent hover:translate-x-2",
                            "bg-linear-to-r from-transparent to-transparent hover:from-accent/50 hover:to-accent/20",
                            "border border-transparent hover:border-accent"
                          )}
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-linear-to-r from-[#10b981] to-[#3b82f6] mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {link.label}
                          </span>
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  {/* CTA Buttons */}
                  <div className="p-6 space-y-3 border-t">
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        className="w-full bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90"
                        asChild
                      >
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
