---
name: dependency-safety
description: How dependencies are installed and pinned in botai - never install without approval, lockfile is law, no @latest, supply-chain checks after any install. Use before running npm install / npm update / npx, before adding or upgrading any package, and when a shadcn component or a new library is requested.
---

# Dependency safety in botai

npm is the one place where an outside person can run code on this machine. In August 2026 the Shai-Hulud worm shipped credential-stealing `preinstall` hooks inside `keyv`, `flat-cache` and `file-entry-cache` - packages nobody here ever chose, pulled in three levels below `eslint`. We were clean only because the lockfile was old. That is luck, not a process. This skill is the process.

## The one rule

**Never install anything without explicit approval in the current conversation.** Not a package, not an upgrade, not a shadcn component. Ask first, install after a clear yes.

"It's just a small library" and "the task needs it" are not approval. Neither is approval given for a different package earlier in the session.

## Allowed by default

- `npm ci` - installs exactly the lockfile, resolves nothing, adds nothing
- `npm run *` - project scripts

## Requires approval, every time

- `npm install <pkg>` / `npm i` / `npm add`
- `npm update`, `npm upgrade`, bumping a version in `package.json`
- `npx <anything>` - `npx` fetches from the registry and bypasses the lockfile entirely
- `npx shadcn@latest add ...` - the most likely one to run on autopilot here. Ask, and pin the version instead of `@latest`

## Lockfile is law

- `package-lock.json` is committed and is the source of truth for what versions exist.
- Never delete it "to fix" an install. A clean reinstall is `rm -rf node_modules && npm ci`, which keeps the lockfile.
- A diff that changes `package-lock.json` without a matching, approved `package.json` change is a red flag - stop and show it.

## Pinning known-bad transitive deps

Packages we do not depend on directly but that arrived compromised are pinned in `overrides` in `package.json` to the last known-good version. Entries are added when an advisory lands and removed when upstream is confirmed clean - each one gets a short comment in the commit message saying why.

## When a package is genuinely needed

The deny rules in `.claude/settings.json` block the agent, not the human - the user can always install from their own terminal. When a package is agreed on, hand the user the exact command rather than trying to route around the deny:

1. Check the version is not brand new. A version published in the last few days during an active worm wave is the risky one; a version that has been out for weeks has been looked at.
2. Install an exact version, never a range and never `@latest`.
3. Run the marker scan below, then commit `package.json` and `package-lock.json` together.

`ignore-scripts=true` in `.npmrc` is global for this project. A package that truly needs to compile a native binary will install fine and then fail at `require`. The fix is a deliberate, one-off, package-scoped rebuild - never removing the flag:

```bash
npm rebuild <pkg> --ignore-scripts=false
```

If that is needed, say so out loud in the diff - it means that dependency runs someone else's code at install time, which is worth a second thought about whether we want it at all.

## After any approved install

Run the marker scan and report the result before continuing:

```bash
find node_modules \( -name setup.mjs -o -name Math_Symbol.js -o -name bun_environment.js \) -o -name package.json -exec grep -l '"preinstall"' {} +
```

Empty output is clean. Any hit - stop, do not run the dev server or build, report to the user immediately.

Known-legitimate install scripts in this project: `sharp` and `unrs-resolver` (native binary setup). Anything else with `preinstall`/`postinstall` is treated as suspicious until proven otherwise.

## Prefer zero new dependencies

Per CLAUDE.md a new dependency is a stack change. Before proposing one, check whether the codebase already solves it (`src/lib/`, `src/config/`) or whether ~30 lines of our own code would. "A convenient library" is not an argument - every dependency is a permanent trust relationship with a stranger's GitHub account.
