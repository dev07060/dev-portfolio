import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('portfolio renders conversion-first sections before supporting work', () => {
  const portfolio = read('src/components/Portfolio.tsx');
  const order = [
    '<ConversionHero />',
    '<ProofStrip />',
    '<FeaturedWork',
    '<OpenSourceBanner />',
    '<ProjectGrid',
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
  ]) {
    assert.match(conversionHero, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('project grid can be relabeled as supporting work', () => {
  const projectGrid = read('src/components/widgets/ProjectGrid.tsx');

  assert.match(projectGrid, /heading\?: LocaleText/);
  assert.match(projectGrid, /description\?: LocaleText/);
});

test('mobile_rag_engine is presented as a package architecture case, not a demo app', () => {
  const projects = read('src/data/projects.ts');
  const start = projects.indexOf("id: 'local-mobile-rag-gemma'");
  const end = projects.indexOf("id: 'motgo'", start);
  const block = projects.slice(start, end);

  assert.match(block, /type:\s*'package'/);
  assert.match(block, /Published Flutter package for fully local RAG on mobile/);
  assert.match(block, /pub\.dev 0\.18\.6/);
  assert.match(block, /\/images\/mobile-rag-engine\/architecture\.svg/);
  assert.doesNotMatch(block, /Gemma 3n demo/);
  assert.doesNotMatch(block, /start-new-chat|add-document|output-1|output-2|rag-search-test/);

  for (const title of ['Problem', 'Architecture', 'What I built', 'Evidence', 'Trade-off']) {
    assert.match(block, new RegExp(`title:\\s*\\{ en:\\s*'${title}'`));
  }
});

test('mobile_rag_engine uses distinct concrete visuals and non-generic case-study copy', () => {
  const projects = read('src/data/projects.ts');
  const start = projects.indexOf("id: 'local-mobile-rag-gemma'");
  const end = projects.indexOf("id: 'motgo'", start);
  const block = projects.slice(start, end);

  assert.match(block, /\/images\/mobile-rag-engine\/problem\.svg/);
  assert.match(block, /\/images\/mobile-rag-engine\/problem\.ko\.svg/);
  assert.match(block, /\/images\/mobile-rag-engine\/architecture\.svg/);
  assert.match(block, /\/images\/mobile-rag-engine\/architecture\.ko\.svg/);
  assert.match(block, /\/images\/mobile-rag-engine\/retrieval-flows\.svg/);
  assert.match(block, /\/images\/mobile-rag-engine\/retrieval-flows\.ko\.svg/);
  assert.doesNotMatch(block, /Mobile apps need private document search and RAG without sending files to a server/);
  assert.doesNotMatch(block, /Package API, native bridge, indexing\/search pipeline, examples, documentation, and release automation/);
  assert.match(block, /privacy-sensitive PDFs, DOCX files, and notes/);
  assert.match(block, /Flutter facade, Dart task queue, Rust FFI search core, ONNX embedding runtime, SQLite chunk store, and HNSW\/BM25 indexes/);
  assert.match(block, /PR-P5-1\.html/);
  assert.match(block, /recall_vectoronly@10 mean 1\.00/);
  assert.match(block, /PR-P4\.md/);
  assert.match(block, /pure_cold activate 247\.3ms/);
  assert.match(block, /recall_hybrid@10 mean 0\.08/);
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
  assert.match(card, /PackageArchitectureThumbnail/);
  assert.match(modal, /project\.type === 'package'/);
  assert.match(deviceFrame, /PackageFrame/);
  assert.match(deviceFrame, /PackagePresentationFrame/);
});

test('package modal surfaces the case study flow directly after card click', () => {
  const modal = read('src/components/widgets/ProjectModal.tsx');

  assert.match(modal, /PackageCaseStudyFlow/);
  assert.match(modal, /project\.type === 'package'/);
  assert.match(modal, /project\.screens\.map/);
  assert.match(modal, /project\.releaseLabel/);
});
