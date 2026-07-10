# Korean Developer Recruitment Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the portfolio into one Korean-only, developer-recruitment experience that presents verified retrieval/product evidence, removes audience/locale dead code, and remains responsive and accessible.

**Architecture:** Use a materialize-then-delete migration. First promote the existing developer audience to the canonical portfolio, then flatten Korean strings and remove the locale runtime, then introduce recruitment-specific data/components without fabricating missing career facts. Preserve the current modal and presentation system while repairing semantics, focus order, scrolling, and viewport behavior.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node test runner, Playwright, axe-core.

## Global Constraints

- `/` is the only initial route; no audience query parsing or new project-detail routes.
- Server-rendered document language is `ko`.
- Product names and technical terms such as Flutter, Rust, RAG, GitHub, and API remain untranslated.
- Featured order is `mobile_rag_engine → Easy Contract Viewer → Swifty-law`.
- Unverified career, MAU, benchmark, team, and outcome data is hidden rather than replaced with placeholders.
- Current warm editorial palette, real screenshots, diagrams, modal, presentation, focus trap, and image states remain.
- Featured and additional grids use 1 column on mobile, 2 at 768px, and 3 at 1024px.
- No viewport may have horizontal page overflow.
- Normal text contrast is at least 4.5:1; focus indicators are at least 3:1; icon controls are at least 44×44px.
- Reduced-motion mode has no continuing fade, pulse, spin, bounce, or translate animation.
- Commit after every task only when its focused and regression tests pass.

---

## File Map

### Create

- `src/data/portfolio.ts`: fixed Korean section order, Hero copy, capabilities, featured/additional IDs.
- `src/data/recruitment.ts`: recruitment profile, verified case evidence, optional experience entries.
- `src/types/recruitment.ts`: `EvidenceLink`, `RecruitmentCase`, `ExperienceItem`, `RecruitmentProfile`.
- `src/components/layout/SectionContainer.tsx`: shared width and responsive gutters.
- `src/components/layout/SectionHeader.tsx`: shared eyebrow/heading/description/count rhythm.
- `src/components/widgets/RecruitmentNav.tsx`: in-page Korean recruitment navigation and conditional resume action.
- `src/components/widgets/DeveloperHero.tsx`: Korean recruitment Hero and proof panel.
- `src/components/widgets/CoreCapabilities.tsx`: four case-linked engineering capabilities.
- `src/components/widgets/ExperienceTimeline.tsx`: verified career entries, omitted when empty.
- `src/components/widgets/RecruitmentCTA.tsx`: conditional resume, email, GitHub closing actions.
- `test/developer-portfolio-structure.test.mjs`: final static source/data contracts.
- `test/accessibility-tokens.test.mjs`: contrast and motion-token contracts.
- `e2e/accessibility.spec.ts`: keyboard, dialog, reflow, reduced-motion, and axe coverage.
- `playwright.config.ts`: local web-server and viewport defaults.

### Modify

- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- `src/components/Portfolio.tsx`
- `src/components/widgets/FeaturedWork.tsx`, `ProjectCard.tsx`, `ProjectGrid.tsx`
- `src/components/widgets/ProjectModal.tsx`, `DeviceFrame.tsx`, `PresentationOverlay.tsx`, `ScreenImage.tsx`
- `src/components/widgets/OpenSourceBanner.tsx`, `Footer.tsx`, `index.ts`
- `src/data/projects.ts`, `src/types/project.ts`
- `package.json`, `package-lock.json`

### Delete after zero-reference gates

- `src/data/conversion.ts`
- `src/components/LanguageSwitcher.tsx`, `src/components/ClientWrapper.tsx`
- `src/i18n/index.ts`, `LocaleContext.tsx`, `localize.ts`, `translations.ts`
- `src/components/widgets/ConversionHero.tsx`
- `src/components/widgets/ProfileHeader.tsx`
- `src/components/SocialButton.tsx`
- `src/components/GeometricPattern.tsx`
- `test/conversion-structure.test.mjs`

---

### Task 1: Add Final-State Contract Tests

**Files:**
- Create: `test/developer-portfolio-structure.test.mjs`
- Modify: `package.json`
- Test: `test/developer-portfolio-structure.test.mjs`

