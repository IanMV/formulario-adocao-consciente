export const questions = [
  {
    id: 'porte', category: 'Um novo companheiro', symbol: '♡',
    title: 'Qual porte de animal você pretende adotar?',
    hint: 'Pense no animal que você imagina acolher. Cada um tem suas próprias necessidades.',
    options: [
      { value: 'pequeno', label: 'Pequeno' },
      { value: 'medio', label: 'Médio' },
      { value: 'grande', label: 'Grande' },
    ],
  },
  {
    id: 'orcamentoMensal', category: 'Planejamento financeiro', symbol: '$',
    title: 'Quanto você consegue disponibilizar mensalmente para os cuidados do animal?',
    hint: 'Considere alimentação, higiene e os cuidados de rotina. Não é uma avaliação da sua renda.',
    options: [
      { value: 'menos_de_150', label: 'Menos de R$ 150' },
      { value: 'entre_150_e_300', label: 'Entre R$ 150 e R$ 300' },
      { value: 'entre_300_e_500', label: 'Entre R$ 300 e R$ 500' },
      { value: 'mais_de_500', label: 'Mais de R$ 500' },
    ],
  },
  {
    id: 'cuidadosVeterinarios', category: 'Saúde e cuidado', symbol: '+',
    title: 'Você teria condições de pagar consultas, vacinas e possíveis emergências veterinárias?',
    hint: 'Imprevistos também fazem parte do cuidado. Responda pensando no seu momento atual.',
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'talvez_dependendo_do_valor', label: 'Talvez, dependendo do valor' },
      { value: 'nao_no_momento', label: 'Não no momento' },
    ],
  },
  {
    id: 'tempoDiario', category: 'Tempo de qualidade', symbol: '◷',
    title: 'Quanto tempo por dia você teria disponível para cuidar do animal?',
    hint: 'Inclua os cuidados, a interação e a atenção que cabem na sua rotina.',
    options: [
      { value: 'mais_de_4_horas', label: 'Mais de 4 horas' },
      { value: 'entre_2_e_4_horas', label: 'Entre 2 e 4 horas' },
      { value: 'menos_de_2_horas', label: 'Menos de 2 horas' },
    ],
  },
  {
    id: 'moradia', category: 'Um lar seguro', symbol: '⌂',
    title: 'Sua residência possui espaço e segurança adequados para o animal?',
    hint: 'Um lar seguro depende das necessidades da espécie e das adaptações do ambiente.',
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'parcialmente', label: 'Parcialmente' },
      { value: 'nao', label: 'Não' },
    ],
  },
  {
    id: 'concordanciaFamiliar', category: 'Uma decisão compartilhada', symbol: '♡',
    title: 'Todas as pessoas que moram com você concordam com a adoção?',
    hint: 'A chegada de um animal transforma a rotina de toda a casa.',
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'ainda_precisamos_conversar', label: 'Ainda precisamos conversar' },
      { value: 'nao', label: 'Não' },
    ],
  },
  {
    id: 'redeDeApoio', category: 'Uma rede de carinho', symbol: '✳',
    title: 'Você possui alguém de confiança para cuidar do animal quando precisar viajar ou se ausentar?',
    hint: 'Ter com quem contar ajuda a manter os cuidados mesmo quando você não está por perto.',
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'talvez', label: 'Talvez' },
      { value: 'nao', label: 'Não' },
    ],
  },
  {
    id: 'compromissoVitalicio', category: 'Por toda uma vida', symbol: '∞',
    title: 'Você está preparado para assumir a responsabilidade pelo animal durante toda a vida dele?',
    hint: 'Tudo bem ter dúvidas. Este é um espaço para olhar com honestidade para um compromisso duradouro.',
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'ainda_tenho_duvidas', label: 'Ainda tenho algumas dúvidas' },
      { value: 'nao_tenho_certeza', label: 'Não tenho certeza' },
    ],
  },
] as const;
