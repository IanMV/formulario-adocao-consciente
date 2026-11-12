<script setup lang="ts">
import type { Resultado } from '../types/assessment';
import PawIcon from './PawIcon.vue';

defineProps<{ result: Resultado }>();
defineEmits<{ review: []; restart: [] }>();
</script>

<template>
  <section class="result-page" data-screen="result">
    <div class="result-heading">
      <span class="result-seal"><PawIcon /></span>
      <span class="eyebrow">UM PASSO IMPORTANTE: REFLETIR</span>
      <h1 tabindex="-1" data-focus>Cuidado começa<br />com <em>consciência.</em></h1>
      <p>Não é um veredito. É um ponto de partida para planejar uma adoção responsável.</p>
    </div>
    <div class="result-summary"><span class="eyebrow">SUA REFLEXÃO</span><p>{{ result.avaliacao.resumo }}</p></div>
    <div class="result-grid">
      <section v-if="result.avaliacao.pontosPositivos.length" class="result-block positive">
        <span class="block-symbol" aria-hidden="true">✳</span><h2>Pontos positivos</h2>
        <ul><li v-for="(item, index) in result.avaliacao.pontosPositivos" :key="index">{{ item }}</li></ul>
      </section>
      <section v-if="result.avaliacao.pontosDeAtencao.length" class="result-block attention">
        <span class="block-symbol" aria-hidden="true">☀</span><h2>Pontos de atenção</h2>
        <ul><li v-for="(item, index) in result.avaliacao.pontosDeAtencao" :key="index">{{ item }}</li></ul>
      </section>
      <section class="result-block next-steps">
        <span class="block-symbol" aria-hidden="true">↗</span><h2>Próximos passos</h2>
        <ol><li v-for="(item, index) in result.avaliacao.proximosPassos" :key="index">{{ item }}</li></ol>
      </section>
    </div>
    <p class="result-disclaimer"><span aria-hidden="true">ⓘ</span> {{ result.aviso }} O conteúdo foi gerado por IA e pode conter imprecisões.</p>
    <div class="result-actions">
      <button class="button button-primary" data-action="review" @click="$emit('review')">Revisar respostas <span aria-hidden="true">↗</span></button>
      <button class="button button-secondary" data-action="restart" @click="$emit('restart')">Recomeçar</button>
    </div>
  </section>
</template>
