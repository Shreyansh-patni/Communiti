// =====================================================
// COMPREHENSIVE DEMO DATA
// Production-Quality Sample Dataset
// =====================================================

import type { User, Group, Event, Post, Comment } from '../types';

// Enhanced demo users with complete profiles
export const demoUsers: User[] = [
  {
    id: 'user-001',
    username: 'sarah_techceo',
    email: 'sarah.chen@techstartup.demo',
    displayName: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverPhoto: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Serial entrepreneur & AI researcher. Building the future of human-computer interaction. Previously founded 2 successful startups (acquired by Google & Meta). MIT CS grad.',
    location: 'San Francisco, CA',
    website: 'https://sarahchen.tech',
    joinedAt: new Date('2023-03-15'),
    isVerified: true,
    followersCount: 12500,
    followingCount: 890,
    postsCount: 234
  },
  {
    id: 'user-002',
    username: 'alex_fullstack',
    email: 'alex@devstudio.demo',
    displayName: 'Alex Rodriguez',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Full-stack engineer passionate about scalable architecture. React, Node.js, AWS expert. Open source contributor. Building developer tools that matter.',
    location: 'Austin, TX',
    website: 'https://alexdev.io',
    joinedAt: new Date('2023-02-20'),
    isVerified: false,
    followersCount: 8900,
    followingCount: 1200,
    postsCount: 456
  },
  {
    id: 'user-003',
    username: 'mike_airesearcher',
    email: 'mike@ailab.demo',
    displayName: 'Dr. Mike Thompson',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'AI Research Scientist at Stanford. PhD in Machine Learning. Published 50+ papers on neural networks and computer vision. Advisor to AI startups.',
    location: 'Palo Alto, CA',
    website: 'https://mikethompson.ai',
    joinedAt: new Date('2023-03-10'),
    isVerified: true,
    followersCount: 15600,
    followingCount: 567,
    postsCount: 189
  },
  {
    id: 'user-004',
    username: 'lisa_blockchain',
    email: 'lisa@cryptoventures.demo',
    displayName: 'Lisa Wang',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Blockchain architect & DeFi protocol designer. Former Goldman Sachs quant. Building the decentralized financial future. Ethereum core contributor.',
    location: 'New York, NY',
    website: 'https://lisawang.crypto',
    joinedAt: new Date('2023-04-05'),
    isVerified: true,
    followersCount: 9800,
    followingCount: 445,
    postsCount: 167
  },
  {
    id: 'user-005',
    username: 'david_devops',
    email: 'david@cloudnative.demo',
    displayName: 'David Kim',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'DevOps engineer & Kubernetes expert. Building cloud-native infrastructure at scale. AWS certified solutions architect. Docker captain.',
    location: 'Seattle, WA',
    website: 'https://davidkim.cloud',
    joinedAt: new Date('2023-05-12'),
    isVerified: false,
    followersCount: 6700,
    followingCount: 890,
    postsCount: 298
  },
  {
    id: 'user-006',
    username: 'sophia_uxdesign',
    email: 'sophia@designstudio.demo',
    displayName: 'Sophia Martinez',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Senior UX Designer at Airbnb. Design systems architect. Creating delightful user experiences that solve real problems. IDEO alum.',
    location: 'San Francisco, CA',
    website: 'https://sophiamartinez.design',
    joinedAt: new Date('2023-02-28'),
    isVerified: true,
    followersCount: 11200,
    followingCount: 1100,
    postsCount: 267
  },
  {
    id: 'user-007',
    username: 'james_visualdesign',
    email: 'james@creativecollective.demo',
    displayName: 'James Wilson',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Visual designer & brand strategist. Crafting memorable brand identities for startups and Fortune 500 companies. Adobe Creative Suite master.',
    location: 'Brooklyn, NY',
    website: 'https://jameswilson.creative',
    joinedAt: new Date('2023-03-15'),
    isVerified: false,
    followersCount: 8600,
    followingCount: 890,
    postsCount: 345
  },
  {
    id: 'user-008',
    username: 'rachel_entrepreneur',
    email: 'rachel@startupventures.demo',
    displayName: 'Rachel Thompson',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Serial entrepreneur & startup mentor. Founded 3 companies, 2 successful exits. Angel investor. Helping founders build scalable businesses.',
    location: 'Boston, MA',
    website: 'https://rachelthompson.ventures',
    joinedAt: new Date('2023-01-20'),
    isVerified: true,
    followersCount: 18900,
    followingCount: 1200,
    postsCount: 345
  }
];

