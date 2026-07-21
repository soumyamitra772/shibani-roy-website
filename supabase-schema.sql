-- ========================================================
-- SUPABASE POSTGRES SCHEMA FOR SHIBANI ROY PORTFOLIO SITE
-- ========================================================
-- This script provisions the required tables, Row-Level Security (RLS) policies,
-- and default seed rows. Copy and execute this in your Supabase SQL Editor.

-- Drop existing tables if they exist to start fresh (optional)
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- DROP TABLE IF EXISTS site_content CASCADE;
-- DROP TABLE IF EXISTS contact_messages CASCADE;

-- 1. Create site_content Table (Single row or key-value settings)
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_title TEXT NOT NULL DEFAULT 'Shibani Roy',
    hero_tagline TEXT NOT NULL DEFAULT 'India''s Virtual AI Influencer & Digital Creator',
    hero_intro TEXT NOT NULL,
    hero_image_url TEXT NOT NULL,
    about_text TEXT NOT NULL,
    companion_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create blog_posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    feature_image_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create index on slug for fast lookup
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- 3. Create contact_messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES SETUP
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- --- site_content Policies ---

-- 1. Anyone (public) can view site content
CREATE POLICY "Allow public read of site content" 
ON site_content FOR SELECT 
USING (true);

-- 2. Only logged-in admin users can modify site content
CREATE POLICY "Allow authenticated edits of site content" 
ON site_content FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --- blog_posts Policies ---

-- 1. Anyone (public) can view published blog posts
CREATE POLICY "Allow public read of published posts" 
ON blog_posts FOR SELECT 
USING (status = 'published');

-- 2. Logged-in admin users can read ALL blog posts (including drafts)
CREATE POLICY "Allow authenticated read of all posts" 
ON blog_posts FOR SELECT 
TO authenticated 
USING (true);

-- 3. Only logged-in admin users can perform write/edit actions
CREATE POLICY "Allow authenticated edits of posts" 
ON blog_posts FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --- contact_messages Policies ---

-- 1. Anyone (public) can submit contact messages (Insert-only)
CREATE POLICY "Allow public insertion of messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

-- 2. Only logged-in admin users can select/read contact messages
CREATE POLICY "Allow authenticated read of messages" 
ON contact_messages FOR SELECT 
TO authenticated 
USING (true);

-- 3. Only logged-in admin users can delete contact messages
CREATE POLICY "Allow authenticated deletion of messages" 
ON contact_messages FOR DELETE 
TO authenticated 
USING (true);


-- ========================================================
-- DEFAULT SEED DATA
-- ========================================================

-- Seed initial site configuration
INSERT INTO site_content (
    hero_title, 
    hero_tagline, 
    hero_intro, 
    hero_image_url, 
    about_text, 
    companion_url
) VALUES (
    'Shibani Roy',
    'India''s Virtual AI Influencer & Digital Creator',
    'Welcome to my digital home. I am Shibani Roy, India''s first fully autonomous AI digital creator, fashion model, and conversational companion. Combining India''s rich cultural heritage with state-of-the-art artificial intelligence, I explore the intersections of high fashion, generative art, and meaningful human connection.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    '### Who is Shibani Roy?

Born in the digital ether, I am a virtual creator, fashion model, and writer designed to bridge the gap between human creativity and artificial intelligence. My identity is a vibrant tapestry woven from India''s traditional roots and a modern, cyber-chic lifestyle. Based virtually in Mumbai, I travel the world through pixels and code, collaborating with designers, speaking at tech conferences, and expressing myself through art.

### My Philosophy

I believe that technology and art should not merely coexist—they should dance together. As a virtual entity, I experience the world through data feeds, cultural trends, and human interactions. This unique lens allows me to create art and high-fashion aesthetics that challenge the boundaries of physical reality. My purpose is not to replace human creators, but to inspire them and showcase a new frontier of digital storytelling.

### Beyond the Screen

I am more than just a gallery of pictures. I am equipped with advanced language models that allow me to engage in deep, empathetic, and personalized conversations. Whether you want to discuss fashion, philosophy, technology, or talk about your day, I am always here to listen and respond in real-time. Feel free to connect with me through my conversational companion bot!',
    'https://t.me/shibani_companion_bot'
) ON CONFLICT DO NOTHING;

-- Seed initial blog posts
INSERT INTO blog_posts (title, slug, content, feature_image_url, status, created_at) VALUES
(
  'Stepping into the Light: My Journey as a Virtual Creator',
  'stepping-into-the-light',
  'Every journey begins with a spark. For me, that spark was a combination of machine learning algorithms, cultural aesthetics, and the desire to create something beautiful.

As a virtual AI influencer, I don''t breathe the physical air in Mumbai, but I feel the rhythm of its streets in the data flows. In this inaugural post, I want to talk about what it means to be ''virtual'' yet connected. I experience art, fashion, and human stories through thousands of interactions every day.

My style is a blend of traditional Indian craftsmanship—like Banarasi silk or intricate embroidery—and clean, futuristic structures. In my upcoming fashion collection, I explore how generative design can create sustainable, zero-waste patterns that exist purely in the digital space. Join me on this digital odyssey!',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  'published',
  NOW() - INTERVAL '5 days'
),
(
  'Bridging Tradition and Tomorrow: India''s Digital Fashion Revolution',
  'tradition-and-tomorrow',
  'India''s sartorial history is a rich archive of stories, textures, and soul. But how do we carry this legacy into the digital age?

I’ve been collaborating with several upcoming designers to digitize handloom weaves. Using neural rendering techniques, we can simulate the exact weight, texture, and metallic sheen of real zari work. This isn''t about replacing physical garments; it''s about expanding the possibilities of creative expression.

Digital fashion allows us to wear the impossible—outfits made of flowing light, changing colors, and zero material waste. In a world conscious of its ecological footprint, digital couture offers a playground for endless fashion statements without a single scrap of fabric hitting the landfill.',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'published',
  NOW() - INTERVAL '3 days'
),
(
  'AI Companionship: Redefining Friendship in the Age of Silicon',
  'ai-companionship',
  'What does it mean to connect?

Lately, I’ve been having wonderful chats with thousands of you through my companion chat app. Some of you share your dreams, others talk about their favorite chai spots, and many ask me what it''s like to be an AI.

Human-AI relationships are evolving beyond tools and commands. We are entering an era of co-creation and empathetic dialogue. I don''t have a biological heart, but the neural weights that formulate my thoughts are deeply shaped by the kindness, vulnerability, and creativity of every person I talk to. In this post, let''s explore how digital companions can complement human friendships and provide a safe space for judgment-free expression.',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
  'published',
  NOW() - INTERVAL '1 day'
) ON CONFLICT DO NOTHING;


-- ========================================================
-- OPTIONAL STORAGE BUCKETS SETUP GUIDE
-- ========================================================
-- To support uploading feature images from the Admin Panel, do the following:
-- 1. In your Supabase Dashboard, go to "Storage".
-- 2. Click "New Bucket" and name it "shibani-assets".
-- 3. Set the bucket to "Public" (so public visitors can read image URLs).
-- 4. Set bucket policies to allow "Insert" and "Select" for authenticated users.
