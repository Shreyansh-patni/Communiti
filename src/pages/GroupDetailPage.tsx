import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Settings, 
  UserPlus, 
  UserMinus, 
  Share2, 
  MessageCircle, 
  Crown,
  Shield,
  Clock,
  ArrowLeft,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { PostCard } from '../components/post/PostCard';
import { CreatePost } from '../components/post/CreatePost';
import { formatDate, formatRelativeTime } from '../lib/utils';
import { useAuthStore } from '../store/auth';
import type { Group, User, Post, Event } from '../types';

// Mock data for group details
const mockGroupData: Group & {
  members: (User & { role: 'admin' | 'moderator' | 'member'; joinedAt: Date })[];
  events: Event[];
  posts: Post[];
} = {
  id: '1',
  name: 'React Developers',
  description: 'A vibrant community for React developers to share knowledge, tips, and best practices. Whether you\'re a beginner or an expert, everyone is welcome to learn and contribute.',
  avatar: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=150',
  banner: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
  membersCount: 1250,
  postsCount: 340,
  isPrivate: false,
  createdAt: new Date('2023-01-15'),
  createdBy: '1',
  tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'TypeScript'],
  members: [
    {
      id: '1',
      username: 'sarah_dev',
      email: 'sarah@example.com',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'React enthusiast and community builder',
      isVerified: true,
      joinedAt: new Date('2023-01-15'),
      followersCount: 1250,
      followingCount: 340,
      postsCount: 89,
      role: 'admin',
    },
    {
      id: '2',
      username: 'alex_dev',
      email: 'alex@example.com',
      displayName: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Full-stack developer',
      isVerified: false,
      joinedAt: new Date('2023-02-20'),
      followersCount: 890,
      followingCount: 210,
      postsCount: 156,
      role: 'moderator',
    },
    {
      id: '3',
      username: 'mike_wilson',
      email: 'mike@example.com',
      displayName: 'Mike Wilson',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'React developer and mentor',
      isVerified: false,
      joinedAt: new Date('2023-03-10'),
      followersCount: 234,
      followingCount: 567,
      postsCount: 45,
      role: 'member',
    },
  ],
  events: [
    {
      id: '1',
      title: 'React Hooks Deep Dive',
      description: 'Learn advanced React hooks patterns and best practices',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: 'Tech Hub, Downtown',
      isVirtual: false,
      organizerId: '1',
      organizer: {
        id: '1',
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
      attendeesCount: 45,
      maxAttendees: 60,
      isAttending: false,
      tags: ['React', 'Hooks', 'Advanced'],
      createdAt: new Date(),
    },
  ],
  posts: [
    {
      id: '1',
      content: 'Just discovered this amazing React pattern for handling complex state. Game changer! 🚀\n\nThe key is to use useReducer with a well-structured action system...',
      authorId: '1',
      author: {
        id: '1',
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
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ],
};

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [group, setGroup] = useState(mockGroupData);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(false);
  const [memberFilter, setMemberFilter] = useState('all');
  const [memberSearch, setMemberSearch] = useState('');

  const isAdmin = user && group.members.find(m => m.id === user.id)?.role === 'admin';
  const isModerator = user && group.members.find(m => m.id === user.id)?.role === 'moderator';
  const canModerate = isAdmin || isModerator;

  const tabs = [
    { id: 'posts', name: 'Posts', count: group.posts.length },
    { id: 'members', name: 'Members', count: group.membersCount },
    { id: 'events', name: 'Events', count: group.events.length },
    { id: 'about', name: 'About' },
  ];

  const memberRoles = [
    { id: 'all', name: 'All Members' },
    { id: 'admin', name: 'Admins' },
    { id: 'moderator', name: 'Moderators' },
    { id: 'member', name: 'Members' },
  ];

  const filteredMembers = group.members.filter(member => {
    const matchesRole = memberFilter === 'all' || member.role === memberFilter;
    const matchesSearch = member.displayName.toLowerCase().includes(memberSearch.toLowerCase()) ||
                         member.username.toLowerCase().includes(memberSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleJoinGroup = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsJoined(!isJoined);
      setGroup(prev => ({
        ...prev,
        membersCount: isJoined ? prev.membersCount - 1 : prev.membersCount + 1
      }));
    } catch (error) {
      console.error('Failed to join/leave group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareGroup = () => {
    if (navigator.share) {
      navigator.share({
        title: group.name,
        text: group.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Group link copied to clipboard!');
    }
  };

  const handleContactAdmins = () => {
    const admins = group.members.filter(m => m.role === 'admin');
    if (admins.length > 0) {
      // In a real app, this would open a message dialog
      alert(`Contact admin: ${admins[0].displayName} (@${admins[0].username})`);
    }
  };

  const handleCreateEvent = () => {
    navigate('/events/create', { state: { groupId: group.id } });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      moderator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      member: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[role as keyof typeof colors]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (!group) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600 dark:text-secondary-400">Group not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/groups')}
        className="flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Groups
      </Button>

      {/* Group Header */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-primary-500 to-accent-500 relative">
          {group.banner && (
            <img
              src={group.banner}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Group Info */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <Avatar
                src={group.avatar}
                alt={group.name}
                size="xl"
                fallback={group.name.charAt(0)}
                className="border-4 border-white dark:border-secondary-900"
              />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {group.name}
                  </h1>
                  {group.isPrivate && (
                    <div className="px-2 py-1 bg-secondary-100 dark:bg-secondary-800 rounded text-xs text-secondary-600 dark:text-secondary-400">
                      Private
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-secondary-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{group.membersCount.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Created {formatDate(group.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Button
                onClick={handleJoinGroup}
                disabled={isLoading}
                isLoading={isLoading}
                variant={isJoined ? 'secondary' : 'primary'}
                className="flex items-center"
              >
                {isJoined ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Leave Group
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Group
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleShareGroup} className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handleContactAdmins} className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Admins
              </Button>
              {canModerate && (
                <Button variant="outline" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-secondary-700 dark:text-secondary-300 mb-4">
            {group.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex-1"
          >
            {tab.name} {tab.count !== undefined && `(${tab.count})`}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {isJoined && <CreatePost placeholder={`Share something with ${group.name}...`} />}
            
            {group.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}

            {group.posts.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  No posts yet
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Be the first to share something with the group!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-4">
            {/* Member Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {memberRoles.map((role) => (
                  <Button
                    key={role.id}
                    variant={memberFilter === role.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setMemberFilter(role.id)}
                    className="whitespace-nowrap"
                  >
                    {role.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Members List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={member.avatar}
                      alt={member.displayName}
                      size="md"
                      fallback={member.displayName.charAt(0)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-secondary-900 dark:text-secondary-100 truncate">
                          {member.displayName}
                        </h3>
                        {member.isVerified && (
                          <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-sm text-secondary-500">@{member.username}</p>
                      {member.bio && (
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1 line-clamp-1">
                          {member.bio}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        {getRoleBadge(member.role)}
                        <span className="text-xs text-secondary-500">
                          Joined {formatRelativeTime(member.joinedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  No members found
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            {canModerate && (
              <div className="flex justify-end">
                <Button onClick={handleCreateEvent} className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
            )}

            {group.events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 cursor-pointer" hover onClick={() => navigate(`/events/${event.id}`)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400 mb-3">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-secondary-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendeesCount} attending</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant={event.isAttending ? 'secondary' : 'primary'}>
                      {event.isAttending ? 'Attending' : 'Attend'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}

            {group.events.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  No events yet
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {canModerate ? 'Create the first event for this group!' : 'Check back later for upcoming events'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                  About {group.name}
                </h3>
                <p className="text-secondary-700 dark:text-secondary-300">
                  {group.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                    Group Stats
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-400">Members:</span>
                      <span className="font-medium">{group.membersCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-400">Posts:</span>
                      <span className="font-medium">{group.postsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-400">Created:</span>
                      <span className="font-medium">{formatDate(group.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-400">Privacy:</span>
                      <span className="font-medium">{group.isPrivate ? 'Private' : 'Public'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">
                  Group Rules
                </h4>
                <div className="space-y-2 text-sm text-secondary-700 dark:text-secondary-300">
                  <div className="flex items-start space-x-2">
                    <span className="font-medium">1.</span>
                    <span>Be respectful and professional in all interactions</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-medium">2.</span>
                    <span>Keep discussions relevant to React and web development</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-medium">3.</span>
                    <span>No spam, self-promotion, or off-topic content</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-medium">4.</span>
                    <span>Help others learn and grow in their development journey</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}