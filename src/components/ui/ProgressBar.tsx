import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  className?: string;
  valueClassName?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max,
  showValue = false,
  size = 'md',
  color = 'primary',
  className,
  valueClassName,
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    accent: 'bg-accent-500'
  };
  
  const textColorClasses = {
    primary: 'text-primary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
    accent: 'text-accent-500'
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-dark-800 rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
          className={cn(colorClasses[color], 'h-full rounded-full')}
        />
      </div>
      {showValue && (
        <div className={cn('text-xs mt-1 text-right', textColorClasses[color], valueClassName)}>
          {value} / {max}
        </div>
      )}
    </div>
  );
}