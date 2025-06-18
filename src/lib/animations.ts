import { Variants } from 'framer-motion';

// Respect user's motion preferences
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Base animation settings
export const animationConfig = {
  duration: prefersReducedMotion() ? 0.1 : 0.3,
  ease: [0.25, 0.46, 0.45, 0.94] as const, // Natural easing curve
};

// Fade in animation
export const fadeIn: Variants = {
  hidden: { 
    opacity: 0,
    transition: { duration: animationConfig.duration }
  },
  visible: { 
    opacity: 1,
    transition: { 
      duration: animationConfig.duration,
      ease: animationConfig.ease
    }
  }
};

// Slide up animation
export const slideUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: prefersReducedMotion() ? 0 : 20,
    transition: { duration: animationConfig.duration }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: animationConfig.duration,
      ease: animationConfig.ease
    }
  }
};

// Slide down animation
export const slideDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: prefersReducedMotion() ? 0 : -20,
    transition: { duration: animationConfig.duration }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: animationConfig.duration,
      ease: animationConfig.ease
    }
  }
};

// Scale in animation
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: prefersReducedMotion() ? 1 : 0.95,
    transition: { duration: animationConfig.duration }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: animationConfig.duration,
      ease: animationConfig.ease
    }
  }
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : 0.1,
      delayChildren: prefersReducedMotion() ? 0 : 0.1,
    }
  }
};

// Page transition animations
export const pageTransition: Variants = {
  initial: { 
    opacity: 0, 
    x: prefersReducedMotion() ? 0 : 20,
    transition: { duration: animationConfig.duration }
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: animationConfig.duration,
      ease: animationConfig.ease
    }
  },
  exit: { 
    opacity: 0, 
    x: prefersReducedMotion() ? 0 : -20,
    transition: { duration: animationConfig.duration }
  }
};

// Button press animation
export const buttonPress = {
  scale: prefersReducedMotion() ? 1 : 0.95,
  transition: { 
    duration: 0.1,
    ease: 'easeInOut'
  }
};

// Hover animation
export const hoverScale = {
  scale: prefersReducedMotion() ? 1 : 1.02,
  transition: { 
    duration: 0.2,
    ease: 'easeInOut'
  }
};

// Loading pulse animation
export const loadingPulse: Variants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: prefersReducedMotion() ? 0 : 1.5,
      repeat: prefersReducedMotion() ? 0 : Infinity,
      ease: 'easeInOut'
    }
  }
};

// Modal animations
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: animationConfig.duration }
  }
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: prefersReducedMotion() ? 1 : 0.9,
    y: prefersReducedMotion() ? 0 : 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: animationConfig.duration,
      ease: animationConfig.ease
    }
  }
};

// Notification animations
export const notificationSlide: Variants = {
  hidden: { 
    opacity: 0, 
    x: prefersReducedMotion() ? 0 : 300,
    scale: prefersReducedMotion() ? 1 : 0.9
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      duration: animationConfig.duration,
      ease: animationConfig.ease
    }
  },
  exit: { 
    opacity: 0, 
    x: prefersReducedMotion() ? 0 : 300,
    scale: prefersReducedMotion() ? 1 : 0.9,
    transition: { duration: animationConfig.duration }
  }
};

// Card hover animation
export const cardHover = {
  y: prefersReducedMotion() ? 0 : -4,
  boxShadow: prefersReducedMotion() 
    ? 'none' 
    : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: { 
    duration: 0.2,
    ease: 'easeOut'
  }
};

// Viewport animation hook
export const useInViewAnimation = () => {
  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { 
      once: true, 
      margin: '-50px',
      amount: 0.3
    }
  };
};