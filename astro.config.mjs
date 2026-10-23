// @ts-check
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

const { SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  // Canonical URL used in meta tags, Open Graph and the sitemap
  site: SITE_URL || 'https://balicare.pro',
  output: 'static', // pages are prerendered; only /api/* runs on the server
  adapter: node({ mode: 'standalone' }),
  integrations: [
    sitemap({ filter: (page) => !page.includes('/thank-you') && !page.includes('/api/') }),
  ],
  // English first. Add 'id' here (plus src/i18n/id.ts) to launch Indonesian later.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    routing: { prefixDefaultLocale: false },
  },
  env: {
    schema: {
      SITE_URL: envField.string({ context: 'client', access: 'public', default: 'https://balicare.pro' }),
      WHATSAPP_NUMBER: envField.string({ context: 'client', access: 'public', default: '62818469579' }),
      INSTAGRAM_URL: envField.string({ context: 'client', access: 'public', default: 'https://www.instagram.com/balipropertycare_/' }),
      CONTACT_EMAIL: envField.string({ context: 'client', access: 'public', default: 'contact@balicare.pro' }),
      GA4_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      META_PIXEL_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      SHOW_CLIENT_LOGIN: envField.boolean({ context: 'client', access: 'public', default: false }),
      // Where leads are stored on the server (JSON + CSV)
      LEADS_DIR: envField.string({ context: 'server', access: 'public', default: './data' }),
    },
  },
  // Smaller photos for fast mobile loads (target: under 3 s on mobile data)
  image: {
    service: { entrypoint: 'astro/assets/services/sharp', config: { webp: { quality: 70, effort: 5 } } },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
