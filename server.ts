import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { processHtmlForRequest } from "./src/server-seo";
import {
  getServerSiteContent,
  updateServerSiteContent,
  getServerBlogPosts,
  saveServerBlogPost,
  deleteServerBlogPost,
  getServerContactMessages,
  saveServerContactMessage,
  deleteServerContactMessage
} from "./src/services/store";

export async function createApp() {
  const app = express();

  const requireAdminKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['x-admin-key'] || req.query.adminKey;
    const validKey = process.env.ADMIN_SECRET_KEY;
    
    if (!validKey || apiKey !== validKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));

  app.use((_req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.anthropic.com;"
    );
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const baseUrl = "https://shibaniroy.com";
      const posts = getServerBlogPosts();
      
      const staticPages: Array<{ url: string; priority: string; changefreq: string; lastmod?: string }> = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/about", priority: "0.8", changefreq: "monthly" },
        { url: "/services", priority: "0.8", changefreq: "monthly" },
        { url: "/blog", priority: "0.9", changefreq: "daily" },
        { url: "/contact", priority: "0.7", changefreq: "monthly" },
        { url: "/privacy", priority: "0.3", changefreq: "yearly" },
      ];

      const blogUrls = posts.map((post) => ({
        url: `/blog/${post.slug || post.id}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: (post as any).updated_at || post.created_at,
      }));

      const allUrls = [...staticPages, ...blogUrls];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split("T")[0]}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

      res.set("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (err: any) {
      res.status(500).send("Error generating sitemap");
    }
  });

  // --- SITE CONTENT API ---
  app.get("/api/site-content", (_req, res) => {
    try {
      const content = getServerSiteContent();
      res.json(content);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/site-content", requireAdminKey, (req, res) => {
    try {
      const updated = updateServerSiteContent(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- BLOG POSTS API ---
  app.get("/api/blog-posts", (_req, res) => {
    try {
      const posts = getServerBlogPosts();
      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog-posts", requireAdminKey, (req, res) => {
    try {
      const saved = saveServerBlogPost(req.body);
      res.json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/blog-posts/:id", requireAdminKey, (req, res) => {
    try {
      const saved = saveServerBlogPost({ ...req.body, id: req.params.id });
      res.json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/blog-posts/:id", requireAdminKey, (req, res) => {
    try {
      deleteServerBlogPost(req.params.id as string);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- CONTACT MESSAGES API ---
  app.get("/api/contact-messages", (_req, res) => {
    try {
      const msgs = getServerContactMessages();
      res.json(msgs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/contact-messages", (req, res) => {
    try {
      const saved = saveServerContactMessage(req.body);
      res.json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/contact-messages/:id", requireAdminKey, (req, res) => {
    try {
      deleteServerContactMessage(req.params.id as string);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(async (req, res, next) => {
      const acceptHeader = req.headers.accept || "";
      const isHtmlReq = req.method === "GET" && (acceptHeader.includes("text/html") || !req.url.includes("."));

      if (isHtmlReq && !req.url.startsWith("/api") && !req.url.startsWith("/@") && !req.url.startsWith("/src")) {
        try {
          const indexHtmlPath = path.resolve(process.cwd(), "index.html");
          if (fs.existsSync(indexHtmlPath)) {
            let rawHtml = fs.readFileSync(indexHtmlPath, "utf-8");
            rawHtml = await vite.transformIndexHtml(req.url, rawHtml);
            const finalHtml = await processHtmlForRequest(rawHtml, req.url);
            return res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
          }
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          return next(e);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath, { index: false }));

    app.get("*", async (req, res) => {
      try {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          const rawHtml = fs.readFileSync(indexPath, "utf-8");
          const finalHtml = await processHtmlForRequest(rawHtml, req.url);
          return res.status(200).set({ "Content-Type": "text/html" }).send(finalHtml);
        }
        res.status(404).send("Page not found");
      } catch (err) {
        console.error("Error processing index.html:", err);
        res.status(500).send("Internal Server Error");
      }
    });
  }

  return app;
}

async function startServer() {
  const app = await createApp();
  const PORT = 3000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
