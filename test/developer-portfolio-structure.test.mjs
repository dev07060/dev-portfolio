import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const read = (path) => {
  const url = new URL(`../${path}`, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
};

const v1SectionComponents = [
  'HeroSection',
  'PortfolioSearch',
  'CareerSection',
  'CaseLink',
  'CaseLabel',
  'CaseEngineSection',
  'CaseContractViewerSection',
  'CaseLawSection',
  'ContactSection',
];
const v1CaseSections = ['CaseEngineSection', 'CaseContractViewerSection', 'CaseLawSection'];
const readExisting = (path) => {
  const source = read(path);
  assert.notEqual(source, '', `${path} must exist`);
  return source;
};

const unlistedFreelancerRoutePattern =
  /\/freelancer\/?(?=[?#\s'"`<>,;)}\]]|$)/;

const pdfToTextBinary = () => {
  const bundled = join(
    homedir(),
    '.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/bin/pdftotext'
  );
  return process.env.PDFTOTEXT_BIN || (existsSync(bundled) ? bundled : 'pdftotext');
};

const importTypeScriptModule = async (path) => {
  const source = read(path);
  assert.notEqual(source, '', `${path} must exist`);

  const { outputText, diagnostics = [] } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: path,
    reportDiagnostics: true,
  });
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((diagnostic) => diagnostic.messageText).join('\n')
  );

  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
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
  for (const section of ['<HeroSection', '<CareerSection', '<ContactSection']) {
    assert.ok(portfolio.includes(section), `${section} must be rendered`);
  }
});

test('Easy Contract Viewer Server copy is bounded by a committed private-source snapshot', () => {
  const evidence = read(
    'docs/reports/2026-07-12-easy-contract-viewer-server-evidence.md'
  );

  assert.match(evidence, /Source HEAD: bfaee10/);
  assert.match(evidence, /Source visibility: private/);
  assert.match(evidence, /Deployment status: configuration only/);
  assert.match(evidence, /Evaluation status: harness present, accepted score absent/);
  assert.match(evidence, /Uncommitted server changes: excluded/);
  const approvedClaims = evidence.split('## Excluded claims')[0];
  assert.doesNotMatch(
    approvedClaims,
    /production traffic|active users|public GitHub/i
  );
  assert.match(
    approvedClaims,
    /Redis-backed quota, budget, and concurrency controls; single-flight runs as a separate in-process stage\./
  );
  assert.match(
    approvedClaims,
    /The committed baseline masks sensitive text with regex-based detectors before token optimization\./
  );
  assert.match(evidence, /Uncommitted masking hardening/);
});

test('API projects use a backend-specific type and label', () => {
  const projectTypes = read('src/types/project.ts');
  const modal = readExisting('src/components/widgets/ProjectModal.tsx');
  const deviceFrame = readExisting('src/components/widgets/DeviceFrame.tsx');

  assert.match(projectTypes, /type: 'mobile' \| 'web' \| 'tablet' \| 'package' \| 'api'/);
  assert.match(modal, /project\.type === 'api'[\s\S]*?return '백엔드 API'/);
  // A18: the frame header names the screen being shown, not a static '백엔드 아키텍처' label.
  assert.doesNotMatch(deviceFrame, /백엔드 아키텍처|패키지 아키텍처/);
  assert.match(deviceFrame, /data-screen-frame-label[\s\S]*?\{screen\?\.title \?\? project\.title\}/);
  assert.match(
    deviceFrame,
    /project\.type === 'api' && currentScreen\?\.scrollable[\s\S]*?<WebPresentationFrame/
  );
  const screenFrame = deviceFrame.slice(
    deviceFrame.indexOf('const ScreenFrame'),
    deviceFrame.indexOf('// Mobile Frame Component')
  );
  assert.match(
    screenFrame,
    /project\.type === 'api' \? Server : project\.type === 'package' \? PackageIcon/
  );
  assert.match(screenFrame, /<FallbackIcon size=\{56\}/);
});

