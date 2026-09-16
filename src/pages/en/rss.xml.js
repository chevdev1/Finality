import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SECTION_LABELS_EN, STATUS_LABELS_EN } from '../../lib/i18n';

export async function GET(context) {
  const news = (await getCollection('news')).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
  return rss({
    title: 'Finality',
    description: 'Crypto and fintech news with a verification log on every story. Interface is in English; article text is still Russian-only.',
    site: context.site,
    items: news.map((n) => ({
      title: n.data.title_en ?? n.data.title,
      description: `${n.data.dek_en ?? n.data.dek} (${n.data.checks.length}/6 checks passed, status: ${STATUS_LABELS_EN[n.data.status]})`,
      pubDate: n.data.publishedAt,
      link: `/${n.data.section}/${n.id}/`,
      categories: [SECTION_LABELS_EN[n.data.section]],
    })),
  });
}
