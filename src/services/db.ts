import { createClient } from '@supabase/supabase-js';
import { BlogPost, SiteContent, ContactMessage } from '../types';

const getEnvVar = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] || '';
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || '';
    }
  } catch {
    // ignore
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');

// Check if credentials are set and not placeholder values
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// DEFAULT SEED DATA FOR SANDBOX MODE
// ==========================================

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

const SEED_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    message: "Hi Shibani, I absolutely love your content! Your take on Banarasi silks with digital designs is inspiring. Would love to collaborate for our upcoming digital fashion exhibition.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "msg-2",
    name: "Dr. Aisha Rao",
    email: "aisha.rao@techuni.edu",
    message: "Hello! I am a researcher studying Human-AI Interaction. I would love to interview you or your development team regarding your conversational companion experience.",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to initialize local storage
const initLocalStorage = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  if (!localStorage.getItem('shibani_site_content')) {
    localStorage.setItem('shibani_site_content', JSON.stringify(SEED_SITE_CONTENT));
  }
  
  const existingPostsRaw = localStorage.getItem('shibani_blog_posts');
  if (!existingPostsRaw) {
    localStorage.setItem('shibani_blog_posts', JSON.stringify(SEED_BLOG_POSTS));
  } else {
    try {
      const existingPosts: BlogPost[] = JSON.parse(existingPostsRaw);
      let updated = false;
      for (const seedPost of SEED_BLOG_POSTS) {
        if (!existingPosts.some(p => p.slug === seedPost.slug || p.id === seedPost.id)) {
          existingPosts.push(seedPost);
          updated = true;
        }
      }
      if (updated) {
        localStorage.setItem('shibani_blog_posts', JSON.stringify(existingPosts));
      }
    } catch {
      localStorage.setItem('shibani_blog_posts', JSON.stringify(SEED_BLOG_POSTS));
    }
  }

  if (!localStorage.getItem('shibani_contact_messages')) {
    localStorage.setItem('shibani_contact_messages', JSON.stringify(SEED_CONTACT_MESSAGES));
  }
};

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined' && !isSupabaseConfigured) {
  initLocalStorage();
}

// ==========================================
// DB SERVICE METHODS (ROUTER BETWEEN REAL/SANDBOX)
// ==========================================

