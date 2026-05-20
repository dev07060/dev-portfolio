'use client';

import { ExternalLink, Github } from 'lucide-react';
import { useLocale, ui } from '@/i18n';

interface PackageInfo {
  name: string;
  description: { en: string; ko: string };
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
    description: {
      en: 'High-performance On-Device RAG Engine for Flutter. Run semantic search completely offline.',
      ko: '고성능 온디바이스 RAG 엔진. 100% 오프라인 시맨틱 검색을 Flutter에서 구현.',
    },
    version: '0.13.0',
    techStack: ['Rust', 'Flutter FFI', 'ONNX Runtime', 'HNSW', 'SQLite'],
    pubDevUrl: 'https://pub.dev/packages/mobile_rag_engine',
    githubUrl: 'https://github.com/dev07060/mobile_rag_engine',
    icon: '🚀',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'rag_engine_flutter',
    description: {
      en: 'Native Rust FFI plugin for mobile_rag_engine. 10-100x faster tokenization than pure Dart.',
      ko: 'mobile_rag_engine을 위한 네이티브 Rust FFI 플러그인. Pure Dart 대비 10-100배 빠른 토크나이징.',
    },
    version: '0.13.0',
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
    <section className="max-w-7xl mx-auto px-6 pb-14 relative z-20">
      {/* Section Header */}
      <div className="mb-8 pb-6 border-b border-[#e8dfd0] flex items-baseline justify-between">
        <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1f1b16] tracking-tight">
          {t(ui.openSourcePackages)}
        </h2>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#8a7f70]">
          pub.dev
        </span>
      </div>
      <p className="text-[#4a4339] text-sm md:text-base mb-8 max-w-2xl leading-relaxed">
        {t(ui.openSourceDesc)}
      </p>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="group relative rounded-2xl overflow-hidden bg-white border border-[#e8dfd0] hover:border-[#b8543a]/40 transition-all duration-300 hover:shadow-[0_20px_50px_-20px_rgba(31,27,22,0.15)]"
          >
            {/* Gradient Top Bar */}
            <div className={`h-1 bg-gradient-to-r ${pkg.gradient}`} />

            <div className="p-6 flex flex-col h-full">
              {/* Header with Icon Links */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pkg.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg font-normal text-[#1f1b16] group-hover:text-[#b8543a] transition-colors">
                      {pkg.name}
                    </h3>
                    <span className="text-xs text-[#8a7f70] font-mono">
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
                    className="p-2 text-[#4a4339] hover:text-[#1f1b16] hover:bg-[#f2ede4] rounded-lg border border-[#e8dfd0] hover:border-[#8a7f70] transition-all"
                  >
                    <Github size={15} />
                  </a>
                </div>
              </div>

              {/* Description - flex-grow pushes badges to bottom */}
              <p className="text-sm text-[#4a4339] mb-4 leading-relaxed flex-grow">
                {pkg.description[locale]}
              </p>

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
