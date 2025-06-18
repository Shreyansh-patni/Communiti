import React, { useState, useEffect } from 'react';
import { TrendingUp, Hash, Users, Calendar, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PostCard } from '../components/post/PostCard';
import { useDemoDataStore } from '../store/demoDataStore';
import type { Post } from '../types';

export function TrendingPage() {
  const { posts, trendingTopics, initializeDemoData } = useDemoDataStore();
  const [activeTab, setActiveTab] = useState('posts');
  const [timeframe, setTimeframe] = useState('today');
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);

  // Initialize demo data if needed
  useEffect(() => {
    if (posts.length === 0) {
      initializeDemoData();
    }
  }, [posts.length, initializeDemoData]);

  // Set trending posts based on engagement metrics
  useEffect(() => {
    if (posts.length > 0) {
      // Sort posts by engagement (likes + comments + shares)
      const sorted = [...posts].sort((a, b) => {
        const engagementA = a.likesCount + a.commentsCount + a.sharesCount;
        const engagementB = b.likesCount + b.commentsCount + b.sharesCount;
        return engagementB - engagementA;
      });
      
      setTrendingPosts(sorted.slice(0, 5));
    }
  }, [posts]);

  const tabs = [
    { id: 'posts', name: 'Posts', icon: TrendingUp },
    { id: 'topics', name: 'Topics', icon: Hash },
    { id: 'people', name: 'People', icon: Users },
  ];

  const timeframes = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Trending
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Discover what's popular in your community
          </p>
        </div>
      </div>

      {/* Tabs and Timeframe */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf.id}
              variant={timeframe === tf.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(tf.id)}
            >
              {tf.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {trendingPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PostCard
                post={post}
              />
            </motion.div>
          ))}
          
          {trendingPosts.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                No trending posts yet
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Check back soon for popular content
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.tag}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4 cursor-pointer" hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <Hash className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                        #{topic.tag}
                      </h3>
                      <p className="text-sm text-secondary-500">
                        {topic.posts.toLocaleString()} posts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-success-600 dark:text-success-400">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{topic.growth}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'people' && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            Trending People
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            Coming soon! Discover the most active community members.
          </p>
        </div>
      )}
    </div>
  );
}