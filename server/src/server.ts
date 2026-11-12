import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { criarGemini } from './avaliacao/gemini.js';

try {
  const config = loadConfig();
  // Mesmo caminho tanto no código-fonte quanto em dist/server/.
  const staticDir = fileURLToPath(new URL('../../client/dist/', import.meta.url));
  const app = createApp({ gerarAvaliacao: criarGemini(config), staticDir });
  const server = app.listen(config.PORT, '0.0.0.0', () => {
    console.info(`Backend disponível na porta ${config.PORT}.`);
  });
  server.on('error', () => {
    console.error('Não foi possível iniciar o servidor HTTP. Verifique a porta configurada.');
    process.exitCode = 1;
  });
} catch (error) {
  // Apenas erros de configuração controlados, nunca conteúdo do provedor.
  console.error(error instanceof Error && error.message.startsWith('Configuração')
    ? error.message : 'Não foi possível inicializar o backend. Verifique a configuração.');
  process.exitCode = 1;
}
