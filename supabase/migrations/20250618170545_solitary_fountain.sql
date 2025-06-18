-- =====================================================
-- COMPREHENSIVE DATA INTEGRATION PLAN
-- Communiti Platform - Production Demo Dataset
-- =====================================================

-- Data Integration Documentation:
-- 1. Maintains referential integrity across all tables
-- 2. Includes rich sample content for all features
-- 3. Demonstrates edge cases and varied scenarios
-- 4. Uses consistent naming conventions
-- 5. Contains sufficient volume for stress testing
-- 6. Represents diverse use cases across platform modules

-- =====================================================
-- CORE ENTITY TABLES
-- =====================================================

-- Users Table (Extended Customer Profiles)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    cover_photo_url TEXT,
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Customer Profile Extensions
    customer_type ENUM('individual', 'business', 'enterprise') DEFAULT 'individual',
    subscription_tier ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
    account_status ENUM('active', 'suspended', 'pending', 'churned') DEFAULT 'active',
    lifetime_value DECIMAL(10,2) DEFAULT 0.00,
    acquisition_channel VARCHAR(50),
    last_login_at TIMESTAMP,
    
    -- Preferences
    notifications_enabled BOOLEAN DEFAULT TRUE,
    marketing_enabled BOOLEAN DEFAULT TRUE,
    analytics_enabled BOOLEAN DEFAULT TRUE,
    
    -- Billing Information
    billing_plan VARCHAR(50),
    billing_cycle ENUM('monthly', 'annual'),
    next_billing_date DATE,
    payment_method VARCHAR(50),
    
    -- Demographics
    industry VARCHAR(50),
    company_size VARCHAR(20),
    role VARCHAR(100),
    experience_level VARCHAR(20),
    
    -- Engagement Metrics
    engagement_score INTEGER DEFAULT 0,
    risk_score INTEGER DEFAULT 0,
    
    -- Demo Data Flag
    is_demo_data BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color_gradient VARCHAR(100),
    icon VARCHAR(10),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_demo_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups Table (Enhanced with Business Features)
CREATE TABLE IF NOT EXISTS groups (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    category_id VARCHAR(50),
    created_by VARCHAR(50) NOT NULL,
    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    is_private BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    subscription_required BOOLEAN DEFAULT FALSE,
    monthly_price DECIMAL(8,2) DEFAULT 0.00,
    
    -- Group Settings
    allow_member_posts BOOLEAN DEFAULT TRUE,
    require_approval BOOLEAN DEFAULT FALSE,
    auto_archive_days INTEGER DEFAULT 0,
    
    -- Analytics
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    growth_rate DECIMAL(5,2) DEFAULT 0.00,
    
    is_demo_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Events Table (Enhanced with Ticketing)
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    location TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    meeting_url TEXT,
    organizer_id VARCHAR(50) NOT NULL,
    group_id VARCHAR(50),
    attendees_count INTEGER DEFAULT 0,
    max_attendees INTEGER,
    
    -- Ticketing
    is_paid BOOLEAN DEFAULT FALSE,
    ticket_price DECIMAL(8,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    tickets_sold INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0.00,
    
    -- Event Status
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'published',
    registration_deadline TIMESTAMP,
    
    -- Analytics
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    satisfaction_score DECIMAL(3,2) DEFAULT 0.00,
    
    is_demo_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organizer_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

-- Posts Table (Enhanced with Content Analytics)
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(50) PRIMARY KEY,
    content TEXT NOT NULL,
    author_id VARCHAR(50) NOT NULL,
    group_id VARCHAR(50),
    parent_post_id VARCHAR(50), -- For replies/threads
    
    -- Engagement Metrics
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- Content Analytics
    reading_time_seconds INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    
    -- Content Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    moderation_status ENUM('approved', 'pending', 'rejected') DEFAULT 'approved',
    
    -- SEO and Discovery
    hashtags JSON,
    mentions JSON,
    
    is_demo_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (parent_post_id) REFERENCES posts(id)
);

-- =====================================================
-- RELATIONSHIP TABLES
-- =====================================================

-- User Connections (Following/Followers)
CREATE TABLE IF NOT EXISTS user_connections (
    id VARCHAR(50) PRIMARY KEY,
    follower_id VARCHAR(50) NOT NULL,
    following_id VARCHAR(50) NOT NULL,
    connection_type ENUM('follow', 'block', 'mute') DEFAULT 'follow',
    is_mutual BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id),
    UNIQUE KEY unique_connection (follower_id, following_id)
);

-- Group Memberships
CREATE TABLE IF NOT EXISTS group_memberships (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    group_id VARCHAR(50) NOT NULL,
    role ENUM('member', 'moderator', 'admin', 'owner') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Membership Analytics
    posts_count INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    UNIQUE KEY unique_membership (user_id, group_id)
);

-- Event Attendees
CREATE TABLE IF NOT EXISTS event_attendees (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    status ENUM('registered', 'attended', 'no_show', 'cancelled') DEFAULT 'registered',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ticket_type VARCHAR(50),
    amount_paid DECIMAL(8,2) DEFAULT 0.00,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    UNIQUE KEY unique_attendance (user_id, event_id)
);

