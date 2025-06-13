"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavigationHeader() {
  const pathname = usePathname();
  const isDevEnvironment = process.env.NODE_ENV === 'development';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex items-center justify-between px-4 py-2">
        <ul className="flex items-center space-x-4">
          <li>
            <Link href="/" className={`text-sm font-medium ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/marker" className={`text-sm font-medium ${pathname === '/marker' ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}>
              Marker
            </Link>
          </li>
          {isDevEnvironment && (
            <li>
              <Link href="/debug" className={`text-sm font-medium ${pathname === '/debug' ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}>
                Debug
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
} 