---
name: typography
description: Typography system of botai - the type scale, ScreenHeading, alignment and emphasis rules. Use for any change to text appearance on screens - headings, subtitles, captions, sizes, weights.
---

# Typography in botai

One scale for the whole app. A size that is not in the table does not appear on a screen: a new text role is first added here, then used.

## Scale

| Role | Classes | Where |
| --- | --- | --- |
| Hero heading (h1) | `font-semibold leading-tight`, 28-36px scaled to viewport height | onboarding, registration and celebrations via `ScreenHeading variant="screen"` (default) |
| App heading (h1) | `font-semibold leading-tight`, 24-28px scaled to viewport width | tab catalogs, home greeting, profile name and quiz setup via `ScreenHeading variant="app"` |
| Navigation heading (h1) | `text-2xl font-semibold leading-tight` | compact header beside a back button via `ScreenHeading variant="navigation"` |
| Task heading (h1) | `font-semibold leading-snug`, fluid 18-22px | quiz instructions via `ScreenHeading variant="task"` |
| Task condition | `text-base leading-relaxed text-foreground` | problem data under a task heading |
| Subtitle under h1 | muted 16-18px for hero; muted 16px for app/navigation | only inside `ScreenHeading` |
| Emphasis body | `text-lg` (foreground) | standalone text the user must read attentively (the commitment promise) |
| Body / labels | `text-base`, card labels `font-medium` | forms, buttons, option cards |
| Secondary | `text-sm text-muted-foreground` | card descriptions, inline hints |
| Caption | `text-xs text-muted-foreground` | dates, fine print, «Очистить» |
| Display number | `text-6xl font-bold tabular-nums` | streak counter and similar celebration numbers |
| Brand wordmark | `text-6xl` hero / `text-4xl` navigation / `text-2xl` compact / inherited inline, `font-semibold`; «ботai», металлическое отражение ai | the botai logo, only via `Wordmark` |

| Landing hero (h1) | `font-semibold leading-[1.04]`, fluid 44-72px by viewport width | storefront via `ScreenHeading variant="landingHero"` |
| Landing section (h2) | `font-semibold leading-[1.1]`, fluid 32-52px by viewport width | storefront via `ScreenHeading variant="landingSection" as="h2"` |
| Landing card (h3) | `text-2xl font-semibold leading-tight` | storefront via `ScreenHeading variant="landingCard" as="h3"` |

## Rules

- Гарнитура продукта - локальный Onest Variable 100–900: кириллица, латиница и цифры через единственный next/font в root layout. Используемые роли: текст 400, действия 500, заголовки и Wordmark 600, display-числа 700. Веса 800/900 запрещены guard. Текст условий наследует её; KaTeX остаётся исключением для математических метрик
- Межбуквенный интервал один: `--tracking-ui: 0em` в теме, normal kerning. Локальные tracking-утилиты, fontFamily и letterSpacing запрещены; иерархия задаётся размером, весом и интерлиньяжем
- Группы настроек используют `FormSection`: legend отделён от содержимого явным зазором 12 px. Не использовать flex gap как замену зазору под legend


- Every screen heading goes through `ScreenHeading` (`src/components/onboarding/ScreenHeading.tsx`). A hand-rolled `<h1>` on a screen is a bug - the scale must change in one place.
- Pick the role from `layout.heading.variants`, not from the feature that first introduced the component. A tall phone must not enlarge a catalog heading: app typography depends on width, while hero typography follows fit-screen height. Every role defines its line-height explicitly; arbitrary font sizes must not inherit the body's loose line-height.
- Long names and email fallbacks wrap inside the available width. Never truncate a screen title or add a local font-size override to fit one example.
- The botai logo is rendered only via `Wordmark` (`src/components/onboarding/Wordmark.tsx`) - the single source of its styling: «ботai», Onest для всего слова и металлический градиент для `ai` (`.wordmark-ai` in `globals.css`). On welcome it is passed as the `ScreenHeading` `title` (ReactNode), with the subtitle from COPY below it. Never re-style the wordmark inline.
- `title` accepts ReactNode; `subtitle` is plain text.
- Inline emphasis inside a heading (one word or several, anywhere in the phrase) - mark it with `*asterisks*` in the COPY string and render through `HighlightText` (`src/components/onboarding/HighlightText.tsx`), e.g. `title: 'Ответь всего на *три* вопроса'` → `<ScreenHeading title={<HighlightText text={COPY.x.title} />} />`. Never hand-build a `<span className="italic">` accent in a page - that is a second way for the same thing.
- Headings and subtitles support manual line breaks: `\n` in COPY, rendered via `whitespace-pre-line`; long lines are balanced by `text-balance`.
- No arbitrary values (`text-[17px]`) and no one-off sizes bypassing the table.
- Alignment: form and list screens are left-aligned; result/celebration screens are centered via `ScreenShell center`. Centering comes from the shell or a layout wrapper, not from per-node `text-center` on headings.
- Vertical rhythm: when content is short and the screen looks top-heavy, center the block in the leftover space (`flex flex-1 flex-col justify-center`), do not inflate font sizes beyond the scale.

## Checklist

- [ ] No `<h1>` markup outside `ScreenHeading`
- [ ] All sizes/weights come from the table
- [ ] Long headings checked at 375px width - no overflow, sane line count
- [ ] Verified in the preview (verify-ui)

Строковые названия бренда читаются из BRAND.name и выводятся через BrandText: он использует Wordmark inline. ScreenHeading и HighlightText уже поддерживают этот способ. Не выводить видимый бренд обычным текстом
