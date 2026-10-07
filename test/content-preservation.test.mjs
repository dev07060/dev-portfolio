// test/content-preservation.test.mjs
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { importTypeScriptModule } from './helpers/importTs.mjs';

const HEAD_PROJECT_IDS = [
  'easy-contract-viewer-server',
  'law-info-engine',
  'easy-contract-viewer',
  'fiet-fitness-trainer',
  'fiet-fitness-user',
  'local-mobile-rag-gemma',
  'motgo',
  'haru-check',
  'weedool',
];

const listFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = `${dir}/${name}`;
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });

test('project data keeps every project from HEAD 3576ca8', async () => {
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  assert.deepEqual(
    projects.map((project) => project.id).sort(),
    [...HEAD_PROJECT_IDS].sort()
  );
});

test('every project keeps its tech stack, screens, and implementation notes', async () => {
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  for (const project of projects) {
    assert.ok(project.techStack.length > 0, `${project.id} techStack`);
    assert.ok(project.screens.length > 0, `${project.id} screens`);
    assert.ok(project.description.length > 0, `${project.id} description`);
  }
});

// public/images as of HEAD 3576ca8 (`git ls-tree -r --name-only 3576ca8 public/images`).
// Screens may be swapped in project data, but no file that existed then may be deleted or moved.
const HEAD_PUBLIC_IMAGES = readFileSync(
  new URL('./fixtures/head-3576ca8-public-images.txt', import.meta.url),
  'utf8'
)
  .split('\n')
  .filter(Boolean);

test('every screenshot path referenced by project data exists under public/', async () => {
  const { projects } = await importTypeScriptModule('src/data/projects.ts');
  const paths = projects.flatMap((project) =>
    project.screens.map((screen) => screen.imagePath).filter(Boolean)
  );
  assert.ok(paths.length > 0);
  for (const path of paths) {
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `missing ${path}`);
  }
});

test('public/images keeps every file from HEAD 3576ca8 (95 files) and only grows', () => {
  assert.equal(HEAD_PUBLIC_IMAGES.length, 95);
  for (const file of HEAD_PUBLIC_IMAGES) {
    assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `missing ${file}`);
  }
  const root = fileURLToPath(new URL('../public/images', import.meta.url));
  assert.ok(listFiles(root).filter((file) => !file.endsWith('.DS_Store')).length >= 95);
});

test('recruitment data keeps all experience entries, highlights, and case details', async () => {
  const { experienceItems, recruitmentCases, recruitmentProfile } =
    await importTypeScriptModule('src/data/recruitment.ts');

  assert.deepEqual(
    experienceItems.map((item) => item.company),
    ['메리츠화재해상보험', '㈜피에트', '㈜인피니티익스체인지코리아', '튜링바이오', '㈜영우', '한국와콤']
  );
  for (const item of experienceItems) {
    assert.ok(item.summary.length > 0, `${item.company} summary`);
    assert.ok(item.highlights.length >= 2, `${item.company} highlights`);
  }

  assert.deepEqual(
    recruitmentCases.map((item) => item.projectId),
    ['local-mobile-rag-gemma', 'easy-contract-viewer', 'law-info-engine']
  );
  for (const item of recruitmentCases) {
    for (const field of ['contributions', 'verification', 'outcomes', 'tradeoffs', 'nonGoals']) {
      assert.ok(item[field].length > 0, `${item.projectId}.${field}`);
    }
  }

  assert.deepEqual(
    recruitmentProfile.proofItems.map((item) => item.label),
    ['공개 패키지', '총 경력']
  );
});
