import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const read = (path) => {
  const url = new URL(`../${path}`, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
};

const pdfToTextBinary = () => {
  const bundled = join(
    homedir(),
    '.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/bin/pdftotext'
  );
  return process.env.PDFTOTEXT_BIN || (existsSync(bundled) ? bundled : 'pdftotext');
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
    '<ExperienceTimeline',
    '<ProjectArchive',
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
    'src/components/widgets/ProjectArchive.tsx',
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
    'src/components/widgets/ProjectArchive.tsx',
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
    'SupportingPackage',
    'RecruitmentCase',
    'ExperienceItem',
    'RecruitmentProfile',
  ]) {
    assert.match(types, new RegExp(`interface ${name}`));
  }
  assert.match(data, /local-mobile-rag-gemma/);
  assert.match(data, /pub\.dev 0\.18\.6/);
  assert.match(types, /statusLabel: string;/);
  assert.doesNotMatch(types, /publicStatus: string;/);
  assert.doesNotMatch(data, /MAU 1만|5년 4개월|10–100×/);
});

test('featured cases distinguish public evidence and integrate supporting packages', () => {
  const types = read('src/types/recruitment.ts');
  const data = read('src/data/recruitment.ts');
  const card = read('src/components/widgets/ProjectCard.tsx');
  const modal = read('src/components/widgets/ProjectModal.tsx');
  const portfolio = read('src/components/Portfolio.tsx');
  const widgets = read('src/components/widgets/index.ts');
  const standalone = read('src/components/widgets/OpenSourceBanner.tsx');

  assert.match(types, /supportingPackages\?: SupportingPackage\[\];/);
  assert.match(
    data,
    /projectId: 'local-mobile-rag-gemma'[\s\S]*?supportingPackages: \[[\s\S]*?name: 'rag_engine_flutter'[\s\S]*?version: '0\.18\.3'/
  );
  assert.match(card, /evidenceLinks\.length > 0/);
  assert.match(card, /공개 근거가 있는 결과/);
  assert.match(card, /핵심 결과/);
  assert.doesNotMatch(card, /검증 가능한 결과/);
  assert.match(card, /관련 공개 패키지/);
  assert.match(modal, /관련 공개 패키지/);
  assert.match(modal, /supportingPackages/);
  assert.doesNotMatch(portfolio, /<OpenSourceBanner/);
  assert.doesNotMatch(widgets, /OpenSourceBanner/);
  assert.equal(standalone, '');
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
  assert.match(data, /resumeUrl: '\/oh-byeonghee-resume-ko\.pdf'/);

  let previous = -1;
  for (const company of companies) {
    const current = data.indexOf(company);
    assert.ok(current > previous, `${company} must appear in latest-first order`);
    previous = current;
  }
  assert.doesNotMatch(data, /\b01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}\b/);
  assert.doesNotMatch(data, /(?:휴대폰|주소|거주지|생년월일|희망\s*(?:연봉|급여|근무지)|병역)\s*[:：]?/);
});

test('public resume PDF is extractable and contains only approved public profile fields', () => {
  const pdf = new URL('../public/oh-byeonghee-resume-ko.pdf', import.meta.url);

  assert.ok(existsSync(pdf), 'sanitized public resume PDF must exist');
  assert.equal(readFileSync(pdf).subarray(0, 5).toString(), '%PDF-');

  const text = execFileSync(pdfToTextBinary(), [fileURLToPath(pdf), '-'], {
    encoding: 'utf8',
  })
    .normalize('NFKC')
    .replace(/\s+/g, ' ');

  for (const expected of [
    '오병희',
    'byeongheeoh51@gmail.com',
    'github.com/dev07060',
    '크로스플랫폼 개발자',
    '메리츠화재해상보험',
    'mobile_rag_engine',
  ]) {
    assert.match(text, new RegExp(expected));
  }

  assert.doesNotMatch(text, /\b01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}\b/);
  assert.doesNotMatch(
    text,
    /(?:휴대폰|주소|거주지|생년월일|학력|희망\s*(?:연봉|급여|근무지)|병역|보훈|장애)\s*[:：]?/
  );
  assert.doesNotMatch(text, /(?:연봉|급여)\s*[:：]?\s*[\d,]+\s*만?원/);
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

test('experience timeline keeps one result visible and discloses the remaining detail', () => {
  const timeline = read('src/components/widgets/ExperienceTimeline.tsx');

  assert.match(timeline, /<details/);
  assert.match(timeline, /<summary[\s\S]*?상세 경력 보기/);
  assert.match(timeline, /item\.highlights\[0\]/);
  assert.match(timeline, /item\.highlights\.slice\(1\)/);
  assert.match(timeline, /item\.employmentType/);
  assert.match(timeline, /eyebrow="경력"/);
  assert.match(timeline, /최신순으로 역할과 대표 성과를 요약했습니다\./);
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
    '— 트레이드오프와 비목표',
  ];
  let previous = -1;
  for (const marker of detailOrder) {
    const current = modal.indexOf(marker);
    assert.ok(current > previous, `${marker} must appear in approved detail order`);
    previous = current;
  }
});

