# Focused Additional Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen the RAG and search-engine developer positioning by removing Motgo and the duplicate FIET user app from the public additional-project archive, retaining three evidence-dense supporting projects, and replacing the FIET trainer splash preview with an implemented report screen.

**Architecture:** Keep all `Project` data and image assets available in `src/data/projects.ts`; change the shared `additionalProjectIds` selection used by `/` and `/freelancer`. Absorb `fiet-fitness-user` into the existing FIET company-level career narrative by removing its standalone related-project link, and make Motgo unlisted because no active route configuration references it. Reuse the existing `cardPresentation.thumbnailScreenIndex` contract and make the tablet modal preview honor that selected index.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Node test runner, Playwright, Chromium, WebKit.

## Global Constraints

- The public additional-project order is exactly `haru-check → fiet-fitness-trainer → weedool` on both `/` and `/freelancer`.
- `motgo` and `fiet-fitness-user` must not appear in either route's `additionalProjectIds` selection.
- Keep the complete Motgo and FIET user project objects and image assets in the repository; do not delete or rewrite their historical data.
- Motgo must have no heading, archive row, detail trigger, navigation link, or other public entry point on `/` or `/freelancer`.
- The `㈜피에트` career item must link only to `fiet-fitness-trainer`; the existing company summary continues to represent the wider FIET app family without a second standalone project entry.
- Keep the three featured projects and their route-specific order unchanged.
- Keep route metadata, `noindex, nofollow`, cross-route link absence, career ordering, Hero copy, and CTA behavior unchanged.
- The FIET trainer modal must initially show `/images/fiet-fitness-trainer/report-inbody.png`, not `Splash.png`.
- Reuse the current report image without cropping or generating a replacement asset; render the scrollable report with `object-contain` in the modal preview.
- Preserve modal focus trapping, Escape close, trigger-focus restoration, presentation navigation, and 44px minimum interactive targets.
- Maintain zero horizontal overflow at 320px and 390px.
- Do not add new metrics, external links, RAG claims, AI claims, or BLE performance values as part of this scope.
- Keep Motgo out of the public resume PDF and the external Wanted resume; do not replace it with another weak project solely to preserve project count.
- Do not overwrite the source audit files in `output/motgo-audit-2026-07-12/`.

---

## Audit Decision

### Accepted findings

1. `output/motgo-audit-2026-07-12/01-additional-projects.png`
   - Motgo occupies the strongest archive position immediately after the featured cases.
   - Its Next.js voting and share-link story lowers the technical density of the RAG, retrieval, AI-product, and mobile-integration narrative.
2. `output/motgo-audit-2026-07-12/02-motgo-detail.png`
   - Motgo has no current public service or GitHub evidence, no measured outcome, and no direct connection to the target positioning.
   - Recommendation accepted: retain the data but remove all active public selection references.
3. `output/motgo-audit-2026-07-12/03-piet-trainer-detail.png`
   - BLE integration, trainer workflow, and release automation are relevant supporting evidence.
   - The splash screen is not sufficient as the initial visual; the existing InBody report is selected instead.
4. `output/motgo-audit-2026-07-12/04-harucheck-detail.png`
   - HaruCheck remains the first supporting project because it has a live service, GitHub evidence, Vertex AI integration, and real product screens.

### Final supporting-project hierarchy

1. `HaruCheck` — AI feature productization with public evidence.
2. `피에트 피트니스 트레이너` — BLE integration, tablet workflow, reporting, and delivery automation.
3. `Weedool (TuringBio)` — production mobile experience, behavior-activation flow, maps, analytics, and store evidence.
4. `피에트 피트니스` — removed as a standalone public project and absorbed into the existing FIET company-level career narrative.
5. `Motgo 맛집 투표 서비스` — removed from all active portfolio selection paths while its source data remains stored.

### Evidence limits

- The provided audit screenshots show desktop states only. Keyboard access, mobile reflow, zoom, and assistive-technology behavior require automated browser checks.
- No new product-performance or business-impact statement is supported by the audit.
- The FIET report screenshot shows a real product result surface, but it does not by itself prove BLE behavior; existing BLE copy remains unchanged and no new BLE claim is introduced.

