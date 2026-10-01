# 포트폴리오 디자인 전면 컨버전 (확정안 v1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** glasses-dev.win(`/`, `/freelancer`)의 화면을 디자인 캔버스 '확정안 v1'로 완전히 바꿉니다. 데이터, 프로젝트, 스택, 스크린샷 콘텐츠는 하나도 잃지 않습니다.

**Architecture:** 데이터 계층(`src/data`, `src/types`)은 필드 추가만 하고 기존 값은 그대로 둡니다. 화면 계층은 `src/components/portfolio/` 아래 새 섹션 컴포넌트 6종으로 다시 짭니다. `Portfolio.tsx`는 모달 상태를 가진 클라이언트 루트로 남아 섹션을 조립합니다. 상세 콘텐츠(사례 상세, 스크린샷)는 기존 `ProjectModal`/`PresentationOverlay`가 계속 담당하고, 색만 새 토큰으로 바꿉니다. 검색과 사례 번호 로직은 의존성 없는 순수 모듈(`src/lib/*`)로 분리해 `node --test`로 TDD합니다.

**Tech Stack:** Next.js 16.2 (App Router), React 19.2, TypeScript 5, Tailwind CSS v4(`@theme`), `next/font/google`(IBM Plex Sans KR, IBM Plex Mono), lucide-react, node:test, Playwright + @axe-core/playwright.

**디자인 자료 (읽고 시작하세요):**
- 캔버스: https://claude.ai/artifact/AJZ677bRGyTU6b4944LBRk (Artifact 도구 `read`). 보드 `확정안 v1 · 데스크톱 페이지`, `확정안 v1 · 모바일 첫 화면`, `확정안 v1 · 모바일 사례 #1`, `구현 명세 · 확정안 v1`.
- 저장소 사본: `/Users/dev_bh/Desktop/works/portfolio/dev-portfolio/docs/design/portfolio-v1/` (README, `boards/*.dc.html`, blob → 저장소 이미지 경로 표, 미커밋 데이터 patch).
- 우선순위: 이 계획 > `docs/design/portfolio-v1/README.md`의 '콘텐츠 보존' > `boards/Spec.dc.html` > `boards/Proposal.dc.html`의 문구·배치.

## Global Constraints

- **콘텐츠 보존(사용자 지시)**: `src/data/*`의 항목과 필드 값을 지우지 않습니다. 새 필드는 추가만 하고, 아래 Task 5에 적힌 copy 값 3개만 바꿉니다. `public/images/**` 파일은 지우거나 옮기지 않습니다(HEAD 기준 95개). HEAD 화면에서 보이던 콘텐츠는 새 화면에서도 최소 한 경로(섹션 본문, '사례 자세히' 모달, 경력 '자세히', '프로젝트 사례 #N', 히어로 검색)로 볼 수 있어야 합니다.
- **비노출 유지**: `fiet-fitness-user`, `motgo`는 HEAD에서도 공개 화면에 없었습니다. 데이터에만 남기고 링크·검색에 넣지 않습니다.
- **커밋**: 커밋 메시지에 `Co-Authored-By: Claude` 등 Claude/Anthropic 표기를 절대 넣지 않습니다(사용자 전역 규칙, 배포 파이프라인이 거부함).
- **작업 위치**: 메인 작업 트리(`/Users/dev_bh/Desktop/works/portfolio/dev-portfolio`)의 미커밋 변경은 건드리지 않습니다. HEAD `3576ca8`에서 만든 별도 worktree에서만 작업합니다.
- **색 토큰**: ground `#2A2B2F`(히어로·연락), career `#232427`, slate `#292D34`(mobile_rag_engine 사례), stone `#312F2B`(Easy Contract Viewer 사례), moss `#2A2F2B`(Swifty-law 사례), surface `#34353A`, surface-2 `#3E3F45`, line `#4A4C52`, line-soft `#5A5C62`, ink `#ECECE7`, sub `#ABABA5`, faint `#9D9D96`, marker `#F3E04A`. 다크 단일 테마이고 라이트 모드는 없습니다. faint보다 어두운 글자색은 쓰지 않습니다.
- **폰트**: IBM Plex Sans KR(400·500·600·700), IBM Plex Mono(400·500). Noto Sans KR, Noto Serif KR, Geist Mono는 제거합니다. Mono는 숫자, 날짜, 코드, 검색 메타에만 씁니다. 한글은 `word-break: keep-all`.
- **글자 위계**: display `clamp(64px, 8vw, 120px)`/700/1.0/-0.045em · role `clamp(22px, 2.4vw, 30px)`/600/1.3 · h2 `clamp(40px, 4.4vw, 60px)`/700/1.1/-0.035em(연락 h2만 line-height 1.55) · h3 `clamp(26px, 2.4vw, 34px)`/700/1.3 · lead `clamp(18px, 1.5vw, 20px)`/400/1.65 · body 15–17px · label 14px/600 · group 13px/600 · number Mono 40px/500.
- **섹션**: 섹션 하나가 화면 하나입니다. `min-height: 100svh`, 세로 가운데 정렬, 고정 `height` 금지. scroll-snap과 섹션 진입 애니메이션은 넣지 않습니다. 순서는 히어로 → 경력 → 사례(config `featuredProjectIds` 순) → 연락입니다.
- **금지**: 카드 박스, chip, 구분선, '01 / 섹션명' 같은 번호 라벨, '02 / 06' 같은 진행 번호. 박스 형태는 히어로 검색 패널과 모달만 예외입니다. 검색 UI에 'BM25', 'HNSW', 'RRF' 라벨을 쓰지 않습니다.
- **접근성**: WCAG 2.2 AA 기준입니다. 터치 대상 44px 이상, `prefers-reduced-motion`이면 자동 입력과 전환을 끄고, 자동으로 계속 바뀌는 콘텐츠(히어로 검색)에는 멈춤 버튼을 둡니다.
- **기본값으로 정한 열린 결정**(사용자가 바꾸면 따름): 25.9ms 라벨 끝에 '· 디버그 빌드'를 붙임 / 히어로 검색은 가벼운 키워드 매칭 유지(하이브리드 검색은 범위 밖) / `/freelancer`에도 같은 구조 적용 / 모바일 검색 결과도 3건.
- **사례 번호**: `[...featuredProjectIds, ...additionalProjectIds]` 순서로 매깁니다. recruitment 기준 #1 mobile_rag_engine, #2 Easy Contract Viewer, #3 Swifty-law, #4 Easy Contract Viewer Server, #5 피에트 피트니스 트레이너, #6 HaruCheck, #7 Weedool입니다. 보드의 #4·#5 표기는 목업이고 이 규칙이 우선합니다.

## File Structure

| 경로 | 역할 | 상태 |
|---|---|---|
| `src/lib/portfolioSearch.ts` | 검색 토큰화·점수·하이라이트 분할 (의존성 없음) | 생성 |
| `src/lib/caseOrder.ts` | 사례 번호, 앵커 id, 검색 대상 해석, 미연결 프로젝트 계산 (type import만) | 생성 |
| `src/lib/mailHref.ts` | mailto 링크 생성 | 생성 |
| `src/lib/usePrefersReducedMotion.ts` | `prefers-reduced-motion` 구독 훅 | 생성 |
| `src/data/searchDocuments.ts` | 히어로 검색 대상 8개 | 생성 |
| `src/types/recruitment.ts`, `src/types/portfolio.ts` | 선택 필드 추가 | 수정 |
| `src/data/recruitment.ts`, `src/data/portfolio.ts`, `src/data/freelancer.ts` | 새 필드 값 추가 | 수정 |
| `src/app/globals.css` | 토큰, 타이포 클래스, 키프레임 | 재작성 |
| `src/app/layout.tsx` | 폰트 교체, skip link 색 | 수정 |
| `src/components/portfolio/HeroSection.tsx` | 내비 + 히어로 | 생성 |
| `src/components/portfolio/PortfolioSearch.tsx` | 히어로 검색(client) | 생성 |
| `src/components/portfolio/CareerSection.tsx` | 경력 그리드 + 자세히 + 그 밖의 프로젝트 | 생성 |
| `src/components/portfolio/CaseLink.tsx` | '프로젝트 사례 #N' 링크/버튼 | 생성 |
| `src/components/portfolio/CaseLabel.tsx` | 섹션 라벨 | 생성 |
| `src/components/portfolio/caseSectionTypes.ts` | 사례 섹션 공통 props | 생성 |
| `src/components/portfolio/CaseEngineSection.tsx` | mobile_rag_engine 사례 + 탭(client) | 생성 |
| `src/components/portfolio/CaseContractViewerSection.tsx` | Easy Contract Viewer 사례 | 생성 |
| `src/components/portfolio/CaseLawSection.tsx` | Swifty-law 사례 | 생성 |
| `src/components/portfolio/ContactSection.tsx` | 연락 + 푸터 | 생성 |
| `src/components/Portfolio.tsx` | 클라이언트 루트(모달 상태 유지, 섹션 조립) | 재작성 |
| `src/components/widgets/{ProjectModal,PresentationOverlay,DeviceFrame}.tsx` | 색만 토큰으로 교체 | 수정 |
| `src/components/widgets/{RecruitmentNav,DeveloperHero,FeaturedWork,ProjectCard,ProjectArchive,ExperienceTimeline,RecruitmentCTA,Footer,SectionContainer,SectionHeader}.tsx` | 옛 디자인 | 삭제 |
| `test/helpers/importTs.mjs` | TS 모듈 import 헬퍼 | 생성 |
| `test/content-preservation.test.mjs` | 콘텐츠 보존 가드 | 생성 |
| `test/portfolio-v1.test.mjs` | 검색·번호·데이터·소스 계약 | 생성 |
| `test/developer-portfolio-structure.test.mjs` | 옛 구조 단정 정리 | 수정 |
| `e2e/portfolio-v1.spec.ts` | 새 구조 e2e | 생성 |
| `e2e/accessibility.spec.ts` | 옛 구조 단정 정리 | 수정 |

---

### Task 0: 작업 공간 준비와 기준선

**Files:**
- Create: worktree `/Users/dev_bh/Desktop/works/portfolio/dev-portfolio-v1` (branch `feat/portfolio-design-v1`)
- Create (worktree 안): `docs/design/portfolio-v1/**`, `docs/superpowers/plans/2026-10-02-portfolio-design-conversion.md` (메인 트리에서 복사)

- [ ] **Step 1: worktree 준비 (superpowers:using-git-worktrees 참고)**

데스크톱 앱이 이미 이 세션용 worktree를 만들어 두었으면(현재 디렉터리가 메인 트리가 아니고 `git log -1 --format=%h`가 `3576ca8`이면) 이 Step은 건너뛰고, 그 worktree에서 `git switch -c feat/portfolio-design-v1`만 합니다. 아니면 직접 만듭니다.

```bash
cd /Users/dev_bh/Desktop/works/portfolio/dev-portfolio
git worktree add -b feat/portfolio-design-v1 ../dev-portfolio-v1 3576ca8
cd ../dev-portfolio-v1
```

Expected: 작업 디렉터리가 메인 트리와 다른 경로이고, 메인 트리(`/Users/dev_bh/Desktop/works/portfolio/dev-portfolio`)의 `git status`는 바뀌지 않습니다.

- [ ] **Step 2: 인계 자료를 worktree로 복사하고 의존성 설치**

인계 자료는 메인 트리에만 있는 미추적 파일이므로 절대 경로로 복사합니다. 아래 명령은 worktree 루트에서 실행합니다.

```bash
MAIN=/Users/dev_bh/Desktop/works/portfolio/dev-portfolio
mkdir -p docs/design docs/superpowers/plans
cp -R "$MAIN/docs/design/portfolio-v1" docs/design/
cp "$MAIN/docs/superpowers/plans/2026-10-02-portfolio-design-conversion.md" docs/superpowers/plans/
npm ci
```

- [ ] **Step 3: 기준선 기록**

```bash
npm test 2>&1 | tail -5
npm run lint 2>&1 | tail -5
npx tsc --noEmit 2>&1 | tail -5
```

Expected: 세 명령 모두 성공해야 합니다. 실패하는 테스트가 있으면 이름을 적어 두고, 이후 단계에서 새로 생긴 실패와 구분합니다. 테스트 중 PDF 추출 테스트(`public resume PDF is extractable…`)는 `pdftotext`가 없으면 실패할 수 있습니다. 기준선에서 실패하면 그 상태를 그대로 둡니다.

- [ ] **Step 4: Commit**

```bash
git add docs/design/portfolio-v1 docs/superpowers/plans/2026-10-02-portfolio-design-conversion.md
git commit -m "docs: add portfolio design v1 handoff and implementation plan"
```

---

### Task 1: 콘텐츠 보존 가드 테스트

디자인을 갈아엎는 동안 데이터나 스크린샷이 사라지면 바로 실패하게 만드는 안전망입니다. 이 테스트는 기준선에서 통과해야 하고, 이후 모든 Task에서 계속 통과해야 합니다.

**Files:**
- Create: `test/helpers/importTs.mjs`
- Create: `test/content-preservation.test.mjs`

**Interfaces:**
- Produces: `read(path: string): string`, `importTypeScriptModule(path: string): Promise<module>` (런타임 import가 없는 TS 파일만 import 가능. `import type`과 타입 전용 import는 transpile 시 지워짐)

- [ ] **Step 1: 헬퍼 작성**

```js
// test/helpers/importTs.mjs
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

export const read = (path) => {
  const url = new URL(`../../${path}`, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
};

export const importTypeScriptModule = async (path) => {
  const source = read(path);
  assert.notEqual(source, '', `${path} must exist`);

  const { outputText, diagnostics = [] } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: path,
    reportDiagnostics: true,
  });
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((diagnostic) => diagnostic.messageText).join('\n')
  );

  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
};
```

- [ ] **Step 2: 보존 테스트 작성**

```js
// test/content-preservation.test.mjs
import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { importTypeScriptModule } from './helpers/importTs.mjs';

const HEAD_PROJECT_IDS = [
  'easy-contract-viewer-server',
  'law-info-engine',
  'easy-contract-viewer',
  'fiet-fitness-trainer',
  'fiet-fitness-user',
  'local-mobile-rag-gemma',
  'motgo',
  'haru-check',
  'weedool',
];

const listFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = `${dir}/${name}`;
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });

test('project data keeps every project from HEAD 3576ca8', async () => {
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  assert.deepEqual(
    projects.map((project) => project.id).sort(),
    [...HEAD_PROJECT_IDS].sort()
  );
});

test('every project keeps its tech stack, screens, and implementation notes', async () => {
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  for (const project of projects) {
    assert.ok(project.techStack.length > 0, `${project.id} techStack`);
    assert.ok(project.screens.length > 0, `${project.id} screens`);
    assert.ok(project.description.length > 0, `${project.id} description`);
  }
});

test('every screenshot path referenced by project data exists under public/', async () => {
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  const paths = projects.flatMap((project) =>
    project.screens.map((screen) => screen.imagePath).filter(Boolean)
  );
  assert.equal(paths.length, 62);
  for (const path of paths) {
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `missing ${path}`);
  }
});

test('public/images keeps all 95 files', () => {
  const root = fileURLToPath(new URL('../public/images', import.meta.url));
  assert.equal(listFiles(root).filter((file) => !file.endsWith('.DS_Store')).length, 95);
});

test('recruitment data keeps all experience entries, highlights, and case details', async () => {
  const { experienceItems, recruitmentCases, recruitmentProfile } =
    await importTypeScriptModule('src/data/recruitment.ts');

  assert.deepEqual(
    experienceItems.map((item) => item.company),
    ['메리츠화재해상보험', '㈜피에트', '㈜인피니티익스체인지코리아', '튜링바이오', '㈜영우', '한국와콤']
  );
  for (const item of experienceItems) {
    assert.ok(item.summary.length > 0, `${item.company} summary`);
    assert.ok(item.highlights.length >= 2, `${item.company} highlights`);
  }

  assert.deepEqual(
    recruitmentCases.map((item) => item.projectId),
    ['local-mobile-rag-gemma', 'easy-contract-viewer', 'law-info-engine']
  );
  for (const item of recruitmentCases) {
    for (const field of ['contributions', 'verification', 'outcomes', 'tradeoffs', 'nonGoals']) {
      assert.ok(item[field].length > 0, `${item.projectId}.${field}`);
    }
  }

  assert.deepEqual(
    recruitmentProfile.proofItems.map((item) => item.label),
    ['공개 패키지', '총 경력']
  );
});
```

