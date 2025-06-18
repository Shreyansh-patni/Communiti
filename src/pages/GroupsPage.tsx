import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useDemoDataStore } from '../store/demoDataStore';
import type { Group } from '../types';

export function GroupsPage() {
  const navigate = useNavigate();
  const { groups, initializeDemoData } = useDemoDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);

  // Initialize demo data if needed
  useEffect(() => {
    if (groups.length === 0) {
      initializeDemoData();
    }
  }, [groups.length, initializeDemoData]);

  const categories = [
    { id: 'all', name: 'All Groups' },
    { id: 'tech', name: 'Technology' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creative' },
  ];

  const filteredGroups = groups.filter(group =>
    (selectedCategory === 'all' || 
     (selectedCategory === 'tech' && group.tags.some(tag => ['AI', 'Blockchain', 'Full-Stack', 'Web Development'].includes(tag))) ||
     (selectedCategory === 'design' && group.tags.some(tag => ['UX Design', 'Design Systems', 'Visual Design'].includes(tag))) ||
     (selectedCategory === 'business' && group.tags.some(tag => ['Startups', 'Growth', 'Marketing'].includes(tag))) ||
     (selectedCategory === 'creative' && group.tags.some(tag => ['Creative', 'Digital Art', 'Motion Design'].includes(tag)))
    ) &&
    (searchQuery === '' || 
     group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleJoinGroup = (groupId: string, isPrivate: boolean) => {
    if (isPrivate) {
      // For private groups, show a request sent message
      alert('Join request sent! You will be notified when approved.');
    } else {
      // For public groups, join immediately and redirect
      setJoinedGroups(prev => [...prev, groupId]);
      setTimeout(() => {
        navigate(`/groups/${groupId}`);
      }, 500);
    }
  };

  const handleCreateGroup = () => {
    // Navigate to create group page
    navigate('/groups/create');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Groups
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Discover and join communities that match your interests
          </p>
        </div>
        <Button className="flex items-center" onClick={handleCreateGroup}>
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group, index) => {
          const isJoined = joinedGroups.includes(group.id);
          
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden cursor-pointer" hover onClick={() => navigate(`/groups/${group.id}`)}>
                {/* Banner */}
                {group.banner && (
                  <div className="h-32 bg-gradient-to-r from-primary-500 to-accent-500 relative">
                    <img
                      src={group.banner}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4 space-y-4">
                  {/* Group Info */}
                  <div className="flex items-start space-x-3">
                    <Avatar
                      src={group.avatar}
                      alt={group.name}
                      size="lg"
                      fallback={group.name.charAt(0)}
                      className={group.banner ? '-mt-8 border-4 border-white dark:border-secondary-900' : ''}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                          {group.name}
                        </h3>
                        {group.isPrivate && (
                          <Lock className="w-4 h-4 text-secondary-400" />
                        )}
                      </div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-secondary-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{group.membersCount.toLocaleString()} members</span>
                    </div>
                    <div>
                      {group.postsCount} posts
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {group.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {group.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs text-secondary-500">
                        +{group.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <Button 
                    className="w-full" 
                    size="sm"
                    variant={isJoined ? 'secondary' : 'primary'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isJoined) {
                        handleJoinGroup(group.id, group.isPrivate);
                      } else {
                        navigate(`/groups/${group.id}`);
                      }
                    }}
                  >
                    {isJoined ? 'View Group' : (group.isPrivate ? 'Request to Join' : 'Join Group')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            No groups found
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            Try adjusting your search or create a new group
          </p>
        </div>
      )}
    </div>
  );
}