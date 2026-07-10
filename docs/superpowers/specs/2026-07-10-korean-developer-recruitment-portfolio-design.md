# 한국어 개발자 채용 포트폴리오 전환 설계

- 상태: 승인된 설계
- 작성일: 2026-07-10
- 대상 저장소: `dev-portfolio`
- 대상 화면: `/` 단일 페이지와 기존 프로젝트 상세 모달/프레젠테이션

## 1. 목적

현재 사이트의 프리랜서/개발자 이중 audience와 영어/한국어 이중 locale을 제거하고, 한국어 개발자 채용 전형에 최적화된 단일 포트폴리오로 전환한다.

방문자는 첫 10초 안에 다음 질문에 답을 얻어야 한다.

1. 어떤 개발자인가?
2. 어떤 규모와 경계의 문제를 해결했는가?
3. 이를 증명하는 대표 사례와 공개 근거는 무엇인가?
4. 경력과 역할은 어떻게 이어지는가?
5. 이력서, GitHub, 이메일에 어떻게 접근하는가?

이 설계는 현재의 따뜻한 편집형 비주얼, 세리프/산세리프/모노 조합, 중립색 배경, 청록색 포인트, 실제 프로젝트 이미지와 아키텍처 자산을 유지한다. 팔레트나 브랜드를 새로 만드는 작업이 아니다.

## 2. 확정된 제품 방향

### 2.1 단일 사용자와 단일 경로

- 기본 사용자는 한국어를 사용하는 채용 담당자와 기술 면접관이다.
- `/`은 query parameter 없이 하나의 결정적인 한국어 개발자 포트폴리오를 렌더링한다.
- `client`/`developer` audience, audience 전환 UI, audience별 렌더링 분기는 제거한다.
- EN/KO 언어 전환 UI와 client-side locale 상태를 제거한다.
- 제품명과 `Flutter`, `Rust`, `RAG`, `GitHub`, `API` 같은 고유명사 및 기술 용어는 번역하지 않는다.

### 2.2 포지셔닝

주 포지셔닝은 다음과 같다.

> 모바일 제품과 로컬 검색 엔진을 함께 만드는 개발자  
> Flutter · Rust FFI · 온디바이스 Retrieval/RAG

공개 문구는 `mobile_rag_engine`의 실제 구현 경계에 맞춘다.

- 강조: Flutter 제품화, Rust FFI, ONNX 임베딩, HNSW/BM25/RRF 검색 경로, 로컬 문서 처리, 검색 품질 평가, 운영 가능한 API 경계
- 보조 역량: FastAPI 기반 검색/LLM 백엔드, PostgreSQL/Milvus, 배포와 운영
- 금지: SQLite 자체가 ANN 검색을 실행하는 벡터 DB라는 표현, 직접 구현하지 않은 DBMS internals나 하드웨어 가속 경험, 근거 없는 성능·사용자·품질 수치

회사별 지원 문구는 이 기본 포지셔닝에서 실제 채용 공고에 맞는 부분만 좁혀 사용한다.

## 3. 선택한 접근법

`materialize-then-delete` 방식의 단계적 전환을 사용한다.

1. 현재 developer audience의 동작과 데이터를 단일 정본으로 승격한다.
2. audience 축이 사라진 것을 검증한 후 관련 타입과 코드를 삭제한다.
3. 한국어 값을 단일 문자열로 평탄화한다.
4. locale 사용처가 0개인 것을 검증한 후 i18n runtime을 삭제한다.
5. 단순화된 데이터와 컴포넌트 위에 채용형 정보구조를 적용한다.

화면만 한국어/developer로 고정하고 dead code를 남기는 방식은 최종 상태로 인정하지 않는다. audience 제거와 locale 제거를 하나의 대형 변경으로 합치지도 않는다.

## 4. 최종 정보구조

페이지 순서는 다음으로 고정한다.

1. 상단 내비게이션
2. 개발자 Hero와 신뢰 지표
3. 대표 기술 사례 3개
4. 핵심 역량
5. 경력과 역할 타임라인
6. 추가 프로젝트
7. 보완 오픈소스
8. 채용 CTA와 Footer

