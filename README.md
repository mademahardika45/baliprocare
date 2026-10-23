# Bali Property Care — website (Phase 1)

Marketing and lead-generation site for https://balicare.pro. Built with Astro 7 + Tailwind CSS 4.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build into dist/
node dist/server/entry.mjs   # run the production build (serves pages + form API)
```

If `npm install` fails with `EACCES` on `~/.npm`, either fix the cache once with
`sudo chown -R $(id -u):$(id -g) ~/.npm` or install with `npm install --cache /tmp/npm-cache`.

## Settings

Copy `.env.example` to `.env`. Contact details are config values, not hard-coded:
`WHATSAPP_NUMBER`, `SITE_URL`, `INSTAGRAM_URL`, `CONTACT_EMAIL` (empty until the business email exists),
`GA4_ID` and `META_PIXEL_ID` (tracking and the cookie notice only switch on when these are set).

## Where things live

| What | Where |
| --- | --- |
| Services, packages, prices, one-off jobs, FAQ, areas | `src/content/*.json` (edit here; a CMS can use these files later) |
| Photos | `src/assets/photos/` — replace a file with a real photo **using the same name** |
| Alt text for photos | `src/lib/photos.ts` |
| Colours, fonts, buttons, glass styles | `src/styles/global.css` |
| Navigation, button and footer text | `src/i18n/en.ts` |
| Quote form options | `src/lib/quote-options.ts` |

## Leads (quote and contact forms)

Submissions are saved in `data/` (ignored by git — it holds personal data):

- `data/leads.csv` / `data/leads.json` — one column per answer, plus a `status` column
  (New, Contacted, Survey booked, Quote sent, Won, Lost)
- `data/messages.csv` — contact form messages
- `data/uploads/<lead id>/` — property photos
- `data/outbox/` — the confirmation email for the visitor and the team notification.
  These are written as text files for now; real sending (email + WhatsApp) is connected when hosting is decided.

Spam protection: hidden honeypot field plus a minimum fill time. No captcha.

## Tracking events

Sent to `dataLayer` (and GA4 / Meta Pixel after cookie consent): `quote_cta`, `quote_started`, `quote_submitted`,
`whatsapp_click` (with the page it was clicked from), `package_selected`, `contact_submitted`.

## Adding Indonesian later

Add `'id'` to `i18n.locales` in `astro.config.mjs`, copy `src/i18n/en.ts` to `id.ts`, and add translated content.

## Placeholders to replace before launch

Marked with a yellow **TBD** / **Placeholder** label on the site: business email, business hours, duty contact,
policy answers (supplies, payment, contract, start time), founder story and photo, team photos, testimonials,
before/after photos, sample service agreement, legal name in the Privacy Policy and Terms.
