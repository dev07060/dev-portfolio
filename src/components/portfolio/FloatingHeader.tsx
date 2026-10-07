// src/components/portfolio/FloatingHeader.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface FloatingHeaderProps {
  brandLabel: string;
  firstCaseHref: string;
  hasExperience: boolean;
  resumeUrl?: string;
  /** id of the hero's own header; the floating bar shows only once it has scrolled out. */
  heroHeaderId: string;
}

const linkClass =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 text-sm font-medium text-ink hover:text-marker md:px-3.5 md:text-[15px]';

export default function FloatingHeader({
  brandLabel,
  firstCaseHref,
  hasExperience,
  resumeUrl,
  heroHeaderId,
}: FloatingHeaderProps) {
  const [visible, setVisible] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const heroHeader = document.getElementById(heroHeaderId);
    if (!heroHeader) return;
    const observer = new IntersectionObserver(([entry]) => {
      const nextVisible = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      const active = document.activeElement;
      if (!nextVisible && active instanceof HTMLElement && headerRef.current?.contains(active)) {
        // Hiding makes the bar inert, which would drop focus to <body>. Hand focus to the
        // matching hero-nav link (same href), or the hero brand link, first.
        const href = active.getAttribute('href');
        const heroLinks = Array.from(heroHeader.querySelectorAll<HTMLAnchorElement>('a[href]'));
        const match =
          heroLinks.find((link) => link.getAttribute('href') === href) ??
          heroLinks.find((link) => link.getAttribute('href') === '#top');
        match?.focus({ preventScroll: true });
      }
      setVisible(nextVisible);
    });
    observer.observe(heroHeader);
    return () => observer.disconnect();
  }, [heroHeaderId]);

  const hidden = !visible;

  return (
    <header
      ref={headerRef}
      data-floating-header
      data-visible={visible ? 'true' : 'false'}
      inert={hidden ? true : undefined}
      aria-hidden={hidden ? true : undefined}
      className="floating-header pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-3 md:top-4 md:px-4"
    >
      <div className="pointer-events-auto flex w-full max-w-[880px] items-center justify-between gap-2 rounded-full border border-line bg-surface/90 p-1 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.7)] backdrop-blur-md md:pl-3">
        <a
          href="#top"
          aria-label={`${brandLabel} 맨 위로`}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink hover:text-marker min-[420px]:px-3 min-[420px]:text-[15px] min-[420px]:font-bold min-[420px]:tracking-[-0.01em] md:text-base"
        >
          <ArrowUp size={18} aria-hidden="true" className="min-[420px]:hidden" />
          <span className="max-[420px]:hidden">{brandLabel}</span>
        </a>
        <nav aria-label="빠른 메뉴" className="flex items-center">
          <a href={firstCaseHref} className={linkClass}>작업</a>
          {hasExperience && <a href="#career" className={linkClass}>경력</a>}
          <a href="#contact" className={linkClass}>연락</a>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex min-h-11 items-center rounded-full border-[1.5px] border-ink px-2.5 text-sm font-semibold text-ink hover:border-marker hover:text-marker md:px-[18px]"
            >
              이력서 PDF
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
