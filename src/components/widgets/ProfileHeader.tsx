'use client';

import { Code2, Github, Notebook, Mail } from 'lucide-react';
import SocialButton from '@/components/SocialButton';
import { useLocale, profile } from '@/i18n';

const ProfileHeader = () => {
  const { t, locale } = useLocale();

  const chipClass =
    'px-2.5 py-0.5 sm:py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-[#f2ede4] text-[#4a4339] rounded-full border border-[#e8dfd0] hover:border-[#b8543a]/60 hover:text-[#1f1b16] transition-colors';

  return (
    <header className="max-w-7xl mx-auto px-5 sm:px-6 pt-16 sm:pt-20 pb-8 sm:pb-12 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 animate-fade-in-up relative z-20">
        {/* Left: Avatar + Profile Info */}
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
          {/* Profile Avatar */}
          <div className="relative shrink-0">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#f2ede4] flex items-center justify-center border border-[#e8dfd0]">
              <Code2 size={30} className="text-[#b8543a] sm:w-10 sm:h-10" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8a7f70] mb-2 sm:mb-3 font-mono">
              — Portfolio · 2025
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-light text-[#1f1b16] mb-2 tracking-tight leading-[1.05]">
              {t(profile.name)}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#b8543a] font-medium mb-4 sm:mb-5 italic font-serif leading-snug">
              {t(profile.tagline)}
            </p>

            {/* Intro Section: locale + screen size responsive */}
            {locale === 'ko' ? (
              <>
                {/* Korean: Paragraph on desktop, bullets on mobile */}
                <p className="hidden md:block text-base md:text-lg text-[#4a4339] max-w-xl leading-[1.7] whitespace-pre-line">
                  {t(profile.intro)}
                </p>
                <div className="md:hidden">
                  <ul className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    {profile.highlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-[#4a4339] leading-relaxed break-keep"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#b8543a] shrink-0 mt-2" />
                        <span className="min-w-0">{t(highlight)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex max-w-full items-center gap-2 px-3 py-1.5 bg-[#f2ede4] rounded-full border border-[#e8dfd0]">
                    <span className="text-xs font-medium text-[#8a7f70] leading-snug">
                      {t(profile.experience)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* English: Always bullets */}
                <ul className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                  {profile.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm md:text-base text-[#4a4339] leading-relaxed"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#b8543a] shrink-0 mt-2" />
                      <span className="min-w-0">{t(highlight)}</span>
                    </li>
                  ))}
                </ul>
                <div className="inline-flex max-w-full items-center gap-2 px-3 py-1.5 bg-[#f2ede4] rounded-full border border-[#e8dfd0]">
                  <span className="text-xs md:text-sm font-medium text-[#8a7f70] leading-snug">
                    {t(profile.experience)}
                  </span>
                </div>
              </>
            )}

            {/* Social Links */}
            <div className="flex gap-3 mt-5 sm:mt-6">
              <SocialButton
                icon={<Github size={20} />}
                label="GitHub"
                href="https://github.com/dev07060"
              />
              <SocialButton
                icon={<Notebook size={20} />}
                label="Blog"
                href="https://devblog-fawn.vercel.app"
              />
              <SocialButton
                icon={<Mail size={20} />}
                label="Email"
                href="mailto:byeongheeoh51@gmail.com"
              />
            </div>
          </div>
        </div>

        {/* Right: Tech Stack */}
        <div className="flex-1 space-y-4 sm:space-y-5">
          {/* Languages */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <span className="text-[11px] md:text-xs font-mono text-[#b8543a] uppercase tracking-[0.25em]">
              — Languages
            </span>
            <div className="flex flex-wrap gap-2">
              <span className={chipClass}>TypeScript</span>
              <span className={chipClass}>Dart</span>
              <span className={chipClass}>Python</span>
              <span className={chipClass}>Rust</span>
              <span className={chipClass}>Kotlin</span>
            </div>
          </div>
          {/* Mobile */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <span className="text-[11px] md:text-xs font-mono text-[#b8543a] uppercase tracking-[0.25em]">
              — Mobile
            </span>
            <div className="flex flex-wrap gap-2">
              <span className={chipClass}>Flutter</span>
              <span className={chipClass}>Jetpack Compose</span>
              <span className={chipClass}>React Native</span>
            </div>
          </div>
          {/* Web */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <span className="text-[11px] md:text-xs font-mono text-[#b8543a] uppercase tracking-[0.25em]">
              — Web
            </span>
            <div className="flex flex-wrap gap-2">
              <span className={chipClass}>React</span>
              <span className={chipClass}>Next.js</span>
              <span className={chipClass}>Vue · Nuxt</span>
            </div>
          </div>
          {/* Backend & AI */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <span className="text-[11px] md:text-xs font-mono text-[#b8543a] uppercase tracking-[0.25em]">
              — Backend · AI
            </span>
            <div className="flex flex-wrap gap-2">
              <span className={chipClass}>FastAPI</span>
              <span className={chipClass}>PostgreSQL</span>
              <span className={chipClass}>Milvus</span>
              <span className={chipClass}>SBERT</span>
              <span className={chipClass}>ONNX Runtime</span>
              <span className={chipClass}>Docker</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
