import assert from 'node:assert/strict';
import test from 'node:test';
import { importTypeScriptModule, read } from './helpers/importTs.mjs';

test('layout loads only IBM Plex Sans KR and IBM Plex Mono', () => {
  const layout = read('src/app/layout.tsx');
  assert.match(layout, /IBM_Plex_Sans_KR/);
  assert.match(layout, /IBM_Plex_Mono/);
  assert.doesNotMatch(layout, /Noto_Sans_KR|Noto_Serif_KR|Geist_Mono/);
});

test('globals define the v1 color tokens and dark color scheme', () => {
  const css = read('src/app/globals.css');
  for (const token of [
    '--color-ground: #2a2b2f',
    '--color-career: #232427',
    '--color-slate: #292d34',
    '--color-stone: #312f2b',
    '--color-moss: #2a2f2b',
    '--color-ink: #ecece7',
    '--color-sub: #ababa5',
    '--color-faint: #9d9d96',
    '--color-marker: #f3e04a',
  ]) {
    assert.ok(css.includes(token), token);
  }
  assert.match(css, /color-scheme:\s*dark/);
  assert.match(css, /min-height:\s*100svh/);
});

const sampleDocuments = [
  { id: 'a', title: 'Alpha App', snippet: 'Flutter 앱입니다.', keywords: ['모바일'], meta: '', target: { kind: 'anchor', href: '#a' } },
  { id: 'b', title: 'mobile_rag_engine', snippet: 'RAG context 생성', keywords: ['Rust FFI'], meta: '', target: { kind: 'anchor', href: '#b' } },
  { id: 'c', title: 'Gamma', snippet: '서버를 개발했습니다.', keywords: ['모바일', 'RAG'], meta: '', target: { kind: 'anchor', href: '#c' } },
];

test('tokenize splits on whitespace and sorts longer tokens first', async () => {
  const { tokenize } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  assert.deepEqual(tokenize('  모바일   개발 '), ['모바일', '개발']);
  assert.deepEqual(tokenize('a abc ab'), ['abc', 'ab', 'a']);
  assert.deepEqual(tokenize('   '), []);
});

test('search scores title x3, snippet x2, keywords x1 and keeps data order on ties', async () => {
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  const rag = searchDocuments(sampleDocuments, 'rag');
  assert.deepEqual(rag.map((r) => [r.document.id, r.score]), [['b', 5], ['c', 1]]);
  const mobileDev = searchDocuments(sampleDocuments, '모바일 개발');
  assert.deepEqual(mobileDev.map((r) => r.document.id), ['c', 'a']);
});

test('empty query returns the first documents as recommendations', async () => {
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  assert.deepEqual(searchDocuments(sampleDocuments, '').map((r) => r.document.id), ['a', 'b', 'c']);
  assert.deepEqual(searchDocuments(sampleDocuments, '', 2).map((r) => r.document.id), ['a', 'b']);
});

test('segmentText marks case-insensitive hits and keeps original text', async () => {
  const { segmentText } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  assert.deepEqual(segmentText('Flutter로 만든 flutter 앱', ['flutter']), [
    { text: 'Flutter', hit: true },
    { text: '로 만든 ', hit: false },
    { text: 'flutter', hit: true },
    { text: ' 앱', hit: false },
  ]);
  assert.deepEqual(segmentText('a.b', ['.']), [
    { text: 'a', hit: false },
    { text: '.', hit: true },
    { text: 'b', hit: false },
  ]);
});

test('keyword-only matches are reported without repeating visible text', async () => {
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  const [first] = searchDocuments(sampleDocuments, '모바일');
  assert.equal(first.document.id, 'a');
  assert.deepEqual(first.keywordMatches, ['모바일']);
  const [engine] = searchDocuments(sampleDocuments, 'rag');
  assert.deepEqual(engine.keywordMatches, []);
});

const FEATURED = ['local-mobile-rag-gemma', 'easy-contract-viewer', 'law-info-engine'];
const ADDITIONAL = ['easy-contract-viewer-server', 'fiet-fitness-trainer', 'haru-check', 'weedool'];

