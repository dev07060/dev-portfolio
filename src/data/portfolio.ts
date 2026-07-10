export interface Capability {
  title: string;
  evidence: string;
}

export const featuredProjectIds = [
  'local-mobile-rag-gemma',
  'easy-contract-viewer',
  'law-info-engine',
] as const;

export const additionalProjectIds = [
  'motgo',
  'haru-check',
  'weedool',
  'fiet-fitness-trainer',
  'fiet-fitness-user',
] as const;

export const portfolioCopy = {
  eyebrow: '개발자 포트폴리오',
  role: '크로스플랫폼 개발자 · 로컬 RAG 엔지니어',
  position: 'Flutter · 온디바이스 Retrieval/RAG · LLM 백엔드',
  positioning:
    '모바일 제품과 로컬 검색 엔진을 설계·구현하고 평가와 운영까지 연결합니다.',
  primaryCta: '대표 기술 사례 보기',
  secondaryCta: '채용 관련 이메일',
  capabilityLabel: '핵심 개발 역량',
  featuredHeading: '대표 기술 사례',
  featuredDescription:
    '검색 엔진, Flutter 제품 적용, 운영 가능한 백엔드로 이어지는 세 가지 기술 사례입니다.',
  additionalHeading: '추가 프로젝트',
  additionalDescription: '대표 기술 사례를 보완하는 제품 개발 경험입니다.',
} as const;

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