**Interfaces:**
- Consumes: the current source tree as text.
- Produces: source contracts for the audience collapse, Korean shell, section order, featured order, hidden unverified data, and accessibility primitives.

- [ ] **Step 1: Write the failing structure tests**

Create helpers and focused tests that assert the desired final state:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('root shell is server-rendered in Korean without locale controls', () => {
  const layout = read('src/app/layout.tsx');
  const wrapper = read('src/app/layout.tsx');

  assert.match(layout, /<html lang="ko"/);
  assert.match(layout, /오병희 \| Flutter · 온디바이스 RAG 개발자/);
  assert.match(wrapper, /본문으로 건너뛰기/);
  assert.doesNotMatch(layout, /ClientWrapper|LanguageSwitcher|LocaleProvider/);
});

test('home renders one deterministic portfolio without audience parsing', () => {
  const page = read('src/app/page.tsx');
  const portfolio = read('src/components/Portfolio.tsx');

  assert.doesNotMatch(page, /searchParams|parseAudience|initialAudience/);
  assert.doesNotMatch(portfolio, /Audience|audienceContent|initialAudience/);
  assert.match(portfolio, /<DeveloperHero/);
});

test('portfolio follows the approved recruitment section order', () => {
  const portfolio = read('src/components/Portfolio.tsx');
  const markers = [
    '<RecruitmentNav',
    '<DeveloperHero',
    '<FeaturedWork',
    '<CoreCapabilities',
    '<ExperienceTimeline',
    '<ProjectGrid',
    '<OpenSourceBanner',
    '<RecruitmentCTA',
    '<Footer',
  ];

  let previous = -1;
  for (const marker of markers) {
    const current = portfolio.indexOf(marker);
    assert.ok(current > previous, `${marker} must appear in approved order`);
    previous = current;
  }
});

test('featured cases tell engine product backend story', () => {
  const portfolioData = read('src/data/portfolio.ts');
  const expected = [
    "'local-mobile-rag-gemma'",
    "'easy-contract-viewer'",
    "'law-info-engine'",
  ];

  let previous = -1;
  for (const marker of expected) {
    const current = portfolioData.indexOf(marker);
    assert.ok(current > previous, `${marker} must keep approved order`);
    previous = current;
  }
});

test('active source has no audience or locale runtime', () => {
  const files = [
    'src/app/page.tsx',
    'src/components/Portfolio.tsx',
    'src/components/widgets/ProjectCard.tsx',
    'src/components/widgets/ProjectGrid.tsx',
    'src/data/projects.ts',
    'src/types/project.ts',
  ];

  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /Audience|audienceOverrides|audienceContent|useLocale|LocaleText|localize\(/);
  }
});

test('unverified profile facts and empty resume action are not rendered', () => {
  const recruitment = read('src/data/recruitment.ts');
  const hero = read('src/components/widgets/DeveloperHero.tsx');

  assert.doesNotMatch(recruitment, /MAU 1만|5년 4개월|10–100×/);
  assert.match(hero, /profile\.resumeUrl/);
});
```

- [ ] **Step 2: Point the default test script at all Node contract tests**

Update scripts without adding Playwright yet:

```json
{
  "test": "node --test test/*.test.mjs",
  "test:structure": "node --test test/*.test.mjs"
}
```

- [ ] **Step 3: Run the new test and verify RED**

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: failures for missing `DeveloperHero`, `src/data/portfolio.ts`, Korean `lang`, and existing audience/locale runtime.

- [ ] **Step 4: Commit only the red contracts**

```bash
git add test/developer-portfolio-structure.test.mjs package.json
git commit -m "test: define Korean recruitment portfolio contracts"
```

---

### Task 2: Collapse the Audience Axis

**Files:**
- Create: `src/data/portfolio.ts`
- Modify: `src/app/page.tsx`, `src/components/Portfolio.tsx`
- Modify: `src/types/project.ts`, `src/data/projects.ts`
- Modify: `src/components/widgets/ConversionHero.tsx`, `FeaturedWork.tsx`, `ProjectCard.tsx`, `ProjectGrid.tsx`
- Delete: `src/data/conversion.ts`
- Test: `test/developer-portfolio-structure.test.mjs`, existing `test/conversion-structure.test.mjs`

**Interfaces:**
- Produces: `featuredProjectIds`, `additionalProjectIds`, `portfolioCopy`, `capabilities`, and audience-free `ProjectCardPresentation`.
- Preserves: existing developer descriptions, evidence badges, highlights, and thumbnail indexes.

- [ ] **Step 1: Add audience-free portfolio data**

Create `src/data/portfolio.ts` with Korean/English `LocaleText` temporarily so audience removal is isolated from locale removal:

```ts
import { LocaleText } from '@/i18n';

