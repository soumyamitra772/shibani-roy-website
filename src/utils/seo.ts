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

const DEFAULT_BASE_URL = 'https://shibani-roy.vercel.app';

/**
 * Ensures an image URL is an absolute URL for social crawlers
 */
export function getAbsoluteImageUrl(imageUrl?: string, baseOrigin?: string): string {
  const origin = baseOrigin || DEFAULT_BASE_URL;
  if (!imageUrl) return `${origin}/images/shibani_hero_1784621056791.jpg`;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl.replace('https://shibani-roy-website.vercel.app', origin);
  }
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${origin}${cleanPath}`;
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
export function updateMetaTags({ title, description, image, url, type }: MetaTagOptions, baseOrigin?: string) {
  const origin = baseOrigin || (typeof window !== 'undefined' ? window.location.origin : DEFAULT_BASE_URL);
  const absoluteImage = getAbsoluteImageUrl(image, origin);

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

  setMetaTag('property', 'og:site_name', 'Shibani Roy');

  if (absoluteImage) {
    setMetaTag('property', 'og:image', absoluteImage);
    setMetaTag('property', 'og:image:secure_url', absoluteImage);
    setMetaTag('property', 'og:image:type', absoluteImage.endsWith('.png') ? 'image/png' : 'image/jpeg');
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('name', 'twitter:image', absoluteImage);
  }

  if (url) {
    const cleanUrl = url.replace('https://shibani-roy-website.vercel.app', origin);
    setMetaTag('property', 'og:url', cleanUrl);
    setMetaTag('name', 'twitter:url', cleanUrl);
  }

  if (type) {
    setMetaTag('property', 'og:type', type);
  }

  // Always set twitter:card to summary_large_image
  setMetaTag('name', 'twitter:card', 'summary_large_image');
}

/**
 * Server-side string injection of Meta / Open Graph tags into index.html
 */
export function injectMetaTags(html: string, options: MetaTagOptions, baseOrigin?: string): string {
  const origin = baseOrigin || DEFAULT_BASE_URL;
  const absoluteImage = getAbsoluteImageUrl(options.image, origin);
  let updatedHtml = html;

  const replaceOrInsertMeta = (attrName: 'name' | 'property', attrVal: string, contentVal: string) => {
    const escapedContent = contentVal
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const searchRegex = new RegExp(`<meta\\s+${attrName}=["']${attrVal}["'][^>]*\\/?>`, 'i');
    if (searchRegex.test(updatedHtml)) {
      updatedHtml = updatedHtml.replace(searchRegex, `<meta ${attrName}="${attrVal}" content="${escapedContent}" />`);
    } else {
      updatedHtml = updatedHtml.replace('</head>', `  <meta ${attrName}="${attrVal}" content="${escapedContent}" />\n</head>`);
    }
  };

  replaceOrInsertMeta('property', 'og:site_name', 'Shibani Roy');

  if (options.title) {
    const escapedTitle = options.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    updatedHtml = updatedHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapedTitle}</title>`);
    replaceOrInsertMeta('property', 'og:title', options.title);
    replaceOrInsertMeta('name', 'twitter:title', options.title);
  }

  if (options.description) {
    replaceOrInsertMeta('name', 'description', options.description);
    replaceOrInsertMeta('property', 'og:description', options.description);
    replaceOrInsertMeta('name', 'twitter:description', options.description);
  }

  if (absoluteImage) {
    replaceOrInsertMeta('property', 'og:image', absoluteImage);
    replaceOrInsertMeta('property', 'og:image:secure_url', absoluteImage);
    replaceOrInsertMeta('property', 'og:image:type', absoluteImage.endsWith('.png') ? 'image/png' : 'image/jpeg');
    replaceOrInsertMeta('property', 'og:image:width', '1200');
    replaceOrInsertMeta('property', 'og:image:height', '630');
    replaceOrInsertMeta('name', 'twitter:image', absoluteImage);
  }

  if (options.url) {
    const cleanUrl = options.url.replace('https://shibani-roy-website.vercel.app', origin);
    replaceOrInsertMeta('property', 'og:url', cleanUrl);
    replaceOrInsertMeta('name', 'twitter:url', cleanUrl);
  }

  if (options.type) {
    replaceOrInsertMeta('property', 'og:type', options.type);
  }

  replaceOrInsertMeta('name', 'twitter:card', 'summary_large_image');

  return updatedHtml;
}
