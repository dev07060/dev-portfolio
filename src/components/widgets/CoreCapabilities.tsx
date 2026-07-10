import type { Capability } from '@/data/portfolio';
import SectionContainer from './SectionContainer';
import SectionHeader from './SectionHeader';

interface CoreCapabilitiesProps {
  items: Capability[];
}

const CoreCapabilities = ({ items }: CoreCapabilitiesProps) => (
  <section id="capabilities" className="pb-16 sm:pb-20">
    <SectionContainer>
      <SectionHeader
        eyebrow="Engineering capabilities"
        title="핵심 개발 역량"
        description="기술 이름의 나열보다 대표 사례에서 어떤 경계와 결정을 맡았는지 설명합니다."
        count={items.length}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="rounded-xl border border-[#d9e4e1] bg-white p-5 sm:p-6"
          >
            <span className="font-mono text-[10px] tracking-[0.22em] text-[#0f766e]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-[#1f1b16] break-keep">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4a4339] break-keep sm:text-base">
              {item.detail}
            </p>
          </article>
        ))}
      </div>
    </SectionContainer>
  </section>
);

export default CoreCapabilities;
