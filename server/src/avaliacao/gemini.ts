import { GoogleGenAI, type GenerateContentParameters, type GenerateContentResponse } from '@google/genai';
import { z } from 'zod';
import { avaliacaoSchema, descreverRespostas } from './schema.js';
import { AvaliacaoError, type GerarAvaliacao } from './service.js';

export const INSTRUCOES = `Você oferece uma reflexão educativa sobre adoção consciente de animais.
Escreva em português brasileiro, de forma acolhedora, clara e prática, com aproximadamente 200–350 palavras no total.
Baseie-se somente nas oito respostas fornecidas. Não presuma espécie, idade, saúde ou fatos não informados.
Não dê notas, aprovação, reprovação, classificação de aptidão ou um veredito sobre poder adotar.
Não julgue a pessoa por sua renda nem conclua capacidade de cuidado apenas pelo orçamento, porte ou tempo diário.
Não faça diagnósticos, prescrições ou estimativas garantidas de custos. Não substitua orientação veterinária.
Considere segurança da moradia, diálogo familiar, emergências, rede de apoio e compromisso de longo prazo.
Apresente resumo, pontos positivos reais, pontos de atenção e próximos passos concretos.
Listas de pontos positivos e de atenção podem ficar vazias: não invente qualidades ou problemas para preenchê-las.
Sempre inclua ao menos um próximo passo. Não repita todas as respostas e não use HTML ou Markdown.
Lembre que necessidades específicas dependem da espécie e das características individuais do animal.`;

type GenerateContent = (params: GenerateContentParameters) => Promise<GenerateContentResponse>;

export function criarGemini(
  config: { GEMINI_API_KEY: string; GEMINI_MODEL: string },
  dependencies: { generateContent?: GenerateContent; timeoutMs?: number } = {},
): GerarAvaliacao {
  const client = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
  const generateContent = dependencies.generateContent ?? ((params) => client.models.generateContent(params));
  const timeoutMs = dependencies.timeoutMs ?? 30_000;

  return async (respostas) => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const deadline = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new AvaliacaoError('IA_TEMPO_EXCEDIDO'));
          controller.abort();
        }, timeoutMs);
      });
      const response = await Promise.race([
        generateContent({
          model: config.GEMINI_MODEL,
          contents: JSON.stringify(descreverRespostas(respostas)),
          config: {
            systemInstruction: INSTRUCOES,
            responseMimeType: 'application/json',
            responseJsonSchema: z.toJSONSchema(avaliacaoSchema),
            abortSignal: controller.signal,
            httpOptions: { timeout: timeoutMs, retryOptions: { attempts: 1 } },
          },
        }),
        deadline,
      ]);
      const candidate = response.candidates?.[0];
      if (response.promptFeedback?.blockReason || (candidate?.finishReason && candidate.finishReason !== 'STOP')) {
        throw new AvaliacaoError('IA_RESPOSTA_INVALIDA');
      }
      try {
        if (!response.text) throw new Error('empty');
        return JSON.parse(response.text) as unknown;
      } catch {
        throw new AvaliacaoError('IA_RESPOSTA_INVALIDA');
      }
    } catch (error) {
      if (error instanceof AvaliacaoError) throw error;
      const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
      if (controller.signal.aborted || status === 408 || status === 504 || (error instanceof Error && ['AbortError', 'TimeoutError'].includes(error.name))) {
        throw new AvaliacaoError('IA_TEMPO_EXCEDIDO');
      }
      throw new AvaliacaoError('IA_INDISPONIVEL');
    } finally {
      clearTimeout(timer);
    }
  };
}
