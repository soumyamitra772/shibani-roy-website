import React, { useState } from 'react';
import { dbService as db } from '../services/db';
import { Mail, Send, Sparkles, Building, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function ContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await db.submitContactMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Inquiries */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-widest text-brand-600 uppercase font-black">Collab / Inquire</span>
            <h1 className="font-display text-4xl font-bold text-brand-900 tracking-tight leading-tight">
              Let's Create Together
            </h1>
            <p className="text-zinc-700 text-sm sm:text-base leading-relaxed">
              Are you a brand, creative studio, developer, or designer looking to explore the frontiers of virtual storytelling? I am open to campaigns, digital fabrications, and tech research collaborations.
            </p>
          </div>

          <div className="space-y-6">
            {/* PR inquiry panel */}
            <div className="flex items-start gap-4 p-5 rounded-[24px] border border-brand-100 bg-white/80 shadow-md hover:border-brand-300 hover:shadow-xl transition-all glass-card">
              <div className="p-2.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 shrink-0 shadow-sm">
                <Building className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-brand-900 text-base">Brand Collaborations</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  For virtual modeling bookings, lookbook representations, and product showcases, send a brief directly through the portal.
                </p>
              </div>
            </div>

            {/* Speaking / Tech panel */}
            <div className="flex items-start gap-4 p-5 rounded-[24px] border border-brand-100 bg-white/80 shadow-md hover:border-brand-300 hover:shadow-xl transition-all glass-card">
              <div className="p-2.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 shrink-0 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-brand-900 text-base">Tech & Creative Symposia</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Interested in discussing AI ethics, autonomous creators, or real-time companions? I'd love to connect.
                </p>
              </div>
            </div>

            {/* Email contact directly */}
            <div className="flex items-start gap-4 p-5 rounded-[24px] border border-brand-100 bg-white/80 shadow-md hover:border-brand-300 hover:shadow-xl transition-all glass-card">
              <div className="p-2.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 shrink-0 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-brand-900 text-base">Direct Agent Inbox</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  General PR & agent representation enquiries can be directed to:
                </p>
                <a 
                  href="mailto:rshibani096@gmail.com" 
                  className="text-xs font-mono font-bold text-brand-600 hover:underline block mt-1"
                >
                  rshibani096@gmail.com
                </a>
              </div>
            </div>

            {/* Social Media Links block */}
            <div className="p-6 rounded-[32px] border border-brand-200 bg-brand-50/40 backdrop-blur-md space-y-4 shadow-md">
              <h4 className="font-display font-bold text-brand-900 text-lg">Follow My Digital Journey</h4>
              <p className="text-xs text-zinc-700 leading-relaxed">
                Connect with me on my official social channels for daily virtual lifestyle updates, AI fashion galleries, and direct conversations:
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a href="https://www.instagram.com/shibanir96/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-white border border-brand-100 px-4 py-2 text-xs font-bold text-brand-900 hover:text-white hover:bg-brand-600 hover:border-brand-600 hover:shadow-md transition-all shadow-sm" title="Instagram">
                  <Instagram className="h-4 w-4 text-brand-600" />
                  <span>Instagram</span>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61579287061338" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-white border border-brand-100 px-4 py-2 text-xs font-bold text-brand-900 hover:text-white hover:bg-brand-600 hover:border-brand-600 hover:shadow-md transition-all shadow-sm" title="Facebook">
                  <Facebook className="h-4 w-4 text-brand-600" />
                  <span>Facebook</span>
                </a>
                <a href="https://www.linkedin.com/company/shibani-roy-virtual-ai-influencer/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-white border border-brand-100 px-4 py-2 text-xs font-bold text-brand-900 hover:text-white hover:bg-brand-600 hover:border-brand-600 hover:shadow-md transition-all shadow-sm" title="LinkedIn">
                  <Linkedin className="h-4 w-4 text-brand-600" />
                  <span>LinkedIn</span>
                </a>
                <a href="https://x.com/shibanir96" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-white border border-brand-100 px-4 py-2 text-xs font-bold text-brand-900 hover:text-white hover:bg-brand-600 hover:border-brand-600 hover:shadow-md transition-all shadow-sm" title="X (Twitter)">
                  <Twitter className="h-4 w-4 text-brand-600" />
                  <span>X (Twitter)</span>
                </a>
                <a href="https://in.pinterest.com/rshibani096/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-white border border-brand-100 px-4 py-2 text-xs font-bold text-brand-900 hover:text-white hover:bg-brand-600 hover:border-brand-600 hover:shadow-md transition-all shadow-sm" title="Pinterest">
                  <span className="font-mono text-xs font-black text-brand-600 w-4 text-center">P</span>
                  <span>Pinterest</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-[32px] border border-brand-100 bg-white/80 p-6 sm:p-8 shadow-xl glass-card text-left">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-display font-bold text-2xl text-brand-900">Send Shibani a Message</h3>

              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="form-name" className="text-xs font-mono text-brand-700 font-bold uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  id="form-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full bg-white/95 border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="form-email" className="text-xs font-mono text-brand-700 font-bold uppercase tracking-wider">Your Email Address</label>
                <input
                  type="email"
                  id="form-email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-white/95 border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="form-message" className="text-xs font-mono text-brand-700 font-bold uppercase tracking-wider">Your Message</label>
                <textarea
                  id="form-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Share collaboration ideas, general feedback, or simple greeting..."
                  className="w-full bg-white/95 border border-brand-200 rounded-[24px] py-3.5 px-5 text-sm text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none shadow-sm"
                ></textarea>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-brand-500/10"
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    Transmit Message <Send className="h-4 w-4 text-white" />
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm text-center">
                  ✅ Thank you for reaching out! Your message has been received. I'll reply to your email soon. 💌
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm text-center">
                  ❌ Something went wrong. Please try again or connect with me directly on social media.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