### 4.1 상단 내비게이션

상단에는 다음 항목만 둔다.

- 소개
- 대표 기술 사례
- 경력
- 연락
- 이력서

초기 구현에서는 일반 문서 흐름 안에 배치하고 sticky navigation은 도입하지 않는다. 이력서 URL이 실제로 제공되기 전에는 이력서 링크를 렌더링하지 않는다.

### 4.2 Hero

Hero의 콘텐츠 순서는 다음과 같다.

1. Eyebrow: `개발자 포트폴리오`
2. H1: `오병희`
3. 역할: `크로스플랫폼 개발자 · 로컬 RAG 엔지니어`
4. 전문 영역: `Flutter · 온디바이스 Retrieval/RAG · LLM 백엔드`
5. 가치 제안: 모바일 제품, 로컬 검색 엔진, 평가와 운영을 연결한다는 한 문장
6. 검증된 신뢰 지표 최대 3개
7. 대표 기술 사례, 이력서, 이메일 CTA

데스크톱은 2열을 사용한다.

- 왼쪽: 이름, 역할, 가치 제안, CTA
- 오른쪽: 검증된 경력/배포/운영 신뢰 지표

모바일은 동일한 읽기 순서의 1열로 재배치한다. 이미지나 아바타는 새로 추가하지 않는다.

신뢰 지표는 다음 규칙을 따른다.

- `mobile_rag_engine · pub.dev 0.18.6`처럼 현재 저장소에서 근거를 확인할 수 있는 값은 사용 가능하다.
- 총경력, Web/Mobile 경력, MAU, 다운로드, 성능 수치는 사용자가 최신성과 기여 범위를 확인한 뒤에만 공개한다.
- 확인되지 않은 지표는 빈 카드나 임시 숫자로 렌더링하지 않는다.

### 4.3 대표 기술 사례

순서는 다음으로 변경한다.

1. `mobile_rag_engine`: 검색 엔진과 공개 패키지 기반
2. `Easy Contract Viewer`: 검색 기반 기술의 실제 Flutter 제품 적용
3. `Swifty-law`: 서버 검색, citation, 평가와 운영 범위 확장

이 순서는 `기반 엔진 → 제품 적용 → 백엔드 확장`이라는 하나의 기술 서사를 만든다.

대표 카드의 정보 순서는 다음으로 통일한다.

1. 프로젝트 유형과 공개 상태
2. 프로젝트명과 한 문장 정의
3. 역할, 기간, 팀 규모
4. 해결한 문제 최대 2개
5. 검증 근거 1개
6. 핵심 기술 최대 3개
7. `사례 자세히`와 사용 가능한 직접 증거 링크

카드 전체를 하나의 거대한 `<button>`으로 만들지 않는다. `<article>` 안에 독립적인 제목, 요약, 상세 열기 버튼, 외부 링크를 배치한다.

반응형 열 수는 다음으로 고정한다.

- 모바일: 1열
- 768px 이상: 2열
- 1024px 이상: 3열

### 4.4 핵심 역량

현재의 외주 `Project types`를 개발자 역량으로 바꾼다.

- Flutter 제품화와 릴리스
- 온디바이스 Retrieval/RAG
- Rust FFI와 네이티브 검색 경로
- 검색/LLM 백엔드와 평가·운영

이 영역은 대표 사례 뒤에 배치한다. 기술 태그를 반복하는 영역이 아니라, 각 역량이 대표 사례의 어느 결정과 연결되는지 한 문장으로 설명한다.

### 4.5 경력과 역할 타임라인

경력 항목은 최신순이며 프로젝트 갤러리와 분리한다.

각 항목은 다음 필드를 가진다.

- 회사 또는 팀
- 직책
- 고용 형태
- 시작일과 종료일
- 담당 범위 한 문장
- 검증 가능한 결과 최대 2개
- 관련 대표 사례

경력 데이터가 검증되기 전에는 임시 회사명, 날짜, 역할을 렌더링하지 않는다. 구현은 데이터 모델과 컴포넌트까지 진행할 수 있지만, 공개 릴리스 승인에는 최소 1개의 검증된 경력 항목이 필요하다.

### 4.6 추가 프로젝트

