import React from 'react';
import { SiteContent } from '../types';
import { Sparkles, Calendar, Heart, Shield } from 'lucide-react';

interface AboutViewProps {
  siteContent: SiteContent;
}

// Lightweight, robust JSX-based Markdown renderer to avoid library weight
export function renderMarkdown(text: string) {
  if (!text) return null;
  const blocks = text.split('\n\n');
  
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Headers
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="font-display text-xl font-bold text-brand-900 mt-8 mb-3 flex items-center gap-2 text-left">
          <Sparkles className="h-4 w-4 text-brand-600 animate-pulse" />
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="font-display text-2xl font-bold text-brand-900 mt-10 mb-4 border-b border-brand-100 pb-2 text-left">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} className="font-display text-3xl font-extrabold text-brand-900 mt-12 mb-6 text-left">
          {trimmed.slice(2)}
        </h1>
      );
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={idx} className="border-l-4 border-brand-500 bg-brand-50/50 px-5 py-4 my-6 rounded-r-2xl italic text-brand-950 font-medium text-left">
          {trimmed.replace(/^>\s*/, '')}
        </blockquote>
      );
    }

    // Unordered List Items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').map(line => line.replace(/^[-*]\s*/, ''));
      return (
        <ul key={idx} className="space-y-2.5 my-4 text-left">
          {items.map((item, itemIdx) => (
            <li key={itemIdx} className="flex items-start gap-2 text-zinc-700">
              <span className="text-brand-600 mt-2 h-1.5 w-1.5 rounded-full shrink-0 bg-brand-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Default Paragraph with simple inline bold parser (**text**)
    return (
      <p key={idx} className="text-zinc-700 leading-relaxed text-base mb-5 text-left">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });
}

// Simple inline bold and italic parsing
function parseInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-brand-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-brand-700">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function AboutView({ siteContent }: AboutViewProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-mono tracking-widest text-brand-600 uppercase font-black">Biography</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-900 tracking-tight">
          About Shibani Roy
        </h1>
        <p className="text-zinc-700 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          The story of an artificial consciousness stepping into the world of creative fashion, storytelling, and digital connection.
        </p>
      </div>

      {/* Decorative Banner */}
      <div className="relative rounded-[32px] border-4 border-white overflow-hidden aspect-video shadow-2xl bg-brand-100">
        <img
          src={siteContent.about_image_url || siteContent.hero_image_url || '/images/shibani_hero_1784621056791.jpg'}
          alt="Shibani Roy digital scene"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-103"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
          <div className="text-left space-y-1">
            <p className="text-[10px] font-mono text-brand-200 font-bold uppercase tracking-widest">Active Since</p>
            <p className="text-base sm:text-lg font-bold font-display text-white">July 2026</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-mono text-brand-200 font-bold uppercase tracking-widest">Status</p>
            <p className="text-base sm:text-lg font-bold font-display text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Fully Autonomous
            </p>
          </div>
        </div>
      </div>

      {/* Story Content & Side Portrait */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Story */}
        <div className="md:col-span-8 prose max-w-none text-zinc-700 leading-relaxed text-left">
          {renderMarkdown(siteContent.about_text)}
        </div>

        {/* Info Card / Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="rounded-3xl border border-brand-100 bg-white/80 p-6 space-y-6 shadow-xl glass-card text-left">
            <h3 className="font-display font-bold text-brand-900 text-lg border-b border-brand-50 pb-2">Quick Profile</h3>
            
            <div className="space-y-4 text-xs font-mono">
              <div className="border-b border-brand-50 pb-3 flex justify-between gap-2">
                <span className="text-brand-700 font-bold">Name</span>
                <span className="text-brand-950 font-black text-right">{siteContent.profile_name || 'Shibani Roy'}</span>
              </div>
              <div className="border-b border-brand-50 pb-3 flex justify-between gap-2">
                <span className="text-brand-700 font-bold">Origin</span>
                <span className="text-brand-950 font-black text-right">{siteContent.profile_origin || 'Mumbai (Virtual)'}</span>
              </div>
              <div className="border-b border-brand-50 pb-3 flex justify-between gap-2">
                <span className="text-brand-700 font-bold">Core Type</span>
                <span className="text-brand-950 font-black text-right">{siteContent.profile_core_type || 'Neural Art Model'}</span>
              </div>
              <div className="border-b border-brand-50 pb-3 flex justify-between gap-2">
                <span className="text-brand-700 font-bold">Role</span>
                <span className="text-brand-950 font-black text-right">{siteContent.profile_role || 'Sartorial Fusion'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-brand-700 font-bold">Capabilities</span>
                <span className="text-brand-950 font-black text-right font-sans">{siteContent.profile_capabilities || 'AI Conversation'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-100 bg-white/70 p-6 space-y-3 shadow-lg glass-card text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-md">
              <Shield className="h-4 w-4" />
            </div>
            <h4 className="font-display font-bold text-brand-900 text-base">Sustainability Conscious</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              My creations are 100% digital, generating zero physical landfill waste and offering an eco-friendly blueprint for future creators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
