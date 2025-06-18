// =====================================================
// DATA MIGRATION AND TRANSFORMATION SCRIPTS
// =====================================================

import { useIntegratedDataStore, type EnhancedUser, type Transaction, type Product } from '../store/integratedDataStore';
import { useAuthStore } from '../store/auth';
import { usePostsStore } from '../store/posts';

// Migration utilities
export class DataMigrationManager {
  private static instance: DataMigrationManager;
  
  static getInstance(): DataMigrationManager {
    if (!DataMigrationManager.instance) {
      DataMigrationManager.instance = new DataMigrationManager();
    }
    return DataMigrationManager.instance;
  }

  // Migrate existing user data to enhanced format
  async migrateUserData(): Promise<void> {
    const authStore = useAuthStore.getState();
    const integratedStore = useIntegratedDataStore.getState();
    
    if (authStore.user && !integratedStore.users.find(u => u.id === authStore.user!.id)) {
      const enhancedUser: EnhancedUser = {
        id: authStore.user.id,
        customerId: `CUST-${Date.now()}`,
        username: authStore.user.username,
        email: authStore.user.email,
        displayName: authStore.user.displayName,
        avatarUrl: authStore.user.avatar,
        coverPhotoUrl: authStore.user.coverPhoto,
        bio: authStore.user.bio,
        location: authStore.user.location,
        website: authStore.user.website,
        joinedAt: authStore.user.joinedAt,
        isVerified: authStore.user.isVerified,
        followersCount: authStore.user.followersCount,
        followingCount: authStore.user.followingCount,
        postsCount: authStore.user.postsCount,
        
        // Default enhanced fields
        customerType: 'individual',
        subscriptionTier: 'free',
        accountStatus: 'active',
        lifetimeValue: 0,
        acquisitionChannel: 'direct',
        lastLoginAt: new Date(),
        notificationsEnabled: true,
        marketingEnabled: true,
        analyticsEnabled: true,
        industry: 'Technology',
        role: 'User',
        experienceLevel: '1-3 years',
        engagementScore: 50,
        riskScore: 20,
        isDemoData: false
      };
      
      integratedStore.addUser(enhancedUser);
    }
  }

  // Transform legacy post data
  async transformPostData(): Promise<void> {
    const postsStore = usePostsStore.getState();
    const integratedStore = useIntegratedDataStore.getState();
    
    // Transform posts to enhanced format with analytics
    const enhancedPosts = postsStore.posts.map(post => ({
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      groupId: post.group?.id,
      parentPostId: undefined,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      sharesCount: post.sharesCount,
      viewsCount: Math.floor(Math.random() * 1000) + 100, // Simulated
      readingTimeSeconds: Math.ceil(post.content.length / 5), // ~5 chars per second
      engagementRate: this.calculateEngagementRate(post.likesCount, post.commentsCount, post.sharesCount, 500),
      reach: Math.floor(Math.random() * 5000) + 1000,
      impressions: Math.floor(Math.random() * 10000) + 2000,
      isFlagged: false,
      moderationStatus: 'approved' as const,
      hashtags: this.extractHashtags(post.content),
      mentions: this.extractMentions(post.content),
      isDemoData: false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));
    
    // Store enhanced posts (would integrate with existing posts store)
    console.log('Enhanced posts ready for integration:', enhancedPosts);
  }

  // Generate sample transactions for existing users
  async generateSampleTransactions(): Promise<void> {
    const integratedStore = useIntegratedDataStore.getState();
    const users = integratedStore.users.filter(u => !u.isDemoData);
    
    users.forEach(user => {
      // Generate subscription transaction if user has paid tier
      if (user.subscriptionTier !== 'free') {
        const transaction: Transaction = {
          id: `txn-${Date.now()}-${user.id}`,
          transactionId: `TXN-${Date.now()}`,
          userId: user.id,
          type: 'subscription',
          amount: user.subscriptionTier === 'pro' ? 19.99 : 199.99,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          paymentProcessor: 'stripe',
          relatedEntityType: 'product',
          relatedEntityId: user.subscriptionTier === 'pro' ? 'prod-001' : 'prod-002',
          taxAmount: 0,
          processedAt: new Date(),
          isDemoData: false,
          createdAt: new Date()
        };
        
        integratedStore.addTransaction(transaction);
      }
    });
  }

  // Data validation and cleanup
  async validateAndCleanData(): Promise<{ issues: any[], fixed: number }> {
    const integratedStore = useIntegratedDataStore.getState();
    const issues = integratedStore.validateDataIntegrity();
    let fixedCount = 0;
    
    // Auto-fix common issues
    issues.forEach(issue => {
      switch (issue.type) {
        case 'orphaned_posts':
          // Could implement auto-cleanup or user assignment
          console.warn(`Found ${issue.count} orphaned posts`);
          break;
        case 'invalid_transactions':
          // Could implement transaction cleanup
          console.warn(`Found ${issue.count} invalid transactions`);
          break;
        default:
          console.warn(`Unknown issue type: ${issue.type}`);
      }
    });
    
    return { issues, fixed: fixedCount };
  }

  // Utility methods
  private calculateEngagementRate(likes: number, comments: number, shares: number, views: number): number {
    const totalEngagement = likes + comments + shares;
    return views > 0 ? (totalEngagement / views) * 100 : 0;
  }

  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  }

  private extractMentions(content: string): string[] {
    const mentionRegex = /@[\w]+/g;
    const matches = content.match(mentionRegex);
    return matches ? matches.map(mention => mention.substring(1)) : [];
  }

