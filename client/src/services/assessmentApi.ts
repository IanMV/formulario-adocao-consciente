import { z } from 'zod';
import type { Respostas, Resultado } from '../types/assessment';

const texto = z.string().trim().min(1).max(3000);
const resultadoSchema = z.object({
  avaliacao: z.object({
    resumo: texto,
    pontosPositivos: z.array(texto).max(8),
    pontosDeAtencao: z.array(texto).max(8),
    proximosPassos: z.array(texto).min(1).max(8),
  }),
  aviso: texto,
});

const mensagens: Record<number, string> = {
  400: 'Não foi possível enviar suas respostas. Revise as opções e tente novamente.',
  413: 'Não foi possível enviar o formulário. Recarregue a página se o problema persistir.',
  500: 'Ocorreu um imprevisto no servidor. Suas respostas estão aqui; tente novamente.',
  502: 'Não foi possível preparar uma avaliação válida. Tente novamente.',
  503: 'A avaliação está temporariamente indisponível ou sem cota. Tente novamente mais tarde.',
  504: 'A avaliação demorou mais que o esperado. Tente novamente.',
};

export async function solicitarAvaliacao(respostas: Respostas): Promise<Resultado> {
  let response: Response;
  try {
    response = await fetch('/api/avaliacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respostas }),
      signal: AbortSignal.timeout(40_000),
    });
  } catch (error) {
    const name = typeof error === 'object' && error !== null && 'name' in error ? error.name : undefined;
    if (name === 'TimeoutError' || name === 'AbortError') {
      throw new Error('A conexão demorou mais que o esperado. Tente novamente.');
    }
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
  }
  if (!response.ok) throw new Error(mensagens[response.status] ?? 'A avaliação está indisponível no momento. Tente novamente mais tarde.');
  try {
    return resultadoSchema.parse(await response.json());
  } catch {
    throw new Error('Não recebemos uma resposta válida. Tente novamente.');
  }
}
