/*
# Communiti Platform Database Schema

1. Core Entities
   - Users: Extended profiles with business metrics and engagement data
   - Groups: Community spaces with monetization capabilities
   - Events: Ticketed events with revenue tracking
   - Posts: Content with analytics
   - Comments: Threaded discussions

2. Relationships
   - User connections (following/followers)
   - Group memberships with roles
   - Event attendance tracking
   - Content interactions (likes, bookmarks, shares)

3. Business Features
   - Subscription tiers (Free, Pro, Enterprise)
   - Paid group memberships
   - Event ticketing and revenue tracking
   - User engagement scoring
   - Analytics and reporting
*/

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-super-secret-jwt-token-with-at-least-32-characters-long';
ALTER DATABASE postgres SET "app.jwt_exp" TO 3600;

-- =====================================================
-- CORE ENTITY TABLES
-- =====================================================

-- Users Table (Extended Customer Profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE REFERENCES auth.users(id),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    cover_photo_url TEXT,
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    joined_at TIMESTAMPTZ DEFAULT now(),
    is_verified BOOLEAN DEFAULT FALSE,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Customer Profile Extensions
    customer_type VARCHAR(20) CHECK (customer_type IN ('individual', 'business', 'enterprise')) DEFAULT 'individual',
    subscription_tier VARCHAR(20) CHECK (subscription_tier IN ('free', 'pro', 'enterprise')) DEFAULT 'free',
    account_status VARCHAR(20) CHECK (account_status IN ('active', 'suspended', 'pending', 'churned')) DEFAULT 'active',
    lifetime_value DECIMAL(10,2) DEFAULT 0.00,
    acquisition_channel VARCHAR(50),
    last_login_at TIMESTAMPTZ,
    
    -- Preferences
    notifications_enabled BOOLEAN DEFAULT TRUE,
    marketing_enabled BOOLEAN DEFAULT TRUE,
    analytics_enabled BOOLEAN DEFAULT TRUE,
    
    -- Billing Information
    billing_plan VARCHAR(50),
    billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'annual')),
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
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color_gradient VARCHAR(100),
    icon VARCHAR(10),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Groups Table (Enhanced with Business Features)
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    category_id UUID REFERENCES categories(id),
    created_by UUID NOT NULL REFERENCES users(id),
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
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Events Table (Enhanced with Ticketing)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    location TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    meeting_url TEXT,
    organizer_id UUID NOT NULL REFERENCES users(id),
    group_id UUID REFERENCES groups(id),
    attendees_count INTEGER DEFAULT 0,
    max_attendees INTEGER,
    
    -- Ticketing
    is_paid BOOLEAN DEFAULT FALSE,
    ticket_price DECIMAL(8,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    tickets_sold INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0.00,
    
    -- Event Status
    status VARCHAR(20) CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'published',
    registration_deadline TIMESTAMPTZ,
    
    -- Analytics
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    satisfaction_score DECIMAL(3,2) DEFAULT 0.00,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Posts Table (Enhanced with Content Analytics)
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    group_id UUID REFERENCES groups(id),
    parent_post_id UUID REFERENCES posts(id), -- For replies/threads
    
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
    moderation_status VARCHAR(20) CHECK (moderation_status IN ('approved', 'pending', 'rejected')) DEFAULT 'approved',
    
    -- SEO and Discovery
    hashtags TEXT[] DEFAULT '{}',
    mentions TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- RELATIONSHIP TABLES
-- =====================================================

-- User Connections (Following/Followers)
CREATE TABLE IF NOT EXISTS user_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id),
    following_id UUID NOT NULL REFERENCES users(id),
    connection_type VARCHAR(20) CHECK (connection_type IN ('follow', 'block', 'mute')) DEFAULT 'follow',
    is_mutual BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(follower_id, following_id)
);

-- Group Memberships
CREATE TABLE IF NOT EXISTS group_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    group_id UUID NOT NULL REFERENCES groups(id),
    role VARCHAR(20) CHECK (role IN ('member', 'moderator', 'admin', 'owner')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Membership Analytics
    posts_count INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    
    UNIQUE(user_id, group_id)
);

-- Event Attendees
CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    event_id UUID NOT NULL REFERENCES events(id),
    status VARCHAR(20) CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')) DEFAULT 'registered',
    registration_date TIMESTAMPTZ DEFAULT now(),
    ticket_type VARCHAR(50),
    amount_paid DECIMAL(8,2) DEFAULT 0.00,
    
    UNIQUE(user_id, event_id)
);

-- =====================================================
-- CONTENT AND INTERACTION TABLES
-- =====================================================

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    post_id UUID NOT NULL REFERENCES posts(id),
    parent_comment_id UUID REFERENCES comments(id), -- For nested comments
    likes_count INTEGER DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Post Attachments
CREATE TABLE IF NOT EXISTS post_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id),
    type VARCHAR(20) CHECK (type IN ('image', 'video', 'document', 'link')) NOT NULL,
    url TEXT NOT NULL,
    filename VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    thumbnail_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User Interactions (Likes, Bookmarks, etc.)
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    target_type VARCHAR(20) CHECK (target_type IN ('post', 'comment', 'event', 'group')) NOT NULL,
    target_id UUID NOT NULL,
    interaction_type VARCHAR(20) CHECK (interaction_type IN ('like', 'bookmark', 'share', 'view', 'report')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, target_type, target_id, interaction_type)
);

