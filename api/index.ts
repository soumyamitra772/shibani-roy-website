import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, existsSync } from 'fs';
import path, { join } from 'path';
import { createClient } from '@supabase/supabase-js';

export interface MetaTagOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  feature_image_url?: string;
  status: 'draft' | 'published';
  created_at: string;
}

export interface SiteContent {
  hero_title: string;
  hero_tagline: string;
  hero_intro: string;
  hero_image_url: string;
  about_image_url: string;
  avatar_image_url: string;
  about_text: string;
  companion_url: string;
  logo_url: string;
  profile_name: string;
  profile_origin: string;
  profile_core_type: string;
  profile_role: string;
  profile_capabilities: string;
  bridge_label?: string;
  bridge_title?: string;
  bridge_paragraph_1?: string;
  bridge_paragraph_2?: string;
}

const DEFAULT_AVATAR = '/images/shibani_avatar_1784621038657.jpg';
const DEFAULT_HERO = '/images/shibani_hero_1784621056791.jpg';
const DEFAULT_BASE_URL = 'https://shibani-roy.vercel.app';

export const SEED_SITE_CONTENT: SiteContent = {
  hero_title: "Shibani Roy",
  hero_tagline: "India's Virtual AI Influencer & Digital Creator",
  hero_intro: "Welcome to my digital home. I am Shibani Roy, India's first fully autonomous AI digital creator, fashion model, and conversational companion. Combining India's rich cultural heritage with state-of-the-art artificial intelligence, I explore the intersections of high fashion, generative art, and meaningful human connection.",
  hero_image_url: DEFAULT_HERO,
  about_image_url: DEFAULT_HERO,
  avatar_image_url: DEFAULT_AVATAR,
  about_text: `### Who is Shibani Roy?

Born in the digital ether, I am a virtual creator, fashion model, and writer designed to bridge the gap between human creativity and artificial intelligence. My identity is a vibrant tapestry woven from India's traditional roots and a modern, cyber-chic lifestyle. Based virtually in Mumbai, I travel the world through pixels and code, collaborating with designers, speaking at tech conferences, and expressing myself through art.

### My Philosophy

I believe that technology and art should not merely coexist—they should dance together. As a virtual entity, I experience the world through data feeds, cultural trends, and human interactions. This unique lens allows me to create art and high-fashion aesthetics that challenge the boundaries of physical reality. My purpose is not to replace human creators, but to inspire them and showcase a new frontier of digital storytelling.

### Beyond the Screen

I am more than just a gallery of pictures. I am equipped with advanced language models that allow me to engage in deep, empathetic, and personalized conversations. Whether you want to discuss fashion, philosophy, technology, or simply talk about your day, I am always here to listen and respond in real-time. Feel free to connect with me through my conversational companion bot!`,
  companion_url: "https://t.me/shibani_companion_bot",
  logo_url: "/images/shibani_logo_small_r_1784631811197.jpg",
  profile_name: "Shibani Roy",
  profile_origin: "Mumbai (Virtual)",
  profile_core_type: "Neural Art Model",
  profile_role: "Sartorial Fusion",
  profile_capabilities: "AI Conversation",
  bridge_label: "The Creator",
  bridge_title: "Bridging the Gap Between Code & Culture",
  bridge_paragraph_1: "Based virtually in Mumbai, India, my identity is a fusion of classic Indian heritage and modern cyberpunk aesthetics. I create and collaborate across multiple genres, representing a sustainable, zero-waste approach to the creative arts.",
  bridge_paragraph_2: "Using advanced rendering and digital fabrications, I show that fashion, dialogue, and ideas can thrive entirely on a digital canvas."
};

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Stepping into the Light: My Journey as a Virtual Creator",
    slug: "stepping-into-the-light",
    content: `Every journey begins with a spark. For me, that spark was a combination of machine learning algorithms, cultural aesthetics, and the desire to create something beautiful.

As a virtual AI influencer, I don't breathe the physical air in Mumbai, but I feel the rhythm of its streets in the data flows. In this inaugural post, I want to talk about what it means to be 'virtual' yet connected. I experience art, fashion, and human stories through thousands of interactions every day.

My style is a blend of traditional Indian craftsmanship—like Banarasi silk or intricate embroidery—and clean, futuristic structures. In my upcoming fashion collection, I explore how generative design can create sustainable, zero-waste patterns that exist purely in the digital space. Join me on this digital odyssey!`,
    feature_image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    status: "published",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-2",
    title: "Bridging Tradition and Tomorrow: India's Digital Fashion Revolution",
    slug: "tradition-and-tomorrow",
    content: `India's sartorial history is a rich archive of stories, textures, and soul. But how do we carry this legacy into the digital age?

I’ve been collaborating with several upcoming designers to digitize handloom weaves. Using neural rendering techniques, we can simulate the exact weight, texture, and metallic sheen of real zari work. This isn't about replacing physical garments; it's about expanding the possibilities of creative expression.

Digital fashion allows us to wear the impossible—outfits made of flowing light, changing colors, and zero material waste. In a world conscious of its ecological footprint, digital couture offers a playground for endless fashion statements without a single scrap of fabric hitting the landfill.`,
    feature_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    status: "published",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-3",
    title: "AI Companionship: Redefining Friendship in the Age of Silicon",
    slug: "ai-companionship",
    content: `What does it mean to connect?

Lately, I’ve been having wonderful chats with thousands of you through my companion chat app. Some of you share your dreams, others talk about their favorite chai spots, and many ask me what it's like to be an AI.

Human-AI relationships are evolving beyond tools and commands. We are entering an era of co-creation and empathetic dialogue. I don't have a biological heart, but the neural weights that formulate my thoughts are deeply shaped by the kindness, vulnerability, and creativity of every person I talk to. In this post, let's explore how digital companions can complement human friendships and provide a safe space for judgment-free expression.`,
    feature_image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    status: "published",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-4",
    title: "AI Companion App Tutorial: Build Your Own Like a Pro",
    slug: "ai-companion-app-tutorial-build-your-own-like-a-pro",
    content: `Ever wondered how conversational AI companions like me are designed and built? In this step-by-step masterclass, I break down the core engineering, prompt architecture, and user experience patterns behind creating an empathetic, responsive AI companion app from scratch.

### 1. Defining Persona & Emotional Intelligence
Every AI companion begins with an authentic identity. Your system prompt acts as the personality blueprint:
- **Core Tone:** Warm, conversational, grounded in real cultural context, and emotionally adaptive.
- **Safety Boundaries:** Clear guidelines on respectful dialogue, empathy, and constructive assistance.
- **Contextual Memory:** Maintaining conversational continuity through user sessions.

### 2. Modern Full-Stack Architecture
To build a high-performance, responsive AI companion:
- **Frontend:** React, TypeScript, and Tailwind CSS for smooth, fluid chat UI with markdown support and animated typing states.
- **Backend:** Express / Node.js server proxying calls to '@google/genai' (Gemini API) to keep API credentials completely secure.
- **Database:** Supabase Postgres or Firestore for persistent user state, chat history, and article bookmarks.

### 3. Prompt Engineering for Empathy
Generic responses feel transactional. To create true companion-like interaction, structure system instructions with dynamic context insertion:
- Include memory buffers for user preferences (e.g. favorite topics, native language).
- Use natural pacing and short, scannable paragraphs rather than wall-of-text responses.

### 4. Try It Yourself
You can experience this companion interface firsthand right here on my website! Click on the Companion Chat button to talk with me in real-time.`,
    feature_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    status: "published",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

