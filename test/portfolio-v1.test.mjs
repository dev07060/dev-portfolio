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
