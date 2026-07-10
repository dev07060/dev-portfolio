# 한국어 개발자 채용 포트폴리오 릴리스 검증 기록

- 검증일: 2026-07-11
- 브랜치: `main` (로컬 전용, push하지 않음)
- 기준 설계: `docs/superpowers/specs/2026-07-11-hiring-scan-portfolio-refinement-design.md`
- 구현 계획: `docs/superpowers/plans/2026-07-11-hiring-scan-portfolio-refinement.md`
- 상태: 채용 스캔형 레이아웃, 공개용 이력서, 반응형·브라우저 검증 완료

## 확정된 정보 구조

페이지 순서는 다음과 같다.

1. `DEV PORTFOLIO` 앱바와 기술 사례·경력·연락 탐색
2. 한국어 Hero, 프로젝트 근거가 붙은 핵심 역량 4개, 채용 CTA
3. 엔진 → Flutter 제품 적용 → 검색 백엔드로 이어지는 대표 사례 3개
4. 최신순 경력 6개와 native disclosure 상세
5. 썸네일을 제거한 추가 프로젝트 archive 5개
6. 이력서·이메일·GitHub 연락 CTA

대표 사례는 공개 근거 유무를 구분하고 `mobile_rag_engine` 안에 보완 패키지 `rag_engine_flutter`를 통합했다. 모바일 프로젝트 상세은 제목 → 시각 근거 → 문제와 제약 순으로 제공한다.

## 자동 검증

최종 상태에서 다음 명령을 실행한다.

```bash
npm run test
npm run lint
npx tsc --noEmit --incremental false
npm run test:a11y
npm run build
```

결과:

- Node 구조·콘텐츠 테스트: 27/27 통과
- ESLint: 통과
- TypeScript: 통과
- Playwright: Chromium·WebKit 합계 42/42 통과
- Next.js 프로덕션 빌드: 통과, `/` 정적 생성

Playwright는 다음 계약을 포함한다.

- Hero와 연락 섹션의 동일 공개 이력서 링크 2개, 앱바 이력서 링크 0개
- 320px 앱바 링크 4개의 44px 터치 영역과 모든 하위 요소 overflow 0
- 390px 전체 문서 높이 8,000px 이하
- 경력 disclosure와 추가 프로젝트 archive 상세 연결
- 모바일 모달의 제목 → eager 시각 근거 → 문제 순서와 320px 긴 기술 제목 무손실
- Chromium·WebKit dialog focus trap, Escape, trigger focus 복원
- presentation 상태와 focus 복원, screenshot region keyboard scroll
- reduced motion, axe critical/serious finding 0개
- home·modal·presentation console warning/error 0개
- `/#featured-work` 직접 진입 시 LCP 이미지 우선순위 경고 0개
- 360×740, 390×844, 640×900, 768×1024, 1024×600, 1440×900, 320×800 reflow

WebKit은 일반 `Tab`에서 링크를 건너뛸 수 있다. focus trap은 브라우저의 실제 탭 정책을 유지하되 기본 이동 뒤 dialog 밖으로 포커스가 이탈하면 처음 또는 마지막 내부 요소로 복원하도록 검증했다.

## 반응형 실측

측정 원본은 `output/hiring-scan-verification-2026-07-11/measurements.json`에 저장했다. Chromium에서 `document.fonts.ready` 이후 측정했다.

| 뷰포트 | 문서 높이 | 문서 overflow | 앱바 overflow | overflow 하위 요소 | 앱바 링크 높이 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1440×900 | 4,163px | 0 | 0 | 0 | 모두 44px |
| 390×844 | 6,723px | 0 | 0 | 0 | 모두 44px |
| 320×800 | 7,595px | 0 | 0 | 0 | 모두 44px |

390px 문서는 목표 상한 8,000px보다 1,277px 짧다. 320px 앱바의 마지막 `연락` 링크 오른쪽 좌표는 300px로 뷰포트 안에 남는다.

## 시각 검증

`output/hiring-scan-verification-2026-07-11/`에 18개 PNG를 저장했다.

- 1440×900: Hero, 대표 사례, 경력, archive, 연락 CTA, modal
- 390×844: Hero, 대표 사례, 경력, archive, 연락 CTA, modal
- 320×800: Hero, 대표 사례, 경력, archive, 연락 CTA, modal

각 이미지를 직접 확인해 텍스트 잘림, 컨트롤 겹침, 빈 이미지, 가로 유실이 없음을 확인했다. 320px 긴 `mobile_rag_engine` 제목은 닫기 버튼 공간을 보존하면서 한 줄로 표시되고, 모바일 modal은 시각 근거를 상세 설명보다 먼저 제공한다.

## 공개용 이력서 gate

`public/oh-byeonghee-resume-ko.pdf`는 A4 2페이지이며 다음 공개 정보만 포함한다.

- 이름, 공개 이메일, GitHub
- 역할·기술 포지셔닝과 핵심 기술
- 사이트에 공개한 최신순 경력 6개
- 대표 기술 사례 3개와 공개 근거 링크

Hero와 연락 CTA의 `이력서 보기`가 같은 PDF를 새 탭으로 연다. 앱바에는 이력서 링크를 넣지 않았다. PDF는 한글 폰트를 포함하고 텍스트 추출이 가능하며, 생성 스크립트를 연속 실행해도 동일한 SHA-256을 만든다.

- SHA-256: `a7ab2f3bb5e8ea4739968a7f5399f5d043f54d22fb5c2c3df7d2ccea8d04ce2c`

검증에서는 국내 휴대전화 형식과 주소·거주지·생년월일·학력·보상·희망조건·병역·보훈·장애 레이블을 일반 패턴으로 차단했다. 테스트나 생성 소스에도 원본의 실제 개인정보 값을 복사하지 않았다.

## 콘텐츠·개인정보 검색 gate

다음 항목을 현재 활성 소스와 추출한 공개 PDF에서 확인한다.

- 제거된 `CoreCapabilities`, `OpenSourceBanner`, `ProjectGrid` 렌더링·export 없음
- `Byeonghee Oh`, `Engineering capabilities`, `Experience`, `Project archive`, `Open source support`, `Contact`, `Trade-off` 활성 문구 없음
- 공개 데이터와 PDF에 전화번호 형식, 주소·보상·희망조건 등 비공개 레이블 없음
- PDF에 이름, 공개 이메일, GitHub, 대표 경력, `mobile_rag_engine` 존재

## localhost gate

- `http://localhost:3000/`: HTTP 200
- `http://localhost:3000/oh-byeonghee-resume-ko.pdf`: HTTP 200, `application/pdf`
- 최종 `main`에서 개발 서버를 유지한다.

## 범위 밖 항목

- 사용자 요청에 따라 별도 보조기기 수동 검증은 범위에 포함하지 않는다.
- 외부 GitHub·pub.dev·운영 서비스의 지속 가용성은 이번 로컬 릴리스 gate에 포함하지 않는다.
- Lighthouse 점수 자체는 gate가 아니다. 대신 LCP 이미지 경고, 가로 overflow, 문서 길이, console warning/error를 자동 검증한다.
