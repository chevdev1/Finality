# Finality

Pilot site of a five-title Web3 news network. Astro, static output.
Full spec lives in `finality-build-brief.md` at the repo root (single source of truth) with
the concept deck as a visual reference.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output to dist/
npm run preview   # serve the built output
```

## What's here

- **Design tokens** — `src/styles/tokens.css` (colors, type, layout), loaded by `src/styles/global.css`.
- **Fonts** — PT Serif (display/status) + Golos Text (body) + Martian Mono (data), self-hosted via
  Fontsource, Cyrillic subsets only. See "Language" below for why these replace the brief's
  Redaction/Atkinson Hyperlegible Next.
- **UI labels** — centralized in `src/lib/labels.ts` (`SECTION_LABELS`, `STATUS_LABELS`) so every
  page/component translates section names and `developing`/`final` the same way.
- **Content collections** — `src/content.config.ts` defines `news`, `authors`, `spotlight`. Files live in
  `src/content/{news,authors,spotlight}/`.
- **Templates** — homepage (`src/pages/index.astro`), article (`src/pages/[section]/[slug].astro`),
  section hub (`src/pages/[section]/index.astro`), author page (`src/pages/author/[name].astro`),
  Project Spotlight (`src/pages/spotlight/[slug].astro`).
- **Signature component** — `src/components/VerificationMeter.astro` (the six-cell logo/status mark) and
  `src/components/VerificationLog.astro` (the expandable per-article check log).
- **JSON-LD** — Organization + WebSite/SearchAction sitewide (`BaseLayout.astro`), NewsArticle +
  BreadcrumbList per article, CollectionPage + ItemList per hub, ProfilePage + Person per author,
  Article + FAQPage on Spotlight.
- **RSS + sitemaps** — `src/pages/rss.xml.js`, `@astrojs/sitemap` for the general sitemap, and a
  hand-rolled `src/pages/news-sitemap.xml.ts` per brief §6.2 (Google News format, articles from
  the last 48h only — empty right now since the demo dates are older than that, which is the
  correct behavior for real content too).
- **Live quotes** — `src/lib/coingecko-client.ts` calls CoinGecko's free, CORS-open, no-API-key
  endpoints. The ticker (BTC/ETH/SOL/USDT) and Markets panel (BTC, ETH, USDT+USDC+DAI market
  cap) fetch at build time — so the no-JS static page already shows real numbers as of the last
  build, not placeholders — and again client-side every 60s while the tab is open, flashing
  whichever ticker price actually changed (brief §5's price-flash spec, now driven by a real feed
  instead of a simulation). Each fetch helper caches its promise for 20s so one `astro build`
  (which renders Ticker on all 26 pages) hits CoinGecko once, not 26 times — verified by
  instrumenting the fetch during a build. No API key, no backend: this really is just a public
  API call from the browser/build process, nothing more.
- **OG images** — generated at build time with `satori` + `@resvg/resvg-js` (`src/lib/og.ts`):
  `/og/{section}/{slug}.png` per article (real section/status/title/check count) and
  `/og-default.png` for the brand card, used as the fallback `og:image` and as
  `Organization.logo`. Registers the Cyrillic and Latin PT Serif Bold subsets as two distinct
  font names joined into one CSS-style fallback stack (`"PT Serif Cyr", "PT Serif Lat"`) on
  every text node — satori does not fall back across same-named font entries, and the
  Cyrillic subset alone excludes plain ASCII (digits, hyphens, ×), which this site's
  Cyrillic/Latin-mixed headlines ("x402", "BNB Chain", "2026") need constantly.

## Content

All 12 news articles are real, sourced reporting, not placeholder copy — a real event, written
in our own words per the brief's §7 rule against copying source text, with a genuine primary or
reporting source linked in the frontmatter (official incident reports and company press releases
where those exist — e.g. Liquid Network's own incident report on X, U.S. Bancorp's press release —
otherwise a named outlet: CoinDesk, The Cryptonomist, TRM Labs, CNBC, CoinGecko's research arm).
Researched via web search at build time (September 2026), covering: the Liquid Network federation
hack and its still-unresolved ~600 BTC, the Cronos/Tectonic oracle-manipulation exploit, TRM Labs'
record count of 32 price-manipulation attacks in 2026, the CLARITY Act's September 15 cloture
vote, a September 3 Bitcoin ETF inflow spike, CoinGecko's 2026 RWA tokenization report, U.S. Bank's
live USBDC pilot, a stat on AI agents' 58% share of crypto trading volume, the MetaMask/Consensys
split alongside Ethereum's Glamsterdam delay, and Mastercard's Agent Connect launch. Every
`checks` timestamp in each article's frontmatter represents Finality's own (fictional) editorial
verification pass, not a claim about when the underlying outlet verified it.

Two things are still template-only, deliberately:
- **Project Spotlight** (`src/content/spotlight/project-template.md`) — PROJECT_NAME / PROJECT_URL
  / PROJECT_BRIEF were never supplied by a real sponsor. Do not publish as-is.
- **Author photos** use initials avatars instead of real photos (also intentional — no stock
  photography anywhere on this site per the brief).

## Language

The brief specifies an English-language site for a global market (concept deck: `язык: en`,
`рынок: global`). The client redirected mid-build to Russian, so the entire UI and all 12 news
articles are now in Russian (`<html lang="ru">`).

This forced a font swap: **Redaction and Atkinson Hyperlegible Next have no Cyrillic glyphs at
all** in their Fontsource distribution (Latin/Latin-ext only) — only Martian Mono does. Rather than
silently let the browser fall back to a system font for 95% of the page's text, the client chose
replacements that keep the same roles: **PT Serif** (display/status, in place of Redaction — a bold
serif built for Cyrillic/Latin harmony) and **Golos Text** (body, in place of Atkinson — a
humanist grotesque designed for legibility, echoing Atkinson's original rationale). Martian Mono
is unchanged; it already ships a Cyrillic subset. All brief rules that reference "Redaction" or
"Atkinson" by name (§2.3, §4.3's "Spotlight headlines use the grotesque, not Redaction") now read
as PT Serif / Golos Text respectively — the roles and constraints carry over unchanged, only the
concrete typefaces differ.

If the site ever needs an English edition again, re-add the Redaction/Atkinson Fontsource packages
and branch `--font-display`/`--font-body` per locale — the token layer already isolates this to
`src/styles/tokens.css`.

## Two deliberate deviations from the brief

- The brief's §6.1 URL table splits breaking news (`/news/{slug}`) from section explainers
  (`/defi/{slug}`, `/policy/{slug}`, …). This build routes every article as `/{section}/{slug}` —
  one rule, no `type` field needed to decide which prefix applies, and it still satisfies the
  harder invariant from §2.4/§6.4 that "the section in the URL is the section in the breadcrumb."
  Flag it if the client specifically wants a separate `/news/` namespace.
- The brief's §4.4 asks for hub pagination as a `?page=2` query string with a self-referential
  canonical. A fully static build can't serve different content for the same file at different
  query strings — the host doesn't see the query string at all. `src/pages/[section]/page/[page].astro`
  generates real static pages at `/{section}/page/{n}/` instead, each with its own canonical
  pointing at itself (`src/components/Pagination.astro`). `HUB_PAGE_SIZE` (`src/lib/pagination.ts`)
  is 6; every section currently has 1–3 articles, so no page-2 routes exist yet — they'll appear
  automatically once a section passes that count.

## Definition of done — where it stands

Checked against the brief's §8 checklist:

- **Functionality**: all five templates, ⌘K search, ticker pause on hover/hidden-tab — done.
  12 real, sourced articles across all 9 sections satisfy the brief's "10–12 real stories" bar.
- **Execution quality**: fixed two real bugs found during this pass — the mobile hamburger menu
  only opened via JS (no fallback, so JS-off mobile users had no way to reach section nav; now a
  native `<details>`, zero JS) and a `⌘K`-hint selector that silently matched nothing (mobile
  users always saw the keyboard shortcut hint despite having no keyboard). Also fixed a WCAG
  failure: `--graphite` on `--pending` (the homepage hero's section kicker) measured 4.47:1,
  just under AA's 4.5:1 — swapped to `--ink` there only, other `--graphite` pairings all clear
  AA. Visible focus, reduced-motion, and no-JS readability hold up across the site now.
- **SEO**: JSON-LD, single-H1 hierarchy, sitemap + news-sitemap + RSS all verified structurally.
  Core Web Vitals weren't measured against a real mobile connection (needs actual hosting/CI to
  do properly) — the LCP/CLS/INP-relevant choices from the brief (no hero image, fixed ticker
  height, minimal feed JS) are all in place, but the brief's specific numeric targets are unverified.
- **Brand-style check**: logo recognizable without the wordmark, no identical cards, sponsored
  content unmistakably marked — all hold up on inspection.

## Motion

All ten rows of the brief's §5 motion table are implemented except one: "new check arrives in a
live story" needs a real push channel from an editorial backend. That's deliberately not built —
standing up a server just to drive one cell-fill animation isn't a reasonable trade for a pilot
with no editorial backend yet; it's worth building once there's an actual CMS to push from. The
ticker's price flash *is* implemented against a real feed: `src/components/Ticker.astro` polls
CoinGecko every 60s and flashes only the prices that actually moved, background-color only (never
keyframes), 160ms in / 180ms out, matching the brief's timing. Note the one deliberate exception
to `prefers-reduced-motion`: the brief keeps color flashes even in reduced motion (only stagger
and positional movement get removed), so the ticker's `.px` rule overrides global.css's blanket
transition-duration squash for that element specifically.

## Not yet built

- Headless CMS migration path and the four sibling network sites.
- A real sponsor for Project Spotlight (needs PROJECT_NAME / PROJECT_URL / PROJECT_BRIEF from an
  actual advertiser, not something this build can source itself).
- Spotlight pages don't get a generated OG card yet (they inherit the site default) — low priority
  since the current Spotlight entry is still the unfilled template.
- Real BTC-ETF 7-day flow and a "Fed meeting in N days" countdown were dropped from the ticker/
  Markets panel rather than left as fake-looking demo numbers next to now-real prices — there's no
  free public API for either, and this build didn't go looking for a paid one.
