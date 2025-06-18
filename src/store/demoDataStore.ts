import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import comprehensiveDemoData from '../data/comprehensiveDemoData';
import type { User, Group, Event, Post, Comment } from '../types';

interface DemoDataState {
  // Data collections
  users: User[];
  groups: Group[];
  events: Event[];
  posts: Post[];
  comments: Record<string, Comment[]>;
  featuredContent: any[];
  mediaGallery: {
    images: any[];
    videos: any[];
  };
  activityLogs: any[];
  engagementMetrics: any;
  trendingTopics: any[];
  
  // Actions
  initializeDemoData: () => void;
  getUserById: (id: string) => User | undefined;
  getGroupById: (id: string) => Group | undefined;
  getEventById: (id: string) => Event | undefined;
  getPostById: (id: string) => Post | undefined;
  getPostComments: (postId: string) => Comment[];
  getGroupMembers: (groupId: string) => User[];
  getEventAttendees: (eventId: string) => User[];
  getUserPosts: (userId: string) => Post[];
  getGroupPosts: (groupId: string) => Post[];
  getTrendingPosts: () => Post[];
  getUpcomingEvents: () => Event[];
  getRecentActivity: (userId?: string) => any[];
  getRecommendedGroups: (userId?: string) => Group[];
  getRecommendedUsers: (userId?: string) => User[];
}

export const useDemoDataStore = create<DemoDataState>()(
  persist(
    (set, get) => ({
      // Initial state with empty collections
      users: [],
      groups: [],
      events: [],
      posts: [],
      comments: {},
      featuredContent: [],
      mediaGallery: {
        images: [],
        videos: []
      },
      activityLogs: [],
      engagementMetrics: {},
      trendingTopics: [],
      
      // Initialize with comprehensive demo data
      initializeDemoData: () => {
        console.log("Initializing demo data...");
        set({
          users: comprehensiveDemoData.users,
          groups: comprehensiveDemoData.groups,
          events: comprehensiveDemoData.events,
          posts: comprehensiveDemoData.posts,
          comments: comprehensiveDemoData.comments,
          featuredContent: comprehensiveDemoData.featuredContent,
          mediaGallery: comprehensiveDemoData.mediaGallery,
          activityLogs: comprehensiveDemoData.activityLogs,
          engagementMetrics: comprehensiveDemoData.engagementMetrics,
          trendingTopics: comprehensiveDemoData.trendingTopics
        });
        console.log("Demo data initialized successfully!");
      },
      
      // Getter functions
      getUserById: (id: string) => {
        return get().users.find(user => user.id === id);
      },
      
      getGroupById: (id: string) => {
        return get().groups.find(group => group.id === id);
      },
      
      getEventById: (id: string) => {
        return get().events.find(event => event.id === id);
      },
      
      getPostById: (id: string) => {
        return get().posts.find(post => post.id === id);
      },
      
      getPostComments: (postId: string) => {
        return get().comments[postId] || [];
      },
      
      getGroupMembers: (groupId: string) => {
        // In a real implementation, this would use a members table
        // For demo purposes, we'll return a subset of users
        const group = get().getGroupById(groupId);
        if (!group) return [];
        
        // Get a deterministic subset of users based on group ID
        const groupIdSum = groupId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return get().users.filter((_, index) => (index + groupIdSum) % 3 === 0).slice(0, 10);
      },
      
      getEventAttendees: (eventId: string) => {
        // Similar to group members, return a subset of users
        const event = get().getEventById(eventId);
        if (!event) return [];
        
        const eventIdSum = eventId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return get().users.filter((_, index) => (index + eventIdSum) % 4 === 0).slice(0, 8);
      },
      
      getUserPosts: (userId: string) => {
        return get().posts.filter(post => post.authorId === userId);
      },
      
      getGroupPosts: (groupId: string) => {
        return get().posts.filter(post => post.groupId === groupId);
      },
      
      getTrendingPosts: () => {
        // Return posts sorted by engagement (likes + comments + shares)
        return [...get().posts].sort((a, b) => {
          const engagementA = a.likesCount + a.commentsCount + a.sharesCount;
          const engagementB = b.likesCount + b.commentsCount + b.sharesCount;
          return engagementB - engagementA;
        }).slice(0, 5);
      },
      
      getUpcomingEvents: () => {
        const now = new Date();
        return get().events
          .filter(event => event.startDate > now)
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
          .slice(0, 5);
      },
      
      getRecentActivity: (userId?: string) => {
        if (userId) {
          return get().activityLogs
            .filter(activity => activity.userId === userId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);
        }
        
        return get().activityLogs
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 10);
      },
      
      getRecommendedGroups: (userId?: string) => {
        // In a real implementation, this would use user interests and behavior
        // For demo purposes, return a subset of groups
        if (userId) {
          const userIdSum = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
          return get().groups
            .filter((_, index) => (index + userIdSum) % 2 === 0)
            .slice(0, 3);
        }
        
        return get().groups.slice(0, 3);
      },
      
      getRecommendedUsers: (userId?: string) => {
        // Similar to recommended groups
        if (userId) {
          const userIdSum = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
          return get().users
            .filter(user => user.id !== userId)
            .filter((_, index) => (index + userIdSum) % 3 === 0)
            .slice(0, 5);
        }
        
        return get().users.slice(0, 5);
      }
    }),
    {
      name: 'demo-data-storage',
      partialize: (state) => ({
        // Don't persist the entire state to avoid storage limits
        // Just store a flag indicating initialization
        initialized: state.users.length > 0
      })
    }
  )
);

export default useDemoDataStore;