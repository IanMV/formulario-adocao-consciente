import type { questions } from '../data/questions';

export type Question = typeof questions[number];
export type Respostas = { [Q in Question as Q['id']]: Q['options'][number]['value'] };

export interface Resultado {
  avaliacao: {
    resumo: string;
    pontosPositivos: string[];
    pontosDeAtencao: string[];
    proximosPassos: string[];
  };
  aviso: string;
}
