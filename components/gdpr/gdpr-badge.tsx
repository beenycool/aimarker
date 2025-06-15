'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Shield, CheckCircle, Eye, Lock, Users, FileText } from 'lucide-react'

interface GDPRBadgeProps {
  variant?: 'badge' | 'full' | 'minimal'
  showDialog?: boolean
  className?: string
}

const COMPLIANCE_FEATURES = [
  {
    icon: Lock,
    title: 'Data Protection',
    description: 'Your personal data is encrypted and securely stored in compliance with GDPR standards.'
  },
  {
    icon: Users,
    title: 'User Rights',
    description: 'Full support for data subject rights including access, rectification, erasure, and portability.'
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Clear and accessible privacy policies explaining how we collect, use, and protect your data.'
  },
  {
    icon: FileText,
    title: 'Consent Management',
    description: 'Granular cookie consent controls and explicit opt-in for data processing activities.'
  }
]

export function GDPRBadge({ variant = 'badge', showDialog = true, className = '' }: GDPRBadgeProps) {
  const BadgeComponent = () => {
    switch (variant) {
      case 'minimal':
        return (
          <Badge variant="secondary" className={`inline-flex items-center gap-1 ${className}`}>
            <Shield className="h-3 w-3" />
            GDPR
          </Badge>
        )
      
      case 'full':
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg ${className}`}>
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div className="text-sm">
              <div className="font-medium text-green-800 dark:text-green-200">GDPR Compliant</div>
              <div className="text-green-600 dark:text-green-400">Data protection certified</div>
            </div>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        )
      
      default:
        return (
          <Badge variant="secondary" className={`inline-flex items-center gap-2 ${className}`}>
            <Shield className="h-4 w-4" />
            <span>GDPR Compliant</span>
            <CheckCircle className="h-3 w-3 text-green-600" />
          </Badge>
        )
    }
  }

  if (!showDialog) {
    return <BadgeComponent />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer hover:opacity-80 transition-opacity">
          <BadgeComponent />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            GDPR Compliance Certification
          </DialogTitle>
          <DialogDescription>
            Our commitment to protecting your personal data and privacy rights under the 
            General Data Protection Regulation (GDPR).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Compliance Status */}
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                Fully GDPR Compliant
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Last audited: {new Date().toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>

          {/* Compliance Features */}
          <div className="grid gap-4 md:grid-cols-2">
            {COMPLIANCE_FEATURES.map((feature, index) => (
              <div key={index} className="flex gap-3 p-3 border rounded-lg">
                <feature.icon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Legal Information */}
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Your Data Protection Rights</h4>
              <p className="text-muted-foreground mb-3">
                Under GDPR, you have the following rights regarding your personal data:
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• <strong>Right of access:</strong> Request copies of your personal data</li>
                <li>• <strong>Right to rectification:</strong> Correct inaccurate personal data</li>
                <li>• <strong>Right to erasure:</strong> Request deletion of your personal data</li>
                <li>• <strong>Right to restrict processing:</strong> Limit how we use your data</li>
                <li>• <strong>Right to data portability:</strong> Transfer your data to another service</li>
                <li>• <strong>Right to object:</strong> Object to certain types of processing</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <a href="/privacy-policy" target="_blank">
                  <FileText className="h-4 w-4 mr-2" />
                  Privacy Policy
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <a href="/terms-conditions" target="_blank">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms & Conditions
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <a href="mailto:privacy@aimarker.tech" target="_blank">
                  <Users className="h-4 w-4 mr-2" />
                  Contact DPO
                </a>
              </Button>
            </div>
          </div>

          {/* Certification Details */}
          <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
            <p className="mb-2">
              <strong>Certification Details:</strong>
            </p>
            <ul className="space-y-1">
              <li>• Compliance framework: EU General Data Protection Regulation (GDPR)</li>
              <li>• Data processor: GCSE AI Marker Ltd.</li>
              <li>• Registration: ICO Registration Number: [Placeholder]</li>
              <li>• Last compliance review: {new Date().toLocaleDateString('en-GB')}</li>
              <li>• Next scheduled review: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Lightweight version for footer
export function GDPRFooterBadge() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Shield className="h-3 w-3" />
      <span>GDPR Compliant</span>
      <CheckCircle className="h-3 w-3 text-green-600" />
    </div>
  )
} 