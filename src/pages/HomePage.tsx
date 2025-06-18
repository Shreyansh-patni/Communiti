import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, MessageCircle, TrendingUp, Plus, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { InViewAnimation } from '../components/ui/InViewAnimation';
import { CreatePost } from '../components/post/CreatePost';
import { EnhancedPostCard } from '../components/post/EnhancedPostCard';
import { PostComposer } from '../components/interactions/PostComposer';
import { ThreadedConversation } from '../components/interactions/ThreadedConversation';
import { SuggestedUsers } from '../components/discover/SuggestedUsers';
import { useAIAssistant } from '../components/ai/AIAssistantProvider';
import { useAuthStore } from '../store/auth';
import { usePostsStore } from '../store/posts';
import { useDemoDataStore } from '../store/demoDataStore';
import { slideUp, staggerContainer, fadeIn } from '../lib/animations';

const features = [
  {
    icon: Users,
    title: 'Connect with Communities',
    description: 'Join groups that match your interests and connect with like-minded people.',
  },
  {
    icon: Calendar,
    title: 'Discover Events',
    description: 'Find and attend events in your area or join virtual meetups.',
  },
  {
    icon: MessageCircle,
    title: 'AI-Powered Chat',
    description: 'Get help and insights from our intelligent assistant.',
  },
  {
    icon: TrendingUp,
    title: 'Stay Updated',
    description: 'Keep up with trending topics and discussions in your communities.',
  },
];

