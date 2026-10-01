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
