# 포트폴리오 디자인 QA

## 비교 대상

- 기준 소스: `/Users/dev_bh/Desktop/works/portfolio/dev-portfolio/output/portfolio-design-audit-2026-09-04/assets/01-desktop-top.jpg`부터 `10-mobile-contact.jpg`까지의 감사 기준 캡처
- 최종 구현: `http://localhost:3000/`
- 구현 캡처: `/Users/dev_bh/Desktop/works/portfolio/dev-portfolio/output/playwright/portfolio-design-qa-2026-09-04/`
- 비교 보드: `/Users/dev_bh/Desktop/works/portfolio/dev-portfolio/output/playwright/portfolio-design-qa-2026-09-04/comparison-final.html`
- 구현 상태: 체크포인트 커밋 `7fae1a3`, `b6fd90b`, `fb78969`과 최종 모바일 카드 메타데이터 수정 반영 상태

## 뷰포트·밀도·상태

- 데스크톱 상단·대표 사례·경력·연락: 기준과 구현 모두 1425 × 891 CSS px, device scale factor 1
- 데스크톱 프로젝트 상세: 기준과 구현 모두 1440 × 900 CSS px, device scale factor 1
- 모바일 상단·대표 사례·경력·연락: 기준과 구현 모두 375 × 812 CSS px, device scale factor 1
- 모바일 프로젝트 상세: 기준과 구현 모두 390 × 844 CSS px, device scale factor 1
- 추가 반응형 검증: 320, 360, 390, 640, 768, 1024, 1440px
- 비교 전 정규화: 불필요. 각 소스·구현 쌍을 동일 CSS 뷰포트와 동일 밀도로 캡처했다.
- 화면 상태: 상단과 대표 사례는 초기 상태, 상세는 첫 프로젝트 모달을 연 상태, 경력은 첫 경력 항목을 펼친 상태, 연락은 페이지 하단 상태로 맞췄다.

## 동시 비교 증거

- 데스크톱: `compare-desktop-top.jpg`, `compare-desktop-featured.jpg`, `compare-desktop-modal.jpg`, `compare-desktop-experience.jpg`, `compare-desktop-contact.jpg`
- 모바일: `compare-mobile-top.jpg`, `compare-mobile-featured.jpg`, `compare-mobile-modal.jpg`, `compare-mobile-experience.jpg`, `compare-mobile-contact.jpg`
- 위 파일은 모두 `/Users/dev_bh/Desktop/works/portfolio/dev-portfolio/output/playwright/portfolio-design-qa-2026-09-04/` 아래에 있으며, 각 이미지 안에서 수정 전 기준과 최종 구현을 같은 크기로 나란히 비교한다.
- 전체 화면에서 글자, 카드 경계, 이미지, CTA가 판독 가능해 별도 crop 없이 전체·집중 비교 증거를 함께 충족한다.

## 필수 충실도 점검

- 글꼴·타이포그래피: Noto Sans/Serif KR과 Geist Mono 위계를 유지했다. 사용하지 않던 Fraunces 로드를 제거하고 정보성 라벨을 10–11px로 높였다. 히어로 근거명은 말줄임 없이 제목 아래에 배치했다.
- 간격·레이아웃 리듬: 대표 카드는 데스크톱 3열, 태블릿 이하 1열로 동작한다. 본문은 문제와 직접 기여·공개 결과 중심으로 줄여 카드 밀도를 맞췄다. 320px 내비게이션을 포함해 겹침과 가로 넘침이 없다.
- 색상·시각 토큰: 크림·먹색·청록·주황 팔레트와 대비를 유지했다. 연락 영역은 이메일을 1순위, 이력서를 2순위, GitHub를 3순위로 구분했다.
- 이미지 품질·자산 충실도: 실제 제품 캡처와 아키텍처 SVG를 유지했다. 가로형 아키텍처에는 원본 이미지 열기 경로를 제공했다.
- 문구·콘텐츠: 역할·기간·팀 값은 검증 자료 없이 추정하지 않았다. 공개 근거와 검증 기준·방법을 분리하고 Swifty-law를 백엔드 API로 분류했다.
- 상호작용·접근성: 상세 설명 영역은 이름 있는 키보드 스크롤 영역이며 Page Down, 모달 포커스 트랩, CTA 도달성, 콘솔 오류, LCP, axe critical/serious 위반을 Chromium과 WebKit에서 검증했다.

## Findings

- 남아 있는 P0/P1/P2 시각·상호작용 문제 없음.
- 최종 모바일 대표 사례 비교에서 카드 인덱스와 유형 배지가 썸네일 뒤로 가려지는 P2를 발견했다. 두 메타데이터를 썸네일보다 높은 레이어로 올리고 인덱스 위치를 조정한 뒤 375 × 812로 재캡처해 `01`과 `패키지`가 모두 온전히 보이는 것을 확인했다.
- 첫 경력 항목이 기준에서는 펼쳐져 있고 초기 구현 캡처에서는 접혀 있던 상태 불일치를 발견했다. 같은 펼침 상태로 다시 캡처해 비교했으며 추가 차이는 없었다.

## 비교 이력

1. 체크포인트 1에서 모바일 상세 제목, 키보드 스크롤, 태블릿 2+1 배치, 원본 이미지 확대 경로, 320px 내비게이션을 수정했다.
2. 체크포인트 2에서 히어로·카드 정보 중복, 검증 라벨, Swifty-law 유형, 추가 프로젝트 순서, 카드 밀도를 수정했다.
3. 체크포인트 3에서 정보 라벨, 히어로 근거 말줄임, 카드 hover 오해, 연락 CTA 위계·문구, 미사용 폰트를 수정했다.
4. 최종 반응형 비교에서 발견한 모바일 카드 인덱스·유형 배지 가림을 수정하고 동일 상태로 다시 비교했다.
5. 데스크톱 5개·모바일 5개 화면 쌍을 최종 재검토한 결과 남은 P0/P1/P2는 없다.

## Implementation Checklist

- [x] 감사 수정 범위를 세 개 기능 체크포인트 커밋으로 분리
- [x] 정적 테스트 51개 통과
- [x] 변경 파일 lint 통과
- [x] 프로덕션 빌드 통과
- [x] Chromium·WebKit 반응형/접근성 테스트 60개 통과
- [x] 1425 × 891, 1440 × 900, 375 × 812, 390 × 844 동일 뷰포트 재캡처·재비교
- [x] 데스크톱·모바일의 상단, 대표 사례, 상세, 경력, 연락 상태 비교
- [x] 남은 P0/P1/P2 없음 확인

## Follow-up Polish

- P3: 반복되는 직접 색상값의 의미 기반 토큰화는 별도 리팩터링으로 남긴다.
- P3: Footer 문구는 최신 기준 브랜치의 의도된 상태로 보고 유지했다.
- 확인된 역할·기간·팀 정보가 추가되면 카드 메타데이터를 보강할 수 있다.

final result: passed
