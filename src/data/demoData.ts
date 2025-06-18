import type { User, Group, Event, Post, Comment } from '../types';

// ===== MAIN CATEGORIES =====

export const categories = [
  {
    id: 'tech-innovation',
    name: 'Tech Innovation',
    description: 'Cutting-edge technology, startups, and digital transformation',
    color: 'from-blue-500 to-cyan-500',
    icon: '💻'
  },
  {
    id: 'creative-design',
    name: 'Creative Design',
    description: 'UI/UX design, visual arts, and creative expression',
    color: 'from-purple-500 to-pink-500',
    icon: '🎨'
  },
  {
    id: 'business-growth',
    name: 'Business Growth',
    description: 'Entrepreneurship, marketing, and business strategy',
    color: 'from-green-500 to-emerald-500',
    icon: '📈'
  }
];

// ===== USERS =====

export const demoUsers: User[] = [
  // Tech Innovation Users
  {
    id: 'user-001',
    username: 'sarah_techfounder',
    email: 'sarah@techstartup.com',
    displayName: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverPhoto: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Serial entrepreneur & AI researcher. Building the future of human-computer interaction. Previously founded 2 successful startups (acquired by Google & Meta). MIT CS grad.',
    location: 'San Francisco, CA',
    website: 'https://sarahchen.tech',
    joinedAt: new Date('2023-01-15'),
    isVerified: true,
    followersCount: 12500,
    followingCount: 890,
    postsCount: 234
  },
  {
    id: 'user-002',
    username: 'alex_fullstack',
    email: 'alex@devstudio.com',
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
    email: 'mike@ailab.edu',
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
    email: 'lisa@cryptoventures.com',
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
    email: 'david@cloudnative.io',
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
    username: 'emma_cybersec',
    email: 'emma@securityfirst.com',
    displayName: 'Emma Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Cybersecurity expert & ethical hacker. CISSP certified. Protecting digital infrastructure from advanced threats. Bug bounty hunter.',
    location: 'Washington, DC',
    website: 'https://emmajohnson.security',
    joinedAt: new Date('2023-06-18'),
    isVerified: true,
    followersCount: 7800,
    followingCount: 234,
    postsCount: 145
  },
  {
    id: 'user-007',
    username: 'ryan_mobile',
    email: 'ryan@mobileapps.dev',
    displayName: 'Ryan O\'Connor',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Mobile app developer specializing in React Native & Flutter. Built 20+ apps with 10M+ downloads. iOS & Android expert.',
    location: 'Los Angeles, CA',
    joinedAt: new Date('2023-07-22'),
    isVerified: false,
    followersCount: 5400,
    followingCount: 678,
    postsCount: 203
  },
  {
    id: 'user-008',
    username: 'priya_datascience',
    email: 'priya@datainsights.ai',
    displayName: 'Priya Patel',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Data scientist & ML engineer. PhD in Statistics from Berkeley. Turning data into actionable business insights. Python & R expert.',
    location: 'San Jose, CA',
    website: 'https://priyapatel.data',
    joinedAt: new Date('2023-08-14'),
    isVerified: false,
    followersCount: 4900,
    followingCount: 567,
    postsCount: 178
  },

  // Creative Design Users
  {
    id: 'user-009',
    username: 'sophia_uxdesign',
    email: 'sophia@designstudio.com',
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
    id: 'user-010',
    username: 'james_visualdesign',
    email: 'james@creativecollective.com',
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
    id: 'user-011',
    username: 'maya_productdesign',
    email: 'maya@designthinking.io',
    displayName: 'Maya Singh',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Product designer focused on accessibility & inclusive design. Design thinking facilitator. Making technology accessible to everyone.',
    location: 'Toronto, ON',
    website: 'https://mayasingh.design',
    joinedAt: new Date('2023-04-20'),
    isVerified: true,
    followersCount: 7300,
    followingCount: 654,
    postsCount: 198
  },
  {
    id: 'user-012',
    username: 'carlos_motiondesign',
    email: 'carlos@animationstudio.com',
    displayName: 'Carlos Mendez',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Motion designer & 3D artist. Creating stunning animations for brands and films. After Effects & Cinema 4D specialist.',
    location: 'Mexico City, MX',
    website: 'https://carlosmendez.motion',
    joinedAt: new Date('2023-05-30'),
    isVerified: false,
    followersCount: 6800,
    followingCount: 445,
    postsCount: 234
  },
  {
    id: 'user-013',
    username: 'anna_designsystem',
    email: 'anna@systemdesign.com',
    displayName: 'Anna Kowalski',
    avatar: 'https://images.pexels.com/photos/1181717/pexels-photo-1181717.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Design systems lead at Spotify. Building scalable design languages. Figma community advocate. Design tokens evangelist.',
    location: 'Stockholm, SE',
    website: 'https://annakowalski.systems',
    joinedAt: new Date('2023-06-25'),
    isVerified: true,
    followersCount: 9400,
    followingCount: 567,
    postsCount: 156
  },
  {
    id: 'user-014',
    username: 'tom_webdesign',
    email: 'tom@webstudio.design',
    displayName: 'Tom Anderson',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Web designer & front-end developer. Creating beautiful, responsive websites. CSS Grid & Flexbox expert. Webflow certified.',
    location: 'London, UK',
    website: 'https://tomanderson.web',
    joinedAt: new Date('2023-07-10'),
    isVerified: false,
    followersCount: 5600,
    followingCount: 789,
    postsCount: 287
  },
  {
    id: 'user-015',
    username: 'zoe_illustration',
    email: 'zoe@digitalart.studio',
    displayName: 'Zoe Chen',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Digital illustrator & concept artist. Creating whimsical characters and fantastical worlds. Procreate & Photoshop artist.',
    location: 'Vancouver, BC',
    website: 'https://zoechen.art',
    joinedAt: new Date('2023-08-05'),
    isVerified: false,
    followersCount: 4200,
    followingCount: 334,
    postsCount: 412
  },
  {
    id: 'user-016',
    username: 'lucas_gamedesign',
    email: 'lucas@indiegames.dev',
    displayName: 'Lucas Brown',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Indie game designer & developer. Creating immersive gaming experiences. Unity & Unreal Engine expert. Published 5 indie games.',
    location: 'Montreal, QC',
    website: 'https://lucasbrown.games',
    joinedAt: new Date('2023-09-12'),
    isVerified: false,
    followersCount: 3800,
    followingCount: 456,
    postsCount: 189
  },

  // Business Growth Users
  {
    id: 'user-017',
    username: 'rachel_entrepreneur',
    email: 'rachel@startupventures.com',
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
  },
  {
    id: 'user-018',
    username: 'mark_growth',
    email: 'mark@growthhacking.io',
    displayName: 'Mark Davis',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Growth hacker & digital marketing strategist. Scaled 10+ startups from 0 to $10M ARR. Data-driven growth expert. Y Combinator alum.',
    location: 'San Francisco, CA',
    website: 'https://markdavis.growth',
    joinedAt: new Date('2023-02-14'),
    isVerified: true,
    followersCount: 14500,
    followingCount: 890,
    postsCount: 278
  },
  {
    id: 'user-019',
    username: 'jennifer_sales',
    email: 'jennifer@salesexcellence.com',
    displayName: 'Jennifer Lee',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'VP of Sales at Salesforce. B2B sales expert. Built and led sales teams that generated $100M+ in revenue. Sales methodology trainer.',
    location: 'Chicago, IL',
    website: 'https://jenniferlee.sales',
    joinedAt: new Date('2023-03-08'),
    isVerified: true,
    followersCount: 12800,
    followingCount: 567,
    postsCount: 234
  },
  {
    id: 'user-020',
    username: 'kevin_finance',
    email: 'kevin@financestrategies.com',
    displayName: 'Kevin Park',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'CFO & financial strategist. Helped 50+ startups raise $500M+ in funding. Former investment banker at Goldman Sachs. CPA & CFA.',
    location: 'New York, NY',
    website: 'https://kevinpark.finance',
    joinedAt: new Date('2023-04-12'),
    isVerified: true,
    followersCount: 11600,
    followingCount: 445,
    postsCount: 167
  },
  {
    id: 'user-021',
    username: 'amanda_marketing',
    email: 'amanda@brandstrategies.com',
    displayName: 'Amanda Rodriguez',
    avatar: 'https://images.pexels.com/photos/1181717/pexels-photo-1181717.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Brand strategist & content marketing expert. Built viral campaigns for Fortune 500 brands. Social media marketing specialist.',
    location: 'Miami, FL',
    website: 'https://amandarodriguez.brand',
    joinedAt: new Date('2023-05-18'),
    isVerified: false,
    followersCount: 9200,
    followingCount: 678,
    postsCount: 298
  },
  {
    id: 'user-022',
    username: 'steve_operations',
    email: 'steve@operationsexcellence.com',
    displayName: 'Steve Johnson',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Operations director & process optimization expert. Lean Six Sigma Black Belt. Scaled operations for high-growth startups.',
    location: 'Denver, CO',
    website: 'https://stevejohnson.ops',
    joinedAt: new Date('2023-06-22'),
    isVerified: false,
    followersCount: 7400,
    followingCount: 334,
    postsCount: 189
  },
  {
    id: 'user-023',
    username: 'natalie_hr',
    email: 'natalie@talentstrategies.com',
    displayName: 'Natalie Williams',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'HR director & talent acquisition specialist. Built high-performing teams at unicorn startups. Culture and leadership development expert.',
    location: 'Portland, OR',
    website: 'https://nataliewilliams.talent',
    joinedAt: new Date('2023-07-28'),
    isVerified: false,
    followersCount: 6800,
    followingCount: 567,
    postsCount: 234
  },
  {
    id: 'user-024',
    username: 'daniel_consulting',
    email: 'daniel@strategyconsulting.com',
    displayName: 'Daniel Garcia',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Management consultant & business strategist. Former McKinsey partner. Helping companies navigate digital transformation.',
    location: 'Dallas, TX',
    website: 'https://danielgarcia.consulting',
    joinedAt: new Date('2023-08-15'),
    isVerified: true,
    followersCount: 10300,
    followingCount: 445,
    postsCount: 156
  }
];

