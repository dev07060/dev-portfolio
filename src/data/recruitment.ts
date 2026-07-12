import type {
  ExperienceItem,
  RecruitmentCase,
  RecruitmentProfile,
} from '@/types/recruitment';

export const recruitmentProfile: RecruitmentProfile = {
  name: '오병희',
  role: '크로스플랫폼 개발자 · 로컬 RAG 엔지니어',
  position: 'Flutter · 온디바이스 Retrieval/RAG · LLM 백엔드',
  positioning:
    '모바일 제품과 로컬 검색 엔진을 설계·구현하고 평가와 운영까지 연결합니다.',
  email: 'byeongheeoh51@gmail.com',
  githubUrl: 'https://github.com/dev07060',
  resumeUrl: '/oh-byeonghee-resume-ko.pdf',
  proofItems: [
    {
      label: '공개 패키지',
      value: 'mobile_rag_engine · pub.dev 0.20.0',
      evidence: 'https://pub.dev/packages/mobile_rag_engine',
    },
    {
      label: '경력',
      value: '총 5년 5개월',
    },
  ],
};

export const recruitmentCases: RecruitmentCase[] = [
  {
    projectId: 'local-mobile-rag-gemma',
    statusLabel: 'pub.dev 공개 패키지 · 0.20.0',
    problem:
      'Flutter 앱에서 문서를 서버에 업로드하지 않고 로컬 문서 검색과 RAG context 생성을 처리해야 했습니다.',
    contributions: [
      'Flutter facade, Dart orchestration, Rust FFI 검색 코어로 제품 API와 네이티브 hot path를 분리했습니다.',
      '문서 파싱, chunk metadata, ONNX embedding, SQLite 저장, index write로 이어지는 ingest 경로를 구현했습니다.',
      'HNSW vector search, BM25 sparse retrieval, 후보 결합, context assembly로 이어지는 query 경로를 구현했습니다.',
    ],
    verification: [
      'GitHub 소스, 예제, 문서와 pub.dev 0.20.0 릴리스를 공개 근거로 함께 확인할 수 있습니다.',
    ],
    outcomes: [
      'Flutter 공개 API, 예제, 문서, 릴리스 패키징을 포함한 0.20.0을 pub.dev에 배포했습니다.',
      'Easy Contract Viewer 같은 Flutter 제품에서 로컬 색인과 원문 기반 context 생성에 재사용할 수 있는 기반을 만들었습니다.',
    ],
    tradeoffs: [
      '제품 API와 Rust FFI hot path를 분리해 Flutter 사용 면을 단순화하는 대신 네이티브 빌드와 릴리스 경계를 함께 유지합니다.',
    ],
    nonGoals: [
      'LLM provider나 채팅 UX를 패키지에 고정하지 않고 로컬 retrieval과 LLM-ready context 생성까지 책임집니다.',
    ],
    evidenceLinks: [
      {
        label: 'GitHub',
        url: 'https://github.com/dev07060/mobile_rag_engine',
        kind: 'github',
      },
      {
        label: 'pub.dev',
        url: 'https://pub.dev/packages/mobile_rag_engine',
        kind: 'pubdev',
      },
    ],
    supportingPackages: [
      {
        name: 'rag_engine_flutter',
        version: '0.18.3',
        relationship:
          'mobile_rag_engine의 네이티브 Rust FFI와 토크나이징 경로를 제공하는 기반 패키지입니다.',
        techStack: [
          'Rust',
          'flutter_rust_bridge',
          'cargokit',
          'HuggingFace Tokenizers',
        ],
        links: [
          {
            label: 'pub.dev',
            url: 'https://pub.dev/packages/rag_engine_flutter',
            kind: 'pubdev',
          },
          {
            label: 'GitHub',
            url: 'https://github.com/dev07060/mobile_rag_engine',
            kind: 'github',
          },
        ],
      },
    ],
  },
  {
    projectId: 'easy-contract-viewer',
    statusLabel: 'Flutter 제품 적용 사례',
    problem:
      '보험 약관 PDF를 로컬에서 검색하고, 검토 결과를 정확한 원문 근거 위치로 다시 연결해야 했습니다.',
    contributions: [
      'pdfrx 기반 PDF 추출과 조항 인식 chunking을 구현하고 원문 하이라이트용 페이지 좌표를 보존했습니다.',
      'mobile_rag_engine을 연결해 SQLite, HNSW, BM25 기반의 온디바이스 약관 검색 흐름을 구성했습니다.',
      '동의 기반 AI 요약, 서버 readiness 확인, client session, 로컬 fallback 흐름을 구현했습니다.',
    ],
    verification: [
      '검색과 분석 결과가 ingest 단계에서 보존한 페이지 좌표를 통해 정확한 PDF 근거 영역으로 돌아가는지 확인합니다.',
      'AI 요약은 사용자 동의, 서버 readiness, client session, 로컬 fallback 경계를 각각 거칩니다.',
    ],
    outcomes: [
      '검색과 분석 결과에서 매칭된 PDF 조항의 정확한 근거 영역을 다시 열 수 있게 했습니다.',
      '원문 약관을 기준으로 유지하면서 선택적으로 AI 요약을 확인하는 제품 흐름을 구성했습니다.',
    ],
    tradeoffs: [
      '요약만으로 결론을 내리는 짧은 흐름보다 원문 근거를 다시 확인하는 한 단계를 유지했습니다.',
    ],
    nonGoals: [
      'AI 요약이 보험 약관 원문을 대체하지 않으며 최종 확인 기준은 PDF 근거로 남깁니다.',
    ],
    evidenceLinks: [],
  },
  {
    projectId: 'law-info-engine',
    statusLabel: '운영 중인 검색·API',
    problem:
      '공식 법령 데이터를 인용 가능한 단위로 정규화하고, LLM이 검색된 공식 근거 안에서만 답하도록 해야 했습니다.',
    contributions: [
      'Bronze/Silver/Gold 3계층 레이크로 원본 API에서 chunk와 embedding을 다시 생성할 수 있게 설계했습니다.',
      'SBERT dense와 Milvus BM25 sparse 결과를 RRFRanker(60)로 결합했습니다.',
      'golden retrieval set의 nDCG@5, MRR@10, Recall@10 회귀 기준으로 릴리스 게이트를 구성했습니다.',
    ],
    verification: [
      'golden retrieval set의 nDCG@5, MRR@10, Recall@10 회귀 기준으로 검색 변경을 검증합니다.',
      '국가법령 Open API를 일일 한도, 최소 간격, 지수 백오프 재시도로 보호합니다.',
    ],
    outcomes: [
      '법령명, 조문 경로, 시행일, 출처 URL을 포함하는 검색 결과를 공개 검색 화면과 API로 제공합니다.',
      '국가법령 Open API quota를 일일 한도, 최소 간격, 지수 백오프 재시도로 보호합니다.',
    ],
    tradeoffs: [
      'dense와 sparse 검색을 함께 운영하는 색인·평가 복잡성을 감수하고 의미 유사도와 법령 용어 일치 결과를 결합했습니다.',
    ],
    nonGoals: [
      '근거 없는 범용 답변을 만들지 않고 LLM 응답을 검색된 공식 chunk와 citation 경계 안으로 제한합니다.',
    ],
    evidenceLinks: [
      {
        label: '검색 서비스',
        url: 'https://law-api.swifty.kr/search-info/',
        kind: 'live',
      },
      {
        label: 'API 문서',
        url: 'https://law-api.swifty.kr/docs',
        kind: 'docs',
      },
    ],
  },
];

