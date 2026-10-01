import { buildMailHref } from '@/lib/mailHref';
import type { PortfolioCopy } from '@/types/portfolio';
import type { RecruitmentProfile } from '@/types/recruitment';

interface ContactSectionProps {
  profile: RecruitmentProfile;
  copy: PortfolioCopy;
}

export default function ContactSection({ profile, copy }: ContactSectionProps) {
  const heading = copy.contactHeading;
  const highlight = copy.contactHeadingHighlight;
  const at = highlight ? heading.indexOf(highlight) : -1;

  return (
    <section id="contact" aria-labelledby="contact-title" className="screen bg-ground">
      <div className="screen-inner">
        <span className="t-label mb-4 block">연락</span>
        <h2 id="contact-title" className="t-h2 m-0 max-w-[1040px] !leading-[1.55]">
          {highlight && at >= 0 ? (
            <>
              {heading.slice(0, at)}
              <mark className="contact-mark">{highlight}</mark>
              {heading.slice(at + highlight.length)}
            </>
          ) : (
            heading
          )}
        </h2>
        <p className="mb-0 mt-8 max-w-[620px] text-lg leading-[1.75] text-sub">{copy.contactDescription}</p>
        <a
          href={buildMailHref(profile.email, copy.contactMailSubject)}
          className="link-marker mt-12 inline-block font-mono text-[clamp(22px,3.2vw,44px)] font-medium tracking-[-0.02em] decoration-[3px] underline-offset-[10px]"
        >
          {profile.email}
        </a>
        <div className="mt-11 flex flex-wrap gap-3">
          {profile.resumeUrl && <a href={profile.resumeUrl} className="btn-primary">이력서 PDF</a>}
          <a href={profile.githubUrl} className="btn-outline">GitHub ↗</a>
        </div>
      </div>
      <footer className="absolute inset-x-0 bottom-8">
        <div className="screen-inner flex flex-wrap justify-between gap-2 text-xs text-faint">
          <span>
            © <span className="font-mono">{new Date().getFullYear()}</span> {profile.name}
          </span>
          <span>Powered by Next.js</span>
        </div>
      </footer>
    </section>
  );
}