// ===== GROUPS =====

export const demoGroups: Group[] = [
  // Tech Innovation Groups
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
    name: 'Blockchain Builders',
    description: 'Decentralized community of blockchain developers, DeFi architects, and crypto entrepreneurs building the future of finance.',
    avatar: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 8934,
    postsCount: 3456,
    isPrivate: false,
    createdAt: new Date('2023-03-10'),
    createdBy: 'user-004',
    tags: ['Blockchain', 'DeFi', 'Ethereum', 'Smart Contracts', 'Crypto']
  },

  // Creative Design Groups
  {
    id: 'group-004',
    name: 'UX Design Masters',
    description: 'Elite community of UX designers from top tech companies. Share case studies, design critiques, and career growth strategies.',
    avatar: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 12400,
    postsCount: 5678,
    isPrivate: true,
    createdAt: new Date('2023-02-15'),
    createdBy: 'user-009',
    tags: ['UX Design', 'User Research', 'Design Systems', 'Figma', 'Prototyping']
  },
  {
    id: 'group-005',
    name: 'Creative Collective',
    description: 'Diverse community of visual designers, illustrators, and digital artists. Showcase your work, get feedback, and find collaboration opportunities.',
    avatar: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 18700,
    postsCount: 12300,
    isPrivate: false,
    createdAt: new Date('2023-03-01'),
    createdBy: 'user-010',
    tags: ['Visual Design', 'Illustration', 'Branding', 'Typography', 'Digital Art']
  },
  {
    id: 'group-006',
    name: 'Motion Design Studio',
    description: 'Community for motion designers, animators, and video creators. Share techniques, tools, and stunning visual storytelling.',
    avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 7800,
    postsCount: 4200,
    isPrivate: false,
    createdAt: new Date('2023-04-20'),
    createdBy: 'user-012',
    tags: ['Motion Design', 'Animation', 'After Effects', '3D', 'Video']
  },

  // Business Growth Groups
  {
    id: 'group-007',
    name: 'Startup Founders Network',
    description: 'Exclusive network of startup founders sharing experiences, challenges, and victories. From idea to IPO, we support each other.',
    avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 5600,
    postsCount: 3400,
    isPrivate: true,
    createdAt: new Date('2023-01-25'),
    createdBy: 'user-017',
    tags: ['Startups', 'Entrepreneurship', 'Funding', 'Growth', 'Leadership']
  },
  {
    id: 'group-008',
    name: 'Growth Hackers Alliance',
    description: 'Data-driven marketers and growth experts sharing tactics, experiments, and results. Scale your business with proven strategies.',
    avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 11200,
    postsCount: 6700,
    isPrivate: false,
    createdAt: new Date('2023-02-10'),
    createdBy: 'user-018',
    tags: ['Growth Hacking', 'Marketing', 'Analytics', 'Conversion', 'Scaling']
  },
  {
    id: 'group-009',
    name: 'Sales Excellence Hub',
    description: 'B2B sales professionals sharing strategies, tools, and success stories. From SDRs to VPs of Sales, elevate your sales game.',
    avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    membersCount: 9400,
    postsCount: 4800,
    isPrivate: false,
    createdAt: new Date('2023-03-05'),
    createdBy: 'user-019',
    tags: ['Sales', 'B2B', 'CRM', 'Lead Generation', 'Revenue']
  }
];

