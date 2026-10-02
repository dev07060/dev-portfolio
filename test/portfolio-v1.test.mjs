import assert from 'node:assert/strict';
import test from 'node:test';
import {
  importTypeScriptModule,
  importTypeScriptModuleWithDependencies,
  read,
} from './helpers/importTs.mjs';

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

test('displayTitle joins manual line breaks into one line', async () => {
  const { displayTitle } = await importTypeScriptModule('src/lib/projectTitle.ts');
  assert.equal(displayTitle({ title: 'Easy Contract\n  Viewer' }), 'Easy Contract Viewer');
  assert.equal(displayTitle({ title: 'Weedool' }), 'Weedool');
  for (const component of ['CaseLink', 'CaseDetailButton']) {
    const source = read(`src/components/portfolio/${component}.tsx`);
    assert.match(source, /displayTitle\(project\)/, component);
    assert.doesNotMatch(source, /project\.title\.replace/, component);
  }
});

test('mail href adds an encoded subject only when given', async () => {
  const { buildMailHref } = await importTypeScriptModule('src/lib/mailHref.ts');
  assert.equal(buildMailHref('a@b.c'), 'mailto:a@b.c');
  assert.equal(buildMailHref('a@b.c', '[문의] 앱'), 'mailto:a@b.c?subject=%5B%EB%AC%B8%EC%9D%98%5D%20%EC%95%B1');
});

