"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import ScrollTextReveal, { ScrollFillText, ScrollCounter } from '@/components/scroll-text-reveal';
import Link from 'next/link';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Users, 
  Zap, 
  BookOpen, 
  TrendingUp, 
  Star,
  ArrowRight,
  Brain,
  FileText,
  BarChart3,
  Sparkles,
  Shield,
  Rocket,
  Award,
  MessageSquare,
  ChevronDown,
  Play,
  Globe,
  Calendar,
  Mail
} from 'lucide-react';

const springTransition = { type: "spring", stiffness: 400, damping: 30 };

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced neural networks trained on thousands of GCSE papers ensure marking accuracy that rivals experienced teachers.",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    icon: Rocket,
    title: "Lightning Fast Results",
    description: "Get comprehensive feedback in seconds, not hours. Transform your marking workflow and reclaim your time.",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    icon: Award,
    title: "Detailed Insights",
    description: "Rich, constructive feedback with specific improvement suggestions that help students excel in their studies.",
    gradient: "from-pink-500 to-red-600"
  },
  {
    icon: Shield,
    title: "Consistent Standards",
    description: "Eliminate marking variance with AI that applies criteria consistently across all assessments and students.",
    gradient: "from-red-500 to-orange-600"
  }
];

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Head of English Department",
    school: "Cambridge International School",
    content: "This AI marker has revolutionized our assessment process. The quality of feedback is extraordinary.",
    rating: 5,
    avatar: "SM"
  },
  {
    name: "James Rodriguez",
    role: "GCSE Coordinator", 
    school: "Westminster Academy",
    content: "Finally, marking that's both fast and fair. Our teachers can focus on what they do best - teaching.",
    rating: 5,
    avatar: "JR"
  },
  {
    name: "Prof. Emma Thompson",
    role: "Educational Technology Lead",
    school: "Royal Grammar School",
    content: "The level of analysis is remarkable. It catches nuances that even experienced markers might miss.",
    rating: 5,
    avatar: "ET"
  }
];

