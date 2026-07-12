# Static Korean and English Public Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox ('- [ ]') syntax for tracking.

**Goal:** Make the public portfolio available as complete, statically rendered Korean and English documents at /kr and /en while keeping all factual data synchronized and preserving the private Korean-only /freelancer route.

**Architecture:** Multiple Next.js root layouts provide truthful server-rendered document languages. Canonical project, experience, version, URL, stack, and asset facts stay locale-neutral; typed Korean and English copy overlays are resolved by fail-closed builders. A serializable UI-copy dictionary is passed through PortfolioConfig so client widgets never inspect locale or contain hard-coded interface language.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node test runner, Playwright, axe-core, Tailwind CSS.

## Global Constraints

- [ ] Preserve existing unrelated untracked files and directories.
- [ ] Keep /freelancer Korean-only, unlisted, noindex, and without a link back to the public portfolio.
- [ ] Do not add /en/freelancer, browser-language detection, cookies, local storage, or a client locale store.
- [ ] Do not expose the Korean resume from /en.
- [ ] Do not translate screenshot pixels or silently fall back to Korean copy.
- [ ] Keep project IDs, order, types, periods, versions, URLs, stacks, screen IDs, image paths, colors, and icons canonical.
- [ ] Use a normal English link on /kr and a normal 한국어 link on /en.
- [ ] Keep / as an unconditional permanent redirect to /kr.
- [ ] Do not push, deploy, or update the pub.dev profile in this work unit.
- [ ] Follow red-green-refactor for every behavior change and commit only green, scoped work.

---

## Task 1: Establish grouped document roots and the /kr migration

**Files:**

- Modify: next.config.ts
- Create: src/app/document-shell.tsx
- Create: src/app/site-metadata.ts
- Create: src/app/(ko)/layout.tsx
- Create: src/app/(ko)/kr/page.tsx
- Create: src/app/(ko)/freelancer/page.tsx
- Create: src/app/(en)/layout.tsx
- Delete: src/app/layout.tsx
- Delete: src/app/page.tsx
- Delete: src/app/freelancer/page.tsx
- Modify: test/developer-portfolio-structure.test.mjs
- Modify: e2e/accessibility.spec.ts

- [ ] **Step 1: Write failing route-structure tests**

Add assertions that:

- the old top-level layout and page do not exist;
- Korean and English grouped root layouts exist and declare lang="ko" and lang="en";
- /kr and /freelancer are under the Korean route group;
- next.config.ts defines one permanent, unconditional / to /kr redirect;
- the current Korean public config is rendered by /kr;
- /freelancer retains its robots metadata.

Run:

    npm run test:structure

Expected: FAIL because grouped layouts and /kr do not exist.

- [ ] **Step 2: Add a shared, locale-neutral document shell**

Move shared font setup, global stylesheet import, body classes, and main document structure into document-shell.tsx. The shell accepts only serializable localized skip-link text and document language inputs. Keep metadata out of the shared Korean layout because /kr and /freelancer have different discovery contracts.

- [ ] **Step 3: Create truthful Korean and English root layouts**

Create:

- src/app/(ko)/layout.tsx with server-rendered html lang="ko" and Korean skip-link text;
- src/app/(en)/layout.tsx with server-rendered html lang="en" and English skip-link text.

Do not add runtime pathname checks.

- [ ] **Step 4: Move existing pages without changing Korean copy**

Move the current public page to src/app/(ko)/kr/page.tsx and the freelancer page to src/app/(ko)/freelancer/page.tsx. Keep /freelancer metadata explicitly noindex, nofollow at the page boundary.

Move the existing Korean public title and description onto the /kr page in this same step so the route migration does not create an intermediate metadata regression. Task 7 adds canonical and hreflang discovery metadata without changing this copy.

- [ ] **Step 5: Add the permanent root redirect**

Add an unconditional Next.js redirect:

    source: /
    destination: /kr
    permanent: true

Do not preserve locale state because none exists.

- [ ] **Step 6: Update existing browser tests to use /kr**

Change Korean-home navigation and hash expectations from / and /#... to /kr and /kr#.... Add a direct request assertion that / responds with the framework's permanent redirect status and Location: /kr.

