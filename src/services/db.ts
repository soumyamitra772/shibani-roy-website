import { createClient } from '@supabase/supabase-js';
import { BlogPost, SiteContent, ContactMessage, ServiceItem, ServicesPageSettings, PrivacySectionData, PrivacyPolicyData, LegalPageData } from '../types';

export const DEFAULT_TERMS_CONTENT: LegalPageData = {
  id: 'terms',
  title: 'Terms & Conditions',
  content: `<p>Welcome to Shibani Roy AI. By accessing or using our website, AI companion services, and digital features, you agree to be bound by these Terms & Conditions.</p><h2>1. Acceptance of Terms</h2><p>By interacting with Shibani Roy across our website or third-party messaging channels, you acknowledge that Shibani Roy is a virtual AI entity designed for creative, conversational, and entertainment purposes.</p><h2>2. Intellectual Property</h2><p>All content, branding, visual avatars, digital art, text, and software associated with Shibani Roy are the exclusive intellectual property of Shibani Roy and its creators.</p><h2>3. User Conduct</h2><p>Users must not engage in abusive, harassing, or illegal conduct when interacting with the AI companion or our digital services.</p><h2>4. Modifications</h2><p>We reserve the right to update these Terms & Conditions at any time. Continued use of our services constitutes acceptance of the updated terms.</p>`,
  last_updated: '2026-07-29T00:00:00.000Z'
};

export const DEFAULT_REFUND_CONTENT: LegalPageData = {
  id: 'refund',
  title: 'Refund & Cancellation Policy',
  content: `<p>Thank you for using Shibani Roy AI services. Please read our Refund & Cancellation Policy carefully.</p><h2>1. Digital Services & Subscriptions</h2><p>All purchases for Shibani Roy AI digital services, companion subscriptions, or virtual modeling commissions are digital products and processed electronically.</p><h2>2. Refund Eligibility</h2><p>Due to the immediate provisioning of AI computing resources and digital content, payments are non-refundable once service access has been granted, except where required by applicable law.</p><h2>3. Subscription Cancellations</h2><p>You may cancel your ongoing subscription at any time. Your access will remain active until the end of the current billing cycle, and no further charges will be incurred.</p><h2>4. Contact & Support</h2><p>If you experience any billing discrepancies or technical issues with your purchase, please contact our support team at <a href="mailto:rshibani096@gmail.com">rshibani096@gmail.com</a> within 7 days of purchase.</p>`,
  last_updated: '2026-07-29T00:00:00.000Z'
};

