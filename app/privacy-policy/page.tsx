import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, Calendar, Mail, Phone, MapPin, FileText, Users, Lock, Eye, Database } from 'lucide-react'
import { GDPRBadge } from '@/components/gdpr/gdpr-badge'

export default function PrivacyPolicyPage() {
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
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4">
            GCSE AI Marker - Your Privacy, Our Priority
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last updated: {lastUpdated}
            </Badge>
            <GDPRBadge variant="full" />
          </div>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Welcome to GCSE AI Marker ("we," "our," or "us"). We are committed to protecting your 
                personal data and respecting your privacy rights. This Privacy Policy explains how we 
                collect, use, disclose, and safeguard your information when you use our AI-powered 
                GCSE exam marking service.
              </p>
              <p>
                This policy complies with the EU General Data Protection Regulation (GDPR), the UK GDPR, 
                and other applicable privacy laws. If you do not agree with the practices described in 
                this policy, please do not use our services.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Data Controller & Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Data Controller</h4>
                  <p className="text-sm text-muted-foreground">
                    GCSE AI Marker Ltd.<br />
                    Company Registration: [To be registered]<br />
                    ICO Registration: [To be obtained]
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>privacy@aimarker.tech</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>dpo@aimarker.tech (Data Protection Officer)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>United Kingdom</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Personal Information You Provide</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Account registration data (username, email address, password)</li>
                    <li>Profile information (name, school, year group)</li>
                    <li>Exam responses and submitted work for AI marking</li>
                    <li>Feedback and communications with our support team</li>
                    <li>Payment information (processed securely by third-party payment processors)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Information Automatically Collected</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage analytics (pages visited, features used, time spent)</li>
                    <li>Technical logs for security and performance monitoring</li>
                    <li>Cookies and similar tracking technologies (see our Cookie Policy)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. AI Processing Data</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Submitted exam answers and essays for AI analysis</li>
                    <li>Performance metrics and learning progress data</li>
                    <li>AI-generated feedback and scoring data</li>
                    <li>Anonymized data for AI model improvement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Provision (Legal Basis: Contract Performance)</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Provide AI-powered marking and feedback services</li>
                    <li>Process and analyze submitted exam responses</li>
                    <li>Generate personalized learning recommendations</li>
                    <li>Maintain your account and provide customer support</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Service Improvement (Legal Basis: Legitimate Interest)</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Analyze usage patterns to improve our AI algorithms</li>
                    <li>Enhance user experience and platform functionality</li>
                    <li>Conduct research and development for educational technology</li>
                    <li>Monitor and ensure platform security and performance</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Legal and Safety (Legal Basis: Legal Obligation & Legitimate Interest)</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Comply with applicable laws and regulations</li>
                    <li>Protect against fraud, abuse, and security threats</li>
                    <li>Respond to legal requests and prevent illegal activities</li>
                    <li>Enforce our Terms of Service and community guidelines</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Communications (Legal Basis: Consent & Legitimate Interest)</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Send service-related notifications and updates</li>
                    <li>Provide educational content and study resources (with consent)</li>
                    <li>Respond to your inquiries and support requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Data Sharing & Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium">
                We share your information only in the following circumstances:
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">AI Service Providers</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    We use third-party AI services to provide marking and feedback:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>OpenAI (ChatGPT, GPT models) - see OpenAI Privacy Policy</li>
                    <li>GitHub AI Models (including Grok-3) - see GitHub Privacy Statement</li>
                    <li>Google Gemini - see Google Privacy Policy</li>
                    <li>OpenRouter - see OpenRouter Privacy Policy</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Important:</strong> Your exam submissions are sent to these services for AI processing. 
                    We have data processing agreements in place and only share data necessary for service provision.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Essential Service Providers</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Cloud hosting providers (for data storage and processing)</li>
                    <li>Payment processors (for subscription and payment handling)</li>
                    <li>Analytics services (for usage statistics and performance monitoring)</li>
                    <li>Email and communication services</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Legal Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    We may disclose information when required by law, court order, or to protect 
                    our rights, users' safety, or the public interest.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Security & Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Security Measures</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Encryption in transit and at rest using industry-standard protocols</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure development practices and code reviews</li>
                  <li>Employee training on data protection and security</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Retention</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Account data: Retained while your account is active, plus 30 days after deletion</li>
                  <li>Exam submissions: Retained for up to 2 years for service improvement</li>
                  <li>Analytics data: Anonymized and retained for up to 3 years</li>
                  <li>Legal compliance data: Retained as required by applicable laws</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Your GDPR Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Under GDPR, you have the following rights regarding your personal data:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">Right of Access</h4>
                    <p className="text-xs text-muted-foreground">
                      Request copies of your personal data we hold
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">Right to Rectification</h4>
                    <p className="text-xs text-muted-foreground">
                      Correct inaccurate or incomplete personal data
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm">Right to Erasure</h4>
                    <p className="text-xs text-muted-foreground">
                      Request deletion of your personal data ("right to be forgotten")
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">Right to Restrict Processing</h4>
                    <p className="text-xs text-muted-foreground">
                      Limit how we process your personal data
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm">Right to Data Portability</h4>
                    <p className="text-xs text-muted-foreground">
                      Transfer your data to another service provider
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm">Right to Object</h4>
                    <p className="text-xs text-muted-foreground">
                      Object to certain types of data processing
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm mb-2">
                  <strong>How to Exercise Your Rights:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Email us at: <a href="mailto:privacy@aimarker.tech" className="text-primary hover:underline">privacy@aimarker.tech</a></li>
                  <li>Use the account settings page for data access and deletion requests</li>
                  <li>Contact our Data Protection Officer at: <a href="mailto:dpo@aimarker.tech" className="text-primary hover:underline">dpo@aimarker.tech</a></li>
                </ul>
                
                <p className="text-xs text-muted-foreground mt-3">
                  We will respond to your request within 30 days. You also have the right to lodge 
                  a complaint with the Information Commissioner's Office (ICO) if you believe we have 
                  not handled your data properly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Some of our service providers are located outside the European Economic Area (EEA). 
                When we transfer your data internationally, we ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Adequacy decisions for countries with sufficient data protection</li>
                <li>Additional technical and organizational measures for enhanced protection</li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy periodically to reflect changes in our practices, 
                technology, legal requirements, or other factors. We will notify you of any material 
                changes by:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Posting the updated policy on our website with a new "Last updated" date</li>
                <li>Sending email notifications for significant changes</li>
                <li>Displaying a prominent notice on our platform</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                Your continued use of our services after the effective date constitutes acceptance 
                of the updated Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              For questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@aimarker.tech" className="text-primary hover:underline">
                privacy@aimarker.tech
              </a>
            </p>
            <GDPRBadge variant="full" />
          </div>
        </div>
      </div>
    </div>
  )
} 