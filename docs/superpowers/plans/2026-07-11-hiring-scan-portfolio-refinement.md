# Hiring Scan Portfolio Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorten the Korean recruitment portfolio into a fast hiring scan without losing representative technical evidence, career chronology, project details, or a safe public resume.

**Architecture:** Keep the existing single-page Next.js route and modal system. Remove duplicated standalone sections, materialize compact summaries inside the Hero and archive, introduce explicit public-evidence and supporting-package data, and use native HTML disclosure for career details. Generate a separate sanitized resume PDF from already-public site data.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node test runner, Playwright, axe-core, PDF generation tooling supplied by the workspace PDF skill.

## Global Constraints

- Work directly on the current `main`; do not create a hidden worktree and do not push.
- Page order is nav → Hero/proof/capabilities → featured cases → experience → compact archive → CTA → Footer.
- Keep `DEV PORTFOLIO`, product names, library names, and technical terms; remove decorative English copy.
- Keep six latest-first career entries and five additional projects.
- Keep the three featured cases in `mobile_rag_engine → Easy Contract Viewer → Swifty-law` order.
- Do not expose phone number, address, desired salary, or other private resume facts.
- 320px has no horizontal document or app-bar overflow; nav controls are at least 44px tall.
- VoiceOver and manual screen-reader validation are out of scope.
- Every implementation task follows RED → GREEN and is committed only after its focused and regression checks pass.

---

### Task 1: Repair the app bar for 320px

**Files:**
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `e2e/accessibility.spec.ts`
- Modify: `src/components/widgets/RecruitmentNav.tsx`

**Interfaces:**
- Consumes: `hasExperience` and the existing in-page anchors.
- Produces: `DEV PORTFOLIO`, `기술 사례`, conditional `경력`, and `연락` links with 44px touch height.

- [x] Add a structure test that asserts `소개` is absent, `기술 사례` targets `#featured-work`, and the shared link class contains `min-h-11`.
- [x] Add a 320px Playwright assertion that every nav link is horizontally reachable and at least 44px tall.
- [x] Run the focused Node test and 320px Playwright test; confirm they fail on the current nav.
- [x] Change the navigation data to:

```tsx
const navigation = [{ label: '기술 사례', href: '#featured-work' }] as const;
```

- [x] Make the nav links `inline-flex min-h-11 items-center` without horizontal padding that reintroduces overflow, and reduce container gaps only as needed.
- [x] Re-run focused and full structural tests; commit as `fix: make recruitment nav fit narrow screens`.

### Task 2: Absorb capabilities into the Hero

**Files:**
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `src/data/portfolio.ts`
- Modify: `src/components/Portfolio.tsx`
- Modify: `src/components/widgets/DeveloperHero.tsx`
- Modify: `src/components/widgets/index.ts`
- Delete: `src/components/widgets/CoreCapabilities.tsx`

**Interfaces:**
- Consumes: `Capability[]` from `src/data/portfolio.ts`.
- Produces: `<DeveloperHero profile={recruitmentProfile} capabilities={capabilities} />` and a compact four-item list.

- [x] Add a failing structure test requiring `DeveloperHero` to consume `capabilities`, requiring four project-backed capability items, and forbidding `<CoreCapabilities` plus the component export/file.
- [x] Change `Capability` to `{ title: string; evidence: string }` and shorten the four entries to the approved titles and project names.
- [x] Add `capabilities: Capability[]` to `DeveloperHeroProps`; render a two-column list after the positioning sentence and before CTA buttons.
- [x] Remove the independent section call, export, and file.
- [x] Run focused/full tests and TypeScript; commit as `refactor: move capability summary into hero`.

### Task 3: Separate evidence tiers and integrate the supporting package

**Files:**
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `src/types/recruitment.ts`
- Modify: `src/data/recruitment.ts`
- Modify: `src/components/widgets/ProjectCard.tsx`
- Modify: `src/components/widgets/ProjectModal.tsx`
- Modify: `src/components/Portfolio.tsx`
- Modify: `src/components/widgets/index.ts`
- Delete: `src/components/widgets/OpenSourceBanner.tsx`

**Interfaces:**
- Produces:

```ts
export interface SupportingPackage {
  name: string;
  version: string;
  relationship: string;
  techStack: string[];
  links: EvidenceLink[];
}

export interface RecruitmentCase {
  // existing fields
  supportingPackages?: SupportingPackage[];
}
```

- [x] Add failing tests requiring evidence-linked cases to render `공개 근거가 있는 결과`, unlinked cases to render `핵심 결과`, and forbidding `검증 가능한 결과`.
- [x] Add failing tests requiring `rag_engine_flutter` under the `mobile_rag_engine` recruitment case and forbidding `<OpenSourceBanner` and its export/file.
- [x] Add `SupportingPackage`, populate `rag_engine_flutter 0.18.3`, and render its one-line relationship, pub.dev/GitHub links, and tags in the featured card/modal.
- [x] Remove the standalone open-source section, export, and component.
- [x] Run tests and TypeScript; commit as `refactor: integrate supporting package evidence`.

### Task 4: Compress the career timeline

**Files:**
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `e2e/accessibility.spec.ts`
- Modify: `src/components/widgets/ExperienceTimeline.tsx`

**Interfaces:**
- Consumes: unchanged `ExperienceItem[]` and project lookup.
- Produces: six compact items with visible company/period/role/employment badge/first highlight and native `details` for remaining information.

