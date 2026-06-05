import { LocaleText } from '@/i18n';

export interface ConversionOffer {
  title: LocaleText;
  description: LocaleText;
}

export interface ProofItem {
  label: LocaleText;
  value: LocaleText;
  description: LocaleText;
}

export const featuredProjectIds = [
  'local-mobile-rag-gemma',
  'law-info-engine',
  'easy-contract-viewer',
] as const;

export const serviceOffers: ConversionOffer[] = [
  {
    title: {
      en: 'Flutter app MVP / productization',
      ko: 'Flutter 앱 MVP / 제품화',
    },
    description: {
      en: 'From first usable build to release-ready mobile product.',
      ko: '초기 사용 가능 버전부터 배포 가능한 모바일 제품까지 설계·구현합니다.',
    },
  },
  {
    title: {
      en: 'Document AI search / RAG',
      ko: '문서 기반 AI 검색 / RAG',
    },
    description: {
      en: 'Retrieval, citation, and local/offline pipelines for domain documents.',
      ko: '도메인 문서를 검색·인용·요약하는 RAG 파이프라인을 구축합니다.',
    },
  },
  {
    title: {
      en: 'Existing app performance / QA',
      ko: '기존 앱 성능 개선 / QA',
    },
    description: {
      en: 'Find slow paths, layout issues, and release blockers with concrete evidence.',
      ko: '성능 병목, 레이아웃 문제, 릴리스 차단 요소를 근거 기반으로 정리합니다.',
    },
  },
  {
    title: {
      en: 'FastAPI LLM backend',
      ko: 'FastAPI 기반 LLM 백엔드',
    },
    description: {
      en: 'API surfaces, retrieval services, and operational guardrails for LLM products.',
      ko: 'LLM 제품을 위한 API, 검색 서비스, 운영 안전장치를 구현합니다.',
    },
  },
];

export const proofItems: ProofItem[] = [
  {
    label: { en: 'pub.dev package', ko: 'pub.dev 패키지' },
    value: { en: 'mobile_rag_engine', ko: 'mobile_rag_engine' },
    description: {
      en: 'Published on-device RAG package with Rust FFI and ONNX runtime.',
      ko: 'Rust FFI와 ONNX 기반 온디바이스 RAG 패키지를 배포했습니다.',
    },
  },
  {
    label: { en: 'live RAG API', ko: 'live RAG API' },
    value: { en: 'Swifty-law', ko: 'Swifty-law' },
    description: {
      en: 'Citation-grounded Korean statute retrieval API running in production.',
      ko: '공식 법령 근거와 citation을 반환하는 한국 법령 검색 API입니다.',
    },
  },
  {
    label: { en: 'Flutter product', ko: 'Flutter 제품' },
    value: { en: 'Easy Contract Viewer', ko: 'Easy Contract Viewer' },
    description: {
      en: 'Insurance contract review app with local indexing and PDF evidence.',
      ko: '로컬 색인, PDF 근거 연결, AI 요약을 갖춘 보험 약관 검토 앱입니다.',
    },
  },
];

export const conversionSections = {
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
      en: 'Additional product builds, career projects, and implementation examples.',
      ko: '추가 제품 개발, 커리어 프로젝트, 구현 사례를 정리했습니다.',
    },
  },
} as const;