- [ ] **Step 3: 실행해서 통과 확인 (기준선 보호용이라 처음부터 통과해야 함)**

Run: `node --test test/content-preservation.test.mjs`
Expected: 5 tests PASS. 실패하면 HEAD 데이터와 숫자(62, 95, 회사 목록)가 다른 것이니, 고치지 말고 실제 값을 확인해 사용자에게 보고합니다.

- [ ] **Step 4: Commit**

```bash
git add test/helpers/importTs.mjs test/content-preservation.test.mjs
git commit -m "test: guard portfolio content during design conversion"
```

---

### Task 2: 디자인 토큰, 폰트, 타이포 클래스

**Files:**
- Modify: `src/app/globals.css` (전체 교체)
- Modify: `src/app/layout.tsx`
- Test: `test/portfolio-v1.test.mjs` (생성)
- Modify: `test/developer-portfolio-structure.test.mjs` (`layout only loads fonts used by the active design` 테스트만)

**Interfaces:**
- Produces: Tailwind 색 유틸리티 `bg-ground bg-career bg-slate bg-stone bg-moss bg-surface bg-surface-2 border-line text-ink text-sub text-faint text-marker bg-marker`. 컴포넌트 클래스 `screen screen-inner t-display t-role t-h2 t-h3 t-lead t-body t-body-sm t-label t-group t-number t-meta link-marker btn-primary btn-outline search-panel search-field search-result search-result-link search-mark contact-mark engine-tab engine-tab-bar engine-panel career-detail`. CSS 변수 `--font-plex-sans-kr`, `--font-plex-mono`.

- [ ] **Step 1: 실패하는 테스트 작성**

```js
// test/portfolio-v1.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { importTypeScriptModule, read } from './helpers/importTs.mjs';

test('layout loads only IBM Plex Sans KR and IBM Plex Mono', () => {
  const layout = read('src/app/layout.tsx');
  assert.match(layout, /IBM_Plex_Sans_KR/);
  assert.match(layout, /IBM_Plex_Mono/);
  assert.doesNotMatch(layout, /Noto_Sans_KR|Noto_Serif_KR|Geist_Mono/);
});

test('globals define the v1 color tokens and dark color scheme', () => {
  const css = read('src/app/globals.css');
  for (const token of [
    '--color-ground: #2a2b2f',
    '--color-career: #232427',
    '--color-slate: #292d34',
    '--color-stone: #312f2b',
    '--color-moss: #2a2f2b',
    '--color-ink: #ecece7',
    '--color-sub: #ababa5',
    '--color-faint: #9d9d96',
    '--color-marker: #f3e04a',
  ]) {
    assert.ok(css.includes(token), token);
  }
  assert.match(css, /color-scheme:\s*dark/);
  assert.match(css, /min-height:\s*100svh/);
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test test/portfolio-v1.test.mjs`
Expected: FAIL (`IBM_Plex_Sans_KR` 없음, 토큰 없음)

- [ ] **Step 3: `src/app/globals.css` 교체**

```css
@import "tailwindcss";

:root {
  color-scheme: dark;
}

@theme {
  --color-ground: #2a2b2f;
  --color-career: #232427;
  --color-slate: #292d34;
  --color-stone: #312f2b;
  --color-moss: #2a2f2b;
  --color-surface: #34353a;
  --color-surface-2: #3e3f45;
  --color-line: #4a4c52;
  --color-line-soft: #5a5c62;
  --color-ink: #ecece7;
  --color-sub: #ababa5;
  --color-faint: #9d9d96;
  --color-marker: #f3e04a;
}

@theme inline {
  --font-sans: var(--font-plex-sans-kr), system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;
}

body {
  background: var(--color-ground);
  color: var(--color-ink);
  font-family: var(--font-plex-sans-kr), system-ui, -apple-system, sans-serif;
  word-break: keep-all;
}

:focus-visible {
  outline: 2px solid var(--color-marker);
  outline-offset: 3px;
}

body[data-portfolio-overlay="true"] .skip-link {
  display: none;
}

@layer components {
  .screen {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-block: 112px 88px;
  }
  .screen-inner {
    width: 100%;
    max-width: 1280px;
    margin-inline: auto;
    padding-inline: clamp(20px, 5vw, 72px);
    box-sizing: border-box;
  }
  .t-display { font-size: clamp(64px, 8vw, 120px); font-weight: 700; line-height: 1; letter-spacing: -0.045em; }
  .t-role { font-size: clamp(22px, 2.4vw, 30px); font-weight: 600; line-height: 1.3; letter-spacing: -0.02em; }
  .t-h2 { font-size: clamp(40px, 4.4vw, 60px); font-weight: 700; line-height: 1.1; letter-spacing: -0.035em; }
  .t-h3 { font-size: clamp(26px, 2.4vw, 34px); font-weight: 700; line-height: 1.3; letter-spacing: -0.025em; }
  .t-lead { font-size: clamp(18px, 1.5vw, 20px); font-weight: 400; line-height: 1.65; color: var(--color-ink); }
  .t-body { font-size: 16px; line-height: 1.8; color: var(--color-sub); }
  .t-body-sm { font-size: 15px; line-height: 1.7; color: var(--color-sub); }
  .t-label { font-size: 14px; font-weight: 600; color: var(--color-faint); }
  .t-group { font-size: 13px; font-weight: 600; color: var(--color-faint); }
  .t-number { font-family: var(--font-plex-mono), monospace; font-size: 40px; font-weight: 500; line-height: 1; letter-spacing: -0.03em; }
  .t-meta { font-family: var(--font-plex-mono), monospace; font-size: 12px; color: var(--color-faint); }

  .link-marker {
    color: var(--color-ink);
    text-decoration: underline;
    text-decoration-color: var(--color-marker);
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }
  .link-marker:hover { color: var(--color-marker); }

  .btn-primary,
  .btn-outline {
    display: inline-flex;
    align-items: center;
    min-height: 52px;
    padding-inline: 24px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    box-sizing: border-box;
  }
  .btn-primary { background: var(--color-marker); color: var(--color-ground); }
  .btn-outline { border: 1.5px solid var(--color-ink); color: var(--color-ink); }
  .btn-outline:hover { border-color: var(--color-marker); color: var(--color-marker); }

  .search-panel {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 28px;
    border-radius: 22px;
    background: var(--color-surface);
    border: 1px solid var(--color-line);
  }
  .search-field {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 60px;
    padding-inline: 20px;
    border-radius: 14px;
    background: var(--color-surface-2);
  }
  .search-field:focus-within { box-shadow: 0 0 0 2px var(--color-marker); }
  .search-result { animation: result-in 300ms ease both; }
  .search-result-link {
    display: flex;
    width: 100%;
    gap: 16px;
    margin-inline: -12px;
    padding: 14px 12px;
    border-radius: 12px;
    color: var(--color-ink);
    text-align: left;
  }
  .search-result-link:hover { background: var(--color-surface-2); }
  .search-mark {
    padding: 0 2px;
    border-radius: 2px;
    background-color: transparent;
    background-image: linear-gradient(var(--color-marker), var(--color-marker));
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size: 100% 100%;
    color: var(--color-ground);
    animation: marker-sweep 420ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
  .contact-mark {
    padding: 0 6px;
    background: var(--color-marker);
    color: var(--color-ground);
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }

  .engine-tab {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 48px;
    font-size: 17px;
    font-weight: 500;
    color: var(--color-faint);
    text-align: left;
    transition: color 200ms ease;
  }
  .engine-tab.is-selected { color: var(--color-ink); font-weight: 600; }
  .engine-tab-bar {
    width: 0;
    height: 2px;
    background: var(--color-marker);
    transition: width 260ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .engine-tab.is-selected .engine-tab-bar { width: 28px; }
  .engine-panel {
    transition: opacity 320ms ease, transform 320ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .engine-panel[data-phase="out"] {
    opacity: 0;
    transform: translateY(14px);
    transition-duration: 180ms;
  }

  .career-detail > summary { list-style: none; }
  .career-detail > summary::-webkit-details-marker { display: none; }
}

@keyframes result-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}

@keyframes marker-sweep {
  0% { background-size: 0% 100%; color: var(--color-ink); }
  60% { color: var(--color-ink); }
  100% { background-size: 100% 100%; color: var(--color-ground); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }

.accessible-scrollbar {
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: #9d9d96 #34353a;
}
.accessible-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
.accessible-scrollbar::-webkit-scrollbar-track { background: #34353a; }
.accessible-scrollbar::-webkit-scrollbar-thumb {
  border: 2px solid #34353a;
  border-radius: 999px;
  background: #9d9d96;
}

::selection {
  background-color: #f3e04a;
  color: #2a2b2f;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-name: none !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

HEAD `globals.css`에는 여기서 다루지 않은 규칙이 더 있을 수 있습니다. 교체 전에 `git show 3576ca8:src/app/globals.css`로 확인하고, 모달과 프레젠테이션이 쓰는 클래스가 있으면 색만 위 토큰으로 바꿔 함께 남깁니다.

- [ ] **Step 4: `src/app/layout.tsx` 폰트 교체**

import와 폰트 선언을 아래로 바꾸고, `<html className>`과 skip link 클래스를 고칩니다. `metadata`와 skip link 문구('본문으로 건너뛰기')는 그대로 둡니다.

```tsx
import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans_KR } from 'next/font/google';
import './globals.css';

const plexSansKr = IBM_Plex_Sans_KR({
  variable: '--font-plex-sans-kr',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});
```

```tsx
    <html lang="ko" className={`${plexSansKr.variable} ${plexMono.variable}`}>
      <body className="antialiased">
        <a
          href="#main-content"
          className="skip-link sr-only z-[100] rounded-md bg-marker px-4 py-3 text-sm font-semibold text-ground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
```

- [ ] **Step 5: 옛 폰트 테스트 정리**

`test/developer-portfolio-structure.test.mjs`의 `test('layout only loads fonts used by the active design', …)` 블록을 삭제합니다. 새 테스트 `layout loads only IBM Plex Sans KR and IBM Plex Mono`가 대신합니다.

- [ ] **Step 6: 통과 확인**

Run: `node --test test/portfolio-v1.test.mjs test/content-preservation.test.mjs && npx tsc --noEmit`
Expected: PASS. 이 시점에는 옛 위젯이 새 색과 섞여 화면이 어색합니다. 정상이며 Task 12에서 정리합니다.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx test/portfolio-v1.test.mjs test/developer-portfolio-structure.test.mjs
git commit -m "feat: add v1 design tokens, typography, and IBM Plex fonts"
```

---

### Task 3: 검색 라이브러리 (TDD)

**Files:**
- Create: `src/lib/portfolioSearch.ts`
- Test: `test/portfolio-v1.test.mjs` (추가)

**Interfaces:**
- Produces:
  - `type SearchTarget = { kind: 'anchor'; href: string } | { kind: 'project'; projectId: string }`
  - `interface SearchDocument { id: string; title: string; monoTitle?: boolean; snippet: string; keywords: string[]; meta: string; target: SearchTarget }`
  - `interface TextSegment { text: string; hit: boolean }`
  - `interface SearchResult { document: SearchDocument; score: number; titleSegments: TextSegment[]; snippetSegments: TextSegment[]; keywordMatches: string[] }`
  - `tokenize(query: string): string[]`
  - `countMatches(text: string, tokens: string[]): number`
  - `segmentText(text: string, tokens: string[]): TextSegment[]`
  - `searchDocuments(documents: readonly SearchDocument[], query: string, limit?: number): SearchResult[]`
  - `RESULT_LIMIT = 3`

- [ ] **Step 1: 실패하는 테스트 추가**

```js
// test/portfolio-v1.test.mjs 에 추가
const sampleDocuments = [
  { id: 'a', title: 'Alpha App', snippet: 'Flutter 앱입니다.', keywords: ['모바일'], meta: '', target: { kind: 'anchor', href: '#a' } },
  { id: 'b', title: 'mobile_rag_engine', snippet: 'RAG context 생성', keywords: ['Rust FFI'], meta: '', target: { kind: 'anchor', href: '#b' } },
  { id: 'c', title: 'Gamma', snippet: '서버를 개발했습니다.', keywords: ['모바일', 'RAG'], meta: '', target: { kind: 'anchor', href: '#c' } },
];

test('tokenize splits on whitespace and sorts longer tokens first', async () => {
  const { tokenize } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  assert.deepEqual(tokenize('  모바일   개발 '), ['모바일', '개발']);
  assert.deepEqual(tokenize('a abc ab'), ['abc', 'ab', 'a']);
  assert.deepEqual(tokenize('   '), []);
});

test('search scores title x3, snippet x2, keywords x1 and keeps data order on ties', async () => {
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  const rag = searchDocuments(sampleDocuments, 'rag');
  assert.deepEqual(rag.map((r) => [r.document.id, r.score]), [['b', 5], ['c', 1]]);
  const mobileDev = searchDocuments(sampleDocuments, '모바일 개발');
  assert.deepEqual(mobileDev.map((r) => r.document.id), ['c', 'a']);
});

test('empty query returns the first documents as recommendations', async () => {
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  assert.deepEqual(searchDocuments(sampleDocuments, '').map((r) => r.document.id), ['a', 'b', 'c']);
  assert.deepEqual(searchDocuments(sampleDocuments, '', 2).map((r) => r.document.id), ['a', 'b']);
});

test('segmentText marks case-insensitive hits and keeps original text', async () => {
  const { segmentText } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  assert.deepEqual(segmentText('Flutter로 만든 flutter 앱', ['flutter']), [
    { text: 'Flutter', hit: true },
    { text: '로 만든 ', hit: false },
    { text: 'flutter', hit: true },
    { text: ' 앱', hit: false },
  ]);
  assert.deepEqual(segmentText('a.b', ['.']), [
    { text: 'a', hit: false },
    { text: '.', hit: true },
    { text: 'b', hit: false },
  ]);
});

test('keyword-only matches are reported without repeating visible text', async () => {
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  const [first] = searchDocuments(sampleDocuments, '모바일');
  assert.equal(first.document.id, 'a');
  assert.deepEqual(first.keywordMatches, ['모바일']);
  const [engine] = searchDocuments(sampleDocuments, 'rag');
  assert.deepEqual(engine.keywordMatches, []);
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test test/portfolio-v1.test.mjs`
Expected: FAIL with `src/lib/portfolioSearch.ts must exist`

