// Pings IndexNow (Bing, Yandex, Seznam, Naver) with every URL from the built sitemap.
// Usage: node scripts/indexnow.mjs [https://your-domain]   (run after `astro build`, once the
// site is live on that host — IndexNow verifies ownership by fetching /<key>.txt from it).
import fs from 'node:fs';
import path from 'node:path';

const host = (process.argv[2] ?? 'https://finality.news').replace(/\/$/, '');
const keyFile = fs.readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file (<32 hex>.txt) found in public/');
const key = keyFile.replace('.txt', '');

const dist = path.resolve('dist');
const urls = fs
  .readdirSync(dist)
  .filter((f) => /^sitemap-\d+\.xml$/.test(f))
  .flatMap((f) => [...fs.readFileSync(path.join(dist, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))
  // The build's `site` is finality.news; rewrite to the host actually being pinged.
  .map((u) => u.replace(/^https?:\/\/[^/]+/, host));

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(host).host, key, keyLocation: `${host}/${keyFile}`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs to ${host} → HTTP ${res.status}`);
