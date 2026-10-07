import type { Capability, PortfolioConfig, PortfolioCopy } from '@/types/portfolio';
import {
  experienceItems,
  recruitmentCases,
  recruitmentProfile,
} from './recruitment';

export const featuredProjectIds = [
  'local-mobile-rag-gemma',
  'easy-contract-viewer',
  'law-info-engine',
] as const;

export const additionalProjectIds = [
  'easy-contract-viewer-server',
  'fiet-fitness-trainer',
  'fiet-fitness-user',
  'haru-check',
  'weedool',
] as const;

export const portfolioCopy: PortfolioCopy = {
  navBrandLabel: '포트폴리오',
  heroEyebrow: '개발자 포트폴리오',
  capabilityAriaLabel: '핵심 개발 역량 요약',
  primaryCta: '대표 기술 사례',
  contactCta: '이메일 보내기',
  featuredEyebrow: '대표 흐름',
  featuredHeading: '대표 기술 사례',
  featuredDescription:
    '검색 엔진, Flutter 제품 적용, 운영 가능한 백엔드로 이어지는 세 가지 기술 사례입니다.',
  experienceDescription: '최신순으로 역할과 대표 성과를 요약했습니다.',
  additionalHeading: '추가 프로젝트',
  additionalDescription:
    'Python 검색·요약 백엔드와 AI·BLE 제품화 경험을 보완하는 다섯 가지 사례입니다.',
  contactHeading:
    '모바일 제품과 로컬 검색 기술을 함께 다룰 개발자를 찾고 계신가요?',
  careerHeading: '5년 5개월, 여섯 팀',
  otherProjectsLabel: '그 밖의 프로젝트',
  contactHeadingHighlight: '모바일 제품과 로컬 검색 기술',
  contactDescription:
    '역할과 해결하려는 문제를 알려주세요. 관련 경험과 구현 사례를 바탕으로 함께 이야기 나누겠습니다.',
};

export const capabilities: Capability[] = [
  {
    title: 'Flutter 제품화·릴리스',
    evidence: 'Easy Contract Viewer',
  },
  {
    title: '온디바이스 검색·Rust FFI',
    evidence: 'mobile_rag_engine',
  },
  {
    title: 'LLM 에이전트·검색 백엔드',
    evidence: '기업 법령 검토 엔진(이음)',
  },
];

export const recruitmentPortfolioConfig: PortfolioConfig = {
  profile: recruitmentProfile,
  copy: portfolioCopy,
  capabilities,
  featuredProjectIds,
  additionalProjectIds,
  cases: recruitmentCases,
  experienceItems,
};
