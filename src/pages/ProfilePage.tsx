import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPin, 
  Link, 
  Calendar, 
  Settings, 
  UserPlus, 
  MessageCircle, 
  Share2,
  Award,
  Users,
  Heart,
  Eye,
  Globe,
  Mail,
  Phone,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  MoreHorizontal,
  Shield,
  Star,
  TrendingUp,
  Camera,
  Edit3,
  Copy,
  Check,
  Filter,
  Grid,
  List,
  Image as ImageIcon,
  Video,
  FileText,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { PostCard } from '../components/post/PostCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { useAuthStore } from '../store/auth';
import { usePostsStore } from '../store/posts';
import { useConnectionsStore } from '../store/connections';
import { formatDate, formatRelativeTime } from '../lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType<any>;
}

interface ProfileStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesReceived: number;
  profileViews: number;
  joinedGroupsCount: number;
  eventsAttended: number;
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Community Builder',
    description: 'Created your first group',
    icon: '🏗️',
    rarity: 'rare',
    unlockedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Social Butterfly',
    description: 'Connected with 100+ people',
    icon: '🦋',
    rarity: 'epic',
    unlockedAt: new Date('2024-02-20')
  },
  {
    id: '3',
    title: 'Content Creator',
    description: 'Posted 50+ times',
    icon: '✨',
    rarity: 'rare',
    unlockedAt: new Date('2024-03-10')
  },
  {
    id: '4',
    title: 'Early Adopter',
    description: 'Joined in the first month',
    icon: '🚀',
    rarity: 'legendary',
    unlockedAt: new Date('2023-12-01')
  }
];

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuthStore();
  const { posts } = usePostsStore();
  const { followUser, unfollowUser, isFollowing } = useConnectionsStore();
  
  const [activeTab, setActiveTab] = useState('posts');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [contentFilter, setContentFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    postsCount: 89,
    followersCount: 1250,
    followingCount: 340,
    likesReceived: 2840,
    profileViews: 5670,
    joinedGroupsCount: 12,
    eventsAttended: 28
  });

  // In a real app, you'd fetch the profile user based on username
  const profileUser = currentUser; // For demo, showing current user's profile
  const isOwnProfile = username === currentUser?.username;
  const following = profileUser ? isFollowing(profileUser.id) : false;

  const userPosts = posts.filter(post => post.authorId === profileUser?.id);

  const socialLinks: SocialLink[] = [
    { platform: 'Twitter', url: 'https://twitter.com/johndoe', icon: Twitter },
    { platform: 'GitHub', url: 'https://github.com/johndoe', icon: Github },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe', icon: Linkedin },
    { platform: 'Instagram', url: 'https://instagram.com/johndoe', icon: Instagram },
  ];

  const tabs = [
    { id: 'posts', name: 'Posts', count: userPosts.length, icon: FileText },
    { id: 'media', name: 'Media', count: userPosts.filter(p => p.attachments.length > 0).length, icon: ImageIcon },
    { id: 'achievements', name: 'Achievements', count: mockAchievements.length, icon: Award },
    { id: 'activity', name: 'Activity', count: null, icon: TrendingUp },
    { id: 'about', name: 'About', count: null, icon: Users },
  ];

  const contentFilters = [
    { id: 'all', name: 'All Content' },
    { id: 'posts', name: 'Text Posts' },
    { id: 'images', name: 'Images' },
    { id: 'videos', name: 'Videos' },
    { id: 'popular', name: 'Most Popular' },
  ];

  useEffect(() => {
    // Simulate loading profile data
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, [username]);

  const handleFollowToggle = async () => {
    if (!profileUser) return;
    
    setIsLoading(true);
    try {
      if (following) {
        unfollowUser(profileUser.id);
        setProfileStats(prev => ({ ...prev, followersCount: prev.followersCount - 1 }));
      } else {
        followUser(profileUser.id);
        setProfileStats(prev => ({ ...prev, followersCount: prev.followersCount + 1 }));
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${profileUser?.username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileUser?.displayName}'s Profile`,
          text: `Check out ${profileUser?.displayName} on Communiti`,
          url: profileUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const filteredPosts = userPosts.filter(post => {
    switch (contentFilter) {
      case 'images':
        return post.attachments.some(att => att.type === 'image');
      case 'videos':
        return post.attachments.some(att => att.type === 'video');
      case 'posts':
        return post.attachments.length === 0;
      case 'popular':
        return post.likesCount > 50;
      default:
        return true;
    }
  });

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-dark-800 rounded-xl animate-pulse mb-4 mx-auto"></div>
          <p className="text-dark-400">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500">
          {profileUser.coverPhoto && (
            <img
              src={profileUser.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
          
          {/* Cover Actions */}
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              <Button variant="secondary" size="sm" className="backdrop-blur-sm bg-dark-900/50 border-dark-700">
                <Camera className="w-4 h-4 mr-2" />
                Edit Cover
              </Button>
            </div>
          )}
        </div>
        
        <div className="px-6 pb-6">
          {/* Profile Info */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-16 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  src={profileUser.avatar}
                  alt={profileUser.displayName}
                  size="xl"
                  fallback={profileUser.displayName.charAt(0)}
                  className="border-4 border-dark-900 shadow-2xl"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-lg">
                    <Camera className="w-3 h-3" />
                  </button>
                )}
                {profileUser.isVerified && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center border-2 border-dark-900">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              {/* Basic Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-white">
                    {profileUser.displayName}
                  </h1>
                  {profileUser.isVerified && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-primary-500/10 rounded-full">
                      <Shield className="w-3 h-3 text-primary-400" />
                      <span className="text-xs text-primary-400 font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-dark-400">@{profileUser.username}</p>
                
                {/* Quick Stats */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-dark-500" />
                    <span className="text-dark-400">{profileStats.profileViews.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-dark-500" />
                    <span className="text-dark-400">Joined {formatDate(profileUser.joinedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              {isOwnProfile ? (
                <>
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={handleShareProfile} className="flex items-center">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Share'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button 
                    onClick={handleFollowToggle}
                    disabled={isLoading}
                    variant={following ? 'secondary' : 'primary'}
                    className="flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {following ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" onClick={handleShareProfile} className="flex items-center">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Share'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Bio and Details */}
          <div className="space-y-4">
            {profileUser.bio && (
              <p className="text-white text-lg leading-relaxed">
                {profileUser.bio}
              </p>
            )}
            
            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              {profileUser.location && (
                <div className="flex items-center space-x-2 text-dark-300">
                  <MapPin className="w-4 h-4 text-dark-500" />
                  <span>{profileUser.location}</span>
                </div>
              )}
              {profileUser.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-dark-500" />
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {profileUser.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors group"
                  title={link.platform}
                >
                  <link.icon className="w-4 h-4 text-dark-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profileStats.postsCount}</div>
                <div className="text-xs text-dark-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profileStats.followersCount.toLocaleString()}</div>
                <div className="text-xs text-dark-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profileStats.followingCount}</div>
                <div className="text-xs text-dark-400">Following</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profileStats.likesReceived.toLocaleString()}</div>
                <div className="text-xs text-dark-400">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profileStats.joinedGroupsCount}</div>
                <div className="text-xs text-dark-400">Groups</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profileStats.eventsAttended}</div>
                <div className="text-xs text-dark-400">Events</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{mockAchievements.length}</div>
                <div className="text-xs text-dark-400">Badges</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex space-x-1 bg-dark-800 rounded-xl p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
              {tab.count !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-dark-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* View Controls */}
        {(activeTab === 'posts' || activeTab === 'media') && (
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1 bg-dark-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
            
            <select
              value={contentFilter}
              onChange={(e) => setContentFilter(e.target.value)}
              className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {contentFilters.map(filter => (
                <option key={filter.id} value={filter.id}>{filter.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {viewMode === 'list' ? (
                <div className="space-y-6">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="p-4 hover:bg-dark-800/50 transition-colors cursor-pointer">
                        <div className="space-y-3">
                          <p className="text-white text-sm line-clamp-3">{post.content}</p>
                          {post.attachments.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {post.attachments.slice(0, 4).map((attachment) => (
                                <div key={attachment.id} className="aspect-square rounded-lg overflow-hidden bg-dark-800">
                                  {attachment.type === 'image' && (
                                    <img
                                      src={attachment.url}
                                      alt={attachment.filename}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-dark-400">
                            <span>{formatRelativeTime(post.createdAt)}</span>
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{post.likesCount}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MessageCircle className="w-3 h-3" />
                                <span>{post.commentsCount}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No posts found</h3>
                  <p className="text-dark-400">
                    {contentFilter === 'all' ? 'No posts yet' : 'No posts match your filter'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPosts
                .filter(post => post.attachments.length > 0)
                .flatMap(post => post.attachments)
                .filter(attachment => attachment.type === 'image')
                .map((attachment, index) => (
                  <motion.div
                    key={attachment.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="aspect-square rounded-xl overflow-hidden bg-dark-800 group cursor-pointer relative"
                  >
                    <img
                      src={attachment.url}
                      alt={attachment.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/20 transition-colors duration-300" />
                  </motion.div>
                ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(showAllAchievements ? mockAchievements : mockAchievements.slice(0, 6)).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:bg-dark-800/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-2xl shadow-lg`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{achievement.title}</h3>
                          <p className="text-sm text-dark-400 mb-2">{achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                              achievement.rarity === 'legendary' ? 'bg-yellow-500/10 text-yellow-400' :
                              achievement.rarity === 'epic' ? 'bg-purple-500/10 text-purple-400' :
                              achievement.rarity === 'rare' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-gray-500/10 text-gray-400'
                            }`}>
                              {achievement.rarity}
                            </span>
                            <span className="text-xs text-dark-500">
                              {formatRelativeTime(achievement.unlockedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {mockAchievements.length > 6 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllAchievements(!showAllAchievements)}
                  >
                    {showAllAchievements ? 'Show Less' : `Show All ${mockAchievements.length} Achievements`}
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <Card className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Joined group', target: 'React Developers', time: '2 hours ago', icon: Users },
                    { action: 'Liked post', target: 'Building Modern UIs', time: '4 hours ago', icon: Heart },
                    { action: 'Commented on', target: 'Event Planning Tips', time: '1 day ago', icon: MessageCircle },
                    { action: 'Attended event', target: 'Tech Meetup 2024', time: '3 days ago', icon: Calendar },
                    { action: 'Followed', target: '@sarah_dev', time: '1 week ago', icon: UserPlus },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-dark-800/30 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="text-dark-300">{activity.action}</span>{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-dark-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-dark-400">Full Name</label>
                    <p className="text-white">{profileUser.displayName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-dark-400">Username</label>
                    <p className="text-white">@{profileUser.username}</p>
                  </div>
                  <div>
                    <label className="text-sm text-dark-400">Bio</label>
                    <p className="text-white">{profileUser.bio || 'No bio provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-dark-400">Location</label>
                    <p className="text-white">{profileUser.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-dark-400">Website</label>
                    {profileUser.website ? (
                      <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                        {profileUser.website}
                      </a>
                    ) : (
                      <p className="text-white">Not specified</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-dark-400">Member Since</label>
                    <p className="text-white">{formatDate(profileUser.joinedAt)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-dark-400">Total Posts</span>
                    <span className="text-white font-medium">{profileStats.postsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Followers</span>
                    <span className="text-white font-medium">{profileStats.followersCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Following</span>
                    <span className="text-white font-medium">{profileStats.followingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Likes Received</span>
                    <span className="text-white font-medium">{profileStats.likesReceived.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Profile Views</span>
                    <span className="text-white font-medium">{profileStats.profileViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Groups Joined</span>
                    <span className="text-white font-medium">{profileStats.joinedGroupsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Events Attended</span>
                    <span className="text-white font-medium">{profileStats.eventsAttended}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Achievements</span>
                    <span className="text-white font-medium">{mockAchievements.length}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profileUser}
      />
    </div>
  );
}