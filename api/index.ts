import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import path, { join } from 'path';
import { processHtmlForRequest } from './server-seo';

function getRawHtml(): string {
  const cwd = process.cwd();
  const candidates = [
    join(cwd, 'dist', 'index.html'),
    join(cwd, 'index.html'),
    join(cwd, 'public', 'index.html'),
  ];
  for (const p of candidates) {
    try {
      return readFileSync(p, 'utf-8');
    } catch {
      continue;
    }
  }
  // Fallback HTML template
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Shibani Roy | India's First Virtual AI Influencer</title>
<meta property="og:title" content="Shibani Roy | India's First Virtual AI Influencer" />
<meta property="og:description" content="India's first virtual AI influencer — bold, warm, and emotionally adaptive." />
<meta property="og:image" content="https://shibani-roy.vercel.app/images/shibani_hero_1784621056791.jpg" />
<meta name="twitter:card" content="summary_large_image" />
</head>
<body><div id="root"></div></body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const requestUrl = req.url || '/';
    const ext = path.extname(requestUrl).toLowerCase();
    const staticExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.css', '.js', '.woff', '.woff2', '.json', '.webp'];
    if (staticExts.includes(ext)) {
      return res.status(404).send('Not found');
    }

    const rawHtml = getRawHtml();

    const host = (req.headers['x-forwarded-host'] || req.headers.host || '') as string;
    const proto = (req.headers['x-forwarded-proto'] || 'https') as string;
    const baseOrigin = host ? `${proto}://${host}` : 'https://shibani-roy.vercel.app';

    const finalHtml = await processHtmlForRequest(rawHtml, requestUrl, baseOrigin);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.status(200).send(finalHtml);
  } catch (err: any) {
    console.error('OG handler error:', err);
    res.status(500).send(`Internal Server Error: ${err?.message || err}`);
  }
}
