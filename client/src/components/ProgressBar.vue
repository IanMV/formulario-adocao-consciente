<script setup lang="ts">
defineProps<{ current: number; total: number }>();
</script>

<template>
  <div class="progress-wrap">
    <div class="progress-labels">
      <span>Pergunta {{ current }} de {{ total }}</span>
      <span class="progress-dots" aria-hidden="true"><i v-for="step in total" :key="step" :class="{ filled: step <= current }"></i></span>
    </div>
    <progress :value="current" :max="total" :aria-label="`Progresso: pergunta ${current} de ${total}`"></progress>
  </div>
</template>
