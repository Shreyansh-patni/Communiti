import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface ConnectionsState {
  following: string[];
  followers: string[];
  followRequests: string[];
  suggestedUsers: User[];
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  acceptFollowRequest: (userId: string) => void;
  rejectFollowRequest: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  hasFollowRequest: (userId: string) => boolean;
}

export const useConnectionsStore = create<ConnectionsState>()(
  persist(
    (set, get) => ({
      following: [],
      followers: [],
      followRequests: [],
      suggestedUsers: [
        {
          id: '2',
          username: 'sarah_dev',
          email: 'sarah@example.com',
          displayName: 'Sarah Johnson',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
          bio: 'Frontend developer passionate about React and TypeScript',
          isVerified: true,
          joinedAt: new Date(),
          followersCount: 1250,
          followingCount: 340,
          postsCount: 89,
        },
        {
          id: '3',
          username: 'alex_design',
          email: 'alex@example.com',
          displayName: 'Alex Chen',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
          bio: 'UI/UX Designer creating beautiful digital experiences',
          isVerified: false,
          joinedAt: new Date(),
          followersCount: 890,
          followingCount: 210,
          postsCount: 156,
        },
        {
          id: '4',
          username: 'mike_wilson',
          email: 'mike@example.com',
          displayName: 'Mike Wilson',
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
          bio: 'Full-stack developer and startup enthusiast',
          isVerified: false,
          joinedAt: new Date(),
          followersCount: 234,
          followingCount: 567,
          postsCount: 45,
        },
      ],

      followUser: (userId) => {
        set((state) => ({
          following: [...state.following, userId],
        }));
      },

      unfollowUser: (userId) => {
        set((state) => ({
          following: state.following.filter(id => id !== userId),
        }));
      },

      acceptFollowRequest: (userId) => {
        set((state) => ({
          followers: [...state.followers, userId],
          followRequests: state.followRequests.filter(id => id !== userId),
        }));
      },

      rejectFollowRequest: (userId) => {
        set((state) => ({
          followRequests: state.followRequests.filter(id => id !== userId),
        }));
      },

      isFollowing: (userId) => {
        return get().following.includes(userId);
      },

      hasFollowRequest: (userId) => {
        return get().followRequests.includes(userId);
      },
    }),
    {
      name: 'connections-storage',
    }
  )
);