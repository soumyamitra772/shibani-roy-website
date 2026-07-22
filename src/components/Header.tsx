import React, { useState } from 'react';
import { isSupabaseConfigured } from '../services/db';
import { SiteContent } from '../types';
import { Sparkles, Menu, X, Database, Info, ExternalLink, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

interface HeaderProps {
  currentRoute: { page: string; param: string };
  setRoute: (route: { page: string; param: string }) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  siteContent?: SiteContent;
}

export default function Header({ currentRoute, setRoute, isAdminLoggedIn, onLogout, siteContent }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home', hash: '#/' },
    { label: 'About', id: 'about', hash: '#/about' },
    { label: 'Blog', id: 'blog', hash: '#/blog' },
    { label: 'Contact', id: 'contact', hash: '#/contact' },
  ];

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    setIsMobileMenuOpen(false);
  };

  const isCurrent = (id: string) => {
    if (id === 'home' && currentRoute.page === 'home') return true;
    if (id === 'blog' && (currentRoute.page === 'blog' || currentRoute.page === 'blog-post')) return true;
    return currentRoute.page === id;
  };

  return (
    <>
      <header id="app-header" className="sticky top-0 z-40 w-full border-b border-brand-100 bg-white/75 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div 
            onClick={() => navigateTo('#/')} 
            className="flex cursor-pointer items-center space-x-3 group animate-fade-in"
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-brand-300 bg-brand-50 shadow-md shrink-0 transition-transform group-hover:scale-105 duration-300 ring-2 ring-brand-100/40">
              <img
                src={siteContent?.logo_url || "/images/shibani_logo_small_r_1784631811197.jpg"}
                alt="SR circular emblem"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-brand-900 block leading-none">
                SHIBANI ROY
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest text-brand-600 uppercase font-bold mt-0.5">
                AI Virtual Creator
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.hash}
                className={`text-sm font-medium transition-all hover:text-brand-700 relative py-1.5 ${
                  isCurrent(item.id) 
                    ? 'text-brand-700 font-bold border-b-2 border-brand-500' 
                    : 'text-zinc-500 hover:scale-105'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Social Links */}
            <div className="flex items-center space-x-3 border-r border-brand-100 pr-4 mr-1">
              <a href="https://www.instagram.com/shibanir96/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-brand-600 transition-colors" title="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61579287061338" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-brand-600 transition-colors" title="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/shibani-roy-virtual-ai-influencer/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-brand-600 transition-colors" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://x.com/shibanir96" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-brand-600 transition-colors" title="X (Twitter)">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://in.pinterest.com/rshibani096/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-brand-600 transition-colors flex items-center justify-center font-mono text-[10px] font-bold border border-brand-100 rounded px-1.5 h-5 bg-white shadow-sm" title="Pinterest">
                P
              </a>
            </div>

            {/* Database status pill */}
            <button
              onClick={() => setShowStatusModal(true)}
              className={`flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-mono border transition-all hover:bg-brand-50/50 ${
                isSupabaseConfigured
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-brand-200 bg-brand-50/50 text-brand-900'
              }`}
            >
              <Database className="h-3 w-3 text-brand-600" />
              <span>{isSupabaseConfigured ? 'Supabase' : 'Sandbox Mode'}</span>
            </button>

            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateTo('#/admin')}
                  className="rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition shadow-sm"
                >
                  Admin Panel
                </button>
                <button
                  onClick={onLogout}
                  className="rounded-full border border-brand-200 px-4 py-2 text-xs font-semibold text-brand-900 hover:bg-brand-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('#/admin')}
                className="rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-semibold text-brand-900 hover:bg-brand-50 transition shadow-sm"
              >
                Admin Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setShowStatusModal(true)}
              className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                isSupabaseConfigured
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              <Database className="h-3 w-3" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-500 hover:text-zinc-900"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-brand-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-3 shadow-md">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.hash}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-base font-medium py-2 ${
                  isCurrent(item.id) ? 'text-brand-700 font-bold' : 'text-zinc-600'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-brand-100 flex flex-col gap-2">
              {isAdminLoggedIn ? (
                <>
                  <button
                    onClick={() => navigateTo('#/admin')}
                    className="w-full text-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Admin Panel
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigateTo('#/admin')}
                  className="w-full text-center rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-900"
                >
                  Admin Login
                </button>
              )}
            </div>

            {/* Mobile Social Links */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-center space-x-6">
              <a href="https://www.instagram.com/shibanir96/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-rose-50 text-brand-600 hover:bg-rose-100 transition-colors" title="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61579287061338" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-rose-50 text-brand-600 hover:bg-rose-100 transition-colors" title="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/shibani-roy-virtual-ai-influencer/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-rose-50 text-brand-600 hover:bg-rose-100 transition-colors" title="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://x.com/shibanir96" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-rose-50 text-brand-600 hover:bg-rose-100 transition-colors" title="X (Twitter)">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://in.pinterest.com/rshibani096/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-rose-50 text-brand-600 hover:bg-rose-100 transition-colors flex items-center justify-center font-mono text-sm font-bold w-9 h-9" title="Pinterest">
                P
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Database Connection Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-zinc-900">
                {isSupabaseConfigured ? 'Connected to Supabase' : 'Local Sandbox Mode Active'}
              </h3>
            </div>

            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              {isSupabaseConfigured
                ? 'Your website is connected to your production Supabase database. All blog posts, site content, and contact submissions are stored securely in Postgres.'
                : 'The application is running in persistent Offline Sandbox Mode. It uses browser Local Storage with beautiful sample data so you can test all features (including creating blogs, editing site text, and contact forms) instantly!'}
            </p>

            {!isSupabaseConfigured && (
              <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 mb-6">
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5 flex items-center">
                  <Info className="h-3.5 w-3.5 mr-1.5 text-zinc-900" /> How to connect your Supabase DB:
                </h4>
                <ol className="text-xs text-zinc-500 list-decimal pl-4 space-y-2 leading-relaxed">
                  <li>Create a free database project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-zinc-900 font-semibold hover:underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="h-2.5 w-2.5" /></a></li>
                  <li>Copy your **Project URL** and **API Anon Key**.</li>
                  <li>Add them to your environment variables secrets:
                    <code className="block bg-zinc-100 p-2.5 rounded-xl text-[10px] text-zinc-700 mt-1.5 whitespace-pre-wrap font-mono border border-zinc-200/50">VITE_SUPABASE_URL=your_project_url<br />VITE_SUPABASE_ANON_KEY=your_anon_key</code>
                  </li>
                  <li>Run the database migrations SQL provided in the README.</li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
