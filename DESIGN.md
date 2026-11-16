# DESIGN.md — alpgures.me

> **Read this file before changing the interface.** Every component must match it.
> Adapted from the Awesome DESIGN.md collection (VoltAgent/awesome-design-md,
> `linear.app` reference) to this site's own Slate & Bone system. Linear is the
> *starting reference only* — the tokens below are this site's actual values,
> taken from `styles.css`. Do not copy Linear's lavender, its near-black canvas,
> or its product-screenshot rhythm. This site is a dark editorial portfolio with
> a fine-line hand-drawn hero, not a SaaS marketing page.

---
version: 1
name: alpgures-me-design-system
description: "A dark editorial portfolio (Slate & Bone) built around #141518 paper, warm bone ink (#e7e4db), and a single slate blue-grey accent (#93a0b4) used sparingly. The system reads as a hand-drawn field notebook: fine-line illustration, wobbly hand-drawn radii on drawn elements, clean geometric corners on cards and buttons. Display type is Inter Light (300) with measured negative tracking. The hero is a fine-line hand-drawn mountain scene with walkers — it is the protagonist, not a product screenshot. Cards live as dark surfaces (#1b1d22) with hairline borders (#26282e). The accent slate appears on links, focus rings, and a few intentional CTAs — never decoratively."

colors:
  primary: "#93a0b4"
  on-primary: "#141518"
  primary-hover: "#a8b4c6"
  primary-focus: "#93a0b4"
  ink: "#e7e4db"
  ink-muted: "#c9c5ba"
  ink-subtle: "#97938a"
  ink-tertiary: "#6e6a62"
  canvas: "#141518"
  surface-1: "#1b1d22"
  surface-2: "#232b38"
  surface-3: "#26282e"
  hairline: "#26282e"
  hairline-strong: "#34343a"
  inverse-canvas: "#e7e4db"
  inverse-ink: "#141518"
  semantic-success: "#27a644"

typography:
  display-xl:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: -2.5px
  display-lg:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 300
    lineHeight: 1.10
    letterSpacing: -1.8px
  display-md:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: -1.0px
  headline:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: -0.6px
  card-title:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.4px
  subhead:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: -0.2px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.1px
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.05px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  eyebrow:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.4px
  mono:
    fontFamily: ui-monospace, SF Mono, Menlo
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px
  hand: 255px 15px 225px 15px / 15px 225px 15px 255px
  hand-alt: 15px 225px 15px 255px / 255px 15px 225px 15px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  work-card-featured:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  work-card-side:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  hero-scene:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.hand}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## Overview

