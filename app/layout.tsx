import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientLayoutItems from "@/components/layout/client-layout-items";
import StagewiseToolbarClient from "@/components/layout/StagewiseToolbarClient";
import { CookieConsent } from "@/components/gdpr/cookie-consent";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "GCSE AI Marker | Intelligent Exam Grading",
  description: "Improve your GCSE exam preparation with AI-powered grading and feedback. Get instant assessment for all GCSE subjects.",
  keywords: "GCSE, exam preparation, AI grading, study tool, revision, exam feedback, education technology",
  authors: [{ name: "GCSE AI Marker Team" }],
  generator: "Next.js",
  applicationName: "GCSE AI Marker",
  creator: "GCSE AI Marker",
  publisher: "GCSE AI Marker",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "GCSE AI Marker | Intelligent Exam Grading",
    description: "Improve your GCSE exam preparation with AI-powered grading and feedback",
    url: "https://aimarker.tech",
    siteName: "GCSE AI Marker",
    images: [
      {
        url: "https://aimarker.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GCSE AI Marker Preview",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GCSE AI Marker | Intelligent Exam Grading",
    description: "AI-powered GCSE exam preparation tool with instant feedback",
    images: ["https://aimarker.tech/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GCSE AI Marker",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://api.aimarker.tech" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.aimarker.tech" />
        <link rel="preload" href="/sounds/notify.mp3" as="audio" type="audio/mpeg" />
        <link rel="preload" href="/sounds/game-end.mp3" as="audio" type="audio/mpeg" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#4f46e5" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: dark)" />
      </head>
      <body 
        className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <ClientLayoutItems />
          <StagewiseToolbarClient />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
