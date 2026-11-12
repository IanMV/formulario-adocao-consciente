<script setup lang="ts">
import type { Question } from '../types/assessment';
import ProgressBar from './ProgressBar.vue';

defineProps<{ question: Question; index: number; total: number; selected?: string; isLast: boolean; consent: boolean }>();
defineEmits<{ select: [value: string]; next: []; back: []; submit: []; consent: [value: boolean] }>();
</script>

<template>
  <form class="question-card" data-screen="questions" @submit.prevent="isLast ? $emit('submit') : $emit('next')">
    <ProgressBar :current="index + 1" :total="total" />
    <div class="question-category"><span aria-hidden="true">{{ question.symbol }}</span>{{ question.category }}</div>
    <h1 id="question-title" tabindex="-1" data-focus>{{ question.title }}</h1>
    <p id="question-hint" class="question-hint">{{ question.hint }}</p>
    <fieldset class="options" aria-labelledby="question-title" aria-describedby="question-hint">
      <label v-for="(option, optionIndex) in question.options" :key="option.value" class="option" :class="{ 'is-selected': selected === option.value }">
        <input :id="`${question.id}-${option.value}`" type="radio" :name="question.id" :value="option.value" :checked="selected === option.value" required @change="$emit('select', option.value)" />
        <span class="option-letter" aria-hidden="true">{{ String.fromCharCode(65 + optionIndex) }}</span>
        <span class="option-text">{{ option.label }}</span>
        <span class="radio-mark" aria-hidden="true"><span v-if="selected === option.value">✓</span></span>
      </label>
    </fieldset>
    <div v-if="isLast" class="privacy-note">
      <strong>Antes de enviar</strong>
      <p>Suas respostas serão enviadas à IA do Google para gerar uma reflexão educativa. No serviço gratuito, o Google pode usá-las para melhorar seus produtos. Não coletamos nome ou contato nem salvamos um histórico.</p>
      <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer">Termos da Gemini API <span class="sr-only">(abre em nova aba)</span><span aria-hidden="true">↗</span></a>
      <label class="consent-control">
        <input type="checkbox" name="aceiteTermos" :checked="consent" required @change="$emit('consent', ($event.target as HTMLInputElement).checked)" />
        <span>Li o aviso e os termos da Gemini API e concordo com o envio das minhas respostas.</span>
      </label>
    </div>
    <div class="question-actions">
      <button class="button button-back" type="button" data-action="back" @click="$emit('back')"><span aria-hidden="true">←</span> Voltar</button>
      <button class="button button-primary" type="submit" :disabled="!selected || (isLast && !consent)" :data-action="isLast ? 'submit' : 'next'">
        {{ isLast ? 'Receber orientações' : 'Continuar' }} <span aria-hidden="true">→</span>
      </button>
    </div>
    <p class="step-caption">Não existe resposta perfeita. Existe a sua realidade.</p>
  </form>
</template>