Run:

    npm run test:structure
    npx playwright test e2e/accessibility.spec.ts --project=chromium --grep "root|한국어|프리랜서"

Expected: PASS.

- [ ] **Step 7: Commit**

    git add next.config.ts src/app test/developer-portfolio-structure.test.mjs e2e/accessibility.spec.ts
    git commit -m "feat: add static Korean and English route shells"

---

## Task 2: Define the complete typed localization contract

**Files:**

- Create: src/types/locale.ts
- Modify: src/types/portfolio.ts
- Modify: src/types/recruitment.ts
- Modify: src/data/recruitment.ts
- Modify: src/data/portfolio.ts
- Modify: src/data/freelancer.ts
- Modify: src/app/document-shell.tsx
- Modify: src/app/(ko)/layout.tsx
- Modify: src/app/(en)/layout.tsx
- Create: src/data/ui-copy.ts
- Create: src/lib/format-portfolio-message.ts
- Create: test/portfolio-localization.test.mjs

- [ ] **Step 1: Write failing dictionary and formatter tests**

Test that:

- Korean and English UI dictionaries have exactly the same keys;
- both dictionaries include every widget label, aria label, type label, section label, modal label, presentation label, screenshot label, CTA label, and footer label;
- message templates reject missing values, unknown values, and unresolved placeholders;
- ExperienceItem, proof items, and Capability have stable IDs.

Run:

    node --test test/portfolio-localization.test.mjs

Expected: FAIL because the contract does not exist.

- [ ] **Step 2: Add stable locale and identity types**

Define:

- PortfolioLocale as 'ko' | 'en';
- LanguageLink with label and href;
- stable id on ExperienceItem;
- stable id on proof items;
- stable id and canonical evidenceProjectId on Capability.

Never use localized display strings as React keys or localization-map keys.

- [ ] **Step 3: Add a serializable PortfolioUiCopy type**

The type must cover at least:

- skipLink;
- navigationAriaLabel, navFeatured, navExperience, navContact;
- resumeAction;
- proofAriaLabel, proofHeading, proofLinkAction;
- experienceEyebrow, experienceHeading, representativeOutcome, experienceDetails;
- archiveEyebrow, assignedScope, viewDetails, caseDetails;
- evidenceBackedOutcome, keyOutcome, relatedPublicPackage;
- roleLabel, periodLabel, teamLabel;
- projectOpenTemplate, projectCloseTemplate, presentationOpenTemplate;
- presentationClose, slideStatusTemplate, previousSlide, nextSlide;
- tapToEnlarge, tapToView, screenshotRegionTemplate, scroll;
- projectEvidenceAriaLabel;
- problemHeading, contributionsHeading, technologyHeading, verificationHeading, outcomesHeading, tradeoffsHeading, tradeoffLabel, nonGoalLabel, architectureFlowHeading;
- imageError;
- contactEyebrow;
- footerBuiltWith;
- compact type labels for cards/archive and detailed type labels for modals, each covering mobile, web, tablet, package, and api;
- architecture labels for package, backend, and RAG flows.

Keep templates as strings because Portfolio is a Client Component boundary.

- [ ] **Step 4: Implement a fail-closed template formatter**

formatPortfolioMessage receives a template and a plain record. It throws when a required placeholder is absent, an unused value is supplied, or braces remain after interpolation. Include entity context in thrown errors.

- [ ] **Step 5: Add complete Korean and English dictionaries**

Create uiCopyByLocale with exact key parity. Korean values must preserve current UI behavior. English values must be idiomatic engineering-portfolio language. The only Hangul in English UI copy is the language link label, which lives outside this dictionary.

At this task boundary, add stable IDs to the existing Korean experience, proof, and capability data so the new required identity fields do not break type checking. PortfolioConfig does not gain its new required locale, ui, languageLink, or projects fields until Task 3, where every active config is migrated atomically.

Wire both grouped root layouts through document-shell.tsx to the corresponding dictionary's skipLink value. Add a structure assertion that neither layout nor the document shell retains a hard-coded skip-link label.

Use the repository's existing TypeScript transpile-to-data-URL test technique for runtime tests. Keep format-portfolio-message.ts dependency-free at runtime so the fixture tests execute behavior rather than relying on source regexes.

