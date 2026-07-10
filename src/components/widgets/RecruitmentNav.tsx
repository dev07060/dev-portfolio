import SectionContainer from './SectionContainer';

interface RecruitmentNavProps {
  hasExperience: boolean;
}

const navigation = [
  { label: '기술 사례', href: '#featured-work' },
] as const;

const linkClass =
  'inline-flex min-h-11 items-center shrink-0 text-xs font-medium text-[#4a4339] hover:text-[#0f766e] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] sm:text-sm';

const RecruitmentNav = ({ hasExperience }: RecruitmentNavProps) => (
  <nav aria-label="주요 탐색" className="border-b border-[#e8dfd0] bg-[#faf7f2]">
    <SectionContainer className="flex min-h-16 items-center justify-between gap-3 py-2">
      <a
        href="#about"
        className="inline-flex min-h-11 items-center shrink-0 text-xs font-semibold tracking-[0.18em] text-[#1f1b16] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] sm:text-sm"
      >
        DEV PORTFOLIO
      </a>
      <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-5">
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={linkClass}
          >
            {item.label}
          </a>
        ))}
        {hasExperience && (
          <a href="#experience" className={linkClass}>
            경력
          </a>
        )}
        <a href="#contact" className={linkClass}>
          연락
        </a>
      </div>
    </SectionContainer>
  </nav>
);

export default RecruitmentNav;
