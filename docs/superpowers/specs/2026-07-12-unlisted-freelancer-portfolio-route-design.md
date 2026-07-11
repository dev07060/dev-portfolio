# 전달용 프리랜서 포트폴리오 라우트 설계

## 목표

현재 공개 루트 `/`의 채용·일반 개발자 포트폴리오를 그대로 유지하면서, 프리랜서 프로젝트 제안 시 링크로만 전달할 `/freelancer` 페이지를 추가한다. 두 페이지는 같은 경력·프로젝트 사실과 UI 컴포넌트를 공유하되, 방문 목적에 따라 소개 문구, 대표 사례 순서, 의뢰 가능 범위, CTA와 이력서를 분리한다.

## 사용자와 노출 경계

- `/`는 현재처럼 공개 채용·일반 포트폴리오로 유지한다.
- `/freelancer`는 직접 URL을 받은 사람만 방문하는 unlisted 페이지로 운영한다.
- 공개 `/`의 내비게이션, Hero, 본문, Footer, 이력서에는 `/freelancer` 링크를 추가하지 않는다.
- `/freelancer`에는 `/`로 돌아가는 링크를 두지 않고 전달받은 목적에 집중하는 독립 페이지로 제공한다.
- `/freelancer`는 검색엔진에 `noindex, nofollow`로 선언하고 sitemap에 포함하지 않는다.
- 이 설계는 인증이나 비밀번호 보호를 제공하지 않는다. URL을 아는 사람은 접근하고 재공유할 수 있다.

## 비목표

- 로그인, 비밀번호, 일회성 토큰 또는 만료 링크를 추가하지 않는다.
- 쿼리 문자열이나 브라우저 상태로 audience를 판별하지 않는다.
- `/`의 기존 채용용 정보 구조와 공개 이력서를 프리랜서 전용으로 덮어쓰지 않는다.
- 프로젝트 원본 데이터와 이미지 자산을 두 벌로 복제하지 않는다.
- 프리랜서 페이지를 별도 애플리케이션이나 서브도메인으로 분리하지 않는다.

## 라우트와 렌더링

### `/`

- `src/app/page.tsx`에서 채용·일반 포트폴리오 설정을 전달한다.
- 기존 제목, 설명, 경력, 대표 기술 사례, 공개 이력서와 채용·협업 CTA를 유지한다.
- `/freelancer`로 향하는 링크를 렌더링하지 않는다.

### `/freelancer`

- `src/app/freelancer/page.tsx`를 추가한다.
- App Router의 정적 페이지로 생성하며 요청별 데이터나 미들웨어를 사용하지 않는다.
- 프리랜서 전용 metadata를 선언하고 `robots.index=false`, `robots.follow=false`를 설정한다.
- 공유 프로젝트·경력 데이터와 프리랜서 전용 문구 설정을 `Portfolio`에 전달한다.

## 컴포넌트 경계

현재 `Portfolio`는 클라이언트 컴포넌트 내부에서 채용용 데이터를 직접 import한다. 이를 route page가 선택한 직렬화 가능한 설정을 props로 전달하는 구조로 바꾼다.