// Mock threaded conversation data
const mockThreadedPosts = [
  {
    id: '1',
    content: 'Just discovered this amazing React pattern for handling complex state. The key is to use useReducer with a well-structured action system. What do you all think?',
    author: {
      id: '1',
      username: 'sarah_dev',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      isVerified: true,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likesCount: 24,
    repliesCount: 8,
    isLiked: false,
    depth: 0,
    replies: [
      {
        id: '2',
        content: 'Absolutely agree! useReducer is so underrated. I\'ve been using it for complex forms and it\'s a game changer.',
        author: {
          id: '2',
          username: 'alex_dev',
          displayName: 'Alex Chen',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        likesCount: 12,
        repliesCount: 3,
        isLiked: true,
        depth: 1,
        replies: [
          {
            id: '3',
            content: 'Could you share an example? I\'m still wrapping my head around when to use useReducer vs useState.',
            author: {
              id: '3',
              username: 'mike_learns',
              displayName: 'Mike Wilson',
              avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
            },
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            likesCount: 5,
            repliesCount: 0,
            isLiked: false,
            depth: 2,
          }
        ]
      }
    ]
  }
];

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { posts, addPost } = usePostsStore();
  const { openAssistant } = useAIAssistant();
  const { initializeDemoData, posts: demoPosts } = useDemoDataStore();
  const [showComposer, setShowComposer] = useState(false);
  const [showConversationComposer, setShowConversationComposer] = useState(false);
  const [hasJoinedConversation, setHasJoinedConversation] = useState(false);

  // Initialize demo data if needed
  useEffect(() => {
    console.log("HomePage: Checking demo data...");
    if (demoPosts.length === 0) {
      console.log("HomePage: Initializing demo data...");
      initializeDemoData();
    } else {
      console.log("HomePage: Demo data already initialized", demoPosts.length, "posts");
    }
  }, [demoPosts.length, initializeDemoData]);

  // Use demo posts if no posts are available
  const displayPosts = posts.length > 0 ? posts : demoPosts;
  console.log("HomePage: Display posts count:", displayPosts.length);

  const handleCreatePost = async (content: string, attachments: File[]) => {
    await addPost(content, attachments);
  };

  const handleJoinConversation = () => {
    setHasJoinedConversation(true);
    setShowConversationComposer(true);
  };

  const handleConversationReply = async (content: string, attachments: File[]) => {
    // In a real app, this would add a reply to the specific conversation thread
    console.log('Adding reply to conversation:', content);
    
    // For demo purposes, we'll just add it as a regular post
    await addPost(`💬 Joining the conversation: ${content}`, attachments);
    
    // Close the composer
    setShowConversationComposer(false);
  };

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
  };

  const handleReply = (postId: string, content: string) => {
    console.log('Reply to post:', postId, content);
  };

  const handleRepost = (postId: string) => {
    console.log('Reposted:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Shared:', postId);
  };

  const handleBookmark = (postId: string) => {
    console.log('Bookmarked:', postId);
  };

  const handleThreadLike = (postId: string) => {
    console.log('Thread like:', postId);
  };

  const handleThreadReply = (postId: string) => {
    console.log('Thread reply:', postId);
    setShowConversationComposer(true);
  };

  // Quick action handlers
  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'Create Group':
        navigate('/groups/create');
        break;
      case 'Host Event':
        navigate('/events/create');
        break;
      case 'Find People':
        navigate('/search');
        break;
      case 'AI Assistant':
        openAssistant();
        break;
      default:
        console.warn('Unknown action:', actionType);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-16">
        {/* Hero Section */}
        <InViewAnimation animation="fadeIn">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Build, Learn, Launch
                <span className="block bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Together
                </span>
              </h1>
              <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                Join a community of creators, learners, and innovators. Share your journey, 
                discover opportunities, and grow together.
              </p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button size="lg" className="px-8" onClick={() => navigate('/signup')}>
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8" onClick={() => navigate('/login')}>
                Learn More
              </Button>
            </motion.div>
          </motion.section>
        </InViewAnimation>

        {/* Features Grid */}
        <InViewAnimation animation="stagger">
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={slideUp}
                transition={{ delay: index * 0.1 }}
              >
                <AnimatedCard enableInView={false} className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto">
                    <feature.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-dark-300">
                    {feature.description}
                  </p>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.section>
        </InViewAnimation>

        {/* Social Proof */}
        <InViewAnimation animation="fadeIn" delay={0.4}>
          <motion.section
            variants={fadeIn}
            className="text-center space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl font-bold text-primary-400">10K+</div>
                <div className="text-dark-400">Active Members</div>
              </motion.div>
              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl font-bold text-primary-400">500+</div>
                <div className="text-dark-400">Communities</div>
              </motion.div>
              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl font-bold text-primary-400">1K+</div>
                <div className="text-dark-400">Events Monthly</div>
              </motion.div>
            </div>
          </motion.section>
        </InViewAnimation>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Composer */}
        <AnimatedCard enableInView={false} className="p-4">
          <button
            onClick={() => setShowComposer(true)}
            className="w-full text-left p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-dark-400 hover:text-dark-300"
          >
            What's happening?
          </button>
        </AnimatedCard>

        {/* Trending Discussion */}
        <AnimatedCard enableInView={false} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Trending Discussion</h2>
            <Button 
              variant={hasJoinedConversation ? "secondary" : "outline"} 
              size="sm"
              onClick={handleJoinConversation}
              className="transition-all duration-200"
            >
              {hasJoinedConversation ? (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Joined
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Join Conversation
                </>
              )}
            </Button>
          </div>
          
          <ThreadedConversation
            posts={mockThreadedPosts}
            onLike={handleThreadLike}
            onReply={handleThreadReply}
          />

          {/* Conversation Stats */}
          <div className="mt-4 pt-4 border-t border-dark-800">
            <div className="flex items-center justify-between text-sm text-dark-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>12 participants</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>24 replies</span>
                </span>
              </div>
              <span>2 hours ago</span>
            </div>
          </div>
        </AnimatedCard>

        {/* Enhanced Feed */}
        <InViewAnimation animation="stagger">
          <motion.div 
            variants={staggerContainer}
            className="space-y-6"
          >
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={slideUp}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedPostCard
                  post={post}
                  onLike={handleLike}
                  onReply={handleReply}
                  onRepost={handleRepost}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                />
              </motion.div>
            ))}
            
            {displayPosts.length === 0 && (
              <motion.div 
                variants={fadeIn}
                className="text-center py-12"
              >
                <MessageCircle className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-dark-400">
                  Be the first to share something with the community!
                </p>
              </motion.div>
            )}
          </motion.div>
        </InViewAnimation>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <InViewAnimation delay={0.2}>
          <SuggestedUsers />
        </InViewAnimation>
        
        {/* Trending Topics */}
        <InViewAnimation delay={0.3}>
          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-4">
                Trending Topics
              </h3>
              <div className="space-y-3">
                {['#ReactJS', '#WebDev', '#JavaScript', '#Design', '#AI'].map((topic, index) => (
                  <motion.div 
                    key={topic} 
                    className="flex items-center justify-between cursor-pointer hover:bg-dark-800/50 p-2 rounded-lg transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(topic)}`)}
                  >
                    <span className="text-primary-400 font-medium">
                      {topic}
                    </span>
                    <span className="text-sm text-dark-400">
                      {Math.floor(Math.random() * 1000) + 100} posts
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </InViewAnimation>

        {/* Quick Actions */}
        <InViewAnimation delay={0.4}>
          <Card className="p-4">
            <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Plus, label: 'Create Group' },
                { icon: Calendar, label: 'Host Event' },
                { icon: Users, label: 'Find People' },
                { icon: Bot, label: 'AI Assistant' },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-dark-700 transition-colors"
                    onClick={() => handleQuickAction(action.label)}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </InViewAnimation>
      </div>

      {/* Post Composer Modal */}
      <PostComposer
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        onSubmit={handleCreatePost}
      />

      {/* Conversation Reply Composer */}
      <PostComposer
        isOpen={showConversationComposer}
        onClose={() => setShowConversationComposer(false)}
        onSubmit={handleConversationReply}
        placeholder="Add your thoughts to this conversation..."
        replyTo={{
          id: '1',
          author: 'sarah_dev',
          content: 'React pattern discussion'
        }}
      />
    </div>
  );
}