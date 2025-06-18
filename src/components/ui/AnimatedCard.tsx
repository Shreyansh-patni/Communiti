import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardProps } from './Card';
import { cardHover, slideUp, useInViewAnimation } from '../../lib/animations';

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode;
  enableHover?: boolean;
  enableInView?: boolean;
  delay?: number;
}

export function AnimatedCard({ 
  children, 
  enableHover = true, 
  enableInView = true,
  delay = 0,
  className,
  ...props 
}: AnimatedCardProps) {
  const inViewProps = useInViewAnimation();

  return (
    <motion.div
      {...(enableInView ? inViewProps : {})}
      variants={slideUp}
      transition={{ delay }}
      whileHover={enableHover ? cardHover : undefined}
      className={className}
    >
      <Card {...props}>
        {children}
      </Card>
    </motion.div>
  );
}