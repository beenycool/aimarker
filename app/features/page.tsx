import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ArrowLeft, 
  Rocket, 
  Award, 
  Shield, 
  Clock, 
  BarChart3, 
  Users, 
  FileText, 
  Target,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features | AI GCSE Marker',
  description: 'Discover all the powerful features that make AI GCSE Marker the most advanced essay marking system.',
};

const features = [
  {
    icon: Brain,
    title: "Advanced AI Engine",
    description: "Our neural networks are trained on thousands of GCSE papers, ensuring marking accuracy that rivals experienced teachers.",
    details: [
      "Natural language processing for context understanding",
      "Continuous learning from expert teacher feedback", 
      "Multi-criteria assessment capabilities",
      "Subject-specific marking expertise"
    ],
    gradient: "from-blue-500 to-purple-600"
  },
  {
    icon: Rocket,
    title: "Lightning Speed",
    description: "Get comprehensive feedback in seconds, not hours. Transform your marking workflow and reclaim your time.",
    details: [
      "Instant essay analysis and scoring",
      "Batch processing for multiple papers",
      "Real-time feedback generation",
      "Seamless integration with existing workflows"
    ],
    gradient: "from-purple-500 to-pink-600"
  },
  {
    icon: Award,
    title: "Detailed Feedback",
    description: "Rich, constructive feedback with specific improvement suggestions that help students excel.",
    details: [
      "Personalized improvement recommendations",
      "Strength and weakness identification",
      "Writing style analysis",
      "Grammar and structure suggestions"
    ],
    gradient: "from-pink-500 to-red-600"
  },
  {
    icon: Shield,
    title: "Consistent Standards",
    description: "Eliminate marking variance with AI that applies criteria consistently across all assessments.",
    details: [
      "Standardized marking criteria application",
      "Bias-free assessment process",
      "Reproducible marking results",
      "Quality assurance mechanisms"
    ],
    gradient: "from-red-500 to-orange-600"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive insights into student performance and progress over time.",
    details: [
      "Student progress tracking",
      "Class performance analytics",
      "Trend identification and reporting",
      "Exportable data and insights"
    ],
    gradient: "from-green-500 to-blue-600"
  },
  {
    icon: Users,
    title: "Collaboration Tools",
    description: "Work seamlessly with your teaching team and share insights effortlessly.",
    details: [
      "Team marking coordination",
      "Shared rubrics and criteria",
      "Collaborative feedback reviews",
      "Department-wide consistency"
    ],
    gradient: "from-cyan-500 to-purple-600"
  }
];

export default function FeaturesPage() {
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
            Revolutionary Technology
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            Superhuman Features
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Experience the next generation of educational technology with capabilities 
            that seemed impossible until now.
          </p>
          <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600" asChild>
            <Link href="/marker">
              Try Live Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 group hover:scale-[1.02] transform overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <CardHeader className="relative pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
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
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join the education revolution and discover how AI can transform your marking experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600" asChild>
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/demo/book">Book a Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}