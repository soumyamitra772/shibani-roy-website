import { isSupabaseConfigured, supabase } from './db';

export interface CompanionPageContent {
  hero_tagline: string;
  what_is_description: string;
  app_url: string;
  link_visible: boolean;
}

export const DEFAULT_COMPANION_CONTENT: CompanionPageContent = {
  hero_tagline: 'Your AI companion. Always here. Always her.',
  what_is_description: 'Shibani Roy AI is not just a chatbot. She remembers you, talks to you, and feels present — whether you need someone to talk to, want to hear her voice, or just want to share your day.',
  app_url: 'https://shibani-roy-ai.onrender.com',
  link_visible: false,
};

const BUCKET_NAME = 'companion-page-images';
const LOCAL_CONTENT_KEY = 'shibani_companion_content';
const LOCAL_IMAGE_1_KEY = 'shibani_companion_showcase_1';
const LOCAL_IMAGE_2_KEY = 'shibani_companion_showcase_2';

/**
 * Fetch companion page text content
 */
export async function getCompanionContent(): Promise<CompanionPageContent> {
  let content = { ...DEFAULT_COMPANION_CONTENT };

  // Try local storage first as quick cache
  try {
    const cached = localStorage.getItem(LOCAL_CONTENT_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      content = { ...content, ...parsed };
      if (typeof parsed.link_visible === 'string') {
        content.link_visible = parsed.link_visible === 'true';
      }
    }
  } catch (err) {
    console.warn('Failed reading local companion content cache:', err);
  }

  // Try Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('companion_page_content')
        .select('key, value');

      if (!error && data && data.length > 0) {
        const remoteContent: Record<string, string> = {};
        data.forEach((row: { key: string; value: string }) => {
          if (row.key && row.value !== undefined) {
            remoteContent[row.key] = row.value;
          }
        });

        content = {
          hero_tagline: remoteContent.hero_tagline || content.hero_tagline,
          what_is_description: remoteContent.what_is_description || content.what_is_description,
          app_url: remoteContent.app_url || content.app_url,
          link_visible: remoteContent.link_visible !== undefined
            ? remoteContent.link_visible === 'true'
            : content.link_visible,
        };

        // Sync to local storage
        localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(content));
      }
    } catch (err) {
      console.warn('Supabase companion content fetch error:', err);
    }
  }

  return content;
}

/**
 * Save companion page text content
 */
export async function updateCompanionContent(updates: CompanionPageContent): Promise<CompanionPageContent> {
  // Always update local storage
  localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(updates));

  // Update Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const rows = [
        { key: 'hero_tagline', value: updates.hero_tagline },
        { key: 'what_is_description', value: updates.what_is_description },
        { key: 'app_url', value: updates.app_url },
        { key: 'link_visible', value: String(updates.link_visible) },
      ];

      await supabase
        .from('companion_page_content')
        .upsert(rows, { onConflict: 'key' });
    } catch (err) {
      console.warn('Supabase companion content update error:', err);
    }
  }

  return updates;
}

/**
 * Get showcase image URLs
 */
export async function getCompanionShowcaseImages(): Promise<{ image1: string | null; image2: string | null }> {
  let image1: string | null = null;
  let image2: string | null = null;

  // Check local storage
  try {
    image1 = localStorage.getItem(LOCAL_IMAGE_1_KEY);
    image2 = localStorage.getItem(LOCAL_IMAGE_2_KEY);
  } catch (err) {
    console.warn('Failed reading local image cache:', err);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // Check Supabase Storage public URLs
      const publicUrl1 = supabase.storage.from(BUCKET_NAME).getPublicUrl('showcase-image-1').data?.publicUrl;
      const publicUrl2 = supabase.storage.from(BUCKET_NAME).getPublicUrl('showcase-image-2').data?.publicUrl;

      // Verify if file exists on Supabase storage by doing a quick fetch or head
      if (publicUrl1) {
        try {
          const res1 = await fetch(publicUrl1, { method: 'HEAD' });
          if (res1.ok) {
            image1 = `${publicUrl1}?t=${Date.now()}`;
          }
        } catch {
          // If HEAD fails, keep existing local image or fallback
        }
      }

      if (publicUrl2) {
        try {
          const res2 = await fetch(publicUrl2, { method: 'HEAD' });
          if (res2.ok) {
            image2 = `${publicUrl2}?t=${Date.now()}`;
          }
        } catch {
          // If HEAD fails, keep existing local image or fallback
        }
      }
    } catch (err) {
      console.warn('Supabase companion storage get error:', err);
    }
  }

  return { image1, image2 };
}

/**
 * Upload showcase image to Supabase storage bucket `companion-page-images` and fallback to local storage
 */
export async function uploadCompanionShowcaseImage(
  slotKey: 'showcase-image-1' | 'showcase-image-2',
  file: File
): Promise<string> {
  // Read as base64/DataURL for instant local fallback
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const localKey = slotKey === 'showcase-image-1' ? LOCAL_IMAGE_1_KEY : LOCAL_IMAGE_2_KEY;
  localStorage.setItem(localKey, dataUrl);

  let finalUrl = dataUrl;

  if (isSupabaseConfigured && supabase) {
    try {
      // Ensure bucket exists or attempt upload
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(slotKey, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600',
        });

      if (!error && data) {
        const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(slotKey).data?.publicUrl;
        if (publicUrl) {
          finalUrl = `${publicUrl}?t=${Date.now()}`;
        }
      } else {
        console.warn('Supabase storage upload returned error, using local fallback:', error);
      }
    } catch (err) {
      console.warn('Supabase storage exception, using local fallback:', err);
    }
  }

  return finalUrl;
}

/**
 * Remove/clear showcase image
 */
export async function removeCompanionShowcaseImage(
  slotKey: 'showcase-image-1' | 'showcase-image-2'
): Promise<void> {
  const localKey = slotKey === 'showcase-image-1' ? LOCAL_IMAGE_1_KEY : LOCAL_IMAGE_2_KEY;
  localStorage.removeItem(localKey);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.storage.from(BUCKET_NAME).remove([slotKey]);
    } catch (err) {
      console.warn('Supabase storage remove error:', err);
    }
  }
}
