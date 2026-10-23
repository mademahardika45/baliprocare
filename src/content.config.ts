// Editable site content. Each collection is a JSON file in src/content/.
// These files are the place a CMS will read and write later.
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ q: z.string(), a: z.string(), tbd: z.boolean().default(false) });

const services = defineCollection({
  loader: file('src/content/services.json'),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    icon: z.string(),
    tagline: z.string(),
    cta: z.string(), // quote button text on the service page
    promise: z.string(),
    report: z.object({ title: z.string(), note: z.string(), photos: z.tuple([z.string(), z.string()]), attention: z.string().optional() }),
    opening: z.string(),
    bullets: z.array(z.string()).length(3),
    included: z.array(z.string()),
    frequencies: z.array(z.string()),
    cover: z.string(),
    gallery: z.array(z.string()),
    faqs: z.array(faq),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

const packages = defineCollection({
  loader: file('src/content/packages.json'),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    bestFor: z.string(),
    from: z.number(), // IDR, smallest property size
    unit: z.enum(['month', 'turnover']),
    includes: z.array(z.string()),
    note: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const jobs = defineCollection({
  loader: file('src/content/jobs.json'),
  schema: z.object({
    order: z.number(),
    group: z.enum(['single', 'oneoff']),
    name: z.string(),
    detail: z.string(),
    from: z.number(),
    fixed: z.boolean().default(false), // true = flat fee, not "from"
    suffix: z.string().optional(),
  }),
});

const faqs = defineCollection({
  loader: file('src/content/faqs.json'),
  schema: faq.extend({ order: z.number(), topic: z.string() }),
});

const areas = defineCollection({
  loader: file('src/content/areas.json'),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    summary: z.string(),
    neighbourhoods: z.array(z.string()),
    response: z.string(),
    photo: z.string(),
    center: z.tuple([z.number(), z.number()]), // [lat, lng] for the map
    radiusKm: z.number(),
  }),
});

export const collections = { services, packages, jobs, faqs, areas };