Run:

    node --test test/portfolio-localization.test.mjs
    npx tsc --noEmit --incremental false

Expected: PASS.

- [ ] **Step 6: Commit**

    git add src/types src/data/recruitment.ts src/data/portfolio.ts src/data/freelancer.ts src/data/ui-copy.ts src/lib/format-portfolio-message.ts src/app/document-shell.tsx 'src/app/(ko)/layout.tsx' 'src/app/(en)/layout.tsx' test/portfolio-localization.test.mjs
    git commit -m "feat: define typed portfolio localization contract"

---

## Task 3: Remove hard-coded widget language and fix localized accessibility

**Files:**

- Modify: src/components/Portfolio.tsx
- Modify: src/components/widgets/DeveloperHero.tsx
- Modify: src/components/widgets/DeviceFrame.tsx
- Modify: src/components/widgets/ExperienceTimeline.tsx
- Modify: src/components/widgets/FeaturedWork.tsx
- Modify: src/components/widgets/Footer.tsx
- Modify: src/components/widgets/PresentationOverlay.tsx
- Modify: src/components/widgets/ProjectArchive.tsx
- Modify: src/components/widgets/ProjectCard.tsx
- Modify: src/components/widgets/ProjectModal.tsx
- Modify: src/components/widgets/RecruitmentCTA.tsx
- Modify: src/components/widgets/RecruitmentNav.tsx
- Modify: src/components/widgets/ScreenImage.tsx
- Modify: src/app/globals.css
- Modify: src/data/portfolio.ts
- Modify: src/data/freelancer.ts
- Modify: src/app/(ko)/kr/page.tsx
- Modify: src/app/(ko)/freelancer/page.tsx
- Modify: test/developer-portfolio-structure.test.mjs
- Modify: e2e/accessibility.spec.ts

- [ ] **Step 1: Write failing source-boundary tests**

Assert that:

- Portfolio.tsx no longer imports the global Korean projects array;
- every widget receives needed UI copy through props;
- widgets contain no banned Korean UI literals;
- widgets contain no locale equality checks or pathname-based locale branching;
- localized items use stable IDs as keys;
- project and experience elements expose stable data-project-id and data-experience-id attributes for synchronization tests;
- DeviceFrame uses screen.imageAlt for mobile, web, and tablet images.

Add focused browser tests before implementation for:

- English to /en appears on /kr;
- /freelancer has no language link;
- the 320px navigation wraps without horizontal overflow;
- every navigation target remains at least 44 by 44 pixels.

Run:

    npm run test:structure
    npx playwright test e2e/accessibility.spec.ts --project=chromium --grep "language navigation|320px|freelancer"

Expected: FAIL on the current hard-coded widget strings and missing public language link.

- [ ] **Step 2: Pass projects and UI copy through PortfolioConfig**

Add required locale, ui, languageLink, and projects fields to PortfolioConfig. Migrate the Korean public and freelancer configs in the same change so type checking stays green. Resolve featured and additional projects only from config.projects. Preserve fail-closed missing-project errors with locale and selection context.

The Korean public config receives English to /en. The freelancer config receives no language link and preserves its intentionally different featured-project order.

- [ ] **Step 3: Inject copy into every widget**

Replace hard-coded visible, title, alt, and aria strings with typed UI-copy props. Use formatPortfolioMessage for project, presentation, slide, and screenshot templates. Keep components locale-agnostic.

- [ ] **Step 4: Add the normal language navigation link**

RecruitmentNav renders languageLink only when supplied. /kr receives English to /en; /en will later receive 한국어 to /kr; /freelancer receives none.

At 320px, allow an intentional two-row or wrapped navigation layout while preserving DOM order, visible focus, no horizontal overflow, and at least 44 by 44 pixel targets.

- [ ] **Step 5: Correct screen alternative text**

Use localized screen.imageAlt consistently in every DeviceFrame variant. The project title may remain contextual caption text but must not replace screenshot-specific alt text.

Run:

    npm run test:structure
    npx tsc --noEmit --incremental false
    npm run lint
    npx playwright test e2e/accessibility.spec.ts --project=chromium --grep "language navigation|320px|freelancer"

Expected: PASS.

