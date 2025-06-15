import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const AnimatedCounter = ({ 
  value, 
  suffix = "", 
  duration = 2, 
  delay = 0 
}: { 
  value: number; 
  suffix?: string; 
  duration?: number; 
  delay?: number; 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0;
        const end = value;
        const increment = end / (duration * 60); // 60fps
        
        const animate = () => {
          start += increment;
          if (start < end) {
            setCount(Math.floor(start));
            requestAnimationFrame(animate);
          } else {
            setCount(end);
          }
        };
        
        animate();
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, duration, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

const StatCard = ({ 
  value, 
  suffix = "", 
  label, 
  description, 
  delay = 0,
  gradient 
}: { 
  value: number; 
  suffix?: string; 
  label: string; 
  description: string; 
  delay?: number;
  gradient: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.8 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, type: "spring", stiffness: 100 }}
    className="group relative"
  >
    <div className="relative p-8 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 overflow-hidden">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.div
          className={`text-5xl sm:text-6xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent mb-3`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AnimatedCounter value={value} suffix={suffix} delay={delay} />
        </motion.div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
          {label}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Hover Effect Ring */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-indigo-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
    </div>
  </motion.div>
);

export const Stats = () => (
  <section className="relative py-24 overflow-hidden bg-black">
    <div className="container-custom relative z-10">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Trusted by{" "}
          <span className="text-blue-600 dark:text-blue-400">
            Educators
          </span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Join thousands of teachers and students who have transformed their marking experience
        </p>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          value={10} 
          suffix="+" 
          label="AI Models" 
          description="Advanced language models including GPT-4, Claude, and more"
          delay={0.1}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard 
          value={15} 
          suffix="+" 
          label="Subjects" 
          description="Comprehensive coverage across all major GCSE subjects"
          delay={0.2}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard 
          value={4} 
          label="Exam Boards" 
          description="Full support for AQA, Edexcel, OCR, and WJEC specifications"
          delay={0.3}
          gradient="from-orange-500 to-red-500"
        />
        <StatCard 
          value={10000} 
          suffix="+" 
          label="Papers Marked" 
          description="Thousands of essays graded with consistent accuracy"
          delay={0.4}
          gradient="from-purple-500 to-pink-500"
        />
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-200 dark:border-blue-700">
          <motion.div
            className="w-2 h-2 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Used by educators worldwide
          </span>
        </div>
      </motion.div>
    </div>
  </section>
); 