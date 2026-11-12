import { avaliacaoSchema, AVISO, type Respostas } from './schema.js';

export class AvaliacaoError extends Error {
  constructor(public readonly code: 'IA_RESPOSTA_INVALIDA' | 'IA_INDISPONIVEL' | 'IA_TEMPO_EXCEDIDO') {
    super(code);
  }
}

export type GerarAvaliacao = (respostas: Respostas) => Promise<unknown>;

export function criarServicoAvaliacao(gerar: GerarAvaliacao) {
  return async (respostas: Respostas) => {
    const result = avaliacaoSchema.safeParse(await gerar(respostas));
    if (!result.success) throw new AvaliacaoError('IA_RESPOSTA_INVALIDA');
    return { avaliacao: result.data, aviso: AVISO };
  };
}
