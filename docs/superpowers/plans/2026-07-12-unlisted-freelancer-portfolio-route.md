# Unlisted Freelancer Portfolio Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an unlisted `/freelancer` portfolio route that shares verified project and career data with `/` while using freelancer-specific copy, ordering, CTA, navigation, resume visibility, and no-index metadata.

**Architecture:** Route-level Server Components select a serializable `PortfolioConfig` and pass it to the existing interactive `Portfolio` client component. Shared project and recruitment facts remain in their current modules; only route-specific presentation configuration lives in `src/data/portfolio.ts` and `src/data/freelancer.ts`. No query parsing, middleware, authentication, or duplicated project assets are introduced.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Node test runner, Playwright, axe-core.

## Global Constraints

- `/` must not render or reference a `/freelancer` navigation link.
- `/freelancer` must render `robots: { index: false, follow: false }` and remain absent from any sitemap.
- `/freelancer` must not link back to `/`; it is a standalone direct-share page.
- Shared career, project, image, and evidence facts must not be copied into freelancer-only data.
- The route is unlisted, not authenticated; no password or token behavior is added.
- Phone number, address, birth date, compensation, and unverified availability must not be rendered.
- No staging, commit, push, or pull request is performed without explicit user authorization.

---

### Task 1: Define the route configuration contract

**Files:**
- Create: `src/types/portfolio.ts`
- Modify: `src/data/portfolio.ts`
- Modify: `test/developer-portfolio-structure.test.mjs`

**Interfaces:**
- Produces: `Capability`, `PortfolioCopy`, and `PortfolioConfig`.
- `PortfolioConfig` contains `profile`, `copy`, `capabilities`, project ID arrays, recruitment cases, and experience items.
- `PortfolioCopy` contains the Hero, section, navigation, and contact CTA labels used by shared components.

- [ ] **Step 1: Write the failing structure test**

Add assertions that `src/types/portfolio.ts` exports `PortfolioConfig`, `src/data/portfolio.ts` exports `recruitmentPortfolioConfig`, and the config has no `/freelancer` route link.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: FAIL because `src/types/portfolio.ts` and `recruitmentPortfolioConfig` do not exist.

- [ ] **Step 3: Implement the contract and recruitment config**

Use this contract:

```ts
export interface Capability {
  title: string;
  evidence: string;
}

export interface PortfolioCopy {
  navBrandLabel: string;
  heroEyebrow: string;
  capabilityAriaLabel: string;
  primaryCta: string;
  contactCta: string;
  contactMailSubject?: string;
  featuredEyebrow: string;
  featuredHeading: string;
  featuredDescription: string;
  experienceDescription: string;
  additionalHeading: string;
  additionalDescription: string;
  contactHeading: string;
  contactDescription: string;
}

export interface PortfolioConfig {
  profile: RecruitmentProfile;
  copy: PortfolioCopy;
  capabilities: Capability[];
  featuredProjectIds: readonly string[];
  additionalProjectIds: readonly string[];
  cases: RecruitmentCase[];
  experienceItems: ExperienceItem[];
}
```

- [ ] **Step 4: Run the structure test and verify GREEN**

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: PASS with all existing recruitment assertions preserved.

### Task 2: Make the shared portfolio consume route configuration

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/Portfolio.tsx`
- Modify: `src/components/widgets/RecruitmentNav.tsx`
- Modify: `src/components/widgets/DeveloperHero.tsx`
- Modify: `src/components/widgets/FeaturedWork.tsx`
- Modify: `src/components/widgets/RecruitmentCTA.tsx`
- Modify: `test/developer-portfolio-structure.test.mjs`

**Interfaces:**
- Consumes: `PortfolioConfig` and `recruitmentPortfolioConfig` from Task 1.
- Produces: `<Portfolio config={...} />`; shared widgets receive explicit copy rather than importing route-specific data.

- [ ] **Step 1: Write failing assertions for configuration injection**

Assert that `src/app/page.tsx` renders `<Portfolio config={recruitmentPortfolioConfig} />`, `Portfolio.tsx` accepts `config: PortfolioConfig`, and `FeaturedWork.tsx` no longer imports `portfolioCopy` directly.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: FAIL because `Portfolio` still imports recruitment data internally.

- [ ] **Step 3: Implement minimal configuration injection**

Destructure the config in `Portfolio`, resolve every configured project ID against the shared `projects` array through a fail-closed resolver, and pass explicit `copy`, `profile`, and `capabilities` props to widgets. The resolver must throw an error containing the missing ID and selection context instead of silently omitting an item. Keep all modal, presentation, scroll lock, and focus management logic unchanged.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: PASS, including the existing deterministic-home and section-order tests.

### Task 3: Add the unlisted freelancer route and content

**Files:**
- Create: `src/data/freelancer.ts`
- Create: `src/app/freelancer/page.tsx`
- Modify: `test/developer-portfolio-structure.test.mjs`

**Interfaces:**
- Consumes: shared `projects`, `recruitmentCases`, `experienceItems`, and `recruitmentProfile`.
- Produces: `freelancerPortfolioConfig` with no resume URL, freelancer-specific copy, and ordered featured IDs.

- [ ] **Step 1: Write failing route and privacy tests**

Assert all of the following:

```js
assert.match(freelancerPage, /robots:[\s\S]*?index: false[\s\S]*?follow: false/);
assert.match(freelancerPage, /<Portfolio config=\{freelancerPortfolioConfig\}/);
assert.doesNotMatch(homePage, /\/freelancer/);
assert.doesNotMatch(freelancerData, /routeLink|일반 포트폴리오로 돌아가기/);
assert.match(freelancerData, /'easy-contract-viewer'[\s\S]*?'local-mobile-rag-gemma'[\s\S]*?'law-info-engine'/);
assert.match(freelancerData, /contactCta: '프로젝트 상담'/);
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: FAIL because the route and freelancer config are missing.

