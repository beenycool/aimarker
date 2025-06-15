import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Users, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing | GCSE AI Marker',
  description: 'Choose the perfect plan for your AI-powered GCSE marking needs. From individual teachers to educational institutions.',
  keywords: 'AI marking pricing, GCSE marking plans, education software pricing, teacher subscription',
};

const pricingPlans = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Perfect for trying out the AI marker",
    icon: <Star className="h-6 w-6" />,
    features: [
      "10 essays per month",
      "Basic AI models",
      "Standard feedback",
      "All GCSE subjects",
      "Email support"
    ],
    limitations: [
      "No priority support",
      "Limited to basic models",
      "No bulk processing"
    ],
    popular: false,
    cta: "Start Free",
    ctaVariant: "outline" as const
  },
  {
    name: "Teacher",
    price: "£2.99",
    period: "per month",
    description: "Ideal for individual teachers",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "200 essays per month",
      "Premium AI models (O3, Grok-3)",
      "Detailed feedback & suggestions",
      "Bulk processing (up to 100)",
      "Grade boundaries",
      "Priority email support",
      "Export to PDF/CSV",
      "Custom marking schemes"
    ],
    limitations: [],
    popular: true,
    cta: "Start Teacher Plan",
    ctaVariant: "default" as const
  },
  {
    name: "School",
    price: "£9.99",
    period: "per month",
    description: "Perfect for small to medium schools",
    icon: <Users className="h-6 w-6" />,
    features: [
      "1000 essays per month",
      "All premium AI models",
      "Advanced analytics",
      "Unlimited bulk processing",
      "Multi-user access (up to 20)",
      "Custom grade boundaries",
      "Phone & email support",
      "Advanced reporting",
      "Integration support"
    ],
    limitations: [],
    popular: false,
    cta: "Start School Plan",
    ctaVariant: "outline" as const
  },
  {
    name: "Enterprise",
    price: "£19.99",
    period: "per month",
    description: "For large institutions and MATs",
    icon: <Crown className="h-6 w-6" />,
    features: [
      "Unlimited essays",
      "Custom AI model training",
      "White-label solution",
      "Unlimited users",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "On-site training",
      "SLA guarantee"
    ],
    limitations: [],
    popular: false,
    cta: "Get Enterprise",
    ctaVariant: "outline" as const
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your AI-powered GCSE marking needs. 
              Start free, upgrade when you're ready.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                No setup fees
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                30-day money back
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`p-3 rounded-lg ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period !== "contact us" && (
                        <span className="text-muted-foreground">/{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full mt-6" 
                      variant={plan.ctaVariant}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about our pricing and plans
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Can I change my plan at any time?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
                },
                {
                  question: "What happens if I exceed my monthly essay limit?",
                  answer: "We'll send you a notification when you're approaching your limit. You can either upgrade your plan or purchase additional essays at £0.10 per essay."
                },
                {
                  question: "Do you offer discounts for annual billing?",
                  answer: "Yes! Save 20% when you choose annual billing on any paid plan. Contact us for more information about annual pricing."
                },
                {
                  question: "Is there a free trial for paid plans?",
                  answer: "All paid plans come with a 14-day free trial. No credit card required for the free plan, and you can cancel anytime during the trial period."
                },
                {
                  question: "What AI models are included?",
                  answer: "Free plan includes access to basic models. Paid plans include premium models like GPT-4, Claude, and specialized education models for more accurate marking."
                },
                {
                  question: "Can I get a refund if I'm not satisfied?",
                  answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not completely satisfied, we'll refund your payment in full."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Marking?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of teachers who are already saving time and improving their marking with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
      
    </div >
  );
} 