- [x] Add a failing structure test requiring `<details>` and `<summary>상세 경력 보기</summary>`, `highlights[0]` outside details, and `highlights.slice(1)` inside details.
- [x] Add a Playwright test that counts six items, expands the first career, and confirms its summary and related project become visible.
- [x] Refactor each timeline item to keep the first highlight visible, place employment type in a pill, and move summary, remaining highlights, and related links inside `details`.
- [x] Replace the section description with `최신순으로 역할과 대표 성과를 요약했습니다.` and eyebrow with `경력`.
- [x] Run tests; commit as `refactor: compact career timeline for hiring scan`.

### Task 5: Replace the additional-project grid with a compact archive

**Files:**
- Create: `src/components/widgets/ProjectArchive.tsx`
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `e2e/accessibility.spec.ts`
- Modify: `src/components/Portfolio.tsx`
- Modify: `src/components/widgets/index.ts`
- Delete: `src/components/widgets/ProjectGrid.tsx`

**Interfaces:**
- Consumes: `Project[]`, heading, description, and `onProjectClick(project)`.
- Produces: five `article` rows with number, title, Korean type, `cardPresentation.highlight`, first three tech tags, and a dialog-opening `상세 보기` button.

- [x] Add failing tests requiring `ProjectArchive`, five rows, `techStack.slice(0, 3)`, responsibility text, and absence of `ProjectGrid`.
- [x] Add Playwright assertions that all five archive headings are reachable at 320px and the first archive detail button opens its modal.
- [x] Implement `ProjectArchive` with one responsive row per project and no screenshot thumbnail.
- [x] Swap the component import/render/export and delete `ProjectGrid`.
- [x] Run tests and TypeScript; commit as `refactor: compact additional project archive`.

### Task 6: Finish Korean copy, mobile modal order, and image priority

**Files:**
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `e2e/accessibility.spec.ts`
- Modify: `src/types/recruitment.ts`
- Modify: `src/data/recruitment.ts`
- Modify: `src/components/widgets/DeveloperHero.tsx`
- Modify: `src/components/widgets/FeaturedWork.tsx`
- Modify: `src/components/widgets/ProjectModal.tsx`
- Modify: `src/components/widgets/ProjectCard.tsx`
- Modify: `src/components/widgets/RecruitmentCTA.tsx`
- Modify: `src/components/widgets/Footer.tsx`

**Interfaces:**
- Keeps `DEV PORTFOLIO` as the only decorative English brand exception.
- Preserves the desktop modal two-column layout while moving `DeviceFrame` between header and details below `lg`.

- [x] Add failing tests that forbid `Byeonghee Oh`, `Engineering capabilities`, `Experience`, `Project archive`, `Open source support`, `Contact`, and `Trade-off` in active UI source.
- [x] Add a mobile modal Playwright order assertion: dialog header → presentation button/image → `문제와 제약`.
- [x] Remove `englishName` from the recruitment type/data/Hero and translate section eyebrows and `트레이드오프` labels.
- [x] Split modal header/details so the mobile visual appears immediately after header; retain one visual instance and the desktop 2-column behavior.
- [x] Keep the first featured thumbnail `priority={true}` and ensure its `ScreenImage` emits eager/priority loading without console warnings.
- [x] Run Node, Playwright console, modal, and responsive tests; commit as `refactor: finish Korean responsive case flow`.

### Task 7: Generate and link a sanitized public resume

**Files:**
- Create: `public/oh-byeonghee-resume-ko.pdf`
- Modify: `src/data/recruitment.ts`
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `e2e/accessibility.spec.ts`
- Create or modify only the PDF-generation source required by the selected PDF skill workflow.

**Interfaces:**
- Produces `resumeUrl: '/oh-byeonghee-resume-ko.pdf'`.
- The PDF includes only site-public name, email, GitHub, role, skills, career, and project evidence.

- [x] Load and follow the PDF skill; render the original resume for source validation without copying private facts.
- [x] Add failing tests requiring the public URL and forbidding phone, address, salary, and other non-public fields in source and extracted public-PDF text.
- [x] Generate the Korean PDF, render every page, visually inspect it, and extract text to verify content and privacy exclusions.
- [x] Link the same URL from Hero and CTA; keep the app bar resume-free at 320px and update Playwright expectations to those two surfaces.
- [x] Run focused/full tests and build; commit as `feat: add sanitized public developer resume`.

### Task 8: Final responsive and release verification

**Files:**
- Modify: `docs/reports/2026-07-10-korean-portfolio-release-verification.md`
- Create: `output/hiring-scan-verification-2026-07-11/` screenshots and measurements.

**Interfaces:**
- Produces fresh evidence for the approved final state.

- [x] Run `npm run test`, `npm run lint`, `npx tsc --noEmit --incremental false`, `npm run test:a11y`, and `npm run build`.
- [x] Verify localhost HTTP 200 and zero browser console warnings/errors.
- [x] Capture 1440×900, 390×844, and 320×800 screenshots for Hero, featured cases, experience, archive, CTA, and modal.
- [x] Measure 320px document/nav overflow and 390px total page height; require zero overflow and at most 8,000px height.
- [x] Confirm private resume strings and removed component/copy names are absent with `rg` and PDF text extraction.
- [x] Update the verification report with exact commands, counts, measurements, and known non-goals.
- [x] Commit as `docs: verify hiring scan portfolio release` and leave the local server running on the final `main`.
