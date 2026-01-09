import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'fiet-fitness-trainer',
    type: 'tablet',
    title: { en: 'FIET Fitness Trainer', ko: '피에트 피트니스 트레이너' },
    subtitle: { en: 'Trainer app for FIET Fitness Center', ko: '피에트 피트니스 센터의 트레이너 전용 앱' },
    description: {
      en: 'A trainer-only app for FIET Fitness Center. Provides member management, workout program design, diet management, and weight data tracking in a tablet-optimized interface.',
      ko: '피에트 피트니스 센터의 트레이너 전용 앱입니다. 회원 관리, 운동 프로그램 설계, 식단 관리 및 체중 데이터 추적을 태블릿에 최적화된 인터페이스로 제공합니다.',
    },
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
    links: [
      {
        label: 'Google Play Store',
        url: 'https://play.google.com/store/apps/details?id=net.fiet.mvm_trainer&hl=ko',
      },
      {
        label: 'iOS App Store',
        url: 'https://apps.apple.com/kr/app/%ED%94%BC%EC%97%90%ED%8A%B8-%ED%94%BC%ED%8A%B8%EB%8B%88%EC%8A%A4-%ED%8A%B8%EB%A0%88%EC%9D%B4%EB%84%88/id6670158561',
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
    links: [
      {
        label: 'Google Play Store',
        url: 'https://play.google.com/store/apps/details?id=net.fiet.mvm_member&hl=ko',
      },
      {
        label: 'iOS App Store',
        url: 'https://apps.apple.com/kr/app/%ED%94%BC%EC%97%90%ED%8A%B8-%ED%94%BC%ED%8A%B8%EB%8B%88%EC%8A%A4/id6670158395',
      },
    ],
  },
  {
    id: 'local-mobile-rag-gemma',
    type: 'mobile',
    title: { en: 'Local Mobile RAG Gemma', ko: 'Local Mobile RAG Gemma' },
    subtitle: { en: 'Local On-device Mobile RAG Engine with Gemma 3n', ko: 'Gemma 3n 기반 로컬 온디바이스 모바일 RAG 엔진' },
    description: {
      en: 'Implemented a mobile RAG engine that runs fast on local devices. Uses Gemma 3n to store models locally and provides answers to user questions.',
      ko: '로컬 디바이스에서 빠르게 실행되는 모바일 RAG 엔진을 구현했습니다. Gemma 3n을 사용하여 모델을 로컬에 저장하고, 사용자의 질문에 대한 답변을 제공합니다.',
    },
    techStack: ['Flutter', 'Rust', 'ONNX Runtime', 'SQLite', 'HNSW'],
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
        url: 'https://github.com/dev07060/mobile_rag_engine/blob/main/docs/guides/architecture_guide.md',
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
    links: [
      {
        label: 'Live Site',
        url: 'https://motgo-271951071528.asia-northeast3.run.app/',
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
