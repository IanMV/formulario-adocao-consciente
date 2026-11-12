<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import IntroScreen from './components/IntroScreen.vue';
import QuestionStep from './components/QuestionStep.vue';
import AssessmentResult from './components/AssessmentResult.vue';
import PetIllustration from './components/PetIllustration.vue';
import PawIcon from './components/PawIcon.vue';
import GitHubIcon from './components/GitHubIcon.vue';
import ExitDialog from './components/ExitDialog.vue';
import GraphicShape from './components/GraphicShape.vue';
import { useAssessment } from './composables/useAssessment';
import { questions } from './data/questions';

const { screen, index, result, error, consent, question, selected, isLast, start, select, next, back, submit, review, restart } = useAssessment();
const exitOpen = ref(false);
const brand = ref<HTMLButtonElement | null>(null);
const transitioning = ref(false);
const direction = ref<'forward' | 'backward'>('forward');
const stageHeight = ref(0);

function focusContent() {
  document.querySelector<HTMLElement>('[data-focus]')?.focus({ preventScroll: true });
}

function navigateNext() {
  if (transitioning.value || !selected.value || isLast.value) return;
  transitioning.value = true;
  direction.value = 'forward';
  next();
}

function navigateBack() {
  if (transitioning.value) return;
  transitioning.value = index.value > 0;
  direction.value = 'backward';
  back();
}

function beforeLeave(element: Element) {
  stageHeight.value = element.getBoundingClientRect().height;
}

function afterEnter() {
  transitioning.value = false;
  stageHeight.value = 0;
  if (screen.value === 'questions') focusContent();
}

function goHome() {
  if (screen.value === 'intro') document.querySelector<HTMLElement>('[data-focus]')?.focus();
  else exitOpen.value = true;
}

async function cancelExit() {
  exitOpen.value = false;
  await nextTick();
  brand.value?.focus();
}

async function confirmExit() {
  exitOpen.value = false;
  await nextTick();
  restart();
}

watch(screen, async () => {
  transitioning.value = false;
  stageHeight.value = 0;
  await nextTick();
  focusContent();
  window.scrollTo({ top: 0, behavior: 'instant' });
});
</script>

<template>
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <div class="site-shell" :class="`screen-${screen}`">
    <header class="site-header">
      <button ref="brand" class="brand" type="button" data-action="home" aria-label="Adoção Consciente — voltar ao início" @click="goHome"><span class="brand-icon"><PawIcon /></span><span>Adoção <br /><strong>Consciente<span class="brand-dot">.</span></strong></span></button>
      <span class="header-note"><span aria-hidden="true">♡</span> MAIS CUIDADO. MENOS ABANDONO.</span>
      <a class="source-link" href="https://github.com/IanMV/formulario-adocao-consciente" target="_blank" rel="noopener noreferrer" aria-label="Código-fonte no GitHub (abre em nova aba)"><GitHubIcon /><span>Código-fonte</span><span aria-hidden="true">↗</span></a>
    </header>

    <main id="conteudo" tabindex="-1">
      <IntroScreen v-if="screen === 'intro'" @start="start" />

      <div v-else-if="screen === 'questions' || screen === 'loading' || screen === 'error'" class="assessment-layout">
        <aside class="assessment-aside">
          <GraphicShape class="aside-heart" kind="heart" />
          <span class="eyebrow">ANTES DE ADOTAR, VAMOS CONVERSAR?</span>
          <h2>Um pouquinho de<br />reflexão. <em>Uma vida<br />inteira de cuidado.</em></h2>
          <PetIllustration />
          <GraphicShape class="aside-ribbon" kind="ribbon" />
          <p>Amar é importante.<br /><strong>Estar presente também.</strong></p>
          <span class="aside-footnote">Sem nota. Sem julgamento.<br />Cada resposta é um começo.</span>
        </aside>

        <div v-if="screen === 'questions'" class="question-stage" :aria-busy="transitioning" :style="stageHeight ? { minHeight: `${stageHeight}px` } : undefined">
          <GraphicShape class="step-star" kind="star" />
          <Transition :name="`step-${direction}`" mode="out-in" @before-leave="beforeLeave" @after-enter="afterEnter" @enter-cancelled="afterEnter">
            <QuestionStep :key="index" :question="question" :index="index" :total="questions.length" :selected="selected" :is-last="isLast" :consent="consent" :busy="transitioning" @consent="consent = $event" @select="select" @next="navigateNext" @back="navigateBack" @submit="submit" />
          </Transition>
        </div>

        <section v-else-if="screen === 'loading'" class="state-card" data-screen="loading">
          <span class="loading-paw"><PawIcon /></span>
          <span class="eyebrow">UM INSTANTE DE CUIDADO</span>
          <h1 tabindex="-1" data-focus>Vamos olhar para<br />suas respostas.</h1>
          <p role="status">Estamos preparando sua reflexão com carinho e responsabilidade.</p>
          <span class="loading-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <p class="state-caption">Pode levar alguns segundos.<br />Não feche esta página.</p>
        </section>

        <section v-else class="state-card error-card" data-screen="error">
          <span class="error-symbol" aria-hidden="true">↻</span>
          <span class="eyebrow">UMA PAUSA NO CAMINHO</span>
          <h1 tabindex="-1" data-focus>Não conseguimos<br />concluir agora.</h1>
          <p role="alert">{{ error }}</p>
          <p class="state-caption">Suas respostas continuam preenchidas.</p>
          <button class="button button-primary" data-action="retry" @click="submit">Tentar novamente <span aria-hidden="true">↗</span></button>
          <button class="button button-back" data-action="review" @click="review">Revisar respostas</button>
        </section>
      </div>

      <AssessmentResult v-else-if="screen === 'result' && result" :result="result" @review="review" @restart="restart" />
    </main>

    <footer class="site-footer"><span>Feito para incentivar escolhas conscientes.</span><span>Um pequeno passo por quem depende de nós. <span aria-hidden="true">♡</span></span></footer>
  </div>
  <ExitDialog :open="exitOpen" :loading="screen === 'loading'" @cancel="cancelExit" @confirm="confirmExit" />
</template>
