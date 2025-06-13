import React from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { CheckCircle, Zap, Users, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import { 
  ScrollReveal, 
  MotionDiv, 
  MotionH1, 
  MotionP,
  AnimatedCounter,
  TypingAnimation,
  FloatingElement,
  MagneticButton,
  Parallax,
  staggerContainer,
  fadeInUp
} from './motion-components';
import { Separator } from './separator';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "AI-Powered Accuracy",
      description: "Advanced AI models provide consistent, detailed feedback"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Multiple Exam Boards",
      description: "Support for AQA, Edexcel, OCR, and WJEC specifications"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Grade Boundaries",
      description: "Accurate GCSE grading with customizable boundaries"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Bulk Processing",
      description: "Mark multiple papers simultaneously with batch processing"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Animated Background */}
      <Parallax offset={30} className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      </Parallax>
      
      {/* Floating Elements */}
      <FloatingElement duration={4} yOffset={15} className="absolute top-20 left-10 opacity-50">
        <div className="w-4 h-4 bg-primary/20 rounded-full blur-sm" />
      </FloatingElement>
      <FloatingElement duration={5} yOffset={20} className="absolute top-32 right-20 opacity-30">
        <div className="w-6 h-6 bg-primary/30 rounded-full blur-sm" />
      </FloatingElement>
      
      <div className="relative container mx-auto px-4 py-16 sm:py-24">
        <MotionDiv 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center space-y-8"
        >
          {/* Badge with animation */}
          <ScrollReveal animation="fadeInDown" delay={0.2}>
            <Badge variant="secondary" className="text-sm font-medium relative overflow-hidden">
              <MotionDiv
                animate={{ x: [-100, 100] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <Sparkles className="w-4 h-4 mr-2" />
              Version 2.2.0 - Now with Advanced AI Models
            </Badge>
          </ScrollReveal>
          
          {/* Main heading with typing effect */}
          <MotionDiv variants={fadeInUp}>
            <MotionH1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              <TypingAnimation 
                text="AI GCSE Marker" 
                duration={1.5}
                delay={0.5}
              />
            </MotionH1>
          </MotionDiv>
          
          {/* Subtitle */}
          <ScrollReveal animation="fadeInUp" delay={0.8}>
            <MotionP className="text-xl sm:text-2xl text-muted-foreground font-medium">
              Intelligent Essay Grading & Feedback
            </MotionP>
          </ScrollReveal>
          
          {/* Description */}
          <ScrollReveal animation="fadeInUp" delay={1.0}>
            <MotionP className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Transform your GCSE marking with AI-powered accuracy. Get detailed feedback, 
              consistent grading, and save hours of marking time.
            </MotionP>
          </ScrollReveal>

          {/* Action buttons with magnetic effect */}
          <ScrollReveal animation="fadeInUp" delay={1.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MagneticButton>
                <Button 
                  onClick={onGetStarted}
                  size="lg" 
                  className="text-lg px-8 py-3 h-auto font-semibold relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    Start Marking Now
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                  <MotionDiv
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </MagneticButton>
              
              <MagneticButton>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-3 h-auto hover:bg-muted/50 transition-all duration-300"
                >
                  View Examples
                </Button>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </MotionDiv>

        <div className="mt-20">
          <ScrollReveal animation="fadeInUp" delay={0.2}>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              Why Choose AI GCSE Marker?
            </h2>
          </ScrollReveal>
          
          <MotionDiv
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <MotionDiv
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group"
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-6 text-center space-y-4">
                    <MotionDiv
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:text-primary/90"
                    >
                      {feature.icon}
                    </MotionDiv>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>

        {/* Statistics Section */}
        <ScrollReveal animation="fadeInUp" delay={0.4}>
          <div className="mt-20 bg-muted/30 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <MotionDiv className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Trusted by Educators Worldwide</h3>
              <p className="text-muted-foreground">Join thousands of teachers saving time with AI-powered marking</p>
            </MotionDiv>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: 10000, suffix: "+", label: "Essays Marked" },
                { number: 500, suffix: "+", label: "Teachers" },
                { number: 95, suffix: "%", label: "Accuracy Rate" },
                { number: 80, suffix: "%", label: "Time Saved" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    <AnimatedCounter 
                      from={0} 
                      to={stat.number} 
                      suffix={stat.suffix}
                      duration={2}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}; 