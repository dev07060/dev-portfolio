import { Project } from '@/types/project';

export const projects: Project[] = [
    {
    id: 'fiet-fitness-trainer',
    type: 'tablet',
    title: '피에트 피트니스 트레이너',
    subtitle: '피에트 피트니스 센터의 트레이너 전용 앱',
    description:
      '피에트 피트니스 센터의 트레이너 전용 앱입니다. 회원 관리, 운동 프로그램 설계, 식단 관리 및 체중 데이터 추적을 태블릿에 최적화된 인터페이스로 제공합니다.',
    techStack: ['Flutter', 'Dart', 'Firebase'],
    color: 'from-indigo-500 to-purple-500',
    iconType: 'dumbbell',
    screens: [
      {
        title: 'Splash',
        desc: '앱 시작 화면입니다.',
        imagePath: '/images/fiet-fitness-trainer/Splash.png',
      },
      {
        title: '결과 리포트 - 인바디',
        desc: '회원의 인바디 측정 결과를 분석하여 표시합니다.',
        imagePath: '/images/fiet-fitness-trainer/report-inbody.png',
        scrollable: true,
      },
      {
        title: '결과 리포트 - 피에트',
        desc: '피에트 피트니스 종합 분석 리포트를 제공합니다.',
        imagePath: '/images/fiet-fitness-trainer/report-fiet.png',
        scrollable: true,
      },
      {
        title: '동영상 촬영',
        desc: '운동 자세 촬영 중인 화면입니다.',
        imagePath: '/images/fiet-fitness-trainer/video-recording.png',
      },
      {
        title: '동영상 보기',
        desc: '촬영된 동영상을 세로로 확인합니다.',
        imagePath: '/images/fiet-fitness-trainer/video-vertical.png',
      },
      {
        title: '사진 촬영',
        desc: '촬영된 사진을 확인하는 화면입니다.',
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
    title: '피에트 피트니스',
    subtitle: 'AI 건강 관리 회사가 만든 새로운 개념의 피트니스 센터',
    description:
      'AI 건강 관리 회사가 만든 새로운 개념의 피트니스 센터 앱입니다. 트레이너와 연동하여 맞춤형 운동 프로그램과 식단을 확인하고 진행 상황을 기록합니다.',
    techStack: ['Flutter', 'Dart', 'Firebase'],
    color: 'from-violet-500 to-fuchsia-500',
    iconType: 'dumbbell',
    screens: [
      {
        title: 'Splash',
        desc: '앱 시작 화면입니다.',
        imagePath: '/images/fiet-fitness-user/Splash.png',
      },
      {
        title: '기록하기',
        desc: '운동 및 활동을 기록하는 화면입니다.',
        imagePath: '/images/fiet-fitness-user/record.png',
      },
      {
        title: '수분 섭취',
        desc: '일일 수분 섭취량을 기록하고 확인합니다.',
        imagePath: '/images/fiet-fitness-user/water.png',
        scrollable: true,
      },
      {
        title: '식단',
        desc: '식단 정보를 확인하고 관리합니다.',
        imagePath: '/images/fiet-fitness-user/diet.png',
        scrollable: true,
      },
      {
        title: '알림',
        desc: '앱 알림을 확인하는 화면입니다.',
        imagePath: '/images/fiet-fitness-user/notification.png',
        scrollable: true,
      },
      {
        title: '체중',
        desc: '체중 변화를 추적하고 그래프로 확인합니다.',
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
    id: 'wantrip-curator-web',
    type: 'web',
    title: 'Wantrip Curator\n여행 큐레이터 웹',
    subtitle: '맞춤형 여행 플래닝 큐레이터용 웹 서비스',
    description:
      '여행 큐레이터가 고객의 요청을 받아 맞춤형 여행 플랜을 제공하는 웹 서비스입니다. 고객 매칭, 실시간 채팅, 견적서 작성 및 전송, 플랜 확정, 예약 대행까지 여행 큐레이팅의 전체 플로우를 지원합니다.',
    techStack: ['TypeScript', 'Vue', 'Nuxt.js', 'PostgreSQL', 'NestJS'],
    color: 'from-sky-500 to-blue-500',
    iconType: 'globe',
    screens: [
      {
        title: '매칭 전',
        desc: '새로운 고객 요청을 확인하고 매칭을 기다리는 대시보드 화면입니다.',
        imagePath: '/images/wantrip-curator-web/매칭 전.png',
        scrollable: true,
      },
      {
        title: '대화',
        desc: '고객과 실시간으로 소통하며 여행 요구사항을 파악하는 채팅 화면입니다.',
        imagePath: '/images/wantrip-curator-web/대화.png',
      },
      {
        title: '견적서 작성',
        desc: '고객 요구에 맞는 여행 플랜과 비용을 정리하여 견적서를 작성합니다.',
        imagePath: '/images/wantrip-curator-web/견적서 작성.png',
        scrollable: true,
      },
      {
        title: '견적서 전송',
        desc: '작성된 견적서를 고객에게 전송하여 확인을 요청합니다.',
        imagePath: '/images/wantrip-curator-web/견적서 전송.png',
      },
      {
        title: '플랜 확정',
        desc: '고객이 승인한 여행 플랜을 최종 확정하는 화면입니다.',
        imagePath: '/images/wantrip-curator-web/플랜 확정.png',
        scrollable: true,
      },
      {
        title: '매칭완료 (예약 대행)',
        desc: '매칭이 완료되고 항공권, 숙소 등 예약을 대행하는 화면입니다.',
        imagePath: '/images/wantrip-curator-web/매칭완료(예약 대행).png',
        scrollable: true,
      },
      {
        title: '내 여행',
        desc: '진행 중인 여행 목록과 상태를 관리하는 화면입니다.',
        imagePath: '/images/wantrip-curator-web/내 여행.png',
      },
      {
        title: '여행 완료',
        desc: '여행이 완료되고 고객 리뷰까지 작성된 최종 완료 화면입니다.',
        imagePath: '/images/wantrip-curator-web/여행 완료(리뷰 작성까지 완료).png',
        scrollable: true,
      },
    ],
    links: [
      {
        label: 'Live Site',
        url: 'https://www.wantrip.kr',
      },
    ],
  },
  {
    id: 'wantrip-user-mobile',
    type: 'mobile',
    title: 'Wantrip User\n여행자 앱',
    subtitle: '맞춤형 여행 플래닝 사용자용 모바일 앱',
    description:
      '여행자가 큐레이터에게 맞춤형 여행 플랜을 요청하고 관리하는 모바일 앱입니다. 큐레이션 상세 확인, 견적서 검토, 예약금/잔금 결제, 여행 일정 확인, 후기 작성까지 전체 여행 플로우를 지원합니다.',
    techStack: ['TypeScript', 'Vue', 'Nuxt.js', 'PostgreSQL', 'NestJS'],
    color: 'from-cyan-500 to-teal-500',
    iconType: 'smartphone',
    screens: [
      {
        title: '큐레이션 상세',
        desc: '큐레이터가 제공하는 여행 큐레이션 상세 정보를 확인합니다.',
        imagePath: '/images/watrip-user-mobile/큐레이션 상세페이지.png',
        scrollable: true,
      },
      {
        title: '매칭중인 견적서 목록',
        desc: '현재 매칭 진행 중인 견적서 목록을 확인합니다.',
        imagePath: '/images/watrip-user-mobile/_매칭중인 견적서 목록.png',
        scrollable: true,
      },
      {
        title: '제시한 견적서',
        desc: '큐레이터가 제시한 견적서 상세 내용을 확인합니다.',
        imagePath: '/images/watrip-user-mobile/제시한 견적서.png',
        scrollable: true,
      },
      {
        title: '견적서 전송',
        desc: '큐레이터가 전송한 견적서를 확인합니다.',
        imagePath: '/images/watrip-user-mobile/견적서 전송.png',
        scrollable: true,
      },
      {
        title: '매칭완료 견적서',
        desc: '매칭이 완료된 견적서로, 잔금 결제 전 상태입니다.',
        imagePath: '/images/watrip-user-mobile/매칭완료 견적서(잔금 결제 전).png',
        scrollable: true,
      },
      {
        title: '여행자 정보',
        desc: '여행자 정보를 입력하고 관리하는 화면입니다.',
        imagePath: '/images/watrip-user-mobile/여행자 정보.png',
        scrollable: true,
      },
      {
        title: '예약금 결제 페이지',
        desc: '예약금을 결제하기 위한 결제 정보 입력 화면입니다.',
        imagePath: '/images/watrip-user-mobile/예약금 결제 페이지.png',
        scrollable: true,
      },
      {
        title: 'KG 결제',
        desc: 'KG이니시스를 통한 결제 진행 화면입니다.',
        imagePath: '/images/watrip-user-mobile/KG 결제.png',
      },
      {
        title: '잔금 결제 요청',
        desc: '잔금 결제 요청을 받은 화면입니다.',
        imagePath: '/images/watrip-user-mobile/잔금 결제 요청.png',
      },
      {
        title: '쪽지',
        desc: '큐레이터와 주고받은 쪽지 목록을 확인합니다.',
        imagePath: '/images/watrip-user-mobile/쪽지.png',
        scrollable: true,
      },
      {
        title: '전체 금액 결제완료',
        desc: '전체 결제가 완료된 상태를 표시합니다.',
        imagePath: '/images/watrip-user-mobile/전체 금액 결제완료.png',
      },
      {
        title: '여행 일정',
        desc: '확정된 여행 일정을 상세하게 확인합니다.',
        imagePath: '/images/watrip-user-mobile/여행 일정.png',
        scrollable: true,
      },
      {
        title: '후기',
        desc: '여행 완료 후 후기를 확인하고 작성합니다.',
        imagePath: '/images/watrip-user-mobile/후기.png',
        scrollable: true,
      },
    ],
    links: [
      {
        label: 'Live Site',
        url: 'https://www.wantrip.kr',
      },
    ],
  },
  {
    id: 'local-mobile-rag-gemma',
    type: 'mobile',
    title: 'Local Mobile RAG Gemma',
    subtitle: 'Local On-device Mobile RAG Engine with Gemma 3n',
    description:
      '로컬 디바이스에서 빠르게 실행되는 모바일 RAG 엔진을 구현했습니다. Gemma 3n을 사용하여 모델을 로컬에 저장하고, 사용자의 질문에 대한 답변을 제공합니다.',
    techStack: ['Flutter', 'Rust', 'ONNX Runtime', 'SQLite', 'HNSW'],
    color: 'from-blue-500 to-cyan-400',
    iconType: 'brain',
    screens: [
      {
        title: '채팅 시작',
        desc: '새로운 채팅을 시작',
        imagePath: '/images/local-mobile-rag-gemma/start-new-chat.png',
      },
      {
        title: '문서 추가',
        desc: '문서를 추가하여 모델 학습을 위해 vector embedding을 생성합니다.',
        imagePath: '/images/local-mobile-rag-gemma/add-document.png',
      },
      {
        title: '채팅 응답',
        desc: '로컬 모델을 사용하여 사용자의 질문에 대한 답변을 제공합니다.',
        imagePath: '/images/local-mobile-rag-gemma/output-1.png',
      },
      {
        title: '채팅 응답',
        desc: '로컬 모델을 사용하여 사용자의 질문에 대한 답변을 제공합니다.',
        imagePath: '/images/local-mobile-rag-gemma/output-2.png',
      },
      {
        title: 'RAG 검색 테스트',
        desc: 'RAG 엔진의 문서 검색 기능을 테스트합니다.',
        imagePath: '/images/local-mobile-rag-gemma/rag-search-test.png',
      },
      {
        title: 'RAG 품질 테스트',
        desc: 'RAG 엔진의 응답 품질을 평가합니다.',
        imagePath: '/images/local-mobile-rag-gemma/rag-qulity-test.png',
      },
      {
        title: 'RAG 성능 벤치마크',
        desc: 'RAG 엔진의 성능을 벤치마크합니다.',
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
    title: 'Motgo\n맛집 투표 서비스',
    subtitle: '친구들과 함께 찾은 맛집을 투표하고 공유하는 서비스',
    description:
      '네이버 지도 URL을 붙여넣으면 맛집 정보를 자동으로 불러오고, 친구들과 함께 투표할 수 있는 웹 서비스입니다. 실시간 투표 현황과 결과 분석 기능을 제공합니다.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Supabase', 'Playwright'],
    color: 'from-purple-500 to-pink-500',
    iconType: 'utensils',
    screens: [
      {
        title: '메인 화면',
        desc: '새로운 투표를 시작하거나 기존 투표에 참여할 수 있는 메인 화면입니다.',
        imagePath: '/images/motgo/first-main-screen.png',
      },
      {
        title: '공유 링크 복사',
        desc: '친구들과 공유할 수 있는 투표 링크를 복사합니다.',
        imagePath: '/images/motgo/copy-sharing-url.png',
      },
      {
        title: 'URL 입력',
        desc: '네이버 지도 URL을 입력하여 맛집 후보를 추가합니다.',
        imagePath: '/images/motgo/set-urls.png',
      },
      {
        title: '맛집 정보 불러오기',
        desc: '입력한 URL에서 맛집 정보를 자동으로 스크래핑합니다.',
        imagePath: '/images/motgo/call-restaurant-infos.png',
      },
      {
        title: '링크 공유',
        desc: '카카오톡 등으로 투표 링크를 친구들에게 공유합니다.',
        imagePath: '/images/motgo/sharing-vote-link.png',
      },
      {
        title: '투표 페이지',
        desc: '맛집 후보들을 확인하고 원하는 곳에 투표합니다.',
        imagePath: '/images/motgo/vote-page.png',
      },
      {
        title: '투표 종료',
        desc: '투표를 마감하고 결과를 확인합니다.',
        imagePath: '/images/motgo/end-vote.png',
      },
      {
        title: '결과 페이지 1',
        desc: '투표 결과를 순위별로 확인할 수 있습니다.',
        imagePath: '/images/motgo/result-page-1.png',
      },
      {
        title: '결과 페이지 2',
        desc: '상세한 투표 통계와 분석 결과를 제공합니다.',
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
    title: 'HaruCheck',
    subtitle: 'AI 기반 건강 습관 추적 및 분석 서비스',
    description:
      '일일 운동/식단 인증을 기록하고, Google VertexAI (Gemini)를 활용한 AI 주간 리포트를 제공하는 건강 관리 앱입니다. 캘린더 기반 추적과 인터랙티브 데이터 시각화를 지원합니다.',
    techStack: ['Flutter', 'Firebase', 'Firestore', 'VertexAI', 'Riverpod', 'Cloud Functions'],
    color: 'from-orange-500 to-red-400',
    iconType: 'activity',
    screens: [
      {
        title: '인증 추가 1',
        desc: '운동 또는 식단 인증을 사진과 함께 기록합니다.',
        imagePath: '/images/haru-check/add_cert_1.png',
      },
      {
        title: '인증 추가 2',
        desc: '인증 상세 정보를 입력합니다.',
        imagePath: '/images/haru-check/add_cert_2.png',
      },
      {
        title: '인증 목록',
        desc: '캘린더 기반으로 날짜별 인증 기록을 확인합니다.',
        imagePath: '/images/haru-check/certs.png',
      },
      {
        title: '인증 상세',
        desc: '개별 인증의 상세 정보를 확인합니다.',
        imagePath: '/images/haru-check/cert_detail.png',
      },
      {
        title: '리포트 로딩',
        desc: 'AI가 주간 데이터를 분석하여 리포트를 생성합니다.',
        imagePath: '/images/haru-check/load_report.png',
      },
      {
        title: 'AI 리포트 1',
        desc: '운동 빈도와 카테고리 분포를 차트로 시각화합니다.',
        imagePath: '/images/haru-check/report_1.png',
      },
      {
        title: 'AI 리포트 2',
        desc: '주간 활동 패턴을 분석합니다.',
        imagePath: '/images/haru-check/report_2.png',
      },
      {
        title: 'AI 리포트 3',
        desc: '영양 균형 분석 결과를 제공합니다.',
        imagePath: '/images/haru-check/report_3.png',
      },
      {
        title: 'AI 리포트 4',
        desc: '강점과 개선점을 포함한 맞춤형 피드백을 제공합니다.',
        imagePath: '/images/haru-check/report_4.png',
      },
      {
        title: 'AI 리포트 5',
        desc: '다음 주 목표 설정을 위한 제안을 제공합니다.',
        imagePath: '/images/haru-check/report_5.png',
      },
      {
        title: '사용자 목록',
        desc: '다른 사용자들의 인증 기록을 확인할 수 있는 소셜 피드입니다.',
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
    title: 'Weedool (TuringBio)',
    subtitle: 'BA 활용 디지털 치료 서비스',
    description:
      'BA(행동 활성화) 기법을 활용한 디지털 치료 지향 서비스입니다. 감정 선택, BA 추천, 상태 모니터링, 심리 상담 센터 소개 등의 기능을 제공합니다.',
    techStack: ['Flutter', 'Riverpod', 'GoRouter', 'Naver Map API', 'Google Analytics'],
    color: 'from-teal-500 to-green-400',
    iconType: 'heart',
    screens: [
      {
        title: '맞춤형 AI 마음관리',
        desc: '일상에서 함께하는 맞춤형 AI 마음관리 서비스, 위들라이프입니다.',
        imagePath: '/images/weedool/unnamed-2.png',
      },
      {
        title: '활동으로 마음 회복',
        desc: '임상적 실험과 논문을 통해 검증된 활동 추천 프로그램을 제공합니다.',
        imagePath: '/images/weedool/unnamed-3.png',
      },
      {
        title: 'AI 맞춤형 활동 루틴',
        desc: '분석 결과를 바탕으로 AI가 나만의 활동을 제안해요.',
        imagePath: '/images/weedool/unnamed-4.png',
      },
      {
        title: '활동 후 기록',
        desc: '나의 변화와 하루를 자연스럽게 기록하고, 사진과 소감을 남겨보세요.',
        imagePath: '/images/weedool/unnamed-5.png',
      },
      {
        title: 'AI와 대화',
        desc: '언제든 편안하게 감정을 털어놓을 수 있어요. AI와 대화하며 마음을 나눠요.',
        imagePath: '/images/weedool/unnamed-6.png',
      },
      {
        title: '감정/행동 리포트',
        desc: '내 마음이 어떻게 달라졌는지 감정과 행동의 변화를 리포트로 확인해요.',
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
