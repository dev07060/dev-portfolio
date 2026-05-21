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
    type: 'mobile',
    title: { en: 'Local Mobile RAG Gemma', ko: 'Local Mobile RAG Gemma' },
    releaseLabel: { en: 'Released v0.18.5', ko: 'v0.18.5 배포' },
    subtitle: { en: 'Local On-device Mobile RAG Engine with Gemma 3n (Released to v0.18.5)', ko: 'Gemma 3n 기반 로컬 온디바이스 모바일 RAG 엔진 (v0.18.5 배포)' },
    description: {
      en: 'Implemented a mobile RAG engine that runs fast on local devices and released it through v0.18.5. Uses Gemma 3n to store models locally and provides answers to user questions.',
      ko: '로컬 디바이스에서 빠르게 실행되는 모바일 RAG 엔진을 구현하고 v0.18.5까지 배포했습니다. Gemma 3n을 사용하여 모델을 로컬에 저장하고, 사용자의 질문에 대한 답변을 제공합니다.',
    },
    implementationPoints: [
      {
        en: 'Connected Flutter and Rust through FFI for on-device RAG orchestration.',
        ko: 'Flutter와 Rust FFI를 연결해 온디바이스 RAG 실행 파이프라인을 구성했습니다.',
      },
      {
        en: 'Ran local inference with ONNX Runtime and optimized tokenization path.',
        ko: 'ONNX Runtime 기반 로컬 추론과 토크나이징 경로 최적화를 적용했습니다.',
      },
      {
        en: 'Implemented SQLite + HNSW + BM25 hybrid retrieval with PDF/DOCX ingestion for fast local document search.',
        ko: 'SQLite + HNSW + BM25 하이브리드 검색과 PDF/DOCX 추출 파이프라인으로 빠른 로컬 문서 검색을 구현했습니다.',
      },
      {
        en: 'Optimized retrieval hot path with zero-copy embedding transport (TransferableTypedData) and preserved BM25 rankings through term indexes.',
        ko: 'Zero-copy 임베딩 전송(TransferableTypedData)과 term index 기반 BM25 랭킹 보존으로 검색 hot path를 최적화했습니다.',
      },
      {
        en: 'Packaged and released mobile_rag_engine up to v0.18.5 on pub.dev.',
        ko: 'mobile_rag_engine을 pub.dev에 v0.18.5까지 패키징 및 배포했습니다.',
      },
    ],
    techStack: ['Flutter', 'Rust', 'ONNX Runtime', 'SQLite', 'HNSW', 'BM25'],
    color: 'from-blue-500 to-cyan-400',
    iconType: 'brain',
    screens: [
      {
        title: { en: 'Start Chat', ko: '채팅 시작' },
        desc: { en: 'Start a new chat.', ko: '새로운 채팅을 시작' },
        imagePath: '/images/local-mobile-rag-gemma/start-new-chat.png',
      },
      {
        title: { en: 'Add Document', ko: '문서 추가' },
        desc: { en: 'Add documents to generate vector embeddings for model training.', ko: '문서를 추가하여 모델 학습을 위해 vector embedding을 생성합니다.' },
        imagePath: '/images/local-mobile-rag-gemma/add-document.png',
      },
      {
        title: { en: 'Chat Response', ko: '채팅 응답' },
        desc: { en: 'Provides answers using the local model.', ko: '로컬 모델을 사용하여 사용자의 질문에 대한 답변을 제공합니다.' },
        imagePath: '/images/local-mobile-rag-gemma/output-1.png',
      },
      {
        title: { en: 'Chat Response', ko: '채팅 응답' },
        desc: { en: 'Provides answers using the local model.', ko: '로컬 모델을 사용하여 사용자의 질문에 대한 답변을 제공합니다.' },
        imagePath: '/images/local-mobile-rag-gemma/output-2.png',
      },
      {
        title: { en: 'RAG Search Test', ko: 'RAG 검색 테스트' },
        desc: { en: 'Tests the document search functionality of the RAG engine.', ko: 'RAG 엔진의 문서 검색 기능을 테스트합니다.' },
        imagePath: '/images/local-mobile-rag-gemma/rag-search-test.png',
      },
      {
        title: { en: 'RAG Quality Test', ko: 'RAG 품질 테스트' },
        desc: { en: 'Evaluates the response quality of the RAG engine.', ko: 'RAG 엔진의 응답 품질을 평가합니다.' },
        imagePath: '/images/local-mobile-rag-gemma/rag-qulity-test.png',
      },
      {
        title: { en: 'RAG Performance Benchmark', ko: 'RAG 성능 벤치마크' },
        desc: { en: 'Benchmarks the performance of the RAG engine.', ko: 'RAG 엔진의 성능을 벤치마크합니다.' },
        imagePath: '/images/local-mobile-rag-gemma/rag-performance-benchmark.png',
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
