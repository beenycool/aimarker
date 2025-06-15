import { FileText, Settings, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorksCard = ({ 
  step, 
  title, 
  description, 
  icon: Icon, 
  delay = 0,
  isLast = false 
}: { 
  step: string; 
  title: string; 
  description: string; 
  icon: any;
  delay?: number;
  isLast?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="relative group"
  >
    {/* Connecting Line - Hidden on mobile for simplicity */}
    {!isLast && (
      <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300/30 via-indigo-300/30 to-blue-300/30 z-0" />
    )}
    
    <div className="relative z-10 flex flex-col items-center text-center">
      {/* Step Number Circle */}
      <motion.div
        className="relative mb-4 sm:mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-0.5 shadow-xl">
          <div className="w-full h-full bg-gray-900 rounded-3xl flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold text-blue-400">
              {step}
            </span>
          </div>
        </div>
        
        {/* Icon Overlay */}
        <motion.div
          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </motion.div>
      </motion.div>
      
      {/* Content Card */}
      <motion.div
        className="p-4 sm:p-6 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 max-w-sm"
        whileHover={{ y: -3 }}
      >
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-400 transition-all duration-300">
          {title}
        </h3>
        <p className="text-white/70 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
        
        {/* Arrow Indicator - Simplified for mobile */}
        {!isLast && (
          <motion.div
            className="md:hidden mt-4 sm:mt-6 flex justify-center"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 rotate-90" />
          </motion.div>
        )}
      </motion.div>
    </div>
  </motion.div>
);

export const HowItWorks = () => (
  <section className="relative py-16 sm:py-24 overflow-hidden bg-black">
    <div className="container-custom relative z-10 px-4 sm:px-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 sm:mb-20"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
          How It{" "}
          <span className="text-blue-400">
            Works
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
          Get AI-powered feedback on GCSE papers in three simple steps. 
          Our streamlined process makes marking faster and more accurate than ever.
        </p>
      </motion.div>
      
      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-8">
        <HowItWorksCard
          step="1"
          title="Enter Question & Answer"
          description="Paste your question and student's answer, or upload images. You can also use one of our carefully crafted sample questions to get started quickly."
          icon={FileText}
          delay={0.1}
        />
        <HowItWorksCard
          step="2"
          title="Choose Settings"
          description="Select subject, exam board, question type, and AI model for personalized marking. Our smart detection can help auto-configure these settings."
          icon={Settings}
          delay={0.2}
        />
        <HowItWorksCard
          step="3"
          title="Get AI Feedback"
          description="Receive detailed feedback, accurate marks, grade boundaries, and personalized suggestions for improvement in seconds."
          icon={Sparkles}
          delay={0.3}
          isLast={true}
        />
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 sm:mt-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-700/40">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
          <span className="text-white/80 font-medium text-sm sm:text-base">
            Transform your marking workflow today
          </span>
        </div>
      </motion.div>
    </div>
  </section>
); 