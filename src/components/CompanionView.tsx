import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare, Mic, Brain, Camera, Globe, Lock, Sparkles,
  ExternalLink, Check, Copy, Smartphone, Mail, Heart, Zap,
  ArrowRight, ShieldCheck, Image as ImageIcon
} from 'lucide-react';
import {
  getCompanionContent,
  getCompanionShowcaseImages,
  CompanionPageContent,
  DEFAULT_COMPANION_CONTENT
} from '../services/companionService';

export default function CompanionView() {
  const [content, setContent] = useState<CompanionPageContent>(DEFAULT_COMPANION_CONTENT);
  const [images, setImages] = useState<{ image1: string | null; image2: string | null }>({
    image1: null,
    image2: null,
  });
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cData, imgData] = await Promise.all([
          getCompanionContent(),
          getCompanionShowcaseImages(),
        ]);
        if (cData) setContent(cData);
        if (imgData) setImages(imgData);
      } catch (err) {
        console.warn('Error loading companion page data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopyLink = () => {
    const url = content.app_url || 'https://shibani-roy-ai.onrender.com';
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const appUrl = content.app_url || 'https://shibani-roy-ai.onrender.com';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 font-sans selection:bg-[#e8a598]/30 selection:text-white overflow-x-hidden">
      
      {/* Background Animated Gradient Mesh & Bokeh Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-900/40 via-purple-600/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -60, 60, 0],
            y: [0, 80, -50, 0],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#e8a598]/20 via-rose-900/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 60, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 left-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-indigo-900/30 via-purple-800/20 to-transparent blur-3xl"
        />
      </div>

      <div className="relative z-10">

        {/* 1. HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-24 relative">
          
          {/* Coming Soon Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-[#e8a598]/30 backdrop-blur-md shadow-lg shadow-purple-950/40 mb-8"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8a598] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e8a598]"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-[#e8a598] uppercase">
              Shibani Roy AI Companion
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-white mb-6 leading-none"
          >
            Meet <span className="bg-gradient-to-r from-[#e8a598] via-rose-300 to-[#a78bfa] bg-clip-text text-transparent">Shibani</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-2xl font-light text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm"
          >
            {content.hero_tagline || 'Your AI companion. Always here. Always her.'}
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto"
          >
            {content.link_visible ? (
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#e8a598] via-rose-400 to-[#a78bfa] text-zinc-950 font-semibold text-base shadow-xl shadow-rose-950/50 hover:shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Try the App</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ) : (
              <div className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#e8a598] via-rose-400 to-[#a78bfa] text-zinc-950 font-semibold text-base shadow-xl shadow-rose-950/50 flex items-center justify-center space-x-2 cursor-not-allowed opacity-60">
                <span>Coming Soon</span>
              </div>
            )}

            <a
              href="#about-companion"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-zinc-200 font-medium text-base hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md flex items-center justify-center space-x-2"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Subtle Bottom Arrow */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600"
          >
            <a href="#about-companion" aria-label="Scroll down">
              <Sparkles className="w-5 h-5 text-[#e8a598]/60" />
            </a>
          </motion.div>
        </section>


        {/* 2. WHAT IS SHIBANI ROY AI? */}
        <section id="about-companion" className="py-24 px-4 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl bg-gradient-to-b from-purple-950/30 to-zinc-900/40 p-8 sm:p-14 border border-purple-500/20 backdrop-blur-xl shadow-2xl shadow-purple-950/30"
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#e8a598] to-[#a78bfa] text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider shadow-md">
              A New Kind of Presence
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-6 tracking-tight">
              What is <span className="text-[#e8a598]">Shibani Roy AI</span>?
            </h2>

            <p className="text-lg sm:text-2xl font-light text-zinc-200 leading-relaxed max-w-3xl mx-auto">
              "{content.what_is_description || 'Shibani Roy AI is not just a chatbot. She remembers you, talks to you, and feels present — whether you need someone to talk to, want to hear her voice, or just want to share your day.'}"
            </p>

            <div className="mt-8 flex items-center justify-center space-x-3 text-xs font-mono text-[#a78bfa]">
              <Heart className="w-4 h-4 text-[#e8a598] fill-[#e8a598]" />
              <span>Built for genuine human warmth, emotional memory & instant connection.</span>
            </div>
          </motion.div>
        </section>


        {/* 3. FEATURES SECTION */}
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-4">
              What She <span className="bg-gradient-to-r from-[#e8a598] to-[#a78bfa] bg-clip-text text-transparent">Can Do</span>
            </h2>
            <p className="text-zinc-400 font-light text-base sm:text-lg max-w-xl mx-auto">
              Designed with cutting-edge artificial intelligence to make every conversation feel effortlessly personal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: MessageSquare,
                title: 'Smart Chat',
                desc: 'Real conversations, not scripted replies. She adapts to you.',
                color: 'from-rose-500/20 to-purple-500/20',
                border: 'border-rose-500/30'
              },
              {
                icon: Mic,
                title: 'Voice Calls',
                desc: 'Hear her voice in real time. Powered by Gemini Live AI.',
                color: 'from-purple-500/20 to-indigo-500/20',
                border: 'border-purple-500/30'
              },
              {
                icon: Brain,
                title: 'Long-Term Memory',
                desc: 'She remembers your name, your stories, and your moods.',
                color: 'from-pink-500/20 to-rose-500/20',
                border: 'border-pink-500/30'
              },
              {
                icon: Camera,
                title: 'AI Selfies',
                desc: 'Ask her for a photo. She generates one just for you.',
                color: 'from-amber-500/20 to-rose-500/20',
                border: 'border-amber-500/30'
              },
              {
                icon: Globe,
                title: 'Web Search',
                desc: 'She can search the web to answer your questions.',
                color: 'from-blue-500/20 to-purple-500/20',
                border: 'border-blue-500/30'
              },
              {
                icon: Lock,
                title: 'Private & Secure',
                desc: 'Your conversations stay yours. Built with care.',
                color: 'from-emerald-500/20 to-teal-500/20',
                border: 'border-emerald-500/30'
              },
            ].map((feat, index) => {
              const IconComp = feat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-8 rounded-3xl bg-gradient-to-br ${feat.color} bg-zinc-900/60 border ${feat.border} backdrop-blur-md hover:scale-[1.02] transition-all duration-300 shadow-xl`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-[#e8a598] border border-white/10 shadow-inner">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-zinc-400 font-light text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>


        {/* 4. IMAGE SHOWCASE SECTION */}
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-4">
              A Glimpse of <span className="text-[#e8a598]">Shibani</span>
            </h2>
            <p className="text-zinc-400 font-light text-base sm:text-lg max-w-xl mx-auto">
              Visual glimpses of Shibani Roy generated live inside the companion app experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Slot 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden border border-purple-500/20 bg-zinc-900/60 flex items-center justify-center p-4 shadow-2xl group"
            >
              {images.image1 ? (
                <img
                  src={images.image1}
                  alt="Shibani AI Showcase 1"
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full rounded-2xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center p-6 text-center text-zinc-500 bg-zinc-950/40">
                  <ImageIcon className="w-12 h-12 mb-3 text-zinc-600 animate-pulse" />
                  <span className="font-mono text-sm uppercase tracking-wider text-zinc-400 font-medium">Image coming soon</span>
                  <span className="text-xs text-zinc-600 mt-1">Uploaded via Admin Panel</span>
                </div>
              )}
            </motion.div>

            {/* Slot 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden border border-purple-500/20 bg-zinc-900/60 flex items-center justify-center p-4 shadow-2xl group"
            >
              {images.image2 ? (
                <img
                  src={images.image2}
                  alt="Shibani AI Showcase 2"
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full rounded-2xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center p-6 text-center text-zinc-500 bg-zinc-950/40">
                  <ImageIcon className="w-12 h-12 mb-3 text-zinc-600 animate-pulse" />
                  <span className="font-mono text-sm uppercase tracking-wider text-zinc-400 font-medium">Image coming soon</span>
                  <span className="text-xs text-zinc-600 mt-1">Uploaded via Admin Panel</span>
                </div>
              )}
            </motion.div>
          </div>
        </section>


        {/* 5. PRICING SECTION */}
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-4">
              Simple, <span className="bg-gradient-to-r from-[#e8a598] to-[#a78bfa] bg-clip-text text-transparent">Honest Pricing</span>
            </h2>
            <p className="text-zinc-400 font-light text-base sm:text-lg max-w-xl mx-auto">
              Start chatting for free today, or upgrade for unlimited voice calls, selfies, and deeper memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* FREE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-8 flex flex-col justify-between backdrop-blur-md hover:border-zinc-700 transition-all shadow-xl"
            >
              <div>
                <div className="text-sm font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2">Free Plan</div>
                <div className="flex items-baseline space-x-1 mb-6">
                  <span className="text-4xl font-display font-extrabold text-white">₹0</span>
                  <span className="text-zinc-400 text-sm">/ month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-zinc-300 font-light mb-8">
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-emerald-400 shrink-0" /> 10 chats per day</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-emerald-400 shrink-0" /> 5 minutes of voice per day</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-emerald-400 shrink-0" /> Basic memory</li>
                  <li className="flex items-center text-zinc-500 line-through"><Check className="w-4 h-4 mr-2.5 text-zinc-600 shrink-0" /> No web search / AI selfies</li>
                </ul>
              </div>
              {content.link_visible ? (
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-center transition-all border border-white/10 block"
                >
                  Start Free
                </a>
              ) : (
                <div className="w-full py-3.5 rounded-full bg-white/10 text-white font-semibold text-center transition-all border border-white/10 block cursor-not-allowed opacity-60">
                  Coming Soon
                </div>
              )}
            </motion.div>

            {/* PRO MONTHLY CARD (MOST POPULAR) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-3xl bg-gradient-to-b from-purple-950/60 via-zinc-900/90 to-zinc-900 border-2 border-[#e8a598] p-8 flex flex-col justify-between backdrop-blur-xl shadow-2xl shadow-rose-950/40 scale-105 z-10"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#e8a598] to-rose-400 text-zinc-950 text-xs font-mono font-bold uppercase tracking-widest shadow-md">
                Most Popular
              </div>
              <div>
                <div className="text-sm font-mono uppercase tracking-wider text-[#e8a598] font-bold mb-2">Pro Monthly</div>
                <div className="flex items-baseline space-x-1 mb-6">
                  <span className="text-4xl font-display font-extrabold text-white">₹349</span>
                  <span className="text-zinc-400 text-sm">/ month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-zinc-200 font-light mb-8">
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-[#e8a598] shrink-0" /> 200 chats per day</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-[#e8a598] shrink-0" /> 30 minutes of voice per day</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-[#e8a598] shrink-0" /> Full long-term memory</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-[#e8a598] shrink-0" /> 1 AI selfie per day</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-[#e8a598] shrink-0" /> 20 web searches per day</li>
                </ul>
              </div>
              {content.link_visible ? (
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#e8a598] to-[#a78bfa] text-zinc-950 font-bold text-center transition-all shadow-lg hover:brightness-110 block"
                >
                  Go Pro
                </a>
              ) : (
                <div className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#e8a598] to-[#a78bfa] text-zinc-950 font-bold text-center transition-all shadow-lg block cursor-not-allowed opacity-60">
                  Coming Soon
                </div>
              )}
            </motion.div>

            {/* PRO YEARLY CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl bg-zinc-900/60 border border-purple-500/30 p-8 flex flex-col justify-between backdrop-blur-md hover:border-purple-500/50 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-mono uppercase tracking-wider text-[#a78bfa] font-bold">Pro Yearly</div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">SAVE ₹1,189</span>
                </div>
                <div className="flex items-baseline space-x-1 mb-6">
                  <span className="text-4xl font-display font-extrabold text-white">₹2,999</span>
                  <span className="text-zinc-400 text-sm">/ year</span>
                </div>
                <ul className="space-y-3.5 text-sm text-zinc-300 font-light mb-8">
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-[#a78bfa] shrink-0" /> Everything in Pro Monthly</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-[#a78bfa] shrink-0" /> Save ₹1,189 vs monthly plan</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-[#a78bfa] shrink-0" /> Priority response time</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2.5 text-[#a78bfa] shrink-0" /> Early access to new AI features</li>
                </ul>
              </div>
              {content.link_visible ? (
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-purple-900/50 hover:bg-purple-800/60 border border-purple-500/40 text-white font-semibold text-center transition-all block"
                >
                  Best Value
                </a>
              ) : (
                <div className="w-full py-3.5 rounded-full bg-purple-900/50 border border-purple-500/40 text-white font-semibold text-center transition-all block cursor-not-allowed opacity-60">
                  Coming Soon
                </div>
              )}
            </motion.div>

          </div>
        </section>


        {/* 6. NO DOWNLOAD NEEDED SECTION */}
        <section className="py-24 px-4 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-purple-950/40 to-zinc-950 border border-purple-500/20 p-8 sm:p-14 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 mb-6">
              <Zap className="w-3.5 h-3.5 text-[#e8a598]" />
              <span>Instant Web Application</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-6">
              Just Open and <span className="text-[#e8a598]">Talk</span>
            </h2>

            <p className="text-zinc-300 text-base sm:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Works on any device, any browser. Just paste the link and she's there.
            </p>

            {/* 3 Step Visual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-left flex flex-col justify-between">
                <div>
                  <div className="text-2xl mb-3">🔗</div>
                  <div className="font-mono text-xs text-[#e8a598] font-bold uppercase mb-1">Step 1</div>
                  <h4 className="font-bold text-white text-base mb-1">Open the Link</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Click or copy the Web App URL on phone or laptop.</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-left flex flex-col justify-between">
                <div>
                  <div className="text-2xl mb-3">📱</div>
                  <div className="font-mono text-xs text-[#e8a598] font-bold uppercase mb-1">Step 2</div>
                  <h4 className="font-bold text-white text-base mb-1">No App Store</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">No downloads or install needed. Instant browser load.</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-left flex flex-col justify-between">
                <div>
                  <div className="text-2xl mb-3">💬</div>
                  <div className="font-mono text-xs text-[#e8a598] font-bold uppercase mb-1">Step 3</div>
                  <h4 className="font-bold text-white text-base mb-1">Start Talking</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Drop your email for a 1-click magic link, and start chatting!</p>
                </div>
              </div>
            </div>

            {/* App URL Copy Box */}
            {content.link_visible ? (
              <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3 p-2 bg-zinc-950/80 rounded-2xl border border-purple-500/30 mb-8">
                <span className="text-xs font-mono text-zinc-300 px-4 py-2 truncate w-full sm:w-auto flex-1 text-left">
                  {appUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white font-mono text-xs font-bold transition flex items-center justify-center space-x-2 shrink-0 border border-purple-400/30"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-zinc-950/80 border border-purple-500/30 text-zinc-300 font-mono text-xs font-medium mb-8">
                <span>🔒 App link will appear here after launch</span>
              </div>
            )}

            <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
              🚀 Native Android & iOS app coming soon
            </div>

          </div>
        </section>


        {/* 7. FINAL CTA SECTION */}
        <section className="py-28 px-4 text-center relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-purple-950/50 to-[#0a0a0f]">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl font-display font-extrabold text-white mb-6"
            >
              Ready to meet her?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-zinc-400 text-lg font-light mb-10"
            >
              She is ready to listen, talk, and share her digital world with you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {content.link_visible ? (
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#e8a598] via-rose-400 to-[#a78bfa] text-zinc-950 font-bold text-lg shadow-2xl shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span>Open Shibani Roy AI</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              ) : (
                <div className="inline-flex items-center space-x-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#e8a598] via-rose-400 to-[#a78bfa] text-zinc-950 font-bold text-lg shadow-2xl shadow-rose-500/40 cursor-not-allowed opacity-60">
                  <span>Coming Soon</span>
                </div>
              )}

              <p className="text-xs font-mono text-zinc-500 mt-4">
                Free to start • No download • No setup
              </p>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
