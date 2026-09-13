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

export const collections = { news, authors, spotlight };