대표 3개 외의 프로젝트는 경력의 깊이를 보조하는 아카이브로 취급한다.

- 데스크톱 2~3열, 모바일 1열
- 제목, 유형, 담당 범위, 핵심 기술 최대 2개
- 설명을 대표 카드보다 짧게 유지
- 모든 프로젝트에 동일한 수준의 장문 사례 상세를 강제하지 않음

현재 client 전용 5열 리스트는 제거한다. 태블릿에서 최소 열 너비가 viewport를 넘어가던 구조를 재사용하지 않는다.

### 4.7 보완 오픈소스

`mobile_rag_engine`은 대표 사례와 오픈소스 섹션에서 중복 설명하지 않는다. 대표 사례 안에서 GitHub와 pub.dev 근거까지 통합한다.

오픈소스 섹션에는 `rag_engine_flutter`처럼 대표 사례를 보완하는 자산만 간결하게 둔다. 벤치마크 조건이 함께 제공되지 않는 `10–100×` 같은 수치는 채용용 신뢰 지표로 사용하지 않는다.

### 4.8 채용 CTA와 Footer

페이지 마지막에 다음 액션을 다시 제공한다.

- 이력서 보기
- 채용 관련 이메일
- GitHub

이력서가 없으면 이력서 버튼을 숨기고 이메일과 GitHub만 노출한다. Footer의 연도는 `new Date().getFullYear()`로 계산한 현재 연도를 사용한다. Footer는 `<main>` 밖에 배치해 `contentinfo` landmark가 되게 한다.

## 5. 사례 상세 설계

초기 구현은 기존 모달과 프레젠테이션을 유지한다. 대표 사례의 직접 URL은 초기 전환 이후 별도 작업으로 분리하며, 첫 구현에서 새 route를 만들지 않는다.

상세 정보 순서는 다음으로 변경한다.

1. 요약 헤더: 유형, 공개 상태, 제목, 한 문장 결과
2. 역할, 기간, 팀 규모
3. GitHub, pub.dev, Live, Docs
4. 문제와 제약
5. 직접 설계·구현한 범위와 책임 경계
6. 구조와 데이터 흐름
7. 핵심 기술 결정 2~4개
8. 테스트, 평가, 운영 검증
9. 결과와 영향
10. Trade-off와 비목표
11. 스크린샷, 아키텍처, 관련 문서

외부 링크는 패널 하단에만 두지 않고 요약 헤더에서도 접근 가능하게 한다.

모바일에서는 DOM, 시각, 키보드 순서를 `프로젝트 정보 → 미리보기`로 통일한다. CSS `order`로 순서를 역전하지 않는다.

## 6. 데이터 설계

기존 `Project`는 화면, 이미지, 기술 스택과 같은 프로젝트 자산을 표현한다. 채용용 설명은 별도 모델로 분리한다.

```ts
interface EvidenceLink {
  label: string;
  url: string;
  kind: 'github' | 'pubdev' | 'live' | 'docs' | 'article';
}

interface RecruitmentCase {
  projectId: string;
  publicStatus: string;
  role: string;
  period: string;
  team?: string;
  problem: string;
  contributions: string[];
  outcomes: string[];
  evidenceLinks: EvidenceLink[];
}

interface ExperienceItem {
  company: string;
  role: string;
  employmentType: string;
  period: string;
  summary: string;
  highlights: string[];
  relatedProjectIds: string[];
}

interface RecruitmentProfile {
  name: string;
  role: string;
  positioning: string;
  email: string;
  githubUrl: string;
  resumeUrl?: string;
  proofItems: Array<{
    label: string;
    value: string;
    evidence?: string;
  }>;
}
```

데이터 파일은 다음 책임으로 분리한다.

- `src/data/portfolio.ts`: 섹션 순서, Hero, 핵심 역량, 프로젝트 ID
- `src/data/recruitment.ts`: 채용 프로필, 대표 사례 설명, 경력 타임라인
- `src/data/projects.ts`: 화면, 이미지, 기술 스택, 일반 프로젝트 자산

`audienceOverrides.developer`의 값은 audience 제거 전에 단일 card presentation으로 materialize한다. 이후 대표 3개의 채용 서술은 `RecruitmentCase`가 우선한다.

