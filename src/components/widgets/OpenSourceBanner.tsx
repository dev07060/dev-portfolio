import { ExternalLink, Github } from 'lucide-react';
import SectionContainer from './SectionContainer';
import SectionHeader from './SectionHeader';

const supportPackage = {
  name: 'rag_engine_flutter',
  version: '0.18.3',
  bullets: [
    'flutter_rust_bridge 기반 네이티브 Rust FFI',
    'HuggingFace Tokenizers 기반 네이티브 토크나이징',
    'BPE · WordPiece 토크나이저 호환',
    'cargokit으로 iOS · Android · Desktop 패키징',
  ],
  techStack: [
    'Rust',
    'flutter_rust_bridge',
    'cargokit',
    'HuggingFace Tokenizers',
  ],
  pubDevUrl: 'https://pub.dev/packages/rag_engine_flutter',
  githubUrl: 'https://github.com/dev07060/mobile_rag_engine',
} as const;

const OpenSourceBanner = () => (
  <section id="open-source" className="pb-16 sm:pb-20">
    <SectionContainer>
      <SectionHeader
        eyebrow="Open source support"
        title="보완 오픈소스"
        description="대표 사례의 검색 엔진을 보완하는 네이티브 Flutter 패키지입니다."
        count={1}
      />
      <article className="overflow-hidden rounded-2xl border border-[#e8dfd0] bg-white">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
        <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(240px,0.7fr)_minmax(0,1.3fr)] lg:items-start lg:gap-10">
          <div>
            <p className="font-mono text-xs text-[#756b60]">v{supportPackage.version}</p>
            <h3 className="mt-2 font-serif text-2xl font-light text-[#1f1b16]">
              {supportPackage.name}
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={supportPackage.pubDevUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#b8543a]/30 px-4 py-2.5 text-xs font-semibold text-[#9d4530] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
              >
                pub.dev
                <ExternalLink size={14} aria-hidden="true" />
              </a>
              <a
                href={supportPackage.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#d9e4e1] px-4 py-2.5 text-xs font-semibold text-[#1f1b16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
              >
                <Github size={14} aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
          <div>
            <ul className="grid grid-cols-1 gap-2 text-sm leading-relaxed text-[#4a4339] sm:grid-cols-2">
              {supportPackage.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span aria-hidden="true" className="text-[#b8543a]">·</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {supportPackage.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[#e8dfd0] bg-[#f2ede4] px-2.5 py-1 text-xs font-medium text-[#4a4339]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  </section>
);

export default OpenSourceBanner;