export const featuredProjectIds = [
  'local-mobile-rag-gemma',
  'easy-contract-viewer',
  'law-info-engine',
] as const;

export const additionalProjectIds = [
  'motgo',
  'haru-check',
  'weedool',
  'fiet-fitness-trainer',
  'fiet-fitness-user',
] as const;

export const portfolioCopy = {
  eyebrow: { en: 'Developer Portfolio', ko: '개발자 포트폴리오' },
  role: { en: 'Cross-platform Developer · Local RAG Engineer', ko: '크로스플랫폼 개발자 · 로컬 RAG 엔지니어' },
  position: { en: 'Flutter · On-device Retrieval/RAG · LLM Backend', ko: 'Flutter · 온디바이스 Retrieval/RAG · LLM 백엔드' },
  positioning: {
    en: 'I connect mobile products, local retrieval engines, evaluation, and operations.',
    ko: '모바일 제품과 로컬 검색 엔진을 설계·구현하고 평가와 운영까지 연결합니다.',
  },
  featuredHeading: { en: 'Featured Engineering Cases', ko: '대표 기술 사례' },
  additionalHeading: { en: 'Additional Projects', ko: '추가 프로젝트' },
} satisfies Record<string, LocaleText>;
```

- [ ] **Step 2: Materialize developer card presentation**

Replace `ProjectAudienceOverride` with:

```ts
export interface ProjectCardPresentation {
  variant?: ProjectCardVariant;
  description?: LocaleText;
  evidenceBadges?: string[];
  thumbnailScreenIndex?: number;
  highlight?: LocaleText;
}
```

Rename each `audienceOverrides.developer` object in `src/data/projects.ts` to `cardPresentation`. Copy its values exactly; do not use client copy.

- [ ] **Step 3: Remove audience props and branching**

Make `src/app/page.tsx` deterministic:

```tsx
import Portfolio from '@/components/Portfolio';

export default function Home() {
  return <Portfolio />;
}
```

In `Portfolio`, import IDs and copy from `src/data/portfolio.ts`, remove `initialAudience`, and render one supporting order. In `ProjectCard`, resolve `project.cardPresentation` directly. In `ProjectGrid`, delete `AudienceDisplaySwitcher` and `ClientProjectList`, retaining only the card grid.

- [ ] **Step 4: Run focused tests and verify GREEN for audience contracts**

Run:

```bash
node --test test/developer-portfolio-structure.test.mjs
npm run test:structure
npx tsc --noEmit --incremental false
```

Expected: audience assertions pass; locale assertions remain red until Task 3. Existing conversion tests that require dual audiences must be removed or rewritten only after equivalent single-path assertions exist.

- [ ] **Step 5: Verify zero audience references and delete old data**

Run:

```bash
rg "Audience|audienceOverrides|parseAudience|audienceContent|audience=" src
```

Expected: no output. Then delete `src/data/conversion.ts` and the obsolete dual-audience tests.

- [ ] **Step 6: Commit the audience collapse**

```bash
git add src test package.json
git commit -m "refactor: collapse portfolio to developer audience"
```

---

### Task 3: Flatten Korean Content and Remove i18n Runtime

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`
- Modify: `src/types/project.ts`, `src/data/projects.ts`, `src/data/portfolio.ts`
- Modify: all components importing from `@/i18n`
- Delete: `src/components/LanguageSwitcher.tsx`, `src/components/ClientWrapper.tsx`, `src/i18n/*`
- Test: `test/developer-portfolio-structure.test.mjs`

