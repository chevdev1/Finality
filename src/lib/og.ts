import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const FONT_DIR = path.resolve('./node_modules/@fontsource/pt-serif/files');

// PT Serif ships Cyrillic and Latin glyphs as separate subset files (see README §Language),
// and the Cyrillic file excludes plain ASCII — no digits, hyphens, or Latin letters, which
// this site's copy mixes in constantly ("x402", "L2", "ETF", en dashes). Satori does NOT
// fall back across multiple font entries that share one `name` for a missing glyph; it only
// honors a real CSS font-family fallback *list*. So the two subsets get distinct names and
// every text node's fontFamily is the comma-joined stack below, Cyrillic first.
const FONT_STACK = '"PT Serif Cyr", "PT Serif Lat"';
const fonts = [
  {
    name: 'PT Serif Cyr',
    data: fs.readFileSync(path.join(FONT_DIR, 'pt-serif-cyrillic-700-normal.woff')),
    weight: 700 as const,
    style: 'normal' as const,
  },
  {
    name: 'PT Serif Lat',
    data: fs.readFileSync(path.join(FONT_DIR, 'pt-serif-latin-700-normal.woff')),
    weight: 700 as const,
    style: 'normal' as const,
  },
];

const INK = '#0F1613';
const PENDING = '#FFD23F';

function cellRow(filled: number, size: number, gap: number) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', gap: `${gap}px` },
      children: Array.from({ length: 6 }, (_, i) => ({
        type: 'div',
        props: {
          style: {
            width: `${size}px`,
            height: `${size}px`,
            border: `${Math.max(2, size / 14)}px solid ${INK}`,
            background: i < filled ? INK : 'transparent',
          },
        },
      })),
    },
  };
}

function footer() {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '14px' },
            children: [
              cellRow(6, 16, 4),
              { type: 'div', props: { style: { fontSize: '28px', fontWeight: 700, color: INK }, children: 'Finality' } },
            ],
          },
        },
        {
          type: 'div',
          props: { style: { fontSize: '20px', letterSpacing: '2px', color: INK }, children: 'FINALITY.NEWS' },
        },
      ],
    },
  };
}

async function toPng(tree: unknown) {
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return resvg.render().asPng();
}

export async function renderArticleOg(opts: { kicker: string; title: string; checksFilled: number }) {
  return toPng({
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PENDING,
        padding: '64px',
        fontFamily: FONT_STACK,
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '20px' },
            children: [
              cellRow(opts.checksFilled, 30, 7),
              {
                type: 'div',
                props: {
                  style: { fontSize: '24px', letterSpacing: '2px', color: INK, textTransform: 'uppercase' },
                  children: opts.kicker,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { fontSize: '62px', fontWeight: 700, lineHeight: 1.15, color: INK, display: 'flex' },
            children: opts.title,
          },
        },
        footer(),
      ],
    },
  });
}

export async function renderDefaultOg() {
  return toPng({
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PENDING,
        padding: '64px',
        fontFamily: FONT_STACK,
      },
      children: [
        cellRow(6, 30, 7),
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '16px' },
            children: [
              { type: 'div', props: { style: { fontSize: '88px', fontWeight: 700, color: INK, display: 'flex' }, children: 'Finality' } },
              {
                type: 'div',
                props: {
                  style: { fontSize: '30px', color: INK, display: 'flex', maxWidth: '900px' },
                  children: 'Крипто-новости с видимой степенью уверенности',
                },
              },
            ],
          },
        },
        footer(),
      ],
    },
  });
}
