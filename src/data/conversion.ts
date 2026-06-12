import { LocaleText } from '@/i18n';

export type Audience = 'client' | 'developer';

export const parseAudience = (value?: string | string[] | null): Audience => {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate === 'developer' ? 'developer' : 'client';
};

export interface ConversionOffer {
  title: LocaleText;
  description: LocaleText;
  developerDetail?: LocaleText;
}

export const featuredProjectIds = [
  'local-mobile-rag-gemma',
  'law-info-engine',
  'easy-contract-viewer',
] as const;

export const allWorkProjectIds = [
  'motgo',
  'haru-check',
  'weedool',
  'fiet-fitness-trainer',
  'fiet-fitness-user',
] as const;

export const serviceOffers: ConversionOffer[] = [
  {
    title: {
      en: 'Flutter app MVP',
      ko: 'Flutter 앱 MVP',
    },
    description: {
      en: 'Productization / release',
      ko: '제품화 / 릴리스',
    },
    developerDetail: {
      en: 'Flutter UI architecture, Riverpod state flow, release checks, and mobile QA evidence.',
      ko: 'Flutter UI 아키텍처, Riverpod 상태 흐름, 릴리스 체크, 모바일 QA 근거까지 다룹니다.',
    },
  },
  {
    title: {
      en: 'Document AI / RAG',
      ko: '문서 AI / RAG',
    },
    description: {
      en: 'Retrieval / citation',
      ko: '검색 / 인용',
    },
    developerDetail: {
      en: 'Chunking, embeddings, vector/sparse retrieval, citations, regression evaluation, and API contracts.',
      ko: 'chunking, embedding, vector/sparse 검색, citation, 회귀 평가, API contract를 함께 설계합니다.',
    },
  },
  {
    title: {
      en: 'App performance / QA',
      ko: '앱 성능 / QA',
    },
    description: {
      en: 'Profiling / release blockers',
      ko: '프로파일링 / 릴리스 차단점',
    },
    developerDetail: {
      en: 'Device profiling, responsive checks, accessibility fixes, release blockers, and before/after reports.',
      ko: '디바이스 프로파일링, 반응형 점검, 접근성 수정, 릴리스 차단 요소, 전후 비교 리포트를 제공합니다.',
    },
  },
  {
    title: {
      en: 'FastAPI LLM backend',
      ko: 'FastAPI 기반 LLM 백엔드',
    },
    description: {
      en: 'API / retrieval / ops',
      ko: 'API / 검색 / 운영',
    },
    developerDetail: {
      en: 'FastAPI routing, PostgreSQL/Milvus storage, Docker staging, quota guards, and evaluation gates.',
      ko: 'FastAPI 라우팅, PostgreSQL/Milvus 저장소, Docker staging, quota guard, 평가 게이트를 구성합니다.',
    },
  },
];

export const audienceContent = {
  client: {
    href: '/?audience=client#all-work',
    alternateHref: '/?audience=developer#all-work',
    eyebrow: { en: 'Freelance Portfolio', ko: '외주 수주 포트폴리오' },
    positionLine: {
      en: 'Flutter · On-device AI/RAG · LLM Backend',
      ko: 'Flutter · On-device AI/RAG · LLM Backend',
    },
    valueProposition: {
      en: 'I design, build, and ship app productization and document-grounded AI/RAG systems.',
      ko: '앱 제품화와 문서 기반 AI/RAG 시스템을 설계·구현·배포합니다.',
    },
    primaryCta: {
      label: { en: 'View Featured Work', ko: '대표 작업 보기' },
      href: '#featured-work',
    },
    secondaryCta: {
      label: { en: 'Discuss a Project', ko: '프로젝트 상담하기' },
      href: 'mailto:byeongheeoh51@gmail.com?subject=Project%20consultation',
    },
    offerLabel: { en: 'Project types', ko: '의뢰 가능 유형' },
    projectTypeMode: 'compact',
    featuredWork: {
      heading: { en: 'Featured Work', ko: '대표 작업' },
      description: {
        en: 'Three proof points first: package, live RAG API, and Flutter product.',
        ko: '패키지, live RAG API, Flutter 제품 증거를 먼저 보여줍니다.',
      },
    },
    moreWork: {
      heading: { en: 'All Work / Career Projects', ko: '전체 작업 / 커리어 프로젝트' },
      description: {
        en: 'Additional product builds and career projects, separated from the three conversion cases.',
        ko: '대표 3개와 분리해 추가 제품 개발과 커리어 프로젝트를 정리했습니다.',
      },
    },
  },
  developer: {
    href: '/?audience=developer#all-work',
    alternateHref: '/?audience=client#all-work',
    eyebrow: { en: 'Developer Portfolio', ko: '개발자 포트폴리오' },
    positionLine: {
      en: 'Flutter · On-device AI/RAG · LLM Backend',
      ko: 'Flutter · On-device AI/RAG · LLM Backend',
    },
    valueProposition: {
      en: 'I build mobile products and retrieval systems with clear boundaries across API design, native bridges, testing, performance, and operations.',
      ko: '모바일 제품과 검색 시스템을 API 설계, 네이티브 브릿지, 테스트, 성능, 운영 경계까지 나눠 구현합니다.',
    },
    primaryCta: {
      label: { en: 'Review Technical Cases', ko: '기술 사례 보기' },
      href: '#featured-work',
    },
    secondaryCta: {
      label: { en: 'Contact for Technical Review', ko: '기술 검토 문의' },
      href: 'mailto:byeongheeoh51@gmail.com?subject=Technical%20portfolio%20review',
    },
    offerLabel: { en: 'Core stack / project types', ko: '핵심 스택 / 프로젝트 범위' },
    projectTypeMode: 'stacked',
    featuredWork: {
      heading: { en: 'Featured Engineering Cases', ko: '대표 기술 사례' },
      description: {
        en: 'The same three projects, prioritized for architecture, retrieval quality, testing, and operations evidence.',
        ko: '동일한 3개 프로젝트를 아키텍처, 검색 품질, 테스트, 운영 근거 중심으로 봅니다.',
      },
    },
    moreWork: {
      heading: { en: 'All Work / Career Projects', ko: '전체 작업 / 커리어 프로젝트' },
      description: {
        en: 'Career archive and additional builds after the primary architecture cases.',
        ko: '핵심 아키텍처 사례 뒤에 커리어 아카이브와 추가 구현물을 배치했습니다.',
      },
    },
  },
} as const satisfies Record<
  Audience,
  {
    href: string;
    alternateHref: string;
    eyebrow: LocaleText;
    positionLine: LocaleText;
    valueProposition: LocaleText;
    primaryCta: { label: LocaleText; href: string };
    secondaryCta: { label: LocaleText; href: string };
    offerLabel: LocaleText;
    projectTypeMode: 'compact' | 'stacked';
    featuredWork: { heading: LocaleText; description: LocaleText };
    moreWork: { heading: LocaleText; description: LocaleText };
  }
>;

export const conversionSections = {
  featuredWork: audienceContent.client.featuredWork,
  moreWork: audienceContent.client.moreWork,
} as const;
