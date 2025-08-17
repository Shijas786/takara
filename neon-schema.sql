-- Neon PostgreSQL Schema for Takara App
-- Run this in your Neon database to create the required tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farcaster_fid VARCHAR(255) UNIQUE NOT NULL,
  auto_post_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Influencers table
CREATE TABLE IF NOT EXISTS influencers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  avatar TEXT,
  description TEXT,
  style VARCHAR(100),
  followers INTEGER DEFAULT 0,
  category VARCHAR(100),
  sample_tweets TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated posts table
CREATE TABLE IF NOT EXISTS generated_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  influencer_id UUID REFERENCES influencers(id),
  mixed_influencer_id UUID REFERENCES influencers(id),
  viral_score DECIMAL(5,2) DEFAULT 0,
  user_id VARCHAR(255) NOT NULL,
  is_posted BOOLEAN DEFAULT FALSE,
  farcaster_hash VARCHAR(255),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto post schedules table
CREATE TABLE IF NOT EXISTS auto_post_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  frequency VARCHAR(50) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'custom')),
  time_of_day TIME NOT NULL,
  days_of_week INTEGER[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_farcaster_fid ON users(farcaster_fid);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON generated_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON generated_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON auto_post_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_influencers_style ON influencers(style);
CREATE INDEX IF NOT EXISTS idx_influencers_category ON influencers(category);

-- Insert some sample influencers
INSERT INTO influencers (name, handle, avatar, description, style, followers, category, sample_tweets) VALUES
('Crypto Guru', '@cryptoguru', 'https://picsum.photos/200', 'Leading crypto analyst and educator', 'based', 50000, 'crypto', ARRAY['Wen moon ser? 🚀', 'This is the way 💎', 'HODL strong! 💪']),
('Tech Influencer', '@techinfluencer', 'https://picsum.photos/201', 'Tech enthusiast and content creator', 'influencer', 75000, 'tech', ARRAY['The future is now! 🔮', 'Innovation never stops ⚡', 'Tech is life 💻']),
('Meme Lord', '@memelord', 'https://picsum.photos/202', 'Master of memes and viral content', 'casual', 30000, 'entertainment', ARRAY['Pepe approves this message 🐸', 'Meme magic is real ✨', 'Laughter is the best medicine 😂']),
('Reply Guy', '@replyguy', 'https://picsum.photos/203', 'Always has something to say', 'reply guy', 15000, 'social', ARRAY['Actually... 🤓', 'Well, technically... 📚', 'I disagree because... 💭'])
ON CONFLICT (handle) DO NOTHING;
