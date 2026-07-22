import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import { processHtmlForRequest } from '../src/server-seo';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const ext = path.extname(req.url || '').toLowerCase();
    const staticExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.css', '.js', '.woff', '.woff2', '.json', '.webp'];
    if (staticExts.includes(ext)) {
      return res.status(404).send('Not found');
    }

    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    const fallbackPath = path.join(process.cwd(), 'index.html');
    const rawHtml = fs.existsSync(indexPath)
      ? fs.readFileSync(indexPath, 'utf-8')
      : fs.readFileSync(fallbackPath, 'utf-8');

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
