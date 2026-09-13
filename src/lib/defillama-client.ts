// DeFiLlama's public API is free, CORS-open, and needs no key or signup — same rationale as
// coingecko-client.ts. Chosen over DappRadar (paid production tier, $249/mo Premium for
// Developers) per client decision — see finality-build-brief.md §11.
const CHAINS_URL = 'https://api.llama.fi/v2/chains';
const PROTOCOLS_URL = 'https://api.llama.fi/protocols';

export interface ChainTvl {
  name: string;
  tvl: number;
}

export interface ProtocolTvl {
  name: string;
  tvl: number;
  change_1d: number | null;
  category: string;
  chains: string[];
  logo: string | null;
}

// Same rationale as coingecko-client.ts: this page's stats + two tables all read from these
// two endpoints, and Ticker/MarketsPanel-style client polling would otherwise refetch
// needlessly often. Cache per process (build, or one browser tab's poll cycle).
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

export async function fetchTopProtocols(limit = 10): Promise<ProtocolTvl[]> {
  if (!protocolsCache || Date.now() - protocolsCache.at >= CACHE_TTL_MS) {
    const promise = (async () => {
      try {
        const res = await fetch(PROTOCOLS_URL);
        if (!res.ok) return [];
        const data = await res.json();
        return (data as any[])
          .filter((p) => p.tvl)
          .sort((a, b) => b.tvl - a.tvl)
          .map((p) => ({
            name: p.name,
            tvl: p.tvl,
            change_1d: typeof p.change_1d === 'number' ? p.change_1d : null,
            category: p.category ?? '—',
            chains: p.chains ?? [],
            logo: p.logo ?? null,
          }));
      } catch {
        return [];
      }
    })();
    protocolsCache = { at: Date.now(), promise };
  }
  return (await protocolsCache.promise).slice(0, limit);
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
