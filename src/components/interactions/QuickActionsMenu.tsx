import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  VolumeX, 
  UserPlus, 
  Flag, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  X,
  Volume2,
  UserMinus
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuickAction {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  bgColor: string;
  action: () => void;
  destructive?: boolean;
}

interface QuickActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMute?: () => void;
  onFollow?: () => void;
  onReport?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  isMuted?: boolean;
  isFollowing?: boolean;
  isBookmarked?: boolean;
  triggerRef?: React.RefObject<HTMLElement>;
}

export function QuickActionsMenu({
  isOpen,
  onClose,
  onMute,
  onFollow,
  onReport,
  onShare,
  onBookmark,
  isMuted = false,
  isFollowing = false,
  isBookmarked = false,
  triggerRef
}: QuickActionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);

  const actions: QuickAction[] = [
    {
      id: 'mute',
      icon: isMuted ? Volume2 : VolumeX,
      label: isMuted ? 'Unmute' : 'Mute',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      action: () => {
        onMute?.();
        onClose();
      }
    },
    {
      id: 'follow',
      icon: isFollowing ? UserMinus : UserPlus,
      label: isFollowing ? 'Unfollow' : 'Follow',
      color: isFollowing ? 'text-red-400' : 'text-blue-400',
      bgColor: isFollowing ? 'bg-red-500/10' : 'bg-blue-500/10',
      action: () => {
        onFollow?.();
        onClose();
      },
      destructive: isFollowing
    },
    {
      id: 'bookmark',
      icon: Bookmark,
      label: isBookmarked ? 'Remove Bookmark' : 'Bookmark',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      action: () => {
        onBookmark?.();
        onClose();
      }
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
      action: () => {
        onShare?.();
        onClose();
      }
    },
    {
      id: 'report',
      icon: Flag,
      label: 'Report',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      action: () => {
        onReport?.();
        onClose();
      },
      destructive: true
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, triggerRef]);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 0) {
      setDragY(info.offset.y);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            ref={menuRef}
            className="fixed bottom-0 left-0 right-0 z-50 bg-dark-900 border-t border-dark-800 rounded-t-2xl shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: dragY }}
            exit={{ y: '100%' }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-dark-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-dark-800">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <button
                onClick={onClose}
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Grid */}
            <div className="p-6 pb-8">
              <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    className={cn(
                      'flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200',
                      action.bgColor,
                      'hover:scale-105 active:scale-95',
                      action.destructive && 'hover:bg-red-500/20'
                    )}
                    onClick={action.action}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center mb-2',
                      action.bgColor,
                      'border border-white/10'
                    )}>
                      <action.icon className={cn('w-6 h-6', action.color)} />
                    </div>
                    <span className={cn(
                      'text-sm font-medium',
                      action.destructive ? 'text-red-400' : 'text-white'
                    )}>
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}