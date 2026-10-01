// test/helpers/importTs.mjs
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

export const read = (path) => {
  const url = new URL(`../../${path}`, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
};

export const importTypeScriptModule = async (path) => {
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

const transpileToDataUrl = (path, cache) => {
  if (cache.has(path)) return cache.get(path);
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

  const directory = path.split('/').slice(0, -1).join('/');
  const resolved = outputText.replace(
    /(from\s+['"])(\.\.?\/[^'"]+)(['"])/g,
    (_match, open, specifier, close) => {
      const dependency = new URL(`${specifier}.ts`, `file:///${directory}/`).pathname.slice(1);
      return `${open}${transpileToDataUrl(dependency, cache)}${close}`;
    }
  );
  const url = `data:text/javascript;base64,${Buffer.from(resolved).toString('base64')}`;
  cache.set(path, url);
  return url;
};

/** Like importTypeScriptModule, but also resolves relative ('./x') imports to sibling .ts files. */
export const importTypeScriptModuleWithDependencies = async (path) =>
  import(transpileToDataUrl(path, new Map()));
