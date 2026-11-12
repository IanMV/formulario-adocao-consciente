import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadConfig } from '../src/config.js';

test('carrega configuração com padrões seguros', () => {
  assert.deepEqual(loadConfig({ GEMINI_API_KEY: 'test', GEMINI_MODEL: 'modelo-teste' }), {
    GEMINI_API_KEY: 'test', GEMINI_MODEL: 'modelo-teste', PORT: 3000, NODE_ENV: 'development',
  });
  assert.equal(loadConfig({ GEMINI_API_KEY: 'test', GEMINI_MODEL: 'modelo-teste', PORT: '10000', NODE_ENV: 'production' }).PORT, 10000);
});

test('rejeita configuração ausente ou inválida sem expor valores', () => {
  for (const env of [
    {}, { GEMINI_API_KEY: ' ' },
    { GEMINI_API_KEY: 'segredo', GEMINI_MODEL: ' ' },
    ...['abc', '0', '-1', '65536', '2.5', ''].map((PORT) => ({ GEMINI_API_KEY: 'segredo', GEMINI_MODEL: 'modelo', PORT })),
    { GEMINI_API_KEY: 'segredo', GEMINI_MODEL: 'modelo', NODE_ENV: 'invalido' },
  ]) {
    assert.throws(() => loadConfig(env), (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /Configuração ausente ou inválida/);
      assert.doesNotMatch(error.message, /segredo/);
      return true;
    });
  }
});
