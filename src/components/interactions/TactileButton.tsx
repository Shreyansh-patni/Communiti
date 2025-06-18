import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Share, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TactileButtonProps {
  type: 'like' | 'reply' | 'repost' | 'share' | 'bookmark';
  isActive?: boolean;
  count?: number;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const buttonConfig = {
  like: {
    icon: Heart,
    activeColor: 'text-red-500',
    inactiveColor: 'text-dark-400',
    activeBg: 'bg-red-500/10',
    rippleColor: 'bg-red-500/30',
    hoverScale: 1.1,
    tapScale: 0.95,
  },
  reply: {
    icon: MessageCircle,
    activeColor: 'text-blue-500',
    inactiveColor: 'text-dark-400',
    activeBg: 'bg-blue-500/10',
    rippleColor: 'bg-blue-500/30',
    hoverScale: 1.05,
    tapScale: 0.95,
  },
  repost: {
    icon: Repeat2,
    activeColor: 'text-green-500',
    inactiveColor: 'text-dark-400',
    activeBg: 'bg-green-500/10',
    rippleColor: 'bg-green-500/30',
    hoverScale: 1.05,
    tapScale: 0.95,
  },
  share: {
    icon: Share,
    activeColor: 'text-primary-500',
    inactiveColor: 'text-dark-400',
    activeBg: 'bg-primary-500/10',
    rippleColor: 'bg-primary-500/30',
    hoverScale: 1.05,
    tapScale: 0.95,
  },
  bookmark: {
    icon: Bookmark,
    activeColor: 'text-yellow-500',
    inactiveColor: 'text-dark-400',
    activeBg: 'bg-yellow-500/10',
    rippleColor: 'bg-yellow-500/30',
    hoverScale: 1.05,
    tapScale: 0.95,
  },
};

const sizeConfig = {
  sm: {
    button: 'p-1.5',
    icon: 'w-4 h-4',
    text: 'text-xs',
    ripple: 'w-8 h-8',
  },
  md: {
    button: 'p-2',
    icon: 'w-5 h-5',
    text: 'text-sm',
    ripple: 'w-10 h-10',
  },
  lg: {
    button: 'p-3',
    icon: 'w-6 h-6',
    text: 'text-base',
    ripple: 'w-12 h-12',
  },
};

export function TactileButton({ 
  type, 
  isActive = false, 
  count, 
  onClick, 
  size = 'md',
  disabled = false 
}: TactileButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

  const config = buttonConfig[type];
  const sizeStyles = sizeConfig[size];
  const IconComponent = config.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;

    // Calculate ripple position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipplePosition({ x, y });

    // Trigger ripple effect
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);

    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(type === 'like' ? [10, 5, 10] : [5]);
    }

    onClick?.();
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <motion.button
      className={cn(
        'relative flex items-center space-x-1 rounded-full transition-all duration-200 overflow-hidden group',
        sizeStyles.button,
        isActive ? config.activeBg : 'hover:bg-dark-800/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : config.hoverScale }}
      whileTap={{ scale: disabled ? 1 : config.tapScale }}
      animate={{
        scale: isPressed ? config.tapScale : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {/* Ripple Effect */}
      <AnimatePresence>
        {showRipple && (
          <motion.div
            className={cn(
              'absolute rounded-full pointer-events-none',
              config.rippleColor,
              sizeStyles.ripple
            )}
            style={{
              left: ripplePosition.x - (sizeConfig[size].ripple === 'w-8 h-8' ? 16 : sizeConfig[size].ripple === 'w-10 h-10' ? 20 : 24),
              top: ripplePosition.y - (sizeConfig[size].ripple === 'w-8 h-8' ? 16 : sizeConfig[size].ripple === 'w-10 h-10' ? 20 : 24),
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Icon with micro-animation */}
      <motion.div
        animate={{
          rotate: type === 'like' && isActive ? [0, -10, 10, -5, 0] : 0,
          scale: isActive ? 1.1 : 1,
        }}
        transition={{
          duration: type === 'like' ? 0.6 : 0.3,
          ease: "easeInOut"
        }}
      >
        <IconComponent 
          className={cn(
            sizeStyles.icon,
            'transition-colors duration-200',
            isActive ? config.activeColor : config.inactiveColor,
            isActive && type === 'like' && 'fill-current',
            isActive && type === 'bookmark' && 'fill-current'
          )} 
        />
      </motion.div>

      {/* Count with smooth number transition */}
      {count !== undefined && count > 0 && (
        <motion.span
          className={cn(
            sizeStyles.text,
            'font-medium transition-colors duration-200',
            isActive ? config.activeColor : 'text-dark-400'
          )}
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
        </motion.span>
      )}

      {/* Hover glow effect */}
      <div className={cn(
        'absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-to-r from-transparent via-white/5 to-transparent'
      )} />
    </motion.button>
  );
}