import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Reply } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { TactileButton } from '../interactions/TactileButton';
import { QuickActionsMenu } from '../interactions/QuickActionsMenu';
import { PostComposer } from '../interactions/PostComposer';
import { formatRelativeTime } from '../../lib/utils';
import type { Post } from '../../types';

interface EnhancedPostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onReply?: (postId: string, content: string) => void;
  onRepost?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onMute?: (userId: string) => void;
  onFollow?: (userId: string) => void;
  onReport?: (postId: string) => void;
}

export function EnhancedPostCard({
  post,
  onLike,
  onReply,
  onRepost,
  onShare,
  onBookmark,
  onMute,
  onFollow,
  onReport
}: EnhancedPostCardProps) {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const handleReply = () => {
    setShowReplyComposer(true);
  };

  const handleRepost = () => {
    onRepost?.(post.id);
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post.id);
  };

  const handleReplySubmit = (content: string, attachments: File[]) => {
    onReply?.(post.id, content);
    setShowReplyComposer(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <Card className="space-y-4 hover:border-dark-700 transition-all duration-200">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                src={post.author.avatar}
                alt={post.author.displayName}
                size="md"
                fallback={post.author.displayName.charAt(0)}
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-white">
                    {post.author.displayName}
                  </h3>
                  {post.author.isVerified && (
                    <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-dark-400">
                  <span>@{post.author.username}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(post.createdAt)}</span>
                  {post.group && (
                    <>
                      <span>•</span>
                      <span className="text-primary-400">
                        {post.group.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
              ref={moreButtonRef}
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => setShowQuickActions(true)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="text-white whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
            
            {/* Attachments */}
            {post.attachments.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {post.attachments.map((attachment) => (
                  <motion.div 
                    key={attachment.id} 
                    className="rounded-xl overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {attachment.type === 'image' && (
                      <img
                        src={attachment.url}
                        alt={attachment.filename}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onClick={() => window.open(attachment.url, '_blank')}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-dark-800">
            <div className="flex items-center space-x-6">
              <TactileButton
                type="like"
                isActive={isLiked}
                count={likesCount}
                onClick={handleLike}
              />
              
              <TactileButton
                type="reply"
                count={post.commentsCount}
                onClick={handleReply}
              />
              
              <TactileButton
                type="repost"
                count={post.sharesCount}
                onClick={handleRepost}
              />
              
              <TactileButton
                type="share"
                onClick={handleShare}
              />
            </div>
            
            <TactileButton
              type="bookmark"
              isActive={isBookmarked}
              onClick={handleBookmark}
            />
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions Menu */}
      <QuickActionsMenu
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onMute={() => onMute?.(post.author.id)}
        onFollow={() => onFollow?.(post.author.id)}
        onReport={() => onReport?.(post.id)}
        onShare={() => handleShare()}
        onBookmark={() => handleBookmark()}
        isBookmarked={isBookmarked}
        triggerRef={moreButtonRef}
      />

      {/* Reply Composer */}
      <PostComposer
        isOpen={showReplyComposer}
        onClose={() => setShowReplyComposer(false)}
        onSubmit={handleReplySubmit}
        placeholder="Post your reply..."
        replyTo={{
          id: post.id,
          author: post.author.username,
          content: post.content
        }}
      />
    </>
  );
}