// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// <lastmod> for the sitemap, read straight from each article's own `updatedAt` frontmatter —
// this config runs before Astro's content layer exists, so it can't use getCollection().
// Only pages whose freshness is real get one (articles, and the hubs/homepages that list them);
// a made-up lastmod on everything is worse than none, since crawlers learn to ignore it.
const lastmodByPath = new Map();
const newsDir = path.resolve('./src/content/news');
let newestOverall = 0;
/** @type {Record<string, number>} */
const newestPerSection = {};
for (const file of fs.readdirSync(newsDir)) {
  if (!file.endsWith('.md')) continue;
  const raw = fs.readFileSync(path.join(newsDir, file), 'utf8');
  const section = /^section:\s*(\w+)/m.exec(raw)?.[1];
  const updated = /^updatedAt:\s*(\S+)/m.exec(raw)?.[1];
  if (!section || !updated) continue;
  const time = new Date(updated).getTime();
  if (Number.isNaN(time)) continue;
  const slug = file.slice(0, -3);
  lastmodByPath.set(`/${section}/${slug}/`, time);
  lastmodByPath.set(`/en/${section}/${slug}/`, time);
  newestPerSection[section] = Math.max(newestPerSection[section] ?? 0, time);
  newestOverall = Math.max(newestOverall, time);
}
for (const [section, time] of Object.entries(newestPerSection)) {
  lastmodByPath.set(`/${section}/`, time);
  lastmodByPath.set(`/en/${section}/`, time);
}
lastmodByPath.set('/', newestOverall);
lastmodByPath.set('/en/', newestOverall);

// https://astro.build/config
export default defineConfig({
  site: 'https://finality.news',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Emits <xhtml:link rel="alternate" hreflang> pairs for every URL that exists in both
      // editions — the sitemap-side twin of the per-page hreflang tags.
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru', en: 'en' } },
      serialize(item) {
        const time = lastmodByPath.get(new URL(item.url).pathname);
        if (time) item.lastmod = new Date(time).toISOString();
        return item;
      },
    }),
  ],
});
