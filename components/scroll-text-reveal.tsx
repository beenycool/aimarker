"use client";

import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface ScrollTextRevealProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function ScrollTextReveal({ children, className = '', as = 'span' }: ScrollTextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"]
  });

  const words = children.split(' ');
  
  const Component = motion[as];

  return (
    <Component ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          style={{
            opacity: useTransform(
              scrollYProgress,
              [index / words.length, (index + 1) / words.length],
              [0.2, 1]
            ),
            filter: useTransform(
              scrollYProgress,
              [index / words.length, (index + 1) / words.length],
              ["blur(3px)", "blur(0px)"]
            ),
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}

interface ScrollFillTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  gradient?: string;
}

export function ScrollFillText({ children, className = '', as = 'span', gradient = 'from-foreground via-primary to-purple-600' }: ScrollFillTextProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.1"]
  });

  const fillProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  const Component = motion[as];

  return (
    <Component ref={ref} className={`relative ${className}`}>
      <span className="text-muted-foreground/30">{children}</span>
      <motion.span
        className={`absolute inset-0 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        style={{
          clipPath: useTransform(fillProgress, (latest) => `inset(0 ${100 - parseFloat(latest)}% 0 0)`)
        }}
      >
        {children}
      </motion.span>
    </Component>
  );
}

interface ScrollCounterProps {
  target: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function ScrollCounter({ target, suffix = '', className = '', duration = 2 }: ScrollCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        animate={isInView ? { scale: 1 } : { scale: 0.5 }}
        transition={{ duration, ease: "easeOut" }}
      >
        {isInView && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, ease: "easeOut" }}
          >
            {target}
          </motion.span>
        )}
        {suffix}
      </motion.span>
    </motion.span>
  );
}