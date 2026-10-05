---
name: responsive-ui
description: Make every botai screen, component, layout or animation render premium and smooth on ANY phone - scale-to-fit sizing from config/layout.ts, safe-area, and compositor-only / batched-render performance. Use while building or editing any screen, layout, component, canvas or animation - it is built in during development, never a later pass.
---

# Responsive & performant UI in botai

botai is mobile-web for **every** phone, not one reference device. A screen must look like a scaled copy of the (already-good) desktop proportions and stay at 60fps on weak hardware. This is baked in **as you write the UI** - the primitives and tokens already carry it, so a new screen is born correct and later agents change nothing.

Everything flows through one system: **`src/config/layout.ts` for sizing · primitives for structure · compositor-only rules for motion · config-driven scaling for heavy render.** A screen or component never hardcodes layout classes.

## Two screen modes - pick one first

- **Fit screen** (onboarding, gates, single-viewport flows): fills exactly one viewport, **no scroll**; everything scales to fit the height. Root is `h-svh`, built with `ScreenShell`.
- **Scroll screen** (home, profile, feeds, long forms): content scrolls. Here "any device" means fluid spacing + safe-area + touch targets, **not** scale-to-fit-height. The scroll container is `overflow-y-auto overscroll-contain min-h-0 flex-1`; a CTA, if any, is sticky with safe-area bottom padding.

## Sizing - only from `src/config/layout.ts`

- No spacing/size utility written in a screen or component. Padding, gaps, heading size, card height, CTA - all come from `layout.*`. A raw `px-6` / `h-12` / `text-4xl` in a page is a bug (same rule as `COPY` and routes: one fact, one place).
- **Scale-to-fit token = `clamp(floor, N svh, desktop-ceiling)`**: the ceiling is the desktop value (the look we keep), `N svh` scales it down on shorter viewports, the floor is the readability / 44px touch minimum. A new size role = one new token in `layout.ts`, then read everywhere.
- **Tailwind gotcha:** arbitrary values are matched as *literal strings* in the source. Never build a class from a template literal / helper (`` `text-[${f()}]` ``) - Tailwind won't generate the utility. That is why `layout.ts` tokens are full literal strings.
- Fluid heading/subtitle live in `layout.heading` and are consumed **only** by `ScreenHeading` (keeps the `typography` skill's "one place" rule).
- **Form inputs keep font-size ≥ 16px** (`text-base`) - iOS Safari auto-zooms the page on focusing an input smaller than that. Never make input text fluid below `1rem`; the input's height may be tokenized but its font stays `text-base`.

## Structure - compose primitives, don't rebuild them

- `ScreenShell` - screen frame: horizontal padding, vertical rhythm, safe-area footer.
- `ScreenHeading` - fluid h1 + subtitle.
- `layout.list` + `layout.card` - options divide the free height via `flex-1`, floor = touch target, so **any number of options fits without overflow or overlap** (this is what fixed the CTA overlapping the list).
- `layout.cta` / `layout.ctaStack` - primary action(s).

A new screen composes these; it does not re-derive spacing. Need a variant → add a token/primitive, migrate every consumer in the same diff (law 7).

## Viewport lock - global, never undo it

`globals.css` sets `overscroll-behavior: none` + `overflow-x: hidden`; `layout.tsx` sets `viewport-fit=cover`. Do not reintroduce horizontal pan: **never put `w-screen` / `100vw` (or `h-screen` / `100vh`) on a full-bleed or fixed element** - use `fixed inset-0 h-full w-full` (100% of the viewport, not 100vw which overflows past the scrollbar).

## Motion - compositor-only

Animate **only `transform` and `opacity`**. The following repaint every frame and jank on mobile - never animate them:
`stroke-dashoffset`, `background-position`, `background-size`, `width` / `height` / `top` / `left`, `box-shadow`, `filter` / `blur`, `backdrop-filter`.

- Reveal / "draw-in" effects → a `transform: translateX` (or clip) wipe over the static content - see `.goal-wipe` in `globals.css` - not `stroke-dashoffset`.
- No **infinite** paint animation, and never two motion layers stacked on the heavy screen (welcome uses a particle sphere with a static chrome wordmark, without a second animated chrome layer).
- A reveal element's **base** style is its *revealed* state, so `prefers-reduced-motion` / no-animation shows the content, never a stuck cover.

## Heavy render (canvas / many nodes)

- **Device-scale the work**: fewer elements and a lower DPR cap on touch devices, from config (particle count and the DPR cap are configuration values). Pure math/geometry stays platform-agnostic in `lib/`; only the perf knobs live in config.
- **Batch draws**: one `fill` / paint per group, not per element (the particle sphere groups points into alpha bands → a handful of fills instead of one per point).
- **Never read layout inside a RAF loop** (`getBoundingClientRect` per frame forces reflow) - measure on mount / resize only.

## Checklist (run while building the UI, before done)

- [ ] No raw spacing/size/`text-*` utility in the screen/component - all sizes from `layout.*`
- [ ] Fit screen fills one viewport with **no scroll** at 640 / 812 / 900 heights; scroll screen scrolls with a sticky safe-area CTA
- [ ] No `w-screen` / `100vw`; no horizontal scroll (`scrollWidth == clientWidth`)
- [ ] Bottom actions clear the home indicator (`env(safe-area-inset-bottom)`)
- [ ] Every animation touches only `transform` / `opacity`; no infinite paint loops
- [ ] Canvas / heavy work is device-scaled, batched, and free of per-frame layout reads
- [ ] Verified in the preview across light/dark and 2+ viewport heights (`verify-ui`)
