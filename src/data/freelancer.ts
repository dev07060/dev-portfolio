import type { Capability, PortfolioConfig, PortfolioCopy } from '@/types/portfolio';
import type { RecruitmentProfile } from '@/types/recruitment';
import { additionalProjectIds } from './portfolio';
import {
  experienceItems,
  recruitmentCases,
  recruitmentProfile,
} from './recruitment';

const freelancerProfile: RecruitmentProfile = {
  ...recruitmentProfile,
  role: '모바일 제품 · 문서 검색/RAG 프로젝트 수행 개발자',
  position: '크로스플랫폼 앱 · Native 연동 · Retrieval/RAG · FastAPI',
  positioning: '기존 모바일 제품의 고도화부터 문서·PDF 검색 기능과 검색 백엔드까지 구현합니다.',
  resumeUrl: undefined,
};

const freelancerCopy: PortfolioCopy = {
  navBrandLabel: 'FREELANCE PORTFOLIO',
  heroEyebrow: '프리랜서 프로젝트 포트폴리오',
  capabilityAriaLabel: '의뢰 가능 범위 요약',
  primaryCta: '대표 수행 사례',
  contactCta: '프로젝트 상담',
  contactMailSubject: '[프로젝트 문의] 모바일 제품 · 문서 RAG 개발',
  featuredEyebrow: '수행 사례',
  featuredHeading: '대표 수행 사례',
  featuredDescription: '모바일 제품, 문서 검색 엔진, 운영 가능한 검색 백엔드로 이어지는 수행 사례입니다.',
  experienceDescription:
    '프로젝트 수행 적합도를 기준으로 역할과 대표 성과를 요약했습니다.',
  additionalHeading: '추가 프로젝트',
  additionalDescription:
    '대표 수행 사례를 보완하는 모바일·웹 제품 개발 경험입니다.',
  contactHeading: '모바일 제품이나 문서 검색 기능을 개발·개선하려고 하시나요?',
  contactDescription:
    '현재 구조와 해결하려는 문제를 알려주시면 직접 수행 가능한 범위와 검증 기준을 관련 구현 근거로 답변드리겠습니다.',
};

const freelancerCapabilities: Capability[] = [
  {
    title: '모바일 앱 구축·고도화',
    evidence: '피에트 · Easy Contract Viewer',
  },
  {
    title: 'BLE·FCM·Native 연동',
    evidence: '피에트 피트니스',
  },
  {
    title: 'PDF·문서 Retrieval/RAG',
    evidence: 'Easy Contract Viewer',
  },
  {
    title: 'FastAPI 검색 백엔드·평가',
    evidence: 'Swifty-law',
  },
];

const freelancerFeaturedProjectIds = [
  'easy-contract-viewer',
  'local-mobile-rag-gemma',
  'law-info-engine',
] as const;

const fietExperience = experienceItems.find(
  (item) => item.company === '㈜피에트'
);
const freelancerExperienceItems = fietExperience
  ? [
      fietExperience,
      ...experienceItems.filter((item) => item !== fietExperience),
    ]
  : experienceItems;

export const freelancerPortfolioConfig: PortfolioConfig = {
  profile: freelancerProfile,
  copy: freelancerCopy,
  capabilities: freelancerCapabilities,
  featuredProjectIds: freelancerFeaturedProjectIds,
  additionalProjectIds,
  cases: recruitmentCases,
  experienceItems: freelancerExperienceItems,
};
