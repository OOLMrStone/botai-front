# Frontend integration evidence - 2026-10-05

Primary baseline: approved restored unified Storefront, `refs/recovery/2026-10-05/approved-baseline` (see backend FRONTEND-RECOVERY.md). No wholesale integration stash apply. Public landing and Onest/assets retained; API hooks feed existing drawing workspace, shared AnswerInput, scrubber, ActivitySetupScreen, cards and exam filter/sort controls. Frozen contract v1.6: server attempts, HOME explicit collection/exam labels, no daily/mock lesson fallback.

## Current status

Feature browser matrix and persistence regressions PASS; all original recovery refs/stashes preserved. Bounded security patch is final in package/lock: Next + eslint-config-next16.3.8, sharp0.35.5, PostCSS8.5.23, baseline-browser-mapping2.11.0 override; existing shadcn CLI/build CSS moved to devDependencies. Actual production audit after patch: info0/low0/moderate0/high0/critical0; private JSON in backend runtime/evidence/frontend-production-audit-final.json. Clean npm ci (ignore-scripts), marker scan0/preinstall0, lifecycle review, lint89/89, API/auth/drawing43/43, TypeScript and production build PASS on Next16.3.8. Final patched production local/stage UI and fresh email verification gates remain pending; initial local production gate already passed. Both patched production images are healthy and full same-origin API roundtrip PASS. Final updated browser gate is pending external Mac unlock / available IAB. Coordinator authorized a local develop commit now to preserve the verified work, without claiming the updated UI gate PASS.

## Verified so far

- Final ESLint and design/brand/typography/behavior/persistence/onboarding guards: 89/89 PASS. Four setup tests updated from local-mock assumptions to server request, canonical favorites, no false success on shortage, multiple selections. Geometry/brand guards unchanged.
- Final TypeScript and real-mode production build PASS after all source changes. API client/auth-store/drawing regression suite43/43 PASS. Source frozen and handed to runtime for local/stage production images; final production browser origin/email checks pending.
- CUA browser on host frontend `http://localhost:13000`, real same-origin backend proxy18082, PG/private Garage/AI mock.
- Student initially empty HOME: honest empty message + catalog CTA, no Continue/lesson/daily fallback; fake OAuth disabled.
- Catalog shows server20 positions, real counts5/number, 140 topics including zero counts. Multi-number setup retains existing screen/controls.
- Browser-created collection `5a9afb0d-c48a-44dc-a253-3329944e6c8d`: numbers1+2, counts2+1; answers25/20, drawn line on item2; server graded2/3, primary2/3; exact index2. After reload and logout/login/reload, resumed same ID/index, answer20 read-only, drawing and checked result retained. Canonical favourite retained.
- Browser-created collection `807a17e3-5a4c-4995-8067-b33959f79b29`: number7 count2, drafts123/5; leave and logout/login/reload resumed same ID/index2, answer5 retained. Coexists with first collection.
- Browser-created exam `02c9291f-e149-4d3c-9b9b-cf0df9f46816`: exact20/max33; answer17 checked server, actual PNG bytes uploaded to item14 private media; unsupported persisted with null score. Favourite from exam canonical. After leave/logout/login/reload HOME shows template title + Continue exam; resumes same ID/index14/photo/unsupported. Checked on desktop1280x720 and mobile375x812.
- Additional collection16 on student belongs to separate runtime API smoke, not counted as browser-created acceptance evidence.

## Pause checkpoint

User requested pause; no stack stopped, no Git reset/stash apply/commit. Host Next dev process is tools exec session70929, port13000; command `BACKEND_URL=http://127.0.0.1:18082 npm run dev:api -- --port 13000`. Backend/PG/Garage/AI managed by runtime compose (see backend runtime docs). This process note is historical; runtime is replacing host dev with the final production container at the same local port. CUA IAB tab1 handed off, viewport375x812, Pro collection16 at `0b17f241-b2c1-43cc-9d69-f6d3a0fa90c4`. Credentials remain private `../botai-back/runtime/credentials.json`; never copy to evidence.

