import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => {
  const url = new URL(`../${path}`, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
};

test('root shell is server-rendered in Korean without locale controls', () => {
  const layout = read('src/app/layout.tsx');

  assert.match(layout, /<html lang="ko"/);
  assert.match(layout, /오병희 \| Flutter · 온디바이스 RAG 개발자/);
  assert.match(layout, /본문으로 건너뛰기/);
  assert.doesNotMatch(layout, /ClientWrapper|LanguageSwitcher|LocaleProvider/);
});

test('home renders one deterministic portfolio without audience parsing', () => {
  const page = read('src/app/page.tsx');
  const portfolio = read('src/components/Portfolio.tsx');

  assert.doesNotMatch(page, /searchParams|parseAudience|initialAudience/);
  assert.doesNotMatch(portfolio, /Audience|audienceContent|initialAudience/);
  assert.match(portfolio, /<DeveloperHero/);
});

test('portfolio follows the approved recruitment section order', () => {
  const portfolio = read('src/components/Portfolio.tsx');
  const markers = [
    '<RecruitmentNav',
    '<DeveloperHero',
    '<FeaturedWork',
    '<CoreCapabilities',
    '<ExperienceTimeline',
    '<ProjectGrid',
    '<OpenSourceBanner',
    '<RecruitmentCTA',
    '<Footer',
  ];

  let previous = -1;
  for (const marker of markers) {
    const current = portfolio.indexOf(marker);
    assert.ok(current > previous, `${marker} must appear in approved order`);
    previous = current;
  }
});

test('featured cases tell engine product backend story', () => {
  const portfolioData = read('src/data/portfolio.ts');
  const expected = [
    "'local-mobile-rag-gemma'",
    "'easy-contract-viewer'",
    "'law-info-engine'",
  ];

  let previous = -1;
  for (const marker of expected) {
    const current = portfolioData.indexOf(marker);
    assert.ok(current > previous, `${marker} must keep approved order`);
    previous = current;
  }
});

test('active source has no audience or locale runtime', () => {
  const files = [
    'src/app/page.tsx',
    'src/components/Portfolio.tsx',
    'src/components/widgets/ProjectCard.tsx',
    'src/components/widgets/ProjectGrid.tsx',
    'src/data/projects.ts',
    'src/types/project.ts',
  ];

  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(
      source,
      /Audience|audienceOverrides|audienceContent|useLocale|LocaleText|localize\(/
    );
  }
});

test('unverified profile facts and empty resume action are not rendered', () => {
  const recruitment = read('src/data/recruitment.ts');
  const hero = read('src/components/widgets/DeveloperHero.tsx');

  assert.doesNotMatch(recruitment, /MAU 1만|5년 4개월|10–100×/);
  assert.match(hero, /profile\.resumeUrl/);
});
