import { computed, ref } from 'vue';
import { questions } from '../data/questions';
import { solicitarAvaliacao } from '../services/assessmentApi';
import type { Respostas, Resultado } from '../types/assessment';

type Screen = 'intro' | 'questions' | 'loading' | 'result' | 'error';

export function useAssessment(request = solicitarAvaliacao) {
  const screen = ref<Screen>('intro');
  const index = ref(0);
  const answers = ref<Partial<Respostas>>({});
  const result = ref<Resultado | null>(null);
  const error = ref('');
  const consent = ref(false);
  const question = computed(() => questions[index.value]!);
  const selected = computed(() => answers.value[question.value.id]);
  const isLast = computed(() => index.value === questions.length - 1);
  let requestVersion = 0;
  let controller: AbortController | null = null;

  function start() { screen.value = 'questions'; }
  function select(value: string) {
    if (screen.value !== 'questions' || !question.value.options.some((option) => option.value === value)) return;
    answers.value = { ...answers.value, [question.value.id]: value };
    result.value = null;
  }
  function next() {
    if (screen.value === 'questions' && selected.value && !isLast.value) index.value++;
  }
  function back() {
    if (screen.value !== 'questions') return;
    if (index.value > 0) index.value--;
    else screen.value = 'intro';
  }
  async function submit() {
    if (!['questions', 'error'].includes(screen.value)) return;
    if (!consent.value) return;
    if (!questions.every((item) => item.options.some((option) => option.value === answers.value[item.id]))) return;
    screen.value = 'loading';
    error.value = '';
    result.value = null;
    const version = ++requestVersion;
    controller = new AbortController();
    try {
      const response = await request({ ...answers.value } as Respostas, consent.value, controller.signal);
      if (version !== requestVersion) return;
      result.value = response;
      screen.value = 'result';
    } catch (failure) {
      if (version !== requestVersion) return;
      error.value = failure instanceof Error ? failure.message : 'Ocorreu um imprevisto. Tente novamente.';
      screen.value = 'error';
    } finally {
      if (version === requestVersion) controller = null;
    }
  }
  function review() {
    if (!['result', 'error'].includes(screen.value)) return;
    result.value = null;
    error.value = '';
    index.value = 0;
    screen.value = 'questions';
  }
  function restart() {
    requestVersion++;
    controller?.abort();
    controller = null;
    answers.value = {};
    result.value = null;
    error.value = '';
    index.value = 0;
    screen.value = 'intro';
    consent.value = false;
  }
  return { screen, index, answers, result, error, consent, question, selected, isLast, start, select, next, back, submit, review, restart };
}
