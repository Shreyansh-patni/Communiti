import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { formatRelativeTime } from '../../lib/utils';
import { usePostsStore } from '../../store/posts';
import { useAuthStore } from '../../store/auth';
import type { Post } from '../../types';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment, onShare, onBookmark }: PostCardProps) {
  const { user } = useAuthStore();
  const { likePost, bookmarkPost, sharePost, addComment, comments } = usePostsStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const postComments = comments[post.id] || [];

  const handleLike = () => {
    if (onLike) {
      onLike(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(post.id);
    } else {
      bookmarkPost(post.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.id);
    } else {
      sharePost(post.id);
      // In a real app, this would open a share dialog
      navigator.share?.({
        title: `Post by ${post.author.displayName}`,
        text: post.content,
        url: window.location.href,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      });
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    
    setIsCommenting(true);
    try {
      if (onComment) {
        onComment(post.id);
      } else {
        addComment(post.id, commentText);
      }
      setCommentText('');
      setShowComments(true);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  return (
    <Card className="space-y-4" hover>
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
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                {post.author.displayName}
              </h3>
              {post.author.isVerified && (
                <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-secondary-500">
              <span>@{post.author.username}</span>
              <span>•</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
              {post.group && (
                <>
                  <span>•</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {post.group.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="p-1">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-secondary-900 dark:text-secondary-100 whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Attachments */}
        {post.attachments.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {post.attachments.map((attachment) => (
              <div key={attachment.id} className="rounded-lg overflow-hidden">
                {attachment.type === 'image' && (
                  <img
                    src={attachment.url}
                    alt={attachment.filename}
                    className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(attachment.url, '_blank')}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`p-2 ${post.isLiked ? 'text-error-500' : 'text-secondary-500'}`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="ml-1 text-sm">{post.likesCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="p-2 text-secondary-500"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="ml-1 text-sm">{post.commentsCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="p-2 text-secondary-500"
          >
            <Share className="w-5 h-5" />
            <span className="ml-1 text-sm">{post.sharesCount}</span>
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`p-2 ${post.isBookmarked ? 'text-primary-500' : 'text-secondary-500'}`}
        >
          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
          {/* Add Comment */}
          {user && (
            <div className="flex space-x-3">
              <Avatar
                src={user.avatar}
                alt={user.displayName}
                size="sm"
                fallback={user.displayName.charAt(0)}
              />
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim() || isCommenting}
                  isLoading={isCommenting}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {postComments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar
                  src={comment.author.avatar}
                  alt={comment.author.displayName}
                  size="sm"
                  fallback={comment.author.displayName.charAt(0)}
                />
                <div className="flex-1">
                  <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">
                        {comment.author.displayName}
                      </span>
                      <span className="text-xs text-secondary-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-secondary-900 dark:text-secondary-100 text-sm">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}