// Enhanced demo groups
export const demoGroups: Group[] = [
  {
    id: 'group-001',
    name: 'AI Founders Circle',
    description: 'Exclusive community for AI startup founders and researchers. Share insights, collaborate on breakthrough technologies, and shape the future of artificial intelligence.',
    avatar: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 2847,
    postsCount: 1234,
    isPrivate: true,
    createdAt: new Date('2023-01-15'),
    createdBy: 'user-001',
    tags: ['AI', 'Machine Learning', 'Startups', 'Research', 'Innovation']
  },
  {
    id: 'group-002',
    name: 'Full-Stack Developers United',
    description: 'The largest community of full-stack developers sharing code, best practices, and career advice. From junior devs to senior architects.',
    avatar: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 15600,
    postsCount: 8900,
    isPrivate: false,
    createdAt: new Date('2023-02-01'),
    createdBy: 'user-002',
    tags: ['Full-Stack', 'React', 'Node.js', 'JavaScript', 'Web Development']
  },
  {
    id: 'group-003',
    name: 'UX Design Masters',
    description: 'Elite community of UX designers from top tech companies. Share case studies, design critiques, and career growth strategies.',
    avatar: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 12400,
    postsCount: 5678,
    isPrivate: true,
    createdAt: new Date('2023-02-15'),
    createdBy: 'user-006',
    tags: ['UX Design', 'User Research', 'Design Systems', 'Figma', 'Prototyping']
  },
  {
    id: 'group-004',
    name: 'Startup Founders Network',
    description: 'Exclusive network of startup founders sharing experiences, challenges, and victories. From idea to IPO, we support each other.',
    avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 5600,
    postsCount: 3400,
    isPrivate: true,
    createdAt: new Date('2023-01-25'),
    createdBy: 'user-008',
    tags: ['Startups', 'Entrepreneurship', 'Funding', 'Growth', 'Leadership']
  }
];

// Enhanced demo events
export const demoEvents: Event[] = [
  {
    id: 'event-001',
    title: 'AI Summit 2024: The Future of Intelligent Systems',
    description: 'Join leading AI researchers, startup founders, and industry experts for a deep dive into the latest breakthroughs in artificial intelligence. Featuring keynotes from OpenAI, Google DeepMind, and Anthropic.\n\nTopics include:\n• Large Language Models and AGI\n• Computer Vision and Robotics\n• AI Ethics and Safety\n• Startup Funding in AI\n• Hands-on ML Workshops',
    startDate: new Date('2024-03-15T09:00:00'),
    endDate: new Date('2024-03-17T18:00:00'),
    location: 'Moscone Center, San Francisco, CA',
    isVirtual: false,
    organizerId: 'user-001',
    organizer: demoUsers[0],
    attendeesCount: 1247,
    maxAttendees: 1500,
    isAttending: true,
    tags: ['AI', 'Machine Learning', 'Conference', 'Networking', 'Innovation'],
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'event-002',
    title: 'React Advanced Patterns Workshop',
    description: 'Master advanced React patterns and performance optimization techniques in this intensive 2-day workshop. Perfect for senior developers looking to level up their skills.\n\nWhat you\'ll learn:\n• Advanced Hooks patterns\n• State management with Zustand\n• Performance optimization\n• Testing strategies\n• Real-world project architecture',
    startDate: new Date('2024-02-20T10:00:00'),
    endDate: new Date('2024-02-21T17:00:00'),
    location: 'Virtual Event',
    isVirtual: true,
    meetingUrl: 'https://zoom.us/j/react-workshop-2024',
    organizerId: 'user-002',
    organizer: demoUsers[1],
    attendeesCount: 456,
    maxAttendees: 500,
    isAttending: false,
    tags: ['React', 'JavaScript', 'Workshop', 'Advanced', 'Performance'],
    createdAt: new Date('2024-01-05')
  },
  {
    id: 'event-003',
    title: 'Design Systems Conference 2024',
    description: 'The premier event for design systems practitioners. Learn from teams at Airbnb, Spotify, and Shopify about building scalable design languages.\n\nConference highlights:\n• Design token strategies\n• Component API design\n• Cross-platform systems\n• Design-dev collaboration\n• Figma advanced techniques',
    startDate: new Date('2024-05-22T09:00:00'),
    endDate: new Date('2024-05-23T17:00:00'),
    location: 'Design Museum, London, UK',
    isVirtual: false,
    organizerId: 'user-006',
    organizer: demoUsers[5],
    attendeesCount: 678,
    maxAttendees: 800,
    isAttending: false,
    tags: ['Design Systems', 'UX', 'Figma', 'Conference', 'Best Practices'],
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'event-004',
    title: 'Startup Pitch Competition & Demo Day',
    description: 'Present your startup to top VCs and angel investors. Compete for $100K in funding and mentorship opportunities from successful entrepreneurs.\n\nEvent features:\n• Pitch presentations (5 min + Q&A)\n• Investor networking\n• Mentorship sessions\n• Startup exhibition\n• Awards ceremony',
    startDate: new Date('2024-04-25T13:00:00'),
    endDate: new Date('2024-04-25T20:00:00'),
    location: 'Innovation Hub, Boston, MA',
    isVirtual: false,
    organizerId: 'user-008',
    organizer: demoUsers[7],
    attendeesCount: 156,
    maxAttendees: 200,
    isAttending: true,
    tags: ['Startup', 'Pitch', 'Funding', 'Competition', 'Investors'],
    createdAt: new Date('2024-01-30')
  }
];

