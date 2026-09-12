import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Google News sitemap: only articles published in the last 48 hours, per brief §6.2.
// Rebuilding the static site is what keeps this window current — there is no runtime here.
export const GET: APIRoute = async ({ site }) => {
  const news = await getCollection('news');
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = news.filter((n) => n.data.publishedAt.getTime() >= cutoff);
  const siteUrl = site?.toString().replace(/\/$/, '') ?? '';

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const urls = recent
    .map(
      (n) => `  <url>
    <loc>${siteUrl}/${n.data.section}/${n.id}/</loc>
    <news:news>
      <news:publication>
        <news:name>Finality</news:name>
        <news:language>ru</news:language>
      </news:publication>
      <news:publication_date>${n.data.publishedAt.toISOString()}</news:publication_date>
      <news:title>${escape(n.data.title)}</news:title>
    </news:news>
  </url>`
    )
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
