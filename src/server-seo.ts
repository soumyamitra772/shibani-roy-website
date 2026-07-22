import { createClient } from '@supabase/supabase-js';
import { injectMetaTags, stripMarkdown, MetaTagOptions } from './utils/seo';
import { SEED_BLOG_POSTS, SEED_SITE_CONTENT } from './services/db';
import { BlogPost } from './types';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const isSupabaseEnvConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

const supabase = isSupabaseEnvConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function resolveMetaForPath(urlPath: string, baseOrigin?: string): Promise<MetaTagOptions> {
  const origin = baseOrigin || 'https://shibani-roy.vercel.app';
  const cleanPath = urlPath.split('?')[0].replace(/\/$/, '') || '/';

  // Check for article route: /blog/:slug
  if (cleanPath.startsWith('/blog/')) {
    const slug = cleanPath.replace('/blog/', '');
    let post: BlogPost | null = null;

    if (supabase && slug) {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();
        if (data) post = data;
      } catch (e) {
        console.warn('Server Supabase query error for slug:', slug, e);
      }
    }

    if (!post && slug) {
      const cleanTarget = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      post = SEED_BLOG_POSTS.find(p => p.slug === slug) ||
             SEED_BLOG_POSTS.find(p => p.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTarget) ||
             SEED_BLOG_POSTS.find(p => slug.includes(p.slug) || p.slug.includes(slug)) || null;
    }

    if (post) {
      const plainTextExcerpt = stripMarkdown(post.content).slice(0, 160);
      return {
        title: `${post.title} | Shibani Roy`,
        description: plainTextExcerpt || 'Read this article by Shibani Roy.',
        image: post.feature_image_url || SEED_SITE_CONTENT.hero_image_url,
        url: `${origin}/blog/${post.slug}`,
        type: 'article',
      };
    }
  }

  if (cleanPath === '/about') {
    return {
      title: 'About | Shibani Roy',
      description: SEED_SITE_CONTENT.hero_intro || "India's first virtual AI influencer, fashion model, and digital creator.",
      image: SEED_SITE_CONTENT.about_image_url || SEED_SITE_CONTENT.hero_image_url,
      url: `${origin}/about`,
      type: 'website',
    };
  }

  if (cleanPath === '/blog') {
    return {
      title: 'Blog & Journals | Shibani Roy',
      description: 'Explore articles on AI, fashion, digital art, and future culture by Shibani Roy.',
      image: SEED_SITE_CONTENT.hero_image_url,
      url: `${origin}/blog`,
      type: 'website',
    };
  }

  if (cleanPath === '/contact') {
    return {
      title: 'Contact | Shibani Roy',
      description: 'Get in touch with Shibani Roy for virtual modeling, brand partnerships, and media inquiries.',
      image: SEED_SITE_CONTENT.hero_image_url,
      url: `${origin}/contact`,
      type: 'website',
    };
  }

  // Default Home Page Meta
  return {
    title: "Shibani Roy | India's First Virtual AI Influencer & Creator",
    description: "Shibani Roy is India's first virtual AI influencer — bold, warm, and emotionally adaptive. Launched in August 2025, she covers Indian fashion, culture, lifestyle and AI. Chat with her on the companion app.",
    image: `${origin}/images/shibani_hero_1784621056791.jpg`,
    url: `${origin}/`,
    type: 'website',
  };
}

export async function processHtmlForRequest(rawHtml: string, urlPath: string, baseOrigin?: string): Promise<string> {
  const metaOptions = await resolveMetaForPath(urlPath, baseOrigin);
  return injectMetaTags(rawHtml, metaOptions, baseOrigin);
}
