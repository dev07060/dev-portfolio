# 포트폴리오 디자인 확정안 v1 — 인계 자료

- 원본 캔버스: https://claude.ai/artifact/AJZ677bRGyTU6b4944LBRk (Design 아티팩트, 비공개). Artifact 도구의 `read`로 열 수 있습니다.
- 이 폴더의 `boards/`는 2026-10-02 기준 캔버스 파일 사본입니다. 캔버스와 다르면 캔버스가 최신입니다.
- 구현 계획: `docs/superpowers/plans/2026-10-02-portfolio-design-conversion.md`

## 보드

| 파일 | 내용 | 구현 기준 여부 |
|---|---|---|
| `boards/Proposal.dc.html` | 확정안 v1 · 데스크톱 페이지 (1440 기준, 6섹션, 히어로 검색과 사례 #1 탭이 실제로 동작) | 기준 |
| `boards/MobileHero.dc.html` | 확정안 v1 · 모바일 첫 화면 (정지 화면) | 기준 |
| `boards/MobileMap.dc.html` | 확정안 v1 · 모바일 사례 #1 (정지 화면) | 기준 |
| `boards/Spec.dc.html` | 구현 명세 (보드에서 안 보이는 규칙) | 기준. 단, 아래 '콘텐츠 보존'이 우선 |
| `boards/Direction.dc.html` | 레퍼런스와 디자인 방향 | 참고 |
| `boards/Main.dc.html` | 현재 구조 vs 제안 구조 비교 | 참고 (옛 안 설명 포함) |

`.dc.html`은 브라우저에서 바로 열면 `support.js`가 없어 깨집니다. 문구·스타일 값은 소스를 읽어서 확인하고, 화면은 캔버스에서 확인합니다.

## 보드의 이미지 → 저장소 경로

보드 안의 `/_blob/<id>`는 아래 저장소 파일을 업로드한 것입니다. 구현에서는 저장소 경로를 씁니다.

| blob id | 저장소 경로 | 보드에서 쓰는 곳 |
|---|---|---|
| `413b6a9071cb730cefed0c1a51a87743` | `public/images/easy-contract-viewer/android-screens/11-smart-guide-search-results.png` | 사례 #2 화면 1 |
| `6035781181647919b2731e6ecccb9099` | `public/images/easy-contract-viewer/android-screens/04-review-detail-highlight-summary.png` | 사례 #2 화면 2 |
| `36ff0c26e7762b8442c12a90c5f99cde` | `public/images/easy-contract-viewer/android-screens/07-pdf-source-highlight.png` | 사례 #2 화면 3 |
| `0b6fa693c6188036f6ad0ca1417893fb` | `public/images/law-info-engine/search-ui.png` | 사례 #3 |
| `ac388dfb71b669031a3b03dfe2eb4c86` | `public/images/local-mobile-rag-gemma/rag-search-test.png` | 쓰지 않음 (예전 안) |
| `1dca83be89534a53355b30de5836dc17` | `public/images/local-mobile-rag-gemma/rag-performance-benchmark.png` | 쓰지 않음, 25.9ms 수치의 출처 |
| `3d7fabb60eb26b1cd46ec85964e2fed1` | `public/images/fiet-fitness-trainer/report-fiet.png` | 쓰지 않음 (예전 안) |
| `95562dcf957b60e9c3b733831bd27fe3` | `public/images/weedool/unnamed-2.png` | 쓰지 않음 (예전 안) |
| `505d1400f456438a9b32f6f4c9a65404` | `public/images/haru-check/certs.png` | 쓰지 않음 (예전 안) |

## 콘텐츠 보존 (사용자 지시, 2026-10-02 — 보드·명세보다 우선)

> 현재 프로젝트 디자인 구조는 신경 쓰거나 보존할 필요가 없다. 하지만 내용은 삭제하면 안 된다. 각 회사에서 남긴 프로젝트, 스택에 대한 내용, 스크린샷 소스는 그대로 남기고 디자인만 완전히 컨버전한다.

- `src/data/*`의 항목과 필드 값은 지우지 않습니다. 새 필드는 추가만 합니다.
- `public/images/**`의 파일은 지우거나 옮기지 않습니다.
- HEAD 화면에서 볼 수 있던 콘텐츠는 새 화면에서도 최소 한 경로로 볼 수 있어야 합니다. 경로는 섹션 본문, '사례 자세히' 모달, 경력 '자세히' 펼치기, '프로젝트 사례 #N' 링크, 히어로 검색 중 하나입니다.
- 그래서 명세의 다음 항목은 이렇게 바뀝니다.
  - HaruCheck와 Easy Contract Viewer Server는 진입점이 있어야 합니다. 번호는 #6, #4(config 순서)입니다.
  - 경력 상세(summary + 모든 highlights)는 '자세히' 펼치기로 보여 줍니다.
  - 사례 상세(problem, contributions, verification, outcomes, tradeoffs, nonGoals, supportingPackages)는 '사례 자세히' 버튼이 여는 기존 `ProjectModal`에 남습니다.
  - 히어로의 역량(capabilities)과 근거(proofItems)는 히어로 메타 줄로 남습니다.
- HEAD에서도 공개 화면에 없던 `fiet-fitness-user`, `motgo`는 데이터만 유지하고 화면에 노출하지 않습니다. 기존 e2e 계약('피에트 사용자 앱은 데이터에 남고 공개 프로젝트 링크에서는 제외된다')도 유지합니다.

## 작업 트리 주의

메인 작업 트리에는 미커밋 변경이 있습니다(옛 디자인 수정 시도). 구현은 별도 worktree에서 HEAD `3576ca8` 기준으로 합니다. 미커밋 변경 중 데이터·타입 변경은 `uncommitted-data-and-types.patch`에 보관했습니다. 여기에는 `profile.intro` 추가와 proofItem 삭제가 들어 있으며, 내용 손실이 없도록 참고만 합니다.
