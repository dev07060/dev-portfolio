import type { SearchDocument } from '@/lib/portfolioSearch';

/** Words the hero search types by itself (autoplay demo). */
export const heroSearchDemoWords = ['Flutter', 'RAG', '모바일 개발', '온디바이스'] as const;

/** Suggestion buttons under the hero search field. */
export const heroSearchSuggestions = ['Flutter', 'RAG', '모바일 개발', '온디바이스', 'BLE'] as const;

/**
 * `keywords` may be shown as hints ("관련 키워드"). Ranking-algorithm names live in
 * `hiddenKeywords`: they still count for scoring but are never displayed.
 */
export const heroSearchDocuments: readonly SearchDocument[] = [
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
    keywords: ['모바일', 'Dart', 'Rust FFI', 'ONNX', 'SQLite', '하이브리드'],
    hiddenKeywords: ['HNSW', 'BM25', 'RRF'],
    meta: 'pub.dev · 0.20.0',
    target: { kind: 'project', projectId: 'local-mobile-rag-gemma' },
  },
  {
    id: 'law-info-engine',
    title: '기업 법령 검토 엔진(이음)',
    snippet: '사안을 적으면 공식 조문을 직접 열어 확인한 근거로 검토 보고서를 쓰는 법령 에이전트.',
    keywords: ['RAG', 'LLM', '에이전트', 'Google ADK', 'Gemini', 'Python', 'FastAPI', 'PostgreSQL', 'Milvus'],
    hiddenKeywords: ['BM25', 'RRF', 'Swifty-law', '이음', 'Ieum'],
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
  {
    id: 'fiet-fitness-user',
    title: '피에트 피트니스',
    snippet: 'Flutter 회원용 앱. 트레이너와 연동한 운동·식단 기록, FCM 푸시 알림, 수분·체중 이력 차트.',
    keywords: ['모바일', 'Dart', 'Firebase', '식단', '차트'],
    meta: '모바일 앱 · ㈜피에트',
    target: { kind: 'project', projectId: 'fiet-fitness-user' },
  },
];
