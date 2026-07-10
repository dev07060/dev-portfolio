'use client';

import { ExternalLink, Github } from 'lucide-react';
import { useLocale, ui } from '@/i18n';

interface PackageInfo {
  name: string;
  bullets: { en: string; ko: string }[];
  version: string;
  techStack: string[];
  pubDevUrl: string;
  githubUrl: string;
  icon: string;
  gradient: string;
}

const packages: PackageInfo[] = [
  {
    name: 'mobile_rag_engine',
    bullets: [
      {
        en: '100% on-device — fully offline semantic search',
        ko: '완전 온디바이스 · 100% 오프라인 시맨틱 검색',
      },
      {
        en: 'Hybrid retrieval — HNSW dense + BM25 sparse',
        ko: '하이브리드 검색 — HNSW 벡터 + BM25 키워드',
      },
      {
        en: 'PDF · DOCX ingestion via fast-path file API',
        ko: 'PDF · DOCX 추출 + Fast-path 인제스션 API',
      },
      {
        en: 'Zero-copy embedding transport over Rust core',
        ko: 'Rust 코어 기반 Zero-copy 임베딩 전송',
      },
    ],
    version: '0.18.6',
    techStack: ['Rust', 'Flutter FFI', 'ONNX Runtime', 'HNSW', 'BM25', 'SQLite'],
    pubDevUrl: 'https://pub.dev/packages/mobile_rag_engine',
    githubUrl: 'https://github.com/dev07060/mobile_rag_engine',
    icon: '🚀',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'rag_engine_flutter',
    bullets: [
      {
        en: 'Native Rust FFI via flutter_rust_bridge',
        ko: 'flutter_rust_bridge 기반 네이티브 Rust FFI',
      },
      {
        en: '10–100× faster tokenization than pure Dart',
        ko: 'Pure Dart 대비 10~100× 빠른 토크나이징',
      },
      {
        en: 'HuggingFace Tokenizers (BPE · WordPiece) compatible',
        ko: 'HuggingFace Tokenizers (BPE · WordPiece) 호환',
      },
      {
        en: 'iOS · Android · Desktop packaging via cargokit',
        ko: 'cargokit으로 iOS · Android · Desktop 크로스플랫폼',
      },
    ],
    version: '0.18.3',
    techStack: ['Rust', 'flutter_rust_bridge', 'cargokit', 'HuggingFace Tokenizers'],
    pubDevUrl: 'https://pub.dev/packages/rag_engine_flutter',
    githubUrl: 'https://github.com/dev07060/mobile_rag_engine',
    icon: '⚙️',
    gradient: 'from-orange-500 to-red-500',
  },
];

const OpenSourceBanner = () => {
  const { t, locale } = useLocale();

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-6 pb-10 sm:pb-14 relative z-20">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-[#e8dfd0] flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-2 sm:gap-0">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#1f1b16] tracking-tight">
          {t(ui.openSourcePackages)}
        </h2>
        <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#756b60]">
          pub.dev
        </span>
      </div>
      <p className="text-[#4a4339] text-sm md:text-base mb-6 sm:mb-8 max-w-2xl leading-relaxed">
        {t(ui.openSourceDesc)}
      </p>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="group relative rounded-2xl overflow-hidden bg-white border border-[#e8dfd0] hover:border-[#b8543a]/40 transition-all duration-300 hover:shadow-[0_20px_50px_-20px_rgba(31,27,22,0.15)]"
          >
            {/* Gradient Top Bar */}
            <div className={`h-1 bg-gradient-to-r ${pkg.gradient}`} />

            <div className="p-5 sm:p-6 flex flex-col h-full">
              {/* Header with Icon Links */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pkg.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg font-normal text-[#1f1b16] group-hover:text-[#b8543a] transition-colors">
                      {pkg.name}
                    </h3>
                    <span className="text-xs text-[#756b60] font-mono">
                      v{pkg.version}
                    </span>
                  </div>
                </div>
                {/* Icon Links */}
                <div className="flex gap-2">
                  <a
                    href={pkg.pubDevUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="pub.dev"
                    className="p-2 text-[#b8543a] hover:bg-[#b8543a]/10 rounded-lg border border-[#b8543a]/30 hover:border-[#b8543a] transition-all"
                  >
                    <ExternalLink size={15} />
                  </a>
                  <a
                    href={pkg.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    className="p-2 text-[#4a4339] hover:text-[#1f1b16] hover:bg-[#f2ede4] rounded-lg border border-[#e8dfd0] hover:border-[#756b60] transition-all"
                  >
                    <Github size={15} />
                  </a>
                </div>
              </div>

              {/* Spec bullets - flex-grow pushes badges to bottom */}
              <ul className="text-sm text-[#4a4339] mb-4 leading-relaxed flex-grow space-y-1.5">
                {pkg.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#b8543a] mt-[2px] leading-none">·</span>
                    <span>{b[locale]}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack Badges - fixed at bottom */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {pkg.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-medium bg-[#f2ede4] text-[#4a4339] rounded-full border border-[#e8dfd0]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OpenSourceBanner;
