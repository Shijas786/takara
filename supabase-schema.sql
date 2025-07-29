-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    has_sbt BOOLEAN DEFAULT FALSE,
    sbt_token_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create influencers table
CREATE TABLE influencers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    handle VARCHAR(100) NOT NULL,
    avatar VARCHAR(255),
    description TEXT,
    style TEXT,
    followers INTEGER DEFAULT 0,
    category VARCHAR(20) CHECK (category IN ('crypto', 'tech', 'farcaster')),
    sample_tweets JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_posts table
CREATE TABLE generated_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    influencer_id VARCHAR(50) REFERENCES influencers(id),
    mixed_influencer_id VARCHAR(50) REFERENCES influencers(id),
    viral_score INTEGER CHECK (viral_score >= 0 AND viral_score <= 100),
    user_id VARCHAR(42) REFERENCES users(wallet_address),
    is_posted BOOLEAN DEFAULT FALSE,
    farcaster_hash VARCHAR(255),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auto_post_schedules table
CREATE TABLE auto_post_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(42) REFERENCES users(wallet_address),
    frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'custom')),
    time_of_day TIME,
    days_of_week INTEGER[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_analytics table
CREATE TABLE post_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES generated_posts(id),
    farcaster_hash VARCHAR(255),
    likes INTEGER DEFAULT 0,
    recasts INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(42) REFERENCES users(wallet_address),
    default_style VARCHAR(20) DEFAULT 'shitpost',
    default_length VARCHAR(10) DEFAULT 'medium',
    auto_post_enabled BOOLEAN DEFAULT FALSE,
    notification_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_generated_posts_user_id ON generated_posts(user_id);
CREATE INDEX idx_generated_posts_created_at ON generated_posts(created_at DESC);
CREATE INDEX idx_auto_post_schedules_user_id ON auto_post_schedules(user_id);
CREATE INDEX idx_auto_post_schedules_active ON auto_post_schedules(is_active);
CREATE INDEX idx_post_analytics_farcaster_hash ON post_analytics(farcaster_hash);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_post_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can only see their own generated posts
CREATE POLICY "Users can view own posts" ON generated_posts
    FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own posts" ON generated_posts
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own posts" ON generated_posts
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can only see their own auto-post schedules
CREATE POLICY "Users can view own schedules" ON auto_post_schedules
    FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own schedules" ON auto_post_schedules
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own schedules" ON auto_post_schedules
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can only see their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Insert sample influencers data
INSERT INTO influencers (id, name, handle, avatar, description, style, followers, category, sample_tweets) VALUES
('rushimanche', 'Rushi Manche', '@rushimanche', '/avatars/rushimanche.jpg', 'Crypto OG, Move ecosystem builder', 'Aggressive, bullish, uses lots of emojis and slang', 50000, 'crypto', '["down markets incite rage and pain. unbothered, unhinged, unafraid 🚀", "minecraft move mansion. we are going to build a national move reserve 💎", "Q4 is wartime mode. time to build or get rekt 📈"]'),
('vitalik', 'Vitalik Buterin', '@VitalikButerin', '/avatars/vitalik.jpg', 'Ethereum co-founder, technical genius', 'Technical, thoughtful, uses complex terminology', 5000000, 'crypto', '["The merge is complete! 🎉", "ZK-rollups are the future of scaling", "Proof of stake is more secure than proof of work"]'),
('elonmusk', 'Elon Musk', '@elonmusk', '/avatars/elon.jpg', 'Tesla CEO, Twitter owner, meme lord', 'Chaotic, meme-heavy, unpredictable', 150000000, 'tech', '["To the moon! 🚀", "The future is now", "Doge to $1? 🤔"]'),
('dwr', 'Dwr', '@dwr', '/avatars/dwr.jpg', 'Farcaster OG, social protocol builder', 'Witty, technical, community-focused', 25000, 'farcaster', '["Farcaster is the future of social", "Building in public is the way", "Community > everything else"]'),
('cobie', 'Cobie', '@cobie', '/avatars/cobie.jpg', 'Crypto trader, CT personality', 'Sarcastic, market-focused, uses trading slang', 100000, 'crypto', '["Market is looking spicy today 🌶️", "Long $ETH, short your ex", "Wen moon? Soon™"]'),
('sassal', 'Sassal', '@sassal0x', '/avatars/sassal.jpg', 'Farcaster co-founder, protocol builder', 'Technical, optimistic, community-driven', 30000, 'farcaster', '["Farcaster is just getting started", "Decentralized social is the future", "Build for the community"]');

-- Create function to update last_active timestamp
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_active
CREATE TRIGGER update_user_last_active_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_last_active();

-- Create function to calculate engagement rate
CREATE OR REPLACE FUNCTION calculate_engagement_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.likes > 0 OR NEW.recasts > 0 OR NEW.replies > 0 THEN
        NEW.engagement_rate = ((NEW.likes + NEW.recasts + NEW.replies)::DECIMAL / GREATEST(NEW.views, 1)) * 100;
    ELSE
        NEW.engagement_rate = 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to calculate engagement rate
CREATE TRIGGER calculate_engagement_rate_trigger
    BEFORE INSERT OR UPDATE ON post_analytics
    FOR EACH ROW
    EXECUTE FUNCTION calculate_engagement_rate(); 