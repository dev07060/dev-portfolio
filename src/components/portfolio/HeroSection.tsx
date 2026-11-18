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
  return text.split(/(\d[\d.]*|[A-Za-z]+[_.][A-Za-z0-9_.]+)/).map((part, index) =>
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
  return (
    <section id="top" aria-labelledby="hero-name" className="screen bg-ground">
      <header id="hero-header" className="absolute inset-x-0 top-0">
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
                target="_blank"
                rel="noopener noreferrer"
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
          {/* 이름은 누구인지만 알려 주고, 가장 큰 글자는 무엇을 하는 사람인지에 쓴다. */}
          <h1 id="hero-name" className="m-0">
            <span className="t-name block">{profile.name}</span>
            <span className="t-hero mt-4 block">{profile.headline ?? profile.role}</span>
          </h1>
          <p className="t-lead mb-0 mt-6 max-w-[520px]">
            {profile.intro ?? profile.positioning}
          </p>
          <div className="mt-8 max-w-[520px] border-t border-line pt-5">
            <p className="m-0 text-[15px] leading-[1.7] text-sub">
              {profile.proofItems.map((item, index) => (
                <span key={item.label}>
                  {index > 0 && ' · '}
                  <span className={item.evidence ? undefined : 'whitespace-nowrap'}>
                    {item.label}{' '}
                    {item.evidence ? (
                      <a href={item.evidence} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline decoration-line-soft underline-offset-4 hover:text-marker">
                        {monoTokens(item.value)} ↗
                      </a>
                    ) : (
                      <span className="font-medium text-ink">{monoTokens(item.value)}</span>
                    )}
                  </span>
                </span>
              ))}
            </p>
            <ul aria-label={copy.capabilityAriaLabel} className="m-0 mt-4 grid list-none gap-2 p-0">
              {capabilities.map((capability) => (
                <li key={capability.title} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-base font-semibold text-ink">{capability.title}</span>
                  <span className="text-sm text-sub">{capability.evidence}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
            {profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">이력서 PDF</a>}
            <a href={buildMailHref(profile.email, copy.contactMailSubject)} className="btn-outline">{copy.contactCta}</a>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[15px] font-medium text-ink hover:text-marker">
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
