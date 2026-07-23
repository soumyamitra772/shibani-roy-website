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

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
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

  app.post("/api/site-content", (req, res) => {
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

  app.post("/api/blog-posts", (req, res) => {
    try {
      const saved = saveServerBlogPost(req.body);
      res.json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/blog-posts/:id", (req, res) => {
    try {
      const saved = saveServerBlogPost({ ...req.body, id: req.params.id });
      res.json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/blog-posts/:id", (req, res) => {
    try {
      deleteServerBlogPost(req.params.id);
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

  app.delete("/api/contact-messages/:id", (req, res) => {
    try {
      deleteServerContactMessage(req.params.id);
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