---

## File Map

- Modify: `src/data/portfolio.ts`
  - Reduce and reorder `additionalProjectIds` and update the public supporting-project description.
- Modify: `src/data/freelancer.ts`
  - Update the freelancer supporting-project description to match the three selected mobile/AI cases.
- Modify: `src/data/recruitment.ts`
  - Keep the FIET company narrative and reduce its related-project links to the trainer project only.
- Modify: `src/data/projects.ts`
  - Add FIET trainer `cardPresentation` values selecting the InBody report.
- Modify: `src/components/widgets/DeviceFrame.tsx`
  - Make `TabletFrame` consume `currentScreenIndex` and use `contain` for scrollable report previews.
- Modify: `test/developer-portfolio-structure.test.mjs`
  - Lock the three-project selection, retained hidden data, single FIET related-project link, and trainer preview configuration.
- Modify: `e2e/accessibility.spec.ts`
  - Verify the exact route order, Motgo and FIET user absence, trainer-only FIET career link, trainer report preview, presentation index, focus behavior, and responsive layout.
- Create during verification: `output/focused-additional-projects-verification-2026-07-12/1440x900-archive.png`
- Create during verification: `output/focused-additional-projects-verification-2026-07-12/1440x900-fiet-trainer.png`
- Create during verification: `output/focused-additional-projects-verification-2026-07-12/390x844-archive.png`

---

### Task 1: Reduce the Shared Additional-Project Selection to Three

**Files:**
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `e2e/accessibility.spec.ts`
- Modify: `src/data/portfolio.ts`
- Modify: `src/data/freelancer.ts`
- Modify: `src/data/recruitment.ts`

**Interfaces:**
- Consumes: the shared `additionalProjectIds` imported by both route configs.
- Produces: the exact route-visible order `haru-check`, `fiet-fitness-trainer`, `weedool` and route-specific descriptions of those three cases.

- [ ] **Step 1: Write the failing structure test**

Add this test to `test/developer-portfolio-structure.test.mjs`:

```js
test('additional projects expose three positioning-aligned cases and retain hidden data', () => {
  const portfolioData = read('src/data/portfolio.ts');
  const freelancerData = read('src/data/freelancer.ts');
  const projects = read('src/data/projects.ts');
  const recruitment = read('src/data/recruitment.ts');
  const selection = portfolioData.match(
    /export const additionalProjectIds = \[([\s\S]*?)\] as const;/
  );

  assert.ok(selection, 'additionalProjectIds must exist');
  assert.match(
    selection[1],
    /'haru-check'[\s\S]*?'fiet-fitness-trainer'[\s\S]*?'weedool'/
  );
  assert.doesNotMatch(selection[1], /motgo|fiet-fitness-user/);
  assert.match(projects, /id: ["']motgo["']/);
  assert.match(projects, /id: ["']fiet-fitness-user["']/);
  assert.match(freelancerData, /import \{ additionalProjectIds \} from '.\/portfolio';/);
  assert.match(
    recruitment,
    /company: '㈜피에트'[\s\S]*?relatedProjectIds: \['fiet-fitness-trainer'\]/
  );
  assert.doesNotMatch(
    recruitment.match(/company: '㈜피에트'[\s\S]*?\n  \},/)?.[0] ?? '',
    /fiet-fitness-user/
  );
  assert.match(
    portfolioData,
    /additionalDescription: 'AI 기능 제품화와 BLE·모바일 운영 경험을 보완하는 세 가지 사례입니다\.'/
  );
  assert.match(
    freelancerData,
    /additionalDescription:[\s\S]*?'AI 기능 제품화와 BLE·모바일 운영 경험을 보여주는 세 가지 수행 사례입니다\.'/
  );
});
```

- [ ] **Step 2: Replace the existing route-rendering expectations with the desired contract**

In `e2e/accessibility.spec.ts`, set the shared expected archive titles to:

