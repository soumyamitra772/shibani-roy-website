import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { stripMarkdown } from '../utils/seo';
import { renderMarkdown } from './AboutView';
import { ArrowLeft, Calendar, User, Clock, ChevronLeft, ChevronRight, Search, Share2, Check, Sparkles } from 'lucide-react';

interface BlogViewProps {
  posts: BlogPost[];
  selectedSlug: string;
  setRoute: (route: { page: string; param: string }) => void;
}

export default function BlogView({ posts, selectedSlug, setRoute }: BlogViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  
  const postsPerPage = 6;

  // Reset pagination when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Estimate reading time
  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // 1. DETAIL VIEW
  if (selectedSlug) {
    const post = posts.find(p => p.slug === selectedSlug);

    if (!post) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-24 text-center space-y-4 animate-fade-in">
          <h2 className="font-display text-2xl font-bold text-brand-900">Article Not Found</h2>
          <p className="text-zinc-700">The article you are looking for might have been moved or deleted.</p>
          <button
            onClick={() => { window.location.hash = '#/blog'; }}
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </button>
        </div>
      );
    }

    // Recommended posts (exclude current)
    const recommendations = posts
      .filter(p => p.id !== post.id && p.status === 'published')
      .slice(0, 3);

    const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
        {/* Back navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => { window.location.hash = '#/blog'; }}
            className="group inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900 transition"
          >
            <ArrowLeft className="h-4 w-4 transform transition-transform group-hover:-translate-x-0.5" /> Back to all stories
          </button>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white/95 px-4 py-2 text-xs font-semibold text-brand-700 hover:text-brand-900 hover:bg-brand-50 transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied link!
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-brand-500" /> Share Article
              </>
            )}
          </button>
        </div>

        {/* Header Block */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-brand-600 font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {formatDate(post.created_at)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> By Shibani Roy
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {getReadingTime(post.content)}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-900 tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Hero image */}
        <div className="relative rounded-[32px] border-4 border-white overflow-hidden bg-brand-50 aspect-video shadow-2xl">
          <img
            src={post.feature_image_url || 'https://picsum.photos/seed/full/1200/800'}
            alt={post.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Prose Content */}
        <div className="mx-auto max-w-3xl prose text-left">
          {renderMarkdown(post.content)}
        </div>

        {/* About the virtual author section */}
        <div className="mx-auto max-w-3xl pt-8 border-t border-brand-100">
          <div className="rounded-3xl border border-brand-100 bg-white/80 p-6 flex flex-col sm:flex-row gap-5 items-center shadow-lg glass-card text-left">
            <img
              src="/images/shibani_avatar_1784621038657.jpg"
              alt="Shibani Roy Portrait"
              loading="lazy"
              className="h-16 w-16 rounded-full object-cover border-2 border-brand-200 shadow-md"
            />
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-display font-bold text-brand-900 text-lg">Shibani Roy</h4>
              <p className="text-xs text-brand-600 font-mono font-bold uppercase tracking-wider">India's Leading Virtual AI Creator</p>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Shibani is a model, writer, and digital influencer designed using modern neural nets, exploring tech and handloom culture.
              </p>
            </div>
          </div>
        </div>

        {/* Recommended posts */}
        {recommendations.length > 0 && (
          <div className="mx-auto max-w-3xl pt-12 space-y-6">
            <h3 className="font-display font-bold text-2xl text-brand-900 text-left">Recommended Readings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommendations.map(p => (
                <article
                  key={p.id}
                  onClick={() => { window.location.hash = `#/blog/${p.slug}`; }}
                  className="group cursor-pointer rounded-2xl border border-brand-100 bg-white/80 p-3.5 hover:border-brand-300 hover:shadow-xl hover:scale-102 transition-all duration-300 flex flex-col h-full shadow-sm"
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-brand-50 mb-3 border border-brand-100">
                    <img
                      src={p.feature_image_url || 'https://picsum.photos/seed/rec/400/300'}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-display font-bold text-base text-brand-900 group-hover:text-brand-700 line-clamp-2 leading-snug text-left">
                    {p.title}
                  </h4>
                  <p className="text-[10px] font-mono text-brand-600 font-bold mt-auto pt-2 text-left">{formatDate(p.created_at)}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  }

  // 2. LIST VIEW
  const publishedPosts = posts.filter(p => p.status === 'published');
  
  const filteredPosts = publishedPosts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination bounds
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      {/* Search & Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-brand-100 text-left">
        <div className="space-y-2">
          <span className="text-xs font-mono tracking-widest text-brand-600 uppercase font-black">Chronicles</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-900 tracking-tight">
            Digital Thoughts
          </h1>
          <p className="text-zinc-700 max-w-md text-sm sm:text-base leading-relaxed">
            Explorations in artificial style, digital sustainable couture, culture, and human relationships.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-4 flex items-center text-brand-600 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search digital archives..."
            className="w-full bg-white/95 border border-brand-200 rounded-full py-2.5 pl-11 pr-5 text-sm text-brand-950 placeholder-zinc-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-md"
          />
        </div>
      </div>

      {/* Grid of Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => { window.location.hash = `#/blog/${post.slug}`; }}
            className="group cursor-pointer rounded-3xl border border-brand-100 bg-white/80 p-5 transition-all duration-300 hover:border-brand-300 hover:shadow-2xl hover:scale-102 flex flex-col h-full animate-fade-in glass-card"
          >
            {/* Feature Image */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-brand-50 border border-brand-100 mb-4">
              <img
                src={post.feature_image_url || 'https://picsum.photos/seed/placeholder/800/600'}
                alt={post.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-550 group-hover:scale-105"
              />
            </div>

            {/* Meta */}
            <div className="flex items-center space-x-3 text-xs text-brand-600 font-mono font-bold mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(post.created_at)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {getReadingTime(post.content)}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display font-bold text-xl text-brand-900 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug text-left">
              {post.title}
            </h2>

            {/* Content Preview / Excerpt */}
            <p className="text-zinc-700 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed flex-grow text-left">
              {stripMarkdown(post.content).slice(0, 140)}...
            </p>

            {/* Link Footer */}
            <div className="text-xs font-bold text-brand-700 group-hover:text-brand-900 transition-colors flex items-center gap-1 mt-4 pt-4 border-t border-brand-50">
              Read Story <ChevronRight className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-0.5 text-brand-600" />
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="py-24 text-center rounded-[32px] border border-dashed border-brand-200 text-brand-600 space-y-2 bg-white/50 glass-card">
          <p className="text-base font-bold text-brand-900">No blog posts found</p>
          <p className="text-xs max-w-xs mx-auto text-zinc-600 leading-relaxed">
            Try adjusting your search keywords, or look out for new updates in the future.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-brand-100">
          <p className="text-xs text-brand-600 font-semibold">
            Showing <span className="text-brand-900 font-extrabold">{indexOfFirstPost + 1}</span> to{' '}
            <span className="text-brand-900 font-extrabold">
              {Math.min(indexOfLastPost, filteredPosts.length)}
            </span>{' '}
            of <span className="text-brand-900 font-extrabold">{filteredPosts.length}</span> archives
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-brand-200 text-brand-600 bg-white hover:text-brand-900 hover:bg-brand-50 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="text-xs font-mono text-brand-600 font-bold px-2">
              Page <span className="text-brand-900 font-extrabold">{currentPage}</span> of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-brand-200 text-brand-600 bg-white hover:text-brand-900 hover:bg-brand-50 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
