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

    const finalHtml = await processHtmlForRequest(rawHtml, req.url);
    res.status(200).set({ 'Content-Type': 'text/html' }).send(finalHtml);
  } catch (err) {
    console.error('Vercel serverless error:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default app;
