export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  feature_image_url: string;
  status: 'draft' | 'published';
  created_at: string;
}

export interface SiteContent {
  id?: string;
  hero_title: string;
  hero_tagline: string;
  hero_intro: string;
  hero_image_url: string;
  about_image_url?: string;
  avatar_image_url?: string;
  about_text: string;
  companion_url: string;
  profile_name?: string;
  profile_origin?: string;
  profile_core_type?: string;
  profile_role?: string;
  profile_capabilities?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}