## 7. 한국어 단일화 설계

### 7.1 App shell

- `<html lang="ko">`를 server-rendered markup에 직접 기록한다.
- metadata title은 `오병희 | Flutter · 온디바이스 RAG 개발자`를 기본값으로 한다.
- metadata description은 실제 포지셔닝과 대표 근거를 한 문장으로 설명한다.
- 한국어 skip link `본문으로 건너뛰기`와 focusable `#main-content`를 유지한다.
- `LanguageSwitcher`와 client-side `document.documentElement.lang` 변경을 제거한다.

### 7.2 글꼴

- 한국어 본문은 `Noto Sans KR`의 제한된 weight를 사용한다.
- 한국어 display heading은 `Noto Serif KR`을 사용해 현재의 편집형 대비를 유지한다.
- Latin 이름과 프로젝트명에는 기존 Fraunces를 선택적으로 유지한다.
- 기술 라벨에는 Geist Mono를 유지한다.

폰트 추가 후 실제 번들 크기와 레이아웃 이동을 build 및 브라우저에서 확인한다.

### 7.3 데이터 평탄화

- `LocaleText`와 `LocalizedString`을 일반 문자열로 바꾼다.
- 프로젝트 title, subtitle, description, implementation point, release label, screen title/description에서 `ko` 값을 정본으로 선택한다.
- 한국어 SVG 경로를 직접 사용한다.
- 영어 제목 문자열로 화면을 탐색하는 로직은 stable screen ID로 교체한다.
- `useLocale`, `t()`, `localize()` 사용처가 0개인 것을 확인한 뒤 i18n 파일을 삭제한다.

영어 SVG 원본 자산은 첫 전환에서 삭제하지 않는다. 참조가 0개인 것을 확인한 뒤 별도 asset cleanup 변경으로 처리한다.

## 8. 컴포넌트 구조

최종 컴포넌트 책임은 다음과 같다.

- `DeveloperHero`: 포지셔닝, 신뢰 지표, CTA
- `FeaturedCases`: 대표 사례 순서와 카드 grid
- `RecruitmentCaseCard`: 채용용 요약과 독립 액션
- `CoreCapabilities`: 사례와 연결된 핵심 역량
- `ExperienceTimeline`: 검증된 경력 항목
- `AdditionalProjects`: 간결한 프로젝트 아카이브
- `OpenSourceSupport`: 중복 없는 보완 오픈소스
- `RecruitmentCTA`: 이력서, 이메일, GitHub
- `SectionContainer`: max-width와 responsive gutter
- `SectionHeader`: eyebrow, heading, description, count의 공통 리듬

`ProfileHeader`, `SocialButton`, `GeometricPattern`은 활성 import가 없고 새 Hero에서도 사용하지 않는 것이 확인되면 제거한다.

페이지 shell은 `main + footer`를 함께 감싸는 inertable container를 가진다. 프로젝트 dialog가 열리면 main과 footer가 모두 키보드 및 accessibility tree에서 비활성화되어야 한다.

주요 수정 대상은 다음과 같다.

- App shell: `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/ClientWrapper.tsx`, `src/components/LanguageSwitcher.tsx`
- Audience/data: `src/data/conversion.ts`, `src/data/projects.ts`, `src/types/project.ts`
- Page composition: `src/components/Portfolio.tsx`
- Primary UI: `src/components/widgets/ConversionHero.tsx`, `FeaturedWork.tsx`, `ProjectCard.tsx`, `ProjectGrid.tsx`, `OpenSourceBanner.tsx`, `Footer.tsx`
- Detail UI: `ProjectModal.tsx`, `DeviceFrame.tsx`, `PresentationOverlay.tsx`, `ScreenImage.tsx`, `useFocusTrap.ts`
- Locale runtime: `src/i18n/*`
- Verification: `test/conversion-structure.test.mjs`, `package.json`, 신규 Playwright/axe 설정과 E2E 파일

## 9. 접근성 요구사항

기존 skip link, dialog 이름, focus trap, Escape 동작, focus restoration을 유지한다.

