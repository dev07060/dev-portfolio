// src/components/portfolio/PortfolioSearch.tsx
'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import {
  searchDocuments,
  tokenize,
  type SearchDocument,
  type TextSegment,
} from '@/lib/portfolioSearch';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { heroSearchDemoWords, heroSearchSuggestions } from '@/data/searchDocuments';

const DEMO_WORDS = heroSearchDemoWords;
const SUGGESTIONS = heroSearchSuggestions;
const TIMING = { start: 700, type: 130, hold: 2400, erase: 45, gap: 380 } as const;
const REDUCED_MOTION_QUERY = DEMO_WORDS[0];

const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
};

interface PortfolioSearchProps {
  documents: readonly SearchDocument[];
  onOpenProject: (projectId: string) => void;
}

function Highlighted({
  segments,
  sweepKey,
  delayMs,
}: {
  segments: TextSegment[];
  sweepKey: string;
  delayMs: number;
}) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.hit ? (
          <mark
            key={`${sweepKey}-${index}`}
            className="search-mark"
            style={{ animationDelay: `${delayMs}ms` }}
          >
            {segment.text}
          </mark>
        ) : (
          <span key={`${sweepKey}-${index}`}>{segment.text}</span>
        )
      )}
    </>
  );
}

export default function PortfolioSearch({ documents, onOpenProject }: PortfolioSearchProps) {
  const [query, setQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [demoRunning, setDemoRunning] = useState(true);
  const [inView, setInView] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef('');
  const progress = useRef({ word: 0, chars: 0, phase: 'type' as 'type' | 'erase', started: false });

  const demoActive = demoRunning && !reducedMotion;
  const paused = !inView || !pageVisible;

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!demoActive || paused) return;
    let timeoutId = 0;
    const tick = () => {
      const state = progress.current;
      const word = DEMO_WORDS[state.word];
      if (state.phase === 'type') {
        state.chars += 1;
        const next = word.slice(0, state.chars);
        setQuery(next);
        setInputText(next);
        if (state.chars >= word.length) {
          state.phase = 'erase';
          timeoutId = window.setTimeout(tick, TIMING.hold);
        } else {
          timeoutId = window.setTimeout(tick, TIMING.type);
        }
        return;
      }
      state.chars -= 1;
      setInputText(word.slice(0, state.chars));
      if (state.chars <= 0) {
        state.phase = 'type';
        state.word = (state.word + 1) % DEMO_WORDS.length;
        timeoutId = window.setTimeout(tick, TIMING.gap);
      } else {
        timeoutId = window.setTimeout(tick, TIMING.erase);
      }
    };
    const firstDelay = progress.current.started ? TIMING.type : TIMING.start;
    progress.current.started = true;
    timeoutId = window.setTimeout(tick, firstDelay);
    return () => window.clearTimeout(timeoutId);
  }, [demoActive, paused]);

  const stopDemo = () => {
    if (!demoRunning) return;
    setDemoRunning(false);
    setInputText(reducedMotion ? REDUCED_MOTION_QUERY : queryRef.current);
    if (reducedMotion) setQuery(REDUCED_MOTION_QUERY);
  };

  const runQuery = (value: string) => {
    stopDemo();
    setQuery(value);
    setInputText(value);
  };

  const effectiveQuery = reducedMotion && demoRunning ? REDUCED_MOTION_QUERY : query;
  const shownInput = reducedMotion && demoRunning ? REDUCED_MOTION_QUERY : inputText;
  const results = useMemo(
    () => searchDocuments(documents, effectiveQuery),
    [documents, effectiveQuery]
  );
  const hasQuery = tokenize(effectiveQuery).length > 0;
  const listKey = results.map((result) => result.document.id).join('|');

  return (
    <div ref={rootRef} className="search-panel">
      <div className="flex items-center justify-between gap-3 text-xs text-sub">
        <label htmlFor="portfolio-search-input">포트폴리오 검색</label>
        {demoActive ? (
          <button
            type="button"
            onClick={stopDemo}
            className="-my-3 min-h-11 text-sub underline decoration-line-soft underline-offset-4 hover:text-marker"
          >
            자동 입력 멈추기
          </button>
        ) : (
          <span>프로젝트 <span className="font-mono">{documents.length}</span>개에서 찾기</span>
        )}
      </div>

      <div className="search-field">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          id="portfolio-search-input"
          type="search"
          value={shownInput}
          onFocus={stopDemo}
          onChange={(event) => runQuery(event.target.value)}
          placeholder="기술, 제품, 키워드로 검색"
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent text-xl font-medium text-ink outline-none placeholder:text-sub"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4">
        <span className="text-xs text-sub">추천 검색어</span>
        {SUGGESTIONS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => runQuery(label)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-sub underline decoration-line-soft underline-offset-4 hover:text-marker"
          >
            {label}
          </button>
        ))}
      </div>

      <p aria-live={demoActive ? 'off' : 'polite'} className="m-0 font-mono text-xs text-sub">
        {hasQuery ? `결과 ${results.length}건` : '추천 결과'}
      </p>

      {/* md+: room for the tallest demo result set (모바일 개발, ~472px) so the hero keeps its height during autoplay. */}
      <ul aria-label="검색 결과" className="m-0 flex min-h-[380px] list-none flex-col gap-1.5 p-0 md:min-h-[480px]">
        {results.map((result, index) => {
          const { document } = result;
          const target = document.target;
          const sweepKey = `${effectiveQuery}:${document.id}`;
          const markDelay = 140 + index * 70;
          const body = (
            <>
              <span className="w-6 shrink-0 pt-[3px] font-mono text-[13px] text-sub">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className={document.monoTitle ? 'font-mono text-[19px] font-medium' : 'text-[19px] font-semibold'}>
                  <Highlighted segments={result.titleSegments} sweepKey={`${sweepKey}:t`} delayMs={markDelay} />
                </span>
                <span className="text-[15px] leading-[1.65] text-sub">
                  <Highlighted segments={result.snippetSegments} sweepKey={`${sweepKey}:s`} delayMs={markDelay} />
                </span>
                {result.keywordMatches.length > 0 && (
                  <span className="font-mono text-xs text-sub">
                    관련 키워드 · {result.keywordMatches.join(', ')}
                  </span>
                )}
                <span className="font-mono text-xs text-sub">{document.meta}</span>
              </span>
            </>
          );
          return (
            <li key={`${listKey}:${document.id}`} className="search-result" style={{ animationDelay: `${index * 70}ms` }}>
              {target.kind === 'anchor' ? (
                <a href={target.href} className="search-result-link">{body}</a>
              ) : (
                <button type="button" onClick={() => onOpenProject(target.projectId)} className="search-result-link">
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {hasQuery && results.length === 0 && (
        <p className="m-0 text-[15px] leading-[1.7] text-sub">
          ‘{effectiveQuery}’에 맞는 결과가 없습니다. 추천 검색어를 눌러 보세요.
        </p>
      )}
    </div>
  );
}
