import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { GenerateContentParameters, GenerateContentResponse } from '@google/genai';
import { criarGemini } from '../src/avaliacao/gemini.js';
import { AvaliacaoError, criarServicoAvaliacao } from '../src/avaliacao/service.js';
import { avaliacao, respostas } from './fixtures.js';

const config = { GEMINI_API_KEY: 'chave-ficticia', GEMINI_MODEL: 'modelo-teste' };
function response(text: string, finishReason = 'STOP'): GenerateContentResponse {
  return { text, candidates: [{ finishReason }] } as GenerateContentResponse;
}
function hasCode(code: string) {
  return (error: unknown) => error instanceof AvaliacaoError && error.code === code;
}

test('envia perguntas traduzidas, schema, prazo e uma única tentativa ao SDK', async () => {
  let calls = 0;
  let params: GenerateContentParameters | undefined;
  const gerar = criarGemini(config, { generateContent: async (input) => {
    calls++;
    params = input;
    return response(JSON.stringify(avaliacao));
  } });
  assert.deepEqual(await gerar(respostas), avaliacao);
  assert.equal(calls, 1);
  assert.equal(params?.model, config.GEMINI_MODEL);
  assert.equal(params?.config?.httpOptions?.retryOptions?.attempts, 1);
  assert.equal(params?.config?.httpOptions?.timeout, 30_000);
  assert.equal(params?.config?.responseMimeType, 'application/json');
  assert.ok(params?.config?.responseJsonSchema);
  assert.ok(params?.config?.abortSignal);
  const contents = JSON.parse(params?.contents as string);
  assert.equal(contents.length, 8);
  assert.equal(contents[1].resposta, 'Entre R$ 150 e R$ 300');
  assert.doesNotMatch(params?.contents as string, /chave-ficticia/);
});

test('retorno vazio, JSON inválido e geração truncada são rejeitados', async () => {
  for (const output of [response(''), response('{'), response(JSON.stringify(avaliacao), 'MAX_TOKENS'), response('', 'SAFETY')]) {
    const gerar = criarGemini(config, { generateContent: async () => output });
    await assert.rejects(gerar(respostas), hasCode('IA_RESPOSTA_INVALIDA'));
  }
});

test('JSON válido mas incompatível é rejeitado pelo serviço', async () => {
  const gerar = criarGemini(config, { generateContent: async () => response('{"resumo":"incompleto"}') });
  await assert.rejects(criarServicoAvaliacao(gerar)(respostas), hasCode('IA_RESPOSTA_INVALIDA'));
});

test('cota esgotada, credenciais, rede e indisponibilidade não provocam repetição', async () => {
  for (const failure of [{ status: 429 }, { status: 401 }, { status: 403 }, { status: 404 }, { status: 503 }, new TypeError('fetch failed')]) {
    let calls = 0;
    const gerar = criarGemini(config, { generateContent: async () => { calls++; throw failure; } });
    await assert.rejects(gerar(respostas), hasCode('IA_INDISPONIVEL'));
    assert.equal(calls, 1);
  }
});

test('prazo encerra a espera e sinaliza cancelamento ao SDK', async () => {
  let signal: AbortSignal | undefined;
  const gerar = criarGemini(config, { timeoutMs: 10, generateContent: async (input) => {
    signal = input.config?.abortSignal;
    return new Promise<GenerateContentResponse>(() => {});
  } });
  await assert.rejects(gerar(respostas), hasCode('IA_TEMPO_EXCEDIDO'));
  assert.equal(signal?.aborted, true);
});

test('erros de timeout do transporte são normalizados', async () => {
  for (const failure of [{ status: 408 }, { status: 504 }, new DOMException('timeout', 'TimeoutError')]) {
    const gerar = criarGemini(config, { generateContent: async () => { throw failure; } });
    await assert.rejects(gerar(respostas), hasCode('IA_TEMPO_EXCEDIDO'));
  }
});
