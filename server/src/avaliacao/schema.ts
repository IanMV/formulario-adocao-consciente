import { z } from 'zod';

// Identificadores públicos do contrato, na mesma ordem das perguntas do README.
export const respostasSchema = z.strictObject({
  porte: z.enum(['pequeno', 'medio', 'grande']),
  orcamentoMensal: z.enum(['menos_de_150', 'entre_150_e_300', 'entre_300_e_500', 'mais_de_500']),
  cuidadosVeterinarios: z.enum(['sim', 'talvez_dependendo_do_valor', 'nao_no_momento']),
  tempoDiario: z.enum(['mais_de_4_horas', 'entre_2_e_4_horas', 'menos_de_2_horas']),
  moradia: z.enum(['sim', 'parcialmente', 'nao']),
  concordanciaFamiliar: z.enum(['sim', 'ainda_precisamos_conversar', 'nao']),
  redeDeApoio: z.enum(['sim', 'talvez', 'nao']),
  compromissoVitalicio: z.enum(['sim', 'ainda_tenho_duvidas', 'nao_tenho_certeza']),
});

export const entradaSchema = z.strictObject({ respostas: respostasSchema });
const texto = z.string().trim().min(1).max(3000);
export const avaliacaoSchema = z.strictObject({
  resumo: texto,
  pontosPositivos: z.array(texto).max(8),
  pontosDeAtencao: z.array(texto).max(8),
  proximosPassos: z.array(texto).min(1).max(8),
});

export type Respostas = z.infer<typeof respostasSchema>;
export type Avaliacao = z.infer<typeof avaliacaoSchema>;

export const AVISO = 'Esta reflexão é educativa e não substitui orientação profissional. As necessidades variam conforme a espécie e as características de cada animal.';

export const opcoes = {
  porte: { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande' },
  orcamentoMensal: { menos_de_150: 'Menos de R$ 150', entre_150_e_300: 'Entre R$ 150 e R$ 300', entre_300_e_500: 'Entre R$ 300 e R$ 500', mais_de_500: 'Mais de R$ 500' },
  cuidadosVeterinarios: { sim: 'Sim', talvez_dependendo_do_valor: 'Talvez, dependendo do valor', nao_no_momento: 'Não no momento' },
  tempoDiario: { mais_de_4_horas: 'Mais de 4 horas', entre_2_e_4_horas: 'Entre 2 e 4 horas', menos_de_2_horas: 'Menos de 2 horas' },
  moradia: { sim: 'Sim', parcialmente: 'Parcialmente', nao: 'Não' },
  concordanciaFamiliar: { sim: 'Sim', ainda_precisamos_conversar: 'Ainda precisamos conversar', nao: 'Não' },
  redeDeApoio: { sim: 'Sim', talvez: 'Talvez', nao: 'Não' },
  compromissoVitalicio: { sim: 'Sim', ainda_tenho_duvidas: 'Ainda tenho algumas dúvidas', nao_tenho_certeza: 'Não tenho certeza' },
} satisfies { [K in keyof Respostas]: Record<Respostas[K], string> };

export const perguntas: Record<keyof Respostas, string> = {
  porte: 'Qual porte de animal você pretende adotar?',
  orcamentoMensal: 'Quanto você consegue disponibilizar mensalmente para os cuidados do animal?',
  cuidadosVeterinarios: 'Você teria condições de pagar consultas, vacinas e possíveis emergências veterinárias?',
  tempoDiario: 'Quanto tempo por dia você teria disponível para cuidar do animal?',
  moradia: 'Sua residência possui espaço e segurança adequados para o animal?',
  concordanciaFamiliar: 'Todas as pessoas que moram com você concordam com a adoção?',
  redeDeApoio: 'Você possui alguém de confiança para cuidar do animal quando precisar viajar ou se ausentar?',
  compromissoVitalicio: 'Você está preparado para assumir a responsabilidade pelo animal durante toda a vida dele?',
};

export function descreverRespostas(respostas: Respostas) {
  return (Object.keys(perguntas) as (keyof Respostas)[]).map((campo) => ({
    pergunta: perguntas[campo],
    resposta: (opcoes[campo] as Record<string, string>)[respostas[campo]],
  }));
}
