// Search-snippet helpers. Google shows ~60 characters of a <title> and ~155 of a description
// and cuts the rest mid-word; a headline written to be read on the page (often 80-100 chars for
// news) shouldn't be what decides where that cut lands. These fit the snippet at a word boundary
// while the page itself (h1, og:title, JSON-LD headline) keeps the full text.

const BRAND_SUFFIX = ' — Finality';

function trimAtWord(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const space = cut.lastIndexOf(' ');
  const base = space > max * 0.6 ? cut.slice(0, space) : cut;
  return base.replace(/[\s,;:—–-]+$/, '');
}

export function fitTitle(title: string, max = 62): string {
  if (title.length <= max) return title;
  const core = title.endsWith(BRAND_SUFFIX) ? title.slice(0, -BRAND_SUFFIX.length) : title;
  if (core.length <= max) return core;
  return trimAtWord(core, max - 1) + '…';
}

export function fitDescription(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (sentence > max * 0.55) return cut.slice(0, sentence + 1);
  return trimAtWord(text, max - 1) + '…';
}

// Section hub <title>s: the bare "Bitcoin — Finality" said nothing about what the page is and
// competed with every other site's "Bitcoin" page. Each names the beat and its real topics.
export const SECTION_SEO_TITLES: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    bitcoin: 'Bitcoin: ETF, майнинг и рынок — новости Finality',
    ethereum: 'Ethereum и L2: обновления, ETF, роллапы — Finality',
    defi: 'DeFi: взломы, кредитование, протоколы — Finality',
    stablecoins: 'Стейблкоины: эмитенты, регулирование, платежи — Finality',
    policy: 'Регулирование крипторынка: CLARITY, GENIUS, SEC — Finality',
    rwa: 'RWA: токенизация активов и акций — Finality',
    ai: 'ИИ × крипто: агенты, платежи, x402 — Finality',
    fintech: 'Финтех и крипто: платежи, банки, Visa — Finality',
    security: 'Безопасность крипто: взломы и эксплойты — Finality',
  },
  en: {
    bitcoin: 'Bitcoin News: ETFs, Mining, Markets — Finality',
    ethereum: 'Ethereum & L2 News: Upgrades, ETFs, Rollups — Finality',
    defi: 'DeFi News: Hacks, Lending, Protocols — Finality',
    stablecoins: 'Stablecoin News: Issuers, Rules, Payments — Finality',
    policy: 'Crypto Regulation: CLARITY, GENIUS, SEC News — Finality',
    rwa: 'RWA News: Tokenized Assets and Stocks — Finality',
    ai: 'AI × Crypto News: Agents, Payments, x402 — Finality',
    fintech: 'Fintech & Crypto: Payments, Banks, Visa — Finality',
    security: 'Crypto Security News: Hacks and Exploits — Finality',
  },
};
