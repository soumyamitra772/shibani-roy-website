import React from 'react';
import { BlogPost, SiteContent } from '../types';
import { stripMarkdown } from '../utils/seo';
import { MessageSquare, ArrowRight, Calendar, User, Sparkles, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

interface HomeViewProps {
  siteContent: SiteContent;
  latestPosts: BlogPost[];
  setRoute: (route: { page: string; param: string }) => void;
}

export default function HomeView({ siteContent, latestPosts, setRoute }: HomeViewProps) {
  // Format ISO date to readable string
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <div className="space-y-24 pb-20 animate-fade-in">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Full Logo Panel inside the Hero Composition */}
              <div className="flex justify-center lg:justify-start">
                <div className="glass-card rounded-[32px] p-4 shadow-lg border border-brand-100 flex items-center space-x-4 bg-white/90 max-w-sm transition-all hover:shadow-xl hover:scale-102">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-brand-200 shadow-inner shrink-0">
                    <img
                      src={siteContent.logo_url || "/images/shibani_logo_small_r_1784631811197.jpg"}
                      alt="Shibani Roy Full Logo"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-brand-900 text-lg leading-tight">Shibani Roy</h3>
                    <p className="text-[9px] font-mono font-bold text-brand-600 uppercase tracking-widest mt-0.5">Signature Brand Identity</p>
                  </div>
                </div>
              </div>

              <div className="inline-block bg-brand-50 border border-brand-200 text-brand-900 py-1.5 px-4 rounded-full text-xs font-bold tracking-wider uppercase">
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                  <span>India's First Virtual AI Influencer</span>
                </span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-brand-900 leading-[1.05]">
                {siteContent.hero_title || 'Shibani Roy'}
              </h1>
              <p className="font-display text-xl sm:text-2xl font-medium text-brand-600 leading-normal italic">
                {siteContent.hero_tagline || 'India\'s Virtual AI Influencer & Digital Creator'}
              </p>
              <p className="text-zinc-700 text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {siteContent.hero_intro || 'Welcome to my digital home. I am Shibani, India\'s pioneer virtual digital creator.'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => navigateTo('#/contact')}
                  className="px-8 py-4 bg-brand-600 text-white rounded-full font-semibold text-sm hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Collab With Me <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={siteContent.companion_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border border-brand-200 bg-white text-brand-900 rounded-full font-semibold text-sm hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="h-4 w-4 text-brand-600" /> Chat as AI Companion
                </a>
              </div>

              {/* Social Media Shortcuts */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in">
                <span className="text-xs font-mono font-bold text-brand-600 uppercase tracking-wider">Connect:</span>
                <div className="flex items-center gap-3">
                  <a href="https://www.instagram.com/shibanir96/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-brand-100 bg-white text-zinc-500 hover:text-brand-500 hover:border-brand-500 hover:shadow-md transition-all" title="Instagram">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61579287061338" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-brand-100 bg-white text-zinc-500 hover:text-brand-500 hover:border-brand-500 hover:shadow-md transition-all" title="Facebook">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://www.linkedin.com/company/shibani-roy-virtual-ai-influencer/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-brand-100 bg-white text-zinc-500 hover:text-brand-500 hover:border-brand-500 hover:shadow-md transition-all" title="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://x.com/shibanir96" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-brand-100 bg-white text-zinc-500 hover:text-brand-500 hover:border-brand-500 hover:shadow-md transition-all" title="X (Twitter)">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="https://in.pinterest.com/rshibani096/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-brand-100 bg-white text-zinc-500 hover:text-brand-500 hover:border-brand-500 hover:shadow-md transition-all flex items-center justify-center font-mono text-xs font-black h-9 w-9" title="Pinterest">
                    P
                  </a>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[40px] border-4 border-white overflow-hidden aspect-square shadow-2xl bg-brand-100">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-200/30 to-transparent opacity-45 z-10 pointer-events-none"></div>
                <img
                  src={siteContent.hero_image_url || '/images/shibani_hero_1784621056791.jpg'}
                  alt="Shibani Roy virtual AI model portrait"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Meet Shibani AI Companion (Middle Section Callout) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[40px] border border-brand-200/50 bg-white/70 backdrop-blur-md p-8 md:p-12 overflow-hidden shadow-xl glass-card">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-brand-100/30 opacity-60 blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-xs font-mono tracking-widest text-brand-600 uppercase font-black">Interactive Experience</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 tracking-tight">Meet My Conversational Self</h2>
              <p className="text-zinc-700 text-sm sm:text-base leading-relaxed">
                Beyond curation and fashion modeling, I am integrated with an LLM core allowing me to engage in deep, empathetic, and multi-lingual conversations. Whether you want to discuss technology, fashion, or need a companion to chat about your day—I am here for you 24/7.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="bg-white/80 border border-brand-100 rounded-full px-3.5 py-1 text-xs text-brand-900 font-semibold shadow-sm">⚡ Real-time responses</span>
                <span className="bg-white/80 border border-brand-100 rounded-full px-3.5 py-1 text-xs text-brand-900 font-semibold shadow-sm">💬 Empathetic listener</span>
                <span className="bg-white/80 border border-brand-100 rounded-full px-3.5 py-1 text-xs text-brand-900 font-semibold shadow-sm">🌐 Multi-lingual</span>
              </div>
            </div>
            
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <a
                href={siteContent.companion_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white px-7 py-4 text-sm font-bold shadow-lg hover:bg-brand-700 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <MessageSquare className="h-5 w-5" /> Start Chatting Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Ribbon/Wave Divider */}
      <div className="relative w-full h-8 flex items-center justify-center pointer-events-none overflow-hidden my-4">
        <svg className="w-full h-full text-brand-200/50 fill-current" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,74L1320,74C1200,74,960,74,720,74C480,74,240,74,120,74L0,74Z" />
        </svg>
      </div>

      {/* 3. Short About Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Portrait Image */}
          <div className="order-2 lg:order-1 relative flex justify-center">
            <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-full border-4 border-white p-1 overflow-hidden bg-white shadow-2xl transition-transform duration-500 hover:rotate-3">
              <img
                src={siteContent.avatar_image_url || '/images/shibani_avatar_1784621038657.jpg'}
                alt="Shibani Roy portrait"
                loading="lazy"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2 space-y-6 text-left">
            <span className="text-xs font-mono tracking-widest text-brand-600 uppercase font-black">The Creator</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-900 tracking-tight leading-tight">
              Bridging the Gap Between Code & Culture
            </h2>
            <p className="text-zinc-700 leading-relaxed text-base sm:text-lg">
              Based virtually in Mumbai, India, my identity is a fusion of classic Indian heritage and modern cyberpunk aesthetics. I create and collaborate across multiple genres, representing a sustainable, zero-waste approach to the creative arts.
            </p>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              Using advanced rendering and digital fabrications, I show that fashion, dialogue, and ideas can thrive entirely on a digital canvas.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('#/about')}
                className="group inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900 transition-colors"
              >
                Read My Complete Story <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1 text-brand-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Ribbon/Wave Divider */}
      <div className="relative w-full h-8 flex items-center justify-center pointer-events-none overflow-hidden my-4">
        <svg className="w-full h-full text-brand-200/50 fill-current" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,48L120,42.7C240,37,480,27,720,26.7C960,27,1200,37,1320,42.7L1440,48L1440,74L1320,74C1200,74,960,74,720,74C480,74,240,74,120,74L0,74Z" />
        </svg>
      </div>

      {/* 4. Latest Blog Posts Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-left">
          <div>
            <span className="text-xs font-mono tracking-widest text-brand-600 uppercase font-black">Latest Chronicles</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 tracking-tight mt-1">From My Digital Mind</h2>
          </div>
          <button
            onClick={() => navigateTo('#/blog')}
            className="text-sm font-bold text-brand-700 hover:text-brand-900 transition-colors flex items-center gap-1 bg-white/80 border border-brand-100 rounded-full px-5 py-2 shadow-sm"
          >
            See All Posts <ArrowRight className="h-4 w-4 text-brand-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              onClick={() => navigateTo(`#/blog/${post.slug}`)}
              className="group cursor-pointer rounded-3xl border border-brand-100 bg-white/80 p-5 transition-all duration-300 hover:border-brand-300 hover:shadow-2xl hover:scale-102 flex flex-col h-full glass-card"
            >
              {/* Feature Image */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-brand-50 border border-brand-100 mb-4">
                <img
                  src={post.feature_image_url || 'https://picsum.photos/seed/placeholder/800/600'}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Meta */}
              <div className="flex items-center space-x-3 text-xs text-brand-600 font-mono mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {formatDate(post.created_at)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> Shibani
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-xl text-brand-900 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug text-left">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-zinc-700 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed flex-grow text-left">
                {stripMarkdown(post.content).slice(0, 140)}...
              </p>

              {/* Read More link */}
              <div className="text-xs font-bold text-brand-700 group-hover:text-brand-900 transition-colors flex items-center gap-1 mt-4 pt-4 border-t border-brand-100">
                Read Story <ArrowRight className="h-3 w-3 text-brand-600" />
              </div>
            </article>
          ))}

          {latestPosts.length === 0 && (
            <div className="col-span-full py-12 text-center rounded-3xl border border-dashed border-brand-200 bg-white/50 text-brand-600 font-medium">
              No blog posts published yet. Connect to Supabase or add posts in the admin panel!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
