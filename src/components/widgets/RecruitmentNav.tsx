import { FileText } from 'lucide-react';
import type { RecruitmentProfile } from '@/types/recruitment';
import SectionContainer from './SectionContainer';

interface RecruitmentNavProps {
  profile: RecruitmentProfile;
  hasExperience: boolean;
}

const navigation = [
  { label: '소개', href: '#about' },
  { label: '대표 기술 사례', href: '#featured-work' },
] as const;

const linkClass =
  'shrink-0 text-xs font-medium text-[#4a4339] hover:text-[#0f766e] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] sm:text-sm';

const RecruitmentNav = ({ profile, hasExperience }: RecruitmentNavProps) => (
  <nav aria-label="주요 탐색" className="border-b border-[#e8dfd0] bg-[#faf7f2]">
    <SectionContainer className="flex min-h-16 items-center justify-between gap-5 py-3">
      <a
        href="#about"
        className="shrink-0 text-xs font-semibold tracking-[0.18em] text-[#1f1b16] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] sm:text-sm"
      >
        DEV PORTFOLIO
      </a>
      <div className="flex min-w-0 items-center gap-3 overflow-x-auto py-1 sm:gap-5">
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
        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#0f766e]/30 px-3 py-1.5 text-xs font-semibold text-[#0f766e] hover:bg-[#eef7f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] sm:text-sm"
          >
            <FileText size={14} aria-hidden="true" />
            이력서
          </a>
        )}
      </div>
    </SectionContainer>
  </nav>
);

export default RecruitmentNav;
