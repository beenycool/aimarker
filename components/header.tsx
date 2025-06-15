"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            <span className="font-bold text-lg">GCSE AI Marker</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/marker" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Marker Tool
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="hidden sm:flex items-center space-x-4">
            <Link href="/terms-conditions" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
