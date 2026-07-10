import { ArrowDown, ExternalLink, FileText, Mail } from 'lucide-react';
import type { RecruitmentProfile } from '@/types/recruitment';
import SectionContainer from './SectionContainer';

interface DeveloperHeroProps {
  profile: RecruitmentProfile;
}

const DeveloperHero = ({ profile }: DeveloperHeroProps) => (
  <section id="about" className="py-12 sm:py-16 lg:py-20">
    <SectionContainer>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-end lg:gap-14">
        <div className="animate-fade-in-up">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60] sm:text-[11px]">
            — 개발자 포트폴리오
          </p>
          <h1 className="font-serif text-5xl font-light leading-none tracking-tight text-[#1f1b16] sm:text-6xl md:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-2 font-[family-name:var(--font-fraunces)] text-base italic text-[#756b60] sm:text-lg">
            {profile.englishName}
          </p>
          <p className="mt-6 text-lg font-semibold leading-snug text-[#0f766e] break-keep sm:text-xl">
            {profile.role}
          </p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-[#4a4339] sm:text-sm">
            {profile.position}
          </p>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-[#2f2a23] break-keep sm:text-2xl">
            {profile.positioning}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#featured-work"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1f1b16] px-5 py-3 text-sm font-semibold text-[#faf7f2] transition-colors hover:bg-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f2]"
            >
              대표 기술 사례
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0f766e]/40 bg-white px-5 py-3 text-sm font-semibold text-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
              >
                <FileText size={16} aria-hidden="true" />
                이력서 보기
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#b8543a]/40 bg-white px-5 py-3 text-sm font-semibold text-[#1f1b16] transition-colors hover:border-[#0f766e] hover:text-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
            >
              <Mail size={16} aria-hidden="true" />
              채용 관련 이메일
            </a>
          </div>
        </div>

        {profile.proofItems.length > 0 && (
          <aside aria-label="검증된 공개 근거" className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#0f766e]">
              검증된 공개 근거
            </p>
            {profile.proofItems.map((proof) => {
              const content = (
                <>
                  <span className="text-xs font-medium text-[#756b60]">{proof.label}</span>
                  <strong className="mt-2 block text-base leading-snug text-[#1f1b16] break-keep">
                    {proof.value}
                  </strong>
                  {proof.evidence && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f766e]">
                      공개 근거 보기
                      <ExternalLink size={13} aria-hidden="true" />
                    </span>
                  )}
                </>
              );

              return proof.evidence ? (
                <a
                  key={proof.value}
                  href={proof.evidence}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-[#d9e4e1] bg-white p-5 shadow-[0_18px_40px_-30px_rgba(31,27,22,0.45)] transition-colors hover:border-[#0f766e]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={proof.value}
                  className="rounded-xl border border-[#d9e4e1] bg-white p-5"
                >
                  {content}
                </div>
              );
            })}
          </aside>
        )}
      </div>
    </SectionContainer>
  </section>
);

export default DeveloperHero;
