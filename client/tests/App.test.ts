import { createApp, nextTick, type App as VueApp } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.vue';
import { questions } from '../src/data/questions';
import { resultado } from './fixtures';

let app: VueApp;

beforeEach(() => {
  vi.stubGlobal('scrollTo', vi.fn());
  document.body.innerHTML = '<div id="test-app"></div>';
  app = createApp(App);
  app.mount('#test-app');
});

afterEach(() => {
  app.unmount();
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

async function click(action: string) {
  const element = document.querySelector<HTMLButtonElement>(`[data-action="${action}"]`);
  expect(element, action).not.toBeNull();
  element!.click();
  await nextTick();
}

async function answerAll() {
  await click('start');
  for (const [index, question] of questions.entries()) {
    expect(document.querySelector('h1')?.textContent).toContain(question.title);
    document.querySelector<HTMLInputElement>(`input[value="${question.options[0].value}"]`)!.click();
    await nextTick();
    if (index < 7) await click('next');
  }
}

async function settle() {
  await vi.waitFor(() => expect(document.querySelector('[data-screen="result"]')).not.toBeNull());
  await nextTick();
}

describe('interface da adoção consciente', () => {
  it('apresenta o projeto, inicia no primeiro passo e impede avanço sem resposta', async () => {
    expect(document.body.textContent).toContain('Adoção Consciente');
    await click('start');
    expect(document.body.textContent).toContain('Pergunta 1 de 8');
    expect(document.querySelector<HTMLButtonElement>('[data-action="next"]')?.disabled).toBe(true);
    expect(document.activeElement).toBe(document.querySelector('h1'));
    expect(document.querySelector('progress')?.value).toBe(1);
    expect(document.querySelector('fieldset')?.getAttribute('aria-labelledby')).toBe('question-title');
  });

  it('seleção não avança automaticamente e voltar restaura a alternativa', async () => {
    await click('start');
    document.querySelector<HTMLInputElement>('input[value="medio"]')!.click();
    await nextTick();
    expect(document.body.textContent).toContain('Pergunta 1 de 8');
    await click('next');
    expect(document.body.textContent).toContain('Pergunta 2 de 8');
    await click('back');
    expect(document.querySelector<HTMLInputElement>('input[value="medio"]')?.checked).toBe(true);
  });

  it('não restaura respostas quando a aplicação é carregada novamente', async () => {
    await click('start');
    document.querySelector<HTMLInputElement>('input[value="medio"]')!.click();
    await nextTick();
    app.unmount();
    app = createApp(App);
    app.mount('#test-app');
    await click('start');
    expect(document.querySelector('input:checked')).toBeNull();
  });

  it('envia uma vez, apresenta os quatro blocos e mantém textos da IA inertes', async () => {
    let resolve!: (response: Response) => void;
    const fetchMock = vi.fn(() => new Promise<Response>((done) => { resolve = done; }));
    vi.stubGlobal('fetch', fetchMock);
    await answerAll();
    expect(document.body.textContent).toContain('Google');
    await click('submit');
    expect(document.querySelector('[role="status"]')?.textContent).toContain('preparando');
    expect(document.querySelector('[data-action="submit"]')).toBeNull();
    resolve(new Response(JSON.stringify({ ...resultado, avaliacao: { ...resultado.avaliacao, resumo: '<img src=x onerror=alert(1)>' } })));
    await settle();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(document.body.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(document.querySelector('img[src="x"]')).toBeNull();
    for (const label of ['Pontos positivos', 'Pontos de atenção', 'Próximos passos']) {
      expect(document.body.textContent).toContain(label);
    }
    await click('review');
    expect(document.querySelector<HTMLInputElement>('input[value="pequeno"]')?.checked).toBe(true);
    expect(document.querySelector('[data-screen="result"]')).toBeNull();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('omite blocos vazios e permite recomeçar sem respostas anteriores', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response(JSON.stringify({
      ...resultado, avaliacao: { ...resultado.avaliacao, pontosPositivos: [], pontosDeAtencao: [] },
    }))));
    await answerAll();
    await click('submit');
    await settle();
    expect(document.body.textContent).not.toContain('Pontos positivos');
    expect(document.body.textContent).not.toContain('Pontos de atenção');
    await click('restart');
    await click('start');
    expect(document.querySelector('input:checked')).toBeNull();
  });

  it('mostra erro acessível e tenta novamente somente por ação do usuário', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(resultado)));
    vi.stubGlobal('fetch', fetchMock);
    await answerAll();
    await click('submit');
    await vi.waitFor(() => expect(document.querySelector('[role="alert"]')?.textContent).toContain('indisponível'));
    expect(fetchMock).toHaveBeenCalledOnce();
    await click('retry');
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