test('case order follows featured then additional ids without duplicates', async () => {
  const { buildCaseOrder, caseNumber, caseAnchorId } = await importTypeScriptModule('src/lib/caseOrder.ts');
  const order = buildCaseOrder(FEATURED, [...ADDITIONAL, 'law-info-engine']);
  assert.deepEqual(order, [...FEATURED, ...ADDITIONAL]);
  assert.equal(caseNumber(order, 'easy-contract-viewer-server'), 4);
  assert.equal(caseNumber(order, 'fiet-fitness-trainer'), 5);
  assert.equal(caseNumber(order, 'haru-check'), 6);
  assert.equal(caseNumber(order, 'weedool'), 7);
  assert.equal(caseNumber(order, 'fiet-fitness-user'), null);
  assert.equal(caseAnchorId(1), 'case-01');
  assert.equal(caseAnchorId(12), 'case-12');
});

test('featured search targets become section anchors and others stay modal targets', async () => {
  const { resolveSearchDocuments } = await importTypeScriptModule('src/lib/caseOrder.ts');
  const documents = [
    { id: 'x', title: '', snippet: '', keywords: [], meta: '', target: { kind: 'project', projectId: 'easy-contract-viewer' } },
    { id: 'y', title: '', snippet: '', keywords: [], meta: '', target: { kind: 'project', projectId: 'haru-check' } },
    { id: 'z', title: '', snippet: '', keywords: [], meta: '', target: { kind: 'anchor', href: '#career' } },
  ];
  assert.deepEqual(resolveSearchDocuments(documents, FEATURED).map((d) => d.target), [
    { kind: 'anchor', href: '#case-02' },
    { kind: 'project', projectId: 'haru-check' },
    { kind: 'anchor', href: '#career' },
  ]);
  assert.deepEqual(
    resolveSearchDocuments(documents, ['easy-contract-viewer', 'local-mobile-rag-gemma']).map((d) => d.target)[0],
    { kind: 'anchor', href: '#case-01' }
  );
});

test('other projects are numbered cases that no section or career entry links to', async () => {
  const { buildCaseOrder, findOtherProjectIds } = await importTypeScriptModule('src/lib/caseOrder.ts');
  const order = buildCaseOrder(FEATURED, ADDITIONAL);
  const linked = ['local-mobile-rag-gemma', 'fiet-fitness-trainer', 'weedool', 'easy-contract-viewer-server'];
  assert.deepEqual(findOtherProjectIds(order, FEATURED.length, linked), ['haru-check']);
});

test('mail href adds an encoded subject only when given', async () => {
  const { buildMailHref } = await importTypeScriptModule('src/lib/mailHref.ts');
  assert.equal(buildMailHref('a@b.c'), 'mailto:a@b.c');
  assert.equal(buildMailHref('a@b.c', '[문의] 앱'), 'mailto:a@b.c?subject=%5B%EB%AC%B8%EC%9D%98%5D%20%EC%95%B1');
});

test('search documents produce the approved results for the demo keywords', async () => {
  const { searchDocuments: documents } = await importTypeScriptModule('src/data/searchDocuments.ts');
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  const ids = (query) => searchDocuments(documents, query).map((r) => r.document.id);

  assert.equal(documents.length, 8);
  assert.deepEqual(ids('Flutter'), ['easy-contract-viewer', 'fiet-fitness-trainer', 'weedool']);
  assert.deepEqual(ids('RAG'), ['local-mobile-rag-gemma', 'easy-contract-viewer', 'law-info-engine']);
  assert.deepEqual(ids('모바일 개발'), ['crypto-exchange-app', 'easy-contract-viewer', 'fiet-fitness-trainer']);
  assert.deepEqual(ids('온디바이스'), ['easy-contract-viewer', 'local-mobile-rag-gemma']);
  assert.deepEqual(ids('BLE'), ['fiet-fitness-trainer']);
});

test('search documents only target public projects that exist', async () => {
  const { searchDocuments: documents } = await importTypeScriptModule('src/data/searchDocuments.ts');
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  const projectIds = new Set(projects.map((p) => p.id));
  for (const document of documents) {
    if (document.target.kind === 'project') {
      assert.ok(projectIds.has(document.target.projectId), document.id);
      assert.notEqual(document.target.projectId, 'fiet-fitness-user');
      assert.notEqual(document.target.projectId, 'motgo');
    }
    assert.doesNotMatch(document.meta, /BM25|HNSW|RRF/);
  }
});

test('no user-visible search document field names the ranking algorithms', async () => {
  const { searchDocuments: documents } = await importTypeScriptModule('src/data/searchDocuments.ts');
  for (const document of documents) {
    for (const field of [document.title, document.snippet, document.meta]) {
      assert.doesNotMatch(field, /BM25|HNSW|RRF/, document.id);
    }
  }
});

