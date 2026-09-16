import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SECTION_LABELS, STATUS_LABELS } from '../lib/labels';

export async function GET(context) {
  const news = (await getCollection('news')).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
  return rss({
    title: 'Finality',
    description: 'Крипто- и финтех-новости с проверочным логом у каждой статьи.',
    site: context.site,
    items: news.map((n) => ({
      title: n.data.title,
      description: `${n.data.dek} (${n.data.checks.length}/6 проверок пройдено, статус: ${STATUS_LABELS[n.data.status]})`,
      pubDate: n.data.publishedAt,
      link: `/${n.data.section}/${n.id}/`,
      categories: [SECTION_LABELS[n.data.section]],
    })),
  });
}
