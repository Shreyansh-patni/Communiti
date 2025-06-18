import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, Users, Calendar, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { formatRelativeTime } from '../lib/utils';
import type { Notification } from '../types';

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New like on your post',
    message: 'Sarah Johnson liked your post about React development',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    actionUrl: '/posts/123',
    actor: {
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
  },
  {
    id: '2',
    type: 'comment',
    title: 'New comment',
    message: 'Alex Chen commented on your post: "Great insights! Thanks for sharing."',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    actionUrl: '/posts/123',
    actor: {
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
  },
  {
    id: '3',
    type: 'follow',
    title: 'New follower',
    message: 'Mike Wilson started following you',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: '/profile/mike_wilson',
    actor: {
      id: '4',
      username: 'mike_wilson',
      email: 'mike@example.com',
      displayName: 'Mike Wilson',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      isVerified: false,
      joinedAt: new Date(),
      followersCount: 234,
      followingCount: 567,
      postsCount: 45,
    },
  },
  {
    id: '4',
    type: 'event',
    title: 'Event reminder',
    message: 'React Meetup starts in 2 hours',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    actionUrl: '/events/react-meetup',
  },
];

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: Users,
  mention: MessageCircle,
  event: Calendar,
  group_invite: Users,
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All' },
    { id: 'unread', name: 'Unread' },
    { id: 'likes', name: 'Likes' },
    { id: 'comments', name: 'Comments' },
    { id: 'follows', name: 'Follows' },
  ];

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'likes':
        return notification.type === 'like';
      case 'comments':
        return notification.type === 'comment';
      case 'follows':
        return notification.type === 'follow';
      default:
        return true;
    }
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Notifications
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {filters.map((filterOption) => (
          <Button
            key={filterOption.id}
            variant={filter === filterOption.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterOption.id)}
            className="whitespace-nowrap"
          >
            {filterOption.name}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.map((notification, index) => {
          const IconComponent = notificationIcons[notification.type];
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-colors ${
                  !notification.isRead
                    ? 'bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800'
                    : ''
                }`}
                hover
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {notification.actor ? (
                      <Avatar
                        src={notification.actor.avatar}
                        alt={notification.actor.displayName}
                        size="sm"
                        fallback={notification.actor.displayName.charAt(0)}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {notification.title}
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-secondary-500 mt-2">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                        <IconComponent className="w-4 h-4 text-secondary-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            No notifications
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {filter === 'unread' 
              ? "You're all caught up!" 
              : "We'll notify you when something happens"}
          </p>
        </div>
      )}
    </div>
  );
}