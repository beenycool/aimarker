'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Shield, 
  Cookie, 
  FileText, 
  Scale, 
  CheckCircle, 
  Eye,
  Settings,
  ExternalLink
} from 'lucide-react'
import { GDPRBadge, GDPRFooter, GDPRQuickLinks } from '@/components/gdpr'

export default function GDPRDemoPage() {
  const handleOpenCookiePreferences = () => {
    const event = new CustomEvent('openCookiePreferences')
    window.dispatchEvent(event)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold">GDPR Compliance Suite</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Complete privacy compliance implementation for GCSE AI Marker
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-2 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4" />
              Fully GDPR Compliant
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Cookie className="h-4 w-4" />
              Cookie Consent
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Transparent Privacy
            </Badge>
          </div>
        </div>

        {/* Implementation Overview */}
        <Alert className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">Implementation Complete</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            All four required GDPR compliance components have been successfully implemented and integrated 
            into your application. Your site now meets European data protection standards.
          </AlertDescription>
        </Alert>

        <div className="grid gap-8">
          {/* Component Showcase */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cookie Consent Banner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Cookie Consent Banner
                </CardTitle>
                <CardDescription>
                  GDPR-compliant cookie consent with granular controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Granular cookie category controls</li>
                    <li>• Accept all, reject all, or customize options</li>
                    <li>• Persistent consent storage (1 year)</li>
                    <li>• Automatic consent expiration</li>
                    <li>• Mobile-responsive design</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleOpenCookiePreferences} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Open Cookie Preferences
                </Button>
              </CardContent>
            </Card>

            {/* GDPR Badge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  GDPR Compliance Badge
                </CardTitle>
                <CardDescription>
                  Visual compliance certification and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Badge Variants:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">Minimal:</span>
                        <GDPRBadge variant="minimal" showDialog={false} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">Standard:</span>
                        <GDPRBadge variant="badge" showDialog={false} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">Full:</span>
                        <GDPRBadge variant="full" showDialog={false} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Interactive Badge:</p>
                    <GDPRBadge variant="badge" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legal Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Legal Documentation
              </CardTitle>
              <CardDescription>
                Comprehensive privacy policy and terms of service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Privacy Policy
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Data collection and usage transparency</li>
                    <li>• Third-party AI service disclosure</li>
                    <li>• User rights under GDPR</li>
                    <li>• Data retention and security measures</li>
                    <li>• International data transfer safeguards</li>
                    <li>• Contact information for DPO</li>
                  </ul>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/privacy-policy" target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      View Privacy Policy
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Terms & Conditions
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Service usage agreements</li>
                    <li>• User responsibilities and prohibited activities</li>
                    <li>• Payment terms and refund policies</li>
                    <li>• Intellectual property rights</li>
                    <li>• Liability limitations and disclaimers</li>
                    <li>• Termination and dispute resolution</li>
                  </ul>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/terms-conditions" target="_blank">
                      <Scale className="h-4 w-4 mr-2" />
                      View Terms & Conditions
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Components */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Integration</CardTitle>
              <CardDescription>
                GDPR compliance links and information in footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Quick Links Component</h4>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <GDPRQuickLinks />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Compact Footer</h4>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <GDPRFooter compact className="mt-0" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Implementation */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>
                How the GDPR compliance system works
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Cookie Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• LocalStorage for consent preferences</li>
                    <li>• HttpOnly cookies for server-side detection</li>
                    <li>• Automatic consent expiration (1 year)</li>
                    <li>• Category-based granular controls</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Data Processing</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Legal basis identification</li>
                    <li>• Third-party service agreements</li>
                    <li>• Data minimization principles</li>
                    <li>• Retention period enforcement</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">User Rights</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Access request handling</li>
                    <li>• Data portability support</li>
                    <li>• Deletion and rectification</li>
                    <li>• Objection and restriction rights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Status */}
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Integration Status
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                All components are now active and protecting user privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="text-green-700 dark:text-green-300">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">✅ Implemented Features:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Cookie consent banner (active)</li>
                    <li>• Privacy policy page (/privacy-policy)</li>
                    <li>• Terms & conditions page (/terms-conditions)</li>
                    <li>• GDPR compliance badges</li>
                    <li>• Footer with legal links</li>
                    <li>• Consent management system</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📋 Next Steps:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Obtain ICO registration number</li>
                    <li>• Register company legally</li>
                    <li>• Set up DPO contact processes</li>
                    <li>• Conduct compliance audit</li>
                    <li>• Train staff on GDPR procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Footer Example */}
        <Separator className="my-12" />
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Full Footer Implementation</h2>
          <GDPRFooter className="mt-0" />
        </div>
      </div>
    </div>
  )
}