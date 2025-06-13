import React from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { SampleQuestions } from '@/components/ui/sample-questions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, BookOpen, Zap, TrendingUp, Users, Clock } from 'lucide-react';
import { 
  ScrollReveal, 
  MotionDiv, 
  MagneticButton,
  staggerContainer,
  fadeInUp,
  AnimatedCounter,
  FloatingElement
} from '@/components/ui/motion-components';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  showWelcome: boolean;
  onGetStarted: () => void;
  onUseSample: (sample: any) => void;
}

export const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({
  children,
  showWelcome,
  onGetStarted,
  onUseSample
}) => {
  if (!showWelcome) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onGetStarted={onGetStarted} />
      
      {/* How It Works Section */}
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        {/* Floating background elements */}
        <FloatingElement duration={6} yOffset={25} className="absolute top-10 left-10 opacity-20">
          <div className="w-8 h-8 bg-primary/30 rounded-full blur-sm" />
        </FloatingElement>
        <FloatingElement duration={8} yOffset={30} className="absolute bottom-20 right-20 opacity-30">
          <div className="w-6 h-6 bg-primary/40 rounded-full blur-sm" />
        </FloatingElement>
        
        <div className="container mx-auto px-4 relative">
          <ScrollReveal animation="fadeInUp" delay={0.2}>
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get AI-powered feedback on GCSE papers in three simple steps
              </p>
            </div>
          </ScrollReveal>
          
          <MotionDiv
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                step: 1,
                title: "Enter Question & Answer",
                description: "Paste your question and student's answer, or use one of our sample questions"
              },
              {
                step: 2,
                title: "Choose Settings", 
                description: "Select subject, exam board, and AI model for personalized marking"
              },
              {
                step: 3,
                title: "Get AI Feedback",
                description: "Receive detailed feedback, marks, and suggestions for improvement"
              }
            ].map((item, index) => (
              <MotionDiv
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="text-center space-y-4 group"
              >
                <MotionDiv
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl font-bold shadow-lg group-hover:shadow-xl"
                >
                  {item.step}
                </MotionDiv>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {item.description}
                </p>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* Sample Questions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SampleQuestions onUseSample={onUseSample} />
        </div>
      </section>

      {/* CTA Section */}
      <ScrollReveal animation="fadeInUp" delay={0.2}>
        <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5 relative overflow-hidden">
          <FloatingElement duration={5} yOffset={20} className="absolute top-1/2 left-1/4 opacity-30">
            <div className="w-4 h-4 bg-primary/20 rounded-full blur-sm" />
          </FloatingElement>
          
          <div className="container mx-auto px-4 text-center space-y-6 relative">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold">Ready to Start Marking?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Experience the future of GCSE marking with our AI-powered tool
              </p>
            </MotionDiv>
            
            <MagneticButton>
              <Button 
                onClick={onGetStarted} 
                size="lg" 
                className="text-lg px-8 py-3 h-auto relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  <Zap className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Start Marking Now
                </span>
                <MotionDiv
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              </Button>
            </MagneticButton>
          </div>
        </section>
      </ScrollReveal>

      {/* Stats Section */}
      <ScrollReveal animation="fadeInUp" delay={0.4}>
        <section className="py-12 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <MotionDiv
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {[
                { number: 10, suffix: "+", label: "AI Models" },
                { number: 7, suffix: "", label: "Subjects" },
                { number: 4, suffix: "", label: "Exam Boards" },
                { number: 100, suffix: "k+", label: "Papers to Mark" }
              ].map((stat, index) => (
                <MotionDiv
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className="space-y-2 group"
                >
                  <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">
                    <AnimatedCounter 
                      from={0} 
                      to={stat.number} 
                      suffix={stat.suffix}
                      duration={2}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {stat.label}
                  </div>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}; 