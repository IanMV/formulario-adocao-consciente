import type { Avaliacao, Respostas } from '../src/avaliacao/schema.js';

export const respostas: Respostas = {
  porte: 'pequeno',
  orcamentoMensal: 'entre_150_e_300',
  cuidadosVeterinarios: 'sim',
  tempoDiario: 'entre_2_e_4_horas',
  moradia: 'parcialmente',
  concordanciaFamiliar: 'sim',
  redeDeApoio: 'talvez',
  compromissoVitalicio: 'sim',
};

export const avaliacao: Avaliacao = {
  resumo: 'Planeje os cuidados conforme as necessidades do animal.',
  pontosPositivos: ['Você considera o compromisso de longo prazo.'],
  pontosDeAtencao: ['A segurança da moradia precisa ser revisada.'],
  proximosPassos: ['Converse com um veterinário sobre os cuidados necessários.'],
};