// Enhanced demo posts
export const demoPosts: Post[] = [
  {
    id: 'post-001',
    content: '🚀 Just shipped our new AI-powered code review tool! After 6 months of development, we\'re seeing 40% faster code reviews and 60% fewer bugs making it to production.\n\nKey features:\n• Automated security vulnerability detection\n• Performance optimization suggestions\n• Code style consistency checks\n• Integration with GitHub, GitLab, and Bitbucket\n\nThe future of software development is here, and it\'s AI-assisted! 🤖\n\n#AI #CodeReview #DevTools #Productivity',
    authorId: 'user-001',
    author: demoUsers[0],
    groupId: 'group-001',
    group: demoGroups[0],
    attachments: [
      {
        id: 'att-001',
        type: 'image',
        url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
        filename: 'ai-code-review-dashboard.png',
        size: 2048000
      }
    ],
    likesCount: 342,
    commentsCount: 89,
    sharesCount: 67,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date('2024-01-15T14:30:00'),
    updatedAt: new Date('2024-01-15T14:30:00')
  },
  {
    id: 'post-002',
    content: 'Hot take: React Server Components are going to fundamentally change how we build web applications. 🔥\n\nAfter migrating our dashboard to RSC, we\'ve seen:\n• 70% reduction in bundle size\n• 50% faster initial page loads\n• Simplified data fetching patterns\n• Better SEO out of the box\n\nThe learning curve is steep, but the benefits are massive. Who else is experimenting with RSC?\n\n#React #ServerComponents #WebDev #Performance',
    authorId: 'user-002',
    author: demoUsers[1],
    groupId: 'group-002',
    group: demoGroups[1],
    attachments: [],
    likesCount: 256,
    commentsCount: 134,
    sharesCount: 45,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date('2024-01-14T10:15:00'),
    updatedAt: new Date('2024-01-14T10:15:00')
  },
  {
    id: 'post-003',
    content: '🎨 Design systems aren\'t just about components - they\'re about creating a shared language for your entire organization.\n\nAfter 2 years building Airbnb\'s design system, here are the key lessons:\n\n1. Start with principles, not components\n2. Design tokens are your foundation\n3. Documentation is as important as code\n4. Governance prevents chaos\n5. Adoption requires evangelism\n\nThe best design systems feel invisible - they just work. ✨\n\n#DesignSystems #UX #Figma #DesignTokens #Collaboration',
    authorId: 'user-006',
    author: demoUsers[5],
    groupId: 'group-003',
    group: demoGroups[2],
    attachments: [
      {
        id: 'att-002',
        type: 'image',
        url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
        filename: 'design-system-components.png',
        size: 2304000
      }
    ],
    likesCount: 445,
    commentsCount: 123,
    sharesCount: 89,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date('2024-01-10T11:30:00'),
    updatedAt: new Date('2024-01-10T11:30:00')
  },
  {
    id: 'post-004',
    content: '📊 Startup milestone: We just hit $1M ARR! 🎉\n\nThe journey from idea to $1M ARR in 18 months:\n\nMonth 1-3: Product development & validation\nMonth 4-6: First customers & product-market fit\nMonth 7-12: Scaling sales & marketing\nMonth 13-18: Optimizing operations & growth\n\nKey lessons learned:\n• Talk to customers obsessively\n• Hire slowly, fire quickly\n• Focus on retention over acquisition\n• Cash flow is king\n• Culture eats strategy for breakfast\n\nNext stop: $10M ARR! 🚀\n\n#Startup #Milestone #Growth #Entrepreneurship #ARR',
    authorId: 'user-008',
    author: demoUsers[7],
    groupId: 'group-004',
    group: demoGroups[3],
    attachments: [
      {
        id: 'att-003',
        type: 'image',
        url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
        filename: 'arr-milestone-chart.png',
        size: 1920000
      }
    ],
    likesCount: 789,
    commentsCount: 156,
    sharesCount: 123,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date('2024-01-06T14:00:00'),
    updatedAt: new Date('2024-01-06T14:00:00')
  },
  {
    id: 'post-005',
    content: '🔧 DevOps tip: Implementing GitOps with ArgoCD has been a game-changer for our deployment pipeline.\n\nBefore GitOps:\n• Manual deployments prone to errors\n• Inconsistent environments\n• No audit trail\n• Rollbacks were painful\n\nAfter GitOps:\n• Declarative deployments\n• Git as single source of truth\n• Automatic drift detection\n• One-click rollbacks\n\nIf you\'re still doing manual deployments in 2024, you\'re missing out!\n\n#DevOps #GitOps #ArgoCD #Kubernetes #Automation',
    authorId: 'user-005',
    author: demoUsers[4],
    groupId: 'group-002',
    group: demoGroups[1],
    attachments: [],
    likesCount: 234,
    commentsCount: 78,
    sharesCount: 56,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date('2024-01-11T13:10:00'),
    updatedAt: new Date('2024-01-11T13:10:00')
  }
];