- [ ] **Step 6: Commit**

    git add src/components src/app/globals.css src/types/portfolio.ts src/data/portfolio.ts src/data/freelancer.ts 'src/app/(ko)/kr/page.tsx' 'src/app/(ko)/freelancer/page.tsx' test/developer-portfolio-structure.test.mjs e2e/accessibility.spec.ts
    git commit -m "refactor: inject localized portfolio interface copy"

---

## Task 4: Centralize canonical public facts

**Files:**

- Create: src/data/portfolio-facts.ts
- Create: src/data/recruitment-facts.ts
- Modify: src/data/projects.ts
- Modify: src/data/recruitment.ts
- Modify: src/data/portfolio.ts
- Modify: src/data/freelancer.ts
- Modify: test/portfolio-localization.test.mjs
- Modify: test/developer-portfolio-structure.test.mjs

- [ ] **Step 1: Write failing canonical-fact tests**

Test that:

- MOBILE_RAG_ENGINE_VERSION equals 0.20.0;
- featured and additional public project ID order has one canonical source;
- freelancer selections remain a separate canonical sequence and retain their current order;
- project and evidence URLs used by both project and recruitment data come from shared facts;
- canonical experience IDs, periods, related project IDs, and latest-first order are shared;
- total experience is represented once as 65 months and formatted per locale;
- recruitment-case evidence URLs and supporting-package names, versions, stacks, and URLs are locale-neutral facts;
- the active source tree does not duplicate the literal mobile_rag_engine version;
- every relatedProjectId and recruitment case projectId resolves;
- capabilities, proof items, and experiences use stable IDs.

Run:

    node --test test/portfolio-localization.test.mjs

Expected: FAIL because facts and version literals are duplicated.

- [ ] **Step 2: Extract immutable public facts**

portfolio-facts.ts owns:

- MOBILE_RAG_ENGINE_VERSION;
- MOBILE_RAG_ENGINE_GITHUB_URL and MOBILE_RAG_ENGINE_PUBDEV_URL;
- law service and API documentation URLs;
- featuredPublicProjectIds;
- additionalPublicProjectIds;
- publicProjectIds;
- canonical experience IDs and order;
- proof IDs and capability IDs;
- shared profile email and GitHub URL.

Use exact literal unions with as const where they improve coverage.

recruitment-facts.ts owns:

- canonical experience records with id, period, relatedProjectIds, and order;
- TOTAL_EXPERIENCE_MONTHS = 65;
- recruitment-case identity and evidence-link facts;
- supporting-package name, version, tech stack, and link facts.

Korean and English files may format the shared duration differently, but neither may repeat the number of years/months as an independent fact.

- [ ] **Step 3: Replace active duplicated literals**

Interpolate the shared version and reuse URL constants in Korean projects and recruitment cases. Do not rewrite historical docs. Ensure /kr and /en select projects from the same public IDs. Keep /freelancer's featured/additional selection in its own shared constants so its intentional ordering is preserved.

- [ ] **Step 4: Add stable IDs to Korean data**

Use:

- meritz-rag-contract;
- fiet-app-frontend;
- infinity-exchange-mobile;
- turingbio-mobile-rnd;
- youngwoo-remote-contract;
- wacom-support-system;
- public-package and experience-duration proof IDs.

Add stable capability IDs and evidence project references.

Run:

    npm test
    npx tsc --noEmit --incremental false

Expected: PASS.

- [ ] **Step 5: Commit**

    git add src/data/portfolio-facts.ts src/data/recruitment-facts.ts src/data/projects.ts src/data/recruitment.ts src/data/portfolio.ts src/data/freelancer.ts src/types test
    git commit -m "refactor: centralize canonical portfolio facts"

---

## Task 5: Build fail-closed project localization

**Files:**

- Create: src/data/project-localization.ts
- Create: src/data/projects.en.ts
- Modify: src/types/project.ts
- Modify: test/portfolio-localization.test.mjs

- [ ] **Step 1: Write failing overlay coverage tests**

Cover exactly these selected projects:

- local-mobile-rag-gemma;
- easy-contract-viewer;
- law-info-engine;
- easy-contract-viewer-server;
- haru-check;
- fiet-fitness-trainer;
- weedool.

Test:

- missing selected project translation throws with locale and project ID;
- unknown project translation throws;
- duplicate, missing, or extra screen IDs throw with project and screen ID;
- duplicate, missing, or extra evidence-link keys throw;
- translated array fields preserve canonical array shape;
- canonical IDs, types, tech stacks, URLs, image paths, colors, icons, and order survive unchanged;
- selecting hidden Motgo without English copy throws;
- English outputs contain no unintended Hangul.

Run:

    node --test test/portfolio-localization.test.mjs

Expected: FAIL because the builder and translations are absent.

- [ ] **Step 2: Define a localization-only overlay type**

Permit localized title, subtitle, description, implementation points, card copy, evidence-badge labels, release-label text, screen title/description/imageAlt keyed by screen ID, and evidence-link labels keyed by canonical URL or stable link ID.

Make canonical fields impossible to specify in the overlay type.

Keep project-localization.ts free of runtime imports: use erased type-only imports and accept canonical projects plus overlays as arguments. This lets portfolio-localization.test.mjs execute the actual builder with the repository's TypeScript transpile-to-data-URL helper. Integration with aliased application modules remains covered by typecheck and production build.

- [ ] **Step 3: Implement the fail-closed builder**

Build English projects from canonical Korean project structures plus English overlays. Validate exact project, screen, link, and localized-array coverage at module construction time. Never fall back to Korean text.

For existing locale-specific mobile_rag_engine architecture SVGs, keep the asset choice in a canonical locale-to-asset map rather than allowing arbitrary image-path overrides in translations.

- [ ] **Step 4: Add complete English project copy**

Translate all 7 selected projects and all 47 selected screens. Use these public positioning anchors:

- mobile_rag_engine: A Flutter package for fully local RAG on mobile;
- Easy Contract Viewer: AI-assisted insurance policy review app;
- Swifty-law: Citation-grounded Korean statute retrieval engine;
- Easy Contract Viewer Server: FastAPI backend for contract and policy RAG summaries;
- HaruCheck: Mobile certification and report workflow;
- FIET trainer: BLE-connected trainer tablet app;
- Weedool: Mental-health activity and counseling app.

Preserve evidence limits, metrics, product names, code terms, and original Korean screenshot pixels.

Run:

    node --test test/portfolio-localization.test.mjs
    npx tsc --noEmit --incremental false

Expected: PASS.

- [ ] **Step 5: Commit**

    git add src/data/project-localization.ts src/data/projects.en.ts src/types/project.ts test/portfolio-localization.test.mjs
    git commit -m "feat: add fail-closed English project localization"

---

## Task 6: Build fail-closed recruitment localization and /en

**Files:**

- Create: src/data/recruitment-localization.ts
- Create: src/data/recruitment.en.ts
- Create: src/data/portfolio.en.ts
- Create: src/app/(en)/en/page.tsx
- Modify: src/data/portfolio.ts
- Modify: src/app/(ko)/kr/page.tsx
- Modify: test/portfolio-localization.test.mjs

- [ ] **Step 1: Write failing recruitment coverage tests**

Test exact coverage for:

- 6 experience IDs;
- 3 recruitment case project IDs;
- 2 proof IDs;
- every capability ID;
- every localized array position in cases and experiences.

Test that builders preserve period, order, related project IDs, evidence URLs, supporting package names and versions, stacks, and project selections. Test that the English profile has no resumeUrl and no unintended Hangul.

Run:

    node --test test/portfolio-localization.test.mjs

Expected: FAIL because recruitment localization is absent.

- [ ] **Step 2: Implement fail-closed recruitment builders**

Construct Korean and English recruitment data from canonical identities and facts plus locale copy. Reject missing, extra, or duplicate experience, case, proof, and capability IDs. Validate localized array shapes.

Keep recruitment-localization.ts free of runtime imports and dependency-inject fact and copy fixtures, so the Node tests execute missing/extra/duplicate and fact-preservation behavior directly. Application data modules compose the builder with recruitment-facts.ts and are covered by typecheck/build.

- [ ] **Step 3: Add the complete English public copy**

Use:

- name: Oh Byeonghee;
- role: Cross-platform Developer · Local RAG Engineer;
- position: Flutter · On-device Retrieval/RAG · LLM Backends;
- positioning: I design and build mobile products and local retrieval engines, connecting implementation to evaluation and operations.