- [ ] **Step 3: Implement the freelancer config**

Build the profile from shared facts and override only presentation fields:

```ts
const freelancerProfile: RecruitmentProfile = {
  ...recruitmentProfile,
  role: '모바일 제품 · 문서 검색/RAG 프로젝트 수행 개발자',
  position: '크로스플랫폼 앱 · Native 연동 · Retrieval/RAG · FastAPI',
  positioning:
    '기존 모바일 제품의 고도화부터 문서·PDF 검색 기능과 검색 백엔드까지 구현합니다.',
  resumeUrl: undefined,
};
```

Use featured IDs `easy-contract-viewer`, `local-mobile-rag-gemma`, and `law-info-engine`; reuse the existing cases and reorder references from the shared `experienceItems` so `㈜피에트` appears first without duplicating career fact objects. Set a freelancer-specific `experienceDescription` that truthfully describes project-fit ordering; keep the public route's original latest-first array and copy. Do not add cross-route navigation.

- [ ] **Step 4: Implement the static App Router page**

```tsx
import type { Metadata } from 'next';
import Portfolio from '@/components/Portfolio';
import { freelancerPortfolioConfig } from '@/data/freelancer';

export const metadata: Metadata = {
  title: '오병희 | 프리랜서 프로젝트 포트폴리오',
  description:
    '모바일 제품화와 문서·PDF 검색/RAG 프로젝트 수행 경험을 정리한 전달용 포트폴리오입니다.',
  robots: { index: false, follow: false },
};

export default function FreelancerPage() {
  return <Portfolio config={freelancerPortfolioConfig} />;
}
```

- [ ] **Step 5: Run the test and verify GREEN**

Run: `node --test test/developer-portfolio-structure.test.mjs`

Expected: PASS with the public route still free of `/freelancer` links.

### Task 4: Verify browser behavior, accessibility, and static output

**Files:**
- Modify: `e2e/accessibility.spec.ts`
- Update only if generated by verification: no source files

**Interfaces:**
- Consumes: `/` and `/freelancer` routes from Tasks 2 and 3.
- Produces: browser contracts for unlisted metadata, navigation direction, CTA copy, project order, modal reuse, and responsive layout.

- [ ] **Step 1: Write failing Playwright coverage**

Add tests that verify:

- Every anchor on `/` is resolved with the URL parser against `document.baseURI`, and none has pathname exactly `/freelancer` (including query, hash, protocol-relative, and absolute URL variants).
- `/freelancer` contains a robots meta tag with `noindex` and `nofollow`.
- Every anchor on `/freelancer` is resolved the same way, and none has pathname exactly `/`; same-page hash anchors remain allowed because their pathname is `/freelancer`.
- `/sitemap.xml` may return 404 when no sitemap exists; if it exists, it must be valid XML and no normalized `<loc>` URL may have pathname exactly `/freelancer`.
- Freelancer featured headings are `Easy Contract Viewer`, `mobile_rag_engine`, `Swifty-law`.
- Freelancer Hero and contact CTA expose `프로젝트 상담` and omit `이력서 보기`.
- One freelancer project modal opens, closes with Escape, and restores focus.
- The freelancer route has zero horizontal overflow at 390px and 320px and remains at or below 8,000px at 390px.

- [ ] **Step 2: Run targeted E2E and verify RED**

Run: `npx playwright test e2e/accessibility.spec.ts --grep "프리랜서"`

Expected: FAIL until the route is fully wired and copy is rendered.

- [ ] **Step 3: Make only the minimal UI adjustments required by the failing browser tests**

Do not add a public route switcher or a route-back link. Keep the primary navigation as the first visible header row at 320px and wider viewports.

- [ ] **Step 4: Run targeted E2E and verify GREEN**

Run: `npx playwright test e2e/accessibility.spec.ts --grep "프리랜서"`

Expected: PASS in configured Chromium and WebKit projects.

- [ ] **Step 5: Run the complete verification suite**

```bash
npm run test
npm run lint
npx tsc --noEmit --incremental false
npm run test:a11y
npm run build
```

Expected: all commands exit 0; `next build` lists both `/` and `/freelancer` as static routes.
