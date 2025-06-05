import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Clock,
  MapPin,
  Phone,
  Sparkles,
  Send
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | AI GCSE Marker',
  description: 'Get in touch with our team. We're here to help you transform your marking experience.',
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get detailed help via email",
    contact: "support@aigcsemarker.com",
    time: "Response within 24 hours"
  },
  {
    icon: MessageSquare,
    title: "Live Chat", 
    description: "Chat with our support team",
    contact: "Available on website",
    time: "Monday - Friday, 9AM-6PM GMT"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our experts",
    contact: "+44 20 1234 5678",
    time: "Monday - Friday, 9AM-5PM GMT"
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI GCSE Marker
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
                <span>Back to home</span>
              </Link>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            We're Here to Help
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Have questions about AI GCSE Marker? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="border-0 shadow-xl bg-card/80 backdrop-blur-xl text-center p-6 hover:shadow-2xl transition-all duration-300 group hover:scale-105 transform">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                  <p className="text-muted-foreground mb-3">{method.description}</p>
                  <div className="font-medium text-primary mb-2">{method.contact}</div>
                  <div className="text-sm text-muted-foreground">{method.time}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" className="bg-background/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@school.edu" className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school">School/Institution</Label>
                  <Input id="school" placeholder="Westfield Academy" className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Demo request, pricing question, etc." className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your needs..."
                    rows={5}
                    className="bg-background/50"
                  />
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-lg py-6">
                  <Send className="mr-2 w-5 h-5" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Company Info */}
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-xl p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-6">AI GCSE Marker Ltd.</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <div className="font-medium">London Office</div>
                        <div className="text-muted-foreground">
                          123 Education Street<br />
                          London, UK<br />
                          EC1A 1BB
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">Business Hours</div>
                        <div className="text-muted-foreground">Monday - Friday, 9AM - 6PM GMT</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-xl p-8">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">How accurate is the AI marking?</div>
                      <div className="text-muted-foreground">Our AI achieves 98.7% accuracy, matching experienced teacher standards.</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Is there a free trial?</div>
                      <div className="text-muted-foreground">Yes! We offer a 14-day free trial with no credit card required.</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Can I integrate with existing systems?</div>
                      <div className="text-muted-foreground">Yes, we offer API access and custom integrations for schools.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Don't wait - start your free trial today and experience the future of essay marking.
          </p>
          <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600" asChild>
            <Link href="/auth/signup">Start Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}