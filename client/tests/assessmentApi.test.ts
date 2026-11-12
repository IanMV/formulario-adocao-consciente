import { afterEach, describe, expect, it, vi } from 'vitest';
import { solicitarAvaliacao } from '../src/services/assessmentApi';
import { respostas, resultado } from './fixtures';

afterEach(() => vi.unstubAllGlobals());

describe('cliente da avaliação', () => {
  it('envia identificadores ao endpoint da mesma origem', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(resultado)));
    vi.stubGlobal('fetch', fetchMock);
    expect(await solicitarAvaliacao(respostas, true)).toEqual(resultado);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('/api/avaliacao', expect.objectContaining({
      method: 'POST', body: JSON.stringify({ respostas, aceiteTermos: true }),
      headers: { 'Content-Type': 'application/json' },
    }));
  });

  it.each([400, 413, 500, 502, 503, 504])('usa mensagem segura para HTTP %s', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"erro":{"mensagem":"<script>segredo</script>"}}', { status })));
    await expect(solicitarAvaliacao(respostas, true)).rejects.toThrow(/./);
    await expect(solicitarAvaliacao(respostas, true)).rejects.not.toThrow(/segredo|script/);
  });

  it('rejeita HTML e resultados incompletos', async () => {
    for (const body of ['<html>Serviço iniciando</html>', '{}', JSON.stringify({ ...resultado, avaliacao: { resumo: 'incompleto' } })]) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body)));
      await expect(solicitarAvaliacao(respostas, true)).rejects.toThrow(/resposta válida/i);
    }
  });

  it('diferencia falha de conexão de erro interno do servidor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    await expect(solicitarAvaliacao(respostas, true)).rejects.toThrow(/conexão/i);
  });

  it('trata timeout sem repetir a solicitação', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new DOMException('timeout', 'TimeoutError'));
    vi.stubGlobal('fetch', fetchMock);
    await expect(solicitarAvaliacao(respostas, true)).rejects.toThrow(/demorou/i);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('não envia sem aceite', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(solicitarAvaliacao(respostas, false)).rejects.toThrow(/aceite/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