**Interfaces:**
- Produces: plain Korean strings and stable `Screen.id` values.
- Preserves: Korean SVG paths and current image assets.

- [ ] **Step 1: Extend the red contract for stable Korean screen data**

Add:

```js
test('project data uses Korean strings and stable screen identifiers', () => {
  const types = read('src/types/project.ts');
  const projects = read('src/data/projects.ts');

  assert.match(types, /id: string;/);
  assert.doesNotMatch(types, /LocaleText|LocalizedString/);
  assert.doesNotMatch(projects, /\ben:\s*['`]/);
  assert.match(projects, /architecture\.ko\.svg/);
});
```

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: FAIL because `LocaleText`, `LocalizedString`, and bilingual objects remain.

- [ ] **Step 2: Replace localized types with plain strings**

The final project types are:

```ts
export interface Screen {
  id: string;
  title: string;
  desc: string;
  imageAlt: string;
  imagePath?: string;
  scrollable?: boolean;
}

export interface ProjectCardPresentation {
  variant?: ProjectCardVariant;
  description?: string;
  evidenceBadges?: string[];
  thumbnailScreenIndex?: number;
  highlight?: string;
}

export interface Project {
  id: string;
  type: 'mobile' | 'web' | 'tablet' | 'package';
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  evidenceBadges?: string[];
  implementationPoints?: string[];
  releaseLabel?: string;
  cardPresentation?: ProjectCardPresentation;
  color: string;
  iconType: 'zap' | 'globe' | 'smartphone' | 'layers' | 'tablet' | 'brain' | 'utensils' | 'activity' | 'heart' | 'dumbbell' | 'scale';
  screens: Screen[];
  links?: ProjectLink[];
}
```

- [ ] **Step 3: Materialize Korean project values**

For every localized field in `src/data/projects.ts`, keep the current `ko` value. For `imagePath`, use the `ko` path. Add stable screen IDs derived from project-local meaning, for example:

```ts
{
  id: 'architecture',
  title: '아키텍처',
  desc: 'Flutter facade, Dart orchestration, Rust FFI 검색 코어, ONNX runtime, SQLite 저장소, HNSW/BM25 경로를 분리했습니다.',
  imageAlt: 'mobile_rag_engine 패키지 아키텍처',
  imagePath: '/images/mobile-rag-engine/architecture.ko.svg',
}
```

Replace the modal lookup `screen.title.en === 'Architecture'` with `screen.id === 'architecture'`.

- [ ] **Step 4: Make the App Router shell Korean on the server**

Use `Noto_Sans_KR`, `Noto_Serif_KR`, Fraunces, and Geist Mono from `next/font/google`. Render:

```tsx
<html lang="ko" className={`${notoSansKr.variable} ${notoSerifKr.variable} ${fraunces.variable} ${geistMono.variable}`}>
  <body className="antialiased">
    <a href="#main-content" className="skip-link sr-only ...">본문으로 건너뛰기</a>
    {children}
  </body>
</html>
```

Set metadata title to `오병희 | Flutter · 온디바이스 RAG 개발자` and a Korean description grounded in the approved positioning.

- [ ] **Step 5: Remove translation calls from active components**

Replace `t(project.title)` with `project.title`, `localize(screen.imagePath, locale)` with `screen.imagePath`, and all `ui.*` labels with Korean literals. Remove `useLocale`, `LocaleText`, `LocalizedString`, and `localize` imports.

- [ ] **Step 6: Verify zero locale references and delete runtime**

Run:

```bash
rg "useLocale|LocaleProvider|LocaleText|LocalizedString|localize\(|LanguageSwitcher|\ben:" src
```

Expected: no output. Delete the locale runtime and switcher files only after this gate.

- [ ] **Step 7: Run tests and commit**

```bash
npm run test
npx tsc --noEmit --incremental false
npm run lint
git add src test
git commit -m "refactor: make portfolio Korean only"
```

---

### Task 4: Add Recruitment Data Contracts

**Files:**
- Create: `src/types/recruitment.ts`, `src/data/recruitment.ts`
- Modify: `src/data/portfolio.ts`
- Test: `test/developer-portfolio-structure.test.mjs`

**Interfaces:**
- Produces: `recruitmentProfile`, `recruitmentCases`, `experienceItems`.
- Constraint: only repository-verified facts are populated.

- [ ] **Step 1: Write failing data-contract tests**

```js
test('recruitment data separates project assets from hiring evidence', () => {
  const types = read('src/types/recruitment.ts');
  const data = read('src/data/recruitment.ts');

  for (const name of ['EvidenceLink', 'RecruitmentCase', 'ExperienceItem', 'RecruitmentProfile']) {
    assert.match(types, new RegExp(`interface ${name}`));
  }
  assert.match(data, /local-mobile-rag-gemma/);
  assert.match(data, /pub\.dev 0\.18\.6/);
  assert.doesNotMatch(data, /MAU 1만|5년 4개월|10–100×/);
});
```

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: FAIL because the recruitment files do not exist.

- [ ] **Step 2: Define exact recruitment types**

```ts
export interface EvidenceLink {
  label: string;
  url: string;
  kind: 'github' | 'pubdev' | 'live' | 'docs' | 'article';
}