-- =====================================================
-- BUSINESS AND ANALYTICS TABLES
-- =====================================================

-- Transactions (For Paid Features)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) CHECK (type IN ('subscription', 'event_ticket', 'group_membership', 'premium_feature')) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_processor VARCHAR(50),
    
    -- Related Entity
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    
    -- Billing Details
    billing_address JSONB,
    tax_amount DECIMAL(8,2) DEFAULT 0.00,
    
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Product Catalog (For Paid Features)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('subscription', 'event_ticket', 'group_access', 'premium_feature')) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_interval VARCHAR(20) CHECK (billing_interval IN ('one_time', 'monthly', 'annual')) DEFAULT 'one_time',
    
    -- Product Features
    features JSONB,
    limitations JSONB,
    
    -- Availability
    is_active BOOLEAN DEFAULT TRUE,
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    
    -- Analytics
    sales_count INTEGER DEFAULT 0,
    revenue_total DECIMAL(12,2) DEFAULT 0.00,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) CHECK (type IN ('like', 'comment', 'follow', 'mention', 'event', 'group_invite', 'system')) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    
    -- Action Data
    action_url TEXT,
    actor_id UUID REFERENCES users(id), -- User who triggered the notification
    
    -- Related Entity
    entity_type VARCHAR(50),
    entity_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    
    -- Timing
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
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
CREATE OR REPLACE VIEW user_engagement_summary AS
SELECT 
    u.id,
    u.display_name,
    u.customer_type,
    u.subscription_tier,
    u.engagement_score,
    COUNT(DISTINCT p.id) as total_posts,
    COUNT(DISTINCT c.id) as total_comments,
    COUNT(DISTINCT ui.id) as total_interactions,
    COALESCE(AVG(p.engagement_rate), 0) as avg_post_engagement,
    MAX(u.last_login_at) as last_activity
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
LEFT JOIN comments c ON u.id = c.author_id
LEFT JOIN user_interactions ui ON u.id = ui.user_id
GROUP BY u.id, u.display_name, u.customer_type, u.subscription_tier, u.engagement_score;

-- Revenue Summary View
CREATE OR REPLACE VIEW revenue_summary AS
SELECT 
    DATE(t.created_at) as transaction_date,
    t.type as transaction_type,
    COUNT(*) as transaction_count,
    SUM(t.amount) as total_revenue,
    AVG(t.amount) as avg_transaction_value
FROM transactions t
WHERE t.status = 'completed'
GROUP BY DATE(t.created_at), t.type
ORDER BY transaction_date DESC;

-- Group Performance View
CREATE OR REPLACE VIEW group_performance AS
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
    COALESCE(AVG(p.engagement_rate), 0) as avg_post_engagement
FROM groups g
LEFT JOIN group_memberships gm ON g.id = gm.group_id AND gm.is_active = TRUE
LEFT JOIN posts p ON g.id = p.group_id AND p.created_at >= (NOW() - INTERVAL '30 days')
GROUP BY g.id, g.name, g.category_id, g.members_count, g.posts_count, g.engagement_rate, g.growth_rate;

-- Event ROI View
CREATE OR REPLACE VIEW event_roi AS
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
    CASE 
        WHEN e.attendees_count > 0 THEN (e.revenue_generated / e.attendees_count)
        ELSE 0 
    END as revenue_per_attendee,
    CASE 
        WHEN e.max_attendees > 0 THEN (e.attendees_count::float / e.max_attendees * 100)
        ELSE 0 
    END as capacity_utilization
FROM events e;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update user engagement score
CREATE OR REPLACE FUNCTION update_user_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate engagement score based on activity
    UPDATE users
    SET engagement_score = (
        -- Base score from posts (max 40 points)
        LEAST(40, (SELECT COUNT(*) FROM posts WHERE author_id = NEW.id) * 2) +
        -- Score from comments (max 20 points)
        LEAST(20, (SELECT COUNT(*) FROM comments WHERE author_id = NEW.id)) +
        -- Score from interactions (max 20 points)
        LEAST(20, (SELECT COUNT(*) FROM user_interactions WHERE user_id = NEW.id)) +
        -- Score from group memberships (max 10 points)
        LEAST(10, (SELECT COUNT(*) FROM group_memberships WHERE user_id = NEW.id)) +
        -- Score from event attendance (max 10 points)
        LEAST(10, (SELECT COUNT(*) FROM event_attendees WHERE user_id = NEW.id))
    )
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user engagement score after activity
CREATE TRIGGER update_user_engagement
AFTER INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_engagement_score();

