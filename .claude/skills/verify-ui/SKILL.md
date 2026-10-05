---
name: verify-ui
description: Verify botai visual changes in a live preview - dev server, mobile viewport, console, interactions, screenshot proof. Run after any edit to screens, components, styles or animations, before declaring the work done.
---

# Visual verification in the preview

Rule: visual correctness is proven only by what is visible in the browser. "The code looks right" is not verification. Work is not delivered without this procedure.

## When mandatory

- Any edit under `src/app/**` (screens, layout, template)
- Any edit under `src/components/**`
- Any edit to `src/app/globals.css` or Tailwind classes
- Any animation (tw-animate-css, transition, canvas) - never deliver without observing it in the browser

Can be skipped: type-only edits, config changes with no visual effect, lint fixes.

## Procedure

1. **Server** - use the `dev` preview server from `.claude/launch.json` (port 3000). If no preview launch tool is available, start the configured command in the terminal. Verify the UI in the browser.
2. **Viewport - mobile (375x812).** The product is mobile-web: a desktop screenshot proves nothing. Glance at desktop width once at the end - the screen must not fall apart.
3. **Open the exact changed screen** by direct URL (`/onboarding/<slug>`, `/register/<slug>`, `/login`, ...). The store persists in localStorage, so any step is reachable directly - no need to walk the flow from the start.
4. **Console and network** - read_console_messages (especially hydration warnings) + preview_logs. Any console error = not done.
5. **Exercise the interactions** - pick an option, press the button, confirm the transition leads to the correct next step (check against `ONBOARDING_STEPS`/`REGISTER_STEPS`); verify the button's disabled state while nothing is selected.
6. **Watch animations in motion** - reload the page to catch the `ScreenTransition` entry animation; for canvas (`SignaturePad`) draw with the cursor; for loaders wait for the auto-transition.
7. **Attach a screenshot as proof** in the reply to the user. For animations - a screenshot of the final state plus a written account of what was observed in motion.

## Checklist before "done"

- [ ] Mobile viewport: nothing falls apart, the action button is pinned to the bottom and not overlapped
- [ ] Console clean, including hydration warnings
- [ ] The transition off the screen leads where it should, and the transition ONTO the screen from the previous step works too
- [ ] Animation observed in motion, not "from the code"
- [ ] Screenshot attached to the reply
