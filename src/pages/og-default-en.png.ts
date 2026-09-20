import type { APIRoute } from 'astro';
import { renderDefaultOg } from '../lib/og';

export const GET: APIRoute = async () => {
  const png = await renderDefaultOg('Crypto news with a visible degree of confidence');
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
  });
};
