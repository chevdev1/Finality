import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const news = await getCollection('news');
  return rss({
    title: 'Finality',
    description: 'Crypto news with a visible verification meter.',
    site: context.site,
    items: news.map((n) => ({
      title: n.data.title,
      description: n.data.dek,
      pubDate: n.data.publishedAt,
      link: `/${n.data.section}/${n.id}/`,
    })),
  });
}