// Enhanced demo comments
export const demoComments: Record<string, Comment[]> = {
  'post-001': [
    {
      id: 'comment-001',
      content: 'This is incredible! How does it handle false positives? We\'ve been struggling with our current tool flagging too many non-issues.',
      authorId: 'user-002',
      author: demoUsers[1],
      postId: 'post-001',
      likesCount: 12,
      isLiked: false,
      createdAt: new Date('2024-01-15T15:00:00')
    },
    {
      id: 'comment-002',
      content: 'Great question! We trained our model on 50M+ lines of production code to minimize false positives. Currently seeing <5% false positive rate.',
      authorId: 'user-001',
      author: demoUsers[0],
      postId: 'post-001',
      likesCount: 8,
      isLiked: true,
      createdAt: new Date('2024-01-15T15:15:00')
    },
    {
      id: 'comment-003',
      content: 'Would love to beta test this with our team! Do you have an API for custom integrations?',
      authorId: 'user-005',
      author: demoUsers[4],
      postId: 'post-001',
      likesCount: 5,
      isLiked: false,
      createdAt: new Date('2024-01-15T16:30:00')
    }
  ],
  'post-002': [
    {
      id: 'comment-004',
      content: 'We\'re seeing similar results! The mental model shift from client-side to server-side rendering is challenging but worth it.',
      authorId: 'user-005',
      author: demoUsers[4],
      postId: 'post-002',
      likesCount: 23,
      isLiked: true,
      createdAt: new Date('2024-01-14T11:00:00')
    },
    {
      id: 'comment-005',
      content: 'Any tips for handling authentication with RSC? That\'s been our biggest pain point.',
      authorId: 'user-007',
      author: demoUsers[6],
      postId: 'post-002',
      likesCount: 15,
      isLiked: false,
      createdAt: new Date('2024-01-14T12:45:00')
    }
  ],
  'post-003': [
    {
      id: 'comment-006',
      content: 'This resonates so much! We spent 6 months building components before establishing principles. Had to rebuild everything.',
      authorId: 'user-007',
      author: demoUsers[6],
      postId: 'post-003',
      likesCount: 34,
      isLiked: true,
      createdAt: new Date('2024-01-10T12:15:00')
    }
  ],
  'post-004': [
    {
      id: 'comment-007',
      content: 'Congratulations! 🎉 The customer obsession point is so important. How many customer interviews did you do in the early days?',
      authorId: 'user-001',
      author: demoUsers[0],
      postId: 'post-004',
      likesCount: 45,
      isLiked: true,
      createdAt: new Date('2024-01-06T15:30:00')
    }
  ]
};