```ts
const additionalTitles = [
  'HaruCheck',
  '피에트 피트니스 트레이너',
  'Weedool (TuringBio)',
];
```

For both route paths, assert the three visible headings and the absence of Motgo:

```ts
await expect(page.locator('#additional-projects article')).toHaveCount(3);
await expect(
  page.getByRole('heading', { name: 'Motgo 맛집 투표 서비스', exact: true })
).toHaveCount(0);
await expect(
  page.getByRole('button', {
    name: 'Motgo 맛집 투표 서비스 프로젝트 상세 열기',
  })
).toHaveCount(0);
```

Rename the mobile archive test to `320px 추가 프로젝트 archive가 세 행과 기존 상세를 제공한다`, assert three rows, and open `HaruCheck` instead of Motgo:

```ts
const detailButton = archive.getByRole('button', {
  name: 'HaruCheck 프로젝트 상세 열기',
});
await expect(detailButton).toHaveText('상세 보기');
await detailButton.click();
await expect(page.getByRole('dialog', { name: /HaruCheck/ })).toBeVisible();
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern='additional projects expose' test/developer-portfolio-structure.test.mjs
npx playwright test e2e/accessibility.spec.ts --grep '실제 라우트 설정|추가 프로젝트 archive'
```

Expected: the structure test fails because the active selection still contains five IDs; the browser tests fail because both routes still render five archive rows with Motgo first.

- [ ] **Step 4: Replace the active selection**

In `src/data/portfolio.ts`, replace the selection with:

```ts
export const additionalProjectIds = [
  'haru-check',
  'fiet-fitness-trainer',
  'weedool',
] as const;
```

Change the public description to:

```ts
additionalDescription:
  'AI 기능 제품화와 BLE·모바일 운영 경험을 보완하는 세 가지 사례입니다.',
```

In `src/data/freelancer.ts`, change only the supporting-project description:

```ts
additionalDescription:
  'AI 기능 제품화와 BLE·모바일 운영 경험을 보여주는 세 가지 수행 사례입니다.',
```

In the `㈜피에트` entry in `src/data/recruitment.ts`, replace the related-project selection with:

```ts
relatedProjectIds: ['fiet-fitness-trainer'],
```

Keep the existing FIET summary and highlights unchanged; they already describe the company-level app family and verified BLE/release work.

- [ ] **Step 5: Verify the FIET user app is retained in data but has no standalone public link**

Add this browser test:

```ts
test('피에트 사용자 앱은 데이터에 남고 공개 프로젝트 링크에서는 제외된다', async ({
  page,
}) => {
  await page.goto('/#experience');

  await expect(
    page.locator('#additional-projects').getByRole('heading', {
      name: '피에트 피트니스',
      exact: true,
    })
  ).toHaveCount(0);

  const fietExperience = page
    .locator('#experience > div ol > li')
    .filter({ hasText: '㈜피에트' });
  await fietExperience.getByText('상세 경력 보기', { exact: true }).click();
  await expect(
    fietExperience.getByRole('link', {
      name: '피에트 피트니스 트레이너',
      exact: true,
    })
  ).toBeVisible();
  await expect(
    fietExperience.getByRole('link', { name: '피에트 피트니스', exact: true })
  ).toHaveCount(0);
});
```

- [ ] **Step 6: Run the focused tests and verify GREEN**

Run:

```bash
node --test --test-name-pattern='additional projects expose' test/developer-portfolio-structure.test.mjs
npx playwright test e2e/accessibility.spec.ts --grep '실제 라우트 설정|추가 프로젝트 archive|피에트 사용자 앱'
```

Expected: PASS in the Node suite and in both Chromium and WebKit.

- [ ] **Step 7: Commit the focused selection**

```bash
git add src/data/portfolio.ts src/data/freelancer.ts src/data/recruitment.ts test/developer-portfolio-structure.test.mjs e2e/accessibility.spec.ts
git commit -m "refactor: focus additional project portfolio"
```

---

### Task 2: Replace the FIET Trainer Splash with Report Evidence

**Files:**
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `e2e/accessibility.spec.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/components/widgets/DeviceFrame.tsx`