test('active recruitment UI keeps decorative copy Korean', () => {
  const activeUi = [
    'src/data/recruitment.ts',
    'src/components/widgets/DeveloperHero.tsx',
    'src/components/widgets/FeaturedWork.tsx',
    'src/components/widgets/ExperienceTimeline.tsx',
    'src/components/widgets/ProjectArchive.tsx',
    'src/components/widgets/ProjectModal.tsx',
    'src/components/widgets/RecruitmentCTA.tsx',
    'src/components/widgets/Footer.tsx',
  ]
    .map(read)
    .join('\n');

  for (const pattern of [
    /Byeonghee Oh/,
    /Engine → Product → Backend/,
    /eyebrow="Engineering capabilities"/,
    /eyebrow="Experience"/,
    /eyebrow="Project archive"/,
    /Open source support/,
    />\s*Contact\s*</,
    /Trade-off/,
  ]) {
    assert.doesNotMatch(activeUi, pattern);
  }
});

test('hero owns compact project-backed capabilities without a standalone section', () => {
  const portfolio = read('src/components/Portfolio.tsx');
  const portfolioData = read('src/data/portfolio.ts');
  const hero = read('src/components/widgets/DeveloperHero.tsx');
  const widgets = read('src/components/widgets/index.ts');
  const standalone = read('src/components/widgets/CoreCapabilities.tsx');

  assert.match(portfolio, /<DeveloperHero[\s\S]*?capabilities=\{capabilities\}/);
  assert.doesNotMatch(portfolio, /<CoreCapabilities/);
  assert.match(hero, /capabilities: Capability\[\]/);
  assert.match(hero, /capabilities\.map/);
  assert.doesNotMatch(widgets, /CoreCapabilities/);
  assert.equal(standalone, '');

  for (const [title, evidence] of [
    ['Flutter 제품화·릴리스', 'Easy Contract Viewer'],
    ['온디바이스 Retrieval/RAG', 'mobile_rag_engine'],
    ['Rust FFI·네이티브 검색', 'mobile_rag_engine'],
    ['검색 백엔드·평가 운영', 'Swifty-law'],
  ]) {
    assert.match(portfolioData, new RegExp(`title: '${title}'[\\s\\S]*?evidence: '${evidence}'`));
  }
});

test('additional projects use a compact archive without thumbnail cards', () => {
  const archive = read('src/components/widgets/ProjectArchive.tsx');
  const grid = read('src/components/widgets/ProjectGrid.tsx');
  const portfolio = read('src/components/Portfolio.tsx');
  const widgets = read('src/components/widgets/index.ts');

  assert.match(archive, /projects\.map/);
  assert.match(archive, /techStack\.slice\(0, 3\)/);
  assert.match(archive, /담당 범위/);
  assert.match(archive, /상세 보기/);
  assert.match(archive, /id=\{`project-\$\{project\.id\}`\}/);
  assert.doesNotMatch(archive, /ScreenImage|ProjectThumbnail|imagePath/);
  assert.match(portfolio, /<ProjectArchive/);
  assert.doesNotMatch(portfolio, /<ProjectGrid/);
  assert.match(widgets, /ProjectArchive/);
  assert.doesNotMatch(widgets, /ProjectGrid/);
  assert.equal(grid, '');
});

test('recruitment flow has explicit component boundaries', () => {
  for (const component of [
    'RecruitmentNav',
    'DeveloperHero',
    'ExperienceTimeline',
    'ProjectArchive',
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

test('app bar uses a portfolio brand label instead of repeating the hero name', () => {
  const navigation = read('src/components/widgets/RecruitmentNav.tsx');

  assert.match(navigation, />\s*DEV PORTFOLIO\s*</);
  assert.doesNotMatch(navigation, />\s*오병희\s*</);
  assert.match(navigation, /href="#about"/);
  assert.doesNotMatch(navigation, /label: '소개'/);
  assert.match(navigation, /label: '기술 사례', href: '#featured-work'/);
  assert.match(navigation, /inline-flex min-h-11 items-center/);
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
  const header = modal.indexOf('<ProjectInfoHeader');
  const visual = modal.indexOf('<DeviceFrame');
  const details = modal.indexOf('<ProjectInfoDetails');
  assert.ok(header > -1 && header < visual, 'modal header must precede visual evidence');
  assert.ok(visual < details, 'visual evidence must precede detailed copy on mobile');
  assert.match(device, /tabIndex=\{isScrollable \? 0 : undefined\}/);
  assert.match(device, /role=\{isScrollable \? 'region' : undefined\}/);
  assert.match(device, /스크린샷 스크롤 영역/);
  assert.doesNotMatch(device, /scrollbar-hide/);
});

test('unverified profile facts stay hidden and resume actions remain data-driven', () => {
  const recruitment = read('src/data/recruitment.ts');
  const hero = read('src/components/widgets/DeveloperHero.tsx');

  assert.doesNotMatch(recruitment, /MAU 1만|5년 4개월|10–100×/);
  assert.match(hero, /profile\.resumeUrl/);
});
