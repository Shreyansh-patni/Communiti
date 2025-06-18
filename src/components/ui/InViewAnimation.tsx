import React from 'react';
import { motion } from 'framer-motion';
import { slideUp, fadeIn, staggerContainer, useInViewAnimation } from '../../lib/animations';

interface InViewAnimationProps {
  children: React.ReactNode;
  animation?: 'slideUp' | 'fadeIn' | 'stagger';
  delay?: number;
  className?: string;
}

export function InViewAnimation({ 
  children, 
  animation = 'slideUp', 
  delay = 0,
  className = ''
}: InViewAnimationProps) {
  const inViewProps = useInViewAnimation();
  
  const variants = {
    slideUp,
    fadeIn,
    stagger: staggerContainer,
  };

  return (
    <motion.div
      {...inViewProps}
      variants={variants[animation]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}