- [ ] **Step 3: 구현**

```ts
// src/lib/portfolioSearch.ts
export type SearchTarget =
  | { kind: 'anchor'; href: string }
  | { kind: 'project'; projectId: string };

export interface SearchDocument {
  id: string;
  title: string;
  monoTitle?: boolean;
  snippet: string;
  keywords: string[];
  meta: string;
  target: SearchTarget;
}

export interface TextSegment {
  text: string;
  hit: boolean;
}

export interface SearchResult {
  document: SearchDocument;
  score: number;
  titleSegments: TextSegment[];
  snippetSegments: TextSegment[];
  keywordMatches: string[];
}

export const RESULT_LIMIT = 3;
const KEYWORD_MATCH_LIMIT = 3;

export function tokenize(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
}

export function countMatches(text: string, tokens: string[]): number {
  const haystack = text.toLowerCase();
  let total = 0;
  for (const token of tokens) {
    const needle = token.toLowerCase();
    let at = haystack.indexOf(needle);
    while (at !== -1) {
      total += 1;
      at = haystack.indexOf(needle, at + needle.length);
    }
  }
  return total;
}

export function segmentText(text: string, tokens: string[]): TextSegment[] {
  if (tokens.length === 0) return [{ text, hit: false }];
  const escaped = tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  return text
    .split(pattern)
    .filter((part) => part !== '')
    .map((part) => ({
      text: part,
      hit: tokens.some((token) => token.toLowerCase() === part.toLowerCase()),
    }));
}

function toResult(document: SearchDocument, score: number, tokens: string[]): SearchResult {
  const visible = `${document.title} ${document.snippet}`.toLowerCase();
  const keywordMatches =
    tokens.length === 0
      ? []
      : document.keywords
          .filter((keyword) =>
            tokens.some((token) => keyword.toLowerCase().includes(token.toLowerCase()))
          )
          .filter((keyword) => !visible.includes(keyword.toLowerCase()))
          .slice(0, KEYWORD_MATCH_LIMIT);

  return {
    document,
    score,
    titleSegments: segmentText(document.title, tokens),
    snippetSegments: segmentText(document.snippet, tokens),
    keywordMatches,
  };
}

export function searchDocuments(
  documents: readonly SearchDocument[],
  query: string,
  limit: number = RESULT_LIMIT
): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return documents.slice(0, limit).map((document) => toResult(document, 0, tokens));
  }

  return documents
    .map((document, index) => ({
      document,
      index,
      score:
        countMatches(document.title, tokens) * 3 +
        countMatches(document.snippet, tokens) * 2 +
        countMatches(document.keywords.join(' '), tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((entry) => toResult(entry.document, entry.score, tokens));
}
```

- [ ] **Step 4: 통과 확인**

Run: `node --test test/portfolio-v1.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/portfolioSearch.ts test/portfolio-v1.test.mjs
git commit -m "feat: add portfolio keyword search scoring"
```

---

### Task 4: 사례 번호 라이브러리 (TDD)

**Files:**
- Create: `src/lib/caseOrder.ts`
- Create: `src/lib/mailHref.ts`
- Test: `test/portfolio-v1.test.mjs` (추가)

**Interfaces:**
- Consumes: `SearchDocument` (Task 3, type import만)
- Produces:
  - `buildCaseOrder(featuredIds: readonly string[], additionalIds: readonly string[]): string[]`
  - `caseNumber(order: readonly string[], projectId: string): number | null`
  - `caseAnchorId(caseNumber: number): string` → `'case-01'`
  - `resolveSearchDocuments(documents: readonly SearchDocument[], featuredIds: readonly string[]): SearchDocument[]` (featured project 대상을 `#case-0N` 앵커로 바꿈)
  - `findOtherProjectIds(order: readonly string[], featuredCount: number, linkedIds: Iterable<string>): string[]` (섹션도 링크도 없는 사례)
  - `buildMailHref(email: string, subject?: string): string`

- [ ] **Step 1: 실패하는 테스트 추가**

```js
// test/portfolio-v1.test.mjs 에 추가
const FEATURED = ['local-mobile-rag-gemma', 'easy-contract-viewer', 'law-info-engine'];
const ADDITIONAL = ['easy-contract-viewer-server', 'fiet-fitness-trainer', 'haru-check', 'weedool'];

test('case order follows featured then additional ids without duplicates', async () => {
  const { buildCaseOrder, caseNumber, caseAnchorId } = await importTypeScriptModule('src/lib/caseOrder.ts');
  const order = buildCaseOrder(FEATURED, [...ADDITIONAL, 'law-info-engine']);
  assert.deepEqual(order, [...FEATURED, ...ADDITIONAL]);
  assert.equal(caseNumber(order, 'easy-contract-viewer-server'), 4);
  assert.equal(caseNumber(order, 'fiet-fitness-trainer'), 5);
  assert.equal(caseNumber(order, 'haru-check'), 6);
  assert.equal(caseNumber(order, 'weedool'), 7);
  assert.equal(caseNumber(order, 'fiet-fitness-user'), null);
  assert.equal(caseAnchorId(1), 'case-01');
  assert.equal(caseAnchorId(12), 'case-12');
});

test('featured search targets become section anchors and others stay modal targets', async () => {
  const { resolveSearchDocuments } = await importTypeScriptModule('src/lib/caseOrder.ts');
  const documents = [
    { id: 'x', title: '', snippet: '', keywords: [], meta: '', target: { kind: 'project', projectId: 'easy-contract-viewer' } },
    { id: 'y', title: '', snippet: '', keywords: [], meta: '', target: { kind: 'project', projectId: 'haru-check' } },
    { id: 'z', title: '', snippet: '', keywords: [], meta: '', target: { kind: 'anchor', href: '#career' } },
  ];
  assert.deepEqual(resolveSearchDocuments(documents, FEATURED).map((d) => d.target), [
    { kind: 'anchor', href: '#case-02' },
    { kind: 'project', projectId: 'haru-check' },
    { kind: 'anchor', href: '#career' },
  ]);
  assert.deepEqual(
    resolveSearchDocuments(documents, ['easy-contract-viewer', 'local-mobile-rag-gemma']).map((d) => d.target)[0],
    { kind: 'anchor', href: '#case-01' }
  );
});

test('other projects are numbered cases that no section or career entry links to', async () => {
  const { buildCaseOrder, findOtherProjectIds } = await importTypeScriptModule('src/lib/caseOrder.ts');
  const order = buildCaseOrder(FEATURED, ADDITIONAL);
  const linked = ['local-mobile-rag-gemma', 'fiet-fitness-trainer', 'weedool', 'easy-contract-viewer-server'];
  assert.deepEqual(findOtherProjectIds(order, FEATURED.length, linked), ['haru-check']);
});

test('mail href adds an encoded subject only when given', async () => {
  const { buildMailHref } = await importTypeScriptModule('src/lib/mailHref.ts');
  assert.equal(buildMailHref('a@b.c'), 'mailto:a@b.c');
  assert.equal(buildMailHref('a@b.c', '[문의] 앱'), 'mailto:a@b.c?subject=%5B%EB%AC%B8%EC%9D%98%5D%20%EC%95%B1');
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test test/portfolio-v1.test.mjs`
Expected: FAIL with `src/lib/caseOrder.ts must exist`

- [ ] **Step 3: 구현**

```ts
// src/lib/caseOrder.ts
import type { SearchDocument } from './portfolioSearch';

export function buildCaseOrder(
  featuredIds: readonly string[],
  additionalIds: readonly string[]
): string[] {
  return [...featuredIds, ...additionalIds.filter((id) => !featuredIds.includes(id))];
}

export function caseNumber(order: readonly string[], projectId: string): number | null {
  const index = order.indexOf(projectId);
  return index === -1 ? null : index + 1;
}

export function caseAnchorId(number: number): string {
  return `case-${String(number).padStart(2, '0')}`;
}

export function resolveSearchDocuments(
  documents: readonly SearchDocument[],
  featuredIds: readonly string[]
): SearchDocument[] {
  return documents.map((document) => {
    if (document.target.kind !== 'project') return document;
    const index = featuredIds.indexOf(document.target.projectId);
    if (index === -1) return document;
    return { ...document, target: { kind: 'anchor', href: `#${caseAnchorId(index + 1)}` } };
  });
}

export function findOtherProjectIds(
  order: readonly string[],
  featuredCount: number,
  linkedIds: Iterable<string>
): string[] {
  const linked = new Set(linkedIds);
  return order.slice(featuredCount).filter((id) => !linked.has(id));
}
```

```ts
// src/lib/mailHref.ts
export function buildMailHref(email: string, subject?: string): string {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}
```

- [ ] **Step 4: 통과 확인**

Run: `node --test test/portfolio-v1.test.mjs && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/caseOrder.ts src/lib/mailHref.ts test/portfolio-v1.test.mjs
git commit -m "feat: add case numbering and search target resolution"
```

---

### Task 5: 타입·데이터 확장과 검색 대상

데이터는 **추가만** 합니다. 바꾸는 값은 `navBrandLabel`(두 config)과 recruitment의 `contactHeading` 세 개뿐이며, 모두 확정안 문구입니다.

**Files:**
- Modify: `src/types/recruitment.ts`, `src/types/portfolio.ts`
- Modify: `src/data/recruitment.ts`, `src/data/portfolio.ts`, `src/data/freelancer.ts`
- Create: `src/data/searchDocuments.ts`
- Test: `test/portfolio-v1.test.mjs` (추가)

**Interfaces:**
- Produces (`src/types/recruitment.ts`): `IntroTopic { label; title; body; flow? }`, `CaseMetric { value; label }`, `CaseFeature { title; description }`, `CaseStepScreen { screenId; label }`, `CaseFigure { screenId; caption }`. `RecruitmentCase`에 선택 필드 `sectionTitle?`, `sectionLead?`, `sectionSummary?`, `metrics?`, `introTopics?`, `features?`, `stepScreens?`, `figure?`, `relatedProjectIds?`. `ExperienceItem.cardHighlight?`. `RecruitmentProfile.headline?`, `RecruitmentProfile.intro?`.
- Produces (`src/types/portfolio.ts`): `PortfolioCopy`에 필수 `careerHeading: string`, `otherProjectsLabel: string`, 선택 `contactHeadingHighlight?: string`.
- Produces: `searchDocuments: readonly SearchDocument[]` (8개, 순서 고정)

- [ ] **Step 1: 실패하는 테스트 추가**

```js
// test/portfolio-v1.test.mjs 에 추가
test('search documents produce the approved results for the demo keywords', async () => {
  const { searchDocuments: documents } = await importTypeScriptModule('src/data/searchDocuments.ts');
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  const ids = (query) => searchDocuments(documents, query).map((r) => r.document.id);

  assert.equal(documents.length, 8);
  assert.deepEqual(ids('Flutter'), ['easy-contract-viewer', 'fiet-fitness-trainer', 'weedool']);
  assert.deepEqual(ids('RAG'), ['local-mobile-rag-gemma', 'easy-contract-viewer', 'law-info-engine']);
  assert.deepEqual(ids('모바일 개발'), ['crypto-exchange-app', 'easy-contract-viewer', 'fiet-fitness-trainer']);
  assert.deepEqual(ids('온디바이스'), ['easy-contract-viewer', 'local-mobile-rag-gemma']);
  assert.deepEqual(ids('BLE'), ['fiet-fitness-trainer']);
});

test('search documents only target public projects that exist', async () => {
  const { searchDocuments: documents } = await importTypeScriptModule('src/data/searchDocuments.ts');
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  const projectIds = new Set(projects.map((p) => p.id));
  for (const document of documents) {
    if (document.target.kind === 'project') {
      assert.ok(projectIds.has(document.target.projectId), document.id);
      assert.notEqual(document.target.projectId, 'fiet-fitness-user');
      assert.notEqual(document.target.projectId, 'motgo');
    }
    assert.doesNotMatch(document.meta, /BM25|HNSW|RRF/);
  }
});

