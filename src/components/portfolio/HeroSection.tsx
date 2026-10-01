import type { ReactNode } from 'react';
import type { SearchDocument } from '@/lib/portfolioSearch';
import { buildMailHref } from '@/lib/mailHref';
import type { Capability, PortfolioCopy } from '@/types/portfolio';
import type { RecruitmentProfile } from '@/types/recruitment';
import PortfolioSearch from './PortfolioSearch';

interface HeroSectionProps {
  profile: RecruitmentProfile;
  copy: PortfolioCopy;
  capabilities: Capability[];
  searchDocuments: readonly SearchDocument[];
  firstCaseHref: string;
  hasExperience: boolean;
  onOpenProject: (projectId: string) => void;
}

const navLinkClass = 'inline-flex min-h-11 items-center text-ink hover:text-marker';

// Mono only for numbers/dates/code; Korean prose stays sans.
function monoTokens(text: string): ReactNode[] {
  return text.split(/([A-Za-z0-9_.]+)/).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="font-mono">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function HeroSection({
  profile,
  copy,
  capabilities,
  searchDocuments,
  firstCaseHref,
  hasExperience,
  onOpenProject,
}: HeroSectionProps) {
  const hasHeadline = Boolean(profile.headline);
  return (
    <section id="top" aria-labelledby="hero-name" className="screen bg-ground">
      <header className="absolute inset-x-0 top-0">
        <div className="screen-inner flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <a href="#top" className="inline-flex min-h-11 items-center text-[17px] font-bold tracking-[-0.01em] text-ink">
            {copy.navBrandLabel}
          </a>
          <nav aria-label="주요 메뉴" className="flex flex-wrap items-center gap-x-7 gap-y-1 text-[15px] font-medium">
            <a href={firstCaseHref} className={navLinkClass}>작업</a>
            {hasExperience && <a href="#career" className={navLinkClass}>경력</a>}
            <a href="#contact" className={navLinkClass}>연락</a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                className="inline-flex min-h-11 items-center rounded-[10px] border-[1.5px] border-ink px-[18px] text-sm font-semibold text-ink hover:border-marker hover:text-marker"
              >
                이력서 PDF
              </a>
            )}
          </nav>
        </div>
      </header>

      <div className="screen-inner flex flex-wrap items-center gap-16">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col">
          <h1 id="hero-name" className="t-display m-0">{profile.name}</h1>
          <p className="t-role mb-0 mt-5">{profile.headline ?? profile.role}</p>
          {hasHeadline && (
            <p className="mb-0 mt-3 text-base font-medium text-sub">{profile.role}</p>
          )}
          <p className="mb-0 mt-8 max-w-[500px] text-lg leading-[1.75] text-sub">
            {profile.intro ?? profile.positioning}
          </p>
          {profile.intro && (
            <p className="mb-0 mt-3 max-w-[500px] text-[15px] leading-[1.7] text-sub">{profile.positioning}</p>
          )}
          <p className="mb-0 mt-4 text-[13px] text-faint">
            {profile.proofItems.map((item, index) => (
              <span key={item.label}>
                {index > 0 && ' · '}
                {item.label}{' '}
                {item.evidence ? (
                  <a href={item.evidence} className="text-sub underline decoration-line-soft underline-offset-4 hover:text-marker">
                    {monoTokens(item.value)} ↗
                  </a>
                ) : (
                  monoTokens(item.value)
                )}
              </span>
            ))}
            {' · '}
            {profile.position}
          </p>
          <ul aria-label={copy.capabilityAriaLabel} className="m-0 mt-2 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-sm text-sub">
            {capabilities.map((capability) => (
              <li key={capability.title}>
                {capability.title} <span className="text-faint">{capability.evidence}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
            {profile.resumeUrl && <a href={profile.resumeUrl} className="btn-primary">이력서 PDF</a>}
            <a href={buildMailHref(profile.email, copy.contactMailSubject)} className="btn-outline">{copy.contactCta}</a>
            <a href={profile.githubUrl} className="inline-flex min-h-11 items-center text-[15px] font-medium text-ink hover:text-marker">
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="min-w-0 flex-[1.25_1_520px]">
          <PortfolioSearch documents={searchDocuments} onOpenProject={onOpenProject} />
        </div>
      </div>
    </section>
  );
}