Use consistent company names:

- Meritz Fire & Marine Insurance;
- FIET Co., Ltd.;
- Infinity Exchange Korea;
- TuringBio;
- Youngwoo Co., Ltd.;
- Wacom Korea.

Translate all experience summaries/highlights, recruitment case narratives, proof text, capability copy, section copy, contact copy, and evidence labels. Preserve YYYY.MM - YYYY.MM periods and latest-first order.

- [ ] **Step 4: Assemble locale configs**

Korean config receives Korean UI, projects, copy, and English to /en. English config receives English UI, English projects, English copy, and 한국어 to /kr. Freelancer receives Korean UI and projects but no language link.

Do not pass functions through PortfolioConfig.

- [ ] **Step 5: Create /en**

Render Portfolio with the English config. Keep it statically renderable. Verify that no Korean resume action appears because the English profile omits resumeUrl.

Run:

    npm test
    npx tsc --noEmit --incremental false
    npm run lint
    npm run build

Expected: PASS, with /kr, /en, and /freelancer emitted as static routes.

- [ ] **Step 6: Commit**

    git add src/data 'src/app/(ko)/kr/page.tsx' 'src/app/(en)/en/page.tsx' test
    git commit -m "feat: add complete English public portfolio"

---

## Task 7: Add localized discovery metadata, sitemap, and browser coverage

**Files:**

- Modify: src/app/site-metadata.ts
- Modify: src/app/(ko)/kr/page.tsx
- Modify: src/app/(en)/en/page.tsx
- Modify: src/app/(ko)/freelancer/page.tsx
- Create: src/app/sitemap.ts
- Modify: e2e/accessibility.spec.ts
- Modify: playwright.config.ts if a dedicated verification port is needed

- [ ] **Step 1: Write failing SEO and end-to-end tests**

Add browser assertions for:

- / permanently redirects to /kr;
- /kr has html lang="ko", Korean title/description, canonical /kr, and ko/en/x-default alternates;
- /en has html lang="en", English title/description, canonical /en, and the same alternates;
- x-default is /kr;
- reciprocal language links have exact labels and targets;
- /freelancer has lang="ko", noindex, nofollow, no language link, and no public canonical/alternate metadata leakage;
- sitemap contains exactly /kr and /en and excludes /freelancer;
- neither public locale links to /freelancer;
- English has no resume action;
- project and career ID order is identical across locales;
- the complete English hero, featured work, archive, experience, CTA, modal, and presentation flows render;
- English visible and accessibility text contains no Hangul except exact 한국어;
- modal and presentation focus trap, Escape, focus restoration, and reduced motion still work;
- 320px, 390px, tablet, and desktop views have no horizontal overflow;
- every navigation action, including language links, is at least 44 by 44 pixels;
- axe has zero critical or serious violations;
- console has no errors or warnings.

Run:

    npx playwright test e2e/accessibility.spec.ts --project=chromium

Expected: FAIL until metadata, sitemap, and remaining responsive behavior are complete.

- [ ] **Step 2: Add deterministic site URL resolution**

Resolve the absolute site base in this order:

1. NEXT_PUBLIC_SITE_URL;
2. VERCEL_PROJECT_PRODUCTION_URL with https scheme;
3. http://localhost:3000 for local build/test.

Normalize one trailing slash policy. Do not make network requests during build.

- [ ] **Step 3: Add page-owned metadata**

Keep canonical and alternates on /kr and /en pages, not their shared root layouts. Preserve the Korean title/description moved in Task 1, add the approved English title/description, and provide ko, en, and x-default language alternates. Keep /freelancer robots metadata explicit and isolated.

- [ ] **Step 4: Add sitemap**

Return only the absolute /kr and /en URLs. Do not include /, /freelancer, or asset routes.

- [ ] **Step 5: Complete cross-browser and responsive fixes**

Fix only evidence-backed failures. Preserve keyboard order, visible focus, 44-pixel targets, and no horizontal scrolling in Chromium and WebKit.

Run:

    npx playwright test e2e/accessibility.spec.ts --project=chromium
    npm run test:a11y

Expected: PASS in Chromium and WebKit.