test('recruitment cases carry the v1 section content and reference real screens', async () => {
  const { recruitmentCases, experienceItems, recruitmentProfile } =
    await importTypeScriptModule('src/data/recruitment.ts');
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  const byId = Object.fromEntries(recruitmentCases.map((c) => [c.projectId, c]));
  const screenIds = (projectId) => projects.find((p) => p.id === projectId).screens.map((s) => s.id);

  assert.equal(recruitmentProfile.headline, 'Flutter · 온디바이스 RAG 개발자');
  assert.equal(byId['local-mobile-rag-gemma'].sectionTitle, 'Flutter 공개 패키지');
  assert.equal(byId['local-mobile-rag-gemma'].introTopics.length, 4);
  assert.deepEqual(byId['local-mobile-rag-gemma'].metrics.map((m) => m.value), ['0.20.0', '25.9ms']);
  assert.equal(byId['easy-contract-viewer'].features.length, 4);
  assert.deepEqual(byId['easy-contract-viewer'].relatedProjectIds, ['easy-contract-viewer-server']);
  for (const step of byId['easy-contract-viewer'].stepScreens) {
    assert.ok(screenIds('easy-contract-viewer').includes(step.screenId), step.screenId);
  }
  assert.ok(screenIds('law-info-engine').includes(byId['law-info-engine'].figure.screenId));
  assert.doesNotMatch(byId['law-info-engine'].sectionSummary, /Bronze|Silver|Gold|nDCG|MRR|Recall|RRFRanker/);
  assert.equal(experienceItems.filter((item) => item.cardHighlight).length, 4);
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test test/portfolio-v1.test.mjs`
Expected: FAIL with `src/data/searchDocuments.ts must exist`

- [ ] **Step 3: 타입 추가**

`src/types/recruitment.ts`에 추가합니다(기존 필드는 그대로).

```ts
export interface IntroTopic {
  label: string;
  title: string;
  body: string;
  flow?: string;
}

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseFeature {
  title: string;
  description: string;
}

export interface CaseStepScreen {
  screenId: string;
  label: string;
}

export interface CaseFigure {
  screenId: string;
  caption: string;
}
```

`RecruitmentCase` 인터페이스 끝에 추가합니다.

```ts
  sectionTitle?: string;
  sectionLead?: string;
  sectionSummary?: string;
  metrics?: CaseMetric[];
  introTopics?: IntroTopic[];
  features?: CaseFeature[];
  stepScreens?: CaseStepScreen[];
  figure?: CaseFigure;
  relatedProjectIds?: string[];
```

`ExperienceItem`에 `cardHighlight?: string;`, `RecruitmentProfile`에 `headline?: string;`과 `intro?: string;`을 추가합니다.

`src/types/portfolio.ts`의 `PortfolioCopy`에 추가합니다(기존 필드는 지우지 않음).

```ts
  careerHeading: string;
  otherProjectsLabel: string;
  contactHeadingHighlight?: string;
```

- [ ] **Step 4: `src/data/recruitment.ts`에 값 추가**

`recruitmentProfile`에 추가합니다.

```ts
  headline: 'Flutter · 온디바이스 RAG 개발자',
  intro:
    'Flutter로 iOS·Android 제품을 만들고 운영해 왔습니다. 최근에는 앱 안에서 동작하는 로컬 검색 엔진까지 직접 만들어 제품에 붙였습니다.',
```

`local-mobile-rag-gemma` 사례 객체에 추가합니다.

```ts
    sectionTitle: 'Flutter 공개 패키지',
    sectionLead:
      'mobile_rag_engine은 문서를 서버에 올리지 않고, 휴대폰 안에서 검색과 RAG context 생성까지 끝내는 패키지입니다.',
    metrics: [
      { value: '0.20.0', label: 'pub.dev 배포 버전' },
      { value: '25.9ms', label: '234자 임베딩 평균, 기기 내 · 디버그 빌드' },
    ],
    introTopics: [
      {
        label: '완전 로컬 RAG',
        title: '문서가 기기 밖으로 나가지 않습니다',
        body: 'Flutter 앱에서 문서를 서버에 업로드하지 않고 검색과 RAG context 생성을 처리합니다. 패키지는 LLM에 넘길 context까지만 책임지고, LLM provider와 채팅 UX는 앱에 맡깁니다.',
      },
      {
        label: '색인 파이프라인',
        title: '파싱부터 색인까지 기기 안에서',
        body: '문서 파싱, chunk metadata, ONNX embedding, SQLite 저장, index write로 이어지는 ingest 경로를 직접 구현했습니다. 234자 텍스트 임베딩은 기기에서 평균 25.9ms가 걸렸습니다.',
        flow: '파싱 → chunk metadata → ONNX embedding → SQLite → index',
      },
      {
        label: '하이브리드 검색',
        title: '의미 검색과 키워드 검색을 함께',
        body: 'HNSW vector 검색과 BM25 sparse 검색의 후보를 결합해 context로 조립합니다. 메리츠화재 태블릿 앱에서는 여기에 RRF 융합 랭킹과 질의 유형별 가중치를 더했습니다.',
        flow: 'HNSW + BM25 → 후보 결합 → LLM-ready context',
      },
      {
        label: '3계층 구조',
        title: '제품 API와 네이티브 hot path를 분리',
        body: '앱이 쓰는 Flutter facade, 흐름을 제어하는 Dart orchestration, 네이티브 hot path를 맡는 Rust FFI 코어로 나눴습니다. Flutter 쪽 사용 면은 단순해지고, 대신 네이티브 빌드와 릴리스 경계를 함께 관리합니다.',
        flow: 'Flutter facade → Dart orchestration → Rust FFI core',
      },
    ],
```

`easy-contract-viewer` 사례 객체에 추가합니다.

```ts
    sectionLead: '검색과 AI 요약의 결과를 언제나 PDF 원문의 정확한 근거 위치로 되돌립니다.',
    features: [
      { title: '온디바이스 약관 검색', description: '약관 PDF를 서버로 보내지 않고 기기 안에서 조항 단위로 찾습니다.' },
      { title: '원문 근거 하이라이트', description: '검색·요약 결과에서 PDF의 정확한 근거 영역으로 바로 이동합니다.' },
      { title: '동의 기반 AI 요약', description: '사용자가 동의할 때만 요약하고, 서버를 못 쓰면 로컬로 대체합니다.' },
      { title: '비용이 통제되는 요약 서버', description: '요청 서명, 사용 한도, 예산 상한, 중복 요청 병합으로 남용을 막습니다.' },
    ],
    stepScreens: [
      { screenId: '11-smart-guide-search-results', label: '약관 검색' },
      { screenId: '04-review-detail-highlight-summary', label: '조항 요약' },
      { screenId: '07-pdf-source-highlight', label: '원문 근거로' },
    ],
    relatedProjectIds: ['easy-contract-viewer-server'],
```

`law-info-engine` 사례 객체에 추가합니다.

```ts
    sectionLead: 'LLM이 검색된 공식 법령 근거 안에서만 답하도록 만든 인용 기반 검색 엔진.',
    sectionSummary:
      '국가법령 데이터를 조문 단위로 정리해 두고, 질문이 들어오면 의미가 비슷한 조문과 같은 법령 용어를 쓰는 조문을 함께 찾아 출처와 함께 돌려줍니다. 검색 품질이 떨어지는 변경은 배포되지 않도록 막아 두었습니다.',
    figure: {
      screenId: 'search-ui',
      caption: '공개 검색 화면. 결과마다 법령명, 조문 경로, 시행일, 출처 URL이 붙습니다.',
    },
```

`experienceItems`의 앞 네 항목에 `cardHighlight`를 추가합니다(㈜영우, 한국와콤은 넣지 않음 → `highlights[0]` 사용).

```ts
// 메리츠화재해상보험
    cardHighlight:
      'mobile_rag_engine 기반 BM25+HNSW Hybrid Search에 RRF 융합 랭킹과 Source Filter를 적용했습니다.',
// ㈜피에트
    cardHighlight:
      'BLE sample interval·timestamp 기반 ROM 계산으로 장시간 누적 drift를 70% 이상 줄였습니다.',
// ㈜인피니티익스체인지코리아
    cardHighlight:
      '가상자산 거래소 앱의 실시간 시세 WebSocket 연결 생명주기와 화면 반영 흐름을 최적화했습니다.',
// 튜링바이오
    cardHighlight:
      'VitalTracker의 센서 수집과 MethodChannel 네이티브 처리, 백그라운드 lifecycle을 안정화했습니다.',
```

- [ ] **Step 5: copy 값 추가와 변경**

`src/data/portfolio.ts`의 `portfolioCopy`에서 `navBrandLabel`을 `'포트폴리오'`로, `contactHeading`을 `'모바일 제품과 로컬 검색 기술을 함께 다룰 개발자를 찾고 계신가요?'`로 바꾸고, 아래 필드를 추가합니다.

```ts
  careerHeading: '5년 5개월, 여섯 팀',
  otherProjectsLabel: '그 밖의 프로젝트',
  contactHeadingHighlight: '모바일 제품과 로컬 검색 기술',
```

`src/data/freelancer.ts`의 `freelancerCopy`에서 `navBrandLabel`을 `'프리랜서 포트폴리오'`로 바꾸고, 아래 필드를 추가합니다.

```ts
  careerHeading: '5년 5개월, 여섯 팀',
  otherProjectsLabel: '그 밖의 프로젝트',
  contactHeadingHighlight: '모바일 제품이나 문서 검색 기능',
```

freelancer의 `contactHeading`은 바꾸지 않습니다. freelancer profile은 `headline`과 `intro`를 넣지 않으므로 화면은 기존 `role`과 `positioning`을 씁니다.

- [ ] **Step 6: 검색 대상 데이터 작성**

```ts
// src/data/searchDocuments.ts
import type { SearchDocument } from '@/lib/portfolioSearch';

export const searchDocuments: readonly SearchDocument[] = [
  {
    id: 'easy-contract-viewer',
    title: 'Easy Contract Viewer',
    snippet: 'Flutter로 만든 보험 약관 검토 앱. 약관 PDF를 온디바이스로 검색하고, 결과를 원문 근거 위치로 다시 연결합니다.',
    keywords: ['모바일', 'RAG', 'Riverpod', 'pdfrx', 'FastAPI', 'Redis', 'HMAC', 'AI요약', '하이라이트', 'iOS', 'Android'],
    meta: 'Flutter 앱 + FastAPI 서버',
    target: { kind: 'project', projectId: 'easy-contract-viewer' },
  },
  {
    id: 'fiet-fitness-trainer',
    title: '피에트 피트니스 트레이너',
    snippet: 'Flutter 태블릿 앱. BLE 실시간 센서 연동, 트레이너용 분석 리포트, Fastlane·GitHub Actions 배포 자동화.',
    keywords: ['모바일', 'Dart', 'Firebase', '센서', 'ROM', 'drift', 'iOS', 'Android'],
    meta: '태블릿 앱 · ㈜피에트',
    target: { kind: 'project', projectId: 'fiet-fitness-trainer' },
  },
  {
    id: 'weedool',
    title: 'Weedool',
    snippet: 'Flutter + Riverpod + GoRouter로 만든 상담·활동 플로우.',
    keywords: ['모바일', 'GoRouter', '헬스케어', 'STT', 'TTS'],
    meta: '모바일 앱 · 튜링바이오',
    target: { kind: 'project', projectId: 'weedool' },
  },
  {
    id: 'crypto-exchange-app',
    title: '가상자산 거래소 앱',
    snippet: 'Flutter·GetX로 만든 거래소 앱. 실시간 시세 WebSocket과 KYC 인증 흐름을 개발했습니다.',
    keywords: ['모바일', 'MVC', '실시간', '인증'],
    meta: '모바일 앱 · ㈜인피니티익스체인지코리아',
    target: { kind: 'anchor', href: '#career' },
  },
  {
    id: 'local-mobile-rag-gemma',
    title: 'mobile_rag_engine',
    monoTitle: true,
    snippet: '문서를 서버에 올리지 않고 온디바이스에서 검색과 RAG context 생성까지 처리하는 Flutter 패키지.',
    keywords: ['모바일', 'Dart', 'Rust FFI', 'HNSW', 'BM25', 'ONNX', 'SQLite', 'RRF', '하이브리드'],
    meta: 'pub.dev · 0.20.0',
    target: { kind: 'project', projectId: 'local-mobile-rag-gemma' },
  },
  {
    id: 'law-info-engine',
    title: 'Swifty-law',
    snippet: '같은 하이브리드 검색을 서버에서 운영하는, 공식 근거 안에서만 답하는 법령 API.',
    keywords: ['RAG', 'Python', 'FastAPI', 'PostgreSQL', 'Milvus', 'SBERT', 'BM25', 'RRF', 'LLM'],
    meta: 'law-api.swifty.kr',
    target: { kind: 'project', projectId: 'law-info-engine' },
  },
  {
    id: 'easy-contract-viewer-server',
    title: 'Easy Contract Viewer Server',
    snippet: 'AI 요약 요청을 받는 FastAPI 서버. 요청 서명, 사용 한도, 예산 상한, 중복 요청 병합으로 남용을 막습니다.',
    keywords: ['Python', 'FastAPI', 'Redis', '서버', 'HMAC'],
    meta: 'API 서버 · Easy Contract Viewer',
    target: { kind: 'project', projectId: 'easy-contract-viewer-server' },
  },
  {
    id: 'haru-check',
    title: 'HaruCheck',
    snippet: 'Flutter + Riverpod 상태 아키텍처로 만든 인증 기록 UX.',
    keywords: ['모바일', 'Firebase', 'Firestore'],
    meta: '모바일 앱',
    target: { kind: 'project', projectId: 'haru-check' },
  },
];
```

검색 대상의 `keywords`에 'BM25' 같은 단어가 있는 것은 괜찮습니다(검색어로 쓰일 수 있음). 금지 대상은 화면 라벨과 `meta`입니다.

- [ ] **Step 7: 통과 확인**

Run: `node --test test/portfolio-v1.test.mjs test/content-preservation.test.mjs && npx tsc --noEmit`
Expected: PASS. `tsc`가 옛 위젯에서 `PortfolioCopy` 관련 오류를 내면, 새로 추가한 필수 필드가 두 config에 다 들어갔는지 확인합니다.

- [ ] **Step 8: Commit**

```bash
git add src/types src/data test/portfolio-v1.test.mjs
git commit -m "feat: extend portfolio data for design v1 sections"
```

---

### Task 6: 히어로 검색 컴포넌트

**Files:**
- Create: `src/lib/usePrefersReducedMotion.ts`
- Create: `src/components/portfolio/PortfolioSearch.tsx`

**Interfaces:**
- Consumes: `searchDocuments`, `tokenize`, `SearchDocument`, `TextSegment` (Task 3)
- Produces: `usePrefersReducedMotion(): boolean`, `<PortfolioSearch documents={SearchDocument[]} onOpenProject={(projectId: string) => void} />`. DOM 계약: 입력창 label '포트폴리오 검색', 결과 `<ul aria-label="검색 결과">`, 멈춤 버튼 '자동 입력 멈추기', 정지 상태 문구 `프로젝트 {n}개에서 찾기`.

동작 규칙(명세 4번): 단어 Flutter → RAG → 모바일 개발 → 온디바이스 무한 반복. 시작 700ms, 입력 130ms/자, 유지 2400ms, 지우기 45ms/자, 다음 단어 전 380ms. 지우는 동안에는 `inputText`만 바뀌고 `query`는 유지합니다. focus·입력·추천 검색어·멈춤 버튼 중 하나면 영구 정지합니다. 히어로가 화면 밖에 있거나 탭이 숨겨지면 일시정지합니다. 움직임 줄이기에서는 'Flutter' 결과로 고정하고 멈춤 버튼을 숨깁니다.

- [ ] **Step 1: 훅 작성**

```ts
// src/lib/usePrefersReducedMotion.ts
'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
```

- [ ] **Step 2: 컴포넌트 작성**

```tsx
// src/components/portfolio/PortfolioSearch.tsx
'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import {
  searchDocuments,
  tokenize,
  type SearchDocument,
  type TextSegment,
} from '@/lib/portfolioSearch';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

const DEMO_WORDS = ['Flutter', 'RAG', '모바일 개발', '온디바이스'] as const;
const SUGGESTIONS = ['Flutter', 'RAG', '모바일 개발', '온디바이스', 'BLE'] as const;
const TIMING = { start: 700, type: 130, hold: 2400, erase: 45, gap: 380 } as const;
const REDUCED_MOTION_QUERY = DEMO_WORDS[0];

const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
};

interface PortfolioSearchProps {
  documents: readonly SearchDocument[];
  onOpenProject: (projectId: string) => void;
}

function Highlighted({
  segments,
  sweepKey,
  delayMs,
}: {
  segments: TextSegment[];
  sweepKey: string;
  delayMs: number;
}) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.hit ? (
          <mark
            key={`${sweepKey}-${index}`}
            className="search-mark"
            style={{ animationDelay: `${delayMs}ms` }}
          >
            {segment.text}
          </mark>
        ) : (
          <span key={`${sweepKey}-${index}`}>{segment.text}</span>
        )
      )}
    </>
  );
}

