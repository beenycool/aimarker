import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Calendar, 
  Scale, 
  AlertTriangle, 
  Shield, 
  Users, 
  CreditCard, 
  Ban, 
  Gavel,
  Mail,
  BookOpen
} from 'lucide-react'
import { GDPRBadge } from '@/components/gdpr/gdpr-badge'

export default function TermsConditionsPage() {
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4">
            GCSE AI Marker - Service Agreement & Usage Terms
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last updated: {lastUpdated}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Governed by UK Law
            </Badge>
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Legal Notice</AlertTitle>
          <AlertDescription>
            By accessing and using GCSE AI Marker, you agree to be bound by these Terms & Conditions. 
            Please read them carefully before using our services. If you do not agree with any part of 
            these terms, you must not use our services.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These Terms and Conditions ("Terms", "Agreement") govern your use of the GCSE AI Marker 
                service ("Service") operated by GCSE AI Marker Ltd. ("us", "we", or "our").
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>By creating an account or using our Service, you agree to these Terms</li>
                <li>You must be at least 13 years old to use our Service</li>
                <li>If you are under 18, you confirm you have parental or guardian consent</li>
                <li>We may update these Terms at any time with reasonable notice</li>
                <li>Continued use after changes constitutes acceptance of new Terms</li>
              </ul>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                2. Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                GCSE AI Marker provides AI-powered marking and feedback services for GCSE-level educational content:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Automated marking of exam papers, essays, and homework</li>
                <li>AI-generated feedback and improvement suggestions</li>
                <li>Performance tracking and learning analytics</li>
                <li>Study resources and educational content</li>
                <li>Progress monitoring and reporting tools</li>
              </ul>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Educational Tool Only</AlertTitle>
                <AlertDescription className="text-sm">
                  Our Service is designed as a learning aid and practice tool. AI-generated marks and 
                  feedback should not be considered as official academic assessments. Always consult 
                  with qualified teachers and educational institutions for formal evaluations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* User Accounts and Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                3. User Accounts & Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Account Registration</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>You must provide accurate, current, and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You must notify us immediately of any unauthorized access</li>
                  <li>One account per person; sharing accounts is prohibited</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Acceptable Use</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Use the Service only for legitimate educational purposes</li>
                  <li>Submit only your own original work or properly attributed content</li>
                  <li>Respect intellectual property rights of others</li>
                  <li>Do not attempt to reverse engineer or exploit our AI systems</li>
                  <li>Do not use the Service to cheat on actual exams or assessments</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Prohibited Activities</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Uploading malicious code, viruses, or harmful content</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Using automated tools to abuse or overload our Service</li>
                  <li>Sharing inappropriate, offensive, or illegal content</li>
                  <li>Impersonating others or providing false information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                4. Payment Terms & Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Subscription Plans</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Various subscription tiers available with different features and limits</li>
                  <li>Pricing displayed in GBP and includes applicable VAT</li>
                  <li>Free tier available with limited functionality</li>
                  <li>Educational discounts may be available for schools and institutions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Payment Processing</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Payments processed securely through third-party payment providers</li>
                  <li>We do not store complete payment card details</li>
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>Payment failures may result in service suspension</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Refunds & Cancellation</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>14-day cooling-off period for new subscriptions (UK Consumer Rights)</li>
                  <li>Pro-rata refunds may be available in exceptional circumstances</li>
                  <li>Cancel anytime through account settings</li>
                  <li>Cancellation takes effect at the end of current billing period</li>
                  <li>No refunds for partially used periods unless required by law</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                5. Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Our Rights</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>We own all rights to the Service, including software, algorithms, and content</li>
                  <li>Our trademarks, logos, and branding remain our exclusive property</li>
                  <li>AI models and training data are proprietary and confidential</li>
                  <li>User feedback and suggestions may be used to improve our Service</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Your Rights</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>You retain ownership of content you submit to our Service</li>
                  <li>You grant us license to process and analyze your submissions</li>
                  <li>You can download or delete your content at any time</li>
                  <li>We may use anonymized data for research and improvement purposes</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Copyright Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  We respect copyright and intellectual property rights. If you believe content on our 
                  Service infringes your rights, please contact us with details for prompt investigation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers and Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                6. Disclaimers & Limitations of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-800 dark:text-orange-200">Important Disclaimers</AlertTitle>
                <AlertDescription className="text-orange-700 dark:text-orange-300 text-sm">
                  Please read these limitations carefully as they affect your legal rights.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-2">Service Availability</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Service provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee 100% uptime or uninterrupted access</li>
                  <li>AI accuracy may vary and should not be solely relied upon</li>
                  <li>We reserve the right to modify or discontinue features</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Educational Limitations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>AI feedback is supplementary to, not a replacement for, human teaching</li>
                  <li>Results may not reflect official exam board standards</li>
                  <li>Individual learning outcomes cannot be guaranteed</li>
                  <li>Users should verify AI-generated content with qualified educators</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Liability Limitations</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  To the maximum extent permitted by law:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Our liability is limited to the amount paid for the Service in the last 12 months</li>
                  <li>We are not liable for indirect, consequential, or special damages</li>
                  <li>We are not responsible for third-party service failures</li>
                  <li>These limitations do not affect statutory consumer rights</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                7. Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Termination by You</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>You may delete your account at any time through account settings</li>
                  <li>Cancelling subscription does not automatically delete your account</li>
                  <li>Data deletion follows our Privacy Policy and data retention schedule</li>
                  <li>Some data may be retained for legal compliance purposes</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Termination by Us</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>We may suspend or terminate accounts for Terms violations</li>
                  <li>Immediate termination for serious breaches (fraud, illegal activities)</li>
                  <li>Notice will be provided except where prohibited by law</li>
                  <li>Upon termination, your license to use the Service ends immediately</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Effect of Termination</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Access to the Service ceases immediately</li>
                  <li>User content may be deleted according to our data retention policy</li>
                  <li>Outstanding payments remain due</li>
                  <li>Provisions that should survive termination remain in effect</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                8. Governing Law & Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Applicable Law</h4>
                <p className="text-sm text-muted-foreground">
                  These Terms are governed by and construed in accordance with the laws of England and Wales. 
                  Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Consumer Rights</h4>
                <p className="text-sm text-muted-foreground">
                  If you are a consumer, nothing in these Terms affects your statutory rights under UK consumer 
                  protection laws. You may also have rights under the laws of your country of residence.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Dispute Resolution</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>We encourage resolving disputes through direct communication first</li>
                  <li>Contact our support team for assistance with any issues</li>
                  <li>Online Dispute Resolution platform may be available for EU consumers</li>
                  <li>Alternative dispute resolution procedures may be pursued before court action</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact and Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                9. Contact Information & Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Contact Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>GCSE AI Marker Ltd.</strong></p>
                  <p>Email: <a href="mailto:support@aimarker.tech" className="text-primary hover:underline">support@aimarker.tech</a></p>
                  <p>Legal: <a href="mailto:legal@aimarker.tech" className="text-primary hover:underline">legal@aimarker.tech</a></p>
                  <p>Address: United Kingdom</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Updates to Terms</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>We may update these Terms to reflect legal or service changes</li>
                  <li>Material changes will be communicated through email or platform notices</li>
                  <li>Updated Terms take effect 30 days after notification (unless longer required)</li>
                  <li>Continued use after effective date constitutes acceptance</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Severability</h4>
                <p className="text-sm text-muted-foreground">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions 
                  will continue in full force and effect.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8 border-t">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Thank you for using GCSE AI Marker. These Terms & Conditions help ensure a safe and 
                productive learning environment for all users.
              </p>
              
              <div className="flex justify-center gap-4 flex-wrap">
                <Button variant="outline" size="sm" asChild>
                  <a href="/privacy-policy">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:legal@aimarker.tech">
                    <Mail className="h-4 w-4 mr-2" />
                    Legal Contact
                  </a>
                </Button>
              </div>

              <GDPRBadge variant="full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}