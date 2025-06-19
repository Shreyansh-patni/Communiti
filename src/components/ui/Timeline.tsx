import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TimelineItemProps {
  title: string;
  date?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isLast?: boolean;
  isActive?: boolean;
  isCompleted?: boolean;
  className?: string;
}

export function TimelineItem({
  title,
  date,
  icon,
  children,
  isLast = false,
  isActive = false,
  isCompleted = false,
  className
}: TimelineItemProps) {
  return (
    <div className={cn('relative pb-8', isLast ? 'pb-0' : '', className)}>
      {!isLast && (
        <span
          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-dark-800"
          aria-hidden="true"
        />
      )}
      <div className="relative flex items-start space-x-4">
        <div className="relative">
          <div className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center',
            isActive ? 'bg-primary-500 text-white' : 
            isCompleted ? 'bg-success-500 text-white' : 
            'bg-dark-800 text-dark-400'
          )}>
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={cn(
              'text-lg font-semibold',
              isActive ? 'text-primary-400' : 
              isCompleted ? 'text-success-400' : 
              'text-white'
            )}>
              {title}
            </h3>
            {date && (
              <span className="text-sm text-dark-400">{date}</span>
            )}
          </div>
          <div className="mt-2 text-dark-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  );
}