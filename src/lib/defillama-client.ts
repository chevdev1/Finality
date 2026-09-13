// DeFiLlama's public API is free, CORS-open, and needs no key or signup — same rationale as
// coingecko-client.ts. Chosen over DappRadar (paid production tier, $249/mo Premium for
// Developers) per client decision — see finality-build-brief.md §11.
const CHAINS_URL = 'https://api.llama.fi/v2/chains';
const PROTOCOLS_URL = 'https://api.llama.fi/protocols';

// DeFiLlama's own frontend serves chain icons from this CDN as
// icons.llamao.fi/icons/chains/rsz_<slug>.jpg, lowercase with spaces turned to hyphens. Not a
// documented API field (the /v2/chains response has no logo URL at all) — a convention read
// off their site and spot-checked against this build's actual top-10 chains, all 200s. A
// missing icon just fails to load; <img onerror> in the page hides it rather than showing a
// broken-image box.
export function chainIconUrl(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return `https://icons.llamao.fi/icons/chains/rsz_${slug}.jpg`;
}

export function chainPageUrl(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return `https://defillama.com/chain/${slug}`;
}

export interface ChainTvl {
  name: string;
  tvl: number;
}

export interface ProtocolTvl {
  name: string;
  tvl: number;
  change_1d: number | null;
  change_7d: number | null;
  category: string;
  chains: string[];
  logo: string | null;
  description: string | null;
  url: string | null;
  twitter: string | null;
  audits: string;
  auditLink: string | null;
  listedAt: number | null;
  slug: string | null;
}

// Same rationale as coingecko-client.ts: this page's stats + tables all read from these two
// endpoints, and Ticker/MarketsPanel-style client polling would otherwise refetch needlessly
// often. Cache per process (build, or one browser tab's poll cycle).
const CACHE_TTL_MS = 60_000;
let chainsCache: { at: number; promise: Promise<ChainTvl[]> } | null = null;
let protocolsCache: { at: number; promise: Promise<ProtocolTvl[]> } | null = null;

export async function fetchTopChains(limit = 10): Promise<ChainTvl[]> {
  if (!chainsCache || Date.now() - chainsCache.at >= CACHE_TTL_MS) {
    const promise = (async () => {
      try {
        const res = await fetch(CHAINS_URL);
        if (!res.ok) return [];
        const data: ChainTvl[] = await res.json();
        return data.filter((c) => c.tvl > 0).sort((a, b) => b.tvl - a.tvl);
      } catch {
        return [];
      }
    })();
    chainsCache = { at: Date.now(), promise };
  }
  return (await chainsCache.promise).slice(0, limit);
}

// Fetches (and caches) the full protocol list once; fetchTopProtocols and fetchTopGainers both
// derive their view from this same array instead of hitting the API twice.
async function fetchAllProtocols(): Promise<ProtocolTvl[]> {
  if (!protocolsCache || Date.now() - protocolsCache.at >= CACHE_TTL_MS) {
    const promise = (async () => {
      try {
        const res = await fetch(PROTOCOLS_URL);
        if (!res.ok) return [];
        const data = await res.json();
        return (data as any[])
          .filter((p) => p.tvl)
          .map((p) => ({
            name: p.name,
            tvl: p.tvl,
            change_1d: typeof p.change_1d === 'number' ? p.change_1d : null,
            change_7d: typeof p.change_7d === 'number' ? p.change_7d : null,
            category: p.category ?? '—',
            chains: p.chains ?? [],
            logo: p.logo ?? null,
            description: p.description ?? null,
            url: p.url ?? null,
            twitter: p.twitter ?? null,
            audits: p.audits ?? '0',
            auditLink: Array.isArray(p.audit_links) && p.audit_links[0] ? p.audit_links[0] : null,
            listedAt: typeof p.listedAt === 'number' ? p.listedAt : null,
            slug: p.slug ?? null,
          }));
      } catch {
        return [];
      }
    })();
    protocolsCache = { at: Date.now(), promise };
  }
  return protocolsCache.promise;
}

export async function fetchTopProtocols(limit = 10): Promise<ProtocolTvl[]> {
  const all = await fetchAllProtocols();
  return [...all].sort((a, b) => b.tvl - a.tvl).slice(0, limit);
}

// "Trending" here means the biggest 24h TVL gainers — a real, sourced number, unlike a vague
// "freshly listed" claim DeFiLlama's free API can't actually back up. A $5M TVL floor keeps out
// near-zero-TVL protocols whose percentage swings are just noise.
const GAINERS_MIN_TVL = 5_000_000;

export async function fetchTopGainers(limit = 10): Promise<ProtocolTvl[]> {
  const all = await fetchAllProtocols();
  return [...all]
    .filter((p) => p.tvl >= GAINERS_MIN_TVL && p.change_1d !== null)
    .sort((a, b) => (b.change_1d ?? 0) - (a.change_1d ?? 0))
    .slice(0, limit);
}

export function fmtTvl(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  return '$' + n.toLocaleString('ru-RU');
}

export function fmtChange(n: number | null): string {
  if (n === null) return '—';
  return (n >= 0 ? '+' : '') + n.toFixed(1) + '%';
}

export function fmtListedDate(unixSeconds: number | null): string | null {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
