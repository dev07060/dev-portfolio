import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('portfolio renders conversion-first sections before supporting work', () => {
  const portfolio = read('src/components/Portfolio.tsx');
  const order = [
    '<ConversionHero',
    '<FeaturedWork',
  ];

  let previousIndex = -1;
  for (const marker of order) {
    const currentIndex = portfolio.indexOf(marker);
    assert.notEqual(currentIndex, -1, `Expected Portfolio.tsx to include ${marker}`);
    assert.ok(
      currentIndex > previousIndex,
      `Expected ${marker} to appear after the previous conversion section`
    );
    previousIndex = currentIndex;
  }
});

test('client prioritizes all work before packages while developer keeps package proof first', () => {
  const portfolio = read('src/components/Portfolio.tsx');

  assert.match(portfolio, /audience === 'client'/);
  assert.match(portfolio, /clientSupportingSections/);
  assert.match(portfolio, /developerSupportingSections/);
  assert.ok(
    portfolio.indexOf('const allWorkSection') < portfolio.indexOf('const openSourceSection'),
    'Expected reusable All Work and Open Source sections to be declared in order'
  );
  assert.match(
    portfolio,
    /clientSupportingSections[\s\S]*allWorkSection[\s\S]*openSourceSection/
  );
  assert.match(
    portfolio,
    /developerSupportingSections[\s\S]*openSourceSection[\s\S]*allWorkSection/
  );
});

test('home page resolves audience query params with client fallback before rendering portfolio', () => {
  const page = read('src/app/page.tsx');

  assert.match(page, /searchParams/);
  assert.match(page, /parseAudience/);
  assert.match(page, /audience=client/);
  assert.match(page, /initialAudience=\{audience\}/);
});

test('portfolio passes a single audience mode through hero copy, proof, featured cards, and all work', () => {
  const portfolio = read('src/components/Portfolio.tsx');

  assert.match(portfolio, /initialAudience/);
  assert.match(portfolio, /const audience = initialAudience/);
  assert.match(portfolio, /<ConversionHero[\s\S]*audience=\{audience\}/);
  assert.match(portfolio, /<FeaturedWork[\s\S]*audience=\{audience\}/);
  assert.match(portfolio, /<ProjectGrid[\s\S]*audience=\{audience\}/);
  assert.match(portfolio, /allWorkProjectIds/);
  assert.match(portfolio, /filter\(\(project\): project is Project => Boolean\(project\)\)/);
});

test('conversion data declares the three representative evidence projects', () => {
  const conversion = read('src/data/conversion.ts');
  const expectedOrder = [
    'local-mobile-rag-gemma',
    'law-info-engine',
    'easy-contract-viewer',
  ];

  let previousIndex = -1;
  for (const projectId of expectedOrder) {
    const currentIndex = conversion.indexOf(`'${projectId}'`);
    assert.notEqual(currentIndex, -1, `Expected ${projectId} to be featured for conversion`);
    assert.ok(currentIndex > previousIndex, `Expected ${projectId} to keep the approved order`);
    previousIndex = currentIndex;
  }
});