**Interfaces:**
- Consumes: `Project.cardPresentation.thumbnailScreenIndex`, `Portfolio.currentScreenIndex`, and the existing trainer screen at index `1`.
- Produces: a trainer archive highlight, an InBody report modal preview, and presentation opening at screen `2 / 6`.

- [ ] **Step 1: Write the failing trainer presentation test**

Add this structure test:

```js
test('FIET trainer uses report evidence instead of the splash screen', () => {
  const projects = read('src/data/projects.ts');

  assert.match(
    projects,
    /id: ["']fiet-fitness-trainer["'][\s\S]*?cardPresentation:[\s\S]*?thumbnailScreenIndex: 1/[\s\S]*?screens:/
  );
  assert.match(
    projects,
    /highlight:[\s\S]*?["']BLE 실시간 센서 연동, 트레이너용 분석 리포트, Fastlane·GitHub Actions 배포 자동화를 구현했습니다\.["']/
  );
  assert.match(
    projects,
    /id: ["']report-inbody["'][\s\S]*?imagePath: ["']\/images\/fiet-fitness-trainer\/report-inbody\.png["']/
  );
});
```

Add this browser test:

```ts
test('피에트 트레이너 상세는 스플래시 대신 인바디 리포트를 첫 근거로 제공한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#additional-projects');
  await page
    .getByRole('button', {
      name: '피에트 피트니스 트레이너 프로젝트 상세 열기',
    })
    .click();

  const dialog = page.getByRole('dialog', {
    name: /피에트 피트니스 트레이너/,
  });
  const preview = dialog.getByRole('button', {
    name: '피에트 피트니스 트레이너 결과 리포트 - 인바디 프레젠테이션 열기',
  });

  await expect(preview.locator('img')).toHaveAttribute(
    'src',
    /\/images\/fiet-fitness-trainer\/report-inbody\.png/
  );
  await expect(preview.locator('img')).toHaveAttribute(
    'alt',
    '피에트 피트니스 트레이너 결과 리포트 - 인바디'
  );
  await preview.click();
  await expect(page.getByText('화면 2 / 6: 결과 리포트 - 인바디', { exact: true })).toBeVisible();
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
node --test --test-name-pattern='FIET trainer uses' test/developer-portfolio-structure.test.mjs
npx playwright test e2e/accessibility.spec.ts --grep '피에트 트레이너 상세는'
```

Expected: the structure test fails because the trainer has no `cardPresentation`; the browser test fails because `TabletFrame` renders `screens[0]`, the splash image.

- [ ] **Step 3: Select the report screen and strengthen the archive responsibility line**

Add this block to the `fiet-fitness-trainer` project after `implementationPoints`:

```ts
cardPresentation: {
  variant: "product-screenshot",
  thumbnailScreenIndex: 1,
  highlight:
    "BLE 실시간 센서 연동, 트레이너용 분석 리포트, Fastlane·GitHub Actions 배포 자동화를 구현했습니다.",
  evidenceBadges: ["BLE", "분석 리포트", "CI/CD"],
},
```

Do not reorder the trainer `screens` array. Index `1` must remain `report-inbody` so the splash stays available in presentation history without being the first visible proof.

- [ ] **Step 4: Make the tablet modal preview honor `currentScreenIndex`**

Change the modal branch in `DeviceFrame` to:

```tsx
<TabletFrame
  project={project}
  currentScreenIndex={currentScreenIndex}
  onClick={onEnterPresentation}
/>
```

Replace the `TabletFrame` function with:

```tsx
const TabletFrame = ({
  project,
  currentScreenIndex,
  onClick,
}: {
  project: Project;
  currentScreenIndex: number;
  onClick: (e: PresentationTriggerEvent) => void;
}) => {
  const title = project.title.replace(/\s+/g, ' ');
  const featuredScreen =
    project.screens[currentScreenIndex] ?? project.screens[0];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onClick(e);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${title} ${featuredScreen?.title ?? ''} 프레젠테이션 열기`.replace(
        /\s+/g,
        ' '
      )}
      className="relative mx-auto flex h-[336px] w-[236px] cursor-pointer flex-col appearance-none rounded-[2rem] border-[10px] border-gray-100 bg-gray-100 p-0 text-left shadow-xl transition-transform duration-500 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f2ede4] sm:h-[400px] sm:w-[280px] lg:h-[510px] lg:w-[360px]"
    >
      <div className="absolute left-1/2 top-3 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-300" />
      <div className="relative mt-2 h-full w-full overflow-hidden rounded-[1.5rem] bg-slate-800">
        {featuredScreen?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={featuredScreen.imagePath}
            alt={featuredScreen.imageAlt}
            fallbackGradient={project.color}
            fit={featuredScreen.scrollable ? 'contain' : 'cover'}
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${project.color} p-4 text-center text-white`}
          >
            <Tablet size={48} className="mb-4 opacity-80" />
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-2 text-xs opacity-75">눌러서 화면 보기</p>
          </div>
        )}
      </div>
    </button>
  );
};
```

- [ ] **Step 5: Assert the archive exposes the stronger trainer summary**

In the three-row archive browser test, add:

```ts
await expect(
  archive.getByText(
    'BLE 실시간 센서 연동, 트레이너용 분석 리포트, Fastlane·GitHub Actions 배포 자동화를 구현했습니다.',
    { exact: true }
  )
).toBeVisible();
```

No `ProjectArchive` implementation change is expected because it already prefers `cardPresentation.highlight`.

- [ ] **Step 6: Run the focused tests and verify GREEN**

Run:

```bash
node --test --test-name-pattern='FIET trainer uses' test/developer-portfolio-structure.test.mjs
npx playwright test e2e/accessibility.spec.ts --grep '피에트 트레이너 상세는|추가 프로젝트 archive'
```

Expected: PASS in the Node suite and in both Chromium and WebKit.

- [ ] **Step 7: Commit the trainer visual evidence**

```bash
git add src/data/projects.ts src/components/widgets/DeviceFrame.tsx test/developer-portfolio-structure.test.mjs e2e/accessibility.spec.ts
git commit -m "feat: foreground FIET trainer report evidence"
```

---

### Task 3: Verify the Focused Portfolio Flow

**Files:**
- Modify only if a failing test reveals a defect: files already named in Tasks 1-2.
- Create: `output/focused-additional-projects-verification-2026-07-12/1440x900-archive.png`
- Create: `output/focused-additional-projects-verification-2026-07-12/1440x900-fiet-trainer.png`
- Create: `output/focused-additional-projects-verification-2026-07-12/390x844-archive.png`

**Interfaces:**
- Consumes: the final shared project selection and FIET trainer preview.
- Produces: automated regression evidence and accepted before/after visual captures.

- [ ] **Step 1: Run the complete structure suite**

```bash
npm run test
```

Expected: all tests pass, including exact project selection, retained hidden data, fail-closed resolution, and trainer preview contracts.

- [ ] **Step 2: Run lint and TypeScript**

```bash
npm run lint
npx tsc --noEmit --incremental false
```

Expected: both commands exit `0` with no new warning or error.

- [ ] **Step 3: Verify the repository resume remains Motgo-free**

In the existing `public resume PDF is extractable and contains only approved public profile fields` test, add:

```js
assert.doesNotMatch(text, /Motgo|맛집 투표/);
```

Run:

```bash
node --test --test-name-pattern='public resume PDF' test/developer-portfolio-structure.test.mjs
```

Expected: PASS with the existing public PDF unchanged and no Motgo match.

- [ ] **Step 4: Apply the same editorial gate to the external Wanted resume**

Before saving or publishing the Wanted resume:

```text
1. Search all project and career descriptions for "Motgo" and "맛집 투표".
2. Confirm both searches return zero visible entries.
3. Keep HaruCheck, FIET trainer, and Weedool only when their existing public evidence is represented accurately.
4. Do not add a replacement project merely to restore the previous project count.
5. Review the Wanted public preview before saving the final version.
```

This is an external editorial gate; do not encode Wanted credentials, session state, or private profile data in the repository.

- [ ] **Step 5: Run the complete browser and accessibility suite**

```bash
npm run test:a11y
```

Expected: Chromium and WebKit pass with no critical/serious axe violation, focus regression, console error, horizontal overflow, or clipped interaction.

- [ ] **Step 6: Run the production build**

```bash
npm run build
```

Expected: exit `0`; `/` and `/freelancer` remain statically generated.

- [ ] **Step 7: Capture and inspect the after-state screenshots**

Capture these exact states without overwriting the audit inputs:

```text
1440×900 /#additional-projects
  -> output/focused-additional-projects-verification-2026-07-12/1440x900-archive.png

1440×900 FIET trainer modal
  -> output/focused-additional-projects-verification-2026-07-12/1440x900-fiet-trainer.png

390×844 /#additional-projects
  -> output/focused-additional-projects-verification-2026-07-12/390x844-archive.png
```

Accept the captures only when all are true:

- The archive contains exactly HaruCheck, FIET trainer, and Weedool in that order.
- Motgo and the FIET user app do not appear in the archive.
- The archive description says there are three supporting cases.
- The trainer responsibility line mentions BLE, the analysis report, and delivery automation.
- The trainer modal initially shows the InBody report rather than the splash screen.
- The report is contained within the tablet frame without destructive cropping.
- No horizontal clipping occurs at desktop or 390px.

- [ ] **Step 8: Compare the audit and verification evidence**

Compare:

```text
Before archive:
  output/motgo-audit-2026-07-12/01-additional-projects.png
After archive:
  output/focused-additional-projects-verification-2026-07-12/1440x900-archive.png

Before trainer detail:
  output/motgo-audit-2026-07-12/03-piet-trainer-detail.png
After trainer detail:
  output/focused-additional-projects-verification-2026-07-12/1440x900-fiet-trainer.png
```

Record only visible changes in project count, ordering, copy, preview selection, and crop integrity. Do not infer accessibility compliance or business impact from screenshots.

- [ ] **Step 9: Run the final diff gate**

```bash
git diff --check
git status --short
```

Expected: `git diff --check` exits `0`; status contains only the intended source, test, plan, and accepted verification-artifact changes.

- [ ] **Step 10: Commit the accepted verification evidence**

```bash
git add output/focused-additional-projects-verification-2026-07-12 e2e/accessibility.spec.ts test/developer-portfolio-structure.test.mjs
git commit -m "test: verify focused additional projects"
```

---

## Completion Gate

- Both routes render exactly three additional projects in the order HaruCheck, FIET trainer, Weedool.
- Motgo has no active public entry point but its project object and nine screenshots remain stored.
- The FIET user app remains stored in `projects.ts` but has no standalone archive row or career related-project link; the `㈜피에트` narrative links only to the trainer project.
- Motgo is absent from the repository public resume PDF and from the external Wanted resume.
- The FIET trainer archive summary foregrounds BLE, reporting, and delivery automation.
- The FIET trainer modal opens on `report-inbody.png`, and presentation opens at `화면 2 / 6`.
- The report preview is contained rather than cropped.
- Featured cases, route metadata, cross-route privacy contract, career ordering, and CTA copy are unchanged.
- Structure, lint, type, browser, accessibility, responsive, production-build, and diff gates all pass.

## Self-Review

- Spec coverage: Motgo removal, strong-three selection, FIET user absorption into the company narrative, trainer visual improvement, and HaruCheck retention each map to an explicit task and test.
- Placeholder scan: the plan contains no `TBD`, `TODO`, generic error-handling instruction, or unnamed implementation step.
- Type consistency: `additionalProjectIds`, `cardPresentation.thumbnailScreenIndex`, `currentScreenIndex`, `TabletFrame`, and existing `Screen.scrollable` match current source contracts.
- Evidence boundary: no stored project data or asset is deleted, and no new external link, metric, AI claim, RAG claim, or BLE result is added.
- Scope control: no new route, section, component family, design system, or project-data migration is introduced.