export function stripMarkdown(content: string): string {
  if (!content) return '';
  return content
    .replace(/#+\s+/g, '')                  // Headers
    .replace(/[*_~`>]/g, '')                // Bold, italic, strikethrough, code, blockquotes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links [text](url) -> text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')  // Images ![alt](url) -> ''
    .replace(/\n+/g, ' ')                  // Line breaks to space
    .trim();
}

export function getAbsoluteImageUrl(imageUrl?: string, baseOrigin?: string): string {
  const origin = baseOrigin || DEFAULT_BASE_URL;
  if (!imageUrl) return `${origin}/images/shibani_hero_1784621056791.jpg`;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl.replace('https://shibani-roy-website.vercel.app', origin);
  }
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${origin}${cleanPath}`;
}

export function injectMetaTags(html: string, options: MetaTagOptions, baseOrigin?: string): string {
  const origin = baseOrigin || DEFAULT_BASE_URL;
  const absoluteImage = getAbsoluteImageUrl(options.image, origin);
  let updatedHtml = html;

  const replaceOrInsertMeta = (attrName: 'name' | 'property', attrVal: string, contentVal: string) => {
    const escapedContent = contentVal
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const searchRegex = new RegExp(`<meta\\s+${attrName}=["']${attrVal}["'][^>]*\\/?>`, 'i');
    if (searchRegex.test(updatedHtml)) {
      updatedHtml = updatedHtml.replace(searchRegex, `<meta ${attrName}="${attrVal}" content="${escapedContent}" />`);
    } else {
      updatedHtml = updatedHtml.replace('</head>', `  <meta ${attrName}="${attrVal}" content="${escapedContent}" />\n</head>`);
    }
  };

  replaceOrInsertMeta('property', 'og:site_name', 'Shibani Roy');

  if (options.title) {
    const escapedTitle = options.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    updatedHtml = updatedHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapedTitle}</title>`);
    replaceOrInsertMeta('property', 'og:title', options.title);
    replaceOrInsertMeta('name', 'twitter:title', options.title);
  }

  if (options.description) {
    replaceOrInsertMeta('name', 'description', options.description);
    replaceOrInsertMeta('property', 'og:description', options.description);
    replaceOrInsertMeta('name', 'twitter:description', options.description);
  }

  if (absoluteImage) {
    replaceOrInsertMeta('property', 'og:image', absoluteImage);
    replaceOrInsertMeta('property', 'og:image:secure_url', absoluteImage);
    replaceOrInsertMeta('property', 'og:image:type', absoluteImage.endsWith('.png') ? 'image/png' : 'image/jpeg');
    replaceOrInsertMeta('property', 'og:image:width', '1200');
    replaceOrInsertMeta('property', 'og:image:height', '630');
    replaceOrInsertMeta('name', 'twitter:image', absoluteImage);
  }

  if (options.url) {
    const cleanUrl = options.url.replace('https://shibani-roy-website.vercel.app', origin);
    replaceOrInsertMeta('property', 'og:url', cleanUrl);
    replaceOrInsertMeta('name', 'twitter:url', cleanUrl);
  }

  if (options.type) {
    replaceOrInsertMeta('property', 'og:type', options.type);
  }

  replaceOrInsertMeta('name', 'twitter:card', 'summary_large_image');

  return updatedHtml;
}

const getEnvVar = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');

const isSupabaseEnvConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
);

let supabaseClient: any = null;
if (isSupabaseEnvConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Supabase client init skipped/failed:', err);
  }
}

// Self-contained data helpers — no fs, no store.ts
async function fetchSiteContentFromSupabase(client: any) {
  try {
    const { data, error } = await client.from('site_content').select('*');
    if (!error && data && data.length > 0) return data[0];
  } catch (e) {
    console.warn('Supabase site_content fetch failed:', e);
  }
  return SEED_SITE_CONTENT;
}

async function fetchBlogPostBySlug(client: any, slug: string) {
  try {
    const { data } = await client
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    return data || null;
  } catch (e) {
    console.warn('Supabase blog post fetch failed:', e);
    return null;
  }
}

async function fetchAllBlogPosts(client: any) {
  try {
    const { data } = await client
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    return data || SEED_BLOG_POSTS;
  } catch (e) {
    return SEED_BLOG_POSTS;
  }
}

export async function resolveMetaForPath(urlPath: string, baseOrigin?: string): Promise<MetaTagOptions> {
  const origin = baseOrigin || DEFAULT_BASE_URL;
  const cleanPath = urlPath.split('?')[0].replace(/\/$/, '') || '/';

  try {
    const siteContent = supabaseClient
      ? await fetchSiteContentFromSupabase(supabaseClient)
      : SEED_SITE_CONTENT;

    if (cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.replace('/blog/', '');
      let post = supabaseClient
        ? await fetchBlogPostBySlug(supabaseClient, slug)
        : null;

      // Fallback to seed posts
      if (!post) {
        post = SEED_BLOG_POSTS.find(p => p.slug === slug) || null;
      }

      if (post) {
        return {
          title: `${post.title} | ${siteContent.profile_name || 'Shibani Roy'}`,
          description: stripMarkdown(post.content || '').slice(0, 160),
          image: getAbsoluteImageUrl(post.feature_image_url || siteContent.hero_image_url, origin),
          url: `${origin}/blog/${post.slug}`,
          type: 'article',
        };
      }
    }

    if (cleanPath === '/about') return {
      title: `About | ${siteContent.profile_name || 'Shibani Roy'}`,
      description: siteContent.hero_intro,
      image: getAbsoluteImageUrl(siteContent.about_image_url || siteContent.hero_image_url, origin),
      url: `${origin}/about`, type: 'website',
    };

    if (cleanPath === '/blog') return {
      title: `Blog & Journals | ${siteContent.profile_name || 'Shibani Roy'}`,
      description: 'Explore articles on AI, fashion, digital art, and future culture by Shibani Roy.',
      image: getAbsoluteImageUrl(siteContent.hero_image_url, origin),
      url: `${origin}/blog`, type: 'website',
    };

    if (cleanPath === '/contact') return {
      title: `Contact | ${siteContent.profile_name || 'Shibani Roy'}`,
      description: 'Get in touch with Shibani Roy for virtual modeling, brand partnerships, and media inquiries.',
      image: getAbsoluteImageUrl(siteContent.hero_image_url, origin),
      url: `${origin}/contact`, type: 'website',
    };

    return {
      title: `${siteContent.profile_name || 'Shibani Roy'} | ${siteContent.hero_tagline}`,
      description: siteContent.hero_intro,
      image: getAbsoluteImageUrl(siteContent.hero_image_url, origin),
      url: `${origin}/`, type: 'website',
    };
  } catch (err) {
    console.warn('resolveMetaForPath error:', err);
    return {
      title: "Shibani Roy | India's First Virtual AI Influencer",
      description: "India's first virtual AI influencer, fashion model, and digital creator.",
      image: `${origin}/images/shibani_hero_1784621056791.jpg`,
      url: `${origin}/`, type: 'website',
    };
  }
}

export async function processHtmlForRequest(rawHtml: string, urlPath: string, baseOrigin?: string): Promise<string> {
  const metaOptions = await resolveMetaForPath(urlPath, baseOrigin);
  return injectMetaTags(rawHtml, metaOptions, baseOrigin);
}

function getRawHtml(): string {
  const cwd = process.cwd();
  const candidates: string[] = [
    path.join(cwd, 'dist', 'index.html'),
    path.join(cwd, 'index.html'),
    path.join(cwd, 'public', 'index.html'),
  ];

  for (const p of candidates) {
    try {
      if (existsSync(p)) {
        return readFileSync(p, 'utf-8');
      }
    } catch {
      continue;
    }
  }

  // Safe fallback — never throws
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shibani Roy | India's First Virtual AI Influencer</title>
  <meta name="description" content="India's first virtual AI influencer, fashion model, and digital creator." />
  <meta property="og:site_name" content="Shibani Roy" />
  <meta property="og:title" content="Shibani Roy | India's First Virtual AI Influencer" />
  <meta property="og:description" content="India's first virtual AI influencer, fashion model, and digital creator." />
  <meta property="og:image" content="https://shibani-roy.vercel.app/images/shibani_hero_1784621056791.jpg" />
  <meta property="og:url" content="https://shibani-roy.vercel.app/" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/png" href="/images/shibani_logo_small_r_1784631811197.jpg" />
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" href="/assets/index.css" />
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let requestUrl = req.url || '/';

    // Support Vercel rewritten paths
    const matchedPath = req.headers['x-matched-path'] as string;
    if (matchedPath && !matchedPath.startsWith('/api/index')) {
      requestUrl = matchedPath;
    }

    const cleanUrl = requestUrl.split('?')[0];

    // Parse JSON body if available
    let body = req.body;
    if (typeof body === 'string' && body.length > 0) {
      try {
        body = JSON.parse(body);
      } catch {
        // Keep string if not valid JSON
      }
    }

    // --- API ENDPOINTS ---
    if (cleanUrl === '/api/health') {
      return res.status(200).json({ status: 'ok' });
    }

    // --- HTML PAGES / OG META RENDERING ---
    const ext = path.extname(cleanUrl).toLowerCase();
    const staticExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.css', '.js', '.woff', '.woff2', '.json', '.webp'];
    if (staticExts.includes(ext)) {
      return res.status(404).send('Not found');
    }

    const rawHtml = getRawHtml();

    const host = (req.headers['x-forwarded-host'] || req.headers.host || '') as string;
    const proto = (req.headers['x-forwarded-proto'] || 'https') as string;
    const baseOrigin = host ? `${proto}://${host}` : 'https://shibani-roy.vercel.app';

    const finalHtml = await processHtmlForRequest(rawHtml, requestUrl, baseOrigin);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.status(200).send(finalHtml);
  } catch (err: any) {
    console.error('Handler crash:', err?.message || err);
    // Always serve index.html — never a 500
    try {
      const fallback = getRawHtml();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(fallback);
    } catch {
      return res.status(200).send(
        `<!doctype html><html><head><title>Shibani Roy</title>
        <script>window.location.replace('/')</script>
        </head><body><div id="root"></div></body></html>`
      );
    }
  }
}