Additional completed CUA before pause:
- Pro account switch shows its own persisted list; student collections1,2 and7 are absent. Pro entitlement comes from profile server features, no public billing elevation.
- Browser-created Pro collection16 `0b17f241-b2c1-43cc-9d69-f6d3a0fa90c4`: invalidSVG reported through durable submission intent/client-rejection; valid actualPNG uploaded; explicit cancel retains photo/history; explicit New check creates retry intent, user reuploads bytes, finalizes and asynchronous polling returns graded2/2 marked demonstration. Mobile result/structured feedback visible. No paid AI calls.
- Screenshots saved to `docs/integration-screenshots/`: home collections mobile, exam resume mobile, AI16 result mobile. Desktop drawing/result inspected in CUA but screenshot not yet saved to file.

Small changes since last passing production build:
- Draft status says draft (does not claim empty intent photos ready); terminal photo deletion disabled; raw internal errorCode removed from student view.
- Unsaved state shown; autosave no longer disables AnswerInput while saving, grading/upload still locks editing.
- Batch check records individual finalize failures while continuing server short checks.
- Erase-all persistence bug found by independent review fixed: commitDrawing records empty array as dirty until server acknowledge. Targeted regression `полностью стёртый рисунок остаётся dirty до подтверждения сервера` PASS; TypeScript PASS. Browser erase/reload subsequently PASS (see resumed evidence below).

### Resumed persistence correction

The paused P1 has been corrected: normal Retry re-saves pending answers/drawings; explicit conflict action is labelled "Загрузить сохранённую версию" and warns that local changes will be discarded, only after successful GET. Owner-scoped in-memory attempt sessions retain answers and acknowledged revision across SPA Back/remount, and reset on account change. Delayed polling responses cannot roll back a mutation; dirty input stays bound to its base revision and remote changes produce conflict. Clean drawings accept fresh server snapshots; dirty/in-progress gesture drawings are retained. Exam shell is keyed by attempt ID.

Executable real-hook/store regressions in `scripts/test-attempt-persistence.mjs`: transport failure/retry plus failed discard GET; SPA remount and owner reset/late ACK; delayed poll vs PATCH; new answer/stroke during save ACK; clean/dirty/gesture hydration and remote conflict/no silent rebase. All8 PASS including the three independent-review cases: same-revision stale submission poll, dirty remote revision blocks PATCH, scoped discard preserves another attempt. Included in `npm run lint` (now89/89 PASS with four onboarding completion tests). Drawing suite24/24 PASS and TypeScript PASS after corrections. Independent rereview closed all5 findings. Actual CUA backend-outage/reconnect/Retry, erase-all/reload and rapid save-exit/resume PASS; exact details in FINAL-BROWSER-QA.md.

Settings level editing is now wired through shared profile fields and an awaited server PATCH; settings behavior extracted to its hook. Admin date inputs controlled, conversion to Instant at Apply; honest empty copy added following browser QA. Admin/profile/fresh-registration/onboarding/owner isolation/responsive Storefront/DB operator browser QA PASS in a separate CUA tab; no credentials in evidence.

## Final handoff gates

- Local browser matrix and preserved Storefront geometry375/320/1440 PASS; see `docs/FINAL-BROWSER-QA.md` for actual UI evidence, limits and screenshots. Browser-created persistence regression attempt94dd0188-5c60-479f-be08-e21d54d63e47: outage edits98765+stroke retained after autosave500, failed Retry, reconnect Retry, full reload. Erased last stroke persisted empty after reload.
- Real-mode onboarding ready bypasses placeholder lesson/decorative streak: guest reaches existing registration gate, already authenticated user awaits onboarding PATCH then HOME. Existing login from gate reaches Done and awaits save. Guest/auth browser routing and reload choices PASS. Mock-mode public demo screens preserved.
- Generated127.0.0.1 verification link initially blank in dev: installed Next cross-site dev allowlist excluded127; explicit loopback entry added, UI renders now. Fresh unconsumed email-link verification on final production127.0.0.1:13000 and localhost:23000 remains required; dev same-token success is not counted as production verification.
- Manual1400ms commitment longhold remains unverified because supported CUA has no hold-duration/key-down-up API. Other onboarding selections, registration, awaited saving, Mailpit delivery and verification were exercised in UI; seal was bypassed through direct next route without state/script mutation.
- Source freeze: final89 guards +43 API/auth/drawing + TypeScript + production build PASS. Runtime production build/deploy and final prod browser gates pending. Native browser Back was separately exercised before the700ms autosave delay: Back/Forward preserves43210 still dirty, then save/reload retains it and the prior stroke. No paid/live AI invoked; mock output verifies transport only, demo grades do not award XP/streak.

## Commit scope and exclusions

