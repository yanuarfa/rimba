import { defineConfig } from 'astro/config';

// Canonical domain for Rimba under Yanuar's own domain.
// Change this one line if the site ships under another domain:
// canonical URLs and sitemap.xml read from it.
export default defineConfig({
  site: 'https://rimba.ursavior.my.id',
  build: {
    // This is a single-page site, so inlining its one stylesheet removes a
    // render-blocking request without creating a duplicate download.
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // Never inline assets as data URIs. Vite inlines anything under 4 KB,
      // which turned one tiny font subset into a data: URL that the site's
      // own CSP (font-src 'self') then blocked in production.
      assetsInlineLimit: 0,
    },
  },
  image: {
    // The page photos live on Unsplash. Authorizing the host lets the
    // Image component download and optimize them at build time, so the
    // built site serves its own resized copies instead of hot-linking.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
});