```ts
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

- `Portfolio`의 모달, 프레젠테이션, 포커스 관리, 이미지 프리로드 로직은 공통으로 유지한다.
- `RecruitmentNav`, `DeveloperHero`, `FeaturedWork`, `ExperienceTimeline`, `ProjectArchive`, `RecruitmentCTA`, `ProjectModal`은 설정 props를 받아 두 라우트에서 재사용한다.
- 같은 페이지의 섹션 이동은 기존 앵커를 유지한다.
- 두 라우트 사이를 오가는 `routeLink` 추상화는 두지 않는다.

## 데이터 구조

### 공유 데이터

다음 사실 데이터는 한 곳에서 유지한다.

- 프로젝트 제목, 설명, 기술 스택, 이미지와 외부 링크
- 경력 기간, 회사, 역할, 고용 형태와 검증된 성과
- 대표 사례의 문제, 직접 기여, 검증, 결과, 트레이드오프와 비목표
- 공개 패키지 버전과 공개 근거 링크

기존 `src/data/projects.ts`와 `src/data/recruitment.ts`를 공유 사실의 기준으로 유지한다.

### 채용용 설정

`src/data/portfolio.ts`는 현재 `/`의 채용·일반 설정을 담당한다.

- 역할: `크로스플랫폼 개발자 · 로컬 RAG 엔지니어`
- CTA: 채용·장기 협업 문의
- 경력 전체를 최신순으로 노출
- 공개 이력서 `/oh-byeonghee-resume-ko.pdf` 사용

### 프리랜서용 설정

`src/data/freelancer.ts`를 추가한다.

- 역할: 모바일 제품·문서 검색/RAG 프로젝트 수행 개발자
- 의뢰 가능 범위:
  - 모바일 앱 구축·고도화
  - BLE·FCM·WebView·MethodChannel 연동
  - PDF·문서 온디바이스 검색/RAG
  - FastAPI 검색 백엔드·검색 품질 평가
- 대표 사례 ID는 의뢰 관점에서 `easy-contract-viewer → local-mobile-rag-gemma → law-info-engine` 순으로 구성한다. Flutter 운영 안정화 경험은 대표 사례를 새로 만들지 않고 경력 섹션에서 ㈜피에트 항목을 우선해 보여준다.
- CTA는 `프로젝트 상담`으로 표시하고 이메일 제목에 프로젝트 문의임을 명시한다.
- 착수 가능일, 상주·원격 가능 범위와 계약 형태는 사용자 확인을 거친 값만 표시한다.
- 프리랜서 프로젝트 수행형 PDF가 확정되기 전에는 공개 이력서 링크를 재사용하거나 이력서 CTA를 숨긴다. 확인되지 않은 별도 PDF 경로를 만들지 않는다.

## 프리랜서 페이지 정보 구조

1. 페이지 내 탐색
2. 프리랜서 Hero
   - 역할과 해결 가능한 문제
   - 의뢰 가능 범위 4개
   - 공개 패키지와 총경력 근거
   - 프로젝트 상담 CTA
3. 대표 수행 사례
   - 기간, 역할, 팀 구성, 직접 기여와 결과
   - 공개 근거와 비공개 수행 사례 구분
4. 관련 경력
   - 외주·상주·원격·회사 운영 경험을 의뢰 적합도 순으로 요약
5. 추가 프로젝트
6. 프로젝트 상담 CTA
7. Footer

기존 프로젝트 상세 모달과 시각 자료는 그대로 공유한다. 프리랜서 페이지를 위해 유사한 모달을 새로 만들지 않는다.

## 검색 노출과 메타데이터

`src/app/freelancer/page.tsx`는 다음 정책을 갖는다.

```ts
export const metadata: Metadata = {
  title: '오병희 | 프리랜서 프로젝트 포트폴리오',
  description: '모바일 제품화와 문서·PDF 검색/RAG 프로젝트 수행 경험을 정리한 전달용 포트폴리오입니다.',
  robots: {
    index: false,
    follow: false,
  },
};
```

- sitemap 파일이 현재 없으면 이번 작업에서 새 sitemap을 만들지 않는다.
- 이후 sitemap을 추가할 때도 `/freelancer`를 포함하지 않는 계약을 구조 테스트로 남긴다.
- 공개 `/`의 metadata는 현재 채용·일반 포지셔닝을 유지한다.

## 개인정보와 링크 공유

- `/freelancer`는 공개 웹 서버에서 접근 가능한 페이지이므로 전화번호, 주소, 생년월일, 연봉, 희망근무조건을 포함하지 않는다.
- 연락은 공개 이메일 링크로만 제공한다.
- 클라이언트명이나 수행 결과는 기존 포트폴리오에서 공개가 승인된 범위만 재사용한다.
- 비공개 프로젝트를 설명할 때 공개 근거가 있는 것처럼 표시하지 않는다.

## 오류와 예외 처리

- 설정에 존재하는 프로젝트 ID가 `projects`에서 해석되지 않으면 해당 항목을 렌더링하지 않고 구조 테스트에서 실패시킨다.
- 프리랜서 전용 이력서가 없으면 깨진 링크 대신 이력서 CTA를 숨기거나 기존 공개 이력서를 명시적으로 사용한다.
- 착수 가능일이나 근무 범위가 확정되지 않으면 추정 문구를 표시하지 않는다.
- `/freelancer`가 공개 `/`에서 링크되거나 검색 허용 metadata로 변경되면 테스트가 실패해야 한다.

## 검증 기준

### 구조 테스트

- `/`와 `/freelancer` page 파일이 각각 올바른 설정을 `Portfolio`에 전달한다.
- 공개 `/`의 활성 소스에 `/freelancer` 링크가 없다.
- `/freelancer` metadata에 `index: false`, `follow: false`가 있다.
- 채용용과 프리랜서용 설정이 프로젝트 원본 데이터를 복제하지 않는다.
- 프리랜서 설정의 대표 사례 ID가 모두 실제 프로젝트로 해석된다.
- 두 라우트의 CTA와 역할 문구가 서로 구분된다.

### 브라우저·접근성 테스트

- `/`와 `/freelancer`가 모두 HTTP 200으로 렌더링된다.
- `/freelancer`에 `/` 복귀 링크가 렌더링되지 않는다.
- `/`에는 `/freelancer` 링크가 없다.
- 프로젝트 모달, Escape, 포커스 복원과 프레젠테이션 동작이 두 라우트에서 동일하게 작동한다.
- Chromium과 WebKit에서 critical/serious 접근성 위반이 없다.
- 1440×900, 390×844, 320×800에서 가로 overflow와 잘린 CTA가 없다.
- 프리랜서 페이지의 390px 문서 높이는 8,000px 이하를 유지한다.

### 빌드 검증

```bash
npm run test
npm run lint
npx tsc --noEmit --incremental false
npm run test:a11y
npm run build
```

`next build` 결과에 `/`와 `/freelancer`가 정적 라우트로 포함되어야 한다.

## 구현 순서

1. `PortfolioConfig`와 공유 데이터 경계를 정의한다.
2. 현재 채용 페이지를 설정 props 기반으로 전환하고 기존 동작이 유지되는지 검증한다.
3. 프리랜서 전용 데이터와 `/freelancer` route metadata를 추가한다.
4. 공개 페이지 비노출과 양방향 교차 링크 부재를 구현한다.
5. 프리랜서 CTA와 수행 사례 순서를 반영한다.
6. 구조·접근성·반응형·빌드 검증을 실행한다.

## 완료 조건

- 기존 `/`의 채용·일반 포트폴리오가 기능과 정보 구조 면에서 퇴행하지 않는다.
- `/freelancer`가 직접 URL로 접근 가능하고 검색 비노출 metadata를 갖는다.
- 공개 `/`에서 `/freelancer`로 이동할 수 있는 링크가 없다.
- 두 페이지가 프로젝트와 경력 사실을 공유하면서 문구·순서·CTA만 목적에 맞게 분리된다.
- 개인정보와 근거 없는 경력·성과 표현이 추가되지 않는다.
- 자동 테스트, 타입 검사, 접근성 검사와 프로덕션 빌드가 모두 통과한다.