// ===== EVENTS =====

export const demoEvents: Event[] = [
  // Tech Innovation Events
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
    groupId: 'group-001',
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
    groupId: 'group-002',
    attendeesCount: 456,
    maxAttendees: 500,
    isAttending: false,
    tags: ['React', 'JavaScript', 'Workshop', 'Advanced', 'Performance'],
    createdAt: new Date('2024-01-05')
  },
  {
    id: 'event-003',
    title: 'DeFi Developer Bootcamp',
    description: 'Learn to build decentralized finance applications from scratch. This intensive bootcamp covers smart contract development, DeFi protocols, and security best practices.\n\nBootcamp includes:\n• Solidity fundamentals\n• DeFi protocol design\n• Smart contract security\n• Frontend integration\n• Live project deployment',
    startDate: new Date('2024-04-08T09:00:00'),
    endDate: new Date('2024-04-12T18:00:00'),
    location: 'Blockchain Hub, Austin, TX',
    isVirtual: false,
    organizerId: 'user-004',
    organizer: demoUsers[3],
    groupId: 'group-003',
    attendeesCount: 89,
    maxAttendees: 120,
    isAttending: true,
    tags: ['Blockchain', 'DeFi', 'Solidity', 'Bootcamp', 'Hands-on'],
    createdAt: new Date('2024-01-20')
  },

  // Creative Design Events
  {
    id: 'event-004',
    title: 'Design Systems Conference 2024',
    description: 'The premier event for design systems practitioners. Learn from teams at Airbnb, Spotify, and Shopify about building scalable design languages.\n\nConference highlights:\n• Design token strategies\n• Component API design\n• Cross-platform systems\n• Design-dev collaboration\n• Figma advanced techniques',
    startDate: new Date('2024-05-22T09:00:00'),
    endDate: new Date('2024-05-23T17:00:00'),
    location: 'Design Museum, London, UK',
    isVirtual: false,
    organizerId: 'user-009',
    organizer: demoUsers[8],
    groupId: 'group-004',
    attendeesCount: 678,
    maxAttendees: 800,
    isAttending: false,
    tags: ['Design Systems', 'UX', 'Figma', 'Conference', 'Best Practices'],
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'event-005',
    title: 'Creative Portfolio Review Session',
    description: 'Get personalized feedback on your creative portfolio from industry experts. Open to designers, illustrators, and digital artists of all levels.\n\nSession includes:\n• 1-on-1 portfolio reviews\n• Industry insights and trends\n• Career guidance\n• Networking opportunities\n• Portfolio optimization tips',
    startDate: new Date('2024-03-10T14:00:00'),
    endDate: new Date('2024-03-10T18:00:00'),
    location: 'Creative Space, Brooklyn, NY',
    isVirtual: false,
    organizerId: 'user-010',
    organizer: demoUsers[9],
    groupId: 'group-005',
    attendeesCount: 234,
    maxAttendees: 300,
    isAttending: true,
    tags: ['Portfolio', 'Review', 'Feedback', 'Career', 'Networking'],
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'event-006',
    title: 'Motion Design Masterclass: After Effects to Cinema 4D',
    description: 'Elevate your motion design skills with this comprehensive masterclass covering 2D to 3D workflows, advanced animation techniques, and industry secrets.\n\nMasterclass covers:\n• Advanced After Effects techniques\n• Cinema 4D integration\n• 3D animation principles\n• Rendering optimization\n• Client workflow management',
    startDate: new Date('2024-06-05T10:00:00'),
    endDate: new Date('2024-06-07T16:00:00'),
    location: 'Virtual Event',
    isVirtual: true,
    meetingUrl: 'https://zoom.us/j/motion-masterclass-2024',
    organizerId: 'user-012',
    organizer: demoUsers[11],
    groupId: 'group-006',
    attendeesCount: 345,
    maxAttendees: 400,
    isAttending: false,
    tags: ['Motion Design', 'After Effects', 'Cinema 4D', 'Masterclass', '3D'],
    createdAt: new Date('2024-02-20')
  },

  // Business Growth Events
  {
    id: 'event-007',
    title: 'Startup Pitch Competition & Demo Day',
    description: 'Present your startup to top VCs and angel investors. Compete for $100K in funding and mentorship opportunities from successful entrepreneurs.\n\nEvent features:\n• Pitch presentations (5 min + Q&A)\n• Investor networking\n• Mentorship sessions\n• Startup exhibition\n• Awards ceremony',
    startDate: new Date('2024-04-25T13:00:00'),
    endDate: new Date('2024-04-25T20:00:00'),
    location: 'Innovation Hub, Boston, MA',
    isVirtual: false,
    organizerId: 'user-017',
    organizer: demoUsers[16],
    groupId: 'group-007',
    attendeesCount: 156,
    maxAttendees: 200,
    isAttending: true,
    tags: ['Startup', 'Pitch', 'Funding', 'Competition', 'Investors'],
    createdAt: new Date('2024-01-30')
  },
  {
    id: 'event-008',
    title: 'Growth Hacking Intensive: 0 to $1M ARR',
    description: 'Learn the exact strategies and tactics used to scale startups from zero to $1M ARR. Featuring case studies from successful growth hackers.\n\nIntensive includes:\n• Growth framework development\n• Acquisition channel optimization\n• Retention and engagement strategies\n• Analytics and measurement\n• Hands-on growth experiments',
    startDate: new Date('2024-03-28T09:00:00'),
    endDate: new Date('2024-03-29T17:00:00'),
    location: 'Growth Academy, San Francisco, CA',
    isVirtual: false,
    organizerId: 'user-018',
    organizer: demoUsers[17],
    groupId: 'group-008',
    attendeesCount: 289,
    maxAttendees: 350,
    isAttending: false,
    tags: ['Growth Hacking', 'Scaling', 'Marketing', 'Analytics', 'Strategy'],
    createdAt: new Date('2024-02-05')
  },
  {
    id: 'event-009',
    title: 'B2B Sales Mastery Workshop',
    description: 'Transform your B2B sales approach with proven methodologies from top-performing sales teams. Perfect for sales reps, managers, and founders.\n\nWorkshop covers:\n• Modern sales methodologies\n• Prospecting and lead qualification\n• Demo and presentation skills\n• Objection handling\n• Closing techniques and negotiation',
    startDate: new Date('2024-05-15T10:00:00'),
    endDate: new Date('2024-05-16T16:00:00'),
    location: 'Sales Training Center, Chicago, IL',
    isVirtual: false,
    organizerId: 'user-019',
    organizer: demoUsers[18],
    groupId: 'group-009',
    attendeesCount: 167,
    maxAttendees: 200,
    isAttending: true,
    tags: ['Sales', 'B2B', 'Workshop', 'Training', 'Skills'],
    createdAt: new Date('2024-02-10')
  }
];

