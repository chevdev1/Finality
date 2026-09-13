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
  Project Spotlight (`src/pages/spotlight/[slug].astro`), and Projects
  (`src/pages/projects/index.astro`, added post-launch — see below).
- **Projects page** (`/projects/`) — a DappRadar-style ranking of chains/protocols by TVL, requested
  by the client, built in Finality's own visual language instead of copying the dark-neon reference
  screenshot (§10 already bans that look). `src/lib/defillama-client.ts` calls DeFiLlama's free,
  key-free public API — chosen over DappRadar, whose production tier is $249/mo and whose API
  domain didn't even resolve from this build sandbox. Three ledger tables — top chains, top
  protocols, and "trending" reframed honestly as the biggest 24h TVL gainers above a $5M floor
  (DeFiLlama has no real "freshly listed" signal, so this is what "actual/hot right now" can
  honestly mean here) — plus a stats strip. Chain logos come from DeFiLlama's own icon CDN
  (`icons.llamao.fi/icons/chains/rsz_<slug>.jpg`, an undocumented convention read off their site
  and spot-checked against every chain this build actually renders) with `onerror` hiding any
  that 404 instead of showing a broken-image box.
  Rows are actually usable: chain rows are plain links out to their DeFiLlama chain page (no rich
  per-chain metadata exists in the free API to justify an accordion there); protocol/gainer rows
  are `<details>` accordions — same zero-JS grid-rows technique as `VerificationLog` — that reveal
  the project's real description, category, 7-day change, audit count, "in DeFiLlama's registry
  since" date, a per-chain TVL breakdown rendered as bars (from the same response's `chainTvls`,
  filtered to drop `-borrowed`/`-staking`/etc. sub-keys so lending markets don't double-count),
  a "notable events" timeline when DeFiLlama has one (`hallmarks` — things like "KelpDAO hack" or
  "UST depeg" with real dates), and outbound links to the project's site/X/audit report/full
  DeFiLlama page. All of it comes from the one API response already powering the row, no extra
  request. Every logo — chain or protocol — sits in the same fixed bordered square regardless of
  the source asset's own shape (circle, square, transparent PNG, flat color block); brief §2.4's
  ban on border-radius everywhere except author avatars made a hard square the obvious frame, and
  imposing one shape system is what actually fixed the "inconsistent logo shapes" the client
  flagged, rather than trying to normalize every third-party icon individually. Deliberately dropped the periodic
  full-table refresh this page originally had: swapping a row's entire markup out from under an
  open `<details>` on a timer would collapse it mid-read, and a ticking-every-90-seconds table is
  closer to the "dashboard as primary retail interface" brief §3 already rejects than to a page
  someone reads once per visit. Numbers are as fresh as the last build/page load, not real-time —
  same trade-off Markets/Ticker make explicit with their source badges, just without a badge that
  would imply otherwise here. Critically, the client's future paid placement is a separate
  dashed-border card reusing `SpotlightTeaser`, never blended into the real ranking rows;
  corrupting the rankings to fit a sponsor would undercut the one thing this whole site is built
  to sell. Full writeup in `finality-build-brief.md` §11.
  Second design pass fixed five real bugs found in live review: the header ticker was rendering
  its item set twice unconditionally for the infinite-scroll loop, which visibly repeated the
  last couple of symbols (SOL/USDT) on wide viewports where one copy already filled the width —
  it now measures first and only clones when the content actually needs to loop. The Spotlight
  slot could leak `project-template.md`'s `[Project]` placeholder onto prod if no real sponsor
  was live; it now filters for a project name with no bracket and falls back to an in-house
  editorial block instead of a fake ad. `.data` gained `font-variant-numeric: tabular-nums`
  globally (it never had it). Protocol/gainer rows gained a real Δ7d column (previously only
  inside the accordion), hidden first below 1024px. Each table's `<details>` rows share a `name`
  attribute so only one row per table can be open at once — HTML's native exclusive-accordion
  behavior, zero JS. The disclosure glyph changed from a rotating "+" to a chevron rotating 180°.
  The stats strip became a dense hairline-bordered row instead of a boxed card, gained a fourth
  "Обновлено" (build time) stat and a methodology tooltip on Total TVL. The sidebar gained two
  data-only modules built from arrays already fetched for the tables — "Project of the day" (the
  #1 gainer) and "Newly listed" (sorted by DeFiLlama's real `listedAt` field) — plus an honest
  empty-state message if the DeFiLlama API is down at build time instead of a silently empty table.
- **Signature component** — `src/components/VerificationMeter.astro` (the six-cell logo/status mark) and
  `src/components/VerificationLog.astro` (the expandable per-article check log).
- **Article imagery** — two tiers, by explicit client request to override the brief's
  no-stock-photography / no-hero-image rule (§2, normally "not the executor's call"):
  - `src/lib/pexels-client.ts` fetches one themed photo per article at build time from Pexels'
    free API, keyed by each article's own `imageQuery` frontmatter field (e.g. `"capitol building
    washington government senate"` for the CLARITY Act story). Needs `PEXELS_API_KEY` in `.env`
    (see `.env.example`) — never exposed client-side, build-time only.
  - `src/components/ArticleSeal.astro` is the fallback for articles with no `imageQuery`, no key
    configured, or an empty search result: an inline SVG grid whose cell states are derived by
    hashing the article's slug, giving a distinct, reproducible "imprint" grown from the same
    six-cell motif as the verification meter — literally the "hash-derived rosette" idea the
    concept deck names for network site #2. Zero image request, zero decode cost.
  - Accepting real photos means accepting their Core Web Vitals cost too — the photo is no longer
    invisible to LCP the way the seal is. Every `<img>` ships explicit `width`/`height` (940×650,
    Pexels' `large` size) so it can't cause layout shift, but it does become the largest
    above-the-fold element on articles that have one.
  - Live and verified with a real `PEXELS_API_KEY`: 11 of 12 articles now render a real, topically
    matched photo (a dark cybersecurity scene for the Liquid Network hack, the U.S. Capitol for
    the CLARITY Act vote, a contactless-payment close-up for Mastercard Agent Connect, etc.);
    `what-a-federated-sidechain-is` deliberately ships no `imageQuery`, so it still renders the
    ArticleSeal fallback — proving that path still works with a live key configured, not just
    when the key is absent.
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

All 29 news articles are real, sourced reporting, not placeholder copy — a real event, written
in our own words per the brief's §7 rule against copying source text, with a genuine primary or
reporting source linked in the frontmatter (official incident reports and company press releases
where those exist — e.g. Liquid Network's own incident report on X, U.S. Bancorp's press release,
the Federal Register — otherwise a named outlet: CoinDesk, The Cryptonomist, TRM Labs, CNBC,
CoinGecko's research arm, Harvard Law's corporate-governance forum). Researched via web search
(September 2026), covering: the Liquid Network federation hack and its still-unresolved ~600 BTC,
the Cronos/Tectonic oracle-manipulation exploit, TRM Labs' record count of 32 price-manipulation
attacks in 2026, the CLARITY Act's September 15 cloture vote, the SEC's five-category crypto-asset
classification proposal, the G20's September 1 digital-assets statement, a September 3 Bitcoin ETF
inflow spike, CoinGecko's 2026 RWA tokenization report and a 33x tokenized-equity volume surge,
U.S. Bank's live USBDC pilot, Treasury's GENIUS Act stablecoin-licensing rulemaking, a stat on AI
agents' 58% share of crypto trading volume, Kraken's pre-IPO perpetuals on OpenAI and Anthropic,
Ethereum staking ETFs now that the SEC classifies staking rewards as a non-security, the
MetaMask/Consensys split alongside Ethereum's Glamsterdam delay, and Mastercard's Agent Connect
launch. Every `checks` timestamp in each article's frontmatter represents Finality's own
(fictional) editorial verification pass, not a claim about when the underlying outlet verified it.
Coverage grew in four passes: 12 articles at launch (one per template slot), then +6 so every
section carried at least two stories, then +4 rounding fintech/security/policy to 3+ (Visa's
stablecoin settlement run rate crossing $20B, PayPal's PYUSDx tool, a PYMNTS/TRM stat on $3.6B
lost to hacks despite audits, an SEC-approved Nasdaq Texas rule naming BTC/ETH/SOL/XRP as
commodity-trust-eligible), then +4 more for topic variety within already-covered sections —
Tether's first full KPMG audit of USDT reserves, Bitcoin's falling mining difficulty against
rising hashprice, a DeFi governance-takeover exploit at Term Finance (a different attack shape
than the oracle-manipulation stories), and Lofty's tokenized real-estate platform, then +3 to even
out the last thin spots — Ethereum Foundation's end-to-end privacy roadmap, Binance's Agent OS
letting Claude/ChatGPT/Codex trade through a withdrawal-locked sub-account, and the London Stock
Exchange's tokenization deal with Kraken's parent Payward. 29 articles total: seven sections at 3,
two (security, rwa) at 4.

Author bylines (`src/content/authors/`) carry no `sameAs` links — the three authors are fictional
pilot bylines, and a placeholder social link would be a fabricated identity claim sitting inside
real `Person` JSON-LD. Add real links once these beats have real editors attached to them.

Two things are still template-only, deliberately:
- **Project Spotlight** (`src/content/spotlight/project-template.md`) — PROJECT_NAME / PROJECT_URL
  / PROJECT_BRIEF were never supplied by a real sponsor. Do not publish as-is. Every place that
  reads the `spotlight` collection (`index.astro`, `projects/index.astro`,
  `spotlight/[slug].astro`'s `getStaticPaths`) filters out any entry whose `project` field still
  has a bracket in it, so this template can sit in the repo without leaking onto a live page or
  building its own public `/spotlight/project-template/` URL.
- **Author photos** use initials avatars instead of real photos (also intentional — no stock
  photography anywhere on this site per the brief).

- **Dark theme** — a header toggle (`src/components/ThemeToggle.astro`, sun/moon next to the
  search button), independent of the OS setting, remembered in `localStorage` (falls back to
  `prefers-color-scheme` only on a first visit with nothing saved). It's a pure token flip: dark
  mode redefines the same 9 semantic variables in `tokens.css` under `:root[data-theme='dark']`,
  so no component markup changed to support it — everything already read `var(--ink)` etc. rather
  than a hardcoded color. The one exception is a handful of "always-inverted" blocks (the ticker,
  the Spotlight CTA bar) built as `background: var(--ink); color: var(--ledger)` specifically to
  read as a dark bar on an otherwise light page; since `--ink`/`--ledger` swap roles in dark mode,
  these correctly flip to a light bar on an otherwise dark page — same relative contrast, mirrored.
  Their few genuinely hardcoded hex values (the ticker's light-tinted `.up`/`.down`/badge colors,
  tuned specifically for a dark background) get their own `:root[data-theme='dark']` overrides that
  point back to the plain light-theme constants, since the surface they sit on has now flipped to
  light. Switching plays a ~300ms crossfade: a `.theme-transitioning` class goes on `<html>` for
  that window, adding an explicit (never `all`) `transition` on background/color/border-color via
  a `*` selector, removed afterward so it never fights a component's own hover/accordion timing;
  respects `prefers-reduced-motion`. An inline, blocking `<script>` at the very top of `<head>` in
  `BaseLayout.astro` sets `data-theme` before any CSS paints, so a returning dark-mode reader never
  sees a light flash first.
  Found post-launch: the homepage hero, the Subscribe widget, and Spotlight's "Риски" block all
  sit on the constant-yellow `--pending` fill, which doesn't change between themes — but their text
  had no color of its own and just inherited `var(--ink)` from `<body>`, which flips to near-white
  in dark mode. White text on yellow, a real WCAG failure. Fixed with a new `--on-accent: #0f1613`
  token that is deliberately *not* redeclared under `[data-theme='dark']` — it always stays dark,
  which is the point — applied as explicit `color` on the text in those three blocks, plus a local
  `--ink: var(--on-accent)` override on the hero's container so `VerificationMeter` (which reads
  `var(--ink)` internally with no color prop) renders correctly there too, without touching the
  component itself.

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

## Three deliberate deviations from the brief

- **Stock photography, explicitly re-authorized by the client.** §2 bans it outright ("not the
  executor's call") and ties the no-hero-image rule to keeping LCP as the headline text. The
  client asked for CoinDesk-style photos anyway after seeing the hash-seal alternative; this
  build flagged the trade-off (brand differentiation, Core Web Vitals) before building it. See
  "Article imagery" above for how the fallback keeps every article illustrated even where a photo
  isn't wanted or available.
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
  29 real, sourced articles across all 9 sections (7 sections at 3, security and rwa at 4) clear
  the brief's "10–12 real stories" bar several times over.
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
