---
name: add-screen
description: Recipe for adding, reordering or removing a step in the botai onboarding/registration flow - slug in the config, COPY, route file, store, screen pattern. Use for any change to the set or order of screens.
---

# Changing the screen flow

Order and transitions live in `src/config/onboarding-steps.ts` - the single source of truth. Screens know nothing about each other: each knows only its own slug, the next step is computed from the array. Progress bar, prefetch and navigation all derive from the config automatically.

## Reorder steps

Change the order in `ONBOARDING_STEPS` (or `REGISTER_STEPS`) - touch nothing else in the code. Then update the flow table in SCOPE.md and run /verify-ui on the seams.

## Add a step (onboarding)

1. **Slug** - add to the `OnboardingSlug` type and to `ONBOARDING_STEPS` at the right position.
2. **Texts** - a section in `COPY` in the same file. Copy rules are in CLAUDE.md (hyphen `-` only, no trailing period, line breaks via `\n`).
3. **Question data** (if the step is a question) - an `Option[]` array next to `SOURCE_OPTIONS`/`GOAL_OPTIONS`; icons from lucide-react or `brand-icons`.
4. **Route** - `src/app/onboarding/<slug>/page.tsx`. The layout already provides the progress bar and the back arrow, the template provides the entry animation. Pick a pattern:
   - **Question with options** → `QuestionScreen` (sample: `goal/page.tsx`)
   - **Reaction screen** → `ResultScreen`, or `ScreenShell center` + custom content (sample: `goal-result/page.tsx`)
   - **Special screen** (loader, canvas, simulation) → `ScreenShell` + a custom component in `src/components/onboarding/`
5. **Navigation** - `const { goNext } = useOnboardingFlow('<slug>')`; linear transition - `goNext()`. A branch - an explicit transition, but only via `ROUTES`; never write path strings.
6. **Store** (if the step collects an answer) - a field + setter in `src/stores/onboarding-store.ts`, don't forget `reset()`. If the answer goes to the backend - extend `OnboardingPayload` in `src/lib/api/onboarding.ts`.
7. **SCOPE.md** - add the step to the flow table.
8. **Verify** - /verify-ui: the screen itself plus the transitions from the previous step and to the next one.

For registration it is all the same with `RegisterSlug`, `REGISTER_STEPS`, `useRegisterFlow`, `registerPath`; answer fields go into the store's `registration`, validation rules - a pure function in `src/lib/validation.ts`.

## Remove a step

Remove the slug from the array and the type, delete the route folder, clean up orphaned store fields, the `COPY` section and option arrays, update SCOPE.md. TypeScript will highlight the remaining tails.
