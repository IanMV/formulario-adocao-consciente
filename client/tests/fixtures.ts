import type { Respostas, Resultado } from '../src/types/assessment';

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

export const resultado: Resultado = {
  avaliacao: {
    resumo: 'Cada adoção começa com planejamento e cuidado.',
    pontosPositivos: ['Você considera o compromisso de longo prazo.'],
    pontosDeAtencao: ['Prepare a segurança da sua moradia.'],
    proximosPassos: ['Converse com um veterinário.'],
  },
  aviso: 'Esta reflexão é educativa. As necessidades variam conforme a espécie.',
};
