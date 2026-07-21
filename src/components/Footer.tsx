import React from 'react';
import { Sparkles, Heart, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <footer id="app-footer" className="border-t border-brand-100 bg-white/70 py-12 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Info section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full overflow-hidden border border-brand-300 bg-brand-50 shadow-md shrink-0 ring-2 ring-brand-100/40">
                <img 
                  src="/src/assets/images/shibani_logo_small_r_1784631811197.jpg" 
                  alt="SR emblem" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <span className="font-display font-bold text-brand-900 tracking-tight text-sm">SHIBANI ROY</span>
            </div>
            <p className="text-xs text-zinc-600 max-w-xs leading-relaxed mb-4">
              India's pioneer virtual AI creator blending traditional cultural roots with the frontiers of machine creativity.
            </p>
            {/* Social Icons inside Footer */}
            <div className="flex items-center space-x-3">
              <a href="https://www.instagram.com/shibanir96/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-brand-50 text-brand-600 hover:text-white hover:bg-brand-500 transition-all shadow-sm" title="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61579287061338" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-brand-50 text-brand-600 hover:text-white hover:bg-brand-500 transition-all shadow-sm" title="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/shibani-roy-virtual-ai-influencer/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-brand-50 text-brand-600 hover:text-white hover:bg-brand-500 transition-all shadow-sm" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://x.com/shibanir96" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-brand-50 text-brand-600 hover:text-white hover:bg-brand-500 transition-all shadow-sm" title="X (Twitter)">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://in.pinterest.com/rshibani096/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-brand-50 text-brand-600 hover:text-white hover:bg-brand-500 transition-all flex items-center justify-center font-mono text-[10px] font-bold h-7 w-7 border border-brand-100 bg-white shadow-sm" title="Pinterest">
                P
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex justify-center space-x-6 text-sm font-semibold text-zinc-600">
            <a onClick={() => navigateTo('#/')} className="cursor-pointer hover:text-brand-600 transition">Home</a>
            <a onClick={() => navigateTo('#/about')} className="cursor-pointer hover:text-brand-600 transition">About</a>
            <a onClick={() => navigateTo('#/blog')} className="cursor-pointer hover:text-brand-600 transition">Blog</a>
            <a onClick={() => navigateTo('#/contact')} className="cursor-pointer hover:text-brand-600 transition">Contact</a>
            <a onClick={() => navigateTo('#/admin')} className="cursor-pointer hover:text-brand-700 transition font-bold text-brand-600">Admin</a>
          </div>

          {/* Copyright Section */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <p className="text-xs text-zinc-600 font-semibold">
              &copy; {currentYear} Shibani Roy. All rights reserved.
            </p>
            <p className="text-[10px] text-zinc-500 font-medium mt-1 flex items-center justify-center md:justify-end gap-1">
              Made with <Heart className="h-3 w-3 text-brand-600 fill-brand-500" /> for the AI-assisted digital age.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
