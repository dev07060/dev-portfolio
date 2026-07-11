import { ExternalLink, FileText, Github, Mail } from 'lucide-react';
import type { PortfolioCopy } from '@/types/portfolio';
import type { RecruitmentProfile } from '@/types/recruitment';
import SectionContainer from './SectionContainer';

interface RecruitmentCTAProps {
  profile: RecruitmentProfile;
  copy: PortfolioCopy;
}

const actionClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#faf7f2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1b16]';

const RecruitmentCTA = ({ profile, copy }: RecruitmentCTAProps) => {
  const contactHref = copy.contactMailSubject
    ? `mailto:${profile.email}?subject=${encodeURIComponent(copy.contactMailSubject)}`
    : `mailto:${profile.email}`;

  return (
    <section id="contact" className="pb-8 sm:pb-12">
    <SectionContainer>
      <div className="rounded-2xl bg-[#1f1b16] px-6 py-9 text-[#faf7f2] sm:px-9 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8fc4bd]">
            연락
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-light leading-tight sm:text-4xl">
            {copy.contactHeading}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#cfc4b2] break-keep sm:text-base">
            {copy.contactDescription}
          </p>
        </div>
        <div className="mt-7 flex shrink-0 flex-wrap gap-3 lg:mt-0 lg:justify-end">
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionClass} bg-[#faf7f2] text-[#1f1b16]`}
            >
              <FileText size={16} aria-hidden="true" />
              이력서 보기
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
          <a
            href={contactHref}
            className={`${actionClass} bg-[#faf7f2] text-[#1f1b16]`}
          >
            <Mail size={16} aria-hidden="true" />
            {copy.contactCta}
          </a>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${actionClass} border border-white/30 text-[#faf7f2] hover:bg-white/10`}
          >
            <Github size={16} aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>
    </SectionContainer>
    </section>
  );
};

export default RecruitmentCTA;