test('search documents produce the approved results for the demo keywords', async () => {
  const { heroSearchDocuments: documents } = await importTypeScriptModule('src/data/searchDocuments.ts');
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
  const { heroSearchDocuments: documents } = await importTypeScriptModule('src/data/searchDocuments.ts');
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

test('keyword hints match word prefixes of 2+ characters only', async () => {
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  const documents = [
    { id: 'x', title: 'X', snippet: '앱', keywords: ['pdfrx', 'Rust FFI', 'Firebase'], meta: '', target: { kind: 'anchor', href: '#x' } },
  ];
  const hints = (query) => searchDocuments(documents, query).flatMap((r) => r.keywordMatches);
  assert.deepEqual(hints('F'), []);
  assert.deepEqual(hints('df'), []);
  assert.deepEqual(hints('ff'), ['Rust FFI']);
  assert.deepEqual(hints('fi'), ['Firebase']);
  assert.deepEqual(hints('pdf'), ['pdfrx']);
});

test('hidden keywords score but are never shown as hints', async () => {
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  const documents = [
    { id: 'x', title: 'X', snippet: '앱', keywords: ['Dart'], hiddenKeywords: ['BM25'], meta: '', target: { kind: 'anchor', href: '#x' } },
  ];
  const [result] = searchDocuments(documents, 'BM25');
  assert.equal(result.document.id, 'x');
  assert.equal(result.score, 1);
  assert.deepEqual(result.keywordMatches, []);
});

test('hero search never displays ranking-algorithm names for any demo or suggestion prefix', async () => {
  const { heroSearchDocuments, heroSearchDemoWords, heroSearchSuggestions } =
    await importTypeScriptModule('src/data/searchDocuments.ts');
  const { searchDocuments } = await importTypeScriptModule('src/lib/portfolioSearch.ts');
  const algorithmNames = /BM25|HNSW|RRF/i;
  const words = new Set([...heroSearchDemoWords, ...heroSearchSuggestions]);
  assert.ok(words.size >= 5);
  let checked = 0;
  for (const word of words) {
    const characters = [...word];
    for (let length = 1; length <= characters.length; length += 1) {
      const query = characters.slice(0, length).join('');
      for (const result of searchDocuments(heroSearchDocuments, query)) {
        const displayed = [
          result.document.title,
          result.document.snippet,
          result.document.meta,
          ...result.titleSegments.map((segment) => segment.text),
          ...result.snippetSegments.map((segment) => segment.text),
          ...result.keywordMatches,
        ];
        for (const text of displayed) {
          assert.doesNotMatch(text, algorithmNames, `query "${query}" → ${result.document.id}: ${text}`);
        }
        checked += 1;
      }
    }
  }
  assert.ok(checked > 0);
});

test('no user-visible search document field names the ranking algorithms', async () => {
  const { heroSearchDocuments: documents } = await importTypeScriptModule('src/data/searchDocuments.ts');
  for (const document of documents) {
    for (const field of [document.title, document.snippet, document.meta, ...document.keywords]) {
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

test('freelancer profile opts out of the recruitment headline and intro', async () => {
  const { freelancerPortfolioConfig } = await importTypeScriptModuleWithDependencies('src/data/freelancer.ts');
  const { recruitmentProfile } = await importTypeScriptModule('src/data/recruitment.ts');
  assert.ok(recruitmentProfile.headline, 'recruitment profile keeps its headline');
  assert.ok(recruitmentProfile.intro, 'recruitment profile keeps its intro');
  assert.equal(freelancerPortfolioConfig.profile.headline, undefined);
  assert.equal(freelancerPortfolioConfig.profile.intro, undefined);
  assert.notEqual(freelancerPortfolioConfig.profile.role, recruitmentProfile.role);
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

test('A14 Lenis smooth scroll is mounted once and never created under reduced motion', () => {
  const hook = read('src/lib/useSmoothScroll.ts');
  const portfolio = read('src/components/Portfolio.tsx');
  const css = read('src/app/globals.css');
  const pkg = JSON.parse(read('package.json'));

  assert.ok(pkg.dependencies.lenis, 'lenis is a runtime dependency');
  assert.match(css, /@import "lenis\/dist\/lenis\.css";/);
  assert.match(hook, /usePrefersReducedMotion\(\)/);
  const guard = hook.indexOf('if (reducedMotion) return;');
  const create = hook.indexOf('new Lenis(');
  assert.ok(guard > -1 && create > guard, 'reduced-motion guard must run before Lenis is created');
  assert.match(hook, /lenis\.destroy\(\)/);
  assert.match(hook, /lenis\.stop\(\)/);
  assert.match(hook, /lenis\.start\(\)/);
  assert.match(hook, /lenis\.scrollTo\(target\)/);
  assert.equal(portfolio.match(/useSmoothScroll\(/g)?.length, 1);
  assert.match(portfolio, /useSmoothScroll\(selectedProject !== null\)/);
});

test('A14 modal and presentation overlay opt out of Lenis wheel handling', () => {
  for (const file of ['src/components/widgets/ProjectModal.tsx', 'src/components/widgets/PresentationOverlay.tsx']) {
    assert.match(read(file), /ref=\{dialogRef\}\s+data-lenis-prevent/, file);
  }
});

test('A14 floating header is inert and aria-hidden while hidden and is a distinct landmark', () => {
  const header = read('src/components/portfolio/FloatingHeader.tsx');
  const hero = read('src/components/portfolio/HeroSection.tsx');
  const portfolio = read('src/components/Portfolio.tsx');

  assert.match(header, /new IntersectionObserver/);
  assert.match(header, /useState\(false\)/, 'starts hidden for SSR and the top of the page');
  assert.match(header, /inert=\{hidden \? true : undefined\}/);
  assert.match(header, /aria-hidden=\{hidden \? true : undefined\}/);
  assert.match(header, /<nav aria-label="빠른 메뉴"/);
  assert.match(hero, /<header id="hero-header"/);
  assert.match(hero, /<nav aria-label="주요 메뉴"/);
  assert.match(portfolio, /<FloatingHeader[\s\S]*?heroHeaderId="hero-header"/);
  assert.match(header, /rel="noopener noreferrer"/);
});

test('A14 case #2 pins only at >=768px with motion allowed', () => {
  const section = read('src/components/portfolio/CaseContractViewerSection.tsx');
  const hook = read('src/lib/useHorizontalPin.ts');
  const css = read('src/app/globals.css');

  assert.match(section, /className="screen pin-track bg-stone"/);
  assert.match(section, /useHorizontalPin\(trackRef\)/);
  assert.match(section, /<ol[\s\S]*?role="list"[\s\S]*?max-md:snap-x max-md:snap-mandatory/);
  assert.match(css, /@media \(min-width: 48rem\) and \(prefers-reduced-motion: no-preference\) \{\s*\.pin-track/);
  assert.match(css, /position: sticky;\s*top: 0;\s*height: 100svh;/);
  assert.match(hook, /if \(reducedMotion\) return;/);
});
