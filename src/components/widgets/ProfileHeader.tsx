'use client';

import { Code2, Github, Notebook, Mail } from 'lucide-react';
import SocialButton from '@/components/SocialButton';
import { useLocale, profile } from '@/i18n';

const ProfileHeader = () => {
  const { t, locale } = useLocale();

  return (
    <header className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-fade-in-up relative z-20">
        {/* Left: Avatar + Profile Info */}
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          {/* Profile Avatar */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-600">
              <Code2 size={36} className="text-cyan-400 sm:w-10 sm:h-10" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-1 tracking-tight md:tracking-normal">
              {t(profile.name)}
            </h1>
            <p className="text-lg md:text-xl text-cyan-400 font-medium mb-4">
              {t(profile.tagline)}
            </p>
            
            {/* Intro Section: locale + screen size responsive */}
            {locale === 'ko' ? (
              <>
                {/* Korean: Paragraph on desktop, bullets on mobile */}
                <p className="hidden md:block text-base md:text-lg text-slate-300 max-w-xl leading-relaxed whitespace-pre-line">
                  {t(profile.intro)}
                </p>
                <div className="md:hidden">
                  <ul className="space-y-2 mb-4">
                    {profile.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        {t(highlight)}
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                    <span className="text-xs font-medium text-slate-400">{t(profile.experience)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* English: Always bullets */}
                <ul className="space-y-2 mb-4">
                  {profile.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm md:text-base text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      {t(highlight)}
                    </li>
                  ))}
                </ul>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-xs md:text-sm font-medium text-slate-400">{t(profile.experience)}</span>
                </div>
              </>
            )}

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <SocialButton icon={<Github size={20} />} label="GitHub" href='https://github.com/dev07060'/>
              <SocialButton icon={<Notebook size={20} />} label="Blog" href='https://devblog-fawn.vercel.app'/>
              <SocialButton icon={<Mail size={20} />} label="Email" href='mailto:byeongheeoh51@gmail.com'/>
            </div>
          </div>
        </div>

        {/* Right: Tech Stack */}
        <div className="flex-1 space-y-4">
          {/* Mobile */}
          <div className="flex flex-col gap-2">
            <span className="text-xs md:text-sm font-semibold text-cyan-400 uppercase tracking-wider">Mobile</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">Flutter</span>
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">React Native</span>
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">Kotlin</span>
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">Jetpack Compose</span>
            </div>
          </div>
          {/* Web - Frameworks */}
          <div className="flex flex-col gap-2">
            <span className="text-xs md:text-sm font-semibold text-cyan-400 uppercase tracking-wider">Web</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">React</span>
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">Next.js</span>
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">Vue</span>
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">Nuxt</span>
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">TypeScript</span>
            </div>
          </div>
          {/* State Management */}
          <div className="flex flex-col gap-2">
            <span className="text-xs md:text-sm font-semibold text-cyan-400 uppercase tracking-wider">State</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">Zustand</span>
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 transition-colors">TanStack Query</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;

