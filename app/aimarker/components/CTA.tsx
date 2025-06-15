import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CTAProps {
    handleGetStarted: () => void;
}

export const CTA = ({ handleGetStarted }: CTAProps) => (
    <section className="relative py-16 sm:py-24 overflow-hidden">
        {/* Clean Black Background like Apple */}
        <div className="absolute inset-0 bg-black">
            {/* Very Subtle Floating Orbs for Depth - Hidden on mobile for performance */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/2 rounded-full blur-3xl hidden sm:block"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
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
                    scale: [1.1, 1, 1.1],
                    opacity: [0.1, 0.12, 0.1],
                    x: [0, -30, 0],
                    y: [0, 15, 0],
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
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                {/* Main CTA Card */}
                <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 shadow-2xl overflow-hidden">
                    {/* Animated Background - Simplified for mobile */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/1 via-transparent to-white/1 hidden sm:block"
                        animate={{
                            x: ["-100%", "100%"],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/40 mb-6 sm:mb-8"
                        >
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                            <span className="text-white/90 font-medium text-xs sm:text-sm">
                                Ready to Transform Your Marking?
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                        >
                            Start Marking with
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                AI Precision
                            </span>
                        </motion.h2>
                        
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4"
                        >
                            Join thousands of educators who have revolutionized their marking process. 
                            Experience instant, accurate feedback that saves time and improves learning outcomes.
                        </motion.p>

                        {/* Features List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-10"
                        >
                            {[
                                "Instant Feedback",
                                "Multi-Model AI",
                                "Grade Boundaries",
                                "Bulk Processing"
                            ].map((feature, index) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/40"
                                >
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                                    <span className="text-white/90 text-xs sm:text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="space-y-3 sm:space-y-4"
                        >
                            <Button 
                                size="lg" 
                                className="group relative overflow-hidden bg-white text-black hover:bg-gray-100 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
                                onClick={handleGetStarted}
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    <Zap className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                                    Get Started Free
                                    <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-gray-100/20 to-gray-200/20 hidden sm:block"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.6 }}
                                />
                            </Button>
                            
                            <p className="text-white/60 text-xs sm:text-sm">
                                No registration required • Start marking in seconds
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Elements - Hidden on mobile for performance */}
            <motion.div
                className="absolute top-10 left-10 text-2xl sm:text-3xl opacity-20 hidden lg:block"
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 10, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                🎯
            </motion.div>
            
            <motion.div
                className="absolute bottom-10 right-10 text-xl sm:text-2xl opacity-20 hidden lg:block"
                animate={{
                    y: [0, -12, 0],
                    rotate: [0, -8, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            >
                ⚡
            </motion.div>
        </div>
    </section>
); 