test('Easy Contract Viewer Server uses source-backed architecture assets', () => {
  for (const path of [
    'docs/diagrams/easy-contract-viewer-server/request-boundary.mmd',
    'docs/diagrams/easy-contract-viewer-server/provider-routing.mmd',
    'docs/diagrams/easy-contract-viewer-server/jobs-and-deployment.mmd',
    'public/images/easy-contract-viewer-server/request-boundary.svg',
    'public/images/easy-contract-viewer-server/provider-routing.svg',
    'public/images/easy-contract-viewer-server/jobs-and-deployment.svg',
  ]) {
    assert.notEqual(read(path), '', path + ' must exist and be non-empty');
  }

  assert.match(
    read('docs/diagrams/easy-contract-viewer-server/request-boundary.mmd'),
    /HMAC[\s\S]*?Redis quota \/ budget \/ concurrency[\s\S]*?Summary \+ citations/
  );
  assert.match(
    read('docs/diagrams/easy-contract-viewer-server/provider-routing.mmd'),
    /Gemini API Key[\s\S]*?Vertex AI IAM[\s\S]*?Ollama fallback/
  );
  assert.match(
    read('docs/diagrams/easy-contract-viewer-server/jobs-and-deployment.mmd'),
    /G --> H/
  );
});

test('additional projects expose the backend-first four-case selection and retain hidden data', () => {
  const portfolioData = read('src/data/portfolio.ts');
  const freelancerData = read('src/data/freelancer.ts');
  const projects = read('src/data/projects.ts');
  const recruitment = read('src/data/recruitment.ts');
  const selection = portfolioData.match(
    /export const additionalProjectIds = \[([\s\S]*?)\] as const;/
  );

  assert.ok(selection, 'additionalProjectIds must exist');
  assert.match(
    selection[1],
    /'easy-contract-viewer-server',\s*'fiet-fitness-trainer',\s*'fiet-fitness-user',\s*'haru-check',\s*'weedool'/
  );
  assert.doesNotMatch(selection[1], /motgo/);
  assert.match(projects, /id: ["']motgo["']/);
  assert.match(projects, /id: ["']fiet-fitness-user["']/);
  assert.match(freelancerData, /import \{ additionalProjectIds \} from '.\/portfolio';/);
  assert.match(
    recruitment,
    /company: '㈜피에트'[\s\S]*?relatedProjectIds: \['fiet-fitness-trainer', 'fiet-fitness-user'\]/
  );
  assert.match(
    portfolioData,
    /additionalDescription:[\s\S]*?'Python 검색·요약 백엔드와 AI·BLE 제품화 경험을 보완하는 다섯 가지 사례입니다\.'/
  );
  assert.match(
    freelancerData,
    /additionalDescription:[\s\S]*?'FastAPI 백엔드와 AI·BLE 모바일 제품화 경험을 보여주는 다섯 가지 수행 사례입니다\.'/
  );
});

test('Easy Contract Viewer Server is a private backend case without inflated claims', () => {
  const projects = read('src/data/projects.ts');
  const start = projects.indexOf('id: "easy-contract-viewer-server"');
  const end = projects.indexOf('\n  },', start);

  assert.notEqual(start, -1, 'expected Easy Contract Viewer Server project entry');
  assert.notEqual(end, -1, 'expected Easy Contract Viewer Server project boundary');

  const project = projects.slice(start, end);
  assert.match(project, /type: "api"/);
  assert.match(project, /title: "Easy Contract Viewer Server"/);
  assert.match(project, /releaseLabel: "비공개 구현 · 로컬 검증"/);
  assert.match(project, /techStack: \[\s*"Python",\s*"FastAPI",\s*"Redis"/);
  for (const asset of [
    'request-boundary.svg',
    'provider-routing.svg',
    'jobs-and-deployment.svg',
  ]) {
    assert.ok(
      project.includes(`/images/easy-contract-viewer-server/${asset}`),
      `missing project asset path: ${asset}`
    );
  }
  assert.match(project, /links: \[\]/);
  assert.doesNotMatch(
    project,
    /Play Integrity|production traffic|active users|public GitHub|정확도|점수/i
  );
});

test('FIET trainer uses report evidence instead of the splash screen', () => {
  const projects = read('src/data/projects.ts');
  const trainerStart = projects.indexOf('id: "fiet-fitness-trainer"');
  const trainerEnd = projects.indexOf('id: "fiet-fitness-user"', trainerStart);

  assert.notEqual(trainerStart, -1, 'expected FIET trainer project entry');
  assert.notEqual(trainerEnd, -1, 'expected FIET trainer project boundary');

  const trainer = projects.slice(trainerStart, trainerEnd);
  const thumbnailIndex = Number(
    trainer.match(/thumbnailScreenIndex: (\d+)/)?.[1] ?? Number.NaN
  );
  const screens = trainer.match(/screens: \[([\s\S]*?)\n    \],/)?.[1] ?? '';
  const screenIds = [...screens.matchAll(/\bid: ["']([^"']+)["']/g)].map(
    ([, id]) => id
  );

  assert.match(
    trainer,
    /cardPresentation:[\s\S]*?thumbnailScreenIndex: 1[\s\S]*?screens:/
  );
  assert.match(
    trainer,
    /highlight:[\s\S]*?["']BLE 실시간 센서 연동, 트레이너용 분석 리포트, Fastlane·GitHub Actions 배포 자동화를 구현했습니다\.["']/
  );
  assert.match(
    trainer,
    /id: ["']report-inbody["'][\s\S]*?imagePath: ["']\/images\/fiet-fitness-trainer\/report-inbody\.png["']/
  );
  assert.equal(screenIds[thumbnailIndex], 'report-inbody');
});

test('route configuration has no unused cross-route link abstraction', () => {
  const types = read('src/types/portfolio.ts');
  const portfolioData = read('src/data/portfolio.ts');
  const portfolio = read('src/components/Portfolio.tsx');
  const navigation = readExisting('src/components/portfolio/HeroSection.tsx');
  const freelancerData = read('src/data/freelancer.ts');

  for (const name of ['Capability', 'PortfolioCopy', 'PortfolioConfig']) {
    assert.match(types, new RegExp(`interface ${name}`));
  }
  assert.match(portfolioData, /export const recruitmentPortfolioConfig/);
  for (const source of [types, portfolioData, portfolio, navigation, freelancerData]) {
    assert.doesNotMatch(source, /PortfolioRouteLink|routeLink/);
    assert.doesNotMatch(source, /일반 포트폴리오로 돌아가기/);
  }
  assert.doesNotMatch(navigation, /from 'next\/link'/);
});

test('route pages inject presentation configuration into the shared portfolio', () => {
  const home = read('src/app/page.tsx');
  const portfolio = read('src/components/Portfolio.tsx');

  assert.match(home, /import \{ recruitmentPortfolioConfig \}/);
  assert.match(home, /<Portfolio config=\{recruitmentPortfolioConfig\}/);
  assert.match(portfolio, /config: PortfolioConfig/);
  assert.match(portfolio, /const Portfolio = \(\{ config \}/);
  assert.doesNotMatch(portfolio, /from '@\/data\/recruitment'/);
  for (const name of v1SectionComponents) {
    const source = readExisting(`src/components/portfolio/${name}.tsx`);
    assert.doesNotMatch(source, /from '@\/data\/(?:portfolio|recruitment|freelancer)'/, name);
  }
});

test('project selection fails closed with the missing id and selection context', async () => {
  const { resolveProjectIds } = await importTypeScriptModule(
    'src/data/resolveProjectIds.ts'
  );
  const availableProjects = [
    { id: 'first-project', title: 'First project' },
    { id: 'second-project', title: 'Second project' },
  ];

  assert.deepEqual(
    resolveProjectIds(
      ['second-project', 'first-project'],
      availableProjects,
      'test featured projects'
    ),
    [availableProjects[1], availableProjects[0]]
  );
  assert.throws(
    () =>
      resolveProjectIds(
        ['first-project', 'missing-project'],
        availableProjects,
        'freelancer featured projects'
      ),
    /Missing project ID "missing-project" in freelancer featured projects/
  );
});

test('portfolio resolves both configured selections through the fail-closed boundary', () => {
  const portfolio = read('src/components/Portfolio.tsx');

  assert.match(portfolio, /import \{ resolveProjectIds \}/);
  assert.match(
    portfolio,
    /const featuredProjects = resolveProjectIds\(\s*featuredProjectIds,\s*projects,\s*`\$\{copy\.navBrandLabel\} featured projects`\s*\);/
  );
  assert.match(
    portfolio,
    /const additionalProjects = resolveProjectIds\(\s*additionalProjectIds,\s*projects,\s*`\$\{copy\.navBrandLabel\} additional projects`\s*\);/
  );
  assert.doesNotMatch(portfolio, /\.filter\(\(project\): project is Project/);
});

test('freelancer route is unlisted, purpose-specific, and absent from public navigation', () => {
  const home = read('src/app/page.tsx');
  const freelancerPage = read('src/app/freelancer/page.tsx');
  const freelancerData = read('src/data/freelancer.ts');

  assert.match(
    freelancerPage,
    /robots:[\s\S]*?index: false[\s\S]*?follow: false/
  );
  assert.match(
    freelancerPage,
    /<Portfolio config=\{freelancerPortfolioConfig\}/
  );
  assert.doesNotMatch(home, /\/freelancer/);
  assert.doesNotMatch(freelancerData, /routeLink|일반 포트폴리오로 돌아가기/);
  assert.match(
    freelancerData,
    /'easy-contract-viewer'[\s\S]*?'local-mobile-rag-gemma'[\s\S]*?'law-info-engine'/
  );
  for (const copy of [
    "role: '모바일 제품 · 문서 검색/RAG 프로젝트 수행 개발자'",
    "position: '크로스플랫폼 앱 · Native 연동 · Retrieval/RAG · FastAPI'",
    "positioning: '기존 모바일 제품의 고도화부터 문서·PDF 검색 기능과 검색 백엔드까지 구현합니다.'",
    "contactMailSubject: '[프로젝트 문의] 모바일 제품 · 문서 RAG 개발'",
    "featuredDescription: '모바일 제품, 문서 검색 엔진, 운영 가능한 검색 백엔드로 이어지는 수행 사례입니다.'",
    "contactHeading: '모바일 제품이나 문서 검색 기능을 개발·개선하려고 하시나요?'",
    "title: '모바일 앱 구축·고도화'",
  ]) {
    assert.ok(freelancerData.includes(copy), `missing exact freelancer copy: ${copy}`);
  }
  assert.ok(
    freelancerPage.includes(
      "'모바일 제품화와 문서·PDF 검색/RAG 프로젝트 수행 경험을 정리한 전달용 포트폴리오입니다.'"
    ),
    'freelancer metadata must use the approved description'
  );
  assert.match(freelancerData, /contactCta: '프로젝트 상담'/);
  assert.match(freelancerData, /resumeUrl: undefined/);
  assert.match(freelancerData, /experienceItems,/);
  assert.doesNotMatch(freelancerData, /\bcompany\s*:/);
  assert.doesNotMatch(
    freelancerData,
    /(?:010[-.\s]?\d{3,4}[-.\s]?\d{4}|주소|생년월일|연봉|희망근무)/
  );
});

test('supported static sitemap sources do not list the freelancer route', () => {
  const sitemapSources = [
    'src/app/sitemap.ts',
    'src/app/sitemap.tsx',
    'src/app/sitemap.js',
    'src/app/sitemap.jsx',
    'src/app/sitemap.xml',
    'src/app/sitemap.xml/route.ts',
    'src/app/sitemap.xml/route.tsx',
    'src/app/sitemap.xml/route.js',
    'src/app/sitemap.xml/route.jsx',
    'public/sitemap.xml',
  ];

  for (const route of ['/freelancer', '/freelancer/', '/freelancer?ref=direct']) {
    assert.match(route, unlistedFreelancerRoutePattern);
  }
  assert.doesNotMatch('/freelancer-case-study', unlistedFreelancerRoutePattern);

  for (const path of sitemapSources) {
    assert.doesNotMatch(
      read(path),
      unlistedFreelancerRoutePattern,
      `${path} must not list the freelancer route`
    );
  }
});

test('active source has no audience runtime', () => {
  const files = [
    'src/app/page.tsx',
    'src/components/Portfolio.tsx',
    ...v1SectionComponents.map((name) => `src/components/portfolio/${name}.tsx`),
    'src/components/widgets/ProjectModal.tsx',
    'src/data/projects.ts',
    'src/types/project.ts',
  ];

  for (const file of files) {
    const source = readExisting(file);
    assert.doesNotMatch(source, /Audience|audienceOverrides|audienceContent/);
  }
});

test('active source has no locale runtime', () => {
  const files = [
    'src/components/Portfolio.tsx',
    ...v1SectionComponents.map((name) => `src/components/portfolio/${name}.tsx`),
    'src/components/widgets/ProjectModal.tsx',
    'src/data/projects.ts',
    'src/types/project.ts',
  ];

  for (const file of files) {
    const source = readExisting(file);
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
  assert.match(data, /pub\.dev 0\.20\.0/);
  assert.doesNotMatch(data, /pub\.dev 0\.18\.6/);
  assert.match(types, /statusLabel: string;/);
  assert.doesNotMatch(types, /publicStatus: string;/);
  assert.doesNotMatch(data, /MAU 1만|5년 4개월|10–100×/);
});

test('featured cases keep cards concise and integrate supporting packages in detail', () => {
  const types = read('src/types/recruitment.ts');
  const data = read('src/data/recruitment.ts');
  const modal = readExisting('src/components/widgets/ProjectModal.tsx');
  const portfolio = read('src/components/Portfolio.tsx');
  const widgets = read('src/components/widgets/index.ts');
  const standalone = read('src/components/widgets/OpenSourceBanner.tsx');

  assert.match(types, /supportingPackages\?: SupportingPackage\[\];/);
  assert.match(
    data,
    /projectId: 'local-mobile-rag-gemma'[\s\S]*?supportingPackages: \[[\s\S]*?name: 'rag_engine_flutter'[\s\S]*?version: '0\.18\.3'/
  );
  assert.match(modal, /관련 공개 패키지/);
  assert.match(
    modal,
    /recruitmentCase\?\.supportingPackages\?\.length[\s\S]*?<SupportingPackages items=\{recruitmentCase\.supportingPackages\}/
  );
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

  assert.match(data, /label: '총 경력'[\s\S]*?value: '5년 5개월'/);
  assert.match(data, /resumeUrl: '\/oh-byeonghee-resume-ko\.pdf'/);

  let previous = -1;
  for (const company of companies) {
    const current = data.indexOf(company);
    assert.ok(current > previous, `${company} must appear in latest-first order`);
    previous = current;
  }
  assert.doesNotMatch(data, /\b01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}\b/);
  assert.doesNotMatch(data, /\+82[-.\s]?1[016789]/);
  assert.doesNotMatch(
    data,
    /(?:휴대폰\s*(?:번호\s*)?[:：]|핸드폰|전화\s*번호|연락처\s*[:：]|주소|거주지|생년월일|희망\s*(?:연봉|급여|근무지)|병역)\s*[:：]?/
  );
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
  assert.doesNotMatch(text, /\+82[-.\s]?1[016789]/);
  assert.doesNotMatch(
    text,
    /(?:휴대폰|핸드폰|전화\s*번호|연락처\s*[:：]|주소|거주지|생년월일|학력|희망\s*(?:연봉|급여|근무지)|병역|보훈|장애)\s*[:：]?/
  );
  assert.doesNotMatch(text, /(?:연봉|급여)\s*[:：]?\s*[\d,]+\s*만?원/);
  assert.doesNotMatch(text, /Motgo|맛집 투표/);
});

test('career case links resolve project ids to readable project names', () => {
  const caseLink = readExisting('src/components/portfolio/CaseLink.tsx');
  const career = readExisting('src/components/portfolio/CareerSection.tsx');
  const portfolio = read('src/components/Portfolio.tsx');

  assert.match(caseLink, /projects: Project\[\]/);
  assert.match(caseLink, /projects\.find/);
  assert.match(caseLink, /const title = displayTitle\(project\)/);
  assert.match(caseLink, /aria-label=\{`\$\{label\}, \$\{title\}`\}/);
  assert.match(caseLink, /aria-label=\{`\$\{label\}, \$\{title\} 화면 보기`\}/);
  assert.match(career, /<CaseLink[\s\S]*?projectId=\{projectId\}/);
  assert.match(career, /item\.relatedProjectIds\.map/);
  assert.match(portfolio, /<CareerSection[\s\S]*?projects=\{projects\}/);
});

test('career keeps one highlight visible and discloses summary and the rest', () => {
  const types = read('src/types/portfolio.ts');
  const portfolioData = read('src/data/portfolio.ts');
  const freelancerData = read('src/data/freelancer.ts');
  const portfolio = read('src/components/Portfolio.tsx');
  const career = readExisting('src/components/portfolio/CareerSection.tsx');

  assert.match(types, /experienceDescription: string;/);
  assert.match(
    portfolioData,
    /experienceDescription: '최신순으로 역할과 대표 성과를 요약했습니다\.'/
  );
  assert.match(
    freelancerData,
    /experienceDescription:[\s\S]*?'최신순으로 역할과 대표 성과를 요약했습니다\.'/
  );
  assert.match(freelancerData, /experienceItems,/);
  assert.doesNotMatch(freelancerData, /freelancerExperienceItems|fietExperience/);
  assert.match(portfolio, /<CareerSection[\s\S]*?copy=\{copy\}/);
  assert.match(career, /\{copy\.experienceDescription\}/);
  assert.match(career, /const \[firstHighlight, \.\.\.restHighlights\] = item\.highlights/);
  assert.match(career, /item\.cardHighlight \?\? firstHighlight/);
  assert.match(career, /item\.cardHighlight \? item\.highlights : restHighlights/);
  assert.match(career, /<details[\s\S]*?<summary[\s\S]*?자세히[\s\S]*?item\.summary/);
  assert.match(career, /item\.employmentType/);
  assert.match(career, />경력</);
});

test('active project copy uses the latest stable mobile_rag_engine release', () => {
  const recruitment = read('src/data/recruitment.ts');
  const projects = read('src/data/projects.ts');

  for (const source of [recruitment, projects]) {
    assert.match(source, /0\.20\.0/);
    assert.doesNotMatch(source, /0\.18\.6/);
  }
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
    '테스트·평가·운영 검증',
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
    ...v1SectionComponents.map((name) => `src/components/portfolio/${name}.tsx`),
    'src/components/widgets/ProjectModal.tsx',
  ]
    .map(readExisting)
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
  const hero = readExisting('src/components/portfolio/HeroSection.tsx');
  const widgets = read('src/components/widgets/index.ts');
  const standalone = read('src/components/widgets/CoreCapabilities.tsx');

  assert.match(portfolio, /<HeroSection[\s\S]*?capabilities=\{capabilities\}/);
  assert.doesNotMatch(portfolio, /<CoreCapabilities/);
  assert.match(hero, /capabilities: Capability\[\]/);
  assert.match(hero, /aria-label=\{copy\.capabilityAriaLabel\}/);
  assert.match(hero, /capabilities\.map/);
  assert.match(hero, /\{capability\.title\}[\s\S]*?\{capability\.evidence\}/);
  assert.doesNotMatch(hero, /<span className="truncate font-mono/);
  assert.doesNotMatch(widgets, /CoreCapabilities/);
  assert.equal(standalone, '');
  assert.match(portfolioData, /capabilityAriaLabel: '핵심 개발 역량 요약'/);

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const [title, evidence] of [
    ['Flutter 제품화·릴리스', 'Easy Contract Viewer'],
    ['온디바이스 검색·Rust FFI', 'mobile_rag_engine'],
    ['LLM 에이전트·검색 백엔드', '기업 법령 검토 엔진(이음)'],
  ]) {
    assert.match(portfolioData, new RegExp(`title: '${title}'[\\s\\S]*?evidence: '${escapeRegExp(evidence)}'`));
  }
  assert.doesNotMatch(portfolioData, /title: 'Rust FFI·네이티브 검색'/);
});

test('hero separates career context from linked public evidence', () => {
  const recruitment = read('src/data/recruitment.ts');
  const hero = readExisting('src/components/portfolio/HeroSection.tsx');

  assert.match(recruitment, /label: '총 경력'[\s\S]*?value: '5년 5개월'/);
  assert.match(hero, /profile\.proofItems\.map/);
  assert.match(hero, /item\.evidence \? \([\s\S]*?<a href=\{item\.evidence\}/);
  assert.match(hero, /\) : \([\s\S]*?monoTokens\(item\.value\)/);
});

test('hero renders profile role and positioning alongside the v1 headline and intro', () => {
  const hero = readExisting('src/components/portfolio/HeroSection.tsx');

  assert.match(hero, /\{profile\.headline \?\? profile\.role\}/);
  assert.match(hero, /hasHeadline && \([\s\S]*?\{profile\.role\}/);
  assert.match(hero, /\{profile\.intro \?\? profile\.positioning\}/);
  assert.match(hero, /profile\.intro && \([\s\S]*?\{profile\.positioning\}/);
});

test('case detail modal renders the former card summary as plain text', () => {
  const modal = readExisting('src/components/widgets/ProjectModal.tsx');
  const summary = modal.slice(modal.indexOf('const ProjectCardSummary'));

  assert.match(modal, /<ProjectCardSummary project=\{project\} \/>[\s\S]*?— 문제와 제약/);
  assert.match(summary, /project\.cardPresentation\?\.description/);
  assert.match(summary, /project\.cardPresentation\?\.highlight/);
  assert.match(summary, /project\.cardPresentation\?\.evidenceBadges \?\? project\.evidenceBadges/);
  assert.match(summary, /\{description\}/);
  assert.match(summary, /\{highlight\}/);
  assert.match(summary, /evidenceBadges\.join\(' · '\)/);
});

test('case verification labels distinguish methods from verified results', () => {
  const types = read('src/types/recruitment.ts');
  const data = read('src/data/recruitment.ts');
  const modal = read('src/components/widgets/ProjectModal.tsx');

  assert.match(types, /verificationLabel\?: string;/);
  assert.match(
    data,
    /projectId: 'easy-contract-viewer'[\s\S]*?verificationLabel: '검증 기준·방법'/
  );
  assert.match(
    modal,
    /recruitmentCase\.verificationLabel \?\? '테스트·평가·운영 검증'/
  );
});

test('기업 법령 검토 엔진(이음) is typed as an API; 16:10 screenshots are contained while diagrams stay scrollable', async () => {
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  const ieum = projects.find((project) => project.id === 'law-info-engine');
  const byId = Object.fromEntries(ieum.screens.map((screen) => [screen.id, screen]));

  assert.equal(ieum.type, 'api');
  assert.deepEqual(ieum.screens.map((screen) => screen.id), [
    'ieum-home',
    'ieum-report-citation',
    'ieum-open-checks',
    'ieum-tax-report',
    'architecture',
    'api-flows',
    'ieum-showcase',
  ]);
  assert.equal(ieum.screens[ieum.cardPresentation.thumbnailScreenIndex].id, 'ieum-report-citation');
  for (const id of ['ieum-home', 'ieum-report-citation', 'ieum-open-checks', 'ieum-tax-report', 'ieum-showcase']) {
    assert.match(byId[id].imagePath, /^\/images\/law-info-engine\/ieum\//, id);
    assert.notEqual(byId[id].scrollable, true, `${id} is a 16:10 / 16:9 capture, not a long page`);
  }
  for (const id of ['architecture', 'api-flows']) {
    assert.equal(byId[id].scrollable, true, id);
  }
});

test('empty experience and missing resume actions stay hidden', () => {
  const career = readExisting('src/components/portfolio/CareerSection.tsx');
  const hero = readExisting('src/components/portfolio/HeroSection.tsx');
  const contact = readExisting('src/components/portfolio/ContactSection.tsx');
  const portfolio = read('src/components/Portfolio.tsx');

  assert.match(career, /if \(!items\.length\) return null/);
  assert.match(hero, /hasExperience && <a href="#career"/);
  assert.match(portfolio, /hasExperience=\{experienceItems\.length > 0\}/);
  for (const source of [hero, contact]) {
    assert.match(source, /profile\.resumeUrl\s*&&/);
  }
});

test('app bar uses a portfolio brand label instead of repeating the hero name', () => {
  const hero = readExisting('src/components/portfolio/HeroSection.tsx');
  const portfolioData = read('src/data/portfolio.ts');
  const appBar = hero.slice(hero.indexOf('<header'), hero.indexOf('</header>'));

  assert.match(portfolioData, /navBrandLabel: '포트폴리오'/);
  assert.match(appBar, /\{copy\.navBrandLabel\}/);
  assert.doesNotMatch(appBar, /profile\.name|>\s*오병희\s*</);
  assert.match(appBar, /href="#top"/);
  assert.match(appBar, /aria-label="주요 메뉴"/);
  assert.match(appBar, /href=\{firstCaseHref\}/);
  assert.match(hero, /inline-flex min-h-11 items-center/);
});

test('project detail and presentation actions use Korean accessible names', () => {
  const caseLink = readExisting('src/components/portfolio/CaseLink.tsx');
  const modal = readExisting('src/components/widgets/ProjectModal.tsx');
  const device = readExisting('src/components/widgets/DeviceFrame.tsx');
  const presentation = readExisting('src/components/widgets/PresentationOverlay.tsx');

  const detailButton = readExisting('src/components/portfolio/CaseDetailButton.tsx');
  assert.match(detailButton, /aria-haspopup="dialog"/);
  assert.match(detailButton, /aria-label=\{`사례 자세히, \$\{title\}`\}/);
  assert.match(detailButton, />\s*사례 자세히\s*<\/button>/);
  for (const name of v1CaseSections) {
    const section = readExisting(`src/components/portfolio/${name}.tsx`);
    assert.match(section, /<CaseDetailButton project=\{project\} onOpenProject=\{onOpenProject\} \/>/, name);
  }
  assert.match(caseLink, /`\$\{label\}, \$\{title\} 화면 보기`/);
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
  const headerSource = modal.slice(modal.indexOf('const ProjectInfoHeader'), modal.indexOf('const ProjectInfoDetails'));
  const detailsSource = modal.slice(modal.indexOf('const ProjectInfoDetails'), modal.indexOf('const ProjectCardSummary'));
  assert.match(headerSource, /<ProjectCardSummary project=\{project\} \/>/, 'card summary must sit in the header, before the visual on mobile');
  assert.doesNotMatch(detailsSource, /<ProjectCardSummary/);
  // The screen list belongs to the screens region: frame → list → details.
  const list = modal.indexOf('<ScreenList');
  assert.ok(visual < list && list < details, 'screen list must follow the frame, before details');
  assert.match(modal, /aria-current=\{isCurrent \? 'true' : undefined\}/);
  assert.match(modal, /aria-live="polite"/);
  // Long screenshots scroll inside a named, focusable, Lenis-free region.
  const viewport = read('src/components/widgets/ScrollViewport.tsx');
  assert.match(viewport, /role="region"/);
  assert.match(viewport, /tabIndex=\{0\}/);
  assert.match(viewport, /data-lenis-prevent/);
  assert.match(viewport, /아래로 더 있음/);
  assert.match(device, /스크린샷 스크롤 영역/);
  assert.match(device, /화면, 스크롤 가능/);
  assert.doesNotMatch(device, /scrollbar-hide/);
  assert.doesNotMatch(viewport, /scrollbar-hide/);
});

test('unverified profile facts stay hidden and resume actions remain data-driven', () => {
  const recruitment = read('src/data/recruitment.ts');
  const hero = readExisting('src/components/portfolio/HeroSection.tsx');
  const contact = readExisting('src/components/portfolio/ContactSection.tsx');

  assert.doesNotMatch(recruitment, /MAU 1만|5년 4개월|10–100×/);
  for (const source of [hero, contact]) {
    assert.match(source, /href=\{profile\.resumeUrl\}/);
    assert.doesNotMatch(source, /oh-byeonghee-resume-ko\.pdf/);
  }
});

test('information labels remain readable without tiny active text', () => {
  for (const name of v1SectionComponents) {
    const file = `src/components/portfolio/${name}.tsx`;
    assert.doesNotMatch(readExisting(file), /text-\[(?:8|9|10|11)px\]/, file);
  }
  for (const file of [
    'src/components/widgets/DeviceFrame.tsx',
    'src/components/widgets/ProjectModal.tsx',
  ]) {
    assert.doesNotMatch(readExisting(file), /text-\[(?:8|9|10)px\]/, file);
  }
});

test('contact section leads with a clear email action and stable Korean copy', () => {
  const contact = readExisting('src/components/portfolio/ContactSection.tsx');
  const css = read('src/app/globals.css');
  const portfolioData = read('src/data/portfolio.ts');
  const emailAction = contact.indexOf('href={buildMailHref(profile.email, copy.contactMailSubject)}');
  const resumeAction = contact.indexOf('href={profile.resumeUrl}');

  assert.match(contact, /<h2 id="contact-title"/);
  assert.match(contact, /\{copy\.contactDescription\}/);
  assert.match(css, /word-break:\s*keep-all/);
  assert.ok(emailAction > -1 && emailAction < resumeAction);
  assert.match(portfolioData, /contactCta: '이메일 보내기'/);
  assert.match(
    portfolioData,
    /contactHeading:[\s\S]*?'모바일 제품과 로컬 검색 기술을 함께 다룰 개발자를 찾고 계신가요\?'/
  );
  assert.match(
    portfolioData,
    /contactDescription:[\s\S]*?'역할과 해결하려는 문제를 알려주세요\. 관련 경험과 구현 사례를 바탕으로 함께 이야기 나누겠습니다\.'/
  );
});
