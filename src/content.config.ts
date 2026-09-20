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
    sources: z.array(z.object({ url: z.string().url(), title: z.string(), title_en: z.string().optional() })).min(1),
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

const regulations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/regulations' }),
  schema: z.object({
    name: z.string(),
    name_en: z.string().optional(),
    body: z.string(),
    body_en: z.string().optional(),
    summary: z.string(),
    summary_en: z.string().optional(),
    // Coarse stage for sorting/coloring — the actual nuance lives in statusLabel, since a
    // handful of buckets can't capture "stalled in the Senate" vs "drafting rules as a
    // contingency" vs "comment period" precisely enough on their own.
    stage: z.enum(['early', 'active', 'stalled', 'final']),
    statusLabel: z.string(),
    statusLabel_en: z.string().optional(),
    nextStep: z.string().optional(),
    nextStep_en: z.string().optional(),
    section: z.enum(SECTIONS),
    relatedArticle: z.string().optional(),
    sources: z.array(z.object({ url: z.string().url(), title: z.string() })).min(1),
    updatedAt: z.coerce.date(),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    title_en: z.string(),
    seoTitle: z.string(),
    seoTitle_en: z.string(),
    description: z.string(),
    description_en: z.string(),
    intro: z.string(),
    intro_en: z.string(),
    // Slugs from the `news` collection, in reading order — chosen by hand, not keyword-matched,
    // so a hub never lists an article that merely mentions the word in passing.
    articles: z.array(z.string()).min(1),
    regulations: z.array(z.string()).default([]),
    glossary: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string(), q_en: z.string(), a_en: z.string() })).min(1),
    updatedAt: z.coerce.date(),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    term_en: z.string().optional(),
    definition: z.string(),
    definition_en: z.string().optional(),
    // Arbitrary internal path rather than a news collection() lookup — a term can point to an
    // article, but also to /projects/ or /regulation/, which aren't in the news collection.
    relatedHref: z.string().optional(),
    relatedLabel: z.string().optional(),
    relatedLabel_en: z.string().optional(),
  }),
});

// English article bodies. One file per article, same slug as its src/content/news counterpart;
// frontmatter is only what actually needs translating (takeaways) — everything structural
// (dates, checks, sources, author, section) stays single-sourced in the Russian entry.
const newsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news-en' }),
  schema: z.object({
    takeaways: z.array(z.string()).length(3),
  }),
});

export const collections = { news, authors, spotlight, videos, events, regulations, glossary, newsEn, topics };
