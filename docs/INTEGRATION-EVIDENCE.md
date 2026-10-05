# Frontend integration evidence - 2026-10-05

Approved restored unified Storefront on primary develop: `refs/recovery/2026-10-05/approved-baseline` = `3fff0f53a43905c13ed66a9bbfac3e02428d4ac8`. Public landing, Onest/assets, shared rich drawing/editor/navigation and desktop/mobile layouts preserved; no wholesale integration stash apply. Frozen backend contract v1.6

## Current result

- Product commit `6bcd2821a430268cfcee37eccde9f5fff7490423` on develop; no push/main merge. Exact deployed source digest `b63975290568371e0bded79a5f34a99c550037d59d3c1360fc9e9f32004c8f61`, 478 paths, unchanged after normal precommit hooks
- ESLint +89 design/brand/typography/behavior/persistence/onboarding guards, 43 API/auth/drawing regressions, TypeScript and real production build PASS. Geometry/brand guards not relaxed; no new dependencies
- Next/eslint-config-next16.3.8; sharp0.35.5, PostCSS8.5.23, baseline-browser-mapping2.11.0 override; existing shadcn CLI/build CSS moved to devDependencies. Clean npm ci with ignore-scripts, known-marker/preinstall scan0 and lifecycle review PASS. Actual production audit0 all levels; independent source/image review PASS. Development-tool audit17 remains (14high/3moderate), absent from production standalone. Private audit/marker JSON retained in backend runtime/evidence
- Local ARM `http://127.0.0.1:13000` and isolated stage x86 `http://localhost:23000` production images healthy, exact source parity, complete same-origin API roundtrip PASS. PostgreSQL/private Garage/AI mock; no paid/live AI calls
- Final native Safari login/HOME/catalog and exact persisted answer/stroke reload PASS on both new images. Fresh unconsumed generated email URLs on both exact origins rendered and explicit UI confirmation succeeded. Fresh console reload Errors0; local Safari warning1 has no readable text. Final320 full accessible action label PASS; visual action clipping is not proven because native scroll/raise failed. Details and screenshots: FINAL-BROWSER-QA.md
- Safari temporary Develop setting restored to original0, inspector closed, Responsive Design Mode exited; user Chrome/Adminer and locked private Safari untouched. Own ordinary QA window left open; no QA password saved

## Actual browser flow evidence

Broad CUA matrix used real backend18082, PG/private S3/AI mock, not API automation substituted for UI

| Flow | Actual browser evidence |
|---|---|
| Fresh HOME/catalog | Honest empty message/catalog CTA, no daily task/demo lesson fallback. Server20 positions/140 topics, real counts5 per fixture position, zero topics retained; multi-number setup preserves shared controls |
| Two saved collections | `5a9afb0d-c48a-44dc-a253-3329944e6c8d`: №1count2+№2count1, answers25/20, drawing item2, server2/3 and exact index2. `807a17e3-5a4c-4995-8067-b33959f79b29`: №7count2, drafts123/5, index2. Both coexist; leave/logout/login/reload resumes each exact ID/index/answer/drawing/result, canonical favourite retained |
| Saved exam | `02c9291f-e149-4d3c-9b9b-cf0df9f46816`:20/max33, answer17 checked on server, actualPNG item14, unsupported null score, canonical favourite. Leave/logout/login/reload HOME names exam/template; resumes same ID/index14/photo/status. Desktop1280×720/mobile375×812 |
| Photo/AI16 | Pro `0b17f241-b2c1-43cc-9d69-f6d3a0fa90c4`: invalidSVG durable rejection, actualPNG upload, cancel retains photo/history, explicit new intent/reupload/finalize/poll returns mock graded2/2 with structured feedback. No paid accuracy claim or fake XP/streak |
| Persistence regressions | Second-user `94dd0188-5c60-479f-be08-e21d54d63e47`: erase last stroke/save/reload empty; quick123→124 exit/resume; native Back20ms before700ms autosave→Forward retains43210 dirty→save/reload. Backend-only outage:98765+stroke survives failed autosave/Retry; restart→Retry Saved→reload retains both |
| Admin/profile/isolation | Real ADMIN list/status/user/date filters, honest empty state; detail41696a56-88a8-4a5b-bae1-08d1a53cb508 events/result/exact validated JSON/privatePNG. Student admin denied; foreign attempt no data. Profile name/level/daily goal PATCH/save/reload, actual avatar upload/remove/reload. Separate accounts show only own attempts |
| Registration/onboarding | Fresh age/name/email/password UI, question goal/level/daily choices, awaited save→HOME and reload/logout/login persistence; resend waits and Mailpit delivery verified. Real ready guest→registration/login→await plan save→HOME, authenticated user directly awaits save→HOME. Placeholder lesson/decorative streak only old mock flow |
| Preserved geometry/DB viewer | Storefront1440/375/320 no horizontal page overflow; comparison table internal scroll. Admin375/320/settings320 fit. Actual read-only Adminer safe attempts/items/objects/submissions inspected, no passwords/session/rawAI/S3 keys; logout, no mutations |

Persistence ownership corrections: ordinary retry retains unsaved input, explicit conflict discard clears scoped drafts only after successful GET; owner-scoped memory survives SPA routes, resets on account change. Late GET/ACK cannot undo newer edits; dirty input remains bound to base revision and remote changes conflict. Clean drawing hydration accepts server state, gestures/dirty drawings preserved, erase-all sends dirty[]. Eight actual hook/store regressions and independent rereview closed all5 findings

## Remaining limits

- Final320 all20-number CTA has full AX label and distinct collection/exam labels, but its visible clipping needs direct visual confirmation; screenshot proves viewport/top layout only
- Fresh console Errors0 is a narrow reload result. Local1 warning is unreadable through native Safari tooling; one earlier stage error counter had unknown origin, so no claim of an entirely error-free interaction
- Physical1400ms onboarding seal hold could not be automated with supported CUA; other selections/registration/awaited saves were exercised, direct next route bypassed only that gesture
- AI output tested only strict mock transport; no paid mathematical accuracy or live production certification. Other extended numbers remain unsupported rather than false zero grades

## Preservation and commit scope

Approved source/assets/config/tests and required integration/design/project instructions saved locally. Six recovery refs and five original stashes unchanged. Private credentials/env/storage excluded; staged secret/prohibited-path scans0. Historical untracked Business Model/Paywall Notes/BigSiteNotes/research/mascot notes remain on disk; tracked `prompt-tasks-training.md`, `prompt-tasks-training-handoff.md`, `docs/ui-system-audit.md` remain separately unstaged. Original vendored Onest licence trailing whitespace preserved verbatim

Exact source helper `/tmp/botai-front-source-digest.py`: sorted pathlib paths, UTF8 path-NUL-bytes-NUL SHA256 over src/public/scripts and explicit build configs. Project .npmrc ignore-scripts is copied into Docker npm layer; context excludes secrets/history/research. Exact allowlist tracks seven project SKILL.md plus SCOPE while private Claude settings/resources remain ignored; normal hooks run without bypass
