import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { processHtmlForRequest } from "./src/server-seo";

export async function createApp() {
  const app = express();

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(async (req, res, next) => {
      const acceptHeader = req.headers.accept || "";
      const isHtmlReq = req.method === "GET" && (acceptHeader.includes("text/html") || !req.url.includes("."));

      if (isHtmlReq && !req.url.startsWith("/@") && !req.url.startsWith("/src")) {
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
