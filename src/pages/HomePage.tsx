import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Calendar, MessageCircle, TrendingUp, Plus, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CreatePost } from '../components/post/CreatePost';
import { EnhancedPostCard } from '../components/post/EnhancedPostCard';
import { PostComposer } from '../components/interactions/PostComposer';
import { ThreadedConversation } from '../components/interactions/ThreadedConversation';
import { SuggestedUsers } from '../components/discover/SuggestedUsers';
import { useAIAssistant } from '../components/ai/AIAssistantProvider';
import { useAuthStore } from '../store/auth';
import { usePostsStore } from '../store/posts';
import { useDemoDataStore } from '../store/demoDataStore';

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
  const [displayPosts, setDisplayPosts] = useState<any[]>([]);

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
  useEffect(() => {
    const postsToDisplay = posts.length > 0 ? posts : demoPosts;
    console.log("HomePage: Setting display posts, count:", postsToDisplay.length);
    setDisplayPosts(postsToDisplay);
  }, [posts, demoPosts]);

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
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-900 to-dark-950 z-0"></div>
          
          {/* Background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="text-center space-y-8 max-w-3xl">
              <div className="space-y-6">
                <div className="inline-block p-2 bg-primary-500/10 backdrop-blur-sm rounded-2xl mb-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-primary-500/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary-400" />
                    <span className="text-sm font-medium text-primary-300">The future of community building</span>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  <span className="text-white">Build, Learn, Launch</span>
                  <span className="block mt-2 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    Together
                  </span>
                </h1>
                
                <p className="text-xl text-dark-300 max-w-2xl mx-auto mt-6">
                  Join a thriving ecosystem where creators, learners, and innovators connect, 
                  collaborate, and grow together. Share your journey, discover opportunities, 
                  and build something amazing.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-300"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-6 text-lg border-dark-700 hover:bg-dark-800/50"
                  onClick={() => navigate('/login')}
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: '10K+', label: 'Active Members' },
                { value: '500+', label: 'Communities' },
                { value: '1K+', label: 'Events Monthly' },
                { value: '50K+', label: 'Connections Made' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-dark-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 bg-dark-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Everything you need to <span className="text-primary-400">succeed</span>
              </h2>
              <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                Powerful tools and features designed to help you connect, learn, and grow
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={feature.title}>
                  <Card className="h-full p-8 border-dark-800 hover:border-primary-500/30 transition-all duration-300 bg-gradient-to-b from-dark-900 to-dark-900/50">
                    <div className="space-y-4">
                      <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center">
                        <feature.icon className="w-7 h-7 text-primary-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-dark-300">
                        {feature.description}
                      </p>
                      <div className="pt-4">
                        <Button 
                          variant="ghost" 
                          className="px-0 text-primary-400 hover:text-primary-300 hover:bg-transparent"
                          onClick={() => navigate('/signup')}
                        >
                          Learn more <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-dark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trusted by innovators worldwide
              </h2>
              <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                See what our community members are saying about their experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Communiti has transformed how I connect with other founders. The quality of discussions and networking opportunities is unmatched.",
                  author: "Jessica Chen",
                  role: "Founder & CEO, TechNova",
                  avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150"
                },
                {
                  quote: "The AI assistant helped me refine my pitch deck and business strategy. It's like having a consultant available 24/7.",
                  author: "Michael Rodriguez",
                  role: "Startup Founder",
                  avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150"
                },
                {
                  quote: "I've attended three virtual events through Communiti and each one has led to valuable connections and insights for my business.",
                  author: "Aisha Johnson",
                  role: "Product Designer",
                  avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150"
                }
              ].map((testimonial, index) => (
                <div key={index}>
                  <Card className="h-full p-8 border-dark-800">
                    <div className="space-y-4">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-primary-400" fill="currentColor" viewBox="0 0 32 32">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                      </div>
                      <p className="text-white text-lg italic leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center space-x-3 pt-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-white font-medium">{testimonial.author}</h4>
                          <p className="text-dark-400 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900/20 to-dark-950"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-dark-900/80 backdrop-blur-lg border border-dark-800 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Ready to join our community?
                  </h2>
                  <p className="text-lg text-dark-300">
                    Start connecting with like-minded individuals, join engaging discussions, and accelerate your growth today.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-lg shadow-xl shadow-primary-500/20"
                    onClick={() => navigate('/signup')}
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-6 text-lg"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Composer */}
        <Card className="p-4">
          <button
            onClick={() => setShowComposer(true)}
            className="w-full text-left p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-dark-400 hover:text-dark-300"
          >
            What's happening?
          </button>
        </Card>

        {/* Trending Discussion */}
        <Card className="p-6">
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
        </Card>

        {/* Enhanced Feed */}
        <div className="space-y-6">
          {displayPosts && displayPosts.length > 0 ? (
            displayPosts.map((post) => (
              <div key={post.id}>
                <EnhancedPostCard
                  post={post}
                  onLike={handleLike}
                  onReply={handleReply}
                  onRepost={handleRepost}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-dark-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No posts yet
              </h3>
              <p className="text-dark-400">
                Be the first to share something with the community!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <SuggestedUsers />
        
        {/* Trending Topics */}
        <Card>
          <div className="p-4">
            <h3 className="font-semibold text-white mb-4">
              Trending Topics
            </h3>
            <div className="space-y-3">
              {['#ReactJS', '#WebDev', '#JavaScript', '#Design', '#AI'].map((topic) => (
                <div 
                  key={topic} 
                  className="flex items-center justify-between cursor-pointer hover:bg-dark-800/50 p-2 rounded-lg transition-colors"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(topic)}`)}
                >
                  <span className="text-primary-400 font-medium">
                    {topic}
                  </span>
                  <span className="text-sm text-dark-400">
                    {Math.floor(Math.random() * 1000) + 100} posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: Plus, label: 'Create Group' },
              { icon: Calendar, label: 'Host Event' },
              { icon: Users, label: 'Find People' },
              { icon: Bot, label: 'AI Assistant' },
            ].map((action) => (
              <div key={action.label}>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-dark-700 transition-colors"
                  onClick={() => handleQuickAction(action.label)}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              </div>
            ))}
          </div>
        </Card>
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