# Static Korean and English Public Portfolio Design

**Date:** 2026-07-12
**Status:** Approved direction; pending written-spec review
**Scope:** Public developer portfolio only

## 1. Context

The portfolio is linked from the developer's pub.dev profile, so international visitors need a complete English experience. The current application is intentionally Korean-only: the root document declares `lang="ko"`, the public page is mounted at `/`, visible widget chrome is hard-coded in Korean, and project and career content are stored as Korean strings.

English support must not reintroduce a client-side locale runtime. It also must not create two independent portfolios whose facts, release versions, dates, project order, evidence URLs, or screenshots silently drift apart.

## 2. Goals

- Redirect `/` permanently to the default Korean route `/kr`.
- Serve a complete Korean public portfolio at `/kr`.
- Serve a complete English public portfolio at `/en`.
- Provide a normal navigation link labeled `English` on `/kr` and `한국어` on `/en`.
- Keep `/freelancer` Korean-only, unlisted, and `noindex, nofollow`.
- Render the correct server-side document language for every route.
- Keep factual and structural data synchronized across Korean and English.
- Fail closed when an English translation is missing or no longer matches the canonical facts.
- Preserve the existing static rendering, accessibility, responsive layout, modal, and presentation behavior.

## 3. Non-goals

- No `/en/freelancer` route.
- No browser-language auto-detection.
- No cookie, local-storage, or client-state locale preference.
- No in-place language toggle that rewrites the current DOM.
- No machine translation at request time.
- No translation of original product screenshots.
- No English resume PDF in this work unit.
- No attempt to translate historical design and implementation documents.

## 4. Route and document architecture

### 4.1 Public routes

| URL | Language | Indexing | Language link |
| --- | --- | --- | --- |
| `/` | none | redirect only | permanent redirect to `/kr` |
| `/kr` | Korean | indexable | `English` → `/en` |
| `/en` | English | indexable | `한국어` → `/kr` |
| `/freelancer` | Korean | `noindex, nofollow` | none |

`next.config.ts` owns a permanent redirect from `/` to `/kr`. The redirect is not locale-detected and has no query- or cookie-dependent behavior.

### 4.2 Correct `<html lang>` values

The existing top-level `src/app/layout.tsx` cannot truthfully declare both Korean and English. Replace it with multiple root layouts through route groups:

```text
src/app/
  (ko)/
    layout.tsx              # <html lang="ko">
    kr/page.tsx             # /kr
    freelancer/page.tsx     # /freelancer
  (en)/
    layout.tsx              # <html lang="en">
    en/page.tsx             # /en
```

The two layouts share font configuration, global styles, document classes, and skip-link structure through a small non-layout module. Each root layout renders its own localized skip-link text and route metadata.

Crossing between `/kr` and `/en` may perform a full document navigation. That is acceptable and preferable to a client locale runtime because it guarantees the correct HTML language and metadata before hydration.

### 4.3 Metadata and discovery

- `/kr` canonical: `/kr`
- `/en` canonical: `/en`
- Both pages publish `alternates.languages` for `ko`, `en`, and `x-default`.
- `x-default` points to `/kr`, matching the root redirect.
- `/kr` uses Korean title and description.
- `/en` uses English title and description.
- The sitemap lists `/kr` and `/en` only; it never lists `/freelancer`.
- After deployment verification, the pub.dev profile should link directly to `/en` for English-first traffic. Existing root links remain valid through `/` → `/kr`.

## 5. Language navigation

The language control is a normal link, not a switch:

- `/kr`: `English` with `href="/en"`
- `/en`: `한국어` with `href="/kr"`
- `/freelancer`: no language link

The link appears in the main navigation after the section links. It has the same minimum 44-pixel target and keyboard focus treatment as the other navigation actions. It does not preserve the current hash because section copy and section height can differ by language; navigation starts at the destination page top.

`RecruitmentNav` receives an optional language-link object from the route config. It does not inspect the current pathname and does not contain locale branching.

## 6. Synchronization-first data model

### 6.1 Principle

Facts and translations have different ownership:

- A factual or structural value has exactly one canonical source.
- A human-readable sentence may have one value per locale.
- English data is built from canonical facts plus English copy; it is not a second full copy of the project database.
- Missing English copy throws during tests/build instead of falling back to Korean.

### 6.2 Canonical facts

The following values must not be duplicated in language files:

- project IDs and selected-project order;
- project types;
- experience IDs and chronological order;
- employment periods;
- related project IDs;
- project and evidence URLs;
- pub.dev package versions;
- technology stacks;
- screen IDs and image paths;
- colors and icon types;
- public/private evidence classification;
- featured and additional project selections.

Introduce stable IDs for experience entries and proof items. Company names must not be used as identity keys because their display names differ between languages.

Version values such as `mobile_rag_engine 0.20.0` live in a shared facts/constants module and are interpolated into both Korean and English presentation copy. Active UI files must not contain independent release-version literals.

### 6.3 Localized project overlays

Keep the existing project objects as the canonical structural source and construct English projects with a typed translation overlay. The overlay may provide only localized fields:

- title when the public display name differs;
- subtitle and description;
- implementation points;
- card description, highlight, and evidence-badge labels;
- release-label formatter text, but not the canonical version value;
- screen `title`, `desc`, and `imageAlt`, keyed by screen ID;
- evidence-link labels, keyed by stable URL or link ID.

The builder preserves IDs, types, tech stacks, URLs, image paths, colors, icons, and ordering from the canonical project.

English translation coverage is required for every project selected by the public English config:

1. `local-mobile-rag-gemma`
2. `easy-contract-viewer`
3. `law-info-engine`
4. `easy-contract-viewer-server`
5. `haru-check`
6. `fiet-fitness-trainer`
7. `weedool`

Hidden projects such as Motgo and the FIET user app do not need English copy until they are selected by `/en`. Selecting one without a translation must fail closed.

Screen copy is matched by `screen.id`, never by array index. The builder rejects missing IDs, extra IDs, and duplicate IDs.

### 6.4 Recruitment and career facts

Split experience data into:

- canonical facts: `id`, `period`, `relatedProjectIds`, and order;
- Korean copy: company, role, employment type, summary, highlights;
- English copy: company, role, employment type, summary, highlights.

Both `/kr` and `/en` are built from the same canonical experience array. This makes it impossible for the FIET/Meritz ordering problem to recur in only one language.

Recruitment cases use `projectId` as their stable key. Evidence URLs, supporting package names, supporting package versions, and technology stacks remain canonical. Problem statements, contributions, verification text, outcomes, trade-offs, non-goals, status labels, and link labels are localized.

Profile contact facts (`email`, GitHub URL) remain canonical. Name, role, positioning, proof labels, and proof descriptions are localized. The English profile omits `resumeUrl` until an English resume exists, rather than presenting a Korean PDF behind a generic `Resume` label.

### 6.5 UI chrome dictionary

All currently hard-coded visible and accessibility text moves into a typed locale UI dictionary supplied through `PortfolioConfig`. It covers:

- skip link;
- navigation labels and navigation `aria-label`;
- section eyebrows and headings;
- resume and evidence actions;
- proof-panel labels;
- project type labels;
- card and archive actions;
- modal headings and close labels;
- presentation labels, previous/next/close actions, and slide status;
- screenshot-scroll labels;
- image-error text;
- CTA eyebrow and action labels;
- footer text.

Widgets consume injected strings and never check `locale === 'en'`. This keeps the rendering path deterministic and prevents a mixture of languages inside an English page.

## 7. English content rules

- Translate for an international engineering audience, not word-for-word.
- Preserve product names, library names, APIs, metrics, and code terms.
- Use `Oh Byeonghee` consistently for the English name.
- Use stable English company names consistently across the experience list.
- Keep dates in the existing sortable `YYYY.MM - YYYY.MM` format.
- Preserve evidence boundaries: private work remains labeled private; local validation is not presented as production operation.
- Preserve the current narrow claims for evaluation scores and deployment status.
- Original Korean product screenshots remain valid evidence. English `imageAlt`, slide titles, and captions explain them; the images themselves are not represented as localized UI.
- Use existing English architecture assets where they already exist. Do not translate an SVG by changing only its filename.

