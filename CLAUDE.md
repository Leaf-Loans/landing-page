# Leaf Loans — Landing Page

AI-native lending infrastructure for India's B2B economy. Pre-integrated with GEM, TReDS, private marketplaces, and vertical supply chains. Goes live in ~1 month.

## Stack

- Pages started as a Framer export (scraped with Playwright) — HTML is now **frozen** and edited directly. No scraper re-run.
- Deploy: GitHub Pages at `https://leaf-loans.github.io/landing-page/`. Any push to `main` ships.
- All Claude-era customization lives in two files: `assets/leafloans.css` + `assets/leafloans.js`. `apply.js` injects them into each HTML page via `<link data-leafloans-inject>` and `<script data-leafloans-inject>` tags. Run `node apply.js` after adding new HTML pages.

## Directory layout

- `index.html`, `about-us.html`, `services.html`, `pricing.html`, `our-team.html`, `showcases.html`, `book-a-demo.html`, `contact-us.html`, `blog.html` — static pages (large; Framer-generated markup).
- `_assets/` — scraped Framer assets (fonts, images, icons). Don't edit.
- `assets/leafloans.css` — all visual overrides, custom footer, modal styling, scroll-reveal CSS, banner heading override, dropdown component.
- `assets/leafloans.js` — nav behavior, smooth-scroll nav links, modal build/open/submit, scroll-reveal staggered cascade, progress-line animation, banner heading enforcement, custom dropdown.
- `apply.js` — one-shot injector; run after adding new HTML files.

## Local dev

```bash
python3 -m http.server 5173
# open http://localhost:5173
```

## Key implementation notes

- Framer hydration doesn't run on this static mirror; several behaviors are re-implemented in `leafloans.js` (nav variant swap on scroll, dropdown menu hover, progress-line fill, smooth-scroll nav links).
- Nav has two Framer variants: `framer-v-q635xq` (default transparent) and `framer-v-g1fdcd` (scrolled, white). CSS in `leafloans.css` hides the default and keeps the scrolled variant fixed; `.ll-nav-solid` class toggles the white background on scroll.
- Contact modal is JS-built (`buildModal`) and wired to multiple CTAs via `MODAL_TRIGGER_TEXTS`. Intent map (`INTENT_MAP`) swaps title/sub/submit per CTA.
- Form submits to a Google Apps Script webhook via `no-cors` fetch. Set `window.LL_SHEET_WEBHOOK` on the HTML page before `leafloans.js` loads to enable (currently not set — submissions console-log for dev).
- Scroll reveals: per-component staggered cascade. CSS pre-hide rule prevents FOUC; JS failsafe (`html.ll-anims-ready`) guarantees content never stays trapped.

## Known copy & section patterns

- Technology section heading: *Powering Smarter B2B Lending with an Agentic Lending OS.*
- About Us (CTA banner) heading: *Modern credit infrastructure for India's B2B economy.* (inline `<br/>` between *infrastructure* and *for*; heading uses inline styles to override Framer's preset font-size).
- Footer is custom-rendered (`renderCustomFooter`) — Framer's original footer is hidden via `body.ll-footer-replaced footer:not(#ll-custom-footer)`.

## Positioning (use in any new copy)

- **What:** AI-native lending infrastructure + licensed lender (don't say "NBFC" explicitly in marketing copy — instead convey "we bring the capital too").
- **Who for:** NBFCs modernizing, B2B marketplaces embedding credit, supply chain platforms unlocking liquidity for sellers, fintechs shipping lending products.
- **Moat:** Already live on GEM, TReDS, and private marketplaces — two-year head start on integration.
- **Product surface name:** *Lending OS* (user preferred; beats "Credit Loop", "AgentOS", etc.).
- **Architecture (shown as 4-layer stack image):** AI Foundry → Data Orchestration → Agentic LOS/LMS → AI Agents.

## Commit conventions

- Conventional commits (`feat(landing): …`, `fix(landing): …`).
- Co-author line: `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- Don't commit `.claude/` (gitignored) or `assets/img/*secret*` (if any).
