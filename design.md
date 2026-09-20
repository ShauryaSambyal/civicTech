# CivicTech — Design System

The visual contract for the CivicTech frontend. It is a **direct adaptation of the
design language used by [boonglobal.io](https://www.boonglobal.io/)**, applied to a
civic-issue reporting product. Everything visual in `frontend/` resolves from the
tokens and rules in this document.

---

## 0. Provenance & how to read this file

What was taken from the reference site and what was interpreted:

| Item | Source | Confidence |
| ---- | ------ | ---------- |
| Section structure, copy hierarchy, tone, naming | Live content extracted from `boonglobal.io` | **Observed** |
| One-page nav model, numbered/monospace eyebrow labels, hairline rules | Observed in the reference site's element breakdown | **Observed** |
| Build stack — `Nuxt.js`, `Anime.js`, `Sanity` | Awwwards nominee listing for Boon Global (Milkshake Studio, Sep 2026) | **Observed** |
| Motion — Anime.js timelines, smooth scrolling, transitions | Anime.js is credited in the Awwwards listing; the specific scroll library is our own pick (Lenis) | **Mixed** |
| Exact hex values, font binaries, spacing ramp, easing curves | Not extractable — the site is a client-rendered SPA whose CSS/JS are not served as static text | **Interpreted** |

So: the *language* (structure, restraint, typographic scale, monochrome surfaces,
single accent, hairline geometry) is the reference's. The *numbers* below are our
own calibrated implementation of it. Treat this file as the contract — if a value
here disagrees with a component, the component is wrong.

### What the reference site actually does

Content skeleton pulled from the live site, in order:

1. **Statement hero** — a single declarative sentence in very large type
   (`Behavioural insights determine whether tactical success converts to strategic victory.`)
2. **Capability block** — `## Our reasoning-based agents use validated behavioural
   models to interpret intent`, followed by three titled items:
   *Augmentation, not replacement* · *Intelligent agentic reasoning* · *Real-time adaptation*
3. **Pull-quote interstitial** — one adversarial, aphoristic line set on its own
   (`An adversary is only defeated when they decide they are defeated.`)
4. **People block** — `Meet our team of operators, scientists, and engineers.`
5. **Careers / secondary pages** reached from a single nav.

Design moves worth naming, because they are the whole style:

- **One idea per screen.** Sections are separated by large vertical voids, not boxes.
- **Type does the work.** No decorative colour; scale, weight and tracking carry
  hierarchy. Headlines are tight (`-0.03em`) and set close to `line-height: 1`.
- **Monochrome canvas.** Near-black ground, warm off-white ink. Colour appears only
  as a signal, never as decoration.
- **Hairlines, not cards.** Structure is drawn with 1px rules and edges.
- **Microcopy as instrumentation.** Small monospace, uppercase labels with wide
  tracking mark every section and metadata field — read-outs, not ornament.
- **Restraint in motion.** Slow, sparse, one moment at a time. No looping ambient
  animation behind content.

---

## 1. Design principles

1. **Minimalism is subtraction, not decoration.** Default to removing: no gradient
   text, no glow blooms, no drop-shadow stacks, no emoji as iconography.
2. **The canvas is monochrome.** Grey-scale does 95% of the work; one accent colour
   is the remaining 5%.
3. **Hierarchy comes from type.** Size, weight, tracking and case — in that order.
4. **Everything aligns to a hairline grid.** 1px rules are the only visible geometry.
5. **Motion answers the user.** It never performs on its own.
6. **Corners are near-square.** Radius is structure, and this language is structural.

---

## 2. One page, four sections

The product is a **single scrolling page**. There is no router, no page switching,
and no per-page layout. Navigation scrolls to a section; nothing unmounts.

| # | Section id | Label | Contents |
| - | ---------- | ----- | -------- |
| 01 | `#overview` | Overview | Statement hero, live civic metrics strip |
| 02 | `#issues` | Registry | Search + filters, issue grid, detail modal |
| 03 | `#report` | Report | Report-an-issue form |
| 04 | `#analytics` | Analytics | Category/status breakdown, resolution ring, quick stats |

Rules:

- Each section is a `<section id="…">` with `scroll-margin-top` equal to the header
  height, so anchor jumps never hide the heading under the fixed bar.
- Exactly one `<h1>` — the hero. Every section heading is an `<h2>`.
- Sections are separated by a hairline rule plus a large void (`--space-section`).
- The active nav item is derived from scroll position (`IntersectionObserver`), not
  from a click state, so deep links and manual scrolling stay consistent.

---

## 3. Colour

Monochrome surface ramp + exactly one accent. Two modes, class-toggled on `<html>`
(`.dark`), default dark.

### Dark (default — the reference's native setting)

| Token | Value | Use |
| ----- | ----- | --- |
| `--bg` | `#08090A` | Page ground |
| `--bg-2` | `#0D0E10` | Raised ground, modal panel |
| `--ink` | `#F2F2EF` | Primary text (warm off-white, never `#FFF`) |
| `--ink-muted` | `#9A9C9F` | Body copy, descriptions |
| `--ink-faint` | `#6A6D71` | Metadata, labels, placeholders |
| `--rule` | `rgba(242,242,239,0.13)` | Hairlines, panel edges, inputs |
| `--rule-strong` | `rgba(242,242,239,0.26)` | Hover edges, active rails |
| `--surface` | `rgba(242,242,239,0.03)` | Flat panel fill |
| `--surface-hover` | `rgba(242,242,239,0.06)` | Hover fill, selected rows |
| `--accent` | `#E11D48` | Single signal colour |
| `--accent-ink` | `#FFFFFF` | Text on accent fills |
| `--accent-soft` | `rgba(225,29,72,0.14)` | Accent tints, focus rings |

### Light

| Token | Value |
| ----- | ----- |
| `--bg` | `#F7F7F5` |
| `--bg-2` | `#FFFFFF` |
| `--ink` | `#0B0B0C` |
| `--ink-muted` | `#55585C` |
| `--ink-faint` | `#8A8D91` |
| `--rule` | `rgba(11,11,12,0.12)` |
| `--rule-strong` | `rgba(11,11,12,0.26)` |
| `--surface` | `rgba(11,11,12,0.025)` |
| `--surface-hover` | `rgba(11,11,12,0.05)` |
| `--accent` | `#D21E45` |

**Accent discipline.** `--accent` may appear only as: the active nav underline, a
status dot, a required-field asterisk, a primary figure, the focus ring, and 3px
toast edge bars. It never fills a card, never forms a gradient, never sets a
heading. If a screen has more than a handful of accent pixels, it is wrong.

**Legacy brand ramp retired.** The old `--crimson / --orange / --blue / --sky…`
gradient ramp, gradient hairline (`.surface-lit`), sheen (`.btn-sheen`), glow
(`--ambient-*`) and `gradient-text` utilities are **removed**. Category and status
identity now comes from `--accent` plus monospace label text, not from hue.

---

## 4. Typography

| Role | Family | Weights | Notes |
| ---- | ------ | ------- | ----- |
| Display | `Inter Tight` (Google Fonts) | 400 / 500 / 600 | Heroes, section and card titles. Tight tracking. |
| Body | `Inter` | 400 / 500 | Prose, form values, descriptions |
| Mono | `IBM Plex Mono` | 400 / 500 | Eyebrows, section numbers, metadata, figures, chips |

Tokens: `--font-display`, `--font-sans`, `--font-mono`.

### Scale (fluid, rem)

| Token | Size | Applied to |
| ----- | ---- | ---------- |
| `--fs-hero` | `clamp(2.5rem, 7vw, 5.25rem)` | Hero `<h1>` |
| `--fs-h2` | `clamp(1.75rem, 3.4vw, 2.75rem)` | Section headings |
| `--fs-h3` | `1.0625rem` | Card titles |
| `--fs-lead` | `clamp(1rem, 1.35vw, 1.1875rem)` | Section intros, hero subcopy |
| `--fs-body` | `0.9375rem` | Default text |
| `--fs-small` | `0.8125rem` | Metadata, helper text |
| `--fs-micro` | `0.6875rem` | Eyebrows, chips, table labels |

Rules:

- Display/heading tracking `-0.03em`; display `line-height: 0.98–1.05`.
- Body text `line-height: 1.65`, measure capped at **68ch**.
- `.eyebrow` = mono, `--fs-micro`, uppercase, `letter-spacing: 0.18em`,
  `--ink-faint`. Prefix with a section number: `01 — Overview`.
- Figures use `.tabular` (`font-variant-numeric: tabular-nums`) and are set in
  **mono** so columns align.
- No gradient-clipped text, no text shadows, no italic display copy.

---

## 5. Space, grid & geometry

```
--space-1: 0.25rem   --space-3: 0.75rem   --space-6: 1.5rem
--space-2: 0.5rem    --space-4: 1rem      --space-8: 2rem
--space-5: 1.25rem   --space-section: clamp(4.5rem, 9vw, 9rem)
```

- **Container**: `max-width: 80rem` (1280px), horizontal padding `1rem` → `1.5rem` (sm).
- **Grid**: 12-column mental model; content grids use `gap: 1px` on a `--rule`
  background to draw hairline separations between cells where a table-like read is
  wanted, otherwise plain gaps of `--space-4`.
- **Radius**: `--radius: 2px` for panels, inputs and buttons. `--radius-pill: 999px`
  is reserved for chips and avatars only.
- **Elevation**: none. Depth is expressed with `--bg-2` and hairlines. A single
  near-invisible shadow (`--shadow-overlay`) is permitted on the modal and toasts,
  where an element genuinely floats above the page.
- **Rules**: `.rule` = 1px `--rule` full-width divider. `.rule-accent` = 1px rule
  with a short accent segment at its left end, used once per section at most.

---

## 6. Component rules

### Header / nav
- Full-width, `position: sticky; top: 0`, transparent over the hero.
- Once scrolled (`scrollY > 8`), gains `--bg` at 86% opacity, `backdrop-filter: blur(18px)`
  and a bottom hairline. Height `4rem`; no logo glow, no pulsing ring.
- Brand = wordmark only (`Civic` in `--ink`, `Tech` in `--ink-muted`), display face,
  `-0.03em`. No gradient text, no animated logo tile.
- Nav items are **anchor links** to `#overview · #issues · #report · #analytics`.
  At rest they are `--ink-faint`; the active one is `--ink` with a 1px
  `--accent` underline sitting flush on the header's bottom hairline.
- Right cluster: user name (mono, `--ink-faint`) and a square theme toggle
  (`--rule` border, radius `--radius`), plus a mobile menu button.
- Mobile: a drawer under the bar, items in a single column, hairline-separated.

### Buttons
| Class | Look |
| ----- | ---- |
| `.btn` | mono-ish uppercase micro label, `--radius`, hairline border, `gap: 0.5rem` |
| `.btn-primary` | `background: var(--ink)`, `color: var(--bg)`, no border. On dark this is the site's white button. |
| `.btn-ghost` | transparent, `1px solid var(--rule)`, `--ink`; hover → `--rule-strong` + `--surface-hover` |
| `.btn-quiet` | text-only, `--ink-muted`, hover → `--ink` |

No gradients, no sheen sweeps, no translateY lifts. Press = `opacity: .85`;
hover = border/colour shift only.

### Panels / cards
- `1px solid var(--rule)`, `background: var(--surface)`, `--radius`.
- Hover: border → `--rule-strong`, background → `--surface-hover`. No transform,
  no shadow. Cursor affordance only on genuinely clickable cards.
- Media inside cards: fixed aspect ratio, `object-fit: cover`, `filter: grayscale(100%)`
  at rest → `grayscale(0)` on hover (`0.6s`). This is the signature image treatment.

### Forms
- Labels above fields: mono, `--fs-micro`, uppercase, `0.14em`, `--ink-faint`;
  required marker in `--accent`.
- `.field`: transparent fill, 1px `--rule`, `--radius`, `--fs-body`, `0.75rem 0.875rem`
  padding. Focus → `--rule-strong` border + 3px `--accent-soft` ring. Errors use
  `--accent` text, never a red background.
- Category selection is a **radio-like list of hairline tiles**, not colourful
  gradient buttons: selected = `--surface-hover` fill, `--rule-strong` border,
  a small accent dot and `--ink` label.

### Chips, status & progress
- `.chip` = mono `--fs-micro`, uppercase, `0.12em`, pill, 1px `--rule`, transparent
  fill, `--ink-muted` text.
- Status is a chip whose leading element is a 6px dot: reported = `--accent`,
  in-progress = `--ink-muted`, resolved = `--ink`. Hue carries no meaning — shape
  and label do, so it survives greyscale and colour-blind viewing.
- Progress: `.track` = 2px full-width `--rule` line; `.track-fill` = solid `--ink`
  (or `--accent` once, for the resolution ring). No shimmer animation.

### Figures / stats
- Big numbers: display face or mono, `--ink`, `clamp(1.75rem, 4vw, 2.5rem)`,
  tabular. Label below in mono `--fs-micro` uppercase `--ink-faint`.
- The four-tile stat row from the old design becomes a **single hairline strip**:
  four cells separated by 1px rules, no individual coloured fills.

### Modal
- Backdrop `rgba(8,9,10,0.72)` + `blur(10px)`; panel `--bg-2`, 1px `--rule`,
  `--radius`, `--shadow-overlay`.
- Media header as in cards, with a bottom scrim to `--bg-2`; square icon close button.
- Metadata renders as a hairline-separated definition list: mono label above,
  `--ink` value below.

### Toasts
- `--bg-2` panel, 1px `--rule`, `--radius`, left edge 3px in tone colour
  (`--accent` error, `--ink` success/info). Mono tone label, body text `--ink`.
- Bottom-right on desktop, full-width above the fold on mobile.

### Footer
- Top hairline, mono `--fs-small` in `--ink-faint`, brand wordmark in `--ink`.
- One line of copy plus a live count. No gradient hairline.

---

## 7. Motion

Two libraries, one vocabulary:

| Concern | Library | Configuration |
| ------- | ------- | ------------- |
| Inertial page scrolling + eased anchor navigation | **Lenis** (`lenis`) | `lerp: 0.09`, `autoRaf: true`, `anchors: { offset: -headerHeight }` |
| Reveals, staggers, scroll-linked drift, micro-interactions | **anime.js 4** (`animejs`) | `animate`, `createTimeline`, `stagger`, `utils`, `text.splitText`, `onScroll` |

This mirrors the reference build — its Awwwards listing credits Nuxt.js with
Anime.js, and tags the site `Transitions` + `Microinteractions`.

### Gating (what makes it safe)

- The inline script in `index.html` adds `class="motion"` to `<html>` **only** when
  JS is running and `prefers-reduced-motion: reduce` does not match.
- Every animation's *before* state lives in CSS behind `.motion …` selectors. With
  JS disabled or reduced motion on, nothing is ever hidden and no timeline is ever
  built — the page renders complete and static.
- Lenis is not constructed under reduced motion at all; native scrolling plus
  `scroll-behavior: smooth` (for anchors) takes over. `html.motion` disables that
  CSS smoothing so the two systems never double-apply.
- `prefers-reduced-motion` additionally forces `opacity: 1; transform: none` on
  anything carrying `data-anim`, as a belt-and-braces guarantee.

### The reveal engine

`useReveal()` (`hooks/useMotion.js`) observes a container **once** and builds a
single timeline from `data-anim` markers on its descendants:

| Marker | Effect |
| ------ | ------ |
| `mask` | Headline split into clip-wrapped words, wiped up (`y: 115% → 0%`), 18ms stagger, 900ms |
| `fade-up` | opacity `0 → 1`, `y: 18 → 0`, 75ms stagger |
| `scale-x` | Hairline drawn left → right (`scaleX 0 → 1`, `outExpo`, 1100ms) |
| `media` | Panel settles `scale 1.06 → 1` + fade, 1100ms |
| `stagger` | Direct children rise in sequence, 42ms apart |
| `rows` | Same but tighter and shallower (55ms, `y: 10`), for bar and list rows |

`splitText` runs with `accessible: true`: the visible words are a decorative layer
and a visually-hidden copy carries the real text, so a screen reader announces the
headline exactly once. Splitting is cached on the element, so a React re-render can
never double-wrap the text.

### Figures

Numbers never count off-screen: `useInView()` gates `useCountUp(...)`, so the count
starts when the figure scrolls into view. The resolution ring's `stroke-dashoffset`
is drawn by anime.js in the same moment, and the bar widths open with it.

### Scroll-linked and pointer motion

- `useParallax(distance)` — `onScroll({ sync: true })` drifts labels and media
  ±24px as they cross the viewport.
- `useMagnetic(strength)` — primary controls follow the pointer up to 6px, released
  with `outElastic(1, .55)`. Inert on touch (`hover: hover and pointer: fine`).
- `useStaggerIn(dependency)` — re-staggers the registry when filters change or a
  report is filed, so new content arrives instead of snapping in.

### Micro-interactions

- The header's active-section marker is a **single bar animated between measured
  link positions**, not a per-item CSS transition.
- Nav and footer links sweep a 1px underline (`.link-sweep`).
- The theme toggle flips its label out and back (remounting the label with a fresh
  state value mid-flip, 200ms).
- Toasts rise in and slide out (`inCubic`) before leaving state.
- Card imagery is greyscale at rest and takes colour on hover (0.6s).
- The issue modal runs one entrance timeline: backdrop fade → panel rise + scale →
  metadata rows. Lenis is paused while it is open, and the panel carries
  `data-lenis-prevent` so the panel scrolls rather than the page.

### Timing vocabulary

`DUR.micro 200` · `DUR.base 450` · `DUR.enter 750` · `DUR.headline 900` ·
`DUR.slow 1100` · `DUR.scroll 1200`. Easings: `outQuart` (default), `outCubic`,
`outExpo`, `inOutQuart`, `outElastic(1, .55)`. Staggers: `tight 18`, `base 42`,
`loose 75`.

### Never

No infinite ambient loops, no shimmer sweeps, no glow pulses, no marquees, no hover
translate lifts, no cursor followers, and nothing that animates while the reader is
looking somewhere else on the page.

---

## 8. Accessibility

- Text contrast ≥ 4.5:1 in both modes (`--ink` on `--bg` ≈ 16:1 dark, 17:1 light;
  `--ink-muted` ≥ 5.2:1; `--ink-faint` is decoration-only at `--fs-micro`).
- Every interactive element has a visible `:focus-visible` ring: `2px` `--accent`
  offset `2px`.
- Nav uses `<a href="#id">` with `aria-current="true"` on the active section link;
  mobile menu button carries `aria-expanded`/`aria-controls`.
- Section landmarks: one `<header>`, one `<main>` containing `<section aria-labelledby>`
  elements, one `<footer>`. Headings are never skipped.
- Status is never communicated by colour alone (dot + label text).
- Reduced-motion honoured globally; scroll-behavior switched to `auto`.
- Greyscale-by-default imagery means no information depends on colour rendition.

---

## 9. File map

| Concern | Location |
| ------- | -------- |
| Tokens, base, utilities, motion before-states | `frontend/src/index.css` |
| Font links, no-flash theme + motion script | `frontend/index.html` |
| Single-page composition | `frontend/src/App.jsx` |
| Motion vocabulary (durations, easings, splitText) | `frontend/src/lib/motion.js` |
| Reveal engine, in-view, parallax, magnetic, re-stagger | `frontend/src/hooks/useMotion.js` |
| Lenis instance, anchor navigation, scroll lock | `frontend/src/hooks/useSmoothScroll.js` |
| Count-up, scroll-spy, scrolled-state, reduced motion | `frontend/src/hooks/useAnimation.js` |
| Anchor nav + animated indicator + drawer | `frontend/src/components/NavBar.jsx` |
| Section shell (number, eyebrow, heading) | `frontend/src/components/Section.jsx` |
| Hero | `frontend/src/components/Hero.jsx` |
| Issues registry | `frontend/src/components/IssuesSection.jsx` |
| Report form | `frontend/src/components/ReportSection.jsx` |
| Analytics | `frontend/src/components/AnalyticsSection.jsx` |
| Closing statement / people block / footer | `frontend/src/components/Footer.jsx` |
| Issue modal | `frontend/src/components/IssueDetailModal.jsx` |
| Toasts (host) | `frontend/src/components/Toast.jsx` |
| Toast bus (framework-free) | `frontend/src/components/toastBus.js` |
| Magnetic pointer wrapper | `frontend/src/components/Magnetic.jsx` |
| Category & status taxonomy | `frontend/src/components/constants.js` |

---

## 10. Do / Don't

| Do | Don't |
| -- | ----- |
| Let one sentence own the hero | Pack the hero with three CTAs and a badge row |
| Separate sections with void and a rule | Wrap each section in a glowing card |
| Use mono labels for instrumentation | Use emoji as interface iconography |
| Draw attention with `--accent` on ≤5% of pixels | Gradient-fill a surface |
| Use greyscale imagery with a hover reveal | Tint every image |
| Animate on scroll once, slowly | Loop any background animation |
| Set 1px rules and 2px radii | Round to 16px and stack shadows |
