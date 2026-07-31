import React, { useState, useEffect } from 'react';
import {
  Upload, Image as ImageIcon, Save, Check, Loader, Trash2,
  ExternalLink, Sparkles, RefreshCw, AlertCircle, Info, Shield
} from 'lucide-react';
import {
  getCompanionContent,
  updateCompanionContent,
  getCompanionShowcaseImages,
  uploadCompanionShowcaseImage,
  removeCompanionShowcaseImage,
  CompanionPageContent,
  DEFAULT_COMPANION_CONTENT
} from '../services/companionService';
import { isSupabaseConfigured } from '../services/db';

export default function CompanionAdminView() {
  const [content, setContent] = useState<CompanionPageContent>(DEFAULT_COMPANION_CONTENT);
  const [images, setImages] = useState<{ image1: string | null; image2: string | null }>({
    image1: null,
    image2: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [uploadingSlot1, setUploadingSlot1] = useState(false);
  const [uploadingSlot2, setUploadingSlot2] = useState(false);

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cData, imgData] = await Promise.all([
        getCompanionContent(),
        getCompanionShowcaseImages(),
      ]);
      if (cData) setContent(cData);
      if (imgData) setImages(imgData);
    } catch (err) {
      console.error('Failed to load companion admin data:', err);
      showToast('Error loading companion page data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Text Content
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    setSaveSuccess(false);

    try {
      await updateCompanionContent(content);
      setSaveSuccess(true);
      showToast('Companion page content saved successfully!');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving companion content:', err);
      showToast('Failed to save companion page content', 'error');
    } finally {
      setIsSavingContent(false);
    }
  };

  // Upload Showcase Image
  const handleFileUpload = async (slotKey: 'showcase-image-1' | 'showcase-image-2', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/i)) {
      showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    if (slotKey === 'showcase-image-1') setUploadingSlot1(true);
    else setUploadingSlot2(true);

    try {
      const uploadedUrl = await uploadCompanionShowcaseImage(slotKey, file);
      if (slotKey === 'showcase-image-1') {
        setImages((prev) => ({ ...prev, image1: uploadedUrl }));
      } else {
        setImages((prev) => ({ ...prev, image2: uploadedUrl }));
      }
      showToast(`Showcase Image ${slotKey === 'showcase-image-1' ? '1' : '2'} updated!`);
    } catch (err) {
      console.error('Failed to upload image:', err);
      showToast('Error uploading image to storage', 'error');
    } finally {
      if (slotKey === 'showcase-image-1') setUploadingSlot1(false);
      else setUploadingSlot2(false);
      e.target.value = '';
    }
  };

  // Remove Image
  const handleRemoveImage = async (slotKey: 'showcase-image-1' | 'showcase-image-2') => {
    if (!confirm(`Are you sure you want to remove Showcase Image ${slotKey === 'showcase-image-1' ? '1' : '2'}?`)) return;

    try {
      await removeCompanionShowcaseImage(slotKey);
      if (slotKey === 'showcase-image-1') {
        setImages((prev) => ({ ...prev, image1: null }));
      } else {
        setImages((prev) => ({ ...prev, image2: null }));
      }
      showToast('Image removed successfully');
    } catch (err) {
      console.error('Failed to remove image:', err);
      showToast('Failed to remove image', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Loader className="w-8 h-8 animate-spin text-[#e8a598] mb-3" />
        <p className="text-sm font-mono uppercase tracking-wider">Loading Companion Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-medium text-sm flex items-center space-x-2 border transition-all animate-bounce ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950 text-rose-200 border-rose-500/40'
          }`}
        >
          {toastMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-zinc-900 border border-purple-500/30 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-900/50 text-[#e8a598] text-xs font-mono font-bold uppercase mb-2 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Companion Admin</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold">Companion App Management</h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Update landing page content, hero taglines, app link, and showcase images stored in Supabase.
          </p>
        </div>

        <a
          href="/companion"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold flex items-center space-x-2 transition border border-white/10 shrink-0"
        >
          <span>View /companion</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* A. IMAGE UPLOAD PANEL */}
      <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#e8a598]" />
              A. Showcase Image Upload Panel
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Images are stored in Supabase Storage bucket <code className="text-[#a78bfa] font-mono">companion-page-images</code> with keys <code className="text-[#a78bfa] font-mono">showcase-image-1</code> and <code className="text-[#a78bfa] font-mono">showcase-image-2</code>.
            </p>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition"
            title="Refresh images"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SLOT 1 */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#e8a598] uppercase">Showcase Image 1</span>
              {images.image1 && (
                <button
                  onClick={() => handleRemoveImage('showcase-image-1')}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center relative">
              {images.image1 ? (
                <img src={images.image1} alt="Showcase 1" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-zinc-600">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-mono">No image uploaded</p>
                </div>
              )}

              {uploadingSlot1 && (
                <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center text-[#e8a598]">
                  <Loader className="w-8 h-8 animate-spin" />
                </div>
              )}
            </div>

            <label className="block">
              <span className="sr-only">Choose Showcase Image 1</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileUpload('showcase-image-1', e)}
                disabled={uploadingSlot1}
                className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-900/50 file:text-purple-200 hover:file:bg-purple-800/60 file:cursor-pointer cursor-pointer border border-zinc-800 rounded-xl bg-zinc-900/50"
              />
            </label>
          </div>

          {/* SLOT 2 */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#e8a598] uppercase">Showcase Image 2</span>
              {images.image2 && (
                <button
                  onClick={() => handleRemoveImage('showcase-image-2')}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center relative">
              {images.image2 ? (
                <img src={images.image2} alt="Showcase 2" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-zinc-600">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-mono">No image uploaded</p>
                </div>
              )}

              {uploadingSlot2 && (
                <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center text-[#e8a598]">
                  <Loader className="w-8 h-8 animate-spin" />
                </div>
              )}
            </div>

            <label className="block">
              <span className="sr-only">Choose Showcase Image 2</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileUpload('showcase-image-2', e)}
                disabled={uploadingSlot2}
                className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-900/50 file:text-purple-200 hover:file:bg-purple-800/60 file:cursor-pointer cursor-pointer border border-zinc-800 rounded-xl bg-zinc-900/50"
              />
            </label>
          </div>

        </div>
      </div>

      {/* B. CONTENT EDIT PANEL */}
      <form onSubmit={handleSaveContent} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6 shadow-lg">
        <div className="border-b border-zinc-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#a78bfa]" />
            B. Content Edit Panel
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Stores text values in Supabase table <code className="text-[#a78bfa] font-mono">companion_page_content</code> (with keys <code className="text-[#a78bfa] font-mono">hero_tagline</code>, <code className="text-[#a78bfa] font-mono">what_is_description</code>, <code className="text-[#a78bfa] font-mono">app_url</code>).
          </p>
        </div>

        {/* Hero Tagline */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-zinc-300 uppercase">
            Hero Tagline / Subtitle
          </label>
          <input
            type="text"
            value={content.hero_tagline}
            onChange={(e) => setContent({ ...content, hero_tagline: e.target.value })}
            placeholder="Your AI companion. Always here. Always her."
            className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white font-medium text-sm focus:outline-none focus:border-[#e8a598] transition"
          />
        </div>

        {/* What is Shibani Description */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-zinc-300 uppercase">
            "What is Shibani Roy AI?" Description
          </label>
          <textarea
            rows={4}
            value={content.what_is_description}
            onChange={(e) => setContent({ ...content, what_is_description: e.target.value })}
            placeholder="Shibani Roy AI is not just a chatbot. She remembers you..."
            className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white font-medium text-sm focus:outline-none focus:border-[#e8a598] transition leading-relaxed"
          />
        </div>

        {/* App URL */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-zinc-300 uppercase">
            App Destination URL
          </label>
          <input
            type="url"
            value={content.app_url}
            onChange={(e) => setContent({ ...content, app_url: e.target.value })}
            placeholder="https://shibani-roy-ai.onrender.com"
            className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-[#e8a598] transition"
          />
          <p className="text-[11px] text-zinc-500">
            This URL is linked across all CTAs ("Try the App", "Start Free", "Go Pro", "Open Shibani Roy AI").
          </p>
        </div>

        {/* App Link Visibility Toggle */}
        <div className="space-y-3 p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase">
                App Link Visibility
              </label>
              <p className="text-xs text-zinc-400 mt-0.5 font-light">
                {content.link_visible
                  ? 'ON — link is shown publicly'
                  : 'OFF — link is hidden (shows "Coming Soon" instead)'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setContent({ ...content, link_visible: !content.link_visible })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                content.link_visible ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
              role="switch"
              aria-checked={content.link_visible}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  content.link_visible ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {!content.link_visible && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Link is currently hidden. All CTA buttons on the /companion page will show 'Coming Soon' instead of linking to the app.
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-between border-t border-zinc-800">
          <div className="text-xs text-zinc-500 font-mono">
            {isSupabaseConfigured ? '🟢 Connected to Supabase DB' : '🟡 Using Local Storage Sandbox'}
          </div>

          <button
            type="submit"
            disabled={isSavingContent}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#e8a598] to-[#a78bfa] text-zinc-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition flex items-center space-x-2 disabled:opacity-50"
          >
            {isSavingContent ? (
              <Loader className="w-4 h-4 animate-spin text-zinc-950" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-zinc-950" />
            ) : (
              <Save className="w-4 h-4 text-zinc-950" />
            )}
            <span>{isSavingContent ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Companion Content'}</span>
          </button>
        </div>
      </form>

    </div>
  );
}