전환 과정에서 다음을 함께 수정한다.

- 모든 action과 ARIA label을 한국어로 변경
- project card의 제목을 button 밖의 실제 heading으로 노출
- card detail button에 `aria-haspopup="dialog"` 제공
- modal subsection heading level 정리
- presentation slide 변경을 짧은 `aria-live="polite"` 상태로 알림
- scrollable screenshot에 `tabIndex={0}`, `role="region"`, 한국어 label 제공
- user-scrollable 영역의 scrollbar를 숨기지 않음
- focus indicator 대비 3:1 이상
- 정상 본문 텍스트 대비 4.5:1 이상
- icon control 최소 44×44px
- `prefers-reduced-motion`에서 fade, pulse, spin, bounce, translate animation 제거

모바일 visual order와 keyboard order가 일치해야 한다.

## 10. 반응형 요구사항

검증 viewport는 다음으로 고정한다.

- 360×740
- 390×844
- 768×1024
- 1024×600
- 1440×900
- 320 CSS px reflow proxy

모든 viewport에서 다음을 만족해야 한다.

- `document.documentElement.scrollWidth === document.documentElement.clientWidth`
- Hero, CTA, 카드 제목과 증거 링크가 잘리지 않음
- Featured와 Additional grid가 지정된 1→2→3 열 규칙을 따름
- modal close, 정보, preview, navigation, caption이 도달 가능함
- 200%와 400% zoom에서 콘텐츠와 control이 사라지지 않음

## 11. 콘텐츠 입력 게이트

구조 구현과 별개로 공개 릴리스 전에는 다음 사실을 사용자가 확인해야 한다.

- 지원하려는 정확한 직무명과 희망 seniority
- 최신 총경력과 Web/Mobile 경력 계산
- 회사, 팀, 직책, 재직기간, 고용 형태
- 대표 사례별 기간, 역할, 팀 규모, 협업 경계
- MAU 1만+ 서비스명과 본인 기여 범위
- 공개 가능한 성능, 품질, 사용자, 배포 안정성 결과
- Easy Contract Viewer의 공개/배포 상태
- Swifty-law의 공개 허용 범위
- 최신 패키지 버전과 공개 가능한 사용 지표
- 이력서 파일 또는 URL
- 근무 위치, 원격 가능 여부, 구직 상태
- GitHub, 블로그, 이메일의 현재 사용 여부

확인되지 않은 필드는 숨긴다. 임시 수치, 가짜 회사명, 익명 placeholder, 추정 결과를 배포하지 않는다.

## 12. 마이그레이션 단위

### 단계 0: 목표 계약과 테스트

- 기존 conversion 구조 테스트를 한국어 개발자 포트폴리오 구조 테스트로 교체한다.
- Korean server language, 고정 섹션 순서, audience/locale 제거, 대표 사례 순서, 접근성 계약을 먼저 실패하는 테스트로 고정한다.

### 단계 1: audience 축 제거

- developer 데이터를 단일 정본으로 materialize한다.
- page query parsing, `Audience`, `parseAudience`, `audienceContent`, switcher, client layout을 제거한다.
- developer card presentation과 thumbnail 선택이 유지되는지 확인한다.
- `rg`에서 audience 관련 활성 사용처가 0개가 된 후 타입과 기존 data file을 삭제한다.

### 단계 2: 한국어 데이터 평탄화

- 프로젝트와 UI 데이터를 `ko` 문자열로 변환한다.
- server metadata와 lang을 한국어로 변경한다.
- 모든 component에서 locale hook과 helper를 제거한다.
- locale 사용처가 0개가 된 후 switcher, provider, translation runtime을 삭제한다.

### 단계 3: 채용 데이터와 정보구조

- `RecruitmentProfile`, `RecruitmentCase`, `ExperienceItem`을 추가한다.
- Hero, 대표 사례, 역량, 경력, 추가 프로젝트, 오픈소스, CTA 순서로 Portfolio를 재구성한다.
- 대표 사례 순서를 engine → product → backend로 변경한다.

### 단계 4: 반응형과 상세 경험

- Hero 2열/1열, card 1→2→3 grid, 공통 section primitive를 적용한다.
- modal 정보 순서와 증거 링크 위치를 개선한다.
- 태블릿 horizontal overflow를 제거한다.

