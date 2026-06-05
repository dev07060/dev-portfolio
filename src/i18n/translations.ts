// ============================================================
// Translations - 모든 텍스트를 영어/한국어 대조 관리
// ============================================================

export type Locale = 'en' | 'ko';

export type LocaleText = {
  en: string;
  ko: string;
};

// ============================================================
// UI Labels - 공통 UI 텍스트
// ============================================================
export const ui = {
  // ProjectModal
  projectOverview: { en: 'Project Overview', ko: '프로젝트 개요' },
  caseStudyFlow: { en: 'Case Study Flow', ko: '케이스 스터디 흐름' },
  keyImplementations: { en: 'Key Implementations', ko: '핵심 구현' },
  technologiesUsed: { en: 'Technologies Used', ko: '사용 기술' },
  mobileApplication: { en: 'MOBILE APPLICATION', ko: '모바일 앱' },
  tabletApplication: { en: 'TABLET APPLICATION', ko: '태블릿 앱' },
  webPlatform: { en: 'WEB PLATFORM', ko: '웹 플랫폼' },

  // ProjectCard
  coreStack: { en: 'Core Stack', ko: '핵심 기술 스택' },
  evidenceBadges: { en: 'Evidence', ko: '증거' },
  deviceApp: { en: 'APP', ko: '앱' },
  deviceTablet: { en: 'TABLET', ko: '태블릿' },
  deviceWeb: { en: 'WEB', ko: '웹' },
  devicePackage: { en: 'PACKAGE', ko: '패키지' },
  packageProject: { en: 'PACKAGE / ENGINE', ko: '패키지 / 엔진' },

  // Footer
  footerCopyright: { en: '© 2025 Byeonghee Oh', ko: '© 2025 오병희' },

  // Tech Stack Categories
  mobile: { en: 'Mobile', ko: 'Mobile' },
  web: { en: 'Web', ko: 'Web' },
  state: { en: 'Stack', ko: 'Stack' },

  // ProjectGrid Section
  selectedWork: { en: 'Selected Work', ko: '선정 프로젝트' },
  projectsSuffix: { en: 'Projects', ko: '프로젝트' },

  // Open Source Packages Section
  openSourcePackages: { en: 'Open Source Packages', ko: '오픈소스 패키지' },
  openSourceDesc: {
    en: 'High-performance Flutter packages I developed and published on pub.dev',
    ko: '직접 개발하여 pub.dev에 배포한 고성능 Flutter 패키지',
  },
  viewOnPubDev: { en: 'pub.dev', ko: 'pub.dev' },
  viewOnGitHub: { en: 'GitHub', ko: 'GitHub' },
} as const;

// ============================================================
// Profile - 프로필 섹션 텍스트
// ============================================================
export const profile = {
  name: { en: 'Byeonghee Oh', ko: '오병희' },
  tagline: {
    en: 'Cross-Platform Developer · RAG Engineer',
    ko: 'Cross-Platform Developer · RAG Engineer',
  },
  // Korean uses intro paragraph, English uses highlights
  intro: {
    en: '', // Not used for English
    ko: `웹·모바일을 설계/개발/운영해 온 크로스플랫폼 개발자이자, Rust FFI 기반 온디바이스 RAG 엔진(mobile_rag_engine)을 pub.dev에 배포 중인 로컬 RAG 엔지니어입니다.
MAU 1만+ 서비스 운영과 온디바이스 AI 파이프라인 구축을 주도했고, 장애를 예방하는 구조 설계로 비즈니스 가치를 높입니다.`,
  },
  highlights: [
    { en: 'User experience first', ko: '사용자 경험 중심 개발' },
    { en: 'Built and operated web, serverless web, and mobile services', ko: '웹·서버리스 웹·모바일 서비스 설계/개발/운영' },
    { en: 'Shipped on-device RAG engine (Rust FFI · ONNX) on pub.dev', ko: 'pub.dev에 온디바이스 RAG 엔진(Rust FFI·ONNX) 배포' },
    { en: 'Improved bottlenecks in complex data pipelines', ko: '복잡한 데이터 처리 병목 성능 개선' },
    { en: 'Structure-first engineering for stable services', ko: '장애 예방 중심의 구조 설계' },
  ],
  experience: {
    en: '5 years 4 months total · 3 years Web · 4 years Mobile',
    ko: '총 5년 4개월 · Web 3년 · Mobile 4년',
  },
} as const;

// ============================================================
// Helper Type for accessing translations
// ============================================================
export type TranslationKey = 
  | `ui.${keyof typeof ui}`
  | `profile.${keyof typeof profile}`;
