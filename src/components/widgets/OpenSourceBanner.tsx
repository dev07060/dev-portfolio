'use client';

import { Package, ExternalLink, Github } from 'lucide-react';
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
    version: '0.3.9',
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
    version: '0.3.0',
    techStack: ['Rust', 'flutter_rust_bridge', 'cargokit', 'HuggingFace Tokenizers'],
    pubDevUrl: 'https://pub.dev/packages/rag_engine_flutter',
    githubUrl: 'https://github.com/dev07060/mobile_rag_engine/tree/main/packages/rag_engine_flutter',
    icon: '⚙️',
    gradient: 'from-orange-500 to-red-500',
  },
];

const OpenSourceBanner = () => {
  const { t, locale } = useLocale();

  return (
    <section className="max-w-7xl mx-auto px-6 pb-10 relative z-20">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-slate-200 border-b border-slate-700 pb-4">
          <Package className="text-cyan-400" />
          {t(ui.openSourcePackages)}
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          {t(ui.openSourceDesc)}
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="group relative rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
          >
            {/* Gradient Top Bar */}
            <div className={`h-1 bg-gradient-to-r ${pkg.gradient}`} />

            <div className="p-5 flex flex-col h-full">
              {/* Header with Icon Links */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pkg.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {pkg.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
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
                    className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href={pkg.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all"
                  >
                    <Github size={16} />
                  </a>
                </div>
              </div>

              {/* Description - flex-grow pushes badges to bottom */}
              <p className="text-sm text-slate-300 mb-3 leading-relaxed flex-grow">
                {pkg.description[locale]}
              </p>

              {/* Tech Stack Badges - fixed at bottom */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {pkg.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs font-medium bg-slate-700/70 text-slate-300 rounded-md border border-slate-600/50"
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
