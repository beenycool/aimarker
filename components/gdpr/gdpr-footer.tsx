import React from 'react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Shield, FileText, Scale, Mail, Cookie } from 'lucide-react'
import { GDPRFooterBadge } from './gdpr-badge'

interface GDPRFooterProps {
  className?: string
  compact?: boolean
}

export function GDPRFooter({ className = '', compact = false }: GDPRFooterProps) {
  if (compact) {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-conditions" className="hover:text-primary transition-colors">
            Terms & Conditions
          </Link>
          <a href="mailto:privacy@aimarker.tech" className="hover:text-primary transition-colors">
            Contact DPO
          </a>
        </div>
        <GDPRFooterBadge />
      </div>
    )
  }

  return (
    <footer className={`bg-muted/30 border-t mt-16 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Privacy & Legal */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy & Legal
            </h4>
            <div className="space-y-2">
              <Link 
                href="/privacy-policy" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText className="h-3 w-3 inline mr-2" />
                Privacy Policy
              </Link>
              <Link 
                href="/terms-conditions" 
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Scale className="h-3 w-3 inline mr-2" />
                Terms & Conditions
              </Link>
              <button 
                onClick={() => {
                  // Trigger cookie preferences modal
                  const event = new CustomEvent('openCookiePreferences')
                  window.dispatchEvent(event)
                }}
                className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left"
              >
                <Cookie className="h-3 w-3 inline mr-2" />
                Cookie Preferences
              </button>
            </div>
          </div>

          {/* Data Protection */}
          <div>
            <h4 className="font-semibold mb-4">Data Protection</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>We are committed to protecting your privacy and personal data in accordance with GDPR.</p>
              <div className="space-y-1">
                <p className="font-medium">Data Protection Officer:</p>
                <a 
                  href="mailto:dpo@aimarker.tech"
                  className="text-primary hover:underline"
                >
                  dpo@aimarker.tech
                </a>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div>
            <h4 className="font-semibold mb-4">Your Rights</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Under GDPR, you have rights including:</p>
              <ul className="text-xs space-y-1">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate data</li>
                <li>• Request data deletion</li>
                <li>• Data portability</li>
                <li>• Object to processing</li>
              </ul>
              <a 
                href="mailto:privacy@aimarker.tech"
                className="text-primary hover:underline text-xs"
              >
                Exercise your rights →
              </a>
            </div>
          </div>

          {/* Contact & Compliance */}
          <div>
            <h4 className="font-semibold mb-4">Contact & Compliance</h4>
            <div className="space-y-3">
              <div className="space-y-1 text-sm">
                <p className="font-medium">GCSE AI Marker Ltd.</p>
                <p className="text-muted-foreground text-xs">United Kingdom</p>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="mailto:support@aimarker.tech"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-3 w-3 inline mr-2" />
                  General Support
                </a>
                <a 
                  href="mailto:privacy@aimarker.tech"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Shield className="h-3 w-3 inline mr-2" />
                  Privacy Concerns
                </a>
              </div>

              <div className="pt-2">
                <GDPRFooterBadge />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} GCSE AI Marker Ltd. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              ICO Registration: [To be obtained] | Company Registration: [To be registered]
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Powered by responsible AI
            </span>
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 text-green-600" />
              <span className="text-xs text-muted-foreground">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Quick link component for inclusion in other pages
export function GDPRQuickLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 text-xs ${className}`}>
      <Link 
        href="/privacy-policy" 
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        Privacy
      </Link>
      <Link 
        href="/terms-conditions" 
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        Terms
      </Link>
      <a 
        href="mailto:privacy@aimarker.tech" 
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        Contact DPO
      </a>
      <GDPRFooterBadge />
    </div>
  )
}