import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'law-info-engine',
    type: 'web',
    title: { en: 'Swifty-law', ko: 'Swifty-law' },
    subtitle: {
      en: 'Citation-grounded Korean Law RAG Engine',
      ko: '인용 기반 한국 법령 검색 RAG 엔진',
    },
    description: {
      en: 'In-house engine that normalizes official Korean statute data into citable chunks and serves hybrid retrieval so LLMs answer only within official sources with full citations.',
      ko: '공식 법령정보를 인용 가능한 단위로 정규화·색인하고 hybrid retrieval로 검색하는 사내 공통 엔진. LLM은 검색된 공식 chunk와 citation 안에서만 답변합니다.',
    },
    implementationPoints: [
      {
        en: 'Built Bronze/Silver/Gold three-tier lake so chunks and embeddings can be regenerated from raw API at any time.',
        ko: 'Bronze/Silver/Gold 3계층 레이크로 원본 API에서 청크·임베딩을 언제든 재생성 가능하게 설계.',
      },
      {
        en: 'Fused SBERT dense + Milvus BM25 sparse via RRFRanker(60) with corpus-derived query expansion.',
        ko: 'SBERT dense + Milvus BM25 sparse를 RRFRanker(60)로 융합하고 corpus 기반 질의 확장 적용.',
      },
      {
        en: 'Hardened upstream Open API quota with daily limit, min interval, and exponential backoff retries.',
        ko: '국가법령 Open API quota를 일일 한도·최소 간격·지수 백오프 재시도로 1급 시민으로 보호.',
      },
      {
        en: 'Gated releases on nDCG@5 / MRR@10 / Recall@10 against golden_retrieval_v1 (74 dev / 30 holdout).',
        ko: 'golden_retrieval_v1(74 dev / 30 holdout) nDCG@5 / MRR@10 / Recall@10 회귀 게이트로 릴리스 차단.',
      },
    ],
    audienceOverrides: {
      client: {
        variant: 'live-query',
        thumbnailScreenIndex: 2,
        description: {
          en: 'citation-grounded legal RAG API that returns statute chunks, citations, and live query results for legal-domain LLM products.',
          ko: '법률 도메인 LLM 제품에 조문 chunk, citation, live query 결과를 반환하는 citation 기반 법령 RAG API입니다.',
        },
        evidenceBadges: ['FastAPI', 'Milvus', 'Citations', 'Bronze/Silver/Gold', 'evaluation'],
        highlight: {
          en: 'Built citation-grounded legal RAG with FastAPI, Milvus, Bronze/Silver/Gold data layers, and evaluation gates.',
          ko: 'FastAPI, Milvus, Bronze/Silver/Gold 데이터 계층, evaluation gate를 갖춘 citation 기반 legal RAG를 구축했습니다.',
        },
      },
      developer: {
        variant: 'architecture',
        thumbnailScreenIndex: 3,
        description: {
          en: 'Hybrid retrieval backend with Bronze/Silver/Gold lake, Milvus dense/sparse ranking, citation metadata, and evaluation gates.',
          ko: 'Bronze/Silver/Gold 레이크, Milvus dense/sparse ranking, citation metadata, evaluation gate를 갖춘 hybrid retrieval 백엔드입니다.',
        },
        evidenceBadges: ['FastAPI', 'Milvus', 'RRFRanker', 'Bronze/Silver/Gold', 'evaluation'],
        highlight: {
          en: 'Gated releases on nDCG@5 / MRR@10 / Recall@10 against a golden retrieval set.',
          ko: 'golden retrieval set 기준 nDCG@5 / MRR@10 / Recall@10으로 릴리스를 게이트했습니다.',
        },
      },
    },
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Milvus', 'SBERT', 'Docker'],
    color: 'from-amber-500 to-orange-600',
    iconType: 'scale',
    screens: [
      {
        title: { en: 'API Landing', ko: 'API 진입 화면' },
        desc: {
          en: 'Developer entry at law-api.swifty.kr — endpoint index and health surface.',
          ko: 'law-api.swifty.kr 개발자 진입 화면 — endpoint 인덱스와 health 표면.',
        },
        imagePath: '/images/law-info-engine/api-landing.png',
        scrollable: true,
      },
      {
        title: { en: 'Live Search UI', ko: '검색 화면' },
        desc: {
          en: 'Public search experience — ask in natural language, get statute chunks back.',
          ko: '실제 서비스 검색 화면 — 자연어 질의로 조문 단위 결과를 돌려줍니다.',
        },
        imagePath: '/images/law-info-engine/search-ui.png',
        scrollable: true,
      },
      {
        title: { en: 'Results · Citations', ko: '검색 결과·인용' },
        desc: {
          en: 'Every result carries statute name, article path, effective date, and source URL.',
          ko: '모든 결과에 법령명·조문경로·시행일·출처 URL이 함께 노출됩니다.',
        },
        imagePath: '/images/law-info-engine/search-ui-full.png',
        scrollable: true,
      },
      {
        title: { en: 'System Architecture', ko: '시스템 구성' },
        desc: {
          en: 'Five layers — sources, data lake, index · knowledge graph, analysis, API.',
          ko: '5계층 흐름 — 원천 수집, 데이터 정제, 색인·지식그래프, 분석, API 노출.',
        },
        imagePath: '/images/law-info-engine/architecture.svg',
        scrollable: true,
      },
      {
        title: { en: 'Search · Analyze Paths', ko: '검색·분석 경로' },
        desc: {
          en: 'Single-shot chunk search vs. issue decomposition + knowledge-graph expanded evidence.',
          ko: '단순 조문 검색 경로와 쟁점 분해 + 지식그래프 확장 근거 경로의 단계별 흐름.',
        },
        imagePath: '/images/law-info-engine/api-flows.svg',
        scrollable: true,
      },
    ],
    links: [
      {
        label: 'Live Site',
        url: 'https://law-api.swifty.kr/search-info/',
      },
      {
        label: 'Docs',
        url: 'https://law-api.swifty.kr/docs',
      },
    ],
  },
  {
    id: 'easy-contract-viewer',
    type: 'mobile',
    title: { en: 'Easy Contract Viewer', ko: 'Easy Contract Viewer' },
    subtitle: {
      en: 'AI-assisted insurance contract review app',
      ko: 'AI 기반 보험 약관 검토 앱',
    },
    description: {
      en: 'A Flutter app that imports insurance PDF contracts, indexes clauses locally with mobile_rag_engine, surfaces review priorities, and opens the exact source PDF highlights with optional AI summaries.',
      ko: '보험 약관 PDF를 가져와 mobile_rag_engine으로 로컬 색인하고, 검토 우선순위를 정리하며, 원문 PDF 하이라이트와 선택형 AI 요약까지 연결하는 Flutter 앱입니다.',
    },
    implementationPoints: [
      {
        en: 'Built PDF ingestion and clause-aware chunking with pdfrx while preserving page rectangles for source highlights.',
        ko: 'pdfrx 기반 PDF 추출과 조항 인식 chunking을 구현하고, 원문 하이라이트를 위해 페이지 좌표를 보존했습니다.',
      },
      {
        en: 'Integrated mobile_rag_engine for on-device SQLite, HNSW, and BM25 hybrid search across uploaded contracts.',
        ko: 'mobile_rag_engine을 연동해 업로드된 약관을 온디바이스 SQLite, HNSW, BM25 하이브리드 검색으로 처리했습니다.',
      },
      {
        en: 'Designed an automatic insurance-clause analysis pipeline that ranks urgent, review, and reference items from intent candidates.',
        ko: '보험 약관 intent 후보를 기반으로 즉시, 검토, 참고 항목을 정렬하는 자동 분석 파이프라인을 설계했습니다.',
      },
      {
        en: 'Added consent-gated AI summary generation with server readiness checks, client session handling, and local fallback summaries.',
        ko: '동의 기반 AI 요약 생성, 서버 readiness 확인, 클라이언트 세션 처리, 로컬 fallback 요약 흐름을 구축했습니다.',
      },
    ],
    audienceOverrides: {
      client: {
        variant: 'product-screenshot',
        thumbnailScreenIndex: 0,
        description: {
          en: 'Flutter product flow for PDF import, local indexing, clause analysis, source highlight, and productization of insurance contract review.',
          ko: '보험 약관 검토를 위한 PDF import, local indexing, clause analysis, source highlight, productization 흐름을 갖춘 Flutter 제품입니다.',
        },
        evidenceBadges: ['PDF import', 'local indexing', 'clause analysis', 'source highlight', 'productization'],
        highlight: {
          en: 'Connected review cards back to exact PDF evidence so users can inspect the original clause.',
          ko: '검토 카드를 정확한 PDF 근거 위치로 연결해 사용자가 원문 조항을 확인할 수 있게 했습니다.',
        },
      },
      developer: {
        variant: 'product-screenshot',
        thumbnailScreenIndex: 7,
        description: {
          en: 'Flutter app using pdfrx, mobile_rag_engine, local SQLite/HNSW/BM25 search, clause ranking, and consent-gated AI summaries.',
          ko: 'pdfrx, mobile_rag_engine, 로컬 SQLite/HNSW/BM25 검색, 조항 랭킹, 동의 기반 AI 요약을 연결한 Flutter 앱입니다.',
        },
        evidenceBadges: ['Flutter', 'pdfrx', 'mobile_rag_engine', 'PDF highlights', 'QA'],
        highlight: {
          en: 'Preserved page rectangles during ingestion so search and analysis results can reopen the exact source highlight.',
          ko: '인제스션 단계에서 페이지 좌표를 보존해 검색·분석 결과가 정확한 원문 하이라이트로 돌아가게 했습니다.',
        },
      },
    },
    techStack: ['Flutter', 'Dart', 'Riverpod', 'GoRouter', 'pdfrx', 'mobile_rag_engine'],
    color: 'from-sky-500 to-emerald-500',
    iconType: 'layers',
    screens: [
      {
        title: { en: 'Home Dashboard', ko: '홈 대시보드' },
        desc: {
          en: 'Shows uploaded contracts and the number of items still waiting for review.',
          ko: '업로드된 약관별 검토 현황과 남은 미검토 항목 수를 보여줍니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/00-home-dashboard.png',
      },
      {
        title: { en: 'Analysis Overview', ko: '분석 결과 개요' },
        desc: {
          en: 'Summarizes urgent, review, and reference items after contract analysis.',
          ko: '약관 분석 후 즉시, 검토, 참고 항목을 요약해 보여줍니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/01-analysis-overview.png',
      },
      {
        title: { en: 'Review List Search Entry', ko: '검토 목록과 검색 진입' },
        desc: {
          en: 'Combines review cards with the Smart Guide entry point for contract search.',
          ko: '검토 카드와 약관 검색을 위한 Smart Guide 진입점을 함께 제공합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/02-analysis-review-list-search-entry.png',
      },
      {
        title: { en: 'Expanded Review Item', ko: '검토 항목 확장' },
        desc: {
          en: 'Expands a review item to show matched clauses, evidence, and next actions.',
          ko: '검토 항목을 펼쳐 매칭 조항, 근거, 다음 행동을 확인합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/03-analysis-review-item-expanded.png',
      },
      {
        title: { en: 'Highlight Summary', ko: '하이라이트 요약' },
        desc: {
          en: 'Presents key terms and checkpoints before opening the original clause.',
          ko: '원문 조항을 열기 전 주요 키워드와 확인 사항을 정리합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/04-review-detail-highlight-summary.png',
      },
      {
        title: { en: 'AI Summary Consent', ko: 'AI 요약 동의' },
        desc: {
          en: 'Shows consent and caution text before generating an AI summary.',
          ko: 'AI 요약 생성 전 동의 항목과 주의 문구를 표시합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/05-ai-summary-consent-dialog.png',
      },
      {
        title: { en: 'Generated AI Summary', ko: '생성된 AI 요약' },
        desc: {
          en: 'Displays a concise AI summary while keeping the original contract as the source of truth.',
          ko: '원문 약관을 기준으로 확인해야 한다는 안내와 함께 간결한 AI 요약을 제공합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/06-ai-summary-generated.png',
      },
      {
        title: { en: 'PDF Source Highlight', ko: 'PDF 원문 하이라이트' },
        desc: {
          en: 'Opens the source PDF at the matched clause and highlights the evidence region.',
          ko: '매칭된 조항 위치의 PDF 원문을 열고 근거 영역을 하이라이트합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/07-pdf-source-highlight.png',
      },
      {
        title: { en: 'Highlight Detail Sheet', ko: '하이라이트 상세 시트' },
        desc: {
          en: 'Shows clause details from the selected PDF highlight.',
          ko: '선택한 PDF 하이라이트의 조항 상세 내용을 표시합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/08-pdf-highlight-detail-sheet.png',
      },
      {
        title: { en: 'Smart Guide Entry', ko: 'Smart Guide 진입 카드' },
        desc: {
          en: 'Offers guided contract search with suggested keywords from analysis results.',
          ko: '분석 결과에서 뽑은 추천 키워드로 약관 검색을 시작합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/09-smart-guide-entry-card.png',
      },
      {
        title: { en: 'Smart Guide Empty Search', ko: 'Smart Guide 검색 대기' },
        desc: {
          en: 'Provides search input and quick tags before the user enters a query.',
          ko: '검색어 입력 전 검색창과 빠른 태그를 제공합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/10-smart-guide-search-empty.png',
      },
      {
        title: { en: 'Smart Guide Results', ko: 'Smart Guide 검색 결과' },
        desc: {
          en: 'Returns relevant contract clauses with highlighted query matches.',
          ko: '검색어와 일치하는 약관 조항을 하이라이트와 함께 보여줍니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/11-smart-guide-search-results.png',
      },
      {
        title: { en: 'Search Result PDF Highlight', ko: '검색 결과 PDF 하이라이트' },
        desc: {
          en: 'Connects Smart Guide search results back to exact PDF evidence.',
          ko: 'Smart Guide 검색 결과를 정확한 PDF 근거 위치로 연결합니다.',
        },
        imagePath: '/images/easy-contract-viewer/android-screens/12-smart-guide-result-pdf-highlight.png',
      },
    ],
  },
  {
    id: 'fiet-fitness-trainer',
    type: 'tablet',
    title: { en: 'FIET Fitness Trainer', ko: '피에트 피트니스 트레이너' },
    subtitle: { en: 'Trainer app for FIET Fitness Center', ko: '피에트 피트니스 센터의 트레이너 전용 앱' },
    description: {
      en: 'A trainer-only app for FIET Fitness Center. Provides member management, workout program design, diet management, and weight data tracking in a tablet-optimized interface.',
      ko: '피에트 피트니스 센터의 트레이너 전용 앱입니다. 회원 관리, 운동 프로그램 설계, 식단 관리 및 체중 데이터 추적을 태블릿에 최적화된 인터페이스로 제공합니다.',
    },
    implementationPoints: [
      {
        en: 'Built tablet-first Flutter UI and reusable widgets for trainer workflows.',
        ko: '트레이너 업무 흐름에 맞춘 태블릿 우선 Flutter UI와 재사용 위젯을 구축했습니다.',
      },
      {
        en: 'Implemented BLE real-time data flow for scale and accelerometer devices.',
        ko: '체중계와 가속도 센서 연동을 위한 BLE 실시간 데이터 전송 흐름을 구현했습니다.',
      },
      {
        en: 'Automated mobile release pipeline with Fastlane and GitHub Actions.',
        ko: 'Fastlane과 GitHub Actions로 모바일 배포 자동화 파이프라인을 구축했습니다.',
      },
    ],
    techStack: ['Flutter', 'Dart', 'Firebase'],
    color: 'from-indigo-500 to-purple-500',
    iconType: 'dumbbell',
    screens: [
      {
        title: { en: 'Splash', ko: 'Splash' },
        desc: { en: 'App launch screen.', ko: '앱 시작 화면입니다.' },
        imagePath: '/images/fiet-fitness-trainer/Splash.png',
      },
      {
        title: { en: 'Result Report - InBody', ko: '결과 리포트 - 인바디' },
        desc: { en: 'Displays analyzed InBody measurement results.', ko: '회원의 인바디 측정 결과를 분석하여 표시합니다.' },
        imagePath: '/images/fiet-fitness-trainer/report-inbody.png',
        scrollable: true,
      },
      {
        title: { en: 'Result Report - FIET', ko: '결과 리포트 - 피에트' },
        desc: { en: 'Provides FIET Fitness comprehensive analysis report.', ko: '피에트 피트니스 종합 분석 리포트를 제공합니다.' },
        imagePath: '/images/fiet-fitness-trainer/report-fiet.png',
        scrollable: true,
      },
      {
        title: { en: 'Video Recording', ko: '동영상 촬영' },
        desc: { en: 'Screen for recording workout posture.', ko: '운동 자세 촬영 중인 화면입니다.' },
        imagePath: '/images/fiet-fitness-trainer/video-recording.png',
      },
      {
        title: { en: 'Video Playback', ko: '동영상 보기' },
        desc: { en: 'View recorded video vertically.', ko: '촬영된 동영상을 세로로 확인합니다.' },
        imagePath: '/images/fiet-fitness-trainer/video-vertical.png',
      },
      {
        title: { en: 'Photo Capture', ko: '사진 촬영' },
        desc: { en: 'Screen to view captured photos.', ko: '촬영된 사진을 확인하는 화면입니다.' },
        imagePath: '/images/fiet-fitness-trainer/photo-captured.png',
      },
    ],
  },
  {
    id: 'fiet-fitness-user',
    type: 'mobile',
    title: { en: 'FIET Fitness', ko: '피에트 피트니스' },
    subtitle: { en: 'A new concept fitness center by an AI health company', ko: 'AI 건강 관리 회사가 만든 새로운 개념의 피트니스 센터' },
    description: {
      en: 'A fitness center app by an AI health company. Syncs with trainers to view customized workout programs and diet plans, and tracks progress.',
      ko: 'AI 건강 관리 회사가 만든 새로운 개념의 피트니스 센터 앱입니다. 트레이너와 연동하여 맞춤형 운동 프로그램과 식단을 확인하고 진행 상황을 기록합니다.',
    },
    implementationPoints: [
      {
        en: 'Implemented workout and diet tracking screens with Flutter state-driven UI.',
        ko: 'Flutter 상태 기반 UI로 운동/식단 추적 화면을 구현했습니다.',
      },
      {
        en: 'Integrated push notification workflow with Firebase Cloud Messaging.',
        ko: 'Firebase Cloud Messaging 기반 푸시 알림 워크플로를 연동했습니다.',
      },
      {
        en: 'Built chart-driven views for water intake and weight progress history.',
        ko: '수분 섭취와 체중 변화 이력을 차트 중심 화면으로 시각화했습니다.',
      },
    ],
    techStack: ['Flutter', 'Dart', 'Firebase'],
    color: 'from-violet-500 to-fuchsia-500',
    iconType: 'dumbbell',
    screens: [
      {
        title: { en: 'Splash', ko: 'Splash' },
        desc: { en: 'App launch screen.', ko: '앱 시작 화면입니다.' },
        imagePath: '/images/fiet-fitness-user/Splash.png',
      },
      {
        title: { en: 'Record', ko: '기록하기' },
        desc: { en: 'Screen for recording workouts and activities.', ko: '운동 및 활동을 기록하는 화면입니다.' },
        imagePath: '/images/fiet-fitness-user/record.png',
      },
      {
        title: { en: 'Water Intake', ko: '수분 섭취' },
        desc: { en: 'Record and check daily water intake.', ko: '일일 수분 섭취량을 기록하고 확인합니다.' },
        imagePath: '/images/fiet-fitness-user/water.png',
        scrollable: true,
      },
      {
        title: { en: 'Diet', ko: '식단' },
        desc: { en: 'View and manage diet information.', ko: '식단 정보를 확인하고 관리합니다.' },
        imagePath: '/images/fiet-fitness-user/diet.png',
        scrollable: true,
      },
      {
        title: { en: 'Notifications', ko: '알림' },
        desc: { en: 'Screen to check app notifications.', ko: '앱 알림을 확인하는 화면입니다.' },
        imagePath: '/images/fiet-fitness-user/notification.png',
        scrollable: true,
      },
      {
        title: { en: 'Weight', ko: '체중' },
        desc: { en: 'Track weight changes with graphs.', ko: '체중 변화를 추적하고 그래프로 확인합니다.' },
        imagePath: '/images/fiet-fitness-user/weight.png',
        scrollable: true,
      },
    ],
  },
  {
    id: 'local-mobile-rag-gemma',
    type: 'package',
    title: { en: 'mobile_rag_engine', ko: 'mobile_rag_engine' },
    releaseLabel: { en: 'pub.dev 0.18.6', ko: 'pub.dev 0.18.6' },
    subtitle: {
      en: 'Published Flutter package for fully local RAG on mobile',
      ko: '모바일에서 완전 로컬 RAG를 실행하는 Flutter 패키지',
    },
    description: {
      en: 'A published Flutter package that adds on-device document search and RAG to Flutter apps without uploading documents to a server.',
      ko: 'Flutter 앱에 서버 업로드 없는 온디바이스 문서 검색과 RAG 기능을 붙일 수 있는 공개 Flutter 패키지입니다.',
    },
    implementationPoints: [
      {
        en: 'Published mobile_rag_engine 0.18.6 with Flutter-facing APIs, examples, docs, and release packaging.',
        ko: 'Flutter 공개 API, 예제, 문서, 릴리스 패키징을 포함해 mobile_rag_engine 0.18.6을 배포했습니다.',
      },
      {
        en: 'Split product-facing API work from the native hot path: Flutter facade, Dart orchestration, and Rust FFI core.',
        ko: '제품 API 계층과 네이티브 hot path를 분리해 Flutter facade, Dart orchestration, Rust FFI core로 구성했습니다.',
      },
      {
        en: 'Built the ingest path: document parsing, chunk metadata, ONNX embeddings, SQLite persistence, and index writes.',
        ko: '문서 파싱, 청크 메타데이터, ONNX 임베딩, SQLite 저장, 색인 write까지 인제스트 경로를 구현했습니다.',
      },
      {
        en: 'Built the query path: query embedding, HNSW vector search, BM25 sparse retrieval, fusion, and context assembly.',
        ko: '질의 임베딩, HNSW 벡터 검색, BM25 sparse 검색, 후보 결합, context assembly까지 쿼리 경로를 구현했습니다.',
      },
      {
        en: 'Kept the package reusable for product work such as Easy Contract Viewer, where local indexing and source-grounded context are core features.',
        ko: 'Easy Contract Viewer 같은 제품에서 로컬 색인과 원문 기반 context 생성을 재사용할 수 있는 기반 기술로 구성했습니다.',
      },
    ],
    audienceOverrides: {
      client: {
        variant: 'architecture',
        thumbnailScreenIndex: 1,
        description: {
          en: 'A published Flutter package for adding private, product-ready local retrieval and RAG to mobile apps without uploading documents to a server.',
          ko: '문서를 서버에 업로드하지 않고 모바일 앱에 비공개 로컬 검색과 제품화 가능한 RAG 기능을 붙이는 공개 Flutter 패키지입니다.',
        },
        evidenceBadges: ['pub.dev 0.18.6', 'GitHub', 'on-device RAG', 'product-ready local retrieval'],
        highlight: {
          en: 'Reusable foundation for products like Easy Contract Viewer: local document indexing, retrieval, and LLM-ready context inside the app.',
          ko: 'Easy Contract Viewer 같은 제품에 재사용 가능한 기반 기술입니다. 앱 내부에서 로컬 문서 색인, 검색, LLM-ready context 생성을 처리합니다.',
        },
      },
      developer: {
        variant: 'architecture',
        thumbnailScreenIndex: 1,
        description: {
          en: 'On-device RAG package architecture: Flutter facade, Dart orchestration, Rust FFI core, ONNX runtime, SQLite store, and HNSW/BM25 retrieval paths.',
          ko: 'Flutter facade, Dart orchestration, Rust FFI core, ONNX runtime, SQLite store, HNSW/BM25 검색 경로로 나뉜 온디바이스 RAG 패키지 아키텍처입니다.',
        },
        evidenceBadges: ['Flutter API', 'Dart orchestration', 'Rust FFI', 'ONNX', 'SQLite', 'HNSW/BM25'],
        highlight: {
          en: 'Flutter API over Dart orchestration, Rust FFI search core, ONNX embeddings, SQLite storage, and HNSW/BM25 retrieval paths.',
          ko: 'Flutter API, Dart orchestration, Rust FFI 검색 코어, ONNX 임베딩, SQLite 저장소, HNSW/BM25 검색 경로로 구성했습니다.',
        },
      },
    },
    techStack: ['Flutter', 'Dart', 'Rust FFI', 'ONNX Runtime', 'SQLite', 'HNSW/BM25'],
    evidenceBadges: ['pub.dev', 'GitHub', 'Rust FFI', 'ONNX', 'HNSW/BM25'],
    color: 'from-blue-500 to-cyan-400',
    iconType: 'brain',
    screens: [
      {
        title: { en: 'Package Overview', ko: '패키지 개요' },
        desc: {
          en: 'mobile_rag_engine is a pub.dev package for Flutter apps that need local document search, retrieval, and LLM-ready context on the device.',
          ko: 'mobile_rag_engine은 Flutter 앱 안에서 로컬 문서 검색, retrieval, LLM-ready context 생성을 처리하는 pub.dev 공개 패키지입니다.',
        },
        imagePath: {
          en: '/images/mobile-rag-engine/problem.svg',
          ko: '/images/mobile-rag-engine/problem.ko.svg',
        },
      },
      {
        title: { en: 'Architecture', ko: '아키텍처' },
        desc: {
          en: 'The package is split into Flutter facade, Dart orchestration, Rust FFI search core, ONNX embedding runtime, SQLite chunk/index store, and HNSW/BM25 retrieval paths.',
          ko: '패키지는 Flutter facade, Dart orchestration, Rust FFI search core, ONNX embedding runtime, SQLite chunk/index store, HNSW/BM25 retrieval path로 나뉩니다.',
        },
        imagePath: {
          en: '/images/mobile-rag-engine/architecture.svg',
          ko: '/images/mobile-rag-engine/architecture.ko.svg',
        },
      },
      {
        title: { en: 'Integration Flow', ko: '연동 흐름' },
        desc: {
          en: 'It enables apps to ingest documents locally, write chunks and indexes, run HNSW/BM25 retrieval, and pass grounded context into product features.',
          ko: '앱이 문서를 로컬에서 인제스트하고, chunk/index를 저장하고, HNSW/BM25 검색을 실행한 뒤 제품 기능에 근거 context를 넘길 수 있게 합니다.',
        },
        imagePath: {
          en: '/images/mobile-rag-engine/retrieval-flows.svg',
          ko: '/images/mobile-rag-engine/retrieval-flows.ko.svg',
        },
      },
    ],
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/dev07060/mobile_rag_engine',
      },
      {
        label: 'pub.dev',
        url: 'https://pub.dev/packages/mobile_rag_engine',
      },
    ],
  },
  {
    id: 'motgo',
    type: 'web',
    title: { en: 'Motgo\nRestaurant Voting', ko: 'Motgo\n맛집 투표 서비스' },
    subtitle: { en: 'Vote and share restaurants with friends', ko: '친구들과 함께 찾은 맛집을 투표하고 공유하는 서비스' },
    description: {
      en: 'A web service that automatically fetches restaurant info from Naver Map URLs, allowing friends to vote together. Provides real-time voting status and result analysis.',
      ko: '네이버 지도 URL을 붙여넣으면 맛집 정보를 자동으로 불러오고, 친구들과 함께 투표할 수 있는 웹 서비스입니다. 실시간 투표 현황과 결과 분석 기능을 제공합니다.',
    },
    implementationPoints: [
      {
        en: 'Built real-time voting flow with Next.js and TypeScript plus shareable links.',
        ko: 'Next.js와 TypeScript로 실시간 투표 흐름과 공유 링크 기능을 구현했습니다.',
      },
      {
        en: 'Automated restaurant metadata extraction pipeline from Naver Map URLs.',
        ko: '네이버 지도 URL에서 맛집 메타데이터를 자동 수집하는 파이프라인을 구축했습니다.',
      },
      {
        en: 'Used Supabase(PostgreSQL) for vote persistence and Playwright for E2E checks.',
        ko: 'Supabase(PostgreSQL)로 투표 데이터를 관리하고 Playwright로 E2E 검증을 구성했습니다.',
      },
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Supabase', 'Playwright'],
    color: 'from-purple-500 to-pink-500',
    iconType: 'utensils',
    screens: [
      {
        title: { en: 'Main Screen', ko: '메인 화면' },
        desc: { en: 'Main screen to start a new vote or join an existing one.', ko: '새로운 투표를 시작하거나 기존 투표에 참여할 수 있는 메인 화면입니다.' },
        imagePath: '/images/motgo/first-main-screen.png',
      },
      {
        title: { en: 'Copy Share Link', ko: '공유 링크 복사' },
        desc: { en: 'Copy the voting link to share with friends.', ko: '친구들과 공유할 수 있는 투표 링크를 복사합니다.' },
        imagePath: '/images/motgo/copy-sharing-url.png',
      },
      {
        title: { en: 'Enter URL', ko: 'URL 입력' },
        desc: { en: 'Enter Naver Map URL to add restaurant candidates.', ko: '네이버 지도 URL을 입력하여 맛집 후보를 추가합니다.' },
        imagePath: '/images/motgo/set-urls.png',
      },
      {
        title: { en: 'Fetch Restaurant Info', ko: '맛집 정보 불러오기' },
        desc: { en: 'Automatically scrapes restaurant info from the URL.', ko: '입력한 URL에서 맛집 정보를 자동으로 스크래핑합니다.' },
        imagePath: '/images/motgo/call-restaurant-infos.png',
      },
      {
        title: { en: 'Share Link', ko: '링크 공유' },
        desc: { en: 'Share the voting link via KakaoTalk, etc.', ko: '카카오톡 등으로 투표 링크를 친구들에게 공유합니다.' },
        imagePath: '/images/motgo/sharing-vote-link.png',
      },
      {
        title: { en: 'Voting Page', ko: '투표 페이지' },
        desc: { en: 'View restaurant candidates and vote for your choice.', ko: '맛집 후보들을 확인하고 원하는 곳에 투표합니다.' },
        imagePath: '/images/motgo/vote-page.png',
      },
      {
        title: { en: 'End Vote', ko: '투표 종료' },
        desc: { en: 'Close the vote and check results.', ko: '투표를 마감하고 결과를 확인합니다.' },
        imagePath: '/images/motgo/end-vote.png',
      },
      {
        title: { en: 'Result Page 1', ko: '결과 페이지 1' },
        desc: { en: 'View voting results by ranking.', ko: '투표 결과를 순위별로 확인할 수 있습니다.' },
        imagePath: '/images/motgo/result-page-1.png',
      },
      {
        title: { en: 'Result Page 2', ko: '결과 페이지 2' },
        desc: { en: 'Provides detailed voting statistics and analysis.', ko: '상세한 투표 통계와 분석 결과를 제공합니다.' },
        imagePath: '/images/motgo/result-page-2.png',
      },
    ],
  },
  {
    id: 'haru-check',
    type: 'mobile',
    title: { en: 'HaruCheck', ko: 'HaruCheck' },
    subtitle: { en: 'AI-based health habit tracking and analysis service', ko: 'AI 기반 건강 습관 추적 및 분석 서비스' },
    description: {
      en: 'A health management app that records daily workout/diet certifications and provides AI weekly reports using Google VertexAI (Gemini). Supports calendar-based tracking and interactive data visualization.',
      ko: '일일 운동/식단 인증을 기록하고, Google VertexAI (Gemini)를 활용한 AI 주간 리포트를 제공하는 건강 관리 앱입니다. 캘린더 기반 추적과 인터랙티브 데이터 시각화를 지원합니다.',
    },
    implementationPoints: [
      {
        en: 'Built certification tracking UX with Flutter and Riverpod state architecture.',
        ko: 'Flutter + Riverpod 상태 아키텍처로 인증 기록 UX를 구현했습니다.',
      },
      {
        en: 'Generated weekly AI reports using Vertex AI (Gemini) with Cloud Functions.',
        ko: 'Cloud Functions와 Vertex AI(Gemini) 연동으로 주간 AI 리포트 생성 파이프라인을 구축했습니다.',
      },
      {
        en: 'Designed Firebase data model for calendar history and social feed features.',
        ko: '캘린더 히스토리와 소셜 피드 기능을 위한 Firebase 데이터 모델을 설계했습니다.',
      },
    ],
    techStack: ['Flutter', 'Firebase', 'Firestore', 'VertexAI', 'Riverpod', 'Cloud Functions'],
    color: 'from-orange-500 to-red-400',
    iconType: 'activity',
    screens: [
      {
        title: { en: 'Add Certification 1', ko: '인증 추가 1' },
        desc: { en: 'Record workout or diet certification with photos.', ko: '운동 또는 식단 인증을 사진과 함께 기록합니다.' },
        imagePath: '/images/haru-check/add_cert_1.png',
      },
      {
        title: { en: 'Add Certification 2', ko: '인증 추가 2' },
        desc: { en: 'Enter certification details.', ko: '인증 상세 정보를 입력합니다.' },
        imagePath: '/images/haru-check/add_cert_2.png',
      },
      {
        title: { en: 'Certification List', ko: '인증 목록' },
        desc: { en: 'Check certification records by date on calendar.', ko: '캘린더 기반으로 날짜별 인증 기록을 확인합니다.' },
        imagePath: '/images/haru-check/certs.png',
      },
      {
        title: { en: 'Certification Detail', ko: '인증 상세' },
        desc: { en: 'View individual certification details.', ko: '개별 인증의 상세 정보를 확인합니다.' },
        imagePath: '/images/haru-check/cert_detail.png',
      },
      {
        title: { en: 'Report Loading', ko: '리포트 로딩' },
        desc: { en: 'AI analyzes weekly data to generate report.', ko: 'AI가 주간 데이터를 분석하여 리포트를 생성합니다.' },
        imagePath: '/images/haru-check/load_report.png',
      },
      {
        title: { en: 'AI Report 1', ko: 'AI 리포트 1' },
        desc: { en: 'Visualizes workout frequency and category distribution.', ko: '운동 빈도와 카테고리 분포를 차트로 시각화합니다.' },
        imagePath: '/images/haru-check/report_1.png',
      },
      {
        title: { en: 'AI Report 2', ko: 'AI 리포트 2' },
        desc: { en: 'Analyzes weekly activity patterns.', ko: '주간 활동 패턴을 분석합니다.' },
        imagePath: '/images/haru-check/report_2.png',
      },
      {
        title: { en: 'AI Report 3', ko: 'AI 리포트 3' },
        desc: { en: 'Provides nutrition balance analysis.', ko: '영양 균형 분석 결과를 제공합니다.' },
        imagePath: '/images/haru-check/report_3.png',
      },
      {
        title: { en: 'AI Report 4', ko: 'AI 리포트 4' },
        desc: { en: 'Provides personalized feedback on strengths and improvements.', ko: '강점과 개선점을 포함한 맞춤형 피드백을 제공합니다.' },
        imagePath: '/images/haru-check/report_4.png',
      },
      {
        title: { en: 'AI Report 5', ko: 'AI 리포트 5' },
        desc: { en: 'Provides suggestions for next week\'s goals.', ko: '다음 주 목표 설정을 위한 제안을 제공합니다.' },
        imagePath: '/images/haru-check/report_5.png',
      },
      {
        title: { en: 'User List', ko: '사용자 목록' },
        desc: { en: 'Social feed to view other users\' certifications.', ko: '다른 사용자들의 인증 기록을 확인할 수 있는 소셜 피드입니다.' },
        imagePath: '/images/haru-check/user_list.png',
      },
    ],
    links: [
      {
        label: 'Live Site',
        url: 'https://seol-haru-check.web.app',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/dev07060/seol_haru_check',
      },
    ],
  },
  {
    id: 'weedool',
    type: 'mobile',
    title: { en: 'Weedool (TuringBio)', ko: 'Weedool (TuringBio)' },
    subtitle: { en: 'Digital therapy service using Behavioral Activation', ko: 'BA 활용 디지털 치료 서비스' },
    description: {
      en: 'A digital therapy-oriented service using Behavioral Activation (BA) techniques. Provides emotion selection, BA recommendations, status monitoring, and counseling center information.',
      ko: 'BA(행동 활성화) 기법을 활용한 디지털 치료 지향 서비스입니다. 감정 선택, BA 추천, 상태 모니터링, 심리 상담 센터 소개 등의 기능을 제공합니다.',
    },
    implementationPoints: [
      {
        en: 'Implemented counseling and activity flows with Flutter, Riverpod, and GoRouter.',
        ko: 'Flutter + Riverpod + GoRouter로 상담/활동 플로우를 구현했습니다.',
      },
      {
        en: 'Integrated Naver Map API and analytics events for counseling center discovery.',
        ko: 'Naver Map API와 분석 이벤트를 연동해 상담센터 탐색 흐름을 구성했습니다.',
      },
      {
        en: 'Optimized behavior tracking and interaction metrics with Google Analytics.',
        ko: 'Google Analytics 기반 행동 데이터 추적으로 사용자 상호작용 지표를 개선했습니다.',
      },
    ],
    techStack: ['Flutter', 'Riverpod', 'GoRouter', 'Naver Map API', 'Google Analytics'],
    color: 'from-teal-500 to-green-400',
    iconType: 'heart',
    screens: [
      {
        title: { en: 'Personalized AI Mind Care', ko: '맞춤형 AI 마음관리' },
        desc: { en: 'Weedoo Life, a personalized AI mind care service for daily life.', ko: '일상에서 함께하는 맞춤형 AI 마음관리 서비스, 위들라이프입니다.' },
        imagePath: '/images/weedool/unnamed-2.png',
      },
      {
        title: { en: 'Heal Mind with Activities', ko: '활동으로 마음 회복' },
        desc: { en: 'Provides activity recommendation programs validated through clinical trials.', ko: '임상적 실험과 논문을 통해 검증된 활동 추천 프로그램을 제공합니다.' },
        imagePath: '/images/weedool/unnamed-3.png',
      },
      {
        title: { en: 'AI Custom Activity Routine', ko: 'AI 맞춤형 활동 루틴' },
        desc: { en: 'AI suggests personalized activities based on analysis.', ko: '분석 결과를 바탕으로 AI가 나만의 활동을 제안해요.' },
        imagePath: '/images/weedool/unnamed-4.png',
      },
      {
        title: { en: 'Post-Activity Record', ko: '활동 후 기록' },
        desc: { en: 'Naturally record your changes and day with photos and thoughts.', ko: '나의 변화와 하루를 자연스럽게 기록하고, 사진과 소감을 남겨보세요.' },
        imagePath: '/images/weedool/unnamed-5.png',
      },
      {
        title: { en: 'Chat with AI', ko: 'AI와 대화' },
        desc: { en: 'Share your feelings comfortably anytime. Chat with AI to share your heart.', ko: '언제든 편안하게 감정을 털어놓을 수 있어요. AI와 대화하며 마음을 나눠요.' },
        imagePath: '/images/weedool/unnamed-6.png',
      },
      {
        title: { en: 'Emotion/Behavior Report', ko: '감정/행동 리포트' },
        desc: { en: 'Check how your mind has changed through emotion and behavior reports.', ko: '내 마음이 어떻게 달라졌는지 감정과 행동의 변화를 리포트로 확인해요.' },
        imagePath: '/images/weedool/unnamed-7.png',
      },
    ],
    links: [
      {
        label: 'Google Play Store',
        url: 'https://play.google.com/store/apps/details?id=com.turingbio.trb_weedool_school_app',
      },
      {
        label: 'iOS App Store',
        url: 'https://apps.apple.com/kr/app/%EC%9C%84%EB%91%98-weedool/id6744308822',
      },
    ],
  },
];