// Featured content
export const featuredContent = [
  {
    id: 'featured-001',
    type: 'post',
    title: 'AI-Powered Code Review Revolution',
    description: 'How AI is transforming software development workflows',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: demoUsers[0],
    engagement: 498,
    createdAt: new Date('2024-01-15T14:30:00')
  },
  {
    id: 'featured-002',
    type: 'event',
    title: 'AI Summit 2024',
    description: 'The premier AI conference for founders and researchers',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: demoUsers[0],
    engagement: 1247,
    createdAt: new Date('2024-01-10T09:00:00')
  }
];

// Media gallery
export const mediaGallery = {
  images: [
    {
      id: 'img-001',
      url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'AI Code Review Dashboard',
      description: 'Screenshot of our AI-powered code review tool',
      uploadedBy: demoUsers[0],
      uploadedAt: new Date('2024-01-15T14:30:00')
    },
    {
      id: 'img-002',
      url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Design System Components',
      description: 'Visual overview of our design system components',
      uploadedBy: demoUsers[5],
      uploadedAt: new Date('2024-01-10T11:30:00')
    }
  ],
  videos: [
    {
      id: 'vid-001',
      url: 'https://example.com/videos/ai-summit-promo.mp4',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'AI Summit 2024 Promo',
      description: 'Promotional video for the upcoming AI Summit 2024',
      duration: '1:30',
      uploadedBy: demoUsers[0],
      uploadedAt: new Date('2024-01-10T09:00:00')
    }
  ]
};

// Activity logs
export const activityLogs = [
  {
    id: 'activity-001',
    userId: 'user-001',
    type: 'post_created',
    description: 'Published a new post about AI-powered code review',
    timestamp: new Date('2024-01-15T14:30:00'),
    metadata: { postId: 'post-001' }
  },
  {
    id: 'activity-002',
    userId: 'user-002',
    type: 'comment_created',
    description: 'Commented on Sarah\'s AI code review post',
    timestamp: new Date('2024-01-15T15:00:00'),
    metadata: { postId: 'post-001', commentId: 'comment-001' }
  },
  {
    id: 'activity-003',
    userId: 'user-006',
    type: 'event_created',
    description: 'Created Design Systems Conference 2024 event',
    timestamp: new Date('2024-02-01T10:00:00'),
    metadata: { eventId: 'event-003' }
  }
];

// Engagement metrics
export const engagementMetrics = {
  totalUsers: demoUsers.length,
  totalGroups: demoGroups.length,
  totalEvents: demoEvents.length,
  totalPosts: demoPosts.length,
  totalComments: Object.values(demoComments).flat().length,
  dailyActiveUsers: 1847,
  weeklyActiveUsers: 5623,
  monthlyActiveUsers: 12456,
  averageSessionDuration: '23 minutes',
  topCategories: [
    { name: 'Tech Innovation', engagement: 89 },
    { name: 'Creative Design', engagement: 76 },
    { name: 'Business Growth', engagement: 82 }
  ],
  growthRate: '+23% MoM'
};

// Trending topics
export const trendingTopics = [
  { tag: 'AI', posts: 1247, growth: '+34%' },
  { tag: 'React', posts: 892, growth: '+18%' },
  { tag: 'DesignSystems', posts: 567, growth: '+45%' },
  { tag: 'Startup', posts: 445, growth: '+28%' },
  { tag: 'GrowthHacking', posts: 334, growth: '+67%' },
  { tag: 'UXDesign', posts: 289, growth: '+23%' },
  { tag: 'Blockchain', posts: 234, growth: '+12%' },
  { tag: 'DevOps', posts: 198, growth: '+56%' }
];

// Export all demo data
const comprehensiveDemoData = {
  users: demoUsers,
  groups: demoGroups,
  events: demoEvents,
  posts: demoPosts,
  comments: demoComments,
  featuredContent,
  mediaGallery,
  activityLogs,
  engagementMetrics,
  trendingTopics
};

export default comprehensiveDemoData;