test('conversion data defines client and developer audience variants without duplicating projects', () => {
  const conversion = read('src/data/conversion.ts');

  assert.match(conversion, /export type Audience = 'client' \| 'developer'/);
  assert.match(conversion, /parseAudience/);
  assert.match(conversion, /audience=client#all-work/);
  assert.match(conversion, /audience=developer#all-work/);
  assert.match(conversion, /projectTypeMode:\s*'compact'/);
  assert.match(conversion, /projectTypeMode:\s*'stacked'/);
  assert.match(conversion, /allWorkProjectIds/);

  for (const projectId of ['motgo', 'haru-check', 'weedool', 'fiet-fitness-trainer', 'fiet-fitness-user']) {
    assert.match(conversion, new RegExp(`'${projectId}'`));
  }
});

test('hero exposes client-facing positioning, core stack, and two CTAs', () => {
  const conversionHero = read('src/components/widgets/ConversionHero.tsx');

  for (const marker of [
    'Flutter · On-device AI/RAG · LLM Backend',
    'Flutter',
    'Rust FFI',
    'ONNX',
    'FastAPI',
    'Milvus',
    'PostgreSQL',
    'featured-work',
    'mailto:',
    'ProjectTypes',
    'projectTypeMode',
    'audienceContent',
  ]) {
    assert.match(conversionHero, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('hero does not own the client developer display switcher', () => {
  const conversionHero = read('src/components/widgets/ConversionHero.tsx');

  assert.doesNotMatch(conversionHero, /Portfolio audience/);
  assert.doesNotMatch(conversionHero, /audienceContent\[mode\]\.href/);
  assert.doesNotMatch(conversionHero, /Client'\s*:\s*'Developer/);
});

test('project types render compact client rows and stacked developer cards', () => {
  const conversionHero = read('src/components/widgets/ConversionHero.tsx');
  const conversion = read('src/data/conversion.ts');

  assert.match(conversionHero, /mode === 'compact'/);
  assert.match(conversionHero, /compactOfferIcons/);
  assert.match(conversionHero, /divide-y divide-\[#d9e4e1\]/);
  assert.match(conversionHero, /min-h-\[48px\]/);
  assert.match(conversionHero, /min-\[420px\]:block/);
  assert.doesNotMatch(conversionHero, /grid-cols-1 sm:grid-cols-2 xl:grid-cols-4/);
  assert.doesNotMatch(conversionHero, /sm:grid-cols-2/);
  assert.match(conversionHero, /mode === 'stacked'/);
  assert.match(conversionHero, /grid grid-cols-1 gap-3 lg:grid-cols-2/);
  assert.match(conversionHero, /developerDetail/);

  for (const marker of [
    'Flutter app MVP',
    'Productization / release',
    'Document AI / RAG',
    'Retrieval / citation',
    'App performance / QA',
    'Profiling / release blockers',
    'FastAPI LLM backend',
    'API / retrieval / ops',
  ]) {
    assert.match(conversion, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('portfolio removes the duplicated proof strip before featured work', () => {
  const portfolio = read('src/components/Portfolio.tsx');
  const widgetsIndex = read('src/components/widgets/index.ts');
  const conversion = read('src/data/conversion.ts');

  assert.doesNotMatch(portfolio, /ProofStrip/);
  assert.doesNotMatch(widgetsIndex, /ProofStrip/);
  assert.doesNotMatch(conversion, /proofItems/);
});

test('all work owns the audience display switcher and dual layouts', () => {
  const projectGrid = read('src/components/widgets/ProjectGrid.tsx');
  const listStart = projectGrid.indexOf('const ClientProjectList');
  const listEnd = projectGrid.indexOf('const DeveloperProjectGrid', listStart);
  const clientList = projectGrid.slice(listStart, listEnd);

  assert.match(projectGrid, /heading\?: LocaleText/);
  assert.match(projectGrid, /description\?: LocaleText/);
  assert.match(projectGrid, /audience\?: Audience/);
  assert.match(projectGrid, /id="all-work"/);
  assert.match(projectGrid, /aria-label="All Work display"/);
  assert.match(projectGrid, /Client list/);
  assert.match(projectGrid, /Developer cards/);
  assert.match(projectGrid, /audienceContent\[mode\]\.href/);
  assert.match(projectGrid, /audience === 'client'/);
  assert.match(projectGrid, /<ClientProjectList/);
  assert.match(projectGrid, /<DeveloperProjectGrid/);
  assert.match(projectGrid, /min-h-\[72px\]/);
  assert.match(projectGrid, /project\.techStack\.slice\(0,\s*3\)/);
  assert.match(clientList, /space-y-2 sm:space-y-2\.5/);
  assert.match(clientList, /rounded-lg border border-\[#e8dfd0\] bg-white\/80/);
  assert.doesNotMatch(clientList, /divide-y divide-\[#e8dfd0\]/);
});

test('mobile_rag_engine is presented as a package architecture case, not a demo app', () => {
  const projects = read('src/data/projects.ts');
  const start = projects.indexOf("id: 'local-mobile-rag-gemma'");
  const end = projects.indexOf("id: 'motgo'", start);
  const block = projects.slice(start, end);

  assert.match(block, /type:\s*'package'/);
  assert.match(block, /Published Flutter package for fully local RAG on mobile/);
  assert.match(block, /pub\.dev 0\.18\.6/);
  assert.match(block, /audienceOverrides/);
  assert.match(block, /thumbnailScreenIndex:\s*1/);
  assert.match(block, /\/images\/mobile-rag-engine\/architecture\.svg/);
  assert.doesNotMatch(block, /Gemma 3n demo/);
  assert.doesNotMatch(block, /start-new-chat|add-document|output-1|output-2|rag-search-test/);

  for (const title of ['Package Overview', 'Architecture', 'Integration Flow']) {
    assert.match(block, new RegExp(`title:\\s*\\{ en:\\s*'${title}'`));
  }

  for (const removedTitle of ['Problem', 'Evidence', 'Trade-off', 'What I built']) {
    assert.doesNotMatch(block, new RegExp(`title:\\s*\\{ en:\\s*'${removedTitle}'`));
  }
});

test('featured projects expose audience-specific card copy and evidence priority', () => {
  const projects = read('src/data/projects.ts');

  for (const marker of [
    'published Flutter package',
    'Rust FFI',
    'ONNX',
    'HNSW/BM25 retrieval paths',
    'product-ready local retrieval',
    'citation-grounded legal RAG',
    'Bronze/Silver/Gold',
    'evaluation',
    'PDF import',
    'local indexing',
    'source highlight',
    'productization',
  ]) {
    assert.match(projects, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('mobile_rag_engine uses distinct concrete visuals and non-generic case-study copy', () => {
  const projects = read('src/data/projects.ts');
  const start = projects.indexOf("id: 'local-mobile-rag-gemma'");
  const end = projects.indexOf("id: 'motgo'", start);
  const block = projects.slice(start, end);

  assert.match(block, /\/images\/mobile-rag-engine\/architecture\.svg/);
  assert.match(block, /\/images\/mobile-rag-engine\/architecture\.ko\.svg/);
  assert.match(block, /\/images\/mobile-rag-engine\/retrieval-flows\.svg/);
  assert.match(block, /\/images\/mobile-rag-engine\/retrieval-flows\.ko\.svg/);
  assert.doesNotMatch(block, /Mobile apps need private document search and RAG without sending files to a server/);
  assert.doesNotMatch(block, /Package API, native bridge, indexing\/search pipeline, examples, documentation, and release automation/);
  assert.match(block, /on-device document search and RAG to Flutter apps/);
  assert.match(block, /without uploading documents to a server/);
  assert.match(block, /product-ready local retrieval/);
  assert.match(block, /Easy Contract Viewer/);
  assert.match(block, /Flutter facade/);
  assert.match(block, /Dart orchestration/);
  assert.match(block, /Rust FFI/);
  assert.match(block, /ONNX/);
  assert.match(block, /SQLite/);
  assert.match(block, /HNSW\/BM25/);
});

test('mobile_rag_engine portfolio copy excludes internal verification report language', () => {
  const projects = read('src/data/projects.ts');
  const start = projects.indexOf("id: 'local-mobile-rag-gemma'");
  const end = projects.indexOf("id: 'motgo'", start);
  const block = projects.slice(start, end);

  for (const forbidden of [
    /PR-P5/,
    /PR-P4/,
    /PR-P3/,
    /recall_vectoronly/,
    /recall_hybrid/,
    /pure_cold activate/,
    /caveat/i,
    /trade-off/i,
    /title:\s*\{ en:\s*'Evidence'/,
    /title:\s*\{ ko:\s*'증거'/,
    /title:\s*\{ en:\s*'Trade-off'/,
    /title:\s*\{ ko:\s*'트레이드오프'/,
  ]) {
    assert.doesNotMatch(block, forbidden);
  }

  assert.match(block, /label:\s*'GitHub'/);
  assert.match(block, /https:\/\/github\.com\/dev07060\/mobile_rag_engine/);
  assert.match(block, /label:\s*'pub\.dev'/);
  assert.match(block, /https:\/\/pub\.dev\/packages\/mobile_rag_engine/);
});

test('mobile_rag_engine diagrams follow the Swifty-law style: layered architecture plus two clear paths', () => {
  const problem = read('public/images/mobile-rag-engine/problem.svg');
  const architecture = read('public/images/mobile-rag-engine/architecture.svg');
  const flows = read('public/images/mobile-rag-engine/retrieval-flows.svg');

  for (const marker of ['PRIVACY', 'OFFLINE', 'LATENCY', 'PACKAGE']) {
    assert.match(problem, new RegExp(marker));
  }

  for (const marker of ['APP API', 'INGEST', 'NATIVE CORE', 'RETRIEVAL', 'OUTPUT']) {
    assert.match(architecture, new RegExp(marker));
  }

  for (const marker of ['INGEST PATH', 'QUERY PATH', 'HNSW vector', 'BM25 sparse']) {
    assert.match(flows, new RegExp(marker));
  }
});

test('mobile_rag_engine SVG diagrams have Korean localized assets and locale-aware wiring', () => {
  const types = read('src/types/project.ts');
  const i18nIndex = read('src/i18n/index.ts');
  const screenImage = read('src/components/widgets/ScreenImage.tsx');
  const portfolio = read('src/components/Portfolio.tsx');
  const problemKo = read('public/images/mobile-rag-engine/problem.ko.svg');
  const architectureKo = read('public/images/mobile-rag-engine/architecture.ko.svg');
  const flowsKo = read('public/images/mobile-rag-engine/retrieval-flows.ko.svg');

  assert.match(types, /imagePath\?: LocalizedString/);
  assert.match(i18nIndex, /localize/);
  assert.match(screenImage, /localize\(rawSrc, locale\)/);
  assert.match(screenImage, /sizes=/);
  assert.match(portfolio, /localize\(screen\.imagePath, locale\)/);

  for (const marker of ['제약 조건', '개인정보', '오프라인', '성능 예산', '패키지 증거']) {
    assert.match(problemKo, new RegExp(marker));
  }

  for (const marker of ['앱 API', '인제스트', '네이티브 코어', '검색 계층', '출력']) {
    assert.match(architectureKo, new RegExp(marker));
  }

  for (const marker of ['인제스트 경로', '쿼리 경로', 'HNSW 벡터', 'BM25 희소 검색']) {
    assert.match(flowsKo, new RegExp(marker));
  }
});

test('package projects get package labels and architecture thumbnail handling', () => {
  const types = read('src/types/project.ts');
  const ui = read('src/i18n/translations.ts');
  const card = read('src/components/widgets/ProjectCard.tsx');
  const modal = read('src/components/widgets/ProjectModal.tsx');
  const deviceFrame = read('src/components/widgets/DeviceFrame.tsx');

  assert.match(types, /'package'/);
  assert.match(ui, /devicePackage/);
  assert.match(ui, /packageProject/);
  assert.match(card, /project\.type === 'package'/);
  assert.match(card, /resolveProjectCard/);
  assert.match(card, /PackageArchitectureThumbnail/);
  assert.match(modal, /project\.type === 'package'/);
  assert.match(deviceFrame, /PackageFrame/);
  assert.match(deviceFrame, /PackagePresentationFrame/);
});

test('project card device thumbnails use restrained frame radii', () => {
  const card = read('src/components/widgets/ProjectCard.tsx');

  assert.doesNotMatch(card, /rounded-\[1\.35rem\]/);
  assert.match(card, /rounded-\[1rem\]/);
  assert.match(card, /rounded-\[0\.75rem\]/);
});

test('open source package versions stay aligned with released mobile_rag_engine artifacts', () => {
  const banner = read('src/components/widgets/OpenSourceBanner.tsx');

  assert.match(banner, /name:\s*'mobile_rag_engine'[\s\S]*version:\s*'0\.18\.6'/);
  assert.doesNotMatch(banner, /version:\s*'0\.18\.5'/);
});

test('package modal surfaces the case study flow directly after card click', () => {
  const modal = read('src/components/widgets/ProjectModal.tsx');
  const portfolio = read('src/components/Portfolio.tsx');
  const deviceFrame = read('src/components/widgets/DeviceFrame.tsx');

  assert.match(modal, /PackageCaseStudyFlow/);
  assert.match(modal, /project\.type === 'package'/);
  assert.match(modal, /project\.screens\.map/);
  assert.match(modal, /project\.releaseLabel/);
  assert.match(modal, /data-package-detail="architecture-first"/);
  assert.match(modal, /screen\.title\.en === 'Architecture'/);
  assert.match(modal, /currentScreenIndex/);
  assert.match(portfolio, /preferredScreenIndex/);
  assert.match(portfolio, /thumbnailScreenIndex/);
  assert.match(portfolio, /currentScreenIndex=\{currentScreenIndex\}/);
  assert.match(deviceFrame, /featuredScreen = project\.screens\[currentScreenIndex\]/);
});
