export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: Date;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  banner?: string;
  membersCount: number;
  postsCount: number;
  isPrivate: boolean;
  createdAt: Date;
  createdBy: string;
  tags: string[];
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User;
  groupId?: string;
  group?: Group;
  attachments: Attachment[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId: string;
  parentId?: string;
  likesCount: number;
  isLiked: boolean;
  createdAt: Date;
  replies?: Comment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  filename: string;
  size: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  isVirtual: boolean;
  meetingUrl?: string;
  organizerId: string;
  organizer: User;
  groupId?: string;
  group?: Group;
  attendeesCount: number;
  maxAttendees?: number;
  isAttending: boolean;
  tags: string[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId?: string;
  sender?: User;
  isAI: boolean;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'event' | 'group_invite';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actor?: User;
}

export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
}

export interface UserPreferences {
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    events: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showEmail: boolean;
    showLocation: boolean;
  };
}