// Fetches Open Graph metadata for external links at build time, like a chat app's link preview.
// Failures fall back to a plain link, so a site that blocks bots never breaks the build.

export interface LinkPreview {
  url: string;
  title?: string;
  image?: string;
  siteName?: string;
  host: string;
}

const cache = new Map<string, Promise<LinkPreview>>();

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

function meta(html: string, key: string) {
  // Matches both <meta property="og:x" content="..."> and the reversed attribute order.
  // Some sites (e.g. lg.co.kr) emit a generic tag first and the page's own tag later,
  // so the last non-empty value wins.
  const k = key.replace(':', '\\:');
  const re1 = new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*content=["']([^"']*)["']`, 'gi');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${k}["']`, 'gi');
  const values = [...html.matchAll(re1), ...html.matchAll(re2)]
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((m) => decode(m[1]))
    .filter(Boolean);
  return values.at(-1);
}

const youtubeId = (url: URL) =>
  url.hostname.endsWith('youtu.be')
    ? url.pathname.slice(1)
    : url.hostname.endsWith('youtube.com')
      ? url.searchParams.get('v')
      : null;

// YouTube does not serve OG tags to bots, so use its official oEmbed endpoint instead.
async function loadYouTube(url: string, host: string): Promise<LinkPreview> {
  const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return { url, host };
  const data = (await res.json()) as { title?: string; thumbnail_url?: string; author_name?: string };
  return {
    url,
    host,
    title: data.title,
    image: data.thumbnail_url,
    siteName: data.author_name ? `YouTube · ${data.author_name}` : 'YouTube',
  };
}

async function load(url: string): Promise<LinkPreview> {
  const host = new URL(url).hostname.replace(/^www\./, '');
  try {
    if (youtubeId(new URL(url))) return await loadYouTube(url, host);
    const res = await fetch(url, {
      headers: {
        // Many sites only serve OG tags to link-preview bots.
        'User-Agent': 'Mozilla/5.0 (compatible; facebookexternalhit/1.1; +http://www.facebook.com/externalhit_uatext.php)',
        Accept: 'text/html',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { url, host };
    const html = (await res.text()).slice(0, 300_000);
    const rawImage = meta(html, 'og:image') ?? meta(html, 'twitter:image');
    const title =
      meta(html, 'og:title') ?? meta(html, 'twitter:title') ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    return {
      url,
      host,
      title: title ? decode(title) : undefined,
      // Upgrade http images so they are not blocked as mixed content on the https site.
      image: rawImage ? new URL(rawImage, res.url).href.replace(/^http:\/\//, 'https://') : undefined,
      siteName: meta(html, 'og:site_name'),
    };
  } catch {
    return { url, host };
  }
}

export function getLinkPreview(url: string) {
  if (!cache.has(url)) cache.set(url, load(url));
  return cache.get(url)!;
}
