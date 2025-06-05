import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ArrowLeft, 
  Target, 
  Heart, 
  Users, 
  Award,
  Sparkles,
  ArrowRight,
  Mail,
  Linkedin
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | AI GCSE Marker',
  description: 'Learn about our mission to revolutionize education through AI-powered marking technology.',
};

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former Head of AI at Cambridge Assessment, PhD in Machine Learning from Oxford",
    initials: "SC"
  },
  {
    name: "Prof. Michael Roberts",
    role: "CTO & Co-Founder", 
    bio: "20+ years in EdTech, Former Principal Engineer at Pearson Education",
    initials: "MR"
  },
  {
    name: "Emma Thompson",
    role: "Head of Education",
    bio: "15 years teaching GCSE English, Former Deputy Head at Westminster Academy",
    initials: "ET"
  },
  {
    name: "Dr. James Liu",
    role: "Lead AI Researcher",
    bio: "PhD in Natural Language Processing, Former Research Scientist at DeepMind",
    initials: "JL"
  }
];

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "We strive for the highest accuracy in every assessment, ensuring fair and reliable marking."
  },
  {
    icon: Heart,
    title: "Empathy", 
    description: "Understanding the challenges teachers face drives everything we build and design."
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work closely with educators to ensure our technology truly serves their needs."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We're committed to delivering the most advanced and reliable marking technology."
  }
];

export default function AboutPage() {
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
            Our Story
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            Transforming Education
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            We're on a mission to revolutionize how essays are marked, giving teachers back their time 
            while providing students with the detailed feedback they need to excel.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Every teacher deserves to spend their time inspiring students, not buried under stacks of essays. 
                That's why we created AI GCSE Marker - to give educators the tools they need to provide 
                exceptional feedback instantly.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Founded by former educators and AI researchers, we understand both the challenges of teaching 
                and the potential of artificial intelligence. Our technology doesn't replace teachers - 
                it empowers them to be even more effective.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600" asChild>
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <Card className="relative border-0 shadow-2xl bg-card/80 backdrop-blur-xl p-8">
                <CardContent className="p-0">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">Founded in 2024</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">Team of 12+ Experts</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">AI Research Led</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">Teacher-First Approach</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-xl bg-card/80 backdrop-blur-xl text-center p-6 hover:shadow-2xl transition-all duration-300 group hover:scale-105 transform">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Passionate educators and technologists working together to transform education
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-xl bg-card/80 backdrop-blur-xl text-center p-6 hover:shadow-2xl transition-all duration-300 group hover:scale-105 transform">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                  <div className="text-primary font-medium mb-3">{member.role}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Join Our Mission
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Ready to be part of the education revolution? Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600" asChild>
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}