export const getLocalBlogPosts = (): BlogPost[] => {
  initLocalStorage();
  const posts: BlogPost[] = JSON.parse(localStorage.getItem('shibani_blog_posts') || '[]');
  return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const getLocalBlogPostBySlug = (slug: string): BlogPost | null => {
  initLocalStorage();
  const posts: BlogPost[] = JSON.parse(localStorage.getItem('shibani_blog_posts') || '[]');
  
  // 1. Exact slug match
  let found = posts.find(p => p.slug === slug);
  if (found) return found;

  // 2. Normalized slug match
  const cleanTarget = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  found = posts.find(p => p.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTarget);
  if (found) return found;

  // 3. Partial or substring match
  found = posts.find(p => slug.includes(p.slug) || p.slug.includes(slug));
  if (found) return found;

  // 4. Check SEED_BLOG_POSTS directly
  found = SEED_BLOG_POSTS.find(p => p.slug === slug) ||
          SEED_BLOG_POSTS.find(p => p.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTarget) ||
          SEED_BLOG_POSTS.find(p => slug.includes(p.slug) || p.slug.includes(slug)) || null;

  return found || null;
};

export const createLocalBlogPost = (post: Omit<BlogPost, 'id' | 'created_at'>): BlogPost => {
  initLocalStorage();
  const posts: BlogPost[] = JSON.parse(localStorage.getItem('shibani_blog_posts') || '[]');
  const newPost: BlogPost = {
    ...post,
    id: `post-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  posts.push(newPost);
  localStorage.setItem('shibani_blog_posts', JSON.stringify(posts));
  return newPost;
};

export const updateLocalBlogPost = (id: string, postUpdates: Partial<BlogPost>): BlogPost => {
  initLocalStorage();
  const posts: BlogPost[] = JSON.parse(localStorage.getItem('shibani_blog_posts') || '[]');
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Blog post not found');
  
  const updatedPost = {
    ...posts[index],
    ...postUpdates
  };
  posts[index] = updatedPost;
  localStorage.setItem('shibani_blog_posts', JSON.stringify(posts));
  return updatedPost;
};

export const deleteLocalBlogPost = (id: string): void => {
  initLocalStorage();
  let posts: BlogPost[] = JSON.parse(localStorage.getItem('shibani_blog_posts') || '[]');
  posts = posts.filter(p => p.id !== id);
  localStorage.setItem('shibani_blog_posts', JSON.stringify(posts));
};

export const getLocalSiteContent = (): SiteContent => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem('shibani_site_content') || JSON.stringify(SEED_SITE_CONTENT));
};

export const updateLocalSiteContent = (updates: Partial<SiteContent>): SiteContent => {
  initLocalStorage();
  const current = JSON.parse(localStorage.getItem('shibani_site_content') || JSON.stringify(SEED_SITE_CONTENT));
  const updated = { ...current, ...updates };
  localStorage.setItem('shibani_site_content', JSON.stringify(updated));
  return updated;
};

export const submitLocalContactMessage = (message: Omit<ContactMessage, 'id' | 'created_at'>): ContactMessage => {
  initLocalStorage();
  const messages: ContactMessage[] = JSON.parse(localStorage.getItem('shibani_contact_messages') || '[]');
  const newMsg: ContactMessage = {
    ...message,
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  messages.unshift(newMsg);
  localStorage.setItem('shibani_contact_messages', JSON.stringify(messages));
  return newMsg;
};

export const getLocalContactMessages = (): ContactMessage[] => {
  initLocalStorage();
  const messages: ContactMessage[] = JSON.parse(localStorage.getItem('shibani_contact_messages') || '[]');
  return messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const deleteLocalContactMessage = (id: string): void => {
  initLocalStorage();
  let messages: ContactMessage[] = JSON.parse(localStorage.getItem('shibani_contact_messages') || '[]');
  messages = messages.filter(m => m.id !== id);
  localStorage.setItem('shibani_contact_messages', JSON.stringify(messages));
};

export const dbService = {
  // --- BLOG POSTS ---
  async getBlogPosts(): Promise<BlogPost[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          localStorage.setItem('shibani_blog_posts', JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.warn('Supabase getBlogPosts exception:', err);
      }
    }

    try {
      const res = await fetch(`/api/blog-posts?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('shibani_blog_posts', JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('Server API getBlogPosts failed, falling back to local posts:', err);
    }

    return getLocalBlogPosts();
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase getBlogPostBySlug exception:', err);
      }
    }

    try {
      const res = await fetch(`/api/blog-posts?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const posts: BlogPost[] = await res.json();
        const found = posts.find(p => p.slug === slug) ||
          posts.find(p => p.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === slug.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
          posts.find(p => slug.includes(p.slug) || p.slug.includes(slug));
        if (found) return found;
      }
    } catch (err) {
      console.warn('Server API getBlogPostBySlug failed:', err);
    }

    return getLocalBlogPostBySlug(slug);
  },

  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
    let result: BlogPost | null = null;

    if (supabase) {
      try {
        const newPost = {
          ...post,
          created_at: new Date().toISOString()
        };
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([newPost])
          .select()
          .single();
        if (!error && data) {
          result = data;
        }
      } catch (err) {
        console.warn('Supabase createBlogPost exception:', err);
      }
    }

    try {
      const res = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      if (res.ok) {
        const data = await res.json();
        result = data;
      }
    } catch (err) {
      console.warn('Server API createBlogPost failed:', err);
    }

    const localCreated = createLocalBlogPost(post);
    return result || localCreated;
  },

  async updateBlogPost(id: string, postUpdates: Partial<BlogPost>): Promise<BlogPost> {
    let result: BlogPost | null = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postUpdates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          result = data;
        }
      } catch (err) {
        console.warn('Supabase updateBlogPost exception:', err);
      }
    }

    try {
      const res = await fetch(`/api/blog-posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postUpdates)
      });
      if (res.ok) {
        const data = await res.json();
        result = data;
      }
    } catch (err) {
      console.warn('Server API updateBlogPost failed:', err);
    }

    const localUpdated = updateLocalBlogPost(id, postUpdates);
    return result || localUpdated;
  },

  async deleteBlogPost(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteBlogPost exception:', err);
      }
    }

    try {
      await fetch(`/api/blog-posts/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Server API deleteBlogPost failed:', err);
    }

    deleteLocalBlogPost(id);
  },

  // --- SITE CONTENT ---
  async getSiteContent(): Promise<SiteContent> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*');
        if (!error && data && data.length > 0) {
          localStorage.setItem('shibani_site_content', JSON.stringify(data[0]));
          return data[0];
        }
      } catch (err) {
        console.warn('Supabase getSiteContent exception:', err);
      }
    }

    try {
      const res = await fetch(`/api/site-content?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          localStorage.setItem('shibani_site_content', JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('Server API getSiteContent failed, falling back to local content:', err);
    }

    return getLocalSiteContent();
  },

  async updateSiteContent(updates: Partial<SiteContent>): Promise<SiteContent> {
    let result: SiteContent | null = null;

    if (supabase) {
      try {
        const { data } = await supabase.from('site_content').select('id');
        if (data && data.length > 0) {
          const { data: updated, error } = await supabase
            .from('site_content')
            .update(updates)
            .eq('id', data[0].id)
            .select()
            .single();
          if (!error && updated) {
            result = updated;
          }
        } else {
          const { data: created, error } = await supabase
            .from('site_content')
            .insert([{ ...SEED_SITE_CONTENT, ...updates }])
            .select()
            .single();
          if (!error && created) {
            result = created;
          }
        }
      } catch (err) {
        console.warn('Supabase updateSiteContent exception:', err);
      }
    }

    try {
      const res = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        result = data;
      }
    } catch (err) {
      console.warn('Server API updateSiteContent failed:', err);
    }

    const localUpdated = updateLocalSiteContent(updates);
    const finalContent = result || localUpdated;
    localStorage.setItem('shibani_site_content', JSON.stringify(finalContent));
    return finalContent;
  },

  // --- CONTACT MESSAGES ---
  async submitContactMessage(message: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    let result: ContactMessage | null = null;

    if (supabase) {
      try {
        const newMsg = {
          ...message,
          created_at: new Date().toISOString()
        };
        const { data, error } = await supabase
          .from('contact_messages')
          .insert([newMsg])
          .select()
          .single();
        if (!error && data) {
          result = data;
        }
      } catch (err) {
        console.warn('Supabase submitContactMessage exception:', err);
      }
    }

    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      if (res.ok) {
        const data = await res.json();
        result = data;
      }
    } catch (err) {
      console.warn('Server API submitContactMessage failed:', err);
    }

    const localMsg = submitLocalContactMessage(message);
    return result || localMsg;
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase getContactMessages exception:', err);
      }
    }

    try {
      const res = await fetch(`/api/contact-messages?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Server API getContactMessages failed:', err);
    }

    return getLocalContactMessages();
  },

  async deleteContactMessage(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase
          .from('contact_messages')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteContactMessage exception:', err);
      }
    }

    try {
      await fetch(`/api/contact-messages/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Server API deleteContactMessage failed:', err);
    }

    deleteLocalContactMessage(id);
  },

  // --- IMAGE UPLOAD SIMULATION ---
  async uploadImage(file: File): Promise<string> {
    if (supabase) {
      try {
        // Try to upload to a bucket named 'shibani-assets'
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('shibani-assets')
          .upload(filePath, file);

        if (uploadError) {
          console.warn('Storage upload failed, falling back to FileReader: ', uploadError);
          // Fall back to base64 if bucket doesn't exist yet
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        const { data } = supabase.storage
          .from('shibani-assets')
          .getPublicUrl(filePath);

        return data.publicUrl;
      } catch (e) {
        console.error('Storage error: ', e);
        // Fallback to FileReader base64
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
    } else {
      // In sandbox mode, read file to Base64 dataURL so it persists in local storage perfectly!
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }
};