export default function PortfolioSearch({ documents, onOpenProject }: PortfolioSearchProps) {
  const [query, setQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [demoRunning, setDemoRunning] = useState(true);
  const [inView, setInView] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef('');
  const progress = useRef({ word: 0, chars: 0, phase: 'type' as 'type' | 'erase', started: false });

  const demoActive = demoRunning && !reducedMotion;
  const paused = !inView || !pageVisible;

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!demoActive || paused) return;
    let timeoutId = 0;
    const tick = () => {
      const state = progress.current;
      const word = DEMO_WORDS[state.word];
      if (state.phase === 'type') {
        state.chars += 1;
        const next = word.slice(0, state.chars);
        setQuery(next);
        setInputText(next);
        if (state.chars >= word.length) {
          state.phase = 'erase';
          timeoutId = window.setTimeout(tick, TIMING.hold);
        } else {
          timeoutId = window.setTimeout(tick, TIMING.type);
        }
        return;
      }
      state.chars -= 1;
      setInputText(word.slice(0, state.chars));
      if (state.chars <= 0) {
        state.phase = 'type';
        state.word = (state.word + 1) % DEMO_WORDS.length;
        timeoutId = window.setTimeout(tick, TIMING.gap);
      } else {
        timeoutId = window.setTimeout(tick, TIMING.erase);
      }
    };
    const firstDelay = progress.current.started ? TIMING.type : TIMING.start;
    progress.current.started = true;
    timeoutId = window.setTimeout(tick, firstDelay);
    return () => window.clearTimeout(timeoutId);
  }, [demoActive, paused]);

  const stopDemo = () => {
    if (!demoRunning) return;
    setDemoRunning(false);
    setInputText(reducedMotion ? REDUCED_MOTION_QUERY : queryRef.current);
    if (reducedMotion) setQuery(REDUCED_MOTION_QUERY);
  };

  const runQuery = (value: string) => {
    stopDemo();
    setQuery(value);
    setInputText(value);
  };

  const effectiveQuery = reducedMotion && demoRunning ? REDUCED_MOTION_QUERY : query;
  const shownInput = reducedMotion && demoRunning ? REDUCED_MOTION_QUERY : inputText;
  const results = useMemo(
    () => searchDocuments(documents, effectiveQuery),
    [documents, effectiveQuery]
  );
  const hasQuery = tokenize(effectiveQuery).length > 0;
  const listKey = results.map((result) => result.document.id).join('|');

  return (
    <div ref={rootRef} className="search-panel">
      <div className="flex items-center justify-between gap-3 font-mono text-xs text-faint">
        <label htmlFor="portfolio-search-input">포트폴리오 검색</label>
        {demoActive ? (
          <button
            type="button"
            onClick={stopDemo}
            className="-my-3 min-h-11 text-sub underline decoration-line-soft underline-offset-4 hover:text-marker"
          >
            자동 입력 멈추기
          </button>
        ) : (
          <span>프로젝트 {documents.length}개에서 찾기</span>
        )}
      </div>

      <div className="search-field">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          id="portfolio-search-input"
          type="search"
          value={shownInput}
          onFocus={stopDemo}
          onChange={(event) => runQuery(event.target.value)}
          placeholder="기술, 제품, 키워드로 검색"
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent text-xl font-medium text-ink outline-none placeholder:text-faint"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4">
        <span className="font-mono text-xs text-faint">추천 검색어</span>
        {SUGGESTIONS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => runQuery(label)}
            className="min-h-11 text-sm text-sub underline decoration-line-soft underline-offset-4 hover:text-marker"
          >
            {label}
          </button>
        ))}
      </div>

      <p aria-live={demoActive ? 'off' : 'polite'} className="m-0 font-mono text-xs text-faint">
        {hasQuery ? `결과 ${results.length}건` : '추천 결과'}
      </p>

      <ul aria-label="검색 결과" className="m-0 flex min-h-[380px] list-none flex-col gap-1.5 p-0">
        {results.map((result, index) => {
          const { document } = result;
          const target = document.target;
          const sweepKey = `${effectiveQuery}:${document.id}`;
          const markDelay = 140 + index * 70;
          const body = (
            <>
              <span className="w-6 shrink-0 pt-[3px] font-mono text-[13px] text-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className={document.monoTitle ? 'font-mono text-[19px] font-medium' : 'text-[19px] font-semibold'}>
                  <Highlighted segments={result.titleSegments} sweepKey={`${sweepKey}:t`} delayMs={markDelay} />
                </span>
                <span className="text-[15px] leading-[1.65] text-sub">
                  <Highlighted segments={result.snippetSegments} sweepKey={`${sweepKey}:s`} delayMs={markDelay} />
                </span>
                {result.keywordMatches.length > 0 && (
                  <span className="font-mono text-xs text-sub">
                    관련 키워드 · {result.keywordMatches.join(', ')}
                  </span>
                )}
                <span className="font-mono text-xs text-faint">{document.meta}</span>
              </span>
            </>
          );
          return (
            <li key={`${listKey}:${document.id}`} className="search-result" style={{ animationDelay: `${index * 70}ms` }}>
              {target.kind === 'anchor' ? (
                <a href={target.href} className="search-result-link">{body}</a>
              ) : (
                <button type="button" onClick={() => onOpenProject(target.projectId)} className="search-result-link">
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {hasQuery && results.length === 0 && (
        <p className="m-0 text-[15px] leading-[1.7] text-sub">
          ‘{effectiveQuery}’에 맞는 결과가 없습니다. 추천 검색어를 눌러 보세요.
        </p>
      )}
    </div>
  );
}
```

`key`가 바뀌면 React가 요소를 다시 만들기 때문에, 결과 목록이 바뀔 때만 `result-in`, 검색어가 바뀔 때마다 `marker-sweep` 애니메이션이 다시 재생됩니다. 별도 상태 머신은 필요 없습니다.

- [ ] **Step 3: 타입과 린트 확인**

Run: `npx tsc --noEmit && npx eslint src/components/portfolio/PortfolioSearch.tsx src/lib/usePrefersReducedMotion.ts`
Expected: 오류 없음. `react-hooks` 규칙이 ref 갱신이나 effect 안 setState를 지적하면, 위 코드처럼 effect 본문이 아닌 콜백(setTimeout, IntersectionObserver) 안에서만 setState가 일어나는지 확인합니다.

- [ ] **Step 4: Commit**

```bash
git add src/lib/usePrefersReducedMotion.ts src/components/portfolio/PortfolioSearch.tsx
git commit -m "feat: add interactive hero portfolio search"
```

---

### Task 7: 히어로 섹션

**Files:**
- Create: `src/components/portfolio/HeroSection.tsx`

**Interfaces:**
- Consumes: `PortfolioSearch` (Task 6), `buildMailHref` (Task 4)
- Produces: `<HeroSection profile copy capabilities searchDocuments firstCaseHref hasExperience onOpenProject />`

콘텐츠 보존: HEAD 히어로에 있던 `position`, `proofItems`(근거 링크 포함), `capabilities`(title + evidence, aria-label은 `copy.capabilityAriaLabel`)를 메타 줄로 남깁니다. 보드보다 두 줄 늘어나는 것은 의도입니다.

- [ ] **Step 1: 컴포넌트 작성**

```tsx
// src/components/portfolio/HeroSection.tsx
import type { SearchDocument } from '@/lib/portfolioSearch';
import { buildMailHref } from '@/lib/mailHref';
import type { Capability, PortfolioCopy } from '@/types/portfolio';
import type { RecruitmentProfile } from '@/types/recruitment';
import PortfolioSearch from './PortfolioSearch';

interface HeroSectionProps {
  profile: RecruitmentProfile;
  copy: PortfolioCopy;
  capabilities: Capability[];
  searchDocuments: readonly SearchDocument[];
  firstCaseHref: string;
  hasExperience: boolean;
  onOpenProject: (projectId: string) => void;
}

const navLinkClass = 'inline-flex min-h-11 items-center text-ink hover:text-marker';

export default function HeroSection({
  profile,
  copy,
  capabilities,
  searchDocuments,
  firstCaseHref,
  hasExperience,
  onOpenProject,
}: HeroSectionProps) {
  return (
    <section id="top" aria-labelledby="hero-name" className="screen bg-ground">
      <header className="absolute inset-x-0 top-0">
        <div className="screen-inner flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <a href="#top" className="inline-flex min-h-11 items-center text-[17px] font-bold tracking-[-0.01em] text-ink">
            {copy.navBrandLabel}
          </a>
          <nav aria-label="주요 메뉴" className="flex flex-wrap items-center gap-x-7 gap-y-1 text-[15px] font-medium">
            <a href={firstCaseHref} className={navLinkClass}>작업</a>
            {hasExperience && <a href="#career" className={navLinkClass}>경력</a>}
            <a href="#contact" className={navLinkClass}>연락</a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                className="inline-flex min-h-11 items-center rounded-[10px] border-[1.5px] border-ink px-[18px] text-sm font-semibold text-ink hover:border-marker hover:text-marker"
              >
                이력서 PDF
              </a>
            )}
          </nav>
        </div>
      </header>

      <div className="screen-inner flex flex-wrap items-center gap-16">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col">
          <h1 id="hero-name" className="t-display m-0">{profile.name}</h1>
          <p className="t-role mb-0 mt-5">{profile.headline ?? profile.role}</p>
          <p className="mb-0 mt-8 max-w-[500px] text-lg leading-[1.75] text-sub">
            {profile.intro ?? profile.positioning}
          </p>
          <p className="t-meta mb-0 mt-4 text-[13px]">
            {profile.proofItems.map((item, index) => (
              <span key={item.label}>
                {index > 0 && ' · '}
                {item.label} {item.evidence ? (
                  <a href={item.evidence} className="text-sub underline decoration-line-soft underline-offset-4 hover:text-marker">
                    {item.value} ↗
                  </a>
                ) : (
                  item.value
                )}
              </span>
            ))}
            {' · '}
            {profile.position}
          </p>
          <ul aria-label={copy.capabilityAriaLabel} className="m-0 mt-2 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-sm text-sub">
            {capabilities.map((capability) => (
              <li key={capability.title}>
                {capability.title} <span className="text-faint">{capability.evidence}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
            {profile.resumeUrl && <a href={profile.resumeUrl} className="btn-primary">이력서 PDF</a>}
            <a href={buildMailHref(profile.email, copy.contactMailSubject)} className="btn-outline">{copy.contactCta}</a>
            <a href={profile.githubUrl} className="inline-flex min-h-11 items-center text-[15px] font-medium text-ink hover:text-marker">
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="min-w-0 flex-[1.25_1_520px]">
          <PortfolioSearch documents={searchDocuments} onOpenProject={onOpenProject} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 확인**

Run: `npx tsc --noEmit && npx eslint src/components/portfolio/HeroSection.tsx`
Expected: 오류 없음

- [ ] **Step 3: Commit**

```bash
git add src/components/portfolio/HeroSection.tsx
git commit -m "feat: add v1 hero section with navigation"
```

---

### Task 8: 경력 섹션과 사례 링크

**Files:**
- Create: `src/components/portfolio/CaseLink.tsx`
- Create: `src/components/portfolio/CareerSection.tsx`

**Interfaces:**
- Consumes: `caseNumber`, `caseAnchorId` (Task 4)
- Produces: `<CaseLink projectId caseOrder featuredCount projects onOpenProject />` (번호가 없거나 프로젝트가 없으면 `null`), `<CareerSection items copy resumeUrl caseOrder featuredCount projects otherProjectIds onOpenProject />`

콘텐츠 보존: 카드에는 `cardHighlight`(없으면 `highlights[0]`)를 보이고, '자세히' 안에 `summary`와 나머지 highlights를 모두 둡니다. `cardHighlight`가 있으면 highlights 전부를 넣습니다. `relatedProjectIds`는 전부 링크로 만들고, 번호가 없는 id(예: 공개 제외 프로젝트)는 건너뜁니다. 고용 형태는 데이터 원문을 씁니다.

- [ ] **Step 1: `CaseLink` 작성**

```tsx
// src/components/portfolio/CaseLink.tsx
import { caseAnchorId, caseNumber } from '@/lib/caseOrder';
import type { Project } from '@/types/project';

interface CaseLinkProps {
  projectId: string;
  caseOrder: readonly string[];
  featuredCount: number;
  projects: Project[];
  onOpenProject: (projectId: string) => void;
}

const linkClass = 'link-marker inline-flex min-h-11 items-center text-sm font-medium';

export default function CaseLink({ projectId, caseOrder, featuredCount, projects, onOpenProject }: CaseLinkProps) {
  const number = caseNumber(caseOrder, projectId);
  const project = projects.find((candidate) => candidate.id === projectId);
  if (number === null || !project) return null;

  const label = `프로젝트 사례 #${number}`;
  const title = project.title.replace(/\s*\n\s*/g, ' ');

  if (number <= featuredCount) {
    return (
      <a href={`#${caseAnchorId(number)}`} aria-label={`${label}, ${title}`} className={linkClass}>
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpenProject(projectId)}
      aria-label={`${label}, ${title} 화면 보기`}
      className={linkClass}
    >
      {label}
    </button>
  );
}
```

- [ ] **Step 2: `CareerSection` 작성**

```tsx
// src/components/portfolio/CareerSection.tsx
import type { PortfolioCopy } from '@/types/portfolio';
import type { Project } from '@/types/project';
import type { ExperienceItem } from '@/types/recruitment';
import CaseLink from './CaseLink';

interface CareerSectionProps {
  items: ExperienceItem[];
  copy: PortfolioCopy;
  resumeUrl?: string;
  caseOrder: readonly string[];
  featuredCount: number;
  projects: Project[];
  otherProjectIds: readonly string[];
  onOpenProject: (projectId: string) => void;
}

const startYear = (period: string) => period.match(/\d{4}/)?.[0] ?? '';

export default function CareerSection({
  items,
  copy,
  resumeUrl,
  caseOrder,
  featuredCount,
  projects,
  otherProjectIds,
  onOpenProject,
}: CareerSectionProps) {
  if (!items.length) return null;
  const linkProps = { caseOrder, featuredCount, projects, onOpenProject };

  return (
    <section id="career" aria-labelledby="career-title" className="screen bg-career">
      <div className="screen-inner">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="flex flex-col">
            <span className="t-label mb-4">경력</span>
            <h2 id="career-title" className="t-h2 m-0">{copy.careerHeading}</h2>
            <p className="t-lead mb-0 mt-6 max-w-[520px]">{copy.experienceDescription}</p>
          </div>
          {resumeUrl && (
            <a href={resumeUrl} className="link-marker inline-flex min-h-11 items-center text-[15px] font-semibold">
              전체 경력은 이력서 PDF에서 ↗
            </a>
          )}
        </div>

        <ol className="m-0 mt-16 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-14 p-0">
          {items.map((item, index) => {
            const [firstHighlight, ...restHighlights] = item.highlights;
            const headline = item.cardHighlight ?? firstHighlight;
            const detailHighlights = item.cardHighlight ? item.highlights : restHighlights;
            return (
              <li key={`${item.company}-${item.period}`} className="flex flex-col gap-1.5">
                <span className={`t-number ${index === 0 ? 'text-marker' : 'text-ink'}`}>{startYear(item.period)}</span>
                <span className="t-meta mt-1.5">{item.period} · {item.employmentType}</span>
                <h3 className="m-0 mt-1.5 text-lg font-bold">
                  {item.company} <span className="text-[15px] font-normal text-sub">{item.role}</span>
                </h3>
                {headline && <p className="t-body-sm m-0">{headline}</p>}
                {item.relatedProjectIds.length > 0 && (
                  <div className="flex flex-wrap gap-x-5">
                    {item.relatedProjectIds.map((projectId) => (
                      <CaseLink key={projectId} projectId={projectId} {...linkProps} />
                    ))}
                  </div>
                )}
                <details className="career-detail">
                  <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-sub hover:text-ink">
                    자세히
                  </summary>
                  <p className="t-body-sm m-0 mt-1">{item.summary}</p>
                  {detailHighlights.length > 0 && (
                    <ul className="t-body-sm m-0 mt-2 list-disc space-y-1 pl-5">
                      {detailHighlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                    </ul>
                  )}
                </details>
              </li>
            );
          })}
        </ol>

        {otherProjectIds.length > 0 && (
          <div className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="t-group">{copy.otherProjectsLabel}</span>
            {otherProjectIds.map((projectId) => (
              <CaseLink key={projectId} projectId={projectId} {...linkProps} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 확인**

Run: `npx tsc --noEmit && npx eslint src/components/portfolio/CaseLink.tsx src/components/portfolio/CareerSection.tsx`
Expected: 오류 없음

- [ ] **Step 4: Commit**

```bash
git add src/components/portfolio/CaseLink.tsx src/components/portfolio/CareerSection.tsx
git commit -m "feat: add v1 career grid with preserved details"
```

---

### Task 9: 사례 #1 (mobile_rag_engine) 섹션과 탭

**Files:**
- Create: `src/components/portfolio/caseSectionTypes.ts`
- Create: `src/components/portfolio/CaseLabel.tsx`
- Create: `src/components/portfolio/CaseEngineSection.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` (Task 6), `RecruitmentCase.introTopics/metrics/sectionTitle/sectionLead` (Task 5)
- Produces: `CaseSectionProps { anchorId; caseNumber; project; recruitmentCase; caseOrder; featuredCount; projects; onOpenProject }`, `<CaseLabel n />`, `<CaseEngineSection {...CaseSectionProps} />`. DOM 계약: 탭 `role="tab"` 4개, 패널 `role="tabpanel"`, 버튼 '사례 자세히'.

명세 7번: 첫 탭 기본, 전환 out 180ms → 교체 → in 320ms, ↑/↓/←/→/Home/End, roving tabindex, 자동 활성화, 패널 영역 `min-height: 420px`, 스크린샷 없음.

- [ ] **Step 1: 공통 타입과 라벨**

```ts
// src/components/portfolio/caseSectionTypes.ts
import type { Project } from '@/types/project';
import type { RecruitmentCase } from '@/types/recruitment';

export interface CaseSectionProps {
  anchorId: string;
  caseNumber: number;
  project: Project;
  recruitmentCase: RecruitmentCase;
  caseOrder: readonly string[];
  featuredCount: number;
  projects: Project[];
  onOpenProject: (projectId: string) => void;
}
```

```tsx
// src/components/portfolio/CaseLabel.tsx
export default function CaseLabel({ n }: { n: number }) {
  return <span className="t-label mb-4">프로젝트 사례 #{n}</span>;
}
```

- [ ] **Step 2: 섹션 작성**

```tsx
// src/components/portfolio/CaseEngineSection.tsx
'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import CaseLabel from './CaseLabel';
import type { CaseSectionProps } from './caseSectionTypes';

const SWAP_OUT_MS = 180;

export default function CaseEngineSection({
  anchorId,
  caseNumber,
  project,
  recruitmentCase,
  onOpenProject,
}: CaseSectionProps) {
  const topics = recruitmentCase.introTopics ?? [];
  const metrics = recruitmentCase.metrics ?? [];
  const [selected, setSelected] = useState(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const reducedMotion = usePrefersReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const swapTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (swapTimer.current !== null) window.clearTimeout(swapTimer.current);
    },
    []
  );

  const select = (index: number) => {
    tabRefs.current[index]?.focus();
    if (index === selected) return;
    setSelected(index);
    if (swapTimer.current !== null) window.clearTimeout(swapTimer.current);
    if (reducedMotion) {
      setShown(index);
      setPhase('in');
      return;
    }
    setPhase('out');
    swapTimer.current = window.setTimeout(() => {
      setShown(index);
      setPhase('in');
      swapTimer.current = null;
    }, SWAP_OUT_MS);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (topics.length === 0) return;
    const last = topics.length - 1;
    const next = selected === last ? 0 : selected + 1;
    const previous = selected === 0 ? last : selected - 1;
    const targets: Record<string, number> = {
      ArrowDown: next,
      ArrowRight: next,
      ArrowUp: previous,
      ArrowLeft: previous,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
  };

  const links = [
    ...recruitmentCase.evidenceLinks.map((link) => ({ label: link.label, url: link.url })),
    ...(recruitmentCase.supportingPackages ?? []).flatMap((pkg) =>
      pkg.links
        .filter((link) => link.kind === 'pubdev')
        .map((link) => ({ label: `${pkg.name} ${pkg.version}`, url: link.url }))
    ),
  ];
  const topic = topics[shown];

  return (
    <section id={anchorId} aria-labelledby={`${anchorId}-title`} className="screen bg-slate">
      <div className="screen-inner flex flex-wrap items-center gap-16">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col">
          <CaseLabel n={caseNumber} />
          <h2 id={`${anchorId}-title`} className="t-h2 m-0 max-w-[14ch]">
            {recruitmentCase.sectionTitle ?? project.title}
          </h2>
          {recruitmentCase.sectionLead && (
            <p className="t-lead mb-0 mt-6 max-w-[560px]">{recruitmentCase.sectionLead}</p>
          )}
          {metrics.length > 0 && (
            <dl className="m-0 mt-12 flex flex-wrap gap-x-12 gap-y-7">
              {metrics.map((metric) => (
                <div key={metric.value} className="flex flex-col-reverse gap-1.5">
                  <dt className="text-[13px] text-sub">{metric.label}</dt>
                  <dd className="t-number m-0 text-marker">{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {topics.length > 0 && (
            <div
              role="tablist"
              aria-label={`${project.title} 소개`}
              aria-orientation="vertical"
              onKeyDown={onTabKeyDown}
              className="mt-10 flex flex-col gap-0.5 max-md:flex-row max-md:flex-wrap max-md:gap-x-5"
            >
              {topics.map((item, index) => {
                const isSelected = index === selected;
                return (
                  <button
                    key={item.label}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`${anchorId}-tab-${index}`}
                    aria-selected={isSelected}
                    aria-controls={`${anchorId}-panel`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => select(index)}
                    className={`engine-tab${isSelected ? ' is-selected' : ''}`}
                  >
                    <span aria-hidden="true" className="engine-tab-bar" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-1 text-[15px] font-medium">
            {links.map((link) => (
              <a key={`${link.label}-${link.url}`} href={link.url} className="link-marker inline-flex min-h-11 items-center">
                {link.label} ↗
              </a>
            ))}
            <button type="button" onClick={() => onOpenProject(project.id)} className="link-marker inline-flex min-h-11 items-center">
              사례 자세히
            </button>
          </div>
        </div>

        <div className="flex min-h-[420px] min-w-0 flex-[1_1_480px] items-center">
          {topic && (
            <div
              id={`${anchorId}-panel`}
              role="tabpanel"
              aria-labelledby={`${anchorId}-tab-${shown}`}
              tabIndex={0}
              data-phase={phase}
              className="engine-panel flex flex-col gap-6"
            >
              <h3 className="t-h3 m-0 max-w-[560px]">{topic.title}</h3>
              <p className="m-0 max-w-[560px] text-[17px] leading-[1.85] text-sub">{topic.body}</p>
              {topic.flow && (
                <p className="m-0 mt-2 max-w-[560px] font-mono text-[15px] leading-[1.7] text-marker">{topic.flow}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 확인**

Run: `npx tsc --noEmit && npx eslint src/components/portfolio/CaseEngineSection.tsx src/components/portfolio/CaseLabel.tsx src/components/portfolio/caseSectionTypes.ts`
Expected: 오류 없음

- [ ] **Step 4: Commit**

```bash
git add src/components/portfolio/caseSectionTypes.ts src/components/portfolio/CaseLabel.tsx src/components/portfolio/CaseEngineSection.tsx
git commit -m "feat: add mobile_rag_engine case section with topic tabs"
```

---

### Task 10: 사례 #2 (Easy Contract Viewer)와 사례 #3 (Swifty-law) 섹션

**Files:**
- Create: `src/components/portfolio/CaseContractViewerSection.tsx`
- Create: `src/components/portfolio/CaseLawSection.tsx`

**Interfaces:**
- Consumes: `CaseSectionProps`, `CaseLabel` (Task 9), `CaseLink` (Task 8)
- Produces: `<CaseContractViewerSection {...CaseSectionProps} />`, `<CaseLawSection {...CaseSectionProps} />`

명세 8·9번: ECV 화면 3장은 190×423, 계단 오프셋 0/40/80px(768px 이상), 캡션 없음, 768px 미만에서 가로 스크롤 스냅. '사용 기술'은 `project.techStack` 원문을 씁니다. Swifty-law 섹션에는 Bronze/Silver/Gold, 지표, RRFRanker를 렌더링하지 않습니다(데이터에는 남고 모달에서 보임).

- [ ] **Step 1: ECV 섹션 작성**

```tsx
// src/components/portfolio/CaseContractViewerSection.tsx
import Image from 'next/image';
import CaseLabel from './CaseLabel';
import CaseLink from './CaseLink';
import type { CaseSectionProps } from './caseSectionTypes';

const STEP_OFFSETS = ['', 'md:mt-10', 'md:mt-20'];

export default function CaseContractViewerSection({
  anchorId,
  caseNumber,
  project,
  recruitmentCase,
  caseOrder,
  featuredCount,
  projects,
  onOpenProject,
}: CaseSectionProps) {
  const features = recruitmentCase.features ?? [];
  const steps = (recruitmentCase.stepScreens ?? []).flatMap((step) => {
    const screen = project.screens.find((candidate) => candidate.id === step.screenId);
    return screen?.imagePath ? [{ ...step, imagePath: screen.imagePath, imageAlt: screen.imageAlt }] : [];
  });

  return (
    <section id={anchorId} aria-labelledby={`${anchorId}-title`} className="screen bg-stone">
      <div className="screen-inner flex flex-wrap items-center gap-16">
        <div className="flex min-w-0 flex-[1_1_400px] flex-col">
          <CaseLabel n={caseNumber} />
          <h2 id={`${anchorId}-title`} className="t-h2 m-0">{recruitmentCase.sectionTitle ?? project.title}</h2>
          {recruitmentCase.sectionLead && (
            <p className="t-lead mb-0 mt-6 max-w-[480px]">{recruitmentCase.sectionLead}</p>
          )}
          {features.length > 0 && (
            <div className="mt-10 flex flex-col gap-[18px]">
              <h3 className="t-group m-0">핵심 기능</h3>
              <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
                {features.map((feature) => (
                  <li key={feature.title} className="flex flex-col gap-0.5">
                    <span className="text-[17px] font-semibold">{feature.title}</span>
                    <span className="t-body-sm">{feature.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-2">
            <h3 className="t-group m-0">사용 기술</h3>
            <p className="m-0 text-base leading-[1.8]">{project.techStack.join(' · ')}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-1 text-[15px] font-medium">
            <button type="button" onClick={() => onOpenProject(project.id)} className="link-marker inline-flex min-h-11 items-center">
              사례 자세히
            </button>
            {(recruitmentCase.relatedProjectIds ?? []).map((projectId) => (
              <CaseLink
                key={projectId}
                projectId={projectId}
                caseOrder={caseOrder}
                featuredCount={featuredCount}
                projects={projects}
                onOpenProject={onOpenProject}
              />
            ))}
          </div>
        </div>

        {steps.length > 0 && (
          <ol
            tabIndex={0}
            aria-label={`${project.title} 사용 흐름 화면`}
            className="m-0 flex min-w-0 flex-[1.35_1_560px] list-none items-start justify-center gap-7 p-0 max-md:snap-x max-md:snap-mandatory max-md:justify-start max-md:overflow-x-auto max-md:pb-2"
          >
            {steps.map((step, index) => (
              <li key={step.screenId} className={`flex w-[190px] shrink-0 snap-start flex-col gap-3.5 ${STEP_OFFSETS[index] ?? ''}`}>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[30px] font-medium leading-none text-marker">{index + 1}</span>
                  <span className="text-base font-semibold">{step.label}</span>
                </div>
                <Image
                  src={step.imagePath}
                  alt={step.imageAlt}
                  width={190}
                  height={423}
                  sizes="190px"
                  className="h-auto w-[190px] rounded-3xl"
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Swifty-law 섹션 작성**

```tsx
// src/components/portfolio/CaseLawSection.tsx
import Image from 'next/image';
import CaseLabel from './CaseLabel';
import type { CaseSectionProps } from './caseSectionTypes';

export default function CaseLawSection({
  anchorId,
  caseNumber,
  project,
  recruitmentCase,
  onOpenProject,
}: CaseSectionProps) {
  const figure = recruitmentCase.figure;
  const screen = figure ? project.screens.find((candidate) => candidate.id === figure.screenId) : undefined;

  return (
    <section id={anchorId} aria-labelledby={`${anchorId}-title`} className="screen bg-moss">
      <div className="screen-inner flex flex-wrap items-center gap-16">
        <div className="flex min-w-0 flex-[1_1_400px] flex-col">
          <CaseLabel n={caseNumber} />
          <h2 id={`${anchorId}-title`} className="t-h2 m-0">{recruitmentCase.sectionTitle ?? project.title}</h2>
          {recruitmentCase.sectionLead && (
            <p className="t-lead mb-0 mt-6 max-w-[480px]">{recruitmentCase.sectionLead}</p>
          )}
          {recruitmentCase.sectionSummary && (
            <p className="t-body mb-0 mt-7 max-w-[480px]">{recruitmentCase.sectionSummary}</p>
          )}
          <div className="mt-9 flex flex-col gap-2">
            <h3 className="t-group m-0">사용 기술</h3>
            <p className="m-0 text-base leading-[1.8]">{project.techStack.join(' · ')}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-1 text-[15px] font-medium">
            {recruitmentCase.evidenceLinks.map((link) => (
              <a key={link.url} href={link.url} className="link-marker inline-flex min-h-11 items-center">
                {link.label} ↗
              </a>
            ))}
            <button type="button" onClick={() => onOpenProject(project.id)} className="link-marker inline-flex min-h-11 items-center">
              사례 자세히
            </button>
          </div>
        </div>

        {figure && screen?.imagePath && (
          <figure className="m-0 flex min-w-0 flex-[1.35_1_560px] flex-col gap-3.5">
            <Image
              src={screen.imagePath}
              alt={screen.imageAlt}
              width={1454}
              height={1319}
              sizes="(min-width: 1024px) 700px, 100vw"
              className="h-auto w-full rounded-2xl"
            />
            <figcaption className="text-[13px] leading-relaxed text-faint">{figure.caption}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 확인**

Run: `npx tsc --noEmit && npx eslint src/components/portfolio/CaseContractViewerSection.tsx src/components/portfolio/CaseLawSection.tsx`
Expected: 오류 없음

- [ ] **Step 4: Commit**

```bash
git add src/components/portfolio/CaseContractViewerSection.tsx src/components/portfolio/CaseLawSection.tsx
git commit -m "feat: add contract viewer and law case sections"
```

---

### Task 11: 연락 섹션

**Files:**
- Create: `src/components/portfolio/ContactSection.tsx`

**Interfaces:**
- Consumes: `buildMailHref` (Task 4), `copy.contactHeadingHighlight` (Task 5)
- Produces: `<ContactSection profile copy />`. 섹션 id `contact`. HEAD 푸터 문구(`© {연도} 오병희`, `Powered by Next.js`)를 보존합니다.

- [ ] **Step 1: 작성**

```tsx
// src/components/portfolio/ContactSection.tsx
import { buildMailHref } from '@/lib/mailHref';
import type { PortfolioCopy } from '@/types/portfolio';
import type { RecruitmentProfile } from '@/types/recruitment';

interface ContactSectionProps {
  profile: RecruitmentProfile;
  copy: PortfolioCopy;
}

export default function ContactSection({ profile, copy }: ContactSectionProps) {
  const heading = copy.contactHeading;
  const highlight = copy.contactHeadingHighlight;
  const at = highlight ? heading.indexOf(highlight) : -1;

  return (
    <section id="contact" aria-labelledby="contact-title" className="screen bg-ground">
      <div className="screen-inner">
        <span className="t-label mb-4 block">연락</span>
        <h2 id="contact-title" className="t-h2 m-0 max-w-[1040px] !leading-[1.55]">
          {highlight && at >= 0 ? (
            <>
              {heading.slice(0, at)}
              <mark className="contact-mark">{highlight}</mark>
              {heading.slice(at + highlight.length)}
            </>
          ) : (
            heading
          )}
        </h2>
        <p className="mb-0 mt-8 max-w-[620px] text-lg leading-[1.75] text-sub">{copy.contactDescription}</p>
        <a
          href={buildMailHref(profile.email, copy.contactMailSubject)}
          className="link-marker mt-12 inline-block font-mono text-[clamp(22px,3.2vw,44px)] font-medium tracking-[-0.02em] decoration-[3px] underline-offset-[10px]"
        >
          {profile.email}
        </a>
        <div className="mt-11 flex flex-wrap gap-3">
          {profile.resumeUrl && <a href={profile.resumeUrl} className="btn-primary">이력서 PDF</a>}
          <a href={profile.githubUrl} className="btn-outline">GitHub ↗</a>
        </div>
      </div>
      <footer className="absolute inset-x-0 bottom-8">
        <div className="screen-inner flex flex-wrap justify-between gap-2 font-mono text-xs text-faint">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Powered by Next.js</span>
        </div>
      </footer>
    </section>
  );
}
```

- [ ] **Step 2: 확인**

Run: `npx tsc --noEmit && npx eslint src/components/portfolio/ContactSection.tsx`
Expected: 오류 없음

- [ ] **Step 3: Commit**

```bash
git add src/components/portfolio/ContactSection.tsx
git commit -m "feat: add v1 contact section with preserved footer"
```

---

### Task 12: 조립, 옛 위젯 제거, 모달 재색

**Files:**
- Modify: `src/components/Portfolio.tsx` (렌더 트리 교체, 모달 로직 유지)
- Modify: `src/components/widgets/index.ts`
- Delete: `src/components/widgets/{RecruitmentNav,DeveloperHero,FeaturedWork,ProjectCard,ProjectArchive,ExperienceTimeline,RecruitmentCTA,Footer,SectionContainer,SectionHeader}.tsx`
- Modify: `src/components/widgets/{ProjectModal,PresentationOverlay,DeviceFrame}.tsx` (색 클래스만)

**Interfaces:**
- Consumes: Task 4·5·7–11의 모든 export
- Produces: `/`, `/freelancer` 전체 화면. `main > section` 순서: `top`, `career`, `case-01`, `case-02`, `case-03`, `contact`.

- [ ] **Step 1: `Portfolio.tsx` 교체**

HEAD의 상태·핸들러·effect(키보드, 이미지 preload, 스크롤 잠금)는 한 줄도 바꾸지 않고 그대로 둡니다. 바뀌는 곳은 import, 파생 데이터, `openProjectById`, return뿐입니다. 아래가 완성본입니다. `// HEAD 그대로` 표시 구간은 `git show 3576ca8:src/components/Portfolio.tsx`의 해당 줄을 그대로 옮깁니다.

```tsx
'use client';

import { useState, useEffect, useCallback, useRef, type ComponentType } from 'react';
import type { Project } from '@/types/project';
import type { PortfolioConfig } from '@/types/portfolio';
import { projects } from '@/data/projects';
import { resolveProjectIds } from '@/data/resolveProjectIds';
import { searchDocuments } from '@/data/searchDocuments';
import {
  buildCaseOrder,
  caseAnchorId,
  findOtherProjectIds,
  resolveSearchDocuments,
} from '@/lib/caseOrder';
import { ProjectModal, PresentationOverlay } from './widgets';
import HeroSection from './portfolio/HeroSection';
import CareerSection from './portfolio/CareerSection';
import CaseEngineSection from './portfolio/CaseEngineSection';
import CaseContractViewerSection from './portfolio/CaseContractViewerSection';
import CaseLawSection from './portfolio/CaseLawSection';
import ContactSection from './portfolio/ContactSection';
import type { CaseSectionProps } from './portfolio/caseSectionTypes';

const caseSections: Record<string, ComponentType<CaseSectionProps>> = {
  'local-mobile-rag-gemma': CaseEngineSection,
  'easy-contract-viewer': CaseContractViewerSection,
  'law-info-engine': CaseLawSection,
};

interface PortfolioProps {
  config: PortfolioConfig;
}

const Portfolio = ({ config }: PortfolioProps) => {
  const {
    profile,
    copy,
    capabilities,
    featuredProjectIds,
    additionalProjectIds,
    cases,
    experienceItems,
  } = config;

  // HEAD 그대로: useState 5개(selectedProject, isAnimating, isPresentationMode, currentScreenIndex)와 presentationTriggerRef
  // HEAD 그대로: featuredProjects = resolveProjectIds(featuredProjectIds, projects, `${copy.navBrandLabel} featured projects`)
  // HEAD 그대로: additionalProjects = resolveProjectIds(additionalProjectIds, projects, `${copy.navBrandLabel} additional projects`)
  // HEAD 그대로: handleProjectClick, closeModal, enterPresentationMode, exitPresentationMode, nextSlide, prevSlide
  // HEAD 그대로: 키보드 effect, 이미지 preload effect, 스크롤 잠금 effect

  const openProjectById = (projectId: string) => {
    const project = projects.find((candidate) => candidate.id === projectId);
    if (project) handleProjectClick(project);
  };

  const caseOrder = buildCaseOrder(
    featuredProjects.map((project) => project.id),
    additionalProjects.map((project) => project.id)
  );
  const otherProjectIds = findOtherProjectIds(caseOrder, featuredProjects.length, [
    ...experienceItems.flatMap((item) => item.relatedProjectIds),
    ...cases.flatMap((item) => item.relatedProjectIds ?? []),
  ]);
  const heroDocuments = resolveSearchDocuments(searchDocuments, featuredProjectIds);

  return (
    <>
      <div
        inert={selectedProject ? true : undefined}
        aria-hidden={selectedProject ? true : undefined}
        className="min-h-screen bg-ground font-sans text-ink outline-none"
      >
        <main id="main-content" tabIndex={-1} className="outline-none">
          <HeroSection
            profile={profile}
            copy={copy}
            capabilities={capabilities}
            searchDocuments={heroDocuments}
            firstCaseHref={`#${caseAnchorId(1)}`}
            hasExperience={experienceItems.length > 0}
            onOpenProject={openProjectById}
          />

          <CareerSection
            items={experienceItems}
            copy={copy}
            resumeUrl={profile.resumeUrl}
            caseOrder={caseOrder}
            featuredCount={featuredProjectIds.length}
            projects={projects}
            otherProjectIds={otherProjectIds}
            onOpenProject={openProjectById}
          />

          {featuredProjects.map((project, index) => {
            const Section = caseSections[project.id];
            const recruitmentCase = cases.find((item) => item.projectId === project.id);
            if (!Section || !recruitmentCase) {
              throw new Error(`Missing case section or case data for "${project.id}"`);
            }
            return (
              <Section
                key={project.id}
                anchorId={caseAnchorId(index + 1)}
                caseNumber={index + 1}
                project={project}
                recruitmentCase={recruitmentCase}
                caseOrder={caseOrder}
                featuredCount={featuredProjectIds.length}
                projects={projects}
                onOpenProject={openProjectById}
              />
            );
          })}

          <ContactSection profile={profile} copy={copy} />
        </main>
      </div>

      {/* HEAD 그대로: ProjectModal 블록 */}
      {/* HEAD 그대로: PresentationOverlay 블록 */}
    </>
  );
};

export default Portfolio;
```

`featuredProjects`와 `additionalProjects`는 HEAD처럼 `resolveProjectIds`로 만듭니다. 잘못된 id가 있으면 즉시 throw하는 fail-closed 검증이고, 기존 테스트 'portfolio resolves both configured selections through the fail-closed boundary'가 이 호출을 확인합니다. 그래서 사례 번호도 두 배열에서 만듭니다.

- [ ] **Step 2: 옛 위젯 삭제와 index 정리**

```bash
git rm src/components/widgets/RecruitmentNav.tsx src/components/widgets/DeveloperHero.tsx src/components/widgets/FeaturedWork.tsx src/components/widgets/ProjectCard.tsx src/components/widgets/ProjectArchive.tsx src/components/widgets/ExperienceTimeline.tsx src/components/widgets/RecruitmentCTA.tsx src/components/widgets/Footer.tsx src/components/widgets/SectionContainer.tsx src/components/widgets/SectionHeader.tsx
grep -rn "SectionContainer\|SectionHeader\|ProjectCard\|RecruitmentNav\|DeveloperHero\|FeaturedWork\|ProjectArchive\|ExperienceTimeline\|RecruitmentCTA\|Footer" src
```

Expected: `grep` 결과는 `src/components/widgets/index.ts`의 export 줄뿐입니다. 그 줄들을 지워 `index.ts`를 아래처럼 만듭니다. 다른 파일이 걸리면 그 파일에서 import를 지우고 필요한 마크업을 직접 옮깁니다.

```ts
// Widget Components
export { default as ProjectModal } from './ProjectModal';
export { default as PresentationOverlay } from './PresentationOverlay';
export { default as DeviceFrame } from './DeviceFrame';
export { default as ProjectIcon } from './ProjectIcon';
export { default as ScreenImage } from './ScreenImage';
```

- [ ] **Step 3: 모달·프레젠테이션·DeviceFrame 색 교체**

세 파일에서 Tailwind 임의값 색만 아래 표대로 바꿉니다. 레이아웃·구조·문구·aria는 건드리지 않습니다.

| HEAD 값 | 문맥 | 새 클래스 |
|---|---|---|
| `#faf7f2` | `bg-` | `bg-ground` |
| `#faf7f2` | `text-` (어두운 오버레이 위 글자) | `text-ink` |
| `#f2ede4`, `#eef7f5`, `#f8faf9` | `bg-` | `bg-surface` |
| `#1f1b16` | `text-` | `text-ink` |
| `#1f1b16/40` | 모달 배경 막 `bg-` | `bg-black/60` |
| `#1f1b16` | `bg-` (진한 버튼·프레임) | `bg-surface-2` |
| `#4a4339` | `text-` | `text-sub` |
| `#756b60`, `#cfc4b2` | `text-` | `text-faint` |
| `#e8dfd0`, `#d9e4e1` | `border-` | `border-line` |
| `#0f766e`, `#9d4530`, `#b8543a` | `text-`/`border-`/`bg-` 강조 | `text-marker` / `border-marker` / `bg-marker text-ground` |
| `#38bdf8` | DeviceFrame 장식 | `text-marker` |
| `rgba(31,27,22,0.25)` 그림자 | `shadow-[…]` | `shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]` |

교체 후 `grep -n "#[0-9a-fA-F]\{6\}" src/components/widgets/*.tsx`를 실행해 남은 HEX가 이 표에 없는 것인지 확인합니다. 남은 것이 있으면 가장 가까운 토큰으로 바꿉니다.

- [ ] **Step 4: 빌드와 화면 확인**

```bash
npx tsc --noEmit && npm run lint && npm run build
npm run dev -- --hostname 127.0.0.1 --port 3100
```

브라우저에서 `http://127.0.0.1:3100/`과 `/freelancer`를 엽니다. 1440×900에서 캔버스 보드 '확정안 v1 · 데스크톱 페이지'와 섹션 순서·배경·글자 크기를 비교합니다. 390×844에서는 모바일 보드와 비교합니다. 각 '사례 자세히'와 '프로젝트 사례 #4–#7'이 모달을 여는지, 모달에 스크린샷·스택·사례 상세가 그대로 있는지 확인합니다.

- [ ] **Step 5: Commit**

```bash
git add -A src/components
git commit -m "feat: assemble design v1 portfolio and retire legacy widgets"
```

---

### Task 13: node 구조 테스트 이전

`test/developer-portfolio-structure.test.mjs`는 옛 화면 구조를 단정합니다. 아래 표대로 정리합니다. **'유지'** 테스트는 의도를 바꾸지 않습니다. 삭제된 파일을 읽으면 같은 책임을 가진 새 파일로 경로만 바꿉니다(`DeveloperHero` → `portfolio/HeroSection`, `ExperienceTimeline` → `portfolio/CareerSection`, `RecruitmentCTA`/`Footer` → `portfolio/ContactSection`, `RecruitmentNav` → `portfolio/HeroSection`, `FeaturedWork`/`ProjectCard` → `portfolio/Case*Section`, `ProjectArchive` → `portfolio/CareerSection`의 그 밖의 프로젝트).

**Files:**
- Modify: `test/developer-portfolio-structure.test.mjs`
- Modify: `test/portfolio-v1.test.mjs` (대체 테스트 추가)

| HEAD 테스트 | 처리 |
|---|---|
| root shell is server-rendered in Korean… | 유지 |
| home renders one deterministic portfolio… | 유지 |
| portfolio follows the approved recruitment section order | 삭제 → 아래 'v1 section order' 추가 |
| featured cases tell engine product backend story | 삭제 → 'v1 section order'가 대신함 |
| featured cases avoid an orphaned tablet card… | 삭제 (카드 없음) |
| narrow navigation preserves the complete brand… | 삭제 → e2e '320px 내비' 유지 |
| Easy Contract Viewer Server copy is bounded… | 유지 |
| API projects use a backend-specific type and label | 유지 (라벨을 렌더링하던 파일이 없어지면 데이터 단정만 남김) |
| Easy Contract Viewer Server uses source-backed architecture assets | 유지 |
| additional projects expose the backend-first four-case selection… | 수정: `additionalProjectIds` 4개와 순서 단정은 유지하고, 렌더 위치 단정은 '프로젝트 사례 #4–#7 도달' e2e로 대체 |
| Easy Contract Viewer Server is a private backend case… | 유지 |
| FIET trainer uses report evidence… | 유지 |
| route configuration has no unused cross-route link abstraction | 유지 |
| route pages inject presentation configuration… | 유지 |
| project selection fails closed… | 유지 |
| portfolio resolves both configured selections… | 유지 (Portfolio.tsx가 두 `resolveProjectIds` 호출을 유지) |
| freelancer route is unlisted… | 유지 |
| supported static sitemap sources… | 유지 |
| active source has no audience runtime | 유지 |
| active source has no locale runtime | 유지 |
| project data uses Korean strings… | 유지 |
| recruitment data separates project assets from hiring evidence | 유지 |
| featured cases keep cards concise and integrate supporting packages in detail | 수정: '사례 자세히' 모달(ProjectModal)이 supportingPackages를 렌더링한다는 단정만 남김 |
| verified resume input populates six latest-first experience entries… | 유지 |
| public resume PDF is extractable… | 유지 |
| experience timeline resolves project ids to readable linked project names | 수정: `CaseLink`가 `aria-label`에 프로젝트 제목을 넣는지 소스 단정 |
| experience timeline keeps one result visible and discloses the remaining detail | 수정: `CareerSection`이 `cardHighlight ?? highlights[0]`와 `<details>`, `item.summary`를 쓰는지 소스 단정 |
| active project copy uses the latest stable mobile_rag_engine release | 유지 |
| manual release documentation does not require VoiceOver… | 유지 |
| case detail separates verification, outcomes, trade-offs, and non-goals | 유지 (ProjectModal) |
| active recruitment UI keeps decorative copy Korean | 유지, 검사 대상 경로를 `src/components/portfolio/*`로 |
| hero owns compact project-backed capabilities… | 수정: `HeroSection`이 `capabilities`와 `copy.capabilityAriaLabel`을 렌더링하는지 |
| hero separates career context from linked public evidence | 수정: `HeroSection`이 `proofItems`의 `evidence`를 링크로 렌더링하는지 |
| case verification labels distinguish methods… | 유지 (ProjectModal) |
| Swifty-law is typed as an API while scrollable product screens stay scrollable | 유지 |
| additional projects use a compact archive without thumbnail cards | 삭제 |
| recruitment flow has explicit component boundaries | 수정: 아래 'v1 component boundaries'로 교체 |
| empty experience and missing resume actions stay hidden | 수정: `CareerSection`의 `if (!items.length) return null`, `HeroSection`·`ContactSection`의 `profile.resumeUrl &&` 단정 |
| app bar uses a portfolio brand label instead of repeating the hero name | 수정: `HeroSection`이 `copy.navBrandLabel`을 쓰고 `portfolioCopy.navBrandLabel === '포트폴리오'` |
| project detail and presentation actions use Korean accessible names | 유지 |
| modal order and screenshot regions follow reading and keyboard order | 유지 |
| unverified profile facts stay hidden… | 유지 |
| information labels remain readable without tiny active text | 수정: `src/components/portfolio/*`에 `text-[10px]`, `text-[11px]`이 없는지 |
| contact section leads with a clear email action… | 수정: `ContactSection`이 `buildMailHref(profile.email, copy.contactMailSubject)`와 `copy.contactDescription`을 쓰는지 |
| project cards reserve hover feedback for real controls | 삭제 |
| layout only loads fonts used by the active design | Task 2에서 삭제됨 |

- [ ] **Step 1: 대체 테스트 추가 (`test/portfolio-v1.test.mjs`)**

```js
test('v1 section order: hero, career, featured cases, contact', () => {
  const portfolio = read('src/components/Portfolio.tsx');
  const order = ['<HeroSection', '<CareerSection', 'featuredProjects.map', '<ContactSection'].map((token) =>
    portfolio.indexOf(token)
  );
  assert.ok(order.every((index) => index > -1), JSON.stringify(order));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.match(portfolio, /<ProjectModal/);
  assert.match(portfolio, /<PresentationOverlay/);
});

test('v1 component boundaries replace the legacy widgets', () => {
  for (const removed of ['RecruitmentNav', 'DeveloperHero', 'FeaturedWork', 'ProjectCard', 'ProjectArchive', 'ExperienceTimeline', 'RecruitmentCTA', 'Footer', 'SectionContainer', 'SectionHeader']) {
    assert.equal(read(`src/components/widgets/${removed}.tsx`), '', `${removed} should be removed`);
  }
  for (const added of ['HeroSection', 'PortfolioSearch', 'CareerSection', 'CaseLink', 'CaseLabel', 'CaseEngineSection', 'CaseContractViewerSection', 'CaseLawSection', 'ContactSection']) {
    assert.notEqual(read(`src/components/portfolio/${added}.tsx`), '', `${added} should exist`);
  }
});

test('v1 UI never labels the hero search with algorithm names or section indices', () => {
  const sources = ['PortfolioSearch', 'HeroSection', 'CareerSection', 'CaseEngineSection', 'CaseContractViewerSection', 'CaseLawSection', 'ContactSection']
    .map((name) => read(`src/components/portfolio/${name}.tsx`))
    .join('\n');
  assert.doesNotMatch(sources, /BM25 \+ HNSW|RRF<|>RRF/);
  assert.doesNotMatch(sources, /\d{2} \/ \d{2}/);
  assert.doesNotMatch(sources, /text-\[1[01]px\]/);
});
```

- [ ] **Step 2: 표대로 옛 테스트 정리**

삭제·수정 대상만 고칩니다. 수정 테스트는 위 '처리' 칸의 단정을 `read()` + `assert.match`로 씁니다. 예시:

```js
test('career keeps one highlight visible and discloses summary and the rest', () => {
  const career = read('src/components/portfolio/CareerSection.tsx');
  assert.match(career, /item\.cardHighlight \?\? firstHighlight/);
  assert.match(career, /<details/);
  assert.match(career, /item\.summary/);
});
```

- [ ] **Step 3: 전체 실행**

Run: `npm test`
Expected: 모든 테스트 PASS(Task 0 기준선에서 원래 실패하던 테스트 제외)

- [ ] **Step 4: Commit**

```bash
git add test
git commit -m "test: migrate structure contracts to design v1"
```

---

### Task 14: e2e 이전과 새 e2e

**Files:**
- Create: `e2e/portfolio-v1.spec.ts`
- Modify: `e2e/accessibility.spec.ts`

- [ ] **Step 1: 새 e2e 작성**

```ts
// e2e/portfolio-v1.spec.ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('확정안 v1 섹션 순서와 배경 톤', async ({ page }) => {
  await page.goto('/');
  const sections = page.locator('main > section');
  expect(await sections.evaluateAll((nodes) => nodes.map((node) => node.id))).toEqual([
    'top', 'career', 'case-01', 'case-02', 'case-03', 'contact',
  ]);
  expect(
    await sections.evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).backgroundColor))
  ).toEqual([
    'rgb(42, 43, 47)', 'rgb(35, 36, 39)', 'rgb(41, 45, 52)', 'rgb(49, 47, 43)', 'rgb(42, 47, 43)', 'rgb(42, 43, 47)',
  ]);
});

test('히어로 검색은 자동 입력으로 Flutter 결과를 보여 주고 멈출 수 있다', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('포트폴리오 검색');
  const results = page.getByRole('list', { name: '검색 결과' });
  await expect(input).toHaveValue('Flutter', { timeout: 5_000 });
  await expect(results.getByRole('listitem')).toHaveCount(3);
  await expect(results.getByRole('listitem').first()).toContainText('Easy Contract Viewer');

  await page.getByRole('button', { name: '자동 입력 멈추기' }).click();
  await expect(page.getByText('프로젝트 8개에서 찾기')).toBeVisible();

  await input.fill('BLE');
  await expect(results.getByRole('listitem')).toHaveCount(1);
  await expect(results).toContainText('피에트 피트니스 트레이너');
});

test('움직임 줄이기에서는 자동 입력 없이 Flutter 결과로 고정한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByLabel('포트폴리오 검색')).toHaveValue('Flutter');
  await expect(page.getByRole('button', { name: '자동 입력 멈추기' })).toHaveCount(0);
});

test('사례 #1 탭은 화살표 키로 이동하고 패널을 바꾼다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const section = page.locator('#case-01');
  const tabs = section.getByRole('tab');
  await expect(tabs).toHaveCount(4);
  await tabs.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(section.getByRole('tabpanel')).toContainText('파싱부터 색인까지 기기 안에서');
  await page.keyboard.press('End');
  await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
});

test('경력 자세히는 summary와 나머지 성과를 모두 보여 준다', async ({ page }) => {
  await page.goto('/');
  const firstEntry = page.locator('#career li').first();
  await firstEntry.getByText('자세히').click();
  await expect(firstEntry).toContainText('보험 판매자용 태블릿 앱에서 약관 RAG 탐색');
  await expect(firstEntry).toContainText('PDF 조항 추출, 검색 결과 하이라이트');
});

for (const route of ['/', '/freelancer']) {
  test(`${route} 대표·추가 프로젝트가 모두 모달로 열린다`, async ({ page }) => {
    await page.goto(route);
    for (const title of ['mobile_rag_engine', 'Easy Contract Viewer', 'Swifty-law']) {
      const section = page.locator('main > section', { has: page.getByRole('heading', { level: 2 }) })
        .filter({ hasText: title === 'mobile_rag_engine' ? 'Flutter 공개 패키지' : title });
      await section.getByRole('button', { name: '사례 자세히' }).click();
      await expect(page.getByRole('dialog')).toContainText(title);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }
    for (const [number, title] of [[4, 'Easy Contract Viewer Server'], [5, '피에트 피트니스 트레이너'], [6, 'HaruCheck'], [7, 'Weedool']] as const) {
      await page.getByRole('button', { name: new RegExp(`^프로젝트 사례 #${number},`) }).first().click();
      await expect(page.getByRole('dialog')).toContainText(title);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }
  });
}

test('홈과 열린 모달에 critical/serious axe 위반이 없다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const home = await new AxeBuilder({ page }).analyze();
  expect(home.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual([]);
  await page.locator('#case-02').getByRole('button', { name: '사례 자세히' }).click();
  const modal = await new AxeBuilder({ page }).analyze();
  expect(modal.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')).toEqual([]);
});
```

경력 자세히 테스트의 문구는 HEAD `recruitment.ts`의 메리츠화재 `summary`와 `highlights[1]` 앞부분입니다. 데이터 문구가 다르면 그 데이터 원문으로 맞춥니다(데이터를 바꾸지 말 것).

- [ ] **Step 2: `e2e/accessibility.spec.ts` 정리**

| HEAD 테스트 | 처리 |
|---|---|
| 한국어 단일 홈과 skip link, 대표 사례 순서를 제공한다 | 수정: skip link는 유지하고, 순서 단정은 `#case-01..03` 제목 순서(mobile_rag_engine 사례 'Flutter 공개 패키지' → Easy Contract Viewer → Swifty-law)로 |
| 프리랜서 전달용 라우트는 공개 홈에서 숨겨지고… | 유지 |
| sitemap 출력은 없거나… | 유지 |
| 두 실제 라우트 설정의 모든 프로젝트 ID가 공유 프로젝트로 렌더링된다 | 수정: 새 e2e '대표·추가 프로젝트가 모두 모달로 열린다'가 대신하므로, 이 테스트는 각 id의 제목이 '사례 자세히' 또는 '프로젝트 사례 #N' 경로로 열리는지만 남기거나 삭제 |
| 공개 홈과 프리랜서 경력은 모두 최신순으로 제공한다 | 유지 (선택자를 `#career li h3`로) |
| 경력 설명은 두 라우트의 최신순 정렬 기준을 안내한다 | 유지 (리드 문구가 `copy.experienceDescription`) |
| 프리랜서 전달용 라우트는 390px과 320px에서 가로 유실이 없다 | 유지 |
| 320px 앱바가 두 라우트에서 겹침 없이… | 수정: 링크 이름(작업·경력·연락·이력서 PDF)과 44px 단정 유지, 선택자를 `nav[aria-label="주요 메뉴"]`로 |
| 390px 채용 스캔 흐름은 8000px 안에 전체 정보를 제공한다 | 삭제 (섹션이 화면 높이라 의도적으로 길어짐) |
| 경력은 대표 성과만 먼저 보여주고 나머지를 펼쳐 제공한다 | 유지 (`<details>`) |
| 320px 추가 프로젝트 archive가 네 행과 기존 상세를 제공한다 | 수정: 320px에서 '프로젝트 사례 #4–#7' 버튼 4개가 보이고 각각 모달을 연다 |
| 피에트 트레이너 상세는 스플래시 대신 인바디 리포트를… | 유지 (진입은 '프로젝트 사례 #5' 버튼) |
| 피에트 사용자 앱은 데이터에 남고 공개 프로젝트 링크에서는 제외된다 | 유지 |
| 390px 프로젝트 상세은 제목 다음에 eager 시각 근거를… | 유지 (진입 버튼만 교체) |
| 320px와 390px 프로젝트 상세의 긴 기술 제목이 한 줄로… | 유지 |
| 데스크톱 프로젝트 상세 설명을 keyboard로 스크롤한다 | 유지 |
| 카드 dialog가 focus trap, Escape, focus restoration을 제공한다 | 수정: 트리거를 '사례 자세히' 버튼으로, 닫은 뒤 그 버튼으로 focus가 돌아오는지 |
| 프레젠테이션이 slide status와 preview focus restoration을… | 유지 |
| 스크롤 가능한 screenshot region을 keyboard로 탐색한다 | 유지 |
| reduced motion에서 named animation을 제거한다 | 유지 (`.search-result`, `.search-mark` 포함) |
| home, modal, presentation에 critical/serious axe 위반이 없다 | 유지 |
| home, modal, presentation에 browser console 경고와 오류가 없다 | 유지 |
| 1440px home이 LCP 이미지 우선순위 경고 없이 안정화된다 | 유지 (히어로에 이미지가 없으므로 경고가 나오면 사례 이미지의 `priority`를 추가하지 말고 원인 확인) |
| 뷰포트별 콘텐츠와 control을 잃지 않는다 | 유지 (선택자만 교체) |

카드를 클릭해 모달을 열던 헬퍼는 `page.locator('#case-0N').getByRole('button', { name: '사례 자세히' })` 또는 `page.getByRole('button', { name: /^프로젝트 사례 #N,/ })`로 바꿉니다.

- [ ] **Step 3: 실행**

```bash
npx playwright install chromium webkit
npm run test:a11y
npx playwright test e2e/portfolio-v1.spec.ts
```

Expected: 모두 PASS. 실패하면 화면을 고치고, 테스트 기대값을 디자인 명세와 다르게 바꾸지 않습니다.

- [ ] **Step 4: Commit**

```bash
git add e2e
git commit -m "test: cover design v1 flows in end-to-end tests"
```

---

### Task 15: 최종 검증

- [ ] **Step 1: 전체 검사**

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm run test:a11y
npx playwright test e2e/portfolio-v1.spec.ts
```

Expected: 모두 성공(기준선에서 원래 실패하던 테스트 제외)

- [ ] **Step 2: 콘텐츠 보존 수동 점검표**

- [ ] `git diff 3576ca8 -- src/data` 출력에 `-`로 시작하는 줄이 바뀐 copy 값 3개(`navBrandLabel` 두 개, recruitment `contactHeading`) 말고는 없다.
- [ ] `git diff 3576ca8 --stat -- public` 출력이 비어 있다.
- [ ] `/`와 `/freelancer` 모두에서 프로젝트 7개(mobile_rag_engine, Easy Contract Viewer, Swifty-law, Easy Contract Viewer Server, 피에트 피트니스 트레이너, HaruCheck, Weedool)의 모달이 열리고, 스크린샷·기술 스택·구현 포인트가 보인다.
- [ ] 경력 6개 모두 '자세히'에서 summary와 highlights가 보인다.
- [ ] 히어로에 역량(capabilities)과 근거(proofItems, pub.dev 링크)가 보인다.

- [ ] **Step 3: 디자인 대조**

1440×900과 390×844에서 캔버스 보드와 비교해 아래를 확인합니다.
- 섹션 배경 5톤
- 글자 위계 6단계
- 히어로 검색의 자동 입력 순서와 형광펜
- 사례 #1 탭 전환
- 사례 #2 계단식 화면 3장
- 연락 형광펜

계획에서 의도적으로 보드와 다르게 한 곳(히어로 메타 줄, 경력 '자세히', 그 밖의 프로젝트 줄, 사례 번호 #4–#7)은 다른 것이 맞습니다.

- [ ] **Step 4: 마무리**

superpowers:finishing-a-development-branch를 따릅니다. push·PR은 사용자 확인 후에만 합니다. 커밋과 PR 본문에 Claude 공동 작성자 표기를 넣지 않습니다.
