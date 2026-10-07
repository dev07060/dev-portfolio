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

  /** Replays the demo from the word after the one it stopped on; the button keeps focus (same element). */
  const replayDemo = () => {
    if (demoRunning || reducedMotion) return;
    const next = (progress.current.word + 1) % DEMO_WORDS.length;
    progress.current = { word: next, chars: 0, phase: 'type', started: true };
    setInputText('');
    setDemoRunning(true);
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
  const normalizedQuery = effectiveQuery.trim().toLowerCase();
  const listKey = results.map((result) => result.document.id).join('|');

  return (
    <div ref={rootRef} className="search-panel">
      <div className="search-query">
        <div className="flex min-h-6 items-center justify-between gap-3 text-[13px] text-sub">
          <label htmlFor="portfolio-search-input" className="font-medium">포트폴리오 검색</label>
          {reducedMotion ? (
            <span>프로젝트 <span className="font-mono">{documents.length}</span>개에서 찾기</span>
          ) : (
            <button
              type="button"
              onClick={demoRunning ? stopDemo : replayDemo}
              className="search-demo-control"
            >
              {demoRunning ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <rect x="2" y="1.5" width="2.75" height="9" rx="0.75" />
                  <rect x="7.25" y="1.5" width="2.75" height="9" rx="0.75" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M3 1.9v8.2a.6.6 0 0 0 .9.52l7-4.1a.6.6 0 0 0 0-1.04l-7-4.1A.6.6 0 0 0 3 1.9Z" />
                </svg>
              )}
              {demoRunning ? '자동 입력 멈추기' : '자동 입력 다시 보기'}
            </button>
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

        <div className="flex flex-wrap items-baseline gap-x-5">
          <span className="mr-1 text-xs text-sub">추천 검색어</span>
          {SUGGESTIONS.map((label) => {
            const selected = label.toLowerCase() === normalizedQuery;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={selected}
                onClick={() => runQuery(label)}
                className="search-suggestion"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="search-results">
        <p id="portfolio-search-results-heading" aria-live={demoActive ? 'off' : 'polite'} className="search-results-heading">
          {hasQuery ? (
            <>
              <span className="[overflow-wrap:anywhere]">‘{effectiveQuery.trim()}’</span> 결과{' '}
              {/* leading-none: the mono digit must not grow the line box (heading height stays fixed). */}
              <span className="font-semibold leading-none text-ink">
                <span className="font-mono font-medium">{results.length}</span>건
              </span>
            </>
          ) : (
            '추천 결과'
          )}
        </p>

        {/* The hero must keep one height while autoplay cycles the demo words (section snapping reads it):
            .search-result-area reserves exactly the tallest demo result set (measured; see globals.css). */}
        <div className="search-result-area">
        <ul
          aria-label="검색 결과"
          aria-describedby="portfolio-search-results-heading"
          className="search-result-list"
        >
          {results.map((result, index) => {
            const { document } = result;
            const target = document.target;
            const sweepKey = `${effectiveQuery}:${document.id}`;
            const markDelay = 140 + index * 70;
            const body = (
              <>
                <span className="w-6 shrink-0 font-mono text-[13px] text-sub">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className={document.monoTitle ? 'font-mono text-[19px] font-medium leading-[1.4]' : 'text-[19px] font-semibold leading-[1.4]'}>
                    <Highlighted segments={result.titleSegments} sweepKey={`${sweepKey}:t`} delayMs={markDelay} />
                  </span>
                  <span className="text-[15px] leading-[1.65] text-sub">
                    <Highlighted segments={result.snippetSegments} sweepKey={`${sweepKey}:s`} delayMs={markDelay} />
                  </span>
                  <span className="text-[13px] leading-[1.5] text-sub">
                    {document.meta}
                    {result.keywordMatches.length > 0 && ` · 키워드 ${result.keywordMatches.join(', ')}`}
                  </span>
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
      </div>
    </div>
  );
}