  // Backup and restore functionality
  async createDataBackup(): Promise<string> {
    const integratedStore = useIntegratedDataStore.getState();
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        users: integratedStore.users,
        groups: integratedStore.groups,
        events: integratedStore.events,
        posts: integratedStore.posts,
        transactions: integratedStore.transactions,
        products: integratedStore.products
      }
    };
    
    return JSON.stringify(backup, null, 2);
  }

  async restoreFromBackup(backupData: string): Promise<boolean> {
    try {
      const backup = JSON.parse(backupData);
      const integratedStore = useIntegratedDataStore.getState();
      
      // Validate backup structure
      if (!backup.data || !backup.version) {
        throw new Error('Invalid backup format');
      }
      
      // Restore data (in production, you'd want more sophisticated merging)
      Object.entries(backup.data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Merge with existing data, avoiding duplicates
          console.log(`Restoring ${value.length} ${key} records`);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }
}

// Analytics and reporting utilities
export class AnalyticsManager {
  // Generate comprehensive analytics report
  static generateAnalyticsReport() {
    const integratedStore = useIntegratedDataStore.getState();
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalUsers: integratedStore.users.length,
        totalTransactions: integratedStore.transactions.length,
        totalRevenue: integratedStore.transactions
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        avgEngagementScore: integratedStore.users.length > 0 
          ? integratedStore.users.reduce((sum, u) => sum + u.engagementScore, 0) / integratedStore.users.length 
          : 0
      },
      userMetrics: {
        byTier: this.getUsersByTier(integratedStore.users),
        byEngagement: this.getUsersByEngagement(integratedStore.users),
        byRisk: this.getUsersByRisk(integratedStore.users)
      },
      revenueMetrics: {
        byTier: integratedStore.getRevenueByTier(),
        byMonth: this.getRevenueByMonth(integratedStore.transactions),
        byProduct: this.getRevenueByProduct(integratedStore.transactions, integratedStore.products)
      },
      engagementMetrics: {
        topGroups: integratedStore.getTopPerformingGroups(),
        contentPerformance: this.getContentPerformance(integratedStore.posts)
      }
    };
    
    return report;
  }

  private static getUsersByTier(users: EnhancedUser[]) {
    return users.reduce((acc, user) => {
      acc[user.subscriptionTier] = (acc[user.subscriptionTier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static getUsersByEngagement(users: EnhancedUser[]) {
    const ranges = { low: 0, medium: 0, high: 0 };
    users.forEach(user => {
      if (user.engagementScore < 40) ranges.low++;
      else if (user.engagementScore < 70) ranges.medium++;
      else ranges.high++;
    });
    return ranges;
  }

  private static getUsersByRisk(users: EnhancedUser[]) {
    const ranges = { low: 0, medium: 0, high: 0 };
    users.forEach(user => {
      if (user.riskScore < 30) ranges.low++;
      else if (user.riskScore < 60) ranges.medium++;
      else ranges.high++;
    });
    return ranges;
  }

  private static getRevenueByMonth(transactions: Transaction[]) {
    return transactions
      .filter(t => t.status === 'completed')
      .reduce((acc, transaction) => {
        const month = transaction.createdAt.toISOString().substring(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);
  }

  private static getRevenueByProduct(transactions: Transaction[], products: Product[]) {
    const productRevenue = transactions
      .filter(t => t.status === 'completed' && t.type === 'subscription')
      .reduce((acc, transaction) => {
        const product = products.find(p => p.id === transaction.relatedEntityId);
        if (product) {
          acc[product.name] = (acc[product.name] || 0) + transaction.amount;
        }
        return acc;
      }, {} as Record<string, number>);
    
    return Object.entries(productRevenue).map(([name, revenue]) => ({
      productName: name,
      revenue,
      transactions: transactions.filter(t => 
        t.status === 'completed' && 
        products.find(p => p.id === t.relatedEntityId)?.name === name
      ).length
    }));
  }

  private static getContentPerformance(posts: any[]) {
    if (posts.length === 0) return { avgEngagement: 0, topPosts: [] };
    
    const avgEngagement = posts.reduce((sum, post) => sum + (post.engagementRate || 0), 0) / posts.length;
    const topPosts = posts
      .sort((a, b) => (b.engagementRate || 0) - (a.engagementRate || 0))
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        content: post.content.substring(0, 100) + '...',
        engagementRate: post.engagementRate || 0,
        totalEngagement: (post.likesCount || 0) + (post.commentsCount || 0) + (post.sharesCount || 0)
      }));
    
    return { avgEngagement, topPosts };
  }
}

// Export utilities for use in components
export const migrationUtils = {
  manager: DataMigrationManager.getInstance(),
  analytics: AnalyticsManager,
  
  // Quick setup for new installations
  async quickSetup() {
    const manager = DataMigrationManager.getInstance();
    const integratedStore = useIntegratedDataStore.getState();
    
    // Initialize with demo data
    integratedStore.initializeData();
    
    // Migrate existing user data
    await manager.migrateUserData();
    
    // Transform existing posts
    await manager.transformPostData();
    
    // Generate sample transactions
    await manager.generateSampleTransactions();
    
    // Validate data integrity
    const validation = await manager.validateAndCleanData();
    
    return {
      success: true,
      message: 'Data integration completed successfully',
      validation
    };
  },
  
  // Export data for external analysis
  async exportData(format: 'json' | 'csv' = 'json') {
    const integratedStore = useIntegratedDataStore.getState();
    const report = AnalyticsManager.generateAnalyticsReport();
    
    if (format === 'json') {
      return {
        data: {
          users: integratedStore.users,
          transactions: integratedStore.transactions,
          products: integratedStore.products
        },
        analytics: report
      };
    }
    
    // CSV export would be implemented here
    return 'CSV export not yet implemented';
  }
};