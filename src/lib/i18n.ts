import { SECTIONS } from '../content.config';

export type Locale = 'ru' | 'en';

// English section names — kept separate from lib/labels.ts (the Russian ones used
// everywhere by default) rather than merging into one Record<locale, Record<section,string>>,
// so every existing RU call site keeps working unchanged and only EN pages opt in explicitly.
export const SECTION_LABELS_EN: Record<string, string> = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum & L2',
  defi: 'DeFi',
  stablecoins: 'Stablecoins',
  policy: 'Policy',
  rwa: 'RWA',
  ai: 'AI × Crypto',
  fintech: 'Fintech',
  security: 'Security',
};

export const STATUS_LABELS_EN: Record<'developing' | 'final', string> = {
  developing: 'Developing',
  final: 'Confirmed',
};

// Section intros translated from src/lib/section-intros.ts — kept as genuine translations of
// the same editorial positioning, not a shortened placeholder version.
export const SECTION_INTROS_EN: Record<string, string> = {
  bitcoin:
    "The Bitcoin desk tracks ETF flows, mining economics, and base-layer decisions that ripple into every other section of the site. We favor on-chain data over headline price moves and mark every figure with our six-check counter, so you can see how confirmed it is before acting on it.",
  ethereum:
    "Ethereum and its rollups move fast, and most of the actual failures — sequencer downtime, bridge risk, gas spikes — happen at the L2 layer, not on the base chain. This hub follows both layers, weighted toward what actually changes for a wallet holding funds on a rollup.",
  defi:
    "The DeFi desk leans into oracle risk and collateral design — that's where most of this year's losses concentrated. Every incident here links to the on-chain transaction itself, not just the protocol's own post-mortem.",
  stablecoins:
    "The stablecoins and payments desk tracks supply growth, new settlement rails, and the regulatory line between a stablecoin and a security. We keep trading stablecoins and payment stablecoins separate — they're two very different markets.",
  policy:
    "The policy desk tracks bills, regulator actions, and enforcement that decide what crypto companies in major markets can do next. We follow vote counts and procedural detail as closely as the final outcome.",
  rwa:
    "The tokenized real-world-assets desk tracks tokenized bonds, equities, and credit — where the volume is actually real, not just where a press release claims it is. We separate trading volume from assets under management wherever the source allows it.",
  ai:
    "The AI × Crypto desk tracks autonomous on-chain trading agents, pay-per-call APIs, and the infrastructure that lets a model hold and spend funds. Skepticism is warranted here — this category draws more marketing than confirmed volume.",
  fintech:
    "The fintech desk tracks the boring but important infrastructure — settlement rails, neobank integrations, payroll pilots — where crypto quietly replaces the slow correspondent-banking link, and the end user never sees the token at all.",
  security:
    "The security desk tracks exploits, incident response, and the shift toward key compromise as the leading cause of losses. Every incident report here links to the on-chain movement of funds, not just an announcement.",
};

// UI copy for chrome shared across pages — the article bodies themselves stay Russian-only
// for now (see finality-build-brief.md §22); this covers only the surrounding interface.
export const UI: Record<Locale, Record<string, string>> = {
  ru: {
    projects: 'Проекты',
    search: 'Поиск',
    searchPlaceholder: 'Поиск по заголовкам…',
    searchClose: 'Esc — закрыть',
    openMenu: 'Открыть меню',
    sectionsNavLabel: 'Разделы',
    sectionsHeading: 'Разделы',
    latestStories: 'Последние материалы',
    newestFirst: 'Сначала новые',
    findMaterial: 'Найти материал…',
    videoHeading: 'Видео',
    subscribeLabel: 'Получать утренний брифинг в 7:00',
    subscribeSub: 'Одно письмо каждое утро — только то, что прошло проверку.',
    subscribeEmailAria: 'Электронная почта',
    subscribeButton: 'Подписаться',
    subscribeToast: 'Вы подписаны',
    marketsLabel: 'Рынки',
    stablecoinCap: 'USDT + USDC + DAI, капитализация',
    updated: 'Обновлено',
    footerText: 'Finality — часть сети из пяти изданий. Общая информация об издателе — на странице',
    footerAboutLink: '«О редакции»',
    copyright: '© 2026 Finality',
    langSwitch: 'EN',
    breadcrumbHome: 'Finality',
    notTranslatedNotice:
      'Интерфейс уже на английском, но тексты статей пока только на русском — перевод материалов впереди.',
  },
  en: {
    projects: 'Projects',
    search: 'Search',
    searchPlaceholder: 'Search headlines…',
    searchClose: 'Esc to close',
    openMenu: 'Open menu',
    sectionsNavLabel: 'Sections',
    sectionsHeading: 'Sections',
    latestStories: 'Latest stories',
    newestFirst: 'Newest first',
    findMaterial: 'Find a story…',
    videoHeading: 'Video',
    subscribeLabel: 'Get the 7am briefing',
    subscribeSub: 'One email each morning — only what has cleared verification.',
    subscribeEmailAria: 'Email address',
    subscribeButton: 'Subscribe',
    subscribeToast: 'You are subscribed',
    marketsLabel: 'Markets',
    stablecoinCap: 'USDT + USDC + DAI, market cap',
    updated: 'Updated',
    footerText: 'Finality is part of a planned five-title network. General information about the publisher is on the',
    footerAboutLink: '"About" page',
    copyright: '© 2026 Finality',
    langSwitch: 'RU',
    breadcrumbHome: 'Finality',
    notTranslatedNotice:
      'The interface is in English, but article text is still Russian-only — translated stories are coming.',
  },
};

// Maps the current URL to its counterpart in the other locale. Returns `exact: false` when
// there's no real translated counterpart yet (articles, author pages, /projects/, Spotlight) —
// the switcher still sends the reader somewhere useful (that locale's homepage) rather than a
// dead link, but callers use `exact` to decide whether it's honest to also emit an hreflang
// alternate tag: hreflang claims two URLs are the same content in different languages, and a
// fallback-to-homepage is not that.
export function altPath(pathname: string, targetLocale: Locale): { href: string; exact: boolean } {
  const isEn = pathname === '/en' || pathname.startsWith('/en/');
  const bare = isEn ? pathname.replace(/^\/en/, '') || '/' : pathname;

  const isHome = bare === '/';
  const isAbout = bare === '/about/' || bare === '/about';
  const isProjects = bare === '/projects/' || bare === '/projects';
  const sectionMatch = bare.match(/^\/([a-z]+)\/$/);
  const isSection = !!sectionMatch && (SECTIONS as readonly string[]).includes(sectionMatch[1]);

  if (targetLocale === 'en') {
    if (isHome) return { href: '/en/', exact: true };
    if (isAbout) return { href: '/en/about/', exact: true };
    if (isProjects) return { href: '/en/projects/', exact: true };
    if (isSection) return { href: `/en${bare}`, exact: true };
    return { href: '/en/', exact: false };
  }
  if (isHome) return { href: '/', exact: true };
  if (isAbout) return { href: '/about/', exact: true };
  if (isProjects) return { href: '/projects/', exact: true };
  if (isSection) return { href: bare, exact: true };
  return { href: '/', exact: false };
}
