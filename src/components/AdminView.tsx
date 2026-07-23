import React, { useState, useEffect } from 'react';
import { BlogPost, SiteContent, ContactMessage, ServiceItem, ServicesPageSettings } from '../types';
import { dbService, isSupabaseConfigured, supabase } from '../services/db';
import { renderMarkdown } from './AboutView';
import { 
  Lock, User, Mail, Database, Eye, EyeOff, Save, Check, Loader, 
  Plus, Edit2, Trash2, Settings, FileText, Inbox, ChevronRight,
  ArrowLeft, Upload, Sparkles, HelpCircle, AlertCircle, RefreshCw,
  Briefcase, ArrowUp, ArrowDown, Layers, ToggleLeft, ToggleRight, X
} from 'lucide-react';

interface AdminViewProps {
  isAdminLoggedIn: boolean;
  onLoginSuccess: () => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => void;
  posts: BlogPost[];
  onUpdatePosts: () => void;
}

type AdminTab = 'blog' | 'site-home' | 'site-about' | 'inbox' | 'services';

export default function AdminView({ 
  isAdminLoggedIn, 
  onLoginSuccess, 
  siteContent, 
  onUpdateSiteContent, 
  posts,
  onUpdatePosts
}: AdminViewProps) {
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<AdminTab>('blog');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Blog editing state
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [postEditorMode, setPostEditorMode] = useState<'create' | 'edit'>('create');
  const [isUploading, setIsUploading] = useState(false);
  const [editorPreviewMode, setEditorPreviewMode] = useState(false);

  // Configuration forms save states
  const [homeForm, setHomeForm] = useState<SiteContent>({ ...siteContent });
  const [isSavingHome, setIsSavingHome] = useState(false);
  const [saveHomeSuccess, setSaveHomeSuccess] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingAboutImage, setIsUploadingAboutImage] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [aboutText, setAboutText] = useState(siteContent.about_text || '');
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [saveAboutSuccess, setSaveAboutSuccess] = useState(false);

  // Services Management State
  const [adminServices, setAdminServices] = useState<ServiceItem[]>([]);
  const [servicesSettings, setServicesSettings] = useState<ServicesPageSettings>({
    id: 1,
    hero_heading: "Work With Shibani",
    hero_subtext: "India's AI virtual influencer — available for brand partnerships, digital campaigns, and virtual modeling projects.",
    hero_image_url: ""
  });
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isSavingServicesSettings, setIsSavingServicesSettings] = useState(false);
  const [saveServicesSettingsSuccess, setSaveServicesSettingsSuccess] = useState(false);
  const [isUploadingServicesHero, setIsUploadingServicesHero] = useState(false);

  // Service Edit / Create Modal State
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [includesInput, setIncludesInput] = useState('');
  const [isSavingService, setIsSavingService] = useState(false);

  const loadServicesData = async () => {
    if (!isAdminLoggedIn) return;
    setIsLoadingServices(true);
    try {
      const [srvs, stgs] = await Promise.all([
        dbService.getServices(true),
        dbService.getServicesPageSettings()
      ]);
      setAdminServices(srvs || []);
      if (stgs) setServicesSettings(stgs);
    } catch (err) {
      console.error('Failed to load services in admin:', err);
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadServicesData();
    }
  }, [isAdminLoggedIn]);

  const handleSaveServicesSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingServicesSettings(true);
    setSaveServicesSettingsSuccess(false);
    try {
      const updated = await dbService.updateServicesPageSettings(servicesSettings);
      setServicesSettings(updated);
      setSaveServicesSettingsSuccess(true);
      setTimeout(() => setSaveServicesSettingsSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      alert('Error saving Services Page Settings: ' + err.message);
    } finally {
      setIsSavingServicesSettings(false);
    }
  };

  const handleServicesHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingServicesHero(true);
    try {
      const imageUrl = await dbService.uploadServiceImage(file);
      setServicesSettings(prev => ({ ...prev, hero_image_url: imageUrl }));
    } catch (err: any) {
      console.error(err);
      alert('Failed to upload hero image: ' + err.message);
    } finally {
      setIsUploadingServicesHero(false);
    }
  };

  const handleOpenCreateService = () => {
    setEditingService({
      title: '',
      icon: '🤝',
      description: '',
      includes: [],
      is_active: true,
      sort_order: adminServices.length + 1
    });
    setIncludesInput('');
  };

  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setIncludesInput((service.includes || []).join('\n'));
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) {
      alert('Please enter a service title.');
      return;
    }

    setIsSavingService(true);
    const parsedIncludes = includesInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const payload = {
      title: editingService.title,
      icon: editingService.icon || '✨',
      description: editingService.description || '',
      includes: parsedIncludes,
      is_active: editingService.is_active !== undefined ? editingService.is_active : true,
      sort_order: editingService.sort_order || (adminServices.length + 1)
    };

    try {
      if (editingService.id) {
        await dbService.updateService(editingService.id, payload);
      } else {
        await dbService.createService(payload);
      }
      await loadServicesData();
      setEditingService(null);
    } catch (err: any) {
      console.error(err);
      alert('Error saving service: ' + err.message);
    } finally {
      setIsSavingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await dbService.deleteService(id);
      await loadServicesData();
    } catch (err: any) {
      console.error(err);
      alert('Error deleting service: ' + err.message);
    }
  };

  const handleToggleServiceActive = async (service: ServiceItem) => {
    try {
      await dbService.updateService(service.id, { is_active: !service.is_active });
      await loadServicesData();
    } catch (err: any) {
      console.error(err);
      alert('Error updating service status: ' + err.message);
    }
  };

  const handleMoveService = async (service: ServiceItem, direction: 'up' | 'down') => {
    const currentIndex = adminServices.findIndex(s => s.id === service.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= adminServices.length) return;

    const targetService = adminServices[targetIndex];
    try {
      await Promise.all([
        dbService.updateService(service.id, { sort_order: targetService.sort_order }),
        dbService.updateService(targetService.id, { sort_order: service.sort_order })
      ]);
      await loadServicesData();
    } catch (err: any) {
      console.error(err);
      alert('Error reordering services: ' + err.message);
    }
  };

  // Sync state if siteContent updates
  useEffect(() => {
    setHomeForm({ ...siteContent });
    setAboutText(siteContent.about_text || '');
  }, [siteContent]);

  // Load Contact submissions
  const loadMessages = async () => {
    if (!isAdminLoggedIn) return;
    setIsLoadingMessages(true);
    try {
      const data = await dbService.getContactMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadMessages();
    }
  }, [isAdminLoggedIn]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    try {
      // 1. Check sandbox credentials first for local development or bypass
      if (email === 'admin@shibani.ai' && password === 'shibani123') {
        localStorage.setItem('shibani_admin_session', 'true');
        onLoginSuccess();
        return;
      }

      // 2. Otherwise use Supabase if configured
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onLoginSuccess();
      } else {
        setAuthError('Invalid administrator credentials. Hint: use admin@shibani.ai and shibani123 in sandbox mode.');
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const autofillSandboxCreds = () => {
    setEmail('admin@shibani.ai');
    setPassword('shibani123');
  };

  // --- BLOG OPERATIONS ---
  const handleOpenCreatePost = () => {
    setPostEditorMode('create');
    setEditingPost({
      title: '',
      slug: '',
      content: 'Write your story here in markdown...',
      feature_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      status: 'draft'
    });
    setEditorPreviewMode(false);
  };

  const handleOpenEditPost = (post: BlogPost) => {
    setPostEditorMode('edit');
    setEditingPost({ ...post });
    setEditorPreviewMode(false);
  };

  const handleAutoSlug = () => {
    if (!editingPost || !editingPost.title) return;
    const generated = editingPost.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove weird chars
      .trim()
      .replace(/\s+/g, '-'); // replace spaces with dashes
    setEditingPost(prev => ({ ...prev, slug: generated }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;

    setIsUploading(true);
    try {
      const imageUrl = await dbService.uploadImage(file);
      setEditingPost(prev => ({ ...prev, feature_image_url: imageUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHero(true);
    try {
      const imageUrl = await dbService.uploadImage(file);
      setHomeForm(prev => ({ ...prev, hero_image_url: imageUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload hero image.');
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const imageUrl = await dbService.uploadImage(file);
      setHomeForm(prev => ({ ...prev, avatar_image_url: imageUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload profile image.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAboutImage(true);
    try {
      const imageUrl = await dbService.uploadImage(file);
      setHomeForm(prev => ({ ...prev, about_image_url: imageUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload about image.');
    } finally {
      setIsUploadingAboutImage(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const imageUrl = await dbService.uploadImage(file);
      setHomeForm(prev => ({ ...prev, logo_url: imageUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload brand logo.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.slug || !editingPost?.content) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSavingPost(true);
    try {
      if (postEditorMode === 'create') {
        await dbService.createBlogPost(editingPost as Omit<BlogPost, 'id' | 'created_at'>);
      } else {
        await dbService.updateBlogPost(editingPost.id!, editingPost as Partial<BlogPost>);
      }
      onUpdatePosts();
      setEditingPost(null);
    } catch (err: any) {
      console.error(err);
      alert('Error saving post: ' + err.message);
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this blog post? This is permanent.')) return;

    try {
      await dbService.deleteBlogPost(id);
      onUpdatePosts();
    } catch (err: any) {
      console.error(err);
      alert('Error deleting post: ' + err.message);
    }
  };

  const handleTogglePublishStatus = async (post: BlogPost) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await dbService.updateBlogPost(post.id, { status: nextStatus });
      onUpdatePosts();
    } catch (err: any) {
      console.error(err);
      alert('Error updating status: ' + err.message);
    }
  };

  // --- SAVE HOME CONTENT ---
  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHome(true);
    setSaveHomeSuccess(false);

    try {
      const updated = await dbService.updateSiteContent(homeForm);
      onUpdateSiteContent(updated);
      setSaveHomeSuccess(true);
      setTimeout(() => setSaveHomeSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      alert('Error saving configuration: ' + err.message);
    } finally {
      setIsSavingHome(false);
    }
  };

  // --- SAVE ABOUT CONTENT ---
  const handleSaveAbout = async () => {
    setIsSavingAbout(true);
    setSaveAboutSuccess(false);

    try {
      const updated = await dbService.updateSiteContent({ about_text: aboutText });
      onUpdateSiteContent(updated);
      setSaveAboutSuccess(true);
      setTimeout(() => setSaveAboutSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      alert('Error saving Biography: ' + err.message);
    } finally {
      setIsSavingAbout(false);
    }
  };

  // --- DELETE MESSAGE ---
  const handleDeleteMessage = async (id: string) => {
    try {
      await dbService.deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      console.error(err);
      alert('Error deleting message: ' + err.message);
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ==========================================
  // RENDER LOGIN SCREEN
  // ==========================================
  if (!isAdminLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 border-2 border-brand-200 text-brand-600 shadow-sm">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="font-display text-4xl font-bold text-brand-900 tracking-tight">Admin Portal</h2>
          <p className="text-xs text-brand-600 font-mono tracking-wider font-extrabold uppercase">Authenticating Operator</p>
        </div>

        <div className="rounded-[32px] border border-brand-100 bg-white/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden glass-card">
          <form onSubmit={handleLogin} className="space-y-5 relative z-10 text-left">
            {authError && (
              <div className="flex items-start gap-2 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-xs font-mono text-brand-700 font-bold uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-brand-600 pointer-events-none">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="admin-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shibani.ai"
                  className="w-full bg-white border border-brand-200 rounded-full py-3 pl-11 pr-4 text-sm text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="text-xs font-mono text-brand-700 font-bold uppercase tracking-wider">Master Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-brand-600 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-pass"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-brand-200 rounded-full py-3 pl-11 pr-10 text-sm text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-brand-600 hover:text-brand-900"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brand-700 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              {isLoggingIn ? (
                <>
                  <Loader className="h-4 w-4 animate-spin text-white" /> Verifying...
                </>
              ) : (
                <>
                  Access Dashboard <ChevronRight className="h-4 w-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sandbox credentials guide box */}
        {!isSupabaseConfigured && (
          <div className="rounded-[32px] border border-brand-200 bg-white/70 backdrop-blur-md p-6 space-y-4 shadow-xl glass-card text-left">
            <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-600" /> Sandboxed Mode Active
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Your preview environment is running using local persistence storage. Use the pre-configured mock administrator account to test:
            </p>
            <div className="bg-brand-50/40 p-4 rounded-2xl border border-brand-100 space-y-2 text-xs shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-brand-700 font-medium">Admin Email:</span>
                <span className="text-brand-950 font-bold font-mono">admin@shibani.ai</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-700 font-medium">Master Password:</span>
                <span className="text-brand-950 font-bold font-mono">shibani123</span>
              </div>
            </div>
            <button
              onClick={autofillSandboxCreds}
              className="w-full rounded-full bg-brand-600 text-white py-2.5 text-xs font-bold hover:bg-brand-700 transition flex items-center justify-center gap-1.5 shadow-md transform hover:-translate-y-0.5"
            >
              <Check className="h-3.5 w-3.5 text-white" /> Auto-fill credentials
            </button>
          </div>
        )}

        {isSupabaseConfigured && (
          <p className="text-center text-xs text-brand-600 flex items-center justify-center gap-1">
            <Database className="h-3.5 w-3.5 text-emerald-600 animate-pulse" /> Connected to Live Supabase Auth DB
          </p>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER BLOG WRITER / EDITOR SCREEN
  // ==========================================
  if (editingPost) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-6 animate-fade-in text-left">
        {/* Editor Header */}
        <div className="flex items-center justify-between border-b border-brand-100 pb-5">
          <button
            onClick={() => setEditingPost(null)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Editor
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setEditorPreviewMode(!editorPreviewMode)}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-bold text-brand-800 hover:text-white hover:bg-brand-600 hover:border-brand-600 transition shadow-sm"
            >
              {editorPreviewMode ? (
                <>
                  <Edit2 className="h-3.5 w-3.5" /> Back to Edit
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" /> Preview Markdown
                </>
              )}
            </button>
          </div>
        </div>

        {editorPreviewMode ? (
          /* Editor Live Preview Mode */
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-mono text-brand-600 font-black uppercase tracking-widest">Post Preview</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 tracking-tight leading-tight">
                {editingPost.title || 'Untitled Post'}
              </h1>
              <p className="text-xs text-brand-500 font-mono font-bold">Slug: {editingPost.slug || '(not set)'}</p>
            </div>
            
            <div className="rounded-[32px] border border-brand-100 overflow-hidden bg-white/40 aspect-video shadow-md">
              <img
                src={editingPost.feature_image_url || 'https://picsum.photos/seed/draft/800/600'}
                alt="Feature Preview"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="border-t border-brand-100 pt-6 text-brand-950 markdown-body">
              {renderMarkdown(editingPost.content || '')}
            </div>
          </div>
        ) : (
          /* Main Editor Fields form */
          <form onSubmit={handleSaveBlogPost} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Inputs column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-brand-700 uppercase tracking-wider block font-bold">Post Title *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a compelling title..."
                  className="w-full bg-white border border-brand-200 rounded-full py-3.5 px-5 text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-brand-700 uppercase tracking-wider block font-bold">Url Slug *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingPost.slug || ''}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="stepping-into-the-light"
                    className="w-full bg-white border border-brand-200 rounded-full py-2.5 px-5 text-sm text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    disabled={!editingPost.title}
                    className="rounded-full border border-brand-200 bg-white px-5 text-xs font-bold text-brand-700 hover:text-white hover:bg-brand-600 hover:border-brand-600 transition disabled:opacity-40 shadow-sm whitespace-nowrap"
                  >
                    Auto-Generate
                  </button>
                </div>
              </div>

              {/* Content Markdown Area */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-brand-700 uppercase tracking-wider block font-bold">Article Body (Markdown Supported) *</label>
                  <span className="text-[10px] text-brand-500 font-bold font-mono">Supports: ###, **, &gt;, -, lists</span>
                </div>
                <textarea
                  required
                  rows={15}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write post content here using markdown..."
                  className="w-full bg-white border border-brand-200 rounded-[24px] py-4.5 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-sans leading-relaxed shadow-sm"
                ></textarea>
              </div>
            </div>

            {/* Right Settings panel column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Image Upload/URL Settings */}
              <div className="rounded-[32px] border border-brand-100 bg-white/80 p-5 space-y-4 shadow-xl glass-card">
                <h3 className="font-display font-bold text-brand-900 text-base">Feature Image</h3>

                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-brand-50/50 border border-brand-100 relative group shadow-sm">
                  <img
                    src={editingPost.feature_image_url || 'https://picsum.photos/seed/draft/800/600'}
                    alt="Post feature preview"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader className="h-5 w-5 text-brand-600 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-brand-700 font-bold block">Image URL</label>
                  <input
                    type="text"
                    value={editingPost.feature_image_url || ''}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, feature_image_url: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-brand-200 rounded-full py-2 px-4 text-xs text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
                  />
                </div>

                {/* File input uploader */}
                <div className="relative border border-dashed border-brand-200 bg-brand-50/30 rounded-[20px] p-4 text-center hover:bg-brand-50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="h-5 w-5 text-brand-500 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-brand-700">Drag or select a new file</p>
                  <p className="text-[9px] text-brand-500 mt-0.5 font-medium">Saves directly to database state</p>
                </div>
              </div>

              {/* Publish Controls */}
              <div className="rounded-[32px] border border-brand-100 bg-white/80 p-5 space-y-4 shadow-xl glass-card text-left">
                <h3 className="font-display font-bold text-brand-900 text-base">Publish Settings</h3>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-700 font-bold uppercase tracking-wider">Status</span>
                  <div className="flex gap-1.5 bg-brand-50/60 p-1 rounded-full border border-brand-100">
                    <button
                      type="button"
                      onClick={() => setEditingPost(prev => ({ ...prev, status: 'draft' }))}
                      className={`text-[10px] px-3.5 py-1.5 rounded-full font-bold font-mono transition-all cursor-pointer ${
                        editingPost.status === 'draft'
                          ? 'bg-white text-brand-900 shadow-sm border border-brand-200/50'
                          : 'text-brand-400 hover:text-brand-600'
                      }`}
                    >
                      DRAFT
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPost(prev => ({ ...prev, status: 'published' }))}
                      className={`text-[10px] px-3.5 py-1.5 rounded-full font-bold font-mono transition-all cursor-pointer ${
                        editingPost.status === 'published'
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'text-brand-400 hover:text-brand-600'
                      }`}
                    >
                      PUBLISH
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingPost}
                  className="w-full rounded-full bg-brand-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-brand-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 transform hover:-translate-y-0.5 shadow-brand-500/10"
                >
                  {isSavingPost ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-white" /> Save Article
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-brand-100 mb-8">
        <div>
          <span className="text-xs font-mono text-brand-600 font-extrabold uppercase tracking-widest">Control panel</span>
          <h1 className="font-display text-3xl font-bold text-brand-950 tracking-tight mt-1">
            Administrator Dashboard
          </h1>
        </div>

        {/* Status Mode Indicator */}
        <div className="text-xs font-mono py-1.5 px-4 rounded-full border border-brand-100 bg-white/80 inline-flex items-center gap-1.5 max-w-max shadow-sm glass-card">
          <Database className={`h-3.5 w-3.5 ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span className="text-brand-500 font-medium">Database Context:</span>
          <span className={isSupabaseConfigured ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
            {isSupabaseConfigured ? 'Live Supabase' : 'Local Sandbox'}
          </span>
        </div>
      </div>

      {/* Tabs list & Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar tabs */}
        <div className="lg:col-span-3 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1.5 scrollbar-none border-b lg:border-b-0 lg:border-r border-brand-100 pr-0 lg:pr-6 shrink-0">
          {[
            { id: 'blog', label: 'Blog Posts', icon: FileText },
            { id: 'services', label: 'Services Page', icon: Briefcase },
            { id: 'site-home', label: 'Home & Hero Settings', icon: Settings },
            { id: 'site-about', label: 'Biography Bio', icon: Sparkles },
            { id: 'inbox', label: 'Contact Inbox', icon: Inbox, badgeCount: messages.length }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center justify-between px-4 py-3 rounded-full text-sm font-semibold transition whitespace-nowrap lg:whitespace-normal w-full text-left ${
                  isActive
                    ? 'bg-brand-600 text-white border border-brand-600 shadow-md'
                    : 'text-brand-700 hover:text-brand-950 hover:bg-brand-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : 'text-brand-400'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className={`text-[10px] font-mono rounded-full h-5 px-2 flex items-center justify-center font-bold border ${
                    isActive 
                      ? 'bg-white text-brand-900 border-white' 
                      : 'bg-brand-100 text-brand-800 border-brand-200'
                  }`}>
                    {tab.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content pane */}
        <div className="lg:col-span-9">
          {/* TAB 1: BLOG POSTS LISTING */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-brand-950">Shibani's Chronicles</h3>
                  <p className="text-xs text-brand-500">Create, edit, and toggle publish statuses for the blog.</p>
                </div>
                <button
                  onClick={handleOpenCreatePost}
                  className="rounded-full bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition flex items-center gap-1 shadow-md shadow-brand-500/10"
                >
                  <Plus className="h-4 w-4 text-white" /> New Article
                </button>
              </div>

              <div className="rounded-[32px] border border-brand-100 bg-white/80 overflow-hidden shadow-xl glass-card">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-100 bg-brand-50/40 text-xs font-mono text-brand-800 uppercase tracking-wider">
                      <th className="p-4">Article Title</th>
                      <th className="p-4 hidden md:table-cell">Created Date</th>
                      <th className="p-4">Publish Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {posts.map((post) => (
                      <tr key={post.id} className="text-xs text-brand-950 hover:bg-brand-50/30">
                        <td className="p-4">
                          <div className="font-display font-bold text-brand-900 hover:text-brand-600 hover:underline cursor-pointer text-sm animate-fade-in" onClick={() => handleOpenEditPost(post)}>
                            {post.title}
                          </div>
                          <div className="text-[10px] text-brand-400 mt-1 font-mono">/{post.slug}</div>
                        </td>
                        <td className="p-4 hidden md:table-cell font-mono text-brand-500">
                          {formatDate(post.created_at)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTogglePublishStatus(post)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono font-bold text-[9px] border cursor-pointer hover:scale-105 transition ${
                              post.status === 'published'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-brand-50 border-brand-200 text-brand-700'
                            }`}
                          >
                            {post.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEditPost(post)}
                            className="p-1.5 rounded-full border border-brand-200 text-brand-700 bg-white hover:text-brand-900 hover:bg-brand-50 transition inline-flex shadow-sm"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 rounded-full border border-brand-200 text-brand-700 bg-white hover:text-red-600 hover:bg-red-50 transition inline-flex shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {posts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-500">
                          No blog posts found. Click "New Article" to create your first content!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: HERO CONFIGURATION */}
          {activeTab === 'site-home' && (
            <form onSubmit={handleSaveHome} className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-brand-950">Hero Section Settings</h3>
                <p className="text-xs text-brand-500">Modify landing text, image links, and Shibani companion configurations.</p>
              </div>

              <div className="rounded-[32px] border border-brand-100 bg-white/80 p-6 space-y-4 shadow-xl glass-card text-left">
                {saveHomeSuccess && (
                  <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 shadow-sm">
                    <Check className="h-4 w-4 shrink-0 text-emerald-700" />
                    <span>Hero configuration saved successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-brand-700 font-bold block">Hero Display Title</label>
                    <input
                      type="text"
                      value={homeForm.hero_title || ''}
                      onChange={(e) => setHomeForm(prev => ({ ...prev, hero_title: e.target.value }))}
                      className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                    />
                  </div>

                  {/* Tagline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-brand-700 font-bold block">Slogan / Tagline</label>
                    <input
                      type="text"
                      value={homeForm.hero_tagline || ''}
                      onChange={(e) => setHomeForm(prev => ({ ...prev, hero_tagline: e.target.value }))}
                      className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Intro Bio text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-brand-700 font-bold block">Introductory Summary</label>
                  <textarea
                    rows={4}
                    value={homeForm.hero_intro || ''}
                    onChange={(e) => setHomeForm(prev => ({ ...prev, hero_intro: e.target.value }))}
                    className="w-full bg-white border border-brand-200 rounded-[20px] py-3.5 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 leading-relaxed resize-none shadow-sm"
                  ></textarea>
                </div>

                {/* Image Specifications & Size Guide Banner */}
                <div className="bg-brand-50/40 border border-brand-100 rounded-[20px] p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div>
                    <h5 className="font-display font-bold text-xs text-brand-900 tracking-wider uppercase">Media Assets Specification Guide</h5>
                    <p className="text-[11px] text-zinc-600 mt-1">Recommended dimensions for optimal visual rendering across all responsive layouts:</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-brand-100/50 shadow-sm">
                      <span className="block text-[9px] font-mono font-bold text-brand-600 uppercase">Header & Footer Logo</span>
                      <span className="text-[11px] font-bold text-brand-950">48 × 48 px (1:1 circular)</span>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-brand-100/50 shadow-sm">
                      <span className="block text-[9px] font-mono font-bold text-brand-600 uppercase">Home Page Logo</span>
                      <span className="text-[11px] font-bold text-brand-950">80 × 80 px (1:1 square)</span>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-brand-100/50 shadow-sm">
                      <span className="block text-[9px] font-mono font-bold text-brand-600 uppercase">Home Hero & Avatar</span>
                      <span className="text-[11px] font-bold text-brand-950 font-mono">1:1 Ratio (Square)</span>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-brand-100/50 shadow-sm">
                      <span className="block text-[9px] font-mono font-bold text-brand-600 uppercase">About Scene Banner</span>
                      <span className="text-[11px] font-bold text-brand-950 font-mono">16:9 Ratio (Landscape)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Brand Logo Image */}
                  <div className="space-y-2 border border-brand-100 rounded-[24px] p-5 bg-brand-50/20">
                    <label className="text-xs font-mono text-brand-700 font-bold block">Brand Logo / Circular Emblem</label>
                    <div className="flex flex-col gap-3">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden border border-brand-200 bg-white shadow-sm shrink-0 mx-auto">
                        {homeForm.logo_url ? (
                          <img src={homeForm.logo_url} alt="Brand logo preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-brand-300 text-[10px] font-mono">No Image</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={homeForm.logo_url || ''}
                          onChange={(e) => setHomeForm(prev => ({ ...prev, logo_url: e.target.value }))}
                          placeholder="Paste logo URL..."
                          className="w-full bg-white border border-brand-200 rounded-full py-2 px-4 text-xs text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-200 hover:bg-brand-50 transition px-3 py-1.5 text-[11px] font-semibold text-brand-700 shadow-sm mx-auto">
                            <Upload className="h-3.5 w-3.5 text-brand-500" />
                            <span>{isUploadingLogo ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                              disabled={isUploadingLogo}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Hero Image */}
                  <div className="space-y-2 border border-brand-100 rounded-[24px] p-5 bg-brand-50/20">
                    <label className="text-xs font-mono text-brand-700 font-bold block">Home Section Hero Image (1:1)</label>
                    <div className="flex flex-col gap-3">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-brand-200 bg-white shadow-sm shrink-0 mx-auto">
                        {homeForm.hero_image_url ? (
                          <img src={homeForm.hero_image_url} alt="Home hero preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-brand-300 text-[10px] font-mono">No Image</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={homeForm.hero_image_url || ''}
                          onChange={(e) => setHomeForm(prev => ({ ...prev, hero_image_url: e.target.value }))}
                          placeholder="Paste image URL..."
                          className="w-full bg-white border border-brand-200 rounded-full py-2 px-4 text-xs text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-200 hover:bg-brand-50 transition px-3 py-1.5 text-[11px] font-semibold text-brand-700 shadow-sm mx-auto">
                            <Upload className="h-3.5 w-3.5 text-brand-500" />
                            <span>{isUploadingHero ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleHeroUpload}
                              className="hidden"
                              disabled={isUploadingHero}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About Hero Image */}
                  <div className="space-y-2 border border-brand-100 rounded-[24px] p-5 bg-brand-50/20">
                    <label className="text-xs font-mono text-brand-700 font-bold block">About Section Hero Image (16:9)</label>
                    <div className="flex flex-col gap-3">
                      <div className="relative h-20 w-full rounded-lg overflow-hidden border border-brand-200 bg-white shadow-sm shrink-0">
                        {homeForm.about_image_url || homeForm.hero_image_url ? (
                          <img src={homeForm.about_image_url || homeForm.hero_image_url} alt="About hero preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-brand-300 text-[10px] font-mono">No Image</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={homeForm.about_image_url || ''}
                          onChange={(e) => setHomeForm(prev => ({ ...prev, about_image_url: e.target.value }))}
                          placeholder="Paste image URL..."
                          className="w-full bg-white border border-brand-200 rounded-full py-2 px-4 text-xs text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-200 hover:bg-brand-50 transition px-3 py-1.5 text-[11px] font-semibold text-brand-700 shadow-sm mx-auto">
                            <Upload className="h-3.5 w-3.5 text-brand-500" />
                            <span>{isUploadingAboutImage ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAboutImageUpload}
                              className="hidden"
                              disabled={isUploadingAboutImage}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile / Avatar Image */}
                  <div className="space-y-2 border border-brand-100 rounded-[24px] p-5 bg-brand-50/20">
                    <label className="text-xs font-mono text-brand-700 font-bold block">Profile / Avatar Portrait</label>
                    <div className="flex flex-col gap-3">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden border border-brand-200 bg-white shadow-sm shrink-0 mx-auto">
                        {homeForm.avatar_image_url ? (
                          <img src={homeForm.avatar_image_url} alt="Profile preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-brand-300 text-[10px] font-mono">No Image</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={homeForm.avatar_image_url || ''}
                          onChange={(e) => setHomeForm(prev => ({ ...prev, avatar_image_url: e.target.value }))}
                          placeholder="Paste avatar URL..."
                          className="w-full bg-white border border-brand-200 rounded-full py-2 px-4 text-xs text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-200 hover:bg-brand-50 transition px-3 py-1.5 text-[11px] font-semibold text-brand-700 shadow-sm mx-auto">
                            <Upload className="h-3.5 w-3.5 text-brand-500" />
                            <span>{isUploadingAvatar ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                              disabled={isUploadingAvatar}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Companion Bot Link URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-brand-700 font-bold block">Companion Chatbot Link URL</label>
                  <input
                    type="url"
                    value={homeForm.companion_url || ''}
                    onChange={(e) => setHomeForm(prev => ({ ...prev, companion_url: e.target.value }))}
                    placeholder="https://t.me/..."
                    className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                  />
                </div>

                {/* Bridging Code & Culture Section */}
                <div className="border-t border-brand-100 pt-6 mt-6 space-y-4">
                  <div>
                    <h4 className="font-display font-bold text-sm text-brand-950 uppercase tracking-wide">"Bridging Code & Culture" Home Section</h4>
                    <p className="text-xs text-brand-500 mt-0.5">Customize the section title, eyebrow label, and narrative paragraphs on the home page preview card.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-brand-700 font-bold block">Section Eyebrow Label</label>
                      <input
                        type="text"
                        value={homeForm.bridge_label ?? 'The Creator'}
                        onChange={(e) => setHomeForm(prev => ({ ...prev, bridge_label: e.target.value }))}
                        placeholder="The Creator"
                        className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-brand-700 font-bold block">Section Main Title</label>
                      <input
                        type="text"
                        value={homeForm.bridge_title ?? 'Bridging the Gap Between Code & Culture'}
                        onChange={(e) => setHomeForm(prev => ({ ...prev, bridge_title: e.target.value }))}
                        placeholder="Bridging the Gap Between Code & Culture"
                        className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-brand-700 font-bold block">Primary Paragraph Text</label>
                    <textarea
                      rows={3}
                      value={homeForm.bridge_paragraph_1 ?? ''}
                      onChange={(e) => setHomeForm(prev => ({ ...prev, bridge_paragraph_1: e.target.value }))}
                      placeholder="Based virtually in Mumbai, India, my identity is a fusion..."
                      className="w-full bg-white border border-brand-200 rounded-[20px] py-3.5 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 leading-relaxed resize-none shadow-sm font-medium"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-brand-700 font-bold block">Secondary Paragraph Text</label>
                    <textarea
                      rows={3}
                      value={homeForm.bridge_paragraph_2 ?? ''}
                      onChange={(e) => setHomeForm(prev => ({ ...prev, bridge_paragraph_2: e.target.value }))}
                      placeholder="Using advanced rendering and digital fabrications..."
                      className="w-full bg-white border border-brand-200 rounded-[20px] py-3.5 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 leading-relaxed resize-none shadow-sm font-medium"
                    ></textarea>
                  </div>
                </div>

                {/* Quick Profile Section inside tab */}
                <div className="border-t border-brand-100 pt-6 mt-6 space-y-4">
                  <h4 className="font-display font-bold text-sm text-brand-950 uppercase tracking-wide">Quick Profile Editor (About Sidebar)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Display Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-brand-700 font-bold block">Display Name</label>
                      <input
                        type="text"
                        value={homeForm.profile_name || ''}
                        onChange={(e) => setHomeForm(prev => ({ ...prev, profile_name: e.target.value }))}
                        placeholder="Shibani Roy"
                        className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                      />
                    </div>

                    {/* Origin */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-brand-700 font-bold block">Origin / Location</label>
                      <input
                        type="text"
                        value={homeForm.profile_origin || ''}
                        onChange={(e) => setHomeForm(prev => ({ ...prev, profile_origin: e.target.value }))}
                        placeholder="Mumbai (Virtual)"
                        className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                      />
                    </div>

                    {/* Core Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-brand-700 font-bold block">Core Type</label>
                      <input
                        type="text"
                        value={homeForm.profile_core_type || ''}
                        onChange={(e) => setHomeForm(prev => ({ ...prev, profile_core_type: e.target.value }))}
                        placeholder="Neural Art Model"
                        className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                      />
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-brand-700 font-bold block">Role / Specialization</label>
                      <input
                        type="text"
                        value={homeForm.profile_role || ''}
                        onChange={(e) => setHomeForm(prev => ({ ...prev, profile_role: e.target.value }))}
                        placeholder="Sartorial Fusion"
                        className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                      />
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-brand-700 font-bold block">Capabilities Summary</label>
                      <input
                        type="text"
                        value={homeForm.profile_capabilities || ''}
                        onChange={(e) => setHomeForm(prev => ({ ...prev, profile_capabilities: e.target.value }))}
                        placeholder="AI Conversation"
                        className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingHome}
                    className="rounded-full bg-brand-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-brand-700 transition flex items-center gap-1 disabled:opacity-50 shadow-brand-500/10 transform hover:-translate-y-0.5"
                  >
                    {isSavingHome ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: ABOUT PAGE EDITOR */}
          {activeTab === 'site-about' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-brand-950">Edit Biography Story</h3>
                  <p className="text-xs text-brand-500">Edit Shibani's profile biography, including details of her digital identity.</p>
                </div>
                {saveAboutSuccess && (
                  <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full animate-fade-in flex items-center gap-1 shadow-sm font-semibold">
                    <Check className="h-3.5 w-3.5" /> Biography Saved!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Editor Textarea */}
                <div className="lg:col-span-8 space-y-2">
                  <textarea
                    rows={16}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full bg-white border border-brand-200 rounded-[24px] p-5 text-sm text-brand-950 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 leading-relaxed shadow-sm font-semibold"
                    placeholder="Write Shibani's story bio in markdown..."
                  ></textarea>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveAbout}
                      disabled={isSavingAbout}
                      className="rounded-full bg-brand-600 px-6 py-3 text-xs font-bold text-white hover:bg-brand-700 transition flex items-center gap-1.5 disabled:opacity-50 shadow-lg shadow-brand-500/10 transform hover:-translate-y-0.5"
                    >
                      {isSavingAbout ? 'Saving...' : 'Save Biography'}
                    </button>
                  </div>
                </div>

                {/* Helper Tips */}
                <div className="lg:col-span-4 rounded-[28px] border border-brand-100 bg-brand-50/30 p-5 space-y-4">
                  <h4 className="font-display font-bold text-brand-950 text-sm flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-brand-600" /> Markdown Cheatsheet
                  </h4>
                  <ul className="text-xs text-brand-600 space-y-3 leading-relaxed font-mono">
                    <li>
                      <span className="text-brand-900 block font-bold">### Subheading</span>
                      Creates subheader with sparkling emblem
                    </li>
                    <li>
                      <span className="text-brand-900 block font-bold">&gt; Blockquote text</span>
                      Renders indented glass quote card
                    </li>
                    <li>
                      <span className="text-brand-900 block font-bold">**bold text**</span>
                      Applies strong weight color
                    </li>
                    <li>
                      <span className="text-brand-900 block font-bold">- List Item</span>
                      Creates neat bullet lines with rose-gold dots
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SERVICES MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-8 text-left animate-fade-in">
              {/* Part A: Services Page Settings Form */}
              <div className="rounded-[32px] border border-brand-100 bg-white/80 p-6 sm:p-8 shadow-xl glass-card space-y-6">
                <div className="flex justify-between items-center border-b border-brand-100 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-brand-950">Services Hero & Settings</h3>
                    <p className="text-xs text-brand-600 font-medium">Manage the hero banner text and image for the public /services page.</p>
                  </div>
                  {saveServicesSettingsSuccess && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-fade-in">
                      <Check className="h-3.5 w-3.5" /> Saved!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveServicesSettings} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-brand-700 font-bold uppercase tracking-wider block">Hero Heading</label>
                    <input
                      type="text"
                      required
                      value={servicesSettings.hero_heading}
                      onChange={(e) => setServicesSettings(prev => ({ ...prev, hero_heading: e.target.value }))}
                      className="w-full bg-white border border-brand-200 rounded-2xl py-3 px-4 text-sm font-semibold text-brand-950 focus:outline-none focus:border-brand-500 shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-brand-700 font-bold uppercase tracking-wider block">Hero Subtext</label>
                    <textarea
                      rows={2}
                      required
                      value={servicesSettings.hero_subtext}
                      onChange={(e) => setServicesSettings(prev => ({ ...prev, hero_subtext: e.target.value }))}
                      className="w-full bg-white border border-brand-200 rounded-2xl py-3 px-4 text-sm text-brand-950 focus:outline-none focus:border-brand-500 shadow-sm resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-brand-700 font-bold uppercase tracking-wider block">Hero Banner Image</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {servicesSettings.hero_image_url ? (
                        <div className="relative h-24 w-36 overflow-hidden rounded-xl border border-brand-200 shrink-0">
                          <img src={servicesSettings.hero_image_url} alt="Services Hero" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-24 w-36 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 flex flex-col items-center justify-center text-zinc-400 shrink-0">
                          <Upload className="h-5 w-5 mb-1" />
                          <span className="text-[10px] font-mono font-bold">NO IMAGE</span>
                        </div>
                      )}

                      <div className="space-y-2 flex-grow">
                        <input
                          type="text"
                          value={servicesSettings.hero_image_url || ''}
                          onChange={(e) => setServicesSettings(prev => ({ ...prev, hero_image_url: e.target.value }))}
                          placeholder="Image URL or upload file..."
                          className="w-full bg-white border border-brand-200 rounded-xl py-2 px-3 text-xs font-mono text-brand-950"
                        />
                        <label className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-bold text-brand-800 hover:bg-brand-50 cursor-pointer shadow-sm">
                          {isUploadingServicesHero ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 text-brand-600" />}
                          <span>{isUploadingServicesHero ? 'Uploading to services-images...' : 'Upload Image File'}</span>
                          <input type="file" accept="image/*" onChange={handleServicesHeroUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingServicesSettings}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition"
                    >
                      {isSavingServicesSettings ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      <span>Save Settings</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Part B: Services List & CRUD Management */}
              <div className="rounded-[32px] border border-brand-100 bg-white/80 p-6 sm:p-8 shadow-xl glass-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-100 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-brand-950">Active & Inactive Offerings</h3>
                    <p className="text-xs text-brand-600 font-medium">Add, edit, toggle visibility, and reorder services displayed on the site.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={loadServicesData}
                      disabled={isLoadingServices}
                      className="p-2 px-3 rounded-full border border-brand-200 text-brand-700 bg-white hover:bg-brand-50 transition flex items-center gap-1 text-xs shadow-sm font-semibold"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isLoadingServices ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                    <button
                      onClick={handleOpenCreateService}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition"
                    >
                      <Plus className="h-4 w-4" /> Add New Service
                    </button>
                  </div>
                </div>

                {isLoadingServices ? (
                  <div className="text-center py-12">
                    <Loader className="h-8 w-8 text-brand-600 animate-spin mx-auto mb-2" />
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Loading Services...</span>
                  </div>
                ) : adminServices.length === 0 ? (
                  <div className="py-12 text-center rounded-2xl border border-dashed border-brand-200 text-brand-600">
                    No services found. Click "Add New Service" above to create one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminServices.map((service, index) => (
                      <div
                        key={service.id}
                        className={`rounded-2xl border p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          service.is_active
                            ? 'border-brand-200 bg-white/90 shadow-sm'
                            : 'border-zinc-200 bg-zinc-50/70 opacity-75'
                        }`}
                      >
                        <div className="flex items-start space-x-4 flex-grow">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-200 text-xl">
                            {service.icon || '✨'}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-display font-bold text-brand-950 text-base">{service.title}</h4>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                                  service.is_active
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-zinc-200 text-zinc-700 border border-zinc-300'
                                }`}
                              >
                                {service.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-600 line-clamp-2 max-w-xl">{service.description}</p>
                            {service.includes && service.includes.length > 0 && (
                              <div className="text-[11px] text-brand-600 font-mono pt-1">
                                {service.includes.length} included feature points
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Control Actions */}
                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                          {/* Order Buttons */}
                          <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 p-0.5">
                            <button
                              onClick={() => handleMoveService(service, 'up')}
                              disabled={index === 0}
                              className="p-1.5 text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveService(service, 'down')}
                              disabled={index === adminServices.length - 1}
                              className="p-1.5 text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Toggle Active Button */}
                          <button
                            onClick={() => handleToggleServiceActive(service)}
                            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                              service.is_active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                            }`}
                            title={service.is_active ? 'Deactivate Service' : 'Activate Service'}
                          >
                            {service.is_active ? <ToggleRight className="h-4 w-4 text-emerald-600" /> : <ToggleLeft className="h-4 w-4 text-zinc-400" />}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditService(service)}
                            className="p-2 rounded-xl border border-brand-200 text-brand-700 hover:bg-brand-50 transition"
                            title="Edit Service"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                            title="Delete Service"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Edit/Create Modal Overlay */}
              {editingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-sm animate-fade-in">
                  <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <h3 className="font-display font-bold text-xl text-zinc-900">
                        {editingService.id ? 'Edit Service Offering' : 'Create New Service Offering'}
                      </h3>
                      <button
                        onClick={() => setEditingService(null)}
                        className="text-zinc-400 hover:text-zinc-700 p-1"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveService} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-1 space-y-1.5">
                          <label className="text-xs font-mono font-bold text-zinc-700 uppercase">Icon / Emoji</label>
                          <input
                            type="text"
                            required
                            value={editingService.icon || ''}
                            onChange={(e) => setEditingService(prev => ({ ...prev, icon: e.target.value }))}
                            placeholder="🤝"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 text-center text-lg font-semibold focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div className="sm:col-span-3 space-y-1.5">
                          <label className="text-xs font-mono font-bold text-zinc-700 uppercase">Title *</label>
                          <input
                            type="text"
                            required
                            value={editingService.title || ''}
                            onChange={(e) => setEditingService(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Virtual Modeling"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-brand-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase">Description</label>
                        <textarea
                          rows={3}
                          value={editingService.description || ''}
                          onChange={(e) => setEditingService(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of what this service offers..."
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-sm text-zinc-900 focus:outline-none focus:border-brand-500 resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase">
                          Included Deliverables (1 per line)
                        </label>
                        <textarea
                          rows={4}
                          value={includesInput}
                          onChange={(e) => setIncludesInput(e.target.value)}
                          placeholder="Instagram / Reels posts&#10;LinkedIn content&#10;Long-form blog feature"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-3 text-xs font-mono text-zinc-900 focus:outline-none focus:border-brand-500 resize-none"
                        />
                        <p className="text-[11px] text-zinc-500">Each non-empty line will become a bullet point checkmark in the service card.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 items-center border-t border-zinc-100 pt-3">
                        <div className="space-y-1">
                          <label className="text-xs font-mono font-bold text-zinc-700 uppercase">Sort Order</label>
                          <input
                            type="number"
                            value={editingService.sort_order || 1}
                            onChange={(e) => setEditingService(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs font-mono text-zinc-900"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-4">
                          <input
                            type="checkbox"
                            id="service-active-chk"
                            checked={editingService.is_active !== false}
                            onChange={(e) => setEditingService(prev => ({ ...prev, is_active: e.target.checked }))}
                            className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                          />
                          <label htmlFor="service-active-chk" className="text-xs font-semibold text-zinc-800 cursor-pointer">
                            Active (Visible on public site)
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-100">
                        <button
                          type="button"
                          onClick={() => setEditingService(null)}
                          className="rounded-full border border-zinc-200 px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingService}
                          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition"
                        >
                          {isSavingService ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          <span>Save Service</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONTACT MESSAGES INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-brand-950">Contact Submissions Inbox</h3>
                  <p className="text-xs text-brand-500">Read and process messages transmitted by users through the contact form.</p>
                </div>
                <button
                  onClick={loadMessages}
                  disabled={isLoadingMessages}
                  className="p-2 px-3 rounded-full border border-brand-200 text-brand-700 bg-white hover:text-brand-950 hover:bg-brand-50 transition flex items-center gap-1 text-xs shadow-sm font-semibold"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-3xl border border-brand-100 bg-white/70 p-5 relative group transition hover:border-brand-200 shadow-lg glass-card"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3 pb-3 border-b border-brand-100">
                      <div>
                        <h4 className="font-display font-bold text-brand-950 text-sm">{msg.name}</h4>
                        <a href={`mailto:${msg.email}`} className="text-xs font-mono text-brand-600 hover:text-brand-850 hover:underline">{msg.email}</a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-brand-500 font-bold">{formatDate(msg.created_at)}</span>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 rounded-full border border-brand-100 text-brand-400 hover:text-red-600 hover:bg-red-50 transition flex shrink-0"
                          title="Delete message"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-brand-900 leading-relaxed whitespace-pre-wrap font-semibold">{msg.message}</p>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="py-20 text-center rounded-[32px] border border-dashed border-brand-200 text-brand-500 bg-brand-50/10 font-bold">
                    Your transmission inbox is completely empty. No submissions yet!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