export const DEFAULT_PRIVACY_CONTENT: PrivacyPolicyData = {
  lastUpdated: 'July 29, 2026',
  title: 'Privacy Policy',
  subtitle: 'How Shibani Roy collects, uses, and protects your data across AI conversational experiences.',
  sections: [
    {
      id: 'introduction',
      title: '1. Introduction',
      iconName: 'Shield',
      content: [
        'Welcome to the official Privacy Policy for Shibani Roy — India’s Virtual AI Influencer & Conversational Companion.',
        'This policy outlines how we handle user data when you interact with Shibani Roy across our web portal, social channels, and AI messaging bots on Telegram, Instagram, and Facebook.',
        'We respect your privacy and are committed to protecting any personal information collected during your interactions with our AI companion.'
      ]
    },
    {
      id: 'information-collected',
      title: '2. Information We Collect',
      iconName: 'MessageSquare',
      content: [
        'When you engage in conversations with Shibani Roy on platforms such as Instagram, Facebook, or Telegram, we collect the following data:',
        '• Platform User Identifiers: Your platform-specific user ID, username, or handle on Instagram, Facebook, or Telegram.',
        '• Message Content: The text messages, prompts, and queries you send during chat sessions.',
        '• Interaction Metadata: Timestamps of interactions and message delivery status.'
      ]
    },
    {
      id: 'how-we-use-information',
      title: '3. How We Use Information',
      iconName: 'Cpu',
      content: [
        'The information collected is used strictly and exclusively for generating relevant, engaging AI responses in real-time.',
        '• Generating AI Responses: Message content is processed to synthesize contextually accurate dialogue from Shibani Roy.',
        '• Session Continuity: User IDs are used to maintain context across multi-turn chat sessions.',
        '• We DO NOT sell, lease, or monetize your personal conversation data or platform IDs to advertisers or third-party brokers.'
      ]
    },
    {
      id: 'data-retention',
      title: '4. Data Retention & Security',
      iconName: 'Database',
      content: [
        '• Secure Storage: All stored user data, message logs, and interaction records are housed securely in Supabase with database-level encryption.',
        '• Access Control: Access to conversation logs is restricted strictly to authorized systems and maintainers for system operation and debugging.',
        '• Encryption: Data transmitted between platforms is encrypted in transit using industry-standard TLS protocols.'
      ]
    },
    {
      id: 'data-deletion',
      title: '5. Data Deletion Rights',
      iconName: 'Trash2',
      content: [
        'You have full ownership of your data and can request complete deletion of your records at any time.',
        'If you wish to delete your chat history, user ID, or stored interaction logs from our databases, please contact us directly.',
        'Upon receiving a verifiable request, we will permanently purge all associated user IDs and conversation data within 30 days.'
      ]
    },
    {
      id: 'third-party-services',
      title: '6. Third-Party Services',
      iconName: 'Lock',
      content: [
        'To power Shibani Roy’s intelligence and multi-platform presence, we integrate with trusted third-party service providers:',
        '• Google Gemini API: Powers the underlying language models for natural language understanding and response generation.',
        '• Meta Platforms (Instagram & Facebook): Handles webhook events and messaging routing for social media chat channels.',
        '• Supabase: Provides encrypted cloud database hosting for user interaction records and system content management.'
      ]
    },
    {
      id: 'contact-us',
      title: '7. Contact Us',
      iconName: 'Mail',
      content: [
        'If you have any questions about this Privacy Policy, wish to exercise your data deletion rights, or have privacy concerns, please contact our team at:',
        '• Email: rshibani096@gmail.com',
        '• Official Website: https://shibani-roy.vercel.app/contact'
      ]
    }
  ]
};

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

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
const DEFAULT_HERO = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_LOGO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

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
  logo_url: DEFAULT_LOGO,
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

export const SEED_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    icon: '🤝',
    title: 'Brand Collaboration',
    description: 'Sponsored posts, product features, and brand storytelling across platforms.',
    includes: ['Instagram / Reels posts', 'LinkedIn content', 'Long-form blog feature', 'Custom Shibani × Brand narrative'],
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'srv-2',
    icon: '👗',
    title: 'Virtual Modeling',
    description: 'AI-generated fashion imagery featuring Shibani for lookbooks, campaigns, and product visuals.',
    includes: ['Outfit showcase', 'Lifestyle imagery', 'Multi-look campaign shoots', 'Brand moodboard alignment'],
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'srv-3',
    icon: '✍️',
    title: 'Sponsored Blog Content',
    description: 'SEO-optimized articles written in Shibani\'s voice, published on her blog.',
    includes: ['1500–2500 word feature', 'SEO meta optimized', 'Backlink to brand site', 'Social amplification'],
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'srv-4',
    icon: '🎙️',
    title: 'Digital Campaigns',
    description: 'End-to-end campaigns with Shibani as the face — concept to content delivery.',
    includes: ['Creative concept', 'Multi-platform rollout', 'Caption + copy writing', 'Campaign performance brief'],
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 'srv-5',
    icon: '🎨',
    title: 'AI Image & Video Generation',
    description: 'Custom AI-generated visuals and short-form videos featuring Shibani — built for campaigns, ads, and social content.',
    includes: ['Campaign-ready AI images', 'Short-form video clips', 'Brand-aligned visual style', 'Multiple format deliverables'],
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'srv-6',
    icon: '📱',
    title: 'UGC-Style AI Content for Brands',
    description: 'Authentic-feeling user-generated content created by Shibani\'s AI persona — designed to convert on paid and organic channels.',
    includes: ['Product unboxing style videos', 'Testimonial-format content', 'Platform-native formats (Reels, Shorts)', 'Hook + CTA scripting'],
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString()
  },
  {
    id: 'srv-7',
    icon: '💡',
    title: 'Content Strategy & Creative Consultation',
    description: 'Strategic guidance for brands wanting to work with virtual influencers or build AI-powered content pipelines.',
    includes: ['Virtual influencer brief', 'Content calendar planning', 'Platform strategy (India-focused)', '1:1 consultation session'],
    is_active: true,
    sort_order: 7,
    created_at: new Date().toISOString()
  }
];

