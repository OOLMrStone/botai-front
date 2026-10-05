---
name: clean-code
description: How code is written in botai - SRP, open-closed via config, DRY, layers, naming, comments and a diff review checklist. Read before any non-trivial code edit; run the diff through the checklist before committing.
---

# Clean code in botai

Code is written for the human who will read it in six months with no context. It must read top-down like coherent prose: the "what" first, the "how" details below or in a helper.

## SRP - one thing does one job

- A function/component is named by one verb or one role. Can't name it briefly - it does too much, split it.
- A screen (page.tsx) is composition: config + store + navigation hook + view component. Noticeable logic in page.tsx is a signal to move it into a hook or component.
- A component longer than ~100 lines or with three levels of conditional JSX is a candidate for decomposition.

## Open-closed - extend with data, not by editing code

A new flow step, answer option or text is an entry in an array/`COPY` in `src/config/onboarding-steps.ts` plus, for a step, a route file (recipe: /add-screen). If adding "another one of the same" requires editing an existing component or hook - the construction is wrong, fix the construction.

## DRY - the second-copy rule

Copied a line/block a second time - stop, extract. Where to - by layer:

- markup → a component in `src/components/onboarding/`
- behavior → a hook in `src/hooks/`
- pure logic → a function in `src/lib/`
- data/numbers/texts → `src/config/`

Do not extract accidental similarity: two screens with similar markup but different destinies are not a duplicate. A duplicate is what must change in sync.

## Layers

| Layer | What lives there | What never does |
| --- | --- | --- |
| `config/` | data: steps, options, COPY, constants | logic, JSX |
| `hooks/` | behavior: navigation, effects | markup |
| `components/onboarding/` | feature view | fetches, knowledge of step order |
| `components/ui/` | shadcn primitives | manual edits beyond the wrapper |
| `stores/` | Zustand state | side effects, fetches |
| `lib/api/` | backend stubs: types + `sleep` + mock + `// TODO` | calls bypassing this layer |
| `lib/validation.ts` | pure form rules | React |

Importing "down" (components → config) is normal. Importing "sideways or up" (config → components for data - fine only for icons; hooks → components - no) is a reason to stop.

## No magic

- Meaningful numbers - named constants in `src/config/constants.ts`. One value - one place.
- Paths - only `onboardingPath()` / `registerPath()` / `ROUTES`. The string `'/onboarding/...'` in a component = a bug.
- UI texts - only from `COPY`, never inline in JSX.

## Nested corner radius - concentric corners

When a rounded block sits inside another rounded block with padding between them, the inner radius is never guessed or copied from the outer one. It is derived: `inner radius = outer radius - padding to it`. Equal radii on nested shapes at different depth look subtly wrong (the inner one reads as sharper); a mismatched arbitrary radius looks accidental.

Express it as a `calc()` against the outer's radius token, not a hardcoded pixel value - if the outer radius or the padding changes, the inner one must follow automatically. Example (`SelectableCard`, card is `rounded-xl` with `p-2.5` padding to the icon box): `rounded-[calc(var(--radius-xl)-0.625rem)]`.

## Naming and layout

- Components `PascalCase.tsx` · hooks `use-*.ts` with `useCamelCase` inside · utils/stores/configs `kebab-case.ts`.
- Imports via `@/*`, never relative `../../`.
- Stages inside a function are separated by a blank line: read data → process → prepare result → return. Do not break up related lines.
- Formatting is Prettier's job - do not argue with it.

## Comments

A comment answers "why", the code answers "what". Comment the non-obvious: a constraint, a reason for a choice, a hidden coupling (like `courseBuildMs` shared by the loader and the mock). Never restate the next line or narrate edit history. Comments are written in Russian, like the rest of the codebase.

## Diff review checklist (before committing)

- [ ] Every new function is named by one verb/role and does one job
- [ ] No copied code that must change in sync
- [ ] No inline meaningful numbers, path strings or texts bypassing `COPY`
- [ ] Logic has not settled in JSX; layers are not mixed
- [ ] Adding the next similar thing will not require editing this code (open-closed)
- [ ] Comments cover only the non-obvious
- [ ] `npm run lint` is clean; errors fixed, not silenced
