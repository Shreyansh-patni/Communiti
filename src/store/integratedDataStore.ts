import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// =====================================================
// INTEGRATED DATA STORE
// TypeScript Implementation of SQL Dataset
// =====================================================

// Enhanced interfaces that match SQL schema
export interface EnhancedUser {
  id: string;
  customerId: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: Date;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  
  // Customer Profile Extensions
  customerType: 'individual' | 'business' | 'enterprise';
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  accountStatus: 'active' | 'suspended' | 'pending' | 'churned';
  lifetimeValue: number;
  acquisitionChannel: string;
  lastLoginAt?: Date;
  
  // Preferences
  notificationsEnabled: boolean;
  marketingEnabled: boolean;
  analyticsEnabled: boolean;
  
  // Billing Information
  billingPlan?: string;
  billingCycle?: 'monthly' | 'annual';
  nextBillingDate?: Date;
  paymentMethod?: string;
  
  // Demographics
  industry?: string;
  companySize?: string;
  role?: string;
  experienceLevel?: string;
  
  // Engagement Metrics
  engagementScore: number;
  riskScore: number;
  
  isDemoData: boolean;
}

export interface EnhancedGroup {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  bannerUrl?: string;
  categoryId: string;
  createdBy: string;
  membersCount: number;
  postsCount: number;
  isPrivate: boolean;
  isVerified: boolean;
  subscriptionRequired: boolean;
  monthlyPrice: number;
  
  // Group Settings
  allowMemberPosts: boolean;
  requireApproval: boolean;
  autoArchiveDays: number;
  
  // Analytics
  engagementRate: number;
  growthRate: number;
  
  isDemoData: boolean;
  createdAt: Date;
}

export interface EnhancedEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  location?: string;
  isVirtual: boolean;
  meetingUrl?: string;
  organizerId: string;
  groupId?: string;
  attendeesCount: number;
  maxAttendees?: number;
  
  // Ticketing
  isPaid: boolean;
  ticketPrice: number;
  currency: string;
  ticketsSold: number;
  revenueGenerated: number;
  
  // Event Status
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  registrationDeadline?: Date;
  
  // Analytics
  conversionRate: number;
  satisfactionScore: number;
  
  isDemoData: boolean;
  createdAt: Date;
}

export interface EnhancedPost {
  id: string;
  content: string;
  authorId: string;
  groupId?: string;
  parentPostId?: string;
  
  // Engagement Metrics
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  
  // Content Analytics
  readingTimeSeconds: number;
  engagementRate: number;
  reach: number;
  impressions: number;
  
  // Content Moderation
  isFlagged: boolean;
  moderationStatus: 'approved' | 'pending' | 'rejected';
  
  // SEO and Discovery
  hashtags: string[];
  mentions: string[];
  
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  transactionId: string;
  userId: string;
  type: 'subscription' | 'event_ticket' | 'group_membership' | 'premium_feature';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentProcessor: string;
  
  // Related Entity
  relatedEntityType: string;
  relatedEntityId: string;
  
  // Billing Details
  billingAddress?: any;
  taxAmount: number;
  
  processedAt?: Date;
  isDemoData: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'subscription' | 'event_ticket' | 'group_access' | 'premium_feature';
  price: number;
  currency: string;
  billingInterval: 'one_time' | 'monthly' | 'annual';
  
  // Product Features
  features: string[];
  limitations: any;
  
  // Availability
  isActive: boolean;
  availableFrom?: Date;
  availableUntil?: Date;
  
  // Analytics
  salesCount: number;
  revenueTotal: number;
  
  isDemoData: boolean;
  createdAt: Date;
}

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  eventType: string;
  eventData: any;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
}

// Store interface
interface IntegratedDataState {
  // Data
  users: EnhancedUser[];
  groups: EnhancedGroup[];
  events: EnhancedEvent[];
  posts: EnhancedPost[];
  transactions: Transaction[];
  products: Product[];
  analyticsEvents: AnalyticsEvent[];
  
  // Analytics
  userEngagementSummary: any[];
  revenueSummary: any[];
  groupPerformance: any[];
  eventROI: any[];
  
  // Actions
  initializeData: () => void;
  addUser: (user: EnhancedUser) => void;
  updateUser: (id: string, updates: Partial<EnhancedUser>) => void;
  addTransaction: (transaction: Transaction) => void;
  trackAnalyticsEvent: (event: AnalyticsEvent) => void;
  calculateUserEngagement: (userId: string) => number;
  getRevenueByTier: () => any[];
  getTopPerformingGroups: () => any[];
  validateDataIntegrity: () => any[];
}