export const SEED_SERVICES_PAGE_SETTINGS: ServicesPageSettings = {
  id: 1,
  hero_heading: "Work With Shibani",
  hero_subtext: "India's AI virtual influencer — available for brand partnerships, digital campaigns, and virtual modeling projects.",
  hero_image_url: ""
};

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

  if (!localStorage.getItem('shibani_services')) {
    localStorage.setItem('shibani_services', JSON.stringify(SEED_SERVICES));
  }

  if (!localStorage.getItem('shibani_services_settings')) {
    localStorage.setItem('shibani_services_settings', JSON.stringify(SEED_SERVICES_PAGE_SETTINGS));
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

export const getLocalServices = (): ServiceItem[] => {
  initLocalStorage();
  const services: ServiceItem[] = JSON.parse(localStorage.getItem('shibani_services') || JSON.stringify(SEED_SERVICES));
  return services.sort((a, b) => a.sort_order - b.sort_order);
};

export const createLocalService = (service: Omit<ServiceItem, 'id' | 'created_at'>): ServiceItem => {
  initLocalStorage();
  const services: ServiceItem[] = JSON.parse(localStorage.getItem('shibani_services') || JSON.stringify(SEED_SERVICES));
  const newService: ServiceItem = {
    ...service,
    id: `srv-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  services.push(newService);
  localStorage.setItem('shibani_services', JSON.stringify(services));
  return newService;
};

export const updateLocalService = (id: string, updates: Partial<ServiceItem>): ServiceItem => {
  initLocalStorage();
  const services: ServiceItem[] = JSON.parse(localStorage.getItem('shibani_services') || JSON.stringify(SEED_SERVICES));
  const index = services.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Service not found');
  const updated = { ...services[index], ...updates };
  services[index] = updated;
  localStorage.setItem('shibani_services', JSON.stringify(services));
  return updated;
};

export const deleteLocalService = (id: string): void => {
  initLocalStorage();
  let services: ServiceItem[] = JSON.parse(localStorage.getItem('shibani_services') || JSON.stringify(SEED_SERVICES));
  services = services.filter(s => s.id !== id);
  localStorage.setItem('shibani_services', JSON.stringify(services));
};

export const getLocalServicesPageSettings = (): ServicesPageSettings => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem('shibani_services_settings') || JSON.stringify(SEED_SERVICES_PAGE_SETTINGS));
};

export const updateLocalServicesPageSettings = (updates: Partial<ServicesPageSettings>): ServicesPageSettings => {
  initLocalStorage();
  const current = getLocalServicesPageSettings();
  const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem('shibani_services_settings', JSON.stringify(updated));
  return updated;
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
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': getEnvVar('VITE_ADMIN_SECRET_KEY')
        },
        body: JSON.stringify(post)
      });
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && serverData.id) {
          result = result || serverData;
        }
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
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': getEnvVar('VITE_ADMIN_SECRET_KEY')
        },
        body: JSON.stringify(postUpdates)
      });
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && serverData.id) {
          result = result || serverData;
        }
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
      await fetch(`/api/blog-posts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': getEnvVar('VITE_ADMIN_SECRET_KEY')
        }
      });
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
          const row = data[0];
          const merged: SiteContent = {
            ...SEED_SITE_CONTENT,
            ...Object.fromEntries(
              Object.entries(row).filter(([_, v]) => v !== null && v !== undefined && v !== '')
            ),
          } as SiteContent;
          localStorage.setItem('shibani_site_content', JSON.stringify(merged));
          return merged;
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
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': getEnvVar('VITE_ADMIN_SECRET_KEY')
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const serverData = await res.json();
        if (serverData) {
          result = result || serverData;
        }
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
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': getEnvVar('VITE_ADMIN_SECRET_KEY')
        },
        body: JSON.stringify(message)
      });
      if (res.ok) {
        const serverData = await res.json();
        if (serverData) {
          result = result || serverData;
        }
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
      await fetch(`/api/contact-messages/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': getEnvVar('VITE_ADMIN_SECRET_KEY')
        }
      });
    } catch (err) {
      console.warn('Server API deleteContactMessage failed:', err);
    }

    deleteLocalContactMessage(id);
  },

  // --- IMAGE UPLOAD SIMULATION ---
  async uploadImage(file: File): Promise<string> {
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('shibani-assets')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          throw new Error(`Supabase Storage upload failed: ${uploadError.message}. Make sure the "shibani-assets" bucket exists and is set to PUBLIC in your Supabase dashboard under Storage → Buckets.`);
        }

        const { data } = supabase.storage
          .from('shibani-assets')
          .getPublicUrl(filePath);

        return data.publicUrl;
      } catch (e: any) {
        throw new Error(e?.message || 'Image upload failed. Please check your Supabase Storage bucket setup.');
      }
    } else {
      // Sandbox mode — warn clearly
      throw new Error('Image upload requires Supabase. Please connect your Supabase project first.');
    }
  },

  // --- SERVICES & SERVICES PAGE SETTINGS ---
  async getServices(includeInactive = false): Promise<ServiceItem[]> {
    if (supabase) {
      try {
        let query = supabase.from('services').select('*').order('sort_order', { ascending: true });
        if (!includeInactive) {
          query = query.eq('is_active', true);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          if (includeInactive) {
            localStorage.setItem('shibani_services', JSON.stringify(data));
          }
          return data;
        }
      } catch (err) {
        console.warn('Supabase getServices exception:', err);
      }
    }

    const localServices = getLocalServices();
    return includeInactive ? localServices : localServices.filter(s => s.is_active);
  },

  async createService(service: Omit<ServiceItem, 'id' | 'created_at'>): Promise<ServiceItem> {
    let result: ServiceItem | null = null;
    if (supabase) {
      try {
        const newSrv = {
          ...service,
          created_at: new Date().toISOString()
        };
        const { data, error } = await supabase
          .from('services')
          .insert([newSrv])
          .select()
          .single();
        if (!error && data) {
          result = data;
        }
      } catch (err) {
        console.warn('Supabase createService exception:', err);
      }
    }

    const localCreated = createLocalService(service);
    return result || localCreated;
  },

  async updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    let result: ServiceItem | null = null;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          result = data;
        }
      } catch (err) {
        console.warn('Supabase updateService exception:', err);
      }
    }

    const localUpdated = updateLocalService(id, updates);
    return result || localUpdated;
  },

  async deleteService(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase
          .from('services')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteService exception:', err);
      }
    }

    deleteLocalService(id);
  },

  async getServicesPageSettings(): Promise<ServicesPageSettings> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('services_page_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();
        if (!error && data) {
          localStorage.setItem('shibani_services_settings', JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.warn('Supabase getServicesPageSettings exception:', err);
      }
    }

    return getLocalServicesPageSettings();
  },

  async updateServicesPageSettings(updates: Partial<ServicesPageSettings>): Promise<ServicesPageSettings> {
    let result: ServicesPageSettings | null = null;
    if (supabase) {
      try {
        const { data: existing } = await supabase.from('services_page_settings').select('id').eq('id', 1);
        if (existing && existing.length > 0) {
          const { data: updated, error } = await supabase
            .from('services_page_settings')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', 1)
            .select()
            .single();
          if (!error && updated) {
            result = updated;
          }
        } else {
          const { data: created, error } = await supabase
            .from('services_page_settings')
            .insert([{ id: 1, ...SEED_SERVICES_PAGE_SETTINGS, ...updates }])
            .select()
            .single();
          if (!error && created) {
            result = created;
          }
        }
      } catch (err) {
        console.warn('Supabase updateServicesPageSettings exception:', err);
      }
    }

    const localUpdated = updateLocalServicesPageSettings(updates);
    const finalSettings = result || localUpdated;
    localStorage.setItem('shibani_services_settings', JSON.stringify(finalSettings));
    return finalSettings;
  },

  async uploadServiceImage(file: File): Promise<string> {
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `services/${fileName}`;

        // Try services-images bucket first
        let { error: uploadError } = await supabase.storage
          .from('services-images')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          // Fallback to shibani-assets bucket
          const { error: fallbackError } = await supabase.storage
            .from('shibani-assets')
            .upload(`services/${fileName}`, file, { upsert: true });

          if (fallbackError) {
            throw new Error(`Supabase Storage upload failed: ${uploadError.message}. Make sure the "services-images" or "shibani-assets" bucket exists and is set to PUBLIC.`);
          }

          const { data } = supabase.storage
            .from('shibani-assets')
            .getPublicUrl(`services/${fileName}`);
          return data.publicUrl;
        }

        const { data } = supabase.storage
          .from('services-images')
          .getPublicUrl(filePath);

        return data.publicUrl;
      } catch (e: any) {
        throw new Error(e?.message || 'Service image upload failed. Please check your Supabase Storage bucket setup.');
      }
    } else {
      throw new Error('Image upload requires Supabase. Please connect your Supabase project first.');
    }
  },

  // --- SITE SETTINGS (KEY-VALUE) & PRIVACY POLICY ---
  async getSiteSetting(key: string): Promise<string | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', key)
          .maybeSingle();
        if (!error && data && data.value) {
          localStorage.setItem(`shibani_site_setting_${key}`, data.value);
          return data.value;
        }
      } catch (err) {
        console.warn(`Supabase getSiteSetting(${key}) exception:`, err);
      }
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(`shibani_site_setting_${key}`);
    }
    return null;
  },

  async updateSiteSetting(key: string, value: string): Promise<string> {
    const updated_at = new Date().toISOString();
    if (supabase) {
      try {
        const { data: existing } = await supabase
          .from('site_settings')
          .select('key')
          .eq('key', key);

        if (existing && existing.length > 0) {
          const { error } = await supabase
            .from('site_settings')
            .update({ value, updated_at })
            .eq('key', key);
          if (error) console.warn(`Supabase update error for site_settings key ${key}:`, error);
        } else {
          const { error } = await supabase
            .from('site_settings')
            .insert([{ key, value, updated_at }]);
          if (error) console.warn(`Supabase insert error for site_settings key ${key}:`, error);
        }
      } catch (err) {
        console.warn(`Supabase updateSiteSetting(${key}) exception:`, err);
      }
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`shibani_site_setting_${key}`, value);
    }
    return value;
  },

  async getPrivacyPolicy(): Promise<PrivacyPolicyData> {
    try {
      const rawValue = await this.getSiteSetting('privacy_policy');
      if (rawValue) {
        const parsed = JSON.parse(rawValue);
        if (parsed && parsed.title && Array.isArray(parsed.sections)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse privacy policy from site_settings:', e);
    }
    return DEFAULT_PRIVACY_CONTENT;
  },

  async updatePrivacyPolicy(data: PrivacyPolicyData): Promise<PrivacyPolicyData> {
    const stringified = JSON.stringify(data);
    await this.updateSiteSetting('privacy_policy', stringified);
    return data;
  },

  async getLegalPage(id: string): Promise<LegalPageData> {
    const defaultPage = id === 'refund' ? DEFAULT_REFUND_CONTENT : DEFAULT_TERMS_CONTENT;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('legal_pages')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.warn(`Supabase getLegalPage error for ${id}:`, error);
        } else if (data) {
          return {
            id: data.id || id,
            title: data.title || defaultPage.title,
            content: data.content || defaultPage.content,
            last_updated: data.last_updated || defaultPage.last_updated
          };
        }
      } catch (err) {
        console.warn(`Failed fetching legal page ${id} from Supabase:`, err);
      }
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(`shibani_legal_page_${id}`);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.warn('Failed to parse cached legal page:', e);
        }
      }
    }

    return defaultPage;
  },

  async updateLegalPage(id: string, title: string, content: string): Promise<LegalPageData> {
    const last_updated = new Date().toISOString();
    const payload: LegalPageData = { id, title, content, last_updated };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('legal_pages')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error(`Supabase upsert error for legal_pages (${id}):`, error);
        throw error;
      }
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`shibani_legal_page_${id}`, JSON.stringify(payload));
    }

    return payload;
  }
};


