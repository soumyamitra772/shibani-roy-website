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

  // 3. Hash Router Handler
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      if (hash.startsWith('#/blog/')) {
        const slug = hash.replace('#/blog/', '');
        setRoute({ page: 'blog-post', param: slug });
      } else if (hash === '#/about') {
        setRoute({ page: 'about', param: '' });
      } else if (hash === '#/blog') {
        setRoute({ page: 'blog', param: '' });
      } else if (hash === '#/contact') {
        setRoute({ page: 'contact', param: '' });
      } else if (hash === '#/admin') {
        setRoute({ page: 'admin', param: '' });
      } else {
        setRoute({ page: 'home', param: '' });
      }
      
      // Scroll smoothly to top on navigation change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Execute initially

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 4. Global Logout
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
    window.location.hash = '#/';
  };

  // 5. Render Active View Router
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
            setRoute={(r) => { window.location.hash = r.page === 'home' ? '#/' : `#/${r.page}`; }}
          />
        );
      case 'about':
        return <AboutView siteContent={siteContent} />;
      case 'blog':
        return (
          <BlogView
            posts={blogPosts}
            selectedSlug=""
            setRoute={(r) => { window.location.hash = `#/${r.page}`; }}
          />
        );
      case 'blog-post':
        return (
          <BlogView
            posts={blogPosts}
            selectedSlug={route.param}
            setRoute={(r) => { window.location.hash = `#/${r.page}`; }}
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
