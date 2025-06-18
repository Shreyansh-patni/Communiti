import React, { useState } from 'react';
import { Bookmark, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PostCard } from '../components/post/PostCard';
import type { Post } from '../types';

// Mock bookmarked posts
const mockBookmarkedPosts: Post[] = [
  {
    id: '1',
    content: 'Just discovered this amazing React pattern for handling complex state. Game changer! 🚀\n\nThe key is to use useReducer with a well-structured action system...',
    authorId: '2',
    author: {
      id: '2',
      username: 'sarah_dev',
      email: 'sarah@example.com',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      isVerified: true,
      joinedAt: new Date(),
      followersCount: 1250,
      followingCount: 340,
      postsCount: 89,
    },
    attachments: [],
    likesCount: 124,
    commentsCount: 28,
    sharesCount: 15,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(),
  },
  {
    id: '2',
    content: 'Beautiful color palette inspiration for your next design project ✨',
    authorId: '3',
    author: {
      id: '3',
      username: 'alex_design',
      email: 'alex@example.com',
      displayName: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      isVerified: false,
      joinedAt: new Date(),
      followersCount: 890,
      followingCount: 210,
      postsCount: 156,
    },
    attachments: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
        filename: 'color-palette.png',
        size: 1024000,
      },
    ],
    likesCount: 89,
    commentsCount: 12,
    sharesCount: 23,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(),
  },
];

export function BookmarksPage() {
  const [bookmarkedPosts] = useState(mockBookmarkedPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const sortOptions = [
    { id: 'recent', name: 'Most Recent' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'oldest', name: 'Oldest First' },
  ];

  const filteredPosts = bookmarkedPosts
    .filter(post =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likesCount - a.likesCount;
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Bookmarks
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {bookmarkedPosts.length} saved posts
          </p>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.id}
              variant={sortBy === option.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy(option.id)}
              className="whitespace-nowrap"
            >
              {option.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Bookmarked Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <PostCard
              post={post}
              onLike={(postId) => console.log('Liked post:', postId)}
              onComment={(postId) => console.log('Comment on post:', postId)}
              onShare={(postId) => console.log('Shared post:', postId)}
              onBookmark={(postId) => console.log('Bookmarked post:', postId)}
            />
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Start bookmarking posts to save them for later'}
          </p>
        </div>
      )}
    </div>
  );
}