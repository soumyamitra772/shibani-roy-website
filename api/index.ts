import express from 'express';
import fs from 'fs';
import path from 'path';
import { processHtmlForRequest } from '../src/server-seo';

const app = express();

const distPath = path.join(process.cwd(), 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { index: false }));
}

app.get('*', async (req, res) => {
  try {
    // 1. Intercept asset requests to ensure images/CSS/JS are never served as HTML
    const ext = path.extname(req.path).toLowerCase();
    const staticExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.css', '.js', '.woff', '.woff2', '.json', '.webp'];
    if (staticExtensions.includes(ext) || req.path.startsWith('/images/') || req.path.startsWith('/assets/')) {
      const distFilePath = path.join(process.cwd(), 'dist', req.path);
      const publicFilePath = path.join(process.cwd(), 'public', req.path);

      if (fs.existsSync(distFilePath)) {
        return res.sendFile(distFilePath);
      }
      if (fs.existsSync(publicFilePath)) {
        return res.sendFile(publicFilePath);
      }
      return res.status(404).send('Asset Not Found');
    }

    let rawHtml = '';
    const indexPath = path.join(distPath, 'index.html');
    const rootIndexPath = path.join(process.cwd(), 'index.html');

    if (fs.existsSync(indexPath)) {
      rawHtml = fs.readFileSync(indexPath, 'utf-8');
    } else if (fs.existsSync(rootIndexPath)) {
      rawHtml = fs.readFileSync(rootIndexPath, 'utf-8');
    }

    if (!rawHtml) {
      return res.status(404).send('Not Found');
    }

    const host = (req.headers['x-forwarded-host'] || req.headers.host || '') as string;
    const proto = (req.headers['x-forwarded-proto'] || 'https') as string;
    const baseOrigin = host ? `${proto}://${host}` : 'https://shibani-roy.vercel.app';

    const finalHtml = await processHtmlForRequest(rawHtml, req.url, baseOrigin);
    res.status(200).set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate'
    }).send(finalHtml);
  } catch (err) {
    console.error('Vercel serverless error:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default app;
