import { Router } from 'express';
import { entradaSchema } from './schema.js';
import { criarServicoAvaliacao, type GerarAvaliacao } from './service.js';

export function criarRotaAvaliacao(gerar: GerarAvaliacao) {
  const router = Router();
  const avaliar = criarServicoAvaliacao(gerar);
  router.post('/', async (req, res) => {
    const result = entradaSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ erro: {
        codigo: 'RESPOSTAS_INVALIDAS',
        mensagem: 'Preencha as oito respostas com as opções permitidas, sem campos adicionais.',
        campos: [...new Set(result.error.issues.flatMap((issue) =>
          issue.code === 'unrecognized_keys'
            ? issue.keys.map((key) => [...issue.path, key].join('.'))
            : [issue.path.join('.') || 'respostas'],
        ))],
      } });
      return;
    }
    res.json(await avaliar(result.data.respostas));
  });
  return router;
}
