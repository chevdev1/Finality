import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SECTIONS } from '../../content.config';
import { SECTION_LABELS, STATUS_LABELS } from '../../lib/labels';

export async function getStaticPaths() {
  return SECTIONS.map((section) => ({ params: { section } }));
}

export async function GET(context) {
  const { section } = context.params;
  const news = (await getCollection('news'))
    .filter((n) => n.data.section === section)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  return rss({
    title: `Finality — ${SECTION_LABELS[section]}`,
    description: `Новости раздела «${SECTION_LABELS[section]}» с проверочным логом у каждой статьи.`,
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
