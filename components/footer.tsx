"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Github, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">GCSE AI Marker</span>
            </div>
            <p className="text-sm text-gray-400">
              AI-powered essay grading and feedback for GCSE students and teachers. 
              Transform your marking with intelligent, consistent assessment.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/marker" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Marker Tool
              </Link>
              <Link href="/pricing" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal & Privacy</h4>
            <div className="space-y-2">
              <Link href="/privacy-policy" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <button 
                onClick={() => {
                  // Trigger cookie preferences modal
                  const event = new CustomEvent('openCookiePreferences')
                  window.dispatchEvent(event)
                }}
                className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
              >
                Cookie Preferences
              </button>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="space-y-2">
              <a 
                href="mailto:support@aimarker.tech" 
                className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                Support
              </a>
              <a 
                href="https://github.com/beenycool" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
              <a 
                href="https://aimarker.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Official Site
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © 2024 GCSE AI Marker. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              GDPR Compliant
            </span>
            <span>Made with ❤️ for Education</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 