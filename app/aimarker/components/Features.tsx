import { Brain, BookOpen, Trophy, FileStack, Zap, Shield, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0,
  gradient 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  delay?: number;
  gradient: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative"
  >
    <div className="relative h-full p-6 sm:p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
      {/* Gradient Background - Simplified for mobile */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
      
      {/* Icon Container */}
      <motion.div
        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${gradient} p-0.5 mb-4 sm:mb-6`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="w-full h-full bg-gray-900 rounded-2xl flex items-center justify-center">
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-400 transition-all duration-300">
          {title}
        </h3>
        <p className="text-white/70 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Hover Effect - Simplified */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-blue-500/0 group-hover:from-blue-500/3 group-hover:via-indigo-500/3 group-hover:to-blue-500/3 transition-all duration-300 rounded-3xl" />
    </div>
  </motion.div>
);

export const Features = () => (
  <section className="relative py-16 sm:py-24 overflow-hidden bg-black">
    <div className="container-custom relative z-10 px-4 sm:px-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
          Why Choose{" "}
          <span className="text-blue-400">
            AI GCSE Marker
          </span>
          ?
        </h2>
        <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
          Experience the future of education technology with our advanced AI-powered marking system
        </p>
      </motion.div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <FeatureCard
          icon={Brain}
          title="AI-Powered Accuracy"
          description="Advanced neural networks provide consistent, detailed feedback with human-level understanding and precision."
          delay={0.1}
          gradient="from-blue-500 to-cyan-500"
        />
        <FeatureCard
          icon={BookOpen}
          title="Multiple Exam Boards"
          description="Comprehensive support for AQA, Edexcel, OCR, and WJEC specifications with tailored marking criteria."
          delay={0.2}
          gradient="from-green-500 to-emerald-500"
        />
        <FeatureCard
          icon={Trophy}
          title="Grade Boundaries"
          description="Accurate GCSE grading with customizable boundaries that reflect real exam standards and expectations."
          delay={0.3}
          gradient="from-yellow-500 to-orange-500"
        />
        <FeatureCard
          icon={FileStack}
          title="Bulk Processing"
          description="Mark multiple papers simultaneously with intelligent batch processing for maximum efficiency."
          delay={0.4}
          gradient="from-purple-500 to-pink-500"
        />
      </div>
      
      {/* Additional Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-700/40">
          <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0" />
          <span className="text-white text-xs sm:text-sm font-medium">Lightning Fast</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-700/40">
          <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
          <span className="text-white text-xs sm:text-sm font-medium">Secure & Private</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-700/40">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
          <span className="text-white text-xs sm:text-sm font-medium">24/7 Available</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-700/40">
          <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 flex-shrink-0" />
          <span className="text-white text-xs sm:text-sm font-medium">Precision Focused</span>
        </div>
      </motion.div>
    </div>
  </section>
); 
 