import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => {
  const url = new URL(`../${path}`, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
};

test('root shell is server-rendered in Korean without locale controls', () => {
  const layout = read('src/app/layout.tsx');

  assert.match(layout, /<html[\s\S]*?lang="ko"/);
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

test('active source has no audience runtime', () => {
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
    assert.doesNotMatch(source, /Audience|audienceOverrides|audienceContent/);
  }
});

test('active source has no locale runtime', () => {
  const files = [
    'src/components/Portfolio.tsx',
    'src/components/widgets/ProjectCard.tsx',
    'src/components/widgets/ProjectGrid.tsx',
    'src/data/projects.ts',
    'src/types/project.ts',
  ];

  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /useLocale|LocaleText|LocalizedString|localize\(/);
  }
});

test('project data uses Korean strings and stable screen identifiers', () => {
  const types = read('src/types/project.ts');
  const projects = read('src/data/projects.ts');

  assert.match(types, /id: string;/);
  assert.doesNotMatch(types, /LocaleText|LocalizedString/);
  assert.doesNotMatch(projects, /\ben:\s*['`]/);
  assert.match(projects, /architecture\.ko\.svg/);
});

test('recruitment data separates project assets from hiring evidence', () => {
  const types = read('src/types/recruitment.ts');
  const data = read('src/data/recruitment.ts');

  for (const name of [
    'EvidenceLink',
    'RecruitmentCase',
    'ExperienceItem',
    'RecruitmentProfile',
  ]) {
    assert.match(types, new RegExp(`interface ${name}`));
  }
  assert.match(data, /local-mobile-rag-gemma/);
  assert.match(data, /pub\.dev 0\.18\.6/);
  assert.doesNotMatch(data, /MAU 1만|5년 4개월|10–100×/);
});

test('verified resume input populates six latest-first experience entries without private data', () => {
  const data = read('src/data/recruitment.ts');
  const companies = [
    '메리츠화재해상보험',
    '㈜피에트',
    '㈜인피니티익스체인지코리아',
    '튜링바이오',
    '㈜영우',
    '한국와콤',
  ];

  assert.match(data, /총 5년 5개월/);
  assert.doesNotMatch(data, /resumeUrl:/);

  let previous = -1;
  for (const company of companies) {
    const current = data.indexOf(company);
    assert.ok(current > previous, `${company} must appear in latest-first order`);
    previous = current;
  }
  assert.doesNotMatch(data, /010-9113-3496|경기 광주시|연봉/);
});

test('experience timeline resolves project ids to readable linked project names', () => {
  const timeline = read('src/components/widgets/ExperienceTimeline.tsx');
  const portfolio = read('src/components/Portfolio.tsx');

  assert.match(timeline, /projects: Project\[\]/);
  assert.match(timeline, /projects\.find/);
  assert.match(timeline, /relatedProject\.title/);
  assert.match(timeline, /href=\{relatedProjectHref/);
  assert.match(portfolio, /<ExperienceTimeline[\s\S]*?projects=\{projects\}/);
});

test('manual release documentation does not require VoiceOver or screen readers', () => {
  const report = read('docs/reports/2026-07-10-korean-portfolio-release-verification.md');
  const design = read(
    'docs/superpowers/specs/2026-07-10-korean-developer-recruitment-portfolio-design.md'
  );

  for (const source of [report, design]) {
    assert.doesNotMatch(source, /VoiceOver|screen reader|스크린리더/);
  }
});

test('case detail separates verification, outcomes, trade-offs, and non-goals', () => {
  const types = read('src/types/recruitment.ts');
  const data = read('src/data/recruitment.ts');
  const modal = read('src/components/widgets/ProjectModal.tsx');

  for (const field of ['verification', 'tradeoffs', 'nonGoals']) {
    assert.match(types, new RegExp(`${field}: string\\[\\];`));
    assert.match(data, new RegExp(`${field}: \\[`));
  }

  const detailOrder = [
    '— 문제와 제약',
    '— 직접 설계·구현한 범위',
    '— 구조와 핵심 기술',
    '— 테스트·평가·운영 검증',
    '— 결과와 영향',
    '— Trade-off와 비목표',
  ];
  let previous = -1;
  for (const marker of detailOrder) {
    const current = modal.indexOf(marker);
    assert.ok(current > previous, `${marker} must appear in approved detail order`);
    previous = current;
  }
});

test('capability descriptions name their supporting representative cases', () => {
  const portfolioData = read('src/data/portfolio.ts');

  for (const projectName of [
    'mobile_rag_engine',
    'Easy Contract Viewer',
    'Swifty-law',
  ]) {
    assert.match(portfolioData, new RegExp(projectName));
  }
});

test('additional project cards expose a concise responsibility boundary', () => {
  const card = read('src/components/widgets/ProjectCard.tsx');

  assert.match(card, /!recruitmentCase && card\.highlight/);
  assert.match(card, /담당 범위/);
});

test('recruitment flow has explicit component boundaries', () => {
  for (const component of [
    'RecruitmentNav',
    'DeveloperHero',
    'CoreCapabilities',
    'ExperienceTimeline',
    'RecruitmentCTA',
    'SectionContainer',
    'SectionHeader',
  ]) {
    const source = read(`src/components/widgets/${component}.tsx`);
    assert.ok(source.length > 0, `${component} must exist`);
  }
});

test('empty experience and missing resume actions stay hidden', () => {
  const timeline = read('src/components/widgets/ExperienceTimeline.tsx');
  const navigation = read('src/components/widgets/RecruitmentNav.tsx');
  const portfolio = read('src/components/Portfolio.tsx');
  const resumeSurfaces = [
    read('src/components/widgets/RecruitmentNav.tsx'),
    read('src/components/widgets/DeveloperHero.tsx'),
    read('src/components/widgets/RecruitmentCTA.tsx'),
  ];

  assert.match(timeline, /if \(!items\.length\) return null/);
  assert.match(navigation, /hasExperience\s*&&/);
  assert.match(portfolio, /hasExperience=\{experienceItems\.length > 0\}/);
  for (const source of resumeSurfaces) {
    assert.match(source, /profile\.resumeUrl\s*&&/);
  }
});

test('project detail and presentation actions use Korean accessible names', () => {
  const card = read('src/components/widgets/ProjectCard.tsx');
  const modal = read('src/components/widgets/ProjectModal.tsx');
  const device = read('src/components/widgets/DeviceFrame.tsx');
  const presentation = read('src/components/widgets/PresentationOverlay.tsx');

  assert.match(card, /aria-haspopup="dialog"/);
  assert.match(card, /\$\{title\} 프로젝트 상세 열기/);
  assert.match(modal, /\$\{project\.title\} 프로젝트 상세 닫기/);
  assert.match(device, /\$\{title\} 프레젠테이션 열기/);
  assert.match(presentation, /aria-label="프레젠테이션 닫기"/);
  assert.match(presentation, /aria-label="이전 화면"/);
  assert.match(presentation, /aria-label="다음 화면"/);
  assert.match(presentation, /aria-live="polite"/);
});

test('modal order and screenshot regions follow reading and keyboard order', () => {
  const modal = read('src/components/widgets/ProjectModal.tsx');
  const device = read('src/components/widgets/DeviceFrame.tsx');

  assert.doesNotMatch(modal, /order-1|order-2/);
  assert.doesNotMatch(modal, /<h4/);
  assert.match(device, /tabIndex=\{isScrollable \? 0 : undefined\}/);
  assert.match(device, /role=\{isScrollable \? 'region' : undefined\}/);
  assert.match(device, /스크린샷 스크롤 영역/);
  assert.doesNotMatch(device, /scrollbar-hide/);
});

test('unverified profile facts and empty resume action are not rendered', () => {
  const recruitment = read('src/data/recruitment.ts');
  const hero = read('src/components/widgets/DeveloperHero.tsx');

  assert.doesNotMatch(recruitment, /MAU 1만|5년 4개월|10–100×/);
  assert.match(hero, /profile\.resumeUrl/);
});
