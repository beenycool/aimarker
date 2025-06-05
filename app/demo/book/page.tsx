import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ArrowLeft, 
  Calendar, 
  Clock,
  Users,
  CheckCircle,
  Sparkles,
  Video
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Book a Demo | AI GCSE Marker',
  description: 'Schedule a personalized demo of AI GCSE Marker with our education experts.',
};

const demoFeatures = [
  "Live demonstration of AI marking in action",
  "Personalized tour based on your needs", 
  "Q&A session with education experts",
  "Custom pricing and implementation plan",
  "Technical requirements discussion",
  "Integration planning and timeline"
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

export default function BookDemoPage() {
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
              <Button variant="outline" asChild>
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20">
            <Video className="w-4 h-4 mr-2" />
            Personalized Demo
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            See It in Action
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Schedule a personalized demo with our education experts and discover how 
            AI GCSE Marker can transform your marking workflow.
          </p>
        </div>
      </section>

      {/* Demo Form and Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Demo Form */}
            <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Book Your Demo</CardTitle>
                <CardDescription>
                  Choose a time that works for you and we'll send you a calendar invitation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="Sarah" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Johnson" className="bg-background/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" placeholder="sarah@school.edu" className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job title</Label>
                  <Input id="jobTitle" placeholder="Head of English" className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school">School/Institution</Label>
                  <Input id="school" placeholder="Westfield Academy" className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="students">Number of students</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50 students</SelectItem>
                      <SelectItem value="51-200">51-200 students</SelectItem>
                      <SelectItem value="201-500">201-500 students</SelectItem>
                      <SelectItem value="501-1000">501-1000 students</SelectItem>
                      <SelectItem value="1000+">1000+ students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred date</Label>
                    <Input id="date" type="date" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred time (GMT)</Label>
                    <Select>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interests">What are you most interested in? (Optional)</Label>
                  <Textarea 
                    id="interests" 
                    placeholder="E.g., marking speed, feedback quality, integration with existing systems..."
                    rows={3}
                    className="bg-background/50"
                  />
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-lg py-6">
                  <Calendar className="mr-2 w-5 h-5" />
                  Schedule Demo
                </Button>
                
                <div className="text-xs text-muted-foreground text-center">
                  By booking a demo, you agree to receive communication from our team.
                </div>
              </CardContent>
            </Card>

            {/* Demo Features */}
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-xl p-8">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">What You'll See</h3>
                      <p className="text-muted-foreground">A comprehensive 30-minute walkthrough</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {demoFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-xl p-8">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Demo Details</h3>
                      <p className="text-muted-foreground">Everything you need to know</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-muted-foreground text-sm">30 minutes</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Video className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">Format</div>
                        <div className="text-muted-foreground text-sm">Video call via Zoom or Teams</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">Attendees</div>
                        <div className="text-muted-foreground text-sm">You + our education expert</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/10 to-purple-600/10 p-8">
                <CardContent className="p-0 text-center">
                  <h3 className="text-lg font-bold mb-2">Prefer to try it yourself?</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Start your free trial and explore AI GCSE Marker at your own pace.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/auth/signup">Start Free Trial</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}