// Demo data matching SQL implementation
const demoUsers: EnhancedUser[] = [
  {
    id: 'user-001',
    customerId: 'CUST-2024-001',
    username: 'sarah_techceo',
    email: 'sarah.chen@techstartup.demo',
    displayName: 'Sarah Chen',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverPhotoUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Serial entrepreneur & AI researcher. Building the future of human-computer interaction. Previously founded 2 successful startups (acquired by Google & Meta). MIT CS grad.',
    location: 'San Francisco, CA',
    website: 'https://sarahchen.tech',
    joinedAt: new Date('2023-03-15'),
    isVerified: true,
    followersCount: 12500,
    followingCount: 890,
    postsCount: 234,
    customerType: 'business',
    subscriptionTier: 'enterprise',
    accountStatus: 'active',
    lifetimeValue: 24000.00,
    acquisitionChannel: 'organic_search',
    lastLoginAt: new Date('2024-01-15T09:30:00'),
    notificationsEnabled: true,
    marketingEnabled: true,
    analyticsEnabled: true,
    billingPlan: 'Enterprise Annual',
    billingCycle: 'annual',
    nextBillingDate: new Date('2024-03-15'),
    paymentMethod: 'corporate_card',
    industry: 'Technology',
    companySize: '51-200',
    role: 'C-Level Executive',
    experienceLevel: '10+ years',
    engagementScore: 92,
    riskScore: 15,
    isDemoData: true
  },
  {
    id: 'user-002',
    customerId: 'CUST-2024-002',
    username: 'alex_fullstack',
    email: 'alex@devstudio.demo',
    displayName: 'Alex Rodriguez',
    avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Full-stack engineer passionate about scalable architecture. React, Node.js, AWS expert. Open source contributor. Building developer tools that matter.',
    location: 'Austin, TX',
    website: 'https://alexdev.io',
    joinedAt: new Date('2023-02-20'),
    isVerified: false,
    followersCount: 8900,
    followingCount: 1200,
    postsCount: 456,
    customerType: 'individual',
    subscriptionTier: 'pro',
    accountStatus: 'active',
    lifetimeValue: 1200.00,
    acquisitionChannel: 'referral',
    lastLoginAt: new Date('2024-01-14T14:20:00'),
    notificationsEnabled: true,
    marketingEnabled: false,
    analyticsEnabled: true,
    billingPlan: 'Pro Monthly',
    billingCycle: 'monthly',
    nextBillingDate: new Date('2024-02-16'),
    paymentMethod: 'credit_card',
    industry: 'Technology',
    companySize: '11-50',
    role: 'Senior Developer',
    experienceLevel: '5-7 years',
    engagementScore: 85,
    riskScore: 25,
    isDemoData: true
  }
];

const demoProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Communiti Pro',
    description: 'Enhanced features for power users and professionals',
    type: 'subscription',
    price: 19.99,
    currency: 'USD',
    billingInterval: 'monthly',
    features: ['Advanced analytics', 'Priority support', 'Custom themes', 'Extended storage', 'Advanced search'],
    limitations: { postsPerDay: 50, groupsCreated: 10, eventsCreated: 20 },
    isActive: true,
    salesCount: 1247,
    revenueTotal: 24940.00,
    isDemoData: true,
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'prod-002',
    name: 'Communiti Enterprise',
    description: 'Full-featured solution for organizations and teams',
    type: 'subscription',
    price: 199.99,
    currency: 'USD',
    billingInterval: 'monthly',
    features: ['All Pro features', 'Team management', 'Advanced moderation', 'Custom branding', 'API access', 'SSO integration', 'Dedicated support'],
    limitations: { postsPerDay: -1, groupsCreated: -1, eventsCreated: -1 },
    isActive: true,
    salesCount: 89,
    revenueTotal: 17799.00,
    isDemoData: true,
    createdAt: new Date('2023-01-01')
  }
];

const demoTransactions: Transaction[] = [
  {
    id: 'txn-001',
    transactionId: 'TXN-2024-001-001',
    userId: 'user-001',
    type: 'subscription',
    amount: 199.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'credit_card',
    paymentProcessor: 'stripe',
    relatedEntityType: 'product',
    relatedEntityId: 'prod-002',
    taxAmount: 0.00,
    processedAt: new Date('2024-01-15T10:30:00'),
    isDemoData: true,
    createdAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: 'txn-002',
    transactionId: 'TXN-2024-001-002',
    userId: 'user-002',
    type: 'subscription',
    amount: 19.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'credit_card',
    paymentProcessor: 'stripe',
    relatedEntityType: 'product',
    relatedEntityId: 'prod-001',
    taxAmount: 0.00,
    processedAt: new Date('2024-01-16T14:20:00'),
    isDemoData: true,
    createdAt: new Date('2024-01-16T14:20:00')
  }
];

