import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('global styles expose accessible contrast, scrollbars, and reduced motion', () => {
  const css = read('src/app/globals.css');

  assert.match(css, /--accent-text:\s*#9d4530/);
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
