# Final browser QA - 2026-10-05

Independent CUA browser2 verified frontend13000 against real backend18082, PostgreSQL/private S3 and AI mock. Read front AGENTS/SCOPE/INTEGRATION-EVIDENCE, backend SPEC and project verify-ui/responsive-ui skills. Starting HEAD c74f8cd6f40f89de3cc03e9bf91fe5c8d8cb39f8, uncommitted integration source changed by frontend owner during QA. QA changed no application code; only synthetic fixture accounts/data and this evidence. No paid AI or provider probe.

## Browser PASS

| Scenario | Actual result | Screenshot |
|---|---|---|
| ADMIN history/filter/detail | UI login and profile entry; statusfilter only matching rows. Native datetime fields fromOct6/toOct4 produce honest empty state; nonexistent owner UUID returns empty. Detail41696a56-88a8-4a5b-bae1-08d1a53cb508 shows structured result, exact validated JSON, lifecycle intent/upload/queue/dispatch/graded events and private PNG natural192x192, explicitly mock demonstration | final-admin-detail-375.jpg; final-admin-empty-date.jpg |
| Student admin restriction | Direct list/detail links display administrator-only message, no data. Profile exposes no admin link | final-student-admin-denied.jpg |
| Profile persistence | UI saves QA Admin / middle / daily30; fullreload and settingsreopen preserve them, unset main goal stays '-'. Actual PNGupload / reload / remove / reload passes; rerun passes after shared FileUploadButton replacement | final-profile-avatar-375.jpg; final-settings-320.jpg |
| Account isolation | Admin→student→second UI logout/login clears previous identity/collections. Second initially emptyHOME; foreign student attempt5a9afb0d-c48a-44dc-a253-3329944e6c8d shows 'Объект не найден' before/after reload with no answers/drawing | final-foreign-attempt-denied.jpg |
| Fresh registration + onboarding + email | Real question selections goalgood / levelbasics / daily45 / notificationsfalse; age/name/email/password UI creates synthetic account; doneCTA awaits API save. HOME45 remains afterreload/logout/login; settings restore all selections. Profile resend waits then says 'Письмо отправлено'; actual Mailpit delivery, same-token confirmation UI and subsequent login remove confirmation action | final-fresh-home-375.jpg; final-email-verified.jpg |
| Real ready routing | Authenticated second selects goal80-86/levelconfident/day60 through questionUI; readyCTA awaits save→HOME60; reloadprofile preserves values. Guest readyCTA→registrationgate. Existing-user login from gate→doneCTA→realHOME | final-guest-ready-register-gate.jpg |
| Storefront + responsive | Approved large root retained. Actual1440x900,375x812,320x568 document scrollWidth=clientWidth; header/hero/CTA/mascot fit, comparison table scrolls internally. Authenticated CTA→realHOME; logout removes oldidentity; guestCTA→welcome. Admin375/320 and settings320 fit | final-storefront-1440.jpg; final-storefront-375.jpg; final-storefront-320.jpg |
| Protected DB viewer | Actual Adminer18090 operatorlogin; safeoperator_attempts23rows / attempt_items50 / objects20 / submissions50 browse. Visible safecolumns exclude password/session/S3key/rawAI data; logout complete, no mutations | final-adminer-safe-attempts.jpg; final-adminer-safe-submissions.jpg |
| Erase-all + rapid resume | Browser-created seconduser attempt94dd0188-5c60-479f-be08-e21d54d63e47: draw→save→reloadline; wholelineerase→save→reloadempty. Answer123→exit/resume123; immediate124→exit/resume124, sameID | final-erased-reload.jpg |
| Native browser Back | Same dedicatedAttempt: fill43210→nativeBack in20ms (before700ms autosave)→HOME→Forward restores43210 stilldirty; awaitsave→fullreload43210 and priorstroke retained | final-native-back-draft.jpg |
| Transport Retry + reconnect | Runtime stopped only localbackend18082. UI edited98765+diagonalstroke; failedautosave and failedexplicitRetry retain both dirtydrafts. Backendrestart→Retry→saved→fullreload restores both. No OSnetwork/firewall change | final-outage-retry-keeps-drafts.jpg; final-reconnect-reload-drafts.jpg |

Screenshots are actual browser captures under docs/integration-screenshots. Broad multiattemptHOME/AI16 acceptance remains INTEGRATION-EVIDENCE.md; it was not redundantly repeated here. Initial admin emptycopy and rawHTTP transport fallback were sent to frontend owner; emptycopy fixed/retested. Playwrightfill datetime-local did not emit Reactstatechange; native setValue did, so the initial apparent datefailure is not a current reproduced product defect.

## Final patched image gate

Exact source `b63975290568371e0bded79a5f34a99c550037d59d3c1360fc9e9f32004c8f61` (478 paths), Next16.3.8; both production images healthy, same-origin API smoke PASS and production dependency audit0

| Narrow final gate | Actual result |
|---|---|
| Local and stage sessions/persistence | Independent native Safari PASS: login/HOME/catalog; local Attempt94dd0188-5c60-479f-be08-e21d54d63e47 with prior stroke + answer54321 saved/full reload; stage Attempt2e06e120-6b69-4360-9048-fbeb3e671136 with answer654 saved/full reload; bootstrap without error |
| Product admin | Actual local ADMIN rows; final-patched-local-admin-safari.png |
| Fresh generated email URLs | Both exact origins, previously unconsumed tokens: confirmation page rendered, explicit UI click → «Почта подтверждена». No hostname substitution. Screenshots final-patched-{local,stage}-email-safari.png |
| Fresh console error gate | Stage after Clear log + reload: Errors empty; local HOME after Clear log + reload: no error counter/messages. One earlier stage error counter had unknown origin; no claim of error-free entire interaction. Local1 warning counter reappears, but native AX and All panel expose no text; no claim that all warnings are resolved. Screenshots final-patched-{local,stage}-console-safari.png |
| 320px HOME accessibility | Responsive Design Mode exact320×568. AX button includes full «Продолжить подборку №1, 2, …, 20» (all20 numbers explicitly), separate «Продолжить пробник» and template title. Ordinary API-created fixtures: traininga1179ffd-c7f8-4b08-80cc-b47af9b331cb, exam551c57fc-50d7-418b-bba4-d34ac5661733; no userstate injection |
| 320px visible truncation | **NOT VERIFIED**: native scroll/raise returned noWindowsAvailable; find shortcut did not scroll the responsive canvas. final-patched-home320-safari.png proves viewport/top layout only, not clipped action. Existing broad responsive checks remain valid; this final delta needs visual inspection |

Safari QA setup restored: original Show features for web developers0 → temporary1 → verified0; inspector closed and Responsive Design Mode exited before leaving own ordinary QA window open. QA password was not saved. Old locked private window, user's Chrome/Adminer, user test@test and all existing fixtures unchanged. No paid AI

## Limits

- Supported CUA cannot automate the physical1400ms commitment hold; selections/registration/awaited onboarding persistence were tested through actual UI with direct next route bypassing only that gesture
- UI proves role/foreign-object denial; exact HTTP403/404 covered separately by backend tests
- Current unclosed evidence limits: final320 action clipping above and unreadable local Safari warning. No product failure inferred from native control limitations
