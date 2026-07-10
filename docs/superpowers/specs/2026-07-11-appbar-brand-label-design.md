# App Bar Brand Label Design

## Goal

Hero와 앱바에 `오병희`가 반복되는 문제를 없애고 앱바를 사이트 성격을 알리는 브랜드 표면으로 사용한다.

## Approved design

- 앱바 왼쪽 링크의 표시 문구를 `오병희`에서 `DEV PORTFOLIO`로 변경한다.
- 링크 대상 `#about`, 내비게이션 구조, Hero의 `오병희`, 한국어 콘텐츠는 유지한다.
- 새 로고, 아이콘, 인터랙션, 반응형 규칙은 추가하지 않는다.
- 기존 serif 이름 스타일 대신 앱바의 작은 브랜드 라벨에 맞는 sans-serif 대문자와 자간을 사용한다.

## Verification

- 구조 테스트는 앱바에 `DEV PORTFOLIO`가 있고 이름 텍스트가 없음을 검증한다.
- 전체 테스트와 빌드를 실행한다.
- `http://localhost:3000` 응답에서 새 라벨과 Hero 이름이 함께 렌더링되는지 확인한다.
