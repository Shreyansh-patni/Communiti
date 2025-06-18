import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  MoreHorizontal,
  Reply
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { TactileButton } from './TactileButton';
import { formatRelativeTime } from '../../lib/utils';

interface ThreadPost {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    isVerified?: boolean;
  };
  createdAt: Date;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  replies?: ThreadPost[];
  parentId?: string;
  depth: number;
}

interface ThreadedConversationProps {
  posts: ThreadPost[];
  onLike: (postId: string) => void;
  onReply: (postId: string) => void;
  onLoadMore?: (postId: string) => void;
  maxDepth?: number;
}

export function ThreadedConversation({ 
  posts, 
  onLike, 
  onReply, 
  onLoadMore,
  maxDepth = 3 
}: ThreadedConversationProps) {
  const [collapsedThreads, setCollapsedThreads] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const toggleThread = (postId: string) => {
    setCollapsedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleReplies = (postId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const renderPost = (post: ThreadPost, index: number) => {
    const isCollapsed = collapsedThreads.has(post.id);
    const hasReplies = post.replies && post.replies.length > 0;
    const showReplies = expandedReplies.has(post.id);
    const isNested = post.depth > 0;

    return (
      <motion.div
        key={post.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={cn(
          'relative',
          isNested && 'ml-6 border-l-2 border-dark-800 pl-4'
        )}
      >
        {/* Thread Line */}
        {isNested && (
          <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-primary-500/50 to-transparent" />
        )}

        {/* Post Content */}
        <div className={cn(
          'bg-dark-900 border border-dark-800 rounded-xl p-4 mb-3',
          'hover:border-dark-700 transition-colors duration-200',
          isNested && 'bg-dark-800/50'
        )}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar
                src={post.author.avatar}
                alt={post.author.displayName}
                size={isNested ? 'sm' : 'md'}
                fallback={post.author.displayName.charAt(0)}
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-white text-sm">
                    {post.author.displayName}
                  </h4>
                  {post.author.isVerified && (
                    <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-dark-400">
                  <span>@{post.author.username}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Thread Controls */}
            <div className="flex items-center space-x-2">
              {hasReplies && (
                <button
                  onClick={() => toggleThread(post.id)}
                  className="p-1 text-dark-400 hover:text-white hover:bg-dark-700 rounded transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>
              )}
              <button className="p-1 text-dark-400 hover:text-white hover:bg-dark-700 rounded transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-white mb-4 leading-relaxed">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <TactileButton
                      type="like"
                      isActive={post.isLiked}
                      count={post.likesCount}
                      onClick={() => onLike(post.id)}
                      size="sm"
                    />
                    
                    <TactileButton
                      type="reply"
                      count={post.repliesCount}
                      onClick={() => onReply(post.id)}
                      size="sm"
                    />
                  </div>

                  {/* Reply Expansion */}
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReplies(post.id)}
                      className="text-xs text-dark-400 hover:text-primary-400"
                    >
                      {showReplies ? 'Hide' : 'Show'} {post.replies!.length} replies
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed State */}
          {isCollapsed && hasReplies && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-sm text-dark-400"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.replies!.length} replies hidden</span>
            </motion.div>
          )}
        </div>

        {/* Nested Replies */}
        <AnimatePresence>
          {!isCollapsed && hasReplies && showReplies && post.depth < maxDepth && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {post.replies!.map((reply, replyIndex) => 
                renderPost(reply, replyIndex)
              )}
              
              {/* Load More Button */}
              {onLoadMore && post.replies!.length >= 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoadMore(post.id)}
                  className="ml-6 text-primary-400 hover:text-primary-300"
                >
                  Load more replies
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Max Depth Indicator */}
        {hasReplies && post.depth >= maxDepth && (
          <div className="ml-6 p-3 bg-dark-800/30 border border-dark-700 rounded-lg">
            <p className="text-sm text-dark-400 text-center">
              Continue this thread →
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {posts.map((post, index) => renderPost(post, index))}
    </div>
  );
}