import { LocaleText } from '@/i18n';

export interface Capability {
  title: LocaleText;
  detail: LocaleText;
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
  eyebrow: { en: 'Developer Portfolio', ko: '개발자 포트폴리오' },
  role: {
    en: 'Cross-platform Developer · Local RAG Engineer',
    ko: '크로스플랫폼 개발자 · 로컬 RAG 엔지니어',
  },
  position: {
    en: 'Flutter · On-device Retrieval/RAG · LLM Backend',
    ko: 'Flutter · 온디바이스 Retrieval/RAG · LLM 백엔드',
  },
  positioning: {
    en: 'I connect mobile products, local retrieval engines, evaluation, and operations.',
    ko: '모바일 제품과 로컬 검색 엔진을 설계·구현하고 평가와 운영까지 연결합니다.',
  },
  primaryCta: { en: 'Review Technical Cases', ko: '대표 기술 사례 보기' },
  secondaryCta: { en: 'Contact for Technical Review', ko: '채용 관련 이메일' },
  capabilityLabel: { en: 'Core engineering capabilities', ko: '핵심 개발 역량' },
  featuredHeading: { en: 'Featured Engineering Cases', ko: '대표 기술 사례' },
  featuredDescription: {
    en: 'Three cases connecting a retrieval engine, a Flutter product, and an operational backend.',
    ko: '검색 엔진, Flutter 제품 적용, 운영 가능한 백엔드로 이어지는 세 가지 기술 사례입니다.',
  },
  additionalHeading: { en: 'Additional Projects', ko: '추가 프로젝트' },
  additionalDescription: {
    en: 'Additional product work supporting the primary engineering cases.',
    ko: '대표 기술 사례를 보완하는 제품 개발 경험입니다.',
  },
} satisfies Record<string, LocaleText>;

export const capabilities: Capability[] = [
  {
    title: { en: 'Flutter product delivery', ko: 'Flutter 제품화와 릴리스' },
    detail: {
      en: 'Flutter UI architecture, Riverpod state flow, release checks, and mobile QA evidence.',
      ko: 'Flutter UI 아키텍처, Riverpod 상태 흐름, 릴리스 체크, 모바일 QA 근거까지 다룹니다.',
    },
  },
  {
    title: { en: 'On-device Retrieval/RAG', ko: '온디바이스 Retrieval/RAG' },
    detail: {
      en: 'Chunking, embeddings, vector/sparse retrieval, grounded context, and regression evaluation.',
      ko: 'chunking, embedding, vector/sparse 검색, 근거 context, 회귀 평가를 함께 설계합니다.',
    },
  },
  {
    title: { en: 'Rust FFI retrieval path', ko: 'Rust FFI와 네이티브 검색 경로' },
    detail: {
      en: 'Flutter facade, Dart orchestration, Rust FFI hot paths, ONNX, SQLite, and HNSW/BM25.',
      ko: 'Flutter facade, Dart orchestration, Rust FFI hot path, ONNX, SQLite, HNSW/BM25를 연결합니다.',
    },
  },
  {
    title: { en: 'Retrieval backend and operations', ko: '검색 백엔드와 평가·운영' },
    detail: {
      en: 'FastAPI routing, PostgreSQL/Milvus storage, Docker staging, quota guards, and evaluation gates.',
      ko: 'FastAPI 라우팅, PostgreSQL/Milvus 저장소, Docker staging, quota guard, 평가 게이트를 구성합니다.',
    },
  },
];
