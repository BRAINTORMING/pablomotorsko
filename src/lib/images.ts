// Public Unsplash access key (optional). Empty means placeholders only.
const ENV = (import.meta as any).env;
export const UNSPLASH_KEY: string = (ENV && ENV.VITE_UNSPLASH_ACCESS_KEY) || '';

// Neutral placeholder shown while a photo loads or when none is available.
export const placeholder = (label: string, w: number, h: number) => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
    '<rect width="100%" height="100%" fill="#e5e7eb"/>' +
    '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="' +
    Math.round(Math.min(w, h) / 12) + '" fill="#64748b">' + label.replace(/[<>&"]/g, '') + '</text></svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
};

const inflight = new Map<string, Promise<string[]>>();

function fetchUrls(query: string): Promise<string[]> {
  if (!UNSPLASH_KEY) return Promise.resolve([]);
  const ck = 'unsplash:' + query;
  try {
    const hit = localStorage.getItem(ck);
    if (hit) {
      const cached: string[] = JSON.parse(hit);
      if (cached.length) return Promise.resolve(cached);
    }
  } catch {
    /* ignore */
  }
  const running = inflight.get(ck);
  if (running) return running;
  const p = fetch(
    'https://api.unsplash.com/search/photos?per_page=10&orientation=landscape&query=' +
      encodeURIComponent(query) + '&client_id=' + UNSPLASH_KEY,
  )
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const urls: string[] = ((data && data.results) || []).map((r: any) => r.urls && r.urls.raw).filter(Boolean);
      if (urls.length) {
        try {
          localStorage.setItem(ck, JSON.stringify(urls));
        } catch {
          /* ignore */
        }
      }
      return urls;
    })
    .catch(() => [] as string[])
    .finally(() => {
      inflight.delete(ck);
    });
  inflight.set(ck, p);
  return p;
}

/** Returns a search photo URL for the query, or null when there is no key or no result. */
export async function search(query: string, seed: number, w: number, h: number): Promise<string | null> {
  const urls = await fetchUrls(query);
  if (!urls.length) return null;
  const base = urls[Math.abs(seed) % urls.length];
  return base + (base.indexOf('?') === -1 ? '?' : '&') + 'w=' + w + '&h=' + h + '&fit=crop&auto=format&q=80';
}