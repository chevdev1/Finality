// Build-time only (imported from .astro frontmatter, never from a client <script>): needs
// PEXELS_API_KEY, which must stay server-side. Never expose it to client-side code — that
// would leak the key to every visitor's browser.
export interface PexelsPhoto {
  src: string;
  width: number;
  height: number;
  // Pexels' "medium" crop (~350px wide) — for list-row thumbnails, where downloading the same
  // 940px "large" used on the article page itself would be a lot of bytes for a ~64px square.
  thumb: string;
  photographer: string;
  photographerUrl: string;
  pageUrl: string;
  alt: string;
}

// One process-lifetime cache per query so a build that renders the same article's frontmatter
// fetch only once, and so re-running search for the same query across articles that happen to
// share one doesn't burn extra requests against the free-tier quota.
const cache = new Map<string, Promise<PexelsPhoto | null>>();

export async function fetchThemedPhoto(query: string): Promise<PexelsPhoto | null> {
  const key = import.meta.env.PEXELS_API_KEY;
  if (!key) return null;

  if (cache.has(query)) return cache.get(query)!;

  const promise = (async (): Promise<PexelsPhoto | null> => {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        { headers: { Authorization: key } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      const photo = data.photos?.[0];
      if (!photo) return null;
      return {
        src: photo.src.large,
        width: 940,
        height: 650,
        thumb: photo.src.medium,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        pageUrl: photo.url,
        alt: photo.alt || query,
      };
    } catch {
      return null;
    }
  })();

  cache.set(query, promise);
  return promise;
}
