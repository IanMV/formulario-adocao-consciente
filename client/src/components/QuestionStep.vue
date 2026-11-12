<script setup lang="ts">
import type { Question } from '../types/assessment';
import ProgressBar from './ProgressBar.vue';

defineProps<{ question: Question; index: number; total: number; selected?: string; isLast: boolean; consent: boolean; busy: boolean }>();
defineEmits<{ select: [value: string]; next: []; back: []; submit: []; consent: [value: boolean] }>();
</script>

<template>
  <form class="question-card" :class="{ 'is-last': isLast }" data-screen="questions" @submit.prevent="!busy && (isLast ? $emit('submit') : $emit('next'))">
    <ProgressBar :current="index + 1" :total="total" />
    <div class="question-category"><span aria-hidden="true">{{ question.symbol }}</span>{{ question.category }}</div>
    <h1 id="question-title" tabindex="-1" data-focus>{{ question.title }}</h1>
    <p id="question-hint" class="question-hint">{{ question.hint }}</p>
    <fieldset class="options" :disabled="busy" aria-labelledby="question-title" aria-describedby="question-hint">
      <label v-for="option in question.options" :key="option.value" class="option" :class="{ 'is-selected': selected === option.value }">
        <input :id="`${question.id}-${option.value}`" type="radio" :name="question.id" :value="option.value" :checked="selected === option.value" required @change="$emit('select', option.value)" />
        <span class="option-text">{{ option.label }}</span>
        <span class="radio-mark" aria-hidden="true"><span v-if="selected === option.value">✓</span></span>
      </label>
    </fieldset>
    <div v-if="isLast" class="privacy-note">
      <p>As respostas vão ao Google, que pode usá-las para melhorar seus produtos. Não salvamos histórico.</p>
      <label class="consent-control">
        <input type="checkbox" name="aceiteTermos" :checked="consent" :disabled="busy" required @change="$emit('consent', ($event.target as HTMLInputElement).checked)" />
        <span>Li o aviso e os <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer">termos da Gemini API<span class="sr-only"> (abre em nova aba)</span></a> e concordo com o envio das respostas.</span>
      </label>
    </div>
    <div class="question-actions">
      <button class="button button-back" type="button" :disabled="busy" data-action="back" @click="$emit('back')"><span aria-hidden="true">←</span> Voltar</button>
      <button class="button button-primary" type="submit" :disabled="busy || !selected || (isLast && !consent)" :data-action="isLast ? 'submit' : 'next'">
        {{ isLast ? 'Receber orientações' : 'Continuar' }} <span aria-hidden="true">→</span>
      </button>
    </div>
    <p class="step-caption">Não existe resposta perfeita. Existe a sua realidade.</p>
  </form>
</template>
