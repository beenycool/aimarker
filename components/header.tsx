"use client";

import React from "react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">GCSE AI Marker</span>
          </Link>
          <Link href="/games" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Football Tracker</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
