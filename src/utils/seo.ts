export interface MetaTagOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Strips basic markdown syntax to create plain text excerpts for SEO descriptions
 */
export function stripMarkdown(content: string): string {
  if (!content) return '';
  return content
    .replace(/#+\s+/g, '')                  // Headers
    .replace(/[*_~`>]/g, '')                // Bold, italic, strikethrough, code, blockquotes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links [text](url) -> text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')  // Images ![alt](url) -> ''
    .replace(/\n+/g, ' ')                  // Line breaks to space
    .trim();
}

/**
 * Ensures an image URL is an absolute URL for social crawlers
 */
export function getAbsoluteImageUrl(imageUrl?: string): string {
  if (!imageUrl) return 'https://shibani-roy-website.vercel.app/images/shibani_hero_1784621056791.jpg';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `https://shibani-roy-website.vercel.app${cleanPath}`;
}

/**
 * Helper to update or create meta tags dynamically without duplicating
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Reusable helper function to update page SEO & social preview meta tags
 */
export function updateMetaTags({ title, description, image, url, type }: MetaTagOptions) {
  const absoluteImage = getAbsoluteImageUrl(image);

  if (title) {
    document.title = title;
    setMetaTag('property', 'og:title', title);
    setMetaTag('name', 'twitter:title', title);
  }

  if (description) {
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:description', description);
    setMetaTag('name', 'twitter:description', description);
  }

  if (absoluteImage) {
    setMetaTag('property', 'og:image', absoluteImage);
    setMetaTag('name', 'twitter:image', absoluteImage);
  }

  if (url) {
    setMetaTag('property', 'og:url', url);
    setMetaTag('name', 'twitter:url', url);
  }

  if (type) {
    setMetaTag('property', 'og:type', type);
  }

  // Always set twitter:card to summary_large_image
  setMetaTag('name', 'twitter:card', 'summary_large_image');
}