export interface RecruitmentCase {
  projectId: string;
  publicStatus: string;
  role?: string;
  period?: string;
  team?: string;
  problem: string;
  contributions: string[];
  outcomes: string[];
  evidenceLinks: EvidenceLink[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  employmentType: string;
  period: string;
  summary: string;
  highlights: string[];
  relatedProjectIds: string[];
}

export interface RecruitmentProfile {
  name: string;
  englishName: string;
  role: string;
  position: string;
  positioning: string;
  email: string;
  githubUrl: string;
  resumeUrl?: string;
  proofItems: Array<{ label: string; value: string; evidence?: string }>;
}
```

Optional role/period/team fields are omitted until verified rather than filled with placeholder strings.

- [ ] **Step 3: Add verified profile and case data**

Populate the profile with name, approved role, email, GitHub, and one verified proof item for `mobile_rag_engine · pub.dev 0.18.6`. Leave `resumeUrl` absent and `experienceItems` empty.

For the three cases, reuse only existing repository-backed descriptions, implementation points, and links. Do not add benchmark scores, MAU, team size, employment dates, or Easy Contract Viewer deployment status.

- [ ] **Step 4: Run data tests and commit**

```bash
npm run test
npx tsc --noEmit --incremental false
git add src/data src/types test
git commit -m "feat: add verified recruitment portfolio data"
```

---

### Task 5: Build the Recruitment Page Flow

**Files:**
- Create: layout primitives and recruitment widgets listed in File Map.
- Modify: `src/components/Portfolio.tsx`, `FeaturedWork.tsx`, `ProjectCard.tsx`, `ProjectGrid.tsx`, `OpenSourceBanner.tsx`, `Footer.tsx`, `widgets/index.ts`.
- Delete: `ConversionHero.tsx`, dead legacy header files after zero-import check.
- Test: `test/developer-portfolio-structure.test.mjs`.

**Interfaces:**
- Consumes: `recruitmentProfile`, `recruitmentCases`, `experienceItems`, fixed project IDs.
- Produces: approved straight-line recruitment journey and conditional empty sections.

- [ ] **Step 1: Extend structure tests for component boundaries**

Assert that `RecruitmentNav`, `DeveloperHero`, `CoreCapabilities`, `ExperienceTimeline`, `RecruitmentCTA`, `SectionContainer`, and `SectionHeader` exist; that `ExperienceTimeline` returns `null` when entries are empty; and that every resume link is conditional on `profile.resumeUrl`.

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: FAIL because the components do not exist.

- [ ] **Step 2: Implement shared section primitives**

`SectionContainer` owns `max-w-7xl mx-auto px-5 sm:px-6`. `SectionHeader` receives `eyebrow`, `title`, `description?`, and `count?`, and renders ordered text without locale state. `RecruitmentNav` links to `#about`, `#featured-work`, `#experience`, and `#contact`; it renders `이력서` only when `profile.resumeUrl` exists.

- [ ] **Step 3: Implement DeveloperHero**

Render a 1-column mobile/2-column large layout. The left column contains name, role, positioning, featured/email CTAs, and a conditional resume CTA. The right column maps only existing `proofItems`; it must not render empty proof cards.

- [ ] **Step 4: Refactor featured cards into articles**

`ProjectCard` renders `<article>`, an exposed `<h3>`, a separate `프로젝트 상세 열기` button with `aria-haspopup="dialog"`, and independent evidence links. It accepts optional `RecruitmentCase` and displays role/period/team only when defined.

- [ ] **Step 5: Implement capabilities, timeline, archive, and CTA**

- `CoreCapabilities` renders four approved capabilities after Featured.
- `ExperienceTimeline` returns `null` for `[]`.
- `ProjectGrid` uses one audience-free 1→2→3 grid.
- `OpenSourceBanner` contains only complementary package evidence and removes the unsupported `10–100×` line.
- `RecruitmentCTA` conditionally renders resume plus always-available email/GitHub.
- `Footer` uses `new Date().getFullYear()` and lives outside `<main>`.

- [ ] **Step 6: Compose Portfolio in approved order**

Render `RecruitmentNav` before the Hero. Keep the selected-project client state at the smallest interactive boundary, wrap `main + footer` in one inertable shell, and render modal/presentation as siblings.

- [ ] **Step 7: Run tests and commit**

```bash
npm run test
npx tsc --noEmit --incremental false
npm run lint
git add src test
git commit -m "feat: build Korean recruitment portfolio flow"
```

---

### Task 6: Repair Dialog, Presentation, and Screenshot Accessibility

**Files:**
- Modify: `ProjectModal.tsx`, `DeviceFrame.tsx`, `PresentationOverlay.tsx`, `ScreenImage.tsx`, `useFocusTrap.ts`, `globals.css`.
- Test: `test/developer-portfolio-structure.test.mjs`, `test/accessibility-tokens.test.mjs`.

**Interfaces:**
- Preserves: close-button initial focus, Tab trap, Escape, focus restoration.
- Produces: Korean names, aligned DOM/visual order, keyboard scroll regions, live slide status.

- [ ] **Step 1: Add failing semantic and token tests**

Assert Korean detail/close/presentation/previous/next labels, `aria-haspopup="dialog"`, `aria-live="polite"`, focusable screenshot regions, `prefers-reduced-motion`, and solid focus-ring colors.

Run: `node --test test/developer-portfolio-structure.test.mjs test/accessibility-tokens.test.mjs`

Expected: FAIL for English labels, missing live status, hidden scrollbars, and missing reduced-motion rules.

- [ ] **Step 2: Align modal DOM and visual order**

Remove mobile `order-2`/`order-1` reversal. Render project information before preview at every breakpoint. Change modal subsection headings from `h4` to `h3` and the standalone presentation title to `h2`.

- [ ] **Step 3: Localize actions and announce slides**

Use exact labels:

- `${title} 프로젝트 상세 열기`
- `${title} 프로젝트 상세 닫기`
- `${title} 프레젠테이션 열기`
- `프레젠테이션 닫기`
- `이전 화면`
- `다음 화면`

Add one polite, atomic live status: `화면 ${index + 1} / ${total}: ${screen.title}`.

Reorder the modal information panel to summary links → problem/constraints → responsibility boundary → architecture/decisions → testing/evaluation/operations → outcomes → trade-offs/non-goals → screenshots. Render available evidence links beside the summary as well as in the detailed section; do not create missing links.

- [ ] **Step 4: Make scrollable screenshots keyboard reachable**

For each `screen.scrollable` viewport add `tabIndex={0}`, `role="region"`, and `aria-label={`${screen.title} 스크린샷 스크롤 영역`}`. Replace hidden scrollbars on user-scrollable panels with a visible thin scrollbar and `scrollbar-gutter: stable`.

When `ScreenImage` fails, render the Korean `role="status"` message `이미지를 불러오지 못했습니다.` while leaving the title, description, and evidence links available. Card thumbnails use empty alt text; meaningful modal/presentation images use `screen.imageAlt`.

- [ ] **Step 5: Repair contrast, target sizes, and reduced motion**

Use solid `#0f766e` focus rings on light surfaces and `#faf7f2` on the dark presentation surface. Add `--accent-text: #9d4530`, make icon controls `min-h-11 min-w-11`, and disable all named animations in a `prefers-reduced-motion: reduce` query.

- [ ] **Step 6: Run focused tests and commit**

```bash
npm run test
npx tsc --noEmit --incremental false
npm run lint
git add src test
git commit -m "fix: improve Korean portfolio accessibility"
```

---

### Task 7: Add Playwright and axe Release Gates

**Files:**
- Create: `playwright.config.ts`, `e2e/accessibility.spec.ts`.
- Modify: `package.json`, `package-lock.json`.
- Test: `e2e/accessibility.spec.ts`.

**Interfaces:**
- Produces: `npm run test:a11y` and viewport/keyboard/axe evidence.

- [ ] **Step 1: Install test dependencies and add scripts**

Run:

```bash
npm install -D @playwright/test @axe-core/playwright
npx playwright install chromium
```

Add `"test:a11y": "playwright test e2e/accessibility.spec.ts"`.

- [ ] **Step 2: Configure the local test server**

Set `testDir: './e2e'`, `use.baseURL: 'http://127.0.0.1:3000'`, Chromium, trace on first retry, and `webServer.command: 'npm run dev -- --hostname 127.0.0.1'` with URL `http://127.0.0.1:3000`.

- [ ] **Step 3: Write end-to-end behaviors**

Cover:

1. Korean `lang`, no language/audience controls.
2. Skip link transfers focus to `#main-content`.
3. Featured CTA transfers focus or scrolls to Featured.
4. Card Enter opens a named dialog and Close receives focus.
5. Tab/Shift+Tab remain trapped; Escape restores card focus.
6. Presentation arrow changes the live status; Escape restores preview focus.
7. PageDown changes a named screenshot region's `scrollTop`.
8. Reduced-motion computed styles have `animation-name: none`.
9. Axe has zero critical/serious violations on home, modal, presentation.
10. No horizontal overflow at 360×740, 390×844, 768×1024, 1024×600, 1440×900, and 320×800.

- [ ] **Step 4: Run E2E and commit**

```bash
npm run test:a11y
git add package.json package-lock.json playwright.config.ts e2e
git commit -m "test: add portfolio accessibility release gates"
```

---

### Task 8: Full Verification and Browser Audit

**Files:**
- Modify only if verification exposes a defect.
- Output: current screenshots under `/tmp/dev-portfolio-korean-recruitment-audit-2026-07-10/`.

**Interfaces:**
- Consumes: final implementation.
- Produces: command, DOM, keyboard, accessibility, and screenshot evidence for completion audit.

- [ ] **Step 1: Run the complete command gate**

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run test
npm run test:a11y
npm run build
```

Expected: every command exits 0; Node tests show zero failures; axe reports zero critical/serious findings.

- [ ] **Step 2: Run zero-reference and claim scans**

```bash
rg "Audience|audienceOverrides|parseAudience|audienceContent|useLocale|LocaleProvider|LocaleText|LocalizedString|localize\(|LanguageSwitcher|\ben:" src
rg "Freelance Portfolio|외주 수주|Client list|Discuss a Project|MAU 1만|5년 4개월|10–100×" src
```

Expected: no output except allowed technical English strings that are outside the matched patterns.

- [ ] **Step 3: Capture and inspect the final flow**

Capture and visually inspect:

- 1440×900 Hero and Featured
- 768×1024 Featured and Additional Projects
- 390×844 Hero and first case
- desktop modal and mobile modal
- presentation view and a scrollable screenshot

Reject blank, loading, cropped, horizontally scrolled, or stale captures.

- [ ] **Step 4: Complete the requirement-by-requirement audit**

Compare every numbered requirement in the design spec with current source, command output, E2E results, and accepted screenshots. A missing resume remains optional and its CTA stays hidden. An empty `experienceItems` array is a release blocker under the approved design: request at least one verified company/role/period entry and do not claim the goal complete until it is supplied and rendered. Never fabricate either category.

- [ ] **Step 5: Use the branch-finishing workflow**

Invoke `superpowers:finishing-a-development-branch` only after every implementation and verification requirement is proven.