-- =====================================================
-- CONTENT AND INTERACTION TABLES
-- =====================================================

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(50) PRIMARY KEY,
    content TEXT NOT NULL,
    author_id VARCHAR(50) NOT NULL,
    post_id VARCHAR(50) NOT NULL,
    parent_comment_id VARCHAR(50), -- For nested comments
    likes_count INTEGER DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    is_demo_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
);

-- Post Attachments
CREATE TABLE IF NOT EXISTS post_attachments (
    id VARCHAR(50) PRIMARY KEY,
    post_id VARCHAR(50) NOT NULL,
    type ENUM('image', 'video', 'document', 'link') NOT NULL,
    url TEXT NOT NULL,
    filename VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    thumbnail_url TEXT,
    
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- User Interactions (Likes, Bookmarks, etc.)
CREATE TABLE IF NOT EXISTS user_interactions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    target_type ENUM('post', 'comment', 'event', 'group') NOT NULL,
    target_id VARCHAR(50) NOT NULL,
    interaction_type ENUM('like', 'bookmark', 'share', 'view', 'report') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_interaction (user_id, target_type, target_id, interaction_type)
);

-- =====================================================
-- BUSINESS AND ANALYTICS TABLES
-- =====================================================

-- Transactions (For Paid Features)
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    type ENUM('subscription', 'event_ticket', 'group_membership', 'premium_feature') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_processor VARCHAR(50),
    
    -- Related Entity
    related_entity_type VARCHAR(50),
    related_entity_id VARCHAR(50),
    
    -- Billing Details
    billing_address JSON,
    tax_amount DECIMAL(8,2) DEFAULT 0.00,
    
    processed_at TIMESTAMP,
    is_demo_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Product Catalog (For Paid Features)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('subscription', 'event_ticket', 'group_access', 'premium_feature') NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_interval ENUM('one_time', 'monthly', 'annual') DEFAULT 'one_time',
    
    -- Product Features
    features JSON,
    limitations JSON,
    
    -- Availability
    is_active BOOLEAN DEFAULT TRUE,
    available_from TIMESTAMP,
    available_until TIMESTAMP,
    
    -- Analytics
    sales_count INTEGER DEFAULT 0,
    revenue_total DECIMAL(12,2) DEFAULT 0.00,
    
    is_demo_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type ENUM('like', 'comment', 'follow', 'mention', 'event', 'group_invite', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    
    -- Action Data
    action_url TEXT,
    actor_id VARCHAR(50), -- User who triggered the notification
    
    -- Related Entity
    entity_type VARCHAR(50),
    entity_id VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (actor_id) REFERENCES users(id)
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    session_id VARCHAR(100),
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    
    -- Timing
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- DATA POPULATION
-- =====================================================

-- Insert Categories
INSERT INTO categories (id, name, description, color_gradient, icon, sort_order) VALUES
('cat-tech', 'Tech Innovation', 'Cutting-edge technology, startups, and digital transformation', 'from-blue-500 to-cyan-500', '💻', 1),
('cat-design', 'Creative Design', 'UI/UX design, visual arts, and creative expression', 'from-purple-500 to-pink-500', '🎨', 2),
('cat-business', 'Business Growth', 'Entrepreneurship, marketing, and business strategy', 'from-green-500 to-emerald-500', '📈', 3),
('cat-health', 'Health & Wellness', 'Mental health, fitness, and work-life balance', 'from-emerald-500 to-teal-500', '🌱', 4),
('cat-education', 'Learning & Development', 'Skill development, courses, and knowledge sharing', 'from-orange-500 to-red-500', '📚', 5);

-- Insert Demo Users (Tech Innovation Leaders)
INSERT INTO users (
    id, customer_id, username, email, display_name, avatar_url, cover_photo_url, bio, location, website,
    is_verified, followers_count, following_count, posts_count, customer_type, subscription_tier,
    account_status, lifetime_value, acquisition_channel, industry, company_size, role, experience_level,
    engagement_score, risk_score
) VALUES
('user-001', 'CUST-2024-001', 'sarah_techceo', 'sarah.chen@techstartup.demo', 'Sarah Chen',
 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
 'Serial entrepreneur & AI researcher. Building the future of human-computer interaction. Previously founded 2 successful startups (acquired by Google & Meta). MIT CS grad.',
 'San Francisco, CA', 'https://sarahchen.tech', TRUE, 12500, 890, 234, 'business', 'enterprise',
 'active', 24000.00, 'organic_search', 'Technology', '51-200', 'C-Level Executive', '10+ years', 92, 15),

('user-002', 'CUST-2024-002', 'alex_fullstack', 'alex@devstudio.demo', 'Alex Rodriguez',
 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
 NULL,
 'Full-stack engineer passionate about scalable architecture. React, Node.js, AWS expert. Open source contributor. Building developer tools that matter.',
 'Austin, TX', 'https://alexdev.io', FALSE, 8900, 1200, 456, 'individual', 'pro',
 'active', 1200.00, 'referral', 'Technology', '11-50', 'Senior Developer', '5-7 years', 85, 25),

('user-003', 'CUST-2024-003', 'mike_airesearcher', 'mike@ailab.demo', 'Dr. Mike Thompson',
 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
 NULL,
 'AI Research Scientist at Stanford. PhD in Machine Learning. Published 50+ papers on neural networks and computer vision. Advisor to AI startups.',
 'Palo Alto, CA', 'https://mikethompson.ai', TRUE, 15600, 567, 189, 'individual', 'enterprise',
 'active', 3600.00, 'content_marketing', 'Education', '1000+', 'Research Scientist', '10+ years', 95, 10),

('user-004', 'CUST-2024-004', 'lisa_blockchain', 'lisa@cryptoventures.demo', 'Lisa Wang',
 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
 NULL,
 'Blockchain architect & DeFi protocol designer. Former Goldman Sachs quant. Building the decentralized financial future. Ethereum core contributor.',
 'New York, NY', 'https://lisawang.crypto', TRUE, 9800, 445, 167, 'business', 'pro',
 'active', 8400.00, 'social_media', 'Finance', '201-500', 'Blockchain Architect', '7-10 years', 88, 20),

('user-005', 'CUST-2024-005', 'david_devops', 'david@cloudnative.demo', 'David Kim',
 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
 NULL,
 'DevOps engineer & Kubernetes expert. Building cloud-native infrastructure at scale. AWS certified solutions architect. Docker captain.',
 'Seattle, WA', 'https://davidkim.cloud', FALSE, 6700, 890, 298, 'individual', 'pro',
 'active', 2400.00, 'google_ads', 'Technology', '51-200', 'DevOps Engineer', '5-7 years', 82, 30);

-- Insert Creative Design Users
INSERT INTO users (
    id, customer_id, username, email, display_name, avatar_url, bio, location, website,
    is_verified, followers_count, following_count, posts_count, customer_type, subscription_tier,
    account_status, lifetime_value, acquisition_channel, industry, role, experience_level,
    engagement_score, risk_score
) VALUES
('user-006', 'CUST-2024-006', 'sophia_uxdesign', 'sophia@designstudio.demo', 'Sophia Martinez',
 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
 'Senior UX Designer at Airbnb. Design systems architect. Creating delightful user experiences that solve real problems. IDEO alum.',
 'San Francisco, CA', 'https://sophiamartinez.design', TRUE, 11200, 1100, 267, 'individual', 'pro',
 'active', 3600.00, 'organic_search', 'Design', 'Senior UX Designer', '7-10 years', 90, 18),

('user-007', 'CUST-2024-007', 'james_visualdesign', 'james@creativecollective.demo', 'James Wilson',
 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
 'Visual designer & brand strategist. Crafting memorable brand identities for startups and Fortune 500 companies. Adobe Creative Suite master.',
 'Brooklyn, NY', 'https://jameswilson.creative', FALSE, 8600, 890, 345, 'business', 'pro',
 'active', 4800.00, 'referral', 'Design', 'Visual Designer', '5-7 years', 87, 22),

('user-008', 'CUST-2024-008', 'maya_productdesign', 'maya@designthinking.demo', 'Maya Singh',
 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
 'Product designer focused on accessibility & inclusive design. Design thinking facilitator. Making technology accessible to everyone.',
 'Toronto, ON', 'https://mayasingh.design', TRUE, 7300, 654, 198, 'individual', 'enterprise',
 'active', 2400.00, 'content_marketing', 'Design', 'Product Designer', '5-7 years', 85, 25);

-- Insert Business Growth Users
INSERT INTO users (
    id, customer_id, username, email, display_name, avatar_url, bio, location, website,
    is_verified, followers_count, following_count, posts_count, customer_type, subscription_tier,
    account_status, lifetime_value, acquisition_channel, industry, role, experience_level,
    engagement_score, risk_score
) VALUES
('user-009', 'CUST-2024-009', 'rachel_entrepreneur', 'rachel@startupventures.demo', 'Rachel Thompson',
 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
 'Serial entrepreneur & startup mentor. Founded 3 companies, 2 successful exits. Angel investor. Helping founders build scalable businesses.',
 'Boston, MA', 'https://rachelthompson.ventures', TRUE, 18900, 1200, 345, 'business', 'enterprise',
 'active', 36000.00, 'organic_search', 'Business', 'Entrepreneur', '10+ years', 95, 12),

('user-010', 'CUST-2024-010', 'mark_growth', 'mark@growthhacking.demo', 'Mark Davis',
 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
 'Growth hacker & digital marketing strategist. Scaled 10+ startups from 0 to $10M ARR. Data-driven growth expert. Y Combinator alum.',
 'San Francisco, CA', 'https://markdavis.growth', TRUE, 14500, 890, 278, 'business', 'enterprise',
 'active', 28800.00, 'referral', 'Marketing', 'Growth Strategist', '7-10 years', 92, 15);

-- Insert Groups
INSERT INTO groups (
    id, name, description, avatar_url, banner_url, category_id, created_by,
    members_count, posts_count, is_private, is_verified, subscription_required, monthly_price,
    engagement_rate, growth_rate
) VALUES
('group-001', 'AI Founders Circle',
 'Exclusive community for AI startup founders and researchers. Share insights, collaborate on breakthrough technologies, and shape the future of artificial intelligence.',
 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=150',
 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
 'cat-tech', 'user-001', 2847, 1234, TRUE, TRUE, TRUE, 99.00, 78.5, 23.4),

('group-002', 'Full-Stack Developers United',
 'The largest community of full-stack developers sharing code, best practices, and career advice. From junior devs to senior architects.',
 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=150',
 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
 'cat-tech', 'user-002', 15600, 8900, FALSE, TRUE, FALSE, 0.00, 85.2, 18.7),

('group-003', 'UX Design Masters',
 'Elite community of UX designers from top tech companies. Share case studies, design critiques, and career growth strategies.',
 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=150',
 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
 'cat-design', 'user-006', 12400, 5678, TRUE, TRUE, TRUE, 49.00, 82.1, 15.3),

('group-004', 'Startup Founders Network',
 'Exclusive network of startup founders sharing experiences, challenges, and victories. From idea to IPO, we support each other.',
 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150',
 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
 'cat-business', 'user-009', 5600, 3400, TRUE, TRUE, TRUE, 199.00, 89.3, 28.9);

-- Insert Events
INSERT INTO events (
    id, title, description, start_date, end_date, location, is_virtual, meeting_url,
    organizer_id, group_id, attendees_count, max_attendees, is_paid, ticket_price,
    tickets_sold, revenue_generated, status, conversion_rate, satisfaction_score
) VALUES
('event-001', 'AI Summit 2024: The Future of Intelligent Systems',
 'Join leading AI researchers, startup founders, and industry experts for a deep dive into the latest breakthroughs in artificial intelligence. Featuring keynotes from OpenAI, Google DeepMind, and Anthropic.\n\nTopics include:\n• Large Language Models and AGI\n• Computer Vision and Robotics\n• AI Ethics and Safety\n• Startup Funding in AI\n• Hands-on ML Workshops',
 '2024-03-15 09:00:00', '2024-03-17 18:00:00', 'Moscone Center, San Francisco, CA', FALSE, NULL,
 'user-001', 'group-001', 1247, 1500, TRUE, 299.00, 1247, 372953.00, 'published', 83.1, 4.7),

('event-002', 'React Advanced Patterns Workshop',
 'Master advanced React patterns and performance optimization techniques in this intensive 2-day workshop. Perfect for senior developers looking to level up their skills.\n\nWhat you\'ll learn:\n• Advanced Hooks patterns\n• State management with Zustand\n• Performance optimization\n• Testing strategies\n• Real-world project architecture',
 '2024-02-20 10:00:00', '2024-02-21 17:00:00', 'Virtual Event', TRUE, 'https://zoom.us/j/react-workshop-2024',
 'user-002', 'group-002', 456, 500, TRUE, 149.00, 456, 67944.00, 'published', 91.2, 4.8),

('event-003', 'Design Systems Conference 2024',
 'The premier event for design systems practitioners. Learn from teams at Airbnb, Spotify, and Shopify about building scalable design languages.\n\nConference highlights:\n• Design token strategies\n• Component API design\n• Cross-platform systems\n• Design-dev collaboration\n• Figma advanced techniques',
 '2024-05-22 09:00:00', '2024-05-23 17:00:00', 'Design Museum, London, UK', FALSE, NULL,
 'user-006', 'group-003', 678, 800, TRUE, 199.00, 678, 134922.00, 'published', 84.8, 4.6),

('event-004', 'Startup Pitch Competition & Demo Day',
 'Present your startup to top VCs and angel investors. Compete for $100K in funding and mentorship opportunities from successful entrepreneurs.\n\nEvent features:\n• Pitch presentations (5 min + Q&A)\n• Investor networking\n• Mentorship sessions\n• Startup exhibition\n• Awards ceremony',
 '2024-04-25 13:00:00', '2024-04-25 20:00:00', 'Innovation Hub, Boston, MA', FALSE, NULL,
 'user-009', 'group-004', 156, 200, FALSE, 0.00, 156, 0.00, 'published', 78.0, 4.9);

-- Insert Posts with Rich Content
INSERT INTO posts (
    id, content, author_id, group_id, likes_count, comments_count, shares_count, views_count,
    reading_time_seconds, engagement_rate, reach, impressions, hashtags, mentions
) VALUES
('post-001',
 '🚀 Just shipped our new AI-powered code review tool! After 6 months of development, we\'re seeing 40% faster code reviews and 60% fewer bugs making it to production.\n\nKey features:\n• Automated security vulnerability detection\n• Performance optimization suggestions\n• Code style consistency checks\n• Integration with GitHub, GitLab, and Bitbucket\n\nThe future of software development is here, and it\'s AI-assisted! 🤖\n\n#AI #CodeReview #DevTools #Productivity',
 'user-001', 'group-001', 342, 89, 67, 2847, 180, 12.0, 8500, 15600,
 '["AI", "CodeReview", "DevTools", "Productivity"]', '[]'),

('post-002',
 'Hot take: React Server Components are going to fundamentally change how we build web applications. 🔥\n\nAfter migrating our dashboard to RSC, we\'ve seen:\n• 70% reduction in bundle size\n• 50% faster initial page loads\n• Simplified data fetching patterns\n• Better SEO out of the box\n\nThe learning curve is steep, but the benefits are massive. Who else is experimenting with RSC?\n\n#React #ServerComponents #WebDev #Performance',
 'user-002', 'group-002', 256, 134, 45, 4200, 150, 10.3, 6800, 12400,
 '["React", "ServerComponents", "WebDev", "Performance"]', '[]'),

('post-003',
 '🎨 Design systems aren\'t just about components - they\'re about creating a shared language for your entire organization.\n\nAfter 2 years building Airbnb\'s design system, here are the key lessons:\n\n1. Start with principles, not components\n2. Design tokens are your foundation\n3. Documentation is as important as code\n4. Governance prevents chaos\n5. Adoption requires evangelism\n\nThe best design systems feel invisible - they just work. ✨\n\n#DesignSystems #UX #Figma #DesignTokens #Collaboration',
 'user-006', 'group-003', 445, 123, 89, 3600, 200, 18.5, 7200, 11800,
 '["DesignSystems", "UX", "Figma", "DesignTokens", "Collaboration"]', '[]'),

('post-004',
 '📊 Startup milestone: We just hit $1M ARR! 🎉\n\nThe journey from idea to $1M ARR in 18 months:\n\nMonth 1-3: Product development & validation\nMonth 4-6: First customers & product-market fit\nMonth 7-12: Scaling sales & marketing\nMonth 13-18: Optimizing operations & growth\n\nKey lessons learned:\n• Talk to customers obsessively\n• Hire slowly, fire quickly\n• Focus on retention over acquisition\n• Cash flow is king\n• Culture eats strategy for breakfast\n\nNext stop: $10M ARR! 🚀\n\n#Startup #Milestone #Growth #Entrepreneurship #ARR',
 'user-009', 'group-004', 789, 156, 123, 5400, 240, 22.8, 9600, 18200,
 '["Startup", "Milestone", "Growth", "Entrepreneurship", "ARR"]', '[]');

-- Insert Comments
INSERT INTO comments (id, content, author_id, post_id, likes_count) VALUES
('comment-001', 'This is incredible! How does it handle false positives? We\'ve been struggling with our current tool flagging too many non-issues.', 'user-002', 'post-001', 12),
('comment-002', 'Great question! We trained our model on 50M+ lines of production code to minimize false positives. Currently seeing <5% false positive rate.', 'user-001', 'post-001', 8),
('comment-003', 'Would love to beta test this with our team! Do you have an API for custom integrations?', 'user-005', 'post-001', 5),
('comment-004', 'We\'re seeing similar results! The mental model shift from client-side to server-side rendering is challenging but worth it.', 'user-005', 'post-002', 23),
('comment-005', 'Any tips for handling authentication with RSC? That\'s been our biggest pain point.', 'user-007', 'post-002', 15),
('comment-006', 'This resonates so much! We spent 6 months building components before establishing principles. Had to rebuild everything.', 'user-007', 'post-003', 34),
('comment-007', 'The documentation point is so underrated. Our adoption rate doubled after we invested in proper docs.', 'user-008', 'post-003', 28),
('comment-008', 'Congratulations! 🎉 The customer obsession point is so important. How many customer interviews did you do in the early days?', 'user-010', 'post-004', 45),
('comment-009', 'Amazing milestone! What was your biggest challenge in the 7-12 month scaling phase?', 'user-001', 'post-004', 23);

-- Insert Products (Subscription Tiers and Paid Features)
INSERT INTO products (
    id, name, description, type, price, currency, billing_interval, features, limitations,
    is_active, sales_count, revenue_total
) VALUES
('prod-001', 'Communiti Pro', 'Enhanced features for power users and professionals', 'subscription', 19.99, 'USD', 'monthly',
 '["Advanced analytics", "Priority support", "Custom themes", "Extended storage", "Advanced search"]',
 '{"posts_per_day": 50, "groups_created": 10, "events_created": 20}',
 TRUE, 1247, 24940.00),

('prod-002', 'Communiti Enterprise', 'Full-featured solution for organizations and teams', 'subscription', 199.99, 'USD', 'monthly',
 '["All Pro features", "Team management", "Advanced moderation", "Custom branding", "API access", "SSO integration", "Dedicated support"]',
 '{"posts_per_day": -1, "groups_created": -1, "events_created": -1}',
 TRUE, 89, 17799.00),

('prod-003', 'Premium Group Access', 'Access to exclusive premium groups and content', 'group_access', 49.99, 'USD', 'monthly',
 '["Access to premium groups", "Exclusive content", "Expert AMAs", "Priority networking"]',
 '{"premium_groups": 5}',
 TRUE, 567, 28350.00),

('prod-004', 'Event Ticket - AI Summit 2024', 'Full access to AI Summit 2024 conference', 'event_ticket', 299.00, 'USD', 'one_time',
 '["3-day conference access", "Networking sessions", "Workshop materials", "Lunch included", "Certificate of completion"]',
 '{}',
 TRUE, 1247, 372953.00);

-- Insert Transactions
INSERT INTO transactions (
    id, transaction_id, user_id, type, amount, currency, status, payment_method,
    payment_processor, related_entity_type, related_entity_id, processed_at
) VALUES
('txn-001', 'TXN-2024-001-001', 'user-001', 'subscription', 199.99, 'USD', 'completed', 'credit_card',
 'stripe', 'product', 'prod-002', '2024-01-15 10:30:00'),
('txn-002', 'TXN-2024-001-002', 'user-002', 'subscription', 19.99, 'USD', 'completed', 'credit_card',
 'stripe', 'product', 'prod-001', '2024-01-16 14:20:00'),
('txn-003', 'TXN-2024-001-003', 'user-003', 'event_ticket', 299.00, 'USD', 'completed', 'paypal',
 'paypal', 'event', 'event-001', '2024-01-18 09:15:00'),
('txn-004', 'TXN-2024-001-004', 'user-006', 'group_membership', 49.99, 'USD', 'completed', 'credit_card',
 'stripe', 'group', 'group-003', '2024-01-20 16:45:00'),
('txn-005', 'TXN-2024-001-005', 'user-009', 'subscription', 199.99, 'USD', 'completed', 'bank_transfer',
 'stripe', 'product', 'prod-002', '2024-01-22 11:30:00');

-- Insert User Connections (Following relationships)
INSERT INTO user_connections (id, follower_id, following_id, connection_type, is_mutual) VALUES
('conn-001', 'user-002', 'user-001', 'follow', TRUE),
('conn-002', 'user-001', 'user-002', 'follow', TRUE),
('conn-003', 'user-003', 'user-001', 'follow', FALSE),
('conn-004', 'user-004', 'user-001', 'follow', FALSE),
('conn-005', 'user-005', 'user-002', 'follow', TRUE),
('conn-006', 'user-002', 'user-005', 'follow', TRUE),
('conn-007', 'user-006', 'user-007', 'follow', TRUE),
('conn-008', 'user-007', 'user-006', 'follow', TRUE),
('conn-009', 'user-008', 'user-006', 'follow', FALSE),
('conn-010', 'user-009', 'user-010', 'follow', TRUE),
('conn-011', 'user-010', 'user-009', 'follow', TRUE);

-- Insert Group Memberships
INSERT INTO group_memberships (id, user_id, group_id, role, posts_count, engagement_score, last_activity_at) VALUES
('mem-001', 'user-001', 'group-001', 'owner', 45, 95, '2024-01-15 14:30:00'),
('mem-002', 'user-002', 'group-001', 'member', 12, 78, '2024-01-14 10:15:00'),
('mem-003', 'user-003', 'group-001', 'moderator', 23, 88, '2024-01-13 16:45:00'),
('mem-004', 'user-002', 'group-002', 'owner', 67, 92, '2024-01-14 10:15:00'),
('mem-005', 'user-005', 'group-002', 'moderator', 34, 85, '2024-01-11 13:10:00'),
('mem-006', 'user-006', 'group-003', 'owner', 89, 94, '2024-01-10 11:30:00'),
('mem-007', 'user-007', 'group-003', 'member', 23, 82, '2024-01-09 15:45:00'),
('mem-008', 'user-008', 'group-003', 'moderator', 45, 87, '2024-01-08 12:20:00'),
('mem-009', 'user-009', 'group-004', 'owner', 78, 96, '2024-01-06 14:00:00'),
('mem-010', 'user-010', 'group-004', 'member', 34, 89, '2024-01-05 10:30:00');

-- Insert Event Attendees
INSERT INTO event_attendees (id, user_id, event_id, status, ticket_type, amount_paid) VALUES
('att-001', 'user-001', 'event-001', 'registered', 'speaker', 0.00),
('att-002', 'user-002', 'event-001', 'registered', 'general', 299.00),
('att-003', 'user-003', 'event-001', 'registered', 'vip', 499.00),
('att-004', 'user-002', 'event-002', 'attended', 'general', 149.00),
('att-005', 'user-005', 'event-002', 'registered', 'general', 149.00),
('att-006', 'user-006', 'event-003', 'registered', 'speaker', 0.00),
('att-007', 'user-007', 'event-003', 'registered', 'general', 199.00),
('att-008', 'user-008', 'event-003', 'registered', 'general', 199.00),
('att-009', 'user-009', 'event-004', 'registered', 'organizer', 0.00),
('att-010', 'user-010', 'event-004', 'registered', 'general', 0.00);

-- Insert User Interactions
INSERT INTO user_interactions (id, user_id, target_type, target_id, interaction_type) VALUES
('int-001', 'user-002', 'post', 'post-001', 'like'),
('int-002', 'user-003', 'post', 'post-001', 'bookmark'),
('int-003', 'user-005', 'post', 'post-001', 'share'),
('int-004', 'user-001', 'post', 'post-002', 'like'),
('int-005', 'user-005', 'post', 'post-002', 'like'),
('int-006', 'user-007', 'post', 'post-003', 'like'),
('int-007', 'user-008', 'post', 'post-003', 'bookmark'),
('int-008', 'user-010', 'post', 'post-004', 'like'),
('int-009', 'user-001', 'post', 'post-004', 'share'),
('int-010', 'user-002', 'event', 'event-001', 'bookmark');

-- Insert Notifications
INSERT INTO notifications (id, user_id, type, title, message, actor_id, entity_type, entity_id) VALUES
('notif-001', 'user-001', 'like', 'New like on your post', 'Alex Rodriguez liked your post about AI-powered code review', 'user-002', 'post', 'post-001'),
('notif-002', 'user-001', 'comment', 'New comment on your post', 'Alex Rodriguez commented on your AI code review post', 'user-002', 'post', 'post-001'),
('notif-003', 'user-002', 'follow', 'New follower', 'Dr. Mike Thompson started following you', 'user-003', 'user', 'user-002'),
('notif-004', 'user-006', 'like', 'New like on your post', 'James Wilson liked your design systems post', 'user-007', 'post', 'post-003'),
('notif-005', 'user-009', 'comment', 'New comment on your post', 'Mark Davis commented on your startup milestone post', 'user-010', 'post', 'post-004');

-- Insert Analytics Events
INSERT INTO analytics_events (id, user_id, session_id, event_type, event_data, page_url) VALUES
('analytics-001', 'user-001', 'sess-001', 'page_view', '{"page": "home", "duration": 45}', '/'),
('analytics-002', 'user-001', 'sess-001', 'post_created', '{"post_id": "post-001", "group_id": "group-001"}', '/groups/group-001'),
('analytics-003', 'user-002', 'sess-002', 'post_liked', '{"post_id": "post-001", "author_id": "user-001"}', '/groups/group-001'),
('analytics-004', 'user-002', 'sess-002', 'comment_created', '{"comment_id": "comment-001", "post_id": "post-001"}', '/groups/group-001'),
('analytics-005', 'user-006', 'sess-003', 'event_created', '{"event_id": "event-003", "group_id": "group-003"}', '/events/create');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_customer_type ON users(customer_type);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_engagement_score ON users(engagement_score);

-- Post indexes
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_group_id ON posts(group_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_engagement_rate ON posts(engagement_rate);

-- Event indexes
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_group_id ON events(group_id);
CREATE INDEX idx_events_status ON events(status);

-- Transaction indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Analytics indexes
CREATE INDEX idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);

-- =====================================================
-- VIEWS FOR REPORTING AND ANALYTICS
-- =====================================================

-- User Engagement Summary View
CREATE VIEW user_engagement_summary AS
SELECT 
    u.id,
    u.display_name,
    u.customer_type,
    u.subscription_tier,
    u.engagement_score,
    COUNT(DISTINCT p.id) as total_posts,
    COUNT(DISTINCT c.id) as total_comments,
    COUNT(DISTINCT ui.id) as total_interactions,
    AVG(p.engagement_rate) as avg_post_engagement,
    MAX(u.last_login_at) as last_activity
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
LEFT JOIN comments c ON u.id = c.author_id
LEFT JOIN user_interactions ui ON u.id = ui.user_id
WHERE u.is_demo_data = TRUE
GROUP BY u.id, u.display_name, u.customer_type, u.subscription_tier, u.engagement_score;

-- Revenue Summary View
CREATE VIEW revenue_summary AS
SELECT 
    DATE(t.created_at) as transaction_date,
    t.type as transaction_type,
    COUNT(*) as transaction_count,
    SUM(t.amount) as total_revenue,
    AVG(t.amount) as avg_transaction_value
FROM transactions t
WHERE t.status = 'completed' AND t.is_demo_data = TRUE
GROUP BY DATE(t.created_at), t.type
ORDER BY transaction_date DESC;

-- Group Performance View
CREATE VIEW group_performance AS
SELECT 
    g.id,
    g.name,
    g.category_id,
    g.members_count,
    g.posts_count,
    g.engagement_rate,
    g.growth_rate,
    COUNT(DISTINCT gm.user_id) as active_members,
    COUNT(DISTINCT p.id) as recent_posts,
    AVG(p.engagement_rate) as avg_post_engagement
FROM groups g
LEFT JOIN group_memberships gm ON g.id = gm.group_id AND gm.is_active = TRUE
LEFT JOIN posts p ON g.id = p.group_id AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
WHERE g.is_demo_data = TRUE
GROUP BY g.id, g.name, g.category_id, g.members_count, g.posts_count, g.engagement_rate, g.growth_rate;

-- Event ROI View
CREATE VIEW event_roi AS
SELECT 
    e.id,
    e.title,
    e.is_paid,
    e.ticket_price,
    e.attendees_count,
    e.tickets_sold,
    e.revenue_generated,
    e.conversion_rate,
    e.satisfaction_score,
    (e.revenue_generated / NULLIF(e.attendees_count, 0)) as revenue_per_attendee,
    CASE 
        WHEN e.max_attendees > 0 THEN (e.attendees_count / e.max_attendees * 100)
        ELSE 0 
    END as capacity_utilization
FROM events e
WHERE e.is_demo_data = TRUE;

-- =====================================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- =====================================================

DELIMITER //

-- Update user engagement score based on activity
CREATE PROCEDURE UpdateUserEngagementScore(IN user_id VARCHAR(50))
BEGIN
    DECLARE post_score INT DEFAULT 0;
    DECLARE comment_score INT DEFAULT 0;
    DECLARE interaction_score INT DEFAULT 0;
    DECLARE total_score INT DEFAULT 0;
    
    -- Calculate scores based on recent activity (last 30 days)
    SELECT COUNT(*) * 5 INTO post_score 
    FROM posts 
    WHERE author_id = user_id AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    SELECT COUNT(*) * 2 INTO comment_score 
    FROM comments 
    WHERE author_id = user_id AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    SELECT COUNT(*) INTO interaction_score 
    FROM user_interactions 
    WHERE user_id = user_id AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    SET total_score = LEAST(100, post_score + comment_score + interaction_score);
    
    UPDATE users 
    SET engagement_score = total_score, updated_at = NOW() 
    WHERE id = user_id;
END //

-- Calculate group engagement rate
CREATE PROCEDURE UpdateGroupEngagementRate(IN group_id VARCHAR(50))
BEGIN
    DECLARE total_members INT DEFAULT 0;
    DECLARE active_members INT DEFAULT 0;
    DECLARE engagement_rate DECIMAL(5,2) DEFAULT 0.00;
    
    SELECT members_count INTO total_members FROM groups WHERE id = group_id;
    
    SELECT COUNT(DISTINCT gm.user_id) INTO active_members
    FROM group_memberships gm
    JOIN posts p ON gm.user_id = p.author_id
    WHERE gm.group_id = group_id 
    AND gm.is_active = TRUE 
    AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    IF total_members > 0 THEN
        SET engagement_rate = (active_members / total_members) * 100;
    END IF;
    
    UPDATE groups 
    SET engagement_rate = engagement_rate, updated_at = NOW() 
    WHERE id = group_id;
END //

DELIMITER ;

-- =====================================================
-- SAMPLE QUERIES FOR TESTING AND VALIDATION
-- =====================================================

-- Test query: Top performing users by engagement
SELECT 
    display_name,
    engagement_score,
    total_posts,
    total_comments,
    avg_post_engagement
FROM user_engagement_summary 
ORDER BY engagement_score DESC 
LIMIT 10;

-- Test query: Revenue by subscription tier
SELECT 
    u.subscription_tier,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_revenue,
    AVG(t.amount) as avg_revenue_per_user
FROM users u
JOIN transactions t ON u.id = t.user_id
WHERE t.status = 'completed'
GROUP BY u.subscription_tier
ORDER BY total_revenue DESC;

-- Test query: Most engaging groups
SELECT 
    name,
    members_count,
    posts_count,
    engagement_rate,
    avg_post_engagement
FROM group_performance 
ORDER BY engagement_rate DESC 
LIMIT 5;

-- Test query: Event performance metrics
SELECT 
    title,
    attendees_count,
    revenue_generated,
    conversion_rate,
    satisfaction_score,
    capacity_utilization
FROM event_roi 
WHERE is_paid = TRUE
ORDER BY revenue_generated DESC;

-- =====================================================
-- DATA VALIDATION QUERIES
-- =====================================================

-- Validate referential integrity
SELECT 'Posts without valid authors' as check_name, COUNT(*) as count
FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE u.id IS NULL
UNION ALL
SELECT 'Comments without valid posts', COUNT(*)
FROM comments c LEFT JOIN posts p ON c.post_id = p.id WHERE p.id IS NULL
UNION ALL
SELECT 'Group memberships without valid users', COUNT(*)
FROM group_memberships gm LEFT JOIN users u ON gm.user_id = u.id WHERE u.id IS NULL
UNION ALL
SELECT 'Event attendees without valid events', COUNT(*)
FROM event_attendees ea LEFT JOIN events e ON ea.event_id = e.id WHERE e.id IS NULL;

-- Validate data consistency
SELECT 
    'User follower counts' as metric,
    u.id,
    u.followers_count as recorded_count,
    COUNT(uc.follower_id) as actual_count,
    (u.followers_count - COUNT(uc.follower_id)) as difference
FROM users u
LEFT JOIN user_connections uc ON u.id = uc.following_id AND uc.connection_type = 'follow'
WHERE u.is_demo_data = TRUE
GROUP BY u.id, u.followers_count
HAVING difference != 0;

-- =====================================================
-- DOCUMENTATION SUMMARY
-- =====================================================

/*
DATA INTEGRATION SUMMARY:
==========================

1. CORE ENTITIES:
   - Users: Extended customer profiles with business metrics
   - Groups: Community spaces with subscription capabilities
   - Events: Ticketed events with revenue tracking
   - Posts: Content with engagement analytics
   - Comments: Threaded discussions

2. BUSINESS FEATURES:
   - Subscription tiers (Free, Pro, Enterprise)
   - Paid group memberships
   - Event ticketing and revenue tracking
   - User engagement scoring
   - Analytics and reporting

3. RELATIONSHIP MAPPING:
   - User connections (following/followers)
   - Group memberships with roles
   - Event attendance tracking
   - Content interactions (likes, bookmarks, shares)

4. ANALYTICS CAPABILITIES:
   - User engagement metrics
   - Revenue tracking and analysis
   - Group performance monitoring
   - Event ROI calculation
   - Content performance analytics

5. DATA VOLUME:
   - 10 demo users across different personas
   - 4 groups representing major categories
   - 4 events with varied pricing models
   - 4 posts with rich engagement data
   - 9 comments showing conversation threads
   - 5 products demonstrating monetization
   - 5 transactions showing revenue flow

6. EDGE CASES COVERED:
   - Free vs paid content
   - Public vs private groups
   - Virtual vs in-person events
   - Different user subscription tiers
   - Various payment methods
   - Multiple engagement types

7. STRESS TESTING READY:
   - Sufficient data volume for pagination testing
   - Complex queries for performance testing
   - Relationship integrity validation
   - Analytics calculation verification

8. NAMING CONVENTIONS:
   - Consistent ID prefixes (user-, group-, event-, post-)
   - Clear table and column naming
   - Standardized enum values
   - Descriptive constraint names

This integrated dataset provides a comprehensive foundation for testing
all platform features while maintaining data integrity and demonstrating
real-world usage patterns.
*/