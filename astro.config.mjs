import { defineConfig } from 'astro/config';

// Canonical domain for Rimba under Yanuar's own domain.
// Change this one line if the site ships under another domain:
// canonical URLs and sitemap.xml read from it.
export default defineConfig({
  site: 'https://rimba.ursavior.my.id',
  image: {
    // The page photos live on Unsplash. Authorizing the host lets the
    // Image component download and optimize them at build time, so the
    // built site serves its own resized copies instead of hot-linking.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
});