test('recruitment cases carry the v1 section content and reference real screens', async () => {
  const { recruitmentCases, experienceItems, recruitmentProfile } =
    await importTypeScriptModule('src/data/recruitment.ts');
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  const byId = Object.fromEntries(recruitmentCases.map((c) => [c.projectId, c]));
  const screenIds = (projectId) => projects.find((p) => p.id === projectId).screens.map((s) => s.id);

  assert.equal(recruitmentProfile.headline, 'Flutter · 온디바이스 RAG 개발자');
  assert.equal(byId['local-mobile-rag-gemma'].sectionTitle, 'Flutter 공개 패키지');
  assert.equal(byId['local-mobile-rag-gemma'].introTopics.length, 4);
  assert.deepEqual(byId['local-mobile-rag-gemma'].metrics.map((m) => m.value), ['0.20.0', '25.9ms']);
  assert.equal(byId['easy-contract-viewer'].features.length, 4);
  assert.deepEqual(byId['easy-contract-viewer'].relatedProjectIds, ['easy-contract-viewer-server']);
  for (const step of byId['easy-contract-viewer'].stepScreens) {
    assert.ok(screenIds('easy-contract-viewer').includes(step.screenId), step.screenId);
  }
  assert.ok(screenIds('law-info-engine').includes(byId['law-info-engine'].figure.screenId));
  assert.doesNotMatch(byId['law-info-engine'].sectionSummary, /Bronze|Silver|Gold|nDCG|MRR|Recall|RRFRanker/);
  assert.equal(experienceItems.filter((item) => item.cardHighlight).length, 4);
});

test('freelancer profile opts out of the recruitment headline and intro', () => {
  const source = read('src/data/freelancer.ts');
  assert.match(source, /headline:\s*undefined/);
  assert.match(source, /intro:\s*undefined/);
});

test('v1 section order: hero, career, featured cases, contact', () => {
  const portfolio = read('src/components/Portfolio.tsx');
  const order = [
    '<HeroSection',
    '<CareerSection',
    '{featuredProjects.map((project, index)',
    '<ContactSection',
  ].map((token) => portfolio.indexOf(token));
  assert.ok(order.every((index) => index > -1), JSON.stringify(order));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.match(portfolio, /<ProjectModal/);
  assert.match(portfolio, /<PresentationOverlay/);

  const portfolioData = read('src/data/portfolio.ts');
  const featured = portfolioData.match(/export const featuredProjectIds = \[([\s\S]*?)\]/);
  assert.ok(featured, 'featuredProjectIds must exist');
  assert.match(featured[1], /'local-mobile-rag-gemma'[\s\S]*?'easy-contract-viewer'[\s\S]*?'law-info-engine'/);
});

test('v1 component boundaries replace the legacy widgets', () => {
  for (const removed of [
    'RecruitmentNav',
    'DeveloperHero',
    'FeaturedWork',
    'ProjectCard',
    'ProjectArchive',
    'ExperienceTimeline',
    'RecruitmentCTA',
    'Footer',
    'SectionContainer',
    'SectionHeader',
  ]) {
    assert.equal(read(`src/components/widgets/${removed}.tsx`), '', `${removed} should be removed`);
  }
  for (const added of [
    'HeroSection',
    'PortfolioSearch',
    'CareerSection',
    'CaseLink',
    'CaseLabel',
    'CaseEngineSection',
    'CaseContractViewerSection',
    'CaseLawSection',
    'ContactSection',
  ]) {
    assert.notEqual(read(`src/components/portfolio/${added}.tsx`), '', `${added} should exist`);
  }
});

test('v1 UI has no section progress indices or tiny label text', () => {
  // Algorithm names (BM25/HNSW/RRF) are data-driven; see the searchDocuments field test above.
  const sources = [
    'PortfolioSearch',
    'HeroSection',
    'CareerSection',
    'CaseLabel',
    'CaseEngineSection',
    'CaseContractViewerSection',
    'CaseLawSection',
    'ContactSection',
  ]
    .map((name) => read(`src/components/portfolio/${name}.tsx`))
    .join('\n');
  assert.notEqual(sources.trim(), '');
  assert.doesNotMatch(sources, /\d{2} \/ \d{2}/);
  assert.doesNotMatch(sources, /text-\[1[01]px\]/);
});