export const experienceItems: ExperienceItem[] = [
  {
    company: '메리츠화재해상보험',
    role: '보험 판매자용 태블릿 RAG 개발',
    employmentType: '외주·프리랜서',
    period: '2025.12 - 2026.02',
    summary:
      '보험 판매자용 태블릿 앱에서 약관 RAG 탐색과 온디바이스 조항 요약 흐름을 개발했습니다.',
    highlights: [
      'mobile_rag_engine 기반 BM25+HNSW Hybrid Search에 RRF 융합 랭킹과 질의 유형별 가중치·Source Filter를 적용했습니다.',
      'PDF 조항 추출, 검색 결과 하이라이트, 원문 위치 점프 탐색 UX와 온디바이스 요약 카드를 구현했습니다.',
    ],
    relatedProjectIds: ['local-mobile-rag-gemma'],
  },
  {
    company: '㈜피에트',
    role: 'App Frontend 파트장',
    employmentType: '회사 근무',
    period: '2024.06 - 2025.05',
    summary:
      'FIET MEDI, FIET Partner, MVM Fitness 등 Flutter iOS·Android 앱 개발과 운영 안정화를 담당했습니다.',
    highlights: [
      'BLE Notify jitter와 packet drop을 반영한 sample interval·timestamp 기반 ROM 계산으로 장시간 누적 drift를 70% 이상 줄였습니다.',
      '펌웨어별 characteristic 누락을 실패 가능한 파서로 개선하고 Sentry 분석과 Fastlane·GitHub Actions 배포 자동화를 운영했습니다.',
    ],
    relatedProjectIds: ['fiet-fitness-trainer'],
  },
  {
    company: '㈜인피니티익스체인지코리아',
    role: '가상자산 거래소 모바일 개발',
    employmentType: '외주·상주',
    period: '2024.03 - 2024.06',
    summary:
      'Flutter·GetX·MVC 기반 가상자산 거래소 앱의 핵심 기능과 인증 흐름을 개발했습니다.',
    highlights: [
      '실시간 시세 WebSocket의 연결 생명주기와 화면 반영 흐름을 최적화했습니다.',
      '회원정보 등록·관리와 KYC 인증 프로세스의 상태·네트워크 예외 처리를 구현했습니다.',
    ],
    relatedProjectIds: [],
  },
  {
    company: '튜링바이오',
    role: '앱개발·연구개발 주임연구원',
    employmentType: '회사 근무',
    period: '2021.09 - 2024.03',
    summary:
      '헬스케어·정신건강 도메인의 Flutter 앱과 연구 과제 앱을 운영 안정성 관점에서 개발했습니다.',
    highlights: [
      'VitalTracker의 위치·자이로·가속도·조도 센서 수집과 MethodChannel 네이티브 처리, 백그라운드 lifecycle을 안정화했습니다.',
      'Weedool과 CAER-Scope에서 상담·CBT 흐름, ML Kit·STT/TTS 기능과 AES256·JWT·RBAC 보호 구조를 구현했습니다.',
    ],
    relatedProjectIds: ['weedool'],
  },
  {
    company: '㈜영우',
    role: 'React Native·Node.js 개발',
    employmentType: '원격 외주',
    period: '2020.01 - 2020.04',
    summary:
      'React Native 기반 원단 재고 조회 앱과 Node.js API 서버를 원격 외주로 개발했습니다.',
    highlights: [
      '음성인식과 QR Code 기반 원단 정보 조회 흐름을 구현했습니다.',
      'Google BigQuery 기반 원단 정보 저장과 추천 기능을 개발했습니다.',
    ],
    relatedProjectIds: [],
  },
  {
    company: '한국와콤',
    role: '개발팀 사원',
    employmentType: '회사 근무',
    period: '2017.08 - 2018.08',
    summary:
      'Node.js(Express)와 MySQL 기반 고객 상담 시스템을 설계·구축했습니다.',
    highlights: [
      '상담 문의 등록·답변·관리 UI와 텍스트 유사도 기반 답변 추천, 자동 메일 발송을 구현했습니다.',
      '트랜잭션과 Row Lock으로 동시 요청 충돌을 방지하고 실행 계획 분석으로 다중 JOIN 구간을 개선했습니다.',
    ],
    relatedProjectIds: [],
  },
];
