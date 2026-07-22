import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import path, { join } from 'path';
import { processHtmlForRequest } from '../src/server-seo';

// Try multiple possible locations for index.html
function getRawHtml(): string {
  const candidates = [
    join(process.cwd(), 'dist', 'index.html'),
    join(process.cwd(), 'index.html'),
    join(__dirname, '..', 'dist', 'index.html'),
    join(__dirname, '..', 'index.html'),
  ];
  for (const p of candidates) {
    try {
      return readFileSync(p, 'utf-8');
    } catch {
      continue;
    }
  }
  // Last resort — return hardcoded minimal HTML with OG tags
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta property="og:title" content="Shibani Roy | India's First Virtual AI Influencer" />
<meta property="og:description" content="India's first virtual AI influencer — bold, warm, and emotionally adaptive." />
<meta property="og:image" content="https://shibani-roy.vercel.app/images/shibani_hero_1784621056791.jpg" />
<meta name="twitter:card" content="summary_large_image" />
</head>
<body><script>window.location.href='/'</script></body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const ext = path.extname(req.url || '').toLowerCase();
    const staticExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.css', '.js', '.woff', '.woff2', '.json', '.webp'];
    if (staticExts.includes(ext)) {
      return res.status(404).send('Not found');
    }

    const rawHtml = getRawHtml();

    const host = (req.headers['x-forwarded-host'] || req.headers.host || '') as string;
    const proto = (req.headers['x-forwarded-proto'] || 'https') as string;
    const baseOrigin = host ? `${proto}://${host}` : 'https://shibani-roy.vercel.app';

    const finalHtml = await processHtmlForRequest(rawHtml, req.url || '/', baseOrigin);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.status(200).send(finalHtml);
  } catch (err) {
    console.error('OG handler error:', err);
    res.status(500).send('Internal Server Error');
  }
}
