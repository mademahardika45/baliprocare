// Business details live here (values come from .env, with safe defaults).
// Pages read from this file instead of hard-coding contact details.
import {
  SITE_URL,
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  CONTACT_EMAIL,
  GA4_ID,
  META_PIXEL_ID,
  SHOW_CLIENT_LOGIN,
} from 'astro:env/client';

export const site = {
  name: 'Bali Property Care',
  tagline: 'Your property in good hands.',
  url: SITE_URL,
  whatsappNumber: WHATSAPP_NUMBER, // international format, no "+"
  whatsappDisplay: '+62 818 469 579',
  instagramUrl: INSTAGRAM_URL,
  instagramHandle: '@balipropertycare_',
  email: CONTACT_EMAIL,
  hours: '7am – 10pm',
  timezone: 'Bali time (WITA)',
  areas: ['Uluwatu', 'Canggu'],
  ga4Id: GA4_ID ?? null,
  metaPixelId: META_PIXEL_ID ?? null,
  showClientLogin: SHOW_CLIENT_LOGIN,
  usdRate: 17900, // from the price list (Assumptions sheet); update before launch
};

export const defaultWaMessage =
  "Hi Bali Property Care, I'd like to ask about your property care services.";

export function waLink(message = defaultWaMessage) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function rp(n: number) {
  return 'Rp ' + n.toLocaleString('en-US');
}

export function usd(n: number) {
  return '≈ US$' + Math.round(n / site.usdRate).toLocaleString('en-US');
}
