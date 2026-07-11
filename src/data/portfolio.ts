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
  'haru-check',
  'fiet-fitness-trainer',
  'weedool',
] as const;

export const portfolioCopy: PortfolioCopy = {
  navBrandLabel: 'DEV PORTFOLIO',
  heroEyebrow: '개발자 포트폴리오',
  capabilityAriaLabel: '핵심 개발 역량 요약',
  primaryCta: '대표 기술 사례',
  contactCta: '채용 관련 이메일',
  featuredEyebrow: '대표 흐름',
  featuredHeading: '대표 기술 사례',
  featuredDescription:
    '검색 엔진, Flutter 제품 적용, 운영 가능한 백엔드로 이어지는 세 가지 기술 사례입니다.',
  experienceDescription: '최신순으로 역할과 대표 성과를 요약했습니다.',
  additionalHeading: '추가 프로젝트',
  additionalDescription:
    'AI 기능 제품화와 BLE·모바일 운영 경험을 보완하는 세 가지 사례입니다.',
  contactHeading:
    '모바일 제품과 로컬 검색 기술을 함께 다룰 개발자를 찾고 계신가요?',
  contactDescription:
    '역할과 해결하려는 문제를 이메일로 알려주시면 포트폴리오의 관련 구현 근거를 기준으로 답변드리겠습니다.',
};

export const capabilities: Capability[] = [
  {
    title: 'Flutter 제품화·릴리스',
    evidence: 'Easy Contract Viewer',
  },
  {
    title: '온디바이스 Retrieval/RAG',
    evidence: 'mobile_rag_engine',
  },
  {
    title: 'Rust FFI·네이티브 검색',
    evidence: 'mobile_rag_engine',
  },
  {
    title: '검색 백엔드·평가 운영',
    evidence: 'Swifty-law',
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