-- Function to update post counters
CREATE OR REPLACE FUNCTION update_post_counters()
RETURNS TRIGGER AS $$
BEGIN
    -- Update post comment count
    IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'comments' THEN
        UPDATE posts
        SET comments_count = comments_count + 1
        WHERE id = NEW.post_id;
    END IF;
    
    -- Update post like count
    IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'user_interactions' AND NEW.target_type = 'post' AND NEW.interaction_type = 'like' THEN
        UPDATE posts
        SET likes_count = likes_count + 1
        WHERE id = NEW.target_id::UUID;
    END IF;
    
    -- Update post share count
    IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'user_interactions' AND NEW.target_type = 'post' AND NEW.interaction_type = 'share' THEN
        UPDATE posts
        SET shares_count = shares_count + 1
        WHERE id = NEW.target_id::UUID;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for post counters
CREATE TRIGGER update_post_comments_count
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION update_post_counters();

CREATE TRIGGER update_post_likes_count
AFTER INSERT ON user_interactions
FOR EACH ROW
WHEN (NEW.target_type = 'post' AND NEW.interaction_type = 'like')
EXECUTE FUNCTION update_post_counters();

CREATE TRIGGER update_post_shares_count
AFTER INSERT ON user_interactions
FOR EACH ROW
WHEN (NEW.target_type = 'post' AND NEW.interaction_type = 'share')
EXECUTE FUNCTION update_post_counters();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view public profiles"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view public posts"
ON posts FOR SELECT
TO authenticated
USING (
  moderation_status = 'approved' AND
  (
    group_id IS NULL OR
    EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_id AND g.is_private = false
    )
  )
);

CREATE POLICY "Group members can view group posts"
ON posts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM group_memberships gm
    WHERE gm.group_id = posts.group_id
    AND gm.user_id = auth.uid()
    AND gm.is_active = true
  )
);

CREATE POLICY "Users can create posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid() AND
  (
    group_id IS NULL OR
    EXISTS (
      SELECT 1 FROM group_memberships gm
      WHERE gm.group_id = group_id
      AND gm.user_id = auth.uid()
      AND gm.is_active = true
    )
  )
);

CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (author_id = auth.uid());

-- Comments policies
CREATE POLICY "Anyone can view comments on public posts"
ON comments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM posts p
    WHERE p.id = post_id
    AND p.moderation_status = 'approved'
    AND (
      p.group_id IS NULL OR
      EXISTS (
        SELECT 1 FROM groups g
        WHERE g.id = p.group_id AND g.is_private = false
      )
    )
  )
);

CREATE POLICY "Users can create comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM posts p
    WHERE p.id = post_id
    AND (
      p.group_id IS NULL OR
      EXISTS (
        SELECT 1 FROM group_memberships gm
        WHERE gm.group_id = p.group_id
        AND gm.user_id = auth.uid()
        AND gm.is_active = true
      )
    )
  )
);

-- Group policies
CREATE POLICY "Anyone can view public groups"
ON groups FOR SELECT
TO authenticated
USING (is_private = false);

CREATE POLICY "Members can view private groups"
ON groups FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM group_memberships gm
    WHERE gm.group_id = id
    AND gm.user_id = auth.uid()
    AND gm.is_active = true
  )
);

-- Event policies
CREATE POLICY "Anyone can view public events"
ON events FOR SELECT
TO authenticated
USING (
  status = 'published' AND
  (
    group_id IS NULL OR
    EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_id AND g.is_private = false
    )
  )
);

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert Categories
INSERT INTO categories (id, name, description, color_gradient, icon, sort_order) VALUES
(gen_random_uuid(), 'Tech Innovation', 'Cutting-edge technology, startups, and digital transformation', 'from-blue-500 to-cyan-500', '💻', 1),
(gen_random_uuid(), 'Creative Design', 'UI/UX design, visual arts, and creative expression', 'from-purple-500 to-pink-500', '🎨', 2),
(gen_random_uuid(), 'Business Growth', 'Entrepreneurship, marketing, and business strategy', 'from-green-500 to-emerald-500', '📈', 3),
(gen_random_uuid(), 'Health & Wellness', 'Mental health, fitness, and work-life balance', 'from-emerald-500 to-teal-500', '🌱', 4),
(gen_random_uuid(), 'Learning & Development', 'Skill development, courses, and knowledge sharing', 'from-orange-500 to-red-500', '📚', 5);

-- Insert Products (Subscription Tiers)
INSERT INTO products (id, name, description, type, price, currency, billing_interval, features, limitations, is_active) VALUES
(gen_random_uuid(), 'Communiti Pro', 'Enhanced features for power users and professionals', 'subscription', 19.99, 'USD', 'monthly',
 '["Advanced analytics", "Priority support", "Custom themes", "Extended storage", "Advanced search"]'::jsonb,
 '{"posts_per_day": 50, "groups_created": 10, "events_created": 20}'::jsonb,
 TRUE),

(gen_random_uuid(), 'Communiti Enterprise', 'Full-featured solution for organizations and teams', 'subscription', 199.99, 'USD', 'monthly',
 '["All Pro features", "Team management", "Advanced moderation", "Custom branding", "API access", "SSO integration", "Dedicated support"]'::jsonb,
 '{"posts_per_day": -1, "groups_created": -1, "events_created": -1}'::jsonb,
 TRUE);