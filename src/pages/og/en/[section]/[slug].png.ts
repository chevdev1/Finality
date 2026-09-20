import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderArticleOg } from '../../../../lib/og';
import { SECTION_LABELS_EN, STATUS_LABELS_EN } from '../../../../lib/i18n';

export async function getStaticPaths() {
  const news = await getCollection('news');
  return news.map((entry) => ({
    params: { section: entry.data.section, slug: entry.id },
    props: { entry },
  }));
}

// English counterpart of /og/{section}/{slug}.png — the Russian card would otherwise be what a
// link to /en/… unfurls to on social platforms, headline and all.
export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
  const png = await renderArticleOg({
    kicker: `${SECTION_LABELS_EN[entry.data.section]} · ${STATUS_LABELS_EN[entry.data.status]}`,
    title: entry.data.title_en ?? entry.data.title,
    checksFilled: entry.data.checks.length,
  });
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
  });
};
