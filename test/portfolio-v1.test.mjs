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
