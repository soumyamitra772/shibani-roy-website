import fs from 'fs';
import path from 'path';
import { BlogPost, SiteContent, ContactMessage } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

const DEFAULT_AVATAR = '/images/shibani_avatar_1784621038657.jpg';
const DEFAULT_HERO = '/images/shibani_hero_1784621056791.jpg';

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

export interface StoreData {
  siteContent: SiteContent;
  blogPosts: BlogPost[];
  contactMessages: ContactMessage[];
}

let memoryStore: StoreData | null = (globalThis as any).__SHIBANI_STORE__ || null;

export function readServerStore(): StoreData {
  if (memoryStore) return memoryStore;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      memoryStore = {
        siteContent: { ...SEED_SITE_CONTENT, ...(parsed.siteContent || {}) },
        blogPosts: Array.isArray(parsed.blogPosts) ? parsed.blogPosts : SEED_BLOG_POSTS,
        contactMessages: Array.isArray(parsed.contactMessages) ? parsed.contactMessages : [],
      };
      (globalThis as any).__SHIBANI_STORE__ = memoryStore;
      return memoryStore;
    }
  } catch (err) {
    console.error('Error reading server store:', err);
  }
  memoryStore = {
    siteContent: { ...SEED_SITE_CONTENT },
    blogPosts: [...SEED_BLOG_POSTS],
    contactMessages: [],
  };
  (globalThis as any).__SHIBANI_STORE__ = memoryStore;
  return memoryStore;
}

export function writeServerStore(data: StoreData): void {
  memoryStore = data;
  (globalThis as any).__SHIBANI_STORE__ = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing server store:', err);
  }
}

export function getServerSiteContent(): SiteContent {
  return readServerStore().siteContent;
}

export function updateServerSiteContent(updates: Partial<SiteContent>): SiteContent {
  const store = readServerStore();
  const updatedContent = { ...store.siteContent, ...updates };
  store.siteContent = updatedContent;
  writeServerStore(store);
  return updatedContent;
}

export function getServerBlogPosts(): BlogPost[] {
  const posts = readServerStore().blogPosts;
  return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function saveServerBlogPost(postData: Partial<BlogPost> & { title: string }): BlogPost {
  const store = readServerStore();
  const posts = store.blogPosts;

  if (postData.id) {
    const idx = posts.findIndex(p => p.id === postData.id);
    if (idx !== -1) {
      const updatedPost = { ...posts[idx], ...postData };
      posts[idx] = updatedPost;
      store.blogPosts = posts;
      writeServerStore(store);
      return updatedPost;
    }
  }

  const newPost: BlogPost = {
    id: postData.id || `post-${Date.now()}`,
    title: postData.title,
    slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    content: postData.content || '',
    feature_image_url: postData.feature_image_url || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    status: postData.status || 'published',
    created_at: postData.created_at || new Date().toISOString()
  };

  posts.push(newPost);
  store.blogPosts = posts;
  writeServerStore(store);
  return newPost;
}

export function deleteServerBlogPost(id: string): void {
  const store = readServerStore();
  store.blogPosts = store.blogPosts.filter(p => p.id !== id);
  writeServerStore(store);
}

export function getServerContactMessages(): ContactMessage[] {
  const msgs = readServerStore().contactMessages;
  return msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function saveServerContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at'>): ContactMessage {
  const store = readServerStore();
  const newMsg: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  store.contactMessages.unshift(newMsg);
  writeServerStore(store);
  return newMsg;
}

export function deleteServerContactMessage(id: string): void {
  const store = readServerStore();
  store.contactMessages = store.contactMessages.filter(m => m.id !== id);
  writeServerStore(store);
}