- [ ] **Step 6: Commit**

    git add src/app src/components src/data e2e/accessibility.spec.ts playwright.config.ts
    git commit -m "feat: add localized portfolio discovery and browser coverage"

---

## Task 8: Final synchronization audit and production verification

**Files:**

- Modify only files required by evidence from the gates below.
- Update this plan's checkboxes as work is completed.

- [ ] **Step 1: Run the complete static gate**

    npm test
    npm run lint
    npx tsc --noEmit --incremental false
    git diff --check

Expected: all pass.

- [ ] **Step 2: Run the complete browser gate**

    npm run test:a11y

Expected: Chromium and WebKit pass with zero serious/critical axe violations and no console failures.

- [ ] **Step 3: Run a clean production build**

    rm -rf .next
    NEXT_PUBLIC_SITE_URL=https://portfolio.example.test npm run build

Expected:

- /kr, /en, and /freelancer are static routes;
- / is configured as a permanent redirect;
- /sitemap.xml is generated;
- no translation coverage error occurs.

- [ ] **Step 4: Verify a production server**

Start exactly the build above on an unused port:

    PORT=3101 NEXT_PUBLIC_SITE_URL=https://portfolio.example.test npm run start >/tmp/dev-portfolio-production.log 2>&1 &
    APP_PID=$!
    trap 'kill "$APP_PID" 2>/dev/null || true' EXIT
    for attempt in {1..30}; do curl -fsS http://127.0.0.1:3101/kr >/dev/null && break; sleep 1; done
    curl -sSI http://127.0.0.1:3101/ | rg -i '^location: /kr'
    curl -sS http://127.0.0.1:3101/kr | rg '<html lang="ko"'
    curl -sS http://127.0.0.1:3101/en | rg '<html lang="en"'
    curl -sS http://127.0.0.1:3101/freelancer | rg 'noindex, nofollow|noindex.*nofollow'
    curl -sS http://127.0.0.1:3101/kr | rg 'https://portfolio.example.test/kr'
    curl -sS http://127.0.0.1:3101/en | rg 'https://portfolio.example.test/en'
    SITEMAP="$(curl -sS http://127.0.0.1:3101/sitemap.xml)"
    printf '%s' "$SITEMAP" | rg 'https://portfolio.example.test/(kr|en)'
    if printf '%s' "$SITEMAP" | rg -q '/freelancer|<loc>https://portfolio.example.test/</loc>'; then exit 1; fi
    kill "$APP_PID"
    wait "$APP_PID" || true
    trap - EXIT

Verify from these responses:

- GET / returns a permanent redirect to /kr;
- GET /kr includes html lang="ko";
- GET /en includes html lang="en";
- GET /freelancer includes noindex and nofollow;
- GET /sitemap.xml lists /kr and /en only;
- canonical and hreflang URLs use the configured production base when NEXT_PUBLIC_SITE_URL is set.

- [ ] **Step 5: Audit synchronization and forbidden fallbacks**

Search active source and rendered English DOM for:

- stale package versions;
- duplicated canonical project selections or experience periods;
- locale conditionals inside widgets;
- Korean UI fallback;
- /freelancer public links;
- Korean resume links on /en;
- unknown or missing translation IDs.

Expected: no violations.

- [ ] **Step 6: Request independent code review**

Use superpowers:requesting-code-review on the complete branch diff. Resolve only validated issues, rerun the affected focused gate, then rerun the full static and browser gates.

- [ ] **Step 7: Commit any verified final corrections**

Stage only the exact files changed to address validated review findings, then run:

    git commit -m "fix: close bilingual portfolio verification gaps"

Skip this commit when the review finds no actionable issue.

## Completion Contract

Implementation is complete only when:

- / permanently redirects to /kr;
- /kr and /en are complete, reciprocal, truthful static documents;
- /freelancer remains Korean-only, noindex, and unlisted;
- all shared facts have one canonical source;
- every selected English entity has exact fail-closed localization coverage;
- English exposes no Korean resume and no accidental Korean UI;
- responsive, keyboard, modal, presentation, accessibility, lint, typecheck, tests, and production build all pass;
- the branch has an independent clean-diff review;
- no push, deployment, main merge, or pub.dev profile update has occurred without a separate user instruction.
