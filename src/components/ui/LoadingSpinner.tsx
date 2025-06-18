import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { loadingPulse, prefersReducedMotion } from '../../lib/animations';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      variants={loadingPulse}
      animate="pulse"
      className={`flex items-center justify-center ${className}`}
    >
      <Loader2 
        className={`${sizeClasses[size]} text-primary-500 ${
          prefersReducedMotion() ? '' : 'animate-spin'
        }`} 
      />
    </motion.div>
  );
}