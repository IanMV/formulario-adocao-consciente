import { describe, expect, it, vi } from 'vitest';
import { useAssessment } from '../src/composables/useAssessment';
import { questions } from '../src/data/questions';
import { resultado } from './fixtures';

function complete(flow: ReturnType<typeof useAssessment>, consent = true) {
  flow.start();
  for (const question of questions) {
    flow.select(question.options[0].value);
    if (flow.index.value < questions.length - 1) flow.next();
  }
  flow.consent.value = consent;
}

describe('fluxo do formulário', () => {
  it('não avança sem seleção nem aceita opções desconhecidas', () => {
    const flow = useAssessment();
    flow.start();
    flow.next();
    flow.select('invalida');
    expect(flow.index.value).toBe(0);
    expect(flow.selected.value).toBeUndefined();
  });

  it('preserva respostas ao voltar e não avança ao selecionar', () => {
    const flow = useAssessment();
    flow.start();
    flow.select('medio');
    expect(flow.index.value).toBe(0);
    flow.next();
    flow.back();
    expect(flow.selected.value).toBe('medio');
  });

  it('não envia formulário incompleto', async () => {
    const submit = vi.fn();
    const flow = useAssessment(submit);
    flow.start();
    await flow.submit();
    expect(submit).not.toHaveBeenCalled();
  });

  it('não envia respostas completas sem aceite', async () => {
    const submit = vi.fn();
    const flow = useAssessment(submit);
    complete(flow, false);
    await flow.submit();
    expect(submit).not.toHaveBeenCalled();
    expect(flow.screen.value).toBe('questions');
  });

  it('impede submissões duplicadas e invalida resultado ao revisar', async () => {
    let resolve!: (value: typeof resultado) => void;
    const submit = vi.fn(() => new Promise<typeof resultado>((done) => { resolve = done; }));
    const flow = useAssessment(submit);
    complete(flow);
    const pending = flow.submit();
    await flow.submit();
    expect(submit).toHaveBeenCalledOnce();
    expect(flow.screen.value).toBe('loading');
    resolve(resultado);
    await pending;
    expect(flow.screen.value).toBe('result');
    flow.review();
    expect(flow.screen.value).toBe('questions');
    expect(flow.result.value).toBeNull();
    expect(submit).toHaveBeenCalledOnce();
  });

  it('preserva respostas após falha e permite tentativa manual', async () => {
    const submit = vi.fn().mockRejectedValueOnce(new Error('Falha temporária')).mockResolvedValue(resultado);
    const flow = useAssessment(submit);
    complete(flow);
    await flow.submit();
    expect(flow.screen.value).toBe('error');
    expect(Object.keys(flow.answers.value)).toHaveLength(8);
    expect(submit).toHaveBeenCalledOnce();
    await flow.submit();
    expect(flow.screen.value).toBe('result');
    expect(submit).toHaveBeenCalledTimes(2);
  });

  it('recomeça sem histórico ou respostas preenchidas', async () => {
    const flow = useAssessment(vi.fn().mockResolvedValue(resultado));
    complete(flow);
    await flow.submit();
    flow.restart();
    expect(flow.screen.value).toBe('intro');
    expect(flow.answers.value).toEqual({});
    expect(flow.index.value).toBe(0);
    expect(flow.result.value).toBeNull();
    expect(flow.consent.value).toBe(false);
  });
});
