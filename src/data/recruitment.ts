import type {
  ExperienceItem,
  RecruitmentCase,
  RecruitmentProfile,
} from '@/types/recruitment';

export const recruitmentProfile: RecruitmentProfile = {
  name: '오병희',
  englishName: 'Byeonghee Oh',
  role: '크로스플랫폼 개발자 · 로컬 RAG 엔지니어',
  position: 'Flutter · 온디바이스 Retrieval/RAG · LLM 백엔드',
  positioning:
    '모바일 제품과 로컬 검색 엔진을 설계·구현하고 평가와 운영까지 연결합니다.',
  email: 'byeongheeoh51@gmail.com',
  githubUrl: 'https://github.com/dev07060',
  proofItems: [
    {
      label: '공개 패키지',
      value: 'mobile_rag_engine · pub.dev 0.18.6',
      evidence: 'https://pub.dev/packages/mobile_rag_engine',
    },
  ],
};

export const recruitmentCases: RecruitmentCase[] = [
  {
    projectId: 'local-mobile-rag-gemma',
    publicStatus: 'pub.dev 공개 패키지 · 0.18.6',
    problem:
      'Flutter 앱에서 문서를 서버에 업로드하지 않고 로컬 문서 검색과 RAG context 생성을 처리해야 했습니다.',
    contributions: [
      'Flutter facade, Dart orchestration, Rust FFI 검색 코어로 제품 API와 네이티브 hot path를 분리했습니다.',
      '문서 파싱, chunk metadata, ONNX embedding, SQLite 저장, index write로 이어지는 ingest 경로를 구현했습니다.',
      'HNSW vector search, BM25 sparse retrieval, 후보 결합, context assembly로 이어지는 query 경로를 구현했습니다.',
    ],
    verification: [
      'GitHub 소스, 예제, 문서와 pub.dev 0.18.6 릴리스를 공개 근거로 함께 확인할 수 있습니다.',
    ],
    outcomes: [
      'Flutter 공개 API, 예제, 문서, 릴리스 패키징을 포함한 0.18.6을 pub.dev에 배포했습니다.',
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
  },
  {
    projectId: 'easy-contract-viewer',
    publicStatus: 'Flutter 제품 적용 사례',
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
    publicStatus: '운영 중인 검색·API',
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

export const experienceItems: ExperienceItem[] = [];
