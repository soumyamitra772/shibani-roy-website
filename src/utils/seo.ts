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

/**
 * Server-side string injection of Meta / Open Graph tags into index.html
 */
export function injectMetaTags(html: string, options: MetaTagOptions): string {
  const absoluteImage = getAbsoluteImageUrl(options.image);
  let updatedHtml = html;

  const replaceOrInsertMeta = (attrName: 'name' | 'property', attrVal: string, contentVal: string) => {
    const escapedContent = contentVal
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const regex = new RegExp(`<meta\\s+${attrName}=["']${attrVal}["']\\s+content=["'][^"']*["']\\s*\\/?>`, 'gi');
    if (regex.test(updatedHtml)) {
      updatedHtml = updatedHtml.replace(regex, `<meta ${attrName}="${attrVal}" content="${escapedContent}" />`);
    } else {
      updatedHtml = updatedHtml.replace('</head>', `  <meta ${attrName}="${attrVal}" content="${escapedContent}" />\n</head>`);
    }
  };

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
    replaceOrInsertMeta('name', 'twitter:image', absoluteImage);
  }

  if (options.url) {
    replaceOrInsertMeta('property', 'og:url', options.url);
    replaceOrInsertMeta('name', 'twitter:url', options.url);
  }

  if (options.type) {
    replaceOrInsertMeta('property', 'og:type', options.type);
  }

  replaceOrInsertMeta('name', 'twitter:card', 'summary_large_image');

  return updatedHtml;
}