alpgures.me is a dark editorial portfolio — **Slate & Bone**. The canvas is
`{colors.canvas}` (#141518), a warm near-black; the ink is bone (#e7e4db), warm
rather than cool gray. The single chromatic accent is **slate blue-grey**
`{colors.primary}` (#93a0b4), used on links, focus rings, and a few intentional
CTAs — never decoratively. A soft slate (`{colors.surface-2}` #232b38) marks
lifted or selected states.

The system has two corner languages, and they must not be mixed up:
- **Hand-drawn wobbly radii** (`{rounded.hand}`, `{rounded.hand-alt}`) belong to
  drawn/illustrated elements — the hero scene, hand-drawn frames, sketch-like
  callouts. They are the site's signature.
- **Geometric corners** (`{rounded.md}` 8px buttons/inputs, `{rounded.lg}` 12px
  cards) belong to UI chrome — cards, buttons, inputs. Clean, precise, quiet.

Display type is **Inter Light (300)** with negative tracking; body is Inter 400.
The hero is a **fine-line hand-drawn mountain scene with walkers** (6 walkers +
2 cats, ~90s loop, natural walk — never zombie-like, torsos must not lead the
legs). The hero is the protagonist of the page. The work carousel fades through
five projects (featured scene left + text right, two smaller side cards); only
the content inside the cards fades — card borders and backgrounds stay put.

**Key Characteristics:**
- **Dark editorial canvas** — `{colors.canvas}` (#141518), warm, not pure black.
- **Bone ink** (`{colors.ink}` #e7e4db) — warm light gray, never cool white.
- **Slate accent** (`{colors.primary}` #93a0b4) — used scarcely on links, focus, CTAs.
- **Two corner languages** — hand-drawn wobble for drawn elements, geometric for UI.
- **Inter Light display** — 300 weight, negative tracking; body 400.
- **Hand-drawn hero** — fine-line mountains, terraced village built ONTO the slope.
- **Work carousel** — fade, never slide; content fades, chrome stays put.
- **No light mode.** No second chromatic accent. No atmospheric gradients.

## Colors

### Brand & Accent
- **Slate** ({colors.primary}): The signature accent — links, focus rings, primary CTA.
- **Slate Hover** ({colors.primary-hover}): Lighter slate (#a8b4c6) — hovered links and CTAs.
- **Slate Focus** ({colors.primary-focus}): Focus-ring tint (#93a0b4).

### Surface
- **Canvas** ({colors.canvas}): Default page background — #141518, warm near-black.
- **Surface 1** ({colors.surface-1}): One step above canvas — cards, panels.
- **Surface 2** ({colors.surface-2}): Two steps above — lifted/selected states, soft accent wash.
- **Surface 3** ({colors.surface-3}): Three steps above — hairline-level lift, nested surfaces.
- **Hairline** ({colors.hairline}): 1px borders on cards and dividers.
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px borders — input focus rings.

### Text
- **Ink** ({colors.ink}): All headlines and emphasized body type — bone #e7e4db.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #c9c5ba.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #97938a — footer, meta.
- **Ink Tertiary** ({colors.ink-tertiary}): Quaternary at #6e6a62 — disabled, footnotes.

### Semantic
- **Success Green** ({colors.semantic-success}): Status indicators only.

## Typography

### Font Family
- **Inter** — the only family on the site. Display and body are the same voice;
  the weight does the work (300 display, 400 body, 500–600 emphasis).
- **NO Kalam.** Kalam was tried for the hand-drawn feel and rejected — the
  hand-drawn quality lives in the illustration and the wobbly radii, not in a
  handwriting font.
- **Mono** (`ui-monospace, SF Mono, Menlo`) — code snippets and status/ID tokens only.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 72px | 300 | 1.05 | -2.5px | Hero headline |
| `{typography.display-lg}` | 56px | 300 | 1.10 | -1.8px | Section openers |
| `{typography.display-md}` | 40px | 400 | 1.15 | -1.0px | Sub-section headlines |
| `{typography.headline}` | 28px | 500 | 1.20 | -0.6px | Card/section titles |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.4px | Work card titles |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.2px | Lead body |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.1px | Hero subhead |
| `{typography.body}` | 16px | 400 | 1.50 | -0.05px | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Card body, footer |
| `{typography.caption}` | 12px | 400 | 1.40 | 0 | Captions, meta |
| `{typography.button}` | 14px | 500 | 1.20 | 0 | Button labels |
| `{typography.eyebrow}` | 13px | 500 | 1.30 | +0.4px | Section eyebrow |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | Code, tokens |

### Principles
- **Display is Light (300), never Bold.** The hero headline reads light and open.
- **Negative tracking on display** (-2.5px at 72px); body holds near 0.
- **Eyebrow uses positive tracking** (+0.4px) — contrast against display marks it as taxonomy.
- **Mono only in code contexts.**

## Layout

### Spacing System
- **Base unit**: 4px.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px.
- Button padding: 8px vertical · 14px horizontal.

### Grid & Container
- Max content width: **1240px**, side padding 28px.
- Work carousel: featured project (large, scene left + text right) + two smaller side cards; fades through all five.
- **Horizontal scroll must be impossible, on every engine.** `overflow-x: hidden` on `html` is the belt that holds in WebKit — a 100vw breakout element can otherwise widen the document and slide the hero off-screen. Never remove it.

### Whitespace Philosophy
The dark canvas IS the whitespace. Sections separate by lift onto surface-1 panels, not by gaps in white. Within a panel, generous `{spacing.lg}` 24px gaps; `{spacing.section}` 96px between sections.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer |
| 1 (surface lift) | `{colors.surface-1}` background on canvas, 1px `{colors.hairline}` | Default cards, panels |
| 2 (surface-2 lift) | `{colors.surface-2}` background, 1px `{colors.hairline-strong}` | Featured card, hovered cards |
| 3 (focus ring) | 2px `{colors.primary-focus}` outline at 50% opacity | Focused input, focused button |

Depth is carried by the surface ladder + hairline borders. Drop shadows are
resisted on dark almost entirely. A **liquid-glass rim** (`--rim: 0.6`) is used
on glassy surfaces — keep the strength at the prototype setting unless Alp
changes it.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, status badges |
| `{rounded.sm}` | 6px | Inline tags |
| `{rounded.md}` | 8px | All buttons, form inputs |
| `{rounded.lg}` | 12px | Work cards, feature cards |
| `{rounded.xl}` | 16px | Large panels |
| `{rounded.pill}` | 9999px | Status pills, tab toggles |
| `{rounded.hand}` | 255px 15px 225px 15px / 15px 225px 15px 255px | Hand-drawn elements |
| `{rounded.hand-alt}` | 15px 225px 15px 255px / 255px 15px 225px 15px | Hand-drawn elements, alternate |

### Hero & Illustration Geometry
- The hero is a **fine-line hand-drawn scene**: mountains STAY fine-line, the
  village is a real terraced mountain village built ONTO the slope.
- Walkers move with a **natural walk** — varied paces, no zombie gait, torsos
  must not lead the legs. 6 walkers + 2 cats on a ~90s loop.
- The hero scene is the protagonist; UI chrome stays quiet around it.

## Components

### Buttons
**`button-primary`** — Slate CTA.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`.
- Hover shifts to `{colors.primary-hover}`.

**`button-secondary`** — Dark surface button.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`. 1px `{colors.hairline}` border.

### Work Carousel
**`work-card-featured`** — The featured project: large scene left + text right.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.
- Fades through all five projects; clicking a side card jumps it to featured.
- **Only the content inside the cards fades — card borders and backgrounds stay put** while scene + text crossfade. Never fade the boxes themselves.

**`work-card-side`** — The two smaller side cards.
- Same tokens as featured; smaller scene, frozen stills (only the featured scene animates).

### Hero
**`hero-scene`** — The fine-line hand-drawn mountain scene.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.display-xl}`.
- Hand-drawn wobbly radii on drawn frames; mountains fine-line; village terraced ONTO the slope.

### Navigation
**`top-nav`** — Sticky dark bar: header left, nav links, CTAs right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.
- Header reads **"Alp Güreş"** — no middle name, ever.
- Location reads **"Providence, RI – relocating June 2027"** — never name New York.

### Footer
**`footer`** — Dense link grid on `{colors.canvas}`.
- Background `{colors.canvas}`, text `{colors.ink-subtle}`, type `{typography.caption}`, padding 64px 32px.

## Do's and Don'ts

### Do
- Reserve `{colors.canvas}` (#141518) as the anchor surface.
- Use `{colors.primary}` slate ONLY for: links, focus rings, primary CTA, link emphasis.
- Use the surface ladder for hierarchy. Avoid skipping levels.
- Keep display at weight 300 and body at 400.
- Apply negative letter-spacing on display.
- Keep the hero hand-drawn and fine-line; the village terraced ONTO the slope.
- Keep walkers natural — varied paces, no zombie gait.
- Fade carousel content only; never fade the card boxes.
- Keep `overflow-x: hidden` on `html` — horizontal scroll must be impossible.
- Header "Alp Güreş", location "Providence, RI – relocating June 2027".

### Don't
- Don't use Kalam — the hand-drawn quality lives in the illustration, not a handwriting font.
- Don't name New York in the location line.
- Don't put the middle name in the header.
- Don't ship a light-mode page.
- Don't use slate as a section background or card fill.
- Don't introduce a second chromatic accent.
- Don't add atmospheric gradients or spotlight cards.
- Don't pill-round CTAs.
- Don't use `#000000` true black as the canvas.
- Don't mix the two corner languages — wobbly radii are for drawn elements only, geometric corners for UI chrome.
- Don't let the mountains go thick-line; they STAY fine-line.

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Desktop | 1280px | Default desktop layout |
| Tablet | 1024px | Card grid 3-up → 2-up |
| Mobile-Lg | 768px | Nav hamburger; single-column cards |
| Mobile | 480px | Single-column; display-xl scales toward display-md |

### Touch Targets
- CTAs hold ≥40px tap height across viewports.
- Form inputs hold ≥44px tap target on touch.

### Collapsing Strategy
- **Top nav**: links collapse to hamburger below 768px.
- **Work carousel**: featured + side cards stack below 768px.
- **Display type**: `{typography.display-xl}` 72px scales toward `{typography.display-md}` 40px on mobile.

## Iteration Guide
1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a section, decide first which surface lift it lives on.
3. Default body to `{typography.body}` at weight 400.
4. Run the Web Design Guidelines audit (`/web-design-guidelines`) before shipping UI changes.
5. Add new variants as separate component entries.
6. Treat slate as scarce: links, focus, primary CTA, link emphasis.
7. Lead with the hand-drawn hero; let the work carousel carry the projects.

## Known Gaps
- The site's exact display sizes are tuned per round; the tokens above are the
  current Round 20 values — re-measure after any hero rework.
- The walkers' motion system (walkers.js) is bespoke; its timing tokens live in
  code, not in this file.
- Light mode is not documented because the site does not ship one.
- The hand-drawn wobbly radii are CSS border-radius hacks, not true hand-drawn
  paths — they read as hand-drawn at small sizes and should not be scaled up
  beyond card-sized elements.