## 8. Fail-closed synchronization gates

### 8.1 Compile-time constraints

- Translation maps use `satisfies` against unions derived from shared selected IDs.
- Translation types omit canonical fields, preventing URLs, versions, periods, stacks, and image paths from being redefined.
- Experience and proof translations are keyed by stable IDs.

### 8.2 Structural tests

Tests must verify:

- `/` redirects only to `/kr`;
- `/kr` and `/en` use different root layouts with correct `lang` values;
- `/freelancer` stays under the Korean layout and remains noindex;
- Korean and English configs use identical featured/additional ID arrays;
- Korean and English experience builders receive the same canonical ordered IDs;
- every English selected project, screen, case, experience, proof item, and UI-copy key has a translation;
- translations cannot add unknown IDs;
- canonical versions and evidence URLs appear from shared facts;
- no active Korean or English content file contains a stale duplicated `mobile_rag_engine` version literal;
- `/en` has no unintended Hangul in visible or accessibility DOM copy, with a narrow allowlist only for the `한국어` language link and immutable proper evidence when explicitly approved;
- `/kr` does not accidentally consume English project copy.

### 8.3 Browser tests

Chromium and WebKit tests cover:

- `/` permanent redirect to `/kr`;
- reciprocal language links;
- `/kr` `html[lang="ko"]` and `/en` `html[lang="en"]`;
- localized metadata and canonical/alternate links;
- full English hero, featured work, experience, archive, CTA, modal, and presentation paths;
- identical project ordering across languages;
- identical latest-first career ordering across languages;
- no public link to `/freelancer` from any public locale;
- sitemap inclusion for `/kr` and `/en`, exclusion for `/freelancer`;
- 320px, 390px, tablet, and desktop reflow;
- 44-pixel navigation and language-link targets;
- focus trap, Escape behavior, focus restoration, and reduced motion;
- zero critical/serious axe violations;
- zero browser console errors and warnings.

### 8.4 Version update policy

Network access is not required during normal builds. The canonical stable pub.dev version is updated manually after verification against the official package page. A single shared constant updates both languages. A regression test rejects old active literals, as it now does for `0.18.6`.

## 9. Error handling

- A missing selected project ID throws with locale and selection context.
- A missing translation throws with locale, entity type, and entity ID.
- A screen translation mismatch reports both project ID and screen ID.
- English never silently falls back to Korean.
- Missing images use the localized image-error message.
- External evidence links retain `noopener noreferrer` and localized accessible labels.

## 10. Migration sequence

1. Extract shared document shell and create Korean/English root layouts.
2. Add `/` → `/kr` redirect and move the existing public page to `/kr` without changing its content.
3. Move `/freelancer` under the Korean route group without changing its URL or indexing contract.
4. Add typed UI-copy injection and remove hard-coded widget language.
5. Extract canonical fact fields and stable experience/proof IDs.
6. Add fail-closed project and recruitment localization builders.
7. Add English profile, project, case, career, and UI copy.
8. Add `/en` metadata, canonical links, alternates, and sitemap entries.
9. Run structural, browser, accessibility, responsive, and production-build gates.
10. Verify `/kr`, `/en`, `/freelancer`, and `/` redirect in the deployed preview.
11. Update the pub.dev profile link to `/en` after production verification.

## 11. Acceptance criteria

- `/` permanently redirects to `/kr`.
- `/kr` is a complete Korean portfolio with an `English` link.
- `/en` is a complete English portfolio with a `한국어` link.
- `/freelancer` remains Korean-only, unlisted, and noindex.
- Server-rendered HTML language and metadata match each route.
- No client locale store, hydration-time language change, or automatic detection exists.
- All public project details, career content, UI actions, modal copy, presentation copy, alt text, and ARIA text are localized.
- Original product screenshots may remain Korean but have English surrounding evidence copy.
- The English route does not expose a Korean resume through an ambiguously labeled action.
- Korean and English share one source for order, IDs, dates, versions, URLs, stacks, and assets.
- Missing or stale localization fails tests/build instead of falling back.
- Existing Korean layout, freelancer privacy contract, modal behavior, accessibility, and responsive gates remain green.