// ===== POSTS =====

export const demoPosts: Post[] = [
  // Tech Innovation Posts
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
    content: '🧠 Mind-blowing paper alert! "Attention Is All You Need" turns 7 years old today, and it\'s still revolutionizing AI.\n\nThis paper introduced the Transformer architecture that powers:\n• GPT models (ChatGPT, GPT-4)\n• BERT and language understanding\n• DALL-E and image generation\n• Code generation tools like GitHub Copilot\n\nSometimes the most elegant solutions are the most powerful. The attention mechanism replaced complex RNNs with simple matrix operations.\n\nWhat\'s your favorite AI paper that changed everything?\n\n#AI #MachineLearning #Transformers #Research #Innovation',
    authorId: 'user-003',
    author: demoUsers[2],
    groupId: 'group-001',
    group: demoGroups[0],
    attachments: [
      {
        id: 'att-002',
        type: 'image',
        url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
        filename: 'transformer-architecture.png',
        size: 1536000
      }
    ],
    likesCount: 189,
    commentsCount: 67,
    sharesCount: 89,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date('2024-01-13T16:45:00'),
    updatedAt: new Date('2024-01-13T16:45:00')
  },
  {
    id: 'post-004',
    content: '⚡ DeFi update: Our new automated market maker just processed $10M in volume in the first 24 hours!\n\nKey innovations:\n• Dynamic fee adjustment based on volatility\n• MEV protection for retail traders\n• Cross-chain liquidity aggregation\n• Gas optimization (60% cheaper swaps)\n\nThe future of finance is decentralized, and we\'re building it one protocol at a time. 🌐\n\nAudited by @trailofbits - security is our top priority.\n\n#DeFi #Blockchain #Ethereum #AMM #Innovation',
    authorId: 'user-004',
    author: demoUsers[3],
    groupId: 'group-003',
    group: demoGroups[2],
    attachments: [
      {
        id: 'att-003',
        type: 'image',
        url: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=600',
        filename: 'defi-dashboard.png',
        size: 1792000
      }
    ],
    likesCount: 167,
    commentsCount: 45,
    sharesCount: 34,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date('2024-01-12T09:20:00'),
    updatedAt: new Date('2024-01-12T09:20:00')
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
  },

  // Creative Design Posts
  {
    id: 'post-006',
    content: '🎨 Design systems aren\'t just about components - they\'re about creating a shared language for your entire organization.\n\nAfter 2 years building Airbnb\'s design system, here are the key lessons:\n\n1. Start with principles, not components\n2. Design tokens are your foundation\n3. Documentation is as important as code\n4. Governance prevents chaos\n5. Adoption requires evangelism\n\nThe best design systems feel invisible - they just work. ✨\n\n#DesignSystems #UX #Figma #DesignTokens #Collaboration',
    authorId: 'user-009',
    author: demoUsers[8],
    groupId: 'group-004',
    group: demoGroups[3],
    attachments: [
      {
        id: 'att-004',
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
    id: 'post-007',
    content: '🌈 Color psychology in UI design: Why your button colors matter more than you think.\n\nRecent A/B test results:\n• Red CTA: 12% conversion rate\n• Green CTA: 18% conversion rate\n• Blue CTA: 15% conversion rate\n• Orange CTA: 21% conversion rate (winner!)\n\nContext matters:\n• Red = urgency, danger, stop\n• Green = success, go, nature\n• Blue = trust, calm, professional\n• Orange = energy, enthusiasm, action\n\nAlways test your assumptions! 🧪\n\n#UIDesign #ColorPsychology #ConversionOptimization #ABTesting #UX',
    authorId: 'user-010',
    author: demoUsers[9],
    groupId: 'group-005',
    group: demoGroups[4],
    attachments: [
      {
        id: 'att-005',
        type: 'image',
        url: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600',
        filename: 'color-psychology-chart.png',
        size: 1280000
      }
    ],
    likesCount: 312,
    commentsCount: 67,
    sharesCount: 45,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date('2024-01-09T15:45:00'),
    updatedAt: new Date('2024-01-09T15:45:00')
  },
  {
    id: 'post-008',
    content: '♿ Accessibility isn\'t optional - it\'s essential. Here\'s how we made our design system WCAG 2.1 AA compliant:\n\n✅ Color contrast ratios (4.5:1 minimum)\n✅ Keyboard navigation for all interactions\n✅ Screen reader compatibility\n✅ Focus indicators on all focusable elements\n✅ Alternative text for all images\n✅ Semantic HTML structure\n\nResult: 23% increase in user engagement across all demographics.\n\nGood accessibility is good design for everyone! 🌟\n\n#Accessibility #InclusiveDesign #WCAG #UX #DesignSystems',
    authorId: 'user-011',
    author: demoUsers[10],
    groupId: 'group-004',
    group: demoGroups[3],
    attachments: [],
    likesCount: 278,
    commentsCount: 89,
    sharesCount: 67,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date('2024-01-08T12:20:00'),
    updatedAt: new Date('2024-01-08T12:20:00')
  },
  {
    id: 'post-009',
    content: '🎬 Just finished a motion graphics project for Netflix! Can\'t share details yet, but here are some behind-the-scenes insights:\n\n• 847 individual animation layers\n• 23 different particle systems\n• 156 hours of rendering time\n• 4K resolution at 60fps\n• Custom Cinema 4D plugins for efficiency\n\nMotion design is where art meets technology. Every frame tells a story! 🎭\n\nShoutout to the amazing team @NetflixAnimation\n\n#MotionDesign #Animation #Netflix #Cinema4D #AfterEffects #VFX',
    authorId: 'user-012',
    author: demoUsers[11],
    groupId: 'group-006',
    group: demoGroups[5],
    attachments: [
      {
        id: 'att-006',
        type: 'image',
        url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
        filename: 'motion-design-preview.png',
        size: 3072000
      }
    ],
    likesCount: 567,
    commentsCount: 134,
    sharesCount: 89,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date('2024-01-07T18:15:00'),
    updatedAt: new Date('2024-01-07T18:15:00')
  },

  // Business Growth Posts
  {
    id: 'post-010',
    content: '📊 Startup milestone: We just hit $1M ARR! 🎉\n\nThe journey from idea to $1M ARR in 18 months:\n\nMonth 1-3: Product development & validation\nMonth 4-6: First customers & product-market fit\nMonth 7-12: Scaling sales & marketing\nMonth 13-18: Optimizing operations & growth\n\nKey lessons learned:\n• Talk to customers obsessively\n• Hire slowly, fire quickly\n• Focus on retention over acquisition\n• Cash flow is king\n• Culture eats strategy for breakfast\n\nNext stop: $10M ARR! 🚀\n\n#Startup #Milestone #Growth #Entrepreneurship #ARR',
    authorId: 'user-017',
    author: demoUsers[16],
    groupId: 'group-007',
    group: demoGroups[6],
    attachments: [
      {
        id: 'att-007',
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
    id: 'post-011',
    content: '🎯 Growth hack that increased our conversion rate by 127%:\n\nWe added a simple exit-intent popup with a personalized discount code.\n\nThe magic was in the personalization:\n• First-time visitors: 10% discount\n• Returning visitors: 15% discount\n• Cart abandoners: 20% discount + free shipping\n• Previous customers: Exclusive early access\n\nResult: 127% increase in conversion rate and 89% increase in email signups.\n\nSometimes the simplest tactics are the most effective! 💡\n\n#GrowthHacking #ConversionOptimization #Ecommerce #Marketing #ABTesting',
    authorId: 'user-018',
    author: demoUsers[17],
    groupId: 'group-008',
    group: demoGroups[7],
    attachments: [],
    likesCount: 445,
    commentsCount: 89,
    sharesCount: 67,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date('2024-01-05T10:30:00'),
    updatedAt: new Date('2024-01-05T10:30:00')
  },
  {
    id: 'post-012',
    content: '💼 B2B sales truth bomb: Your prospects don\'t care about your features - they care about their problems.\n\nInstead of saying:\n"Our platform has advanced analytics"\n\nSay:\n"See exactly which marketing campaigns drive revenue, so you can double down on what works and cut what doesn\'t"\n\nThe difference:\n• Features tell\n• Benefits sell\n• Outcomes close\n\nAlways lead with the outcome your prospect wants to achieve. 🎯\n\n#B2BSales #SalesStrategy #ValueSelling #Prospecting #Revenue',
    authorId: 'user-019',
    author: demoUsers[18],
    groupId: 'group-009',
    group: demoGroups[8],
    attachments: [],
    likesCount: 356,
    commentsCount: 78,
    sharesCount: 45,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date('2024-01-04T16:20:00'),
    updatedAt: new Date('2024-01-04T16:20:00')
  }
];

// ===== COMMENTS =====

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
  'post-006': [
    {
      id: 'comment-006',
      content: 'This resonates so much! We spent 6 months building components before establishing principles. Had to rebuild everything.',
      authorId: 'user-010',
      author: demoUsers[9],
      postId: 'post-006',
      likesCount: 34,
      isLiked: true,
      createdAt: new Date('2024-01-10T12:15:00')
    },
    {
      id: 'comment-007',
      content: 'The documentation point is so underrated. Our adoption rate doubled after we invested in proper docs.',
      authorId: 'user-013',
      author: demoUsers[12],
      postId: 'post-006',
      likesCount: 28,
      isLiked: false,
      createdAt: new Date('2024-01-10T14:20:00')
    }
  ],
  'post-010': [
    {
      id: 'comment-008',
      content: 'Congratulations! 🎉 The customer obsession point is so important. How many customer interviews did you do in the early days?',
      authorId: 'user-018',
      author: demoUsers[17],
      postId: 'post-010',
      likesCount: 45,
      isLiked: true,
      createdAt: new Date('2024-01-06T15:30:00')
    },
    {
      id: 'comment-009',
      content: 'Amazing milestone! What was your biggest challenge in the 7-12 month scaling phase?',
      authorId: 'user-020',
      author: demoUsers[19],
      postId: 'post-010',
      likesCount: 23,
      isLiked: false,
      createdAt: new Date('2024-01-06T16:45:00')
    }
  ]
};

// ===== ACTIVITY LOGS =====

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
    userId: 'user-009',
    type: 'event_created',
    description: 'Created Design Systems Conference 2024 event',
    timestamp: new Date('2024-02-01T10:00:00'),
    metadata: { eventId: 'event-004' }
  },
  {
    id: 'activity-004',
    userId: 'user-017',
    type: 'milestone_achieved',
    description: 'Reached $1M ARR milestone',
    timestamp: new Date('2024-01-06T14:00:00'),
    metadata: { milestone: '1M_ARR' }
  },
  {
    id: 'activity-005',
    userId: 'user-004',
    type: 'group_joined',
    description: 'Joined AI Founders Circle',
    timestamp: new Date('2024-01-10T09:30:00'),
    metadata: { groupId: 'group-001' }
  }
];

// ===== ENGAGEMENT METRICS =====

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

// ===== TRENDING TOPICS =====

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
export const demoData = {
  categories,
  users: demoUsers,
  groups: demoGroups,
  events: demoEvents,
  posts: demoPosts,
  comments: demoComments,
  activityLogs,
  engagementMetrics,
  trendingTopics
};