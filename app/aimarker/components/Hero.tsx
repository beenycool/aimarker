import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Sparkles, Stars, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  handleGetStarted: () => void;
}

export const Hero = ({ handleGetStarted }: HeroProps) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Clean Black Background like Apple */}
    <div className="absolute inset-0 bg-black">
      {/* Very Subtle Floating Orbs for Depth - Reduced for mobile performance */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl hidden sm:block"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/2 rounded-full blur-3xl hidden sm:block"
        animate={{
          scale: [1.05, 1, 1.05],
          opacity: [0.1, 0.12, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </div>

    <div className="container-custom text-center relative z-10 px-4 sm:px-6">
      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="inline-block mb-6 sm:mb-8"
      >
        <Badge 
          variant="default" 
          className="glass-effect px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
        >
          <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          Version 2.2.0 - Now with Advanced AI Models
        </Badge>
      </motion.div>

      {/* Main Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="space-y-4 sm:space-y-6"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none">
          <span className="block text-white mb-2">
            AI-Powered
          </span>
          <span className="block text-blue-400 font-extrabold">
            GCSE Grading
          </span>
        </h1>
        
        <motion.p 
          className="mx-auto max-w-3xl text-lg sm:text-xl md:text-2xl text-white/80 leading-relaxed font-light px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Transform your marking experience with 
          <span className="font-semibold text-blue-400"> instant, intelligent feedback </span>
          that saves hours and enhances learning outcomes.
        </motion.p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4"
      >
        <Button 
          size="lg" 
          className="group relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-blue-600"
          onClick={handleGetStarted}
        >
          <span className="relative z-10 flex items-center justify-center">
            <Zap className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
            Start Marking Now
            <ChevronRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 text-white hover:bg-gray-900/80 hover:border-gray-600/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          onClick={() => document.getElementById('sample-questions')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Stars className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
          View Examples
        </Button>
      </motion.div>

      {/* Floating Elements - Hidden on mobile for performance */}
      <motion.div
        className="absolute top-20 right-10 text-3xl sm:text-4xl opacity-20 hidden md:block"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        📚
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 left-10 text-2xl sm:text-3xl opacity-20 hidden md:block"
        animate={{
          y: [0, -12, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      >
        ✨
      </motion.div>

      {/* Scroll Indicator - Simplified for mobile */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <motion.div className="w-1 h-2 sm:h-3 bg-white/50 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </div>
  </section>
); 