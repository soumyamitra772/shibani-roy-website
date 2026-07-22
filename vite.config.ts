import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { processHtmlForRequest } from './src/server-seo';

function seoMetaPlugin(): Plugin {
  return {
    name: 'seo-meta-plugin',
    async transformIndexHtml(html, ctx) {
      const url = ctx.originalUrl || '/';
      return await processHtmlForRequest(html, url);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), seoMetaPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
