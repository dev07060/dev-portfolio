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
  headline: 'Flutter · 온디바이스 RAG 개발자',
  intro:
    'Flutter로 iOS·Android 제품을 만들고 운영해 왔습니다. 최근에는 앱 안에서 동작하는 로컬 검색 엔진까지 직접 만들어 제품에 붙였습니다.',
  resumeUrl: '/oh-byeonghee-resume-ko.pdf',
  proofItems: [
    {
      label: '공개 패키지',
      value: 'mobile_rag_engine · pub.dev 0.20.0',
      evidence: 'https://pub.dev/packages/mobile_rag_engine',
    },
    {
      label: '총 경력',
      value: '5년 5개월',
    },
  ],
};

export const recruitmentCases: RecruitmentCase[] = [
  {
    projectId: 'local-mobile-rag-gemma',
    sectionTitle: 'Flutter 공개 패키지',
    sectionLead:
      'mobile_rag_engine은 문서를 서버에 올리지 않고, 휴대폰 안에서 검색과 RAG context 생성까지 끝내는 패키지입니다.',
    metrics: [
      { value: '0.20.0', label: 'pub.dev 배포 버전' },
      { value: '25.9ms', label: '234자 임베딩 평균, 기기 내 · 디버그 빌드' },
    ],
    introTopics: [
      {
        label: '완전 로컬 RAG',
        title: '문서가 기기 밖으로 나가지 않습니다',
        body: 'Flutter 앱에서 문서를 서버에 업로드하지 않고 검색과 RAG context 생성을 처리합니다. 패키지는 LLM에 넘길 context까지만 책임지고, LLM provider와 채팅 UX는 앱에 맡깁니다.',
      },
      {
        label: '색인 파이프라인',
        title: '파싱부터 색인까지 기기 안에서',
        body: '문서 파싱, chunk metadata, ONNX embedding, SQLite 저장, index write로 이어지는 ingest 경로를 직접 구현했습니다. 234자 텍스트 임베딩은 기기에서 평균 25.9ms가 걸렸습니다.',
        flow: '파싱 → chunk metadata → ONNX embedding → SQLite → index',
      },
      {
        label: '하이브리드 검색',
        title: '의미 검색과 키워드 검색을 함께',
        body: 'HNSW vector 검색과 BM25 sparse 검색의 후보를 결합해 context로 조립합니다. 메리츠화재 태블릿 앱에서는 여기에 RRF 융합 랭킹과 질의 유형별 가중치를 더했습니다.',
        flow: 'HNSW + BM25 → 후보 결합 → LLM-ready context',
      },
      {
        label: '3계층 구조',
        title: '제품 API와 네이티브 hot path를 분리',
        body: '앱이 쓰는 Flutter facade, 흐름을 제어하는 Dart orchestration, 네이티브 hot path를 맡는 Rust FFI 코어로 나눴습니다. Flutter 쪽 사용 면은 단순해지고, 대신 네이티브 빌드와 릴리스 경계를 함께 관리합니다.',
        flow: 'Flutter facade → Dart orchestration → Rust FFI core',
      },
    ],
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
    sectionLead: '검색과 AI 요약의 결과를 언제나 PDF 원문의 정확한 근거 위치로 되돌립니다.',
    features: [
      { title: '온디바이스 약관 검색', description: '약관 PDF를 서버로 보내지 않고 기기 안에서 조항 단위로 찾습니다.' },
      { title: '원문 근거 하이라이트', description: '검색·요약 결과에서 PDF의 정확한 근거 영역으로 바로 이동합니다.' },
      { title: '동의 기반 AI 요약', description: '사용자가 동의할 때만 요약하고, 서버를 못 쓰면 로컬로 대체합니다.' },
      { title: '비용이 통제되는 요약 서버', description: '요청 서명, 사용 한도, 예산 상한, 중복 요청 병합으로 남용을 막습니다.' },
    ],
    stepScreens: [
      { screenId: '11-smart-guide-search-results', label: '약관 검색' },
      { screenId: '04-review-detail-highlight-summary', label: '조항 요약' },
      { screenId: '07-pdf-source-highlight', label: '원문 근거로' },
    ],
    relatedProjectIds: ['easy-contract-viewer-server'],
    statusLabel: 'Flutter 제품 적용 사례',
    problem:
      '보험 약관 PDF를 로컬에서 검색하고, 검토 결과를 정확한 원문 근거 위치로 다시 연결해야 했습니다.',
    contributions: [
      'pdfrx 기반 PDF 추출과 조항 인식 chunking을 구현하고 원문 하이라이트용 페이지 좌표를 보존했습니다.',
      'mobile_rag_engine을 연결해 SQLite, HNSW, BM25 기반의 온디바이스 약관 검색 흐름을 구성했습니다.',
      '동의 기반 AI 요약, 서버 readiness 확인, client session, 로컬 fallback 흐름을 구현했습니다.',
    ],
    verificationLabel: '검증 기준·방법',
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
    sectionLead: '사안을 적으면 쟁점을 나누고, 공식 조문을 직접 열어 확인한 근거로 검토 보고서를 쓰는 법령 에이전트.',
    sectionSummary:
      'Google ADK로 조사·작성·검증 단계를 나눈 에이전트가 국가법령 원문을 검색하고 열람합니다. 열람하지 않은 조문은 인용할 수 없고, 별도 대조 단계에서 근거와 어긋난 문장이 없을 때만 보고서를 검토 완료로 표시합니다.',
    figure: {
      screenId: 'ieum-report-citation',
      caption: '검토 보고서. 문장마다 붙은 근거 조문의 원문과 시행일을 오른쪽 패널에서 바로 확인합니다.',
    },
    statusLabel: '운영 중인 사안 검토 서비스',
    problem:
      'LLM이 그럴듯한 조문을 지어내면 기업 실무에서 쓸 수 없습니다. 보고서의 법적 주장은 모두 실제 공식 원문과 시행 시점에 묶여 있어야 했고, 국가법령 API 호출 한도와 요청 시간 안에서 끝나야 했습니다.',
    contributions: [
      'Google ADK Workflow로 보고서 에이전트를 조사 → 초안 작성 → 독립 답변 → 대조·수정 단계로 나누고, 역할마다 별도 세션을 두었습니다.',
      '에이전트 도구를 검색(후보)과 열람(원문)으로 분리해, 이번 실행에서 실제로 연 조문과 행정규칙만 인용할 수 있게 했습니다.',
      '조사 단계가 만든 쟁점 계획을 서버에서 고정해, 이후 단계가 원래 질문의 쟁점을 빠뜨리거나 바꾸지 못하게 했습니다.',
      '보고서 위 후속 대화 에이전트를 ADK Runner와 PostgreSQL 세션 저장으로 구현하고, 매 턴을 제출 도구 호출로 끝내게 해 답변 형식을 강제했습니다.',
      '판례는 참조조문이 이미 확인한 조문을 가리키는 대법원 판결만 후보로 삼고, 텍스트 유사도는 그 안에서 순서만 정하게 했습니다.',
      '에이전트 도구의 기반인 공식 법령 수집·정규화 파이프라인과 의미·용어 하이브리드 검색을 만들었습니다.',
    ],
    verification: [
      '마지막 대조 결과가 현재 본문과 일치하고 수정할 문장이 없을 때만 검토 완료로 표시합니다. 중간에 멈춘 보고서는 검증 전으로 저장해 근거 검토만 이어서 실행할 수 있습니다.',
      '요청 전체 시간 예산, 모델 호출별 제한 시간, 도구 호출 수 상한을 두고, 남은 시간이 부족한 단계는 시작하지 않습니다.',
      '검색 변경은 224문항 평가 세트(nDCG@5, MRR@10, Recall@10)로 회귀를 확인합니다.',
    ],
    outcomes: [
      '17개 분야·207개 법령을 대상으로 사안 검토, 보고서 열람, 후속 질문을 공개 서비스와 API로 제공합니다.',
      '보고서의 법적 주장마다 법령명, 조문, 시행일, 공식 출처가 붙습니다.',
    ],
    tradeoffs: [
      '일시적인 모델 오류에 재시도를 늘리지 않고, 미완료 보고서를 저장한 뒤 근거 검토만 다시 실행하게 했습니다. 재시도가 늘수록 API 호출 한도를 넘길 위험이 커지기 때문입니다.',
      '판례 후보를 텍스트 유사도로 넓히지 않아 후보 수는 줄지만, 쟁점과 무관한 판례가 근거로 섞이지 않습니다.',
    ],
    nonGoals: [
      '근거 없는 범용 법률 답변을 만들지 않습니다. 열람한 공식 원문으로 뒷받침되지 않는 문장은 검토 완료로 내보내지 않습니다.',
    ],
    evidenceLinks: [
      {
        label: '검색 서비스',
        url: 'https://law-api.swifty.kr/',
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
    cardHighlight:
      'mobile_rag_engine 기반 BM25+HNSW Hybrid Search에 RRF 융합 랭킹과 Source Filter를 적용했습니다.',
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
    cardHighlight:
      'BLE sample interval·timestamp 기반 ROM 계산으로 장시간 누적 drift를 70% 이상 줄였습니다.',
    role: 'App Frontend 파트장',
    employmentType: '회사 근무',
    period: '2024.06 - 2025.05',
    summary:
      'FIET MEDI, FIET Partner, MVM Fitness 등 Flutter iOS·Android 앱 개발과 운영 안정화를 담당했습니다.',
    highlights: [
      'BLE Notify jitter와 packet drop을 반영한 sample interval·timestamp 기반 ROM 계산으로 장시간 누적 drift를 70% 이상 줄였습니다.',
      '펌웨어별 characteristic 누락을 실패 가능한 파서로 개선하고 Sentry 분석과 Fastlane·GitHub Actions 배포 자동화를 운영했습니다.',
    ],
    relatedProjectIds: ['fiet-fitness-trainer', 'fiet-fitness-user'],
  },
  {
    company: '㈜인피니티익스체인지코리아',
    cardHighlight:
      '가상자산 거래소 앱의 실시간 시세 WebSocket 연결 생명주기와 화면 반영 흐름을 최적화했습니다.',
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
    cardHighlight:
      'VitalTracker의 센서 수집과 MethodChannel 네이티브 처리, 백그라운드 lifecycle을 안정화했습니다.',
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
