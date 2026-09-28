# CivicTech — Design System

The visual contract for the CivicTech frontend. It is a **direct adaptation of two
reference sites**, applied to a civic-issue reporting product: the structural and
motion language of [boonglobal.io](https://www.boonglobal.io/), and the surface
language — palette, type pairing, pill geometry, fixed two-row header — of
[cloaked.com](https://www.cloaked.com/). Where the two disagree on look, cloaked.com
wins; where they disagree on motion and structure, boonglobal.io does. Everything
visual in `frontend/` resolves from the tokens and rules in this document.

---

## 0. Provenance & how to read this file

What was taken from the reference site and what was interpreted:

| Item | Source | Confidence |
| ---- | ------ | ---------- |
| Palette — cream ground `#FBF8EF`, warm ink `#130F02`, hot orange `#FF550C` | `getComputedStyle` read off the live `cloaked.com` DOM | **Observed** |
| Pill geometry — `border-radius: 1000px` controls, 8px panels | Same extraction | **Observed** |
| Fixed two-row header — 39px announcement strip + 73px nav row = 112px, solid ground, `z-index: 10` | Same extraction | **Observed** |
| Type pairing — a serif at display scale (Simula Book, 400, −0.02em) over a grotesque body (Stkbureausans, 300–400) | Same extraction | **Observed** |
| Font binaries | Substituted with free equivalents — the reference's licensed Simula Book and Stkbureausans are replaced by a **single** free family, Barlow Condensed (see §4) | **Substituted** |
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
  *Our adaptation keeps the principle and inverts the mechanism* — one family,
  positive tracking (§4).
- **Monochrome canvas.** Near-black ground, warm off-white ink. Colour appears only
  as a signal, never as decoration.
- **Hairlines, not cards.** Structure is drawn with 1px rules and edges.
- **Microcopy as instrumentation.** Small monospace, uppercase labels with wide
  tracking mark every section and metadata field — read-outs, not ornament.
  *Ours keep the size and the tracking in the single family (§4).*
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

## 2. One page, five sections

The product is a **single scrolling page**. There is no router, no page switching,
and no per-page layout. Navigation scrolls to a section; nothing unmounts.

| # | Section id | Label | Contents |
| - | ---------- | ----- | -------- |
| 01 | `#overview` | Overview | Statement hero, live civic metrics strip |
| 02 | `#issues` | Registry | Search + filters, issue grid, backing control, detail modal |
| 03 | `#report` | Report | Report-an-issue form (behind the account) |
| 04 | `#analytics` | Analytics | Category/status breakdown, resolution ring, quick stats |
| 05 | `#account` | Account | Identity strip, own figures, filed and backed lists |

Rules:

- Each section is a `<section id="…">` with `scroll-margin-top` equal to the header
  height, so anchor jumps never hide the heading under the fixed bar.
- Exactly one `<h1>` — the hero. Every section heading is an `<h2>`.
- Sections are separated by a hairline rule plus a large void (`--space-section`).
- The active nav item is derived from scroll position (`IntersectionObserver`), not
  from a click state, so deep links and manual scrolling stay consistent.

---

## 3. Colour

Warm paper ramp + exactly one hot accent. Two modes, class-toggled on `<html>`
(`.dark`). **Light is the default** — it is the reference's own setting, so the
first thing a visitor sees is the cream page the design was drawn on.

### Light (default — cream paper, values read off cloaked.com)

| Token | Value | Use |
| ----- | ----- | --- |
| `--bg` | `#FBF8EF` | Page ground (the reference's exact cream) |
| `--bg-2` | `#FFFFFF` | Raised ground: panels, modal, fields |
| `--ink` | `#130F02` | Primary text (warm near-black, never `#000`) |
| `--ink-muted` | `#5A5344` | Body copy, descriptions |
| `--ink-faint` | `#8B8271` | Metadata, labels, placeholders |
| `--rule` | `rgba(69,64,48,0.20)` | Hairlines, panel edges, inputs |
| `--rule-strong` | `rgba(69,64,48,0.42)` | Hover edges, active rails, pills |
| `--surface` | `rgba(69,64,48,0.045)` | Flat panel fill |
| `--surface-hover` | `rgba(69,64,48,0.08)` | Hover fill, selected rows |
| `--accent` | `#FF550C` | Single signal colour (the reference's orange) |
| `--accent-ink` | `#FBF8EF` | Text on accent fills |
| `--accent-soft` | `rgba(255,85,12,0.14)` | Accent tints, focus rings, selected tiles |

### Dark (the same page at night, warm rather than blue)

| Token | Value |
| ----- | ----- |
| `--bg` | `#0E0C08` |
| `--bg-2` | `#17140E` |
| `--ink` | `#F7F3E8` |
| `--ink-muted` | `#A9A293` |
| `--ink-faint` | `#7B7466` |
| `--rule` | `rgba(247,243,232,0.15)` |
| `--rule-strong` | `rgba(247,243,232,0.32)` |
| `--surface` | `rgba(247,243,232,0.04)` |
| `--surface-hover` | `rgba(247,243,232,0.085)` |
| `--accent` | `#FF6A26` |

**Accent discipline.** `--accent` may appear only as: the filled primary pill
(exactly one per view), the announcement-strip link, the sliding nav underline, a
status dot, a required-field asterisk, a selected category tile, a primary figure,
the focus ring, and 3px toast edge bars. It never fills a card, never forms a
gradient, never sets a heading, and is never used as a large background. The one
filled pill is the page's single loudest mark — if a screen has two compete for
that attention, it is wrong.

**Legacy brand ramp retired.** The old `--crimson / --orange / --blue / --sky…`
gradient ramp, gradient hairline (`.surface-lit`), sheen (`.btn-sheen`), glow
(`--ambient-*`) and `gradient-text` utilities are **removed**. Category and status
identity now comes from `--accent` plus micro label text — uppercase, weight 600,
wide tracking — not from hue.

---

## 4. Typography

**One family, site-wide: Barlow Condensed.** There is no second typeface anywhere —
display, body, labels, controls and figures are all the same voice. Role is carried
entirely by weight, size and tracking. This is a deliberate departure from the
reference's serif-over-grotesque pairing, and the one place this site does not
follow it.

| Role | Weight | Size | Tracking |
| ---- | ------ | ---- | -------- |
| Display — hero `<h1>`, `h2`–`h4`, `.display` | **600** | `--fs-hero` / `--fs-h2` | `0.01em` |
| Lead — section intros, hero subcopy | 400 | `--fs-lead` | `0.012em` |
| Body — prose, values, table content | 400 | `--fs-body` | `0.012em` |
| Controls — `.btn`, chips, choice tiles | 600 | `0.9375rem` | `0.045em` |
| Labels — `.label`, `.eyebrow` | 600 | `--fs-micro`, uppercase | `0.16em` / `0.2em` |
| Figures — `.tabular` | 500 | inherits | `0.01em` |

Tokens: `--font-condensed` is the one stack; `--font-sans`, `--font-display`,
`--font-mono` and `--font-form` all alias it, so every existing rule keeps working
while there is exactly one family to change.

Because a condensed face sets narrower and reads smaller at any given size, the whole
scale runs **one step larger** than it would in a grotesque (see the table below).

### Negative tracking is gone

A condensed face is already tight. Pulling the tracking in further makes letters touch
and turns a paragraph into a block. So every display and label rule is now
**positive** — `0.01em` at display scale, up to `0.2em` on uppercase micro labels. A
negative `letter-spacing` in this codebase is left over from an earlier design, not a
decision.

### Figures without a monospace family

`.tabular` keeps `font-variant-numeric: tabular-nums` + `font-feature-settings: "tnum"`,
and Barlow Condensed honours both — verified by measurement: every digit has the same
advance, so `1111` and `1010` are exactly the same width and columns of figures stay
aligned without a monospace face. Codes (`RDS`, `SAN`, `LGT`…) and the `n/4` counter
read as data through **tracking and weight** — 600 at `0.16em` — rather than through a
second family.

### The incident report form

Section 03 is wrapped in `.form-condensed`, but it is no longer a typographic island.
With the whole site in one family it keeps only what is genuinely form-specific: the
white paper panel, fields one step larger at `1.0625rem`, the fields' own warm tone
(`color-mix(in srgb, var(--ink) 4%, var(--bg-2))`) and a firmer hairline so an input
never reads as empty space, and an uppercase submit. Its weight ladder is the site's:
**600** for the action, labels and category codes, **500** for tiles and counters,
**400** for what the reader types.

### Scale (fluid, rem)

| Token | Size | Applied to |
| ----- | ---- | ---------- |
| `--fs-hero` | `clamp(2.625rem, 5.8vw, 4rem)` | Hero `<h1>` — 64px at 1440 |
| `--fs-h2` | `clamp(1.875rem, 3.4vw, 2.75rem)` | Section headings — 44px at 1440 |
| `--fs-h3` | `1.125rem` | Card titles |
| `--fs-lead` | `clamp(1.0625rem, 1.45vw, 1.3125rem)` | Section intros, hero subcopy |
| `--fs-body` | `1rem` | Default text |
| `--fs-small` | `0.875rem` | Metadata, helper text |
| `--fs-micro` | `0.75rem` | Eyebrows, chips, table labels |

Rules:

- Display/heading tracking `+0.01em`, `line-height: 1.05`, weight **600**. There
  is no light or thin display weight: condensed type already reads quiet at scale,
  and anything under 500 disappears on the cream ground.
- Body text `line-height: 1.7`, tracking `+0.012em`, measure capped at **68ch**.
- `.eyebrow` = `--fs-micro`, uppercase, `letter-spacing: 0.2em`, `--ink-faint`.
  Prefix with a section number: `01 — Overview`.
- Figures use `.tabular`; alignment comes from the font's own **tabular numerals**,
  not from a monospace advance.
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
- **Radius**: `--radius: 10px` for panels and inputs; `--radius-pill: 999px` for
  **every button**, chip and avatar — the reference's controls are fully rounded.
  The report panel and the hero action bar sit at `calc(var(--radius) + 6px)`.
- **Elevation**: hairline-first. `--shadow-overlay` is permitted on the modal and
  toasts, and `--shadow-paper` on the two surfaces that must be found instantly:
  the incident report panel and the hero action bar. Nothing else lifts.
- **Rules**: `.rule` = 1px `--rule` full-width divider. `.rule-accent` = 1px rule
  with a short accent segment at its left end, used once per section at most.

---

## 6. Component rules

### Header / nav — fixed, two rows
- `position: fixed; inset-inline: 0; top: 0`, `z-index: 50`, **solid `--bg`** — it
  never goes transparent over the hero, exactly as the reference's does. Total
  height `--header-h: 7rem` = `--header-strip-h: 2.5rem` + `--header-row-h: 4.5rem`
  (112px; the reference measures 113px). The token is written out rather than
  summed with `calc()`, because the scroll helpers parse it with `parseFloat`.
- **Row 1 — the announcement strip.** Live registry figures on the left (`n reports
  on record · n awaiting action [· n resolved]`), a `File a report` link in
  `--accent`, underlined, on the right, over a bottom hairline. Clauses drop on
  narrow screens; the words are never duplicated between breakpoints, because a
  screen reader would read both copies.
- **Row 2 — the nav itself.** Wordmark left, section rail centre, account cluster right.
- Scrolled (`scrollY > 8`): a bottom hairline appears, plus a soft shadow. Nothing
  moves or resizes — the header is stable chrome, not a shrinking bar.
- Brand = wordmark only (`Civic` in `--ink`, `Tech` in `--ink-muted`) at 1.5rem,
  weight 600, `0.025em` tracking. No gradient text, no animated logo tile.
- Nav items are **anchor links** to `#overview · #issues · #report · #analytics ·
  #account`. At rest they are `--ink-faint`; the active one is `--ink`, with a 2px
  `--accent` underline that **slides** between items rather than fading per item.
  The scroll spy's offset is the header's own height, never a magic number.
- Right cluster: the sign-in pill / account chip, a round theme toggle, and a menu
  button that exists **only below `md`**.
- Mobile: a drawer under the bar, items in a single column, hairline-separated,
  with the page scroll frozen while it is open.

**One cascade trap, documented because it bit us.** Tailwind's utilities are
imported before this file, so a `md:hidden` class **loses** to `.btn-icon { display:
grid }` and the mobile menu button stays visible on desktop. Controls that are
breakpoint-gated own their rule: `.btn-icon.md-hidden`.

### Buttons
| Class | Look |
| ----- | ---- |
| `.btn` | label at 0.9375rem, weight 600, `0.045em` tracking, sentence case (uppercase only on the form submit) — `--radius-pill`, `padding: 0.72rem 1.35rem` |
| `.btn-primary` | **`background: var(--accent)`**, `color: var(--accent-ink)`, no border. The page's one filled pill. |
| `.btn-ghost` | transparent, `1px solid var(--rule-strong)`, `--ink`; hover → `--surface-hover` |
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
- Labels above fields: `--fs-micro`, weight 600, uppercase, `0.16em`,
  `--ink-faint`; required marker in `--accent`.
- `.field`: transparent fill, 1px `--rule`, `--radius`, `--fs-body`, `0.75rem 0.875rem`
  padding. Focus → `--rule-strong` border + 3px `--accent-soft` ring. Errors use
  `--accent` text, never a red background.
- Category selection is a **radio-like list of hairline tiles**, not colourful
  gradient buttons: selected = `--surface-hover` fill, `--rule-strong` border,
  a small accent dot and `--ink` label.

### Chips, status & progress
- `.chip` = `--fs-micro`, weight 600, uppercase, `0.14em`, pill, 1px `--rule`,
  transparent fill, `--ink-muted` text.
- Status is a chip whose leading element is a 6px dot: reported = `--accent`,
  in-progress = `--ink-muted`, resolved = `--ink`. Hue carries no meaning — shape
  and label do, so it survives greyscale and colour-blind viewing.
- Progress: `.track` = 2px full-width `--rule` line; `.track-fill` = solid `--ink`
  (or `--accent` once, for the resolution ring). No shimmer animation.

### Figures / stats
- Big numbers: weight 500, tabular numerals, `--ink`, `clamp(1.75rem, 4vw, 2.5rem)`.
  Label below in `--fs-micro`, uppercase, `--ink-faint`.
- The four-tile stat row from the old design becomes a **single hairline strip**:
  four cells separated by 1px rules, no individual coloured fills.

### Modal
- Backdrop `rgba(8,9,10,0.72)` + `blur(10px)`; panel `--bg-2`, 1px `--rule`,
  `--radius`, `--shadow-overlay`.
- Media header as in cards, with a bottom scrim to `--bg-2`; square icon close button.
- Metadata renders as a hairline-separated definition list: micro label above,
  `--ink` value below.

### Toasts
- `--bg-2` panel, 1px `--rule`, `--radius`, left edge 3px in tone colour
  (`--accent` error, `--ink` success/info). Micro tone label, body text `--ink`.
- Bottom-right on desktop, full-width above the fold on mobile.

### Footer
- Top hairline, `--fs-small` in `--ink-faint`, brand wordmark in `--ink`.
- One line of copy plus a live count. No gradient hairline.

---

### Backing control
- A report is **backed**, not upvoted. The control is a pill: a 13px arrow plus the
  count in tabular figures. Backed state is `--accent` text on an `--accent-soft` fill with a
  `color-mix` accent hairline. Never a filled badge, never a heart.
- One backing per account, enforced by the database (see §10), so the control is a
  toggle — pressing it again withdraws the backing.
- It is `aria-pressed` and its label says which way the press will go
  ("Back ISS-0007" / "Remove your backing from ISS-0007").
- On a card, the backing pill sits above a transparent overlay button that opens
  the report. The card is an `<article>`, never a `<button>`: a button inside a
  button is invalid, and the pill has to stay independently pressable.

### Account surfaces
- The header control is the avatar — a 28px square, 2px radius, 1px
  `--rule-strong`, initials when there is no Google photo — then the first name and
  a chevron. Signed out it is a single ghost "Sign in" button; while the session
  resolves it is a hairline square.
- The dropdown (`.menu`) is the only floating surface besides the modal: `--bg-2`,
  1px `--rule`, `--radius`, `--shadow-overlay`. Its header is the name and email,
  then a two-cell hairline strip of Filed / Backed, then the actions.
- Google's mark is drawn in `currentColor`, not in its four brand colours. The
  one-accent rule wins over brand fidelity; the silhouette is unchanged.
- Section 05 is the account's own material: identity strip, four figures, then two
  hairline lists. A row is a `<button>` for the report plus a sibling icon button
  for withdrawal — never nested.
- Withdrawal is destructive, so it is two-step inside the modal: the first press
  replaces the button with the consequence and Keep it / Withdraw.
- Failure copy is a single accent line phrased as something to do. Firebase error
  codes are translated in `lib/firebaseErrors.js`; a raw SDK code never reaches the
  interface.

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

### Frame-starvation safety net

Every animation exists to serve the content, never the other way around. This was
measured, not assumed: in a throttled page the browser delivers **no animation
frames, no IntersectionObserver callbacks and no scroll events** — all three ride
the rendering steps — while `setTimeout` and `setInterval` keep running (coarsely,
about once a second). Timers are therefore the only signal that survives, and the
motion layer is built to need nothing else:

- **`framesFlowing()` tests a rate, not a frame.** Three frames must land inside
  250ms (≈12fps). One frame arriving is *not* enough: a tab crawling at 1fps would
  pass a single-frame test and then play the timeline over minutes, which reads as
  a broken page. Below the rate, the section is shown statically instead.
- **Geometry, tested directly.** `useReveal()` checks `getBoundingClientRect`
  against the viewport on mount, on two delayed probes, on `scroll` and `resize`,
  and on a 600ms poll. Any one of those firing is enough to reveal the section. The
  poll stops the instant the section has played.
- **A completion watchdog** forces the final state 2s after a reveal starts if any
  animated element still has not reached it.
- **A thrown timeline** falls back to `revealNow()` — an animation bug is never
  allowed to hide a form.
- **The fixed chrome is guarded too.** The header's entrance, the mobile drawer, and
  the theme toggle each commit their end state on a timer as well. A frozen header
  timeline would otherwise leave a fixed bar sitting 14px off-screen with its links
  faded out, and a frozen theme timeline would leave the control doing nothing.

Measured result in a fully throttled tab: the report section — the one that matters
most — reveals from an anchor jump in **~400ms** rather than never.

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
| Category & status taxonomy, seed, section registry | `frontend/src/components/constants.js` |
| Firebase bootstrap (env-driven, local fallback) | `frontend/src/lib/firebase.js` |
| Registry facade — Firestore and local behind one API | `frontend/src/lib/registry.js` |
| Local-session registry (localStorage) | `frontend/src/lib/localRegistry.js` |
| Firebase error code → sentence | `frontend/src/lib/firebaseErrors.js` |
| Session provider (Google sign-in/out) | `frontend/src/components/AuthProvider.jsx` |
| Auth context + `useAuth()` | `frontend/src/hooks/useAuth.js` |
| Live registry subscription + every write | `frontend/src/hooks/useRegistry.js` |
| Sign-in modal + unconfigured-project checklist | `frontend/src/components/AuthModal.jsx` |
| Header account control and its menu | `frontend/src/components/AccountMenu.jsx` |
| Account section (filed / backed) | `frontend/src/components/AccountSection.jsx` |
| Monochrome Google mark | `frontend/src/components/GoogleMark.jsx` |
| Firestore security rules | `backend/firestore.rules` |
| Cloud Storage security rules | `backend/storage.rules` |
| Firebase CLI config (rules, emulators) | `backend/firebase.json` |
| Environment template (committed) | `backend/.env.example` |
| Backend folder manifest (deploy/emulator scripts) | `backend/package.json` |
| Backend setup walkthrough | `FIREBASE_SETUP.md` |

---

## 10. Accounts & the registry

Every report and every backing belongs to the account that made it. That is what
makes "my record" real rather than a filter over a local array.

**Two backends, one interface.** `lib/registry.js` exposes subscribe / create /
back / withdraw / seed and hides where the data lives. With `VITE_FIREBASE_*`
present it is Firestore; with them blank it is `localStorage`, and the page runs as
a **local session** — everything works, nothing is shared, and the interface says
so in plain words instead of pretending an account exists. `AuthProvider` does the
same for the session: a Google account, or a single local stand-in identity
carrying `isDemo: true`.

**The document.** `issues/{id}` holds `code` (the public `ISS-0007` reference),
the content fields, `location.address`, `image` + `imagePath`, `authorId` /
`authorName` / `authorPhoto`, `createdAt`, and the pair `likedBy: [uid]` +
`upvotes`. Those two fields *are* the backing: one uid per account, and the rules
refuse any write where `upvotes` disagrees with `likedBy.length`. So "one account,
one backing" is a database invariant rather than a UI convention, and "reports I
backed" is simply every document whose `likedBy` contains your uid — no extra
query, no join.

**Ownership.** Only the author can change or withdraw a report, and the fields
that establish authorship (`authorId`, `authorName`, `authorPhoto`, `createdAt`,
`code`) are frozen once filed. A backing may only add or remove the caller's own
uid and must move the count with it. Public reference codes come from
`counters/registry`, advanced inside the same transaction as the report, so
`ISS-####` stays gap-free.

**Photographs** go to Storage at `issues/{uid}/…`: image types only, 5MB ceiling,
public to read because the registry is public, deleteable only by their uploader.
If a report is withdrawn the photo is cleaned up best-effort — the document is
what matters, a stranded file is not fatal.

**Secrets.** Only `VITE_*` values belong in `backend/.env`, which is gitignored;
`.env.example` is the committed template. Vite reads that file through `envDir`
in `frontend/vite.config.js` — move the backend folder and that line moves with
it. A Firebase web config is not a secret —
Vite inlines it into the bundle and Firebase hands it to every visitor by design.
Service-account JSON and admin keys must never appear in a `VITE_*` variable. The
security rules in `firestore.rules` and `storage.rules` are the boundary, and
`FIREBASE_SETUP.md` walks through creating the project and deploying them.

---

## 11. Do / Don't

| Do | Don't |
| -- | ----- |
| Let one sentence own the hero | Pack the hero with three CTAs and a badge row |
| Separate sections with void and a rule | Wrap each section in a glowing card |
| Use micro labels (uppercase, wide tracking) for instrumentation | Use emoji as interface iconography |
| Draw attention with `--accent` on ≤5% of pixels | Gradient-fill a surface |
| Use greyscale imagery with a hover reveal | Tint every image |
| Animate on scroll once, slowly | Loop any background animation |
| Set 1px rules and 2px radii | Round to 16px and stack shadows |
| Keep every real secret in the gitignored `.env` | Put a service key in a `VITE_*` variable |
| Let the security rules enforce one backing per account | Trust the interface to police the count |
| Carry hierarchy with weight, size and tracking in one family | Reach for a second typeface to signal a change of role |
| Wear the cream page by default | Flip the default to dark and call it the reference |
| Spend the accent on one filled pill per view | Fill two buttons and let them compete |
| Keep every voice in Barlow Condensed | Give the form, the nav or the figures a family of their own |
| Treat a stalled animation as a bug in the layout | Assume frames are always being delivered |
