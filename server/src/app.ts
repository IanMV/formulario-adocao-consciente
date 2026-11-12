import express, { type ErrorRequestHandler } from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { criarRotaAvaliacao } from './avaliacao/route.js';
import { AvaliacaoError, type GerarAvaliacao } from './avaliacao/service.js';

export function createApp(options: { gerarAvaliacao: GerarAvaliacao; staticDir?: string }) {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });
  app.use(express.json({ limit: '8kb' }));
  app.get('/api/health', (_req, res) => { res.json({ status: 'ok' }); });
  app.use('/api/avaliacao', criarRotaAvaliacao(options.gerarAvaliacao));
  app.use('/api', (_req, res) => {
    res.status(404).json({ erro: { codigo: 'ROTA_NAO_ENCONTRADA', mensagem: 'Rota não encontrada.' } });
  });

  if (options.staticDir) {
    const staticDir = path.resolve(options.staticDir);
    app.use(express.static(staticDir));
    app.get('/', (_req, res, next) => {
      if (existsSync(path.join(staticDir, 'index.html'))) res.sendFile(path.join(staticDir, 'index.html'));
      else next();
    });
  }
  app.use((_req, res) => {
    res.status(404).json({ erro: { codigo: 'ROTA_NAO_ENCONTRADA', mensagem: 'Rota não encontrada.' } });
  });

  const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    if (res.headersSent) { _next(error); return; }
    if (error instanceof AvaliacaoError) {
      const failures = {
        IA_RESPOSTA_INVALIDA: [502, 'Não foi possível interpretar a avaliação. Tente novamente.'],
        IA_INDISPONIVEL: [503, 'A avaliação está indisponível ou sem cota. Tente novamente mais tarde.'],
        IA_TEMPO_EXCEDIDO: [504, 'A avaliação demorou mais que o esperado. Tente novamente.'],
      } as const;
      const [status, mensagem] = failures[error.code];
      res.status(status).json({ erro: { codigo: error.code, mensagem } });
      return;
    }
    const type = typeof error === 'object' && error !== null && 'type' in error ? error.type : undefined;
    if (type === 'entity.too.large') {
      res.status(413).json({ erro: { codigo: 'CORPO_MUITO_GRANDE', mensagem: 'O conteúdo enviado excede o tamanho permitido.' } });
    } else if (type === 'entity.parse.failed') {
      res.status(400).json({ erro: { codigo: 'JSON_INVALIDO', mensagem: 'Envie um corpo JSON válido.' } });
    } else if (type === 'charset.unsupported' || type === 'encoding.unsupported') {
      res.status(415).json({ erro: { codigo: 'FORMATO_NAO_SUPORTADO', mensagem: 'Use JSON com codificação UTF-8.' } });
    } else {
      res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: 'Não foi possível concluir a avaliação. Tente novamente.' } });
    }
  };
  app.use(errorHandler);
  return app;
}