const pricingTiers = [
  {
    name: "Starter",
    price: "£29",
    period: "/month",
    description: "Perfect for individual teachers getting started",
    features: [
      "Up to 100 essays per month",
      "Basic AI feedback reports",
      "Email support within 24h",
      "Standard processing speed",
      "Core marking criteria"
    ],
    popular: false,
    cta: "Start Free Trial"
  },
  {
    name: "Professional",
    price: "£79", 
    period: "/month",
    description: "Ideal for departments and teaching teams",
    features: [
      "Up to 500 essays per month",
      "Advanced analytics dashboard",
      "Priority support within 4h",
      "Custom marking rubrics",
      "Progress tracking tools",
      "Team collaboration features"
    ],
    popular: true,
    cta: "Most Popular"
  },
  {
    name: "Enterprise",
    price: "£199",
    period: "/month", 
    description: "Complete solution for schools and institutions",
    features: [
      "Unlimited essay processing",
      "Advanced AI insights",
      "Dedicated account manager",
      "Custom integrations & API",
      "Staff training sessions",
      "White-label options",
      "Advanced security features"
    ],
    popular: false,
    cta: "Contact Sales"
  }
];

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, threshold: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, threshold: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, threshold: 0.2 });
  const pricingInView = useInView(pricingRef, { once: true, threshold: 0.2 });

  // Enhanced scroll transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.8, 0.6, 0.3]);

  // Scroll progress for navigation
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl"
          style={{
            x: useTransform(scrollYProgress, [0, 1], [mousePosition.x * 0.02, mousePosition.x * 0.02 + 200]),
            y: useTransform(scrollYProgress, [0, 1], [mousePosition.y * 0.02, mousePosition.y * 0.02 - 300]),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 0.8]),
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute right-0 top-1/3 w-64 h-64 bg-gradient-to-l from-pink-500/20 to-red-500/20 rounded-full blur-2xl"
          style={{
            x: useTransform(scrollYProgress, [0, 1], [mousePosition.x * -0.01, mousePosition.x * -0.01 - 150]),
            y: useTransform(scrollYProgress, [0, 1], [mousePosition.y * 0.01, mousePosition.y * 0.01 + 200]),
            rotate: useTransform(scrollYProgress, [0, 1], [0, 720]),
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute left-1/4 bottom-1/4 w-32 h-32 bg-gradient-to-tr from-cyan-500/15 to-blue-500/15 rounded-2xl blur-xl"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -400]),
            rotate: useTransform(scrollYProgress, [0, 1], [0, -360]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.3]),
          }}
          animate={{
            x: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-pink-600 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Premium Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-40 backdrop-blur-xl bg-background/70 border-b border-border/30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={springTransition}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={springTransition}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI GCSE Marker
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
              </Link>
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Ultra Premium */}
      <section ref={heroRef} className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center max-w-5xl mx-auto relative"
            variants={staggerContainer}
            initial="initial"
            animate={heroInView ? "animate" : "initial"}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Launching the Future of GCSE Assessment
              </Badge>
            </motion.div>
            
            <motion.div 
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8 leading-none"
              variants={fadeInUp}
            >
              <ScrollFillText 
                as="h1" 
                className="block"
                gradient="from-foreground via-primary to-purple-600"
              >
                Mark Essays
              </ScrollFillText>
              <ScrollFillText 
                as="span" 
                className="block"
                gradient="from-purple-600 via-pink-600 to-red-600"
              >
                Like Magic
              </ScrollFillText>
            </motion.div>
            
            <motion.div 
              className="text-xl md:text-2xl lg:text-3xl mb-12 leading-relaxed max-w-4xl mx-auto"
              variants={fadeInUp}
            >
              <ScrollTextReveal className="text-muted-foreground">
                Revolutionary AI technology that transforms GCSE essay marking into an instant, intelligent, and incredibly accurate experience.
              </ScrollTextReveal>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              variants={fadeInUp}
            >
              <Button 
                size="lg" 
                className="text-xl px-12 py-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 shadow-2xl shadow-primary/25 group transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/marker">
                  <Play className="mr-3 w-6 h-6" />
                  Try Live Demo
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-xl px-12 py-8 border-2 hover:bg-primary/5 backdrop-blur-sm"
                asChild
              >
                <Link href="/demo/book">
                  <Calendar className="mr-3 w-6 h-6" />
                  Book Demo
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              className="text-muted-foreground text-lg space-y-2"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Setup in 60 seconds</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Enhanced Floating Elements with Scroll */}
        <motion.div 
          className="absolute top-1/4 left-10 w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl blur-xl"
          style={{ 
            y: y1,
            rotate: rotate,
            scale: scale
          }}
          variants={floatingAnimation}
          animate="animate"
        />
        <motion.div 
          className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-bl from-pink-500/20 to-red-500/20 rounded-full blur-xl"
          style={{ 
            y: y2,
            rotate: useTransform(scrollYProgress, [0, 1], [0, -180]),
            opacity: opacity
          }}
          variants={floatingAnimation}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/2 w-16 h-16 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg"
          style={{ 
            y: y3,
            x: useTransform(scrollYProgress, [0, 1], [0, 100])
          }}
          variants={floatingAnimation}
          animate="animate"
          transition={{ delay: 4 }}
        />
      </section>

      {/* Features Section - Revolutionary Design */}
      <section ref={featuresRef} id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            variants={staggerContainer}
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
          >
            <motion.div variants={fadeInUp}>
              <ScrollFillText 
                as="h2" 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                gradient="from-foreground to-foreground/70"
              >
                Superhuman Capabilities
              </ScrollFillText>
            </motion.div>
            <motion.div 
              className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              <ScrollTextReveal className="text-muted-foreground">
                Experience the next generation of educational technology with features that seemed impossible until now.
              </ScrollTextReveal>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
            variants={staggerContainer}
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
          >
            {features.map((feature, index) => {
              const cardRef = useRef(null);
              const cardInView = useInView(cardRef, { once: false, amount: 0.3 });
              const { scrollYProgress: cardScrollProgress } = useScroll({
                target: cardRef,
                offset: ["start end", "end start"]
              });
              
              const cardY = useTransform(cardScrollProgress, [0, 1], [50, -50]);
              const cardRotate = useTransform(cardScrollProgress, [0, 1], [-2, 2]);
              
              return (
                <motion.div 
                  key={index} 
                  ref={cardRef}
                  variants={fadeInUp}
                  style={{ y: cardY, rotateX: cardRotate }}
                >
                  <Card className="h-full border-0 shadow-2xl shadow-black/5 hover:shadow-3xl hover:shadow-black/10 transition-all duration-500 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-xl overflow-hidden group hover:scale-[1.02] transform">
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: cardInView ? 0.05 : 0 }}
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <CardHeader className="relative pb-6 pt-8">
                      <motion.div 
                        className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: 10,
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <feature.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <CardTitle className="text-2xl lg:text-3xl font-bold text-center mb-4">
                        <ScrollTextReveal>{feature.title}</ScrollTextReveal>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <CardDescription className="text-center text-lg leading-relaxed text-muted-foreground mb-6">
                        <ScrollTextReveal>{feature.description}</ScrollTextReveal>
                      </CardDescription>
                      <div className="text-center">
                        <Button 
                          variant="ghost" 
                          className="group-hover:bg-primary/10 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Premium Social Proof */}
      <section ref={testimonialsRef} id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            className="text-center mb-20"
            variants={staggerContainer}
            initial="initial"
            animate={testimonialsInView ? "animate" : "initial"}
          >
            <motion.div variants={fadeInUp}>
              <ScrollFillText 
                as="h2" 
                className="text-5xl md:text-6xl font-bold mb-6"
                gradient="from-foreground to-foreground/70"
              >
                Trusted by Educators
              </ScrollFillText>
            </motion.div>
            <motion.div 
              className="text-xl md:text-2xl max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              <ScrollTextReveal className="text-muted-foreground">
                Join the early adopters who are already experiencing the future of education
              </ScrollTextReveal>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
            variants={staggerContainer}
            initial="initial"
            animate={testimonialsInView ? "animate" : "initial"}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-2xl bg-card/80 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 group hover:scale-105 transform">
                  <CardContent className="pt-8 pb-6">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-lg lg:text-xl mb-8 leading-relaxed font-medium">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground font-medium">{testimonial.role}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.school}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section - Ultra Modern */}
      <section ref={pricingRef} id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            variants={staggerContainer}
            initial="initial"
            animate={pricingInView ? "animate" : "initial"}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Investment in Excellence
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Choose the plan that transforms your teaching experience
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate={pricingInView ? "animate" : "initial"}
          >
            {pricingTiers.map((tier, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className={`relative h-full border-0 shadow-2xl bg-card/80 backdrop-blur-xl transition-all duration-500 group hover:shadow-3xl ${tier.popular ? 'ring-2 ring-primary shadow-primary/20 scale-105 lg:scale-110' : 'hover:scale-105'} transform`}>
                  {tier.popular && (
                    <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 text-sm font-bold shadow-lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4 pt-8">
                    <CardTitle className="text-2xl lg:text-3xl font-bold mb-2">{tier.name}</CardTitle>
                    <CardDescription className="text-base lg:text-lg mb-6 px-4">{tier.description}</CardDescription>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {tier.price}
                      </span>
                      <span className="text-muted-foreground ml-2 text-lg">{tier.period}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">per teacher</div>
                  </CardHeader>
                  <CardContent className="space-y-6 px-6 pb-8">
                    <ul className="space-y-4">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-base">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-8 py-6 text-lg font-semibold ${tier.popular ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg' : ''} transition-all duration-300 transform hover:scale-105`} 
                      variant={tier.popular ? "default" : "outline"}
                      asChild
                    >
                      {tier.name === "Enterprise" ? (
                        <Link href="/contact/sales">{tier.cta}</Link>
                      ) : (
                        <Link href="/auth/signup">{tier.cta}</Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <ScrollFillText 
              as="h2" 
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              gradient="from-foreground via-primary to-purple-600"
            >
              The Future is Now
            </ScrollFillText>
            <div className="text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto">
              <ScrollTextReveal className="text-muted-foreground">
                Don't just mark essays. Transform education. Join the AI revolution and experience the most advanced GCSE marking system ever created.
              </ScrollTextReveal>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button 
                size="lg" 
                className="text-xl px-12 py-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 shadow-2xl shadow-primary/30 group transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/marker">
                  <Rocket className="mr-3 w-6 h-6" />
                  Start Your Journey
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-xl px-12 py-8 border-2 hover:bg-primary/10 backdrop-blur-sm"
                asChild
              >
                <Link href="/demo/book">
                  <MessageSquare className="mr-3 w-6 h-6" />
                  Talk to Experts
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ultra Modern Footer */}
      <footer className="border-t border-border/30 bg-card/30 backdrop-blur-xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  AI GCSE Marker
                </span>
              </Link>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
                Revolutionary AI technology that transforms GCSE essay marking into an intelligent, 
                accurate, and lightning-fast experience.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="mailto:hello@aigcsemarker.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Link>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Product</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/marker" className="hover:text-foreground transition-colors">Live Demo</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/press" className="hover:text-foreground transition-colors">Press Kit</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">System Status</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground">
              <p>&copy; 2024 AI GCSE Marker. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-muted-foreground text-sm">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}