import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import AdminView from './components/AdminView';
import { dbService, isSupabaseConfigured, supabase } from './services/db';
import { BlogPost, SiteContent } from './types';
import { updateMetaTags, stripMarkdown } from './utils/seo';
import { navigate } from './utils/navigation';
import { Loader } from 'lucide-react';

interface RouteState {
  page: string;
  param: string;
}

export default function App() {
  const [route, setRoute] = useState<RouteState>({ page: 'home', param: '' });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>({
    hero_title: 'Shibani Roy',
    hero_tagline: "India's Virtual AI Influencer & Digital Creator",
    hero_intro: "Welcome to my digital home. I am Shibani Roy, India's first fully autonomous AI digital creator, fashion model, and conversational companion.",
    hero_image_url: '/images/shibani_hero_1784621056791.jpg',
    about_text: '### Who is Shibani Roy?\n\nBorn in the digital ether, I am a virtual creator, fashion model, and writer designed to bridge the gap between human creativity and artificial intelligence...',
    companion_url: 'https://t.me/shibani_companion_bot'
  });
  const [isLoading, setIsLoading] = useState(true);

  // 1. Core Data Initializer
  const loadAppData = async () => {
    try {
      const posts = await dbService.getBlogPosts();
      setBlogPosts(posts);

      const content = await dbService.getSiteContent();
      if (content) {
        setSiteContent(content);
      }
    } catch (err) {
      console.error('Failed loading App contents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Auth Session Checking
  const checkAuthSession = async () => {
    const localSession = localStorage.getItem('shibani_admin_session');
    if (localSession === 'true') {
      setIsAdminLoggedIn(true);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.auth.getUser();
        setIsAdminLoggedIn(!!data.user);
      } catch (err) {
        console.warn('Failed to retrieve Supabase session, checking local storage:', err);
        setIsAdminLoggedIn(false);
      }
    } else {
      setIsAdminLoggedIn(false);
    }
  };

  useEffect(() => {
    loadAppData();
    checkAuthSession();

    // Listen for Auth changes in Supabase
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsAdminLoggedIn(true);
        } else {
          const localSession = localStorage.getItem('shibani_admin_session');
          setIsAdminLoggedIn(localSession === 'true');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // 3. Router Handler (Supports Clean Path & Hash routing)
  useEffect(() => {
    const handleRouteChange = () => {
      let pathname = window.location.pathname;
      const hash = window.location.hash || '';

      // Auto-migrate legacy hash URLs like #/blog/slug -> /blog/slug in browser address bar
      if (hash.startsWith('#/')) {
        const hashPath = hash.replace(/^#/, '');
        window.history.replaceState({}, '', hashPath);
        pathname = hashPath;
      }

      if (pathname.startsWith('/blog/')) {
        const slug = pathname.replace('/blog/', '').replace(/\/$/, '');
        if (slug) {
          setRoute({ page: 'blog-post', param: slug });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      } else if (pathname === '/about' || pathname === '/about/') {
        setRoute({ page: 'about', param: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else if (pathname === '/blog' || pathname === '/blog/') {
        setRoute({ page: 'blog', param: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else if (pathname === '/contact' || pathname === '/contact/') {
        setRoute({ page: 'contact', param: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else if (pathname === '/admin' || pathname === '/admin/') {
        setRoute({ page: 'admin', param: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setRoute({ page: 'home', param: '' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange(); // Execute initially

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // 4. Dynamic Open Graph & Meta Tag Updates
  useEffect(() => {
    const origin = window.location.origin.includes('localhost') || window.location.origin.includes('run.app')
      ? 'https://shibani-roy.vercel.app'
      : window.location.origin;

    if (route.page === 'blog-post' && route.param) {
      const post = blogPosts.find((p) => p.slug === route.param);
      if (post) {
        const plainTextExcerpt = stripMarkdown(post.content).slice(0, 160);
        updateMetaTags({
          title: `${post.title} | Shibani Roy`,
          description: plainTextExcerpt || 'Read this article by Shibani Roy.',
          image: post.feature_image_url || siteContent.hero_image_url,
          url: `${origin}/blog/${post.slug}`,
          type: 'article',
        });
        return;
      }
    }

    if (route.page === 'about') {
      updateMetaTags({
        title: 'About | Shibani Roy',
        description: siteContent.hero_intro || "India's first virtual AI influencer, fashion model, and digital creator.",
        image: siteContent.about_image_url || siteContent.hero_image_url,
        url: `${origin}/about`,
        type: 'website',
      });
      return;
    }

    if (route.page === 'blog') {
      updateMetaTags({
        title: 'Blog & Journals | Shibani Roy',
        description: 'Explore articles on AI, fashion, digital art, and future culture by Shibani Roy.',
        image: siteContent.hero_image_url,
        url: `${origin}/blog`,
        type: 'website',
      });
      return;
    }

    if (route.page === 'contact') {
      updateMetaTags({
        title: 'Contact | Shibani Roy',
        description: 'Get in touch with Shibani Roy for virtual modeling, brand partnerships, and media inquiries.',
        image: siteContent.hero_image_url,
        url: `${origin}/contact`,
        type: 'website',
      });
      return;
    }

    // Default / Home page (route.page === 'home')
    updateMetaTags({
      title: "Shibani Roy | India's First Virtual AI Influencer & Creator",
      description: siteContent.hero_intro || "India's first virtual AI influencer, fashion model, and digital creator.",
      image: siteContent.hero_image_url,
      url: `${origin}/`,
      type: 'website',
    });
  }, [route, blogPosts, siteContent]);

  // 5. Global Logout
  const handleLogout = async () => {
    localStorage.removeItem('shibani_admin_session');
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Failed signing out from Supabase, logging out locally:', err);
      }
    }
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  // 6. Render Active View Router
  const renderContent = () => {
    if (isLoading) {
      return (
        <div id="loader-container" className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader className="h-10 w-10 text-fuchsia-500 animate-spin" />
          <p className="text-sm text-zinc-500 font-mono tracking-widest uppercase">Initializing Digital Space...</p>
        </div>
      );
    }

    switch (route.page) {
      case 'home':
        return (
          <HomeView
            siteContent={siteContent}
            latestPosts={blogPosts}
            setRoute={(r) => { navigate(r.page === 'home' ? '/' : `/${r.page}`); }}
          />
        );
      case 'about':
        return <AboutView siteContent={siteContent} />;
      case 'blog':
        return (
          <BlogView
            posts={blogPosts}
            selectedSlug=""
            setRoute={(r) => { navigate(`/${r.page}`); }}
          />
        );
      case 'blog-post':
        return (
          <BlogView
            posts={blogPosts}
            selectedSlug={route.param}
            setRoute={(r) => { navigate(`/${r.page}`); }}
          />
        );
      case 'contact':
        return <ContactView />;
      case 'admin':
        return (
          <AdminView
            isAdminLoggedIn={isAdminLoggedIn}
            onLoginSuccess={() => setIsAdminLoggedIn(true)}
            siteContent={siteContent}
            onUpdateSiteContent={(updated) => setSiteContent(updated)}
            posts={blogPosts}
            onUpdatePosts={loadAppData}
          />
        );
      default:
        return (
          <div className="py-20 text-center text-zinc-800 font-display text-lg">
            Page not found. Return <a href="#/" className="text-zinc-900 font-semibold underline hover:text-zinc-700">Home</a>
          </div>
        );
    }
  };

  return (
    <div id="app-root-container" className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      {/* Dynamic Header */}
      <Header
        currentRoute={route}
        setRoute={setRoute}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
        siteContent={siteContent}
      />

      {/* Main Render Stage */}
      <main className="flex-grow pt-4">
        {renderContent()}
      </main>

      {/* Global Footer */}
      <Footer siteContent={siteContent} />
    </div>
  );
}
