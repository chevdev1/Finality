import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const SECTIONS = [
  'bitcoin',
  'ethereum',
  'defi',
  'stablecoins',
  'policy',
  'rwa',
  'ai',
  'fintech',
  'security',
] as const;

const checkItem = z.object({
  id: z.number().min(1).max(6),
  at: z.coerce.date(),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    title_en: z.string().optional(),
    dek_en: z.string().optional(),
    section: z.enum(SECTIONS),
    status: z.enum(['developing', 'final']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    author: z.string(),
    takeaways: z.array(z.string()).length(3),
    checks: z.array(checkItem).max(6).default([]),
    sources: z.array(z.object({ url: z.string().url(), title: z.string() })).min(1),
    related: z.array(z.string()).default([]),
    sponsored: z.literal(false).default(false),
    featured: z.boolean().default(false),
    imageQuery: z.string().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    role_en: z.string().optional(),
    bio_en: z.string().optional(),
    initials: z.string().max(2),
    sameAs: z.array(z.string().url()).default([]),
  }),
});

const spotlight = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/spotlight' }),
  schema: z.object({
    project: z.string(),
    tagline: z.string(),
    publishedAt: z.coerce.date(),
    guestColor: z.string().default('#3d5afe'),
    chain: z.string(),
    token: z.string(),
    launch: z.string(),
    audits: z.string(),
    backers: z.string(),
    tvl: z.string(),
    whatItIs: z.string(),
    howItWorks: z.array(z.string()),
    tokenomics: z.array(z.object({ label: z.string(), pct: z.number() })),
    roadmap: z.array(z.object({ n: z.number(), label: z.string(), done: z.boolean() })),
    team: z.string(),
    backersList: z.string(),
    risks: z.array(z.string()),
    faq: z.array(z.object({ q: z.string(), a: z.string() })),
    ctaUrl: z.string().url(),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/videos' }),
  schema: z.object({
    title: z.string(),
    youtubeId: z.string(),
    channel: z.string(),
    section: z.enum(SECTIONS),
    addedAt: z.coerce.date(),
    note: z.string(),
    note_en: z.string().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    date: z.coerce.date(),
    // 'day' — an actual scheduled date (a vote, a launch). 'quarter' / 'year' — the source only
    // commits to that much precision (e.g. "by Q4 2026", "in 2027"); `date` still holds a real
    // Date for sorting, but the page renders "Q4 2026" / "2027" instead of a fabricated day.
    precision: z.enum(['day', 'quarter', 'year']).default('day'),
    title: z.string(),
    title_en: z.string().optional(),
    description: z.string(),
    description_en: z.string().optional(),
    section: z.enum(SECTIONS),
    // 'confirmed' — a hard date set by an official body (a scheduled vote, an announced launch
    // date). 'estimated' — inferred from a target/deadline mentioned in our own reporting, not
    // a body's own published schedule.
    status: z.enum(['confirmed', 'estimated']),
    relatedArticle: z.string().optional(),
    sources: z.array(z.object({ url: z.string().url(), title: z.string() })).min(1),
  }),
});

export const collections = { news, authors, spotlight, videos, events };
