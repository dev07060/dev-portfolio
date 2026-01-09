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
  technologiesUsed: { en: 'Technologies Used', ko: '사용 기술' },
  mobileApplication: { en: 'MOBILE APPLICATION', ko: '모바일 앱' },
  tabletApplication: { en: 'TABLET APPLICATION', ko: '태블릿 앱' },
  webPlatform: { en: 'WEB PLATFORM', ko: '웹 플랫폼' },

  // ProjectCard
  deviceApp: { en: 'APP', ko: '앱' },
  deviceTablet: { en: 'TABLET', ko: '태블릿' },
  deviceWeb: { en: 'WEB', ko: '웹' },

  // Footer
  footerCopyright: { en: '© 2025 Byeonghee Oh', ko: '© 2025 오병희' },

  // Tech Stack Categories
  mobile: { en: 'Mobile', ko: 'Mobile' },
  web: { en: 'Web', ko: 'Web' },
  state: { en: 'State', ko: 'State' },
} as const;

// ============================================================
// Profile - 프로필 섹션 텍스트
// ============================================================
export const profile = {
  name: { en: 'Byeonghee Oh', ko: '오병희' },
  tagline: {
    en: 'Cross Platform Developer',
    ko: 'Cross Platform Developer',
  },
  // Korean uses intro paragraph, English uses highlights
  intro: {
    en: '', // Not used for English
    ko: `사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.
모바일 앱과 웹의 경계를 허무는 몰입형 인터페이스를 만듭니다.
정밀한 디자인 구현, 최적화, 지속가능한 코드를 우선시 합니다.
프로젝트 경험 : Web 3년차, Mobile 4년차`,
  },
  highlights: [
    { en: 'User experience first', ko: '사용자 경험 최우선' },
    { en: 'Immersive interfaces across mobile & web', ko: '모바일 & 웹을 넘나드는 몰입형 인터페이스' },
    { en: 'Precise design, optimized code', ko: '정밀한 디자인, 최적화된 코드' },
    { en: 'Kotlin & Rust native dev with Flutter integration', ko: 'Kotlin & Rust 네이티브 개발, Flutter 연동' },
  ],
  experience: {
    en: '3 years Web · 4 years Mobile',
    ko: 'Web 3년차 · Mobile 4년차',
  },
} as const;

// ============================================================
// Helper Type for accessing translations
// ============================================================
export type TranslationKey = 
  | `ui.${keyof typeof ui}`
  | `profile.${keyof typeof profile}`;
