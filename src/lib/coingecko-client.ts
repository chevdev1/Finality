// Client-side only. CoinGecko's free /simple/price and /coins/markets endpoints are
// public, CORS-enabled, and need no API key — safe to call straight from the browser,
// no backend required. Each visitor's browser makes its own request, so this doesn't
// create a shared bottleneck; CoinGecko's free-tier rate limit is per caller IP.
const PRICE_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd&include_24hr_change=true';
const STABLE_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether,usd-coin,dai&order=market_cap_desc';

export interface Quote {
  usd: number;
  usd_24h_change: number;
}

export interface Quotes {
  bitcoin: Quote;
  ethereum: Quote;
  solana: Quote;
  tether: Quote;
}

// Every page includes Ticker (via BaseLayout) and the homepage also includes
// MarketsPanel, so a naive per-call fetch would hit CoinGecko once per static page at
// build time — 26+ requests for one `astro build`, risking the free tier's rate limit
// for no benefit (the data isn't going to change between pages built a few ms apart).
// Cache each call for a short window, scoped to whichever process is running —
// the build process (one build), or the browser tab (one client-side poll cycle).
const CACHE_TTL_MS = 20_000;
let quotesCache: { at: number; promise: Promise<Quotes | null> } | null = null;
let stableCache: { at: number; promise: Promise<number | null> } | null = null;

export async function fetchQuotes(): Promise<Quotes | null> {
  if (quotesCache && Date.now() - quotesCache.at < CACHE_TTL_MS) return quotesCache.promise;
  const promise = (async () => {
    try {
      const res = await fetch(PRICE_URL);
      if (!res.ok) return null;
      return (await res.json()) as Quotes;
    } catch {
      return null;
    }
  })();
  quotesCache = { at: Date.now(), promise };
  return promise;
}

export async function fetchStablecoinSupply(): Promise<number | null> {
  if (stableCache && Date.now() - stableCache.at < CACHE_TTL_MS) return stableCache.promise;
  const promise = (async () => {
    try {
      const res = await fetch(STABLE_URL);
      if (!res.ok) return null;
      const rows: { market_cap: number }[] = await res.json();
      return rows.reduce((sum, r) => sum + (r.market_cap ?? 0), 0);
    } catch {
      return null;
    }
  })();
  stableCache = { at: Date.now(), promise };
  return promise;
}

export function fmtUsd(n: number, decimals = 0) {
  return '$' + n.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtPct(n: number) {
  return (n >= 0 ? '+' : '') + n.toFixed(1) + '%';
}

export function fmtCompactUsd(n: number) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  return fmtUsd(n);
}
