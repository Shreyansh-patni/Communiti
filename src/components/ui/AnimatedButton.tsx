import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './Button';
import { buttonPress, hoverScale } from '../../lib/animations';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  enableHover?: boolean;
  enablePress?: boolean;
}

export function AnimatedButton({ 
  children, 
  enableHover = true, 
  enablePress = true,
  className,
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={enableHover ? hoverScale : undefined}
      whileTap={enablePress ? buttonPress : undefined}
      className={className}
    >
      <Button {...props}>
        {children}
      </Button>
    </motion.div>
  );
}