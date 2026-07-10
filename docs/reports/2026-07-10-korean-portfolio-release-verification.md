# 한국어 개발자 채용 포트폴리오 릴리스 검증 기록

- 검증일: 2026-07-11
- 브랜치: `feats/korean-developer-recruitment-portfolio`
- 기준 설계: `docs/superpowers/specs/2026-07-10-korean-developer-recruitment-portfolio-design.md`
- 상태: 사용자 제공 이력서 기반 경력 반영 및 자동 검증 완료

## 자동 검증

다음 명령은 현재 브랜치에서 통과해야 한다.

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run test
npm run test:a11y
npm run build
```

`npm run test:a11y`는 Chromium과 WebKit에서 동일한 14개 시나리오를 실행한다.

- 한국어 app shell, skip link, 대표 사례 순서
- dialog focus trap, Escape, trigger focus 복원
- presentation live status와 trigger focus 복원
- 실제 긴 screenshot region의 keyboard scroll
- reduced motion
- home, modal, presentation의 axe critical/serious finding 0개
- home, modal, presentation의 browser console warning/error 0개
- 360×740, 390×844, 768×1024, 1024×600, 1440×900
- 640 CSS px의 200% zoom reflow proxy
- 320 CSS px의 400% zoom reflow proxy
- 각 viewport의 horizontal overflow, Hero CTA, 카드 제목·근거 링크, modal 정보·preview 접근성
- Featured/Additional grid의 1→2→3열 전환

WebKit 검증에서 발견한 presentation focus 복원 순서 차이는 trigger를 명시적으로 저장하고 부모 modal의 `inert` 해제 후 복원하도록 수정했다.

## 의존성 감사

- Next.js와 `eslint-config-next`를 16.0.10에서 16.2.10으로 업데이트했다.
- `npm audit fix`로 자동 수정 가능한 개발 의존성 finding을 정리했다.
- high finding은 0개다.
- Next.js 16.2.10이 내부 고정한 PostCSS 8.4.31에서 moderate 2건이 남는다. 프레임워크 내부 의존성을 강제 override하거나 breaking downgrade하지 않고 upstream 패치를 추적한다.

## 브라우저 시각 확인

Chromium 프로덕션 화면에서 다음 상태를 데스크톱, 태블릿, 모바일로 확인했다.

- Hero와 대표 사례
- 프로젝트 상세의 정보 우선 DOM/시각 순서
- presentation과 긴 법령 검색 결과 화면의 내부 scroll
- 390px modal과 768px 2열 grid
- 1440px 경력 6건의 최신순 timeline과 390px 첫 경력 카드 reflow
- 경력의 관련 프로젝트 링크가 대응하는 대표·추가 프로젝트 카드로 이동
- 브라우저 console error와 warning 0개

초기 검토 캡처는 `/tmp/dev-portfolio-korean-recruitment-audit-2026-07-10/`, 경력 검토 캡처는 `output/playwright/resume-timeline/`에 생성했으며 저장소에는 포함하지 않는다.

## 수동 release gate

다음 항목은 자동화 결과로 대체하지 않는다.

- Safari keyboard-only 탐색 확인. 기본 설정에서는 link 탐색에 `Option+Tab`을 사용한다.
- 실제 Safari 200%와 400% page zoom에서 콘텐츠와 control 도달 가능성 확인

## 공개 릴리스 콘텐츠 gate

사용자가 제공한 2026-06-30 수정 이력서를 기준으로 최신순 경력 6건과 총 경력 5년 5개월을 반영했다. 각 항목은 회사, 역할, 고용 형태, 기간, 담당 범위, 결과 최대 2개, 확인 가능한 관련 프로젝트만 포함한다.

원본 이력서에는 휴대폰, 거주지, 연봉 정보가 있으므로 public asset으로 복사하지 않는다. `resumeUrl`은 계속 비워 두고 이력서 CTA를 숨긴다.
