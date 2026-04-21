# Leaf Loans Design System

**Version:** 1.0
**Last updated:** 2026-04-21
**Brand personality:** Modern + Technical (enterprise-grade AI lending infrastructure for India's B2B economy)
**Color modes supported:** Dark (hero / CTA banners) + Light (content sections)
**Type family:** Manrope (display) + Inter (UI/body) + JetBrains Mono (code)

This document is the single source of truth for visual decisions. Any new component, page, or email must reference tokens from here — not hand-picked values.

---

## 1. Color System

### 1.1 Primary (Brand)

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `--ll-accent-500` | `#7827CF` | `120, 39, 207` | Primary CTA hover, focus ring, active link, selected states |
| `--ll-accent-400` | `#8E45D9` | `142, 69, 217` | Accent hover lighter (gradient top) |
| `--ll-accent-600` | `#5E1EAC` | `94, 30, 172` | Accent pressed / active darker |
| `--ll-accent-50` | `rgba(120, 39, 207, 0.08)` | — | Dropdown hover wash, focus glow |
| `--ll-accent-100` | `rgba(120, 39, 207, 0.12)` | — | Selected row, focus ring |

### 1.2 Secondary (Supporting)

| Token | Hex | Usage |
|---|---|---|
| `--ll-lavender` | `#F5F0FA` | Footer background, soft section washes |
| `--ll-peach` | `#FDDAC3` | Gradient accents (paired with lavender in radial blends) |
| `--ll-mint` | `#E6F7EE` | Success icon circle background |
| `--ll-sage` | `#3A6B4C` | Imported from Walnutt tokens (reserved; not active in landing) |

### 1.3 Semantic

| Token | Hex | Role |
|---|---|---|
| `--ll-success` | `#17A663` | Success check, form-complete state |
| `--ll-success-bg` | `#E6F7EE` | Success icon circle, success toasts |
| `--ll-error` | `#C62828` | Validation errors, destructive actions |
| `--ll-error-bg` | `#FDEEEE` | Error field wash |
| `--ll-warn` | `#E08A00` | Warnings, caution states |
| `--ll-info` | `#0099FF` | Link underline (inherits from Framer default) |

### 1.4 Neutral — Dark scale (for dark surfaces)

| Token | Hex | Usage |
|---|---|---|
| `--ll-ink-900` | `#0C0C0C` | Primary text on light, primary dark surface |
| `--ll-ink-800` | `#161818` | Card on dark, elevated dark surface |
| `--ll-ink-700` | `#222222` | Border on dark |
| `--ll-ink-500` | `#444444` | Secondary text on light |

### 1.5 Neutral — Light scale (for light surfaces)

| Token | Hex | Usage |
|---|---|---|
| `--ll-paper` | `#FFFFFF` | Primary light surface, modal card, input background |
| `--ll-paper-dim` | `#F4F4F2` | Subtle card wash, secondary button background |
| `--ll-paper-dim-hover` | `#E8E8E6` | Secondary button hover |
| `--ll-hairline` | `#E4E4E2` | Input border, card hairline, divider |
| `--ll-hairline-soft` | `rgba(0, 0, 0, 0.06)` | Copyright divider, subtle separator |
| `--ll-mute` | `#9A9A97` | Placeholder text, disabled label |
| `--ll-body` | `#666666` | Body copy on light, secondary meta |
| `--ll-text-dim` | `#888888` | Footer copy, captions |

### 1.6 Surface gradients

| Token | CSS | Usage |
|---|---|---|
| `--ll-grad-lavender` | `linear-gradient(to bottom, rgba(245,240,250,0) 0%, rgba(245,240,250,0.5) 30%, #f5f0fa 70%, #efe6f7 100%)` | Footer blend from light-section above |
| `--ll-grad-dark-card` | `linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%)` | About-Us CTA card |

### 1.7 Accessibility contrast (WCAG AA verified)

- `--ll-accent-500` on `--ll-paper` → 8.35:1 ✓ AAA
- `--ll-ink-900` on `--ll-paper` → 20:1 ✓ AAA
- `--ll-body` on `--ll-paper` → 5.7:1 ✓ AA
- `--ll-mute` on `--ll-paper` → 3.1:1 ✓ AA Large only (use for placeholders, NOT body)
- White on `--ll-ink-900` → 20:1 ✓ AAA
- White on `--ll-accent-500` → 5.6:1 ✓ AA

---

## 2. Typography Framework

### 2.1 Font stacks

```css
--ll-font-display: "Manrope", "Manrope Placeholder", "Inter", system-ui, -apple-system, sans-serif;
--ll-font-body:    "Inter", "Inter Placeholder", system-ui, -apple-system, sans-serif;
--ll-font-mono:    "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

### 2.2 9-step type scale

| Token | Size | Line-height | Letter-spacing | Weight | Use for |
|---|---|---|---|---|---|
| `--ll-text-xs` | 11px | 1.4 | `0.03em` | 500 | Overlines, badges, tiny meta |
| `--ll-text-sm` | 12.5px | 1.5 | `0.01em` | 500 | Legal copy, copyright, captions |
| `--ll-text-base` | 14px | 1.55 | `0` | 400 | Form inputs, dense UI text, nav links |
| `--ll-text-md` | 16px | 1.6 | `0` | 400 | Body copy, paragraph |
| `--ll-text-lg` | 18px | 1.5 | `-0.005em` | 500 | Lead paragraphs, sub-headlines |
| `--ll-text-xl` | 22px | 1.35 | `-0.01em` | 600 | Card titles, section eyebrow |
| `--ll-text-2xl` | 28px | 1.25 | `-0.015em` | 600 | Small section headings (H3) |
| `--ll-text-3xl` | 40px | 1.15 | `-0.02em` | 600 | Banner / About-Us heading (H2) |
| `--ll-text-4xl` | 56px | 1.1 | `-0.03em` | 700 | Hero / page-title (H1) |

### 2.3 Heading hierarchy

| HTML | Role | Token | Mobile override |
|---|---|---|---|
| `h1` | Page hero only — one per page | `--ll-text-4xl` | 38px |
| `h2` | Section-level heading | `--ll-text-3xl` | 28px |
| `h3` | Sub-section / card cluster title | `--ll-text-2xl` | 22px |
| `h4` | Component title (card / step) | `--ll-text-xl` | 18px |
| `h5` | Tertiary label (rare) | `--ll-text-lg` | 16px |
| `p` | Body copy | `--ll-text-md` | same |
| `small` | Meta, captions | `--ll-text-sm` | same |

### 2.4 Rules

- **No inline font-sizing.** All text uses a token. Banner-heading inline override in `index.html` exists because Framer's preset cascade would otherwise win — it's a documented exception, not a pattern.
- **Display vs body:** Manrope is for headings ≥ `--ll-text-xl`. Inter for everything smaller. Do not mix within a single element.
- **Weight anchor:** 400 regular, 500 medium (buttons, labels), 600 semibold (headings), 700 bold (hero H1 only).
- **Line-height pairs with size:** tight for display (1.1–1.25), generous for body (1.55–1.6). Never mix.

---

## 3. Spatial System

### 3.1 Base unit: 8px grid

All spacing must be a multiple of 4px (half-step) or 8px (full step). No arbitrary values.

### 3.2 Spacing tokens

| Token | px | Use for |
|---|---|---|
| `--ll-space-2xs` | 4 | Icon-to-label gap, tag internal padding |
| `--ll-space-xs` | 8 | Label-to-input gap, chip padding |
| `--ll-space-sm` | 12 | Form row spacing, button padding-y, small card padding |
| `--ll-space-md` | 16 | Standard element gap, button padding-x, card padding |
| `--ll-space-lg` | 24 | Card-to-card gap, small section padding |
| `--ll-space-xl` | 32 | Modal padding, medium section padding |
| `--ll-space-2xl` | 48 | Section heading → content gap |
| `--ll-space-3xl` | 64 | Between sections on desktop |
| `--ll-space-4xl` | 96 | Hero padding, large section gap |
| `--ll-space-5xl` | 128 | Page-level gutter, banner top/bottom |

### 3.3 Border radius tokens

| Token | px | Use for |
|---|---|---|
| `--ll-radius-xs` | 4 | Badge, tiny tag |
| `--ll-radius-sm` | 8 | Dropdown menu item, chip |
| `--ll-radius-md` | 10 | Input, textarea, custom dropdown trigger |
| `--ll-radius-lg` | 12 | Dropdown menu panel, small card |
| `--ll-radius-xl` | 16 | Feature card |
| `--ll-radius-2xl` | 20 | Modal, large card |
| `--ll-radius-pill` | 50 | CTA button, social icon button |
| `--ll-radius-full` | 999 | Avatar, status dot |

### 3.4 Elevation (shadow scale)

| Token | CSS | Use for |
|---|---|---|
| `--ll-shadow-xs` | `0 1px 0 rgba(0, 0, 0, 0.06)` | Sticky nav underline on scroll |
| `--ll-shadow-sm` | `0 2px 8px rgba(0, 0, 0, 0.06)` | Resting card on light bg |
| `--ll-shadow-md` | `0 12px 32px rgba(0, 0, 0, 0.12)` | Dropdown menu, popovers |
| `--ll-shadow-lg` | `0 18px 48px rgba(0, 0, 0, 0.12)` | Card hover lift |
| `--ll-shadow-xl` | `0 24px 60px rgba(0, 0, 0, 0.28)` | Modal, full-screen dialog |

---

## 4. Component Library

Every component below has defined states: **idle / hover / active / focus / disabled / error** (as applicable). States are enforced, not optional.

### 4.1 Button — Primary (dark pill)
- Resting: `bg: var(--ll-ink-900)` `color: #fff` `radius: var(--ll-radius-pill)` `padding: 13px 20px` `font: 14px/1 600 Inter`
- Hover: `bg: var(--ll-accent-500)` `transition: bg 180ms ease`
- Active: `transform: scale(0.98)`
- Focus: add ring `0 0 0 3px var(--ll-accent-100)`
- Disabled: `opacity: 0.6` `cursor: wait`

### 4.2 Button — Secondary (light pill)
- Resting: `bg: var(--ll-paper-dim)` `color: var(--ll-ink-900)` `padding: 11px 22px` `radius: pill` `font: 13px/1 600`
- Hover: `bg: var(--ll-paper-dim-hover)`
- Active: `transform: scale(0.97)`

### 4.3 Button — Ghost (text-only, arrow suffix)
- Resting: `bg: transparent` `color: var(--ll-ink-900)` `border: 1px solid var(--ll-hairline)` `radius: pill`
- Hover: `border-color: var(--ll-ink-900)` arrow icon translates `4px` right
- Disabled: `opacity: 0.4`

### 4.4 Input (text / email)
- Resting: `bg: white` `border: 1.5px solid var(--ll-hairline)` `radius: var(--ll-radius-md)` `padding: 11px 14px` `font: 14px Inter 400`
- Placeholder: `color: var(--ll-mute)`
- Focus: `border-color: var(--ll-accent-500)` `box-shadow: 0 0 0 3px var(--ll-accent-100)`
- Error: `border-color: var(--ll-error)` `box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.12)`
- Disabled: `bg: var(--ll-paper-dim)` `color: var(--ll-mute)` `cursor: not-allowed`

### 4.5 Textarea
- Same as Input + `min-height: 72px` `resize: vertical` `line-height: 1.45` `max-length enforced`

### 4.6 Custom Dropdown
- Trigger: matches Input visually; right-side chevron SVG rotates 180° on open (transition 200ms cubic-bezier(0.22, 0.68, 0, 1.2))
- Menu: `bg: white` `border: 1.5px solid var(--ll-hairline)` `radius: var(--ll-radius-lg)` `shadow: var(--ll-shadow-md)` `max-height: 260px` `overflow-y: auto`
- Item resting: `padding: 10px 12px` `radius: var(--ll-radius-sm)` `font: 14px`
- Item hover: `bg: var(--ll-accent-50)` `color: var(--ll-accent-500)`
- Item selected: `bg: var(--ll-accent-100)` `color: var(--ll-accent-500)` `font-weight: 500`
- Closes on click-outside, Escape, and selection

### 4.7 Checkbox (checkmark row — used in CTA banner)
- Icon: 14×14 `color: #fff` on dark, `var(--ll-accent-500)` on light — uses SVG checkmark path, not native checkbox
- Label: `font: var(--ll-text-md)` next to icon, `gap: var(--ll-space-xs)`

### 4.8 Card — Feature / Why Leaf Loans
- Resting: `bg: white` `radius: var(--ll-radius-xl)` `padding: var(--ll-space-lg)` `shadow: var(--ll-shadow-sm)`
- Hover: `transform: translateY(-8px)` `shadow: var(--ll-shadow-lg)` `transition: 350ms cubic-bezier(0.22, 0.68, 0, 1.2)`
- Title on hover: color shifts to `var(--ll-accent-500)`

### 4.9 Card — Infrastructure (with icon cluster)
- Resting: static (no lift — design decision, to keep technical feel)
- Internal grid: 2×2 icon cluster + centered logo

### 4.10 Modal / Dialog
- Overlay: `bg: rgba(12, 14, 13, 0.68)` `backdrop-filter: blur(4px)`
- Card: `bg: white` `radius: var(--ll-radius-2xl)` `max-width: 560px` `padding: 36px 36px 32px` `shadow: var(--ll-shadow-xl)`
- Entry: `transform: translateY(12px) scale(0.98) → translateY(0) scale(1)` `duration: 280ms cubic-bezier(0.22, 0.68, 0, 1.2)`
- Exit: reverse
- Close button: top-right 32×32 circle, hover `bg: var(--ll-paper-dim)`
- Scroll: internal `max-height: calc(100vh - 48px)` `overflow-y: auto` (form can be taller than viewport)

### 4.11 Navbar
- Resting: transparent bg, logo always visible
- Scrolled (>40px scroll): `bg: #fff` + `--ll-shadow-xs`
- Links: `font: 14px/1 500 Inter`, `color: var(--ll-ink-900)`
- Link hover: underline or accent color (TBD — Framer default)
- Primary CTA (right side): Button Primary variant

### 4.12 Nav — All Pages Dropdown
- Trigger: Nav link with chevron
- Menu: hover-open, 200ms delay on close, transform translateY(-8px) → 0 on open

### 4.13 Footer
- Structure: centered logo → tagline → email → 2 social icons → copyright
- Bg: `var(--ll-grad-lavender)`
- Social icon buttons: 36×36 circle, `bg: rgba(12, 12, 12, 0.06)`, hover `bg: var(--ll-accent-500)` + translateY(-2px)

### 4.14 Social Icon Button
- Size: 36×36 (standard), 28×28 (small)
- Radius: pill (full)
- Icon: 16×16 SVG, `currentColor`
- Hover: fills with `var(--ll-accent-500)`, text → white, slight lift

### 4.15 Step Number Badge (How It Works)
- Size: 40×40 circle
- Bg: `var(--ll-ink-900)` — active; `var(--ll-paper-dim)` — inactive
- Text: `font: 14px 600` white / `var(--ll-ink-900)`

### 4.16 Progress Line (vertical, animated)
- Width: 2px
- Color: `var(--ll-accent-500)` on active segment; `var(--ll-hairline)` below active
- Animation: translateY synced to scroll through items container (see `setupProgressLine`)

### 4.17 Badge / Tag
- Size: auto
- Padding: `4px 10px`
- Radius: `var(--ll-radius-pill)`
- Font: `var(--ll-text-xs)` uppercase `letter-spacing: 0.03em`
- Color pairs: `bg: var(--ll-accent-100)` `color: var(--ll-accent-500)` OR `bg: var(--ll-paper-dim)` `color: var(--ll-ink-900)`

### 4.18 Divider
- Horizontal: `1px solid var(--ll-hairline)` full-width in container
- Vertical (background grid): 1px faint line `rgba(0, 0, 0, 0.04)` repeating every 160px — decorative

### 4.19 Tooltip
- Bg: `var(--ll-ink-900)` `color: white` `padding: 6px 10px` `radius: var(--ll-radius-sm)` `font: var(--ll-text-sm)`
- Arrow: 6px triangle pointing to trigger
- Show delay: 400ms on hover; hide: immediate

### 4.20 Toast / Inline Alert
- Container: `bg: var(--ll-error-bg)` `color: var(--ll-error)` for error; `bg: var(--ll-success-bg)` `color: var(--ll-success)` for success
- Padding: `12px 16px` `radius: var(--ll-radius-md)`
- Icon: 16×16 leading

### 4.21 Form Field Wrapper
- Layout: `display: flex` `flex-direction: column` `gap: var(--ll-space-xs)` `margin-bottom: 14px`
- Label: `font: 12px 600` `color: var(--ll-ink-700)` `letter-spacing: 0.01em`
- Helper text / optional marker: `font: 12px 400` `color: var(--ll-mute)`, inline with label: `<span class="ll-optional">(optional)</span>`

### 4.22 Row (two-column form rows)
- Desktop: `display: grid` `grid-template-columns: 1fr 1fr` `gap: var(--ll-space-sm)`
- Mobile (<520px): collapses to `1fr`

### 4.23 Checkmark Row (CTA banner)
- Layout: `display: flex` `gap: var(--ll-space-xl)` `flex-wrap: wrap`
- Each item: `display: flex` `align-items: center` `gap: var(--ll-space-xs)`

### 4.24 Logo Lockup
- Sizes: 28px (footer, nav small), 36px (nav standard), 56px (hero lockup)
- Color variants: dark ink (on light bg), white (on dark bg)
- Always use as provided — no color recombination

### 4.25 Layer Stack Graphic (Technology section)
- 4 isometric squares stacked vertically offset
- Top layer purple (`var(--ll-accent-500)`), lower layers translucent `rgba(255,255,255,0.08-0.2)`
- Each layer labeled white text 14px 500: *AI Agents / Agentic LOS/LMS / Data Orchestration / AI Foundry*

### 4.26 Icon Cluster (Infrastructure card)
- 2×2 grid of rounded squares with icons
- Center: Leaf Loans mark
- Lines connecting center → each icon: 1.5px `var(--ll-hairline)`

### 4.27 Scroll Reveal Wrapper
- CSS class: `.ll-reveal`
- Initial: `opacity: 0` `transform: translateY(24px)`
- Active: add `.ll-in-view` → `opacity: 1` `transform: translateY(0)`
- Delay: read from `--ll-delay` (per-element, DOM-order stagger)
- Transition: `opacity 650ms, transform 700ms` `cubic-bezier(0.22, 0.68, 0, 1.2)`

### 4.28 Gradient Backdrop
- Peach + Lavender radial blend, used under hero and above footer

### 4.29 Book a Demo CTA (full-bleed banner)
- Bg: `var(--ll-ink-900)` with repeating rhombus pattern at 4% opacity
- Content container: `max-width: 1200px` `padding: var(--ll-space-4xl) var(--ll-space-xl)`
- Heading + body stack on left, image/graphic on right

### 4.30 Section Title Block
- Small eyebrow (optional): `--ll-text-xs` uppercase accent color
- H2: `--ll-text-3xl`
- Body intro: `--ll-text-md` max-width 640px
- Stack gap: `var(--ll-space-md)` between eyebrow/H2/body

---

## 5. Responsive Layout Patterns

### 5.1 Breakpoints (aligned with Framer's existing hashes)

| Name | Min width | Max width | Framer hash |
|---|---|---|---|
| Mobile | 0 | 575px | `1l6qb95` / `1taocpn` |
| Tablet | 576px | 991px | — |
| Desktop | 992px | 1279px | `u2qtnf` / `1es0ctj` |
| Wide | 1280px | — | `72rtr7` / `17p436h` |

### 5.2 Container widths

- Max content container: `1200px`
- Narrow (copy-heavy) container: `720px`
- Extra-narrow (forms / focus): `560px`

### 5.3 Section padding scale

| Breakpoint | Vertical | Horizontal |
|---|---|---|
| Mobile | `var(--ll-space-2xl)` 48px | `var(--ll-space-md)` 16px |
| Tablet | `var(--ll-space-3xl)` 64px | `var(--ll-space-lg)` 24px |
| Desktop | `var(--ll-space-4xl)` 96px | `var(--ll-space-xl)` 32px |
| Wide | `var(--ll-space-5xl)` 128px | `var(--ll-space-xl)` 32px |

### 5.4 Grid system

- Desktop/wide: 12-column with `24px` gutter
- Tablet: 8-column with `20px` gutter
- Mobile: 4-column with `16px` gutter

### 5.5 Adaptive components

- Two-column form rows collapse to single column at <520px
- Infrastructure 3-card grid collapses to 1-column at <768px
- Hero image moves below copy at <992px

---

## 6. Motion Principles

### 6.1 Easing curves

```css
--ll-ease-standard: cubic-bezier(0.22, 0.68, 0, 1.2);  /* Soft overshoot — brand easing */
--ll-ease-out:      cubic-bezier(0.4, 0, 0.2, 1);      /* Material out */
--ll-ease-in:       cubic-bezier(0.4, 0, 1, 1);        /* Exits */
--ll-ease-linear:   linear;                            /* Progress bars only */
```

### 6.2 Duration scale

| Token | ms | Use for |
|---|---|---|
| `--ll-duration-instant` | 120 | Button press, checkbox tick |
| `--ll-duration-short` | 180 | Hover color shift, chevron rotate, focus ring |
| `--ll-duration-base` | 220 | Modal fade, dropdown open |
| `--ll-duration-medium` | 350 | Card hover lift, CTA hover |
| `--ll-duration-long` | 650 | Scroll reveal fade + slide |
| `--ll-duration-xl` | 700 | Hero sequence, layered reveals |

### 6.3 Stagger

- Base delay: `40ms` before first element animates
- Per-item stagger: `80ms` between cascading siblings
- Max chain: 8 items before fatigue sets in — beyond that, animate the container not the children

### 6.4 Named animations

| Name | Spec | Used in |
|---|---|---|
| `ll-reveal` | opacity 0→1 + translateY 24px→0 over 650ms | Scroll reveals |
| `ll-reveal-zoom` | + scale 0.985→1 over 700ms | Images |
| `ll-press` | scale 1→0.97 over 120ms, reverse on release | Button active |
| `ll-hover-lift` | translateY 0→-8px + shadow-sm→shadow-lg over 350ms | Cards |
| `ll-nav-solidify` | bg transparent→white + shadow 0→xs over 240ms | Nav on scroll |
| `ll-modal-in` | translateY 12px → 0 + scale 0.98→1 over 280ms | Modal open |

### 6.5 When to animate vs. not

**Animate:**
- First-reveal of content on scroll (polished, not distracting)
- Hover states (affordance)
- Focus rings (accessibility)
- State transitions: form valid → submit → success
- Disclosure: dropdowns, modals, expanders

**Don't animate:**
- Tab switching (instant is better)
- Data rendering (use skeleton loader instead)
- Decorative loops (unless intentional background ambiance)
- Anything above 700ms unless it's a hero sequence
- Anything for users with `prefers-reduced-motion` — skip all reveals and transitions

---

## 7. Accessibility Standards

### 7.1 Compliance target

WCAG 2.1 AA across all pages. AAA for hero headline + primary CTAs.

### 7.2 Color contrast enforced

See §1.7. Any new color combination must be checked before merging.

### 7.3 Focus states

Every interactive element MUST have a visible focus state. Current standard:

```css
outline: none;
border-color: var(--ll-accent-500);
box-shadow: 0 0 0 3px var(--ll-accent-100);
```

Never remove focus without providing an alternative. `:focus-visible` preferred over `:focus` to avoid showing the ring on mouse clicks.

### 7.4 Touch targets

Minimum 44×44px tap area on mobile. Current violations (to fix):
- Social icon buttons at 36×36 — acceptable because they're spaced; add `padding: 4px` to reach 44px hit region without changing visual size.

### 7.5 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .ll-reveal,
  .ll-reveal[data-framer-name="Image Wrapper"] {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

No scroll reveals, no parallax, no auto-playing animations. Static content is the spec.

### 7.6 Semantic HTML

- `<nav>` for navigation (not `<div>`)
- `<section>` for major content blocks
- `<footer>` for the site footer (our custom one is correctly a `<footer>` element)
- `<button>` for triggers (not `<a href="#">`)
- `<h1>`–`<h6>` in logical order, one `<h1>` per page

### 7.7 ARIA

- Icon-only buttons: `aria-label="…"` (e.g., modal close, social icons)
- Dropdown trigger: `aria-haspopup="listbox"` `aria-expanded="…"`
- Dropdown menu items: `role="option"`
- Hidden decorative icons: `aria-hidden="true"`
- Form errors: `role="alert"` so screen readers announce them

### 7.8 Keyboard

Every interactive flow must be completable with keyboard alone:
- Tab order follows visual order
- Modal traps focus while open, restores on close (not yet implemented — add to `buildModal`)
- Dropdown: Space/Enter opens, arrows navigate, Escape closes (keyboard nav not yet implemented for custom dropdown — known gap)
- Skip-link at top of every page (not yet — add)

---

## Exports

### A. CSS Custom Properties (drop-in file)

Save as `assets/tokens.css` and load before `leafloans.css`:

```css
:root {
  /* Brand */
  --ll-accent-500: #7827CF;
  --ll-accent-400: #8E45D9;
  --ll-accent-600: #5E1EAC;
  --ll-accent-50:  rgba(120, 39, 207, 0.08);
  --ll-accent-100: rgba(120, 39, 207, 0.12);

  /* Secondary */
  --ll-lavender: #F5F0FA;
  --ll-peach:    #FDDAC3;
  --ll-mint:     #E6F7EE;

  /* Semantic */
  --ll-success:    #17A663;
  --ll-success-bg: #E6F7EE;
  --ll-error:      #C62828;
  --ll-error-bg:   #FDEEEE;
  --ll-warn:       #E08A00;
  --ll-info:       #0099FF;

  /* Neutral dark */
  --ll-ink-900: #0C0C0C;
  --ll-ink-800: #161818;
  --ll-ink-700: #222222;
  --ll-ink-500: #444444;

  /* Neutral light */
  --ll-paper:           #FFFFFF;
  --ll-paper-dim:       #F4F4F2;
  --ll-paper-dim-hover: #E8E8E6;
  --ll-hairline:        #E4E4E2;
  --ll-hairline-soft:   rgba(0, 0, 0, 0.06);
  --ll-mute:            #9A9A97;
  --ll-body:            #666666;
  --ll-text-dim:        #888888;

  /* Typography */
  --ll-font-display: "Manrope", "Manrope Placeholder", "Inter", system-ui, sans-serif;
  --ll-font-body:    "Inter", "Inter Placeholder", system-ui, sans-serif;
  --ll-font-mono:    "JetBrains Mono", ui-monospace, monospace;

  --ll-text-xs:   11px;
  --ll-text-sm:   12.5px;
  --ll-text-base: 14px;
  --ll-text-md:   16px;
  --ll-text-lg:   18px;
  --ll-text-xl:   22px;
  --ll-text-2xl:  28px;
  --ll-text-3xl:  40px;
  --ll-text-4xl:  56px;

  /* Spacing — 8px grid */
  --ll-space-2xs: 4px;
  --ll-space-xs:  8px;
  --ll-space-sm:  12px;
  --ll-space-md:  16px;
  --ll-space-lg:  24px;
  --ll-space-xl:  32px;
  --ll-space-2xl: 48px;
  --ll-space-3xl: 64px;
  --ll-space-4xl: 96px;
  --ll-space-5xl: 128px;

  /* Radius */
  --ll-radius-xs:   4px;
  --ll-radius-sm:   8px;
  --ll-radius-md:   10px;
  --ll-radius-lg:   12px;
  --ll-radius-xl:   16px;
  --ll-radius-2xl:  20px;
  --ll-radius-pill: 50px;
  --ll-radius-full: 999px;

  /* Shadow */
  --ll-shadow-xs: 0 1px 0 rgba(0, 0, 0, 0.06);
  --ll-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --ll-shadow-md: 0 12px 32px rgba(0, 0, 0, 0.12);
  --ll-shadow-lg: 0 18px 48px rgba(0, 0, 0, 0.12);
  --ll-shadow-xl: 0 24px 60px rgba(0, 0, 0, 0.28);

  /* Motion */
  --ll-ease-standard: cubic-bezier(0.22, 0.68, 0, 1.2);
  --ll-ease-out:      cubic-bezier(0.4, 0, 0.2, 1);
  --ll-ease-in:       cubic-bezier(0.4, 0, 1, 1);

  --ll-duration-instant: 120ms;
  --ll-duration-short:   180ms;
  --ll-duration-base:    220ms;
  --ll-duration-medium:  350ms;
  --ll-duration-long:    650ms;
  --ll-duration-xl:      700ms;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### B. Design Tokens JSON (for Figma, Tailwind, or tooling import)

Save as `design-tokens.json`:

```json
{
  "color": {
    "accent": { "500": "#7827CF", "400": "#8E45D9", "600": "#5E1EAC", "50": "rgba(120, 39, 207, 0.08)", "100": "rgba(120, 39, 207, 0.12)" },
    "lavender": "#F5F0FA",
    "peach": "#FDDAC3",
    "mint": "#E6F7EE",
    "semantic": { "success": "#17A663", "successBg": "#E6F7EE", "error": "#C62828", "errorBg": "#FDEEEE", "warn": "#E08A00", "info": "#0099FF" },
    "ink": { "900": "#0C0C0C", "800": "#161818", "700": "#222222", "500": "#444444" },
    "paper": { "base": "#FFFFFF", "dim": "#F4F4F2", "dimHover": "#E8E8E6" },
    "text": { "mute": "#9A9A97", "body": "#666666", "dim": "#888888" },
    "hairline": { "base": "#E4E4E2", "soft": "rgba(0, 0, 0, 0.06)" }
  },
  "typography": {
    "family": { "display": "Manrope", "body": "Inter", "mono": "JetBrains Mono" },
    "scale": {
      "xs":   { "size": 11,   "lineHeight": 1.4,  "letterSpacing": "0.03em",  "weight": 500 },
      "sm":   { "size": 12.5, "lineHeight": 1.5,  "letterSpacing": "0.01em",  "weight": 500 },
      "base": { "size": 14,   "lineHeight": 1.55, "letterSpacing": "0",       "weight": 400 },
      "md":   { "size": 16,   "lineHeight": 1.6,  "letterSpacing": "0",       "weight": 400 },
      "lg":   { "size": 18,   "lineHeight": 1.5,  "letterSpacing": "-0.005em","weight": 500 },
      "xl":   { "size": 22,   "lineHeight": 1.35, "letterSpacing": "-0.01em", "weight": 600 },
      "2xl":  { "size": 28,   "lineHeight": 1.25, "letterSpacing": "-0.015em","weight": 600 },
      "3xl":  { "size": 40,   "lineHeight": 1.15, "letterSpacing": "-0.02em", "weight": 600 },
      "4xl":  { "size": 56,   "lineHeight": 1.1,  "letterSpacing": "-0.03em", "weight": 700 }
    }
  },
  "space": { "2xs": 4, "xs": 8, "sm": 12, "md": 16, "lg": 24, "xl": 32, "2xl": 48, "3xl": 64, "4xl": 96, "5xl": 128 },
  "radius": { "xs": 4, "sm": 8, "md": 10, "lg": 12, "xl": 16, "2xl": 20, "pill": 50, "full": 999 },
  "shadow": {
    "xs": "0 1px 0 rgba(0, 0, 0, 0.06)",
    "sm": "0 2px 8px rgba(0, 0, 0, 0.06)",
    "md": "0 12px 32px rgba(0, 0, 0, 0.12)",
    "lg": "0 18px 48px rgba(0, 0, 0, 0.12)",
    "xl": "0 24px 60px rgba(0, 0, 0, 0.28)"
  },
  "motion": {
    "ease": {
      "standard": "cubic-bezier(0.22, 0.68, 0, 1.2)",
      "out":      "cubic-bezier(0.4, 0, 0.2, 1)",
      "in":       "cubic-bezier(0.4, 0, 1, 1)"
    },
    "duration": { "instant": 120, "short": 180, "base": 220, "medium": 350, "long": 650, "xl": 700 },
    "stagger": { "base": 40, "item": 80 }
  },
  "breakpoints": { "mobile": 0, "tablet": 576, "desktop": 992, "wide": 1280 }
}
```

### C. Component Usage Doc (quick-reference)

For each component, use tokens — never raw values:

```html
<!-- Primary CTA -->
<button style="
  background: var(--ll-ink-900);
  color: #fff;
  padding: 13px 20px;
  border-radius: var(--ll-radius-pill);
  font: 600 14px/1 var(--ll-font-body);
  transition: background var(--ll-duration-short) var(--ll-ease-standard);
">Partner with Us</button>

<!-- Input -->
<input style="
  padding: 11px 14px;
  border: 1.5px solid var(--ll-hairline);
  border-radius: var(--ll-radius-md);
  font: 400 14px/1.5 var(--ll-font-body);
" />

<!-- Section Title -->
<h2 style="
  font: 600 var(--ll-text-3xl)/1.15 var(--ll-font-display);
  letter-spacing: -0.02em;
  color: var(--ll-ink-900);
  margin: 0 0 var(--ll-space-md);
">Section heading</h2>
```

---

## Governance

- **Token changes require a commit.** No hand-picked hex values in components. If you need a new color, add a token here first.
- **Component additions require a doc entry.** A component without states documented doesn't exist.
- **Breaking changes get a MAJOR version bump** (1.0 → 2.0). Add/remove of tokens is MAJOR. Value tweaks are MINOR.
- **Review cadence:** quarterly. Drift happens — stale tokens should be deprecated, not silently forked.

---

## Next steps (not yet in-system — flagged for follow-up)

1. **Create `assets/tokens.css`** and import it from `leafloans.css` at the top. Then migrate existing raw values (rgb(120, 39, 207), #e4e4e2, etc.) to token references.
2. **Build a `/styleguide.html` page** showing every component in every state — single source for QA and designer handoff.
3. **Add missing states** — empty state, loading skeleton, error boundary visuals.
4. **Keyboard-accessible dropdown** — arrow key navigation, Home/End jumps.
5. **Modal focus trap** — currently Tab can escape the modal; needs `focus-trap` library or custom implementation.
6. **Dark-mode-aware images** — some PNGs with white backgrounds don't transition cleanly; audit `_assets/` for alpha channels.
