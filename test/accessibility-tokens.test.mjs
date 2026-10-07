import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('global styles expose accessible contrast, scrollbars, and reduced motion', () => {
  const css = read('src/app/globals.css');

  assert.match(css, /--color-marker:\s*#f3e04a/);
  assert.match(css, /--color-ground:\s*#2a2b2f/);
  assert.match(css, /--color-ink:\s*#ecece7/);
  assert.match(css, /scrollbar-gutter:\s*stable/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation-duration:\s*0\.01ms/);
});

test('image failure remains a visible Korean status', () => {
  const image = read('src/components/widgets/ScreenImage.tsx');

  assert.match(image, /role="status"/);
  assert.match(image, /이미지를 불러오지 못했습니다\./);
  const errorState = image.slice(image.indexOf('const errorState'), image.indexOf("if (variant"));
  assert.doesNotMatch(errorState, /<div\s+aria-hidden/);
});

test('icon-only dialog controls meet the minimum target token', () => {
  const modal = read('src/components/widgets/ProjectModal.tsx');
  const presentation = read('src/components/widgets/PresentationOverlay.tsx');

  assert.match(modal, /min-h-11 min-w-11/);
  assert.match(presentation, /min-h-11 min-w-11/);
});

test('project detail exposes a named keyboard-scroll region', () => {
  const modal = read('src/components/widgets/ProjectModal.tsx');

  assert.match(modal, /role="region"/);
  assert.match(modal, /aria-label=\{`\$\{project\.title\} 프로젝트 상세`\}/);
  assert.match(modal, /tabIndex=\{0\}/);
  assert.match(modal, /focus-visible:ring-inset/);
});

test('presentation shows no visible progress numbers, only the dots and an sr-only status', () => {
  const presentation = read('src/components/widgets/PresentationOverlay.tsx');

  assert.doesNotMatch(presentation, /padStart/);
  assert.match(presentation, /className="sr-only"[\s\S]*?`화면 \$\{currentScreenIndex \+ 1\} \/ \$\{project\.screens\.length\}, \$\{currentScreen\.title\}`/);
  assert.match(presentation, /data-presentation-progress/);
});

test('architecture presentations expose the original image with a full-size target', () => {
  const presentation = read('src/components/widgets/PresentationOverlay.tsx');

  assert.match(presentation, /project\.type === 'package' \|\| project\.type === 'api'/);
  assert.match(presentation, /aria-label=\{`\$\{currentScreen\.title\} 원본 이미지 새 창에서 열기`\}/);
  assert.match(presentation, /min-h-11/);
});

test('project detail content uses plain text links and stacks instead of chips', () => {
  const modal = read('src/components/widgets/ProjectModal.tsx');
  const device = read('src/components/widgets/DeviceFrame.tsx');

  assert.match(modal, /project\.techStack\.join\(' · '\)/);
  assert.match(modal, /item\.techStack\.join\(' · '\)/);
  assert.match(modal, /className="link-marker inline-flex min-h-11 items-center/);
  assert.match(modal, /target="_blank"\s+rel="noopener noreferrer"/);
  assert.doesNotMatch(modal, /rounded-full border border-line bg-(ground|surface|surface-2) px-/);
  assert.doesNotMatch(modal, /rounded-full border border-marker\/40/);
  assert.doesNotMatch(device, /rounded-full border border-line px-2 py-0\.5/);
  // supporting packages and the architecture caption are plain text, not card boxes
  assert.match(modal, /data-supporting-package/);
  assert.match(modal, /data-architecture-caption/);
  assert.doesNotMatch(modal, /rounded-lg border border-marker\/30/);
  assert.doesNotMatch(modal, /className="[^"]*\bbg-surface-2\b(?! )[^"]*(p-3|px-3)/);
  assert.doesNotMatch(modal, /<article[^>]*rounded/);
});

test('long identifier titles break only after separators', () => {
  const modal = read('src/components/widgets/ProjectModal.tsx');

  assert.match(modal, /<wbr \/>/);
  assert.match(modal, /\{withSeparatorBreaks\(project\.title\)\}/);
  assert.doesNotMatch(modal, /break-all|\[overflow-wrap:anywhere\]/);
});
