import { getCollection } from 'astro:content';
import type { Locale } from './i18n';

export interface TopicLink {
  href: string;
  label: string;
}

async function all(locale: Locale) {
  const en = locale === 'en';
  return (await getCollection('topics')).map((t) => ({
    entry: t,
    link: { href: `${en ? '/en' : ''}/topic/${t.id}/`, label: en ? t.data.title_en : t.data.title },
  }));
}

export async function allTopicLinks(locale: Locale): Promise<TopicLink[]> {
  return (await all(locale)).map((t) => t.link);
}

export async function topicLinksForArticle(articleId: string, locale: Locale): Promise<TopicLink[]> {
  return (await all(locale)).filter((t) => t.entry.data.articles.includes(articleId)).map((t) => t.link);
}

export async function topicLinksForRegulation(regId: string, locale: Locale): Promise<TopicLink[]> {
  return (await all(locale)).filter((t) => t.entry.data.regulations.includes(regId)).map((t) => t.link);
}