// Create the store
export const useIntegratedDataStore = create<IntegratedDataState>()(
  persist(
    (set, get) => ({
      // Initial state
      users: [],
      groups: [],
      events: [],
      posts: [],
      transactions: [],
      products: [],
      analyticsEvents: [],
      userEngagementSummary: [],
      revenueSummary: [],
      groupPerformance: [],
      eventROI: [],

      // Initialize with demo data
      initializeData: () => {
        set({
          users: demoUsers,
          products: demoProducts,
          transactions: demoTransactions
        });
      },

      // Add new user
      addUser: (user) => {
        set((state) => ({
          users: [...state.users, user]
        }));
      },

      // Update user
      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map(user => 
            user.id === id ? { ...user, ...updates } : user
          )
        }));
      },

      // Add transaction
      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [...state.transactions, transaction]
        }));
      },

      // Track analytics event
      trackAnalyticsEvent: (event) => {
        set((state) => ({
          analyticsEvents: [...state.analyticsEvents, event]
        }));
      },

      // Calculate user engagement score
      calculateUserEngagement: (userId) => {
        const state = get();
        const user = state.users.find(u => u.id === userId);
        if (!user) return 0;

        const userPosts = state.posts.filter(p => p.authorId === userId);
        const userAnalytics = state.analyticsEvents.filter(e => e.userId === userId);
        
        // Simple engagement calculation
        const postScore = userPosts.length * 5;
        const interactionScore = userAnalytics.length * 2;
        const totalScore = Math.min(100, postScore + interactionScore);

        // Update user engagement score
        get().updateUser(userId, { engagementScore: totalScore });
        
        return totalScore;
      },

      // Get revenue by subscription tier
      getRevenueByTier: () => {
        const state = get();
        const revenueByTier = state.users.reduce((acc, user) => {
          const userTransactions = state.transactions.filter(t => 
            t.userId === user.id && t.status === 'completed'
          );
          const userRevenue = userTransactions.reduce((sum, t) => sum + t.amount, 0);
          
          if (!acc[user.subscriptionTier]) {
            acc[user.subscriptionTier] = { count: 0, revenue: 0 };
          }
          acc[user.subscriptionTier].count += 1;
          acc[user.subscriptionTier].revenue += userRevenue;
          
          return acc;
        }, {} as any);

        return Object.entries(revenueByTier).map(([tier, data]: [string, any]) => ({
          tier,
          userCount: data.count,
          totalRevenue: data.revenue,
          avgRevenuePerUser: data.count > 0 ? data.revenue / data.count : 0
        }));
      },

      // Get top performing groups
      getTopPerformingGroups: () => {
        const state = get();
        return state.groups
          .filter(g => g.isDemoData)
          .sort((a, b) => b.engagementRate - a.engagementRate)
          .slice(0, 5)
          .map(group => ({
            id: group.id,
            name: group.name,
            membersCount: group.membersCount,
            postsCount: group.postsCount,
            engagementRate: group.engagementRate,
            growthRate: group.growthRate
          }));
      },

      // Validate data integrity
      validateDataIntegrity: () => {
        const state = get();
        const issues = [];

        // Check for orphaned posts
        const orphanedPosts = state.posts.filter(post => 
          !state.users.find(user => user.id === post.authorId)
        );
        if (orphanedPosts.length > 0) {
          issues.push({
            type: 'orphaned_posts',
            count: orphanedPosts.length,
            description: 'Posts without valid authors'
          });
        }

        // Check for invalid transactions
        const invalidTransactions = state.transactions.filter(transaction => 
          !state.users.find(user => user.id === transaction.userId)
        );
        if (invalidTransactions.length > 0) {
          issues.push({
            type: 'invalid_transactions',
            count: invalidTransactions.length,
            description: 'Transactions without valid users'
          });
        }

        // Check user follower count consistency
        state.users.forEach(user => {
          // In a real implementation, you'd check against actual connection data
          // For demo purposes, we'll assume the counts are correct
        });

        return issues;
      }
    }),
    {
      name: 'integrated-data-storage',
      partialize: (state) => ({
        users: state.users,
        groups: state.groups,
        events: state.events,
        posts: state.posts,
        transactions: state.transactions,
        products: state.products
      })
    }
  )
);

// Analytics utilities
export const analyticsUtils = {
  // Calculate conversion rate
  calculateConversionRate: (visitors: number, conversions: number): number => {
    return visitors > 0 ? (conversions / visitors) * 100 : 0;
  },

  // Calculate customer lifetime value
  calculateCLV: (avgOrderValue: number, purchaseFrequency: number, customerLifespan: number): number => {
    return avgOrderValue * purchaseFrequency * customerLifespan;
  },

  // Calculate churn rate
  calculateChurnRate: (customersLost: number, totalCustomers: number): number => {
    return totalCustomers > 0 ? (customersLost / totalCustomers) * 100 : 0;
  },

  // Generate engagement metrics
  generateEngagementMetrics: (posts: EnhancedPost[]) => {
    const totalPosts = posts.length;
    const totalEngagement = posts.reduce((sum, post) => 
      sum + post.likesCount + post.commentsCount + post.sharesCount, 0
    );
    const totalViews = posts.reduce((sum, post) => sum + post.viewsCount, 0);
    
    return {
      totalPosts,
      totalEngagement,
      totalViews,
      avgEngagementPerPost: totalPosts > 0 ? totalEngagement / totalPosts : 0,
      avgViewsPerPost: totalPosts > 0 ? totalViews / totalPosts : 0,
      engagementRate: totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0
    };
  }
};

// Export demo data for testing
export const demoDataExport = {
  users: demoUsers,
  products: demoProducts,
  transactions: demoTransactions
};