Approved restored unified Storefront source/assets/config/tests plus real integration and required design/integration documentation is committed locally on develop as a verified checkpoint; final patched production browser gate remains pending external unlock. Recovery refs and stashes remain intact. Private runtime credentials/env/storage are excluded. Historical untracked `BigSiteNotes.md`, `Business Model.md`, `Paywall Notes.md`, `docs/research/`, `docs/kivo-2026-sources/`, `docs/botai-kivo-2026-context.md` and unrelated mascot research notes remain on disk/recovery snapshot. Existing tracked historical changes in `prompt-tasks-training.md`, `prompt-tasks-training-handoff.md`, `docs/ui-system-audit.md` remain unstaged. No reset or deletion.

Implementation: settings level/profile avatar/admin/fresh registration and preserved mobile/desktop Storefront browser QA PASS. Exam DTO adapter retains existing filter/sort and primary points display. Real attempt routes use server checks only; retained non-routed mock helpers serve existing public demo/test consumers.

Staging checks: private credential values0matches, prohibitedruntime/env paths0. Precommit source formatting checked; only SavedAttempts.tsx and restored lemur-hang-motion.json needed formatting, without behavior change. Cached whitespace check preserves one exception: original vendored src/assets/fonts/onest-license.txt line21 has trailing space retained verbatim. Public preview HTML whitespace removed. Final production source parity is coordinated with runtime before commit.

Runtime final Dockerfile includes project .npmrc in npm-ci layer, preserving ignore-scripts policy. Frozen runtime/source manifest478 files: b63975290568371e0bded79a5f34a99c550037d59d3c1360fc9e9f32004c8f61 (sorted pathlib paths, path-NUL-bytes-NUL SHA256); exact helper/manifest kept in /tmp/botai-front-source-digest.py and /tmp/botai-front-source-manifest.json for image parity. Source changes after freeze were bounded formatting/comment/preview-whitespace and Docker context/policy hardening, reported to runtime before final rebuild.


Final bounded acceptance fixes: HOME collection CTA uses config-owned visible truncation while keeping full accessible label for all selected numbers. Next security upgrade authorized after initial production audit found20 vulnerabilities (critical1/high15/moderate4); existing Next/eslint packages and minimal compatible transitive patches only, no forced audit downgrade. Updated production dependency audit0 alllevels and build PASS; final patched production browser gate pending.

Security scope: Next16.3.8 fixes official [AVIF optimizer advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) and [next/og advisory](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j); matching ESLint config, automatic compatible sharp/PostCSS/nanoid/SWC patches and baseline override only, no forced downgrades. Existing compromised-package overrides preserved. Full development-tool audit has17 advisories (3moderate/14high) including glob/parser tooling; these are not browser/server dependencies after shadcnCLI reclassification, production audit0. Independent physical standalone inventory remains runtime reviewer gate. Marker scan found no known markers or preinstall; postinstall entries were known unrs-resolver native setup and nested private resolve testfixture lerna script, both unexecuted because ignore-scripts. Private marker evidence stored beside auditJSON.

### Final source checkpoint before production browser repeat

Exact source digest `b63975290568371e0bded79a5f34a99c550037d59d3c1360fc9e9f32004c8f61`, 478 paths. All security-updated gates PASS; runtime rebuild owns final local/stage images. No commit yet. Precommit rehearsal ran ESLint fix and Prettier successfully and source digest stayed identical, but lint-staged staging rejected newly force-added ignored `.claude/skills/*/SKILL.md`. Resolved with an exact Git allowlist for seven existing project SKILL.md files plus SCOPE.md (eight instruction artifacts). Private settings, unapproved skills and adjacent resources remain ignored; git check-ignore verifies these boundaries. Normal lint-staged rehearsal now PASS with identical source digest, no hook bypass. Final patched production CUA/fresh email verification and 320px long collection label gate remain pending. No further code work or repeated tests are needed while these gates run.

### Local commit checkpoint authorization

Final patched local ARM and stage x86 production images use source digest `b63975290568371e0bded79a5f34a99c550037d59d3c1360fc9e9f32004c8f61`; healthy and complete same-origin API roundtrip PASS on both. Updated real-browser verification is externally blocked (Mac locked, no enabled IAB surface), so no final updated UI PASS is claimed. Previous complete browser feature matrix and initial local production UI gate remain PASS for the recorded versions. Local commit on develop is authorized as durable preservation now; no push/main merge. Any later browser defect receives a separate follow-up fix.
