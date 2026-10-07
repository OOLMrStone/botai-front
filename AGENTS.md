# AGENTS.md

botai — mobile-web Duolingo-style app for preparing students for ЕГЭ profile math. Next.js 16 (App Router, RSC) · React 19 · TypeScript strict · Tailwind 4 · shadcn (base-nova) · Zustand · tw-animate-css.

## Goals

Business goals of the project — use them to judge priorities and trade-offs, never as an excuse to break the laws below:

- **Short-term:** win the HSE scholarship for young entrepreneurs (400 000 ₽, de-facto a grant); make 5 sales in September 2026.
- **Long-term:** an app earning $40k/month — both B2C (students) and B2B (Russian online schools buy it to check homework faster).

## How the rules are organized

Three levels, each with its own zone. This file is never rewritten per feature — it is extended via skills.

- **AGENTS.md (this file)** — laws: HOW code is written here. Feature-independent.
- **SCOPE.md** — the current feature: WHAT we build and its boundaries. Read it before working on its screens.
- **Skills** — project-local skills live only in [`.claude/skills/`](.claude/skills/) as `<repo-root>/.claude/skills/<skill-name>/SKILL.md`. Personal and Codex-provided skills are only those listed in the current session's available-skills catalog, which supplies each exact `SKILL.md` path. Do not search other filesystem locations for skills. If a skill's description matches the task, following it is **mandatory** — it is not a hint. New rules and domains arrive as new skills, not as edits to this file.

The task prompt defines WHAT to build. HOW is defined by this file and the skills; a prompt can override the "how" only explicitly.

## How to choose a solution

Every "how do I implement this" is resolved by this waterfall — there are no options outside it:

1. **A skill covers the task** → follow the skill.
2. **The codebase already has an analog** (same kind of screen, call, state) → replicate the existing pattern exactly. Never invent a second way next to the first.
3. **No analog exists** → pick the simplest construction that satisfies the laws and shape it as a pattern (config + reusable unit), so the next occurrence becomes case 2.

If implementation can be divided into tasks which can be done in parallel by running agets - delegate it to agents. it both saves time and helps escape biases - agents get only context they need.

A new dependency or a stack change — only with explicit approval; "a convenient library" is not an argument.

## Commands

- `npm run dev` — dev server; manual checks go through the preview, not Bash
- `npm run lint` — ESLint
- pre-commit: husky + lint-staged (eslint --fix + prettier)

Settings live in the configs (`tsconfig.json`, `components.json`, `eslint.config.mjs`, `.prettierrc.json`, theme — `src/app/globals.css`) — they are the source of truth, do not duplicate them here.

## Git

- All work happens on `develop`; never commit or merge to `main` without an explicit request.
- Commit message — one concise English line (`add source screen + goal chart`). No body lists, no trailers; never add `Co-Authored-By`.

## Laws of the code

Breaking any of these is a bug that gets fixed before the work is delivered.

1. **One way per action.** For every kind of action the codebase has exactly one way: one navigation, one state, one backend boundary, one entry animation, one validation. A second way appearing is a bug, not a choice.
2. **One fact — one place.** Every number, text, order, path lives in exactly one module in `src/config/`; all other code reads from there. The same value repeated in two files is a bug.
3. **No literals in components.** Routes — via helpers / the route map, timings — from constants, UI texts — from COPY.
4. **Layers do not mix.** `config/` data · `hooks/` behavior · `components/` view · `stores/` state · `lib/` pure logic · `lib/api/` backend boundary. Dependencies point one way: view → behavior → data. Logic does not live in JSX.
5. **Everything external goes through `lib/api/*`.** A typed function: today `await sleep` + mock `return` + `// TODO`, later the real call. Components neither know nor care whether it is a mock.
6. **Extend with data, not by editing code.** "Another one of the same" (step, option, field) = a config entry + a minimal new file; existing code is untouched. If adding required editing someone else's code, the construction is wrong — fix the construction.
7. **If you create it, wire it.** A new helper/config/component gets all its consumers migrated in the same diff. An abstraction nobody uses, or code that bypasses it, is a bug. (Precedent in this repo: `next*Slug()` helpers were written while screens hardcoded routes past them.)
8. **Gesture surfaces own long press.** Any region where the user draws, holds, drags or repeatedly presses must use the shared local gesture-surface guard to suppress text selection, native callouts and context menus on iOS and Android. Never disable selection globally; ordinary content and form fields remain selectable.

## Write like a human

A model can hold 30 copied lines and a 500-line file in its head — a human cannot. Code is written for the human who reads it six months later:

- **Second copy — extract.** A human never copies a block, because they won't be able to read it later. Markup → component, behavior → hook, pure logic → `lib/`, data → `config/`.
- **But accidental similarity is not duplication.** A duplicate is what must change in sync; similar markup with different destinies needs no extraction.
- **A unit of code does one thing** and is named by one verb/role. Can't name it briefly — split it. `page.tsx` is composition only: config + store + hook + view component.
- **No code "for the future":** no unused exports, no "might come in handy", no commented-out chunks.
- **Errors get fixed, not silenced:** `eslint-disable`, `any`, `@ts-ignore` are forbidden — fix the cause.
- **A comment answers "why"**, the code answers "what". Restating the next line is noise.
- **A new file is indistinguishable from its neighbor** in style, structure and comment density.
- Naming: components `PascalCase.tsx` · hooks `use-*.ts` · everything else `kebab-case.ts`. Imports via `@/*`, never `../../`. Stages inside a function are separated by a blank line: read → process → result. Formatting is Prettier's job — do not argue with it.

## Definition of done

The task is not finished until:

1. `npm run lint` passes clean.
2. UI touched → the visuals are verified by eye in the preview (verify-ui skill), not by reasoning. Animations are confirmed only by observing them in the browser.
3. UI touched → it is device-fit and smooth **by construction**, per the `responsive-ui` skill: sizing from `config/layout.ts` (scale-to-fit, one place), compositor-only motion, safe-area — checked across viewport sizes, not just one phone.
4. The diff passed the laws of the code and the checklists of every triggered skill.
5. Docs describing the changed behavior (SCOPE.md etc.) are updated — code and docs never diverge.

## UI texts

All UI copy is in Russian. Rules:

- Typography (sizes, weights, heading markup) follows the `typography` skill: headings only via `ScreenHeading`, sizes only from the skill's scale.
- Hyphen `-` only; long dashes `—`/`–` are forbidden unless explicitly requested.
- No period at the end of a phrase; `!` and `?` are fine, and so are periods between sentences inside a text.
- Manual line break — a literal `\n` in the text (rendered via `whitespace-pre-line`).
- Address the user as «ты», short and lively — Duolingo tone.

These rules do not apply to code comments.

## Discussion

**Always respond to the user in Russian.** UI texts and code comments are in Russian; commit messages are in English.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
