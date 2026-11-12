import assert from 'node:assert/strict';
import { test } from 'node:test';
import { questions } from '../../client/src/data/questions.js';
import { opcoes, perguntas, respostasSchema } from '../src/avaliacao/schema.js';

test('frontend usa os mesmos enunciados, campos e opções do backend', () => {
  assert.equal(questions.length, 8);
  assert.deepEqual(questions.map((question) => question.id), Object.keys(respostasSchema.shape));
  for (const question of questions) {
    assert.equal(question.title, perguntas[question.id]);
    assert.deepEqual(question.options.map((option) => option.value), respostasSchema.shape[question.id].options);
    for (const option of question.options) {
      assert.equal(option.label, (opcoes[question.id] as Record<string, string>)[option.value]);
    }
  }
});