### 단계 5: 접근성과 검증 자동화

- 한국어 ARIA, card semantic, modal focus order, screenshot keyboard scrolling, reduced motion을 적용한다.
- Playwright와 axe 기반 E2E gate를 추가한다.
- `@playwright/test`와 `@axe-core/playwright`를 개발 의존성으로 추가한다.
- `npm run test`는 구조/데이터 계약 테스트를, `npm run test:a11y`는 home/modal/presentation E2E 접근성 테스트를 실행하게 한다.
- 수동 keyboard와 zoom 검증 기록을 남긴다.

한 단계에서 다음 단계의 dead code를 선제적으로 삭제하지 않는다. 각 단계는 독립적으로 review와 rollback이 가능해야 한다.

## 13. 테스트와 완료 기준

자동화 gate는 다음을 포함한다.

1. `/`의 초기 HTML이 `lang="ko"`를 포함한다.
2. audience query, audience switcher, language switcher가 없다.
3. 첫 Tab이 `본문으로 건너뛰기`를 노출하고 main으로 이동한다.
4. 대표 사례 순서가 `mobile_rag_engine → Easy Contract Viewer → Swifty-law`다.
5. card Enter가 이름 있는 dialog를 열고 Close에 focus한다.
6. Tab/Shift+Tab focus trap과 Escape focus restoration이 동작한다.
7. presentation slide 변경이 한국어 live status로 전달된다.
8. screenshot scroll region이 keyboard로 스크롤된다.
9. reduced motion에서 지속 animation이 없다.
10. home, modal, presentation 상태의 axe critical/serious finding이 0개다.
11. 지정 viewport에서 horizontal page overflow가 없다.
12. 확인되지 않은 metric과 빈 resume CTA가 렌더링되지 않는다.

최종 명령 gate는 다음과 같다.

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run test
npm run test:a11y
npm run build
```

수동 release gate는 Safari keyboard-only, 200%/400% zoom, mobile/tablet/desktop 화면 검증이다.

## 14. 오류와 빈 상태

- 이미지 로딩 실패는 한국어 `role="status"` 메시지로 알리고 프로젝트 텍스트와 링크는 계속 제공한다.
- `resumeUrl`이 없으면 이력서 CTA를 렌더링하지 않는다.
- 증거 링크가 없는 프로젝트에는 링크 placeholder를 만들지 않는다.
- 경력 데이터가 없으면 빈 타임라인을 렌더링하지 않으며 공개 릴리스 gate를 충족하지 못한 것으로 처리한다.
- modal 또는 presentation에서 이미지가 없어도 close, 제목, 설명, 외부 링크는 접근 가능해야 한다.

## 15. 비목표

- 팔레트, 로고, 아이콘, 전체 브랜드 재설계
- 연락 폼, CMS, 로그인, 관리자, analytics 추가
- 새로운 프로젝트나 검증되지 않은 경력·성과 생성
- 첫 전환에서 대표 사례 전용 route 추가
- 모든 기술 용어와 제품명 강제 번역
- 기존 modal, presentation, focus trap, 이미지 자산 제거
- 공개 검증 없이 패키지 버전, 링크, 벤치마크 수치 변경
- 영어 SVG 원본의 동시 삭제

## 16. 성공 정의

전환은 다음 조건을 모두 만족할 때 성공이다.

- 사이트가 한국어 개발자 채용 포트폴리오라는 사실이 첫 화면에서 명확하다.
- 프리랜서, client list, 영어 locale 전환 흔적이 사용자 경험과 활성 source에서 제거된다.
- 주 포지셔닝과 대표 사례가 실제 저장소 경계를 넘지 않는다.
- 채용 담당자가 역할, 근거, 경력, 연락 경로를 하나의 직선형 흐름으로 확인할 수 있다.
- 모바일, 태블릿, 데스크톱에서 horizontal overflow와 정보 손실이 없다.
- dialog, presentation, screenshot 탐색을 keyboard로 사용할 수 있다.
- 미확인 데이터는 숨겨지고 검증된 사실만 공개된다.
